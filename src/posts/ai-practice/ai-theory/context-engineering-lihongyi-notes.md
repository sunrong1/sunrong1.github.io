---
icon: layers
date: 2026-08-14
update: 2026-08-14
categories:
  - AI 实践
tags:
  - AI Agent
  - Context Engineering
  - LLM
  - 学习笔记
  - Harness
author: Mr.Sun
public-safe: true
---***

# 李宏毅老师 Context Engineering 课程笔记

> **Agent 时代的核心议题：不是"装更多"，而是"装对"。**

这两天学习了李宏毅老师的 Context Engineering 课程，把核心要点整理成这篇笔记。
Context engineering 是构建 LLM Agent 最关键的设计能力之一——它决定了 Agent 在长程任务中能否保持高效、准确、可持续。

***
## 一、什么是 Context Engineering？

> "Context 不能太短也不能太长，要选择恰当的相关内容。**控制 context 的工程就是 context engineering**。"

### 本质权衡：完整性 vs 成本

| 维度 | 太长 | 太短 |
|------|------|------|
| **Token 成本** | 指数级增长 | 低 |
| **LLM 注意力** | 稀释，关键信息被淹没 | 高，但容易遗漏 |
| **幻觉风险** | 中 | 高（缺少关键依据）|
| **响应速度** | 慢 | 快 |

**核心观点**：压缩不是目标，"**恰到好处的相关性筛选**"才是。

***
## 二、Context 包含什么？

Context 包含 2 个部分：

1. **输入 LLM 的问题**（短期、临时）
   - 当前对话历史
   - 系统提示词
   - 用户最新输入

2. **放到硬盘的部分**（长期、持久化）
   - 向量数据库
   - 文件系统
   - 外部知识库

> **关键洞察**：Context Engineering 不只是"控制 LLM 输入框"——还要设计"**哪些信息应该被持久化 + 何时被召回**"。

***
## 三、Context 压缩：核心工程

> "最重要的工程：把 context 压缩成 summary。"

### 两种压缩方式

**方式 1：调用模型生成 summary**
- 用 LLM 自己总结长文本
- 优点：自然语言、可读
- 风险：模型可能丢失关键细节（**Summary Leak**）

**方式 2：Tool output 增加标注**
- 程序化标记关键段落、位置、ID
- 优点：可追溯、不丢失原始信息
- 缺点：需要工程化设计

### Summary Leak 的解法

> "LLM 做 summary 的时候，有可能出错。解决方法：在 summary 时增加 **feedback**，插入到 summary 中。"

**核心思路**：
- 不是"压缩一次就完事"
- 而是"压缩 + 反馈 + 再压缩"的循环
- 用 feedback 让 summary 保持**自检能力**

***
## 四、Context 长度优化：80/20 法则

> "Context 最长的部分：**外界输入（80%）**，自己的推理、产生工具的指令（**20%**）。"

这意味着：**优化 context 的关键 = 优化外界输入**。

### 3 个核心策略

**1. 读过滤（Read Filtering）**
- 不是读全部文件，只读**相关的几行**
- 类比：grep 取代 cat
- 工具：cursor、ripgrep、行号定位

**2. 按需加载（On-Demand Loading）**

| 方式 | 适用场景 |
|------|---------|
| **RAG 搜索加载** | 大规模文档库，按 query 召回 |
| **AI 自己去选** | 给 LLM 工具让它按需调用（file read / web search）|
| **Skill 按需加载** | 把可复用能力做成 skill，需要时调用 |

**3. 元数据存储（Metadata-Only Storage）**
- LLM 只存 metadata（"这是什么 + 在哪里"）
- 真实 context 放硬盘
- MemGPT 的核心思想

***
## 五、关键设计原则

### 原则 1：工具强制压缩

> "**模型不喜欢自己压缩上下文，必须使用工具的强制方式**。"

- LLM 自主压缩 = 信息损失大、不可控
- 工具压缩 = 程序化、有规则、可验证

### 原则 2：Subagent 作为压缩

> "**Subagent 实际也是一种上下文的压缩方式**。"

- 把任务分给 subagent = 主 agent context 保持简洁
- Subagent 自己消化细节，只返回结论
- 类比：项目经理 vs 一线员工

### 原则 3：存下未来能用的东西

> "存下**未来能用上的东西**：策略、关键发现、可重用 code。**LLM 只存储 metadata of context，其他放到硬盘**。"

可复用的资产清单：
- ✅ 有效的策略（"上次这种问题用这种方法解决了"）
- ✅ 关键发现（"这个 API 有个隐藏限制"）
- ✅ 可重用 code（"这段代码可以直接 copy"）

***
## 六、Context Engineering 的本质

如果只能用一句话总结：

> **Context engineering 不是"装更多"，而是"装对"**——是**"压缩有损在哪里损失"的设计艺术**。

| 错误理解 | 正确理解 |
|---------|---------|
| 装更多 context | 装**对**的 context |
| 压缩更多 | 选择**有损在哪** |
| 全局加载 | **按需加载** |
| 一次压缩 | **压缩 + 反馈循环** |

***
## 七、实践 Checklist

构建一个好的 Agent，应该设计：
- [ ] 是否有按需加载机制（RAG / Skill / Tool）？
- [ ] 是否有程序化压缩工具（不是依赖 LLM 自己压缩）？
- [ ] 是否有 subagent 任务分发（保持主 agent context 简洁）？
- [ ] 是否有持久化记忆系统（metadata + 硬盘）？
- [ ] 是否有 summary feedback 循环（防止 Summary Leak）？

***
## 参考

- 李宏毅老师 Context Engineering 课程
- MetaGPT / Voyager / AgentVerse 论文中的记忆系统
- MemGPT 的分层存储设计
- Anthropic 的 Context Engineering 实践指南

***
**一句话总结**：

> Agent 的能力 = 模型能力 × Context Engineering 质量。
> 模型是引擎，Context Engineering 是变速箱。

🌿

***
欢迎交流讨论，我的 blog：[sunrong.site](https://sunrong.site)