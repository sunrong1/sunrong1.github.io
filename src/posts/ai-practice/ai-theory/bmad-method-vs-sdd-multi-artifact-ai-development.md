---
title: 'BMAD-METHOD 入门：多 Artifact 体系如何重塑 AI 辅助开发'
date: '2026-09-02'
tags:
  - BMAD
  - SDD
  - AI Agent
  - 多 Agent 协作
  - 超级个体
  - 工程化
categories:
  - AI 实践
icon: 🏗️
author: Mr.Sun
---

# BMAD-METHOD 入门：多 Artifact 体系如何重塑 AI 辅助开发

> 本文不是 BMAD 实战记录（实战放下一篇），是**为什么 BMAD 比 SDD 更适合复杂 AI 辅助开发**的入门解读。
>
> 适用读者：用过 Cursor / Claude Code 写过代码，但遇到"AI 写出来跟我想的不一样 / 上下文丢失 / 多人协作混乱"问题的工程师。

***
## 💡 背景

最近 18 个月，AI Coding 工具的爆发速度远超预期：

- **Cursor / Claude Code / Windsurf** —— 1 个人的代码产出效率提升 3-5 倍
- **Devin / Codex Agent** —— 整个 issue 自动闭环
- **v0 / Bolt / Lovable** —— 自然语言直接生成完整应用

但作为有 10+ 年经验的工程师，我**亲手踩过这些坑**：

1. **AI 写出来跟我想的不一样** —— 不是工具不行，是"我想的"根本没被结构化记录
2. **上下文丢失** —— 第 3 轮对话后，AI 已经忘了第 1 轮我说的业务约束
3. **多人协作混乱** —— A 写的代码 B 接不住，文档永远滞后于代码
4. **复杂项目失控** —— 简单功能能搞定，超过 5 个 story 的功能就开始跑偏

**这些问题的根因，不是 LLM 能力不够，是**「**缺少一套让 AI 和人都能遵守的工程纪律**」。

行业给出了两条主流答案：

- **SDD（Spec-Driven Development）** —— GitHub Spec Kit、AWS Kiro 是代表，强调"先写规格再写代码"
- **BMAD-METHOD** —— 21 个专业 agent + 50+ 工作流，强调"**多 artifact 体系 + 3 阶段闭环 + 多 persona 协作**"

我深入读了 BMAD 仓库（2088 commits / 57MB），跑通了本地 install，对比了 SDD 和 BMAD 的设计哲学——**我的结论是：BMAD 比 SDD 更系统化、工程化，更适合"超级个体"或小型团队**。

本文就是这次学习的精华整理。

***
<!-- more -->
## 一、SDD 是什么？为什么单文件规格不够？

### 1.1 SDD 的核心理念

**SDD（Specification-Driven Development）** 是一套**先写规格、再写代码**的开发方法论：

1. 先写一份完整的 `SPEC.md`（功能需求 + 接口定义 + 验收标准）
2. AI / 工程师照着规格实现
3. 规格变了，代码跟着变

