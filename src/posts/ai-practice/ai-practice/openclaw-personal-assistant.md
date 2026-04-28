---
date: 2026-03-19
tags:
  - AI
  - OpenClaw
  - 测试技术
  - 实战项目
  - AI助手
author: Mr.Sun
---

# 用 OpenClaw 搭建个人 AI 助手：实战和避坑指南

> 2026 年 2 月开始接触 OpenClaw，用它搭建了自己的 AI 助手。这篇文章记录从零到一的完整过程。

## 🎯 项目背景

### 为什么需要 AI 助手

作为一名测试开发工程师，我每天需要处理：

- **重复性工作**：测试报告整理、数据收集
- **信息管理**：技术文章、待办事项、会议记录
- **学习追踪**：新技术、新工具、新论文

人工处理效率低，容易遗漏。我想打造一个**7x24 小时在线的 AI 助手**。

### 为什么选择 OpenClaw

对比了几个方案后选择 OpenClaw：

| 方案 | 优点 | 缺点 |
|------|------|------|
| Zapier | 简单 | 贵，国内访问慢 |
| n8n | 开源 | 需要自己部署 |
| **OpenClaw** | **AI 原生，支持本地部署** | **学习曲线稍陡** |

---

## 🛠️ 环境搭建

### 1. 服务器准备

我选择了阿里云 SWAS 服务器：

```
配置：2 核 4G 40GB SSD
系统：Ubuntu 22.04
费用：约 200+ 元/年
```

### 2. 安装 OpenClaw

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 OpenClaw
sudo npm install -g openclaw

# 启动服务
openclaw gateway start
```

### 3. 配置模型

我使用的是阿里云模型服务：

```bash
# 配置模型 API Key
openclaw config set modelstudio.api.key <your-api-key>

# 验证配置
openclaw status
```

---

## 📋 核心功能实现

### 功能 1：博客自动部署

**需求**：写完 markdown 后自动推送到 GitHub Pages

**实现**：
```javascript
// cron 定时任务
{
  "name": "博客自动部署",
  "schedule": {
    "kind": "cron",
    "expr": "0 */6 * * *"  // 每 6 小时检查一次
  },
  "payload": {
    "kind": "agentTurn",
    "message": "检查博客源码更新，如有新文章则构建并推送"
  }
}
```

**效果**：写完文章后，6 小时内自动部署上线

---

### 功能 2：技术资讯聚合

**需求**：每天自动收集 AI 和测试领域的最新资讯

**实现**：
```javascript
// 每日早 8 点执行
{
  "name": "技术早报",
  "schedule": {
    "kind": "cron",
    "expr": "0 8 * * *",
    "tz": "Asia/Shanghai"
  },
  "payload": {
    "kind": "agentTurn",
    "message": `
      收集以下来源的最新资讯：
      1. HackerNews AI 标签
      2. arXiv cs.SE 分类
      3. GitHub Trending
      整理成早报格式发送到我的微信
    `
  }
}
```

**效果**：每天早上 8 点收到技术早报

---

### 功能 3：待办事项管理

**需求**：自动追踪待办，定时提醒

**实现**：
```javascript
// 使用企业微信待办技能
wecom_mcp call todo create '{
  "content": " review 测试框架代码",
  "remindTime": "2026-03-20T10:00:00+08:00"
}'
```

**效果**：待办事项自动同步到企业微信

---

### 功能 4：会议记录整理

**需求**：会议后自动整理纪要

**实现**：
```javascript
// 会议结束后触发
{
  "name": "会议整理",
  "trigger": "manual",
  "payload": {
    "kind": "agentTurn",
    "message": `
      根据以下会议录音转录文本，整理会议纪要：
      1. 提取关键决策
      2. 列出待办事项
      3. 标注责任人
      4. 发送到项目群
    `
  }
}
```

---

## 🔧 技能开发

### 自定义技能：博客管理

```markdown
# 技能名称：blog-manager
# 功能：博客文章创建、编辑、发布

## 能力
1. create-post: 创建新文章
2. update-post: 更新文章
3. publish-post: 发布到 GitHub
4. list-posts: 列出所有文章

## 使用示例
blog-manager create-post '{
  "title": "新文章标题",
  "category": "技术分享",
  "tags": ["AI", "OpenClaw"]
}'
```

### 自定义技能：代码审查

```markdown
# 技能名称：code-reviewer
# 功能：自动代码审查

## 能力
1. review-pr: 审查 Pull Request
2. check-style: 代码风格检查
3. suggest-fix: 提供修复建议

