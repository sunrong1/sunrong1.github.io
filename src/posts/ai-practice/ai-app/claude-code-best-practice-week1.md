---
title: Claude Code 上下文机制拆解：/init、压缩三档与自建 Agent 的六层
icon: cpu
date: 2026-04-04
update: 2026-10-24
categories:
  - AI Coding
  - AI 实践
tags:
  - Claude Code
  - Context Engineering
  - 上下文管理
  - Agent 架构
  - AI 编程工具
author: Mr.Sun
public-safe: true
---

# Claude Code 上下文机制拆解：/init、压缩三档与自建 Agent 的六层

> 这篇是学习笔记的**修订版**。
>
> 原版（2026-04-04）是一份「六大模块速览」，讲的是 Subagents / Commands / Skills / Memory / MCP 怎么配 —— 素材来自 [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) 这个汇总仓库。
> 这一版把重心换到**机制层**：`/init` 到底做了什么、上下文满了会发生什么、以及如果要自己写一个 Agent，该分成哪几层。
>
> 原文中的配置速查没有丢，收进了第 3.8 节，并按官方文档当前版本校正过。
>
> 文中所有数字都标了来源：**官方文档**能查到的写文档，**源码里读到的**写版本号，两边都没有的我不写。

<!-- more -->

## 一、场景：Agent 为什么会在中途「忘事」

先说清楚要解决什么。

用 Claude Code 写代码的人，多半都遇到过这两件事：

**第一件**：你在 `CLAUDE.md` 里写了「所有 API 都要做入参校验」，前三轮它都遵守。聊到第 40 轮，它开始写没有校验的 handler —— 那条规则明明还在文件里。

**第二件**：`/init` 跑完，生成的 `CLAUDE.md` 有 200 行，一半是「Common Development Tasks」「Tips for Development」这种通用废话。你删到 30 行，它反而表现得更好。

这两件事看起来是「模型不够聪明」，其实不是。它们指向同一个东西：

> **上下文是一个有预算的资源，而且预算会被悄悄花掉。**

Claude Code 往上下文里放东西有两条路：

- **自动放的** —— 你没让它放，它自己放（git 快照、CLAUDE.md、MCP 工具列表、读过的文件）
- **你让它放的** —— CLAUDE.md、rules、skills、hooks 输出

第一条路你看不见，但它一直在花你的钱和 token。第二条路你能控制，但很多人压根不知道有第二条路。

**这篇要讲的就是：自动放的那些具体是什么、满了以后怎么按「先便宜后昂贵」的顺序处理、以及怎么用第二条路把 Agent 补回来。**

---

## 二、样例：三个可以立刻验证的现象

### 现象 1：上下文里到底有什么

