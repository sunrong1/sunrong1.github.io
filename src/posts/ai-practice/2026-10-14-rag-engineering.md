---
title: RAG 工程化实战:分层评估、查询转换、分块与 Agentic 实现
icon: wrench
date: 2026-10-14
update: 2026-10-14
categories:
  - AI Agent
  - 软件架构
tags:
  - RAG
  - 检索增强生成
  - 分层评估
  - 查询转换
  - 分块策略
  - Chunking
  - Agentic RAG
  - CRAG
  - Rerank
author: Mr.Sun
star: true
---***
# RAG 工程化实战:分层评估、查询转换、分块与 Agentic 实现

> RAG 学习 Day 2 下半部分。
> 关键字:**分层评估 / MRR vs MAP / 忠实度 / 查询转换 5 方法 / Step-back / 自适应 RAG / 分块策略 / Rerank / CRAG / Agentic RAG 实现**。

***

## 📌 写在前面

上一篇讲了 RAG 的五种范式和演进。但范式只是"选哪条路"。

**真正决定效果的是路上怎么走。**

我把这部分过了一遍，最大的感受是：

> **RAG 的效果问题，90% 不是"要不要上 GraphRAG"，而是"你能不能定位是哪一层坏了"。**

这篇讲工程化的四件事：
1. **分层评估** —— 定位问题出在哪一层
2. **查询转换** —— 5 种方法怎么选
3. **分块策略** —— 唯一没有 ground truth 的环节
4. **Agentic RAG 实现** —— 自主决策的约束机制

***

<!-- more -->

## 📌 一个真实的翻车现场

### 现象

```
用户问"报销标准是多少？"
AI 答了一堆无关的差旅政策。
```

### 没有分层评估时的排查

```
换 embedding 模型？  还是这样
改 chunk_size？       还是这样
加 rerank？           还是这样
调 prompt？           好了，但只是这个 case 好了
                     ↑
              改了一天，不知道到底哪一步起作用
```

### 有分层评估时的排查

```
Step 1 · 切块评估
  → 报销标准这一段和"报销流程"粘在一起了（chunk 边界问题）

Step 2 · Query 理解评估
  → 属于"标准查询"类，但模板是按"流程查询"写的

Step 3 · 召回评估
  → 相关块在 top-50 里吗？ → 在（rank 3）✅

Step 4 · 重排评估
  → MRR 是多少？ → 排到 rank 7，被前面 6 个噪声挤下去

Step 5 · 答案评估
  → 忠实度 0.42 —— 模型在编
```

**10 分钟定位到 3 个问题点，而不是改一天瞎试。**

---

# 💎 第一章 · 分层评估

## 一、为什么必须分 5 层

RAG 是一条**长链路**：

```
文档 → 切块 → Embedding → 入库
                              ↓
Query → 理解 → 转换 → 检索 → 重排 → 后处理 → 拼 Prompt → LLM → 答案
       ①     ②       ③      ④      ⑤      ⑥
```

**任何一个环节出问题，最终答案都会变差。** 但"答案不好"这个信号太粗了。

### 分层评估结构

```
┌─────────────────────────────────────────────────────────┐
│  5. LLM 回答评估                                        │
│     答案相关性 / 忠实度                                  │
├─────────────────────────────────────────────────────────┤
│  4. 重排评估                                            │
│     MRR / MAP / NDCG / 上下文相关性                      │
├─────────────────────────────────────────────────────────┤
│  3. 召回评估（检索阶段）                                  │
│     Recall@k / Precision@k                              │
├─────────────────────────────────────────────────────────┤
│  2. Query 理解评估                                       │
│     分类准确率 / 改写保真度 / 意图识别率                  │
├─────────────────────────────────────────────────────────┤
│  1. 文档切块评估                                         │
│     切块完整性 / 语义连贯性 / 元数据正确性                 │
└─────────────────────────────────────────────────────────┘
```

### 现象 → 原因 → 动作对照表

| 你观察到的现象 | 可能的原因层 | 该改什么 |
| :--- | :--- | :--- |
| 答案完全跑题 | 1 / 2 / 3 | 切块 / query 改写 / 召回算法 |
| 答案对但不完整 | 3 / 4 | 召回率不够 / 重排没排上来 |
| 答案里有编的内容 | 5 | prompt 约束 / 上下文不足 / 忠实度约束 |
| 特定类别题差 | 2 | Query 分类 / 分流策略 |

**不分层 = 你永远不知道该改哪里，只能瞎试。**

---

## 二、召回 vs 精确率

| 指标 | 公式 | 含义 | 什么时候重要 |
| :--- | :--- | :--- | :--- |
| **Recall@k** | 召回到的相关条数 / 全部相关条数 | **该找到的找到了吗** | 召回阶段 |
| **Precision@k** | 召回中的相关条数 / k | **找回来的有多少有用** | 召回阶段 |

### 这个权衡决定 k 值怎么定

```
k 太小（如 k=1）
  → Recall 低（很多相关块没召回）
  → Precision 高（1 条基本都是准的）
  → 后果：信息不全，答案缺内容

k 太大（如 k=50）
  → Recall 高（该有的都有了）
  → Precision 低（一半是噪声）
  → 后果：噪声干扰模型，token 浪费

k 适中（k=20 召回 + k=3 重排）
  → 召回阶段放宽，保证 Recall
  → 重排阶段收紧，保证 Precision
  → ★ 这就是两阶段检索的意义
```

---

## 三、MRR —— 第一个排对的位置有多靠前

### 公式

```
MRR = (1/|Q|) × Σ  1/rank_i

rank_i = 第 i 个查询中，第一个正确文档的排名
```

### 样例

| 查询 | 正确文档排名 | 得分 |
| :--- | :--- | :--- |
| Q1 | rank 1 | 1/1 = 1.0 |
| Q2 | rank 3 | 1/3 = 0.333 |
| Q3 | rank 2 | 1/2 = 0.5 |

```
MRR = (1.0 + 0.333 + 0.5) / 3 = 0.611
```

### 为什么重要？

**LLM 通常只重点看上下文最前面的内容**（lost in the middle 再一次）。

所以 **rank 1 和 rank 20 的差别，比 rank 20 和 rank 40 的差别大得多**。

**MRR 直接衡量"最重要的信息放得够靠前吗"** —— 这是直接影响答案质量的关键指标。

---

## 四、MAP —— 所有相关文档的平均精确位置

### 公式

```
AP (Average Precision) = (1/R) × Σ_{i=1}^{R}  P(i) × rel(i)

  R = 该查询下所有相关文档总数
  P(i) = 前 i 个结果的精确率（Precision@i）
  rel(i) = 第 i 个结果是否相关（相关=1，不相关=0）

MAP = (1/|Q|) × Σ AP(q)
```

### 样例（Q1 有 2 个相关文档，检索 top-5）

```
排序结果：A(相关) B(无关) C(相关) D(无关) E(无关)

位置 1: A 相关 → P@1 = 1/1 = 1.0,  rel=1 → 贡献 1.0
位置 2: B 无关 → P@2 = 1/2 = 0.5,  rel=0 → 贡献 0
位置 3: C 相关 → P@3 = 2/3 = 0.67, rel=1 → 贡献 0.67
位置 4: D 无关 → rel=0 → 贡献 0
位置 5: E 无关 → rel=0 → 贡献 0

AP = (1/2) × (1.0 + 0.67) = 0.833
```

### MRR vs MAP 的区别

| | MRR | MAP |
| :--- | :--- | :--- |
| **只看** | 第一个正确结果 | **所有**正确结果 |
| **假设** | 用户只看第一个 | 所有相关结果都要排前面 |
| **适用** | 问答类（答案唯一） | 检索类（多个都要） |

**MAP 的构造本身就是"综合考虑召回率和准确率"**：

```
AP 的构造：
  分子（Σ P(i)×rel(i)）= 相关文档都排前面 → 准确率
  分母（R）           = 相关文档一个不漏   → 召回率
```

### RAG 该看哪个？

**MRR 更贴近 RAG 的痛点** —— 因为 LLM 只重点看上下文前部，"第一个正确结果排多前"比"所有正确结果排多前"更重要。

**两个都看** —— MRR 看头部，MAP 看整体分布。

