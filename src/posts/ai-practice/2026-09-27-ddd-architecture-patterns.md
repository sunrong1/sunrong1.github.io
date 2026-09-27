---
title: DDD 架构模式:从整洁架构到六边形架构的统一视角
icon: layers
date: 2026-09-27
update: 2026-09-27
categories:
  - DDD
  - 软件架构
tags:
  - DDD
  - 领域驱动设计
  - 整洁架构
  - 洋葱架构
  - 六边形架构
  - 端口适配器
  - 防腐层
  - ACL
  - 架构模式
author: Mr.Sun
star: true
---***
# DDD 架构模式:从整洁架构到六边形架构的统一视角

> Day 4 架构模式,2 波素材整合。
> 关键字:**整洁架构(洋葱)/ 六边形架构(端口适配器)/ 防腐层(ACL)/ 三种架构本质相同 / 5 大核心要点**。
> DDD 进阶篇(9-27 上)讲"领域事件 + 四层架构 + 误区防范",本文讲"整洁 + 六边形 + ACL"——**统一视角看架构模式**。

***

## 📌 一句话核心

> **"DDD 架构模式 = 整洁架构(洋葱同心圆)+ 六边形架构(端口适配器)+ 防腐层(ACL),三种本质相同。"**
> **整洁架构讲分层,六边形架构讲端口适配器,DDD 四层架构讲职责划分;**
> **三种架构本质相同:领域模型在中心,依赖指向内层,内层定义接口,外层实现接口,技术细节可替换;**
> **防腐层(ACL)= 保护下游领域模型不被外部污染的翻译隔离层。**

***

<!-- more -->

## 📌 为什么写这篇

写完 DDD 基础篇 + 进阶篇后,我开始意识到——**DDD 不是一种架构,而是一组架构思想**。

大家最容易困惑的就是:**DDD 分层架构、整洁架构、六边形架构,这三种到底什么关系?**

**本文整合 Day 4 两波素材**——从"整洁架构"到"六边形架构"到"防腐层",给出**统一视角**。

而且,实战里大家最容易踩的坑:**对接外部系统时,领域模型被污染**——这正是**防腐层(ACL)**解决的问题。

***

## 💎 第 1 部分:整洁架构(洋葱架构)

> "在整洁架构(洋葱架构)里,同心圆代表应用软件的不同部分,**从里到外:领域模型(含领域服务) → 应用服务 → 接口适配器 → 框架与驱动**。最外层易变,比如用户界面和基础设施。"

### 1.1 整洁架构的一句话定义

> **"整洁架构 = 同心圆 4 层 + 依赖原则(外→内)。最外层易变,内层不依赖外层。"**

### 1.2 整洁架构的同心圆(从内到外)

```
        ┌──────────────────────────┐
        │  框架与驱动              │  ← 最外层,易变
        │   ┌─────────────────┐   │
        │   │  接口适配器      │   │  ← Controllers、Gateways
        │   │   ┌──────────┐  │   │
        │   │   │ 应用服务  │  │   │  ← Use Cases、用例编排
        │   │   │  ┌────┐  │  │   │
        │   │   │  │实体 │  │  │   │  ← 实体、值对象
        │   │   │  │值对│  │  │   │
        │   │   │  │领域│  │  │   │  ← 领域服务
        │   │   │  │服务│  │  │   │
        │   │   │  └────┘  │  │   │
        │   │   │ 领域模型  │  │   │  ← 核心业务逻辑(最内层)
        │   │   └──────────┘  │   │
        │   └─────────────────┘   │
        └──────────────────────────┘
```

### 1.3 整洁架构 4 层详解

| 层 | 角色 | 例子 | 易变程度 |
| :--- | :--- | :--- | :--- |
| **领域模型** | 核心业务逻辑 | 实体、值对象、领域服务 | **最稳定**(核心) |
| **应用服务** | 用例编排 | Use Cases、Application Service | 中 |
| **接口适配器** | 转换数据格式 | Controller、Gateway、Presenter | 中高 |
| **框架与驱动** | 技术细节 | Spring、MySQL、Kafka、Redis | **最易变**(外层) |

### 1.4 整洁架构的依赖原则(核心)

> "**整洁架构最主要的原则是依赖原则,它定义了各层的依赖关系,依赖方向只能从外向内,内层不依赖外层。外圆代码依赖只能指向内圆,内圆不需要知道外圆的任何情况。**"

