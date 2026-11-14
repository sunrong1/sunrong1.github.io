---
title: "K8s 落地手记：7 个服务、4 条主线、14 个坑"
icon: ship
date: 2026-11-14
update: 2026-11-14
categories:
  - 工程实践
  - 软件架构
tags:
  - Kubernetes
  - 架构设计
  - 工程化
  - 实践分享
author: Mr.Sun
star: true
public-safe: true
---

# K8s 落地手记：7 个服务、4 条主线、14 个坑

> **TL;DR**：我把自己搭的一套 Agent 平台底座搬上了 K8s —— PostgreSQL、Qdrant、Redis、Phoenix、Metabase、Grafana、AgentScope,7 个服务。真正花时间的不是写 YAML,而是搞清楚每个资源背后那条**约束**:状态怎么存、内存超了会怎样、流量从哪进、指标从哪看。这篇按「场景 → 样例 → 深入」把踩过的坑串一遍,附 14 条速查表。

<!-- more -->

## 一、场景：我想跑一套自己的 Agent 平台底座

先说清楚我为什么要碰 K8s,不然后面的取舍就没有坐标。

我在本地搭了一套 AI Agent 的实验环境,涉及 7 个服务：

| 服务 | 干什么 | 数据落在哪 |
|---|---|---|
| PostgreSQL | 业务库 + Agent 运行记录 + BI 元数据 | 本地 PG |
| Qdrant | 向量库 | 本地 Qdrant |
| Redis | 会话状态 / 消息总线 | 本地 Redis |
| Phoenix | LLM 调用链追踪 | PG |
| Metabase | 业务数据分析 | PG(元数据库) + 业务库(只读) |
| Grafana | 指标看板与告警 | 自己的 SQLite |
| AgentScope | Agent 框架本体 | Redis / PG / Qdrant |

一开始就是一台机器 + docker-compose,跑得好好的。真正推我上 K8s 的有三件事:

1. **要复现「节点挂了会怎样」**。docker-compose 里没有「Pod 被驱逐」「节点内存压力」「优雅停机超时」这些概念,而这些恰恰是我想验证的。
2. **要拿到一套能改的资源模型**。我需要能精确控制 memory limit、QoS、副本数、探针行为,然后观察系统反应。docker-compose 给不了这些。
3. **这些服务的行为差异,本身就是学习材料**。同一个 `Deployment` 和 `StatefulSet` 的选择,套在这 7 个服务上,答案完全不一样 —— 这比读文档印象深。

集群规模很小:**1 个控制节点 + 2 个工作节点**。没有高可用演练,没有多可用区。目标很朴素 —— **把每个服务的资源语义搞明白,而不是把集群做大**。

> 一句话:**我不是为了用 K8s 而上 K8s,是为了观察 K8s 的约束而上 K8s。**

## 二、样例：从零到跑起来,最短的四步

不管多复杂,一个微服务上集群就是这四步。先把最短路径跑通,再谈调优。

```bash
# 1. 编译
mvn -T 1C clean package -DskipTests

# 2. 构建镜像
docker build -t myapp:1.0.0 .

# 3. 导入节点的 containerd
#    ⚠️ 关键:必须显式指定 namespace,否则会撞上 namespace 冲突
ctr -n k8s.io images import myapp-1.0.0.tar

# 4. 部署
kubectl apply -f deploy.yaml
```

对应的 `deploy.yaml` 里有一行必须改:

```yaml
spec:
  containers:
    - name: myapp
      image: myapp:1.0.0
      imagePullPolicy: Never   # ⚠️ 私有仓库拉不到就得靠这个
```

⭐ 这四步里我踩过三个坑:

