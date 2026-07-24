---
title: Vibe Coding 实战：如何用 AI 工具高效迭代一个完整的塔防游戏
icon: rocket
date: 2026-05-28
update: 2026-06-18
categories:
  - AI 实践
tags:
  - Vibe Coding
  - AI Coding
  - 游戏开发
  - TDD
  - Subagent Driven Development
  - 架构设计
  - 重构实战
author: Mr.Sun
star: true
---***
# Vibe Coding 实战：如何用 AI 工具高效迭代一个完整的塔防游戏（v2）

> 这 3 天我一直在用 Vibe Coding 的方式开发 PVZ 像素版，从概念到 MVP 只用了几天时间。配合 Superpowers 的各种工具，迭代效率远超预期。
>
> **v2 升级（2026-06-18）**：项目从 v5.32.2 走到 v6.x，本文不重复工具栈基础，重点讲**架构决策过程、CLAUDE.md 模板化、重构实战、TAD 进阶、MVP 6 轮迭代**。如果你已经看过 v1，可以直接跳到第 5 章。

***
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

***
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
| 测试 | Vitest | 100+ 个测试用例，覆盖配置和数值平衡 |

***
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

***
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

***
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

***
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

***
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

***
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

***
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


**测试覆盖率：100+ 个测试用例，覆盖：**
- 植物配置数据校验
- 僵尸行为逻辑
- 阳光经济系统
- 波次触发时机
- 碰撞检测正确性

***
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

***
## 5. 🆕 架构选型决策：为什么选 Vue + Phaser 混合？

这一节回答最常见的问题："**为什么不直接用 Phaser 或 Vue 写一个？**"

### 三个候选方案对比

| 维度 | 纯 Phaser | 纯 Vue | **Vue + Phaser 混合** ⭐ |
|------|-----------|--------|------------------|
| **UI 复杂** | ❌ Canvas 写 UI 体验差 | ✅ DOM 操作方便 | ✅ 各取所长 |
| **动画性能** | ✅ 60fps 流畅 | ⚠️ DOM 性能瓶颈 | ✅ Phaser 负责动画 |
| **开发速度** | ⚠️ 资源栏/教程都要自己画 | ✅ Vue 组件复用 | ✅ UI 组件化复用 |
| **移动端适配** | ⚠️ 缩放麻烦 | ✅ 媒体查询原生支持 | ✅ Phaser.Scale.FIT 解决 |
| **学习曲线** | ⚠️ 游戏 API 多 | ✅ 熟悉的 MV* | ⚠️ 两个框架都要会 |

**我的选择：Vue 3 + Phaser 3 混合架构。**

### 架构图（架构如何工作）

```
┌─────────────────────────────────────────────────────────┐
│                    Browser                              │
│                                                         │
│  ┌──────────────────┐       ┌────────────────────────┐ │
│  │   Vue 3 (DOM)    │       │   Phaser 3 (Canvas)    │ │
│  │                  │       │                        │ │
│  │  App.vue         │       │  BootScene (加载资源)  │ │
│  │  ├ PlantCards.vue│       │  PlayScene (主循环)    │ │
│  │  ├ Tutorial.vue  │       │  ├ GridManager         │ │
│  │  └ GameOver.vue  │       │  ├ WaveManager         │ │
│  │                  │       │  └ Plant/Zombie 实体   │ │
│  │                  │       │                        │ │
│  └────────┬─────────┘       └────────┬───────────────┘ │
│           │                          │                  │
│           └───── CustomEvent ────────┘                  │
│                  (via bridge.ts)                        │
└─────────────────────────────────────────────────────────┘
```

### 通信桥梁：bridge.ts 核心代码

```typescript
// src/ui/bridge.ts
export const GameEvents = {
  SUNLIGHT_CHANGED: 'game:sunlight-changed',
  WAVE_STARTED: 'game:wave-started',
  PLANT_PLACED: 'game:plant-placed',
  ZOMBIE_KILLED: 'game:zombie-killed',
  GAME_WON: 'game:won',
  GAME_LOST: 'game:lost',
} as const;

// Vue 监听 Phaser 事件
window.addEventListener(GameEvents.SUNLIGHT_CHANGED, (e: CustomEvent) => {
  sunlightStore.value = e.detail;
});

// Phaser 触发 Vue 事件
window.dispatchEvent(new CustomEvent(GameEvents.PLANT_PLACED, {
  detail: { plant, position }
}));
```

### Vibe Coding 启示

