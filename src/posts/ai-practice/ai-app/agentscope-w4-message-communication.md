---
icon: chat-alt-dots
date: 2026-08-06
update: 2026-08-07
categories:
  - AI 应用
tags:
  - AgentScope
  - 学习反思
  - 消息与通信
  - 真实学习
  - Block
  - Pydantic
  - 流式协议
  - Schema Cascade
star: true

author: Mr.Sun
---

# AgentScope 学习 W4：消息与通信——从 Block 到 Model Response

> 接 [W3 Agent 模块深潜](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w3-agent-deep-dive.html)：W3 读完 `_agent.py` 全部 3289 行——**agent 模块 100% 闭环**。W4 横向扩展——**消息与通信**——`message/` + `model/` 两个模块。

<!-- more -->

> **TL;DR**：W4 完成 4 段 1418 行 4 笔记——**8 大概念飞跃**：① Strategy Pattern for Block ② 同一生命周期两状态机（HITL 2.0） ③ 字段分组 = 访问模式分组 ④ Big Method OK if Cohesive ⑤ Factory > 继承 for role-only ⑥ Type-Aware Streaming Merge ⑦ **Schema Cascade**（3 actor 3 layer）⑧ **Validation Responsibility Delegation**（上游有→委托，没有→自己验）。**83% 胜率**——质量稳定 8.0+。

## 一、W4 vs W3

```
W3 (7-27 ~ 7-31) : 1303 行 / 11 笔记 — 纵向深潜 _agent.py
W4 (8-3 ~ 8-6)  : 1418 行 / 4 笔记  — 横向扩展 message + model
W4 平均质量: 8.0+/10 — 稳定
```

W3 是"深潜期"——W4 是"宽度扩张期"——**5 大模块横向**。

## 二、W4 完成的 4 段

| 段 | 文件 | 行数 | 答 | 强 |
|---|---|---|---|---|
| W4-D1 段 1 | `message/_block.py` | 227 | 3 | 3 |
| W4-D1 段 2 | `message/_base.py` Msg + 工厂 | 650 | 3 | 3 |
| W4-D3 | `model/_model_response.py` + `_model_usage.py` | 382 | 3 | 2 |
| W4-D4 | `model/_model_card.py` | 159 | 3 | 2 |
| **W4-D1 ~ D4 累计** | | **1418** | **12** | **10** |

**4 天 10 强**——**胜率 83%**——**W4 进度顺利**。

### 📑 8 大飞跃速查

| # | 飞跃 | 来源 | 一句话 |
|---|---|---|---|
| 1 | **Strategy Pattern for Block routing** | W4-D1 段 1 | 8 种 block = Union 表达，不是继承 |
| 2 | **Two State Machines for One Lifecycle** | W4-D1 段 1 | pre/post execution 状态机分离（HITL 2.0）|
| 3 | **Field Grouping = Access Pattern Grouping** | W4-D1 段 2 | 字段分组 = 消费者分组 |
| 4 | **Big Method OK if Cohesive** | W4-D1 段 2 | SRP = 1 个理由改，不 = 方法要短 |
| 5 | **Factory Function for Role-Only Variants** | W4-D1 段 2 | 角色型 variant 用 factory 不用 class |
| 6 | **Type-Aware Streaming Merge** | W4-D3 | 流式合并按 block type 决定策略 |
| 7 | **Schema Cascade** | W4-D4 | 3 actor 3 layer 互不耦合 |
| 8 | **Validation Responsibility Delegation** | W4-D4 | 上游有 → 委托，没有 → 自己验 |

## 三、8 大概念飞跃

### 飞跃 1: Strategy Pattern for Block routing (W4-D1 段 1)

**8 种 ContentBlock**——**全部用 Union Type 表示**——**而非继承**：

```python
ContentBlock = Union[
    TextBlock, ThinkingBlock, DataBlock,
    AudioBlock, ImageBlock, VideoBlock,
    ToolCallBlock, ToolResultBlock,
]
```

**架构师视角**：

> **"Discriminated Union > Inheritance for closed sets"**
> - 8 种 block 是"封闭集合"——**所有 block 类型都已确定**
> - **继承会强制共享父类属性**——**8 种 block 字段差异巨大**
> - **Union + Literal["text"/"thinking"/...] discriminator**——**type-safe + open extension**

**核心代码**（`_agent.py` 的 4 个 tool state machine）：

```python
# 同一状态机，本地 vs 远程执行路径
if is_local_tool:
    # ALLOWED → 直接执行
    self._execute_tool_call(call_block)
else:
    # ALLOWED → SUBMITTED → EXTERNAL_EXECUTION_RESULT
    self._emit_event(REQUIRE_EXTERNAL_EXECUTION)
```

**架构师视角**：

