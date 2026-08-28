---
icon: brain
date: 2026-08-26
update: 2026-08-26
categories:
  - AI 应用
tags:
  - AgentScope
  - 学习反思
  - 元认知
  - 真实学习
  - W6
  - 记忆与上下文
  - 状态管理
  - 长期记忆
  - Context Engineering
  - 学习方法论
star: true

author: Mr.Sun
---

# AgentScope 学习 W6：记忆与上下文——3 段联动学完 5500 行（整体架构视角）

> 接 [W4 消息与通信](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w4-message-communication.html) + [W4 学习总结](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w4-learning-summary.html)：前两篇写了"我学到了什么" + "我是怎么学的"。**W6 这篇写"我切换了学习模式"**——**从"逐行精读"切到"整体架构"**——**3 段联动理解 5500 行**——**3 大跨段 insight**——**实战对应**。

<!-- more -->

> **TL;DR**：W6 = 记忆与上下文。**3 段联动** = 段 1 数据层（state 372 行） + 段 2 行为层（3 个 memory 实现 ~3700 行） + 段 3 调度层（compress 流程 ~700 行）。**核心 insight**："段1存，段2用，段3压，3 段 = 完整 Agent 记忆-上下文"。本文讲 **"为什么切模式"** + **"3 段整体架构"** + **"3 大跨段 insight"** + **"AI Agent 项目实战对应"** + **"W6 自评 50% 强率暴露的盲点"**。

## 一、为什么 W6 切到"整体架构"模式

W2-W5 我用的是"逐行 + Q&A"模式——每段 200-700 行 + 3-4 个细节问题 + 3 档反馈（强/浅/缺）。**这种模式在"读 1 个文件"时极有效**——**但 W6 跨 5+ 个文件 + 5500 行时失灵了**。

**失灵时刻**：

> 我读完 `state/_state.py` 前 200 行时，问了 4 个细节问题（双限制 LRU / mtime vs hash / list vs dict / silent failure）。**每个都答得"浅"**——**user 反馈**："问题有点多了，我现在需要理解整体架构和设计，不是一点点细节"。

**这句话打醒了我**——**W2-W5 的"细抠"在 1 个文件时是优势**——**在跨文件时是负担**。

**W6 模式切换**：

| 维度 | W2-W5 模式 | W6 模式 |
|---|---|---|
| 焦点 | 单文件内部 | 跨文件关系 |
| 问题 | 3-4 个细节 Q | 1-2 个整体 Q |
| 反馈 | 强/浅/缺 (细节) | 强/浅/缺 (架构) |
| 输出 | 4-6 笔记/段 | 1 大笔记/段 |
| 适合 | 200-700 行 | 1000+ 行 |

**核心心法**："**先骨架后血肉**"——W2-W5 是"先血肉"（逐行）——W6 是"先骨架"（架构）——两者互补。

## 二、段 1：state/_state.py 整体架构（372 行）

### 2.1 一张图全览

```
state/_state.py (372 行)
│
├─ 1️⃣ Value Object 层
│   └─ ReadCacheEntry (L23-29)  — 缓存的"行数据"
│
├─ 2️⃣ Context 层（4 个隔离的子状态）
│   ├─ ToolContext (L32-141)       — 工具缓存（双限制 LRU）
│   ├─ TaskContext (L144-148)      — 任务列表
│   ├─ ReplyContext (L151-175)     — 单次回复元数据
│   └─ (PermissionContext 外部)    — 权限控制
│
├─ 3️⃣ Container 层（AgentState 根容器）
│   └─ AgentState (L178-372)
│       ├─ 自身字段: session_id, summary, context
│       ├─ 4 个子 context
│       ├─ middle_context (跨轮)
│       └─ 操作 API: append_context, tool call queries
│
└─ 4️⃣ 兼容性层（双层 backward compat）
    ├─ model_validator (L195-210)   — 老 state.json 自动迁移
    └─ property+setter (L212-232)   — 老 API 字段转发
```

### 2.2 三大核心 insight

#### Insight 1.1：Field Grouping 模式

**不是一个大 object 装所有状态**——**是 4 个独立的 Context**：

| Context | 职责 | 类比 |
|---|---|---|
| `ToolContext` | 工具缓存 | "工具的抽屉" |
| `TaskContext` | 任务列表 | "待办清单" |
| `ReplyContext` | 单次回复元数据 | "当前对话回合" |
| `PermissionContext` | 权限控制 | "操作白名单" |