> **架构不是 AI 决定的，是人决定的。**

当我在 Brainstorming 让 AI 给方案时，它给了 3 个：
1. 纯 Phaser（最快上线，但 UI 维护成本高）
2. 纯 Vue + Canvas（开发快，但性能差）
3. **Vue + Phaser 混合**（架构稍复杂，但长期维护好）

我选了 3，**因为我知道这个项目要做至少 6 个月**——长期价值 > 短期速度。

**决策 prompt 模板**：
```
我想做[项目]，请给我 3 个候选架构方案。
每个方案说明：
1. 技术栈组合
2. 适用场景（短期 MVP / 长期产品）
3. 主要风险点
4. 学习成本

我会根据[我的实际情况]来选。
```

***
## 6. 🆕 CLAUDE.md 模板化：让 AI 永远理解你的项目

`CLAUDE.md` 是 Vibe Coding 的**项目宪法**——AI 每次新对话都会读它。

### 我的 CLAUDE.md 真实结构

```markdown
# Project: PVZ Pixel

## Project
一句话描述：像素风格的塔防游戏，目标 7 岁小朋友英语学习。

## Commands
- npm run dev          # 开发
- npm run build        # 构建
- npm test             # 跑 100+ 测试
- npm run test:e2e     # Playwright 移动端测试

## Architecture
[架构图，参考上一节]

## Key Files
- CLAUDE.md            # 本文件
- src/main.ts          # Phaser 入口
- src/ui/bridge.ts     # Vue/Phaser 通信
- src/config/plants.ts # 植物配置
- src/entities/Plant.ts # 植物实现

## Conventions
- TypeScript strict mode
- 所有游戏参数在 config/，不在代码里硬编码
- 实体用 static 方法（已废弃，详见 [重构实战]）
- commit 前必须跑测试

## Things To Not Break
- **不要改 Phaser.Scale.ScaleModes.FIT** — 改成 RESIZE 会让手机端地图错位
- **preheat() 调用** — 移除会导致 Android 音频无法播放
- **CustomEvent 命名空间** — `game:` 前缀是 Vue/Phaser 约定

## Mobile Testing
视觉缩放可在 Chrome DevTools 设备模式验证，
但**音频必须在真机 Android 上测试**（模拟器无音频错误）。
```

### CLAUDE.md 的 7 大必填章节

| 章节 | 必填理由 | 我的真实教训 |
|------|---------|------------|
| **Project** | 一句话告诉 AI 项目是什么 | 没写 → AI 跑偏到成年玩家 |
| **Commands** | 列出标准命令 | 没写 → AI 用错构建命令 |
| **Architecture** | 架构图 + 数据流 | 没写 → AI 改了通信协议 |
| **Key Files** | 最关键的 5-10 个文件 | 没写 → AI 重复创建类似文件 |
| **Conventions** | 代码规范 + commit 规范 | 没写 → AI 风格不一致 |
| **Things To Not Break** | 绝对不能动的"禁区" | 没写 → 改了 FIT 模式 → bug |
| **Mobile Testing** | 目标设备 + 测试方式 | 没写 → AI 假设桌面浏览器 |

### Things To Not Break 的真实威力

我有一节专门写：

```markdown
## Things To Not Break

- `Phaser.Scale.ScaleModes.FIT` — 切换到 RESIZE 会让手机端地图错位
- The preheat → speak sequence in `App.vue` — 移除 preheat() 调用会导致 Android 音频失败
- `window.dispatchEvent` 命名空间用 `game:` 前缀 — 避免和未来第三方库冲突
```

**实际救了我 3 次**——AI 想"优化"这 3 处都被它拦住了。

### 让 AI 帮你生成 CLAUDE.md 的 prompt 模板

```
我有一个项目，技术栈是 [xxx]。
请帮我生成 CLAUDE.md，包含：
1. Project（一句话描述）
2. Commands（开发/构建/测试）
3. Architecture（画 ASCII 架构图）
4. Key Files（最重要的 5-10 个）
5. Conventions（TypeScript / 命名规范）
6. Things To Not Break（你认为最容易踩的 3 个坑）
7. Mobile Testing（目标设备和测试方式）

输出格式 Markdown，我直接复制到 CLAUDE.md。
```

### Vibe Coding 启示

> **CLAUDE.md 是 Vibe Coding 的"宪法"——写得越细，AI 越懂你。**

我每次发现新坑都加到 "Things To Not Break"，现在已经有 7 条。

