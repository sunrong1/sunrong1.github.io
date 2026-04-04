---
title: "Claude Code 最佳实践学习笔记：第一周"
date: "2026-04-04"
category: "03-learning"
subCategory: "ai-tools"
tags:
  - Claude Code
  - AI编程工具
  - Agent开发
  - 学习笔记
description: "系统学习 Claude Code 最佳实践项目，第一周聚焦核心概念：Subagents、Commands、Skills 和 Memory"
---

# Claude Code 最佳实践学习笔记：第一周

> 📅 学习日期：2026 年 4 月 4 日  
> 🎯 学习目标：掌握 Claude Code 核心概念，理解 Agentic Coding 工作流

---

## 一、为什么学习这个项目？

在 AI Agent 开发领域，**Claude Code** 是 Anthropic 官方推出的最强编程助手之一。而 [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) 是目前最全面的 Claude Code 最佳实践汇总，包含：

- **6 大核心模块**：Subagents、Commands、Skills、Memory、MCP、Settings
- **65+ 内置命令**：开箱即用的 slash commands
- **5 种 Agent 类型**：覆盖从代码探索到自动化工作流
- **持续更新**：最近更新日期为 2026 年 4 月 3 日

作为一个有 11 年自动化测试经验的工程师，学习 Claude Code 将直接提升你在 **AI Agent 开发**领域的竞争力。

---

## 二、第一周学习计划

### 🎯 学习重点

| 模块 | 优先级 | 预计时间 |
|------|--------|----------|
| Subagents（子代理） | ⭐⭐⭐ | 2 小时 |
| Commands（命令） | ⭐⭐⭐ | 1.5 小时 |
| Skills（技能） | ⭐⭐ | 1.5 小时 |
| Memory（记忆） | ⭐⭐ | 1 小时 |
| MCP Servers | ⭐⭐ | 1 小时 |

---

## 三、核心概念详解

### 3.1 Subagents（子代理）—— 最强大的特性

**Subagent = 在独立上下文中运行的自主执行者**

```yaml
# .claude/agents/<name>.md
name: my-agent
description: 用于处理特定任务的子代理
model: sonnet
tools:
  - Read
  - Write
  - Edit
  - Bash
permissionMode: auto
maxTurns: 10
```

**内置 5 种子代理类型：**

| Agent | 模型 | 工具权限 | 适用场景 |
|-------|------|----------|----------|
| `general-purpose` | inherit | 全部 | 复杂多步骤任务（默认） |
| `Explore` | haiku | 只读 | 快速代码库搜索和探索 |
| `Plan` | inherit | 只读 | 预规划研究，设计实现方案 |
| `statusline-setup` | sonnet | 读写 | 配置状态栏 |
| `claude-code-guide` | haiku | Web搜索 | 回答 Claude Code 功能问题 |

**关键字段说明：**

- `name`：唯一标识符，使用小写字母和连字符
- `description`：使用 `"PROACTIVELY"` 可让 Claude 自动调用
- `tools`：白名单机制，控制子代理权限
- `permissionMode`：权限模式，`auto` 模式下 Claude 自动决定是否安全
- `isolation: "worktree"`：在独立 git worktree 中运行，自动清理

---

### 3.2 Commands（命令）—— 知识注入的快捷方式

**Command = 插入到现有上下文的知识模板**

```yaml
# .claude/commands/<name>.md
name: code-review
description: 执行代码审查
argument-hint: "[pr-number]"
allowed-tools:
  - Bash
  - WebFetch
model: sonnet
effort: high
```

**与 Subagent 的核心区别：**

| 特性 | Command | Subagent |
|------|---------|----------|
| 上下文 | 注入到当前对话 | 独立隔离上下文 |
| 触发方式 | 用户调用 /slash | Claude 自动调用或用户指定 |
| 复杂度 | 简单任务模板 | 复杂多步骤工作流 |
| 适用场景 | 工作流编排 | 独立自主任务 |

**重要字段：**

- `disable-model-invocation: true`：禁止 Claude 自动调用
- `user-invocable: false`：从 `/` 菜单隐藏，仅作为背景知识
- `context: fork`：在独立子代理中运行

---

### 3.3 Skills（技能）—— 可配置的知识单元

**Skill = 可预加载、自动发现的配置化知识**

```yaml
# .claude/skills/<name>/SKILL.md
name: debug-helper
description: 调试辅助技能
argument-hint: "[error-message]"
allowed-tools:
  - Read
  - Bash
paths:
  - "*.ts"
  - "*.js"
```

**内置 5 种官方 Skills：**