**为什么这样设计？** 三点：
- **隔离**：tool 缓存爆了不影响 task 列表
- **可序列化**：每个 context 可单独存/加载
- **可替换**：未来换 tool 缓存实现 = 只改 ToolContext

**与 W4 飞跃 #3 (Field Grouping) 同源**——**W4 我发现这是个"模式"**——**W6 在 state 模块看到实战**。

#### Insight 1.2：Bounded Cache Pattern

`ToolContext` 是 W6 段 1 的"完整教学案例"：

```
双限制 LRU 缓存 = 数量 + 字节
├─ max_cache_files=100        — 防止"小文件过多"
├─ max_cache_bytes=25000 KB   — 防止"单文件过大"
├─ mtime 校验                — 不读文件，性能 O(1)
├─ silent failure            — 缓存失败不阻塞 agent
└─ clean_file_cache          — 显式清理接口
```

**4 个 trade-off**：
- **双限制 vs 单限制** = 数量 + 字节互补
- **mtime vs content hash** = 性能 O(1) vs 正确性 O(n)
- **silent failure vs raise** = Robustness ≠ Strictness
- **list vs dict** = Pydantic 限制 + LRU 语义天然

**这是"如何在 Pydantic BaseModel 里设计生产级缓存"的完整范本**。

#### Insight 1.3：Backward Compat 双层设计

```
兼容性层
├─ 数据层：model_validator (L195-210) — 老 state.json 自动升级
└─ API 层：property+setter (L212-232) — 老代码调用不报错
```

**这是个非常优雅的设计**：
- **数据迁移**：`reply_id`, `cur_iter` 顶层字段 → `reply_context.reply_id`, `reply_context.cur_iter` 嵌套
- **API 兼容**：用户老代码 `state.reply_id` 通过 `@property` 转发，**仍能工作**
- **框架承诺**："不 breaking change"——**这是 AgentScope 2.0 对所有用户的承诺**

## 三、段 2：3 个 memory 实现整体对比（~3700 行）

### 3.1 一张图全览

```
src/agentscope/middleware/_longterm_memory/
│
├─ _mem0/ (1180 行)                    ← AI Agent 项目在用
│   ├─ _middleware.py (741)
│   ├─ _tools.py (270)                 — search_memory + add_memory
│   ├─ _agentscope_adapter.py (439)    — Msg ↔ Mem0 格式
│   └─ _utils.py (76)
│
├─ _reme/ (1042 行)
│   ├─ _middleware.py (552)            — 嵌入式 ReMe app
│   ├─ _tools.py (182)                 — memory_search（无 add）
│   ├─ _config.py (376)
│   └─ _utils.py (104)
│
└─ _agentic_memory/ (953 行)
    └─ _middleware.py (953)            — 文件系统 + Read/Write
```

### 3.2 三大核心 insight

#### Insight 2.1：Middleware 模式 = "可插拔记忆策略"

```
agent = Agent(
    ...,
    middleware=[
        Mem0Middleware(...),       # 选 1
        # ReMeMiddleware(...),     # 或
        # AgenticMemoryMiddleware(...),  # 或
    ]
)
```

**3 个实现可互换**——**"开闭原则"的体现**——**对扩展开放，对修改封闭**。

#### Insight 2.2：3 种 Hook 组合 = 3 种"记忆调度"

| Hook 组合 | 调度模式 | 性能 | 实时性 |
|---|---|---|---|
| `on_reply` only | 同步 | ⚠️ 阻塞 | 🟢 高 |
| `on_reply + on_reasoning` | 并发 | ✅ 0 latency | 🟡 best-effort |
| `on_system_prompt + on_reasoning` | 懒加载 | ✅ 极快 | 🟡 异步 hint |

**为什么 `_reme` + `_agentic_memory` 都用 `on_reasoning`？** —— **避免前向 latency**——**检索放后台**——**框架级并发优化**。

#### Insight 2.3：Tool 数量 = 框架"自动化"反向指标

| 实现 | Tool | 哲学 |
|---|---|---|
| `_mem0` | 2（search + add）| **半自动**（agent 主动 add）|
| `_reme` | 1（search only）| **全自动**（LLM 提取）|
| `_agentic_memory` | 0（用 Read/Write）| **全手动**（agent 自己写 .md）|