***
## 7. 🆕 重构实战：静态类 → OOP 实例化 + 血条抽象

这一节是我**最有成就感的两次重构**。

### 重构 1：静态类 → OOP 实例化

**重构前（v5.x）**：用 `static` 方法实现 Plant/Zombie：

```typescript
// 重构前
export class Plant {
  private static entities: Map<string, PlantEntity> = new Map();

  static create(scene: Phaser.Scene, config: PlantConfig, position: GridPosition) {
    const entity: PlantEntity = {
      id: `plant-${Date.now()}-${Math.random()}`,
      type: config.id,
      position,
      hp: config.hp,
      maxHp: config.hp,
      state: 'idle',
      sprite: scene.add.sprite(position.x, position.y, config.spriteKey),
    };
    this.entities.set(entity.id, entity);
    return entity;
  }

  static takeDamage(plant: PlantEntity, damage: number): boolean {
    plant.hp -= damage;
    if (plant.hp <= 0) {
      plant.sprite.destroy();
      this.entities.delete(plant.id);
      return true; // 死亡
    }
    return false;
  }
}

// 调用处：Plant.create(scene, config, pos)
```

**问题**：

| 问题 | 具体表现 |
|------|---------|
| 难扩展 | 想加"路障僵尸继承普通僵尸"？`static` 不能继承 |
| 难测试 | 必须 `mock` 整个静态类 |
| 状态管理混乱 | 静态 `Map` 难追踪谁拥有谁 |
| AI 不友好 | AI 写新植物时要查所有 static 方法 |

**重构后（v6.x）**：真正的 OOP 实例：

```typescript
// 重构后
export class Plant {
  readonly id: string;
  readonly type: PlantConfig['id'];
  hp: number;
  readonly maxHp: number;
  state: PlantState = 'idle';
  readonly position: GridPosition;
  private sprite: Phaser.GameObjects.Sprite;
  private lastActionTime: number = 0;

  constructor(scene: Phaser.Scene, config: PlantConfig, position: GridPosition) {
    this.id = `plant-${Date.now()}-${Math.random()}`;
    this.type = config.id;
    this.position = position;
    this.hp = config.hp;
    this.maxHp = config.hp;
    this.sprite = scene.add.sprite(position.x, position.y, config.spriteKey);
  }

  takeDamage(damage: number): boolean {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.sprite.destroy();
      return true;
    }
    this.updateHealthBar();
    return false;
  }

  update(time: number): void {
    // 植物的每帧逻辑（攻击、动画等）
    if (time - this.lastActionTime > this.getAttackInterval()) {
      this.attack();
      this.lastActionTime = time;
    }
  }

  private getAttackInterval(): number {
    return PLANT_CONFIG_MAP[this.type].attackInterval;
  }

  private attack(): void {
    // ... 攻击逻辑
  }

  private updateHealthBar(): void {
    // ... 更新血条
  }
}

// 调用处
const plant = new Plant(scene, config, position);
plant.takeDamage(20);
```

**收益**：

| 收益 | 具体表现 |
|------|---------|
| 可继承 | 路障僵尸 = `class ConeheadZombie extends Zombie` |
| 可测试 | `new Plant(...).takeDamage(200)` 直接断言 |
| 状态封装 | 每个 Plant 自己管自己，没有共享 Map |
| AI 友好 | AI 看 OOP 写法能自动补全方法 |

### 重构 2：血条管理抽象

**重构前**：Plant 和 Zombie 都有重复的血条代码：

```typescript
// Plant.ts
private static healthBars: Map<string, Phaser.GameObjects.Graphics> = new Map();
static createHealthBar(entity, scene) { /* 50 行重复代码 */ }
static updateHealthBar(entity) { /* 30 行重复代码 */ }
static removeHealthBar(entity) { /* 20 行重复代码 */ }

// Zombie.ts 也有完全一样的 100 行
```

**重构后**：抽出 `HealthBarMixin`：

