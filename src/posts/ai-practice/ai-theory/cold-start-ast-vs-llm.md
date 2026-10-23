---
title: 代码知识库的确定性冷启动：AST 能给你什么，给不了你什么
icon: sitemap
date: 2026-10-23
update: 2026-10-23
categories:
  - AI 实践
  - AI 理论
tags:
  - 知识工程
  - AI Coding
  - Aider
  - Tree-sitter
  - Code Wiki
  - Obsidian
  - BMAD
author: Mr.Sun
public-safe: true
---

# 代码知识库的确定性冷启动：AST 能给你什么，给不了你什么

> "用 AST 提取做零幻觉冷启动" —— 这个说法在 TypeScript 上成立，
> **在 Vue 组件上完全不成立**。
>
> 这篇是我在一个真实仓库（412 文件 / 65,775 行）上跑出来的实测数据。

**知识工程系列**
| 篇 | 内容 |
|---|---|
| [第 1 篇](/posts/ai-practice/ai-theory/knowledge-engineering-llm-wiki.html) | LLM Wiki 是什么 · 三层架构 · 三大核心引擎 · 三个开源实现 |
| [第 2 篇](/posts/ai-practice/ai-theory/knowledge-engineering-rag-vs-wiki.html) | RAG 还是 LLM Wiki · 决策表 · 三个判断维度 |
| **第 3 篇（本文）** | 存量代码仓的冷启动 · AST 的能力边界 · 三层提取 |

<!-- more -->

## 一、场景：一个成熟仓库，怎么建知识库

先说清楚要解决什么。

你接手一个**已经稳定交付**的存量代码仓：几十万行代码、跑在生产上、没人敢大改。

现在你要给 AI Coding 建知识库 —— 让 Agent 能秒懂"支付网关怎么工作"、"退款逻辑改了会影响谁"。

**最直觉的做法**：让 LLM 读源码，写文档。

**问题**：

| 成本 | 具体表现 |
|---|---|
| **Token 爆炸** | 65,775 行全读一遍，一个上下文塞不下 |
| **幻觉** | LLM 会把不存在的函数写进 API 列表 |
| **不可复现** | 跑两次结果不一样，没法当基线 |

**所以有一个很流行的方案：用 AST 工具做零幻觉的冷启动。**

具体是 Aider（底层是 Tree-sitter）：

```bash
aider --read-only src/ --chat-mode architect --yes-always --message "请扫描 src/ 目录..."
```

**听起来很美。我照着做了，然后实测了。**

**结论：方向对，但这个命令跑不通，而且"零幻觉"的前提在 Vue 项目上不成立。**

下面是我测出来的每一条。

---

## 二、先修三个会直接报错的地方

### ① `--read-only` 这个参数不存在

我把 aider v0.86.2 的 **166 个 CLI 选项**全拉下来核对：

```
--read-only          不存在 ❌
--read               存在 ✅   （把文件以只读方式加入上下文）
--map-tokens         存在 ✅
--show-repo-map      存在 ✅
--yes-always         存在 ✅
```

**这条命令会直接报错退出。**

`--read FILE` 的语义是"把这个文件当只读素材加进上下文"，跟"整个会话不许写文件"是两回事。

### ② `architect` mode 不是"只读不写"

官方定义（aider 文档原文）：

> `architect` — Like code mode, **aider will change your files**. An architect model will propose changes and an editor model will translate that proposal into specific file edits.

**architect 是双模型协作模式**（architect 提方案 → editor 落成文件），需要配两个模型，成本是 code mode 的两倍。

真正的"只读"是 `ask` mode：

> `ask` - Aider will discuss your code and answer questions about it, but **never make changes**.

### ③ 正确的冷启动命令

**aider 官方 FAQ 推荐的姿势是用 `--show-repo-map` 把结构直接落盘：**

```bash
# 步骤 1：确定性提取 —— 完全不经过 LLM，零幻觉零 token
aider --show-repo-map --map-tokens 20000 --no-gitignore > .wiki/_repo-map.txt

# 步骤 2：把 map 喂给 LLM 生成 wiki
aider --read .wiki/_repo-map.txt --yes-always --message "..."
```