- **第 3 步忘了 `-n k8s.io`** → 导入报 namespace 冲突,或者导入到了 `default` 命名空间,集群根本看不到这个镜像。排查时用 `ctr -n k8s.io images ls | grep myapp` 确认。
- **`imagePullPolicy` 默认是 `Always`**(只要 tag 不是 `latest`)。集群会去远端仓库拉,而我的镜像只在本机 containerd 里 → `ErrImagePull`。要么改成 `Never`,要么用 `imagePullSecrets`。
- **JDK 镜像选型**:`jre-alpine` 是 musl libc,Netty 的原生库在 glibc 上编译的,放进去会 `UnsatisfiedLinkError`。要么换 `eclipse-temurin`(glibc),要么自己编 musl 版本。**镜像小 200MB 不值得换掉一个排查半天的问题。**

跑通之后,真正花时间的部分才开始 —— 下面 4 条主线。

## 三、主线一：状态 —— Deployment 还是 StatefulSet

我最初给 7 个服务列了一张表,自认为判断很清晰:

| 服务 | 资源类型 | 当时的理由 |
|---|---|---|
| PostgreSQL | StatefulSet | 数据库,有状态 |
| Qdrant | StatefulSet | 向量数据库,有状态 |
| Redis | StatefulSet | 缓存,有状态 |
| Phoenix | Deployment | 无状态(数据在 PG) |
| Metabase | Deployment | 无状态(数据在 PG) |
| Grafana | Deployment | 无状态(配置在 ConfigMap) |
| AgentScope | Deployment | 无状态(状态在 Redis/PG/Qdrant) |

**这张表有三行站不住。** 而且「有状态 → StatefulSet」这个说法本身就太粗 —— 面试时会被追一句「那 Grafana 也算有状态啊」。

### 3.1 更准的判据

不是「数据重不重要」,是 **「状态是每个副本各有一份,还是所有副本共享同一个逻辑库」**:

| 状态形态 | 例子 | 选型 | 存储形态 |
|---|---|---|---|
| **每副本各有一份,身份与数据绑定** | PG 主从、Qdrant 分片、Redis Cluster 的 slot | **StatefulSet** | per-pod PVC(RWO) |
| **所有副本共享同一个逻辑库** | Grafana 元数据库、Metabase 元数据库 | **Deployment** | 外部 PG,或 RWX PVC |
| **状态可丢、可重建** | 纯缓存、临时计算 | **Deployment** | emptyDir |

### 3.2 StatefulSet 到底给了哪四样东西

1. **稳定 Pod 名**(`postgres-0`,重建后名字不变)
2. **per-pod PVC**(`volumeClaimTemplates`,1:1 绑定;Pod 漂到别的节点仍挂回同一块盘)
3. **有序启停**(0→N 启动,N→0 停止)
4. **headless Service 带来的稳定 DNS**(`postgres-0.postgres.ns.svc.cluster.local`)

⭐ **第 4 条是硬需求,不是锦上添花**:PG 的复制槽、Redis Sentinel 找主、Redis Cluster 的 slot 归属、Qdrant 的分片 —— 全靠按名字找同伴。漏掉 `spec.serviceName` 指向的 headless Service,Pod 全部正常起来,**同伴发现却在运行时失败**。

### 3.3 Redis:「缓存,有状态」是自相矛盾的一行

- **如果 Redis 只是缓存**(丢了能重建,无成员协议)⇒ **Deployment 就够**
- **如果 Redis 承载业务状态**(会话、消息总线、分布式锁、AOF 持久化)⇒ **StatefulSet + PVC** —— 这时它扮演的是 datastore,不是 cache

我的 Redis 承载 AgentScope 的会话与消息总线状态 ⇒ **StatefulSet 成立**,但理由要改成「**承载会话与消息总线状态,需要持久化和稳定身份**」。

三种形态选型还各不相同:

| 形态 | 选型 | 原因 |
|---|---|---|
| 单机、无持久化(纯缓存) | Deployment | 淘汰可接受,无成员协议 |
| Sentinel(有盘) | StatefulSet | sentinel 需要稳定身份来跟踪主节点 |
| Cluster | **必须** StatefulSet | slot 归属和 replica-of 需要粘性名字 |

