---
title: '三模型协作实战：MiniMax + 千问 + DeepSeek 的分工、踩坑与账本'
date: '2026-10-13'
tags:
  - Claude Code
  - MiniMax
  - 通义千问
  - DeepSeek
  - 多模型协作
  - Token 优化
  - BMAD
categories:
  - AI 实践
icon: 🎛️
author: Mr.Sun
---

# 三模型协作实战：MiniMax + 千问 + DeepSeek 的分工、踩坑与账本

> 一周内把三个模型接进 Claude Code，踩了 6 个坑，烧掉 70% 月额度，换来一套能算账的分工方法。
>
> 这篇记的不是"怎么配置"，是"**配置之后怎么不烧钱**"。

***
## 💡 起因

我在用 BMAD-METHOD 做 AI Agent 项目，Claude Code 是主力工具。但 MiniMax 的 Token Plan 有 **5 小时滚动窗口**，第一次跑 code review 就把窗口打爆了。

于是接了第二个后端（千问 Token Plan），结果**一次 review 吃掉 70% 月额度**。

第三次接了 DeepSeek，发现同样任务只要 **1 块钱**。

于是把三天的实测数据全记下来了。

***
<!-- more -->
## 一、先看账：钱到底花在哪

三次同样性质的 code review，三种后端：

| 后端 | 总 Tokens | 输出占比 | 实际花费 |
|---|---|---|---|
| **千问 Token Plan** | 21.1M | 1.61% | **70% 月额度** |
| **DeepSeek（flash）** | 19.7M | **0.23%** | **≈1 元** |

第二次的数字更扎眼：

```
总 Tokens    21,137,840
缓存命中率    75.6%
未缓存输入    5,079,352
缓存输入      15,718,094   ← 占 74%
输出            340,394   ← 只占 1.6%
```

**输出只占 1.6%。也就是说 98% 的钱花在"重复读上下文"上，你真正让模型产出东西的部分可以忽略不计。**

再看历史的会话上下文分布（42 个会话）：

```
中位数   51,103
平均值   82,438
最大    291,058
```

**中位数只有 51K，但我在按 512K 配窗口。**

***
## 二、真正的成本模型

把三次 review 拆开算：

```
每轮请求平均：
  新增内容   39,889 tokens
  重读历史  123,438 tokens   ← 占 76%
```

**每发一轮请求，4/5 的带宽在重发已经给模型看过的旧内容。**

这个比例决定了成本公式：

```
总成本 ≈ 请求轮数 × (新增 + 重读)
       ≈ 请求轮数 × 上下文大小 × (1 + 重读系数)
```

**降本只有三个杠杆：**

| 杠杆 | 效果 | 难度 |
|---|---|---|
| **压上下文上限** | 线性下降 | ⭐ 改一行配置 |
| **减请求轮数** | 线性下降 | ⭐⭐ 改工作习惯 |
| **降低每次 Bash 输出** | 减少新增 | ⭐⭐ 改命令写法 |

**选便宜模型是第四个杠杆**，而且是唯一"一次性"的——但我一开始就搞错了优先级。

***
## 三、踩的 6 个坑

### 坑 1：把上下文窗口当成"越大越好"

我第一次配 Claude Code 时，看到 MiniMax 支持 1M 上下文，直接设了 512K。

**结果**：窗口开大 → 每轮重发的内容更多 → 同样的任务消耗翻倍。

MiniMax 官方文档其实给了答案，只是我跳过了：

> 在 ProgramBench 对比中，512K 和 1M 窗口**模型表现无明显差异**，但 512K 的预估成本**低约 20%**。
> 实测：1M 平均每任务 136.76M tokens，512K 是 111.42M（**少 18.5%**）。

**512K 不是"保守"，是官方推荐的性价比拐点。**

### 坑 2：忽略了压缩线才是真正的开关

我配了 `MAX_CONTEXT_TOKENS=524288`，以为窗口就是 512K。

实际上：

```
MAX_CONTEXT_TOKENS     = 上限（撞顶会硬失败）
AUTO_COMPACT_WINDOW    = 压缩线（到这里才触发总结压缩）
```

**我把压缩线也设成了 462K，等于压缩功能形同虚设。**