> **"Same state machine, different execution path"** = Strategy Pattern
> - **状态转移逻辑相同**（5 态 + 3 类正交输入）
> - **执行路径不同**（本地直接调 / 远程发事件）
> - **判断条件 = 工具配置**（不是运行时判断）

### 飞跃 2: Two State Machines for One Lifecycle (W4-D1 段 1)

**HITL 2.0 的 reentrant 协议**——**两个状态机管理一个生命周期**：

```
Pre-execution FSM:  ToolCallState (None → ALLOWED → ASKING → SUBMITTED)
Post-execution FSM: ToolResultState (None → RUNNING → SUCCEEDED/FAILED)
```

**两个 FSM 在 `_execute_tool_call` 里被同时操作**——`line 2070-2093` emit START event（state=ALLOWED）→ transition to SUBMITTED for external tools → `line 2054-2063` `_close_unfinished_tool_calls` only excludes ALLOWED。

**Bug 来源**：

> **"两个状态机之间的 transition 没考虑周全"**——**issue #2166 起源**
> - pre FSM 转 SUBMITTED 时
> - post FSM 不认识 SUBMITTED
> - 重复 emit START event

### 飞跃 3: Field Grouping = Access Pattern Grouping (W4-D1 段 2)

`Msg` 字段分 3 组——**不是装饰**——**有功能含义**：

| 组 | 问什么 | 消费者 |
|---|---|---|
| **Context** | "说了什么" | LLM |
| **Metadata** | "什么时候 / 多少 token" | 监控 |
| **Workflow** | "走到哪一步" | agent framework |

**架构师视角**：

> **"Field grouping = Access pattern grouping"**
> - 经常一起读 → 同一组
> - 经常一起写 → 同一组
> - 生命周期不同 → 不同组

**判断标准**：3 种不同的访问者 → 3 组。1 种访问者 → 1 组足够。

### 飞跃 4: Big Method OK if Cohesive (W4-D1 段 2)

`Msg.append_event` 一个方法 15+ case 分支——**W2-D2 学过"switch case 多"**——**这里违反 SRP 吗**？

**答案**：**不违反**——**1 个理由改变 = Event 协议变化**。

**判断标准**：

| 改一个 case 时 | 决定 |
|---|---|
| 其他 case 也要改 | 聚合（同一个理由）|
| 其他 case 不用改 | 拆分（多个理由）|

**架构师视角**：

> **"Big method is OK if cohesive"**（大方法如果内聚就行）
> - 所有 case 围绕"event → msg 状态变更"——**1 个核心**
> - 拆成 `_apply_text_event` / `_apply_tool_event` **反而破坏内聚**
> - **SRP 的"职责" = 抽象层级**——`append_event` 在 Event→Msg 抽象层

### 飞跃 5: Factory Function for Role-Only Variants (W4-D1 段 2)

`UserMsg` / `AssistantMsg` / `SystemMsg` 是 `def` 不是 `class`——**不是 OOP 的"次品"**——**是更高级的 Discriminated Union**：

```python
def UserMsg(name, content, ...) -> Msg:
    return Msg(name=name, content=..., role="user", ...)
```

**架构师视角**：

> **"Msg 已经用 role 字段做了 Discriminated Union"**
> - `role: Literal["user", "assistant", "system"]` 就是 discriminator
> - **"UserMsg" 不需要独立 class**——它就是 `Msg(role="user")`
> - **真正的"OO"是 Literal Type Union**——**不是继承**

**判断标准**：

| 子类形态 | 选择 |
|---|---|
| 有额外属性 | class 继承 |
| 只是不同 role | factory function |

**UserMsg 没额外属性**——**factory 完美**。

### 飞跃 6: Type-Aware Streaming Merge (W4-D3)

`ChatResponse` 5 个 append methods——**流式合并协议**——**按 block type 决定合并策略**：

| Block type | 合并策略 | 原理 |
|---|---|---|
| TextBlock | `text += delta` | 字符串 concat |
| ThinkingBlock | `thinking += delta` | 同上 |
| ToolCallBlock | `input += delta` | **JSON 字符串拼接**——**不是解析** |
| DataBlock (audio) | bytes concat | 字节流可拼接 |
| DataBlock (image/video) | **替换** | 独立资产 |
| DataBlock (类型不匹配) | **整块替换** | 完全不同 |

**流式协议 5 大设计点**：

1. **Chunk vs full** = `is_last: bool` 标志
2. **Block-level 累加** = `content: list[Block]`——每个 block 自己累加
3. **顺序保持** = append not replace（除 image）
4. **Usage 累加** = `usage.input_tokens += event.input_tokens`
5. **终止信号** = `is_last=True` + `finished_reason` 双信号

**架构师视角**：