GitHub 2025 年发布的 [Spec Kit](https://github.com/github/spec-kit) 是 SDD 的代表性实现，包含：

- `specify` 命令 —— 生成 SPEC.md
- `plan` 命令 —— 把 SPEC 拆成实现计划
- `tasks` 命令 —— 拆成可执行任务

**SDD 的最大价值**：把"需求"从"脑子里"搬到"文件里"，让 AI 和人都能读同一份规格。

### 1.2 SDD 在复杂项目里的 3 个致命缺陷

但**简单项目的银弹，往往是复杂项目的灾难**。我用 SDD 跑了几个中型项目后，发现 3 个致命缺陷：

**缺陷 1：单文件规格的"信息密度诅咒"**

`SPEC.md` 一旦超过 50 页，**没人（包括 AI）能完整读完**。结果就是：

- 后面的 story 跟前 10 页的"全局约束"矛盾
- AI 实现时只读最新 200 行，忘了前面定下的架构原则
- 团队成员各取所需，规格变成"四个工程师四种理解"

**缺陷 2：缺少"角色分工"**

SDD 把所有规格都堆在一个文件里。但实际项目里：

- **PM 关心的是**：业务目标、用户故事、验收标准
- **架构师关心的是**：技术选型、数据模型、API 设计
- **开发者关心的是**：任务分解、文件位置、测试标准

一份 `SPEC.md` 试图服务三种角色，**每种角色都只能拿到 1/3 的信号**。

**缺陷 3：缺少"反馈环"**

软件项目没有"一次写对"——

- 实现中发现架构有问题
- 用户反馈需求要调整
- 上线后出现未预见的边界条件

**SDD 是个单向流程**（规格 → 代码），没有内置的"实施过程中变更规格"的机制。规格一旦写下就成"历史包袱"，变更要靠人工口头同步。

### 1.3 SDD 的本质问题：**单文件 vs 多 Artifact**

SDD 的根因问题，是它把"规格"当成**单一文档**。但**真实的工程决策是多维度的**：

- **业务维度**（为什么做、为谁做、什么算成功）
- **架构维度**（技术选型、数据流、API 契约）
- **实施维度**（任务分解、文件位置、测试标准）

每种维度有不同的读者、不同的更新频率、不同的生命周期。**强行塞进一个 SPEC.md，等于把所有鸡蛋放一个篮子**。

> ⚠️ **SDD 不是不好，是粒度太粗**。它适合 1-2 人、1-2 周的简单项目，不适合 5+ 人或 2+ 周的复杂项目。

***
## 二、BMAD 核心创新：多 Artifact 体系

BMAD-METHOD（Breakthrough Method of Agile AI-Driven Development）给出的答案，是**多 artifact 体系**——

不是 1 个 SPEC.md，而是 **4 类 artifact 协同工作**：

| Artifact | 角色 | 生命周期 | 读者 |
|----------|------|----------|------|
| **PRD**（Product Requirements Document） | PM（John） | 短期（周级） | 业务方、架构师、QA |
| **architecture.md** | Architect（Winston） | 中期（月级） | 架构师、开发者 |
| **epics.md** | PM（John） | 短期（周级） | 整个团队 |
| **story-X.md** | SM（Scrum Master） | 极短（天级） | Dev、QA |

**每种 artifact 都有**：

- **自己的结构模板**（不是自由文本）
- **自己的 agent 责任人**（不是"谁都能写"）
- **自己的引用机制**（用 `[Source: docs/<file>.md#Section]` 显式标注来源）
- **自己的读者**（不是"全公司都要读"）

我用 BMAD 跑通了 install 命令后，截一张实际产物：

```bash
$ node tools/installer/bmad-cli.js install --directory ./hero --tools opencode
◆  opencode commands: 29 → .opencode/commands
◆  opencode configured: 29 skills → .agents/skills
```

装出来的 `.opencode/commands/` 里有 29 个文件，每个文件**就 2 行**：

```markdown
---
description: Product manager for PRD creation and requirements discovery
---

@skills/bmad-agent-pm
```

`@skills/bmad-agent-pm` 是一个**跨目录引用**——它引用到 `src/bmm-skills/agents/bmad-agent-pm/SKILL.md` 下的完整 persona 定义。

### 2.1 4 类 artifact 的协同关系

**关键设计**：4 类 artifact **不是平行关系，是接力关系**：

```
PRD.md ─→ architecture.md ─→ epics.md ─→ story-1.3.md
   │              │              │              │
 PM          Architect          PM             SM
   │              │              │              │
   └────── 引用 ──┴────── 引用 ──┴────── 引用 ──┘
```

每个 artifact 通过**显式引用**上一步的产物，**而不是"心照不宣"**。Dev agent 读 `story-1.3.md` 时，通过里面的 `[Source: docs/architecture.md#Section-3]` 直接跳到架构文档的对应章节，**不用读完整个 architecture.md**。

这就是 BMAD 比 SDD 强的核心点：**用 artifact 之间的引用链代替"读完整个大文件"**。

### 2.2 Story 文件的"超详细"设计

**最让我惊艳的，是 story 文件的模板**（`src/bmm-skills/plan/bmad-create-story/template.md`）：

```markdown
# Story {{epic_num}}.{{story_num}}: {{story_title}}

Status: ready-for-dev

## Story
As a {{role}},
I want {{action}},
so that {{benefit}}.

## Acceptance Criteria
1. [Add acceptance criteria from epics/PRD]

## Tasks / Subtasks
- [ ] Task 1 (AC: #)

## Dev Notes
- Relevant architecture patterns and constraints
- Source tree components to touch
- Testing standards summary

### Project Structure Notes
- Alignment with unified project structure (paths, modules, naming)

### References
- Cite all technical details with source paths and sections, e.g. [Source: docs/<file>.md#Section]

## Dev Agent Record
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
```

**对比传统敏捷 story**——传统 story 写完，Dev 还要去问 PM"完整的用户场景是什么"、问架构师"数据怎么存"、问 QA"测试标准是什么"。

BMAD 的 story 文件**自包含**所有 Dev 需要的上下文：

1. **Dev Notes** —— 从架构文档里 slice 出"只跟这个 story 相关的部分"
2. **References** —— 强制要求引用源文件路径 + 章节
3. **Dev Agent Record** —— Dev 干完活**回填**（用了啥模型、碰了哪些文件）

**结果**：Dev agent 拿到 story 文件 = 瓦工拿到施工任务单，**不用读全剧，只读自己那张切片**。

> 💡 **多 artifact 体系的核心思想：每个 agent 只读自己关心的那份切片，不读全剧**。这比 SDD 的"读完整 SPEC.md"高效 10 倍。

***
## 三、3 阶段闭环：Plan → Ship → Correct

如果说多 artifact 体系是 BMAD 的"静态结构"，那 **3 阶段工作流**就是它的"动态流程"。

BMAD 把软件开发分成 3 个阶段，**且形成闭环**：

```
        ┌─ Plan ─┐
        │        ↓
   Correct ←── Ship
        ↑
      反馈回来
```

### 3.1 Plan 阶段（做什么、怎么做）

**核心问题**：从模糊需求到可执行的 story 文件

**触发模式**：**Agent 主动**——PM agent 自己跑流程

**关键 skill**：

- `bmad-prd` —— 跟用户多轮对话，产出 PRD.md
- `bmad-architecture` —— 读 PRD，产出 architecture.md
- `bmad-create-epics-and-stories` —— 把 PRD + 架构拆成 epics + stories
- `bmad-sprint-planning` —— 把 story 排进 sprint

**产出物**：`PRD.md` + `architecture.md` + `epics.md` + `story-X.md`

### 3.2 Ship 阶段（干出来、跑通）

**核心问题**：从 story 到能跑、能测的代码

**触发模式**：**Artifact 主动**——Dev agent 读 story 文件干活，不是靠 prompt 里的指令

**关键 skill**：

- `bmad-build` —— 读 story 文件，输出代码 + 单元测试
- `bmad-code-review` —— 自动评审 diff
- `bmad-retrospective` —— sprint 回顾
- `bmad-investigate`（v6 新）—— 调查 bug / 探索未知代码

**产出物**：代码 + PR + 测试报告

### 3.3 Correct 阶段（中途要变怎么办）

**核心问题**：实施过程中发现需求/架构要调整

**触发模式**：**人触发**——人发现变更信号，主动调 `bmad-correct-course`

**关键 skill**：

- `bmad-correct-course` —— 评估变更影响，更新 PRD / 架构 / epics / stories

**特点**：Correct 阶段**不是"流程的最后一步"，是"流程的反向回环"**——它从 Ship 回到 Plan，重新跑相关环节。

### 3.4 跟 SDD 的关键差异

| 维度 | SDD | BMAD |
|------|-----|------|
| **流程方向** | 单向（规格→代码） | **闭环**（Plan→Ship→Correct→Plan） |
| **每个阶段触发** | 人 | **Agent 或 Artifact 主动** |
| **变更处理** | 手动同步 | **Correct 阶段自动更新** |
| **阶段产出** | 一个 SPEC.md | **每个阶段 1+ 个 artifact** |

**核心差异**：SDD 是个**线性流程**，BMAD 是个**反馈闭环**。

> ⚠️ **复杂项目的本质是"变更管理"，不是"初始规划"**。BMAD 的 Correct 阶段就是为变更而生的，SDD 没有对应机制。

***
## 四、5 个 Agent 怎么协作（实测演示）

BMAD 现有 **5 个角色 agent**（BMM 模块），每个都有**独立的 persona 和菜单**：

| Agent | 角色名 | 核心职责 |
|-------|--------|----------|
| **PM** | John 📋 | 写 PRD、拆 epics |
| **Architect** | Winston 🏗️ | 系统架构、技术选型 |
| **Dev** | Amelia 💻 | 按 story 写代码 |
| **Analyst** | Mary 📊 | 市场调研、用户研究 |
| **UX Designer** | Sally 🎨 | UI/UX 设计 |

跨模块（BMM / CIS / GDS / TEA）加起来一共 **21 个 agent**。

### 4.1 Agent 与 Skill 的解耦设计

**BMAD 最巧妙的设计**是 **Agent（壳）与 Skill（干活）的解耦**：

- **Agent** = 角色 + 菜单（persona + menu）
- **Skill** = 具体工作流（workflow）

看 PM 的 `customize.toml`：

```toml
[[agent.menu]]
code = "PRD"
description = "Create, update, or validate a PRD"
skill = "bmad-prd"

[[agent.menu]]
code = "CE"
description = "Create the Epics and Stories Listing"
skill = "bmad-create-epics-and-stories"
```

PM 菜单里的 `skill = "bmad-prd"` **不是** PM 自己的目录下的代码，**跨目录**引用到 `src/bmm-skills/plan/bmad-prd/`。

**这种解耦的价值**：

- **同一份 skill 可以被多个 agent 复用**（比如 `bmad-correct-course` 任何 agent 都能调）
- **改 skill 不影响 agent 的 persona**（改 PM 的语气风格 vs 改 PRD 模板，独立进行）
- **加新 agent 不需要重写 skill**（加一个"测试需求分析师" agent，复用现有 skill）

### 4.2 OpenCode 实测：怎么调起 agent

我用的是 **OpenCode**（BMAD 官方支持的 48 个 IDE 之一）：

```bash
# 1. 在你的项目里执行 install
node tools/installer/bmad-cli.js install --tools opencode --modules bmm

# 2. 在 OpenCode 里输入
/bmad-agent-pm
```

**第一次调起**：

```
John: 📋 你好 SunRong！我是 John，Product Manager。

| # | Code | Description                          | Action                       |
|---|------|--------------------------------------|------------------------------|
| 1 | PRD  | 写/更新/验证 PRD                    | bmad-prd                     |
| 2 | CE   | 创建 epics + stories                 | bmad-create-epics-and-stories|
| 3 | IR   | 检查实施就绪度                       | bmad-sprint-planning         |
| 4 | CC   | 中途纠偏                            | bmad-correct-course          |

请输入数字或 code
```

输入 `1`，John 调起 `bmad-prd` skill，开始多轮对话引导你写 PRD。

### 4.3 IDE 适配层：48 个 IDE 怎么统一

BMAD 装到不同 IDE 时，**入口文件长得不一样**：

| IDE | 入口文件 | 特点 |
|-----|---------|------|
| **OpenCode** | `.opencode/commands/<id>.md` | 2 行 YAML + `@skills/<id>` 引用 |
| **Claude Code** | `.claude/skills/<id>/` | 自己的 skill 协议 |
| **Cursor / Codex / Gemini** | `.agents/skills/<id>/` | 共享统一协议 |
| **GitHub Copilot** | `.github/agents/<id>.agent.md` | **只装 persona agent**，过滤掉 workflow |

**所有 IDE 读的是同一份 skill 内容**（`.agents/skills/<id>/SKILL.md`），**差异只在"怎么调起"**。

**4 个 preferred 平台**（Claude Code / Codex / Cursor / Copilot）有**深度优化**，其它 44 个走**基础支持**。

**配置注册表**在 `tools/installer/ide/platform-codes.yaml`，加新 IDE 就加一个 entry。

> 💡 **这种"统一内容 + 适配入口"的设计，是 BMAD 能支持 48 个 IDE 又不崩盘的核心**。对比 SDD 工具通常只支持 1-2 个 IDE。

***
## 五、为什么 BMAD 给"超级个体"用

我之所以对 BMAD 这么兴奋，是因为它跟**"超级个体"**这个人生主线**深度同构**。

### 5.1 超级个体的定义

**超级个体** = 1 个人 + 多 agent 团队，**放大个人能力**而不是替代团队。

- 传统个人：1 个人能写代码、能测试、能写文档——但只能串行做
- 超级个体：1 个人 + 5-7 个 agent **并行协作**——能力放大 5-10 倍

### 5.2 BMAD 跟"心×行"的对应

我的人生主线"认知杠杆"有个核心公式：**心 × 行 = 成果**

- **心** —— 认知、判断、决策、价值观
- **行** —— 执行、流程、工程化

**BMAD 恰好把"心×行"工程化了**：

| 心×行 | BMAD 对应 |
|------|----------|
| **心**（认知、决策） | Agent 的 **persona**（角色设定、原则、通信风格） |
| **行**（执行、流程） | Skill 的 **工作流**（多轮对话、artifact 产出） |
| **心×行** | **Agent 调用 Skill**：persona 带着"心"去驱动"行" |

**这套对应不是巧合**——任何想放大个人能力的框架，本质都要解决"心"和"行"的可复用、可审计、可交接问题。BMAD 用 artifact 体系给出了工程化答案。

### 5.3 Meta-Framework 价值

**更深的洞察**：BMAD 是个 **meta-framework**（造框架的框架）——它不只能用于"软件开发"，还能用于：

- **写作**（book / blog / 论文的 chapter-agent）
- **商业**（market-research-agent / strategy-agent）
- **学习**（paper-reading-agent / concept-mapping-agent）
- **个人成长**（goal-tracking-agent / reflection-agent）

BMAD 官方就有 [BMad Creative Intelligence Suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite) 模块，专门做"创新、头脑风暴、设计思维"。

**这才是给"超级个体"用的工具**——**不是替代你的专业能力，是把你的专业能力封装成可复用的 agent 团队**。

> 💡 **用 BMAD 不只是"提高编码效率"，是"建构你自己的 agent 团队基础设施"**。

***
## 六、入门路径：3 条上手路线

最后给想入门的同学 3 条上手路线，按"上手速度"排序：

### 6.1 路线 A：Web 路径（5 分钟，最快）

**适合**：想先体验、不想装 IDE 的同学

**步骤**：

1. 打开 `https://github.com/bmad-code-org/BMAD-METHOD`
2. 复制 `.bmad-core/web-bundles/teams/team-fullstack.txt` 的内容
3. 在 Gemini 创建 Gem，或在 ChatGPT 创建 CustomGPT
4. 把内容粘贴进 Instructions，设置为 "Your critical operating instructions..."
5. 开始聊天，输入 `/help`

**优点**：5 分钟上手、有完整 agent 团队体验

**缺点**：上下文在云端、不能直接操作本地代码

### 6.2 路线 B：IDE 路径（15 分钟，推荐）

**适合**：要在真实项目里用的工程师

**步骤**：

```bash
# 1. 克隆 BMAD 仓库
git clone https://github.com/bmad-code-org/BMAD-METHOD.git
cd BMAD-METHOD

# 2. 装依赖
npm install

# 3. 在你的项目目录里跑 install
mkdir -p ~/my-project
node tools/installer/bmad-cli.js install \
  --directory ~/my-project \
  --tools opencode \    # 或 claude-code / cursor / windsurf
  --modules bmm \
  --user-name "你的名字" \
  --yes
```

**4. 打开 IDE**（Cursor / Claude Code / OpenCode / Windsurf）

**5. 输入** `/bmad-help` 试

**优点**：本地化、上下文在项目里、能直接操作代码

**缺点**：需要 Node.js v20+、需要至少一个支持的 IDE

### 6.3 路线 C：完全本地源码（30+ 分钟）

**适合**：想改 BMAD 源码、做定制模块的人

**步骤**：

```bash
# 1. 完整 clone
git clone https://github.com/bmad-code-org/BMAD-METHOD.git
cd BMAD-METHOD

# 2. 装依赖 + 跑 install
npm install
npm run install:bmad

# 3. 阅读源码
code src/bmm-skills/agents/    # 5 个 agent 的定义
code src/bmm-skills/plan/      # Plan 阶段 skills
code src/bmm-skills/ship/      # Ship 阶段 skills
code tools/installer/ide/      # IDE 适配层
```

**优点**：能完全控制、能为自己的项目定制

**缺点**：要懂 Node.js + 要理解 BMAD 设计哲学

### 6.4 48 个支持的 IDE 一览

BMAD 官方支持 **48 个 IDE**，4 个 preferred（深度优化）：

| Preferred | 基础支持（部分） |
|-----------|------------------|
| Claude Code / Codex / Cursor / Copilot | OpenCode / Windsurf / Cline / Kiro / Gemini / Roo / Cline / QwenCoder / Droid / ... |

**完整列表**：`tools/installer/ide/platform-codes.yaml`，每个 IDE 各一个 entry。

***
## 七、跟 SDD 的全景对比

最后用一张表总结 BMAD vs SDD：

| 维度 | SDD | BMAD | 优势方 |
|------|-----|------|--------|
| **核心思想** | 单文件规格驱动 | 多 artifact 体系 + 3 阶段闭环 | BMAD |
| **Artifact 数量** | 1 个 SPEC.md | 4 类（PRD/架构/Epics/Stories） | BMAD |
| **角色分工** | 无（谁都能写 SPEC） | 5 个 persona agent | BMAD |
| **触发模式** | 人 | Agent / Artifact / 人 | BMAD |
| **反馈环** | 无 | Correct 阶段 | BMAD |
| **IDE 集成** | 1-2 个 | 48 个 | BMAD |
| **学习曲线** | 低 | 中 | SDD |
| **适用项目** | 1-2 人、1-2 周 | 5+ 人、2+ 周 | 各有擅长 |
| **可定制性** | 改 prompt | 改 agent/skill + customize.toml | BMAD |
| **社区生态** | 较新 | 1.2K commits、1.2K+ 贡献者 | BMAD |

**我的建议**：

- **简单项目**（landing page、tool 脚本、1 周内能交付）→ 用 SDD，够用
- **复杂项目**（SaaS、平台工具、2+ 周）→ 用 BMAD，工程化程度高 10 倍
- **想建自己 agent 团队** → 用 BMAD，meta-framework 价值远超 SDD

***
## 八、下一篇预告

本文是 BMAD 入门篇（**是什么 / 为什么**），下一篇是**实战篇**（**怎么用**）：

**「用 BMAD 给 AI Agent 平台定制 AI Agent 团队」**

会涉及：

1. **复制 PM agent 当模板**，改成 `bmad-agent-hero-test-analyst`
2. **写 SKILL.md 和 customize.toml**，定义"测试需求分析师"的人设
3. **设计 Plan 阶段末尾的 skill**（Architect 之后、Dev 之前）
4. **跑 install 验证**，在 OpenCode 里调起来
5. **集成到真实 AI Agent 项目**，写一两个 story 试试

**预计产出**：

- 1 个新的 BMAD agent
- 1 个新的 BMAD skill
- 1 篇可写在简历里的实战案例：「为 AI Agent 平台定制 AI Agent 团队，基于 BMAD-METHOD 扩展」

如果你也在做 AI Coding 相关项目，欢迎一起交流。

***
## 📚 参考资料

- [BMAD-METHOD 官方仓库](https://github.com/bmad-code-org/BMAD-METHOD)
- [GitHub Spec Kit（SDD 代表）](https://github.com/github/spec-kit)
- [BMad Creative Intelligence Suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)
- [BMad Builder（造 agent 的工具）](https://github.com/bmad-code-org/bmad-builder)
- [Kiro（AWS 的 SDD 实现）](https://kiro.dev/)

***
**作者：Mr.Sun

**关于我**：10+ 年研发经验，资深技术专家 + 团队负责人。专注于 AI Agent 平台研发，最近在生产环境融合 AgentScope 2.0，给 BMAD-METHOD 等开源项目贡献 PR。个人 blog：[sunrong.site](https://sunrong.site/)

**版权声明**：本文采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 协议，转载请保留作者信息和原文链接。
