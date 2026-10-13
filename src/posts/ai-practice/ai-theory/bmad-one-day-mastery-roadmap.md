---
title: '一天掌握 BMAD-METHOD：从装到改的 6 小时路线图'
date: '2026-10-11'
tags:
  - BMAD
  - AI Agent
  - 学习方法论
  - SDD
  - 源码阅读
  - 超级个体
categories:
  - AI 实践
icon: 🧭
author: Mr.Sun
---

# 一天掌握 BMAD-METHOD：从装到改的 6 小时路线图

> BMAD-METHOD 官方文档写得细，但没人告诉你**按什么顺序读**。
>
> 这篇是我把 v6.11.0 源码通读一遍之后，倒推出来的**最短路径**。6 小时，从"装上"到"能改源码"。

***
## 💡 为什么需要这篇

第一次接触 BMAD，我干过这些蠢事：

- 打开仓库，2088 个 commit，直接慌
- 从 `docs/` 开始读，读了 40 分钟，还是不知道该跑哪个命令
- 装了 `bmad-method`，29 个 skill 一股脑全看，看完啥也记不住
- 以为学 BMAD = 读完文档 = 懂了

后来我花了一整天通读源码，发现：**BMAD 的学习路径是有结构的**，而且**90% 的人只需要 20% 的源码**。

这篇就是那个结构。

***
<!-- more -->
## 一、先记住这张地图

BMAD v6.11.0 的完整骨架：

```
src/
├── core-skills/          9 个   跨项目通用（brainstorming / help / party-mode / review...）
├── bmm-skills/           1 个   BMad Method 模块（软件开发主流程）
│   ├── agents/           5 个   PM / Architect / Dev / Analyst / UX-Designer
│   ├── plan/            10 个   规划阶段 skill
│   └── ship/             7 个   交付阶段 skill
└── scripts/              5 个   配置解析 + 渲染（Python）

tools/installer/ide/            IDE 适配层（48 个平台）
bmad-modules.yaml               官方模块注册表（7 个）
```

几个硬数字，先建立体感：

| 项 | 数量 |
|---|---|
| `SKILL.md` 总数 | 50 |
| `step-*.md` 分步文件 | 23 |
| `customize.toml` 配置 | 35 |
| IDE 平台支持 | 48（4 个 preferred）|
| 官方扩展模块 | 7 |

**别被 50 个 skill 吓到**——核心只有 **5 个 agent + 10 个 plan + 7 个 ship**，剩下的都是外围。

***
## 二、6 小时路线图

我把学习拆成 6 段，每段 1 小时。每段都有**明确的产出物**，学完就知道自己到了哪一步。

***
### 第 1 小时：跑通 + 建立地图

**动作**：

```bash
git clone https://github.com/bmad-code-org/BMAD-METHOD.git
cd BMAD-METHOD
npm install

# 装到你的项目（这里用 opencode，换成 claude-code / cursor 同理）
node tools/installer/bmad-cli.js install \
  --directory /tmp/bmday \
  --tools opencode \
  --modules bmm \
  --yes
```

**然后看这三个文件**（这是全部的"入口密码"）：

```bash
# 1. skill 元数据注册表 —— BMAD 的 API 文档
cat src/bmm-skills/module-help.csv | head -20

# 2. 项目配置
cat /tmp/bmday/_bmad/core/config.yaml

# 3. 一个 command 指针（你会发现它只有 4 行）
cat /tmp/bmday/.opencode/commands/bmad-prd.md
```

**产出物**：能说清"装完之后到底多了哪些目录"。

装完你会看到：

```
/tmp/bmday/
├── .agents/skills/       所有 skill 的真身
├── .opencode/commands/   斜杠命令指针（4 行一个文件）
├── _bmad/                运行时（config / scripts / core / bmm）
└── _bmad-output/         你和 BMAD 的所有产出物都在这
```

> 💡 **第 1 小时最重要的认知**：`.opencode/commands/bmad-prd.md` 全文只有 4 行——`description` + `@skills/bmad-prd`。**BMAD 不是在生成复杂代码，它是在生成"指针 + Markdown 说明书"**。理解这一点，后面全都通了。

***
### 第 2 小时：搞懂 Agent（角色层）

**只看 2 个文件**，代表全部 5 个 agent：

```bash
cat src/bmm-skills/agents/bmad-agent-pm/SKILL.md
cat src/bmm-skills/agents/bmad-agent-pm/customize.toml
```

**要抓的 3 件事**：