> **"is_last is simplified FSM"**（简化状态机）
> - 2 态（is_last=False/True）+ 内容累积正交维度
> - 不是经典 FSM——是 boolean 终止 + 累积
> - **每种 block 各自的合并语义**

### 飞跃 7: Schema Cascade (W4-D4)

`ModelCard.from_yaml` 把 3 层 schema 合并——**3 个 actor 3 个 layer**：

| Layer | 角色 | 改什么 | 例子 |
|---|---|---|---|
| **基础层** | 开发者（Pydantic class）| **schema 定义** | "有哪些参数字段" |
| **自动层** | 框架（AgentScope）| **capability gating** | "这个模型能用 thinking 吗" |
| **覆盖层** | 用户（YAML）| **最终覆盖** | "我想要 max_tokens=4096" |

**3 大机制**：

```python
# 1. Auto-filter: 条件不满足 → pop
if "application/x-thinking" not in output_types:
    properties.pop("thinking_enable", None)

# 2. Auto-inject: 配置自动补全
if "max_tokens" in properties:
    properties["max_tokens"]["maximum"] = config["output_size"]

# 3. Parameter override: 简单 dict merge
properties[param_name] = {**properties[param_name], **override}
```

**架构师视角**：

> **"Schema Cascade"**（Schema 层叠）
> - 3 个 actor 互不耦合——改自动层不动基础层
> - **冲突时上层覆盖下层**——YAML 永远赢
> - 类比：CSS cascade / Git merge / 环境变量层叠

**3 个 actor 互不耦合的好处**：

| 角色 | 修改频率 | 影响范围 |
|---|---|---|
| 开发者 | 框架升级时 | 所有模型 |
| 框架 | 框架升级时 | 该 model type |
| 用户 | 改 YAML | 当前 model |

**没有 3 层**——**每改一处就要管全局**——**噩梦**。

### 飞跃 8: Validation Responsibility Delegation (W4-D4)

`ChatResponse` 用 `@dataclass`——`ModelCard` 用 `BaseModel`——**为什么**？

> **问：上游有 validator 吗？**
> - 有 → **委托给上游**——dataclass（ChatResponse）
> - 没有 → **必须自己验**——BaseModel（ModelCard）

| 数据源 | 上游 validator？| 选择 | 原因 |
|---|---|---|---|
| LLM API response | ✅ OpenAI/Anthropic SDK | dataclass | 委托——SDK 验过了 |
| **用户 YAML 配置** | ❌ **没有** | **BaseModel** | **自己验**——YAML 没人验 |
| HTTP request | ❌ | BaseModel | 自己验 |
| Database read | ❌ | BaseModel | defense in depth |

**架构师视角**：

> **"Pydantic 真正价值不是类型对**——**是业务约束"**
> - `name: str` —— 任何 str 都过
> - `status: Literal["active", "deprecated", "sunset"]` —— **必须 3 选 1**
> - `context_size: int = Field(gt=0)` —— **必须正数**——**dataclass 完全做不到**
> - **复杂配置必须 BaseModel**——**dataclass 不够用**

## 四、BaseModel 是什么

**Pydantic 的基础类**——**数据契约层**——**给数据类加了"运行时类型安全 + 序列化"**：

| 能力 | 例子 |
|---|---|
| **类型校验** | `age="30"` 自动转 int（如果可能），否则报错 |
| **默认值** | `age: int = 0` |
| **JSON schema** | `User.model_json_schema()` |
| **序列化** | `model_dump()` / `model_dump_json()` |
| **反序列化** | `model_validate()` / `model_validate_json()` |
| **字段验证器** | `@field_validator` / `@model_validator` |
| **序列化器** | `@field_serializer` |
| **Config** | `ConfigDict(extra="allow", use_enum_values=True)` |

### 字段 vs 类变量

```python
class MyModel(BaseModel):
    # ✅ 字段（type annotation）
    name: str
    age: int = 0
    
    # ✅ 类变量（无 type annotation）
    CONSTANT = "value"
    
    # ✅ 显式类变量（用 ClassVar）
    from typing import ClassVar
    DEFAULT_NAME: ClassVar[str] = "unknown"
```

**判断标准**：

| 写法 | 是什么 |
|---|---|
| `name: str` | 字段（Pydantic 管）|
| `age: int = 0` | 字段 + 默认值 |
| `name = "value"` | 类变量 |
| `x: ClassVar[int] = 0` | 显式类变量 |

**潜在陷阱**：

```python
class MyModel(BaseModel):
    cache = {}  # ← 类变量（所有实例共享！）

m1 = MyModel()
m1.cache["a"] = 1
print(m2.cache)  # {'a': 1} ← 意外！
```

**正确写法**：

```python
class MyModel(BaseModel):
    cache: dict = Field(default_factory=dict)  # ← 字段
```

