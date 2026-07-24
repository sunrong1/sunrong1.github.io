---
title: PlantsGame MVP 复盘：用 Claude Code 28小时完成植物大战僵尸，我学到了什么
icon: gamepad
date: 2026-05-26
update: 2026-05-26
categories:
  - AI 实践
tags:
  - AI Coding
  - Claude Code
  - Phaser3
  - 游戏开发
  - 项目复盘
author: Mr.Sun
star: true
---***
# PlantsGame MVP 复盘：用 Claude Code 28小时完成植物大战僵尸，我学到了什么

> 项目地址：https://sunrong.site/plantsgame/
> 仓库：https://github.com/sunrong1/plantsgame
> 技术栈：Phaser 3 + TypeScript + Vite + Vitest

***
<!-- more -->

## 一、项目概览

PlantsGame 是一款致敬《植物大战僵尸》的塔防游戏 MVP，使用 **Phaser 3 + TypeScript + Vite** 构建，部署在 GitHub Pages。

**核心数据：**
- 开发时间：约 **28 小时**（含调研、踩坑、部署）
- 测试覆盖：**54 个 Vitest 单元测试**，全部通过
- 部署方式：GitHub Actions 自动部署，提交即上线
- 在线体验：[https://sunrong.site/plantsgame/](https://sunrong.site/plantsgame/)

***
## 二、功能实现

| 功能 | 状态 | 说明 |
|------|------|------|
| 游戏循环（种→收→种）| ✅ 完成 | 核心玩法完整 |
| 波次僵尸系统 | ✅ 完成 | 3 波次，难度递增 |
| 4 种植物 | ✅ 完成 | 豌豆射手、向日葵、坚果墙、樱桃炸弹 |
| 2 种僵尸 | ✅ 完成 | 普通僵尸、旗帜僵尸 |
| 阳光经济系统 | ✅ 完成 | 天空掉落 + 向日葵产出 |
| 植物卡片选择 + 格子预览 | ✅ 完成 | 绿色/红色悬停指示 |
| 胜负判定 | ✅ 完成 | 通关3波=胜利，僵尸到家=失败 |
| 纹理程序化生成 | ✅ 完成 | 零外部资源依赖 |
| CI/CD 全自动部署 | ✅ 完成 | GitHub Actions |

***
## 三、技术架构

### 3.1 分层设计

```
src/
├── config/          # 配置层：植物/僵尸/游戏参数
├── types/           # 类型层：PlantEntity, ZombieEntity 等接口
├── entities/        # 实体层：Plant, Zombie, Projectile 工具类
├── systems/         # 系统层：GridManager, WaveManager, EconomyManager
└── scenes/          # 场景层：BootScene, PlayScene, UIScene
```

**设计原则：**
- **数据驱动**：植物/僵尸属性全部配置化（`PLANT_CONFIG_MAP`、`ZOMBIE_CONFIG_MAP`），改数值无需动代码
- **Scene-Entity 分离**：场景负责协调，实体负责行为，职责清晰
- **静态工具类**：`Plant.ts`、`Zombie.ts` 是无状态工具类，便于单元测试

### 3.2 核心模块

| 模块 | 职责 |
|------|------|
| `GridManager` | 5×9 草坪网格、悬停高亮（绿色空/红色占用）|
| `WaveManager` | 波次调度、僵尸生成、胜负判定 |
| `EconomyManager` | 阳光生成、收集、过期管理 |
| `BootScene` | 程序化生成所有纹理（植物、僵尸、子弹、箭头）|
| `PlayScene` | 游戏主循环，协调所有系统 |

### 3.3 纹理程序化生成

所有游戏精灵图在 `BootScene` 中用 **Canvas API** 程序化生成，**零外部资源依赖**：

```typescript
// 生成向日葵纹理
private generateSunflower(): void {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  // 画花瓣、画花盘、画茎 ...
  this.textures.add('sunflower', canvas);
}
```

这使得游戏可以直接在浏览器运行，无需担心资源加载失败。

***
## 四、AI 协作经验（重点）

这是我最想分享的部分。项目用 **Claude Code** 完成，过程中踩了不少坑，也总结出了 AI 协作的有效模式。

### 4.1 高效模式：先发散后收敛

**典型案例：地图视觉优化**

问题：初始地图显得"太小"，不够有存在感。

**第一阶段 - 发散（brainstorming）：**
Claude Code 一次给出了 5 个方案：
- A. 扩展网格尺寸
- B. 背景渐变+阴影
- C. 红色警告边框 + 僵尸入侵箭头
- D. 动态云朵背景
- E. 3D 阴影效果

**第二阶段 - 收敛：**
分析后推荐 **C+D 组合**（箭头 + 背景），理由：视觉效果强、实现成本低、不会过度设计。

**结果**：用户确认后一次性实现，无需反复调整。

**经验沉淀**：
```
用户提出问题 → AI 分析全貌 → 给出完整方案 → 用户选择 → 实施 → 验证
```
这种模式避免了"代码写了一半再重构"的风险。

### 4.2 低效模式：逐步修复（需避免）

**典型案例：GitHub Pages 部署**

问题：反复 4 次才部署成功，每次只解决 1 个问题。

| 次数 | 问题 | 修复 |
|------|------|------|
| 第1次 | npm registry 不通 | 改镜像源 |
| 第2次 | .npmrc 未生效 | 修复配置路径 |
| 第3次 | CI cache 问题 | 清理缓存 |
| 第4次 | CI 环境缺少依赖 | 完善 package-lock |

**根因分析：**
1. AI 倾向于"逐步迭代"而非"一次性完整诊断"
2. 缺少主动验证全链路的步骤
3. 用户反馈周期长，问题累积

**改进方向**：下次遇到 CI/部署问题，要求 AI **"先完整诊断，列出所有问题，再一起修复"**。

### 4.3 AI 游戏开发 SOP（优化版）

基于本次复盘，建议的游戏开发 SOP：

```
1. 需求确认（明确核心功能优先顺序）
2. brainstorming 方案设计        ← 高效时刻
3. AI 完整诊断（一次性列出所有问题）← 新增环节
4. 实施（一次性修复所有问题）    ← 合并
5. verify 完整性验证            ← 强化
6. 部署
```

***
## 五、待改进项

### 高优先级

| 问题 | 说明 | 建议 |
|------|------|------|
| 时间系统不统一 | Plant 用 `Date.now()`，PlayScene 用 Phaser `time` | 重构为统一 `gameTime` 管理器 |
| 内存泄漏风险 | WaveManager 中 zombie 引用需确认释放 | 增加引用计数或弱引用 |
| 移动端适配 | 无 `devicePixelRatio` 处理 | 添加高清屏适配 |

### 中优先级

| 问题 | 说明 | 建议 |
|------|------|------|
| 生产构建体积 | 1.5MB，未进行分包 | 配置 `manualChunks` 分割 Phaser |
| 事件监听优化 | 未使用 `passive` | 提升移动端滚动性能 |
| 僵尸攻击视觉反馈 | 代码有但未验证 | 补充视觉反馈机制 |

### v1.1 规划

- [ ] 计分系统
- [ ] 音效
- [ ] 寒冰射手（减速僵尸）
- [ ] 路障僵尸
- [ ] 存档功能

***
## 六、整体实践总结

| 经历 | 可沉淀的能力 |
|------|-------------|
| 纹理程序化生成 | Canvas API、游戏资源制作 |
| Scene-Entity Pattern | 架构设计、设计模式应用 |
| 数据驱动配置 | 数值策划与游戏平衡 |
| GitHub Actions CI/CD | DevOps、自动化部署 |
| AI 协作流程优化 | 工程效率、流程改进 |

***
## 七、总结

PlantsGame MVP 证明了：**AI Coding 工具（如 Claude Code）可以大幅提升开发效率**，28 小时完成一个可玩的游戏 Demo 是完全可以实现的。

但 AI Coding 也有边界：
- **架构设计**仍需人来把关（好的分层结构让后续迭代轻松很多）
- **全链路验证**必须刻意为之，否则会陷入"局部最优、反复修补"的陷阱
- **部署/DevOps 问题**建议一次性诊断，而非逐步修复

**下一个目标**：把这段 AI 协作经验沉淀为可复用的 SOP，让每一小时的学习都转化为生产力的提升。

***
**在线体验**：https://sunrong.site/plantsgame/

**相关阅读：**
- [Reflexion 论文深度解读：用语言代替梯度，让Agent学会自我反思](../ai-theory/reflexion-paper-learning.md)
- [ReAct 论文解读：让大模型学会"边想边做"](../ai-theory/react-paper-learning.md)

欢迎交流讨论，我的 blog：[sunrong.site](https://sunrong.site)