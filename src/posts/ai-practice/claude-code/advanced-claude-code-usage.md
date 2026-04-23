# Claude Code 进阶用法：从小工到专家

**作者：** max 爸爸  
**日期：** 2026-04-04  
**标签：** Claude Code、AI 编程、效率提升、开发工作流

---

## 前言

Claude Code 是 Anthropic 官方推出的命令行 AI 编程工具，基于 Claude 模型，可以直接在你的终端里帮你写代码、调试、重构。

大多数人对它的用法还停留在"粘贴代码让它改"的阶段。其实它还有很多强大的进阶能力，用好了能让开发效率提升数倍。这篇文章分享我在实际工作中摸索出来的进阶用法。

---

## 1. 用 SPEC.md 管理项目上下文

Claude Code 有个项目级上下文管理机制。通过创建 `SPEC.md` 文件，可以让它"记住"项目的技术栈、代码规范、架构约定等，贯穿整个会话。

### 何时使用

- 新项目开始时
- 接手别人的代码库
- 多人协作项目，需要统一风格

### 示例

```markdown
# SPEC.md

## 技术栈
- Node.js 18+
- TypeScript 5.x
- Express 框架
- PostgreSQL 15

## 代码规范
- 使用 ESM 模块格式
- 所有函数必须有 JSDoc 注释
- 错误处理：统一使用 CustomError 类
- 日志：使用 pino，禁止 console.log

## 架构约定
- 路由层只做参数校验，逻辑下沉到 Service 层
- 数据库操作封装在 Repository 层
- 配置文件使用 .env，不硬编码

## Git 规范
- commit message 格式：type(scope): description
- PR 需要至少 2 个 review approval
- 禁止 force push 到 main 分支
```

### 使用效果

创建 `SPEC.md` 后，Claude Code 在整个会话中都会遵循这些规范，不会写出 `require()` 而不是 `import`，也不会建议你用 `console.log` 调试。

---

## 2. 精准控制：`.claude-ignore` 和指令

和 `.gitignore` 类似，Claude Code 支持 `.claude-ignore` 文件，用于排除不想让 AI 读取的敏感文件。

```text
# .claude-ignore
.env
*.key
credentials.json
node_modules/
dist/
```

### 常用指令

| 指令 | 作用 |
|------|------|
| `/clear` | 清除当前会话上下文 |
| `/web` | 开启网络搜索 |
| `/compact` | 压缩上下文窗口 |
| `/help` | 查看所有可用命令 |
| `--dangerous --backup` | 编辑前自动备份原文件 |

```bash
# 开启网络搜索
claude --web

# 让 Claude Code 自动备份再编辑
claude --dangerous --backup
```

---

## 3. 多文件重构：一次性改造整个模块

这是 Claude Code 最强大的能力之一。当你需要重构一个模块时，它能一次性理解所有相关文件，并进行协调修改。

### 场景：重构认证模块

假设我们要将一个基于 Session 的认证改成 JWT 认证，涉及多个文件：

```
src/
├── auth/
│   ├── session.ts      # 旧的 Session 认证
│   ├── middleware.ts   # 认证中间件
│   └── user.service.ts # 用户服务
└── routes/
    └── api.ts          # API 路由
```

### 操作方法

直接在终端输入：

```bash
# 告诉 Claude Code 要做什么
将 src/auth 目录下的认证逻辑从 Session 改为 JWT，
修改内容包括：session.ts、middleware.ts、user.service.ts
同步更新 routes/api.ts 中所有用到旧认证的地方。
同时确保向后兼容：保留 refreshToken 逻辑。
```

Claude Code 会：
1. 读取所有相关文件
2. 理解模块间的依赖关系
3. 一次性写出所有修改
4. 报告每个文件的变更

### 效果对比

| 方式 | 时间 | 遗漏风险 |
|------|------|----------|
| 手动逐个改 | 30分钟+ | 高（容易漏文件） |
| Claude Code | 2-3分钟 | 低（全局扫描） |

---

## 4. 自动化测试生成

Claude Code 可以根据代码逻辑自动生成单元测试和集成测试。

### 基本用法

```bash
# 为某个文件生成测试
claude src/utils/validator.ts

# 告诉它生成测试
为这个文件生成 Jest 单元测试，要求覆盖所有边界情况。
```

### 进阶：生成测试后直接运行

```
请为 src/services/user.service.ts 生成完整的测试用例。
1. 使用 Jest 框架
2. Mock 所有外部依赖（数据库、缓存）
3. 覆盖正常流程和异常流程
4. 生成后运行 `npm test` 验证
```

### 测试覆盖率提升技巧

指定测试场景的细节：

```bash
# 不好的问法
帮我写测试

# 好的问法
为 login 函数编写测试用例，覆盖以下场景：
- 正确账号密码登录成功
- 密码错误（3次以内）返回错误提示
- 密码错误累计3次账户锁定
- 账户不存在的情况
- 数据库连接失败时的降级处理
```

---

## 5. 调试加速：让 AI 帮你分析 Bug

Claude Code 可以直接读取错误日志和代码，帮你定位问题。

### 场景一：分析报错信息

```bash
# 直接粘贴报错信息
claude

这是什么错误？帮我分析可能的原因：

Error: Cannot read properties of undefined (reading 'map')
    at UserService.getActiveUsers (/app/src/services/user.service.ts:45:21)
    at async UserController.list (/app/src/controllers/user.controller.ts:23:12)
    at async Router.handle (/app/node_modules/express/lib/router.js:45:10)
```

### 场景二：查看代码后定位问题

```
帮我看看 src/services/order.service.ts 的第 78 行到第 120 行，
这个函数有时候返回空数组，但不应该返回空数组。
```