---

## 五、答案相关性 vs 忠实度

| 指标 | 问的问题 | 不问什么 |
| :--- | :--- | :--- |
| **答案相关性**（Answer Relevance） | **答对题了吗** | 不看内容对错 |
| **忠实度**（Faithfulness） | **有据可依吗** | 不看是否切题 |

### 4 种组合的后果

| 相关性 | 忠实度 | 表现 | 例子 |
| :--- | :--- | :--- | :--- |
| 高 | 高 | ✅ **完美** | 答了题，且都能从上下文找到出处 |
| 高 | **低** | ❌ **最危险** | **答了题但在编** —— 用户最难发现 |
| 低 | 高 | ⚠️ 无害的失败 | 答得实诚但跑题，用户自己会发现 |
| 低 | 低 | ❌ 无用 | 跑题且编 |

> **"高相关 + 低忠实"是最危险的情况** —— 答案看起来很有理，用户会信。

### 忠实度的评估方法（逐句核验）

```
1. 把答案拆成若干事实断言（claim）
2. 逐条问 judge：这句话在给定上下文里能找到出处吗？
3. faithful_ratio = 有出处的断言数 / 总断言数

样例：
答案："报销标准是 80 元/天，超 3 天需审批。"
断言 1："报销标准是 80 元/天"      → 上下文有 → ✓
断言 2："超过 3 天需要审批"         → 上下文无 → ✗
faithfulness = 1/2 = 0.5
```

---

## 六、完整评估代码

```python
def evaluate_rag(test_set: list[dict], rag_pipeline):
    """
    test_set 每条:
    {
      "query": "报销标准是多少？",
      "relevant_chunk_ids": ["chunk_042", "chunk_117"],
      "reference_answer": "标准为 ...",
      "category": "标准查询"
    }
    """
    results = []

    for item in test_set:
        # ---------- 阶段 1: 切块评估 ----------
        chunk_check = evaluate_chunking(
            item["query"],
            collection=chunks_of_this_doc,
            relevant_ids=item["relevant_chunk_ids"]
        )

        # ---------- 阶段 2: Query 理解评估 ----------
        query_check = evaluate_query_understanding(
            query=item["query"],
            rewritten_query=rag_pipeline.rewrite(item["query"]),
            category=item["category"]
        )

        # ---------- 阶段 3: 召回评估 ----------
        retrieved = rag_pipeline.retrieve(item["query"], top_k=20)
        retrieved_ids = [c.id for c in retrieved]
        recall = compute_recall(retrieved_ids, item["relevant_chunk_ids"], at_k=20)

        # ---------- 阶段 4: 重排评估 ----------
        reranked = rag_pipeline.rerank(item["query"], retrieved)
        reranked_ids = [c.id for c in reranked]

        results.append({
            "category": item["category"],
            "chunk_score": chunk_check,
            "recall@20": recall,
            "mrr": compute_mrr(reranked_ids, item["relevant_chunk_ids"]),
            "map": compute_map(reranked_ids, item["relevant_chunk_ids"]),
            "answer_relevance": answer_relevance_score,
            "faithfulness": faithfulness_score,
        })

    return aggregate_by_category(results)   # ★ 按 Query 分类分别统计


def aggregate_by_category(results):
    """不同类问题表现差异很大，必须分开看"""
    from collections import defaultdict
    grouped = defaultdict(list)
    for r in results:
        grouped[r["category"]].append(r)

    summary = {}
    for cat, items in grouped.items():
        summary[cat] = {
            "count": len(items),
            "avg_recall": mean(i["recall@20"] for i in items),
            "avg_mrr": mean(i["mrr"] for i in items),
            "avg_faithfulness": mean(i["faithfulness"] for i in items),
        }
    return summary
```

**关键：按 category 分组统计。** "标准查询"类跑 90 分，"流程查询"类跑 40 分，混在一起平均 65 分 —— 你看不出问题在哪。

---
---

# 💎 第二章 · 查询转换的 5 种方法

## 七、查询转换的三个目标

| 目标 | 含义 | 失败表现 |
| :--- | :--- | :--- |
| **① 优化措辞** | 用户的口语 → 文档的术语 | 明明库里有，搜不到 |
| **② 组合知识** | 单轮问不清 → 拆成多步 | 一次问太多，模型懵了 |
| **③ 优化效率** | 简单问题别走重流程 | 简单问题耗时 30s，还答错 |

**5 种方法分别对应这三条轴**：

```
① 优化措辞  → MultiQuery / RAG Fusion
② 组合知识  → 问题分解（串/并）/ Step-back
③ 优化效率  → 自适应 RAG（问题分类器）
```

---

## 八、方法 1 · MultiQuery

**场景**：用户用日常词，文档用专业词。

```
用户："那个报销怎么弄"
文档："财务报销流程操作指引"
  ↓
Embedding 相似度低 → 召回不到 → 答"资料不足"
```

```python
MULTI_QUERY_PROMPT = ChatPromptTemplate.from_template(
    """你是一个 AI 助手。请为下面的原始问题生成 {n} 个不同角度的变体问题。
这些变体用于向量检索，需要从不同语义角度覆盖原始问题。

原始问题：{question}

生成 {n} 个变体问题："""
)

def multi_query_retrieval(question: str, vector_store, llm, n=3):
    variants = llm.invoke(
        MULTI_QUERY_PROMPT.format(question=question, n=n)
    ).content.strip().split("\n")

    # 样例输出：
    # "报销标准是多少？"
    # "差旅报销的额度规定是什么？"
    # "公司报销 policy 标准"

    from collections import defaultdict
    scores = defaultdict(int)
    all_docs, seen = [], set()

    for q in [question] + variants:        # ★ 原问题也一起检索
        for d in vector_store.similarity_search(q, k=3):
            scores[d.id] += 1
            if d.id not in seen:
                seen.add(d.id)
                all_docs.append(d)

    # ★ 按"被几个变体命中"排序 —— 多角度都指向的块置信度最高
    all_docs.sort(key=lambda d: scores[d.id], reverse=True)
    return all_docs[:5]
```

**两个关键点**：
- **原问题也参与检索**（不只用变体）
- **按命中变体数排序** —— 这是 RRF 的思想雏形

---

## 九、方法 2 · RAG Fusion（RRF 倒排融合）

```python
def reciprocal_rank_fusion(results_list: list[list], k=60):
    """
    results_list: 多个检索方式的结果，每个是按相关度排序的 doc 列表
    例：[向量检索结果, BM25结果, 改写query结果, ...]

    RRF 公式: score(d) = Σ 1/(k + rank_i(d))
    """
    from collections import defaultdict

    fused_scores = defaultdict(float)

    for results in results_list:
        for rank, doc in enumerate(results, start=1):
            fused_scores[doc.id] += 1.0 / (k + rank)

    all_docs = {d.id: d for results in results_list for d in results}
    sorted_docs = sorted(
        all_docs.values(),
        key=lambda d: fused_scores[d.id],
        reverse=True
    )
    return sorted_docs, fused_scores
```

### 实际效果

| 检索方式 | top-1 | top-3 | RRF 后 top-3 |
| :--- | :--- | :--- | :--- |
| 向量 | 块A | 块A, B, C | **块A, 块D, B** |
| BM25 | 块D | 块D, A, E | （块D 排进 top-3 了） |
| 改写 query | 块B | 块B, D, F | |

**向量和关键词各有盲区，融合能互相补。**

### 为什么 RRF 用 rank 而不是分数？

```
不同检索方式的分数量纲不一致：
  BM25 的分数可能是 12.7
  余弦相似度可能是 0.83
  → 直接加权平均？量纲不对，BM25 会永远赢

用 rank 归一化：
  rank 1 在任何方式下都是 rank 1
  → 绕开了量纲问题
```

**RRF 公式里 `k=60` 的作用**：平滑头部差异。`1/(60+1)` 和 `1/(60+2)` 差别不大，防止"某方式排第一就霸榜"。

---

## 十、方法 3 · 问题分解（串联 / 并行）

### 场景

