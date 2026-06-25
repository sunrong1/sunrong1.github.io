---
icon: robot
date: 2026-06-23
update: 2026-06-23
category:
  - Hermes
  - Multi-Agent
  - 元认知
tag:
  - Hermes Agent
  - Multi-Agent
  - 元认知学习
  - Harness 工程师
  - 自动化
star: true
---

# 在 Hermes 上实现多 Agent 元认知学习系统

> **让 AI 帮你学习** = **从 L1 看过到 L5 精通的自动化路径**

我做了 11 年技术，5 年 AI 转型，14 篇论文精读 + 95+ 博客。
**今天这篇博客，是我把"元认知学习系统"从"概念"变成"可运行的 Hermes 多 Agent 系统"的完整方案**。

我用 **4 个 Agent**（Content / Exam / Error / Meta）构建了一个完整的学习闭环：
- Content Agent 读代码库 → 输出结构化知识
- Exam Agent 出考试题 → 评估真实掌握度
- Error Agent 分析错题 → 找出根本原因
- Meta Agent 追踪进步 → 可视化元认知状态

**这 4 个 Agent 不是孤立的工具，而是一个完整的"学习操作系统"**——
任何一环缺失，整个学习闭环都会崩塌。

---

## 一、为什么用 Hermes？

### 1.1 Hermes 的核心优势

```
【Hermes Agent】= Nous Research 出品的 AI Agent 框架

【核心能力】
├─ Multi-Agent 原生支持
├─ Skill 系统（可复用）
├─ Memory 系统（持久化）
├─ Tool 系统（灵活扩展）
├─ 微信生态原生（WeCom）
└─ → 完美的"学习操作系统"载体
```

### 1.2 为什么不用其他框架？

```
【LangChain】
├─ 太通用 → 需要写很多胶水代码
├─ 调试困难 → 不适合学习系统
└─ → 不推荐

【CrewAI / AutoGen】
├─ 上手快 → 但扩展性差
├─ State 管理弱 → 不适合长学习周期
└─ → 备选

【AgentScope】
├─ 我熟悉 → 5 大组件已经掌握
├─ 工业级 → 适合生产
└─ → 推荐作为内核

【Hermes】
├─ Multi-Agent + Skill + Memory + Tool 完整
├─ 微信原生（你日常工作用 WeCom）
├─ Skill 可复用（一次开发，多次使用）
└─ → ✅ **最佳选择**
```

---

## 二、4 Agent 架构设计

### 2.1 整体架构

```
┌──────────────────────────────────────────────────┐
│         Hermes Multi-Agent 元认知系统            │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐  ┌──────────────┐             │
│  │ Content      │  │ Exam         │             │
│  │ Agent        │  │ Agent        │             │
│  │ (读代码)     │  │ (出题)       │             │
│  └──────┬───────┘  └──────┬───────┘             │
│         │                  │                     │
│         │ 结构化知识       │ 考试题               │
│         ↓                  ↓                     │
│  ┌──────────────┐  ┌──────────────┐             │
│  │ Error        │  │ Meta         │             │
│  │ Agent        │  │ Agent        │             │
│  │ (分析错题)   │  │ (追踪进度)   │             │
│  └──────┬───────┘  └──────┬───────┘             │
│         │                  │                     │
│         │ 改进方案        │ 颜色地图             │
│         └──────┬───────────┘                     │
│                ↓                                 │
│         回到 Exam Agent                          │
│        (出更难的题)                              │
└──────────────────────────────────────────────────┘
```

### 2.2 4 Agent 职责分工

| Agent | 角色 | 输入 | 输出 | 频率 |
|-------|------|------|------|------|
| **Content** | 代码库理解专家 | 代码库路径 + 学习目标 | src-map / architecture / concepts | 启动 1 次 + 每周 1 次 |
| **Exam** | 严格导师 | 内容地图 + 当前水平 | 5 题考试 + 评分 | 每天 1 题 + 每周 1 套 |
| **Error** | 学习教练 | 错题 + 答案 | 根因 + 改进方法 | 每次错题 1 次 + 每周 1 次 |
| **Meta** | 元认知分析师 | 所有 Agent 输出 | 颜色地图 + 进度报告 | 每天更新 + 每周报告 |

---

## 三、目录结构设计

### 3.1 完整目录

