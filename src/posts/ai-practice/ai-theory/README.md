---
title: AI Agent 论文系列：从 ReAct 到 AgentBench
icon: book
date: 2026-06-01
update: 2026-06-01
categories:
  - AI 实践
tags:
  - AI Agent
  - 论文学习
  - 系列索引
author: Mr.Sun
---***
# AI Agent 论文系列（11 篇）

> 系统学习 11 篇 AI Agent 领域核心论文，从基础范式到评测基准，构建完整的知识体系。

***
## 📚 论文列表（按学习顺序）

| # | 论文 | 核心概念 | 难度 | 链接 |
|---|------|---------|------|------|
| 1 | **ReAct** | 推理 + 行动循环 | ⭐⭐ | [详情](./react-paper-learning.md) |
| 2 | **Chain of Thought** | 思维链 | ⭐⭐ | [详情](./chain-of-thought-paper-learning.md) |
| 3 | **Toolformer** | 自监督学工具 | ⭐⭐⭐ | [详情](./toolformer-paper-learning.md) |
| 4 | **MetaGPT** | 角色化流水线 | ⭐⭐⭐ | [详情](./metagpt-paper-learning.md) |
| 5 | **AgentVerse** | 分层协作 | ⭐⭐⭐ | [详情](./agentverse-paper-learning.md) |
| 6 | **Voyager** | 终身学习三层架构 | ⭐⭐⭐⭐ | [详情](./voyager-paper-learning.md) |
| 7 | **MemGPT** | 分层存储（向量 + 持久）| ⭐⭐⭐⭐ | [详情](./memgpt-paper-learning.md) |
| 8 | **Computer Use** | 多模态操作鼠标键盘 | ⭐⭐⭐ | [详情](./computer-use-paper-learning.md) |
| 9 | **Agentic RAG** | RAG + 迭代检索 | ⭐⭐⭐ | [详情](./agentic-rag-paper-learning.md) |
| 10 | **Self-Discovering** | 原子推理模块自由组合 | ⭐⭐⭐⭐ | [详情](./self-discovering-paper-learning.md) |
| 11 | **AgentBench** | 多维度 Agent 评测基准 | ⭐⭐⭐ | [详情](./agentbench-paper-learning.md) |

***
## 🧠 架构演进理解

```
ReAct → MetaGPT → AgentVerse → Voyager
                              ↓
复杂度递进本质：任务越开放、horizon 越长
              → 需要越强的"记忆 + 学习 + 复用"能力
```

| 阶段 | 核心抽象 | 解决的核心问题 |
|------|---------|--------------|
| **基础范式** | ReAct、COT、Toolformer | 推理 + 行动 + 工具 |
| **协作模式** | MetaGPT、AgentVerse | 多 Agent 分工 |
| **持续学习** | Voyager、MemGPT | 经验积累 + 记忆系统 |
| **能力扩展** | Computer Use、Agentic RAG | 多模态 + 知识增强 |
| **自我进化** | Self-Discovering | 自主发现推理模式 |
| **评测体系** | AgentBench | 标准化基准 |

***
## 💡 关键洞察

1. **记忆系统是分水岭** - Voyager 和 MemGPT 解决了"长 horizon 任务"
2. **工具调用是基础设施** - ReAct 和 Toolformer 是后续所有论文的基石
3. **评测标准化是行业成熟的标志** - AgentBench 让"哪个 Agent 更好"可量化

***
## 🎯 适用读者

- 准备 AI Agent 方向面试的同学
- 想系统性了解 Agent 演进的工程师
- 关注最新 AI 进展的产品经理/架构师

***
_最后更新：2026-06-01_
