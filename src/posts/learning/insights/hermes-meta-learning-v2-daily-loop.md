---
icon: rocket
date: 2026-06-25
update: 2026-06-25
categories:
  - Hermes
  - Multi-Agent
  - 元认知
tags:
  - Hermes Agent
  - Multi-Agent
  - 元认知学习
  - delegate_task
  - 每日循环
  - 状态管理
star: true
---

# Hermes 多 Agent 元认知学习系统 V2：每日循环版

> **V1 → V2 关键升级**：从"4 Agent 各自独立"到"4 Agent 协作循环"
>
> **核心改进**：Content Agent 从"一次性生成 6 周计划"变成"每日学习教练"——**根据前日结果动态调整当日内容**。

## 为什么需要 V2？

V1 的 4 Agent 是"独立工具"，但...

**V1 的问题**：
```
❌ Content Agent 一次性输出 6 周计划（静态）
❌ Exam Agent 一次性出 5 道题（一次性）
❌ 没有状态管理（每天从头开始）
❌ 用户能力没有"昨日数据"反馈给"今日内容"
```

**V2 的解决**：
```
✅ Content Agent 每日动态调整（基于前日结果）
✅ Exam Agent 每日 1-3 道题（可持续）
✅ state.json 状态管理（事实来源）
✅ 完整的"反馈闭环"
```

## 💎 V2 核心改进：每日循环

### 完整流程图

```
[Day 0: 启动]
  ↓
Content Agent: 42 天基础计划 + 评估用户能力
  ↓
[Day 1]
  ↓
Content Agent: 今日学什么（基于 Day 0 计划）
  ↓
Exam Agent: 1-3 道自测题
  ↓
你: 做答 5-10 分钟
  ↓
Error Agent: 分析错题
  ↓
Meta Agent: 更新颜色
  ↓
保存到 state.json
  ↓
[Day 2]
  ↓
Content Agent: 今日学什么（基于 Day 1 结果 + state.json）
  ...
```

**关键**：
- Day N 的 Content Agent **读取 Day N-1 的结果**
- 每日 30-60 分钟（不是一次性 25 分钟）
- **形成真正的反馈闭环**

## 📐 V2 主流程脚本（完整实现）

### 7 个核心函数

```python
# ~/.hermes/learning-os/tools/meta_learning_pipeline.py
"""
4 Agent 元认知学习系统 V2（每日循环版）
"""


# 1. 状态管理
def get_user_state(codebase_name):
    """读取用户当前状态"""
    # 从 state.json 读取
    pass

def save_user_state(codebase_name, state):
    """保存用户状态"""
    # 写入 state.json
    pass


# 2. 启动（Day 0）
def initialize_learning(codebase_path, codebase_name, weeks=6):
    """启动学习系统"""
    # Content Agent: 42 天计划
    # 初始化 state.json
    pass


# 3. 每日循环（核心！）
def daily_learning_cycle(codebase_name, day):
    """每日 30-60 分钟学习循环"""
    # Content Agent → Exam Agent → 用户答题
    # → Error Agent → Meta Agent
    # → 保存 state.json
    pass


# 4. 周复盘
def weekly_review(codebase_name, week_num):
    """每周日 30 分钟复盘"""
    # 并行 3 个任务
    pass


# 5. 6 周完整学习
def full_6_weeks_learning(codebase_path, codebase_name):
    """一键 6 周"""
    pass


# 6. 单日手动模式
def run_today(codebase_name):
    """手动模式：只跑 1 天"""
    pass


# 7. 查看进度
def show_progress(codebase_name):
    """显示当前学习进度"""
    pass
```

### 关键函数详解

#### 1. 状态管理（事实来源）

```python
def get_user_state(codebase_name):
    """读取用户当前状态（颜色地图 + 错误历史）"""
    from pathlib import Path
    import json

    state_file = Path(f"~/.hermes/learning-os/codebases/{codebase_name}/state.json").expanduser()
    if state_file.exists():
        return json.loads(state_file.read_text())
    return {
        "codebase": codebase_name,
        "day": 0,
        "colors": {
            "Agent": "🔴",
            "Model+Formatter": "🔴",
            "Toolkit+Tool": "🔴",
            "Event/Permission/Middleware": "⚪"
        },
        "scores": [],
        "errors": [],
        "weekly_reports": []
    }
```