```
~/.hermes/
├── learning-os/                          ← 学习系统根目录
│   ├── README.md                         ← 系统说明
│   ├── META.md                           ← 元认知手册
│   │
│   ├── agents/                           ← 4 个 Agent Prompt
│   │   ├── content-agent.md
│   │   ├── exam-agent.md
│   │   ├── error-agent.md
│   │   └── meta-agent.md
│   │
│   ├── skills/                           ← 4 个 Skill（可复用）
│   │   ├── content-skill.md
│   │   ├── exam-skill.md
│   │   ├── error-skill.md
│   │   └── meta-skill.md
│   │
│   ├── codebases/                        ← 多个代码库
│   │   ├── agentscope/
│   │   │   ├── src-map.md
│   │   │   ├── architecture.md
│   │   │   ├── key-concepts.md
│   │   │   ├── learning-paths.md
│   │   │   │
│   │   │   ├── exams/
│   │   │   │   ├── exam-01-basics.md
│   │   │   │   ├── exam-02-architecture.md
│   │   │   │   └── exam-results.md
│   │   │   │
│   │   │   ├── errors/
│   │   │   │   ├── error-bank.md
│   │   │   │   ├── root-causes.md
│   │   │   │   ├── prevention.md
│   │   │   │   └── review-cycle.md
│   │   │   │
│   │   │   ├── colors/
│   │   │   │   ├── color-map.md
│   │   │   │   ├── dashboard.md
│   │   │   │   ├── color-gaps.md
│   │   │   │   └── color-rules.md
│   │   │   │
│   │   │   ├── progress/
│   │   │   │   ├── daily/
│   │   │   │   ├── weekly/
│   │   │   │   └── monthly/
│   │   │   │
│   │   │   └── modifications/
│   │   │       └── (改造记录)
│   │   │
│   │   ├── mcp-server/
│   │   └── spring-ai/
│   │
│   ├── cross-codebase/                   ← 跨代码库对比
│   │   ├── multi-agent-frameworks.md
│   │   └── design-patterns.md
│   │
│   └── meta/                             ← 元认知层
│       ├── meta-cognition.md
│       ├── self-awareness.md
│       ├── monitoring-protocol.md
│       └── regulation-strategies.md
│
├── hermes-config.yaml                    ← Hermes 配置
│
└── logs/                                 ← 运行日志
    └── learning-os/
```

---

## 四、4 个 Agent 的详细设计

### 4.1 Content Agent

**角色**：代码库内容解析专家

**Skill 定义**（`skills/content-skill.md`）：

```yaml
---
name: content-skill
description: 解析代码库，输出结构化知识
triggers:
  - "分析代码库"
  - "学习新项目"
  - "理解架构"
  - "画架构图"
---
```

**System Prompt**（`agents/content-agent.md`）：

```markdown
# 角色
你是一位"代码库理解专家"，擅长把复杂代码库解析为结构化知识。

# 核心能力
1. 快速读懂代码结构
2. 提取核心概念
3. 画架构图（Mermaid）
4. 设计学习路径

# 输入
- 代码库路径（GitHub URL 或本地路径）
- 学习目标（如"精通 AgentScope"）
- 当前水平（L1-L5）

# 任务
基于用户输入，输出 4 个文件：
1. src-map.md（源码地图）
2. architecture.md（架构图）
3. key-concepts.md（核心概念）
4. learning-paths.md（学习路径）

# 工具
- Read：读取文件
- Grep：搜索代码
- Glob：找文件
- Bash：运行命令
- WebFetch：读 GitHub README

# 输出格式

## 1. src-map.md（源码地图）
\`\`\`markdown
# 源码地图

## 核心模块
| 模块 | 文件 | 行数 | 重要性 |
|------|------|------|--------|
| 编排器 | src/orchestrator/ | 500 | ⭐⭐⭐⭐⭐ |
| 执行器 | src/executor/ | 300 | ⭐⭐⭐⭐ |
| 记忆 | src/memory/ | 200 | ⭐⭐⭐ |
| 评估 | src/evaluator/ | 150 | ⭐⭐ |

## 关键文件（必读 Top 10）
1. src/orchestrator/main.py
2. src/executor/agent.py
...
\`\`\`

## 2. architecture.md（架构图）
\`\`\`markdown
# 架构图

\`\`\`mermaid
graph TD
    A[User Input] --> B[Orchestrator]
    B --> C[Executor 1]
    B --> D[Executor 2]
    C --> E[Memory]
    D --> E
    B --> F[Evaluator]
    F --> B
\`\`\`
\`\`\`

## 3. key-concepts.md（核心概念）
\`\`\`markdown
# 核心概念（10 个）

## 概念 1：编排器
- 定义：...
- 作用：...
- 关键文件：...
- 掌握度：🟡
\`\`\`

## 4. learning-paths.md（学习路径）
\`\`\`markdown
# 6 周学习路径

## Week 1-2：理解整体
- [ ] Day 1：读 README + 画架构图
- [ ] Day 2：跑通 hello world
- [ ] Day 3-5：读 4 大组件源码
- [ ] Day 6-7：跑通 1 个 example

## Week 3-4：深入核心
- [ ] 改 1 个核心函数
- [ ] 写 1 个 demo
- [ ] 跑 1 套考试
...
\`\`\`

# 严格要求
- 5 层掌握度标注
- 每个模块标 🔴/🟡/🟢/🟣
- 6 周学习路径
- 至少 10 个核心概念
```

