---
icon: brain
date: 2026-02-28
category:
  - AI
tag:
  - OpenClaw
  - AI Agent
  - 开发者指南
---

# OpenClaw 开发者入门指南：从架构到实战的完整攻略

> 2026 年 2 月开始接触 OpenClaw，越用越上瘾。本文系统整理了 OpenClaw 的核心理念、架构设计、关键配置和开发者工作流，适合想认真用好这个框架的同学。

## 为什么选择 OpenClaw

在搭建个人 AI 助手之前，我对比过几个主流方案：

| 方案 | 优点 | 缺点 |
|------|------|------|
| Zapier | 简单生态丰富 | 昂贵，国内访问慢 |
| n8n | 开源可自托管 | 需要自己运维 |
| **OpenClaw** | **AI 原生、多通道集成、自托管** | **学习曲线稍陡** |

OpenClaw 最大的特点是**自托管 + AI Agent 原生设计**——它不是一个聊天工具，而是一个多通道网关，把 WhatsApp/Telegram/Discord/企业微信等聊天应用连接到 AI Agent，再配合工作区机制实现持久化记忆和工具调用。

---

## 架构概览

```
┌─────────────────┐
│   聊天应用       │
│  WhatsApp       │
│  Telegram       │──────┐
│  Discord        │      │
│  企业微信        │      │
└─────────────────┘      │
                         ▼
                  ┌──────────────┐
                  │   Gateway    │  ← 核心！WebSocket 服务器（默认 18789 端口）
                  │  （守护进程）  │
                  └──────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌─────────┐    ┌──────────┐    ┌──────────┐
   │   CLI   │    │  Web UI  │    │   Agent  │
   │  工具集  │    │  控制面板 │    │  (运行时) │
   └─────────┘    └──────────┘    └──────────┘
```

**核心组件职责：**

| 组件 | 作用 |
|------|------|
| Gateway | 单一事实来源，管理所有会话、路由、通道连接 |
| Agent | 嵌入的 pi-mono 运行时，处理 AI 逻辑和工具调用 |
| Channels | WhatsApp/Telegram/Discord/企业微信等适配器 |
| Sessions | 会话管理，转录 JSONL 格式存储在本地 |
| Tools | exec/read/edit/write/web_search 等内置工具集 |
| Skills | 可扩展技能市场，支持自定义能力封装 |

---

## 核心概念

### 1. Workspace（工作区）

```
~/.openclaw/workspace/
├── AGENTS.md      # 操作指令 + 内存规则（必读）
├── SOUL.md        # 人格、边界、语气定义
├── USER.md        # 用户信息（谁在用你）
├── IDENTITY.md    # Agent 名字/风格/emoji
├── TOOLS.md       # 工具使用笔记（个人配置）
├── MEMORY.md      # 长期记忆（主会话专用）
└── memory/        # 每日日志（YYYY-MM-DD.md）
```

**会话启动顺序（必须遵守）：**
1. 读 `SOUL.md` → 你是谁
2. 读 `USER.md` → 你服务的人是谁
3. 读 `memory/YYYY-MM-DD.md`（今天 + 昨天）
4. 主会话加读 `MEMORY.md`（长期记忆）

### 2. 会话管理

会话键格式：`agent:<agentId>:<channel>:<type>:<id>`

DM 策略由 `session.dmScope` 控制：

| 模式 | 行为 |
|------|------|
| `main` | 所有 DM 共享一个会话（默认） |
| `per-channel-peer` | 每个通道 + 发送者独立会话（**多用户推荐**） |

会话存储位置：`~/.openclaw/agents/<agentId>/sessions/`

### 3. 多 Agent 路由

支持多个隔离的 Agent 共享一个 Gateway：

```json
{
  "agents": {
    "list": [
      { "id": "personal", "workspace": "~/.openclaw/workspace-personal" },
      { "id": "work", "workspace": "~/.openclaw/workspace-work" }
    ]
  },
  "bindings": [
    { "agentId": "personal", "match": { "channel": "wecom", "accountId": "personal" } },
    { "agentId": "work", "match": { "channel": "wecom", "accountId": "work" } }
  ]
}
```

---

## 关键 CLI 命令

### Gateway 管理
```bash
openclaw gateway start    # 启动
openclaw gateway stop     # 停止
openclaw gateway restart  # 重启（推荐分开执行：stop → start）
openclaw gateway status  # 查看状态
openclaw gateway run     # 前台运行
```

### 状态与诊断
```bash
openclaw status           # 整体状态
openclaw update status    # 检查版本
openclaw security audit   # 安全审计
openclaw doctor          # 健康检查
```

### 会话管理
```bash
openclaw sessions list           # 查看会话列表
openclaw sessions cleanup        # 清理旧会话
openclaw sessions history <key>  # 查看历史会话
```

### 通道管理
```bash
openclaw channels login   # 登录新通道
openclaw channels status # 查看通道状态
```