```typescript
// src/mixins/HealthBarMixin.ts
type HasHealth = { hp: number; maxHp: number; sprite: Phaser.GameObjects.Sprite };

export function HealthBarMixin<TBase extends new (...args: any[]) => HasHealth>(Base: TBase) {
  return class extends Base {
    private healthBar?: Phaser.GameObjects.Graphics;

    protected updateHealthBar(scene: Phaser.Scene) {
      if (!this.healthBar) {
        this.healthBar = scene.add.graphics();
      }
      this.healthBar.clear();

      const ratio = this.hp / this.maxHp;
      const width = 40;
      const height = 4;

      // 背景
      this.healthBar.fillStyle(0x000000, 0.5);
      this.healthBar.fillRect(this.sprite.x - width / 2, this.sprite.y - 30, width, height);

      // 血条（按颜色区分）
      const color = ratio > 0.5 ? 0x00ff00 : ratio > 0.25 ? 0xffff00 : 0xff0000;
      this.healthBar.fillStyle(color, 1);
      this.healthBar.fillRect(this.sprite.x - width / 2, this.sprite.y - 30, width * ratio, height);
    }

    protected destroyHealthBar() {
      this.healthBar?.destroy();
    }
  };
}

// 使用：Plant = HealthBarMixin(PlantBase)
// 使用：Zombie = HealthBarMixin(ZombieBase)
```

**收益**：
- 减少 **40% 重复代码**（从 200 行 → 120 行）
- 改血条样式只需要改 1 处
- 未来加新实体（飞行物、boss）也能复用

### 重构 prompt 模板

```
我想重构 Plant/Zombie 类。

现状：
- 用 static 方法实现，难扩展
- Plant 和 Zombie 都有重复血条代码

目标：
1. 改成 class + new + 实例方法
2. 抽出 HealthBarMixin 让两者复用
3. 保持所有现有测试通过
4. 调用处全部更新

请分步执行，每步完成后让我 review。
```

### Vibe Coding 启示

> **重构不是"等以后做"，是 Vibe Coding 的核心能力。**

AI 帮你重构比自己写 3 天快 10 倍。关键是：
1. **重构前**：写好 CLAUDE.md + 现有测试
2. **重构中**：分步骤，每步让 AI 跑测试
3. **重构后**：更新 CLAUDE.md，把新约定写进去

***
## 8. 🆕 测试驱动 AI（TAD）：从 TDD 升级到 Test-AI-Driven

v1 我讲了 TDD（Test-Driven Development），v2 我想升级一个概念：**TAD（Test-AI-Driven）——让测试成为 AI 的"安全网"**。

### TDD vs TAD 对比

| 维度 | TDD | TAD |
|------|-----|-----|
| **谁写测试** | 开发者 | AI 生成 + 开发者 review |
| **谁写实现** | 开发者 | AI 生成 |
| **测试时机** | 实现前 | 让 AI 写实现**之前**先有测试 |
| **覆盖率** | 关键路径 | **所有边界情况**（AI 比人细心） |

### TAD 三步法

**Step 1：让 AI 先写测试**

```
我的 ProjectileEntity 类型定义如下：
[粘贴类型]

请帮我写 Vitest 测试，覆盖：
1. create() 创建实体，初始位置和速度正确
2. update() 每帧移动，超出屏幕后标记 isDead
3. hitTarget() 命中目标后扣血 + 销毁
4. 边界情况：
   - 移动到屏幕外（边界刚好、不超出、超出 1px）
   - 目标已死
   - 伤害为 0 / 负数 / 超过目标 HP

请只输出测试代码，不要实现。
```

**AI 输出**（示例）：

```typescript
// src/entities/__tests__/Projectile.test.ts
import { describe, test, expect, vi } from 'vitest';
import { Projectile } from '../Projectile';

describe('Projectile', () => {
  describe('create', () => {
    test('应该正确初始化位置和速度', () => {
      const proj = Projectile.create({ x: 100, y: 200 }, { vx: 50, vy: 0 }, 30);
      expect(proj.position).toEqual({ x: 100, y: 200 });
      expect(proj.velocity).toEqual({ vx: 50, vy: 0 });
      expect(proj.damage).toBe(30);
    });

    test('应该生成唯一 ID', () => {
      const a = Projectile.create({ x: 0, y: 0 }, { vx: 0, vy: 0 }, 10);
      const b = Projectile.create({ x: 0, y: 0 }, { vx: 0, vy: 0 }, 10);
      expect(a.id).not.toBe(b.id);
    });
  });

  describe('update', () => {
    test('每帧按速度移动', () => {
      const proj = Projectile.create({ x: 100, y: 200 }, { vx: 50, vy: 0 }, 30);
      proj.update(16); // 16ms = 1 帧
      expect(proj.position.x).toBeCloseTo(100 + 50 * 0.016);
    });

    test('超出屏幕边界后标记 isDead', () => {
      const proj = Projectile.create({ x: 800, y: 200 }, { vx: 100, vy: 0 }, 30);
      proj.update(100); // 大幅移动
      expect(proj.isDead).toBe(true);
    });

    test('刚到边界（x = 720）不算超出', () => {
      const proj = Projectile.create({ x: 719, y: 200 }, { vx: 1, vy: 0 }, 30);
      proj.update(1000);
      expect(proj.isDead).toBe(false); // 720 是临界值
    });
  });

  describe('hitTarget', () => {
    test('命中后目标扣血', () => {
      const proj = Projectile.create({ x: 0, y: 0 }, { vx: 0, vy: 0 }, 30);
      const target = { hp: 100, maxHp: 100, isDead: false };
      proj.hitTarget(target);
      expect(target.hp).toBe(70);
    });

    test('目标 HP 归零时标记 isDead', () => {
      const proj = Projectile.create({ x: 0, y: 0 }, { vx: 0, vy: 0 }, 100);
      const target = { hp: 50, maxHp: 100, isDead: false };
      proj.hitTarget(target);
      expect(target.hp).toBe(0);
      expect(target.isDead).toBe(true);
    });

    test('已死亡的目标不再扣血', () => {
      const proj = Projectile.create({ x: 0, y: 0 }, { vx: 0, vy: 0 }, 30);
      const target = { hp: 0, maxHp: 100, isDead: true };
      proj.hitTarget(target);
      expect(target.hp).toBe(0);
    });
  });
});
```

