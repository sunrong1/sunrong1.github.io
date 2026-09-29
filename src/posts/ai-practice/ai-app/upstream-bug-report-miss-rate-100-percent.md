---
title: 我给 AgentScope 报了 5 个"bug"，只有 1 个值得修
icon: shield
date: 2026-09-29
update: 2026-09-29
categories:
  - AI 实践
tags:
  - 开源协作
  - AgentScope
  - Code Review
  - 致良知
  - 工程方法论
author: Mr.Sun
star: true
---
<!-- more -->

# 我给 AgentScope 报了 5 个"bug"，只有 1 个值得修

> 今天下午，我用 GLM-5.2 帮我分析了 AgentScope 上游代码里的 5 个"疑似 bug"。
>
> 结果：**5 个里面，2 个是设计不是 bug，2 个是真 bug 但不值得修，只有 1 个我提了 PR。**
>
> 这篇笔记复盘整个过程，提炼出 5 条"报 bug 之前必须做的检查"。**每一条都能省掉一次被 maintainer 拒的 PR。**

***

## 📊 先看战果

| # | 疑似 bug | 裁定 | 我做了什么 |
|---|---|---|---|
| 1 | `UserInterruptEvent` 空闲时无终止事件 | ❌ **不是 bug** | 找到反例，推翻 |
| 2 | `CancelledError` 被吞没 | ⚠️ **诊断对，方案错** | 读了 PR body，推翻方案 |
| 3 | 瞬时 I/O 错误驱逐缓存 | ✅ **真 bug，但价值低** | 提了 PR（已 push） |
| 4 | MCP `_cached_tools` 残留 | ✅ **真 bug，但撞车** | 放弃，搜到 2 个 PR 在修 |
| 5 | `set_runtime_headers` 无 `await` | ❌ **不是 bug** | 查到子类覆写，推翻 |

**命中率：1/5。**

如果你不看这篇，直接按 GLM 的分析提 5 个 PR，会被拒 4 个 —— 而其中 2 个还带着"看起来很有道理"的错误方案。

***

## 🔍 Case 1：`UserInterruptEvent` 空闲时 0 事件

### GLM 的诊断

> 空闲中断时 `end_event` 保持 `None`，`finally` 块的 `if end_event is not None` 守卫导致不 emit `ReplyEndEvent`。这是**隐式契约被破坏** —— "agent 内部无需清理" ≠ "协议层无需发信号"。

诊断很漂亮。`task.cancelled() == False` 这种观察很专业。

### 我的验证

跑了一个探针脚本，三个 case：

```python
# CASE 1 - IDLE agent + reply_stream(UserInterruptEvent)
events = []
async for evt in agent.reply_stream(UserInterruptEvent(reply_id="r-1")):
    events.append(type(evt).__name__)
# → events = [], count = 0
```

看起来确实"有问题"。但我去翻了测试：

```python
# tests/agent_interrupt_test.py:847
async def test_interrupt_event_on_idle_agent_is_noop(self) -> None:
    """No parked HITL → ``UserInterruptEvent`` yields nothing and
    leaves state untouched."""
    self.assertListEqual(events, [])   # ← 明确断言 0 事件
```

**这不是遗漏，是写死的契约。** 代码注释也逐字写着：

```python
# Parked-interrupt short-circuit: only signal an INTERRUPTED
# end when there is actual HITL work to close; otherwise the
# session is effectively idle and the call is a silent no-op.
```

### 决定性一击：API 契约文档

```python
# src/agentscope/app/_router/_schema/_session.py:266
- If the session is **parked** on HITL / external execution, a
  resume trigger carrying a UserInterruptEvent is enqueued...
- If the session is **idle**, the call is a no-op.   # ← 逐字写明
```

**"idle = no-op" 是公开 API 文档。** 改它需要 maintainer 同意，不是 bug fix。

### 决定性反驳：GLM 自己说的"隐式契约"在别处也"被破坏"

GLM 的核心论点是"`if end_event is not None` 是隐式契约，上游漏一条就破协议"。

**那我去枚举所有走 `end_event=None` 的路径。** 结果在隔壁 60 行找到了第二条：