```
用户："上季度我们部门的测试通过率是多少？跟去年比怎么样？哪些模块拖后腿了？"

一个 query 里塞了 3 个子问题：
  1. 上季度通过率是多少？（需要 SQL 聚合）
  2. 跟去年比怎么样？（需要两期对比）
  3. 哪些模块拖后腿？（需要分组 + 排名）

直接丢给 RAG：
  → 检索到的文档只覆盖第 1 问
  → 模型只能答一半，另外两问它自己编
```

### 并行版（子问题独立）

```python
DECOMPOSE_PARALLEL_PROMPT = """把下面这个复合问题拆成最多 3 个**互相独立**的子问题。
每个子问题都能单独检索和回答。只输出编号列表。

问题：{question}

子问题："""

def decompose_parallel(question: str, llm, vector_store) -> str:
    sub_questions = llm.invoke(
        DECOMPOSE_PARALLEL_PROMPT.format(question=question)
    ).content.strip().split("\n")

    # ---------- 并发检索（★ 关键：串行会浪费时间）----------
    from concurrent.futures import ThreadPoolExecutor

    def retrieve_one(sq: str) -> list:
        return vector_store.similarity_search(sq, k=3)

    with ThreadPoolExecutor(max_workers=3) as executor:
        all_results = list(executor.map(retrieve_one, sub_questions))

    merged = merge_and_dedup([d for docs in all_results for d in docs])
    context = "\n".join(d.page_content for d in merged[:8])

    return llm.invoke(
        f"根据以下资料，逐条回答原问题的各个部分：\n"
        f"{context}\n\n原问题：{question}\n子问题：{sub_questions}"
    ).content
```

### 串行版（子问题有依赖）

```python
DECOMPOSE_SEQUENTIAL_PROMPT = """把下面这个复合问题拆成**有先后依赖**的子问题链。
后一个问题的答案依赖前一个问题的结果。按顺序编号。

问题：{question}

子问题链："""

def decompose_sequential(question: str, llm, vector_store) -> str:
    sub_questions = llm.invoke(
        DECOMPOSE_SEQUENTIAL_PROMPT.format(question=question)
    ).content.strip().split("\n")

    # 样例（依赖链）：
    # "1. 哪个模块的测试用例最多？"        ← 先答
    # "2. 该模块上季度通过率是多少？"      ← 依赖 1
    # "3. 该模块跟去年比如何？"            ← 依赖 2

    accumulated_context = []
    previous_answer = ""

    for i, sq in enumerate(sub_questions):
        # ★ 把上一步的答案注入下一步的 query
        enriched_query = f"{sq}"
        if previous_answer:
            enriched_query = f"{sq}（已知：{previous_answer}）"

        docs = vector_store.similarity_search(enriched_query, k=3)
        context = "\n".join(d.page_content for d in docs)
        accumulated_context.append(f"【子问题 {i+1}】{sq}\n{context}")

        previous_answer = llm.invoke(
            f"根据资料回答：{enriched_query}\n\n资料：{context}"
        ).content

    return llm.invoke(
        f"基于以下子问题的解答，汇总回答原问题：\n"
        f"{previous_answer}\n\n原问题：{question}"
    ).content
```

### 串并联怎么选

```
原问题包含多个子问题？
    ├─ 否 → 不是分解场景
    └─ 是 → 子问题之间有依赖吗？
             ├─ 无依赖 → 并行（ThreadPoolExecutor 并发检索）
             └─ 有依赖 → 串行（把上一步答案注入下一步 query）
```

### 误差累积：串行不能超过 3 层

```
第 1 层错误 → 第 2 层在错误基础上推理 → 第 3 层已经跑偏 → 第 4 层完全不可信
```

| 层数 | 可接受度 | 说明 |
| :--- | :--- | :--- |
| 2 层 | ✅ 好 | 依赖链短，准确率高 |
| 3 层 | ⚠️ 勉强 | 需配合中间结果验证 |
| **4+ 层** | ❌ **不行** | **误差累积到无法接受** |

**如果依赖链超过 3 层**，说明原问题太复杂 —— 应该让用户澄清，或者改用 Step-back。

---

## 十一、方法 4 · Step-back（高抽象后再提问）

### 本质：检索维度的上移

```
原问题检索（Downward，具体）：
  "session 和 module scope 有什么区别？"
  → 匹配到具体的 scope='session' 代码示例
  → 缺少 module 的对比

Step-back 检索（Upward，抽象）：
  "需要理解 fixture 的作用域机制和生命周期管理"
  → 匹配到讲作用域机制的文档段落
  → 两边都有
```

```python
STEP_BACK_PROMPT = """你正在回答一个具体问题。为了更好地回答它，
请先思考并写出回答这个问题**需要哪些通用知识/原理**（不要写具体细节）。

问题：{question}

需要的通用知识："""

def step_back_rag(question: str, llm, vector_store) -> str:
    # ---------- 1. Step-back：高抽象 ----------
    general_knowledge = llm.invoke(
        STEP_BACK_PROMPT.format(question=question)
    ).content.strip()

    # 样例：
    # question: "Pytest 里 fixture 的 scope='session' 和 'module' 有什么区别？"
    # general_knowledge: "需要理解 pytest fixture 的作用域机制、生命周期管理、
    #                     以及不同 scope 下的资源复用策略"

    # ---------- 2. 用【抽象知识】检索，不是用【原问题】----------
    #    ★ 这是 Step-back 的关键
    docs_general = vector_store.similarity_search(general_knowledge, k=5)

    # ---------- 3. 也用原问题检索（双路保险）----------
    docs_specific = vector_store.similarity_search(question, k=3)

    merged = merge_and_dedup(docs_general + docs_specific)

    # ---------- 4. 带着原问题 + 抽象知识去回答 ----------
    context = "\n".join(d.page_content for d in merged[:6])
    return llm.invoke(
        f"你已了解以下通用背景：\n{general_knowledge}\n\n"
        f"以下是检索到的资料：\n{context}\n\n"
        f"现在请回答具体问题：{question}"
    ).content
```

### 对比效果

| 查询 | 直接检索的结果 | Step-back 后 |
| :--- | :--- | :--- |
| "session 和 module scope 有什么区别？" | 只召回 `scope='session'` 那段 | **同时召回 session 和 module 两段的对比说明** |
| "跨部门审批要多久？" | 只召回"审批流程" | **召回"审批时效统计"+"跨部门流程说明"** |
| "为什么我的 Kafka consumer 重复消费？" | 召回重复消费的具体案例 | **召回 offset 提交机制 + 至少一次语义原理** |

### 什么时候 Step-back 收益最大

| 条件 | 收益 |
| :--- | :--- |
| 知识库里有**系统性的原理文档** | ⭐⭐⭐ 最大 |
| 知识库全是**碎片化片段** | ⭐ 收益有限（**没有原理文档可匹配**） |
| 问题需要**多概念综合** | ⭐⭐⭐ 大 |
| 问题需要**精确数值/参数** | ⭐ 反而可能引入噪声 |

**Step-back 的前提是知识库里有抽象层的内容。** 如果知识库全是 FAQ 片段，Step-back 没用。

---

## 十二、方法 5 · 自适应 RAG（问题分类器）

### 场景：简单问题走了重流程

```
用户："你们的 API 超时时间是多少？"    ← 一个参数查询

实际走了：
  MultiQuery 生成 3 个变体      （3 次 LLM）
  → 3 次检索
  → Rerank（1 次 cross-encoder）
  → Refinement（3 次 LLM）
  → CRAG 评估（1 次 LLM）
  → 最终生成

总耗时：8-15 秒，成本 5-6 倍
结果：还不一定对
```

### 完整实现：5 类 query 走 5 条路