**Step 2：让 AI 实现功能**（跑测试）

```
测试已经写好（见 src/entities/__tests__/Projectile.test.ts）。
请实现 Projectile 类，让所有测试通过。
约束：
- 屏幕宽度 720（临界值）
- 性能：每帧移动最多 1 次计算
```

**Step 3：让 AI 帮你看覆盖率**

```
npm run test:coverage
请分析覆盖率报告：
1. 哪些边界没覆盖到
2. 哪些代码可以删（死代码）
3. 给出覆盖率提升建议（目标 90%+）
```

### Playwright E2E（移动端）

我还在 v6 加了 Playwright：

```typescript
// e2e/mobile-gameplay.spec.ts
import { test, expect } from '@playwright/test';

test('手机端能完成第 1 波', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone 8
  await page.goto('http://localhost:5173');

  // 等待游戏加载
  await page.waitForSelector('.phaser-canvas');

  // 拖动豌豆射手到第 1 格
  const peashooter = page.locator('[data-card="peashooter"]');
  const grid = page.locator('[data-cell="0,0"]');
  await peashooter.dragTo(grid);

  // 等 5 秒，验证植物被种植
  await page.waitForTimeout(5000);
  const sunCount = await page.locator('[data-testid="sun-count"]').textContent();
  expect(Number(sunCount)).toBeLessThan(50);
});
```

### Vibe Coding 启示

> **测试是 AI 的安全网，不是负担。**

TAD 让 AI 同时是测试作者 + 实现者，**覆盖率和正确性都比人写高**。

我现在的 100+ 测试用例，**70% 是 AI 写的**，我只 review 边界情况。

***
## 9. 🆕 MVP 6 轮迭代：v1.0 → v6.x 的版本节奏

v1 我讲了"3 天 MVP"，v2 我想讲**完整 6 轮迭代**——一个塔防游戏怎么从 MVP 到产品级。

### 6 轮迭代节奏

| 轮次 | 版本范围 | 目标 | 核心交付 | 典型 commit |
|------|---------|------|---------|-------------|
| **轮 1: 核心玩法** | v1.0 - v1.5 | 能玩 | 植物种下、僵尸走路、碰撞击杀 | `feat: basic plant + zombie + bullet` |
| **轮 2: 经济系统** | v2.0 - v2.3 | 有节奏 | 阳光掉落、种植消耗、波次时间表 | `feat: sunlight economy + wave manager` |
| **轮 3: UI 框架** | v3.0 - v3.5 | 好看 | 资源栏、卡片、教程、游戏结束画面 | `feat: vue plant cards + tutorial overlay` |
| **轮 4: 英语学习** | v4.0 - v4.4 | 有特色 | TTS 单词朗读、单词显示、跟读 | `feat: tts speech + word display` |
| **轮 5: 移动端适配** | v5.0 - v5.32 | 能用 | Phaser FIT、触摸优化、Android 音频 | `fix: phaser fit mode + android audio` |
| **轮 6: 细节打磨** | v6.0 - v6.x | 有品味 | 暂停、重构、健康提示、彩蛋 | `refactor: oop + health bar mixin` |

### 每轮的工作流（统一节奏）

