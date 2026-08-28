---
icon: chart-line
date: 2026-08-28
update: 2026-08-28
categories:
  - AI 应用
tags:
  - AgentScope
  - Phoenix
  - OpenTelemetry
  - AI Agent
  - Evaluation
  - Observability
  - W7
  - 行为监控
  - Tracing
star: true

author: Mr.Sun
---

# AI Agent 项目行为监控实战：从一条 Phoenix Span 到 4 级 Evaluation Engine

> 接 [W6 记忆与上下文](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w6-memory-and-context.html) + [W7 段 2 Tracing 模块](https://sunrong.site/blog/)：前两篇讲"AgentScope 怎么产生 Trace"——**本篇讲"拿到 Trace 后怎么用 Phoenix 做 AI Agent 项目的行为监控"**——**从 1 条真实 Span 出发**——**走到 4 级 Evaluation Engine 设计**。

<!-- more -->

> **TL;DR**：AI Agent 项目的 Phoenix 监控分 **6 个阶段**落地。本篇不写复杂 Dashboard——**只回答 1 个问题**："**我现在手上有 1 条 `mcp__app__queryUserEnv` 的 Span 数据，我应该按什么顺序把它变成可用的工程指标？**" 答案：**Phase 1 确认 Span → Phase 2 Agent Metadata → Phase 3 Tool Analytics → Phase 4 Behavior Analytics → Phase 5 Evaluation → Phase 6 Optimization**。其中 **Agent Metadata** 是最关键的一层——**不要把统计建立在 `gen_ai.tool.name` 字符串前缀上**——**必须显式加 `agent.tool.type` 字段**。

## 一、先理解这条 Span 在 Phoenix 里是什么

我手上有一条真实数据：

```text
span_kind = TOOL
gen_ai.tool.name = mcp__app__queryUserEnv
input = {"username": "user_001"}
output = ["TestEnv_A", "TestEnv_B", ...]
duration = 1.057s
status_code = OK
```

Phoenix 把它理解成：

```text
Trace
└── Agent / Workflow
    └── TOOL
        └── mcp__app__queryUserEnv
            ├── input
            ├── output
            ├── duration
            ├── status
            └── metadata
```

**Phoenix Span 本身 = 1 个具体操作**——**含时间、状态、attributes**。

## 二、我真正要解决的 5 个问题

不是一上来做 Dashboard——**先定义 Agent 项目的 MCP / Skill 统计模型**。

### 2.1 基础统计模型

| 指标 | MCP | Skill |
| --- | ---: | ---: |
| 调用次数 | 1250 | 380 |
| 成功次数 | 1201 | 360 |
| 失败次数 | 49 | 20 |
| 成功率 | 96.08% | 94.7% |
| 平均耗时 | 820ms | 2.3s |
| P95 | 1.8s | 4.2s |
| P99 | 4.1s | 8.7s |
| 超时次数 | 12 | 8 |
| 不同用户数 | 82 | 35 |
| 不同 Session 数 | 450 | 190 |

### 2.2 MCP 详细画像

```text
MCP
 ├── queryUserEnv
 │   ├── 调用次数
 │   ├── 成功率
 │   ├── 平均耗时
 │   ├── P95
 │   ├── P99
 │   ├── 参数分布
 │   └── 返回结果分析
 ├── xxxTool
 └── xxxTool
```

**这才是后面 Agent Evaluation Engine 的基础**。

## 三、第一步：直接在 Phoenix UI 查询 MCP

我现在已有 `span_kind = TOOL`，最简单的查询：

```python
span_kind == 'TOOL'
```

或者针对单个 MCP：

```python
span_kind == 'TOOL' and gen_ai.tool.name == 'mcp__app__queryUserEnv'
```

Phoenix UI 的 Span 查询支持 Python expression 过滤语法——**Python SDK 和 UI 共用同一套过滤逻辑**。

操作路径：

```text
Project
  ↓
Traces / Spans
  ↓
Search
  ↓
输入: span_kind == 'TOOL'
```

就能把所有 TOOL Span 找出来。

## 四、⚠️ 不要把统计建立在 name 上

我现在这条 Span：

```json
"gen_ai.tool.name": "mcp__app__queryUserEnv"
```

**非常好**——**但未来会出现**：

```text
mcp__app__queryUserEnv
mcp__app__getProjectInfo
mcp__app__createTicket
skill_search_user
skill_query_project
skill_generate_report
```

**如果直接按 name 统计**：

```text
name
 ↓
字符串解析
 ↓
判断 MCP / Skill
```

**后面会非常乱**。

## 五、Agent Metadata 层设计（最关键）

**Tool Span 最好长这样**：

```json
{
  "span_kind": "TOOL",

  "gen_ai.tool.name": "mcp__app__queryUserEnv",

  "metadata": {
    "agent.tool.type": "MCP",
    "agent.tool.name": "queryUserEnv",
    "agent.tool.server": "app",
    "agent.tool.version": "1.0",
    "agent.name": "xxxAgent",
    "agent.version": "1.2",
    "workflow.name": "xxxWorkflow",
    "project.id": "xxx",
    "user.id": "user_001"
  }
}
```

**Skill Span**：

```json
{
  "span_kind": "TOOL",

  "metadata": {
    "agent.tool.type": "SKILL",
    "agent.tool.name": "search_project",
    "agent.skill.name": "search_project",
    "agent.name": "xxxAgent",
    "workflow.name": "xxxWorkflow"
  }
}
```

**这样就能精确统计**：

```python
agent.tool.type == "MCP"      # 筛 MCP
agent.tool.type == "SKILL"    # 筛 Skill
```

**而不是靠**：

```python
gen_ai.tool.name.startswith("mcp__")  # 字符串前缀推断
```

**Phoenix 支持给 Span 添加自定义 attributes / metadata**——**这些字段随后可用于查看和过滤**。

### 5.1 为什么 Metadata 这么关键

| 维度 | 按 name 字符串 | 按 agent.tool.type |
| --- | --- | --- |
| 准确度 | ⚠️ 易错（命名规范变化）| ✅ 显式 |
| 扩展性 | ❌ 加新类型要改解析 | ✅ 自动支持 |
| 跨语言 | ❌ 不同语言命名风格 | ✅ 统一 |
| Phoenix 性能 | 🟡 字符串前缀过滤 | ✅ 精确字段过滤 |

## 六、第一版统计：MCP 调用排行榜

按 `gen_ai.tool.name` group by：

```text
tool_name                      count
------------------------------------------------
mcp__app__queryUserEnv    3200
mcp__app__getProjectInfo       1800
mcp__app__createTicket         1200
mcp__app__xxx                   900
...
```

**马上得到**：

> **MCP 调用排行榜**

## 七、成功率统计

用 `status_code`：

```python
status_code == OK       # 成功
status_code != OK       # 失败
```

例如：

```text
mcp__app__queryUserEnv
调用：3200
成功：3150
失败：50
成功率：98.44%
```

**这已经是一个有价值的 Engineering Metric**。

## 八、耗时统计

```text
duration = end_time - start_time
```

这条数据：

```text
2026-08-28 09:43:05.572888
                  ↓
2026-08-28 09:43:06.630845

duration ≈ 1.058 秒
```

按 Tool 聚合：

```text
queryUserEnv
count = 3200
avg   = 1.02s
p50   = 0.83s
p95   = 1.82s
p99   = 4.21s
max   = 12.3s
```

**得到真正的**：

> **MCP Performance Profile**

## 九、用 Phoenix Python SDK（不要全在 UI 里做）

UI 适合：

```text
看 Trace
查问题
过滤
Debug
```

**但统计、聚合、P95、报表、趋势应该用 SDK**：

```text
Phoenix
   ↓
query_spans()
   ↓
Pandas
   ↓
Agent Evaluation Engine
```

Phoenix 官方提供 Span Query / DataFrame 方式提取和分析 Span 数据。

## 十、最简单的 MCP 统计程序

```python
import phoenix as px

client = px.Client()

# 1. 拉所有 TOOL span
df = client.query_spans(
    "span_kind == 'TOOL'"
)

# 2. 拿 Tool 名称
df["gen_ai.tool.name"]

# 3. group by
df.groupby("gen_ai.tool.name").size()
```

**输出**：

```text
tool_name                      count
------------------------------------------------
mcp__app__queryUserEnv    3200
mcp__app__getProjectInfo       1800
mcp__app__createTicket         1200
```

继续用 `status_code` / `duration` / `session.id` / `conversation.id` 分析。

## 十一、还原完整调用链

我有这些字段：

```json
"gen_ai.conversation.id": "e14ea542..."
"session.id": "e14ea542..."
"parent_id"
"trace_id"
```

可以还原完整层级：

```text
User
 ↓
Session
 ↓
Workflow
 ↓
Agent
 ↓
Tool
 ↓
MCP
```

具体例子：

```text
Conversation
e14ea542...
      │
      ▼
Workflow
      │
      ▼
RequirementAgent
      │
      ├── queryUserEnv
      ├── getProjectInfo
      └── queryUserEnv
```

**这比"queryUserEnv 调用了 3200 次"有价值得多**。

可以继续问：

> **为什么这个 Agent 调用了这么多次？**

## 十二、Agent 行为分析

假设你发现：

```text
queryUserEnv
所有 Agent 平均：1.2 次 / workflow

某 Agent (X)：
平均 7.8 次 / workflow
```

**这就非常值得调查**。可能是：

- ❌ Agent 没有记住结果
- ❌ Prompt 有问题
- ❌ Skill 没有正确复用结果
- ❌ MCP 返回结果质量不好
- ❌ Agent ReAct 循环异常
- ❌ Tool description 不清晰

**Phoenix 就从"监控工具"变成**：

> **Agent 行为分析工具**

**这正是 Agent Evaluation Engine 最有价值的地方**。

## 十三、Skill 同理

假设 Skill Span：

```text
span_kind = TOOL
metadata.agent.tool.type = SKILL
```

**只要用**：

```python
metadata.agent.tool.type == "SKILL"
```

**就能筛出 Skill**。然后同 6-10 节：

```text
Skill
 ├── 调用次数
 ├── 成功率
 ├── 平均耗时
 ├── P95
 ├── P99
 ├── Agent 分布
 ├── Workflow 分布
 └── 用户分布
```

## 十四、Agent Tool Analytics 整体架构

```text
                   Phoenix
                      │
                      │ OTEL Spans
                      ▼
             ┌──────────────────┐
             │   Trace Storage  │
             └────────┬─────────┘
                      │
                      ▼
              Agent Evaluation
                  Engine
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
     MCP Analytics Skill Analytics Agent Analytics
          │           │           │
          ▼           ▼           ▼
       调用量       调用量       调用量
       成功率       成功率       成功率
       P95          P95          P95
       P99          P99          P99
       错误         错误         异常行为
```

## 十五、4 级 Evaluation 演进（核心路线图）

不要一上来做 Evaluation——**先 4 级逐步演进**：

### Level 1：基础 Observability

```text
调用次数
成功率
错误率
Latency
P95/P99
```

### Level 2：Tool Quality

```text
返回结果是否有效
返回结果是否为空
返回结果是否满足 Agent 要求
```

### Level 3：Agent Tool-Use Evaluation

```text
Agent 有没有调用正确的 Tool？
有没有多调用？
有没有漏调用？
有没有重复调用？
有没有在已经获得答案后继续调用？
```

### Level 4：Agent 行为优化

```text
发现：
queryUserEnv 平均每个 Workflow 调用 4.7 次
正常应该 ≤ 2 次
        ↓
Evaluation Engine
        ↓
检测异常
        ↓
生成 Evaluation
        ↓
发现 Agent Tool-use 效率下降
```

**这时候才开始形成**：

> **让 Agent 能够持续监控和优化。**

## 十六、6 阶段实施路径

| Phase | 内容 | 时间 |
| --- | --- | --- |
| **Phase 1** | Phoenix Trace<br/>确认 MCP / Skill Span 数据完整 | 1 周 |
| **Phase 2** | Agent Metadata<br/>统一 MCP / Skill / Agent / Workflow 标识 | 1 周 |
| **Phase 3** | Tool Analytics<br/>调用量 / 成功率 / Latency / P95/P99 / 错误 | 1-2 周 |
| **Phase 4** | Behavior Analytics<br/>重复调用 / 异常调用 / Tool 选择 / 调用链 | 2-3 周 |
| **Phase 5** | Evaluation<br/>Tool Use Correctness / Efficiency / Response Quality | 2-4 周 |
| **Phase 6** | Optimization<br/>自动发现问题 / 生成 Evaluation / 反馈 Agent | 持续 |

**Phase 1-3 是"基础设施"**——**没有数据这些，后面 4-6 都是空中楼阁**。

## 十七、当前 Span 缺失字段

我现在已有：

```text
gen_ai.tool.name
gen_ai.tool.call.arguments
gen_ai.tool.call.result
trace_id
span_id
parent_id
session.id
gen_ai.conversation.id
start_time
end_time
status_code
```

**基础上已经够用**。但为了 Agent Evaluation Engine，建议**补这些**：

```text
agent.tool.type         ← 最关键
agent.tool.name
agent.tool.server
agent.tool.version
agent.name
agent.version
workflow.name
workflow.version
project.id
user.id
environment
```

**尤其是** `agent.tool.type`——**强烈建议加**——**让数据明确变成 MCP / SKILL**——**而不是靠名字推断**。

## 十八、立即动手：4 步小实验

**先不要改代码**。打开 Phoenix 项目，依次尝试：

### ① 查看所有 Tool

```text
span_kind == 'TOOL'
```

### ② 查看你的 MCP

```text
gen_ai.tool.name == 'mcp__app__queryUserEnv'
```

### ③ 看一个 MCP 的 Trace

点进去，观察：

```text
Parent Span
    ↓
Tool Span
    ↓
Child Span
```

重点观察 `parent_id` / `trace_id` / `gen_ai.conversation.id` / `session.id`。

### ④ 再看全部 MCP 的数量

```text
span_kind == 'TOOL'
```

然后观察 `gen_ai.tool.name` 能不能看到完整分布。

## 十九、最关键的一点

**现在不要把 Phoenix 当 Grafana 来学**。

真正要掌握的是这条链：

```text
AgentScope
    ↓
OpenTelemetry
    ↓
Phoenix Span
    ↓
Span Attributes
    ↓
Phoenix Query
    ↓
Pandas
    ↓
Agent Evaluation Engine
```

其中最重要的是：

> **Span 是什么 → Attribute 怎么设计 → 怎么 Query → 怎么聚合 → 怎么形成 Evaluation**

这与 [W6 Agent Metadata 设计](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w6-memory-and-context.html) 是同一套思路——**先把数据规范化**——**再分析**。

## 二十、下一步：MCP/Skill Analytics V0.1

下一步直接拿 Phoenix 里真实的 `mcp__app__queryUserEnv` 数据，做 **"MCP/Skill Analytics V0.1"**：

```text
Phoenix UI 查询
   ↓
phoenix.Client().query_spans()
   ↓
输出 1 张表：
   所有 MCP/Skill 调用次数
   + 成功率
   + Avg/P95/P99
   + Agent 分布
```

**目标：把 Phoenix 用起来**——**而不只是看 Trace**。

## 写在最后

AI Agent 项目的 Evaluation Engine 不应该是"一上来就做的复杂 Dashboard"——**而是从 1 条 Span 开始**——**6 阶段逐步演进**——**每阶段都有可交付的工程指标**。

**最重要的不是"用什么工具"**——**而是"用什么数据模型"**——**Agent Metadata 是这个数据模型的核心**——**没有它，所有分析都建在沙滩上**。

**如果你也在做 AI Agent 监控**——**欢迎交流**——**我的邮箱 sunrong1990@126.com**。

—— Dave, 2026-08-28
