---
title: 'XX老项目 代码重构 — BMAD 流程总结'
date: '2026-09-12'
tags:
  - BMAD
  - 实战
  - 代码重构
  - .NET
  - SDD 对比
  - AI Agent
  - 超级个体
categories:
  - AI 实践
icon: 🛠️
author: Mr.Sun
---

# XX老项目 代码重构 — BMAD 流程总结

> 本文是 BMAD-METHOD **真实生产级实战记录**：78 个 C#/.NET Framework 存量项目代码重构全流程。
>
> 适用读者：要用 AI 重构**老项目**、想看"5 阶段 + 3 轮 Sprint + 闭环回顾"完整落地的工程师。

***
## 💡 背景

最近做了一次**老项目的代码重构**——把 78 个 C#/.NET Framework 存量项目从传统手动开发模式，优化为 **SDD（Spec-Driven Development）AI 驱动工程**。

**为什么选 BMAD 而不是直接用 SDD 工具？**

- 78 个项目 = 几千个文件，纯 SDD 工具生成 SPEC 后**没人能读完**
- 老代码 = **没有文档**、耦合度高、修改风险大
- 需要的是**可审计、可中断、可回退**的工程纪律，不是"AI 自动改完上线"

**结论**：BMAD-METHOD 的**多 artifact 体系 + 3 阶段闭环** 完美匹配——文档可分片、过程可中断、关键决策有"人工检查点"。

***
<!-- more -->
## 一、流程全景

整个重构分 **5 个阶段**：

```
阶段0：基础设施搭建   →  阶段1：代码审计   →  阶段2：BMAD 规划
                                                  │
                  ┌───────────────────────────────┘
                  ▼
            阶段3：Sprint 执行（3 轮）  →  阶段4：回顾与持续改进
```

| 阶段 | 核心问题 | 关键产出 |
|------|---------|----------|
| **阶段 0** | 让 BMAD 跑起来 | `_bmad/` 目录 + `docs/architecture/` |
| **阶段 1** | 真实问题清单（非凭空想象需求） | 123 处吞异常、50 个超大文件、68 处 TODO |
| **阶段 2** | PRD + 架构 + Story | 11 FR / 8 NFR / 7 AR / 5 Epic / 11 Story |
| **阶段 3** | 3 轮 Sprint 跑完 | 12 个 Story 完成，3 个跳过/移除 |
| **阶段 4** | 闭环回顾 | Epic 1 回顾 → 3 Action Item → Sprint 3 解决 |

***
## 二、各阶段详细说明

### 2.1 阶段 0：基础设施搭建

| 步骤 | 做了什么 | 产出物 |
|------|----------|--------|
| **安装 BMAD** | 在内网环境装 `bmad-method v6.12.0` | `_bmad/` 目录 |
| **项目文档化** | 创建 `AGENTS.md`、架构概览、模块地图、编码规范 | `docs/architecture/` |
| **架构脊背** | 通过引导问答记录架构决策 | `ARCHITECTURE-SPINE.md` |

> 💡 **关键决策**：阶段 0 确认了**分层架构、事件驱动、反射自动发现、KVParas 弱类型数据载体**等核心设计——这些决策直接决定了后续 PRD 的边界。

**经验**：**阶段 0 不是"装个工具就完事"**，是**让 BMAD 真正理解你的代码**。跳过这一步，PRD 写出来会"假大空"。

***

### 2.2 阶段 1：代码审计

| 步骤 | 做了什么 | 发现 |
|------|----------|------|
| **代码审查** | 对核心模块跑 `bmad-code-review` | **123 处吞异常**、InstrumentFactory 自引用 Bug、拼写错误等 |
| **问题扫描** | 全项目扫描代码质量问题 | **50 个超大文件、68 处 TODO、硬编码依赖** |

**关键作用**：**为 PRD 提供真实的问题清单，而非凭空想象需求**。

> ⚠️ **没有阶段 1 就没有阶段 2**：PRD 的 11 个 FR 中，至少 7 个直接来自"代码审计发现"。

***

### 2.3 阶段 2：BMAD 规划