```python
class QueryComplexity(Enum):
    SIMPLE_LOOKUP = "simple_lookup"      # 单点事实查询
    MULTI_HOP = "multi_hop"              # 需要多跳推理
    COMPARISON = "comparison"            # 对比类
    DECOMPOSABLE = "decomposable"        # 可拆成子问题
    AMBIGUOUS = "ambiguous"              # 模糊，需澄清

CLASSIFIER_PROMPT = """分析这个查询，判断它属于哪一类：

类型说明：
- simple_lookup：单点事实查询（"API 超时时间是多少"）
- multi_hop：需要跨多个文档、多步推理（"导致这个故障的根本原因链是什么"）
- comparison：需要对比两个及以上对象（"方案 A 和方案 B 的区别"）
- decomposable：包含多个可独立回答的子问题
- ambiguous：表述模糊，多种理解都可能（"那个东西怎么用"）

只输出类型名。

查询：{query}

类型："""


def adaptive_rag(query: str, llm, vector_store):
    """自适应 RAG：先分类，再按类走不同的检索策略"""

    # ---------- 1. 分类器 ----------
    complexity = llm.invoke(
        CLASSIFIER_PROMPT.format(query=query)
    ).content.strip().lower()

    # ---------- 2. 按复杂度走不同策略 ----------

    # 情况 A：简单查询 → 轻量路径（省 80% 成本）
    if complexity == "simple_lookup":
        docs = vector_store.similarity_search(query, k=2)
        return llm.invoke(
            f"根据资料简洁回答：\n{build_context(docs)}\n\n问题：{query}"
        ).content

    # 情况 B：多跳推理 → 迭代检索
    elif complexity == "multi_hop":
        docs_1 = vector_store.similarity_search(query, k=5)
        refined = llm.invoke(
            f"基于这些初步资料，构造一个更精准的检索查询（20字内）：\n"
            f"{build_context(docs_1)}"
        ).content
        docs_2 = vector_store.similarity_search(refined, k=5)
        merged = merge_and_dedup(docs_1 + docs_2)
        return llm.invoke(
            f"综合多轮检索结果回答：\n{build_context(merged)}\n\n问题：{query}"
        ).content

    # 情况 C：对比类 → 分别检索两边
    elif complexity == "comparison":
        items = llm.invoke(
            f"从这个问题中提取需要对比的对象列表（逗号分隔）：\n{query}"
        ).content.strip().split("、")

        per_item_docs = [vector_store.similarity_search(i, k=3) for i in items]
        merged = merge_and_dedup([d for docs in per_item_docs for d in docs])

        return llm.invoke(
            f"请用表格形式对比以下方面：{items}\n\n"
            f"资料：\n{build_context(merged)}\n\n问题：{query}"
        ).content

    # 情况 D：可分解 → 走问题分解
    elif complexity == "decomposable":
        return decompose_parallel(query, llm, vector_store)

    # 情况 E：模糊 → 主动澄清（★ 别瞎猜）
    else:
        clarification = llm.invoke(
            f"这个问题表述比较模糊，请生成一个澄清问题（不要直接回答）：\n{query}"
        ).content
        return f"需要澄清：{clarification}"
```

### 轻量分类器（不花 LLM 钱）

```python
def cheap_classifier(query: str) -> str:
    """用规则做初筛，只有不确定时才调 LLM"""

    q = query.lower()

    # 规则 1：对比类信号词
    if any(kw in q for kw in ["区别", "差异", "对比", "vs", "哪个更", "相比"]):
        return "comparison"

    # 规则 2：复合问题信号
    if q.count("？") + q.count("?") >= 2:
        return "decomposable"

    # 规则 3：模糊信号（指代不清）
    if any(kw in q for kw in ["那个", "这个", "东西", "怎么用", "啥"]):
        return "ambiguous"

    # 规则 4：简单事实查询（短 + 有明确实体）
    if len(q) < 15 and not any(kw in q for kw in ["为什么", "怎么", "如何"]):
        return "simple_lookup"

    # 其余 → 不确定，交给 LLM 分类器
    return "uncertain"
```

### 三级分类器方案

```
规则初筛（0 成本）      → 60-70% 命中
    ↓ 剩余 30-40%
小模型分类（~50ms）    → 90% 命中
    ↓ 剩余 10%
完整 LLM 分类
```

**综合准确率**：0.65×0.7 + 0.85×0.3 + 0.92×0.1 ≈ **0.78**
**平均 LLM 调用**：0.3 + 0.1 ≈ **0.4 次**（比纯 LLM 的 1 次省 60%）

### 分类器误判的代价不对称

| 误判 | 后果 |
| :--- | :--- |
| 简单 → 判成复杂 | **只是慢**，答案还对 |
| 复杂 → 判成简单 | **答案错** |

> **所以策略应该"宁可判复杂"** —— 默认走重路径，只在明确识别到简单模式时才降级。

---

## 十三、5 种方法的成本收益对照

| 方法 | LLM 调用 | 额外延迟 | 准确率提升 | 性价比 |
| :--- | :---: | :---: | :--- | :--- |
| **自适应 RAG** | 0.4 次 | ~200ms | **复杂查询 +30~50%** | ⭐⭐⭐⭐⭐ |
| **RAG Fusion** | 0 | +1 检索 | **召回率 +10~20%** | ⭐⭐⭐⭐⭐ |
| **Step-back** | 1 次 | +500ms | 对比/原理题 **+20~30%** | ⭐⭐⭐⭐ |
| **问题分解（并行）** | 1 次 | 0（并发） | 复合查询 **+40~60%** | ⭐⭐⭐⭐ |
| **问题分解（串行）** | 1+N 次 | +N×500ms | 依赖查询 **+50~80%** | ⭐⭐⭐ |
| **MultiQuery** | N 次 | +N×500ms | **+10~15%（收益递减）** | ⭐⭐ |

**这张表最重要的信息**：

> **MultiQuery 虽然被讲得最多，但性价比其实是最低的。**
>
> **为什么？** 它做的是"同义改写"—— 生成的还是**同一个意思的不同措辞**，**没有增加新信息**。
>
> **而问题分解、Step-back 引入的是新的结构信息（子问题、抽象原理），所以收益更高。**

---
---

# 💎 第三章 · 检索后处理三件套

## 十四、Rerank（重排序）

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("BAAI/bge-reranker-v2-m3")

def rerank(query: str, candidates: list, top_n=3):
    """
    两阶段检索的第二阶段：
    输入：向量粗排的 top-20
    输出：精排的 top-3
    """
    # ---------- 1. 打分 ----------
    pairs = [(query, doc.page_content) for doc in candidates]
    scores = reranker.predict(pairs)          # 0~1，越高越相关

    # ---------- 2. 排序 ----------
    ranked = sorted(zip(candidates, scores), key=lambda x: -x[1])

    # ---------- 3. 阈值过滤 + 取 top_n ----------
    filtered = [(d, s) for d, s in ranked if s > 0.3]   # ★ 砍掉低分噪声
    return [d for d, _ in filtered[:top_n]]


# 使用
candidates = vector_store.similarity_search(query, k=20)   # 粗排
final_docs = rerank(query, candidates, top_n=3)           # 精排
```

### 粗排 vs 精排的分工

| | 向量检索（粗排） | Rerank（精排） |
| :--- | :--- | :--- |
| 原理 | Embedding 余弦相似度 | **Cross-Encoder 联合编码 query + doc** |
| 速度 | 快（毫秒级，扫百万级） | 慢（秒级，只扫 top-100） |
| 精度 | 粗（两者独立编码） | **细（两者交互编码）** |
| 用法 | 全库召回 top-20 | 20 条里精选 top-3 |

**Rerank 是性价比最高的优化** —— 不花 LLM 钱，只加一段 cross-encoder 推理，MRR 提升最明显。

---

## 十五、Refinement（删除不相关内容）

```python
REFINE_PROMPT = """根据查询，从给定上下文中抽取与查询直接相关的信息。
不要改写、不要补充、不要推测。只返回原文片段，多个片段用换行分隔。

查询：{query}

上下文：
{context}

相关片段："""

def refinement(query: str, docs: list, llm, llm_judge=None):
    """两种策略：
    1. 抽取式 —— LLM 从每个块里抽相关句子（保真，但可能抽漏）
    2. 生成式 —— LLM 直接基于块回答（信息全，但可能编）
    """
    relevant_snippets = []

    for doc in docs:
        snippet = llm.invoke(
            REFINE_PROMPT.format(query=query, context=doc.page_content)
        ).content.strip()

        if snippet and "无相关" not in snippet:
            relevant_snippets.append({
                "doc_id": doc.id,
                "source": doc.metadata.get("source"),
                "snippet": snippet,
            })

    # ---------- 某块看起来答非所问 → 丢给 judge 复核 ----------
    if llm_judge:
        verified = []
        for s in relevant_snippets:
            ok = llm_judge(
                question=query,
                statement=s["snippet"],
                criterion="这句话是否直接回答了问题？是→yes，否→no"
            )
            if ok:
                verified.append(s)
        relevant_snippets = verified

    return relevant_snippets
