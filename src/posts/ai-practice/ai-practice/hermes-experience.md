---
icon: robot
date: 2026-04-29
update: 2026-04-29
category:
  - AI
tag:
  - AI Agent
  - Hermes
  - 会话管理
  - 工具调用
star: true
---

# Hermes Agent 使用经验：从工具调用到会话管理

> 作者：Mr.Sun  
> 日期：2026-04-29  
> 标签：AI Agent, Hermes, 会话管理, 工具调用

---

## 什么是 Hermes Agent？

Hermes 是我在 OpenClaw 双 Agent 架构中的**第二 Agent**——定位是我的专属导师（另一个是小沐陪伴）。它是一个强大的 AI Agent 框架，支持多平台接入（飞书、WeCom、QQ、Telegram 等），具备完整的工具生态和会话管理能力。

最近在使用过程中遇到一个典型问题：**会话每天被清空**，排查过程让我对 Hermes 的架构有了更深入的理解。

---

## 问题：为什么会话每天都会"丢失"？

### 现象

- WeCom 聊天记录还在
- 但 Hermes 像"失忆"了一样，不认识我了
- 每次都要重新自我介绍

### 排查过程

通过查看 `~/.hermes/config.yaml`，发现了关键配置：

```yaml
session_reset:
  mode: both        # 两种触发方式
  idle_minutes: 1440  # 24小时空闲超时
  at_hour: 4         # 每天凌晨4点
```

**问题根源**：`mode: both` 意味着 **任意一种条件触发都会重置会话**：
1. 空闲 24 小时 → 重置
2. 每天凌晨 4 点 → 强制重置

这解释了为什么 WeCom 显示历史消息，但 Hermes 已经不认我了——WeCom 只是"消息展示层"，而 Hermes 的 session ID 被清空了。

---

## 解决方案

修改配置关闭会话重置：

```yaml
session_reset:
  mode: none   # 完全关闭会话重置
  idle_minutes: 1440
  at_hour: 4
```

修改后需要重启 Hermes 服务生效。

---

## 延伸思考：工具学习 vs 工具推理

在和 Hermes 讨论 AI Agent 时，我们触及了一个核心概念区分：

| 问题类型 | 定义 | 焦点 |
|---------|------|------|
| **工具学习** (Tool Learning) | 让工具自己学会调用工具 | 工具作为主体，如何掌握工具使用能力 |
| **工具推理** (Tool Reasoning) | 推理工具调用之间的联系 | 给定任务，如何规划/排序/组合工具调用 |

**本质区别**：
- **工具学习** = 学习如何学习 = 元技能
- **工具推理** = 理解工具间的关系与依赖 = 策略

这和 Hermes 的架构设计也有关系——它既需要"学会使用工具"（Skill 机制），也需要"推理工具调用"（Agent Loop + Hooks）。

---

## Hermes 核心架构笔记

基于我的使用经验，总结 Hermes 的关键组件：

### 1. 会话管理
- Session 存储在 `~/.hermes/sessions/`
- 支持 `session_search` 跨会话搜索
- `group_sessions_per_user: true` 按用户分组会话

### 2. 上下文压缩
```yaml
context:
  engine: compressor  # 启用压缩
compression:
  enabled: true
  threshold: 0.5      # 50% 时触发压缩
  target_ratio: 0.2  # 压缩到 20%
  protect_last_n: 20 # 保留最近 20 条
```

### 3. Skill 机制
Skills 是 Hermes 的核心竞争力——封装成可发现、可复用、可组合的能力模块。

### 4. 工具集 (Toolsets)
```
hermes-cli / hermes-telegram / hermes-discord
hermes-whatsapp / hermes-slack / hermes-qqbot
```

---

## 实战经验总结

1. **会话丢失不等于聊天记录丢失** — 平台消息 vs Agent session 是两套独立机制
2. **`session_reset` 配置要仔细看** — `mode: both` 比我预期的更激进
3. **压缩机制可能悄悄丢掉上下文** — 即使关闭 session_reset，上下文窗口耗尽时仍会压缩
4. **Skill 是复用的关键** — 把常见任务封装成 Skill，避免重复工作
5. **session_search 是找回上下文的好工具** — 即使 session 断了，历史记录还在

---

## 下一步

Hermes 的深度定制还在继续。下一步计划探索：
- MCP Server 集成
- 多 Agent 协作模式
- Skill 的自动化测试

---

*如果你也在使用 Hermes，遇到类似问题，欢迎交流。*
