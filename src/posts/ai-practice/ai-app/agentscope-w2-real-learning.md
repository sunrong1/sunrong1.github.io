---
icon: fire
date: 2026-07-21
update: 2026-07-21
categories:
  - AI 应用
tags:
  - AgentScope
  - 学习反思
  - 元认知
  - 真实学习
  - 自我打脸
  - 8 周公开承诺
star: true

author: Mr.Sun
---

# AgentScope 学习 W2：从"伪学习"到"真学习"的 5 天

> 上周我写了 [W1 总结：AgentScope 架构全景 + 核心类图](https://sunrong.site/posts/ai-practice/agentscope-w1-architecture.html)，那 4 张图看起来很专业——但**我自己一行 `_agent.py` 都没读过**。
>
> 本文是打脸 + 复盘 + 真实学习记录。

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

## 二、W2 真实学习数据（5 天）

```
W2-D1 (7-20 Mon)  : 100 行 + 1 篇笔记
W2-D2 (7-21 Tue)  : 145 行 + 3 篇笔记（含日反思）
─────────────────────────────────
W2 累计           : 245 行 + 4 篇笔记
_agent.py 进度    : 11.7% (340/2910)
```

> 数据来源：每个 commit 的 `git log` 范围 + `notes/personal/` 文件计数。**不是 AI 算的，是 git 算的**。

## 三、这 340 行代码，我真正"读懂"了什么

不是 4 张大图，是 **5 个具体的小点**——每一个都是从前一个无法读出来，只有自己读代码才能感受到的。

### 1. `TYPE_CHECKING` 是同一个循环依赖的两侧

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

### 2. Agent 类是"中央协调器"

读了 95 行 import，我列出来：
- `state`（自己）
- `permission`（自己）
- `event`（自己）
- `middleware` / `tool` / `message`（能力）
- `model` / `workspace`（外部接口）

**8 个子系统，Agent 一个都不实现，只协调**。

**这跟我们之前 W1 那张"4 层架构图"想说的是一回事**——但**那是我让 AI 画的，这张是我自己看 import 推出来的**。**层级完全不同**。

### 3. Event 类型遵循 "Start / Delta / End" 三件套

读 50 行 event imports 时，我注意到一个规律：

| 类别 | Start | Delta | End |
|---|---|---|---|
| Text | `TextBlockStartEvent` | `TextBlockDeltaEvent` | `TextBlockEndEvent` |
| Thinking | `ThinkingBlockStartEvent` | `ThinkingBlockDeltaEvent` | `ThinkingBlockEndEvent` |
| Tool Call | `ToolCallStartEvent` | `ToolCallDeltaEvent` | `ToolCallEndEvent` |

**这不是巧合，是有意设计**——流式协议的标准模式（SSE / WebSocket 也类似）。

**AI 整理的 W1 文档里没写这个**。**只有读 import 列表 + 自己做归类才看得到**。

### 4. Middleware 链的 `next_handler` 是 Adapter 模式

```python
async def execute_chain(index=0, ...) -> None:
    if index >= len(self._compress_context_middlewares):
        await self._compress_context_impl(...)
    else:
        mw = self._compress_context_middlewares[index]
        ...
        async def next_handler(**kwargs: Any) -> None:
            await execute_chain(index + 1, ...)
        await mw.on_compress_context(
            agent=self,
            input_kwargs=input_kwargs,
            next_handler=next_handler,
        )
```

**`next_handler` 包装 `execute_chain` 不是装饰**——是因为**签名不匹配**：
- `execute_chain(index, ...)` 内部用
- `next_handler(**kwargs)` 中间件用

**Adapter 模式的具体应用**——屏蔽 chain 内部状态（`index`），中间件只看到"调用 next 传 kwargs"。

### 5. `if not self._compress_context_middlewares:` 是 Fast Path

第一次读到这里，我以为是"性能优化"。再读一遍发现是 **"可读性 + 性能双赢"**：
- 没中间件时，根本不需要 `execute_chain` 整套基础设施
- 跳过它 = 少创建 1 个嵌套函数 + 少 1 次 list 长度比较 + 少 1 次 `next_handler` 闭包
- **代码可读性也更好**——一眼能看出"无中间件时的快路径"

**这种"5 行代码省 100 行理解成本"的小习惯，是看大量代码才能养成的**。

## 四、我对"学习"这件事的新认识

W2 这 5 天，**最大的收获不是 AgentScope**——是 **3 个关于"怎么学"的新认识**：

### 认识 1：学 ≠ 看代码。学 = 看代码 + 问问题 + 答问题 + 自问自答

W1 我以为"读完 = 学了"。W2 发现**读完 + 能回答"为什么这么设计" + 能自己发现不懂的东西** = 学了。

今天我**自己主动问了 1 个问题**（"闭包是什么"）——这不是 AI 引导的，是我**自己发现不懂时主动问的**。

**这比答对 6 道引导题意义更大**——它意味着我的学习模式从"被动答"转向"主动问"。

### 认识 2：每天 ≤2 段阅读，比一天 8 小时轰炸强

W2-D1 我一天读 195 行——质量一般（问题答得粗）。
W2-D2 我分 2 段读 145 行——**质量明显更好**（自问问题 + Facade vs Adapter 区分到位）。

**ISTJ 容易"再加一点"**——但**如果你已经做得很好了，再加 1 小时也不会做得更好**。

### 认识 3：贡献图不亮 ≠ 没学习

我花了一晚上折腾 GitHub 贡献图（改 default branch、设 git config），发现**配置全对，图还是不亮**。

**GitHub 改 default branch 后，贡献系统可能要 24-48h 同步**——这不是 bug，是他们缓存架构的设计。

**这教会我**：**别让工具的状态决定你对自己的判断**。**真正学没学，问自己 5 道题**比看 GitHub 绿方块更准。

## 五、3 个本周末要做的事

W2-D6 (7-25 周六) + W2-D7 (7-26 周日) 是自由日 + 周自检：

1. **重读自己的 4 篇 personal 笔记**——看哪些是真懂了，哪些是糊弄过去的
2. **把 5 个"读懂"的小点升级为可分享版**——这一篇 blog 就是雏形
3. **W3 进入 `_agent.py:340-500`**——`_compress_context_impl` 完整 + `_reply` 公开方法

**8 周 Sep 12 截止不变**——但**W2 之后我把目标改成"读懂 1 个核心类 + 2-3 个模块"**，而不是 W1 时定的不切实际的"5 大模块全精读"。

## 六、给同样在"伪学习"的人

如果你也：
- 看了大量 AI 整理的文档
- 收藏了 100+ 篇技术文章
- 写了 10+ 份学习笔记
- 但**说不出任何一个"我自己看代码发现的洞察"**

**那我们一样**——都在做"看起来很忙，实际没学"的局。

**停止借口，5 行代码读起**。**读不懂就写"读不懂"**。**问出"为什么"比读完重要 10 倍**。

**8 周后见，朋友们**。**这次是真的见**。

***
> **资源链接**
> - 📂 学习仓库：[github.com/sunrong1/agentscope](https://github.com/sunrong1/agentscope/tree/learning-journal) · 分支 `learning-journal`
> - 📋 公开承诺：[LEARNING.md](https://github.com/sunrong1/agentscope/blob/learning-journal/LEARNING.md)
> - 📝 真学习笔记：[`notes/personal/`](https://github.com/sunrong1/agentscope/tree/learning-journal/notes/personal)
> - 🔧 复习系统：[tools/review.py](https://github.com/sunrong1/agentscope/blob/learning-journal/tools/review.py)
> - 📖 W1 总结（伪产出警告）：[W1 架构全景](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w1-architecture.html)
>
> —— Mr.Sun, 2026-07-21 · 真学习第 5 天

***
## 📚 AgentScope 8 周学习系列

- 🎯 **[W1：架构全景 + 核心类图](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w1-architecture.html)** — 单一 Agent 类 + 6 原语 + 双层洋葱
- 🔧 **[配套工具：SM-2 复习系统](https://sunrong.site/posts/ai-practice/ai-app/sm2-review-system.html)** — 420 行 Python 的自适应复习
- 📝 **本篇：W2 真学习复盘**（你正在读）

**完整承诺**：[LEARNING.md](https://github.com/sunrong1/agentscope/blob/learning-journal/LEARNING.md) · 持续更新到 9-12
