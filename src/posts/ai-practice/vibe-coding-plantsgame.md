---
title: Vibe Coding 实战：如何用 AI 工具高效迭代一个完整的塔防游戏
icon: rocket
date: 2026-05-28
update: 2026-06-01
categories:
  - AI 实践
tags:
  - Vibe Coding
  - AI Coding
  - 游戏开发
  - TDD
  - Subagent Driven Development
author: Mr.Sun
star: true
---

# Vibe Coding 实战：如何用 AI 工具高效迭代一个完整的塔防游戏

> 这 3 天我一直在用 Vibe Coding 的方式开发 PVZ 像素版，从概念到 MVP 只用了几天时间。配合 Superpowers 的各种工具，迭代效率远超预期。

---

## 什么是 Vibe Coding？

**Vibe Coding** 是一种新兴的编程方式：

| 传统 Coding | Vibe Coding |
|------------|-------------|
| 写一行代码，执行一行 | 描述你的意图，AI 生成代码 |
| 手动搜索文档 | AI 直接告诉你怎么做 |
| 单步调试 | AI 帮你分析问题所在 |
| 个人作战 | AI 团队协作 |

**核心是"跟着感觉走"**——你描述产品想要什么，AI 帮你实现出来。

不是 AI 替代程序员，而是 AI 放大程序员的能力。

---

## 我的工具栈

### Superpowers 三件套

| 工具 | 作用 | 我是怎么用的 |
|------|------|--------------|
| **Brainstorming** | 头脑风暴，快速生成设计文档 | 帮我确定了像素风格、帧动画方案 |
| **Subagent Driven Development** | 子 Agent 并行任务执行 | 同时跑多个开发任务，不阻塞 |
| **Executing Plans** | 任务分解和执行计划 | 把大项目拆成小任务，一步步执行 |

### Superpowers 工具最佳实践

#### 1. Writing Plan（写作计划）

**什么是 Writing Plan？**
Writing Plan 是 Superpowers 的核心能力，它将设计和开发过程文档化，每个阶段都有清晰的检查点（checkbox）。

**我的 Writing Plan 模板：**

```markdown
## Task 1: 项目脚手架
### 创建基础配置文件
- [ ] Step 1: 创建 package.json（依赖配置）
- [ ] Step 2: 创建 tsconfig.json（TypeScript 配置）
- [ ] Step 3: 创建 vite.config.ts（构建配置）
- [ ] Step 4: 创建 index.html（HTML 入口）
- [ ] Step 5: 提交代码并标记 Task 1 完成

## Task 2: 类型定义
### 建立类型安全基础
- [ ] Step 1: 创建 src/types/index.ts（所有接口定义）
- [ ] Step 2: 编写基础类型测试
- [ ] Step 3: 提交代码并标记 Task 2 完成
```

**最佳实践：**

| 原则 | 说明 |
|------|------|
| **每个 Step 独立** | 一个 Step 只做一件事，便于提交和回退 |
| **checkbox 要具体** | "创建 package.json" 比 "配置环境" 更清晰 |
| **每 Task 结尾提交** | 保持原子提交，便于追踪和回退 |
| **先计划后执行** | 不要跳步，按计划执行 |


#### 2. Executing Plans（执行计划）

**什么是 Executing Plans？**
Executing Plans 是将 Writing Plan 转化为可执行任务的能力。AI 会按照计划一步步执行，每个 Step 都是一个独立的开发任务。

**执行流程：**

```
Writing Plan 文档
    ↓
Subagent 读取计划
    ↓
按顺序执行每个 Step
    ↓
每个 Step 完成 → 标记 checkbox
    ↓
遇到问题 → 暂停 → 人工介入
    ↓
所有 Step 完成 → Task 完成
```

**我的最佳实践：**

| 场景 | 做法 |
|------|------|
| **任务分解** | Task 粒度适中（1-2 小时完成）|
| **执行顺序** | 先基础后业务，先框架后细节 |
| **遇到阻塞** | 停在当前 Step，等待人工决策 |
| **代码 Review** | 每个 Step 完成后快速 Review |



#### 3. Subagent Driven Development（子 Agent 驱动开发）

**什么时候用 Subagent？**

- 多个 Task 可以并行执行时
- 需要同时跑多个开发任务
- Task 之间没有依赖关系

**我的用法：**
```
主 Agent（我）：规划 + 协调
    ├── Subagent A：执行 Task 1（项目脚手架）
    ├── Subagent B：执行 Task 2（类型定义）
    └── Subagent C：执行 Task 3（游戏配置）
```

**最佳实践：**
| 原则 | 说明 |
|------|------|
| **独立任务** | Subagent 执行的 Task 必须独立，无依赖 |
| **清晰边界** | 每个 Subagent 只做一个 Task |
| **结果汇总** | 主 Agent 汇总结果，协调下一步 |



#### 4. Brainstorming（头脑风暴）

**最佳使用场景：**
- 项目初始化时的技术选型
- 遇到问题需要多方分析
- 需要快速生成设计文档

