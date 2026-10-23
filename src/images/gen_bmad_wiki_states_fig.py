#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成《BMAD × 知识库：两套状态机怎么不打架》配图：三轨分工与交叉点裁决。"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
from matplotlib import font_manager
import os

for cand in ["Noto Sans CJK SC", "WenQuanYi Zen Hei", "Noto Sans CJK JP", "DejaVu Sans"]:
    try:
        font_manager.findfont(cand, fallback_to_default=False)
        plt.rcParams["font.sans-serif"] = [cand]
        break
    except Exception:
        continue
plt.rcParams["axes.unicode_minus"] = False

INK   = "#1f2933"
MUTED = "#6b7785"
LINE  = "#d4dae1"
BG    = "#ffffff"

C_BLUE   = "#2f6fb3"
C_AMBER  = "#c8871b"
C_GREEN  = "#2e8b6f"
C_RED    = "#c0473c"
C_PURPLE = "#6a5aa8"

fig, ax = plt.subplots(figsize=(13.6, 8.8), dpi=170)
ax.set_xlim(0, 136)
ax.set_ylim(0, 88)
ax.axis("off")
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)


def card(x, y, w, h, title, lines, color, title_fs=12.6, body_fs=10.0, line_gap=3.9):
    ax.add_patch(FancyBboxPatch(
        (x, y), w, h,
        boxstyle="round,pad=0,rounding_size=1.6",
        linewidth=1.7, edgecolor=color, facecolor=color + "0A",
    ))
    ax.add_patch(FancyBboxPatch(
        (x, y + h - 6.0), w, 6.0,
        boxstyle="round,pad=0,rounding_size=1.6",
        linewidth=0, facecolor=color,
    ))
    ax.text(x + w / 2, y + h - 3.0, title, ha="center", va="center",
            fontsize=title_fs, color="white", fontweight="bold")
    ty = y + h - 8.8
    for ln in lines:
        if ln:
            bold = ln.startswith("**")
            txt = ln.replace("**", "")
            ax.text(x + 2.2, ty, txt, ha="left", va="top",
                    fontsize=body_fs, color=INK if not bold else color,
                    fontweight="bold" if bold else "normal")
        ty -= line_gap
    return (x, y, w, h)


def arrow(p1, p2, color=MUTED, ls="-", lw=1.6, rad=0.0, text=None, tfs=9.0):
    ax.add_patch(FancyArrowPatch(
        p1, p2, arrowstyle="-|>", mutation_scale=14,
        color=color, linewidth=lw, linestyle=ls,
        connectionstyle=f"arc3,rad={rad}",
    ))
    if text:
        mx, my = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
        ax.text(mx, my + 1.4, text, ha="center", va="bottom",
                fontsize=tfs, color=color)


# ---------- 标题 ----------
ax.text(68, 83.4, "两套状态机，各管一件事", ha="center", va="center",
        fontsize=19.5, color=INK, fontweight="bold")
ax.text(68, 78.2, "BMAD 管「故事走到哪」，知识库管「知识新不新鲜」—— 不要合成一个",
        ha="center", va="center", fontsize=11.6, color=MUTED)

# ---------- 三轨卡片 y=38 h=35 ----------
CY, CH = 38.0, 35.0
card(4, CY, 41, CH, "流程层 · BMAD", [
    "sprint-status.yaml",
    "",
    "**story 生命周期状态**",
    "backlog / ready-for-dev /",
    "in-progress / review / done",
    "",
    "回答：这件事做到哪一步了？",
], C_BLUE)

card(47.5, CY, 41, CH, "知识层 · .wiki/", [
    "modules/*.md frontmatter",
    "",
    "**status / hash / last_sync**",
    "hash = 源码内容的指纹",
    "last_sync = 上次同步时间",
    "",
    "回答：这份摘要还新鲜吗？",
], C_AMBER)

card(91, CY, 41, CH, "源码层 · src/", [
    "真实代码",
    "",
    "**唯一事实源（SSOT）**",
    "组件 / core / services",
    "tsconfig 划出边界",
    "",
    "回答：现在实际是怎样的？",
], C_GREEN)

arrow((45.2, 58), (47.3, 58), MUTED, text="产出物", tfs=8.6)
arrow((88.8, 58), (90.8, 58), MUTED, text="被提取", tfs=8.6)

# ---------- 共享事实层 y=22 h=12 ----------
ax.add_patch(FancyBboxPatch(
    (26, 22), 84, 12,
    boxstyle="round,pad=0,rounding_size=1.6",
    linewidth=1.6, edgecolor=C_PURPLE, facecolor=C_PURPLE + "0D",
    linestyle="--",
))
ax.text(68, 30.4, "共享事实层：裁决与复盘", ha="center", va="center",
        fontsize=12.2, color=C_PURPLE, fontweight="bold")
ax.text(68, 25.6,
        "story 文档的 Completion Notes / Debug Log · decision-log.md · .memlog.md",
        ha="center", va="center", fontsize=10.2, color=INK)

arrow((24.5, CY), (46, 31.5), C_PURPLE, rad=0.2)
arrow((68, CY), (68, 34.4), C_PURPLE)
arrow((111.5, CY), (90, 31.5), C_PURPLE, rad=-0.2)

# ---------- 底部裁决框 y=2 h=18 ----------
ax.add_patch(FancyBboxPatch(
    (4, 2), 128, 17.6,
    boxstyle="round,pad=0,rounding_size=1.6",
    linewidth=1.5, edgecolor=LINE, facecolor="#f7f9fb",
))
ax.text(8.5, 16.2, "冲突裁决：谁说了算", ha="left", va="center",
        fontsize=12.2, color=INK, fontweight="bold")

rows = [
    ("状态账本里不写复盘", "R-42：最多留一行指针", C_BLUE),
    ("知识库里不写进度", "模块摘要只描述当前事实", C_AMBER),
    ("两边记了同一件事", "按「谁定义这个字段」拆，不按文件拆", C_PURPLE),
    ("代码改了、摘要过期", "两边都不用改，Lint 单独报过期", C_GREEN),
]
for i, (a, b, c) in enumerate(rows):
    y = 12.4 - i * 3.05
    ax.add_patch(plt.Circle((9.6, y), 0.82, color=c))
    ax.text(12.4, y, a, ha="left", va="center", fontsize=10.0, color=INK, fontweight="bold")
    ax.text(44, y, b, ha="left", va="center", fontsize=10.0, color=MUTED)

# 右侧警示
ax.add_patch(FancyBboxPatch(
    (99.5, 4.6), 28.5, 8.2,
    boxstyle="round,pad=0,rounding_size=1.2",
    linewidth=1.5, edgecolor=C_RED, facecolor=C_RED + "0C",
))
ax.text(113.75, 10.6, "最常见的错", ha="center", va="center",
        fontsize=10.2, color=C_RED, fontweight="bold")
ax.text(113.75, 7.2, "在状态账本里加一列\n「知识库状态」", ha="center", va="center",
        fontsize=9.6, color=INK, linespacing=1.5)

out = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "bmad-wiki-two-state-machines.png")
plt.savefig(out, dpi=170, bbox_inches="tight", facecolor=BG)
print("saved:", out)
