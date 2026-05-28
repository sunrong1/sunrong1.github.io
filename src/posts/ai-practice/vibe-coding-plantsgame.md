---
title: Vibe Coding 实战：如何用 AI 工具高效迭代一个完整的塔防游戏
icon: rocket
date: 2026-05-28
update: 2026-05-28
categories:
  - AI实践
tags:
  - AI Coding
  - Vibe Coding
  - Phaser
  - TypeScript
  - Superpowers
  - 游戏开发
author: Mr.Sun
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

```typescript
// 81 个测试用例覆盖
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

**有测试的好处：**
- 改配置不用担心破坏其他功能
- AI 可以大胆修改，我来做验证
- 数值平衡有据可依

---

## Vibe Coding 的实践感悟

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
| **AI 辅助** | Superpowers (Brainstorming / Subagent / Executing Plans) |
| **架构** | 数据驱动 + 接口先行 + 事件解耦 |
| **迭代方式** | 小步快跑，快速 commit |

**核心心法：**
- 描述你想要什么，让 AI 帮你实现
- 用架构约束 AI 生成的代码质量
- 用测试保证迭代的安全性

这就是 Vibe Coding 的精髓：**跟着感觉走，但不忘系好安全带。** 🌿

---

## 仓库地址

**[sunrong1/plantsgame](https://github.com/sunrong1/plantsgame)** - PVZ 像素版

---

**相关话题：** [[AI Coding]] [[Vibe Coding]] [[Phaser]] [[TypeScript]] [[游戏开发]] [[Superpowers]]