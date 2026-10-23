---
title: BMAD × 知识库：两套状态机怎么不打架
icon: sitemap
date: 2026-10-23
update: 2026-10-23
categories:
  - AI 实践
  - AI 理论
tags:
  - 知识工程
  - BMAD
  - AI Coding
  - Obsidian
  - Code Wiki
  - 状态机
author: Mr.Sun
public-safe: true
---

# BMAD × 知识库：两套状态机怎么不打架

> 一个项目里跑着 BMAD，又要建 `.wiki/` 知识库。
> 两边都有"状态"字段 —— 谁说了算？
>
> 这篇的答案来自一个真实项目：`sprint-status.yaml` 里 40 多个 story 的状态行，
> 加上同一仓库里刚生成的 52 个模块摘要。

**知识工程系列**
| 篇 | 内容 |
|---|---|
| [第 1 篇](/posts/ai-practice/ai-theory/knowledge-engineering-llm-wiki.html) | LLM Wiki 是什么 · 三层架构 · 三大核心引擎 · 三个开源实现 |
| [第 2 篇](/posts/ai-practice/ai-theory/knowledge-engineering-rag-vs-wiki.html) | RAG 还是 LLM Wiki · 决策表 · 三个判断维度 |
| [第 3 篇](/posts/ai-practice/ai-theory/cold-start-ast-vs-llm.html) | 存量代码仓的冷启动 · AST 的能力边界 · 三层提取 |
| **第 4 篇（本文）** | BMAD 与知识库的状态边界 · 冲突裁决 · 落地配置 |

<!-- more -->

## 一、场景：两个都有 status 的东西放在一起

先说清楚要解决什么。

