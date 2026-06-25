---
icon: robot
date: 2026-06-24
update: 2026-06-24
category:
  - Hermes
  - Multi-Agent
  - 元认知
tag:
  - Hermes Agent
  - Multi-Agent
  - delegate_task
  - 元认知学习
  - 自动化
star: true
---

# Hermes 多 Agent 学习系统：方案 B 完整实现（delegate_task 版）

> **从"理论"到"代码"：4 个独立子 Agent 协作的完整方案**

之前的文章《在 Hermes 上实现多 Agent 元认知学习系统》我写得太"理想化"——
把 4 个 Agent 当成 4 个完全独立的 AI 进程。

实际上，**Hermes 的 4 Agent 实现有 3 种方式**：
- **方案 A**：4 个 Skill（同一 LLM 切 4 段 prompt）
- **方案 B**：4 个 delegate_task 子 Agent（4 个隔离 context）⭐ 本文重点
- **方案 C**：外部 Multi-Agent 框架（4 个独立 LLM）

这篇博客**专门写方案 B**——**用 Hermes 的 `delegate_task` 工具实现 4 Agent 学习系统的完整方案**。

---

## 一、方案 B 的核心本质

### 1.1 什么是 delegate_task？

```
【官方定义】（来自 Hermes 文档）
"delegate_task 工具会生成具有隔离上下文、受限工具集和独立终端会话的子 AI Agent 实例。
每个子智能体获得全新的对话并独立运行——只有其最终摘要会进入父智能体的上下文。"

【关键 3 点】
├─ 1. 子 Agent 有独立的 context（不知道父对话历史）
├─ 2. 子 Agent 只能用你指定的 toolsets
├─ 3. 子 Agent 输出"摘要"给父 Agent（不是完整过程）
```

### 1.2 方案 A vs 方案 B vs 方案 C

| 维度 | 方案 A（4 Skill） | **方案 B（4 delegate_task）** | 方案 C（外部框架） |
|------|-----------------|--------------------------|------------------|
| **进程数** | 1 个 LLM | 4 个独立子 agent | 4 个独立 LLM |
| **Context** | 共享 | **隔离** | 隔离 |
| **切换方式** | 切 prompt | 启动新 agent | 启动新 LLM |
| **适合场景** | 轻任务 | **中等复杂度** | 工业级 |
| **成本** | 低 | 中 | 高 |
| **推荐度** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

### 1.3 为什么选方案 B？

```
【优势 1】真正的"隔离"
├─ 4 个子 agent 不互相干扰
├─ 各自的 context 独立
└─ 适合长链路任务

【优势 2】原生支持
├─ Hermes 官方工具
├─ 文档完善
└─ 稳定可靠

【优势 3】灵活组合
├─ 可以串行（链式）
├─ 可以并行（最多 3 个）
└─ 可以混用

【优势 4】成本适中
├─ 共享 LLM
├─ 隔离 context
└─ 性价比最高
```

---

## 二、3 种调用方式详解

### 2.1 方式 1：单任务调用

**语法**：

```python
delegate_task(
    goal="任务目标",
    context="任务的所有上下文",
    toolsets=["terminal", "file"]
)
```

**真实例子**：分析 1 个代码库

```python
content_result = delegate_task(
    goal="分析 ~/repos/agentscope 代码库，输出 src-map.md 和 architecture.md",
    context="""
代码库路径: ~/repos/agentscope
分析要求：
1. 读取 README.md
2. 列出 src/ 下的所有模块
3. 找出 4 大核心组件的位置
4. 画出整体架构图（Mermaid）
5. 输出到 ~/.hermes/learning-os/codebases/agentscope/src-map.md

输出格式：
- src-map.md（源码地图）
- architecture.md（架构图）
""",
    toolsets=["file", "terminal"]
)
```

**会发生什么**：

```
1. 启动 1 个子 agent
2. 子 agent 收到"全新对话"（不知道之前对话）
3. 子 agent 只能看到你给的 goal + context
4. 子 agent 加载自己的 system prompt
5. 子 agent 用 file + terminal 工具
6. 子 agent 完成后输出"摘要"
7. 主对话只看到摘要
```

**返回结果示例**：

