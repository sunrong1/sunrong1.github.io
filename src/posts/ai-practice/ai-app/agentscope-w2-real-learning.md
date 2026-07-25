---
icon: fire
date: 2026-07-21
update: 2026-07-31
categories:
  - AI 应用
tags:
  - AgentScope
  - 学习反思
  - 元认知
  - 真实学习
  - 自我打脸
  - 8 周公开承诺
  - reentrant
  - Q5 bug
star: true

author: Mr.Sun
---

# AgentScope 学习 W2：从"伪学习"到"真学习"的 6 天

> 上周我写了 [W1 总结：AgentScope 架构全景 + 核心类图](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w1-architecture.html)，那 4 张图看起来很专业——但**我自己一行 `_agent.py` 都没读过**。
>
> 本文是打脸 + 复盘 + 真实学习记录——**从 W1 重置日到 W2 周自检的完整 6 天**。

<!-- more -->

## 一、那个 21:11 的深夜

7-19 周日下午，我对着 4 份 AI 产出的架构文档，**突然意识到一件事**：

> **"如果我没有写笔记，就代表我没有学习。"**

听起来像废话，但 5 月底我做 [Vibe Coding 塔防游戏](https://sunrong.site/posts/ai-practice/vibe-coding-plantsgame.html) 时，**也是这个模式**——我让 AI 整理了 100+ 个架构决策，看起来"学了很多"，**实际没动手写一行**。

**ISTJ 的最大陷阱**：把"做笔记"当"在学"。笔记是副产物，真正学 = **读代码 + 脑子疼 + 问出 10 个为什么**。

于是 7-19 当天我做了 3 件事：
1. 把那 4 份文档**降级**为"学习地图"（标 ⚠️ 未经验证）
2. 新建 `notes/personal/`，**只写过程笔记**（乱、错、"我没懂"都可以）
3. 在 [LEARNING.md](https://github.com/sunrong1/agentscope/blob/learning-journal/LEARNING.md) 顶部加 "W1 重置" 公开声明

**这一刀砍下去，比我预想的疼**。但不开这一刀，8 周后我只会得到 **8 份 AI 整理 + 0 行真读的"假产出"**。

## 二、W2 真实学习数据（6 天）

```
W2-D1 (7-20 周一)  : 100 行 + 1 篇笔记
W2-D2 (7-21 周二)  : 145 行 + 3 篇笔记（含日反思）
W2-D3 (7-22 周三)  : 230 行 + 2 篇笔记
W2-D4 (7-23 周四)  : 371 行 + 4 篇笔记（**Q5 bug 怀疑**）
W2-D5 (7-24 周五)  : 352 行 + 3 篇笔记（**Q5 闭环 + issue 提交**）
W2-D6 (7-25 周六)  : 0 读 + 1 篇周自检 + 5 review 评分
─────────────────────────────────────────────
W2 累计            : 1198 行 + 14 篇笔记
_agent.py 进度     : 36.3% (1198/3289)
平均分            : 7.0 → 7.5 → 7.75 → 8.4 → 8.6
              ⬆ 每天涨，从未跌
上游贡献          : issue #2166 提交（Q5 真 bug）
```

> 数据来源：每个 commit 的 `git log` 范围 + `notes/personal/` 文件计数 + W2-D5 收尾自评。**不是 AI 算的，是 git 算的 + 自己评的**。

## 三、我真正"读懂"的 10 个点（不是 4 张图）

不是大而全的"架构全景"，是 **10 个具体的小点**——每一个都是**自己读代码才能感受到的**。**前 5 个是 W2 前半段，后 5 个是 W2 后半段**——**质量从"理解 API"升级到"找到 bug"**。

### A 组：W2 前半段（5 个"理解设计"）

#### 1. `TYPE_CHECKING` 是同一个循环依赖的两侧

```python
# middleware/_base.py:
if TYPE_CHECKING:
    from ..agent import Agent
    ...

# agent/_agent.py:
if TYPE_CHECKING:
    from ..middleware import MiddlewareBase
    ...
```

我之前以为这俩 `TYPE_CHECKING` 是"两个不同的 import 技巧"。**读完代码才发现**——它们**解决的是同一个循环依赖**（agent ↔ middleware 互相引用做类型提示）的**两侧**。

**架构师视角**：这种"对称引用"是框架设计里**很常见的模式**——知道它存在，下次看到类似代码你能秒懂。

#### 2. Agent 类是"中央协调器"

读了 95 行 import，我列出来：
- `state`（自己）
- `permission`（自己）
- `event`（自己）
- `middleware` / `tool` / `message`（能力）
- `model` / `workspace`（外部接口）

**8 个子系统，Agent 一个都不实现，只协调**。

#### 3. Event 类型遵循 "Start / Delta / End" 三件套

| 类别 | Start | Delta | End |
|---|---|---|---|
| Text | `TextBlockStartEvent` | `TextBlockDeltaEvent` | `TextBlockEndEvent` |
| Thinking | `ThinkingBlockStartEvent` | `ThinkingBlockDeltaEvent` | `ThinkingBlockEndEvent` |
| Tool Call | `ToolCallStartEvent` | `ToolCallDeltaEvent` | `ToolCallEndEvent` |

**这不是巧合，是有意设计**——流式协议的标准模式（SSE / WebSocket 也类似）。

#### 4. Middleware 链的 `next_handler` 是 Adapter 模式

```python
async def execute_chain(index=0, ...):
    if index >= len(self._compress_context_middlewares):
        await self._compress_context_impl(...)
    else:
        mw = self._compress_context_middlewares[index]
        async def next_handler(**kwargs):
            await execute_chain(index + 1, ...)
        await mw.on_compress_context(
            agent=self, input_kwargs=input_kwargs, next_handler=next_handler,
        )
```

**`next_handler` 包装 `execute_chain` 不是装饰**——是因为**签名不匹配**：
- `execute_chain(index, ...)` 内部用
- `next_handler(**kwargs)` 中间件用

**Adapter 模式的具体应用**——屏蔽 chain 内部状态（`index`），中间件只看到"调用 next 传 kwargs"。

#### 5. `if not self._compress_context_middlewares:` 是 Fast Path

**5 行代码省 100 行理解成本**——没中间件时根本不需要 `execute_chain` 整套基础设施。

---

### B 组：W2 后半段（5 个"找到 bug"）—— 质量跃升

#### 6. reentrant protocol 概念 ⭐ W2 最大洞察

W2-D4 读 `_reply_impl` 时，我看到 4 种 input 类型（`Msg` / `list[Msg]` / `UserConfirmResultEvent` / `UserInterruptEvent` / `ExternalExecutionResultEvent` / `None`）——**"为什么 6 种？"**

读到 HITL 流程时我**理解错了**——我说"是正常退出（暂时）"——**只答了症状**。

**Mavis 用比喻带我理解**——**HITL = 多步表单/软件安装向导**：

| 属性 | 多步表单 | AgentScope HITL |
|---|---|---|
| **State 持久化** | 填过的选项都记得 | `state.context` 留着 |
| **Resume point 明确** | "下一步"按钮 | 下次 input 必须是 Event 类型 |
| **Caller 可观测** | "等待中..."状态 | "Waiting for tool calls to be confirmed" |

**关键洞察**：
- 4 种 input **不是"用户输入"**——**是"恢复凭证"**（Resume credentials）
- **distributed system 必须 reentrant**——不 reentrant 不能 scale（线程被锁死）
- **这是 distributed system 的标准范式**——Google Cloud LRO、数据库 savepoint 都是同类

**为什么这个概念比 10 行代码都值**——**它解释了"为什么"，代码只是"是什么"**。

#### 7. 状态机视角 ⭐ Tool call 5 态转换

```
PENDING → ASKING → ALLOWED → (SUBMITTED) → FINISHED
                  ↓ DENY
                  ERROR
```

**3 类正交输入**（6 种 input 的根因）：**同步**（Msg/list[Msg]）/**异步**（3 种 Event）/**轮询**（None）。

**3 种结束状态 = 3 种责任归属**：
- **COMPLETED** = 自然完成（无副作用）
- **EXCEED_MAX_ITERS** = 自然限制（**可恢复**——state 留着）
- **INTERRUPTED** = 强制中断（**必须善后**——清理残留）

**架构师视角**：3 种状态 = 3 种"责任归属"——**很优雅**。

#### 8. Q5 真 bug 闭环 ⭐⭐ W2 最大成就

7-23 W2-D4 下午读 `_close_unfinished_tool_calls` 时，我**自己怀疑**：

```python
# src/agentscope/agent/_agent.py:705
if call_block.state != ToolCallState.ALLOWED:
    yield ToolResultStartEvent(...)
```

**这里只跳过 ALLOWED 状态——会不会漏掉 SUBMITTED 状态？**

**D 选项**（我给自己定的）：**不立即提 issue**——**先存草稿，W2 末验证**——**因为未经验证的 issue 会被 maintainer 直接关**。

7-24 W2-D5 读 `_execute_tool_call` 验证：

```python
# line 2071-2093
self._update_tool_call_state(ALLOWED)         # state → ALLOWED
yield ToolResultStartEvent(...)               # ← START emit 在 ALLOWED 状态

if tool.is_external_tool:
    self._update_tool_call_state(SUBMITTED)   # state → SUBMITTED
    yield RequireExternalExecutionEvent(...)
    return
```

**确认是 bug**——external tool 在 ALLOWED 时 emit START，**然后 state 转 SUBMITTED**。**当 SUBMITTED 进入 _close_unfinished_tool_calls 时，条件 `state != ALLOWED` 为 True，会重复 emit START**。

**修复方案**：
```python
# Before
if call_block.state != ToolCallState.ALLOWED:

# After
if call_block.state not in (ToolCallState.ALLOWED, ToolCallState.SUBMITTED):
```

**7-25 我把这个 issue 提交到了** [agentscope-ai/agentscope #2166](https://github.com/agentscope-ai/agentscope/issues/2166)。

**W2-D6 早上还修了一个尴尬事**——我的 commit message 里写了 "issue #2166"，导致 GitHub 自动在 issue timeline 关联了 3 个 commit（commit message 是中文，看着很 awkward）。**rebase 改了 3 个 commit 的 message**——去掉了引用——timeline 事件虽然不可变（commit 变 orphan），但未来 commit 不会再被关联。

**这个完整流程** = **工程师的真实工作方式**：**怀疑 → 验证 → 反馈 → 上游贡献**。**W2 学的最有价值的一件事**。

#### 9. 双模式响应 + block_ids 追踪

读 `_reasoning_impl` 时，我发现模型响应有 2 种（`AsyncGenerator[ChatResponse]` 流式 / `ChatResponse` 一次性）——**为什么框架支持 2 种？**

**根因**：**model API variability**——OpenAI/Anthropic SSE 类返回 async gen，简单 HTTP API 返回 ChatResponse。**AgentScope 不是"为了支持两种"**——**是被迫支持**——**因为底层 model API 不一样**。

```python
# block_ids 追踪
chunk 1: text_start     → 生成 block_id = "abc123"
chunk 2: text_delta "我" → 没有 block id，框架用 "abc123" 关联
chunk 3: text_delta "是" → 同上
chunk 4: text_end        → 框架发 TextBlockEndEvent(block_id="abc123")
```

**为什么显式追踪**——**流式 chunk 不总带 block id**（delta chunk 不带）——**框架必须记住"现在进行到哪个 block"**。

#### 10. fail fast vs silent corruption

```python
# _reasoning_impl line 1391-1398
if completed_response is None:
    raise RuntimeError("Model returned an empty streaming response...")
```

**AgentScope 选 fail fast**——**比 silent corruption 强 100 倍**。

| 策略 | 后果 |
|---|---|
| ❌ 返回空 | agent 继续跑后续步骤，**晚几轮后行为诡异**，**trace 不到根因** |
| ✅ 立即 raise | **stack trace 精准指向 model 调用**——**根因直接暴露** |

**架构师哲学**：**debuggability > cleverness**。

---

## 四、我对"学习"这件事的新认识

W2 这 6 天，**最大的收获不是 AgentScope**——是 **4 个关于"怎么学"的新认识**：

### 认识 1：学 = 看代码 + 问问题 + 答问题 + **自己发现不懂的东西**

W1 我以为"读完 = 学了"。W2 发现**读完 + 能回答"为什么这么设计" + 能自己发现不懂的东西** = 学了。

W2-D4 我**自己怀疑**出 Q5 bug——**这不是 AI 引导的，是我读代码时**自己觉得逻辑不通**。**这比答对 10 道引导题意义更大**——**它意味着我的学习模式从"被动答"转向"主动发现"**。

### 认识 2：3 档反馈方法论（不是"放水表扬"）

W2-D4 我开始用 3 档评分（**✅ 已掌握 / ⚠️ 浅 / ❌ 缺**）——之前我"放水"太多，每次说"对"——**Mavis 让我意识到这是学习杀手**——**让 ISTJ 觉得"懂了"，实际没懂**。

**新方法**：
- ✅ = 能解释 + 能应用
- ⚠️ = 知道是什么，不知道为什么
- ❌ = 不知道是什么

**应用到 W2-D5**：4 道题评分清晰，**没有"放水"**。**Q1 双模式响应我答错根因（症状 vs 解释）**——**Mavis 给了 ⚠️**——**我学到："描述现象 ≠ 解释原因"**。

### 认识 3：每天 ≤2 段阅读，比一天 8 小时轰炸强

W2-D4 我一天读 7 小时（371 行）——质量好但**累**。
W2-D5 我一天读 10.5 小时（352 行 + 收尾 + blog）——**最后 1.5 小时是真的在透支**。
W2-D6（今天）我**主动休息**——只写周自检 + 5 review——**大脑终于能沉淀 reentrant 概念了**。

**ISTJ 容易"再加一点"**——但**如果你已经做得很好了，再加 1 小时也不会做得更好**。

### 认识 4：贡献图不亮 ≠ 没学习

我花了一晚上折腾 GitHub 贡献图（改 default branch、设 git config），发现**配置全对，图还是不亮**。

**GitHub 改 default branch 后，贡献系统可能要 24-48h 同步**——这不是 bug，是他们缓存架构的设计。

**这教会我**：**别让工具的状态决定你对自己的判断**。**真正学没学，问自己 5 道题比看 GitHub 绿方块更准**。

---

## 五、SM-2 复习系统的第一份真数据

W2-D6 我对 5 个 due review 项做了诚实评分：

| Item | 分数 | 新 EF | 评估 |
|---|---|---|---|
| learning-commitment | 3 | 2.60 | 秒答（自己写的承诺，记得牢）|
| phase1-architecture | 1 | 2.36 | 4 层对，6 原语忘 |
| phase1-classes | 1 | 2.36 | 拼错 / 概念错 |
| phase1-sequences | 1 | 2.36 | 答的是通用概念，不是 AgentScope 特定 |
| phase1-distributed | 0 | 1.96 | 承认没读 |

**关键发现**：**4 份 Phase 1 文档（W1 期间 AI 生成的）80% 不记得**——**这正证明 W1 重置是对的**。

**自己写的承诺**记得 → **W2 真学习的内容**也会记得 → **W3-W7 之后** phase1 那些文档会自然答到 3 分。

**SM-2 算法现在知道** → **更频繁复习** → **真掌握**。

---

## 六、给同样在"伪学习"的人

如果你也：
- 看了大量 AI 整理的文档
- 收藏了 100+ 篇技术文章
- 写了 10+ 份学习笔记
- 但**说不出任何一个"我自己看代码发现的洞察"**

**那我们一样**——都在做"看起来很忙，实际没学"的局。

**停止借口，5 行代码读起**。**读不懂就写"读不懂"**。**问出"为什么"比读完重要 10 倍**。

**找到 1 个 bug，比读完 1 个模块强 10 倍**。

---

## 七、W3 预告（2026-07-27 开始）

W2 完成 Phase 1，W3 进入 Phase 2 第一个模块（**Agent 基类完结**）：

- `_inject_runtime_state` (line 991-1230, 240 行) - 之前 W2 没读完
- `_check_incoming_event` + `_handle_incoming_event` - HITL 关键路径
- `_handle_incoming_messages` - 输入分发
- `_call_model` + `_prepare_model_input` - model 适配层
- **Q5 reproduce 脚本** - 写 unit test 验证 issue #2166

**8 周 Sep 12 截止不变**——但**W2 之后我把目标改成"读懂 1 个核心类 + 2-3 个模块"**，而不是 W1 时定的不切实际的"5 大模块全精读"。

***
> **资源链接**
> - 📂 学习仓库：[github.com/sunrong1/agentscope](https://github.com/sunrong1/agentscope/tree/learning-journal) · 分支 `learning-journal`
> - 📋 公开承诺：[LEARNING.md](https://github.com/sunrong1/agentscope/blob/learning-journal/LEARNING.md)
> - 📝 真学习笔记：[`notes/personal/`](https://github.com/sunrong1/agentscope/tree/learning-journal/notes/personal)
> - 🔧 复习系统：[tools/review.py](https://github.com/sunrong1/agentscope/blob/learning-journal/tools/review.py)
> - 🐛 上游 issue：[#2166 Q5 bug](https://github.com/agentscope-ai/agentscope/issues/2166)
> - 📖 W1 总结（伪产出警告）：[W1 架构全景](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w1-architecture.html)
>
> —— Mr.Sun, 2026-07-25 · 真学习第 6 天（W2 周自检日）

***
## 📚 AgentScope 8 周学习系列

- 🎯 **[W1：架构全景 + 核心类图](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w1-architecture.html)** — 单一 Agent 类 + 6 原语 + 双层洋葱
- 🔧 **[配套工具：SM-2 复习系统](https://sunrong.site/posts/ai-practice/ai-app/sm2-review-system.html)** — 420 行 Python 的自适应复习
- 📝 **本篇：W2 真学习复盘**
- ⏭️ **[W3：Agent 模块深潜](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w3-agent-deep-dive.html)** — _agent.py 全部 3289 行读完
- ⏭️ **W3：Agent 基类完结**（即将开始）

**完整承诺**：[LEARNING.md](https://github.com/sunrong1/agentscope/blob/learning-journal/LEARNING.md) · 持续更新到 9-12