## 使用示例
code-reviewer review-pr '{
  "repo": "sunrong1/test-framework",
  "prNumber": 42
}'
```

---

## 📊 使用效果

### 效率提升

| 任务 | 之前 | 现在 | 提升 |
|------|------|------|------|
| 博客部署 | 手动 30 分钟 | 自动 0 分钟 | 100% |
| 资讯收集 | 每天 1 小时 | 自动 0 分钟 | 100% |
| 会议整理 | 每次 30 分钟 | 自动 5 分钟 | 83% |
| 待办追踪 | 经常遗漏 | 100% 提醒 | - |

### 时间节省

**每周节省时间**：约 8-10 小时
**每月节省时间**：约 30-40 小时

---

## 💡 经验总结

### 成功经验

1. **从小处着手**：先实现一个功能，再逐步扩展
2. **充分利用现有技能**：不要重复造轮子
3. **定期优化**：根据使用情况调整配置

### 踩过的坑

1. **API 限流**：注意各平台的调用频率限制
2. **错误处理**：一定要加重试机制
3. **日志记录**：方便排查问题

---

## 🔴 实战避坑经验（2026年4月补充）

### 坑1：Session Label 每天消失

**问题现象**：设置的 session label 第二天不见了

**根本原因**：OpenClaw 默认每天 4:00 AM 会重置会话（daily reset），label 跟着 session 走，session 重置后 label 就丢了

**解决方案**：禁用每日重置，改为闲置 1 个月后重置

```bash
# 错误配置（默认）
# session.reset.mode: "daily"  → 每天4点重置

# 正确配置
openclaw config set session.reset.mode idle
openclaw config set session.reset.idleMinutes 43200  # 30天
```

**效果**：✅ Session 闲置 1 个月才重置，label 持久保存

---

### 坑2：无法查看历史会话记录

**问题现象**：`sessions_history` 报错 `Session history visibility is restricted`

**根本原因**：`tools.sessions.visibility` 默认为 `tree`，只能访问当前 session 树

**解决方案**：修改为 `all`

```bash
openclaw config set tools.sessions.visibility all
openclaw gateway restart
```

**效果**：✅ 可以查看所有会话历史

---

### 坑3：Cron Job 报 "Channel is required"

**问题现象**：多个 cron job 报错 `Channel is required when multiple channels are configured: openclaw-weixin, wecom`

**根本原因**：配置了多个 channel（个人微信 + 企业微信），`isolated` 类型的 cron job 必须显式指定 `delivery.channel`

**解决方案**：给所有 isolated cron job 添加 channel 配置

```bash
# 示例：更新 job 配置
# delivery: {
#   mode: "announce",
#   channel: "wecom"  # 指定企业微信
# }
```

**易出错的 job 类型**：
- AI Agent 每日学习提醒
- AI Agent 资讯推送
- AI Agent 复习提醒
- 每日自我提升复盘

---

### 坑4：Cron Job 执行超时

**问题现象**：`cron: job execution timed out`

**根本原因**：
1. 默认超时只有 60 秒
2. 任务内容太重（读取文件 + 分析 + 生成摘要）
3. 网络请求慢（搜索 API）

**解决方案**：按需增加超时时间

```bash
# 简单任务：60-120 秒足够
# 搜索+分析任务：建议 180-300 秒
# 复杂任务：考虑拆分成多个步骤
```

---

### 坑5：web_search 跨境搜索不稳定

**问题现象**：使用 shadowsocks 代理搜索超时

**根本原因**：跨境网络不稳定，DuckDuckGo 等服务国内访问慢

**解决方案**：使用 Tavily 搜索服务（国内可访问）

```bash
# 1. 安装 tavily-search skill
cd ~/.openclaw/extensions/tavily-search
npm install

# 2. 配置 API Key
# 文件：~/.openclaw/extensions/tavily-search/.env
TAVILY_API_KEY=tvly-xxx

# 3. 测试
node examples.js
```

**Tavily 优势**：
- 国内可直接访问
- 支持 `includeAnswer: true` 返回 AI 总结
- 免费额度 1000 次/月

---

### 坑6：Gateway 重启失败

**问题现象**：`openclaw gateway restart` 返回 exit code 1

**根本原因**：systemd service 停止和启动之间存在时序问题

**解决方案**：分开执行

```bash
# 错误方式
openclaw gateway restart  # 可能失败

# 正确方式
openclaw gateway stop
openclaw gateway start
```

---

### 坑7：Heartbeat 提醒太频繁

**问题现象**：收到太多 heartbeat 提醒

**根本原因**：cron job 配置了太多重复的定时任务

**解决方案**：统一规划，避免重复

| 时间 | 任务 | 类型 |
|------|------|------|
| 7:30 | 早上学习提醒 | systemEvent |
| 12:00 | AI Agent 资讯推送 | agentTurn + wecom |
| 21:00 | 晚间学习总结 | systemEvent |
| 22:00 | 每日自我提升复盘 | agentTurn + wecom |

**注意**：工作日和休息日任务要分开，避免休息日收到工作提醒

---

## 📊 配置速查表

```bash
# Session 配置
openclaw config set session.reset.mode idle
openclaw config set session.reset.idleMinutes 43200