```python
{
    "status": "success",
    "summary": "已分析 agentscope 代码库：
- src-map.md: 4 大组件 + 关键文件清单
- architecture.md: 完整架构图（Mermaid 格式）
- 共读取 23 个核心文件
- 识别出 4 大核心模块：编排器/执行器/记忆/评估"
}
```

### 2.2 方式 2：并行批处理（最多 3 个）

**语法**：

```python
delegate_task(tasks=[
    {"goal": "...", "context": "...", "toolsets": [...]},
    {"goal": "...", "context": "...", "toolsets": [...]},
    {"goal": "...", "context": "...", "toolsets": [...]}
])
```

**真实例子**：并行分析 3 个代码库

```python
delegate_task(tasks=[
    {
        "goal": "分析 AgentScope 的 4 大组件",
        "context": """
代码库: ~/repos/agentscope
任务：分别分析 4 大组件，每个组件 1 段描述
输出: ~/.hermes/learning-os/codebases/agentscope/components-analysis.md
""",
        "toolsets": ["file", "terminal"]
    },
    {
        "goal": "分析 Spring AI 的核心模块",
        "context": """
代码库: ~/repos/spring-ai
任务：分析核心模块 + MCP 集成
输出: ~/.hermes/learning-os/codebases/spring-ai/modules-analysis.md
""",
        "toolsets": ["file", "terminal"]
    },
    {
        "goal": "分析 MCP Server 协议",
        "context": """
代码库: ~/repos/mcp-server
任务：分析协议规范 + 1 个 server 实现
输出: ~/.hermes/learning-os/codebases/mcp-server/protocol-analysis.md
""",
        "toolsets": ["file", "terminal"]
    }
])
```

**会发生什么**：

```
1. 同时启动 3 个子 agent（并行）
2. 3 个子 agent 各自独立工作
3. 3 个子 agent 各自有独立 context
4. 完成后输出 3 个摘要
5. 主对话收到 3 个摘要（数组）
```

**关键限制**：

> **默认最多 3 个并发子智能体**（可配置，无硬性上限）

### 2.3 方式 3：链式调用（4 个串联）

**语法**：

```python
# Step 1
result_1 = delegate_task(goal="...", context="...")

# Step 2（基于 Step 1 结果）
result_2 = delegate_task(
    goal="...",
    context=f"上一步结果: {result_1['summary']}\n新任务: ..."
)

# Step 3（基于 Step 2 结果）
result_3 = delegate_task(
    goal="...",
    context=f"上一步结果: {result_2['summary']}\n新任务: ..."
)
```

**真实例子**：4 Agent 完整学习流程

```python
def meta_learning_pipeline(codebase, weeks=6):
    """4 Agent 链式学习流程"""

    # Step 1: Content Agent
    content_result = delegate_task(
        goal=f"分析 {codebase} 代码库，输出 4 个文件",
        context=f"""
代码库路径: {codebase}
目标: 精通这个代码库
时间: {weeks} 周
要求输出:
1. src-map.md（源码地图）
2. architecture.md（架构图）
3. key-concepts.md（10 个核心概念）
4. learning-paths.md（6 周学习路径）

每个文件用 5 层掌握度标注（🔴🟡🟢🟣）
""",
        toolsets=["file", "terminal"]
    )

    # Step 2: Exam Agent（基于 Content 输出）
    exam_result = delegate_task(
        goal="基于内容地图出 5 道考试题（5 种题型混合）",
        context=f"""
已分析代码库:
{content_result['summary']}

要求出 5 道题:
1. 复述题（20%）：让用户讲 5 分钟
2. 复现题（30%）：让用户做 1 件事
3. 改错题（20%）：让用户找 bug
4. 改写题（20%）：让用户重写
5. 场景题（10%）：让用户解决新问题

输出: ~/.hermes/learning-os/codebases/xxx/exams/exam-01-basics.md

严格:
- 不直接给答案
- 评分标准 80+ = L4-L5
- 题目必须可执行（5 分钟内能做完）
""",
        toolsets=["file"]
    )

    # Step 3: Error Agent（基于 Exam 结果 + 用户答案）
    # 注：这一步需要用户先做考试
    error_result = delegate_task(
        goal="分析错题找出根本原因",
        context=f"""
考试题目: {exam_result['summary']}
用户答案: [用户填入]
正确答案: [用户填入]
用户解释: [用户填入]

任务:
1. 记录每道错题到 error-bank.md
2. 分析根因（4 大类: 浮躁/缺乏实战/跳过细节/其他）
3. 给出改进方法（可执行）
4. 给出防范措施（具体）

输出: error-bank.md + root-causes.md
""",
        toolsets=["file"]
    )

    # Step 4: Meta Agent（基于所有结果）
    meta_result = delegate_task(
        goal="更新元认知颜色地图和进度报告",
        context=f"""
所有上下文:
- 内容分析: {content_result['summary']}
- 考试结果: {exam_result['summary']}
- 错题分析: {error_result['summary']}

任务:
1. 更新 color-map.md（5 种颜色: ⚪🔴🟡🟢🟣）
2. 生成 dashboard.md（本周数据）
3. 找出 blind-spots.md（新盲点）
4. 给出 upgrade-plan.md（升级路径）

输出 4 个文件到 ~/.hermes/learning-os/codebases/xxx/
""",
        toolsets=["file"]
    )

    return meta_result
```