**① Agent = persona + 菜单，没有别的**

`customize.toml` 里 personable 的字段就这些：

| 字段 | 作用 |
|---|---|
| `name` / `title` | 人名 + 职位（PM 是 John）|
| `icon` | 前缀图标，方便识别谁在说话 |
| `role` | 职责一句话 |
| `identity` | 思维范式（PM 是"Marty Cagan + Teresa Torres，Bezos 六页纸纪律"）|
| `communication_style` | 说话风格 |
| `principles` | 价值系统数组 |
| `menu` | 能力菜单，每项指向一个 skill |

**② SKILL.md 是一份 8 步激活协议**

```text
Step 1  解析 customize（跑 resolve_customization.py）
Step 2  执行 prepend 步骤
Step 3  加载 persona（身份 / 风格 / 原则）
Step 4  加载 persistent_facts（常驻事实）
Step 5  加载 config（用户名 / 语言 / 输出目录）
Step 6  打招呼（带 icon 前缀）
Step 7  执行 append 步骤
Step 8  派发 或 渲染菜单
```

**③ Step 8 决定了交互体验**

如果你的第一句话已经指明意图（比如"帮我写 PRD"），直接派发；否则渲染菜单让你选。菜单是 **LLM 现场渲染的 markdown 表格**，不是 IDE 的 GUI 菜单——这点最容易误解。

**产出物**：能画出"agent 激活 → 渲染菜单 → 派发 skill"的完整链路。

***
### 第 3 小时：搞懂 Skill（工作流层）

**核心认知**：skill 就是一份 Markdown 说明书，LLM 读它然后照做。

看 `bmad-prd`：

```bash
head -60 src/bmm-skills/plan/bmad-prd/SKILL.md
```

你会看到 BMAD 的 skill 有**统一骨架**：

```text
## Conventions          路径约定（{project-root} / {skill-root} 怎么解析）
## On Activation        6 步激活（跟 agent 类似但更短）
## Paths                输入输出路径
## Input Files          读什么（表格：文件 / 描述 / 匹配模式 / 加载策略）
## Execution            正文——真正的流程
```

**最值得学的 2 个设计**：

**① `Input Files` 表把"读什么"显式化**

```markdown
| Input | Description | Path Pattern(s) | Load Strategy |
|-------|-------------|-----------------|---------------|
| prd   | PRD (fallback) | {planning_artifacts}/*prd*.md | SELECTIVE_LOAD |
| epics | Enhanced epics+stories | {planning_artifacts}/*epic*.md | SELECTIVE_LOAD |
```

`SELECTIVE_LOAD` 的意思是**只读相关章节，不整篇吞进上下文**。这是 BMAD 省 token 的关键。

**② 分步文件把长流程拆开**

`bmad-build` 有 6 个 step 文件：

```bash
ls src/bmm-skills/ship/bmad-build/
```

```text
step-01-clarify-and-route.md   路由：判断你在流程哪一步
step-02-plan.md                出方案
step-03-implement.md           写代码
step-04-review.md              自审
step-05-present.md             交付给你看
step-oneshot.md                一把梭模式
```

**产出物**：能解释"为什么 BMAD 要拆 step 文件而不是写一个长 prompt"——答案是**上下文隔离**，每步只加载自己需要的证据。

***
### 第 4 小时：搞懂流程（3 阶段 + 状态机）

**这是全天最关键的一小时。**

3 阶段：

```
        ┌─ Plan ─┐
        │        ↓
   Correct ←── Ship
        ↑
```

| 阶段 | skill | 产出 |
|---|---|---|
| **Plan** | `bmad-prd` → `bmad-architecture` → `bmad-create-epics-and-stories` → `bmad-sprint-planning` | PRD / 架构 / epics / sprint-status.yaml |
| **Ship** | `bmad-build` → `bmad-code-review` → `bmad-retrospective` | 代码 / review / 回顾文档 |
| **Correct** | `bmad-correct-course` | Sprint Change Proposal，回写上游文档 |

**但真正让流程"活"的是 `sprint-status.yaml`**。去看它的模板：

```bash
cat src/bmm-skills/plan/bmad-sprint-planning/sprint-status-template.yaml
```

里面有完整的**状态定义**：

```yaml
# Story Status:
#   - backlog:         Story 只存在于 epic 文件
#   - ready-for-dev:   Story 文件已创建
#   - in-progress:     开发中
#   - review:          实现完成，待审
#   - done:            完成

# Action Item Status:
#   - open / in-progress / done
```