```python
# _agent.py:1142
case Exit(exit_msg=exit_msg, exit_events=exit_events):
    if not exit_events:
        # Parked on HITL: the reply is not finished, so
        # the continuation protocol doesn't apply
        yield exit_msg
        return          # ← end_event 也是 None！
```

实测（正常 user 消息 → agent 走到 HITL 挂起）：

```
events = ['ReplyStartEvent', 'ModelCallStartEvent',
          'ModelCallEndEvent', 'RequireUserConfirmEvent']
has ReplyEndEvent? False        # ← 同样不发
```

**如果"不发 ReplyEndEvent = 破协议"成立，那 AgentScope 的 HITL 核心功能本身就是坏的。** 这显然不成立。

**结论：不是 bug。** 如果按 GLM 的方案改，会污染前端 —— 用户点"停止"时 agent 空闲，前端会收到一条假的 interruption_message。

***

## 🔍 Case 2：`CancelledError` 被吞没

### GLM 的诊断（这次真的对了）

> `_base.py:219` 的 `except asyncio.CancelledError: return ChatResponse(INTERRUPTED)` —— `return` 而非 `raise`，`task.cancel()` 在 model 层变成 no-op。

**这个观察是对的。** 我实测验证：

```
EXPERIMENT 1 - 当前行为（吞掉 → INTERRUPTED）
  task 状态 = 正常完成 (task.cancelled()=False)     ← 问题真实
  拿到 3 个 response:
    content=['Par']              finished_reason=completed
    content=['tial']             finished_reason=completed
    content=['Par', 'tial']      finished_reason=interrupted   ← partial 保住了

EXPERIMENT 2 - GLM fix 后（直接传播）
  task 状态 = CancelledError 传播 (task.cancelled()=True)     ← 协议正确了
  拿到 0 个 chunk   ← 'Par' + 'tial' 全部丢失                ← 功能坏了
```

**GLM 的 fix 确实修复了 `task.cancelled()=False`，但代价是丢掉已生成的部分输出。**

### 我的验证：先查 PR 历史

按我自己的方法论，第一步应该是：

```bash
git log --all --oneline | grep -i "interrupt"
```

结果：

```
e92acef4 fix(agent): propagate cancellation after interruption cleanup (#2650)
```

**上游上周刚 merge 过一个同类 fix。** 打开 PR body：

> "`ReActConfig(interruption_raise_cancelled_error=True)` is intended to propagate `asyncio.CancelledError` after AgentScope finishes handling an interruption. During active model or tool execution, however, `ChatModelBase` and `Toolkit` **first normalize task cancellation into an interrupted response** or tool result **so that partial output and tool state can be preserved**."

**那段 `except CancelledError: return ChatResponse(INTERRUPTED)` 就是 "normalize into an interrupted response" 的实现。** 不是疏漏，是有意的三段式翻译：

```
task.cancel()
    ↓
[Model]  except CancelledError → return ChatResponse(INTERRUPTED)
         ↑ 目的：保住 acc_text / acc_thinking / acc_tool_calls
    ↓
[Agent]  if finished_reason == INTERRUPTED:
             raise asyncio.CancelledError()        ← _agent.py:1203
         ↑ 注释逐字写："Handled by the CancelledError branch below"
    ↓
[Agent]  except CancelledError → end_event = INTERRUPTED
                                → _close_unfinished_tool_calls()
                                → yield end_event + fallback msg
         ↑ 目的：graceful cleanup（保住 partial output）
```

**GLM 说的"agent 层已有正确处理"—— 对，但那段处理的前提就是 model 层返回 `INTERRUPTED` 标记。** 删掉 model 层的 `except`，`_agent.py:1194-1203` 立刻变成死代码。

根需求 #1806 是 maintainer DavdGao 提的，标题就写着 *"support agent interruption with **graceful context and tool state handling**"*。

**结论：诊断对，方案错。** 提了会被 PR body 直接反驳。

***

## 🔍 Case 3：瞬时 I/O 错误驱逐缓存条目（唯一提 PR 的）

### 诊断