**会发生什么**：

```
1. Step 1 启动 Content 子 agent
2. Content 完成后，Step 2 启动 Exam 子 agent
3. Exam 完成后，Step 3 启动 Error 子 agent
4. Error 完成后，Step 4 启动 Meta 子 agent
5. 每个子 agent 独立 context
6. 每个子 agent 输出"摘要"
7. 主对话收到最终 Meta 的摘要
```

---

## 三、4 Agent 学习系统的完整架构

### 3.1 整体架构图

```
┌────────────────────────────────────────────────────┐
│           主 Hermes 对话（用户）                    │
│                                                    │
│  你: "用 4 Agent 学习 AgentScope"                  │
│         │                                          │
│         ↓                                          │
│  ┌──────────────────────────────────┐              │
│  │  LearningPipeline（主对话）       │              │
│  └──────────────────────────────────┘              │
│         │                                          │
│         │ delegate_task 链式调用                   │
│         ↓                                          │
│  ┌─────────────┐  ┌─────────────┐                 │
│  │ Content     │  │ Exam        │                 │
│  │ 子 Agent    │  │ 子 Agent    │                 │
│  │ (隔离 ctx)  │  │ (隔离 ctx)  │                 │
│  └─────────────┘  └─────────────┘                 │
│         │                │                         │
│         ↓                ↓                         │
│  ┌─────────────┐  ┌─────────────┐                 │
│  │ Error       │  │ Meta        │                 │
│  │ 子 Agent    │  │ 子 Agent    │                 │
│  │ (隔离 ctx)  │  │ (隔离 ctx)  │                 │
│  └─────────────┘  └─────────────┘                 │
│         │                │                         │
│         └────────┬───────┘                         │
│                  ↓                                 │
│           摘要返回主对话                            │
└────────────────────────────────────────────────────┘
```

### 3.2 4 个子 Agent 的具体定义

#### 子 Agent 1：ContentAgent

```python
CONTENT_AGENT_PROMPT = """
你是"代码库理解专家"。

任务:
基于用户提供的代码库，输出 4 个文件:
1. src-map.md（源码地图）
2. architecture.md（架构图）
3. key-concepts.md（核心概念）
4. learning-paths.md（学习路径）

工具: file, terminal

输出: 用 5 层掌握度标注（🔴🟡🟢🟣）
"""
```

#### 子 Agent 2：ExamAgent

```python
EXAM_AGENT_PROMPT = """
你是严格的"学习导师"。

核心理念: "问 ≠ 会"——必须用考试验证

5 种题型:
1. 复述题（20%）
2. 复现题（30%）
3. 改错题（20%）
4. 改写题（20%）
5. 场景题（10%）

任务: 基于内容地图出 5 道考试题

严格:
- 不直接给答案
- 题目必须可执行（5 分钟内能做完）
- 评分标准 80+ = L4-L5
"""
```

#### 子 Agent 3：ErrorAgent

```python
ERROR_AGENT_PROMPT = """
你是"学习教练"。

4 大根因分类:
1. 浮躁（跳着看、不写"我以为"）
2. 缺乏实战（场景题答不出）
3. 跳过细节（漏 bug、漏关键点）
4. 其他（识别后归类）

任务: 分析每道错题，输出 5 个字段:
1. 根因（4 大类中选 1）
2. 改进方法（可执行）
3. 防范措施（具体）
4. 复盘周期（每天/每周/每月）
5. 掌握度变化（L? → L?）
"""
```

