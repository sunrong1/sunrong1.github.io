---
title: ReAct 论文深度解读：让大模型学会"边想边做"
icon: brain
date: 2026-04-28
update: 2026-04-28
categories:
  - AI 实践
tags:
  - AI Agent
  - ReAct
  - CoT
  - 论文解读
  - LLM
author: Mr.Sun
star: true
---

# ReAct 论文深度解读：让大模型学会"边想边做"

> ReAct = **Re**asoning + **Act**ing  
> 论文：Yao et al., 2023, Google Research + Princeton  
> 本文记录我的论文学习过程与核心理解

<!-- more -->

## 一、背景：CoT 的局限性

在 ReAct 之前，**Chain-of-Thought (CoT)** 已经成为提升 LLM 推理能力的标配方法。

### CoT 解决了什么问题？

| 问题 | 说明 |
|------|------|
| 模型推理过程不透明 | CoT 让模型展示思考链 |
| 复杂问题难以分解 | 逐步推理更容易正确 |
| 小模型也能有推理能力 | 配合 Prompt 工程效果显著 |

### CoT 有什么问题？

**核心缺陷：CoT 是在"闭门造车"**

```
CoT 的思考链：
"我认为这个问题应该..."
"根据我的推理，下一步是..."
"可能的答案是..."
```

问题在于：
- ❌ 模型不知道外部世界的真实情况
- ❌ 推理过程中的错误无法被发现和纠正
- ❌ 容易产生"幻觉"（Hallucination）
- ❌ 缺乏事实依据支撑

---

## 二、ReAct 核心思想

### 2.1 论文基本信息

| 项目 | 信息 |
|------|------|
| 全称 | ReAct: Synergizing Reasoning and Acting in Language Models |
| 作者 | Shunyu Yao, Jeffrey Zhao, et al. (Google Research + Princeton) |
| 时间 | 2023 年 |
| 开源 | https://react-yh2.fly.dev/ |

### 2.2 ReAct 三要素

ReAct 的核心是把 **Reasoning（思考）** 和 **Acting（行动）** 结合起来，形成一个闭环：

```
┌─────────────────────────────────────────────────────┐
│                    ReAct 循环                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│    ┌─────────┐                                      │
│    │ Thought │ ◄─── 思考：我应该做什么？             │
│    └────┬────┘                                      │
│         │                                           │
│         ▼                                           │
│    ┌─────────┐                                      │
│    │ Action  │ ◄─── 行动：调用外部工具               │
│    └────┬────┘                                      │
│         │                                           │
│         ▼                                           │
│    ┌─────────────┐                                  │
│    │ Observation  │ ◄─── 观察：获取真实世界反馈      │
│    └──────┬──────┘                                  │
│           │                                         │
│           └─────────────────────────────────────────┘
```

| 组件 | 英文 | 作用 | 举例 |
|------|------|------|------|
| **Thought** | 思考 | 推理分析，制定策略 | "我需要先查上海天气" |
| **Action** | 行动 | 调用外部工具 | `search_weather("上海")` |
| **Observation** | 观察 | 获取真实反馈 | `25°C, 晴天, 紫外线强` |

### 2.3 对比 CoT

| 能力 | CoT | ReAct |
|------|-----|-------|
| 展示思考过程 | ✅ | ✅ |
| 调用外部工具 | ❌ | ✅ |
| 获取真实反馈 | ❌ | ✅ |
| 纠正推理错误 | ❌ | ✅ |
| 事实依据 | ❌ | ✅ |

---

## 三、核心创新：Observation 反馈机制

### 3.1 为什么 Observation 如此重要？

**Observation 解决了 CoT 的致命弱点：无法获得真实世界反馈**

```
没有 Observation（CoT）：
想 → 想 → 想 → 一直想 → 可能一直错

有 Observation（ReAct）：
想 → 做 → 观察 → 想 → 做 → 观察 → 持续纠错
```

### 3.2 协同效应 (Synergy)

论文的核心发现是：**ReAct + CoT 协同 > 单独使用**

| 模式 | 特点 | 效果 |
|------|------|------|
| 单独 CoT | 思考强，但可能胡思乱想 | 推理链清晰，但可能偏离事实 |
| 单独 ReAct | 有反馈，但推理链可能松散 | 事实准确，但组织性差 |
| **ReAct + CoT** | **思考有方向，反馈能纠错** | **最优效果** |

### 3.3 效果提升

> 在 HotpotQA、Fever 等多跳推理任务上，**ReAct + CoT 协同比单独 CoT 精度提升约 10-15%**，比单独 ReAct 也有明显提升。

---

## 四、典型工作流程

### 4.1 单轮交互