你的项目已经在用 [BMAD](https://github.com/bmad-code-org/BMAD-METHOD)：

```
_bmad-output/
├── planning-artifacts/      # epics.md、game-architecture.md、gdd/
└── implementation-artifacts/
    ├── sprint-status.yaml   # ← 状态账本
    ├── 1-19-单元-1-首次试玩验证.md
    └── 2-5-内容批次-1-单元-2-单单元试点.md
```

现在你要给 AI Coding 建知识库（第 3 篇那套做法），产出：

```
.wiki/
├── _MAP.md
├── modules/
│   ├── core-reducer.md      # ← frontmatter 里有 status / hash / last_sync
│   └── core-build.md
└── glossary/
```

**两边的 status 长这样：** ⭐

```yaml
# _bmad-output/implementation-artifacts/sprint-status.yaml
development_status:
  1-19-单元-1-首次试玩验证-epic-1-的生死线: in-progress   # [DS] 第三轮：…
  2-5-内容批次-1-单元-2-单单元试点: in-progress   # [DS] 开工：Task 1 词图档位…
```

```yaml
# .wiki/modules/core-reducer.md
---
module: core-reducer
path: src/core/reducer.ts
deps:
  - "[[core-types]]"
status: draft
last_sync: "2026-10-23T18:40:00+08:00"
hash: "a1b2c3d4"
---
```

**看着就危险。** 同一个仓库里两个 `status`，一个管故事，一个管模块。

### 冲突长什么样

具体到一天：

```bash
# 你改了 reducer.ts
$ git commit -am "refactor: 拆出 applyAction"

# 01:20  BMAD 那边：Story 1.5 复审通过，状态改成 done
# 01:25  知识库这边：core-reducer.md 的 hash 对不上源码了
```

现在：

- `sprint-status.yaml` 说 `1-5-回合状态机与题单: done`
- `.wiki/modules/core-reducer.md` 说这份摘要在某个时间点是准确的
- 但 `src/core/reducer.ts` 已经变了

**谁说了算？**

最直觉的答案是"以代码为准，把两边都更新一下"。这就是坑的开始。

---

## 二、样例：真实的两个文件，放在一起看

### 样例 1：状态账本长什么样

这是真实项目里的 `sprint-status.yaml`（截取）：

```yaml
development_status:
  epic-1: in-progress
  1-4-战斗内核与-5-条数值断言: done
  1-10-战场渲染与网格: done   # [CR] 第二轮完成；文档已归档，见 story 文档
  1-12-建造-阳光与射程可视化: done
  1-15-存档与断点续学: done   # [CR] 第二轮完成；文档已归档，见 story 文档
  1-18-目标平板落地-竖屏布局-离线与部署: review   # [CR] 31 条 patch 全修完；AC-B8 真机未验，状态不动
  1-19-单元-1-首次试玩验证-epic-1-的生死线: in-progress   # [DS] 第三轮：…
  2-1-词图产能验证: done
  2-3-阳光经济档位扩展: done   # [CR] 完成；1 条未裁决见 deferred-work 的 DF-138，见 story 文档
  2-4-选项数量递进规则: done   # [CR] 完成；守卫 G262–G276 / 变异 M308–M325；对抗评审分诊与四处更正留痕见其 story 文档
  2-5-内容批次-1-单元-2-单单元试点: in-progress   # [DS] 开工：…
```

**注意状态行尾的注释。** 全是「一行指针」：

- `# [CR] 第二轮完成；文档已归档，见 story 文档`
- `# [CR] 1 条未裁决见 deferred-work 的 DF-138，见 story 文档`
- `# [CR] 守卫 G262–G276 / 变异 M308–M325；对抗评审分诊与四处更正留痕见其 story 文档`

**没有一行复盘正文。** 复盘在各自 story 文档里。

这不是随便写的。这个文件头部有一条规则：

```yaml
# ⚠️ R-42：本文件是**状态账本**，运行复盘（实测值 / 裁决理由 / 假绿复盘 /
#    工具纪律痕迹）一律写进对应 story 文档的 Completion Notes / Debug Log，
#    这里**最多留一行指针**。2026-10-21 已按 R-42 全量收敛
```

**R-42 就是答案。** ⭐ 它不是我在总结规律，是这个项目里已经写下的规则。

### 样例 2：知识库模块长什么样

```yaml
---
module: core-reducer
path: src/core/reducer.ts
deps:
  - "[[core-types]]"
  - "[[core-turn]]"
  - "[[core-combat]]"
status: draft
last_sync: "2026-10-23T18:40:00+08:00"
hash: "51087382"
---
```

**三个字段，三个职责：**

| 字段 | 回答的问题 | 谁写 |
|---|---|---|
| `status` | 这份摘要是 `draft`（待复核）还是 `verified` | 人工复核后改 |
| `hash` | 源码变了没有 —— 内容指纹 | 自动算 |
| `last_sync` | 上次对齐源码是什么时候 | 自动填 |

**这里没有 story 编号，没有 sprint，没有进度百分比。** 有意为之。

### 样例 3：两边的字段名根本不一样

| | BMAD 状态账本 | 知识库模块 |
|---|---|---|
| 字段名 | `development_status` | `status` |
| 取值 | `backlog` / `ready-for-dev` / `in-progress` / `review` / `done` | `draft` / `verified` |
| 谁会改 | Dev agent 推进 story 时 | 人工复核摘要时 |
| 变更原因 | **做完了** | **看清楚了** |
| 变更频率 | 每个 story 几次 | 每个模块几次 |
| 生命周期 | 随项目推进而收口 | 永远存在，反复同步 |

**取值空间都不相交。** `done` 和 `verified` 不是一个维度的东西。

### 样例 4：memlog 刻意没有状态

BMAD 自带的 `memlog.py` 头部写着三条不变量，第三条是关键：

```
3. No lifecycle status. A memory log has no "complete" flag. Whether the work is
   done, blocked, or paused is itself a fact that happened, so it is recorded as
   an entry (e.g. `append --type event --text "session complete"`), never as
   frontmatter the log would have to mutate. The chronology stays the single
   source of truth, and a resume learns the state by reading the last entries
   — the same way it learns everything else.
```

翻译过来：**"做完了"不是一个状态字段，是发生过的一件事实。**

这条设计选择，直接决定了 memlog 和 `sprint-status.yaml` 不会打架 —— 因为一个根本没有状态字段。

---

## 三、深入：为什么它们本来就不该打架

### 3.1 两套状态机回答的是两个不同的问题

![两套状态机各管一件事](/images/bmad-wiki-two-state-machines.png)

| | 流程层（BMAD） | 知识层（`.wiki/`） | 源码层（`src/`） |
|---|---|---|---|
| **问题** | 这件事做到哪一步了？ | 这份摘要还新鲜吗？ | 现在实际是怎样的？ |
| **载体** | `sprint-status.yaml` | `modules/*.md` frontmatter | 代码本身 |
| **状态语义** | 工作量进度 | 知识置信度 | 无状态，是基准 |
| **谁改** | Dev agent | 人工复核 | 人写代码 |
| **一局/一次游戏** | 一个 story 的生命周期 | 一个模块的同步周期 | —— |

**"两个状态机"这个说法本身就暗示了错误。** 它们不是同一个状态机的两个副本，是两个正交的状态机。

正交的意思是：Story 1.5 变成 `done`，不会让 `core-reducer` 的摘要变旧。反过来，`core-reducer` 的摘要需要重新同步，也不影响 Story 1.5 已经做完这个事实。

**它们没有共享的状态转移。** ⭐ 这就是不打架的原因 —— 不是靠小心翼翼地避免冲突，而是结构上不冲突。

### 3.2 那"代码改了、两边不一致"呢？

回到样例开头那个场景。

**答案：两边都不用改。**

| | 该怎么变 | 为什么 |
|---|---|---|
| `sprint-status.yaml` | 不动 | Story 1.5 确实做完了。"做完"是关于工作量的判断，不会因为后来重构了而失效 |
| `.wiki/modules/core-reducer.md` | 不动 | 摘要描述的是**那个时刻**的 reducer。历史不需要跟着改 |
| 新的摘要 | 重新同步 | 新 hash、新 `last_sync`、新内容，**写成另一个版本**（或覆盖，但保留 diff） |
| Lint | 报「core-reducer 摘要已过期」 | 过期是**要处理的信号**，不是要消除的错误 |

**关键区分：过期 ≠ 错误。** ⭐

一个 `status: draft` 且 hash 对不上的模块，正确状态就是"过期，待重新同步"。它不该被藏起来，也不该阻塞别的工作。

**如果 Lint 报过期就让 CI 变红、让整个流水线卡住 —— 那才是把两套状态机焊在一起了。** 正确的做法是：过期是**警告**，人工排期处理。

### 3.3 真正的危险动作：往状态账本里加一列

大多数人第一次搞这套东西，会想这么干：

```yaml
# ❌ 别这么干
development_status:
  1-5-回合状态机与题单: done
  # 新加一列：知识库状态
  wiki-1-5: stale
```

**为什么不行？**

1. **状态值域被污染。** `done` 是工作量语义，`stale` 是知识语义。混在一个 map 里，
   任何"把所有 status 刷成 done"的脚本都会误伤知识库那一半。
2. **产生了第三套状态机。** 原本是两套正交的，加一列之后变成"账本里的列"、
   "知识库的字段"、"模块的 status" —— 三处都能表示同一件事。
3. **谁来同步？** `wiki-1-5: stale` 这个值，只有跑 Lint 的人能算。
   但账本由 Dev agent 推进 —— 现在 agent 要在推 story 的时候顺便算知识库新鲜度。
   **职责边界一破，两套就真的开始打架了。**

同样的道理：不要在 `.wiki/modules/*.md` 里加 `story: 1-5` 或 `sprint: epic-1`。

**判据很简单：字段的"定义者"是谁？** ⭐

- `status: backlog → done` 的定义者是 **BMAD**（story 生命周期）
- `status: draft → verified` 的定义者是 **知识库**（摘要置信度）
- 判据是：**谁在定义这个字段的取值空间，谁拥有它。**

### 3.4 共享事实往哪放

两边都不写、但都需要的东西 —— 裁决理由、复盘、实测值 —— 放第三层。

真实项目里的落点：

| 文件 | 放什么 | 谁维护 |
|---|---|---|
| story 文档的 `Completion Notes` / `Debug Log` | 这个 story 的实测值、假绿复盘、工具纪律痕迹 | Dev agent |
| `decision-log.md` | 跨 session 的设计决策与理由 | 人 / GDD 流程 |
| `.memlog.md` | 发生过的一切，append-only | memlog 工具 |

**三份文档都不带生命周期状态。** ⭐ 这不是巧合，是设计。

`memlog.py` 的不变量 3 说得最直白：状态本身也是一条事实。

而 `sprint-status.yaml` 只在需要"卡住流程"的时候才写状态 —— 它是流程闸门，不是知识仓库。

### 3.5 落地：挂到 BMAD 上

按第 3 篇的冷启动流程做完 `.wiki/` 之后，怎么让 BMAD 用上它？

**不要手写同名 skill。** BMAD 的自定义是三层覆盖（`_bmad/custom/<skill>.toml` 团队层 / `.user.toml` 个人层 / skill 自带 `customize.toml` 基础层），合并规则是标量覆盖、表深合并、数组追加。

两个可用的插槽：

**`persistent_facts`** —— 激活时加载，常驻上下文：

```toml
# _bmad/custom/gds-dev-story.toml
[workflow]
persistent_facts = [
  "知识库位于 .wiki/，模块摘要索引在 .wiki/_MAP.md。改动 src/core/ 下任何文件后，必须同步更新对应 .wiki/modules/<name>.md 的摘要内容与 hash。",
]
```

**`external_sources`** —— 按需查询，不预加载：

```toml
# _bmad/custom/bmad-prd.toml
[workflow]
external_sources = [
  "当需要了解某个模块的职责、依赖或已知坑点时，先读 .wiki/_MAP.md 定位模块，再读 .wiki/modules/<module>.md，不要直接 grep 整个 src/。",
]
```

**为什么一个用 `persistent_facts`、一个用 `external_sources`？**

| | `persistent_facts` | `external_sources` |
|---|---|---|
| 加载时机 | skill 激活时，常驻 | 需求出现时才查 |
| 适合 | 纪律、硬约束 | 按需检索的知识 |
| 成本 | 占常驻上下文 | 不占（用到才查） |

**知识库索引适合 `external_sources`** —— 52 个模块的索引塞进常驻上下文太贵，用到再查。
**"改了代码要同步摘要"这种纪律适合 `persistent_facts`** —— 它是规则，不是知识。

**还有一条不能忘：`persistent_facts` 只能加不能减。** BMAD 官方文档写得很直接：

> No removal. An override cannot delete a base item. To suppress a default menu item,
> override it by `code` with a description or prompt that does nothing; to restructure
> an array further, fork the skill.

想删掉 BMAD 自带的某条 fact？做不到，只能 fork skill。

### 3.6 知识库这一层要自己 lint

BMAD 有自己的流程闸门，但**不会替你 lint 知识库** —— 因为这本来就是两套生命周期。

最低限度的三条：

```bash
# 1. hash 对不上 → 报过期（警告，不阻塞）
# 2. path 指向的文件不存在 → 报错误（阻塞）
# 3. 双链断裂 → 报错误（阻塞）
```

**注意第 1 条是警告，第 2、3 条是错误。** 过期是常态，路径错和断链是缺陷。

一个能用的检查长这样：

```bash
#!/usr/bin/env bash
# 检查 .wiki/modules/ 的 hash 与实际源码是否一致
cd "$(dirname "$0")/.."
stale=0
for md in .wiki/modules/*.md; do
  path=$(grep -m1 '^path:' "$md" | cut -d' ' -f2-)
  hash=$(grep -m1 '^hash:' "$md" | tr -d '"' | cut -d' ' -f2-)
  real=$(md5sum "$path" | cut -c1-8)
  if [ "$hash" != "$real" ]; then
    echo "⚠️ 过期: $md  ($path)"
    stale=$((stale+1))
  fi
done
echo "过期模块: $stale"
exit 0        # ← 注意 exit 0：过期不阻塞流水线
```

**`exit 0` 是故意的。** ⭐ 过期不阻塞 —— 阻塞了就成了第三套状态机。

---

## 四、落地清单

如果你要在自己的项目里做这件事：

**1. 先确认 BMAD 的状态源在哪**

```bash
grep -rn "development_status\|sprint-status" _bmad-output/ | head
```

找到那个文件，它就是流程层的唯一入口。

**2. 知识库用自己的字段名**

别用 `status` 之外的流程词汇。建议最小字段集：

```yaml
status: draft          # draft | verified
hash: "51087382"       # 源码指纹
last_sync: "..."       # 上次同步时间
```

**3. 判据：谁定义取值空间，谁拥有这个字段**

要加新字段之前问一句。答案是"BMAD"就别加进知识库，答案是"知识库"就别加进账本。

**4. 共享事实放第三层**

story 文档 / decision-log / memlog。它们都不带状态，正好。

**5. 过期是警告，缺陷是错误**

Lint 的退出码要区分。否则知识库会变成流水线上的第二个闸门。

**6. 挂载用 `persistent_facts` + `external_sources`**

纪律进 `persistent_facts`，索引进 `external_sources`。

---

## 写在最后

两套状态机不打架，不是因为有人管住了它们，是因为**它们从一开始就不该管同一件事**。

`sprint-status.yaml` 回答"做完了吗"，`.wiki/modules/*.md` 回答"说得准吗"。这两个问题的变更原因不同、生命周期不同、取值空间不重叠 —— 结构上就没有冲突源。

真正会打架的，是你想让一个地方"什么都知道"。

我把这个项目里早就写下的 R-42 拿出来当答案，不是想显得我有洞察。**规则已经在那儿了，只是要有人读。** 那个项目为了这条规则专门做了一次全量收敛（2026-10-21），把 `sprint-status.yaml` 里所有复盘正文清空、状态行尾注释压成一行指针 —— 代价不小，但换来的正是"账本只管账本"这件事。

**该收口的时候收口，剩下的交给该管它的人。**

---

**相关阅读**

- [第 3 篇：代码知识库的确定性冷启动](/posts/ai-practice/ai-theory/cold-start-ast-vs-llm.html) —— `.wiki/` 怎么建出来的
- [第 1 篇：LLM Wiki 模式](/posts/ai-practice/ai-theory/knowledge-engineering-llm-wiki.html) —— 三层架构与三大引擎
- [BMAD 官方文档：expand-bmad-for-your-org](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/customize/adopt-bmad-across-a-team.md) —— `persistent_facts` / `external_sources` 的完整定义
