---
title: AI Coding 工程:从 4 大组件到 Harness 完整体系
icon: terminal
date: 2026-09-17
update: 2026-09-17
categories:
  - AI 实践
tags:
  - AI Coding
  - Harness
  - Agent
  - 上下文工程
  - 多 Agent
  - Hook
  - 工程治理
author: Mr.Sun
---***
# AI Coding 工程:从 4 大组件到 Harness 完整体系

> 昨天写了 Harness 工程(抽象层),今天写 AI Coding(落地层)。
> 4 波内容,4 个尺度:**微观**(Coding 项目内)→ **中观**(团队/组织)→ **宏观**(多 Agent)→ **实现层**(Hook 强制执行)。
> 关键字:**4 大组件 / 3 级成熟度 / 多 Agent 架构 / Agent Hook / Harness 是迭代出来的**。

***

## 📌 一句话核心

> **"AI Coding 不是用 AI 写代码,是给 AI 建一套 Harness,让它在 Coding 场景里活下去。"**

昨天讲 Harness 是抽象理论,今天讲它在 Coding 场景的具体落地。

***

<!-- more -->

## 📌 为什么写这篇

写完昨天的 Harness 工程,我意识到:**抽象层讲完,如果不落到具体场景,就是空中楼阁**。

今天上午重新学习 AI Coding 工程,把它跟 Harness 对齐,发现 AI Coding 其实是 Harness 的"最大用例"。

LLM 写代码(AI Coding)为什么在生产里翻车?
- LLM 写一半跑偏(没约束)
- LLM 改了一堆文件,不知道改了什么(没进度)
- LLM 改完,环境挂了(没一致性)
- LLM 多个任务并行,互相干扰(没状态)
- LLM 假装写完了(没验收)

**所有这些问题,本质都是 Harness 没做对。**

***

## 💎 观点 1:AI Coding 的 4 大核心组件 —— 最小可行 Harness

> **"4 大组件 = Harness 5 大子系统在 Coding 场景的最小可行实现(MVP)。"**

### 1.1 4 大组件总览

| # | 组件 | 对应 Harness 子系统 | 一句话作用 |
| --- | --- | --- | --- |
| 1 | **Agents.md** | ① 指令子系统 | 告诉 AI "怎么工作"(规则 / 流程 / 标准) |
| 2 | **init.sh** | ③ 环境子系统 | 强制环境一致性(本地 / CI / 生产) |
| 3 | **状态机** | ④ 状态子系统 | 追踪每个功能"做到哪了" |
| 4 | **progress.md** | ④ 状态子系统 | 跨会话的进度文件(长任务交接) |

**关键洞察**:**这 4 个组件加起来,就是一个 Coding 项目的最小可行 Harness**。

### 1.2 Agents.md —— 指令系统

**关键 3 个字**:**短、准、根**。

- **短**:不能写成长篇小说 —— LLM 看完要 1 秒内,人看完要 30 秒内
- **准**:每个规则都要"可执行",不要模糊描述
- **根**:放在仓库根目录,所有 Coding Agent 第一时间读到

**Agents.md 必须包含的 5 个部分**:

| 部分 | 内容 | 为什么 |
| --- | --- | --- |
| **核心规则** | 不能违反的硬规则(全局) | 防止幻觉 / 防止越权 |
| **工作流程** | 任务从开始到结束的标准步骤 | 防止漏步 / 防止乱序 |
| **工作规则** | 软规则(可违反但有代价) | 风格 / 命名 / 注释 |
| **任务完成标准** | "什么算做完"的可判定标准 | 防止 LLM 假装做完 |
| **失败案例** | 反向规则(不要做 X,因为 Y) | 从错误中学习 |

**Agents.md 应该长什么样(框架示例)**:

```markdown
# AI Agent 工作指令 — XXX 项目

## 核心规则(不可违反)
1. 不修改 _config/ 下的配置文件(只读)
2. 写代码必须先写测试(TDD)
3. 提交前必须跑 lint + 单元测试

## 工作流程(任务从开始到结束)
1. 读 progress.md,确认当前任务状态
2. 在 work_order/ 下创建任务文件
3. 实现代码 + 测试
4. 跑全部测试,确认全绿
5. 更新 progress.md,标注完成
6. 写 commit message(用 conventional commits)

## 工作规则(风格约定)
- 函数命名:snake_case
- 类注释:必须有 docstring
- 提交粒度:一个 commit 一个功能

## 任务完成标准(可判定)
- [ ] 代码已写
- [ ] 测试已写且通过
- [ ] lint 通过
- [ ] progress.md 已更新
- [ ] commit 已提交

## 失败案例(反向规则)
- ❌ 不要用 print 调试,要用 logging
  → 之前 print 在生产环境被截断,排查浪费 2 小时
- ❌ 不要直接改 master
  → 之前漏掉 code review,引入回归
- ❌ 不要在 commit message 用中文
  → GitHub Actions 抓不到,自动 release 失败
```