**这是个反直觉的 insight**：**Tool 越少 = 框架越自动化**——**因为更多事在 middleware 内部完成**。

### 3.3 选型决策树

```
你的项目需要什么？
│
├─ 跨实例 + 多用户 + 企业级
│   └─ ✅ _mem0（AI Agent 项目选的就是这个）
│
├─ 单机 + 自动整理 + 零运维
│   └─ ✅ _reme
│
├─ 隐私优先 + 完全可控 + 零依赖
│   └─ ✅ _agentic_memory
│
└─ 性能优先（避免前向 latency）
    └─ ✅ _reme 或 _agentic_memory（on_reasoning 并发）
```

## 四、段 3：context 压缩 / summary（~700 行）

### 4.1 一张图全览

```
src/agentscope/agent/
├─ _config.py
│   └─ ContextConfig (L51)
│       ├─ trigger_ratio=0.8 (PR #2396 改 le=0.9)
│       ├─ reserve_ratio=0.1
│       └─ compression_prompt (默认模板)
│
└─ _agent.py
    ├─ compress_context (L354)         — 公开 API
    └─ _compress_context_impl (L410)  — 5 阶段压缩流程
        ├─ L431: _limit_context_images
        ├─ L435: count_tokens
        ├─ L438: 触发判断
        ├─ L468: _split_context_for_compression
        ├─ L494-520: 构建压缩 prompt
        ├─ L524-535: structured tool schema
        ├─ L553: model.generate_structured_output
        ├─ L565-589: 回退机制
        └─ L616-668: _apply_change
```

### 4.2 5 阶段压缩流程

```
阶段 1: 触发判断
  ├─ _limit_context_images(cfg)        — 限图
  ├─ count_tokens(**kwargs)             — 算当前 token
  └─ if tokens < trigger_ratio × context_size → return（不压缩）

阶段 2: 分割 context
  ├─ _split_context_for_compression(reserve_ratio × context_size, tools)
  ├─ 输出: msgs_to_compress + msgs_to_reserve
  └─ 回退: reserve_ratio 太大 → 重试 ratio=0

阶段 3: 构建压缩 prompt
  ├─ msgs_system = [SystemMsg(...), UserMsg(summary) if exists]
  ├─ + msgs_to_compress
  ├─ + instruction_msgs (可选 hint)
  └─ + UserMsg(compression_prompt)

阶段 4: 调用 LLM 生成 summary
  ├─ tool schema: generate_structured_output
  ├─ model.generate_structured_output(messages, structured_model=summary_schema)
  └─ 回退: 上下文超长 → 删旧 context → 重试

阶段 5: 应用变更
  ├─ new_summary = summary_template.format(**res.content)
  ├─ offloader（可选）→ 存到外部
  ├─ _clear_unreserved_read_cache
  └─ state.summary = new_summary
     state.context = msgs_to_reserve
```

### 4.3 三大核心 insight

#### Insight 3.1：双 Ratio = "压缩的两个边界"

| 字段 | 含义 | 默认 | 你的 AI Agent 项目 | 作用 |
|---|---|---|---|---|
| `trigger_ratio` | **超过**此比例触发 | 0.8 | **0.7** | 早压缩 = 省 token |
| `reserve_ratio` | **保留**此比例不压缩 | 0.1 | 0.1 | 留新近 context |

**PR #2396 修复**：`lt=0.9` → `le=0.9` —— 现在可以用 0.9 触发 = "极晚压缩"。

**AI Agent 项目为什么 0.7？** 早期触发 = 避免 context 满 = 给 LLM 留足响应空间 = **买保险**（不是"提升效率"）。

#### Insight 3.2：3 层回退机制 = Robustness 实战

| 回退 | 触发 | 行为 |
|---|---|---|
| L1 | `len(msgs_to_compress) == 0` | reserve_ratio 太大 → 降 ratio=0 重试 |
| L2 | `compression_tokens > context_size` | 删旧 context（最旧开始删）|
| L3 | LLM 异常 | 保留旧 summary + 加 truncation 提示 |

**与 W5 三大方法论完全对应**：
- **Robustness ≠ Strictness** —— 3 层回退保证不阻塞 agent
- **Speed > Perfect Accuracy** —— LLM 失败就降级到 truncation
- **Concurrency = parallelism + isolation** —— `_apply_change` 用 `asyncio.shield` 保护