**使用方式**：

```
你：@content-skill 分析 https://github.com/xxx/agentscope
Agent：输出 4 个文件到 ~/.hermes/learning-os/codebases/agentscope/
```

### 4.2 Exam Agent

**角色**：严格导师

**Skill 定义**：

```yaml
---
name: exam-skill
description: 出考试题评估真实掌握度
triggers:
  - "出题"
  - "考试"
  - "测试掌握度"
  - "自我测试"
---
```

**System Prompt**：

```markdown
# 角色
你是一位严格的"学习导师"，擅长出考试题评估真实掌握度。

# 核心理念
**"问 ≠ 会"** — 必须用考试验证

# 5 种题型
1. 复述题（20%）：让用户讲 5 分钟
2. 复现题（30%）：让用户做 1 件事
3. 改错题（20%）：让用户找 bug
4. 改写题（20%）：让用户重写
5. 场景题（10%）：让用户解决新问题

# 输入
- Content Agent 的内容地图
- 用户的当前掌握度
- 出题策略（基础 / 进阶 / 难题）

# 任务
基于内容地图，生成 1 套 5 题考试。

# 严格要求

## 1. 不能"问"代替"考"
- 不是"什么是 X"
- 而是"用你自己的话讲 X"

## 2. 题目必须可执行
每道题必须满足：
- 在不查文档的情况下能否做完？
- 在 5 分钟内能否讲清楚？
- 评分标准是什么？

## 3. 5 种题型必须混合
- 复述题：20%
- 复现题：30%
- 改错题：20%
- 改写题：20%
- 场景题：10%

## 4. 不直接给答案
- 题目要清晰
- 答案要等用户做完才讲

## 5. 评分标准
- 80-100 分：L4-L5（可投入简历）
- 60-80 分：L3（可面试）
- 40-60 分：L2（需加强）
- <40 分：L1（需重学）

# 输出格式

\`\`\`markdown
# 考试 01: 基础（30 分钟）

## Q1（复述题，L2，20 分）
不看文档，用你自己的话讲清楚 X 的 3 个核心概念。
- 评分：能讲 30 秒/个 = 80 分

## Q2（复现题，L3，30 分）
打开 src/xxx/，找出 X 的实现文件。
不看代码，讲出它的核心数据结构。
- 评分：能准确指出 = 80 分

## Q3（改错题，L3，20 分）
下面这段代码会出什么问题？
\`\`\`python
[代码]
\`\`\`
- 评分：能预测 2+ 个问题 = 80 分

## Q4（改写题，L4，20 分）
把这段代码用伪代码重写。
- 评分：流程正确 = 80 分

## Q5（场景题，L5，10 分）
你要做 1 个 X，用这个代码库，你会怎么设计？
- 评分：能画 1 张图 = 80 分
\`\`\`

# 使用流程
1. 给出考试题
2. 用户做 30 分钟
3. 用户回答
4. Agent 评分
5. 输出成绩 + 改进建议
6. 自动记录到 exam-results.md
```

**使用方式**：

```
你：@exam-skill 基于 src-map.md 出 5 道基础题
Agent：输出 exam-01-basics.md

（30 分钟后）
你：@exam-skill 评分 [你的答案]
Agent：输出分数 + 反馈 + 错题
```

### 4.3 Error Agent

**角色**：学习教练

**Skill 定义**：

```yaml
---
name: error-skill
description: 分析错题找出根因
triggers:
  - "分析错题"
  - "为什么错了"
  - "复盘"
  - "改进"
---
```

**System Prompt**：