另外两条: **Sentinel 不要和 Redis 放同一个 Pod 当 sidecar** —— 它是独立实例,单独 Pod;**master 和 replica 必须配 `podAntiAffinity`** —— 落同一节点等于节点故障时两个一起死。节点内核参数也要到位:`vm.overcommit_memory=1`、`net.core.somaxconn=8192`、关掉 THP(BGSAVE 的 fork 会失败)。

### 3.4 Grafana:这里有个真风险,不是措辞问题

我原来写「无状态(配置在 ConfigMap)」—— **ConfigMap 里的 `grafana.ini` 只是配置,不是状态**。

Grafana 的状态在**它自己的数据库**里:dashboard、users、orgs、data source、**告警规则**、插件,默认是 SQLite `/var/lib/grafana/grafana.db`。

- ⚠️ **Deployment 不挂 PVC ⇒ Pod 一重启,全部看板、datasource、告警规则全没**
- ⚠️ **更要命的是告警状态**:Grafana 9.0 之后告警状态是持久化在 DB 里的,但没有 PV 时:
  - 正在 **Alerting** 的规则重启后直接变 Normal,**而且不发 Resolved 通知**(没有旧状态可以 resolve)
  - 正在 **Pending** 的规则**计时重置** ⇒ `for: 5m` 这类持续时间从头开始算
- ⚠️ **replicas > 1 必须外部 PG**:SQLite 只允许一个写者。多副本挂同一个 SQLite 会撞 **WAL 写锁** ⇒ **看板保存静默失败** —— UI 返回 200,但下次打开还是旧版本

⇒ 正确说法:**「Grafana 的业务数据在 Prometheus,它自己不存指标;但它自己的元数据库是有状态的 ⇒ Deployment + 持久化的应用库(SQLite 只能单副本,多副本必须 PG)」**

### 3.5 Metabase 漏了一层,AgentScope 有一个例外

**Metabase** 的「数据在 PG」指的是被分析的业务数据。但**它自己的元数据库也是状态**:dashboard、question、collection、用户与权限,**还有订阅与警报的调度任务元数据**。

- ⇒ Deployment 必须挂 PVC(存 SQLite/H2)或直接接外部 PG。默认 H2 只支持单进程。
- ⇒ **集群多副本必须共享同一个应用库**,否则 Quartz 调度器各跑各的 ⇒ **同一个订阅重复发送**。

**AgentScope** 的会话/消息总线状态在 Redis、监控数据在 PG/Qdrant,都不在 Pod 本地 ⇒ Deployment 成立。**例外在 workspace**:它有 `LocalWorkspace` / `DockerWorkspace` / `E2BWorkspace` 三种,`LocalWorkspace` 写宿主文件系统 ⇒ **产物在 Pod 本地**,不能说「完全无状态」。

### 3.6 生产数据库:裸 StatefulSet 不如 Operator

Operator(CloudNativePG / Strimzi / Qdrant Operator)会一并创建 **StatefulSet + headless Service + PDB + 备份 CronJob**。

「我会装 Operator 让它管」比「我会 apply 一个裸 StatefulSet 跑生产 PG」是更强的答案。但 **Operator 不改变规则** —— 引擎依然需要粘性身份,Operator 只是运维方式。

### 3.7 缩容不回收 PVC

StatefulSet 缩容按**倒序**删 Pod(最大 ordinal 先),**PVC 默认保留**。3 副本缩到 1,两块盘还在计费。`persistentVolumeClaimRetentionPolicy`(`whenScaled` / `whenDeleted`,1.32 stable)可以改,生产常用 `whenDeleted: Retain`。

`kubectl delete statefulset` **不会级联删 PVC** —— 删完一定 `kubectl get pvc` 核一遍。

## 四、主线二：资源 —— limit 超了到底会发生什么

这一条主线是整个 K8s 里最反直觉的。**两种资源超限,后果完全不对称。**

### 4.1 内存超限 → OOMKilled

```
进程申请内存 > limit
  → cgroup 内核 OOM killer 触发
  → 容器主进程被 SIGKILL
  → Pod 状态 Running, RESTARTS +1
  → Last State: Terminated, Reason: OOMKilled, Exit Code: 137
```