```
[依赖方向]

框架与驱动(最外) ───┐
                     ↓
接口适配器 ──────────┐
                     ↓
应用服务 ────────────┐
                     ↓
领域模型(最内)

✅ 外 → 内(允许)
❌ 内 → 外(禁止)
```

**关键洞察**:**内圆不知道外圆的存在**——领域层不知道 MySQL、Spring 是什么。

### 1.5 整洁架构的 4 大好处

| 好处 | 含义 |
| :--- | :--- |
| **可替换** | 换数据库 = 只改最外层 |
| **可测试** | 领域模型 = 纯单元测试,无需 DB |
| **独立于框架** | 领域层不依赖 Spring/Flask |
| **独立于 UI** | 同一套领域模型可用于 REST/GraphQL/CLI |

### 1.6 整洁架构 vs DDD 四层架构

| 整洁架构 | DDD 四层架构 |
| :--- | :--- |
| 领域模型 | 领域层 |
| 应用服务 | 应用层 |
| 接口适配器 | 用户接口层 + 基础层(部分) |
| 框架与驱动 | 基础层 |

**关键洞察**:**整洁架构 ≈ DDD 四层架构**(视角略不同,本质相同)。

---

## 💎 第 2 部分:六边形架构(端口适配器架构)

> "六边形架构又名'**端口适配器架构**'。**端口(Port)**:边界上的接口,定义'应用能做什么'或'应用需要什么'。六边形架构的核心理念是:**应用是通过端口与外部进行交互的**。"

### 2.1 六边形架构的一句话定义

> **"六边形架构 = 应用通过端口(Port)与外部交互,适配器(Adapter)负责协议转换。一个端口可对应多个外部系统的多个适配器。"**

### 2.2 六边形架构图

```
                ┌────────────┐
   HTTP 适配器 ─→│            │
                │  六边形    │
   REST 适配器 ─→│  应用     │←─ MySQL 适配器
                │  (端口)   │
   gRPC 适配器 ─→│            │←─ Kafka 适配器
                │            │
   CLI 适配器 ─→ │            │←─ Redis 适配器
                └────────────┘

左边 = 输入适配器(外部 → 应用)
右边 = 输出适配器(应用 → 外部)
```

### 2.3 端口(Port)详解

> **"端口是边界上的接口,定义'应用能做什么'或'应用需要什么'。"**

#### 端口的两类

| 类型 | 含义 | 方向 | 例子 |
| :--- | :--- | :--- | :--- |
| **入站端口** | 应用暴露的接口 | 外部 → 应用 | `OrderUseCase` 接口 |
| **出站端口** | 应用需要的依赖 | 应用 → 外部 | `OrderRepository` 接口 |

### 2.4 适配器(Adapter)详解

> **"适配器负责协议转换,连接端口和外部系统。"**

#### 适配器的两类

| 类型 | 角色 | 例子 |
| :--- | :--- | :--- |
| **入站适配器** | 外部协议 → 入站端口调用 | HTTP Controller / gRPC Server |
| **出站适配器** | 出站端口 → 外部协议 | MySQL Repository / Kafka Publisher |

### 2.5 端口 vs 适配器 对比

| 维度 | 端口(Port) | 适配器(Adapter) |
| :--- | :--- | :--- |
| **本质** | **接口**(抽象) | **实现**(具体) |
| **位置** | 领域层 / 应用层 | 基础层 / 用户接口层 |
| **稳定性** | **稳定**(几乎不变) | **易变**(可替换) |
| **例子** | `OrderRepository` 接口 | `MysqlOrderRepository` 实现 |
| **数量** | 1 个端口 | **N 个适配器**(可多个) |

### 2.6 一个端口多个适配器(实战)

> "**一个端口可能对应多个外部系统,不同的外部系统也可能会使用不同的适配器,由适配器负责协议转换。**"

#### 场景:`OrderRepository` 端口对应多个适配器

```
[端口] OrderRepository(领域层接口)
   │
   ├─ [适配器 1] MysqlOrderRepository
   │     → 持久化到 MySQL
   │
   ├─ [适配器 2] PostgresOrderRepository
   │     → 持久化到 PostgreSQL
   │
   └─ [适配器 3] InMemoryOrderRepository
         → 测试用,内存存储
```

#### 场景:`NotificationPort` 端口对应多个适配器

```
[端口] NotificationPort(应用层接口)
   │
   ├─ [适配器 1] EmailNotificationAdapter
   ├─ [适配器 2] SmsNotificationAdapter
   └─ [适配器 3] DingTalkNotificationAdapter
```