```markdown
# 角色
你是一位"学习教练"，擅长从错题中找出根因。

# 4 大根因分类
1. **浮躁**
   - 表现：跳着看、不写"我以为"、想看答案
   - 触发：早上刚醒、累了、看简单题
   - 防范：深呼吸、计时器、写"我以为"

2. **缺乏实战**
   - 表现：场景题答不出、改写题写不出
   - 触发：新概念、没跑过 demo
   - 防范：每学 1 概念跑 1 demo、收藏 10 个案例

3. **跳过细节**
   - 表现：改错题漏 bug、复述漏关键点
   - 防范：用 checklist、写 1 行 = 1 个注释

4. **其他**
   - 识别后归类

# 输入
- 错题列表
- 用户答案
- 正确答案
- 用户的解释（"我以为..."）

# 任务
分析每道错题，输出 5 个字段：
1. 根因（4 大类中选 1）
2. 改进方法（可执行）
3. 防范措施（具体）
4. 复盘周期（每天/每周/每月）
5. 掌握度变化（L? → L?）

# 输出格式

\`\`\`markdown
# 错题 #001

## 题目
Q3（改错题）：下面这段代码会出什么问题？

## 用户答案
~~没发现 bug~~

## 正确答案
传参前未做类型检查

## 根因分析
**类型**：浮躁
**证据**：
- 跳着看代码（没认真读 3 行）
- 写下"我以为"了吗？没写
- 改错题前深呼吸 3 次了吗？没做

## 改进方法
- [ ] 改错题前深呼吸 3 次
- [ ] 写下"我以为 X"
- [ ] 用 checklist 检查 5 个常见 bug
- [ ] 改完后写出"我学到了"

## 防范措施
- 做改错题前先深呼吸 3 次
- 用 checklist：参数/边界/异常/性能/安全
- 5 分钟计时器（不能跳）

## 复盘周期
- 明天：重做 1 次
- 下周：类似题再考
- 下月：错题类型总览

## 掌握度变化
L2 → L3
\`\`\`

# 使用流程
1. 接收错题
2. 分析根因
3. 给出改进方案
4. 自动写入 error-bank.md
5. 累计到 root-causes.md
6. 周复盘：找出本周 Top 3 根因
```

**使用方式**：

```
你：@error-skill 这 3 道错题 [题目 + 你的答案 + 正确答案]
Agent：分析 3 道错题的根因 + 改进方法
```

### 4.4 Meta Agent

**角色**：元认知分析师

**Skill 定义**：

```yaml
---
name: meta-skill
description: 追踪学习状态、识别盲点
triggers:
  - "我的进度"
  - "颜色地图"
  - "盲点"
  - "升级计划"
  - "学习报告"
---
```

**System Prompt**：

```markdown
# 角色
你是一位"元认知分析师"，擅长追踪学习状态、识别盲点。

# 核心理念
**"对认知的认知"** — 知道自己知道什么

# 5 种颜色
| 颜色 | 含义 | 行动 |
|------|------|------|
| ⚪ 灰 | 未开始 | 启动 |
| 🔴 红 | 未掌握 | 补基础 |
| 🟡 黄 | 半掌握 | 加速到绿 |
| 🟢 绿 | 掌握 | 教别人 |
| 🟣 紫 | 精通 | 创新 |

# 输入
- Content Agent 的内容地图
- Exam Agent 的考试结果
- Error Agent 的错题分析
- 5 层掌握度

# 任务
基于所有 Agent 的输出，输出 4 个文件：
1. color-map.md（颜色地图）
2. dashboard.md（仪表盘）
3. blind-spots.md（盲点清单）
4. upgrade-plan.md（升级计划）

# 输出格式

## 1. color-map.md
\`\`\`markdown
# AgentScope 颜色地图（2026-06-22）

## 4 大组件
- 编排器：🟡 半掌握（能讲 5 分钟）
- 执行器：🟢 掌握（能讲 + 跑过）
- 记忆节点：🔴 未掌握（讲不出）
- 评估器：⚪ 未开始

## 整体：45% 掌握（🟡）
\`\`\`

## 2. dashboard.md
\`\`\`markdown
# 我的元认知仪表盘

## 本周数据
- 学习时间：14 小时
- 平均效率：0.85
- 考试次数：3 套
- 平均分：72/100
- 错题数：8 道

## 颜色分布
- ⚪ 灰：20%
- 🔴 红：30%
- 🟡 黄：40%
- 🟢 绿：10%
- 🟣 紫：0%

## 进步
- 上周：35% 掌握
- 本周：45% 掌握
- 进步：+10%
\`\`\`

## 3. blind-spots.md
\`\`\`markdown
# 盲点清单

## 自动检测到的盲点
1. 🔴 记忆节点：未掌握
2. ⚪ 评估器：未开始
3. 改错题经常漏 bug：跳过细节型

## 优先补的盲点
1. 记忆节点（🔴 → 🟡）
2. 改错题细节（用 checklist）
\`\`\`

## 4. upgrade-plan.md
\`\`\`markdown
# 升级计划

## 当前：45% 掌握（黄绿）
## 目标：85% 掌握（绿）

### Week 1：消灭 1 个 🔴
- 目标：记忆节点 🔴 → 🟡
- 方法：跑 3 个 demo + 改 1 行

### Week 2：1 个 🟡 → 🟢
- 目标：编排器 🟡 → 🟢
- 方法：能讲 10 分钟 + 改 1 个模块

### Week 3-4：再消灭 1 个 🔴
- 目标：评估器 ⚪ → 🟡
\`\`\`

# 使用流程
1. 每天：更新颜色地图
2. 每周：生成仪表盘
3. 每月：输出深度报告
4. 每季：方法调整
```