| Skill | 功能 |
|-------|------|
| `simplify` | 代码重构，消除重复，提升质量 |
| `batch` | 批量操作，多文件执行命令 |
| `debug` | 调试失败命令或代码问题 |
| `loop` | 循环执行（最多 3 天） |
| `claude-api` | 构建 Claude API 应用 |

**Skills vs Commands：**

- Skills 支持 `paths` 字段，**自动激活**（当访问匹配文件时）
- Skills 支持 `preloadable`，可预加载到子代理上下文
- Skills 支持 **Context Forking** 和 **渐进式Disclosure**

---

### 3.4 Memory（记忆）—— CLAUDE.md 的艺术

**核心原则：CLAUDE.md 是优化 Claude Code 输出最重要的手段**

#### 加载机制（重要！）

```
启动时加载（Ancestor Loading）：
当前目录 → 向上遍历 → 所有祖先目录的 CLAUDE.md

运行时加载（Descendant Loading）：
访问子目录文件时 → 懒加载该子目录的 CLAUDE.md
```

#### 最佳实践

```markdown
# 根目录 CLAUDE.md - 共享规范
## 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新

# frontend/CLAUDE.md - 组件规范
## React 组件
- 使用函数组件 + Hooks
- 命名：PascalCase

# backend/CLAUDE.md - API规范
## REST API
- 使用 RESTful 风格
- 统一错误响应格式
```

**关键点：**
- 祖先目录的 CLAUDE.md **总是**在启动时加载
- 子目录的 CLAUDE.md **懒加载**（访问时才加载）
- 使用 `CLAUDE.local.md` 存储个人偏好（加入 .gitignore）

---

### 3.5 MCP Servers（模型上下文协议服务器）

**MCP = 连接外部工具、数据库、API 的桥梁**

#### 推荐日常使用的 MCP 服务器

| MCP Server | 功能 | 场景 |
|------------|------|------|
| **Context7** | 获取最新库文档 | 防止幻觉API |
| **Playwright** | 浏览器自动化 | 前端测试 |
| **Claude in Chrome** | 连接真实Chrome | 调试用户实际看到的问题 |
| **DeepWiki** | GitHub仓库文档 | 架构分析 |
| **Excalidraw** | 生成架构图 | 系统设计 |

#### 配置示例

```json
// .mcp.json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "playwright": {
      "command": "npx", 
      "args": ["-y", "@playwright/mcp"]
    }
  }
}
```

**三层作用域：**

| 作用域 | 位置 | 用途 |
|--------|------|------|
| 项目级 | `.mcp.json` | 团队共享 |
| 用户级 | `~/.claude.json` | 个人所有项目 |
| 子代理级 | Agent frontmatter | 特定子代理专用 |

---

## 四、第一周学习目标

### ✅ 必须掌握

1. **理解 Subagent 与 Command 的区别**：何时用独立子代理，何时用命令模板
2. **能够创建自定义 Subagent**：编写 agent 配置文件
3. **掌握 Memory 加载机制**：正确组织 CLAUDE.md 文件结构
4. **了解 MCP 核心概念**：连接外部工具的原理

### 🔍 了解即可

- 全部 65+ 内置命令（知道有哪些功能）
- Settings 全部 60+ 配置项（需要时查阅）
- Hooks 生命周期（进阶内容）

---

## 五、练习任务

### 任务 1：创建你的第一个 Subagent

```bash
mkdir -p ~/.claude/agents
# 创建 code-review.md
```

编写一个 `code-review` 子代理，专门用于代码审查。

### 任务 2：组织你的项目 CLAUDE.md

为你的博客仓库创建根目录 CLAUDE.md，包含：
- 项目结构说明
- Git 提交规范
- 文章分类约定

### 任务 3：探索 MCP

安装 Context7 MCP server，体验如何获取最新库文档。

---

## 六、资源链接

- [Claude Code 官方文档](https://code.claude.com/docs)
- [Best Practice GitHub 仓库](https://github.com/shanraisshan/claude-code-best-practice)
- [Official Skills 仓库](https://github.com/anthropics/skills)

---

## 七、总结

第一周的核心是理解 **Claude Code 的架构哲学**：

> **Command → Agent → Skill** 的编排模式

- **Command**：用户调用的工作流模板
- **Subagent**：独立执行的自主代理
- **Skill**：可自动激活的知识单元
- **Memory**：层次化的上下文管理
- **MCP**：扩展能力的桥梁

下一周我们将深入 **Agent Teams（多代理协作）** 和 **Hooks（生命周期钩子）**。

---

*保持学习，持续进化。*
