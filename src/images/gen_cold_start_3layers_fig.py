#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""三层冷启动架构：AST 结构 + 注释契约 + LLM 语义"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "WenQuanYi Zen Hei"]
plt.rcParams["axes.unicode_minus"] = False

C1 = "#2B6CB0"   # 蓝 AST
C2 = "#2F855A"   # 绿 注释
C3 = "#805AD5"   # 紫 LLM
C4 = "#C53030"   # 红
GREY = "#718096"
DARK = "#1A202C"

BOX = dict(linewidth=2.2)

fig, ax = plt.subplots(figsize=(16, 11.2), dpi=150)
ax.set_xlim(0, 160); ax.set_ylim(0, 112); ax.axis("off")

ax.text(80, 109.2, "代码知识库的三层冷启动", ha="center", fontsize=21,
        fontweight="bold", color=DARK)
ax.text(80, 104.8, "AST 给你「有什么」 · 注释给你「为什么」 · LLM 给你「所以呢」",
        ha="center", fontsize=12.5, color=GREY)

LAYERS = [
    (70, "L1 结构层", "AST 提取 · 零幻觉", C1, "#EBFBFF",
     ["类 / 函数 / 常量签名", "类型定义与导出面",
      "工具：aider --show-repo-map"],
     "覆盖：.ts 完美，.vue 完全失效"),
    (48, "L1.5 契约层", "文件头注释提取 · 零幻觉", C2, "#F0FFF4",
     ["职责边界：做什么 / 不做什么", "刻意不做的事（不 import 什么）",
      "历史踩坑与 ADR 引用", "工具：注释块提取器"],
     "覆盖：.vue 的知识主力来源"),
    (26, "L2 语义层", "LLM 综合 · 需复核", C3, "#FAF5FF",
     ["模块摘要与职责归纳", "模块间依赖关系（推断）",
      "设计约束与已知坑点", "工具：aider --read × 2 + LLM"],
     "唯一带幻觉的一层，必须标 draft"),
]

for y0, tag, title, color, tint, lines, note in LAYERS:
    h = 20
    ax.add_patch(FancyBboxPatch((4, y0), 152, h,
                 boxstyle="round,pad=0.4,rounding_size=1.2",
                 facecolor="white", edgecolor=color, **BOX))
    ax.add_patch(FancyBboxPatch((4, y0 + h - 6.4), 152, 6.4,
                 boxstyle="round,pad=0.4,rounding_size=1.2",
                 facecolor=tint, edgecolor="none", zorder=1))
    ax.text(7, y0 + h - 3.3, tag, ha="left", fontsize=11.5,
            fontweight="bold", color=color, zorder=4)
    ax.text(21, y0 + h - 3.3, title, ha="left", fontsize=12.4,
            fontweight="bold", color=DARK, zorder=4)
    ax.text(153, y0 + h - 3.3, note, ha="right", fontsize=9.4,
            color=color, style="italic", zorder=4)

    # 左：要点
    ys = y0 + h - 9.8
    for ln in lines:
        ax.text(8, ys, "·  " + ln, ha="left", fontsize=9.8, color=DARK, zorder=4)
        ys -= 3.3

# 层间箭头
for y in (68.4, 46.4):
    ax.add_patch(FancyArrowPatch((80, y), (80, y - 1.6),
                 arrowstyle="-|>", mutation_scale=15,
                 color="#CBD5E0", linewidth=2.0, zorder=2))

# 底部：对比
ax.add_patch(FancyBboxPatch((4, 1), 152, 10.5,
             boxstyle="round,pad=0.4,rounding_size=1.2",
             facecolor="#EDF2F7", edgecolor="#2D3748", linewidth=1.6, zorder=1))
ax.text(80, 8.0, "常见误区：用 AST 一次抽出全部知识", ha="center", fontsize=11,
        fontweight="bold", color=C4, zorder=4)
ax.text(80, 3.8, "AST 抽得出「有哪些函数」，抽不出「为什么这么设计」——"
                  "而后者才是知识库不可替代的部分",
        ha="center", fontsize=10.4, color=DARK, zorder=4)

plt.savefig("cold-start-3-layers.png", dpi=150, facecolor="white")
print("saved: cold-start-3-layers.png")