阶段 2 是**多 skill 接力**的典型示例：

```
bmad-brainstorming（可选）
        │
        ▼
    bmad-prd  ──→  产出：11 个 FR + 8 个 NFR + 7 个 AR
        │
        ▼
  bmad-architecture  ──→  产出：架构决策记录（AD-1 ~ AD-7）
        │
        ▼
  bmad-create-epics-and-stories  ──→  产出：5 个 Epic / 11 个 Story
        │
        ▼
  bmad-sprint-planning  ──→  产出：sprint-status.yaml
```

**PRD 的 5 个 Epic**：

| Epic | 主题 | Story 数 | 完成情况 |
|------|------|----------|----------|
| **Epic 1** | 异常处理与稳定性 | 3 | 1 个移除 |
| **Epic 2** | 测试覆盖 | 2 | 1 个跳过 |
| **Epic 3** | 类型安全与命名 | 3 | 1 个跳过 |
| **Epic 4** | 文档注释 | 2 | 全部完成 |
| **Epic 5** | Action Item 修复 | 3 | 全部完成 |

> 💡 **核心逻辑**：**PRD 定义"做什么"，Architecture 定义"怎么做"，Epics/Stories 定义"按什么顺序做"**——三层文档各司其职，**不重复、不遗漏**。

***

### 2.4 阶段 3：Sprint 执行（3 轮）

每个 Story 的标准执行流程：

```
bmad-build
   │
   ├─ 1. 读取 spec-*.md，理解 Story 需求
   ├─ 2. 分析相关代码，制定修改方案
   ├─ 3. 实现代码修改
   ├─ 4. MSBuild 编译验证（0 error）
   ├─ 5. 用户人工检查 ← 关键检查点
   └─ 6. 确认后 git commit
```

**3 轮 Sprint 产出**：

#### Sprint 1 产出（高价值低风险）

- ✅ **Story 1.1**：消除 123 处吞异常（38 个文件）
- ✅ **Story 1.2**：修复 InstrumentFactory 自引用 Bug
- ⏸️ **Story 1.3**：硬编码凭证（用户决定不移除）

#### Sprint 2 产出（中风险 · 类型 + 注释 + 测试）

- ✅ **Story 3.2**：ServiceCalller → ServiceCaller 拼写修正
- ✅ **Story 3.1**：KVParas 添加 5 个类型安全方法
- ✅ **Story 4.2**：5 个核心类添加架构说明注释
- ✅ **Story 4.1**：4 个核心类 123 个 public 成员添加 XML 文档注释
- ✅ **Story 2.1**：12 个单元测试
- ⏸️ **Story 3.3 / 2.2**：用户决定跳过（成本/风险过高）

#### Sprint 3 产出（Epic 1 回顾 Action Items）

- ✅ **Story 5.1**：LocalServiceBus 日志格式修复
- ✅ **Story 5.2**：KVParas 参数命名统一
- ✅ **Story 5.3**：硬编码依赖统一到 InstrumentFactory

> ⚠️ **3 个跳过/移除**不是"BMAD 失败了"，是**"用户决策是 AI 流程的一部分"**——这是 BMAD 比纯 SDD 工具更安全的关键。

***

### 2.5 阶段 4：回顾与持续改进

```
bmad-retrospective
   │
   ├─ 总结成果
   ├─ 发现问题 → 生成 Action Items
   └─ Action Items → 进入下一轮 Sprint
```

**Epic 1 回顾发现 3 个 Action Item，全部在 Sprint 3 中解决**——形成**闭环**。

***
## 三、4 大核心逻辑总结

### 3.1 文档驱动，而非代码驱动

| | 传统方式 | BMAD 方式 |
|---|---------|-----------|
| **顺序** | 发现问题 → 直接改代码 → 问题 | 发现问题 → 写入 PRD → 拆分 Story → 按 Spec 实现 → 验证 |
| **风险** | 改了这里忘了那里 | 每次改动有据可查 |

### 3.2 风险分级，低风险优先