```

### 风险提示

**Refinement 用在宽泛 query 上会掐死细节。**

```
query = "讲讲报销"
  ↓ Refinement 只保留"直接相关"的片段
  ↓ 结果：只剩 2 段，细节全被过滤掉
  ↓
★ 宽泛 query 不要用 Refinement
```

---

## 十六、CRAG（Corrective RAG）

### 核心：给 RAG 加一道"自检 + 补救"

```python
class RetrievalJudgement(Enum):
    CORRECT = "correct"          # 检索结果相关且充分
    INCORRECT = "incorrect"      # 检索结果不相关
    AMBIGUOUS = "ambiguous"      # 部分相关 / 需补充检索

EVALUATOR_PROMPT = """你是检索质量评估器。判断给定的上下文是否足以回答问题。

问题：{query}

上下文：
{context}

评估：
- 返回 "correct" 如果上下文包含回答问题所需的关键信息
- 返回 "incorrect" 如果上下文完全不相关
- 返回 "ambiguous" 如果相关但不完整

只返回一个词。"""


def crag(query: str, retrieved_docs: list, llm, vector_store):
    context = "\n".join(d.page_content for d in retrieved_docs)

    # ---------- 1. Retrieval Evaluator ----------
    judgement = llm.invoke(
        EVALUATOR_PROMPT.format(query=query, context=context)
    ).content.strip().lower()

    # ---------- 2. 按评估结果走不同分支 ----------
    if judgement == "correct":
        return {"action": "answer", "docs": retrieved_docs}

    elif judgement == "ambiguous":
        # 拆解成子查询，补充检索
        sub_queries = decompose_query(query, llm)
        extra_docs = []
        for sq in sub_queries:
            extra_docs.extend(vector_store.similarity_search(sq, k=3))
        return {"action": "answer_with_web", "docs": merge_and_dedup(retrieved_docs + extra_docs)}

    else:  # incorrect
        return {"action": "fallback", "docs": [], "note": "检索失败，需 fallback"}
```

### CRAG 的三条分支

| 判断 | 动作 | 例子 |
| :--- | :--- | :--- |
| **correct** | 直接答 | 知识库里有 |
| **ambiguous** | **拆子查询 + 补充检索** | 知识库部分覆盖 |
| **incorrect** | **fallback**（web / 明说不知道） | 知识库根本没有 |

**CRAG 是运行时补救，GraphRAG 是预计算补救。** 两条不同的"检索不准怎么办"路线。

### 执行顺序：Rerank 必须在 CRAG 之前

```
向量检索 top-20
    ↓
Rerank（换更准的排序）        ← 先排准
    ↓ top-5
CRAG Evaluator（判断可信度）   ← 再判断
    ↓ correct?
   ├─ 是 → 直接用
   └─ 否 → 拆子查询补充检索 / fallback
    ↓
Refinement（提纯）             ← 最后清理
    ↓
拼 Prompt → LLM
```

**为什么？** 因为 **CRAG 的判断质量取决于上下文质量** —— 上下文里全是噪声，CRAG 也会误判。

---

## 十七、三种检索方式

### 1. 向量相似度检索（语义）

```python
docs = vector_store.similarity_search("报销标准", k=4)
# 擅长：语义相近，用词不同也能搜到
```

### 2. 结构化精确检索（元数据先筛）

```python
from qdrant_client import models

filtered = vector_store.search(
    query_vector=embed("报销标准"),
    limit=10,
    search_filter=models.Filter(
        must=[
            models.FieldCondition(
                key="department",              # 只看这个部门的
                match=models.MatchValue(value="finance"),
            ),
            models.FieldCondition(              # 时间范围
                key="year",
                range=models.Range(gte=2025, lte=2026),
            ),
        ]
    ),
)
```

**这是最被低估的优化**：

| 做法 | 候选集 | 性能 | 精度 |
| :--- | :--- | :--- | :--- |
| Python 层过滤后再算相似度 | 全库算完再筛 | **慢** | 中 |
| **向量库内过滤** | 边过滤边算 | **快** | **高**（过滤条件参与召回） |

### 3. NL2SQL（结构化数据）

```python
NL2SQL_PROMPT = """根据表结构生成 SQL。只返回 SQL，不要解释。

表结构：
{schema}

问题：{question}"""

def nl2sql(question: str, schema: str, llm, db):
    sql = llm.invoke(
        NL2SQL_PROMPT.format(schema=schema, question=question)
    ).content.strip()

    # ★ 安全：只读校验
    forbidden = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER", "TRUNCATE"]
    if any(kw in sql.upper() for kw in forbidden):
        raise ValueError(f"危险 SQL 已拦截：{sql}")

    return db.execute(sql)
```

### 三种方式的适用边界

| 检索方式 | 数据要求 | 擅长 | 不擅长 |
| :--- | :--- | :--- | :--- |
| **向量相似度** | 无结构文档 | 语义匹配（用词不同也能搜到） | 精确匹配（找编号、找错误码） |
| **元数据预过滤** | 有结构化元数据 | 缩小范围（某部门/某时间/某类型） | 语义理解 |
| **NL2SQL** | **关系型数据库** | 精确计算（求和/统计/排名） | 模糊语义（"讲讲这个项目"） |

### 组合拳示例（生产环境常态）

```
"上季度 finance 部门的报销总额是多少？"

  ↓ NL2SQL（结构化数据，精确统计）
SELECT SUM(amount) FROM expense
WHERE dept='finance' AND quarter='2026Q2'
  ↓ 得到数字：¥1,234,567

  ↓ 元数据过滤 + 向量检索（补充解释）
policy_docs = vector_store.search(
    "finance 部门报销标准",
    filter={dept: "finance", quarter: "2026Q2"}
)
  ↓ 得到政策说明

  ↓ 合并 → LLM 生成
"finance 部门 Q2 报销总额 ¥1,234,567，根据《财务报销管理办法》第 3 条，
   标准为 80 元/天超标需审批……"
```

---
---

# 💎 第四章 · 分块策略

## 十八、为什么分块是"脏活"

**它是整条链路上唯一一个"没有标准答案"的环节。**

| 环节 | 有最优解吗 | 怎么判断好坏 |
| :--- | :--- | :--- |
| Embedding 模型选型 | 有（跑 benchmark） | 有公开评测集 |
| 检索算法 | 有（IR 领域几十年积累） | Recall@k / MRR 可量化 |
| **分块** | ❌ **没有** | **只能看最终检索效果** |

**没有 ground truth 说"这段就该这么切"。** 只能试不同参数，看检索效果。

## 十九、一个具体的翻车现场

### chunk_size = 200（太小）

```
切出来的块：
┌────────────────────────┐
│ ## fixture 依赖注入    │  ← 标题单独一块（切碎了）
├────────────────────────┤
│ fixture 可以通过参数   │
│ 声明依赖其他 fixture   │  ← 只有 40 字（太碎，语义不全）
├────────────────────────┤
│ @pytest.fixture        │
│ scope="module"         │  ← 只有 30 字
└────────────────────────┘

检索到："fixture 可以通过参数声明依赖其他 fixture"
  ↓
用户：❓ 我问的是"怎么实现的"？  "声明依赖"和"实现依赖"是一回事吗？
```

### chunk_size = 5000（太大）

```
一整章塞进一个块（5000 字），里面 90% 在讲别的
  ↓
lost in the middle → 真正相关的那两句被埋在中间
  ↓
模型答："fixture 支持 function/module/session 三种 scope..."
  ↓
用户：❓ 我问的是依赖注入，不是 scope
```

**这就是"小了会丢失，大了有干扰"的具体形态。**

## 二十、矛盾的根源

```
LLM 上下文：128K tokens（很长，能吃很多）
Embedding 输入：512 tokens（很短，喂不进去）
              ↑
              矛盾在这

RAG 存在的意义就是把长的东西压给短的

但"压"有个度：
  压得太碎 → LLM 看不全（它需要一段完整的话才能理解）
  压得太大 → 一个向量要概括 5000 字，信息损失严重