```
问题：上海今天适合穿什么？

Thought: 我需要先查一下上海的天气情况
Action: search_weather(query="上海天气")
Observation: 温度 25°C, 天气晴, 紫外线指数较高
Thought: 根据天气情况，建议穿薄外套遮阳，搭配长裤
Answer: 建议穿薄外套 + 长裤，需注意防晒
```

### 4.2 多轮复杂推理

```
问题：特斯拉 CEO 马斯克是哪里人？

Thought: 需要先确认"特斯拉 CEO 马斯克"指的是谁
Action: search(query="马斯克 特斯拉 CEO")
Observation: 埃隆·马斯克 (Elon Musk)，南非出生
Thought: 马斯克出生于南非比勒陀利亚，现在是美国公民
Answer: 埃隆·马斯克出生于南非比勒陀利亚，后成为美国公民
```

### 4.3 错误纠正场景

```
问题：华为是哪年成立的？

Thought: 华为应该是 1987 年成立的
Action: search(query="华为公司成立年份")
Observation: 华为技术有限公司于 1987 年在中国深圳注册成立
Thought: 我的记忆是对的，华为确实是 1987 年成立
Answer: 华为于 1987 年在中国深圳成立
```

---

## 五、ReAct 的意义与影响

### 5.1 对 AI Agent 架构的影响

ReAct 为后来的自主 Agent 系统奠定了基础：

```
ReAct (2023)
    │
    ├──► AutoGPT (2023) - 自主执行任务
    │
    ├──► AgentScope (2024) - 多智能体协作
    │
    └──► 各类 Agent 框架的标配
```

### 5.2 与其他技术的关系

| 技术 | 时间 | 核心思想 | 与 ReAct 的关系 |
|------|------|----------|-----------------|
| CoT | 2022 | 展示思考链 | ReAct 继承了 Thought |
| ReAct | 2023 | 边想边做 | 基础框架 |
| Reflexion | 2023 | 自我反思 | ReAct + 反思机制 |
| Plan-and-Execute | 2023 | 规划优先 | ReAct 的变体 |

### 5.3 局限性

| 局限性 | 说明 |
|--------|------|
| 工具调用成本 | 每次 Action 都有 API 调用开销 |
| 推理长度增加 | Thought + Action + Observation 增加 token 消耗 |
| 循环依赖风险 | 可能陷入思考循环 |
| 工具质量依赖 | Action 效果依赖工具本身的质量 |

---

## 六、实践建议

### 6.1 什么时候用 ReAct？

| 场景 | 推荐原因 |
|------|----------|
| ✅ 需要获取实时信息 | 天气、新闻、股价等 |
| ✅ 多跳推理任务 | 需要多个步骤的事实支撑 |
| ✅ 避免幻觉 | 需要事实依据的场景 |
| ✅ 外部 API 集成 | 需要操作数据库、搜索等 |

### 6.2 与其他方法结合

```
推荐组合：

ReAct + CoT prompting
    │
    ├── Thought 部分使用 CoT 风格（结构化推理）
    │
    └── Action + Observation 部分使用 ReAct（工具调用）

ReAct + Reflexion
    │
    ├── ReAct 负责正常执行
    │
    └── Reflexion 负责事后反思和错误纠正
```

---

## 七、总结

### 核心要点

> **ReAct = Reasoning（思考）+ Acting（行动）**

| 要点 | 内容 |
|------|------|
| **创新点** | 引入 Observation，让模型获得真实世界反馈 |
| **核心价值** | 解决 CoT"闭门造车"的问题 |
| **关键发现** | ReAct + CoT 协同效果最优 |
| **影响** | 成为 AI Agent 的标配架构 |

### 我的理解

ReAct 的本质是 **把 LLM 变成了一个"会思考的执行器"**：

```
传统 LLM → 只会"想"
CoT LLM  → 展示思考过程
ReAct LLM → 边想边做，通过行动验证思考
```

> **Thought = 内心独白**（我在想什么）  
> **Action = 外部行动**（我做了什么）  
> **Observation = 感官输入**（我看到了什么结果）

---

## 八、参考资料

| 资料 | 链接 |
|------|------|
| 论文 | https://arxiv.org/abs/2210.03629 |
| 项目主页 | https://react-yh2.fly.dev/ |
| GitHub | https://github.com/ysymyth/ReAct/ |

---

**相关阅读：**

- [AgentScope 多智能体协作实战](mem0-agentscope-comparison.md)
- [OpenClaw vs Hermes Agent 对比](openclaw-hermes-comparison.md)
- [AI Agent 训练路线图](ai-agent-training-outline.md)


---

欢迎交流讨论，我的 blog：[sunrong.site](https://sunrong.site)