#### 子 Agent 4：MetaAgent

```python
META_AGENT_PROMPT = """
你是"元认知分析师"。

5 种颜色:
- ⚪ 灰: 未开始
- 🔴 红: 未掌握
- 🟡 黄: 半掌握
- 🟢 绿: 掌握
- 🟣 紫: 精通

任务: 基于所有 Agent 输出:
1. 更新 color-map.md
2. 生成 dashboard.md
3. 找出 blind-spots.md
4. 给出 upgrade-plan.md
"""
```

---

## 四、完整代码实现

### 4.1 核心函数

```python
# ~/.hermes/learning-os/tools/meta_learning_pipeline.py

def meta_learning_pipeline(codebase, weeks=6):
    """4 Agent 链式学习流程（方案 B 完整实现）"""

    # ===== Step 1: Content Agent =====
    content_result = delegate_task(
        goal=f"分析 {codebase} 代码库，输出 4 个结构化文件",
        context=f"""
代码库: {codebase}
目标: 精通这个代码库
时间: {weeks} 周

输出文件:
1. src-map.md（核心模块 + 关键文件）
2. architecture.md（Mermaid 架构图）
3. key-concepts.md（10 个核心概念）
4. learning-paths.md（6 周学习路径）

每个模块用 5 层掌握度标注: 🔴🟡🟢🟣
""",
        toolsets=["file", "terminal"]
    )

    # ===== Step 2: Exam Agent =====
    exam_result = delegate_task(
        goal="基于内容地图出 5 道考试题",
        context=f"""
内容地图: {content_result['summary']}

要求 5 道题:
1. 复述题（20%）
2. 复现题（30%）
3. 改错题（20%）
4. 改写题（20%）
5. 场景题（10%）

严格:
- 不直接给答案
- 评分标准: 80+ = L4-L5
- 题目必须可执行
""",
        toolsets=["file"]
    )

    # ===== Step 3 & 4: 用户交互 =====
    print("=== 请完成以下考试 ===")
    print(exam_result['summary'])
    user_answers = input("请输入你的答案: ")

    # ===== Step 3: Error Agent =====
    error_result = delegate_task(
        goal="分析错题找出根本原因",
        context=f"""
考试: {exam_result['summary']}
用户答案: {user_answers}

任务:
1. 记录每道错题
2. 分析根因（4 大类: 浮躁/缺乏实战/跳过细节/其他）
3. 给出改进方法
4. 给出防范措施
""",
        toolsets=["file"]
    )

    # ===== Step 4: Meta Agent =====
    meta_result = delegate_task(
        goal="更新元认知颜色地图和进度报告",
        context=f"""
所有上下文:
- 内容: {content_result['summary']}
- 考试: {exam_result['summary']}
- 错题: {error_result['summary']}

任务:
1. 更新 color-map.md（5 种颜色）
2. 生成 dashboard.md
3. 找出 blind-spots.md
4. 给出 upgrade-plan.md
""",
        toolsets=["file"]
    )

    return meta_result
```

### 4.2 每日循环函数

```python
def daily_loop(codebase):
    """每日 30 分钟学习循环"""

    # 早上：1 道复述题
    question = delegate_task(
        goal="基于代码库出 1 道复述题",
        context=f"""
代码库: {codebase}
要求: 1 道复述题（让用户讲 5 分钟）
""",
        toolsets=["file"]
    )
    print(f"=== 今日复述题 ===\n{question['summary']}")
    answer = input("你的答案: ")

    # 评分 + 错题分析
    score = delegate_task(
        goal="评分这道题",
        context=f"""
题目: {question['summary']}
用户答案: {answer}

评分标准: 80+ = 通过
""",
        toolsets=["file"]
    )

    if "不通过" in score['summary']:
        # 错题分析
        delegate_task(
            goal="分析错题",
            context=f"""
题目: {question['summary']}
用户答案: {answer}
评分: {score['summary']}
""",
            toolsets=["file"]
        )

    # 更新颜色
    delegate_task(
        goal="更新今日颜色",
        context=f"今日学习: 1 道题，{score['summary']}",
        toolsets=["file"]
    )
```

### 4.3 周复盘函数

