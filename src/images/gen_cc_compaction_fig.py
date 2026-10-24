#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成《Claude Code 上下文机制拆解》配图 1：压缩三档（microcompact / auto-compact / /compact）。"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Polygon
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

fig, ax = plt.subplots(figsize=(13.4, 8.2), dpi=170)
ax.set_xlim(0, 134)
ax.set_ylim(0, 84)
ax.axis("off")
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

ax.text(67, 79.5, "上下文满了之后，Claude Code 做的三件事",
        ha="center", va="center", fontsize=19, color=INK, fontweight="bold")
ax.text(67, 74.6, "从便宜到昂贵 —— 先做不花钱的，做不动了才花钱",
        ha="center", va="center", fontsize=11.4, color=MUTED)

# ---------- 三级阶梯 ----------
BX, BW = 6, 122
steps = [
    # (y, h, color, title, badge, lines)
    (53, 17, C_GREEN, "microcompact", "不调用 LLM",
     ["删除旧的工具结果，只留最近 3 个工具结果",
      "触发门槛：默认累计 40,000 token，且本次能清出 ≥ 20,000 token 才动手",
      "可关：环境变量 DISABLE_MICROCOMPACT"]),
    (34, 17, C_AMBER, "auto-compact", "调用 LLM 总结",
     ["先清旧工具输出，再把对话历史总结成一段摘要",
      "触发点：可用窗口 减 13,000 token（不是用满了才触发）",
      "可在 CLAUDE.md 里写 “Compact Instructions” 控制保留什么"]),
    (15, 17, C_BLUE, "/compact", "用户手动，最彻底",
     ["同 auto-compact 的总结路径，但由你决定何时、何为重点",
      "支持带焦点：/compact focus on the auth bug fix",
      "压缩后自动恢复：最多 5 个文件 · 单文件 5,000 token · 总计 50,000 token"]),
]

for y, h, color, title, badge, lines in steps:
    ax.add_patch(FancyBboxPatch(
        (BX, y), BW, h,
        boxstyle="round,pad=0,rounding_size=1.6",
        linewidth=1.7, edgecolor=color, facecolor=color + "0A",
    ))
    # 标题条
    ax.add_patch(FancyBboxPatch(
        (BX, y + h - 5.4), BW, 5.4,
        boxstyle="round,pad=0,rounding_size=1.6",
        linewidth=0, facecolor=color,
    ))
    ax.text(BX + 3.0, y + h - 2.7, title, ha="left", va="center",
            fontsize=13, color="white", fontweight="bold")
    # badge
    ax.add_patch(FancyBboxPatch(
        (BX + 26, y + h - 4.7), 20, 3.9,
        boxstyle="round,pad=0,rounding_size=1.9",
        linewidth=0, facecolor="white", alpha=0.85,
    ))
    ax.text(BX + 36, y + h - 2.75, badge, ha="center", va="center",
            fontsize=9.6, color=color, fontweight="bold")
    for i, ln in enumerate(lines):
        ax.text(BX + 3.0, y + h - 8.6 - i * 3.2, ln, ha="left", va="top",
                fontsize=10.0, color=INK)

# 阶梯箭头（左侧向下）
for i in range(len(steps) - 1):
    y0 = steps[i][0]
    ax.add_patch(FancyArrowPatch(
        (BX - 3.4, y0), (BX - 3.4, y0 - 3.6),
        arrowstyle="-|>", mutation_scale=13, color=MUTED, linewidth=1.5,
    ))
ax.text(BX - 5.6, 42.0, "越往下越昂贵", ha="center", va="center",
        fontsize=9.6, color=MUTED, rotation=90)

# ---------- 底部：压缩后什么存活 ----------
ax.add_patch(FancyBboxPatch(
    (BX, 0.5), BW, 13.0,
    boxstyle="round,pad=0,rounding_size=1.6",
    linewidth=1.5, edgecolor=LINE, facecolor="#f7f9fb",
))
ax.text(BX + 3.0, 12.0, "压缩之后，什么还活着", ha="left", va="center",
        fontsize=12, color=INK, fontweight="bold")

alive = [
    ("重新注入", "系统提示 · 项目根 CLAUDE.md · 无条件 rules · auto memory", C_GREEN),
    ("重新读取", "Git 快照重新读一份 · 最近改过的文件最多回读 5 个", C_AMBER),
    ("按需重载", "带 paths: 的 rules · 子目录 CLAUDE.md（读那个目录时才回来）", C_BLUE),
    ("被总结掉", "只有对话里说过一次的细节 —— 所以规矩要写进 CLAUDE.md", C_RED),
]
for i, (a, b, c) in enumerate(alive):
    y = 9.4 - i * 2.5
    ax.add_patch(plt.Circle((BX + 4.2, y), 0.78, color=c))
    ax.text(BX + 7.0, y, a, ha="left", va="center", fontsize=10.0,
            color=INK, fontweight="bold")
    ax.text(BX + 26, y, b, ha="left", va="center", fontsize=10.0, color=MUTED)

out = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "cc-context-compaction-layers.png")
plt.savefig(out, dpi=170, bbox_inches="tight", facecolor=BG)
print("saved:", out)