### 场景三：生产环境日志分析

```
分析以下日志，找出导致服务响应慢的根本原因：
[10:23:45] Request received: GET /api/orders
[10:23:45] Query executed in 2345ms: SELECT * FROM orders WHERE...
[10:23:48] Response sent: 200 OK (2987ms)
[10:23:48] Memory usage: 892MB / 1024MB
```

---

## 6. Git 工作流：从分支创建到 Code Review

Claude Code 和 Git 结合得非常好，可以覆盖整个 Git 工作流。

### 创建分支并开发

```bash
claude

从 main 分支创建一个新分支 feature/order-refund，
然后完成以下任务：
1. 在 OrderService 中添加 refund 方法
2. 在 OrderController 中添加 /refund 接口
3. 写好单元测试
4. 提交代码，commit message: feat(order): add refund functionality
```

### 自动生成 Commit Message

```bash
git diff --staged | claude

请根据以下变更生成符合 Conventional Commits 规范的 commit message：
```

### Code Review

```bash
claude

请对当前分支与 main 分支的差异进行 Code Review：
1. 检查代码逻辑问题
2. 找出潜在 Bug
3. 评估代码风格是否一致
4. 提出改进建议

不要修改任何文件，只输出 review 意见。
```

---

## 7. 处理大型代码库

### 按需读取，不要全丢给 AI

```bash
# 不好：整个代码库丢给 AI
claude 请分析这个项目

# 好：指定具体文件和关注点
claude
请分析 src/database 目录下的文件，重点关注：
1. 连接池配置是否合理
2. 是否有 SQL 注入风险
3. 事务使用是否正确
```

### 使用 `--max-tokens` 控制输出

对于大型代码库，不要期望一次完成所有分析：

```bash
# 分批次处理
claude --max-tokens 4000
先分析 src/models 目录下的所有模型定义，
总结每个模型的职责和关联关系。
```

### 增量分析大型重构

```
分三步完成这个重构：
第一步：分析 src/v1 目录，列出所有需要迁移的 API
第二步：设计 src/v2 的目录结构和接口
第三步：执行迁移，同时保留 v1 的兼容层
每步完成后请停下来，让我确认再继续。
```

---

## 8. 快捷键和效率技巧

### 交互模式快捷键

| 快捷键 | 作用 |
|--------|------|
| `Ctrl+C` | 取消当前操作 |
| `Ctrl+G` | 生成文件并退出 |
| `Ctrl+D` | 退出 Claude Code |
| `Tab` | 自动补全提示 |
| `↑/↓` | 命令历史切换 |

### 管道操作

```bash
# 读取文件内容后让 Claude 分析
cat src/utils/helper.ts | claude --model sonnet "优化这个工具函数"

# Git diff 结果直接给 Claude
git diff HEAD~5 | claude "总结这5次提交的主要变更"

# 分析测试覆盖率报告
npx jest --coverage --json | claude "解读这个测试覆盖率报告，找出测试薄弱的地方"
```

### 批量操作

```bash
# 重命名多个文件
claude
将 src/components 目录下所有 Button 组件改名为 ActionButton：
1. 重命名文件
2. 更新文件内的 export 名称
3. 更新所有 import 引用
4. 检查是否有遗漏的引用
```

---

## 9. 自定义指令：让 AI 更懂你的项目

通过 `.claude` 目录下的 `commands.md` 可以定义项目的自定义命令。

```markdown
# .claude/commands.md

# 测试驱动开发
> 执行 TDD 流程：先写测试，再写实现

1. 根据接口定义先写测试
2. 运行测试确认失败
3. 编写最小实现让测试通过
4. 重构优化

# 安全检查
> 检查代码安全漏洞

1. SQL 注入检查
2. XSS 漏洞检查
3. 敏感信息硬编码检查
4. 依赖包漏洞扫描
```

使用自定义命令：

```bash
# 执行 TDD 流程
claude /tdd 为 UserService 添加一个新的 createUser 方法

# 执行安全检查
claude /security-check
```

---

## 10. 常见坑与避坑指南

### 坑一：上下文丢失

Claude Code 的上下文窗口有限，长会话后可能会"忘记"之前的内容。

**避坑方法：**
- 定期用 `/compact` 压缩上下文
- 重要结论写进 SPEC.md
- 大任务拆成多个小任务

### 坑二：自动覆盖未备份

Claude Code 编辑文件时默认直接覆盖。

**避坑方法：**
- 生产环境始终加 `--backup`
- 重要文件改前手动 `git commit`

### 坑三：过度依赖 AI

有人开始不加思考地接受所有 AI 建议。

**避坑方法：**
- AI 建议永远要自己 review
- 理解代码逻辑，而不是盲目复制
- 关键模块必须自己写测试验证

### 坑四：网络搜索结果不稳定

`/web` 模式的网络搜索有时会返回过时信息。

**避坑方法：**
- 重要技术问题交叉验证多个来源
- 查看官方文档为准
- 指定具体版本号

---

## 总结

Claude Code 远不止是一个"代码补全工具"。它的真正威力在于：

1. **全局视角**：能一次性理解整个代码库
2. **自动化**：把重复性工作自动化
3. **协作能力**：帮你做 Code Review、生成文档
4. **快速迭代**：缩短"想清楚"到"写出来"的距离

关键是要把它当成一个超级助手，而不是一个命令执行器。你指挥得越精准，它发挥得越好。

---

**下一步：**

- 试试本文介绍的一个技巧，用在下一个任务里
- 持续迭代自己的使用习惯，形成最佳实践
- 和团队分享，一起提升团队开发效率

---

*如果你也有 Claude Code 的进阶技巧，欢迎交流！*