```python
# _state.py:69-83
if mtime is None:
    try:
        mtime = await aiofiles.os.path.getmtime(file_path)
    except Exception:
        mtime = None              # ← 瞬时错误伪装成"文件不存在"

self.read_file_cache.remove(entry)   # ← 先删
if mtime != entry.updated_at:        # ← None != float 恒为 True
    return None                      # ← 条目已永久丢失
```

`None != 1.0` → `True`，无条件驱逐。**这是真 bug。**

### 但我自己的 fix 也引入了新 bug

我按方案实现后，测试立刻 fail：

```
test_deleted_file_still_evicts_cache_entry
  AssertionError: 1 != 0
```

**原因**：`FileNotFoundError` 也是 `Exception` 子类 → 文件真被删时也不驱逐 → 缓存里堆僵尸条目。

修正：

```python
except FileNotFoundError:
    mtime = None          # 永久：文件真没了 → fall through 驱逐
except Exception:
    return None           # 瞬时：权限竞争/网络抖动 → 保留条目 + miss
```

**第二个测试是专门为了 catch 我自己的 bug 加的。** 这比第一个测试更有价值。

### 然后用户提出了一个我没想到的质疑

> "如果你返回为 None 了后，后面会继续读取 file，反而会造成缓存冗余。"

**这个质疑很有价值 —— 但只对了一半。**

我实测了完整路径：

```
########## main 原始行为 ##########
2. 瞬时 I/O 错误 → Edit（不 Read）
   Edit state : error
   Edit msg   : "To edit a file, you must first read it using the Read tool."
   缓存条目数 : 0

3. 关键验证 — Read 能否自愈？
   Read state : running
   缓存条目数 : 0
   >>> ❌ Read 也没能自愈 —— cache_file 同样需要 getmtime

########## 我的 fix ##########
3. 关键验证 — Read 能否自愈？
   Read state : running
   缓存条目数 : 1
   >>> ✅ Read 自愈成功
```

**关键发现**：`cache_file` 的第一件事也是 `getmtime`：

```python
if mtime is None:
    try:
        mtime = await aiofiles.os.path.getmtime(file_path)
    except Exception:
        # Cannot get mtime, skip caching
        return                      # ← 直接返回，不缓存
```

**用户假设"Read 会自愈"只在 I/O 已恢复时成立。** 如果 I/O 是持续性的（网络盘掉线），`cache_file` 同样拿不到 mtime → 跳过缓存 → **Read 也无法自愈**。

**最终我把严重度从 medium 降到了 low-medium，但保留了 PR。** 这次讨论让我修正了自己的判断 —— 这比一开始判断对更有价值。

***

## 🔍 Case 4：MCP `_cached_tools` 残留（真 bug，但撞车）

### 诊断

```python
# close() 的 finally
finally:
    self._client = None
    self._stack = None
    self._session = None
    self._is_connected = False
    # ← 没有 _cached_tools = None
```

典型的状态泄漏。实测确认：

```
B - close() → connect() 成功 → 拿旧工具
  重连后 _cached_tools = ['v1_tool', 'removed_tool']
  假设服务器已下架 removed_tool
  >>> get_tool('removed_tool') 成功返回 MCPTool    ← ⚠️ 返回已不存在的工具
```

**真 bug，我准备提 PR。** 但按方法论第一步"先搜重复"：

```
$ curl .../search/issues?q=repo:agentscope-ai/agentscope+_cached_tools+stale
  #2913 [open] PR fix(mcp): rediscover tool descriptors after a stateful 
  #2898 [open] IS [Bug]: MCPClient.get_tool() reuses previous-connection 
  #2912 [open] PR fix(mcp): invalidate cached tools after successful reco
```

**一个 issue + 两个 PR，同一天，三个人在做同一件事。** 两个 PR 的注入点都是 `connect()` 成功后：

```python
await self._session.initialize()
+self._cached_tools = None    # ← 两个 PR 都是这一行
self._is_connected = True
```

**我放弃了这个 PR。** 三个 PR 竞争一个 2-3 行的改动，maintainer 会烦。

**我的唯一增量（`_static_headers` 残留）实测后风险很低** —— `set_runtime_headers` 只在 `self._http_client is not None` 时才读它，而 `close()` 后 `_http_client` 已经被清空了。

