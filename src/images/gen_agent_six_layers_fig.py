#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成《Claude Code 上下文机制拆解》配图 2：自建 Agent 的六层分层。"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
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

LAYERS = [
    ("L6", "dream system", "后台的知识整理 · 记忆整理 · 元信息",
     "离线跑，不在用户对话里。整理过的记忆在下次会话重新注入。", "#6a5aa8"),
    ("L5", "service", "会话管理 · 记忆",
     "会话状态、跨会话记忆、恢复与续接。", "#4a7fb5"),
    ("L4", "hooks", "事件钩子 / middleware",
     "在工具调用前后拦截，改输入、拦危险操作、注入外部事实。", "#2f8f7a"),
    ("L3", "context", "上下文管理",
     "装什么、装多少、什么时候压缩、怎么补全。整篇文章讲的就是这层。", "#c8871b"),
    ("L2", "tool", "工具系统",
     "工具定义、权限、结果处理。大结果落盘、文件去重、语义工具。", "#c0703a"),
    ("L1", "model", "模型适配",
     "多供应商、多模型档位、思考预算、降级策略。", "#8a6a5a"),
]

fig, ax = plt.subplots(figsize=(13.4, 8.6), dpi=170)
ax.set_xlim(0, 134)
ax.set_ylim(0, 86)
ax.axis("off")
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

ax.text(67, 81.5, "要自己写一个 Agent，分六层", ha="center", va="center",
        fontsize=19, color=INK, fontweight="bold")
ax.text(67, 76.4, "每一层单独可测。跳层的代价是：出问题查不到是哪一层的锅",
        ha="center", va="center", fontsize=11.2, color=MUTED)

X, W = 26, 102
y = 71.5
for code, name, what, why, color in LAYERS:
    h = 9.0
    y -= h
    ax.add_patch(FancyBboxPatch(
        (X, y), W, h - 0.9,
        boxstyle="round,pad=0,rounding_size=1.4",
        linewidth=1.6, edgecolor=color, facecolor=color + "0A",
    ))
    # 层号块
    ax.add_patch(FancyBboxPatch(
        (X, y), 11.5, h - 0.9,
        boxstyle="round,pad=0,rounding_size=1.4",
        linewidth=0, facecolor=color,
    ))
    ax.text(X + 5.75, y + (h - 0.9) / 2, code, ha="center", va="center",
            fontsize=15, color="white", fontweight="bold")
    # 名称
    ax.text(X + 15.5, y + (h - 0.9) / 2 + 1.5, name, ha="left", va="center",
            fontsize=12.4, color=color, fontweight="bold")
    # 说明
    ax.text(X + 15.5, y + (h - 0.9) / 2 - 2.0, what, ha="left", va="center",
            fontsize=9.9, color=INK)
    ax.text(X + 63, y + (h - 0.9) / 2, why, ha="left", va="center",
            fontsize=9.7, color=MUTED)
    y -= 0.8

# 左侧竖轴：越往上越「离线」
ax.add_patch(FancyBboxPatch(
    (5.5, 12.5), 12.5, 59.0,
    boxstyle="round,pad=0,rounding_size=1.4",
    linewidth=1.4, edgecolor=LINE, facecolor="#f7f9fb",
))
ax.text(11.75, 64.5, "离线", ha="center", va="center", fontsize=11,
        color=MUTED, fontweight="bold")
ax.text(11.75, 18.5, "在线", ha="center", va="center", fontsize=11,
        color=MUTED, fontweight="bold")
ax.text(11.75, 41.5, "越往上越不参与\n当次回答", ha="center", va="center",
        fontsize=9.6, color=MUTED, linespacing=1.6)

# 底部提示
ax.add_patch(FancyBboxPatch(
    (X, 1.5), W, 7.4,
    boxstyle="round,pad=0,rounding_size=1.4",
    linewidth=1.4, edgecolor=LINE, facecolor="#f7f9fb",
))
ax.text(X + 3.0, 6.8, "最容易被跳过的是 L3", ha="left", va="center",
        fontsize=11.2, color=INK, fontweight="bold")
ax.text(X + 3.0, 3.7,
        "多数自建 Agent 把上下文当成「拼 prompt」，结果就是：越用越慢、越用越贵、而且说不清哪句话让它跑偏。",
        ha="left", va="center", fontsize=9.9, color=MUTED)

out = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "agent-six-layers.png")
plt.savefig(out, dpi=170, bbox_inches="tight", facecolor=BG)
print("saved:", out)