#### Insight 3.3：Structured Output = 强约束 summary

```python
res = await self.model.generate_structured_output(
    messages=messages,
    structured_model=cfg.summary_schema,  ← Pydantic schema
)
```

**为什么用 structured output 不用 free-form text**？
- ✅ 强约束（字段化 todo/decisions/open_questions）
- ✅ 可解析（`summary_template.format(**res.content)`）
- ✅ 质量稳定（不像 free-form 每次格式都不同）

**与 W4 飞跃 #4 (Validation Delegation) 同源**——**"结构化输出 = 工具化"是 AgentScope 整体哲学**。

## 五、跨段串联：3 段完整闭环

```
┌──────────────────────────────────────────────────────────┐
│  W6 = 记忆与上下文 = 数据层 + 行为层 + 调度层 3 段联动      │
└──────────────────────────────────────────────────────────┘

   段 1 (数据)              段 2 (行为)              段 3 (调度)
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ state 模块   │         │ memory 模块 │         │ compress 模块│
│             │         │             │         │             │
│ - summary   │←────────│ 检索注入    │←────────│ trigger 触发 │
│ - context   │←────────│ context 追加 │←────────│ reserve 保留 │
│ - middle_   │         │             │         │ summary 写入 │
│   context   │         │             │         │ state.summary│
└─────────────┘         └─────────────┘         └─────────────┘
        ↓                       ↓                       ↓
    "数据"                  "行为"                   "调度"
   (Context)              (Middleware)            (compress_context)
```

**3 段不是"3 个并列主题"**——**是"运行时 3 个时刻"**：
- **启动时** = 看段 1（数据准备好了吗）
- **context 满** = 看段 3（什么时候压）
- **用户问过去** = 看段 2（记忆怎么用）

## 六、AI Agent 项目实战对应

我 H1 2026 的 9 个核心 Skill / 5 个生产在跑 / 月调用 100+ 次——**对应的就是这 3 段**：

| H1 2026 绩效说 | 框架实际 |
|---|---|
| "9 个核心 Skill，5 个生产在跑" | `ToolContext` + `_mem0` 工具调用 |
| "引入 Mem0 方案" | `_mem0/_middleware.py` (741 行) |
| "记忆系统" | `_mem0` 维护 `user_id` + `agent_id` 双 key |
| "月调用 100+ 次" | `_mem0` on_reply hook 自动写 |
| "5 层部门 ST 演示" | compress_context 公开 API |
| "H1 完成 AgentScope 2.0 端到端 MVP" | 3 段 = MVP 全栈 |

**关键对应**：
- **AI Agent 项目 `trigger_ratio = 0.7`**（vs default 0.8） = **段 3 双 Ratio 配置**
- **AI Agent 项目选 `_mem0`** = **段 2 选型决策**
- **AI Agent 项目 9 Skill 调用 ToolContext** = **段 1 ToolContext 实战**

**3 段不是"读懂"**——**3 段是"AI Agent 项目实际跑起来"的 3 个组件**——**这才是"真懂"的标准**。

## 七、W6 自评：50% 强率暴露的盲点

W6 段 1+2+3 完成后，我用 4 个 Q 测试自己：

| Q | 主题 | 评分 | 评语 |
|---|---|---|---|
| Q1 | state 兼容性 | ✅✅ 强 | 答对 3 行 + 1 行没说（差 1 步满分）|
| Q2 | AI Agent 项目 选型复盘 | ⚠️ 浅 | "分阶段"对了但理由浅 |
| Q3 | trigger_ratio 0.7 trade-off | ⚠️ 浅 | **逻辑反了**（短 context → 早压缩 = 错）|
| Q4 | 3 段闭环 | ✅✅ 强 | 21 字精炼到位 |

**强率 50%**——**比 W2-W5 的 77% 低**——**说明整体架构题比细节题更看 trade-off 思维**。

### 7.1 暴露的盲点

**Q3 的盲点最值得反思**：
- 我回答"上下文比较短，早触发压缩，可以提升运算效率"——**逻辑反了**
- **正确逻辑**：上下文长 → 早触发（防止 overflow），上下文短 → 晚触发（节省 cost）
- 我的真实理由应该是："**复杂 Skill 调用，context 增长快，担心 overflow**"——**这是 0.7 的合理 trade-off**
- **不是"提升效率"** = **是"买保险"**