***

## 🔍 Case 5：`set_runtime_headers` 无 `await`（不是 bug）

### 诊断

```python
async def set_runtime_headers(self, headers: dict[str, str]) -> None:
    ...
    # 函数体内 0 个 await，全是同步赋值和校验
```

**诊断对。"无 await 的 async def"确实是审查信号** —— 这条我完全同意。

### 但改 sync 会破坏 LSP

```bash
$ grep -rn "def set_runtime_headers" src/
src/agentscope/mcp/_mcp_client.py:260:    async def set_runtime_headers(
src/agentscope/workspace/_gateway_client.py:310:    async def set_runtime_headers(
```

**子类覆写了，而且真的有 `await`**：

```python
# _gateway_client.py:334
status, body = await self._gateway.exec_request(
    "PUT", f"/mcps/{self.name}/runtime-headers", ...
)
```

workspace 客户端要发 HTTP PUT 到 gateway —— 那是真的异步。

**如果父类改 sync，子类收到的是一个没人 await 的 coroutine → `self._runtime_headers` 永远不更新 → 静默失效。**

而且这个 `async` 是 **maintainer qbc2016 在 PR #2456 里亲手加的**，同一个 PR 里给两个实现保证了签名一致。

**GLM 说的"async def 增加事件循环调度开销"—— 实测量级是 `~100ns`，而一次 HTTP 请求是 `~10ms`，比例 0.001%。可以忽略。**

**结论：不是 bug，是有意的 API 一致性设计。** 唯一站得住的批评是 docstring 没解释为什么 async。

***

## 🎯 5 条"报 bug 之前必须做的检查"

这才是今天真正的产出。

### ① 先搜重复 —— 一个 bug 一天能有三个 PR

```bash
# 用符号名搜，比用文字搜准得多
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/search/issues?q=repo:OWNER/REPO+SYMBOL_NAME&per_page=10"
```

AgentScope 现在很活跃。Case 4 里，我准备动手时才发现已经有人做完并提了两个 PR。

**关键词要用代码符号（`_cached_tools`），不要用自然语言描述（"缓存没清"）。**

### ② 先读引入这个代码的 PR body

```bash
git log --all --oneline -S "SYMBOL_OR_STRING" -- path/to/file.py
git show <commit> -- path/to/file.py
# 然后去 GitHub 读 PR body
```

**Case 2 的教训**：`#2650` 的 body 里逐字写着 "first normalize task cancellation into an interrupted response so that partial output ... can be preserved"。**这段话直接决定了我的 fix 是错的。**

**代码能看出"做了什么"，PR body 能看出"为什么这么做"。** 只看代码会漏掉后者。

### ③ 找反例 —— 你的"隐式契约"在别处也成立吗

Case 1 里 GLM 说"`if end_event is not None` 是隐式契约，上游漏一条就破协议"。

**验证方法：枚举所有走这条路径的出口。** 我在隔壁 60 行找到了第二条 —— 正常 HITL 挂起也是 `end_event=None`。

**如果你的理论在核心业务路径上同样"被违反"，那理论就是错的。**

```bash
grep -n "return\|break\|raise" src/agentscope/agent/_agent.py | head -30
```

### ④ 查子类覆写 —— 改签名前必须确认

```bash
grep -rn "def 方法名" src/ tests/
```

**Case 5 的教训**：改 `async` → `sync` 看着是"清理代码"，实际会 break 子类。**一条 grep 就能避免。**

这条对所有公开方法都适用，尤其是：
- 有 LSP 约束的（父类改了子类必须跟）
- 有协议约束的（`__aenter__` / `__aexit__` / `__aiter__`）

### ⑤ 跑真实调用路径，不要只测孤立函数

Case 3 里我以为"Read 能自愈"，用户质疑后我才发现 `cache_file` 也依赖同一个 `getmtime`。

**测试要看的是"调用方拿到 miss 之后做什么"，不是"miss 本身"：**

```python
# 找出所有调用点
grep -rn "get_cache(" src/agentscope/tool/

# 逐个看：miss 之后是重读、还是直接报错？
# _read.py:    miss → 重读 + 重新缓存（能自愈）
# _edit.py:    miss → 返回 ERROR（不能自愈）
```