## 五、3 答回顾

### Q1（Schema 合并 3 层）

**Q**：`from_yaml` 把 3 层 schema 合并——这叫什么模式？为什么分 3 层？

**A**：**Schema Cascade**——3 actor 3 layer 互不耦合。基础层 = schema 定义 / 自动层 = capability gating / 覆盖层 = user customization。冲突时上层覆盖下层（YAML 永远赢）。类比 CSS cascade / Git merge / 环境变量。

### Q2（filter vs inject 对称）

**Q**：auto-filter（条件不满足 → pop）和 auto-inject（条件满足 → set）——对称性在哪里？

**A**：**机制相同**：都是"条件触发的 mutation"。**方向不同**：filter = 拿掉 / inject = 加进来。类比 `add` vs `remove` / `push` vs `pop`。可以抽象成 `_apply_rule(properties, condition, mutation)`，但 AgentScope 没抽——**inline 写更清楚**——**"Duplication > Wrong Abstraction" 实战**。

### Q3（ModelCard 用 BaseModel 矛盾吗）

**Q**：ModelCard 是 YAML（外部数据）——按昨天"信任边界"应该不验证——但 ModelCard 用 BaseModel——矛盾吗？

**A**：不矛盾。**Validation Responsibility Delegation**：问"上游有 validator 吗？"。LLM API 响应 → SDK 验证 → 委托 → dataclass。YAML 配置 → 没人验证 → 自己验 → BaseModel。**Pydantic 真正价值不是类型**——**是业务约束**（`gt=0` / Literal / datetime）。

## 六、W4 反思

### 6.1 进度 vs 计划

W4 计划是 5 天模块横向——**W4-D1 ~ D4 完成 4 段**——**1418 行 + 4 笔记**——**进度的 80%**。

**5 段未完成**：
- W4-D2 (8-4)：空（实际是 W4-D1 段 2）
- W4-D5：候选 = `DictMixin` 9 行 / `model/__init__.py` 39 行 / **跳到 `memory/`**

### 6.2 学习方法复盘

**W4 节奏控制**：
- 每天 ≤ 2 reading sessions——**遵守**
- 9pm 君子约定——**遵守**
- 每段 1-3 答 + 评分——**100%**

**W4 质量稳定**：
- W3 5 天平均 8.48/10
- W4 4 天平均 8.0/10
- 胜率 83%（10 强 / 12 答）

### 6.3 跃升时刻

**3 个"啊哈"瞬间**：

1. **"Same state machine, different execution path"**——8 种 block 用 Union 表达——**这是 OOP 的高级形态**
2. **"Schema Cascade"**——3 actor 3 layer——**和 CSS / Git / 环境变量同源**
3. **"Validation Responsibility Delegation"**——昨天 Q1 的"信任边界"被今天升级——**"问上游有谁验"才是关键**

### 6.4 待深挖的

- `DictMixin` (9 行) 是什么——**W4-D5 段 1 候选**
- `parameter_class.model_json_schema()` Pydantic 怎么生成
- `model/__init__.py` 怎么导出 9 个 LLM provider
- `memory/` 模块入口——**W4-D5 段 2 候选**

## 七、累计战绩

| 维度 | W2 | W3 | W4 | 累计 |
|---|---|---|---|---|
| 行数 | 1198 | 1303 | 1418 | **3919** |
| 笔记 | 14 | 11 | 4 | **29** |
| 答 | 39 | 44 | 12 | **95** |
| 强 | 25 | 32 | 10 | **67** |
| 浅 | 11 | 9 | 2 | **22** |
| 缺 | 3 | 3 | 0 | **6** |
| **胜率** | 64% | 73% | **83%** | 71% |
| vs W2 目标 (750/5) | 160% | — | — | **522% / 580%** |

## 八、接下来

W4-D5 候选：
- `_utils/_mixin.py` (9 行) + `model/__init__.py` 收口
- **跳到 `memory/` 模块**（W4 计划的"消息与通信"宽度的下一站）
- 写 W4 周自检 + 复盘

**W5 (8-10) 计划**：工具与插件模块——`tool/` + `tracing/`。

## 参考

- [W2 真学习复盘](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w2-real-learning.html)
- [W3 Agent 模块深潜](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w3-agent-deep-dive.html)
- [AgentScope 上游 issue #2166（Q5 bug）](https://github.com/agentscope-ai/agentscope/issues/2166)
- 读过的代码：
  - `src/agentscope/message/_block.py` (227 行)
  - `src/agentscope/message/_base.py` (671 行)
  - `src/agentscope/model/_model_response.py` (350 行)
  - `src/agentscope/model/_model_usage.py` (32 行)
  - `src/agentscope/model/_model_card.py` (159 行)
