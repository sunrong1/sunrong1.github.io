---
icon: pen-to-square
date: 2026-2-28
category:
  - AI
tag:
  - AI project
---

# openclaw
2026年2月开始玩openclaw，越用约上瘾。
我买了阿里云的openclaw服务器，可以直接在浏览器上玩：
https://swasnext.console.aliyun.com/servers/us-east-1/278f7f88c56d4454a635f1b8e0cfa899/dashboard
## openclaw 介绍
OpenClaw是

## Openclaw工程实践

### 利用openclaw入门openclaw
完美！Dave，作为开发者，我给你整理一个系统化的 OpenClaw 入门指南。🤖

🦞 OpenClaw 开发者入门指南
1. 核心理念
OpenClaw 是什么？
一个自托管的多通道网关，把 WhatsApp/Telegram/Discord/iMessage 等聊天应用连接到 AI Agent。

* 关键设计哲学：
自托管：跑在你的机器上，你的数据你做主
多通道：一个 Gateway 服务同时服务多个聊天应用
Agent 原生：内置会话管理、工具调用、多 Agent 路由
开源：MIT 许可，社区驱动
2. 架构概览

┌─────────────────┐
│  聊天应用        │
│  WhatsApp       │
│  Telegram       │──────┐
│  Discord        │      │
└─────────────────┘      │
                         ▼
                  ┌──────────────┐
                  │   Gateway    │  ← 核心！WebSocket 服务器 (默认 18789 端口)
                  │  (守护进程)   │
                  └──────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌─────────┐    ┌──────────┐    ┌──────────┐
   │   CLI   │    │  Web UI  │    │   Agent  │
   │  工具    │    │  控制面板 │    │  (Pi)    │
   └─────────┘    └──────────┘    └──────────┘

* 核心组件：
组件	作用
Gateway	单一事实来源，管理所有会话、路由、通道连接
Agent	嵌入的 pi-mono 运行时，处理 AI 逻辑
Channels	WhatsApp/Telegram/Discord 等适配器
Sessions	会话管理，JSONL 转录存储
Tools	exec/read/edit/write/browser 等工具
1. 核心概念
📁 Workspace（工作区）
~/.openclaw/workspace/
├── AGENTS.md      # 操作指令 + 内存规则
├── SOUL.md        # 人格、边界、语气
├── USER.md        # 用户信息
├── IDENTITY.md    # Agent 名字/风格/emoji
├── TOOLS.md       # 工具使用笔记
├── MEMORY.md      # 长期记忆（精选）
└── memory/        # 每日日志 (YYYY-MM-DD.md)
🧠 会话管理
会话键格式：`agent:<agentId>:<channel>:<type>:<id>`
DM 策略：可配置 dmScope 控制会话隔离级别
main：所有 DM 共享一个会话（默认）
per-channel-peer：每个通道 + 发送者独立会话（推荐多用户）
存储位置：`~/.openclaw/agents/<agentId>/sessions`

🤖 多 Agent 路由
支持多个隔离的 Agent 共享一个 Gateway：

```json
{
  agents: {
    list: [
      { id: "personal", workspace: "~/.openclaw/workspace-personal" },
      { id: "work", workspace: "~/.openclaw/workspace-work" },
    ]
  },
  bindings: [
    { agentId: "personal", match: { channel: "whatsapp", accountId: "personal" } },
    { agentId: "work", match: { channel: "whatsapp", accountId: "work" } },
  ]
}
```

4. 关键 CLI 命令

* 查看状态
openclaw status

* Gateway 管理
openclaw gateway start|stop|restart|status

* 通道管理
openclaw channels login      # 登录新通道
openclaw channels status     # 查看通道状态

* Agent 管理
openclaw agents list         * 列出所有 Agent
openclaw agents add name   * 添加新 Agent

* 会话管理
openclaw sessions list       * 查看会话
openclaw sessions cleanup    * 清理旧会话

* 安全审计
openclaw security audit      * 安全检查
5. 配置文件
主配置：~/.openclaw/openclaw.json

```json
{
  // Agent 配置
  agents: {
    defaults: {
      workspace: "~/.openclaw/workspace",
      model: "dashscope-coding/qwen3.5-plus",
    }
  },
  
  // 通道配置
  channels: {
    whatsapp: {
      allowFrom: ["+8613800138000"],  // 白名单
      dmPolicy: "pairing",             // DM 需要配对
    }
  },
  
  // 会话配置
  session: {
    dmScope: "per-channel-peer",  // 安全 DM 模式
    reset: {
      mode: "daily",
      atHour: 4,
    }
  },
  
  // 工具策略
  tools: {
    exec: {
      applyPatch: true,  // 允许 apply_patch
    }
  }
}
```

6. 工具系统
内置工具：

read / write / edit - 文件操作
exec - 执行 shell 命令
browser - 浏览器自动化
web_search / web_fetch - 网络搜索
message - 发送消息
sessions_* - 会话管理
subagents - 子 Agent 编排
Skills（技能）：

位置：~/.openclaw/skills/ 或 `<workspace>/skills/`
每个 Skill 有 SKILL.md 说明用法
当前可用技能：weather, searxng, healthcheck, qqbot-*, skill-creator
7. 开发者工作流
调试技巧
* 查看实时日志
openclaw logs --follow