**我的 prompt 模板：**
```
我想做一个[项目类型]，目标是[核心功能]，请帮我确定：
1. 技术栈选型
2. 项目结构
3. 核心接口设计
4. 开发优先级
```

**输出质量优化技巧：**
- 越具体越好："像素风格"比"复古风格"更明确
- 设定约束条件："需要支持移动端"、"预算有限"
- 追问"为什么"：让 AI 解释决策原因，便于学习和优化


#### 工具组合使用示例（我的工作流）


```
1. Brainstorming → 生成项目设计文档（GDD）
   Input: "做一个像素风格的塔防游戏"
   Output: 完整的设计文档

2. Writing Plan → 将设计文档转化为开发计划
   Input: GDD 文档
   Output: 分层的 Task 列表 + 每个 Task 的 Step

3. Executing Plans → 执行开发计划
   Input: Writing Plan
   Output: 一步步执行的代码

4. Subagent → 并行加速（可选）
   Input: 独立的 Task
   Output: 并行执行的多个结果
```


**核心原则：**


> 用工具约束 AI，而不是被 AI 带着走。
> 工具是放大器，但方向盘始终在你手里。

### 开发环境

| 组件 | 技术 | 优势 |
|------|------|------|
| 游戏引擎 | Phaser 3 | Canvas 渲染，像素友好 |
| 语言 | TypeScript | 类型安全，代码即文档 |
| 构建 | Vite | HMR 热更新，秒级响应 |
| 测试 | Vitest | 81 个测试用例，覆盖配置和数值平衡 |

---

## 从概念到 MVP 的 3 天

### Day 1：设计文档生成

**我用 Brainstorming 快速生成 GDD（游戏设计文档）**

```
我的输入：做一个像素风格的植物大战僵尸
AI 的输出：
- 游戏规格文档
- 技术栈选型
- 植物配置表
- 僵尸行为定义
- 波次时间表
- TypeScript 接口定义
```

**关键产出：**
- `docs/superpowers/specs/2026-05-22-pvz-game-design.md`
- 完整的接口定义和配置数据

---

### Day 2：核心架构搭建

**数据驱动设计是我的核心原则**

```typescript
// 植物配置（数据驱动）
export const PLANT_CONFIGS: PlantConfig[] = [
  {
    id: 'peashooter',
    name: '豌豆射手',
    cost: 100,
    hp: 100,
    damage: 20,
    attackInterval: 1500,
  },
  // ...更多植物
];

// 僵尸配置
export const ZOMBIE_CONFIGS: ZombieConfig[] = [
  { id: 'normal', name: '普通僵尸', hp: 100, speed: 33.33 },
  { id: 'flag', name: '旗帜僵尸', hp: 200, isFlag: true },
];

// 波次配置
const WAVE_CONFIG: WaveConfig[] = [
  { delay: 20000, count: 3, interval: 4000, zombieType: 'normal' },
  { delay: 38000, count: 5, interval: 3000, zombieType: 'normal' },
  { delay: 53000, count: 7, interval: 2000, zombieType: 'mixed' },
];
```

**为什么数据驱动？**
- 调整数值不需要改代码
- 方便 AI 生成和修改配置
- 单元测试容易覆盖

---

### Day 3：快速迭代

**迭代记录（部分）：**

| Commit | 内容 |
|--------|------|
| `fix: move plant cards to top of screen` | 调整植物卡片位置 |
| `fix: revert plant cards to top position` | 回退，因为挡住了网格 |
| `feat: replace zombie sprites with cute cartoon versions` | 替换僵尸素材 |
| `fix: correct zombie attack detection` | 修复攻击判定 |
| `refactor: improve speech naturalness` | 优化僵尸语音 |

**平均每天 8-10 个 commit**，快速试错，快速修复。

---

## 高效工具和设计的核心原则

### 1. 架构分层：配置与逻辑分离

```
config/   <- 数据配置（植物、僵尸、游戏参数）
entities/ <- 游戏实体类（Plant, Zombie, Projectile）
systems/  <- 游戏系统（GridManager, WaveManager, EconomyManager）
scenes/   <- Phaser 场景（BootScene, PlayScene, UIScene）
```

**好处：**
- 配置可以独立调整，不需要动逻辑
- AI 生成代码时更容易找到插入点
- 单元测试只测逻辑，不测配置

---

### 2. 接口先行：TypeScript 类型定义

```typescript
interface PlantEntity {
  id: string;
  type: PlantConfig['id'];
  position: GridPosition;
  hp: number;
  state: PlantState;
  lastActionTime: number;
  sprite: Phaser.GameObjects.Sprite;
}
```

**AI 生成的代码必须符合接口定义**，这样可以保证：
- 类型安全
- 代码一致
- 容易重构

---

### 3. 事件驱动：解耦实体通信

```typescript
interface GameEvents {
  'plant:placed': { plant: PlantEntity; position: GridPosition };
  'zombie:spawned': { zombie: ZombieEntity };
  'zombie:killed': { zombie: ZombieEntity };
  'game:won': void;
}
```