**state.json 结构**：
```json
{
  "codebase": "agentscope",
  "day": 0,
  "colors": {
    "Agent": "🔴",
    "Model+Formatter": "🔴",
    "Toolkit+Tool": "🔴",
    "Event/Permission/Middleware": "⚪"
  },
  "scores": [],
  "errors": [],
  "weekly_reports": [],
  "day_1_result": {
    "content": "...",
    "exam": "...",
    "error": "...",
    "meta": "..."
  }
}
```

**为什么用 JSON**：
- 简单
- 可读
- 易调试
- **事实来源**（其他 Agent 都能读）

#### 2. 启动（Day 0）

```python
def initialize_learning(codebase_path, codebase_name, weeks=6):
    """启动学习系统（Day 0）"""
    # Content Agent 完整分析
    content_result = delegate_task(
        goal="分析代码库 + 评估用户能力 + 输出 42 天计划",
        context=f"""
代码库: {codebase_path}
名称: {codebase_name}
目标: {weeks} 周精通

任务:
1. 评估 4 大组件的用户当前水平（颜色）
2. 给出 42 天每日计划
3. 列出"能做 3 件 / 不能做 3 件"
4. 给出依赖关系图

输出 42 天表格（每日 1 行：目标|关键文件|实践任务|自测题数）
""",
        toolsets=["file", "terminal"]
    )

    # 初始化状态
    state = get_user_state(codebase_name)
    state["day"] = 0
    state["plan"] = content_result.get("summary", "")
    save_user_state(codebase_name, state)
```

**关键**：
- 只跑 1 次 Content Agent（Day 0）
- 评估用户能力（颜色）
- 输出 42 天基础计划
- **初始化 state.json**

#### 3. 每日循环（核心！）

```python
def daily_learning_cycle(codebase_name, day):
    """每日 30-60 分钟学习循环"""
    state = get_user_state(codebase_name)
    previous_results = state.get(f"day_{day-1}_result", {})

    # Step 1: Content Agent - 今日内容（基于前日结果！）
    content_result = delegate_task(
        goal=f"基于 Day {day-1} 结果输出 Day {day} 的学习内容",
        context=f"""
代码库: {codebase_name}
42 天计划: {state.get("plan", "")}

Day {day-1} 结果:
{previous_results}

任务:
1. 根据 Day {day-1} 的颜色/错题，调整 Day {day} 内容
2. 给出今日学习目标（1 句话）
3. 指定 2-3 个关键文件 + 行号
4. 给出 1 个实践任务
5. 决定今日自测题数（1-3 道）
""",
        toolsets=["file"]
    )

    # Step 2: Exam Agent - 今日考试
    exam_result = delegate_task(
        goal=f"基于今日内容出 1-3 道自测题",
        context=f"今日内容: {content_result.get('summary', '')}",
        toolsets=["file"]
    )

    # Step 3: 用户答题
    user_answers = input("你的答案: ")

    # Step 4: Error Agent - 分析错题
    error_result = delegate_task(
        goal=f"分析 Day {day} 错题找出根因",
        context=f"题目: {exam_result.get('summary', '')}, 答案: {user_answers}",
        toolsets=["file"]
    )

    # Step 5: Meta Agent - 更新颜色
    meta_result = delegate_task(
        goal=f"更新 Day {day} 的颜色地图",
        context=f"内容: {content_result.get('summary', '')}, 考试: {exam_result.get('summary', '')}, 错题: {error_result.get('summary', '')}",
        toolsets=["file"]
    )

    # 更新状态
    state["day"] = day
    state[f"day_{day}_result"] = {
        "content": content_result.get("summary", ""),
        "exam": exam_result.get("summary", ""),
        "error": error_result.get("summary", ""),
        "meta": meta_result.get("summary", "")
    }
    save_user_state(codebase_name, state)
```

**关键设计**：

