---
title: 从 RAG 到 LLM Wiki：知识工程的三层架构与三大核心引擎
icon: sitemap
date: 2026-10-23
update: 2026-10-23
categories:
  - AI 实践
  - AI 理论
tags:
  - 知识工程
  - RAG
  - LLM Wiki
  - Obsidian
  - 知识图谱
  - Agent
author: Mr.Sun
public-safe: true
---

# 从 RAG 到 LLM Wiki：知识工程的三层架构与三大核心引擎

> 企业真正需要的不是"能查资料的 AI"，而是**持续演化的知识工程体系**。
>
> 这篇把 Andrej Karpathy 的 LLM Wiki 模式拆开讲，配三个已经跑起来的开源实现。

**知识工程系列**
| 篇 | 内容 |
|---|---|
| **第 1 篇（本文）** | LLM Wiki 是什么 · 三层架构 · 三大核心引擎 · 三个开源实现 |
| [第 2 篇 · RAG 还是 LLM Wiki](/posts/ai-practice/ai-theory/knowledge-engineering-rag-vs-wiki.html) | 一张决策表 · 三个判断维度 · 混合方案 · 落地路径 |

<!-- more -->

## 一、先说清楚：问题不在检索能力

### 企业的真实痛点

一个团队要做 AI 知识问答，卡住的往往不是模型能力，是这四件事：

| 痛点 | 表现 |
|---|---|
| **核心专家依赖** | 只有两个人真正懂这套系统，AI 答不出来就问人，人成了瓶颈 |
| **重复低效回答** | 同一个问题被问 50 遍，AI 每次都从零开始理解 |
| **文档过时脱节** | 文档写了但没人更新，跟真实系统对不上 |
| **知识孤岛断联** | 概念之间没有链接，问"A 和 B 什么关系"就答不了 |

### 三个绕不开的核心命题

**知识工程要解决的，其实就三件事：**

```
1. Agent 需要什么知识？   —— 不是"有什么给什么"，是"缺什么补什么"
2. 如何组织这些知识？     —— 关系、层级、密度
3. 如何持续更新它？       —— 这才是决定生死的一题
```

> ⭐ **前两件事决定效果，第三件事决定生死。**
>
> 知识工程和 RAG 的最大区别就在第三条 ——
> **一次性搭好的知识库，三个月后就是垃圾场。**

### 三个阶段

| 阶段 | 形态 | 知识形态 | 致命问题 |
|---|---|---|---|
| **传统文档阶段** | Wiki / Confluence | 人写的 Markdown | 没人愿意维护 |
| **基础 RAG 时代** | 向量库 + 检索 | 切碎的 chunk | 检索到了但拼不回去 |
| **智能体知识工程时代** | LLM 维护的 Wiki | 结构化、互链、持续演进 | —— |

---

## 二、当前 RAG 的 4 个硬伤

### 伤在哪

**① 重检索而无关联**

RAG 每次查询都在做同一件事：把相关片段捞出来，扔给模型，让模型**重新推断它们之间的关系**。

问了 10 次，就推了 10 次。**没有任何东西被沉淀下来。**

**② 碎片化无整体感**

捞出来的是 chunk，chunk 里没有"这个模块为什么这么设计"。**模型看到的是局部，看不到全局。**

**③ 无法形成长期记忆**

每次对话结束，模型的中间理解就丢了。**明天再问，它还是从零开始。**

**④ 被动膨胀：只进不出**

文档只进不出，治理成本越来越高，最后变成垃圾堆积。**没人敢删，因为不知道谁在用。**

### 一句话概括

> **RAG 只解决了"检索"和"临时投喂"两个问题，而知识工程的难点全在治理。**

---

## 三、解法：把工作从"查询时"搬到"编译时"

这是整个模式最关键的一句话。

**传统 RAG：**
```
提问 → 检索 chunk → 模型现场拼装关系 → 回答
         ↑ 每次都重做一遍
```

**LLM Wiki：**
```
原料进来 → LLM 读懂 → 写成结构化页面（关系已建好）→ 提问时直接读页面
              ↑ 编译一次
```

Andrej Karpathy 在原始文档里写得很直白：