**为什么这个设计是精髓**：

`step-01-clarify-and-route.md` 会读 `sprint-status.yaml` 判断当前 spec 的 `status` frontmatter，然后**自动路由**到对应 step：

```text
draft          → step-02-plan
ready-for-dev  → step-03-implement
in-progress    → step-03-implement
in-review      → step-04-review
done           → 不恢复，只作上下文
```

也就是说——**BMAD 的流程不是靠对话历史维持的，是靠一个 YAML 文件维持的**。

对话断了、换了个会话、甚至换了个人来接手，只要 `sprint-status.yaml` 在，流程就能续上。

> ⚠️ **这一小时学完，你就知道 BMAD 为什么比 SDD 抗中断**。SDD 的状态在你的聊天记录里，BMAD 的状态在一个可提交到 git 的文件里。

**产出物**：能手画一张"3 阶段 + 5 状态 + 自动路由"的图。

***
### 第 5 小时：搞懂扩展（3 层覆盖 + IDE 适配）

**① 3 层 customize 覆盖**

每个 skill 的 `customize.toml` 是**默认值**，可以被两个文件覆盖：

```text
{skill-root}/customize.toml                        ← 默认（BMAD 官方）
{project-root}/_bmad/custom/{skill-name}.toml      ← 团队覆盖
{project-root}/_bmad/custom/{skill-name}.user.toml  ← 个人覆盖
```

合并规则（`src/scripts/resolve_customization.py` 里明确写着）：

| 类型 | 规则 |
|---|---|
| 标量（scalar）| 覆盖者赢 |
| 表（table）| 深度合并 |
| 数组（array）| **追加** |
| 带 `code`/`id` 的对象数组 | 同 key 替换，其余追加 |

**实际用法**：想让团队所有人的 PM agent 都遵守同一条编码规范，写一次 `_bmad/custom/bmad-agent-pm.toml` 就行，不用改 BMAD 源码。

**② 48 个 IDE 怎么统一**

```bash
cat tools/installer/ide/platform-codes.yaml | head -30
```

每个平台一个 entry，声明 `target_dir`：

| 平台 | target_dir |
|---|---|
| claude-code | `.claude/skills` |
| cursor / codex / opencode / gemini | `.agents/skills` |
| github-copilot | `.agents/skills` + `.github/agents`（仅 persona agent）|

适配层代码在 `tools/installer/ide/_config-driven.js`（37KB），里面有一堆防御逻辑值得读，比如 **OpenCode 的 18 个保留命令冲突处理**：

```javascript
const RESERVED_OPENCODE_COMMANDS = new Set([
  'review', 'commit', 'init', 'help', 'skills', ...
]);

if (this.name === 'opencode' && RESERVED_OPENCODE_COMMANDS.has(canonicalId)) {
  result.skippedCollision++;
  continue;
}
```

**产出物**：能给团队定制 agent（不用 fork），也能解释"为什么 Cursor 和 Claude Code 的安装结果长得不一样"。

***
### 第 6 小时：改一个 skill（真正掌握）

**别只学，要动手。** 最小可行改动——复制 PM agent 改成你自己的：

```bash
cp -r src/bmm-skills/agents/bmad-agent-pm \
      src/bmm-skills/agents/bmad-agent-my-analyst
```

改 3 处：

**① `SKILL.md` 的 frontmatter**

```markdown
---
name: bmad-agent-my-analyst
description: Your custom analyst agent. Use when ...
---
```

**② `customize.toml` 的身份**

```toml
[agent]
name = "Alex"
title = "Domain Analyst"
icon = "🔍"

role = "Analyze domain-specific requirements and constraints"
identity = "Thinks like a staff engineer who's seen three failed migrations"
communication_style = "Pragmatic, concrete examples over abstract principles"

[[agent.menu]]
code = "FR"
description = "Generate functional requirements for the domain"
skill = "bmad-prd"
```

**③ 验证能装上**

```bash
node tools/installer/bmad-cli.js install \
  --directory /tmp/my-test \
  --tools opencode \
  --modules bmm \
  --yes

cat /tmp/my-test/.opencode/commands/bmad-agent-my-analyst.md
```

看到 4 行 command 文件就成功了。

**产出物**：一个能调起来的自定义 agent。

***
## 三、时间分配的另一种切法

如果你只有 3 小时，砍成这样：

