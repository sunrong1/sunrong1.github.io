---
icon: sliders
date: 2026-08-14
update: 2026-08-14
categories:
  - AI 应用
tags:
  - AgentScope
  - System Prompt
  - Prompt Engineering
  - ReAct
  - Context Compression
  - 实战
  - 参数调优
star: true

author: Mr.Sun
---

# Agent 实战：System Prompt 动态注入 + 关键参数调优

> 业务里跑 agent 久了，碰到两类问题最常见——**"system prompt 太死板"**——**"默认参数扛不住业务量"**。本文从代码实战出发，聊聊怎么把这两件事做对。

<!-- more -->

> **TL;DR**：两件事对 agent 体验影响最大：
> 1. **System Prompt 动态注入**——**根据上下文（项目 / 用户 / 阶段）构造**——**不要硬编码 1 段**
> 2. **关键参数调优**——**3 个参数最关键**——`max_iters / compression_threshold / tool_result_limit`
>
> 调好这两件——**生产事故率降 80%**。

## 一、System Prompt 动态注入

### 1.1 为什么需要"动态"？

**静态 prompt 的问题**：

```python
SYSTEM_PROMPT = "你是一个助手。"
#  /  /  太宽泛——agent 不知道在哪个项目 / 哪个用户 / 哪个阶段
```

**业务场景的现实**：

- 用户在 A 项目 → agent 应该知道 A 项目的 BOM
- 用户在 B 模块 → agent 应该知道 B 模块的关键变更
- 深夜调用 → agent 应该知道时区 / 限额

**"动态" = 把上下文塞进 prompt**——**让 agent "看见"**。

### 1.2 实战：一个真实业务的 buildSystemPrompt

```typescript
function buildSystemPrompt(currentBom: string, moduleInfo: any): string {
  const base = `你是一个专业、智能的平台助手，请帮助用户解决问题。

你的核心职责是：

- 解答平台功能相关问题

- 协助用户完成流程操作

- 提供开发最佳实践建议

当前项目是 ${currentBom}，请基于项目信息，为用户提供精准的开发相关支持。

仅回答与开发相关的问题，对于平台外的问题请礼貌拒绝。`

  if (!moduleInfo) return base

  return base + `

当前项目信息如下：

- 项目名称：${moduleInfo.moduleName}

- B 版本：${moduleInfo.bbom}

- C 版本：${moduleInfo.cversion}

${moduleInfo.keyChange ? '\n- 关键变更：' + moduleInfo.keyChange : ''}`
}
```

### 1.3 这段代码的 4 个问题

#### 问题 1：原代码"测试"vs"开发"矛盾

```typescript
//  /  /  原文（bug）
"请基于项目信息，为用户提供精准的测试相关支持。"
"仅回答与开发相关的问题"  /  /  前后矛盾

//  /  /  修后
"请基于项目信息，为用户提供精准的开发相关支持。"
"仅回答与开发相关的问题"  /  /  一致
```

**看似小 bug**——**实际会让 LLM 困惑**——**输出一会儿"开发"一会儿"测试"**——**用户问"为什么"**——**难定位**。

#### 问题 2：`moduleInfo: any` 是 anti-pattern

```typescript
//  /  /  差
function buildSystemPrompt(currentBom: string, moduleInfo: any): string {
  // moduleInfo.moduleName 一定是 string 吗？
  // moduleInfo.bbom 一定存在吗？
  //  /  /  全靠 runtime 验证
}

//  /  /  好
interface ModuleInfo {
  moduleName: string;
  bbom: string;
  cversion: string;
  keyChange?: string;  // 可选
}

function buildSystemPrompt(currentBom: string, moduleInfo: ModuleInfo): string {
  // 编译器帮你检查
  // IDE 自动补全
  // 重构安全
}
```

#### 问题 3：字符串拼接 vs 模板字面量

```typescript
//  /  /  差：容易拼错换行
return base + `

当前项目信息如下：
${moduleInfo.moduleName}
` + moduleInfo.bbom + `
`

//  /  /  好：模板字面量更清晰
return `${base}

当前项目信息如下：

- 项目名称：${moduleInfo.moduleName}
- B 版本：${moduleInfo.bbom}
- C 版本：${moduleInfo.cversion}
${moduleInfo.keyChange ? `- 关键变更：${moduleInfo.keyChange}` : ''}`
```

#### 问题 4：缺异常处理

