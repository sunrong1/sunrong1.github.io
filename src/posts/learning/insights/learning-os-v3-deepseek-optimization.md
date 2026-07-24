---
title: 学习操作系统 V3/V4 升级 — 9 大思维 × 4 Agent × 工业级架构
icon: 🚀
date: 2026-06-30
updated: 2026-06-30
categories:
  - 学习方法
tags:
  - 元认知
  - 多 Agent
  - 学习系统
  - 9 大思维
cover: https://sunrong1.github.io/assets/learning-os-v3-cover.png
author: Mr.Sun
star: true
---***
## 🎯 背景：V2 的 3 个痛点

从 V1 一个脚本走天下，到 V2 引入 4 Agent 协作，我的学习系统一直在演进。

但 V2 有几个不得不承认的问题：

**痛点 1：版本分歧**
- V1 基础版、V2 主循环版、V3 9 思维版 — 3 个文件并存
- 用户每次都要问"我应该用哪个？"

**痛点 2：代码冗余**
- 4 个 Prompt 散落在 pipeline 文件里，每次调用都要 inline 写
- Agent 的角色定义、思维 prompt 拼接、prompt 长度计算 — 全是 boilerplate

**痛点 3：state.json 越用越大**
- 42 天学习之后，state.json 膨胀到 50KB+
- 每跑一天，内容（md）+ 状态（json）+ 思维日志（json）+ 错题分析（md）全塞在一个文件
- Git diff 越来越难看

转折点是 6-26 那一天 — DeepSeek v4-pro 介入了。它对我的整个系统做了一次"工业级"重构。我花了一周时间消化、理解每一个 commit、跑通端到端验证。

今天这篇文章，总结这次重构的核心价值。

***
## 💡 升级全景（10 大维度对比）

| 维度 | V2 | V3/V4 | 提升 |
|------|----|----|------|
| **脚本文件** | 1 个 | 3 个模块（Pipeline + Runtime + State）| 关注点分离 |
| **版本分歧** | 3 个并存 | 1 个统一版本 | 消除用户困惑 |
| **Prompt 注入** | inline 拼装 | 自动从 `agents/<name>.md` 读取 | 消除 prompt 发散 |
| **状态管理** | 1 个膨胀的 state.json | 分层（state + progress + reviews）| 永远 < 2KB |
| **落盘自动化** | 手动处理输出 | 自动落盘到对应目录 | 零遗漏 |
| **答案输入** | `input()` 阻塞 | 三种 Provider 切换 | 支持无人值守 + 测试 |
| **思维激活** | 7 大（Content 用 3）| **9 大全激活** | 0 闲置 |
| **错误分析** | markdown 不可分析 | 结构化字段提取 | 可聚合统计 |
| **进度可视化** | 简单打印 | 思维统计 + 薄弱点检测 + 周报状态 | 盲点自动检测 |
| **框架接入** | Hermes 专有 `delegate_task` | Runtime ABC，任意 Agent SDK 都能接入 | 可扩展 |

***
## 🚀 V3/V4 核心架构（4 大创新）

### 创新 1：Runtime 抽象层

之前所有的"跑 Agent"逻辑都直接写 `rt.delegate_task(...)`。这意味着整个系统只能跑在 Hermes 上。

V4 引入 `AgentRuntime` ABC + `StubRuntime` + `HermesRuntime`：

```python
class AgentRuntime(ABC):
    @abstractmethod
    def delegate_task(self, goal, context, toolsets) -> dict: ...
    
    @abstractmethod
    def delegate_tasks(self, tasks) -> list[dict]: ...

class HermesRuntime(AgentRuntime):
    """真实实现 — 用 Hermes delegate_task"""
    def delegate_task(self, goal, context, toolsets):
        return delegate_task(goal=goal, context=context, toolsets=toolsets)
    
    def delegate_tasks(self, tasks):
        return delegate_task(tasks=tasks)

class StubRuntime(AgentRuntime):
    """测试实现 — 返回固定 mock 数据"""
    def delegate_task(self, goal, context, toolsets):
        return {"summary": f"[Mock] {goal}", "tokens": {"input": 0, "output": 0}}
    
    def delegate_tasks(self, tasks):
        return [self.delegate_task(**t) for t in tasks]
```