# 工具权限配置
openclaw config set tools.sessions.visibility all
openclaw config set tools.profile full

# 查看当前配置
openclaw config get session.reset
openclaw config get tools.sessions.visibility

# 查看 cron job 状态
openclaw cron list
openclaw cron runs <job-id>
```

### 改进方向

1. **更多集成**：接入更多工具（日历、邮件等）
2. **更智能**：用 AI 做更多决策
3. **更稳定**：增加监控和告警

---

## 🆕 新增配置（2026年4月）

### 定时任务配置

```javascript
// AI Agent 资讯推送 - 每天 12:00
{
  "name": "AI Agent 资讯推送",
  "schedule": { "kind": "cron", "expr": "0 12 * * *", "tz": "Asia/Shanghai" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "搜索最新 AI Agent 资讯，推荐 2-3 篇有价值的文章",
    "timeoutSeconds": 300
  },
  "delivery": { "mode": "announce", "channel": "wecom" }
}

// 每日自我提升复盘 - 每天 22:00
{
  "name": "每日自我提升复盘",
  "schedule": { "kind": "cron", "expr": "0 22 * * *", "tz": "Asia/Shanghai" },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "执行自我提升复盘流程...",
    "timeoutSeconds": 300
  },
  "delivery": { "mode": "announce", "channel": "wecom" }
}
```

---

## 🚀 下一步计划

### 短期（1-3 个月）

- [ ] 接入语音输入
- [ ] 开发移动端界面
- [ ] 增加更多自动化场景

### 长期（6-12 个月）

- [ ] 构建团队级 AI 助手
- [ ] 开放给同事使用
- [ ] 沉淀为产品

---

## 📅 2026年4月实战补充：遇到的问题和解决方案

> 4月份是深度使用 OpenClaw 的一个月，累计遇到了10+个实际问题。这里记录最核心的几个，供大家避坑。

---

### �坑8：企业微信授权失效（850003）

**问题现象**：突然无法发送企业微信消息，提示 `unauthorized` 或授权码无效

**发生场景**：
- 04-08：首次发现失效
- 04-20：再次失效
- 04-25：又一次失效

**根本原因**：企业微信的 `agentId` 授权码有时效性，每次配置变更后需要重新授权

**排查步骤**：
```bash
# 1. 检查插件状态
openclaw status

# 2. 查看授权码对应的 agentId
cat ~/.openclaw/extensions/wecom-openclaw-plugin/config.json

# 3. 重新触发授权（企业微信后台操作）
# 企业微信后台 → 应用管理 → 找到对应应用 → 重新获取 AgentId
```

**预防方案**：
1. 记录每次授权码对应的配置
2. 配置变更后第一时间检查功能是否正常
3. 关键提醒任务要有备用通知渠道（微信/邮件）

**教训**：这是最高频的问题，目前还没有彻底解决，需要每次发生时重新授权。

---

### �坑9：MiniMax 模型返回空回复

**问题现象**：模型配置正确，但回复内容为空（`⚠️ No reply from model`）

**发生时间**：04-08

**根本原因**：MiniMax 模型在某些参数组合下推理异常

**解决方案**：切换到其他模型（如 Qwen）

```bash
# 临时切换模型
openclaw config set model minimax/MiniMax-M2.7

# 或者用 Qwen 作为备用
openclaw config set model qwen/qwen3.5-plus

# 验证
openclaw status
```

**经验**：
- 多个模型配置做备用
- 发现空回复立刻切模型
- 记录各模型在不通场景下的表现

---

### 🐞 坑10：Subagent 忘记当前会话进展

**问题现象**：启动 subagent 帮我学习时，过一会儿它就不知道我们学到哪里了

**根本原因**：OpenClaw 每个会话（Session）独立，新会话没有历史记忆

**解决方案**：

**方法1：会话开始时手动提供上下文**

每次开新会话，第一句话就说：
> "我的情况：正在学 Claude Code，已经完成前11个主题，还剩错误处理和Token裁剪两个主题。今天是第5周学习计划第3天。"

**方法2：用 memory 文件传递上下文**

在 subagent 任务开始前，先把关键信息写入 memory 文件：
```markdown
<!-- memory/当前任务.md -->
# 当前任务
- 学习主题：Claude Code 源码解读
- 当前进度：s01_agent_loop.py 已完成
- 下一步：s02_tool_use.py
- 学习目标：理解 Claude Code 核心架构
```

**方法3：利用 OpenClaw 的 memory 机制**

在 AGENTS.md 里设置会话启动时自动读取的上下文文件，让 subagent 一启动就知道完整背景。

---

### 🐞 坑11：每小时归档 Cron 漏掉对话内容

**问题现象**：设置了每小时自动归档，但有些对话内容没有被记录

**根本原因**：Cron 触发时，对话可能还在进行中，内容还没说完，自然捕捉不到

**排查过程**：
1. 检查 cron 任务本身是否正常运行 ✅（12-23点全部成功）
2. 检查归档逻辑 ✅（正常）
3. 发现问题：用户对话中直接告诉我的内容被 cron 漏掉，因为 cron 触发时对话还没结束

**解决方案**：

**核心原则：对话中用户告知的重要内容，立即手动补录到 memory 文件，不依赖 cron**

```markdown
<!-- 对话中立即记录 -->
# 2026-04-25 重要记录

