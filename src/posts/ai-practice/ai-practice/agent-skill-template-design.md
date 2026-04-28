---
date: 2026-03-28
categories:
  - AI 实践
tags:
  - AI Agent
  - Skill 开发
  - 环境运维
  - MCP
  - OpenClaw
author: Mr.Sun
---

# AI Agent 时代的环境运维 Skill 模板设计

> 在 AI Agent 时代，如何快速扩展 AI 的能力边界？答案是：Skill 模板 + AI 自动生成。

## 💡 背景

今天听了 AI 软件测试的演讲，有个观点很启发我：

> "对于 AI 生成的代码测试，测试价值重点会发生转移。AI 的系统级能力较弱，测试重点转移到集成和系统级测试。基础功能风险较低，可以做 Skill，让 AI 根据 Skill 测试。"

这让我想到：Skill 不仅仅是"让 AI 调用工具"，更是**扩展 AI 能力的标准方式**。

---

## 🎯 我的实践

我正在做的"智能环境管理系统"已经搭建好了 MCP Server，现在思考的是：**如何快速扩展 Skill 能力？**

答案是：**先定义 Skill 模板，让 AI 根据模板批量生成 Skill。**

---

## 📋 Skill 模板结构

```
skill-<operation-name>/
├── SKILL.md           # 技能定义
├── skill.json         # 技能配置
├── prompts/
│   ├── system.md      # 系统提示词
│   └── commands/
│       ├── execute.md # 执行命令
│       └── query.md   # 查询命令
└── references/
    └── api-guide.md   # API 设计指南
```

---

## 🔧 核心要素

### 1. SKILL.md - 技能定义

定义技能的基本信息：

```markdown
---
name: <skill-name>
description: <技能一句话描述>
---

# 技能名称

## 输入参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| action | string | 是 | 操作类型 |
| target | string | 是 | 目标环境/设备 |

## 输出格式

```json
{
  "success": true,
  "data": { /* 返回数据 */ },
  "message": "说明"
}
```

## 错误处理

| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| 403 | 权限不足 | 联系管理员 |
| 404 | 目标不存在 | 检查目标ID |
```

### 2. skill.json - 技能配置

定义命令、参数校验、枚举值：

```json
{
  "name": "<skill-name>",
  "version": "1.0.0",
  "commands": [
    {
      "name": "execute",
      "arguments": [
        {
          "name": "action",
          "required": true,
          "enum": ["start", "stop", "restart"]
        },
        {
          "name": "target",
          "required": true
        }
      ]
    }
  ],
  "config": {
    "timeout": 30000,
    "retry": 3,
    "idempotent": true
  }
}
```

### 3. prompts/system.md - 系统提示词

定义 AI 的角色和行为：

```markdown
# 角色定义

你是一个专业的环境运维助手，负责执行环境管理、设备控制等操作。

## 核心能力

1. 环境操作：启动、停止、重启、配置
2. 设备控制：开关控制、参数设置
3. 数据查询：状态、指标、日志

## 工作原则

1. 安全第一：危险操作需要二次确认
2. 幂等设计：重复执行结果一致
3. 日志完整：所有操作可追溯
```

### 4. 执行流程

```
参数校验 → 权限验证 → 执行操作 → 结果确认 → 状态更新
```

---

## 🚀 如何使用

### Step 1: 定义 Skill 元数据

```bash
mkdir skill-<operation-name>
cd skill-<operation-name>
```

### Step 2: 填充模板

根据模板填充占位符，定义具体的操作和参数。

### Step 3: 注册 Skill

将 skill.json 注册到 OpenClaw 或 AgentScope。

### Step 4: 测试验证

```bash
openclaw skills invoke <skill-name> --params {...}
```

---

## 💭 思考

**人的价值在哪？**

- 设计 Skill 模板
- 把握方向（AI 生成的 Skill 需要审核）
- 处理异常情况

** AI 的价值在哪？**

- 快速复制（批量生成 Skill）
- 减少重复劳动
- 不知疲倦地执行

这不就是"带着 AI 走"的真实案例吗？

---

## 📝 后续计划

1. 把现有 Skill 整理成模板
2. 让 AI 学会根据模板生成 Skill
3. 建立 Skill 库，快速扩展能力边界

---

_模板文件已同步到本地，后续会持续完善。_

> 有问题欢迎交流 🌿