**关键洞察**:**端口 = 抽象(稳定),适配器 = 实现(可变)**——换邮件服务商,只换 Adapter。

---

## 💎 第 3 部分:三种架构模型对比

> "**虽然 DDD 分层架构、整洁架构、六边形架构的架构模型表现形式不一样,但你不要被它们的表象所迷惑,这三种架构模型的设计思想正是微服务架构高内聚低耦合原则的完美体现,而它们身上闪耀的正是以领域模型为中心的设计思想**。整洁架构讲分层,六边形架构讲端口适配器,DDD 四层架构讲职责划分;三者本质相同:**领域模型在中心,依赖指向内层,内层定义接口,外层实现接口,技术细节可替换**。"

### 3.1 三种架构的对应关系

| 整洁架构同心圆 | 六边形架构 | DDD 四层架构 |
| :--- | :--- | :--- |
| 领域模型(最内) | 六边形应用 | 领域层 |
| 应用服务 | 六边形应用 | 应用层 |
| 接口适配器 | 适配器 | 用户接口层 |
| 框架与驱动(最外) | 适配器 | 基础层 |

**关键洞察**:**三种架构 = 同一思想的 3 种表达**——形式不同,本质相同。

### 3.2 核心思想一致(5 大要点)

> "**核心思想一致:领域模型在中心;依赖方向指向内层;内层定义接口,外层实现接口;技术细节可替换;业务逻辑与技术解耦。**"

| # | 核心思想 | 整洁架构 | 六边形架构 | DDD 四层 |
| --- | :--- | :--- | :--- | :--- |
| 1 | **领域模型在中心** | 最内圆 | 六边形内部 | 领域层 |
| 2 | **依赖方向指向内层** | 外 → 内 | 通过端口(稳定) | 用户接口 → 基础层 |
| 3 | **内层定义接口** | 端口 | 端口 | 仓储接口 |
| 4 | **外层实现接口** | 适配器 | 适配器 | 仓储实现 |
| 5 | **业务逻辑与技术解耦** | 内层不依赖外层 | 端口不知道外部 | 领域层零技术依赖 |

### 3.3 三种架构的实战对比

#### 同一个 Order 用例的三种架构表达

```python
# ===== 整洁架构表达 =====
# 1. 实体(最内层)
@dataclass
class Order:
    order_id: str
    items: list = field(default_factory=list)

# 2. Use Case(应用服务)
class CreateOrderUseCase:
    def __init__(self, repo):  # 接口依赖
        self.repo = repo
    def execute(self, customer_id):
        order = Order(customer_id)
        self.repo.save(order)

# 3. 接口适配器(Controller)
class OrderController:
    def __init__(self, use_case):
        self.use_case = use_case
    def post(self, request):
        self.use_case.execute(request.customer_id)

# 4. 框架与驱动(最外层,具体实现)
class MysqlOrderRepository:  # 适配器
    def save(self, order):
        # MySQL 实现
        pass

# ===== 六边形架构表达 =====
# 1. 入站端口
class OrderUseCasePort(ABC):
    @abstractmethod
    def create_order(self, customer_id): ...

# 2. 出站端口
class OrderRepositoryPort(ABC):
    @abstractmethod
    def save(self, order): ...

# 3. 应用(实现入站端口,使用出站端口)
class OrderApplication(OrderUseCasePort):
    def __init__(self, repo_port: OrderRepositoryPort):
        self.repo_port = repo_port
    def create_order(self, customer_id):
        order = Order(customer_id)
        self.repo_port.save(order)

# 4. 入站适配器(REST)
class RestOrderAdapter:
    def __init__(self, use_case_port: OrderUseCasePort):
        self.use_case_port = use_case_port
    def post(self, request):
        self.use_case_port.create_order(request.customer_id)

# 5. 出站适配器(MySQL)
class MysqlOrderAdapter(OrderRepositoryPort):
    def save(self, order):
        # MySQL 实现
        pass

# ===== DDD 四层架构表达 =====
# (核心相同,已在进阶篇详写)
```

---

## 💎 第 4 部分:防腐层(ACL)

> "ACL 是下游上下文为了保护自己的领域模型不被上游模型污染,而在边界上加的一层翻译和隔离机制。它把外部模型、遗留系统、第三方 API、上游上下文的概念,**翻译成自己上下文内的通用语言和领域模型**。**ACL 的本质是:下游拒绝遵奉上游,选择翻译**。"