**这意味着什么？**
- 我现在可以接入任何 Agent 框架（CodeBuddy、Claude Code、自研 Agent SDK）
- 通过环境变量切换：`LEARNING_OS_RUNTIME=hermes|stub`
- 测试时直接用 Stub，无须联网

### 创新 2：State 分层

**V2 一个 state.json 包含**：
- 当日所有 content（可能 50KB）
- 当日 exam
- 当日 error
- 当日 meta
- 历次 thinking log
- 历次 scores
- 历次 errors

**V4 分成 4 层**：

```
codebases/<name>/
├── state.json          # 只存核心摘要（永远 < 2KB）
│   ├── schema_version
│   ├── day             # 当前学到第几天
│   ├── colors          # 5 大组件颜色地图
│   ├── scores          # 考试分数历史
│   ├── errors          # 错题薄弱点历史
│   ├── weekly_reports  # 已完成周复盘
│   ├── plan            # 6 周结构化计划（dict）
│   └── thinking_log    # 每日使用的思维方法
│
├── progress/
│   ├── day-1.json      # Day 1 完整每日结果
│   ├── day-2.json
│   └── week-N-review.json  # 周复盘结构化摘要
│
├── content/
│   ├── day-1.md        # Day 1 学习内容
│   ├── day-2.md
│   └── src-map.md / learning-plan-6weeks.md（Day 0 输出）
│
├── exams/
│   ├── exam-day-1.md   # Day 1 考试题
│   └── exam-day-2.md
│
├── errors/
│   └── error-day-N.md  # Day N 错题分析存档
│
└── reviews/
    └── week-N-review.md  # Week N 周复盘完整存档
```

**好处**：
- state.json 永远是"小文件"，git diff 干净
- 每日结果可独立读、写、追责
- 错题和周复盘是 markdown，易 review

### 创新 3：Agent Prompt 自动注入

V2 里每次调用 Content Agent 都要这样写：

```python
content_result = rt.delegate_task(
    goal="输出 Day N 学习内容",
    context=f"""
【你的角色】
1. 分析代码库
2. 抽象建模
3. 类比推理
...

【任务】
生成 markdown，包含...
"""
)
```

结果：每次都要重复一段长长的 inline prompt，**prompt 发散风险很高** — 我第 1 天写的和第 10 天写的不一样。

V4 引入 `load_agent_prompt()`，自动读 `agents/content-agent.md` 全文并注入：

```python
content_prompt = load_agent_prompt("content")  # 读 agents/content-agent.md
content_result = rt.delegate_task(
    goal="输出 Day N 学习内容",
    context=f"""
【你的角色 Prompt — 必须遵守】
{content_prompt}  # 自动注入完整角色定义

代码库: {codebase_name}
今日目标: {today_goal}
Day {day-1} 结果: {previous}
...
"""
)
```

**好处**：
- Prompt 集中在 `agents/<name>.md`，**单一事实来源**
- 版本管理清晰（git track Prompt 比 track inline 字符串容易得多）
- 实验时可改一个文件，验证效果

### 创新 4：next_day_focus 硬约束

这是 V4 解决的一个隐蔽但关键的问题 — **跑题**。

V2/V3 里，Content Agent 在生成 Day 5 内容时，可能会"自然漂移"到 Day 10 的主题（比如它读完代码觉得某个概念重要就直接讲了）。结果就是：你的学习顺序被打乱。

V4 引入 Meta Agent 输出的 `next_day_focus` 作为**硬约束**：

```python
previous = get_daily_result(codebase_name, day - 1) or {}
next_focus = previous.get("next_day_focus", "")
focus_constraint = ""
if next_focus:
    focus_constraint = f"""
【⚠️ 强制聚焦 — 不可偏离】
上日 Meta Agent 明确指定今日聚焦: **{next_focus}**
你必须围绕这个主题生成今日内容，不可跳到其他周/模块。
"""
```

**机制**：
1. Day N 的 Meta Agent 在分析当日数据后，输出 `next_day_focus`（指定 Day N+1 应聚焦的主题）
2. 这个 focus 被持久化到 `progress/day-N.json` 的 `next_day_focus` 字段
3. Day N+1 的 Content Agent 在 context 里**强制看到**这个 focus
4. Agent 偏离 focus 的概率降到 0