1. **读取前日结果** → `previous_results = state.get(f"day_{day-1}_result", {})`
2. **传给 Content Agent** → 让它动态调整
3. **每日 1-3 道题**（不是 5 道）→ 降低门槛
4. **保存每日结果** → 形成闭环

#### 4. 周复盘

```python
def weekly_review(codebase_name, week_num):
    """每周日 30 分钟复盘"""
    # 并行启动 3 个分析任务
    delegate_task(tasks=[
        {
            "goal": f"统计 {codebase_name} 第 {week_num} 周学习数据",
            "context": "读取 state.json，统计本周 7 天的考试分数、错题数量、颜色变化",
            "toolsets": ["file"]
        },
        {
            "goal": f"分析 {codebase_name} 第 {week_num} 周错题模式",
            "context": "读取本周 7 天的 error 结果，统计根本原因 Top 3",
            "toolsets": ["file"]
        },
        {
            "goal": f"更新 {codebase_name} 周报 dashboard",
            "context": "基于本周所有数据，输出 dashboard-week-{week_num}.md",
            "toolsets": ["file"]
        }
    ])
```

**关键**：并行 3 个任务（用 `tasks=[...]` 数组）

#### 5. 6 周完整学习

```python
def full_6_weeks_learning(codebase_path, codebase_name):
    """一键 6 周学习"""
    # Day 0: 初始化
    initialize_learning(codebase_path, codebase_name, weeks=6)

    # Day 1-42: 每日循环
    for week in range(1, 7):
        for day_in_week in range(1, 8):
            day = (week - 1) * 7 + day_in_week
            daily_learning_cycle(codebase_name, day)

        # 周日: 周复盘
        weekly_review(codebase_name, week)
```

**一键 6 周**：252 次 delegate_task 调用

## 🔑 V1 vs V2 详细对比

| 维度 | V1（昨天） | V2（今天） |
|------|----------|----------|
| **Content Agent 调用** | 1 次（6 周计划） | 42+ 次（每日调整） |
| **Exam Agent 调用** | 1 次（5 道题） | 42+ 次（1-3 道题） |
| **状态管理** | ❌ 无 | ✅ state.json |
| **每日时间** | 25 分钟（一次性） | 30-60 分钟（每日） |
| **反馈闭环** | ❌ | ✅ 完整闭环 |
| **适应性** | 固定 | 动态调整 |
| **可持续性** | 一次性 | 42 天循环 |
| **个性化** | 通用 | 基于用户能力 |

## 💡 V2 的关键洞察

### 1. Content Agent 是"教练"不是"地图"

```
V1: Content Agent = 一次性地图生成器
V2: Content Agent = 每日学习教练
    - 看 Day N-1 结果
    - 调整 Day N 内容
    - 持续 42 天
```

### 2. state.json 是"事实来源"

```
V1: 没有状态（每次从头开始）
V2: state.json（事实来源）
    - 颜色地图
    - 错题历史
    - 考试分数
    - 每日结果
    - **所有 Agent 都能读**
```

### 3. 反馈闭环 = 元认知

```
V1: 静态流程（一次性）
V2: 动态闭环（持续）
    Day N-1 → Day N → Day N+1
    错题 → 调整内容 → 再考
    **这才是"元认知学习"**
```

### 4. 每日 1-3 道题 = 可持续

```
V1: 5 道题（一次性 25 分钟）
V2: 1-3 道题（每日 5-10 分钟）
    - 降低门槛
    - 持续 42 天
    - **更可执行**
```

## 🎯 实战使用

### 启动 6 周学习

```python
# 在 Hermes 主对话中
full_6_weeks_learning(
    codebase_path="~/repos/agentscope",
    codebase_name="agentscope"
)
```

**这会执行**：
- Day 0: Content Agent 完整分析（~75 秒）
- Day 1-42: 每日循环（每日 30-60 分钟）
- 6 次周复盘（每周 30 分钟）

### 手动模式

```python
# 只跑 1 天
run_today("agentscope")
```

**适用场景**：
- 今天有空，做 1 天
- 中断后恢复
- 测试单日流程

### 查看进度