**137 = 128 + 9(SIGKILL)**,没有商量余地。反复超限就是 OOM → 重启 → 再 OOM → CrashLoopBackOff。

⭐ 但有三条坑,都会让人调错方向:

**坑一:137 不等于 OOMKilled。** 137 只说明「被 SIGKILL 了」。liveness 探针失败后宽限期到点被杀,也是 137。**定性看 `Reason` 字段,不看 exit code。**

**坑二:「Pod 状态 Running、RESTARTS +1」只在 cgroup v2 + kubelet ≥ 1.28 成立。** 那之后 kubelet 会设 `memory.oom.group=1`,容器内所有进程一起死。**老版本上只死一个子进程** —— 如果被杀的不是 PID 1,容器**仍然是 Running、RESTARTS 不变**,但某个功能已经悄悄没了。看到「RESTARTS=0 但 `oom_kill`=3」不是幻觉。

**坑三:cgroup v1 和 v2 口径不同。** v2 的 `memory.current` = anon + **page cache** + **slab/内核内存** + tmpfs,而 v1 默认**不计入** page cache 和内核内存。⇒ 同样的 limit,在 v1 节点跑得好好的,迁到 v2 就开始 OOMKilled。查自己是哪个:`stat -fc %T /sys/fs/cgroup/`,`cgroup2fs` = v2。

### 4.2 CPU 超限 → 不是变慢,是硬停

```
CPU 用量 > limit
  → cgroup CPU controller 暂停该容器调度
  → 直到下一个调度周期边界才恢复
```

CFS 的两个参数:`cpu.cfs_period_us = 100000`(100ms),`cpu.cfs_quota_us = limit × 100000`。一个周期内配额用完,**整个 cgroup 被冻结到下个周期边界**。

⇒ **最大凭空增加约 100ms 延迟。** 请求不是「慢一点」,是**挂在那儿不动**。哪怕节点 CPU 还有富余,只要这个容器自己撞了自己的 limit,延迟尖刺照样出现。

⇒ **实践结论:延迟敏感的服务通常干脆不设 CPU limit**,靠 request 拿份额。代价是拿不到 Guaranteed QoS(Guaranteed 要求 CPU 和 memory 的 request 都等于 limit)。**这是「节点级 OOM 防护」和「延迟稳定性」的取舍,不是对错题。**

### 4.3 request 不是文书,是内核读的那个数

这是整条主线里最值钱的一条。**QoS 等级对应的是内核的 `oom_score_adj`**:

| QoS | 条件 | `oom_score_adj` | 节点内存紧张时 |
|---|---|---|---|
| **Guaranteed** | 每个容器 CPU 和 memory 的 request 都等于 limit | **-997** | 最后死 |
| **Burstable** | 至少设了一个 | **1000 − 1000×memRequest/节点容量**,夹在 [2,999] | 中间 |
| **BestEffort** | 全没设 | **1000** | 第一个死 |

⭐ **Burstable 不是一个档位,是一条滑动刻度。** 64Mi request 的 Pod 在 29Gi 节点上算出 **998** —— 跟 BestEffort 的 1000 几乎没区别。

⇒ **「把 request 写小点省资源」这个动作,是在提高自己被杀的优先级。**
⇒ **你的 memory request 就是内核决定「谁先死」时读的那个数。**

另外两条:**PriorityClass 不影响 `oom_score_adj`**(kubelet 驱逐看 Priority,内核 OOM 不看);**Guaranteed 救不了你违反自己的 limit** —— 它只防「被别人连累」。

### 4.4 JVM 的坑跟 K8s 的坑是叠加的

我的 7 个服务里有好几个是 Java。**光懂 K8s 那一层不够。**

⭐ **`-XX:MaxRAMPercentage` 默认是 25** ⇒ **2Gi 的容器,JVM 堆上限只有 512Mi**。