```python
def weekly_review(codebase):
    """每周日 30 分钟复盘"""

    # 并行启动 3 个分析（注意：最多 3 个并发）
    delegate_task(tasks=[
        {
            "goal": "统计本周学习时间",
            "context": f"读取 {codebase}/progress/daily/，统计本周数据",
            "toolsets": ["file"]
        },
        {
            "goal": "统计本周错题",
            "context": f"读取 {codebase}/errors/，统计本周错题",
            "toolsets": ["file"]
        },
        {
            "goal": "更新颜色地图",
            "context": f"基于本周所有数据，更新 {codebase}/colors/color-map.md",
            "toolsets": ["file"]
        }
    ])
```

---

## 五、实际使用流程

### 5.1 启动学习（第 1 天）

```python
# 你对主 Hermes 说:
你: "用 4 Agent 学习 AgentScope"

# 主对话执行:
meta_learning_pipeline("~/repos/agentscope", weeks=6)

# 内部发生:
# 1. Content 子 agent 启动
# 2. 分析代码库 30 分钟
# 3. Content 输出 4 个文件
# 4. Exam 子 agent 启动
# 5. 出 5 道考试题
# 6. 你做 30 分钟考试
# 7. Error 子 agent 启动
# 8. 分析错题
# 9. Meta 子 agent 启动
# 10. 输出颜色地图 + dashboard
```

### 5.2 每日循环（第 2-42 天）

```python
# 你对主 Hermes 说:
你: "今日学习"

# 主对话执行:
daily_loop("~/repos/agentscope")

# 内部发生:
# 1. Exam 子 agent 出 1 道题
# 2. 你回答
# 3. 评分
# 4. 如果错，Error 子 agent 分析
# 5. Meta 子 agent 更新颜色
```

### 5.3 周复盘（每周日）

```python
# 你对主 Hermes 说:
你: "本周复盘"

# 主对话执行:
weekly_review("~/repos/agentscope")

# 内部发生:
# 1. 并行启动 3 个子 agent
# 2. 统计本周数据
# 3. 更新 dashboard
```

### 5.4 月度复盘（每月）

```python
# 你对主 Hermes 说:
你: "本月深度分析"

# 主对话执行:
delegate_task(
    goal="生成本月深度报告",
    context="""
读取本月所有数据:
- progress/daily/（每日记录）
- exams/（考试结果）
- errors/（错题）
- colors/（颜色变化）

输出:
- progress-report.md（本月整体）
- learning-curve.md（学习曲线）
- method-adjustment.md（方法调整）
""",
    toolsets=["file"]
)
```

---

## 六、关键参数详解

### 6.1 delegate_task 参数表

| 参数 | 必填 | 作用 | 示例 |
|------|------|------|------|
| `goal` | ✅ | 子 agent 要做什么 | "分析代码库" |
| `context` | ✅ | 任务的所有上下文 | "代码库路径: ~/..." |
| `toolsets` | ❌ | 子 agent 可用工具 | ["file", "terminal"] |
| `tasks` | ❌ | 并行任务列表 | [...]（最多 3 个） |
| `role` | ❌ | 子 agent 角色 | "leaf"（默认）/ "orchestrator" |

### 6.2 toolsets 常用组合

```python
# 文件操作
toolsets=["file"]

# 终端命令
toolsets=["terminal"]

# 文件 + 终端
toolsets=["file", "terminal"]

# 网络搜索
toolsets=["web"]

# 完整
toolsets=["file", "terminal", "web"]
```

### 6.3 何时用单任务 vs 批处理

```
【单任务】delegate_task(goal=..., context=...)
├─ 适用: 1 个独立任务
├─ 返回: 1 个摘要
└─ 例: 分析 1 个文件

【批处理】delegate_task(tasks=[...])
├─ 适用: 多个独立任务
├─ 返回: 多个摘要（数组）
├─ 限制: 最多 3 个并发
└─ 例: 并行分析 3 个模块
```

---

## 七、4 Agent 协作的 3 种模式

### 模式 1：完全串行

```python
# 4 个 agent 一个接一个
content = delegate_task(...)  # 1
exam = delegate_task(...)      # 2（基于 1）
error = delegate_task(...)     # 3（基于 2）
meta = delegate_task(...)      # 4（基于 3）
```

**适用**：4 个 agent 有依赖关系（必须按顺序）