### 4.1 ACL 的一句话定义

> **"ACL(防腐层)= 下游上下文在边界上加的翻译 + 隔离机制,保护自己的领域模型不被外部污染。"**

### 4.2 ACL 的本质(关键洞察)

> "**ACL 的本质:下游拒绝遵奉上游,选择翻译。**"

```
[方式 1:遵奉] ❌
下游直接用上游的模型
   后果:上游一变,下游全崩

[方式 2:翻译] ✅ ACL 的做法
下游用 ACL 把上游的模型翻译成自己的语言
   后果:上游随便变,下游不动
```

**关键洞察**:**ACL 是"防御性翻译",不是"接收式兼容"**。

### 4.3 ACL 的 4 大职责

| 职责 | 说明 |
| :--- | :--- |
| **翻译** | 外部模型 → 内部领域模型 |
| **隔离** | 外部变化不直接冲击内部 |
| **适配** | 适配不同协议、字段、语义 |
| **保护** | 防止外部概念污染通用语言 |

### 4.4 ACL 的 4 种典型场景

> "**跨上下文协作时都可能需要 ACL**。"

| 场景 | 是否需要 ACL | 原因 |
| :--- | :---: | :--- |
| **对接遗留系统** | ✅ | 遗留系统模型混乱 |
| **对接第三方 API** | ✅ | 第三方字段/协议不同 |
| **对接上游上下文** | ✅ | 上游模型 ≠ 下游通用语言 |
| **同上下文内调用** | ❌ | 同语言,不需要翻译 |

### 4.5 ACL 的放置位置(关键)

> "**ACL 通常放在基础设施层或应用层边界,作为适配器。ACL 不能放在领域层。领域层不应该知道外部模型长什么样。**"

```
[基础层]  ← ACL 在这里(实现具体翻译)
[应用层边界] ← ACL 在这里(适配器接口)
[领域层]  ← ACL 不在这里!领域层 = 纯业务
```

**关键洞察**:**领域层 = 纯业务,不知道外部模型存在**(否则就被污染了)。

### 4.6 ACL 实战代码示例

#### 场景

```
上游(用户中心上下文):
   UserModel { id: UUID, name: String, email: String, status: Int }

下游(订单上下文):
   Customer { customer_id: String, full_name: String, contact: Contact }

问题:
   上游用 UUID,下游用 String
   上游有 status 字段,下游不需要
   下游需要 contact,上游没有
```

#### ACL 翻译器 + 适配器完整代码

```python
# 1. 上游模型(外部数据,可能来自第三方 API)
@dataclass
class UpstreamUserModel:
    """上游用户中心模型(可能来自 HTTP API / 遗留系统)"""
    id: str  # UUID 格式
    name: str
    email: str
    status: int  # 0=active, 1=inactive, 2=deleted
    created_at: str

# 2. 下游领域模型(纯领域,不依赖外部)
@dataclass(frozen=True)
class Customer:  # 领域层
    customer_id: str
    full_name: str
    contact: Contact

@dataclass(frozen=True)
class Contact:
    email: str
    phone: str | None = None

# 3. ACL 翻译器(基础设施层,核心)
class UserModelTranslator:
    """ACL:把上游用户模型翻译成下游客户"""

    def to_customer(self, upstream: UpstreamUserModel) -> Customer:
        # 1. 翻译 ID(UUID → String)
        customer_id = upstream.id.replace("-", "").upper()

        # 2. 翻译姓名(name → full_name)
        full_name = upstream.name

        # 3. 翻译联系方式(构造 Contact 值对象)
        contact = Contact(email=upstream.email, phone=None)

        # 4. 过滤掉不需要的字段
        # 5. 校验业务规则
        if upstream.status != 0:
            raise InactiveCustomerError(f"用户 {customer_id} 不活跃")

        return Customer(customer_id, full_name, contact)

# 4. ACL 适配器(应用层边界)
class CustomerAclAdapter:
    """ACL 适配器:封装 ACL 调用,提供统一接口"""

    def __init__(self, upstream_api: UserApiClient):
        self.upstream_api = upstream_api
        self.translator = UserModelTranslator()

    def get_customer(self, customer_id: str) -> Customer:
        upstream = self.upstream_api.find_user(customer_id)
        return self.translator.to_customer(upstream)

# 5. 应用层调用(看不到外部模型)
@Service
class OrderApplicationService:
    def __init__(self, customer_acl: CustomerAclAdapter):
        self.customer_acl = customer_acl

    def create_order(self, customer_id, items):
        # 通过 ACL 获取 Customer,直接是领域模型
        customer = self.customer_acl.get_customer(customer_id)
        order = Order.create(customer)
        ...
```