## LeetCode 进展
- 04-25：完成 LeetCode 236（二叉树的最近公共祖先）
- 本周：4/5 题

## tmux 学习
- 已学会基本命令：新建会话、分屏、切换窗口
```

**教训**：cron 归档只能覆盖"已结束"的对话，实时对话内容靠不住。

---

### 🐞 坑12：每周运动打卡提醒 Cron 失败（sessionTarget 缺失）

**问题现象**：Cron Job 报错 `TypeError: Cannot read properties of undefined (reading 'startsWith')`

**发生时间**：04-26

**根本原因**：创建 cron job 时漏了 `sessionTarget` 字段，isolated 类型的 agentTurn 任务必须有这个字段

**错误配置**：
```javascript
// ❌ 缺少 sessionTarget
gatewayToken, name: "每周运动打卡提醒",
schedule: { kind: "cron", expr: "0 20 * * 0", tz: "Asia/Shanghai" },
payload: { kind: "agentTurn", message: "...", timeoutSeconds: 60 }
```

**正确配置**：
```javascript
// ✅ 完整配置
gatewayToken, name: "每周运动打卡提醒",
schedule: { kind: "cron", expr: "0 20 * * 0", tz: "Asia/Shanghai" },
sessionTarget: "isolated",  // ← 必须加
payload: { kind: "agentTurn", message: "...", timeoutSeconds: 60 }
```

**教训**：OpenClaw 的字段校验不够严格，很多报错信息不直接，需要根据经验判断。

---

### 💡 4月份使用经验总结

**1. 双 Agent 协作模式很香**

我现在同时用 OpenClaw 小沐 + Hermes Agent：
- **OpenClaw 小沐**：日常助手、陪伴学习、即时问答
- **Hermes Agent**：专业指导、直接指出问题、代码评审

两者互补，比单一 Agent 效果好很多。

**2. 定时任务要定期检查**

Cron Job 配置后不会主动告诉你失败了，需要定期手动检查：
```bash
openclaw cron list
openclaw cron runs <job-id>
```

**3. Heartbeat 主动模式的价值**

原来 Heartbeat 只是"我还活着"的标志，现在我给它加了主动工作内容：
- 检查学习进度
- 提醒未完成任务
- 推动用户行动

**4. 用 AI 学习 AI 是最高效的模式**

OpenClaw 小沐能看到我的代码，能针对性指导，比看视频教程效率高很多。

---

### 📝 一句话避坑总结（收藏）

| # | 坑 | 一句话解决方案 |
|---|-----|----------------|
| 1 | Session Label 每天消失 | 改 `session.reset.mode` 为 `idle` |
| 2 | 无法查看历史会话 | 改 `tools.sessions.visibility` 为 `all` |
| 3 | Cron "Channel is required" | 给 isolated job 加 `delivery.channel` |
| 4 | Cron 执行超时 | 加 `timeoutSeconds` 到 180-300s |
| 5 | 跨境搜索不稳定 | 用 Tavily 替代 DuckDuckGo |
| 6 | Gateway restart 失败 | 分开执行 stop + start |
| 7 | 企业微信授权失效 | 重新获取 agentId，无解 |
| 8 | MiniMax 空回复 | 切换到 Qwen 备用 |
| 9 | Subagent 忘记进展 | 每次手动提供上下文 |
| 10 | 归档漏掉对话内容 | 重要内容立即手动补录 |
| 11 | Cron sessionTarget 缺失 | agentTurn 必须加 `sessionTarget` |

---

## 📚 学习资源

### 官方文档
- [OpenClaw 文档](https://docs.openclaw.ai)
- [GitHub 仓库](https://github.com/openclaw/openclaw)

### 社区
- [Discord 社区](https://discord.com/invite/clawd)
- [知乎专栏](https://www.zhihu.com/column/openclaw)

### 相关技术
- Node.js
- Cron 表达式
- REST API
- Prompt Engineering

---

**最后：** AI 助手不是一蹴而就的，需要持续迭代。希望我的经验能帮到你！欢迎到我的blog进行交流： [sunrong.site](https://sunrong.site)

> 有问题欢迎交流 🌿