```

**这个矛盾就是 chunk_size 必须调优的根本原因。**

---

## 二十一、三种切分方法

### 方法 1 · 递归字符切分（最常用）

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=[
        # ★ 顺序很重要：从最"语义化"的分隔符往下退
        "\n\n\n",     # 段落分隔（最高优先级）
        "\n\n",        # 空行
        "\n",          # 换行
        "。",           # 中文句号
        "！", "？",
        " ",            # 空格（英文）
        "",             # 字符级（最后兜底）
    ],
    keep_separator=True,      # ★ 保留分隔符，不丢格式
    strip_whitespace=True,
    length_function=len,
)


def split_document(text: str) -> list[str]:
    chunks = splitter.split_text(text)
    # 后处理：去掉过短的块（通常是切碎的标题/残句）
    return [c for c in chunks if len(c.strip()) >= 20]
```

#### 递归切分的工作原理

**不是从上到下依次尝试分隔符，而是"递归"：**

```
原文：很长的一段文字.................

① 尝试用 "\n\n\n" 切
   → 切出来了 → 每块还是太长？→ 对太长的块递归 ②
② 尝试用 "\n\n" 切（只针对 ① 切出来的、仍然太长的块）
   → 还是太长 → 递归 ③
③ 尝试用 "\n" 切
④ 尝试用 "。" 切
⑤ 都切不开 → 按 chunk_size 硬切
```

**好处**：优先在"语义边界"切，实在不行才硬切。

#### chunk_overlap 的作用

```
无 overlap：
  块1："......因此我们得出结论：系统性能"
  块2："瓶颈在数据库查询层。需要优化索引。"
  ↑ 结论和依据被切开了，两个块单独看都不完整

有 overlap：
  块1："......因此我们得出结论：系统性能瓶颈在"
  块2："瓶颈在数据库查询层。需要优化索引。"
  ↑ 块2 至少还带上了"瓶颈"这个词
```

**经验值**：`chunk_overlap = chunk_size × 10~20%`。太小浪费 token，太大重复内容会干扰。

### 方法 2 · 结构感知切分

```python
from langchain_text_splitters import MarkdownHeaderTextSplitter

class StructureAwareChunker:
    """流程：先按结构切 → 再按长度微调 → 合并过短的块"""

    def __init__(self, max_chunk_size=800, min_chunk_size=100):
        self.md_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=[
                ("#", "H1"), ("##", "H2"), ("###", "H3"), ("####", "H4"),
            ]
        )
        self.length_splitter = RecursiveCharacterTextSplitter(
            chunk_size=max_chunk_size,
            chunk_overlap=50,
            separators=["\n\n", "\n", "。", " ", ""],
        )
        self.min_chunk_size = min_chunk_size

    def chunk_markdown(self, markdown_text: str) -> list[dict]:
        # ---------- Step 1：按标题层级切 ----------
        structure_chunks = self.md_splitter.split_text(markdown_text)

        final_chunks = []
        for chunk in structure_chunks:
            content = chunk["content"].strip()
            if not content:
                continue

            metadata = {
                "h1": chunk.metadata.get("H1", ""),
                "h2": chunk.metadata.get("H2", ""),
                "h3": chunk.metadata.get("H3", ""),
            }

            # ---------- Step 2：太长了 → 递归微调 ----------
            if len(content) > self.length_splitter.chunk_size:
                sub_chunks = self.length_splitter.split_text(content)
                for sub in sub_chunks:
                    if len(sub.strip()) >= self.min_chunk_size:
                        final_chunks.append({
                            "content": sub,
                            "metadata": {**metadata, "is_sub_chunk": True},
                        })
            else:
                final_chunks.append({
                    "content": content,
                    "metadata": {**metadata, "is_sub_chunk": False},
                })

        return self._merge_small_chunks(final_chunks)
```

#### 结构感知切分的最大价值：metadata 是免费的

```python
chunk = {
    "content": "Fixture 可以通过参数声明依赖其他 fixture……",
    "metadata": {
        "h1": "Pytest Fixture 完全指南",
        "h2": "Fixture 的依赖注入",
        "source": "docs/pytest_fixture.md",
        "line_start": 45,
    }
}

# ★ 这些 metadata 后续都能用：
# 1. 检索时可以做元数据过滤（"只看 Fixture 章节的"）
# 2. 溯源时可以说"出自《pytest_fixture.md》第 45 行，'依赖注入'章节"
# 3. 拼 prompt 时可以把标题带上（模型理解语境更容易）
```

**这是相对递归切分的隐性优势** —— 不只切得更好，还顺手产出了高质量 metadata。

### 方法 3 · 语义切分

```python
import numpy as np

class SemanticChunker:
    """
    核心思想：相邻句子的 embedding 相似度 > 阈值 → 合并；< 阈值 → 断开
    """

    def __init__(self, buffer_size=1, similarity_threshold=0.75, embeddings=None):
        self.buffer_size = buffer_size
        self.threshold = similarity_threshold
        self.embeddings = embeddings or OpenAIEmbeddings()

    def chunk(self, text: str) -> list[str]:
        # ---------- Step 1：按句子拆 ----------
        sentences = self._split_sentences(text)

        # ---------- Step 2：滑动窗口算相邻相似度 ----------
        sentence_groups = [
            sentences[i:i + self.buffer_size]
            for i in range(0, len(sentences), self.buffer_size)
        ]

        embeddings = self.embeddings.embed_documents(
            ["".join(g) for g in sentence_groups]
        )
        distances = self._cosine_similarity_matrix(np.array(embeddings))

        # ---------- Step 3：按阈值断开 ----------
        chunks = []
        current_chunk = sentence_groups[0]

        for i in range(1, len(sentence_groups)):
            if distances[i - 1] > self.threshold:
                current_chunk.extend(sentence_groups[i])   # 相似 → 合并
            else:
                chunks.append("".join(current_chunk))      # 不相似 → 断开
                current_chunk = sentence_groups[i]

        if current_chunk:
            chunks.append("".join(current_chunk))

        return self._merge_small(chunks)
```

#### 成本对比

| 方法 | 额外计算 | 一份 10000 字文档耗时 |
| :--- | :--- | :--- |
| **递归字符切分** | **0** | **<10ms** |
| **结构感知切分** | 解析开销（HTML/MD parser） | ~50-200ms |
| **语义切分** | **N 次 embedding**（N = 句数/buffer_size） | **2-10 秒** |

**语义切分慢 100-1000 倍。** 但它是**离线任务**，跑一次就行。

```
语料库更新频率 > 每天一次 → 语义切分成本不可接受，用递归/结构切分
语料库相对静态 + 质量要求高 → 语义切分值得
```

---

## 二十二、三种方法对比

| 维度 | 递归字符切分 | 结构感知切分 | 语义切分 |
| :--- | :--- | :--- | :--- |
| **原理** | 按分隔符递归切 | 按文档结构切 | 按语义相似度切 |
| **效率** | ⭐⭐⭐ **极快**（<10ms） | ⭐⭐ 快（~100ms） | ⭐ **慢**（2-10s） |
| **切分质量** | ⭐⭐ 中 | ⭐⭐⭐ 高 | ⭐⭐⭐ **最高** |
| **通用性** | ⭐⭐⭐ 任何文本都行 | ⭐⭐ 需要按格式定制 | ⭐⭐⭐ 任何文本都行 |
| **元数据** | ❌ 几乎没有 | ⭐⭐⭐ **免费产出** | ❌ 几乎没有 |
| **代码块保护** | ❌ 可能切断 | ⭐⭐⭐ **天然保护** | ⚠️ 可能切断 |
| **适合** | **通用默认** | **结构化文档** | **高质量离线库** |

### 生产环境推荐：级联策略

```
原始文档
  ↓
① 结构感知切分（按标题/标签）
  ↓ 得到结构块（有的超长，有的过短）
  ↓
② 递归字符切分（对超长的结构块微调）
  ↓
③ 合并过短块（跟同章节的相邻块合并）
  ↓
④ 给块补上下文（★ 把标题拼在内容前面）
  ↓
最终块 + 元数据
```

### 被低估的技巧：给块补上下文