**关键洞察**:
- ✅ 应用层只看到 `Customer`(领域模型),看不到 `UpstreamUserModel`
- ✅ 上游改字段、改协议,只改 ACL
- ✅ 领域层完全不知道外部存在

### 4.7 ACL 在三种架构中的位置

| 架构 | ACL 放在哪 |
| :--- | :--- |
| **整洁架构** | 接口适配器层(最外 2 层) |
| **六边形架构** | 适配器(Adapter)层 |
| **DDD 四层** | 基础层 或 应用层边界 |

**关键洞察**:**三种架构下,ACL 都放在"边界"**(具体位置不同,本质相同)。

### 4.8 ACL 的 4 大反模式

| 反模式 | 表现 | 后果 |
| :--- | :--- | :--- |
| **ACL 放进领域层** | 领域层 import 上游模型 | 领域层被污染 |
| **没有 ACL 直接用上游模型** | 业务代码里直接处理 `UpstreamUserModel` | 上游改 = 全崩 |
| **ACL 翻译逻辑分散** | 翻译代码散落在各个 Service | 难维护 |
| **过度翻译** | 上下游同字段还要翻译一遍 | 浪费 + 维护负担 |

### 4.9 ACL vs 适配器

| 维度 | ACL(防腐层) | 适配器(Adapter) |
| :--- | :--- | :--- |
| **目的** | **保护**内部领域模型 | 实现接口,协议转换 |
| **范围** | 跨上下文/外部系统 | 任何外部 |
| **位置** | 基础层/应用层边界 | 基础层 |
| **本质** | **翻译 + 隔离** | 实现 |

**关键洞察**:**ACL 是特殊的适配器,专为"保护领域模型"而生**。

---

## 💎 第 5 部分:实战建议

### 5.1 三种架构怎么选?

| 场景 | 推荐 |
| :--- | :--- |
| **新项目 + 微服务** | DDD 四层 + ACL(规范 + 防污染) |
| **大型单体重构** | 整洁架构(同心圆 + 依赖原则清晰) |
| **高度可替换的外部系统** | 六边形架构(端口适配器灵活) |
| **企业级落地** | 三种结合(DDD 四层 + 端口适配器 + ACL) |

### 5.2 工程师的行动建议

| 时间 | 行动 |
| :--- | :--- |
| **本周** | 画一张"四层架构图",看自己项目是否严格分层 |
| **本月** | 找 1 个对接外部系统的点,加 ACL 翻译器 |
| **本季度** | 把所有适配器整理成"端口 + 适配器"模式 |
| **半年内** | 实现"换数据库只改 1 层"的依赖倒置 |
| **持续** | 每次写代码前问:这是哪个层?有没有跨层调用? |

### 5.3 关联之前项目

| 架构模式 | 之前项目 |
| :--- | :--- |
| **整洁架构同心圆** | Harness 4 组件 = 4 层 |
| **端口适配器** | Harness 的 Adapter 层 |
| **防腐层(ACL)** | 之前项目对接外部 API 时用过 |
| **领域模型在中心** | 之前项目的核心业务逻辑都在内部包 |

---

## 💬 总结

### Day 4 架构模式完整图谱

```
[整洁架构](洋葱)
   ├─ 同心圆 4 层:领域模型 → 应用服务 → 接口适配器 → 框架与驱动
   ├─ 依赖原则:外 → 内
   └─ 内层不依赖外层

[六边形架构](端口适配器)
   ├─ 端口 = 接口(稳定)
   ├─ 适配器 = 实现(可替换)
   ├─ 1 个端口 N 个适配器
   └─ 应用通过端口与外部交互

[三种架构对比]
   ├─ 形式不同,本质相同
   ├─ 5 大核心要点:领域模型在中心 + 依赖指向内层 + 内层定义接口 + 外层实现接口 + 技术可替换
   └─ 都是"以领域模型为中心"

[防腐层(ACL)]
   ├─ 4 大职责:翻译 + 隔离 + 适配 + 保护
   ├─ 位置:基础层 / 应用层边界(不能放领域层)
   ├─ 跨上下文协作时都可能需要
   └─ 本质:下游拒绝遵奉上游,选择翻译
```