> **"知识被编译一次，然后持续保持最新，而不是每次查询时重新推导。"**
>
> —— [gist.github.com/karpathy/442a6bf...](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

**这个转变带来三个连锁反应：**

- 交叉引用**已经建好了**，不用现推
- 矛盾**已经标记过了**，不用现发现
- 综合结论**已经反映了所有读过的东西**

### ⚡ AI Coding 的鸿沟

这个转变在 AI Coding 场景下尤其迫切：

> **AI 让代码的生成速度，远远超过了人类构建认知的速度。**

代码在涨，理解跟不上。**每一个新会话，AI 都要把昨天读过的文件重新读一遍。**

这就是 Code Wiki 这类工具要解决的问题 —— **让理解能够跨会话累积，而不是每次冷启动。**

---

## 四、三层架构

![知识工程三层架构](/images/knowledge-engineering-3-layers.png)

### L1 原始层（Raw sources）

**原始事实数据**：代码、文档、用例、剪藏、会议记录。

**不可变** —— LLM 从这里读，但**绝不修改或删除**。这是你的 source of truth。

> ⭐ **为什么要坚持"不可变"？**
>
> 因为 LLM 会写错、会过度概括。**如果 LLM 能改原料，错误就再也追不回来了。**
>
> 保持原料不动，是为了让"LLM 写的"和"真的"之间永远隔着一层可审计的边界。

### L2 知识层（The wiki）

**LLM 生成的结构化页面**：实体、概念、来源摘要、对比、综合。

这一层**完全归 LLM 所有** —— 它建页、它更新、它维护交叉引用、它保持一致。

**你读它，LLM 写它。**

> ⭐ **这一层是检索的主力。**
>
> 因为它是**高价值、高密度**的 —— 一个 `_architecture.md` 页面可能浓缩了几千行代码的架构含义。
> 你拿它去喂 Agent，比丢一堆 chunk 进去有效得多。

### L3 规则层（The schema）

**`CLAUDE.md`（Claude Code）或 `AGENTS.md`（Codex）** —— 告诉 LLM 这个 wiki 怎么组织、遵循什么约定、摄入/回答/维护时该走什么工作流。

Karpathy 说这是整个模式里**最关键的配置文件**：

> **"这是让 LLM 成为一个有纪律的 wiki 维护者，而不是一个泛用聊天机器人的关键。"**

**你和 LLM 共同演进这份文件。** —— 这不是一次性配置，是随用随调的旋钮。

---

## 五、三大核心引擎

架构是静态的，能让它活起来的是三个操作。

### Ingest · 采集

**你把一份新原料丢进 `raw/`，然后告诉 LLM 处理它。**

一次完整的摄入：

```
LLM 读原料
  → 跟你讨论关键要点
  → 写 sources/<slug>.md 摘要页
  → 更新 index.md
  → 更新全库相关的 entities / concepts 页
  → 追加 log.md
```

> ⭐ **一份原料可能牵动 10-15 个 wiki 页面。**
>
> 这就是"编译"的含义 —— 不是把文档复制一份，是**让新信息渗透进整个知识网络**。

Karpathy 自己的习惯是**一份一份地摄入，并且全程参与**：

> 读摘要、看更新、指导 LLM 该强调什么。也可以批量摄入，但少监督。

**怎么选，取决于你想要什么质量 —— 写进 schema 里，形成你自己的工作流。**

### Query · 供给

**你对着 wiki 提问，LLM 找页面、读页面、综合出带引用的答案。**

关键的两步：

```
1. 先读 index.md → 定位相关页      （内容目录，分类组织）
2. 再钻进具体页面 → 综合答案        （带引用，不编造）
```

> ⚠️ **`index.md` 和 `log.md` 是两个不同的东西，别混。**
>
> | | `index.md` | `log.md` |
> |---|---|---|
> | 性质 | **内容导向** | **时间导向** |
> | 内容 | 全库目录，每页一行摘要 | 只追加的事件记录 |
> | 用途 | 回答前先读它定位 | 看清 wiki 演进了什么 |
> | 技巧 | 按类别组织 | 每行统一前缀，`grep "^## \[" log.md \| tail -5` 就能看最近 5 条 |

**而且 —— 好答案要归档回 wiki。**

你问出来的对比表、分析、发现的关联，**不该烂在聊天记录里**。

> ⭐ **这一点最容易被忽略，但它才是"复利"的来源。**
>
> Karpathy 的原话：*"这些探索会和摄入的来源一样，在知识库里复利。"*

### Lint · 治理

**定期让 LLM 做健康检查。**

要查什么：

| 类别 | 具体查什么 |
|---|---|
| 矛盾 | 页面之间互相冲突 |
| 过时 | 新来源已经推翻了旧结论，但旧页面没改 |
| 孤岛 | 没有入链也没有出链的孤儿页 |
| 缺页 | 重要概念被反复提到，却没有自己的页面 |
| 缺交叉引用 | 提到了有页面的实体，但没链接过去 |
| 数据缺口 | 可以用一次网络搜索补上的空白 |

> ⭐ **冲突检测之后，要人来判。**
>
> LLM 能告诉你"这两页说法不一致"，但**它不该替你决定哪个对**。
>
> 同样，**长期没人用的知识可以归档或淘汰** —— 这就是解决"只进不出"的地方。

---

## 六、三个已经跑起来的实现

理论说完，看代码。这三个我都读了 README 和实际文件。

### ① Karpathy 原始 gist

**[gist.github.com/karpathy/442a6bf...](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)**

原始 idea 文件，作者自己说是"设计上用来复制粘贴给你的 LLM Agent"的。

**必读**，因为它把三层架构、三个操作、index/log 区分、Obsidian 用法讲得最清楚。而且这一篇是**一手来源**，其他所有实现都从它来。

**Karpathy 自己的用法**（值得抄）：

> *"我一边开着 LLM agent，一边开着 Obsidian。LLM 根据我们的对话做修改，我实时浏览结果 —— 点链接、看 graph view、读更新的页面。**Obsidian 是 IDE，LLM 是程序员，wiki 是代码库。**"*

**他还提了几个工具细节：**

- **Obsidian Web Clipper** —— 浏览器插件，网页转 markdown，快速进 `raw/`
- **附件本地化** —— 设置里把附件目录固定到 `raw/assets/`，绑个快捷键一键下载图片
- **Obsidian graph view** —— 看 wiki 的形状：什么连着什么、谁是枢纽、谁是孤儿
- **Marp / Dataview** —— 前者出幻灯片，后者按 frontmatter 跑查询生成动态表格
- **qmd** —— 本地搜索引擎，BM25 + 向量 + LLM 重排，全在设备上

### ② Code Wiki —— 代码库的 LLM Wiki

**[github.com/mraza007/codewiki](https://github.com/mraza007/codewiki)**

> *"Your codebase, compiled into a living wiki. Maintained by LLMs. Searchable by LLMs. Viewable in Obsidian."*

**把 Karpathy 的模式套到代码仓库上。**

它的设计原则里有两条特别关键：

> **"CLI 不聪明。"** —— 只管 git diff、文件脚手架、元数据。**理解和写作全部由 Agent 干。**
>
> **"纯 markdown。"** —— 没有数据库，没有私有格式，就是带 YAML frontmatter 的 `.md` 文件。

**目录结构：**

```
~/.codewiki/<project>/
├── _index.md          # 全库主索引
├── _architecture.md   # 系统总览
├── _patterns.md       # 复现模式
├── _meta.yaml         # 上次编译的 commit
├── modules/           # 每个逻辑模块一篇
│   ├── auth.md
│   └── database.md
├── concepts/          # 跨切面关注点
│   ├── data-flow.md
│   └── error-handling.md
├── decisions/         # 为什么是这样
│   └── why-postgres.md
├── learnings/         # 修过的 bug、发现的模式
│   └── auth-token-bug.md
└── queries/           # 归档回来的问答
    └── how-caching-works.md
```

**会话生命周期 —— 这是它最聪明的设计：**

| 时机 | 动作 |
|---|---|
| **会话开始** | `cw status` 看自上次编译以来变了什么。首次 → 全量编译；有过期 → 增量更新；新鲜 → 跳过 |
| **会话进行中** | **Agent 查 wiki，而不是重读源码**。"认证怎么工作"这种跨切面问题，一篇文章就能串起 4 个目录 8 个文件 |
| **会话结束** | 修的 bug 进 `learnings/`，做的决策进 `decisions/`，改的代码触发文章更新 |

**关键机制 —— `source_files` 字段：**

```yaml
---
title: Authentication Module
type: module
source_files:
  - src/auth/middleware.py
  - src/auth/tokens.py
tags: [auth, middleware, jwt]
---
```

> ⭐ **这个字段是整个增量更新的地基。**
>
> `cw status` 靠它判断哪些文章过期了 —— **这些源文件变了，对应文章就标记为 stale。**
>
> 没有这个字段，"哪些知识该更新"就只能靠人记或者全量重编译。

**接入方式：**

```bash
cw init                  # 给当前仓库搭 wiki 骨架
cw setup claude-code     # 装 skill 到 ~/.claude/skills/codewiki/
cw setup codex           # 写进 ~/.codex/AGENTS.md
cw setup qmd             # 注册成 QMD 检索集合
```

然后 **把 `~/.codewiki/` 整个目录当成 Obsidian vault 打开**。所有文章原生用 `[[双链]]`，不用装插件就有知识图谱。

**它自己列的待办里有一条很有意思：**

> `cw lint` — LLM health checks over the wiki (find contradictions, gaps)

**这个还没实现。** 而下面这个仓库已经做了。

### ③ wiki-init-skill —— 通用知识库版本

**[github.com/liuly66/wiki-init-skill](https://github.com/liuly66/wiki-init-skill)**

> *"从零搭建 Karpathy LLM Wiki 三层架构项目骨架，一次性操作。"*
>
> **一条指令让 AI 自动创建 18 个文件的完整知识库骨架。**

**这是中文圈里做得最完整的 Karpathy 模式实现。** 而且它把 lint 做实了。

**它的 lint 检查 8 项**（比 Code Wiki 那个还没实现的 `cw lint` 具体得多）：

| # | 检查项 | 严重级别 |
|---|---|---|
| 1 | 孤立页面（无入链无出链）| 🟡 警告 |
| 2 | 断链（指向不存在的页面）| 🔴 严重 |
| 3 | 缺失 frontmatter | 🔴 严重 |
| 4 | 不完整页面（必需章节空 / draft 超 30 天）| 🟢 信息 |
| 5 | 缺失交叉引用（提了但没链接）| 🟢 信息 |
| 6 | 过时内容（`date_updated` 超 90 天 + 时效性话题）| 🟢 信息 |
| 7 | 索引偏差（`index.md` 与实际页面对不上）| 🟡 警告 |
| 8 | 日志缺失（`log.md` 没覆盖所有页面）| 🟢 信息 |

**报告格式也定好了：**

```
- 类别：（孤立 / 断链 / 缺失 frontmatter 等）
- 文件：文件路径
- 问题：问题描述
- 修复：建议的修复方案
```

> ⭐ **注意第 6 条 —— "过时内容"的判断依据是 `date_updated` 超过 90 天且涉及时效性话题。**
>
> 这比"感觉它过时了"可执行多了。**治理要靠规则，不能靠感觉。**

**它的 AGENTS.md 设计值得抄** —— L3 规则层到底该写什么：

```markdown
## 角色
你是一名 Wiki 维护者。...

## 三层架构
### 第一层：原始来源（raw/）
- 不可变 — 你可以读取，但绝不能修改或删除

### 第二层：Wiki（wiki/）
- 你完全拥有此层 — 根据需要创建、更新、重组

### 第三层：架构（本文件 + 支持文档）
- AGENTS.md — 主架构文档
- templates/ — 各类别的页面模板
- prompts/ — 可复用的操作提示词
```

**还有两个细节我很喜欢：**

- **命名规范带类别前缀** —— `entity-<名称>.md` / `concept-<名称>.md` / `source-<标识>.md`。**从文件名就能看出类型，不用打开。**
- **每个新页面初始是 `status: draft`** —— 新写的知识先标记为草稿，成熟了再转正。**给"未验证的知识"一个显式的状态位。**

### 三个实现的对照

![Karpathy LLM Wiki 原始架构 vs 三个开源实现](/images/knowledge-engineering-implementations.png)

| | Karpathy gist | Code Wiki | wiki-init-skill |
|---|---|---|---|
| **定位** | 原始 idea | 代码库 | 通用知识库 |
| **形态** | 文档 | Rust CLI + Skill | Skill（18 个文件）|
| **L1** | raw/ | 源码 + `_meta.yaml` | `raw/` |
| **L2** | wiki/ | `_architecture.md` + modules/ | entities/concepts/sources/comparisons/synthesis |
| **L3** | schema 概念 | `AGENTS.md` / skill | `AGENTS.md` + templates/ + prompts/ |
| **Ingest** | 描述 | Agent 自动 | `prompts/ingest.md` |
| **Query** | 描述 | Agent + QMD | `prompts/query.md` |
| **Lint** | 描述 | **未实现** | **8 项检查已做实** |
| **Obsidian** | 核心用法 | vault 打开 | 双链原生 |
| **产出形态** | markdown | markdown | markdown |

> ⭐ **三个实现都坚持"纯 markdown、没有数据库"。**
>
> 这不是偷懒 —— 是**让知识脱离工具、脱离平台、脱离 AI 也能读**。
>
> Karpathy 说得很直接：*"这个 wiki 就是一个 markdown 的 git repo。版本历史、分支、协作全都白送。"*

---

## 七、Code Wiki 与 codewiki.google

你可能还见过另一个东西：**[codewiki.google](https://codewiki.google)** —— Google 的 AI 生成代码 wiki 网站，任何 GitHub 仓库都能查。

已经有人把它包成 MCP Server 了（[izzzzzi/codewiki-mcp](https://github.com/izzzzzi/codewiki-mcp)），让 AI 助手能直接搜、取文档、提问。

**两者定位不同：**

| | codewiki.google | Code Wiki (mraza007) |
|---|---|---|
| **谁维护** | Google（中心化托管）| 你自己（本地 git）|
| **范围** | 公开 GitHub 仓库 | **你自己的私有仓库** |
| **内容** | 社区共享 | 你的私有知识 |
| **更新** | 平台重新索引 | **你的 Agent 在会话边界自动更新** |
| **可定制** | 不可 | 完全可定制 |

> ⭐ **私有代码库这件事，中心化平台帮不了你。**
>
> 公司的核心代码不可能交给 Google 去索引。**能落地的只有"本地 git + 自己的 Agent"这条路。**

---

## 八、怎么落到自己身上

### 最小可行路径

**别一上来就做全套。** 建议：

```
第 1 步：选一个你真的天天查的代码库（别选最大的，选最痛的）
第 2 步：cw init + cw setup claude-code
第 3 步：跑一次全量编译，读一遍 _architecture.md
        ← 这一步是验收：它写出来的东西对你有用吗？
第 4 步：用一周，观察它什么时候过时、什么时候误导你
第 5 步：把"哪些情况该更新 wiki"写进 AGENTS.md
```

### 三个最容易被忽略的点

**① 摄入要有人在场**

Karpathy 明确说：他喜欢**一份一份摄入并全程参与**。批量摄入省事，但 LLM 跑偏时没人纠正。

> **宁可慢，不要让错误批量沉淀。**

**② 好答案必须归档**

这是复利的唯一入口。**问完不归档，等于没问。**

**③ 治理是独立的动作**

不是"顺便维护一下"，是**定期拿 LLM 做 lint**。没有这一步，wiki 三个月后就废了。

### 什么时候不适合

| 场景 | 为什么 |
|---|---|
| **知识一次性、问完就丢** | 编译成本高于收益 |
| **代码库小到能直接读完** | 几千行以内，Agent 直接读更省事 |
| **没有一个持续用的人** | 没人维护的 wiki 一定腐烂 —— 这跟是不是 LLM 无关 |
| **原始资料本身就不稳定** | L1 不可变是前提，原料天天变说明该先解决源头问题 |

> ⭐ **最关键的一条：知识工程不是技术问题，是"有没有人真的在用"的问题。**
>
> Karpathy 说人类放弃 wiki 的原因是**维护成本增长得比价值快**。
>
> LLM 改变的正是这一点 —— **它不会烦、不会忘记更新交叉引用、一次能碰 15 个文件。**
>
> 但它改变不了的是：**如果没有人真的去读那个 wiki，LLM 维护得再好也没用。**

---

## 📚 参考资料

- **[Andrej Karpathy — LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)** —— 一手来源，三层架构 / 三大操作 / Obsidian 用法都在这里
- **[mraza007/codewiki](https://github.com/mraza007/codewiki)** —— 代码库版 LLM Wiki，Rust CLI + Claude Code skill
- **[liuly66/wiki-init-skill](https://github.com/liuly66/wiki-init-skill)** —— 中文版 Karpathy 模式实现，lint 已做实
- **[atomicstrata/llm-wiki-compiler](https://github.com/atomicstrata/llm-wiki-compiler)** —— "The knowledge compiler"，讲清了 compile-time vs query-time 的位移
- **[izzzzzi/codewiki-mcp](https://github.com/izzzzzi/codewiki-mcp)** —— codewiki.google 的 MCP 封装
- **[Agentic RAG 论文笔记](/posts/ai-practice/ai-theory/agentic-rag-paper-learning.html)** —— 同一问题的另一条解法路线：把 RAG 本身做 Agent 化
- **[AI 上下文工程笔记](/posts/ai-practice/ai-theory/context-engineering-lihongyi-notes.html)** —— 上下文是另一个维度的问题