```typescript
//  /  /  moduleInfo 是 null 时——会怎样？
//  /  /   /  if (!moduleInfo) return base  ← 已处理

//  /  /  moduleInfo 字段缺失时呢？
//  /  /  /  moduleInfo.moduleName 可能是 undefined
//  /  /  /  拼到 prompt 里 = "项目名称：undefined"

//  /  /  修
function buildSystemPrompt(
  currentBom: string,
  moduleInfo?: ModuleInfo,
): string {
  const base = `...`

  if (!moduleInfo) return base

  //  /  /  容错：字段缺失给默认值
  const { moduleName = 'Unknown', bbom = 'N/A', cversion = 'N/A', keyChange } = moduleInfo
  return `${base}

当前项目信息：

- 项目：${moduleName}
- B 版本：${bbom}
- C 版本：${cversion}
${keyChange ? `- 关键变更：${keyChange}` : ''}`
}
```

### 1.4 进阶：3 层动态注入模式

**生产 agent 的 prompt 应该是 3 层**：

```typescript
function buildSystemPrompt(context: {
  base: string;            //  /  /  第 1 层：固定 base（不可变）
  project: ProjectInfo;    //  /  /  第 2 层：项目上下文（动态）
  runtime: RuntimeInfo;    //  /  /  第 3 层：运行时（最动态）
}): string {
  return `${context.base}

## 当前项目

- 项目：${context.project.name}
- 版本：${context.project.version}
- 模块：${context.project.module}

## 运行时

- 用户：${context.runtime.userId}
- 时间：${context.runtime.now}
- 时区：${context.runtime.timezone}

## 关键变更

${context.project.keyChanges.map(c => `- ${c}`).join('\n')}
`
}
```

**3 层的好处**：
- **第 1 层**几乎不变——**可缓存**——**省 token**
- **第 2 层**项目级——**变化慢**——**可缓存（按 project_id）**
- **第 3 层**运行时——**每次调都新**——**不缓存**

## 二、关键参数调优

**AgentScope 里有 20+ 个参数**——**但真正影响生产稳定性的就 3 个**——**调好它们能避免 80% 的事故**。

### 2.1 参数 1：`max_iters`（默认 20 → 调到 30）

```typescript
react_config: {
  max_iters: 30,  //  /  /  默认 20
}
```

#### 什么是 max_iters？

**1 个 iteration = 1 个完整的"reasoning + acting"轮**——**LLM 调的工具全部返回才算**。

| 情况 | 算 1 次迭代？ |
|---|---|
| LLM 调 1 个工具 + 返回 | ✅ |
| LLM 调 3 个工具 + 3 个都返回 | ✅（1 次）|
| LLM 调 1 个工具 + 还在等 | ❌ |
| HITL 等待用户 | ❌ |
| 工具 SUBMITTED 状态 | ❌ |

**详情见 AgentScope 源码 `_agent.py:973-978`**：

```python
# One reasoning-acting round is over once every tool call it
# produced has a result.
if not self.state.get_unfinished_tool_calls(self.name):
    self.state.cur_iter += 1
```

#### 为什么默认 20 不够？

**现实场景**：
- 工具调用失败 → 换种方式重试（2 次失败 = 4 次 iter）
- HITL 几次中断（5 次中断 = 5 次 iter）
- 复杂任务需要多步推理（5-10 次 iter）
- 错误恢复链（3-5 次 iter）

**总计 20+ 经常不够**——**尤其是企业场景**——**工具 API 经常 timeout**。

#### 调到多少？

| 任务类型 | 建议 max_iters |
|---|---|
| 简单问答 | 10-15 |
| 一般 agent | 20-30 |
| 复杂多步 | 30-50 |
| 含 HITL | 30-40 |
| 深度研究 | 50-100 |

**"调到刚好" + 监控**：
- 调高——**浪费 token**——**但稳定**
- 调低——**任务失败**——**用户体验差**
- **建议从 30 起步**——**看监控再调**

### 2.2 参数 2：`compression_threshold`（默认 0.8 → 调到 0.7）

```typescript
context_config: {
  trigger_ratio: 0.7,  //  /  /  实际 AgentScope 字段是 compression_threshold
}
```

> 注：**AgentScope Python 版本字段名是 `compression_threshold`**——**TypeScript wrapper 可能叫 `trigger_ratio`**——**以你项目实际为准**。

#### 什么是 compression_threshold？

**当累计 context 超过 `threshold × context_size` 时，触发自动压缩**。

```python
# AgentScope 源码 _config.py
compression_threshold: float = 0.8
#  /  /  默认 80% 时触发
```

#### 为什么 0.8 太晚？