***
## 🧠 9 大思维全激活

**V2 状态**：7 大思维被使用，2 个闲置（`deduction` 推论假设从未用于 Content）。

**V4 状态**：**9 大思维全部由某个 Agent 激活**。

| 思维 | 负责 Agent | 强化方式 |
|------|-----------|---------|
| 推论假设 (Deduction) | Content | 读代码前必须做 3 个假设 |
| 实验验证 (Empirical Testing) | Exam | 所有题目必须可在 REPL 跑通 |
| 类比推理 (Analogical) | Content | 每个组件找一个已知类比 |
| 归纳总结 (Induction) | Error + Meta | 找出错误规律 + 总结本周模式 |
| 第一性原理 (First Principles) | Content | 拆到不可拆 |
| 抽象建模 (Abstraction) | Content | 提取"组件 = 字段"模型 |
| 批判思维 (Critical) | Error | 找反例 + 边界 |
| 系统思维 (Systems) | Meta | 看整体关系 |
| 反事实推理 (Counterfactual) | Exam | 至少 1 道"如果不...会怎样"题 |

**关键数据**：在我的 show_progress 里，9 大思维使用统计可视化：

```
=== 9 大思维使用统计（共 2 天）===
abstraction          ██░░░░░░░░  2/2 (content,error)
analogical           ██░░░░░░░░  2/2 (content)
first-principles     ██░░░░░░░░  2/2 (content)
empirical-testing    ██░░░░░░░░  2/2 (exam)
counterfactual       ██░░░░░░░░  2/2 (exam)
critical-thinking    ██░░░░░░░░  2/2 (error)
induction            ████░░░░░░  4/2 (meta,error)  ← Meta + Error 都用
systems-thinking     ██░░░░░░░░  2/2 (meta)
deduction            ██░░░░░░░░  2/2 (content)  ← V4 新激活
```

零闲置。

***
## 📊 Day 1 实战数据（验证学习系统是真的工作了）

V4 + Day 1 学 AgentScope Message 基座后，实际成绩：

```json
{
  "day": 1,
  "content": "Day 1: Message 基座 — Msg 字段模型 + 6 种 Block + 3 工厂函数",
  "exam_score": 88,
  "exam_total": 100,
  "evaluation": "A",
  "level": "L3 (复现) + 接近 L4",
  "color_change": "🔴 → 🟡",
  "thinking_used": ["abstraction", "analogical", "first-principles", "counterfactual"],
  "weak_points": [
    "model_validator 完整逻辑",
    "Pydantic discriminator 模式",
    "6 种 Block 的具体字段",
    "URLSource.type 永远 = 'url' 的设计哲学"
  ],
  "completed_at": "2026-06-25",
  "next_day_focus": "Block 子类（_block.py L11-100）"
}
```

**4 大关键指标**：

1. **考试分数 88/100**（A 评价）— 不是"看过"，是"复现 + 反事实 + 抽象建模"都过
2. **薄弱点被结构化提取** — 系统能"看见"自己哪里弱
3. **Color 变化 🔴 → 🟡** — 5 层掌握度可视化
4. **next_day_focus 自动指定** — Day 2 不会跑题

***
## 💎 设计哲学：少即是多，职责分离

V3/V4 重构最深的体会，是把"少即是多，职责分离"做到了极致：

### 之前（V2 状态）

- 1 个脚本，做 5 件事
- 1 个 state.json，存 7 类数据
- 多个版本共存
- Prompt 散落 inline

### 现在（V4 状态）

- 3 个模块（Runtime 抽象 + State 分层 + Pipeline 编排），每模块只做 1 件事
- state.json 只存摘要（永远 < 2KB），详细数据自动分散
- 1 个版本
- Prompt 集中到 `agents/<name>.md`

**副产物**：

- 代码可读性 ↑（每个文件 200-300 行，单一职责）
- 可测试性 ↑（Runtime 可 Stub，State 可 mock）
- 可扩展性 ↑（接 Claude Code？写个 `ClaudeRuntime` 就好）
- 可维护性 ↑（Prompt 改了跑哪儿都看到）

***
## 🔭 接下来的计划

V5（接下来的）：

