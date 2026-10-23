#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""知识工程三层架构图：RAG → LLM Wiki"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "WenQuanYi Zen Hei"]
plt.rcParams["axes.unicode_minus"] = False

C1 = "#2B6CB0"   # 蓝
C2 = "#2F855A"   # 绿
C3 = "#805AD5"   # 紫
C4 = "#C53030"   # 红
C5 = "#B7791F"   # 橙
GREY = "#718096"
DARK = "#1A202C"

BOX = dict(boxstyle="round,pad=0.4,rounding_size=1.2", linewidth=2.2)
LH = 2.8

fig, ax = plt.subplots(figsize=(16, 9.6), dpi=150)
ax.set_xlim(0, 160); ax.set_ylim(0, 96); ax.axis("off")

ax.text(80, 94, "知识工程三层架构 · 从 RAG 到 LLM Wiki", ha="center",
        fontsize=21, fontweight="bold", color=DARK)
ax.text(80, 89.6, "把工作从「查询时」搬到「编译时」 —— 知识一次性沉淀，长期复利",
        ha="center", fontsize=12.5, color=GREY)


def layer(x0, y0, w, h, tag, title, color, tint, lines, tag2=None):
    ax.add_patch(FancyBboxPatch((x0, y0), w, h, facecolor="white",
                 edgecolor=color, **BOX))
    ax.add_patch(FancyBboxPatch((x0, y0 + h - 7.2), w, 7.2,
                 boxstyle="round,pad=0.4,rounding_size=1.2",
                 facecolor=tint, edgecolor="none", zorder=1))
    ax.text(x0 + 3.2, y0 + h - 3.7, tag, ha="left", fontsize=11.5,
            fontweight="bold", color=color, zorder=4)
    ax.text(x0 + 16, y0 + h - 3.7, title, ha="left", fontsize=12.6,
            fontweight="bold", color=DARK, zorder=4)
    ys = y0 + h - 11.0
    for txt, sz, bold, col in lines:
        if txt:
            ax.text(x0 + 4.0, ys, txt, ha="left", fontsize=sz,
                    fontweight="bold" if bold else "normal",
                    color=col, zorder=4)
        ys -= LH
    if tag2:
        ax.text(x0 + 4.0, y0 + 2.7, tag2, ha="left", fontsize=9.3,
                color=color, style="italic", zorder=4)


# ---------- 上排：L1 / L2 / L3 三层 ----------
layer(3, 48, 50, 34, "L1 原始层", "Raw sources", C1, "#EBFBFF",
      [("原始事实数据", 10.2, True, C1),
       ("代码 · 文档 · 用例 · 剪藏", 9.4, False, GREY),
       ("", 5, False, DARK),
       ("不可变：只读，不修改不删除", 9.5, False, DARK),
       ("这是你的 source of truth", 9.3, False, GREY)],
      tag2="LLM 从这里读，不改这里")

layer(55, 48, 50, 34, "L2 知识层", "The wiki", C2, "#F0FFF4",
      [("LLM 生成的结构化页面", 10.2, True, C2),
       ("entities · concepts · sources", 9.4, False, GREY),
       ("", 5, False, DARK),
       ("交叉引用已建好，矛盾已标记", 9.5, False, DARK),
       ("你读它，LLM 写它", 9.3, False, GREY)],
      tag2="检索的主力：高价值、高密度")

layer(107, 48, 50, 34, "L3 规则层", "The schema", C3, "#FAF5FF",
      [("CLAUDE.md / AGENTS.md", 10.2, True, C3),
       ("结构规范 + 工作流约定", 9.4, False, GREY),
       ("", 5, False, DARK),
       ("让 LLM 成为守规矩的维护者", 9.5, False, DARK),
       ("而不是泛用聊天机器人", 9.3, False, GREY)],
      tag2="你与 LLM 共同演进这份文件")

# 层间箭头
for cx in (28, 80, 132):
    ax.add_patch(FancyArrowPatch((cx, 46.4), (cx, 44.4),
                 arrowstyle="-|>", mutation_scale=14,
                 color="#CBD5E0", linewidth=1.8, zorder=2))

# ---------- 中排：三大核心引擎 ----------
ax.add_patch(FancyBboxPatch((3, 12), 154, 31,
             boxstyle="round,pad=0.4,rounding_size=1.2",
             facecolor="#FAFAFA", edgecolor="#2D3748", linewidth=1.8, zorder=1))
ax.text(155.2, 39.4, "三大核心引擎", ha="right", fontsize=12.2,
        fontweight="bold", color=DARK, zorder=4)

engines = [
    ("Ingest · 采集", C4, "#FFF5F5",
     [("丢一份新原料进 raw/", 9.5, True, DARK),
      ("LLM 读它 · 提炼要点 · 写 source 页", 9.3, False, GREY),
      ("更新相关 entity / concept 页", 9.3, False, GREY),
      ("更新 index.md + 追加 log.md", 9.3, False, GREY),
      ("", 3.5, False, DARK),
      ("一份原料可能牵动 10-15 个页面", 9.3, True, C4)]),
    ("Query · 供给", C5, "#FFFAF0",
     [("先读 index.md 定位相关页", 9.5, True, DARK),
      ("再钻进具体页面综合答案", 9.3, False, GREY),
      ("带引用，不编造", 9.3, False, GREY),
      ("", 3.5, False, DARK),
      ("好答案要归档回 wiki", 9.3, True, C5),
      ("探索也要复利，不能烂在聊天里", 9.3, False, GREY)]),
    ("Lint · 治理", C1, "#EBFBFF",
     [("定期做健康检查", 9.5, True, DARK),
      ("矛盾 · 过时 · 孤岛 · 缺页", 9.3, False, GREY),
      ("缺交叉引用 · 数据缺口", 9.3, False, GREY),
      ("", 3.5, False, DARK),
      ("冲突检测后让人来判", 9.3, True, C1),
      ("长期不用 → 归档或淘汰", 9.3, False, GREY)]),
]

x = 6.0
for name, color, tint, lines in engines:
    layer(x, 15.0, 48, 26.5, "", name, color, tint, lines)
    x += 51.5

# ---------- 底部：RAG vs Wiki 对比 ----------
ax.add_patch(FancyBboxPatch((3, 0.8), 154, 9.6,
             boxstyle="round,pad=0.4,rounding_size=1.2",
             facecolor="#EDF2F7", edgecolor="#2D3748", linewidth=1.6, zorder=1))
ax.text(80, 7.6, "传统 RAG：查询时检索原始碎片  →  每次问都在重新发现", ha="center",
        fontsize=10.6, color="#4A5568", zorder=4)
ax.text(80, 3.6, "LLM Wiki：编译一次、持续维护  →  知识是复利，越用越厚",
        ha="center", fontsize=11.2, fontweight="bold", color=DARK, zorder=4)

plt.savefig("knowledge-engineering-3-layers.png", dpi=150, bbox_inches="tight",
            facecolor="white", pad_inches=0.3)
print("saved: knowledge-engineering-3-layers.png")