- **Sprint 1**：高价值低风险（吞异常、Bug 修复）→ **快速见效，积累信心**
- **Sprint 2**：中风险（拼写、类型安全、注释、测试）→ **稳扎稳打**
- **Sprint 3**：中高风险（依赖注入、命名统一）→ **高风险改动放最后**

### 3.3 人工检查点

```
AI 实现 → 编译验证 → 用户人工检查 → 确认后提交
                          ↑
                    关键决策点
```

**实际案例**：
- Story 1.2：用户要求**回退**线程安全和 IDisposable 修改
- Story 1.3：用户决定**不移除**（业务默认值）
- Story 3.3 / 2.2：用户决定**跳过**（成本/风险过高）

> 💡 **"做不做"必须由用户决定**——AI 可以建议方案，但不能跳过"人工检查点"。

### 3.4 回顾闭环

```
Sprint 结束 → 回顾 → 发现 Action Item → 新 Sprint 解决 → 再回顾
              ↑                              ↓
              └──────────────────────────────┘
```

**好处**：**持续改进，不遗漏后续问题**。Sprint 3 的 3 个 Story 全部来自 Epic 1 回顾的 Action Items。

***
## 四、产出物清单

| 类型 | 文件数 | 位置 |
|------|--------|------|
| **PRD** | 1 | `_bmad-output/planning-artifacts/prds/` |
| **Architecture** | 1 | `_bmad-output/planning-artifacts/architecture/` |
| **Epics & Stories** | 1 | `_bmad-output/planning-artifacts/epics.md` |
| **Sprint Status** | 1 | `_bmad-output/implementation-artifacts/sprint-status.yaml` |
| **Story Specs** | 13 | `_bmad-output/implementation-artifacts/spec-*.md` |
| **Epic 回顾** | 1 | `_bmad-output/implementation-artifacts/epic-1-4-retro.md` |
| **代码变更** | 多次提交 | git history |

**总文件数**：22 个文档 + N 次 git commit = **完整可审计的工程产物链**。

***
## 五、5 大经验教训

| 经验 | 说明 |
|------|------|
| **PRD 不是越多越好** | 11 个 FR 最终完成 7 个，4 个被移除/跳过。**需求要基于实际价值，而非追求全面** |
| **用户决策是关键** | AI 可以建议方案，但"做不做"必须由用户决定 |
| **编译验证是底线** | 每次改动后必须 **0 error** 才算完成 |
| **回顾产生价值** | Sprint 3 的 3 个 Story 全部来自 Epic 1 回顾的 Action Items |
| **跳过也是一种决策** | Story 3.3 和 2.2 的跳过是理性选择，**避免过度改造** |

***
## 六、FAQ（实战常见问题）

### Q1：PRD 是什么目录？

`prds/` 目录是 BMAD 方法中 **PRD（Product Requirements Document）** 的存放位置。

**完整路径**：
```
_bmad-output/planning-artifacts/prds/prd-XX老项目-2026-09-08/prd.md
```

**PRD 包含**：
- **功能需求（FR）**：要实现什么功能
- **非功能需求（NFR）**：性能、安全、可维护性等约束
- **验收标准（AR）**：如何验证需求被满足

**BMAD 产出物目录结构**：
```
_bmad-output/
├── planning-artifacts/        # 规划阶段产出
│   ├── prds/                  #   PRD 文档
│   ├── architecture/          #   架构文档
│   └── epics.md               #   Epic 和 Story 拆分
├── implementation-artifacts/  # 实现阶段产出
│   ├── sprint-status.yaml     #   Sprint 状态跟踪
│   ├── spec-*.md              #   每个 Story 的详细 Spec
│   └── epic-*-retro-*.md      #   Epic 回顾
└── brainstorming/             # 头脑风暴产出
```

**BMAD 工作流**：
```
brainstorming → product-brief → PRD → architecture → epics & stories
             → sprint-planning → build → code-review → retrospective
```

> 💡 **PRD 是整个流程的"需求源头"**，后续的架构设计、Story 拆分、Sprint 规划都基于 PRD 展开。

### Q2：为啥有时候生成 PRD 文档，有时候不生成？