**"miss" 的后果完全取决于调用方。** 只看 `get_cache` 本身会判断错严重度。

***

## 💭 更深一层：为什么 AI 辅助的 bug 分析这么容易错

今天 5 个案例，GLM 的诊断能力其实很强：

| 案例 | GLM 的诊断 | 裁定 |
|---|---|---|
| 1 | ✅ 找到 `finally` 的条件守卫 | ❌ 但有反例 |
| 2 | ✅ `task.cancelled()=False` | ❌ 但方案错 |
| 3 | ✅ 完整 bug 链条 | ✅ 真 bug |
| 4 | ✅ 完整 bug 链条 | ✅ 真 bug |
| 5 | ✅ 函数体确实无 await | ❌ 但有子类 |

**5 次都"看起来很有道理"，5 次都需要外部信息才能推翻。**

**AI 的分析是"代码内推理"，而 bug 的真伪往往取决于"代码外的事实"：**

| 需要什么 | 只能从哪来 |
|---|---|
| 这个设计是有意的吗 | PR body / issue 讨论 |
| 有人已经修了吗 | GitHub search |
| 别人怎么被这个 bug 坑过 | issue timeline |
| 子类有没有覆写 | grep |
| 真实后果是什么 | 跑一遍调用链 |

**这正好对应我 11 年工程经验里最值钱的那条心法：**

> **"心 × 行"里的"行"，是代码之外的验证动作。**
>
> **AI 帮你把"心"（代码内推理）做到极致，但"行"必须自己走。**

今天这 5 个 case，如果我不去 `curl` GitHub API、不去 `git log -S`、不去 `grep` 子类、不去跑探针脚本 —— **全都会提错 PR。**

***

## 🛠️ 一份可复用的报 bug 检查清单

在 AgentScope 上跑了一天，沉淀成这样：

```bash
# ── Step 0: 假设有 bug（但先别动手）──
git checkout origin/main && git checkout -b fix/xxx origin/main

# ── Step 1: 搜重复（用符号名）──
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/search/issues?q=repo:OWNER/REPO+SYMBOL&per_page=10" \
  | python3 -c "import json,sys; [print(f\"#{i['number']} {i['title']}\") 
                        for i in json.load(sys.stdin).get('items',[])]"

# ── Step 2: 查这段代码的来历 ──
git log --all --oneline -S "SYMBOL" -- path/to/file.py
# → 找到 commit 后，去 GitHub 读 PR body

# ── Step 3: 找反例（枚举同类路径）──
grep -n "if GUARD\|return None" path/to/file.py
# → 同样的模式在别处也成立吗？如果成立，理论可能是错的

# ── Step 4: 查子类覆写（改签名前）──
grep -rn "def 方法名" src/ tests/

# ── Step 5: 跑真实调用路径 ──
grep -rn "被调方法(" src/ | grep -v "def "
# → 逐个看 miss/exception 之后调用方做了什么

# ── Step 6: 写复现脚本（跑一遍再提）──
# 至少覆盖：正常路径 / 边界路径 / 异常路径

# ── Step 7: 改代码 + 加回归测试 ──
# 第二个测试用来 catch 你自己的 bug

# ── Step 8: 用项目指定的 lint 版本跑（重要！）──
# pre-commit 用的什么版本，你 lint 就用什么版本
```

***

## 🎯 最后

今天最实在的收获不是"我找到了 5 个 bug"，而是：

> **"看起来像 bug" 和 "是 bug" 之间，隔着五道验证。**
>
> **这五道验证，没有一道是读代码能得到的。**

提交给上游的 PR 数量不重要，**被拒的 PR 数量才重要** —— 因为每一个被拒的 PR 都在消耗你在社区里的可信度。

**先跑完那五道验证，再按回车。**

***

## 相关阅读

- [AgentScope 8 周学习笔记](/posts/ai-practice/) —— 我是怎么从使用者变成 contributor 的
- [开源贡献的第一次 PR](/posts/ai-practice/) —— 从 Issue 到 merge 的完整流程
