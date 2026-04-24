# AI Agent 高级技能：Prompt Engineering 到多 Agent 协作

**作者：** max 爸爸  
**日期：** 2026-04-24  
**标签：** AI Agent, Claude Code, Prompt Engineering, RAG, 多 Agent, 面试总结

---

## 前言

本文是 Claude Code 学习两周实战总结的续篇。在[上篇文章](https://sunrong1.github.io/ai-practice/claude-code/claude-code-weekly-summary/)中，我记录了 Agent Loop、Context Management、Planning、Hooks、Memory 等核心基础知识的学习。

这篇文章聚焦于**高级技能**：Prompt Engineering、RAG 向量检索、计划生成提示词、Token 裁剪、错误处理、以及多 Agent 协作。这些是面试和实战中经常被问到的深度内容。

---

## 1. Prompt Engineering（提示词工程）

### 1.1 为什么 Prompt Engineering 重要？

Prompt Engineering 解决的核心问题是**如何通过设计输入提示词，引导 LLM 产生准确、一致、可控的输出**。

| 问题 | 影响 |
|------|------|
| 同样的问题，不同 Prompt 效果差异巨大 | 直接影响任务效果 |
| LLM 能力取决于输入质量 | 垃圾输入 = 垃圾输出 |

### 1.2 核心技巧

| 技巧 | 适用场景 | 示例 |
|------|----------|------|
| **Few-Shot** | 需要特定格式 | JSON、代码结构 |
| **Chain of Thought** | 复杂推理 | 数学题、逻辑分析 |
| **角色设定** | 专业领域 | "你是一个 Python 专家" |
| **输出格式** | 结构化需求 | "用 JSON 格式返回" |

### 1.3 Few-Shot vs Chain of Thought

| 技巧 | 本质 | 核心作用 |
|------|------|----------|
| **Few-Shot** | 提供输入-输出示例 | 示范输出模式 |
| **Chain of Thought** | 引导逐步推理 | 激发推理能力 |

**一句话区分：**
> Few-Shot = "看例子学格式"  
> CoT = "一步步思考"

---

## 2. RAG 与向量检索

### 2.1 为什么需要 RAG？

LLM 有两大局限：
- **知识过时**：训练数据有截止日期
- **幻觉**：可能编造答案

RAG（检索增强生成）让 LLM 能获取**实时信息**和**私有知识**。

### 2.2 RAG 核心流程

```
用户问题 → 检索 → 找到相关文档 → 注入 Prompt → LLM 生成答案
```

| 步骤 | 技术 |
|------|------|
| 检索 | 向量数据库（ChromaDB/Qdrant） |
| Embedding | 文本 → 向量 |
| 相似度搜索 | 余弦相似度 |

### 2.3 RAG vs Fine-tuning

| 维度 | RAG | Fine-tuning |
|------|-----|-------------|
| 本质 | 检索外部知识 | 训练模型参数 |
| 知识更新 | 快（换文档） | 慢（重新训练） |
| 成本 | 低 | 高 |
| 适用场景 | 知识库问答 | 风格适配 |

---

## 3. 计划生成提示词

### 3.1 核心问题

计划生成解决的核心问题是**如何将复杂任务拆解为可执行的小步骤，并确定合理的执行顺序**。

### 3.2 两种规划模式

| 模式 | 本质 | 适用场景 |
|------|------|----------|
| **一次性规划** | 先想好全部，再行动 | 简单明确、路径可预知 |
| **增量规划** | 边做边想，逐步逼近 | 复杂、探索性强 |

### 3.3 LLM 生成 vs 硬编码

| 方案 | 知识来源 | 优势 |
|------|----------|------|
| **硬编码** | 预定义在代码里（静态） | 稳定、可预测 |
| **LLM 生成** | 模型权重 + 当前上下文（动态） | 泛化能力强 |

---

## 4. Token 裁剪

### 4.1 为什么按 Token 裁剪？

不同消息的长度差异巨大：
- "你好" = 2-3 tokens
- 长段落 = 50+ tokens

按条数裁剪不公平，可能导致上下文过长或过短。

### 4.2 裁剪优先级

| 优先级 | 消息类型 | 是否裁剪 |
|--------|----------|----------|
| 🔒 最高 | System | ❌ 不裁剪 |
| 🟢 高 | 最近对话 | 优先保留 |
| 🔴 低 | 最老对话 | 优先丢弃 |

### 4.3 System 消息过长怎么办？

**标准做法：System 消息不裁剪，而是精简 Prompt 本身。**

---

## 5. 错误处理与重试

### 5.1 错误分类

| 错误类型 | 是否重试 | 原因 |
|----------|----------|------|
| 网络超时 | ✅ | 临时抖动 |
| 服务限流 | ✅ | 等待后可恢复 |
| 参数错误 | ❌ | 重试也失败 |
| 权限不足 | ❌ | 需要授权 |

### 5.2 指数退避

**核心思想：** 失败后等待时间指数增长（1s → 2s → 4s → 8s）

**目的：**
1. 给服务端恢复时间
2. 避免请求风暴（雪崩）

### 5.3 判断标准

> **临时性错误** → 可重试  
> **永久性/逻辑性错误** → 不重试

---

## 6. 多 Agent 协作

### 6.1 为什么需要多 Agent？

单一 Agent 的局限：
- 能力单一
- 上下文污染
- 难以扩展

### 6.2 架构图

```
                    用户请求
                        ↓
            ┌─────────────────────┐
            │  Orchestrator Agent  │
            │  （任务分解+结果汇总）│
            └─────────────────────┘
                ↓         ↓         ↓
            ┌─────┐  ┌─────┐  ┌─────┐
            │Agent│  │Agent│  │Agent│
            │  A  │  │  B  │  │  C  │
            └─────┘  └─────┘  └─────┘
```

### 6.3 执行模式

| 模式 | 执行方式 | 耗时 |
|------|----------|------|
| **串行** | 任务1 → 任务2 | T1 + T2 |
| **并行** | 任务1 ∥ 任务2 | max(T1, T2) |

---

## 7. 面试核心知识点总结

### 7.1 一句话速记

| 知识点 | 一句话 |
|--------|--------|
| Agent Loop | LLM 思考 → 工具调用 → 结果反馈 → 循环 |
| Context | 控制 Token 数量，避免超限 |
| Planning | 任务拆解，确定执行顺序 |
| Hooks | 不改核心代码，插入扩展逻辑 |
| Memory | 跨会话持久化重要信息 |
| MCP | 标准化外部工具调用协议 |
| Error Handling | 临时错误重试，永久错误放弃 |
| RAG | 检索增强生成，解决知识不足 |
| Token 裁剪 | 按 Token 数量控制上下文长度 |
| 多 Agent | 任务分解，并行/串行执行 |

### 7.2 面试高频问题

| Q | 核心答案 |
|---|----------|
| Tool Calling 流程？ | LLM 返回工具名+参数 → Agent 执行 → 结果反馈 |
| 滑动窗口 vs 摘要？ | 窗口=截断，摘要=压缩 |
| RAG vs Fine-tuning？ | RAG 不改参数，Fine-tuning 改参数 |
| Few-Shot 为什么有效？ | 学习格式 + 激活知识 + 对齐期望 |
| 指数退避目的？ | 给服务恢复时间 + 避免雪崩 |

---

## 8. 练习项目汇总

| 项目 | 路径 | 核心技能 |
|------|------|----------|
| Todo CLI | `~/repos/claude-lab/day3_todo` | CLI 开发、单元测试 |
| 简单 Agent Loop | `~/repos/claude-lab/day4_agent_loop` | 循环机制 |
| 真实 API 调用 | `~/repos/claude-lab/day4_real_agent` | MiniMax API |
| Context Manager | `~/repos/claude-lab/day5_context` | 滑动窗口 |
| Hooks | `~/repos/claude-lab/day7_hooks` | 插件机制 |
| Memory | `~/repos/claude-lab/day8_memory` | 持久化 |
| MCP 协议 | `~/repos/claude-lab/day9_mcp` | 工具调用协议 |
| Prompt Engineering | `~/repos/claude-lab/day10_prompt` | 提示词优化 |
| RAG | `~/repos/claude-lab/day11_rag` | 向量检索 |
| Token 裁剪 | `~/repos/claude-lab/day13_token_pruning` | 按 Token 管理 |
| 错误处理 | `~/repos/claude-lab/day14_error_handling` | 重试机制 |
| 多 Agent | `~/repos/claude-lab/day15_multi_agent` | 协作架构 |

---

## 结语

经过三周的系统学习，Claude Code 的核心知识体系已经构建完成。从 Agent Loop 的基本循环机制，到 Prompt Engineering 的高级技巧，再到多 Agent 协作的架构设计，每一个知识点都是面试和实战中的高频考点。

**下一步计划：**
- 深入源码学习（learn-claude-code）
- 真实服务集成（企业微信、飞书）
- 项目实战（基于 Claude Code 构建完整应用）

---

**相关阅读：**
- [AI Coding 进阶之路：Claude Code 两周实战总结](https://sunrong1.github.io/ai-practice/claude-code/claude-code-weekly-summary/)
- [Claude Code 完全指南：从入门到精通](https://sunrong1.github.io/ai-practice/claude-code/claude-code-complete-guide/)