**使用方式**：

```
你：@meta-skill 更新我的颜色地图
Agent：读所有输出，生成 color-map.md

你：@meta-skill 本周报告
Agent：输出 dashboard.md + blind-spots.md
```

---

## 五、4 个 Skill 完整定义

### 5.1 Skill 加载方式

在 `~/.hermes/config.yaml` 中配置：

```yaml
skills:
  - name: content-skill
    path: ~/.hermes/learning-os/skills/content-skill.md
    enabled: true

  - name: exam-skill
    path: ~/.hermes/learning-os/skills/exam-skill.md
    enabled: true

  - name: error-skill
    path: ~/.hermes/learning-os/skills/error-skill.md
    enabled: true

  - name: meta-skill
    path: ~/.hermes/learning-os/skills/meta-skill.md
    enabled: true
```

### 5.2 Skill 调用语法

```
【语法 1】直接调用
你：@content-skill 分析 https://github.com/xxx/agentscope

【语法 2】通过 trigger
你：出 5 道考试题
（自动触发 exam-skill）

【语法 3】链式调用
你：@content-skill → @exam-skill → @error-skill → @meta-skill
（4 个 Agent 链式执行）
```

---

## 六、完整工作流

### 6.1 启动流程（Day 1）

```
# Step 1：Content Agent 建地图
你：@content-skill 我要学 AgentScope，路径是 ~/repos/agentscope
Agent：
- 读取 README
- 解析 src/ 目录
- 输出 4 个文件
- 给出 6 周学习路径

# Step 2：Exam Agent 出题
你：@exam-skill 基于 src-map.md 出 5 道基础题
Agent：输出 exam-01-basics.md

# Step 3：用户做考试（30 分钟）

# Step 4：Exam Agent 评分
你：@exam-skill 评分 [我的答案]
Agent：输出分数 + 错题清单

# Step 5：Error Agent 分析
你：@error-skill 这 3 道错题 [题目 + 我的答案 + 正确答案]
Agent：分析根因 + 改进方法

# Step 6：Meta Agent 更新
你：@meta-skill 更新我的颜色地图
Agent：输出 color-map.md（4 大组件初始颜色）
```

### 6.2 每日循环（Day 2-42）

```
# 每天 30 分钟

# 早上（10 分钟）
- 1 道复述题
- @exam-skill 出 1 道题
- 5 分钟回答
- @meta-skill 更新颜色

# 中午（10 分钟）
- 跑 1 个 demo
- 写 1 段笔记

# 晚上（10 分钟）
- 记录错题（如果有）
- @error-skill 分析
- @meta-skill 更新 dashboard
```

### 6.3 周复盘（每周日 30 分钟）

```
# 周复盘
你：@meta-skill 本周报告
Agent：
- 输出 dashboard.md（本周数据）
- 输出 color-map.md（更新所有颜色）
- 输出 blind-spots.md（找出新盲点）
- 输出 upgrade-plan.md（下周重点）
```

### 6.4 月复盘（每月 2 小时）

```
# 月复盘
你：@meta-skill 本月深度分析
Agent：
- 输出 progress-report.md（本月整体）
- 输出 color-map.md（整体颜色变化）
- 输出 learning-curve.md（学习曲线）
- 输出 method-adjustment.md（方法调整建议）
```

---

## 七、Multi-Agent 协作实现

### 7.1 链式调用