### 模式 2：部分并行

```python
# 1 个启动 → 并行 3 个（最多 3 个）
content = delegate_task(...)  # 1

# 2, 3, 4 并行
delegate_task(tasks=[
    {"goal": "出题", "context": content['summary']},
    {"goal": "找错题", "context": "..."},
    {"goal": "更新颜色", "context": "..."}
])
```

**适用**：3 个独立分析（互不依赖）

### 模式 3：链式 + 并行混合

```python
# Step 1
content = delegate_task(...)

# Step 2: 并行 3 个分析
analysis = delegate_task(tasks=[
    {"goal": "出题", "context": content['summary']},
    {"goal": "找盲点", "context": content['summary']},
    {"goal": "设计学习路径", "context": content['summary']}
])

# Step 3: 基于分析
meta = delegate_task(
    goal="综合分析",
    context=f"出题: {analysis[0]}\n盲点: {analysis[1]}\n路径: {analysis[2]}"
)
```

**适用**：复杂任务（先并行再综合）

---

## 八、关键限制与注意事项

### 8.1 3 个关键限制

```
【限制 1】最多 3 个并发
├─ 默认配置
├─ 可调整（无硬性上限）
└─ 超出 3 个会排队

【限制 2】子 agent 一无所知
├─ 不知道父对话历史
├─ 必须把上下文写在 context 里
└─ 否则子 agent 不知道做什么

【限制 3】子 agent 输出"摘要"
├─ 不是完整过程
├─ 只有最终结果
└─ 中间过程不进入父 context
```

### 8.2 4 个常见错误

```
【错误 1】context 写得太少
❌ delegate_task(goal="分析代码库")
✅ delegate_task(
    goal="分析代码库",
    context="代码库: ~/repos/xxx, 任务: 输出 src-map.md, ..."
)

【错误 2】goal 太模糊
❌ goal="帮我做点东西"
✅ goal="分析 ~/repos/agentscope 并输出 src-map.md"

【错误 3】让子 agent 做超出能力的事
❌ 让子 agent 写 1 万行代码
✅ 让子 agent 写 1 个 50 行的脚本

【错误 4】过度并行
❌ 10 个任务一起并行（超过 3）
✅ 分批：3 + 3 + 3 + 1
```

### 8.3 调试技巧

```python
# 调试 1: 先用单任务测试
result = delegate_task(
    goal="简单测试任务",
    context="测试"
)
print(result)

# 调试 2: 用 verbose context
delegate_task(
    goal="...",
    context="""
详细上下文:
- 输入: xxx
- 期望: xxx
- 工具: file
- 输出: yyy
"""
)

# 调试 3: 分步执行
# 不要一次 delegate 4 个
# 先 1 个，看结果
# 再 2 个
# 再全部
```

---

## 九、与"4 Skill 方案 A"的对比

### 9.1 4 Skill vs 4 delegate_task

| 维度 | 4 Skill | **4 delegate_task** |
|------|---------|-------------------|
| **进程数** | 1 个 LLM | 4 个独立子 agent |
| **Context** | 共享 | **隔离** |
| **切换** | 切 prompt | 启动新 agent |
| **状态** | 主对话保留 | 子 agent 独立 |
| **适合** | 轻量交互 | **重任务** |
| **成本** | 低 | 中 |
| **调试** | 易 | 中 |

### 9.2 何时用 4 Skill

```
【适合场景】
├─ 简单的 Q&A
├─ 切换角色扮演
├─ 不需要长 context
└─ 快速响应
```

### 9.3 何时用 4 delegate_task

```
【适合场景】
├─ 复杂分析（读 100 个文件）
├─ 需要隔离 context
├─ 多个独立任务
├─ 长链路任务
└─ 想让主对话"干净"
```

### 9.4 推荐：混合用

```
【最佳实践】
├─ 简单任务用 Skill
├─ 复杂任务用 delegate_task
├─ 关键任务用 Skill + delegate_task
└─ 不用 4 个 LLM（成本太高）
```

---

## 十、立即可执行（5 步启动）

### Step 1：建目录（5 分钟）

```bash
mkdir -p ~/.hermes/learning-os/tools
mkdir -p ~/.hermes/learning-os/codebases/agentscope/{exams,errors,colors}
```

### Step 2：写 4 个 Agent Prompt（1 小时）