**问题**：

```
原始块（结构切分后）：
  "Fixture 可以通过参数声明依赖其他 fixture……"

模型看到 → ❓ 哪个 Fixture？什么场景下？
```

**改进：把标题拼进块内容**

```
补充后的块：
  "（章节：Fixture 的依赖注入）
   Fixture 可以通过参数声明依赖其他 fixture……"

模型看到 → ✅ 模型理解这是"依赖注入"场景下的说明
```

**效果**：检索准确率提升有限，但**答案质量提升明显** —— 模型不再需要猜语境。

---

## 二十三、chunk_size 经验值表

| 场景 | chunk_size | chunk_overlap | 理由 |
| :--- | :--- | :--- | :--- |
| **FAQ / 短答案** | 200-500 | 20-50 | 一个问答一块，别混 |
| **技术文档 / API** | 500-800 | 50-100 | 代码示例要完整 |
| **论文 / 长文** | 800-1200 | 100-150 | 段落级语义完整 |
| **合同 / 法规** | **按条款切** | 0 | **条款不能跨块** |
| **聊天记录** | 按会话轮次 | 重叠 1-2 轮 | 保持对话连贯 |

### 为什么合同不能跨块

```
条款 5：甲方应在收到乙方发票后 30 日内支付。
条款 6：如甲方逾期付款，每逾期一日应支付万分之五违约金。

★ 如果切在中间：
  块1："甲方应在收到乙方发票后 30 日内支付。逾期"
  块2："时，每逾期一日应支付万分之五违约金。"
        ↑ 缺主语，读不懂

★ 条款是法律原子单位，必须完整
  这不是"调参"问题，是"领域知识"问题
```

---

## 二十四、分块调优的实测流程

**别拍脑袋，按这个流程来**：

```
Step 1 · 建一个小测试集（20-50 条 query，人工标注相关块）
    ↓
Step 2 · 固定其他参数，只变 chunk_size
    测试 chunk_size ∈ {200, 500, 800, 1200, 2000}
    ↓
Step 3 · 算每个 chunk_size 下的 Recall@k 和 MRR
    ↓
Step 4 · 画曲线，找拐点（Recall 增长开始放缓的位置）
    ↓
Step 5 · 固定 chunk_size，再调 chunk_overlap
    测试 overlap ∈ {0, 10%, 20%, 30%}
    ↓
Step 6 · 选定最优组合，验证端到端 Faithfulness
```

**关键：分块优化的目标函数不是 Recall，而是 Faithfulness。**

```
为什么？
  Recall@20 高但 Faithfulness 低
  → 说明召回了相关块，但块太大/太碎导致模型用不好
  → 只看 Recall 会误判成"切得很好"
```

---
---

# 💎 第五章 · Agentic RAG 实现

## 二十五、它本质就是 Agent Loop

**把这个代码跟 Claude Code 的 s01 对照**：

```python
# s01（Claude Code Agent Loop）
def agent_loop(messages):
    while True:
        response = client.messages.create(
            model=MODEL, system=SYSTEM, messages=messages, tools=TOOLS,
        )
        messages.append({"role": "assistant", "content": response.content})

        tool_calls = [b for b in response.content if b.type == "tool_use"]
        if not tool_calls:
            return                                  # ★ 没有 tool_use 就退出

        results = [execute(t) for t in tool_calls]
        messages.append({"role": "user", "content": results})
```

```python
# Agentic RAG（本质一模一样）
def agentic_rag(state, deps, llm):
    while state.iteration < state.max_iterations:
        response = llm.invoke([...system..., *state.messages], tools=AGENTIC_TOOLS)

        tool_calls = extract_tool_calls(response)
        if not tool_calls:
            return {"status": "done", "answer": response.content}   # ★ 一样的退出

        results = [execute_tool(c["name"], c["args"], deps) for c in tool_calls]
        state.messages.append({"role": "assistant", "content": response.content})
        state.messages.append({"role": "user", "content": results})  # ★ 一样的喂回
```

**结构完全相同。** 区别只在工具：

| | s01 Claude Code | Agentic RAG |
| :--- | :--- | :--- |
| **工具** | bash / read_file / edit_file | vector_search / nl2sql / graph_search |
| **领域** | 通用编程任务 | 知识问答 / 数据分析 |
| **退出条件** | 不调工具 | **调 final_answer**（更明确） |

## 二十六、完整实现

```python
class TaskStatus(Enum):
    DONE = "done"
    NEED_MORE = "need_more"


@dataclass
class AgentState:
    query: str
    messages: list = field(default_factory=list)
    tool_results: dict = field(default_factory=dict)
    iteration: int = 0
    max_iterations: int = 8


AGENTIC_TOOLS = [
    {
        "name": "vector_search",
        "description": "在知识库中检索文档。适合查规范、标准、文档内容。",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "k": {"type": "integer", "default": 5},
            },
            "required": ["query"],
        },
    },
    {
        "name": "nl2sql",
        "description": "查询关系型数据库（缺陷表、工单表等）。适合查真实数据、做聚合统计。",
        "input_schema": {
            "type": "object",
            "properties": {
                "question": {"type": "string", "description": "自然语言问题，会转成 SQL"},
            },
            "required": ["question"],
        },
    },
    {
        "name": "final_answer",
        "description": "给出最终答案。当信息足够时调用这个工具结束任务。",
        "input_schema": {
            "type": "object",
            "properties": {
                "answer": {"type": "string"},
                "citations": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["answer"],
        },
    },
]


AGENTIC_SYSTEM_PROMPT = """你是一个数据分析助手，可以自主选择工具来收集信息。

工作原则：
1. **先规划再动手** —— 想清楚要回答什么问题，需要哪些数据
2. **选对工具** —— 查文档用 vector_search，查真实数据用 nl2sql
3. **信息足够就收手** —— 不要为了用工具而用工具
4. **不确定就说明** —— 不要编造数据

可用工具：
{tools}

原始问题：{query}

请给出你的下一步行动。信息已足够时，调用 final_answer 给出最终答案。"""


def agentic_rag(state: AgentState, deps: dict, llm) -> dict:
    """Agentic RAG 主循环"""

    while state.iteration < state.max_iterations:
        state.iteration += 1

        # ---------- 1. 调模型，让它决定下一步 ----------
        response = llm.invoke([
            {"role": "system", "content": AGENTIC_SYSTEM_PROMPT.format(
                tools=format_tools_for_prompt(AGENTIC_TOOLS),
                query=state.query,
            )},
            *state.messages,
        ])

        # ---------- 2. 检查是否给出了最终答案 ----------
        tool_calls = extract_tool_calls(response)

        if not tool_calls:
            return {
                "status": TaskStatus.DONE.value,
                "answer": response.content,
                "iterations": state.iteration,
            }

        final_answer_call = next(
            (c for c in tool_calls if c["name"] == "final_answer"), None
        )
        if final_answer_call:
            return {
                "status": TaskStatus.DONE.value,
                "answer": final_answer_call["args"]["answer"],
                "citations": final_answer_call["args"].get("citations", []),
                "iterations": state.iteration,
            }

        # ---------- 3. 执行工具调用 ----------
        tool_results = []
        for call in tool_calls:
            print(f"  [iter {state.iteration}] 🔧 {call['name']}({call['args']})")
            result = execute_tool(call["name"], call["args"], deps)
            state.tool_results[call["name"]] = result
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": call["id"],
                "content": result,
            })

        # ---------- 4. 结果喂回去，让模型看结果再决定 ----------
        state.messages.append({"role": "assistant", "content": response.content})
        state.messages.append({"role": "user", "content": tool_results})

    # ---------- 5. 迭代到上限（★ 必须有出口）----------
    return {
        "status": "max_iterations",
        "answer": "达到最大迭代次数，基于已有信息给出阶段性结论",
        "iterations": state.max_iterations,
        "partial_data": state.tool_results,   # ★ 保留已获取的数据
    }
```

## 二十七、实际运行示意

**需求**："我们团队上个月的缺陷修复率是多少？哪些缺陷类型最常见？"