| 时间 | 砍掉什么 | 保留什么 |
|---|---|---|
| 1 小时 | 保留 install + command 指针 | 建立骨架认知 |
| 1 小时 | 保留 agent 的 8 步激活 + menu 机制 | persona 怎么驱动 skill |
| 1 小时 | **全砍 skill 细节**，直接读 `sprint-status.yaml` | 3 阶段 + 状态机 |

**为什么砍 skill 细节**：skill 有 17 个，每个都很长，但**结构完全一样**。读透 1 个（推荐 `bmad-prd`）就够，剩下的是填空。

***
## 四、4 条学习原则（我踩过的坑）

**① 先跑再读**
我最早是"先读文档再跑"，结果读了两小时还是不会用。**先 `install` 一遍，看产物结构，再回头读源码**——有了实物对照，源码不再是抽象概念。

**② 抓"元数据"而不是"内容"**
`module-help.csv` 13 列描述了每个 skill 的 module / display-name / menu-code / phase / preceded-by / followed-by / output-location / outputs。**这一份 CSV 就是 BMAD 的完整流程图**。

```
phase + preceded-by + followed-by 三列连起来 = 流程依赖关系
outputs + output-location 两列 = 产物落盘位置
```

**③ 找"状态机"而不是找"prompt"**
BMAD 的 prompt 写得再好，那都是实现细节。**真正的架构是 `sprint-status.yaml` 里的状态定义 + `step-01` 的路由逻辑**。理解这两个，BMAD 就通了。

**④ 只读 20% 的源码**
50 个 SKILL.md 里，**5 个 agent + 10 个 plan + 7 个 ship = 22 个**是核心，剩下 28 个是外围（shims / 测试 / build 相关）。**只读核心 22 个的目录名和 frontmatter 就够**。

***
## 五、6 小时之后

到这里你应该能做到：

- [ ] 讲清 BMAD 3 阶段闭环 + 5 状态定义
- [ ] 解释"为什么 BMAD 抗中断"（状态在 YAML 里，不在聊天记录里）
- [ ] 说明 Agent（壳）与 Skill（干活）的解耦设计
- [ ] 给团队定制一个 agent，不用 fork 源码
- [ ] 回答"BMAD vs SDD"这类面试问题（不是背，是从状态机角度推）

**还没掌握的部分**（建议后续 1-2 周）：
- `bmad-party-mode`（多 agent 讨论）—— 只支持部分 IDE
- `bmad-deep-recon`（大型代码库取证）
- `bmad-loop`（无人值守跑完整个 epic）
- `bmad-builder`（官方造 skill 的工具）

***
## 下一篇预告

这个系列已经写到第三篇了：
1. [BMAD-METHOD 入门：多 Artifact 体系如何重塑 AI 辅助开发](https://sunrong.site/posts/ai-practice/ai-theory/bmad-method-vs-sdd-multi-artifact-ai-development.html) —— 是什么、为什么
2. [XX老项目 代码重构 — BMAD 流程总结](https://sunrong.site/posts/ai-practice/ai-theory/bmad-method-xx-old-project-refactor.html) —— 怎么用（78 子项目实战）
3. **本篇** —— 怎么学
4. 下一篇 —— **怎么改**：给 HERO 平台定制 `bmad-agent-hero-test-analyst` 全过程

***
## 📚 参考

- [BMAD-METHOD 仓库](https://github.com/bmad-code-org/BMAD-METHOD)（v6.11.0 / 2088 commits / MIT）
- 官方文档：https://docs.bmad-method.org/
- 关键源码路径：
  - `src/bmm-skills/module-help.csv` —— skill 元数据注册表
  - `src/bmm-skills/agents/bmad-agent-pm/` —— agent 范式
  - `src/bmm-skills/plan/bmad-sprint-planning/sprint-status-template.yaml` —— 状态机定义
  - `src/bmm-skills/ship/bmad-build/step-01-clarify-and-route.md` —— 路由逻辑
  - `src/scripts/resolve_customization.py` —— 3 层覆盖合并
  - `tools/installer/ide/platform-codes.yaml` —— 48 平台注册表

***
**作者**：Mr.Sun

11 年研发经验，主要做 AI Agent 平台相关的工作。AgentScope 上游有 PR，也是 BMAD-METHOD 的长期使用者（本文所有数字来自 v6.11.0 源码实测）。

这三篇的方法论是同一套：**先跑通 → 读源码 → 改源码**。个人 blog：[sunrong.site](https://sunrong.site/)

**版权**：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)，转载请保留作者信息与原文链接。