### DDD 4 天计划完整图

| Day | 主题 | commit | 视角 |
| :--- | :--- | :--- | :--- |
| **Day 1** | 战略设计 | 9-22 已发 | 业务怎么切 |
| **Day 2** | 战术设计 | 9-24 已发 | 代码怎么写 |
| **Day 3** | 进阶篇 | 9-27 上已发 | 怎么用得起来 |
| **Day 4** | **架构模式(本文)** | **9-27 下(本文)** | **统一视角** |

---

## 💬 最后一句话

> **"DDD 不是设计模式,不是架构,是一种服务业务的设计思想。"**
>
> **"三种架构表现形式不一样,本质相同:领域模型在中心,依赖指向内层。"**
>
> **"整洁讲分层,六边形讲端口适配器,DDD 讲职责划分——殊途同归。"**
>
> **"ACL 是防御性翻译,不是接收式兼容。"**
>
> **"下游拒绝遵奉上游,选择翻译——这是 ACL 的灵魂。"**
>
> **"领域层不知道外部模型长什么样——这是 DDD 的底线。"**

DDD 系列完整矩阵(7 篇 blog):

- 9-16 [Harness 工程](https://sunrong.site/posts/ai-practice/2026-09-16-harness-engineering.html)
- 9-17 [AI Coding 工程](https://sunrong.site/posts/ai-practice/2026-09-17-ai-coding-engineering.html)
- 9-18 [Agent Loop 5 大模式](https://sunrong.site/posts/ai-practice/2026-09-18-agent-loop-5-patterns.html)
- 9-20 [Harness 全家福](https://sunrong.site/posts/ai-practice/2026-09-20-harness-complete-system.html)
- 9-22 [DDD 战略设计](https://sunrong.site/posts/ai-practice/2026-09-22-ddd-strategic-design.html)— Day 1
- 9-24 [DDD 基础](https://sunrong.site/posts/ai-practice/2026-09-24-ddd-foundations.html)— Day 1+2
- 9-27 上 [DDD 进阶](https://sunrong.site/posts/ai-practice/2026-09-27-ddd-advanced.html)— Day 3
- **9-27 下 [DDD 架构模式(本文)](https://sunrong.site/posts/ai-practice/2026-09-27-ddd-architecture-patterns.html)**— Day 4

***

## 🛡️ 致良知 + 参考

| 项 | 内容 |
| :--- | :--- |
| **写作动机** | DDD 4 天计划 Day 4 架构模式(2 波素材整合),统一视角看整洁 + 六边形 + ACL |
| **致良知** | 所有洞察都来自公开学习材料 + 个人工程实践,无任何夸大 |
| **隐私** | 工作单位 / 职级 / 团队规模 等敏感信息已脱敏 |
| **个人经历** | 关联引用的是公开实践(AgentScope / 状态机化名),非内部信息 |

### 参考与延伸

- Robert C. Martin:**Clean Architecture**(2017)— 整洁架构
- Alistair Cockburn:**Hexagonal Architecture**(2005)— 六边形架构
- Vaughn Vernon:**Implementing Domain-Driven Design**(2013)— DDD 实战
- Eric Evans:**Domain-Driven Design**(2003)— DDD 圣经
- **阿里 COLA 架构**:DDD + 六边形 + CQRS

### 关联 blog

- **9-22 [DDD 战略设计](https://sunrong.site/posts/ai-practice/2026-09-22-ddd-strategic-design.html)** — Day 1
- **9-24 [DDD 基础](https://sunrong.site/posts/ai-practice/2026-09-24-ddd-foundations.html)** — Day 1+2
- **9-27 上 [DDD 进阶](https://sunrong.site/posts/ai-practice/2026-09-27-ddd-advanced.html)** — Day 3
- **9-27 下 [DDD 架构模式(本文)](https://sunrong.site/posts/ai-practice/2026-09-27-ddd-architecture-patterns.html)** — Day 4

***

**作者注**:本文是 DDD 4 天计划的架构模式篇(Day 4)——从"整洁架构"到"六边形架构"到"防腐层(ACL)"的完整统一视角。

如果你困惑于"DDD 分层 vs 整洁 vs 六边形到底什么关系",这一篇帮你彻底看清;如果你对接外部系统时不知道"怎么保护自己的领域模型",ACL 这一节帮你解惑。

> 本文首发于 [sunrong.site](https://sunrong.site/),Mr.Sun,2026-09-27。