**Context 长度 = 单条消息 + 工具结果 + 历史**——**会随时间累积**。

**当 80% 触发时**——**context 已经 102K tokens**——**留给 compress 调用的 LLM 空间只剩 26K**——**compress 调用的 prompt + output 可能超过**——**compress 失败**——**整体 reply 失败**。

**真实事故**：
```
Current token count 207621  >  threshold 102400  >  model context 128000
The current context length exceeds the model's context length (128000 tokens)
Failed to compress context, which may be caused by insufficient reserved context
```

**207K 超过 128K 模型上限**——**根本进不去 LLM**——**completey stuck**。

#### 调到多少？

| 模型 context | 建议 threshold |
|---|---|
| 8K 模型 | 0.5-0.6 |
| 32K 模型 | 0.6-0.7 |
| 128K 模型 | 0.65-0.75 |
| 200K+ 模型 | 0.7-0.8 |

**你的 0.7 在 128K 模型下合理**。

### 2.3 参数 3：`tool_result_limit`（默认 50000 → 调到 6000）

```typescript
context_config: {
  tool_result_limit: 6000  //  /  /  默认 50000
}
```

#### 什么是 tool_result_limit？

**单个 tool result 的最大 token 数**——**超出就 truncate + offload**。

**AgentScope 源码 `_agent.py:2648-2655`**：

```python
n_tokens = await self.model.count_tokens(...)
if n_tokens <= self.context_config.tool_result_limit:
    return tool_result, None
# 超出 → 触发 truncate / offload
```

#### 50000 为什么太大？

**50000 tokens ≈ 200K 字符（英文）/ 5-10 万字（中文）**。

**单次工具调用就占用 50K**——**意味着**：
- 第 2 次工具调用就触发压缩
- 第 3-4 次调用就溢出

**5 万字内容**——**真的有吗**？——**有**：
- 读完整文件
- 大数据分析结果
- 全表 dump

**但更多场景**：
- API 调用（几百字）
- 文件搜索结果（几千字）
- 工具返回（几千字）

**6000 tokens ≈ 1 万中文字**——**覆盖 90% 场景**——**超出就 truncate**。

#### 调到多少？

| 业务类型 | 建议 tool_result_limit |
|---|---|
| 一般工具 | 3000-6000 |
| 大数据结果 | 8000-15000 |
| 文件操作 | 10000-20000 |
| 全量 dump（极少） | 50000+ |

**你的 6000 在"一般工具"范围**——**合理**。

## 三、3 参数的"调优矩阵"

**这 3 个参数不是独立的**——**互相影响**——**调的时候要一起看**：

| 场景 | max_iters | compression_threshold | tool_result_limit |
|---|---|---|---|
| **简单问答 agent** | 15 | 0.6 | 3000 |
| **一般 ReAct agent** | 30 | 0.7 | 6000 |
| **复杂研究 agent** | 50 | 0.75 | 10000 |
| **HITL 复杂业务** | 40 | 0.7 | 8000 |

**核心原则**：
- **max_iters 高** = 容许多步 / 重试——**耗 token**
- **threshold 低** = 早压缩——**耗 LLM 调用**——**但稳**
- **tool_result_limit 低** = 早 truncate——**失信息**——**但省 context**

## 四、调优实战：监控先行

**不要瞎调**——**先看监控**——**再调**——**再验证**：

```typescript
// 加 4 个关键 metric
const metrics = {
  //  /  /  1. 平均用了多少 iter
  avgIterations: history.map(h => h.iterations).reduce((a, b) => a + b) / history.length,

  //  /  /  2. 多少比例 hit max_iters
  hitMaxItersRatio: history.filter(h => h.iterations >= max_iters).length / history.length,

  //  /  /  3. 多少比例触发 compress
  compressionRatio: history.filter(h => h.compressed).length / history.length,

  //  /  /  4. 多少比例 fail
  failureRatio: history.filter(h => h.error).length / history.length,
}
```

**调优 checklist**：

| Metric | 期望 | 调参方向 |
|---|---|---|
| `hitMaxItersRatio` > 10% | 太频繁 | 调高 `max_iters` |
| `compressionRatio` > 30% | 太频繁 | 调低 `threshold` 或 调低 `tool_result_limit` |
| `failureRatio` > 5% | 太多 | 综合调——`max_iters` + `threshold` + `tool_result_limit` |
| `avgIterations` < 5 | 任务太简单 | 调低 `max_iters`（省 token）|

## 五、坑：3 个最常踩的

### 坑 1：忽略 reserve_ratio