改到 200K 后才真正生效。

### 坑 3：长会话里跑 skill

BMAD 的 `bmad-help` 有一条硬约束，写在 SKILL.md 的 Constraints 段：

```
- Recommend running each skill in a **fresh context window**
```

**不是建议，是约束。** 但我的一次 code review 是在 **127 轮的老会话**里跑的，上下文滚到 166K 后，每一轮都在重发这 166K。

BMAD 承诺的是 **artifact-driven**——文件里有一切。上下文里残留的历史对话**恰恰是对这个承诺的破坏**。

### 坑 4：Bash 输出直接进上下文

我的历史统计里 **Bash 调用 1238 次**，是所有工具里最多的。

```
❌ grep -rn "pattern" src/ | head -50      # 每次 50 行进上下文，下一轮全部重发
✅ rg -n "pattern" src/ -g '*.ts' -l      # 只要文件名
```

**先定位文件，再针对性读**，而不是一次 dump 几百行。

### 坑 5：把 OpenAI 兼容端点当成 Anthropic 端点

千问的官方文档里，同一个 Token Plan 有**两个完全不同的 base URL**：

```
❌ https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1   ← OpenAI 协议
✅ https://token-plan.maas.qianwenaiapi.com/apps/anthropic              ← Anthropic 协议
```

Claude Code **只会发 Anthropic Messages 协议**。配错了的表现是：

```
$ curl "$WRONG_URL/v1/messages"
{"error":{"type":"invalid_request_error","message":"InvalidParameter, url error"}}
```

**一行之差**：`compatible-mode/v1` → `apps/anthropic`。

### 坑 6：以为模型名是固定的

接 DeepSeek 时我按惯例填 `deepseek-chat`，结果报错信息直接告诉我真相：

```json
{"error":{"message":"The supported API model names are deepseek-flash,
           deepseek-v4-pro, but you passed deepseek-v3.2."}}
```

**`deepseek-chat` / `deepseek-reasoner` 还能用，但已经过时了。当前是 `deepseek-flash` / `deepseek-v4-pro`。**

**配置前先 curl 试一遍，比查文档快。**

***
## 四、最终的分工方案

跑完三个后端的实测账单，我最后定下这套：

### 分工原则

```
🟢 空闲时段 + DeepSeek flash  →  批量重活
   · code review / 大规模重构 / 批量分析
   · DeepSeek 空闲时段半价

🔴 高峰时段 + MiniMax 订阅   →  交互式开发
   · build 写代码 / 需要来回确认
   · 订阅已付费，边际成本为 0

🟢 22:00-08:00 + 千问        →  规划 + 深度决策
   · PRD / GDD 发散量大但输出少
   · Credits 低至 4 折
```

### 三家计费结构对比

| | MiniMax Token Plan | 千问 Token Plan | DeepSeek |
|---|---|---|---|
| **模式** | 订阅 | 订阅 | 按量 |
| **窗口限制** | 5 小时滚动 + 周 | 月额度 | 无 |
| **时段折扣** | 无 | 22:00-08:00 **4 折** | 空闲时段**半价** |
| **打爆后** | 等窗口重置（最长 5h） | 等下月 | **无限制**，随时能用 |
| **上下文上限** | 1M（建议 512K） | 960K（建议 512K） | 128K |
| **溢出成本** | 撞墙 | 撞墙 | 按量继续 |

**三个后端的配额池完全独立**，这意味着它们可以互补：

```
minimax 打爆 → 切 qwen（订阅池）
qwen 月额度用完 → 切 deepseek（按量，1 元一次）
周末 → deepseek 跑批量任务（半价）
深夜 → qwen 跑规划（4 折）
```

### 上下文配置

三个后端**统一压到 256K 上限 / 200K 压缩线**：

```json
{
  "CLAUDE_CODE_MAX_CONTEXT_TOKENS": "262144",
  "CLAUDE_CODE_AUTO_COMPACT_WINDOW": "204800"
}
```

**为什么是 256K 而不是 512K**：我的会话中位数 51K，主力工作模式 166K。200K 压缩线能压住 90% 的大会话，又不会误伤小会话。