**事件系统的优势：**
- 实体之间不需要直接引用
- 便于 AI 添加新功能
- 调试时可以单独监听某个事件

---

### 4. 测试覆盖：数值平衡可验证

**测试驱动开发（TDD）是我的安全带**


```typescript
// 先写测试，再写实现
describe('数值平衡测试', () => {
  test('向日葵产阳光量在合理范围', () => {
    for (let i = 0; i < 100; i++) {
      const amount = calculateSunflowerProduction();
      expect(amount).toBeGreaterThanOrEqual(15);
      expect(amount).toBeLessThanOrEqual(35);
    }
  });
});
```

**TDD 的三字法则：**
- **红**（Red）：写一个失败的测试
- **绿**（Green）：写代码让测试通过
- **重构**（Refactor）：改善代码，保持测试通过

**在 Vibe Coding 中，TDD 的价值更大：**
- AI 生成的代码可能有漏洞，测试是安全网
- 改配置之前先跑测试，确保不会破坏逻辑
- 数值平衡有据可依，不是凭感觉调


**测试覆盖率：81 个测试用例，覆盖：**
- 植物配置数据校验
- 僵尸行为逻辑
- 阳光经济系统
- 波次触发时机
- 碰撞检测正确性

---

### 5. Writing Plan：用文档驱动开发

**Writing Plan 是 Superpowers 的另一个核心能力**

它将设计和开发过程文档化，确保每个阶段都有清晰的指导。

**我的 Writing Plan 结构：**


```
## Task 1: 项目脚手架
- [ ] Step 1: 创建 package.json
- [ ] Step 2: 创建 tsconfig.json
- [ ] Step 3: 创建 vite.config.ts
- [ ] Step 4: 创建 index.html
- [ ] Step 5: 提交

## Task 2: 类型定义
- [ ] Step 1: 创建 src/types/index.ts
- [ ] Step 2: 提交
```

**Writing Plan 的价值：**


| 维度 | 没有 Writing Plan | 有 Writing Plan |
|------|------------------|----------------|
| **任务完整性** | 可能遗漏步骤 | 每个步骤都有 checkbox |
| **进度追踪** | 不知道做到哪了 | 一目了然 |
| **交接能力** | 别人接手困难 | 文档即文档 |
| **AI 协作** | AI 可能跳步 | AI 按计划执行 |

**在 Vibe Coding 中，Writing Plan 让 AI 不跑偏：**
- AI 生成的代码会按照计划一步步执行
- 不会跳步，也不会重复做已经做过的
- 便于 Review，每个 Commit 对应一个 Step

**核心原则：**

> 文档不是写完就完了，是开发过程中的"导航仪"

### AI 是放大器，不是替代者

**我负责想清楚，AI 负责写出来。**

当我能清晰地描述"豌豆射手应该检测前方是否有僵尸，有就射击"时，AI 能帮我生成完整的实现代码。但我需要先想清楚这个逻辑。

### Superpowers 的价值

| 场景 | 没有 Superpowers | 有 Superpowers |
|------|-----------------|----------------|
| 设计文档 | 手动写 2-3 小时 | AI 生成 10 分钟 |
| 任务分解 | 自己想，可能遗漏 | AI 给出完整任务列表 |
| 并行开发 | 串行执行 | 子 Agent 同时跑 |
| 问题排查 | 逐行调试 | AI 分析 + 我决策 |

### 迭代速度是关键

**快速迭代比完美设计更重要。**

```
MVP 版本 -> 快速发布 -> 用户反馈 -> 迭代优化
```

而不是：

```
完美设计 -> 开发半年 -> 发布 -> 发现不符合市场需求
```

---

## 关键指标

| 指标 | 数值 |
|------|------|
| 项目创建到 MVP | 3 天 |
| 单日最多 commit | 10+ |
| 测试覆盖率 | 81 个用例 |
| 代码分层 | 4 层（配置/实体/系统/场景）|
| TypeScript 接口 | 15+ 个 |

---

## 总结

**Vibe Coding + Superpowers = 高效迭代**


| 要素 | 说明 |
|------|------|
| **工具** | Phaser 3 + TypeScript + Vite + Vitest |
| **AI 辅助** | Superpowers (Brainstorming / Subagent / Executing Plans / Writing Plan) |
| **架构** | 数据驱动 + 接口先行 + 事件解耦 |
| **安全网** | TDD（测试驱动开发）+ 81 个测试用例 |
| **迭代方式** | 小步快跑，快速 commit |

**核心心法：**
- 描述你想要什么，让 AI 帮你实现
- 用架构约束 AI 生成的代码质量
- 用 TDD 保证迭代的安全性
- 用 Writing Plan 让 AI 不跑偏

这就是 Vibe Coding 的精髓：**跟着感觉走，但不忘系好安全带。** 🌿

---

## 仓库地址

**[sunrong1/plantsgame](https://github.com/sunrong1/plantsgame)** - PVZ 像素版

---

**相关话题：** [[AI Coding]] [[Vibe Coding]] [[Phaser]] [[TypeScript]] [[游戏开发]] [[Superpowers]]