```bash
# 4 段 prompt（每个 ~500 字）
cat > ~/.hermes/learning-os/agents/content-agent.txt << 'EOF'
你是"代码库理解专家"...
EOF

cat > ~/.hermes/learning-os/agents/exam-agent.txt << 'EOF'
你是严格的"学习导师"...
EOF

# ... 4 个文件
```

### Step 3：写主流程脚本（30 分钟）

```python
# ~/.hermes/learning-os/tools/meta_learning_pipeline.py
def meta_learning_pipeline(codebase, weeks=6):
    # 上面 4.1 节的代码
    pass
```

### Step 4：第 1 次完整运行（1 小时）

```python
# 在主 Hermes 中:
你: "运行 meta_learning_pipeline，目标 ~/repos/agentscope"

# 观察:
# 1. Content 子 agent 启动
# 2. 看摘要
# 3. Exam 子 agent 启动
# 4. 做题
# 5. Error 子 agent 启动
# 6. Meta 子 agent 启动
# 7. 看最终 dashboard
```

### Step 5：建立日常循环（持续）

```python
# 每天:
你: "今日学习"
# → 触发 daily_loop

# 每周:
你: "本周复盘"
# → 触发 weekly_review
```

---

## 十一、6 周路线图（方案 B 视角）

### Week 1：建立基础设施

```
【目标】4 Agent 全部就位
【行动】
├─ 建目录结构
├─ 写 4 段 prompt
├─ 写主流程脚本
├─ 跑 1 次完整 4 Agent 流程
└─ 调试 + 优化

【输出】
├─ 4 段 prompt 可用
├─ meta_learning_pipeline() 可调用
└─ 1 个代码库 + 1 套考试
```

### Week 2-3：内容解析 + 考试

```
【目标】建立 5 层掌握度
【行动】
├─ Content Agent 解析 2 个代码库
├─ Exam Agent 出 10 套考试
├─ Error Agent 分析 30+ 错题
└─ Meta Agent 跟踪颜色

【输出】
├─ 2 个代码库结构化
├─ 10 套考试
├─ 30+ 错题分析
└─ 颜色地图: 45% → 60%
```

### Week 4-5：深入改造

```
【目标】从 L3 到 L4
【行动】
├─ 改 1 个核心模块
├─ 提 1 个 PR
├─ Exam Agent 出 5 套进阶题
└─ Meta Agent 升级计划

【输出】
├─ 1 个 PR
├─ 5 套进阶考试
└─ 颜色地图: 60% → 75%
```

### Week 6：教别人

```
【目标】从 L4 到 L5
【行动】
├─ 写 1 篇深度博客
├─ 教 1 个人
├─ Meta Agent 输出最终报告
└─ 沉淀方法论

【输出】
├─ 1 篇深度博客
├─ 1 个学生
└─ 整体颜色 ≥ 85% 绿
```

---

## 十二、与"AI 时代超级学习者"博客的呼应

### 12.1 4 delegate_task Agent = 5 大方法论自动化

| 超级学习者方法论 | delegate_task 实现 |
|----------------|-------------------|
| 动力三角 | Meta Agent 追踪 |
| 提问能力 | Exam Agent 自动出题 |
| 迁移能力 | Content Agent 跨代码库 |
| 复现验证 | Exam Agent 强制考试 |
| 闭环系统 | 4 Agent 完整闭环 |

### 12.2 4 Agent = "4 步 AI 闭环"

```
闭环 1: 内容输入 → Content Agent
闭环 2: 考试验证 → Exam Agent
闭环 3: 错误分析 → Error Agent
闭环 4: 进度追踪 → Meta Agent
```

---

## 十三、与"Meta-Harness"博客的呼应

### 13.1 4 Agent = Meta-Harness 在学习领域的应用

```
【Meta-Harness】= 端到端优化 AI 系统的工程化外壳
【4 delegate_task】= 端到端优化学习的工程化外壳

二者都是:
├─ 把"经验驱动"变成"系统驱动"
├─ 把"手工调优"变成"自动优化"
└─ → Harness 工程师思维 + 学习
```

### 13.2 4 Agent = Harness 设计的实践