**需要更大窗口的场景**（用 `--settings` 临时放开，不改默认）：

| 场景 | 建议窗口 |
|---|---|
| 日常 build / 单文件 review | 256K |
| 多文件 code review（diff + 项目上下文）| 384K |
| 全仓库级重构（78 子项目那种）| 512K |

***
## 五、验证配置生效的方法

改完配置**一定要验证**，别信"我改了所以它生效了"。

### 方法 1：`/context` 看真实窗口

```
Auto-compact window: 204.8k tokens
Free space: xxx k (xx%)
```

**如果显示的窗口跟配置不符，说明环境变量没传进去。**

### 方法 2：`/proc/<pid>/environ` 有坑

我一开始用这个验证：

```bash
tr '\0' '\n' < /proc/$PID/environ | grep MAX_CONTEXT
```

**查不到。** 因为 `/proc/environ` 只反映进程 **exec 时**的环境，Node 运行时的 `process.env` 修改不会同步到内核。

### 方法 3：curl 验证 endpoint

配完先打一发：

```bash
curl -s "$BASE_URL/v1/messages" \
  -H "x-api-key: $TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"MODEL","max_tokens":16,"messages":[{"role":"user","content":"hi"}]}'
```

**这一发能同时验证：URL 对不对 / Token 有效吗 / 模型名存在吗 / 协议兼容吗。**

***
## 六、切换脚本长什么样

核心思路：**backend 配置注入 `claude --settings`，而不是改 `settings.json`**。

因为实测发现 `--settings` 的优先级**高于** `settings.json`，这样：

```
~/.claude/settings.json     全局默认 + 通用配置
~/.claude/{backend}.env    各后端连接信息
~/.claude/cc-model         切换器（注入 --settings，不污染默认）
```

三种启动方式共存：

```bash
claude                    # 走 settings.json 的默认后端
cc-model minimax          # 显式切 minimax
cc-model qwen             # 显式切千问
```

**加个时段提示**是最值的部分——看一眼就知道现在跑是不是划算：

```bash
⏰ minimax 订阅制 · 5 小时滚动窗口
   当前窗口  第 4/5 个 · 15:00 → 20:00 · 距重置 4 小时 57 分
   窗口边界  00:00 → 05:00 → 10:00 → 15:00 → 20:00 → 00:00（循环）
   实时配额  5h 剩余  92%  ·  周剩余  75%
```

**"实时配额"那两行是我最常看的**——它让我在撞墙前 4 小时就知道，而不是撞了才等。

***
## 七、如果让我重来，我会怎么做

**第一天就做这三件事**：

1. **查后端的缓存定价**。我是在烧掉 70% 额度之后才知道缓存读也要计费的。
2. **压上下文到实际用量中位数的 2-3 倍**。我的中位数是 51K，那我一开始就配 128K，而不是 512K。
3. **把 BMAD 的 skill 拆到不同会话**。这一条 BMAD 自己写在文档里了，我没执行。

**我最后悔的一件事**：

> 在一个 127 轮的老会话里跑 code review。

21.1M tokens 里，74% 是 cache_read。**如果按 BMAD 的规矩新开会话，这个数字至少能砍一半。**

**配置能改，工作习惯难改**——而后者才是大头。

***
## 📚 参考

- [MiniMax M3.1 上下文窗口与成本建议](https://platform.minimax.io/docs/m-plan/codex)（512K vs 1M 的实测对比）
- [MiniMax Token Plan FAQ](https://platform.minimax.io/docs/token-plan/faq)（计费窗口、Credits 规则）
- [阿里云百炼 Claude Code 接入文档](https://help.aliyun.com/zh/model-studio/claude-code)（正确的 Anthropic 端点）
- [BMAD-METHOD 文档](https://docs.bmad-method.org/)
- 本系列前文：《一天掌握 BMAD-METHOD：从装到改的 6 小时路线图》

***
**作者**：Mr.Sun（孙荣）

11 年研发经验，华为 17 级技术专家。AI Agent 平台研发 + AgentScope / BMAD-METHOD 双上游 contributor。个人 blog：[sunrong.site](https://sunrong.site/)

**版权**：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)，转载请保留作者信息与原文链接。