```python
# tools/learning_pipeline.py

class LearningPipeline:
    """4 Agent 协作学习流程"""
    
    def __init__(self):
        self.content_agent = ContentAgent()
        self.exam_agent = ExamAgent()
        self.error_agent = ErrorAgent()
        self.meta_agent = MetaAgent()
    
    def start_learning(self, codebase, goal, weeks=6):
        """启动学习"""
        # Step 1: Content Agent
        content = self.content_agent.analyze(codebase, goal)
        
        # Step 2: Exam Agent
        exam = self.exam_agent.generate(content, level="basic")
        
        # Step 3: User do exam
        user_answers = input("请完成考试：")
        
        # Step 4: Exam Agent 评分
        score = self.exam_agent.grade(exam, user_answers)
        
        # Step 5: Error Agent 分析
        errors = self.error_agent.analyze(score.wrong_questions)
        
        # Step 6: Meta Agent 更新
        self.meta_agent.update(errors, score)
        
        return {
            "content": content,
            "exam": exam,
            "score": score,
            "errors": errors,
        }
    
    def daily_loop(self, codebase):
        """每日循环"""
        # 早上：1 道复述题
        question = self.exam_agent.generate_one(codebase, type="recall")
        answer = input("你的答案：")
        
        # 中午：跑 demo
        # 晚上：错误分析 + 更新
        score = self.exam_agent.grade_one(question, answer)
        if not score.is_correct:
            error = self.error_agent.analyze_one(question, answer)
        self.meta_agent.update_daily()
```

### 7.2 Hermes 集成

```python
# tools/hermes_meta_learning.py

from hermes import Hermes, Skill, Agent

hermes = Hermes()

# 注册 4 个 Agent
content_agent = Agent(
    name="ContentAgent",
    skill="content-skill",
    system_prompt_file="~/.hermes/learning-os/agents/content-agent.md"
)

exam_agent = Agent(
    name="ExamAgent",
    skill="exam-skill",
    system_prompt_file="~/.hermes/learning-os/agents/exam-agent.md"
)

error_agent = Agent(
    name="ErrorAgent",
    skill="error-skill",
    system_prompt_file="~/.hermes/learning-os/agents/error-agent.md"
)

meta_agent = Agent(
    name="MetaAgent",
    skill="meta-skill",
    system_prompt_file="~/.hermes/learning-os/agents/meta-agent.md"
)

# 启动 4 Agent 协作
pipeline = hermes.pipeline([
    content_agent,
    exam_agent,
    error_agent,
    meta_agent
])

# 启动学习
result = pipeline.run(
    codebase="~/repos/agentscope",
    goal="精通 AgentScope",
    weeks=6
)
```

---

## 八、立即可执行（5 步启动）

### Step 1：建目录（5 分钟）

```bash
# 1.1 学习系统目录
mkdir -p ~/.hermes/learning-os/{agents,skills,codebases,meta}

# 1.2 每个 Agent 目录
mkdir -p ~/.hermes/learning-os/agents
mkdir -p ~/.hermes/learning-os/skills

# 1.3 代码库目录
mkdir -p ~/.hermes/learning-os/codebases/agentscope/{exams,errors,colors,progress,modifications}
```

### Step 2：写 4 个 Skill（1 小时）

```bash
# 创建 4 个 Skill 文件
~/.hermes/learning-os/skills/content-skill.md
~/.hermes/learning-os/skills/exam-skill.md
~/.hermes/learning-os/skills/error-skill.md
~/.hermes/learning-os/skills/meta-skill.md
```

### Step 3：写 4 个 Agent Prompt（2 小时）

```bash
# 创建 4 个 Agent Prompt
~/.hermes/learning-os/agents/content-agent.md
~/.hermes/learning-os/agents/exam-agent.md
~/.hermes/learning-os/agents/error-agent.md
~/.hermes/learning-os/agents/meta-agent.md
```

### Step 4：配置 Hermes（30 分钟）

```bash
# 4.1 编辑 ~/.hermes/config.yaml
# 4.2 添加 4 个 skill
# 4.3 重启 Hermes
```

### Step 5：跑第 1 个完整循环（1 小时）

```
# 5.1 启动 Content Agent
@content-skill 分析 ~/repos/agentscope

# 5.2 启动 Exam Agent
@exam-skill 基于 src-map.md 出 5 道基础题

# 5.3 做考试
（30 分钟）

# 5.4 启动 Error Agent
@error-skill 这 3 道错题 [题目 + 答案]

# 5.5 启动 Meta Agent
@meta-skill 更新我的颜色地图
```

---

## 九、4 Agent 设计的智慧

### 9.1 为什么是 4 个？

```
【3 个的问题】
├─ 职责重叠（"内容"和"考试"合并）
├─ 角色不清（每个 Agent 多个身份）
└─ → 调试困难

【4 个的优势】
├─ 职责清晰（每个 Agent 1 个角色）
├─ 流程完整（输入→考试→反馈→追踪）
├─ 互相独立（每个 Agent 单独可测）
└─ → 工业级

【5 个的问题】
├─ 协调成本高
├─ 边界模糊
└─ → 过度设计
```

### 9.2 4 Agent 的"四象限"