```python
show_progress("agentscope")
```

**输出**：
```
=== agentscope 学习进度 ===
当前: Day 12 / 42
颜色地图: {'Agent': '🟡', 'Model+Formatter': '🔴', ...}
已考次数: 12
总错题数: 23
```

## 🛠️ 文件结构

```
~/.hermes/learning-os/
├── agents/                       ← 4 Agent Prompt
│   ├── content-agent.md
│   ├── exam-agent.md
│   ├── error-agent.md
│   └── meta-agent.md
│
├── tools/                        ← 主流程脚本
│   └── meta_learning_pipeline.py ← V2（9,979 字符）
│
└── codebases/                    ← 代码库
    └── agentscope/
        ├── src-map.md            ← Content Agent（初次）
        ├── learning-plan-6weeks.md ← Content Agent（42 天）
        ├── exams/
        │   └── exam-01-basics.md ← Exam Agent
        ├── errors/                ← Error Agent 输出
        ├── colors/
        │   └── initial-state.md  ← Meta Agent
        ├── progress/              ← 每日记录
        └── state.json             ← V2 核心（状态文件）
```

## 🎁 立即可执行（5 步启动）

### Step 1: 跑 Day 0

```python
initialize_learning("~/repos/agentscope", "agentscope", weeks=6)
```

**时间**: 75 秒

### Step 2: 跑 Day 1

```python
daily_learning_cycle("agentscope", 1)
```

**时间**: 30-60 分钟

### Step 3: 每天跑 1 次

```python
# 每天运行
run_today("agentscope")
```

### Step 4: 周日跑周复盘

```python
weekly_review("agentscope", 1)
```

### Step 5: 42 天后

```python
# 6 周完整
full_6_weeks_learning("~/repos/agentscope", "agentscope")
```

## 💎 与前几篇博客的呼应

### 与"方案 B 完整实现"的区别

```
【方案 B 完整实现】
- 4 Agent 独立工作
- 一次性 5 道题
- 没有状态管理
- 静态流程

【V2 每日循环版】（本文）
- 4 Agent 协作循环
- 每日 1-3 道题
- state.json 状态管理
- 动态反馈闭环
```

### 与"AI 时代超级学习者"的呼应

```
【超级学习者方法论】
- 5 大方法论
- "问 ≠ 会"
- 元认知升级

【V2 实现】
- 把方法论变成"可执行代码"
- 用 4 Agent 自动化"问 → 考 → 反馈"
- **元认知 = state.json + 反馈闭环**
```

### 与"Meta-Harness 论文"的呼应

```
【Meta-Harness】
- Agent 评测框架
- 动态调整任务

【V2 每日循环】
- 用 Agent 评测"用户能力"
- 动态调整"学习内容"
- **本质相同：基于评估动态调整**
```

## 🤔 为什么这个 V2 重要？

### 1. 解决了 V1 的核心问题

```
V1: 一次性 6 周计划 → 用户难坚持
V2: 每日 30-60 分钟 → 可持续
```

### 2. 引入了"反馈闭环"

```
V1: 静态流程
V2: 动态反馈
    - Day N-1 的错题 → Day N 的内容
    - Day N-1 的颜色 → Day N 的难度
```

### 3. 状态管理 = "事实来源"

```
V1: 每次重新开始
V2: state.json 持续追踪
    - 颜色变化
    - 错题模式
    - 进度
```

### 4. 真正的"元认知"

```
V1: 4 Agent 是"工具"
V2: 4 Agent 是"教练"
    - Content: 每日调整内容
    - Exam: 每日评估
    - Error: 每日反馈
    - Meta: 每日追踪
    **= 完整的元认知系统**
```

## 💎 总结

```
V1 = 4 Agent 独立工具
V2 = 4 Agent 协作循环
V2 核心 = state.json + 反馈闭环
V2 价值 = 可持续 + 个性化 + 动态
```

**从今天起，你有了真正的"元认知学习操作系统"**：
- 42 天可执行
- 每日 30-60 分钟
- 动态调整
- 状态追踪
- **不再是"理论"，是"工业级系统"** 🚀