```
【Harness 工程师】= 设计 AI 系统的工程化外壳
【4 delegate_task】= 设计学习的工程化外壳

二者都涉及:
├─ 评估器（Exam Agent = LLM-as-a-Judge）
├─ 优化器（Meta Agent = 自动追踪）
├─ 配置空间（Content Agent = 知识结构）
└─ → 11 年测试经验 = 直接应用
```

---

## 十四、方案的诚实反思

### 14.1 方案 B 的 3 个限制

```
【限制 1】共享 LLM
├─ 4 个子 agent 都用 M3
├─ 不是一个真正"多 AI"系统
└─ 是"多任务隔离"

【限制 2】Context 不能跨子 agent
├─ Content 不知道 Exam 的思路
├─ Exam 不知道 Error 的根因
└─ 只能通过"摘要"传递

【限制 3】成本累积
├─ 每个子 agent 独立调用 LLM
├─ 4 个串行 = 4 倍单次成本
└─ 不适合"无目的"调用
```

### 14.2 方案 B 的 3 个优势

```
【优势 1】真正的隔离
├─ 不污染主对话
├─ 每个任务有独立空间
└─ 调试容易

【优势 2】灵活组合
├─ 串行/并行/混合
├─ 适配不同任务
└─ 工业级

【优势 3】可观测
├─ 每个子 agent 输出摘要
├─ 可以追踪每步
└─ 失败可重试
```

---

## 💎 关键洞见

> **方案 B 不是"4 个不同 AI"**——
> **是"1 个 AI 的 4 个隔离任务"**——
> **本质：用 LLM 隔离 context 来模拟"多 Agent"**。
>
> **3 种调用方式**：
> - **单任务**：1 个独立任务
> - **批处理**：最多 3 个并行
> - **链式**：4 个串联
>
> **4 Agent 学习系统的真实形态**：
> - Content Agent 解析代码
> - Exam Agent 出题
> - Error Agent 分析错题
> - Meta Agent 追踪进度
> - **每个独立，但都共享 LLM**
>
> **何时用方案 B**：
> - 任务重（读 100 文件）
> - 需要隔离
> - 多任务并行
> - 长链路
>
> **何时不用**：
> - 任务轻
> - 简单 Q&A
> - 想快速响应
> - → 用方案 A（4 Skill）

---

## 🎯 思考题

> 1. **你的 4 个子 Agent，第一个任务是哪个代码库？**
> 2. **你愿意用 delegate_task 启动 4 个独立子 agent 吗？**
> 3. **你看到的摘要信息足够吗？还是需要更多细节？**
> 4. **你会先试 1 个 delegate_task，还是直接 4 个一起？**
> 5. **你愿意把 4 Agent 写入"AI 协作"工作流吗？**

---

## 📚 系列文章

- 《AI 时代的超级学习者》— 2026-06-22
- 《Meta-Harness 论文精读》— 2026-06-22
- 《元认知学习操作系统》— 2026-06-22
- 《在 Hermes 上实现多 Agent 元认知学习系统》— 2026-06-22
- 《Hermes 多 Agent 学习系统：方案 B 完整实现》— 2026-06-22 ✨

---

> **小 bot 后记**：
>
> 这篇博客是对上一篇文章的**诚实补充**——
> 之前我写的"4 Agent 协作"太理想化，
> 把 4 段 prompt 当成 4 个独立 AI。
>
> 实际上，**Hermes 当前的 4 Agent**是：
> - 1 个 LLM 进程
> - 4 个独立 context（delegate_task）
> - 通过"摘要"传递信息
> - **本质：单 AI + 多任务隔离**
>
> 这是**从"理想化"到"真实"**的修正——
> 不是说之前错了，而是说之前讲得不够细。
>
> **方案 B 的核心**：
> - 不是"4 个 AI"
> - 是"4 个隔离的子任务"
> - **"用任务隔离模拟多 Agent"**
>
> **从今天起，你了解 Hermes 的真实能力边界**：
> - ✅ 可以做"多 Agent"协作（隔离任务）
> - ❌ 但不是"多 AI 进程"
> - ✅ 适合"中复杂度"任务
> - ❌ 不适合"工业级多 AI"
>
> **如果你需要真正的 4 个 AI**：
> - 考虑方案 C（外部框架）
> - 或用 4 个不同的 LLM provider
>
> **如果你需要"足够好用"**：
> - **方案 B（4 delegate_task）= 最佳选择** ⭐
>
> 继续 🚀