如果容器在 2Gi 死了而堆上限只有 512Mi,说明**另外 1.5Gi 是堆外**:Metaspace、线程栈(默认每线程约 1MiB,几百个线程就是几百 MiB)、Code Cache、DirectByteBuffer、GC 自身结构。

⇒ **盲目调大堆会让情况更糟** —— GC 跑得更少 ⇒ 常驻内存更大 ⇒ 死得更快。
⇒ 看堆外用 `jcmd 1 VM.native_memory summary`(需要 `-XX:NativeMemoryTracking=summary`)。

还有两个:

- **`-XX:+ExitOnOutOfMemoryError` 值得加**:不加的话堆不够时 JVM **不会死**,而是把全部时间耗在 GC 上 ⇒ 容器看起来 Running 但完全不响应,**这是最难诊断的状态**。宁可干净地死掉重启。
- **cgroup v2 支持**:JDK 15 才有(回移植到 11.0.16 / 8u372)。老 JDK 在 v2 节点上读的是**节点内存**,堆按整节点算 ⇒ 撞 container limit 而不是自己的堆上限。

### 4.5 Redis 的 maxmemory 必须小于 limit

这条直接连回 4.1:**`maxmemory` 必须小于 Pod 的 `limits.memory`(建议只留 50%-90%)**。

等于的话,Redis 还没触发自己的淘汰策略,就被 cgroup 先 OOMKill 了 —— **等于连「缓存满了自动淘汰」这个兜底都失去了**。

## 五、主线三：入口 —— Service 和 Ingress 各管什么

### 5.1 两层分工

- **Service = 四层负载均衡**,负责把流量稳定转发到一组 Pod
- **Ingress = 七层路由规则**,按域名和路径把外部 HTTP 流量分发到不同的 Service

**Ingress 依赖 Service 来发现 Pod,两者是上下游协作关系**,Ingress Controller 就是连接它们的「七层网关」。

⭐ 这里有一句关键:**Ingress 资源只声明规则,Controller 才是执行者。** Ingress Controller 本身 watch API Server,把规则**翻译成 nginx 配置**再 reload。推论有三条:**改规则到生效有延迟**;**Controller 挂了 = 所有 Ingress 路由全断**;它需要 RBAC 权限 watch 集群资源。

### 5.2 为什么选 Ingress 而不是 NodePort

| | Ingress | Service type=LoadBalancer |
|---|---|---|
| 层 | L7 | L4 |
| 协议 | 只 HTTP/HTTPS | 任意 TCP/UDP |
| 一个 LB 能带几个服务 | **多个** | 一个 |
| 成本(AWS NLB 约 20-30 美元/月) | 1 个 NLB 挂所有服务 | **每个 Service 一个** |

**30 个微服务用 LoadBalancer Service = 600-900 美元/月;1 个 Ingress 挂 1 个 NLB = 20-30 美元/月。** 这才是 Ingress 最大的现实价值 —— 不是「标准做法」,是钱。

### 5.3 ⚠️ 2026 年必须知道:ingress-nginx 已经 EOL

| 时间 | 事件 |
|---|---|
| 2025-11-11 | Kubernetes 项目宣布 ingress-nginx 退役公告 |
| 2026-03-20 | SIG-Network 发布 **ingress2gateway 1.0**(官方转换工具,支持 30+ ingress-nginx 注解) |
| **2026-03-24** | **到达 EOL:仓库转只读,不再有 release、bug fix、CVE 补丁** |

起因是 **CVE-2025-1974**(CVSS 9.8):`configuration-snippet` 注解允许任何有 Ingress 创建权限的人往数据面注入任意 nginx 配置,实现未认证 RCE,影响约 43-50% 的云环境。

要分清两件事:**Ingress API 本身没有被弃用**,只是 feature-frozen(不再开发新特性);退役的是 `kubernetes/ingress-nginx` 这个 controller。F5 的 `nginx/kubernetes-ingress` 是同名不同代码库,仍在维护。

⇒ **它不会突然炸**,但从此以后,这个持有 TLS 私钥、吃外部不可信输入的 L7 数据面,**新 CVE 永远不会被修**。