> **"Agents.md 是给 Agent 看的 README。"**

**我的连接:**

8 周深读 AgentScope 2.0 源码,提了 4 个 PR(#2166/#2167/#2217/#2343)。**每个 PR 的 review 反馈里,反复出现"Agents.md 没写这条规则"** —— 我后来专门补了"失败案例"章节,把每个 BadCase 都写进去。

### 1.3 init.sh —— 环境初始化

**关键词**:**复杂配置 + 强制一致性**。

**为什么需要 init.sh**:

| 问题 | 没有 init.sh | 有 init.sh |
| --- | --- | --- |
| **开发者本地** | "我电脑上能跑" | 跑 init.sh 就一样 |
| **CI 服务器** | "CI 跑挂了,本地能跑" | 跟本地一致 |
| **新成员加入** | 配环境配半天 | 跑 init.sh 5 分钟 |
| **生产部署** | "生产挂了,排查环境" | init.sh 是"环境基线" |

**init.sh 应该包含什么**:

| 模块 | 作用 | 例子 |
| --- | --- | --- |
| **系统依赖** | 装必要的系统包 | apt install / brew install |
| **语言运行时** | Python / Node / Go 版本 | pyenv install 3.11 |
| **项目依赖** | 用 pip / npm / go mod 装包 | pip install -r requirements.txt |
| **环境变量** | 配 .env 文件 | cp .env.example .env |
| **数据库初始化** | 建表 / 灌测试数据 | alembic upgrade head |
| **健康检查** | 验证环境是否 OK | python -c "import requests" |

**init.sh 的 5 个最佳实践**:

1. **幂等**:跑 10 遍和跑 1 遍效果一样
2. **可观测**:每一步都有 echo "✅ xxx done"
3. **可回滚**:失败了能 undo
4. **可并行**:能并行的步骤并发
5. **可配置**:超时时间 / 镜像源可配

> **"init.sh 不是脚本,是'环境基线'。"**

### 1.4 状态机 —— 功能清单

**关键词**:**功能粒度的状态追踪**。

**为什么是"状态机"而不是"清单"**:

| 维度 | 简单 Checklist | 状态机 |
| --- | --- | --- |
| **状态** | ☐ / ☑ | P0 / P1 / WIP / Done / Failed / Blocked |
| **依赖** | 无显式 | 显式定义"X 必须先于 Y" |
| **转换** | 无 | 有明规则"X 完成后才能进 Y" |
| **错误恢复** | 难 | 易(知道卡在哪一步) |

**状态机的 3 个关键属性**:

- **有限状态**:不要搞出 100 个状态,5-10 个足够
- **明确转换条件**:每一步都要可判定
- **可逆性**:支持 rollback(Blocked / Failed 可回 Pending)

**一个功能状态机的例子**:

```
[Pending] ──start──→ [In Progress] ──→ [Blocked]
                              │              │
                              ↓              ↓
                          [Review]       [Failed]
                              │
                              ↓
                          [Done]
```

**任务文件**:`work_orders/WO-XXX.md`

```yaml
id: WO-001
title: 用户登录接口
state: In Progress
owner: ai-agent
depends_on: []  # 没有依赖

transitions:
  In Progress → Review:
    - 写完代码
    - 测试通过
  Review → Done:
    - code review 通过
    - 合并到 main
```

### 1.5 progress.md —— 进度日志

**关键词**:**跨会话 + 状态**。

**核心定位**:

- **跨会话**:会话 1 跑 30 分钟 → 会话 2 接手 → 读 progress.md 继续
- **任务状态**:每个任务"做到哪了"
- **决策记录**:为什么这么做

**progress.md 应该在仓库里,而不是 LLM 的 context 里**:

| 维度 | LLM context 里的进度 | 仓库里的 progress.md |
| --- | --- | --- |
| **持久化** | LLM 死就没了 | 永久(跟代码一起入库) |
| **跨会话** | 难 | 易(下一个会话读文件) |
| **人类可读** | 难 | 易(看 PR diff 就懂) |
| **版本管理** | 无 | Git 历史完整 |
| **协作** | 难 | 易(所有人看同一个文件) |

**我的连接:**

AgentScope 4 PR 的 8 周学习过程中,`learning-journal` 分支(基于 main)就是用 progress.md 管理的。**没有 progress.md,8 周 553 个 commit 会彻底乱掉** —— 我可以随时切换上下文,3 个月后回来还能继续。

### 1.6 4 大组件的"必要但不充分"原则

**关键洞察**:**4 大组件是"必要"的,但不是"充分"的**。

它们是 Harness 的"骨架",要真正运行起来,还需要:
- **观点 2 的成熟度等级**(从个人到组织)
- **观点 3 的多 Agent 架构**(从 1 到 N)
- **观点 4 的 Hook 系统**(从建议到强制)

**没有这 3 个扩展,4 大组件就是"4 个孤立文件"**。

> **"Agents.md 是给 Agent 看的 README,progress.md 是 Agent 的日记本。"**

***

## 💎 观点 2:Harness 成熟度等级 —— 从个人到组织

> **"Harness 不能跳级 —— 直接做组织级是空中楼阁。"**

### 2.1 三级成熟度模型

```
  ┌────────────────────────────────────────────────────────┐
  │ 组织级:沙盒 + 成本监控(全公司视角)                      │
  │   "AI Coding 在公司可治理、可计费"                       │
  ├────────────────────────────────────────────────────────┤
  │ 团队级:共享规则 + CI + 共识变脚本(团队视角)              │
  │   "团队成员协作,规则统一"                                │
  ├────────────────────────────────────────────────────────┤
  │ 个人级:四件套 + 反馈循环(个人视角)                       │
  │   "我一个人 + AI Agent 就能用"                          │
  └────────────────────────────────────────────────────────┘
```

### 2.2 三级对比

| 维度 | 个人级 | 团队级 | 组织级 |
| --- | --- | --- | --- |
| **视角** | 我能用 | 我们能用 | 全公司能用 |
| **共享方式** | 本地(~/Agents.md) | 仓库(根目录) | 平台 / 服务 |
| **规则来源** | 我自己定 | 团队共识 | 组织标准 |
| **反馈闭环** | 个人 BadCase | 团队 BadCase 库 | 全公司 BadCase + 评测 |
| **CI** | 无 / 简单 | 必须有 CI | 全流程 CI + 监控 |
| **成本** | 不计(自己的 token) | 不计(团队预算) | 必须计(部门成本) |
| **沙盒** | 本地环境 | 容器化环境 | 隔离沙盒(生产级别) |
| **可观测** | 个人日志 | 团队 Dashboard | 平台监控 + 告警 |
| **示例** | 个人项目 + Claude Code | 团队 repo + Agents.md | 部门平台 + 统一网关 |

### 2.3 每个级别的"关键增量"

| 级别 | 上一级 → 这一级,新增什么 |
| --- | --- |
| **个人级**(0→1) | **从零到有** —— 4 大组件 + 反馈循环 |
| **团队级**(1→10) | **从独享到共享** —— 规则入仓 + CI 卡门 + 共识变脚本 |
| **组织级**(10→100) | **从用到治** —— 沙盒隔离 + 成本监控 + 可观测 |

### 2.4 团队级的核心:共识变脚本

**"共识变脚本"** 是团队级 Harness 的核心。

**含义**:团队里"大家都这么做"的隐性共识,要**显式写成脚本**。

**5 个具体例子**:

| 共识 | 脚本化 |
| --- | --- |
| 大家都用 Python 3.11 | init.sh 强制锁版本 |
| 大家都用 black 格式化 | CI 黑名单自动加 |
| 大家都用 conventional commits | commit-msg hook 校验 |
| 大家都跑测试再 commit | pre-commit hook 强制 |
| 大家都用某个 LLM 模型 | CI 校验配置文件 |

**关键洞察**:**共识是"软资产",脚本是"硬资产"**。共识走的人会忘,脚本永远在。

> **"共识变脚本 —— 团队级 Harness 的核心。"**

### 2.5 演进路径(关键)

```
个人级 (Month 0-3)
   ↓ 跑通 + 反馈循环产生价值
   ↓ 把规则沉淀到团队仓库
团队级 (Month 3-12)
   ↓ CI 卡门生效 + 团队共识沉淀
   ↓ 推广到部门 / 公司
组织级 (Month 12+)
   ↓ 沙盒 + 成本监控 + 可观测
   ↓ 治理 + 规模化
```

**关键**:**不能跳级**。直接做"组织级"是空中楼阁;团队数据共用。

***

## 💎 观点 3:多 Agent 系统架构 —— 从 1 到 N

> **"多 Agent ≠ 1 Agent × N,是会产生涌现的。"**

### 3.1 SubAgent 的定义

| 属性 | 含义 |
| --- | --- |
| **调用关系** | 被父 Agent 调用(不是独立启动) |
| **生命周期** | 受父 Agent 管控(父死,子死) |
| **任务范围** | 受限(只能做父 Agent 分配的子任务) |
| **对外暴露** | 不对外(对外只有父 Agent) |
| **任务来源** | 父类 Agent 管控和分配 |

**关键洞察**:**SubAgent 不是"独立的 Agent",是"父 Agent 的延伸"**。

### 3.2 多 Agent 系统的两种模式

```
模式 1:层级架构(Hierarchical)
  ┌──────────┐
  │ Top Agent│ (Orchestrator)
  └────┬─────┘
       │
   ┌───┴───┬───────┐
   ▼       ▼       ▼
┌─────┐ ┌─────┐ ┌─────┐
│Sub 1│ │Sub 2│ │Sub 3│
└──┬──┘ └──┬──┘ └──┬──┘
   │        │        │
   ▼        ▼        ▼
 Tools   Tools   Tools

模式 2:对等协作(Agent Team)
  ┌─────┐ ←→ ┌─────┐ ←→ ┌─────┐
  │Agent│     │Agent│     │Agent│
  │  A  │ ←→ │  B  │ ←→ │  C  │
  └─────┘     └─────┘     └─────┘
   (平级,直接对话)
```

### 3.3 模式 1:层级架构模式(Hierarchical)

| 维度 | 说明 |
| --- | --- |
| **结构** | 树形 — 顶层 Agent 是 Orchestrator,SubAgent 是叶子 |
| **控制** | 中心化 — 顶层 Agent 控制全局 |
| **通信** | 父子通信(单向/双向),同级不直接通信 |
| **任务** | 顶层拆解任务 → 分配给 SubAgent → 汇总结果 |
| **优点** | 职责清晰 / 可问责 / 调试简单 |
| **缺点** | 单点故障(顶层挂了全完)/ 协调成本高 / 涌现弱 |
| **适用场景** | 任务明确 / 需要问责 / 流程固定 |
| **真实案例** | Claude Code(主 Agent + Tool Agent)/ Cursor Composer |

**层级架构代码示例**(伪代码):

```python
async def orchestrator(user_request):
    # 1. 拆解任务
    subtasks = await llm.decompose(user_request)
    
    # 2. 并发调度 SubAgent
    results = await asyncio.gather(*[
        sub_agent.run(task) for task in subtasks
    ])
    
    # 3. 汇总 + 返回
    return await llm.synthesize(results)
```

### 3.4 模式 2:对等协作模式(Agent Team / Peer)

| 维度 | 说明 |
| --- | --- |
| **结构** | 网状 — 所有 Agent 平级 |
| **控制** | 分布式 — 没有 Orchestrator |
| **通信** | 任意 Agent 可直接通信 |
| **任务** | 共同目标,靠"投票 / 协商"完成 |
| **优点** | 鲁棒(无单点故障)/ 涌现(1+1+1+1 >> 4)/ 群体智慧 |
| **缺点** | 不可控 / 难调试 / 可能"议而不决" |
| **适用场景** | 探索性 / 需要涌现 / 创意任务 |
| **真实案例** | 算法大赛 4 Agent 群聊(Fable / Sol / K3 / DeepSeek) |

**对等协作代码示例**(伪代码):

```python
async def agent_team_round(question):
    # 1. 所有 Agent 各自回答
    answers = await asyncio.gather(*[
        agent.respond(question) for agent in team
    ])
    
    # 2. 互相 review(关键!)
    reviews = await asyncio.gather(*[
        agent.review(question, other_answer)
        for agent in team
        for other_answer in answers
    ])
    
    # 3. 投票 / 协商得出最终答案
    final = await team.vote(answers, reviews)
    return final
```

### 3.5 两种模式对比

| 维度 | 层级架构 | 对等协作(Agent Team) |
| --- | --- | --- |
| **结构** | 树形 | 网状 |
| **控制点** | 单一(Orchestrator) | 多个(每个 Agent) |
| **鲁棒性** | ⭐⭐(顶层挂 = 全挂) | ⭐⭐⭐⭐⭐(群体智慧) |
| **可调试** | ⭐⭐⭐⭐⭐(调用链清晰) | ⭐⭐(不可预测) |
| **可问责** | ⭐⭐⭐⭐⭐(谁干的清楚) | ⭐⭐(群体贡献,难追溯) |
| **涌现性** | ⭐⭐(中心化抑制涌现) | ⭐⭐⭐⭐⭐(群体激发涌现) |
| **协调成本** | ⭐⭐(中心调度便宜) | ⭐⭐⭐⭐(协商贵) |
| **适用任务** | 明确 / 流程化 / 工程 | 探索 / 创意 / 复杂 |
| **真实案例** | Claude Code / 测试平台 / Cursor | 算法大赛 4 Agent / AutoGen |

### 3.6 两种模式不是对立,是工具箱

**关键洞察**:**同一个系统里,两种模式可以共存**。

```
完整的多 Agent 系统:
  ┌──────────────────────────────────┐
  │   顶层:层级架构(全局协调)        │
  │   ┌──────┐ ┌──────┐ ┌──────┐    │
  │   │Sub A│ │Sub B│ │Sub C│    │
  │   └──┬───┘ └──┬───┘ └──┬───┘    │
  └─────┼────────┼────────┼────────┘
        │        │        │
        ▼        ▼        ▼
     (某 SubAgent 内部:
      对等协作模式 — 多个 worker 投票)
```

**真实案例**:AgentScope 集成测试时,顶层是 Orchestrator(层级),但 Orchestrator 内部调用 SubAgent 时,SubAgent 可能用对等协作(多个 Skill 投票选择最佳)。

### 3.7 反直觉洞察

- **多 Agent ≠ 1 Agent × N** —— 不是简单复制,会产生涌现
- **父子 Agent 不是"上下级",是"调用关系"** —— 没有"权威"
- **Agent Team 不一定更好** —— 协调成本可能超过收益
- **层级架构也可以涌现** —— SubAgent 内部可以是对等协作
- **SubAgent 的"任务受限"是优势不是缺陷** —— 防止 LLM 跑偏

> **"父子 Agent 不是上下级,是调用关系。"**
>
> **"SubAgent 的'任务受限'是优势不是缺陷,防止 LLM 跑偏。"**

***

## 💎 观点 4:Agent Hook 系统 —— 从建议到强制

> **"没有 Hook 的 Harness,就是个 LLM 跑裸。"**

### 4.1 Hook 的定义

| 属性 | 含义 |
| --- | --- |
| **形式** | 用户定义的 shell 命令(或脚本) |
| **触发** | 在 Agent 生命周期特定点**自动执行** |
| **本质** | 从"建议指导"升级到"强制的执行" |
| **本质** | 确定性的控制 |
| **本质** | 自动化的工作流 |

**关键洞察**:**Hook 决定了 Harness 是"建议"还是"强制"** —— 没有 Hook 的 Harness,就是 LLM 跑裸。

### 4.2 本质:从建议到强制

| 维度 | 建议指导(Prompt) | Hook 强制执行 |
| --- | --- | --- |
| **形式** | "请运行测试" | pre-commit hook 强制跑测试 |
| **阻挡** | LLM 可忽略 | **系统拦截** |
| **可靠性** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **可绕过** | 容易(LLM 一句话就跳了) | 难(改 hook 才能绕) |
| **适用** | 软规则(风格 / 提示) | 硬规则(安全 / 准入) |

### 4.3 Hook 的 5 大设计原则

| # | 原则 | 含义 |
| --- | --- | --- |
| 1 | **成功静默** | 成功 → 0 输出,不打扰 LLM |
| 2 | **失败注入详细信息** | 失败 → 把错误详细注入 LLM,让它能修复 |
| 3 | **退出码标准化** | 0 / 2 / 1 是"语言",不是数字 |
| 4 | **可组合** | 多个 Hook 并行执行,各管各的 |
| 5 | **可禁用** | 配置开关,紧急时可跳过 |

### 4.4 退出码语义(关键)

| 退出码 | 含义 | LLM 行为 | 系统行为 |
| --- | --- | --- | --- |
| **exit 0** | 成功 | 继续下一步 | 静默 |
| **exit 2** | **阻断** | **必须修复**(错误注入) | 中断当前操作 |
| **exit 1** | 系统错误 | 标记异常 | 报警,但不阻断 |

**关键洞察**:**exit 2 是 Hook 的"灵魂"** —— 只有"阻断"才能让 LLM 真的"听进去"。

### 4.5 常见 Hook 类型(按生命周期)

| Hook 类型 | 触发时机 | 典型场景 | 注入什么 |
| --- | --- | --- | --- |
| **会话启动前** | Agent 启动时 | 加载项目上下文 / AGENTS.md | 配置 / 初始 Prompt |
| **任务完成时** | Agent 完成任务 | 自动 commit / 通知 | 进度更新 |
| **工具调用前** | Tool 调用前 | 权限校验 / 危险操作拦截 | 拦截错误 |
| **工具调用后** | Tool 调用后 | 结果验证 / 数据清理 | 验证错误 |
| **commit 提交后** | Git commit 后 | CI 触发 / 文档更新 | 自动化流程 |
| **用户输入时** | User 发消息时 | 上下文检索 / 注入 | 相关背景 |

### 4.6 Hook 应用的 4 大领域

| 领域 | 例子 |
| --- | --- |
| **代码检查** | lint / 单元测试 / 类型检查(Pre-commit hook) |
| **指令注入** | 会话开始时加载 AGENTS.md(SessionStart hook) |
| **工作检查** | 进度更新 / 状态机推进(PostToolUse hook) |
| **权限校验** | 危险操作拦截(PreToolUse hook) |

### 4.7 Hook 是 Ralph 的灵魂

**Ralph** = 一种 Agent 工作流系统(参考张刚演讲"软件开发是发现和探索"提到的 Ralph flow)。

> **没有 Hook 的 Ralph = 失控的 Agent**。

**Ralph 靠什么运行?** —— Hook 决定的步骤确定性。
- 每一步"做什么"由 Hook 强制
- 每一步"做到哪"由 Hook 推进
- 每一步"对不对"由 Hook 验证

### 4.8 Hook 生命周期(3 阶段)

```
┌─────────────────────────────────────────────────────────────┐
│ 阶段 1:会话启动阶段(Agent 初始化)                          │
│   - SessionStart hook                                      │
│   - 加载项目配置 / 注入初始 Prompt / 设置环境              │
├─────────────────────────────────────────────────────────────┤
│ 阶段 2:Agentic Loop 执行过程(主循环)                       │
│   - UserPromptSubmit: 用户输入时                          │
│   - PreToolUse: 工具调用前                                │
│   - PostToolUse: 工具调用后                               │
│   - Stop: Agent 停下(完成任务)                           │
├─────────────────────────────────────────────────────────────┤
│ 阶段 3:SubAgent 执行中(多 Agent 场景)                      │
│   - SubagentStart: SubAgent 启动                          │
│   - SubagentStop: SubAgent 完成                           │
│   - 父子状态同步 / 跨 Agent 进度协同                       │
└─────────────────────────────────────────────────────────────┘
```

### 4.9 Hook 解析 5 步流程

```
事件触发(event)
   ↓
匹配器检查(matcher check) — 哪些 hook 关心这个事件?
   ↓
处理器执行(handler) — 执行 hook 脚本
   ↓
并行执行(parallel) — 多个 hook 并行,不互相阻塞
   ↓
退出码检查(exit code) — 0/2/1 决定下一步
```

**关键设计**:**匹配器 + 并行** 让 Hook 系统"高性能 + 低延迟"。

### 4.10 Hook 实战示例

#### 示例 1:Pre-commit Hook(代码检查)

```bash
#!/bin/bash
# .git/hooks/pre-commit
# 成功静默 - 不输出
# 失败注入详细信息 - 阻断并打印

set -e

echo "🔍 Running pre-commit checks..."

# 1. Lint 检查(退出码非 0 → exit 2 阻断)
black --check src/ 2>&1
flake8 src/ 2>&1

# 2. 单元测试
pytest tests/ -q 2>&1 || {
    echo "❌ Tests failed. Fix before committing."
    exit 2  # 阻断 commit
}

# 3. 成功静默
exit 0
```

#### 示例 2:SessionStart Hook(指令注入)

```bash
#!/bin/bash
# SessionStart hook
# 把项目配置注入到 LLM context

# 1. 加载项目 AGENTS.md
if [ -f "AGENTS.md" ]; then
    echo "=== Project Instructions ==="
    cat AGENTS.md
fi

# 2. 加载 progress.md(让 LLM 知道当前进度)
if [ -f "progress.md" ]; then
    echo ""
    echo "=== Current Progress ==="
    head -50 progress.md
fi

# 3. 加载最近 5 个 commit
echo ""
echo "=== Recent Commits ==="
git log --oneline -5

exit 0  # 成功静默
```

#### 示例 3:PreToolUse Hook(权限校验)

```bash
#!/bin/bash
# PreToolUse hook
# Tool 调用前的权限校验

TOOL_NAME="$1"
TOOL_ARGS="$2"

# 1. 危险 Tool 列表
DANGEROUS_TOOLS="rm -rf dd mkfs fdisk"

# 2. 检查
if echo "$DANGEROUS_TOOLS" | grep -q "$TOOL_NAME"; then
    echo "❌ Dangerous tool blocked: $TOOL_NAME"
    echo "Reason: Destructive operation requires manual approval."
    echo "Fix: Use a safer alternative or ask user for confirmation."
    exit 2  # 阻断
fi

exit 0
```

### 4.11 AgentScope 2.0 钩子 vs Hook(关键关联)

**AgentScope 2.0 提供的钩子**(用户实战):

| AgentScope 钩子 | 等价 Hook | 作用 |
| --- | --- | --- |
| `on_system_prompt` | **SessionStart** | 系统提示注入(动态拼装) |
| `on_reply` | **PostModelCall** | 回复后处理(过滤 / 转换) |
| `on_model_call` | **PreModelCall** | 模型调用前(上下文检索注入) |
| `on_acting` | **PreToolUse** | Tool 调用前(权限校验) |

**关键洞察**:**AgentScope 钩子 = Claude Code Hook 的"Python 实现版"** —— 同样的生命周期,不同的 API。

**我的连接:**

AgentScope 2.0 提的 4 个 PR(#2166/#2167/#2217/#2343)里,有两个跟"钩子"直接相关:
- PR #2217(已合并)修了一个 `on_reply` 钩子的"reasoning-acting 轮数重复计数"bug
- PR #2343(待 review)是 RAG 检索的钩子逻辑

**没钩子,AgentScope 这种框架跑不起来** —— 它就是用钩子串起整个系统。

### 4.12 Hook 的反直觉洞察

- **Hook 不是"功能",是"约束"** —— 限制 LLM 行为的工具
- **成功静默 ≠ 无用** —— 好的 Hook 是"看不见的"
- **失败注入 ≠ 报错** —— 要给 LLM "可执行的建议"
- **Hook 越多 ≠ 越好** —— 每个 Hook 都有维护成本
- **Hook 的退出码是有语义的** —— 0 / 2 / 1 不是数字,是"语言"
- **Hook 可以替代 Prompt** —— 把"软规则"从 Prompt 移到 Hook,更可靠
- **Hook 是 Harness 的"边界"** —— LLM 不能跨越的边界

> **"Hook 决定了 Harness 是'建议'还是'强制'。"**
>
> **"好的 Hook 是'看不见的',坏 Hook 是'被绕过的'。"**

***

## 💎 观点 5:Harness 是迭代出来的,不是设计出来的

> **"没有'完美的 Harness',只有'一直在迭代的 Harness'。"**

### 5.1 反直觉洞察

这是整个 AI Coding 工程最反直觉、也最重要的一个观点。

| 维度 | 传统软件工程 | Harness 工程 |
| --- | --- | --- |
| **目标** | 一次设计完美 | 持续适配,边跑边改 |
| **设计哲学** | 事前详细设计(Big Design Up Front) | 最小可行 + 快速迭代 |
| **变更成本** | 高(改架构很贵) | 低(改 Prompt / 改 Tool) |
| **核心交付** | 设计文档 | 能跑 + 能迭代 |
| **测试方式** | 设计完成后写测试 | 边跑边写测试 |

### 5.2 为什么 Harness 不能"设计"

1. **LLM 不可预测** —— 你设计得再完美,LLM 的实际行为也跟设计不一样
2. **真实场景比想象的复杂** —— 没跑过就不知道坑在哪
3. **用户需求会变** —— Harness 是为用户服务的,用户变 Harness 就得变
4. **反馈比设计重要** —— 一个 BadCase 抵 10 个设计假设

### 5.3 迭代的具体路径

```
Day 1:  写 Agents.md v0.1 (50 行,够用就行)
Day 7:  跑 5 个任务,发现 3 类 BadCase
Day 7:  v0.2: 加 3 条失败案例到 Agents.md
Day 30: 跑 30 个任务,提炼出 10 条规则
Day 30: v1.0: Agents.md 重构,init.sh 雏形
Day 90: 团队开始用,提出 5 条新要求
Day 90: v2.0: 加 CI 卡门 + 共享规则
Day 180: 跨团队推广,加沙盒 + 成本监控
Day 180: v3.0: 组织级 Harness
```

### 5.4 迭代的元规则

- **先跑起来**:v0.1 比"完美设计"重要 100 倍
- **失败驱动**:每个 BadCase 都是迭代的"驱动力"
- **快速反馈**:反馈周期越短,迭代越快
- **保持简单**:复杂度是 Harness 腐化的根源
- **允许重写**:v0.1 → v1.0 → v2.0 是"重写",不是"修改"

> **"一个 BadCase 抵 10 个设计假设。"**
>
> **"v0.1 比'完美设计'重要 100 倍。"**

### 5.5 我的连接(8 周学习的真实写照)

8 周深读 AgentScope 2.0 源码,完整经历了这个迭代过程:

- **W1-W2**:写"零碎笔记" → 提 1 个 PR
- **W3-W4**:BadCase 出现 → 提 2 个 PR
- **W5-W6**:规则沉淀到 LEARNING.md → 提 3 个 PR
- **W7-W8**:团队 / 社区反馈 → 提 4 个 PR

**关键洞察**:**8 周 = Harness 迭代的完整周期**(从个人级到团队级)。

**我没做的事**:**没有"先设计完美的 8 周计划"**。我每周都根据反馈调整下周计划 —— 这就是 Harness 思维。

***

## 📌 总结:AI Coding 工程的 4 层次 Harness 体系

### 一句话总结

> **"AI Coding = Harness 在 Coding 场景的 4 层次落地:4 组件(微观)+ 3 等级(中观)+ 多 Agent(宏观)+ Hook(实现)。"**

### 4 层次的完整关系

| 层次 | 解决什么 | 落地形式 | Harness 子系统 |
| --- | --- | --- | --- |
| **微观** | Coding 项目内 | 4 大组件 | ① 指令 + ③ 环境 + ④ 状态 |
| **中观** | 团队/组织 | 3 级成熟度 | ② 工具 + ③ 环境 + ⑤ 反馈 |
| **宏观** | 1 → N 个 Agent | 多 Agent 架构 | ② 工具 + ④ 状态 |
| **实现层** | 从建议到强制 | Agent Hook | ⑤ 反馈(核心) |

### 跟昨天 Harness 工程 blog 的关系

| 维度 | 9-16 Harness 工程(已发) | 9-17 AI Coding 工程(本文) |
| --- | --- | --- |
| **定位** | 抽象层(WHY) | 具体层(HOW) |
| **视角** | 4 大支柱 + 5 大子系统 | 4 大组件 + 3 等级 + 多 Agent + Hook |
| **适用** | 所有 AI Agent 场景 | Coding 场景 |
| **关系** | 是本文的理论基础 | 是 Harness 的"最大用例" |

**两篇 blog 的关系**:**第 2 篇是第 1 篇的"案例研究"**。

### 4 层次心法

1. **微观**:4 大组件 —— 最小可行 Harness(从零到一)
2. **中观**:3 级成熟度 —— 个人 → 团队 → 组织(从 1 到 10)
3. **宏观**:多 Agent 架构 —— 1 → N(从 10 到 100)
4. **实现层**:Agent Hook —— 从建议到强制(让 Harness "硬"起来)
5. **灵魂**:Harness 是迭代出来的(贯穿所有层次)

### 给工程师的行动建议

**如果你正在做 AI Coding:**

- **本周**:写一份 `AGENTS.md`(哪怕 20 行,够用就行)
- **本月**:写 `init.sh`,跑通"环境一致性"
- **本季度**:建状态机 + progress.md,让任务可追踪
- **半年内**:团队共用 Agents.md + 共识变脚本(团队级 Harness)
- **一年内**:上多 Agent 架构(SubAgent + Agent Team)
- **持续**:加 Hook,让软规则变硬约束

**如果你正在选职业方向:**

- ❌ 别再当"Prompt Boy" —— 会被模型学走
- ✅ 当 Harness Engineer —— 短期护城河(1-2 年)
- ✨ 成为 Agent 资产管理者 —— 长期护城河(5+ 年)

***

## 💬 最后一句话

> **"AI Coding 的真正护城河,不是 LLM 用得多熟,是 Harness 建得多深。"**
>
> **"4 组件是骨架,3 等级是节奏,多 Agent 是规模,Hook 是牙齿,迭代是血液。"**
>
> **"5 个加起来 = 一个能在 Coding 场景活下去的 AI 团队。"**

Harness 不是"调 LLM",也不是"写 Prompt",**它是 AI 时代的基础设施思维**。

跟传统软件工程"代码资产化"完全一致 —— 你写的代码不是给自己用的,是给团队和未来用的。

**Harness 的私有资产 + 反馈系统 + Hook 强制 = AI 时代的"代码资产 + 治理框架"**。

***

## 🛡️ 隐私 + 致良知说明

| 项 | 内容 |
| --- | --- |
| **写作动机** | 2026-09-17 上午重新学习 AI Coding 工程,把核心思考沉淀 |
| **隐私处理** | 所有工作单位 / 职级 / 团队规模 等敏感信息已脱敏 |
| **个人经历** | "我的连接"段引用的是公开实践(AgentScope 4 PR / learning-journal 8 周 commit),非内部信息 |
| **致良知** | 本文所有洞察都来自公开学习材料 + 个人工程实践,无任何夸大 |

***

**作者注**:本文是 AI Coding 工程学习的完整复盘,延续昨天的 Harness 工程 blog,从抽象层落到具体层。如果你在做 AI Coding 项目,欢迎交流。