```typescript
context_config: {
  trigger_ratio: 0.7,
  reserve_ratio: 0.1,  //  /  /  关键！compress 至少要 10% 空间
}
```

**`reserve_ratio` 是给 compress 调用的 LLM 留的**——**不设 = 0**——**compress 永远没空间**。

**建议 0.05-0.15**。

### 坑 2：max_iters 设 100

```typescript
max_iters: 100  //  /  /  太多
```

**iter 100 + 单 iter 10K tokens = 1M tokens**——**爆**——**钱爆**——**时间爆**。

**iter 高的代价比你想的大**。

### 坑 3：tool_result_limit 设 0

```typescript
tool_result_limit: 0  //  /  /  报错
```

**0 = 全部都超**——**全部 truncate**——**工具结果全空**——**agent 拿不到信息**——**瞎答**。

**最小 1000**——**保证能拿到至少 1000 token 结果**。

## 六、回归 W2-W5 框架知识

这 3 个参数**不是孤立的**——**W2-W5 学的 8 大飞跃**——**都能映射**：

| W 学的概念 | 在 3 参数里的体现 |
|---|---|
| **W2 Reentrant Protocol** | `max_iters` 是协议层约束——**不是循环计数** |
| **W3 State Machine** | 每个 iter 推进 state——**max_iters 限制总推进** |
| **W3 Data Flow > Control Flow** | tool_result 截断 = 数据截断——**不是错误** |
| **W4 Validation Delegation** | threshold 触发 = 框架层判断——**不是用户感知** |
| **W5 Robustness ≠ Strictness** | tool_result_limit 失败 = 优雅降级——**truncate 而非 fail** |

**一句话**：**3 参数 = 8 大飞跃的"参数化体现"**。

## 七、完整代码

```typescript
//  /  /  buildSystemPrompt 优化版
interface ModuleInfo {
  moduleName: string;
  bbom: string;
  cversion: string;
  keyChange?: string;
}

interface RuntimeContext {
  userId: string;
  timezone: string;
}

function buildSystemPrompt(
  basePrompt: string,
  currentBom: string,
  moduleInfo?: ModuleInfo,
  runtime?: RuntimeContext,
): string {
  //  /  /  第 1 层：固定 base
  const base = `${basePrompt}

当前项目是 ${currentBom}。仅回答与开发相关的问题。`

  if (!moduleInfo) return base

  //  /  /  第 2 层：项目上下文
  const project = `
当前项目：
- 项目：${moduleInfo.moduleName}
- B 版本：${moduleInfo.bbom}
- C 版本：${moduleInfo.cversion}
${moduleInfo.keyChange ? `- 关键变更：${moduleInfo.keyChange}` : ''}
`

  //  /  /  第 3 层：运行时
  const runtimeStr = runtime ? `
当前：
- 用户：${runtime.userId}
- 时区：${runtime.timezone}
- 时间：${new Date().toISOString()}
` : ''

  return `${base}${project}${runtimeStr}`
}

//  /  /  createAgent 优化版
async function createAgent(currentBom: string, systemPrompt: string) {
  return await baseCreateAgent({
    name: currentBom,
    system_prompt: systemPrompt,

    //  /  /  3 大关键参数
    react_config: {
      max_iters: 30,  //  /  /  默认 20 偏少
      structured_output_grace_iters: 5,
      stop_on_reject: false,
    },

    context_config: {
      compression_threshold: 0.7,  //  /  /  默认 0.8 偏大
      reserve_ratio: 0.1,
      tool_result_limit: 6000,  //  /  /  默认 50000 偏大
    },
  })
}
```

## 八、致读者

**Agent 调优**——**不是"调 1 个参数"**——**是"理解 + 监控 + 迭代"**：
1. **理解**每个参数解决什么问题（W2-W5 学的 8 大飞跃帮你理解）
2. **监控**4 个关键 metric（avg / hit_max / compress / fail）
3. **迭代**调整 3 大参数（max_iters / threshold / tool_result_limit）

**没有"完美配置"**——**只有"适合你业务的配置"**。

## 参考

- AgentScope 源码：`src/agentscope/agent/_config.py` (ContextConfig / ReActConfig)
- AgentScope 源码：`src/agentscope/agent/_agent.py:2648-2729` (truncate 算法)
- AgentScope 源码：`src/agentscope/agent/_agent.py:973-978` (iteration 计算)
- W4 学习总结：https://sunrong.site/posts/ai-practice/ai-app/agentscope-w4-learning-summary.html