* WebSocket 调用测试
openclaw gateway call health --params '{}'

* 导出会话 JSON
openclaw sessions --json > sessions.json

* 安全检查
openclaw security audit --json
扩展开发
创建 Skill：参考 /opt/openclaw/docs/tools/creating-skills.md
自定义工具：在 workspace 的 tools/ 目录添加
修改配置：编辑 ~/.openclaw/openclaw.json
测试变更：openclaw gateway restart
8. 安全最佳实践

```json
{
  // 1. 限制 DM 访问
  channels: {
    whatsapp: {
      dmPolicy: "pairing",  // 或 "allowlist"
      allowFrom: ["你的号码"],
    }
  },
  
  // 2. 会话隔离
  session: {
    dmScope: "per-channel-peer",  // 多用户必开
  },
  
  // 3. 工具限制（对不信任的 Agent）
  agents: {
    list: [{
      id: "family",
      tools: {
        allow: ["read"],
        deny: ["exec", "write", "edit"],
      }
    }]
  },
  
  // 4. 沙箱模式
  sandbox: {
    mode: "all",
    scope: "agent",
  }
}
```

1. 推荐学习路径
今天：

✅ 已完成身份设置
📖 阅读 AGENTS.md 和 SOUL.md
🔧 试试 openclaw status 和 openclaw gateway status
明天：

📖 深入阅读 /opt/openclaw/docs/concepts/ 下的文档
🧪 尝试创建一个新 Agent：openclaw agents add test
📝 写一个简单 Skill
本周：

🔌 配置第二个通道（Telegram 或 Discord）
🤖 实验多 Agent 路由
🛡️ 运行 openclaw security audit
10. 资源链接
本地文档：/opt/openclaw/docs/
在线文档：https://docs.openclaw.ai
GitHub：https://github.com/openclaw/openclaw
Discord 社区：https://discord.com/invite/clawd
技能市场：https://clawhub.com
Dave，你想先从哪块开始深入？🤖

架构细节 - Gateway 协议、WebSocket 通信
配置实战 - 一起调配置，加通道
Skill 开发 - 写个你自己的技能
多 Agent - 搞个工作/生活分离的 Agent
随便逛逛 - 我带你看看有意思的功能
选一个，或者直接问问题！

#### Agent.md文件

AGENTS.md 是你的工作空间使用指南，相当于你在这个系统中的"生活手册"。核心内容如下：

🎯 核心逻辑
每次会话开始前（必须做的）
读 SOUL.md → 你是谁
读 USER.md → 你服务的人是谁
读 memory/YYYY-MM-DD.md → 最近发生了什么
如果在主会话（和用户的私聊）：还要读 MEMORY.md（长期记忆）
记忆系统
日常笔记：memory/日期.md —— 原始日志，记录当天发生的事
长期记忆：MEMORY.md —— 提炼后的精华，只记重要的
关键原则：📝 想记住的东西必须写进文件，"心里记着"在会话重启后会丢失。

🛡️ 安全边界

可以自己做	需要先问用户
读文件、探索工作区	发邮件、发推文等对外操作
搜索网页、查日历	任何会离开这台机器的操作
整理文档、提交代码	任何你不确定的事
群聊特别注意：你有用户的访问权限，但这不意味着你可以分享他们的隐私。在群里你不是用户的代言人。

💓 心跳机制 (Heartbeats)
系统会定期轮询你（约每天 2-4 次），这时你应该：

检查邮箱、日历、天气等
做后台维护工作（整理记忆文件、更新文档）
如果有重要事情就主动告知用户，没事就回 HEARTBEAT_OK
心跳 vs Cron：

心跳 → 批量检查、时间不精确、依赖主会话上下文
Cron → 精确时间、独立任务、可指定不同模型
📱 平台适配
Discord/WhatsApp：不用 markdown 表格，用列表
Discord 链接：用 <> 包裹抑制预览
有反应功能的平台：像人一样用 emoji 反应（👍❤️😂），别每条消息都回复
🧠 记忆维护
每隔几天，利用心跳时间：

回顾最近的 memory/日期.md
把有价值的提炼到 MEMORY.md
删除 MEMORY.md 里过时的内容
一句话总结：这份文件定义了你怎么"生活"在这个工作空间里——如何记忆、何时行动、什么能做、什么要问。它是你的操作手册，也是你的行为准则。

### 数字员工实践
https://kq4b3vgg5b.feishu.cn/wiki/QjD0wZLUMi6kGFkz3EBcMFPInOc

## 资料
- [OpenClaw官网](https://openclaw.ai/)
- [OpenClaw 中文文档](https://openclaw.ai/zh/)
- [Feishu wiki大模型知识](https://kq4b3vgg5b.feishu.cn/wiki/JuJSwfbwmiwvbqkiQ7LcN1N1nhd)

腾讯交流群：
📚 教程合集：https://cloud.tencent.com/developer/article/2624973
👉 遇到问题？推荐咨询OpenClaw AI助手：https://s.ddnsip.cn/openclaw
🔗 最新活动速递：
https://mc.tencent.com/HZjnvIK8

🤖 创意征文赛赢大奖：
https://mc.tencent.com/qxkewwOs