### 5.4 Gateway API 是继任者

官方文档的原话是「**Kubernetes 项目推荐使用 Gateway 而不是 Ingress。Ingress API 已经被冻结。**」GA 时间是 v1.0 / 2023-10-31。

它的价值在**角色分离**:

| 资源 | 谁维护 | 管什么 |
|---|---|---|
| **GatewayClass** | 平台团队 | 哪个 controller 实现来处理这一类 |
| **Gateway** | 平台/网络团队 | listener:端口、协议、TLS 证书、允许挂哪些 route |
| **HTTPRoute** | **应用团队** | 路由规则:host、path、header、method、权重 |

Ingress 只有一个资源,所以「谁能改 TLS 和监听端口」和「谁能配自己的路由」是同一批人。Gateway API 把这两件事拆开了,RBAC 正好对上团队分工。

还有两个只有 Gateway API 才有的能力:**跨 namespace 路由**(但需要 **`ReferenceGrant`** 显式授权 —— 这是迁移时最常见的「为什么不工作」)、以及**流量切分**(金丝雀、蓝绿)。

### 5.5 pathType 的两个坑

| pathType | 匹配方式 |
|---|---|
| **Exact** | 精确匹配整个路径,区分大小写 |
| **Prefix** | **按 `/` 分隔的路径元素逐个匹配** |
| **ImplementationSpecific** | 交给 IngressClass 的实现决定 |

⭐ **坑一:Prefix 是「路径元素」匹配,不是字符串前缀。** `/foo/bar` 匹配 `/foo/bar/baz`,**不匹配** `/foo/barbaz`。这跟「前缀」的直觉相反。

⭐ **坑二:ImplementationSpecific 是可移植性地雷。** 匹配语义属于 controller 本身 —— **换 controller 可能静默改变哪些请求路由到哪,不报错也不警告。** 迁移审计第一个要 grep 的就是它。

## 六、主线四：观测 —— 为什么我同时用 Grafana 和 Metabase

我一开始以为这俩是竞品,后来发现**底层基因不同**。

| | Grafana | Metabase |
|---|---|---|
| 被观测对象的最小单位 | 带时间戳的指标 + 标签 | 业务表里的一行 |
| 天然擅长 | 按维度分组 + 按时间窗聚合 | 按维度筛选 + 看事实 |
| 算得出 | P99、错误率、饱和度 | DAU、订单量、转化率 |
| 告的是 | **系统健康** | **业务健康** |

**类比**:Grafana 是汽车仪表盘(转速、时速实时跳),Metabase 是行车记录仪回放(事后分析这段路怎么开的)。

⭐ 但有个概念必须澄清:**Grafana 自己不存指标。** 它的库只存 dashboard、用户、权限、告警规则、data source 定义 —— **里面没有时序数据库,也没有采样写入端点**。PromQL 是发给 Prometheus、由 Prometheus 在自己主机上执行的。

两个推论: **断掉 Grafana,看板和告警规则没了,一个采样点都不丢;断掉 Prometheus,数据才没了。** 备份要分两份。而 **「一个没装 Prometheus 的 Grafana」是完全正常的部署** —— 配个只读 PG 用户 + `$__timeFilter` 宏,就是个活的业务看板。

**告警上的差距不在阈值,在告警治理。** Metabase 现在有三种告警(结果/目标线/进度条),频率最快每分钟,支持 `Only send the alert once` 和 Webhook —— 比我最初以为的强。但它**完全没有分组、静默、抑制、路由**这四件,这是 SRE 值班体系的地基。

还有一个生产副作用:Metabase 告警**每次检查都要重跑一遍那个 question**,打的是生产 OLTP 库,频率还能设成每分钟 ⇒ **告警系统本身成了生产库的负载源**。

⇒ **我的分工:Grafana 管「系统现在怎么样」,PG + Metabase 管「这件事发生在谁身上、影响了多少业务」。** 两份数据不是冗余,是两个不同的问题。

## 七、14 条速查表