```
1. Brainstorming      → 输出本轮 GDD
2. Writing Plan       → 拆解成 Task + Step
3. Subagent           → 并行执行独立 Task
4. TAD（测试驱动 AI）→ 让 AI 写测试 + 实现
5. 手动测试           → 移动端真机测试
6. 更新 CLAUDE.md     → 记录新坑
7. Commit + Bump 版本
```

### 节奏感 vs 完美主义

**对比两种心态**：

| 节奏派 | 完美主义派 |
|--------|-----------|
| v1.0 能玩就发 | 等所有功能完美再发 |
| 用户反馈驱动 | 自嗨式设计 |
| 6 个月到 v6.x | 3 年还在 v1.x |
| 1 个产品上线 | 0 个产品上线 |

**我的实战经验**：
- v1.0（3 天）发布给 5 个孩子玩，反馈"僵尸太丑"
- v2.0（2 周）换素材，反馈"不会玩"
- v3.0（3 周）加教程，反馈"阳光不够"
- v4.0（4 周）加经济提示，反馈"听不懂英语"
- v5.0（4 周）加 TTS，反馈"手机听不见"
- v6.0（6 周）修音频 + 重构，反馈"好玩" ✅

### Vibe Coding 启示

> **MVP 思维 + 版本号节奏 = 不烂尾的秘诀。**

每轮迭代都用同一个工作流（Brainstorming → Writing Plan → Subagent → TAD → 手动测试 → 更新 CLAUDE.md），**形成肌肉记忆**。

**版本号不是数字游戏，是迭代节奏的体现**——v5.32.2 比"v1.0 大版本"更有信息量。

***
## 关键指标

| 指标 | v1 数值 | v2 数值（2026-06-18） |
|------|--------|---------------------|
| 项目创建到 MVP | 3 天 | 3 天（不变）|
| 当前版本 | v5.32.2 | **v6.x**（重构后）|
| 单日最多 commit | 10+ | 10+ |
| 测试用例数 | 81 个 | **100+ 个** |
| 代码分层 | 4 层（配置/实体/系统/场景）| 5 层（+ mixins）|
| TypeScript 接口 | 15+ 个 | **20+ 个** |
| CLAUDE.md 章节 | 5 | **7 大章节** |
| AI 写的测试占比 | 0% | **70%** |

***
## 总结

**Vibe Coding + Superpowers = 高效迭代**


| 要素 | 说明 |
|------|------|
| **工具** | Phaser 3 + TypeScript + Vite + Vitest + Playwright |
| **AI 辅助** | Superpowers (Brainstorming / Subagent / Executing Plans / Writing Plan) |
| **架构** | 数据驱动 + 接口先行 + 事件解耦 + **混合架构（Vue + Phaser）** |
| **安全网** | **TAD（Test-AI-Driven）** + 100+ 测试用例 |
| **工程规范** | **CLAUDE.md 7 大章节** + Things To Not Break |
| **重构能力** | **静态类→OOP + Mixin 抽象** |
| **迭代方式** | **MVP 6 轮 + 版本号节奏** |

**v2 升级后的心法：**

```
1. 架构决策：不是 AI 定的，是人定的（3 方案对比）
2. CLAUDE.md：写得越细，AI 越懂你（7 大章节）
3. 重构能力：等不了 AI 改，AI 帮你改（2 个真实案例）
4. TAD：让 AI 既写测试又写实现（覆盖率达 70%）
5. MVP 6 轮：版本号节奏 = 不烂尾的秘诀
```

**最核心的一句话：**

> **跟着感觉走，但不忘系好安全带。** 🌿

***
## 延伸阅读

如果你对 Vibe Coding + AI 时代软件工程的"不可替代性"感兴趣：

- **《AI 时代，资深工程 Leader 经验的 6 大不可替代性》** —— 我在 AICon 2026 总结的 6 大总图（金句 + Leader 经验映射），和本文的"CLAUDE.md"、"重构实战"、"TAD"形成完整闭环：**本文讲 Vibe Coding 怎么做，那篇讲 Vibe Coding 时代 Leader 为什么更值钱**。

***
## 仓库地址

**[sunrong1/plantsgame](https://github.com/sunrong1/plantsgame)** - PVZ 像素版

***
**相关话题：** [[AI Coding]] [[Vibe Coding]] [[Phaser]] [[TypeScript]] [[游戏开发]] [[Superpowers]] [[架构设计]] [[TAD]] [[CLAUDE.md]] [[重构]]