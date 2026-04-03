# Claude Code 完全指南：从入门到精通

> 本文参考自[某白123的微信文章《Claude Code 完全指南》](https://mp.weixin.qq.com/s/5uhudUPNKLYwxZXB0_IH_g)，在此基础上增加了新手指引、国产模型配置和核心配置文件说明。

如果你刚开始接触 Claude Code，可能会被各种功能搞得眼花缭乱。别担心，这份指南将带你系统性地掌握这个强大的工具，从最基础的安装配置讲起，一直到高级的自动化工作流，让你在开发中真正做到事半功倍。

<!-- more -->

## 一、新手指引：快速上手 Claude Code

### 1.1 安装与首次使用

Claude Code 是一个通用的编程 Agent 框架，并不与特定模型绑定。它支持多种编程语言的代码生成、编辑和项目管理。

**安装方式：**

```bash
# 通过 npm 全局安装
npm install -g @anthropic-ai/claude-code

# 或通过 Claude CLI 安装
npm install -g claude-code
```

**首次使用注意事项：**

首次使用时，系统会提示进行身份验证。对于国内用户来讲，通常需要科学上网。如果遇到身份验证问题，可以在 `C:\Users\你的用户名\.claude\settings.json` 里面，添加这一句来跳过身份验证过程：

```json
{
  "includeCoAuthoredBy": false
}
```

### 1.2 新手必学的三个命令

刚接触 Claude Code 时，先掌握这三个最基础的命令：

**1. `/config` - 配置你的工作环境**

输入 `/config` 打开设置面板，建议先设置：
- **语言**：改成中文，沟通更顺畅
- **Output Style**：建议选择"详细解释模式"，让 AI 边做边解释，方便学习

**2. `/init` - 初始化项目**

接手新项目时，在项目目录输入 `/init`。Claude Code 会自动分析项目结构，给你一份清晰的项目导览：

```bash
# 在项目目录下直接输入
/init
```

**3. `/clear` - 清空对话**

完成一个功能开发后，输入 `/clear` 清空所有历史对话，节省 Token，也让新对话更专注。

### 1.3 三种工作模式详解

Claude Code 设计了三种工作模式，理解这些模式的差异是高效使用的关键。

| 模式 | 特点 | 提示标识 | 适用场景 |
|------|------|----------|----------|
| **默认模式** | 每次创建或修改文件前都会征求用户意见 | "For shortcuts" | 重要项目、对代码质量要求高的场景 |
| **自动模式** | 自动处理文件操作，不再反复询问 | "Accept edits on" | 快速原型开发、已经很熟悉工作方式 |
| **规划模式** | 只讨论技术方案，不执行代码编写 | 专门的规划界面 | 架构设计、重大重构、技术方案讨论 |

**切换技巧：** 按 `Shift + Tab` 可以在三种模式间循环切换。

### 1.4 给新手的起步建议

做好这两件事能显著降低学习成本：

1. **先把 Output Style 设为详细解释模式**，让 Claude Code 边做边解释
2. **为每个项目生成 CLAUDE.md**，并在开发中持续更新

当工具越来越"懂"你和你的项目时，学习曲线自然就平缓了。

## 二、国产模型配置：摆脱网络限制

### 2.1 为什么选择国产模型

Claude Code 本质上是一个通用的编程 Agent 框架，并不与特定模型绑定。开发者完全可以通过配置环境变量，使用国产模型如 **DeepSeek、GLM、kimi** 等来驱动 Claude Code。

这对于：
- 国内开发者（无需翻墙）
- 追求性价比（国产模型成本更低）
- 有特定合规要求 的团队

特别有价值。

### 2.2 使用 CC Switch 切换模型

推荐使用 **CC Switch** 工具来自由切换不同的模型：

```bash
# 安装 CC Switch
npm install -g cc-switch

# 查看可用模型
cc-switch list

# 切换到指定模型
cc-switch use deepseek
cc-switch use glm
cc-switch use kimi
```

### 2.3 配置 DeepSeek 模型

**1. 获取 API Key**

前往 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册并获取 API Key。

**2. 配置环境变量**

```bash
# 在 ~/.bashrc 或 ~/.zshrc 中添加
export DEEPSEEK_API_KEY="your-api-key-here"
export CLAUDE_MODEL="deepseek-chat"
```

**3. 在 Claude Code 中使用**

```bash
# 启动时指定模型
claude --model deepseek-chat

# 或在会话中切换
/model deepseek
```

### 2.4 配置 GLM 模型

**1. 获取 API Key**

前往 [智谱AI开放平台](https://open.bigmodel.cn/) 注册并获取 API Key。

**2. 配置环境变量**

```bash
export ZHIPU_API_KEY="your-api-key-here"
export CLAUDE_MODEL="glm-4"
```

### 2.5 配置 Kimi 模型

**1. 获取 API Key**

前往 [Kimi 开放平台](https://platform.moonshot.cn/) 注册并获取 API Key。

**2. 配置环境变量**

```bash
export MOONSHOT_API_KEY="your-api-key-here"
export CLAUDE_MODEL="kimi-chat"
```

### 2.6 模型选择建议

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| **Sonnet** | 速度快，性价比高 | 日常写代码、调试、做小工具 |
| **Opus** | 更聪明，推理能力强 | 架构设计、复杂问题分析 |
| **DeepSeek** | 国产优秀，成本低 | 国内开发者、简单任务 |
| **GLM** | 中文能力强 | 中文项目、文档生成 |
| **Kimi** | 长上下文支持好 | 大型项目分析、长代码审查 |

**建议用法：** 平时用国产模型快速开发，遇到棘手的设计问题时切到 Opus 深度思考。

## 三、核心配置文件详解

### 3.1 settings.json - 全局设置

位置：`~/.claude/settings.json`

```json
{
  "includeCoAuthoredBy": false,
  "model": "claude-sonnet-4-20250514",
  "language": "zh-CN",
  "outputStyle": "explanatory",
  "autoUpdateChannel": "stable"
}
```

**关键配置项说明：**

| 配置项 | 说明 | 推荐值 |
|--------|------|--------|
| `includeCoAuthoredBy` | 跳过身份验证 | `false`（国内用户） |
| `model` | 默认使用模型 | `claude-sonnet-4-20250514` |
| `language` | 界面语言 | `zh-CN` |
| `outputStyle` | 输出风格 | `explanatory` 或 `learning` |
| `autoUpdateChannel` | 更新通道 | `stable`（更稳定） |

### 3.2 CLAUDE.md - 项目说明书

**作用：** 让 Claude Code 为你的项目生成一个"说明书"，放在项目根目录。

**生成方式：**

```
对 Claude Code 说："生成一个 CLAUDE.md，总结本项目的技术栈、目录结构和约定。"
```

**CLAUDE.md 示例：**

```markdown
# 项目名称

## 技术栈
- 前端：Vue 3 + TypeScript
- 后端：Node.js + Express
- 数据库：PostgreSQL
- 构建工具：Vite

## 目录结构
src/
├── components/    # 组件
├── views/         # 页面
├── stores/        # 状态管理
├── api/           # API 接口
└── utils/         # 工具函数

## 开发规范
- 组件命名：大写开头（PascalCase）
- CSS 类名：kebab-case
- API 请求统一封装
- 提交信息格式：[类型] 描述
```

**使用技巧：** 当 Claude Code 理解错了你的项目规则时，及时补充："请把这条规则写进 CLAUDE.md。"

### 3.3 claude.md - 分层配置规则

Claude Code 支持通过 `claude.md` 文件配置规则，而且可以**分层管理**：

**1. 父目录规则**
在项目父目录放一个 `claude.md`，定义通用规则，子项目都能共用。

**2. 语言专属规则**
在 `js`、`python` 等目录放专属的 `claude.md`。

```javascript
// js/claude.md
module.exports = {
  indent: 2,
  singleQuote: true,
  semi: false
};
```

```python
# python/claude.md
indent_size: 4
quote_style: single
```

**3. 避免全部放个人目录**

如果把所有规则都放在用户目录，每次对话都会传输大量规则，**浪费 Token 还多花钱**。这种分层设计既保证了规则共享，又控制了成本。

### 3.4 .claudeignore - 忽略文件

在项目根目录创建 `.claudeignore` 文件，指定 Claude Code 不需要关注的内容：

```gitignore
node_modules/
dist/
build/
.env
*.log
.DS_Store
```

### 3.5 memory.md - 记忆文件

输入 `/memory` 可以直接编辑记忆文件，设置代码风格、开发规范等，让 Claude Code 更符合你的工作习惯。

```markdown
# 我的开发习惯

## 代码风格
- 使用 2 空格缩进
- 始终使用 const，除非需要重新赋值
- 优先使用箭头函数

## 提交规范
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构

## 常用命令
- npm run dev: 启动开发服务器
- npm run build: 生产构建
- npm test: 运行测试
```

## 四、核心功能与日常使用

### 4.1 核心命令速查表

| 命令 | 作用 | 使用频率 |
|------|------|----------|
| `/config` | 打开设置面板 | ⭐⭐⭐ |
| `/clear` | 清空对话历史 | ⭐⭐⭐ |
| `/compact` | 智能压缩上下文 | ⭐⭐⭐ |
| `/init` | 项目导览 | ⭐⭐ |
| `/model` | 切换模型 | ⭐⭐ |
| `/context` | 查看 Token 使用 | ⭐⭐ |
| `/copy` | 复制结果为 Markdown | ⭐⭐ |
| `/export` | 导出完整对话 | ⭐ |
| `/rename` | 重命名对话 | ⭐ |
| `/resume` | 继续历史对话 | ⭐ |
| `/status` | 查看会话状态 | ⭐ |
| `/tasks` | 查看后台任务 | ⭐ |
| `/doctor` | 问题诊断 | ⭐ |

### 4.2 会话管理

**`/rename`** - 给当前对话重命名

长时间开发中会有多个对话。输入 `/rename` 加 Tab，然后起个有意义的名字，比如"用户认证功能开发"，以后找起来更方便。

**`/resume`** - 继续之前的对话

想接着上次没聊完的话题？输入 `/resume` 会列出所有历史对话，选一个就能无缝衔接。

**`/status`** - 实时监控状态

输入 `/status` 可以看到当前会话的详细信息：用的什么模型、还剩多少 Token、大致成本多少。

### 4.3 终端命令无缝集成

不用在多个窗口间切来切去了！Claude Code 可以直接运行终端命令。

输入感叹号（`!`）进入 Bash 模式：

```bash
# 启动开发服务器
! npm run dev

# 查看文件列表
! ls

# 运行测试
! npm test
```

所有操作都在同一个界面完成，这才是真正的"一体化开发环境"。

## 五、高级功能

### 5.1 安全与权限

**终端命令授权**

即使在自动模式下，运行终端命令也需要你授权。Claude Code 提供了三个选项：**单次授权、目录级授权、拒绝**。

**完全权限模式（慎用）**

追求极致效率的话，可以在启动时加上 `--dangerously-skip-permissions` 参数。这样 Claude Code 就获得了完全终端权限，所有操作不再询问。

> 注意：名字里的"dangerously"——确实有风险。虽然正常情况下 Claude Code 不会做破坏性操作，但它理论上拥有了和你一样的系统权限。

**后台任务管理**

启动开发服务器后，服务会阻塞 Claude Code 的交互。按 `Ctrl + B` 可以把服务放到后台运行。输入 `/tasks` 查看所有后台任务，按 K 键终止选中的任务。

**版本回滚**

按 `--rewind` 或双击 ESC 可以进入回滚界面。但要注意：Claude Code 只能回滚它自己写入的文件。通过终端命令创建的文件无法回滚，所以 **Git 还是必不可少的**。

### 5.2 Hook：自动化你的重复工作

Hook 让 Claude Code 在特定时机自动执行任务。输入 `/hooks` 进入配置界面。

**典型应用：代码自动格式化**

配置一个 post-tool-use Hook，在 Claude Code 编辑文件后自动运行 Prettier。这样每次修改完代码，都会自动格式化，保持风格统一。

Hook 可以保存在三个级别：
- 只在本机生效
- 项目团队成员共享
- 个人专属配置

### 5.3 Agent Skill：可复用的任务模板

Agent Skill 就像是给 Claude Code 看的"任务说明书"。在 `~/.claude/skills/` 目录下创建 `skill.md` 文件，定义任务的标准流程。

**使用方式：**
1. Claude Code 自动匹配
2. 用 `/skill-name` 显式调用

### 5.4 Sub-Agent：独立的重型任务处理

有些任务太复杂，不适合在主对话中进行。比如分析几万行代码、生成详细报告。如果这些中间过程都进入主对话，很快就会把上下文窗口塞满。

这时候可以用 Sub-Agent。输入 `/agent` 创建一个独立的 Agent，它在自己的空间里完成任务，只把最终结果返回给主对话。

### 5.5 Plugin：一键部署完整解决方案

Plugin 是把多个 Skill、Agent、Hook 打包在一起的完整解决方案。比如官方提供的"Frontend Design"插件，包含了 UI 设计的最佳实践。

输入 `/plugin` 进入插件管理器，可以浏览、安装、管理插件。

## 六、高效工作流与技巧

### 6.1 规划模式：先想清楚再动手

做大型功能开发或重构时，需要先讨论清楚再写代码。

**解决方案：** 按 `Shift + Tab` 两次进入规划模式。

在这个模式下，Claude Code 只讨论不写码，专注把方案打磨完善。

**技巧：**
- 规划模式下要用 `Shift + Enter` 换行，直接按回车会提交请求
- 按 `Ctrl + G` 打开 VS Code 编辑器，在熟悉的环境里编辑更舒服

### 6.2 实时插话：不用等它做完

传统工具要么等任务结束，要么强制终止。Claude Code 支持**实时插话**：任务执行中，你可以随时插入新指令。

比如让它开发一个游戏，中途你觉得方案不好，直接说"**算了，用另一个方案**"，它会自动理解并调整。这才是真正的智能协作。

### 6.3 不同深度思考

**思考模式切换：** `Alt+T`

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| 关闭思考（Disabled） | 响应速度快 | 日常编码、调试、小型工具开发 |
| 思考模式 | 推理能力更强 | 架构设计、复杂重构、性能优化 |

**深度思考关键字：**

想让 Claude Code 做更深度的分析？在提示词末尾加上特定关键字：

- ` think`：基础思考
- ` think hard`：深度思考
- ` think harder`：更深度思考
- ` ultra think`：极致深度思考

**示例：**
> "这个文件很复杂，分析一下并提出三种重构方案，ultra think"

### 6.4 上下文管理：保持最佳状态

长时间开发后，Claude Code 的上下文会积累大量信息，影响性能和 Token 消耗。

- 定期用 `/compact` 压缩上下文，智能保留核心信息
- 完全不相关的任务切换时，用 `/clear` 清空所有上下文

## 七，最佳实践

### 7.1 根据阶段调整模式

| 阶段 | 推荐模式 | 说明 |
|------|----------|------|
| 快速原型 | 自动模式 | 让 Claude Code 自由发挥 |
| 生产开发 | 默认模式 | 精细控制每个变更 |
| 架构设计 | 规划模式 | 先讨论，确定方案再执行 |

### 7.2 权限管理：安全第一

- **个人学习项目**：可以放宽权限提高效率
- **团队协作项目**：保持严格权限控制
- **生产环境**：绝对不要用 `--dangerously-skip-permissions`

### 7.3 定期清理上下文

定期用 `/compact` 压缩，不相关的任务用 `/clear` 清空。就像电脑内存管理一样，适时的清理让系统运行更流畅。

### 7.4 构建分层配置体系

- **基础规范**写在全局配置
- **技术栈规则**写在对应目录配置
- **项目特定规则**写在项目配置

这样既保证了规则共享，又避免了配置臃肿。

## 八、故障排除

**`/doctor`：问题诊断工具**

Claude Code 行为异常时（比如配置不生效、权限问题），先别急着重装。输入 `/doctor` 让它自动检查配置和环境。

很多常见问题（模型没选对、权限不足、配置冲突）都能通过这个命令直接定位。

## 结语

Claude Code 代表的是一种新的开发范式：将 AI 能力深度融入开发工作流。它的价值不仅在于生成代码的速度，更在于提供了一个完整的、可扩展的智能开发环境。

真正的秘诀在于理解其设计理念：**灵活的模式切换、精细的权限控制、开放的扩展机制、智能的上下文管理**。通过这些特性，Claude Code 成为了一个既强大又可控的合作伙伴。

记住：工具的价值在于如何使用。Claude Code 给了你强大的能力，如何发挥这些能力，取决于你的智慧和实践。保持探索精神，不断尝试新的工作方式，找到最适合你的使用模式，这才是提升开发效率的真正关键。

---

*本文持续更新中，如果你觉得有帮助，欢迎分享给更多的开发者朋友。*