### Agent 管理
```bash
openclaw agents list      # 列出所有 Agent
openclaw agents add     # 添加新 Agent
```

### Cron 定时任务
```bash
openclaw cron list            # 查看所有定时任务
openclaw cron runs <job-id>  # 查看任务执行记录
```

---

## 配置文件解析

主配置文件：`~/.openclaw/openclaw.json`

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace",
      "model": "minimax/MiniMax-M2.7",
      "compaction": {
        "mode": "safeguard"
      }
    }
  },

  "channels": {
    "wecom": {
      "enabled": true,
      "botId": "your-bot-id",
      "secret": "your-secret"
    }
  },

  "session": {
    "dmScope": "per-channel-peer",
    "reset": {
      "mode": "idle",
      "idleMinutes": 43200
    }
  },

  "tools": {
    "profile": "coding",
    "alsoAllow": ["wecom_mcp"],
    "exec": {
      "security": "full",
      "ask": "off"
    }
  },

  "gateway": {
    "port": 18789,
    "bind": "lan"
  }
}
```

**关键配置说明：**

| 配置项 | 推荐值 | 说明 |
|--------|--------|------|
| `session.reset.mode` | `idle` | 禁用每日重置，改为闲置 30 天后重置 |
| `session.reset.idleMinutes` | `43200` | 30 天（1440×30） |
| `tools.sessions.visibility` | `all` | 可查看所有历史会话 |
| `session.dmScope` | `per-channel-peer` | 多用户必开，独立会话隔离 |
| `tools.profile` | `coding` | 开发场景开启完整工具 |

---

## 工具系统

### 内置工具

| 工具 | 作用 |
|------|------|
| `read` / `write` / `edit` | 文件操作 |
| `exec` | 执行 shell 命令 |
| `web_search` / `web_fetch` | 网络搜索和页面抓取 |
| `sessions_*` | 会话管理 |
| `subagents` | 子 Agent 编排 |
| `image` | 图片理解 |
| `video_generate` | 视频生成 |

### Skills（技能市场）

Skills 位于 `~/.openclaw/skills/` 或 `<workspace>/skills/`，每个 Skill 包含 `SKILL.md` 说明用法。

**当前常用技能：**
- `weather` - 天气查询
- `healthcheck` - 主机健康检查
- `clawhub` - 技能市场
- `taskflow` - 多步骤任务编排
- `wecom-*` - 企业微信系列技能

安装新技能：`openclaw skills install <skill-name>`

---

## 开发者工作流

### 调试技巧

```bash
# 实时日志
openclaw logs --follow

# WebSocket 调用测试
openclaw gateway call health --params '{}'

# 导出会话 JSON
openclaw sessions --json > sessions.json

# 安全检查
openclaw security audit --json
```

### 扩展开发

**创建自定义 Skill：**
1. 在 `~/.openclaw/skills/` 创建目录
2. 编写 `SKILL.md` 说明能力
3. 实现核心逻辑代码
4. 测试并发布到 ClawHub

**修改配置后生效：**
```bash
openclaw gateway restart
```

### 版本管理

```bash
# 查看当前版本
openclaw --version

# 锁定当前版本（避免启动时自动检查 CPU 占用）
openclaw update --tag 2026.4.24 --no-restart --yes

# 手动更新到新版本
openclaw update --tag 2026.4.26 --yes
```

---

## 安全最佳实践

```json
{
  "channels": {
    "wecom": {
      "dmPolicy": "pairing"
    }
  },

  "session": {
    "dmScope": "per-channel-peer"
  },

  "tools": {
    "exec": {
      "security": "allowlist"
    }
  }
}
```

**核心原则：**
- 多用户必开 `per-channel-peer` 隔离
- 对不信任的 Agent 限制工具权限（只给 read，禁用 exec/write/edit）
- 敏感通道开启白名单
- 定期运行 `openclaw security audit`

---

## 学习路径推荐

### 第一天：入门
- [x] 完成身份设置（SOUL.md / IDENTITY.md）
- [x] 熟悉 `openclaw status` 和 `openclaw gateway status`
- [x] 理解 Workspace 文件结构

### 第一周：配置
- [ ] 配置至少一个聊天通道（企业微信 / Telegram）
- [ ] 熟悉 Session 管理机制
- [ ] 配置第一个 Cron 定时任务

### 第一个月：扩展
- [ ] 创建第一个自定义 Skill
- [ ] 实现多 Agent 路由
- [ ] 搭建完整的个人 AI 助手

---

## 相关资源

- [OpenClaw 官网](https://openclaw.ai/)
- [OpenClaw 中文文档](https://docs.openclaw.ai/zh/)
- [GitHub 仓库](https://github.com/openclaw/openclaw)
- [Discord 社区](https://discord.com/invite/clawd)
- [技能市场 ClawHub](https://clawhub.ai)

---

欢迎交流讨论，我的 blog：[sunrong.site](https://sunrong.site)