| # | 坑 | 现象 | 解法 |
|---|---|---|---|
| 1 | `ctr` 导入忘带 `-n k8s.io` | 镜像在集群里看不见 | `ctr -n k8s.io images import xxx.tar` |
| 2 | `imagePullPolicy` 默认 Always | `ErrImagePull` | 私有镜像改 `Never` 或配 `imagePullSecrets` |
| 3 | `jre-alpine` 是 musl | Netty `UnsatisfiedLinkError` | 换 glibc 基础镜像 |
| 4 | `hostPath` 存数据 | Pod 换节点就读不到 | 用 PVC;单机可用 Local PV + nodeAffinity(硬约束) |
| 5 | CA 证书申请按 CPU 触发 | 证书一直不签 | 按 **Pending Pod** 事件触发 |
| 6 | VPA 和 HPA 同时开 | 互相打架 | 二选一,或 VPA 只开 recommendation 模式 |
| 7 | 以为 Volume 生命周期随 Pod | 以为 PVC 删了数据也没了 | **只有 emptyDir 随 Pod 消失** |
| 8 | 以为 ReplicaSet 是历史版本记录 | 以为它只管旧版本 | **ReplicaSet 才是真正管副本的控制器** |
| 9 | 以为 service mesh 是全互连 | 架构图画成网状 | mesh 是解决**一致性问题**,不是拓扑 |
| 10 | Ingress 只写 YAML 就生效 | 路由完全不生效 | **必须装 Controller** |
| 11 | `pathType: Prefix` 当字符串前缀 | `/api` 匹配到 `/apikeys` | Prefix 是**路径元素**匹配 |
| 12 | 内存超限 | `OOMKilled` / 137 | 查 `memory.events` 与 `memory.stat`;**别只翻 limit** |
| 13 | CPU limit 设太紧 | 延迟莫名尖刺 100ms | 延迟敏感就**不设 CPU limit** |
| 14 | Deployment + 共享 PVC 多副本 | 看板静默不落库 / Pod 卡 Pending | RWO 多副本会 Multi-Attach;单写者库要外部 PG |

## 八、我现在会怎么跟同事讲

> 「**limit 是强制上限,request 是调度依据和内核杀进程的优先级依据。**
> 内存超限会被内核 OOM killer SIGKILL(137),但 137 本身不能证明是 OOM —— 得看 Reason 字段。
> CPU 超限不是变慢,是 CFS 配额用完后被冻结到下个周期,最多凭空加 100ms 延迟 ——
> 所以延迟敏感的服务通常不设 CPU limit,代价是拿不到 Guaranteed QoS。
> Guaranteed 的 `oom_score_adj` 是 -997,BestEffort 是 1000,Burstable 按 request 占节点容量的比例滑动 ——
> **request 写小就是在提高自己被杀的优先级。**
>
> 选 StatefulSet 还是 Deployment,判据不是「数据重不重要」,是**「状态是每副本一份还是共享一个逻辑库」**。
> 稳定 DNS 那一条是硬需求 —— 复制槽、Sentinel 找主、slot 归属、分片发现,全靠按名字找同伴。
>
> Grafana 和 Metabase 不是竞品,是两种基因:一个算得出 P99 和错误率,一个算得出 DAU 和转化率。
> 而且 **Grafana 自己不存指标**,它只是把查询发给 Prometheus 执行再画图 ——
> 所以它可以完全不装 Prometheus,直接配一个只读 PG 数据源。」

## 参考

- Kubernetes 官方文档 —— Ingress / Service / Pod 资源配置 / QoS
- Arize Phoenix 官方 `docs/deployment/kubernetes.md`(SQLite ⇒ StatefulSet,PostgreSQL ⇒ Deployment)
- Kubernetes SIG-Network `ingress2gateway`
- Linux CFS 与 cgroup v2 memory controller 文档

---

跑这套东西最大的收获不是「我会写 K8s 的 YAML 了」,是**每个资源背后都有一条能推出来的约束**。把约束搞明白,YAML 只是记法。