- **更强的 Vibe Coding 集成** — 不是 4 Agent 编排，是"Vibe Coding + 4 Agent"
- **Plant 项目完整闭环** — 用 4 Agent 学 PlantsGame，**反向输出学习系统**
- **跨代码库迁移** — Runtime 抽象后，从 AgentScope 迁移到 LangChain/AutoGen 应该很简单
- **公开 wiki** — 把所有 Prompt/State/思维文件变成可读的 markdown wiki

***
## 📝 总结：这次重构给我的认知冲击

1. **Agent 协作 ≠ 多个 Agent 跑** — 是"4 Agent + 9 思维 + State 分层 + Runtime 抽象"的工业级架构
2. **状态不是文件，是分层存储** — state.json 是缓存，详细数据分散才合理
3. **Prompt 是产品的一部分** — 不应该散落 inline，应该像代码一样被管理
4. **AI 工具链的"工程外壳"很重要** — V4 解决了"工程外壳"，才能真正开始跑学习闭环
5. **DeepSeek 这种级别的模型可以做架构师** — 我的体验：比自己写强 10 倍

**一句话**：从"几个 Agent 跑一跑"到"工业级多 Agent 系统"，只差一个 DeepSeek v4-pro 介入。

***
## 🤔 思考题（给读者）

1. **你的学习系统有"版本分歧"问题吗？** 你怎么解决的？
2. **你的 AI 工具配置是"散落 inline"还是"集中管理"？**
3. **你有没有想过把 state.json 分层？** 什么分什么？
4. **如果接入一个新 Agent 框架**（Claude Code、Cursor），你会怎么改？
5. **"9 大思维"是过度设计还是真的有价值？** 用 3 个思维能达到 80 分，用 9 个能到 95 分，你选哪个？

欢迎在评论区聊聊你的学习系统是怎么设计的。

***
<!-- more -->

## 附录：V4 重构 Git History（精选 commits）

```
5788d6f feat(exam): Day 2 考试题生成（3 道 · 实验+反事实+综合）
0bd5c20 feat(content): Day 2 V4 重生成 - 4 思维强化版（新架构）
dab759c P0 优化: Pipeline 注入 Agent Prompt + 自动落盘 + 结构化 plan + 消除 input() 阻塞
f22c4b5 周复盘增强: reviews/week-{n}-review.md 完整存档 + show_progress 显示
2b44704 清理测试数据，errors/ 目录加 .gitkeep
84156d9 Error Agent 输出落盘: errors/error-day-{n}.md + 结构化字段提取
5d640bf 修复: scores/errors 从 progress 文件聚合，show_progress 展示错题详情
11d7060 P2: USAGE.md + next_day_focus硬约束 + thinking_log可视化分析
369eca9 将每日学习内容移入 content/ 目录，简化文件名为 day-{n}.md
55bd455 P1: 统一版本命名 + Agent契约对齐 + thinking摘要提取
```

## 附录：V4 文件结构（最终态）

```
~/.hermes/learning-os/
├── README.md
├── USAGE.md
├── agents/                          # 4 Agent Prompts
│   ├── content-agent.md
│   ├── exam-agent.md
│   ├── error-agent.md
│   └── meta-agent.md
│
├── thinking/                        # 9 大思维 Prompts
│   ├── 01-deduction.md
│   ├── 02-empirical-testing.md
│   ├── 03-analogical-reasoning.md
│   ├── 04-induction.md
│   ├── 05-first-principles.md
│   ├── 06-abstraction.md
│   ├── 07-critical-thinking.md
│   ├── 08-systems-thinking.md
│   └── 09-counterfactual.md
│
├── tools/                           # 3 个运行时模块
│   ├── runtime.py                   # Runtime 抽象
│   ├── state.py                     # State 分层 + 自动落盘
│   └── meta_learning_pipeline.py    # 主流程编排
│
└── codebases/agentscope/            # 当前学习案例
    ├── state.json                   # < 2KB 摘要
    ├── content/
    │   ├── src-map.md
    │   ├── learning-plan-6weeks.md
    │   ├── day-1.md
    │   └── day-2.md
    ├── progress/
    │   ├── day-1.json
    │   └── day-2.json
    ├── exams/
    │   ├── exam-day-1.md
    │   └── exam-day-2.md
    ├── errors/
    │   └── error-day-N.md
    └── reviews/
        └── week-N-review.md
```