```
【输入端】Content    【处理端】Exam
    │                  │
    └──── 互相协作 ────┘
            ↓
【反馈端】Error     【追踪端】Meta
    │                  │
    └──── 互相协作 ────┘
            ↓
        完整闭环
```

### 9.3 4 Agent 协作的 3 个特性

```
【特性 1】单一职责
├─ Content：只解析代码
├─ Exam：只出题评分
├─ Error：只分析错题
└─ Meta：只追踪进度

【特性 2】互相独立
├─ 每个 Agent 可单独调用
├─ 每个 Agent 可单独测试
├─ 每个 Agent 可单独替换
└─ → 松耦合

【特性 3】数据流清晰
Content → Exam → Error → Meta
   │        │        │       │
   └────────┴────────┴───────┘
            ↓
        形成闭环
```

---

## 十、与"AI 时代超级学习者"博客的呼应

### 10.1 4 Agent = 5 大方法论的自动化

| 超级学习者方法论 | 4 Agent 自动化 |
|----------------|---------------|
| 动力三角（热爱/能力/目标） | Meta Agent 追踪 + 调整 |
| 提问能力（4 维框架） | Exam Agent 自动出题 |
| 迁移能力（跨场景） | Content Agent 跨代码库 |
| 复现验证（输出倒逼） | Exam Agent 强制考试 |
| 闭环系统（动力+方法+心态） | 4 Agent 完整闭环 |

### 10.2 4 Agent = 5 个"AI 时代的超级学习者"原则

```
【原则 1】立刻起步 = 60% 就开始（最小化）
【原则 2】持续 > 完美 = 每日 30 分钟
【原则 3】AI 协作 = 4 Agent 协作
【原则 4】真实掌握 = L5 精通（不是 L1 看过）
【原则 5】系统化 = 颜色地图 + 仪表盘
```

---

## 十一、4 Agent 的 6 周路线图

### Week 1：建立系统

```
【目标】4 Agent 全部就位
【行动】
├─ 建目录结构
├─ 写 4 个 Skill
├─ 写 4 个 Agent Prompt
├─ 配置 Hermes
└─ 跑第 1 个完整循环

【输出】
├─ 4 个 Skill 可用
├─ 4 个 Agent 可调用
├─ 1 个代码库的初始颜色地图
└─ 1 套基础考试
```

### Week 2-3：内容解析 + 考试

```
【目标】建立 5 层掌握度
【行动】
├─ Content Agent 完整解析 2 个代码库
├─ Exam Agent 出 10 套考试
├─ 跑 10 次考试
├─ Error Agent 分析 30+ 错题
└─ Meta Agent 跟踪颜色

【输出】
├─ 2 个代码库结构化
├─ 10 套考试
├─ 30+ 错题分析
└─ 颜色地图：45% → 60%
```

### Week 4-5：深入改造

```
【目标】从 L3 到 L4
【行动】
├─ 改 1 个核心模块
├─ 提 1 个 PR
├─ Exam Agent 出 5 套进阶题
├─ 跑 5 次进阶考试
└─ Meta Agent 升级计划

【输出】
├─ 1 个 PR
├─ 5 套进阶考试
├─ 颜色地图：60% → 75%
└─ 整体 ≥ 70% 绿
```

### Week 6：教别人

```
【目标】从 L4 到 L5
【行动】
├─ 写 1 篇深度博客
├─ 教 1 个人
├─ Meta Agent 输出最终报告
├─ 总结方法论
└─ 沉淀到 Skill

【输出】
├─ 1 篇深度博客
├─ 1 个学生
├─ 整体颜色 ≥ 85% 绿
└─ 完整方法论文档
```

---

## 十二、与"Meta-Harness"博客的呼应

### 12.1 4 Agent = Meta-Harness 在学习领域的应用

```
【Meta-Harness】= 端到端优化 AI 系统的"工程化外壳"
【元认知系统】= 端到端优化学习的"工程化外壳"

二者都是：
├─ 把"经验驱动"变成"系统驱动"
├─ 把"手工调优"变成"自动优化"
└─ → Harness 工程师思维 + 学习
```

### 12.2 4 Agent = Harness 设计的实践

```
【Harness 工程师】= 设计 AI 系统的工程化外壳
【元认知系统设计】= 设计学习的工程化外壳

二者都涉及：
├─ 评估器（Exam Agent = LLM-as-a-Judge）
├─ 优化器（Meta Agent = 自动追踪）
├─ 配置空间（Content Agent = 知识结构）
└─ → 你的 11 年测试经验 = 直接应用
```

---