这是 BMAD 工作流的**设计特点**，不是 bug：

**规划阶段（做一次）          实现阶段（反复执行）**
```
┌──────────────────┐      ┌──────────────────┐
│ PRD              │      │ Sprint Planning  │
│ Architecture     │ ───→ │ Build            │
│ Epics & Stories  │      │ Code Review      │
└──────────────────┘      │ Retrospective    │
                          └──────────────────┘
```

**PRD 和 Architecture 是"地图"，不是"日记"**——画一次地图可以指导很多次出行，只有路线发生重大变化时才需要重画。

**什么情况下重新生成 PRD / Architecture？**

| 场景 | 处理方式 |
|------|----------|
| **新的大需求**（如"提升可测试性"） | ✅ 走完整 BMAD 流程 |
| **现有需求的小修复** | ❌ 直接实现即可 |
| **架构方向重大变更** | 🔄 用 `bmad-correct-course` 评估影响 |
| **回顾产生的 Action Item** | ❌ 属于已有 PRD 范围内，直接实现 |

> 💡 **"硬编码依赖修复"没走 BMAD**——因为它是 Epic 1 回顾产生的 Action Item，属于已有 PRD 范围内的后续修复，不是新需求。对于这类小范围修复，**直接实现比重新走完整规划流程更高效**。

***
## 七、对比 SDD 工具的 3 大优势

| 维度 | 纯 SDD 工具 | BMAD-METHOD（本实战）|
|------|------------|---------------------|
| **文档粒度** | 一个大 SPEC.md（几页 → 几十页） | **多 artifact 体系**（PRD + 架构 + 5 Epic + 11 Story） |
| **角色分工** | 无（一个人写所有） | **5 个 Agent 接力**（PM / Architect / SM / Dev / QA） |
| **变更处理** | 一次性瀑布 | **3 阶段闭环**（Plan → Ship → Correct） |
| **人工检查点** | 通常只在最后 | **每个 Story 都有"用户人工检查"** |
| **跳过/移除** | 难处理 | **支持跳过作为"决策"**（3 个 Story 跳过有据可查） |

**最大差异**：BMAD 把"用户决策"**显式化**为工程产物（`sprint-status.yaml` 里有"skipped" 状态），SDD 工具通常**不区分"没做"和"做了但失败"**。

***
## 八、下一篇预告

本文是 BMAD **生产级实战**篇，下一篇是**深度定制篇**：

**「基于 BMAD-METHOD 给 HERO 平台定制 AI Agent 团队」**

会涉及：
1. **复制 PM agent 当模板**，创建 `bmad-agent-hero-test-analyst`
2. **写 SKILL.md 和 customize.toml**，定义"HERO 测试需求分析师"人设
3. **设计 Plan 阶段末尾的 skill**（Architect 之后、Dev 之前）
4. **跑 install 验证** + 在 OpenCode 里调起来
5. **集成到真实 HERO 工作流**，让"BMAD 多 Agent 接力"成为 HERO 平台的基础设施

如果你也在用 BMAD 重构老项目，欢迎一起交流踩坑经验 💪

***
## 📚 参考资料

- [BMAD-METHOD 官方仓库](https://github.com/bmad-code-org/BMAD-METHOD)
- [BMAD 入门：多 Artifact 体系如何重塑 AI 辅助开发](https://sunrong.site/posts/ai-practice/ai-theory/bmad-method-vs-sdd-multi-artifact-ai-development.html)（本系列入门篇）
- [AgentScope 2.0](https://github.com/agentscope-ai/agentscope)
- 78 个 C#/.NET Framework 存量项目（**项目代号：XX**，需要脱敏）

***
**作者**：Mr.Sun（孙荣）

**关于我**：11 年研发经验，现任华为 17 级技术专家 + 团队负责人。专注于 AI Agent 平台研发，最近在生产环境融合 AgentScope 2.0 + BMAD-METHOD，给 AgentScope 等开源项目贡献 PR。个人 blog：[sunrong.site](https://sunrong.site/)

**版权声明**：本文采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 协议，转载请保留作者信息和原文链接。