> ⭐ **`--show-repo-map` 是这个方案里最该用的命令。**
>
> 它直接把 Tree-sitter 解析出的结构 dump 成文件 —— **这一步不经过 LLM，所以既零幻觉，也零 token 成本。**
>
> 我实测扫 412 个文件用了 **12.5 秒**。

---

## 三、核心实测：token 预算买到多少覆盖率

我在真实仓库上跑了三档。

![repo map 覆盖率实测](/images/cold-start-repo-map-coverage.png)

**先说结论这张图最反直觉的地方**：

| `--map-tokens` | 有符号详情的文件 | 覆盖率 |
|---|---|---|
| 4,000 | 45 / 156 | **28%** |
| 20,000 | 91 / 156 | **58%** |
| 60,000 | 119 / 156 | **76%** |

**token 翻 15 倍，覆盖率只从 28% 涨到 76%。**

而且**剩下的 24% 不是"预算不够"，是结构性的** —— 见下一节。

> 附：实测脚本我开源在
> [measure-repo-map-coverage.py](https://github.com/sunrong1/sunrong1.github.io/blob/master/src/images/measure-repo-map-coverage.py)，
> 你可以直接跑在自己的仓库上。输出长这样：
>
> ```
> --map-tokens   4000: 有符号详情  45/156 (28%)
> --map-tokens  20000: 有符号详情  91/156 (58%)
> --map-tokens  60000: 有符号详情 119/156 (76%)
>
> 按扩展名统计「有符号详情」比例：
>   .ts      113/130 ( 86%)
>   .vue       0/19  (  0%)  <== 完全失效
>   .py        6/6   (100%)
> ```

---

## 四、决定性发现：`.vue` 组件 100% 失效

### 按目录拆开看

60k token 下的分布：

| 目录 | 有符号详情 | 实际 | 覆盖率 |
|---|---|---|---|
| `src/core/` | 12 | 14 | 86% |
| `src/services/` | 8 | 8 | 100% |
| `src/app/` | 5 | 5 | 100% |
| `src/content/` | 4 | 4 | 100% |
| **`src/components/`** | **0** | **16** | **0%** |
| **`src/views/`** | **0** | **2** | **0%** |

**组件目录 —— 一个组件都没进去。**

### 根因（源码级）

我翻了 aider 的 `repomap.py`，它只收两类标签：

```python
# aider/repomap.py
if tag.kind == "def":
    defines[tag.name].add(rel_fname)      # 导出的定义
elif tag.kind == "ref":
    references[tag.name].append(rel_fname) # 引用
```

而这个仓库的 16 个组件**全部用 `<script setup>`**：

```vue
<script setup lang="ts">
const props = defineProps<{...}>()
function onPick() { ... }
</script>
```

**`<script setup>` 里的顶层绑定不是"导出"** —— 没有 `export` 关键字。

它既不是 `def` 也不是 `ref` → **在 repo map 里彻底隐身**。

> 🎯 **一句话：repo map 对 `<script setup>` 组件完全无效。**
>
> LLM 拿到的是一串文件名（`BattleField.vue`、`Tower.vue`、`Zombie.vue`），**没有一个字节的代码信息**。

### 顺带一个更狠的事实

repo map 的清单段（给人看的完整文件列表）**也是被 PageRank 排序后截断的**。

我在 60k 档实测：清单段里 `src/` 开头的只有 **36 个**，`.vue` 组件虽然"被列出"了，但**后面一行符号都没有**。

> **在 repo map 里，`.vue` 组件既没有内容，也没有位置。**

---

## 五、但这反而挖出了更值钱的真相

我去看了一个"完全失效"的组件的实际内容 —— `QuestionCard.vue`：

```vue
<script setup lang="ts">
/**
 * QuestionCard —— 卡面（Story 1.11 / AC-C5、AC-D1、AC-D2、AC-D3）。
 *
 * ── 职责边界 ──────────────────────────────────────────────────────────────
 * 题面区 + 选项区 + 重听。**不判定对错**（AC-D1）：它读的是 reducer 已经
 * 算好、存进 `state.masteredEntryIds` 的事实，不是自己实现一条规则。
 * 判据在下面 `pickedRight`，**三行、零分支逻辑**。
 *
 * ── 刻意不做的事 ──────────────────────────────────────────────────────────
 * · **不 import `services/pronunciation`** —— 朗读只经 `store` 的
 *   `speakQuestion()` 门面（裁决 3、守卫 G25）。
 * · **不 throw、不写 assert**（AC-E3 / `[GA]:567-575`）。
 * · **不直接调 `app/effects-runner.ts`** —— 📎 它属 Story **1.14**（不是 1.13，
 *   旧编号残留已按 R-32 更正），本组件的音效一律由 `applyAction` 触发它；
 *   这里自己播一遍就是重复播放，且守卫 **G60** 会判红。
 *
 * ⚠️ **1.19 CR 之前这道题住在组件本地的 `lastQuestion` ref 里**，
 * 而存档恢复时组件是**全新挂载**的 ⇒ 那份 ref 恒为 `null`
 * ⇒ **孩子从存档回到建造期时卡面整个消失**。
 * 1.15 当年把这件事判成「这是正确的：重启本来就不停在『刚刚答完』的反馈上」，
 * **实测证明那个判定漏了「存档恢复」这一种形态** —— 而它才是用户真会遇到的。
 */
```

> 💡 **这个组件的顶部注释里包含了：**
>
> - **职责边界**（做什么 / 不做什么）
> - **刻意不做的事**（不 import 什么、不 throw、不直接调什么）
> - **历史踩坑**（CR 之前的设计错误，及其被推翻的理由）
> - **ADR 引用**（裁决 3、守卫 G25、Story 1.14、R-32）
>
> **这些是 repo map 永远提取不出来的 —— 但恰恰是知识库里最值钱的部分。**

这印证了 Karpathy 那句话的另一半：

> **"read and understand" 和 "extract structure" 是两种能力。**
>
> AST 擅长前者里的"结构"，而知识库需要的是后者里的"理解"。

### 更关键的推论

**这个组件的注释，是人写的。**

写它的时候，作者必须先想清楚：这个组件归谁管、边界在哪、哪些事**故意不做**。

> ⭐ **"刻意不做的事"这一栏，是 AST 永远给不了、但对知识库最值钱的信息。**
>
> 因为它记录的是**决策**，不是事实。
>
> 事实可以重新提取，决策丢了就真的丢了。

---

## 六、修正方案：三层冷启动

![代码知识库的三层冷启动](/images/cold-start-3-layers.png)

| 层 | 工具 | 产出 | 幻觉 | 覆盖 |
|---|---|---|---|---|
| **L1 结构层** | `aider --show-repo-map` | 类/函数/常量签名 | 零 | `.ts` 完美，`.vue` 失效 |
| **L1.5 契约层** | **文件头注释提取** | 职责、约束、刻意不做的事、ADR 引用 | 零 | **`.vue` 的知识主力** |
| **L2 语义层** | LLM | 模块摘要、依赖推断、设计约束 | **有，需复核** | 全局 |

### L1.5 是新增的一层 —— 也是最重要的一层

**它不是"补充"，它是知识库真正的价值所在。**

提取方式可以极简（不需要 Tree-sitter，正则就够）：

```python
#!/usr/bin/env python3
"""提取每个源文件的头部文档注释 —— .vue 组件的知识主力来源。"""
import re, sys, os
from pathlib import Path

# 匹配 <script setup> 之后的第一个块注释，或 .ts 文件开头的块注释
BLOCK = re.compile(r"(?:<script[^>]*>\s*)?(/\*\*.*?\*/)", re.S)

def extract(path: Path) -> str | None:
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return None
    m = BLOCK.search(text)
    if not m:
        return None
    doc = m.group(1)
    # 去掉每行前导的 * 和空格
    lines = [re.sub(r"^\s*\*\s?", "", l).rstrip() for l in doc.split("\n")]
    return "\n".join(lines).strip()

if __name__ == "__main__":
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "src")
    out = []
    for p in sorted(root.rglob("*")):
        if p.suffix in (".ts", ".tsx", ".vue", ".js") and p.is_file():
            doc = extract(p)
            if doc:
                out.append(f"### {p}\n{doc}\n")
    print("\n".join(out))
```

**输出示例（对上面那个组件）：**

```markdown
### src/components/quiz/QuestionCard.vue
QuestionCard —— 卡面（Story 1.11 / AC-C5、AC-D1、AC-D2、AC-D3）。
── 职责边界 ──
题面区 + 选项区 + 重听。不判定对错（AC-D1）...
── 刻意不做的事 ──
· 不 import `services/pronunciation` —— 朗读只经 `store` 的门面...
```

### 完整冷启动命令

```bash
# 步骤 1：AST 提取结构（.ts 主力，零幻觉，12.5 秒）
aider --show-repo-map --map-tokens 20000 --no-gitignore > .wiki/_repo-map.txt

# 步骤 2：提取头注释（.vue 主力，零幻觉）
python3 scripts/extract-header-docs.py src/ > .wiki/_file-docs.txt

# 步骤 3：LLM 综合两层生成 wiki（唯一有幻觉的一层，标 draft）
aider --read .wiki/_repo-map.txt --read .wiki/_file-docs.txt \
      --yes-always --message "
请为每个核心业务模块在 .wiki/modules/ 下生成 .md 文件。
frontmatter 必须含: module, path, deps, status, last_sync, hash
status 一律 draft（这是冷启动，依赖关系是推断的，需要人工复核）
正文只保留: 职责(1句)、核心API签名、设计约束、已知坑点
绝对不要粘贴具体实现代码
deps 必须用双链引用其他模块
最后生成 .wiki/_MAP.md
"
```

> ⭐ **注意 `status: draft` 不是可选的。**
>
> 因为 L2 层的依赖关系是**推断**的，不是提取的。**冷启动产出的任何依赖关系都需要人工复核。**

---

## 七、顺带修一个 YAML 坑

模块 frontmatter 里的 `deps` 用双链表达依赖，很自然。但 YAML 解析会翻车。

我实测了三种写法（js-yaml）：

| 写法 | 结果 |
|---|---|
| `deps: [[payment-gateway]]` | ⚠️ 解析成**嵌套数组** `[["payment-gateway"]]`，不是字符串 |
| `deps: [[a]], [[b]]` | ❌ **YAMLException，语法错误** |
| `deps: ["[[a]]", "[[b]]"]` | ✅ 正常，字符串数组 |

**多模块的写法直接解析失败。** 这意味着任何 YAML lint 都会炸 —— 而冷启动流程里加 YAML lint 是标准动作。

### 正确写法：block sequence + 引号

```yaml
---
module: order-refund
path: src/order/refund.ts
deps:
  - "[[payment-gateway]]"
  - "[[ledger-core]]"
status: draft
last_sync: "2026-10-23T14:30:00+08:00"
hash: "8f4e2a1b"
---
```

> ⚠️ **两个细节**：
>
> 1. **`last_sync` 加引号。** `2026-10-23T14:30:00+08:00` 不加引号会被 YAML 解析成 **Date 对象**（实测确认），不是字符串。拿它跟字符串比较会静默失败。
> 2. **区分确定和推断。** 建议把两类信息分开存：
>
> ```yaml
> imports:          # ← 确定性，可信
>   - "[[payment-gateway]]"
> deps:             # ← LLM 推断，需复核
>   - "[[payment-gateway]]"
> ```

---

## 八、跟 BMAD 怎么接

如果你用 BMAD Method 管流程，**不要自己在 CLAUDE.md 里手写 skill** —— BMAD 6.12 提供了官方扩展点。

### 三个会踩的坑

**① skill 名字会撞车**

BMAD 自带 `bmad-prd`（还有 `bmad-architecture`、`bmad-build`、`bmad-create-epics-and-stories`）。

你在 CLAUDE.md 里定义同名 skill，**会跟装进来的官方 skill 冲突**。

**② BMAD 自己有状态机**

6.12 里有 `sprint-status.yaml` 状态账本 + `.memlog.md` 运行记忆。

**你自己再造一套 `status: draft|review|approved` 会跟它打架。** 用它的。

**③ 产物路径是配出来的，不是约定的**

在 `_bmad/custom/` 下建覆盖文件（官方三层 customize 的第 2 层）：

```toml
# {project-root}/_bmad/custom/bmad-prd.toml
[workflow]
prd_output_path = "{project-root}/.wiki/bmad/prd"
run_folder_pattern = "prd-{slug}"
```

### 接知识库的官方插槽

`customize.toml` 里有两个字段专门干这个：

```toml
# ① 每次运行开始前加载（一次）
persistent_facts = [
  "file:{project-root}/.wiki/_MAP.md",
  "file:{project-root}/.wiki/glossary/README.md",
]

# ② 按需查询的外部知识源
external_sources = [
  "查询模块上下文时，读取 {project-root}/.wiki/modules/ 下对应文件",
  "查历史决策时，读取 {project-root}/.wiki/adr/ 下的 ADR",
]
```

> ⭐ **官方注释里 `external_sources` 的定义就是：**
>
> *"Natural-language directives describing **knowledge bases**, MCP tools, or internal systems the LLM may consult during the workflow when a relevant need surfaces."*
>
> **这就是"把 Obsidian 知识库接进 BMAD"的官方位置。**
>
> 而且它区分了两种加载时机：
> - `persistent_facts` — 激活时加载一次，全程记着
> - `external_sources` — 按需查，只在对话里浮现相关需求时

### BMAD 6.12 的实际产物结构

```
_bmad-output/
├── planning-artifacts/
│   └── prds/prd-{slug}-{date}/
│       ├── prd-{slug}-{date}.md   # 蒸馏出的成品
│       ├── .memlog.md             # 过程中的决策流水（append-only）
│       └── addendum.md            # 溢出内容
└── implementation-artifacts/
    ├── sprint-status.yaml         # 状态账本
    └── {story}.md
```

> ⭐ **`.memlog.md` 是你原方案里缺失、但极其重要的东西。**
>
> 你的 `status: draft|review|approved` 只能表达"到哪一步了"，**不能表达"过程中做了什么决定"**。
>
> BMAD 把这两件事分开了：**成品有 status，过程有 memlog。**
>
> 建议你的 `.wiki/modules/*.md` 也学这个 —— 现在只有 `hash` + `last_sync`，**只知道"源码变了没"，不知道"为什么变成这样"**。

---

## 九、什么时候不该用这套

| 场景 | 为什么 |
|---|---|
| **代码库小到能直接读完** | 几千行以内，Agent 直接读更省事 |
| **纯 Python 后端** | 实测 `.py` 覆盖率 100%，AST 提取就够了，不需要 L1.5 层 |
| **没人真的会读那个 wiki** | 三个月后一定是垃圾场 —— 这跟是不是 LLM 无关 |
| **组件没有头注释** | L1.5 层失效，又回到"只有结构没有理解" |

> ⭐ **最后一条最值得展开。**
>
> L1.5 层依赖"人已经把想清楚的东西写进注释里"。
>
> **如果没有这个习惯，L1.5 层就是空的。**
>
> 那怎么办？**先养成习惯，再建知识库。**
>
> 反过来做（先建库再补注释）会得到一堆"有结构没语义"的空壳文档 —— 跟你直接让 LLM 读源码的结果差不多，只是多花了 AST 那一步。

---

## 📚 延伸阅读

**本系列：**
- [第 1 篇 · 从 RAG 到 LLM Wiki](/posts/ai-practice/ai-theory/knowledge-engineering-llm-wiki.html) —— 三层架构与三大核心引擎
- [第 2 篇 · RAG 还是 LLM Wiki](/posts/ai-practice/ai-theory/knowledge-engineering-rag-vs-wiki.html) —— 选型决策表
- [第 3 篇（本文）· 确定性冷启动](/posts/ai-practice/ai-theory/cold-start-ast-vs-llm.html) —— AST 的能力边界

**工具与实现：**
- [aider repo map 文档](https://aider.chat/docs/repomap.html) —— 官方说明 PageRank 与 token 预算
- [aider FAQ](https://aider.chat/docs/faq.html) —— `--show-repo-map` 的官方用法
- [aider/repomap.py](https://github.com/paul-gauthier/aider/blob/main/aider/repomap.py) —— def/ref 标签的判定逻辑
- [mraza007/codewiki](https://github.com/mraza007/codewiki) —— 代码库版 LLM Wiki（纯 LLM 路线，可与本文对照）
- [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) —— 流程与状态机

**相关：**
- [SDD 模式 AI Coding 实战感悟](/posts/learning/insights/SDD模式AI-Coding实战感悟.html) —— 文档先行的另一种做法
- [BMAD Method vs SDD](/posts/ai-practice/ai-theory/bmad-method-vs-sdd-multi-artifact-ai-development.html) —— 两套流程的对比