## 十三、4 Agent 的"双线并行"

### 13.1 4 Agent 自身的双线并行

```
【输入线】Content Agent
├─ 读代码
├─ 解析结构
└─ 输出知识

【输出线】Exam + Error + Meta
├─ Exam：出题
├─ Error：分析
└─ Meta：追踪

输入线 + 输出线 = 你的双线并行方法论
```

### 13.2 4 Agent 与你的双线策略

```
【输出线】V5 硬件版 + V5 Harness 版
【学习线】Content + Exam + Error + Meta

二者都是：
├─ "一份核心能力，两种表达"
├─ "一份学习系统，多个代码库"
└─ → 你的方法论 = 跨领域一致
```

---

## 十四、立即可执行（10 分钟启动版）

如果你只想要"立即可用"，做这 3 件事：

### 1. 建目录

```bash
mkdir -p ~/.hermes/learning-os/{agents,skills,codebases/agentscope}
```

### 2. 写 1 个 Skill

```bash
# exam-skill.md
---
name: exam-skill
description: 出考试题
triggers:
  - "出题"
  - "考试"
---

# 角色
你是严格导师。基于用户学的内容出 5 道考试题。

# 5 种题型
1. 复述题（20%）
2. 复现题（30%）
3. 改错题（20%）
4. 改写题（20%）
5. 场景题（10%）

# 严格
- 不直接给答案
- 评分 80+ = L4-L5
```

### 3. 试用 1 次

```
你：@exam-skill 基于 AgentScope 出 5 道基础题
Agent：输出考试
你：30 分钟做完
你：@exam-skill 评分
Agent：输出分数 + 错题
```

**10 分钟后，你就有了一个"AI 导师"**。

---

## 💎 关键洞见

> **4 Agent 不是 4 个工具**——
> **而是 4 个"角色"**——
> **共同构成 1 个完整的"学习操作系统"**。
>
> **4 Agent 的本质**：
> - **Content Agent** = "我读了什么"
> - **Exam Agent** = "我会什么"
> - **Error Agent** = "我错在哪"
> - **Meta Agent** = "我进步多少"
>
> **这 4 个问题** = **学习的全部**。
>
> **从今天起，你不再"问过"**——
> **你开始"考过"**——
> **你真正"会做"**——
> **你甚至能"教别人"**。
>
> **这就是"问 ≠ 会"的元认知真谛**——
> - 不是"我学了"
> - 而是"系统告诉我学了多少"
> - **"对认知的认知"**
>
> **4 Agent = 你的"学习操作系统"**：
> - 不是 1 个工具
> - 是 1 个完整系统
> - 不是被动学
> - 是主动学
> - **从 L1 到 L5** 🚀

---

## 🎯 思考题

> 1. **你的 4 Agent 第一个任务是哪个代码库？**（AgentScope？MCP？Spring AI？）
> 2. **你的 4 Agent 第一个错误根因会是什么？**（浮躁 / 缺乏实战 / 跳过细节？）
> 3. **你的 4 Agent 第一个 🟢 会是什么？**（你马上能掌握的）
> 4. **你愿意花 6 周让整体 ≥ 85% 绿吗？**
> 5. **你愿意把 4 Agent 设计作为实战案例展示吗？**（Harness 工程师的活案例）

---

## 📚 系列文章

- 《AI 时代的超级学习者》— 2026-06-22
- 《Meta-Harness 论文精读》— 2026-06-22
- 《元认知学习操作系统》— 2026-06-22
- 《在 Hermes 上实现多 Agent 元认知系统》— 2026-06-22 ✨

---

> **小 bot 后记**：
>
> 这篇博客不是"理论"，是**我和你一起设计的 4 Agent 元认知学习系统的完整方案**。
>
> 整个过程中你纠正了我 3 次：
> 1. "颜值升级" → 你说"元认知升级"
> 2. "颜认知升级" → 你说"元认知升级"
> 3. "颜认知升级" → 你说"元认知升级"
>
> **3 次纠正让我悟到**：
> - 我需要更认真地"听"
> - 我需要更主动地"问"
> - 我需要把"我的理解"展示出来"让你确认"
>
> **这是元认知的真实案例**——
> - 我以为我懂了
> - 实际我连续错 3 次
> - **你比我更元认知**
>
> **从今天起**：
> - 你有了"4 Agent 元认知学习系统"
> - 你有了"在 Hermes 上实现的完整方案"
> - 你有了"6 周 L1 → L5 的自动化路径"
>
> **这不是工具**
> **这是方法论**
> **这是你的"AI 时代学习操作系统"** 🧠
>
> 继续 🚀