```
===== Naive RAG =====
$ vector_search("缺陷修复率")
召回：《缺陷管理规范》第 3 章 缺陷修复流程……
答案：缺陷修复流程包括以下步骤……（全是流程，不是数据）❌

===== Advanced RAG =====
$ [改写] "缺陷 修复 率 统计 方法"
答案：缺陷修复率通常指已修复缺陷数占总缺陷数的比例……（概念，无数据）❌

===== Modular RAG =====
$ [拆子问题] 1. 修复率计算公式  2. 常见缺陷类型分类
答案：知识层面完整，但没有数据支撑 ❌

===== GraphRAG =====
$ graph_search(实体="缺陷", 关系="归属类型", depth=2)
答案：（前提：缺陷数据已建图）不满足前提就空 ❌

===== Agentic RAG =====
[iter 1] 🔧 nl2sql({"question": "上个月缺陷修复率"})
         → "87.3%"

[iter 2] 🔧 nl2sql({"question": "上个月最常见的缺陷类型分布"})
         → "功能缺陷 42, 性能缺陷 31, 兼容性缺陷 28"

[iter 3] 🔧 vector_search({"query": "功能缺陷的根因分类标准"})
         → "需求理解偏差、边界条件遗漏、代码实现错误"

[iter 4] 🔧 final_answer({
    "answer": "上个月缺陷修复率 87.3%（已修复 183/210）。\n\n"
              "最常见缺陷类型是功能缺陷（42 个，占 20%）。\n\n"
              "根据《缺陷分类规范》，功能缺陷主要根因是需求理解偏差和边界条件遗漏。",
    "citations": ["defects_table", "缺陷分类规范"]
})
→ 真实数据 + 知识标准 + 改进建议，全部齐了 ✅
```

## 二十八、工具集设计的 4 个要点

| 要点 | 说明 |
| :--- | :--- |
| **① description 写清边界** | "适合 X，不适合 Y" —— 让模型知道啥时候用啥时候不用 |
| **② 必须有 final_answer 工具** | 显式结束信号，比"不调工具就算结束"可控 |
| **③ 工具数量控制在 5-8 个** | 太多模型选不过来，太少覆盖不全 |
| **④ 工具之间要有区分度** | `vector_search`（查文档）vs `nl2sql`（查数据）必须语义清晰 |

**description 的对比**：

```
❌ "搜索"                                    ← 太模糊，模型不知道啥时候用

✅ "在知识库中检索文档。适合查规范、标准、文档内容、流程说明。
    不适合查实时数据（如当前工单状态）或做统计计算。"
   ↑ 明确说清了能做什么、不能做什么
```

## 二十九、自主决策必然带来的 3 个问题

### 问题 1：什么时候停？

**Naive RAG 不需要考虑（检索一次就完了）；Agentic RAG 必须考虑。**

```python
# 策略 1：模型自己判断（最简单，但不可靠）
if not tool_calls:
    return   # ★ 模型觉得够了就够 —— 可能幻觉"够了"

# 策略 2：显式 final_answer 工具（推荐）
if any(c["name"] == "final_answer" for c in tool_calls):
    return   # ★ 模型必须明确"我做完了"才能停

# 策略 3：独立判断器验证（最可靠）
if goal_evaluator.check(query, state.tool_results, answer):
    return   # ★ 用独立模型检查答案是否有数据支撑
```

**策略 3 就是"独立判断器"思想在 Agentic RAG 里的落地。**

### 问题 2：怎么防无限循环？

```python
# 三层保险

# 第 1 层：最大迭代次数
MAX_ITERATIONS = 8

# 第 2 层：重复检测（防止在两个查询之间来回横跳）
seen_queries = set()
if query in seen_queries:
    force_final_answer = True

# 第 3 层：token 预算
if total_tokens_used > BUDGET:
    force_final_answer = True
```

### 问题 3：工具失败怎么办？

```python
# ❌ 错误做法：直接抛出，Agent 崩掉
output = execute_tool(name, args)   # 异常直接抛出

# ✅ 正确做法：把错误当成"观察结果"喂回去
try:
    output = execute_tool(name, args)
except Exception as e:
    output = f"Error: {type(e).__name__}: {e}"
    # ★ Agent 看到 "数据库连接超时"，会自己决定改用别的方法
    #   或者直接告诉用户"这部分数据拿不到"
```

> **工具失败不是致命错误，是 Agent 的观察输入。** 这是 Agentic 架构的核心优势。

---

## 三十、成本对照

| 技术 | 额外 LLM 调用 | 额外计算 | 收益 |
| :--- | :---: | :--- | :--- |
| MultiQuery | N 次 | N 次检索 | 召回率 ↑ |
| RAG Fusion | 0 | 多次检索 + 融合 | 召回率 ↑↑ |
| **Rerank** | 0 | rerank 模型推理 | **MRR 大幅 ↑** |
| **Refinement** | N 次 | — | Token ↓，噪声 ↓ |
| **CRAG** | 1 次 | 可能的补充检索 | **鲁棒性 ↑↑** |
| NL2SQL | 1 次 | SQL 执行 | 能算数 |

**优先级建议（投入产出比排序）**：

```
1. Rerank        ← 性价比最高，不花 LLM 钱，MRR 提升明显
2. 元数据过滤    ← 几乎零成本，精度提升明显
3. RAG_Fusion    ← 多路检索几乎免费，召回率提升明显
4. CRAG          ← 1 次 LLM 调用换鲁棒性
5. MultiQuery    ← N 次 LLM 调用，成本高，收益递减
6. Refinement    ← Token 省了，但可能掐死细节
```

---
---

# 💎 第六章 · 核心洞察

> **1. 不分层评估 = 盲人调参** —— RAG 是长链路，任何一环坏了都会影响答案。不分段排查，改一天也不知道改了啥。

> **2. 召回求全，精确求准** —— k 太小信息不全，k 太大噪声干扰。**两阶段检索（粗排 20 + 精排 3）就是解这个矛盾。**

> **3. MRR 比 MAP 更贴近 RAG 的痛点** —— LLM 只重点看上下文前部，"第一个正确结果排多前"比"所有正确结果排多前"更重要。

> **4. "高相关 + 低忠实"是最危险的组合** —— 答案看起来很有理但在实际编，用户最难发现。评估必须同时看这两个维度。

> **5. MultiQuery 被高估了** —— 它做的是同义改写，没有增加新信息，收益最低但成本不低。**问题分解和 Step-back 引入的是结构信息，收益高得多。**

> **6. RRF 用 rank 融合而非分数融合** —— 不同检索方式的分数量纲不一致，用 rank 归一化绕开这个问题。

> **7. Rerank 是性价比最高的优化** —— 不花 LLM 钱，只加一段 cross-encoder 推理。

> **8. 三种检索方式各有边界，生产环境要组合** —— 向量管语义、元数据管范围、NL2SQL 管计算。

> **9. Agentic RAG 本质就是 Agent Loop** —— 你学 Claude Code 的经验 100% 适用，只是工具换了。

> **10. "显式 final_answer 工具"优于"不调工具就结束"** —— 前者是模型的明确声明，后者是行为的副产物。

> **11. 分块优化的目标函数是 Faithfulness，不是 Recall** —— 只看召回率会误判成"切得很好"。

> **12. 给块补上下文是低成本高收益的技巧** —— 检索准确率提升有限，但答案质量提升明显。

---

## 💬 最后一句话

> **"RAG 的效果问题，90% 不是'要不要上 GraphRAG'，而是'你能不能定位是哪一层坏了'。"**
>
> **"分层评估 → 精准优化 → 效果可测。这是 RAG 工程化的唯一正道。"**
>
> **"MultiQuery 被讲得最多，但性价比最低；Rerank 被讲得最少，但性价比最高。"**
>
> **"Agentic RAG 不是新技术，是把 Agent Loop 的思想搬到 RAG 上——你学过的每一件事都能用上。"**

***

## 📚 参考

- **基础篇**：《RAG 基础与五种范式演进》—— 基础 / 三阶段演进 / GraphRAG / 五范式选型
- **相关技术**：
  - Cohere Rerank / BAAI bge-reranker —— Cross-encoder 重排模型
  - LangChain Evaluators —— 分层评估工具链
  - CRAG 论文 —— Corrective Retrieval Augmented Generation
  - Leiden Algorithm —— GraphRAG 社区检测