官方文档有一页叫 [Explore the context window](https://code.claude.com/docs/en/context-window)，里面是一条完整会话的时间线。按时机分类：

| 时机 | 自动进入上下文的东西 |
|---|---|
| **你还没打字** | `CLAUDE.md`、auto memory、MCP 工具名、skill 描述 |
| **Claude 开始干活** | 每次读的文件、匹配到的 path-scoped rules、每次编辑后触发的 PostToolUse hook |
| **中途** | 子代理在**自己的**上下文窗口里干活，只有摘要和小段元信息回来 |
| **压缩时** | `/compact` 把整段对话换成结构化摘要 |

**注意第二行里的 MCP 工具名。** 官方文档说 MCP 工具定义**默认延迟加载**，通过 tool search 按需拉取 —— 在 Claude 真正调用某个工具之前，只有工具名和 server 指令进上下文。

这条很重要：**装 MCP server 不等于把它的工具全塞进上下文**，但也不等于完全免费。工具名是要进的。

### 现象 2：Git 上下文是自动加载的

这条在官方 `settings-reference` 的 `includeGitInstructions` 里写得很死：

> Claude Code gives Claude two git-related pieces of context: its built-in instructions for how to write commits and pull requests, in the Bash tool's description, and **a git status snapshot of your repository. The snapshot holds the current branch, the main branch, `git status` output, and recent commits.** Claude Code reads it when a conversation starts.

翻译过来，**每次会话开始时自动进上下文的是**：

- 当前的 git 分支名
- 主分支名
- `git status` 的输出
- 最近的 commit 记录

外加 Bash 工具描述里的「怎么写 commit / 怎么提 PR」的内置指令。

不想要这套，把 `includeGitInstructions` 设成 `false`。

### 现象 3：压缩是怎么触发的

这条是本次修订里最需要校准的地方。**我翻到了 Claude Code 1.0.88 的 `cli.js`（旧版 Node.js 实现，现在已经换成原生二进制），常量都在里面。**

先说结论：**压缩不是一个动作，是三个不同代价的动作。**

![上下文满了之后，Claude Code 做的三件事](/images/cc-context-compaction-layers.png)

---

## 三、深入：三个机制拆开看

### 3.1 microcompact —— 不花钱的那一档

源码里这个机制的正式名字就叫 **microcompact**，有独立的遥测事件 `tengu_microcompact`，还有独立的环境变量开关 `DISABLE_MICROCOMPACT`。

**它不调用 LLM。** ⭐ 整条路径是本地字符串处理 —— 把工具结果从消息历史里摘掉，不产生任何模型调用。

它清理的是这 9 类工具的结果：

```
Read · Bash · Grep · Glob · LS · WebSearch · WebFetch · Edit · Write
```

三个关键数字（源码常量）：

| 行为 | 值 | 源码常量 |
|---|---|---|
| **永远保留最近 3 个工具结果** | 3 | `lJ5` |
| **默认触发阈值** | 40,000 token | `cJ5` |
| **本次至少要清出这么多才动手** | 20,000 token | `dJ5` |

最后一条是精妙的地方：**清 20,000 token 以下它不干**。

因为清掉工具结果会让 prompt cache 失效，而缓存重建本身要花钱。⭐ **收益不够大就别破坏缓存** —— 这是纯成本权衡，不涉及任何模型能力判断。

所以这一档的准确说法是：

> 不是「保留最近 20k token 的原始消息」，而是「**永远保留最近 3 个工具结果；累计到 40,000 token 且这一次能清出 20,000 token 以上，才动手**」。

### 3.2 auto-compact —— 调用 LLM 总结

官方 [how-claude-code-works](https://code.claude.com/docs/en/how-claude-code-works) 的原话：

> Claude Code manages context automatically as you approach the limit. **It clears older tool outputs first, then summarizes the conversation if needed.**

注意这个顺序 —— **先清工具输出（microcompact），再总结对话（auto-compact）**。这就是为什么 microcompact 是独立的一档。

触发点也不是「用满了」。源码里的阈值算法：

```
可用窗口 = 上下文窗口 减 13,000 token          （hJ5）
warning 阈值 = 可用窗口 减 20,000 token          （gJ5）
error   阈值 = 可用窗口 减 20,000 token          （uJ5）
```

⭐ **所以 auto-compact 在还剩 13,000 token 余量时就触发了**，不是等塞不下。

⚠️ **这里要校准一个常见的说法**：「auto-compact 保留 20k token」不准确。**20,000 是阈值差值，不是保留量。** 压缩后的保留量由下面这条决定。

### 3.3 /compact —— 手动触发，压缩后还给你装回一部分

`/compact` 走的是和 auto-compact 一样的总结路径，区别是**你决定何时触发、重点是什么**：

```bash
/compact focus on the auth bug fix
```

还可以只压缩一段对话（`/rewind` 选一条消息，选 "Summarize from here"）。

**压缩完不是只剩一段摘要。** 源码里压缩完成后会做一次「文件恢复」：

| 恢复什么 | 上限 | 源码常量 |
|---|---|---|
| 恢复几个文件 | **最多 5 个**（按最近修改时间排） | `jJ5` |
| 单个文件恢复多少 | **5,000 token** | `yJ5` |
| 文件恢复总计 | **50,000 token** | `kJ5` |

超过 5,000 token 的文件**不会把内容带回来**，只回来一个路径引用，界面上显示成 `Referenced file` 而不是 `Read`。

被调用的 skill body 也会重新注入，上限是**每个 5,000 token、总共 25,000 token**，超了从最老的开始丢。

⚠️ **「/compact 只保留 3k token」这个说法我在源码里没找到依据。** 实际是 5,000 / 50,000（skill 是 5,000 / 25,000）。**如果你在别处看到这个数字，建议回查一下出处。**

### 3.4 压缩之后，什么还活着

这是官方文档里最有用的一张表（[What survives compaction](https://code.claude.com/docs/en/context-window#what-survives-compaction)）：

| 机制 | 压缩之后 |
|---|---|
| 系统提示、output style | 仍然生效 |
| 项目根 `CLAUDE.md`、无条件 rules | **从磁盘重新注入** |
| auto memory | 从磁盘重新注入 |
| skill 描述 | 重建后重新注入（需 v2.1.304+） |
| git 状态快照 | **重新读一份新的** |
| plan mode 写的计划 | 从磁盘重新注入 |
| 带 `paths:` 的 rules | **按需重载** |
| 子目录的 `CLAUDE.md` | **按需重载** |
| Claude 读过的文件 | 最多回读 5 个，最近改的优先 |
| 调用过的 skill body | 重新注入，上限 5,000/个、25,000 总 |
| 后台命令、后台子代理 | **继续跑**，并提醒 Claude 哪些还在跑 |
| hook 注入过的上下文 | 跟对话一起被总结 |
| 匹配 `compact` 源的 SessionStart hook | **重新执行**，输出加回压缩后的上下文 |

**最关键的一行在最后。**

带 `paths:` 的 rules 和子目录的 `CLAUDE.md`，是在 Claude 读写那个目录时**进入消息历史**的 —— 所以压缩时它们跟其他对话内容一起被总结掉了。

官方给的解法很直接：

> If a rule must persist across compaction, drop the `paths:` frontmatter or move it to the project-root CLAUDE.md.

⭐ **要跨压缩存活的规则，不能带 `paths:`，或者放到项目根 CLAUDE.md。**

这一条能解释开头那个现象 —— 你的规则可能写在了带 `paths:` 的 rule 里，聊到后面被总结掉了。

### 3.5 /init 到底做了什么

这是本次修订的另一块重点。

**旧版 `/init` 本质上就是一条 prompt。** 源码里能读到原文（1.0.88 的 `cli.js`）：

```
Please analyze this codebase and create a CLAUDE.md file, which will be given
to future instances of Claude Code to operate in this repository.

What to add:
1. Commands that will be commonly used, such as how to build, lint, and run
   tests. Include the necessary commands to develop in this codebase, such as
   how to run a single test.
2. High-level code architecture and structure so that future instances can be
   productive more quickly. Focus on the "big picture" architecture that
   requires reading multiple files to understand

Usage notes:
- If there's already a CLAUDE.md, suggest improvements to it.
- When you make the initial CLAUDE.md, do not repeat yourself and do not include
  obvious instructions like "Provide helpful error messages to users", "Write
  unit tests for all new utilities", "Never include sensitive information
  (API keys, tokens) in code or commits"
- Avoid listing every component or file structure that can be easily discovered
- Don't include generic development practices
- If there are Cursor rules (in .cursor/rules/ or .cursorrules) or Copilot
  rules (in .github/copilot-instructions.md), make sure to include the
  important parts.
- If there is a README.md, make sure to include the important parts.
- Do not make up information such as "Common Development Tasks", "Tips for
  Development", "Support and Documentation" unless this is expressly included
  in other files that you read.
```

**这份 prompt 里藏着「少而精确」的完整依据**：

- `do not include obvious instructions` + 三个反例（helpful error messages / unit tests / no secrets）—— 这三条是**通用到不需要写**的
- `Avoid listing every component or file structure that can be easily discovered` —— 能被工具发现的别手抄
- `Don't include generic development practices` —— 通用最佳实践别写
- `Do not make up information such as "Common Development Tasks"...` —— **不许编**

所以「删除了不会出错，就删除」这条原则，官方原话就是 **"do not include obvious instructions"** 和 **"Do not make up information"**。

「删除后不会出错」是个判据：**把这条删掉，Claude 的行为会变吗？** 不变就删。

**新版 `/init` 是交互式的。** 官方文档：

> Set `CLAUDE_CODE_NEW_INIT=1` for an interactive flow that also walks through skills, hooks, and personal memory files.

加上官方 memory 文档里的这句：

> With `CLAUDE_CODE_NEW_INIT=1` set, running `/init` and choosing the personal option does this for you.

**「choosing the personal option」会自动帮你建 `CLAUDE.local.md`** —— 官方 memory 文档说得很清楚，`CLAUDE.local.md` 用来放不进版本库的个人偏好，要加进 `.gitignore`。

所以新版的 `/init` 覆盖的是这些：

| 阶段 | 产出 | 说明 |
|---|---|---|
| 1 | 问你要什么 | 先对齐意图，不是上来就扫代码 |
| 2 | 扫描项目 | README、rules（Cursor / Copilot）、instructions、AGENTS.md |
| 3 | 追问代码回答不了的 | 扫描补不齐的部分问你 |
| 4 | 写 `CLAUDE.md` | 少而精确 |
| 5 | `CLAUDE.local.md` | 个人偏好，不进版本库 |
| 6 | 创建 skills | 把专项流程拆成按需加载的 skill |
| 7 | 优化建议 | 给出可执行的改进项 |

第 2 阶段有个容易被忽略的设计：**它读的是 README、Cursor rules、Copilot instructions 这些「别人已经写好的上下文」，而不是从零开始理解代码。**

第 6 阶段更关键 —— **skills 是按需加载的**。官方文档说得很清楚：

> Skills load on demand. Claude sees skill descriptions at session start, but the full content only loads when a skill is used.

所以 CLAUDE.md 只放「每次都要用」的，专项流程放 skill。官方给的量化目标是：

> 目标是通过仅包含必要内容将 CLAUDE.md 保持在 **200 行以下**。

### 3.6 上下文补全的三条路

压缩会丢东西，所以需要补回来。三条路，优先级从高到低：

#### ① `CLAUDE.md` 当架构地图

`/init` prompt 里第 2 条写的是「High-level code architecture and structure」，并且强调：

> Focus on the "big picture" architecture that **requires reading multiple files to understand**.

⭐ **判据是「不读多个文件就理解不了的东西」。**

这跟第 3 条（容易发现的别写）是一对：单文件能看清的不用写，跨文件的架构关系才值得写。

我在自己项目里跑过一遍这个判据。用 `grep -rln "canPlace\|buildBlockedReason" src/` 找「建造判定」相关文件，出来 5 个：

```
src/components/battle/BattleField.vue
src/core/build.ts
src/core/grid.ts
src/core/index.ts
src/core/reducer.ts
```

但 grep 只告诉你「谁提到了这个词」，不告诉你「谁拥有这个逻辑」。而 `CLAUDE.md` 该写的是后者：

> 建造判据在 `core/build.ts` 一处。组件只读它的返回值，任何战斗数值都不许在组件里重算。

**再加上 `core/types.ts` 和 `core/balance.ts` 根本不会出现在 grep 结果里**，但改造价必然要动它们 —— 这是依赖关系，grep 看不见。

#### ② LSP 语义工具

官方在 [Manage costs effectively](https://code.claude.com/docs/en/costs) 里推荐装「代码智慧插件」（code intelligence plugin）：

> 代码智慧外挂为 Claude 提供精确的符号导航，而不是基于文字的搜索，在探索不熟悉的代码时减少不必要的文件读取。**单一「前往定义」呼叫取代了可能需要的 grep 后跟着读取多个候选文件。**

这就是 LSP 的价值：**一次符号查询，取代「grep 多个候选 + 逐个读」**。

对上下文来说，这是最直接的节省 —— 读三个 500 行的候选文件和读一个定义，token 差一个量级。

#### ③ `.claude/rules/` 分层规则

官方 memory 文档的机制：

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules
- All API endpoints must include input validation
```

- **带 `paths:` 的** —— 只在 Claude 读/写/编辑匹配文件时才加载
- **不带 `paths:` 的** —— 无条件加载

**两层各有用处**，但有个硬约束：**带 `paths:` 的会随压缩被总结掉**（见 3.4）。

所以规则该放哪：

| 规则类型 | 放哪 | 理由 |
|---|---|---|
| 每次都要遵守的 | 项目根 `CLAUDE.md` 或无条件 rule | 压缩后从磁盘重新注入 |
| 只在某个目录生效的 | 带 `paths:` 的 rule | 省 token，但接受它会被总结掉 |
| 专项流程 | skill | 按需加载，不占常驻 |

### 3.7 六个配置面，一张表收

原版这篇是「六大模块速览」，这里保留表格，但换成上下文视角：

| 面 | 上下文里的位置 | 加载时机 | 压缩后 |
|---|---|---|---|
| `CLAUDE.md` | 常驻 | 启动 | 从磁盘重新注入 |
| `CLAUDE.local.md` | 常驻（个人） | 启动 | 从磁盘重新注入 |
| `.claude/rules/`（无 `paths:`） | 常驻 | 启动 | 从磁盘重新注入 |
| `.claude/rules/`（有 `paths:`） | 按需 | 匹配文件被读写时 | **被总结掉** |
| 子目录 `CLAUDE.md` | 按需 | 该目录被读写时 | **被总结掉** |
| `skills/` | 只有描述进 | 描述启动进，正文调用时进 | 描述重建，正文重新注入（上限 5,000/25,000） |
| MCP server | 只有工具名进 | 工具定义按需拉取 | 随对话总结 |
| hooks | 输出进上下文 | 事件触发时 | `compact` 源的 SessionStart hook 重新执行 |

**Command 和 Subagent 不在这张表里**，因为它们不是上下文载体 —— Command 是插入到当前对话的模板，Subagent 是**在独立上下文窗口里跑**的。

Subagent 这条值得单说：官方文档讲得很清楚，

> a subagent handles the research in its own separate context window, so the large file reads stay out of yours. Only the summary and a small metadata trailer come back.

**这是上下文管理里最有效的一招**：让脏活在别人的窗口里干，你的窗口只收摘要。

---

### 3.8 配置速查：把上面的机制落到文件里

前面讲的是「为什么」，这一节是「怎么配」。字段全部来自官方文档当前版本。

#### Memory —— 多层 CLAUDE.md 怎么组织

官方文档给的加载规则：

- **祖先目录**的 `CLAUDE.md` 在启动时加载 —— 当前目录往上每一层都算
- **子目录**的 `CLAUDE.md` 懒加载 —— Claude 读/写/编辑那个目录里的文件时才进来
- 所有文件是**拼接**进上下文，不是覆盖。顺序从文件系统根目录往下，离你启动位置近的**最后读**
- 同一目录里，`CLAUDE.local.md` 排在 `CLAUDE.md` 之后 —— 你的个人笔记是这一层**最后读到**的

```markdown
# 根目录 CLAUDE.md —— 共享规范
## 提交规范
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新

# frontend/CLAUDE.md —— 组件规范
## React 组件
- 使用函数组件 + Hooks
- 命名：PascalCase

# backend/CLAUDE.md —— API 规范
## REST API
- 使用 RESTful 风格
- 统一错误响应格式
```

⚠️ **子目录的 `CLAUDE.md` 有个上下文代价**：它是懒加载的（好事，省 token），但**会随压缩被总结掉**（见 3.4）。

要把一条规矩跨压缩保住，放根目录。

#### Subagents —— 独立上下文窗口

**什么时候用**：活很脏但结论很短。比如「读 10 个文件找出所有调用方」—— 让子代理去读，你的窗口只收摘要。

文件位置：`.claude/agents/<name>.md`（项目）或 `~/.claude/agents/<name>.md`（个人）

官方支持 16 个 frontmatter 字段，与上下文管理直接相关的这几个：

| 字段 | 作用 |
|---|---|
| `description` | Claude 靠它决定什么时候自动调用。写 `PROACTIVELY` 可让它主动触发 |
| `tools` / `disallowedTools` | 白名单 / 黑名单。子代理权限就该在这里收窄 |
| `model` | `inherit` 继承主会话，或指定 `haiku` / `sonnet` / `opus` |
| `permissionMode` | 权限模式 |
| `maxTurns` | 轮次上限，防止子代理无限跑 |
| `isolation: worktree` | 在独立 git worktree 里跑，可安全改文件 |
| `memory` | 让子代理带上项目记忆 |

最小示例：

```yaml
# .claude/agents/code-reviewer.md
---
name: code-reviewer
description: 审查改动范围内的代码风格与正确性
model: sonnet
tools: [Read, Grep, Glob, Bash]
maxTurns: 15
---
你是代码审查员。只报告问题，不要修改文件。
```

**内置子代理，以及它们省上下文的两个设计：**

| 子代理 | 模型 | 权限 | 什么时候用 |
|---|---|---|---|
| `Explore` | 跟随主会话 | 只读（拒 Write / Edit） | 文件发现、代码搜索、代码库探索 |
| `Plan` | 跟随主会话 | 只读 | Plan 模式的只读探索 |
| `general-purpose` | 继承 | 全部 | 复杂多步任务（兜底类型） |
| `statusline-setup` | Sonnet | 读写 | 配状态栏 |
| `claude-code-guide` | Haiku | Web 搜索 | 问 Claude Code 本身的功能 |

⭐ **Explore 和 Plan 启动时故意不加载 CLAUDE.md，也不加载 git 状态快照。**

官方给的理由是「keep research fast and inexpensive」—— 探索代码不需要知道你的提交规范和当前分支，带着走纯属浪费。

**这是上下文预算的一个精细化用法**：不是所有子代理都需要同一份背景。自定义子代理可以用 `omitClaudeMd` 达到同样效果。

还有一条硬限制：**所有自定义子代理的 `description` 加起来超过 15,000 token，启动时会警告并报出总数。**

官方给的处理办法是「缩短 description，把细节挪进子代理的 system prompt」—— 因为 system prompt 只在这个子代理真正跑的时候才加载。

#### Skills —— 按需加载的知识单元

**什么时候用**：专项流程，不该占常驻预算。这是 3.6 里说的「把 CLAUDE.md 里的专项流程拆出来」。

文件位置：`.claude/skills/<name>/SKILL.md`（项目）或 `~/.claude/skills/<name>/SKILL.md`（个人）

| 字段 | 作用 |
|---|---|
| `description` | 启动时进上下文的那行描述。**决定 Claude 会不会找到它** |
| `paths` | glob 限制激活范围。格式跟 path-specific rules 相同 |
| `disable-model-invocation` | 设 `true` 禁止 Claude 自动加载，只允许手动 `/name` 调用 |
| `user-invocable` | 设 `false` 则从 `/` 菜单隐藏，只给 Claude 用 |
| `context: fork` | 在 forked 子代理上下文里跑 —— **正文不占主上下文** |
| `agent` | 配合 `context: fork`，指定用哪个子代理类型 |
| `background` | 配合 `context: fork`，默认后台跑；设 `false` 则等结果 |
| `allowed-tools` | 本轮调用内免确认的工具 |
| `model` | 激活期间用的模型 |

最小示例：

```yaml
# .claude/skills/deploy/SKILL.md
---
name: deploy
description: 按项目发布流程构建并部署到预发环境
disable-model-invocation: true
allowed-tools: Bash
---
1. 运行 `npm run build`
2. 运行 `npm run deploy:staging`
3. 输出部署的 commit sha
```

⚠️ **`paths` 有个上下文代价**：带 `paths` 的 skill 正文是在匹配文件被读时进的上下文，所以**它和 path-scoped rules 一样，会随压缩被总结掉**。要跨压缩存活就别用 `paths`，或者把关键约束复制进项目根 CLAUDE.md。

⚠️ **`SKILL.md` 的重要指令放最前面。** 官方说压缩后重新注入 skill 时会截断以适配上限，**截断保留文件开头**。

#### Commands —— 插入当前对话的模板

文件位置：`.claude/commands/<name>.md`

Command 和 Skill 的区别只有一个关键点：**Command 展开进当前对话，Skill 的正文按需加载。**

```yaml
# .claude/commands/code-review.md
---
description: 审查当前分支的改动
argument-hint: "[pr-number]"
allowed-tools: [Bash, WebFetch]
---
审查 PR #$1 的改动。
```

| 字段 | 作用 |
|---|---|
| `disable-model-invocation` | 设 `true` 禁止 Claude 自动调用 |
| `user-invocable` | 设 `false` 从 `/` 菜单隐藏，仅作背景知识 |
| `context: fork` | 在独立子代理中运行 |

**怎么选**：一个动作、几步就完 → Command；一套有分支的流程、需要领域知识 → Skill；要独立上下文 + 独立权限 → Subagent。

| | Command | Skill | Subagent |
|---|---|---|---|
| 正文进哪个上下文 | 当前对话 | 调用时进（可 fork 到子代理） | 它自己的窗口 |
| 能否独立设权限 | 否 | 有限 | 是 |
| 典型用途 | 固定动作模板 | 领域流程 | 脏活 / 探索 |

#### MCP —— 工具从哪来

**这不是上下文载体，但它是上下文成本的主要来源之一。** 官方说 MCP 工具定义**默认延迟加载**，只有工具名和 server 指令进上下文，工具定义等 Claude 真要用时再拉。

三种作用域：

| 作用域 | 位置 | 用途 |
|---|---|---|
| 项目级 | 项目根 `.mcp.json` | 团队共享，**第一次需要审批** |
| 用户级 | `~/.claude.json` | 个人所有项目 |
| 本地级 | `~/.claude.json` 的 local scope | 当前项目，不进版本库（`claude mcp add` 默认落这里） |

```json
// .mcp.json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

装之前先算成本：**每多一个 MCP server，工具名就多占一点常驻上下文**。官方给的做法是用 `/context` 看占用、用 `/mcp` 停掉不用的 server。

还有一条更省钱的：**能用 CLI 就别用 MCP**。`gh`、`aws`、`gcloud` 这类命令不贡献工具定义列表，而 MCP 工具会。

官方文档**不推荐任何具体 MCP server 产品**。社区常见的选择大致是这几类：

| 类别 | 例子 | 用途 |
|---|---|---|
| 文档检索 | Context7 | 查库的当前版本 API，防幻觉 |
| 浏览器 | Playwright / Claude in Chrome | 前端调试、看用户实际看到的 |
| 代码托管 | DeepWiki | 读陌生仓库的架构 |
| 设计 | Excalidraw | 出架构图 |

⚠️ **这张表是社区实践，不是官方推荐。** 选型时更该问的是「这个能力能不能用 CLI 或已有工具解决」—— 因为每加一个 server 都在花常驻上下文。

**tool search 默认开启**，它的行为是：server 连上后，Claude Code 在下一次请求里把该 server 的工具名列给 Claude，Claude 能直接搜索并调用，不必等你的下一条消息。用 `ENABLE_TOOL_SEARCH=auto` 时，只有工具定义能塞进上下文 10% 以内才会预加载。

#### 内置 skills 的现状

⚠️ 网上流传的「内置 5 种 skill」清单已经不准了。当前官方文档里能确认的是：

- **Anthropic 内置**：`pdf`、`xlsx`（在 claude.ai 里可以开关同步）
- **bundled 随安装提供**：`simplify`、`verify` —— 从 v2.1.286 起，会话以这两个名字开头时，Claude Code 会让 Claude 在每次 commit 前跑一遍（文档和测试的改动除外）

要用的话查 `/` 菜单，别照着旧清单写。

---

## 四、如果你要自己写一个 Agent

上面这些机制不是 Claude Code 独有的。它们可以拆成六层。

![要自己写一个 Agent，分六层](/images/agent-six-layers.png)

| 层 | 干什么 | Claude Code 里的对应 |
|---|---|---|
| **L1 model** | 多供应商、模型档位、思考预算、降级 | 模型别名、`/model`、effort 档位 |
| **L2 tool** | 工具定义、权限、结果处理 | 大结果落盘、文件去重、LSP 工具 |
| **L3 context** | 装什么、装多少、何时压缩、怎么补全 | **本文整篇在讲这层** |
| **L4 hooks** | 事件钩子 / middleware | PreToolUse / PostToolUse / SessionStart |
| **L5 service** | 会话管理、记忆、恢复续接 | session、auto memory、`/resume` |
| **L6 dream system** | 后台的知识整理、记忆整理、元信息 | 后台任务、后台子代理、`/insights` |

**越往上越不参与当次回答。**

L1-L4 都在一次请求的路径上；L5 管的是「这个会话从哪来、能不能接上」；L6 完全在后台 —— 它整理出来的记忆，在**下次**会话被重新注入。

「dream system」这个叫法有意思的地方在于，它对应的是**离线整理**这件事：会话进行中产生的碎片信息（这次读了什么、哪里卡住了、用户纠正了什么），在后台被归纳成结构化记忆，下次开局就带着。

这跟「写进 CLAUDE.md」的区别是：CLAUDE.md 是**人写的**，dream system 是**系统从使用痕迹里长出来的**。

### 为什么要分六层

因为**每一层都能单独测**。

自建 Agent 最常见的失败模式是把上下文当成「拼 prompt」—— 一股脑塞进去。结果是：

- 越用越慢（上下文无限增长）
- 越用越贵（每次请求都付全量）
- **而且说不清哪句话让它跑偏**（因为没有边界可以排查）

分层之后，问题能定位到层：

| 症状 | 该查哪层 |
|---|---|
| 回答里出现了本该忘掉的东西 | L3 —— 装多了 |
| 重要的事中途丢了 | L3 —— 压缩策略不对 |
| 危险操作没被拦住 | L2 或 L4 —— 权限 / 钩子 |
| 换个模型就崩 | L1 —— 模型适配 |
| 接不上上次 | L5 —— 会话管理 |
| 用了半天还是不知道项目长什么样 | L6 —— 没有知识整理 |

⭐ **L3 最容易被跳过，因为它是唯一一个「不做也不会立刻报错」的层。** 少了它不会崩，只是慢慢变慢、变贵、变笨。

---

## 五、落地清单

如果你现在就想改点什么：

**1. 看一眼上下文里现在有什么**

```bash
/context        # 按类目列出占用，并给出优化建议
/memory         # 看当前加载了哪些 CLAUDE.md 和 auto memory
```

**2. 精简 CLAUDE.md**

官方给的量化目标：**200 行以下**。

判据是「删掉它，Claude 的行为会变吗」。不变就删。`/init` 的 prompt 原文列了三个典型反例：

- "Provide helpful error messages to users"
- "Write unit tests for all new utilities"
- "Never include sensitive information (API keys, tokens) in code or commits"

**3. 规矩要跨压缩存活，就别放在带 `paths:` 的 rule 里**

移到项目根 `CLAUDE.md`，或者去掉 `paths:` frontmatter。

**4. 大文件读取外包给子代理**

别让主对话读 10,000 行日志。让子代理读，只把摘要带回来。

**5. 专项流程做成 skill，不写进 CLAUDE.md**

skill 描述启动时进上下文，正文调用时才进。省下来的就是真金白银。

**6. 装代码智慧插件**

一次「前往定义」取代 grep + 读多个候选。

**7. 控制压缩时保留什么**

```markdown
# CLAUDE.md
## Compact Instructions
When compacting, preserve test output and the list of modified files.
```

或者手动 `/compact focus on ...`。

**8. 不想要 git 快照就关掉**

```json
{ "includeGitInstructions": false }
```

**9. 大结果落盘，别往对话里灌**

MCP 工具响应默认上限 25,000 token，超了警告；超长的纯文本结果会存到文件。

**10. 要更早压缩就调窗口**

```bash
/autocompact 500k          # 当前模型，之后的会话
claude --autocompact 500k  # 只这一次
```

取值范围 100K–1M，写法支持 `200k` / `1M`。

**11. 记一条命令以外的东西**

```bash
/context        # 上下文占用分类 + 优化建议
/memory         # 看当前加载了哪些 CLAUDE.md 和 auto memory
/mcp            # 停掉不用的 server
```

---

## 六、编排模式：Command → Agent → Skill

机制讲完，回过头看这三种扩展方式的关系，其实是一条流水线：

| | 作用 | 谁在决定何时用 |
|---|---|---|
| **Command** | 把一段知识插进当前对话 | 用户打 `/name` |
| **Skill** | 一套按需加载的领域流程 | Claude 按 description 判断 |
| **Subagent** | 独立上下文里跑一个复杂任务 | Claude 按 description 委派 |

**它们不是三选一，是三层。**

一个典型的活是这样流动的：

```
用户：「发布到预发」
  ↓
Command  /deploy        ← 展开一段流程说明进当前对话
  ↓
Skill    deploy         ← 正文按需加载，提供领域细节
  ↓
Subagent  跑构建和上传   ← 在独立上下文里干脏活，主对话只收摘要
```

**选型还是那一条**：

| 场景 | 用哪个 |
|---|---|
| 固定动作，几步就完 | Command |
| 有分支的流程，需要领域知识 | Skill |
| 活很脏（读很多文件、改很多文件），结论很短 | Subagent |
| 规矩每次都要遵守 | 根 CLAUDE.md 或无条件 rule |
| 规矩只在某个目录生效 | 带 `paths:` 的 rule 或 skill |

⚠️ **最后两行有个坑**：带 `paths:` 的规则和 skill 正文都会随压缩被总结掉（见 3.4 和 3.8）。**要跨压缩存活，就把它放进项目根 CLAUDE.md。**

---

## 写在最后

这篇修订里最值得带走的一件事，不是某个数字，是**「上下文是预算」这个视角**。

一旦接受这个视角，很多问题会自动重排优先级：

- `/init` 不是「生成一份文档」，是**把有限的常驻预算花在刀刃上**
- 压缩不是「出事了才处理」，是**三档成本递增的常规操作**
- CLAUDE.md 不是「越多越好」，是**「删掉不会出错就删」**
- skills 不是「更高级的 CLAUDE.md」，是**「按需加载」这个机制的具体实现**

**而最后一层，是这些机制背后那个更大的东西。** Claude Code 已经不只是「一个 CLI 工具」，它更像操作系统的早期形态 —— 有进程、有文件系统、有权限、有后台守护进程、有 IPC。Agent Team 把这个形态又往前推了一步：多个 Agent 各自持有上下文窗口，通过消息互相协作。

**操作系统当年解决的是「程序和硬件之间怎么分工」，Agent 现在遇到的是同一个问题。** L1-L6 就是这个分工的答案。

---

## 参考资料

- **[Explore the context window](https://code.claude.com/docs/en/context-window)** —— 官方对上下文时间线与压缩存活的完整说明
- **[How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)** —— agentic loop、内置工具、与项目的交互
- **[Store instructions and memories](https://code.claude.com/docs/en/memory)** —— CLAUDE.md 层级、auto memory、path-specific rules
- **[Manage costs effectively](https://code.claude.com/docs/en/costs)** —— 上下文省 token 的实操清单
- **[Model configuration](https://code.claude.com/docs/en/model-config)** —— auto-compact 窗口与默认值
- **[Settings reference](https://code.claude.com/docs/en/settings-reference)** —— `includeGitInstructions` 等全部配置项
- **[Claude Code 1.0.88 npm 包](https://www.npmjs.com/package/@anthropic-ai/claude-code)** —— 源码常量出处（旧版 Node.js 实现，现已改为原生二进制）
- **[Best practices 汇总仓库](https://github.com/shanraisshan/claude-code-best-practice)** —— 原版学习笔记的来源
- **[代码知识库的确定性冷启动](/posts/ai-practice/ai-theory/cold-start-ast-vs-llm.html)** —— 上下文「补全」的另一面：把知识从查询时搬到编译时

---

_本文所有数字均标注了来源：官方文档页直接给出，源码常量注明版本（Claude Code 1.0.88）。两边都没有的数字不做断言。_