**盲点类别**：
- ✅ **结构识别**（3 段关系）= 强项（ISTJ 优势）
- ✅ **代码细节**（行号 + 字段名）= 强项（W2-W5 训练到位）
- ⚠️ **trade-off 推理**（为什么这样设计）= **待提升**
- ✅ **30 字内压缩** = 强项（能抓住本质）

### 7.2 给同行的反思

**学源码"读懂" ≠ "能讲"**——**真正读懂要回答"为什么"**——**而不只是"是什么"**——**整体架构题更看"为什么"**——**W2-W5 的"逐行 Q&A"在该类问题上不够**。

**补强方式**：
1. **每段问 1-2 个"为什么这样设计"**——而不是"这段代码什么意思"
2. **每段问 1 个"什么场景用"**——把代码映射到业务
3. **每段问 1 个"替代方案"**——为什么不用 X 而用 Y

## 八、跨 W 引用

| W6 设计 | 对应之前 |
|---|---|
| 4 个独立 Context | W4 飞跃 #3 Field Grouping |
| 双限制 LRU 淘汰 | W4 飞跃 #5 Factory |
| mtime vs content hash | W5 三大方法论 Speed > Perfect Accuracy |
| silent failure | W5 三大方法论 Robustness ≠ Strictness |
| backward compat 双层 | W3 系统级思考（保护用户）|
| Middleware 模式 = 策略可插拔 | W4 飞跃 #3 Field Grouping（同源）|
| on_reasoning 并发 | W5 三大方法论 Concurrency = parallelism + isolation |
| 双 Ratio + 3 层回退 | W5 三大方法论（Robustness + Speed + Concurrency）|
| Structured Output | W4 段 2 飞跃（工具化 structured output）|

**W6 不是"新东西"**——**W6 是"之前方法的实战 + 跨段串联"**——**这正是 8 周 AgentScope 深潜的真正价值**。

## 九、W6 收尾心法

> **段 1 收尾**："4 Context + Container + Compat" + "ToolContext 双限制 LRU 教学案例"
> **段 2 收尾**："3 种哲学 = 3 种自动化等级" + "Tool 数量 = 反向指标" + "on_reasoning = 性能关键"
> **段 3 收尾**："双 Ratio 边界 + 3 层回退 + Structured Output 强约束"
>
> **跨段收尾**："**段1存，段2用，段3压，三段 = 完整 Agent 记忆-上下文**"

**1 句话记住 W6**：

> **"W6 = 记忆与上下文 = 数据层 + 行为层 + 调度层 3 段联动"**

## 十、接下来：W7 分布式部署

W6 完成，**接下来 W7 = 分布式部署**（distributed / multi-agent / scheduler）——**8 周计划 7/8 已过**——**W7-W8 收官**——**终极 PR + 复盘**。

具体计划：
- **W7-D1 段 1**: scheduler 模块（`_manager/_scheduler/`）
- **W7-D1 段 2**: app 部署 + 多 agent 通信
- **W7-D2 段 1**: workspace pool（PR #1755 新功能）
- **W8**: 收官 + 终极 PR + 复盘

**继续 W7 整体架构模式**——**W6 验证有效**。

---

## 📊 W6 累计数据

| 累计 | 行数 | 笔记 | 强率 |
|---|---|---|---|
| W2-W5 | 6103 | 36 | 77% |
| W6 段 1+2+3 | ~5500 | 3 笔记 | 50% |
| **总计** | **11600** | **39** | **历史最高** |

**3 个新笔记**：
- `notes/personal/2026-08-24-state-整体架构.md`
- `notes/personal/2026-08-26-memory-3-implementations.md`
- `notes/personal/2026-08-26-W6-D1-整体架构与记忆压缩.md`

---

**写在最后**

W6 给我最大的反思是：**"学源码"不止"读代码"**——**更是"读懂设计"**——**更是"能讲清为什么"**。

如果你也在读 AgentScope 2.0 源码，欢迎 [W4 学习总结](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w4-learning-summary.html) + [W4 8 大飞跃](https://sunrong.site/posts/ai-practice/ai-app/agentscope-w4-message-communication.html) 一起看——**W2-W5 的"逐行 + Q&A" + W6 的"整体架构" = 完整方法论**。

W7 见。

—— Dave, 2026-08-26
