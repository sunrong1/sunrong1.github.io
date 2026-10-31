#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""QCC 生命周期图：组建 → 注册 → 选题 → 课题注册 → PDCA → 成果固化。

输出：src/.vuepress/public/images/qcc-lifecycle.png
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
from matplotlib import font_manager

for cand in ["Noto Sans CJK SC", "WenQuanYi Zen Hei", "Noto Sans CJK JP", "DejaVu Sans"]:
    try:
        font_manager.findfont(cand, fallback_to_default=False)
        plt.rcParams["font.sans-serif"] = [cand]
        break
    except Exception:
        continue
plt.rcParams["axes.unicode_minus"] = False

INK, MUTED, LINE, BG = "#1f2933", "#6b7785", "#d4dae1", "#ffffff"
BLUE, GREEN, AMBER, PURPLE, RED = "#2f6fb3", "#2e8b6f", "#c8871b", "#6b5ba8", "#c0473c"

W, H = 136.0, 76.0
fig, ax = plt.subplots(figsize=(13.6, 7.6), dpi=170)
ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis("off")
fig.patch.set_facecolor(BG); ax.set_facecolor(BG)
fig.subplots_adjust(left=0.004, right=0.996, top=0.996, bottom=0.004)

# ═════════ 标题 ═════════
ax.text(5, 70.4, "一个 QC 小组的完整生命周期", ha="left", va="center",
        fontsize=22, color=INK, fontweight="bold")
ax.text(5, 65.2, "三个评审节点卡住质量，两个注册管住资格 —— 这套机制之所以跑得动，靠的是流程而不是热情",
        ha="left", va="center", fontsize=11.2, color=MUTED)
ax.plot([5, 131.5], [61.6, 61.6], color=LINE, linewidth=1.1)

# ═════════ 阶段块 ═════════
BY, BH = 46.0, 14.0
STAGES = [
    (5.0,   13.0, "组建", "三种程序之一", BLUE),
    (21.1,  13.0, "小组注册", "每年一次", BLUE),
    (37.2,  13.0, "选题", "定课题方向", AMBER),
    (53.3,  13.0, "课题注册", "每课题一次", BLUE),
    (69.4,  46.0, "PDCA", "", GREEN),
    (118.5, 13.0, "成果固化", "写进标准", GREEN),
]
for x, w, t, sub, c in STAGES:
    ax.add_patch(FancyBboxPatch((x, BY), w, BH,
                 boxstyle="round,pad=0,rounding_size=1.4",
                 linewidth=1.8, edgecolor=c, facecolor=c + "0E"))
    if t == "PDCA":
        continue
    ax.text(x + w / 2, BY + BH - 4.4, t, ha="center", va="center",
            fontsize=10.6, color=c, fontweight="bold")
    ax.text(x + w / 2, BY + BH - 8.8, sub, ha="center", va="center",
            fontsize=7.8, color=MUTED)

# PDCA 内部四段
pd_x, pd_w = 69.4, 46.0
seg_w = (pd_w - 2 * 1.5 - 3 * 1.3) / 4
SEG = [
    ("P", "计划", "选题·现状·目标\n要因·对策"),
    ("D", "执行", "5W1H 对策表\n对策实施"),
    ("C", "检查", "效果确认\n前后对比数据"),
    ("A", "处理", "巩固措施\n纳入标准"),
]
sx = pd_x + 1.5
for i, (letter, cn, desc) in enumerate(SEG):
    ax.add_patch(FancyBboxPatch((sx, BY + 1.8), seg_w, BH - 3.6,
                 boxstyle="round,pad=0,rounding_size=1.0",
                 linewidth=0, facecolor=GREEN + "18"))
    ax.text(sx + seg_w / 2, BY + BH - 5.2, f"{letter} · {cn}", ha="center", va="center",
            fontsize=9.4, color=GREEN, fontweight="bold")
    ax.text(sx + seg_w / 2, BY + BH - 9.6, desc, ha="center", va="center",
            fontsize=7.4, color=INK, linespacing=1.5)
    sx += seg_w + 1.3

# 阶段箭头
for a1, a2 in [(18.0, 21.1), (34.1, 37.2), (50.2, 53.3), (66.3, 69.4), (115.4, 118.5)]:
    ax.add_patch(FancyArrowPatch((a1 + 0.4, BY + BH / 2), (a2 - 0.4, BY + BH / 2),
                 arrowstyle="-|>", mutation_scale=10, linewidth=1.4, color=MUTED))

# ═════════ 三个评审徽章 ═════════
REV = [
    (43.7, "主题评审", "课题选得对不对 · 范围清不清"),
    (pd_x + 1.5 + seg_w + 0.65, "对策评审", "措施能不能落地 · 5W1H 全不全"),
    (125.0, "成功评审", "效果是否达标 · 能否标准化"),
]
for x, t, d in REV:
    ax.add_patch(FancyBboxPatch((x - 8.0, BY - 6.4), 16.0, 5.2,
                 boxstyle="round,pad=0,rounding_size=0.9",
                 linewidth=1.3, edgecolor=RED, facecolor=RED + "12"))
    ax.text(x, BY - 3.8, t, ha="center", va="center",
            fontsize=8.8, color=RED, fontweight="bold")
    ax.text(x, BY - 9.0, d, ha="center", va="center",
            fontsize=7.4, color=MUTED)

# ═════════ 三个角色 ═════════
RY, RH = 19.5, 11.5
ax.text(5, 32.0, "三个角色，缺一不可", ha="left", va="center",
        fontsize=11.4, color=INK, fontweight="bold")
ROLES = [
    (5.0,  42.0, "圈长", "思维与分析问题能力 · 沟通与协调能力", BLUE, ""),
    (50.8, 40.0, "辅导员", "提供改进知识、工具与方法支持", AMBER, ""),
    (94.0, 37.5, "圈员", "立足本职工作，参与分析与实施", GREEN,
     "一个人可同时参加多个 QC 小组，课题须来自本岗位现场"),
]
for x, w, t, d, c, extra in ROLES:
    ax.add_patch(FancyBboxPatch((x, RY), w, RH,
                 boxstyle="round,pad=0,rounding_size=1.4",
                 linewidth=1.6, edgecolor=c, facecolor=c + "0C"))
    ax.add_patch(FancyBboxPatch((x + 2.0, RY + 4.0), 7.0, 3.4,
                 boxstyle="round,pad=0,rounding_size=0.9",
                 linewidth=0, facecolor=c))
    ax.text(x + 5.5, RY + 5.7, t, ha="center", va="center",
            fontsize=9.6, color="white", fontweight="bold")
    ax.text(x + 10.6, RY + 5.7, d, ha="left", va="center",
            fontsize=8.4, color=INK)
    if extra:
        ax.text(x + 2.2, RY + 2.0, extra, ha="left", va="center",
                fontsize=7.4, color=MUTED)

# ═════════ 底部硬约束 ═════════
CY, CH = 3.0, 14.0
ax.add_patch(FancyBboxPatch((5, CY), 126.5, CH,
             boxstyle="round,pad=0,rounding_size=1.6",
             linewidth=1.8, edgecolor=PURPLE, facecolor=PURPLE + "08"))
ax.add_patch(FancyBboxPatch((5, CY + CH - 4.4), 126.5, 4.4,
             boxstyle="round,pad=0,rounding_size=1.6",
             linewidth=0, facecolor=PURPLE))
ax.text(7.0, CY + CH - 2.2, "制度硬约束 —— 不是方法论建议，是不满足就出问题的规则",
        ha="left", va="center", fontsize=10.4, color="white", fontweight="bold")

RULES = [
    ("课题周期", "一般不超过半年"),
    ("小组会议", "每月至少两次"),
    ("中间报告", "每半个月提交一次"),
    ("小组注册", "每年一次 · 停活动超半年注销"),
    ("课题注册", "每个课题开展前注册"),
]
rx = 7.0
for k, v in RULES:
    w = 23.6
    ax.add_patch(FancyBboxPatch((rx, CY + 1.4), w, 6.6,
                 boxstyle="round,pad=0,rounding_size=0.9",
                 linewidth=1.1, edgecolor=PURPLE, facecolor=PURPLE + "10"))
    ax.text(rx + w / 2, CY + 5.9, k, ha="center", va="center",
            fontsize=8.6, color=PURPLE, fontweight="bold")
    ax.text(rx + w / 2, CY + 3.2, v, ha="center", va="center",
            fontsize=8.0, color=INK)
    rx += w + 1.0

fig.savefig("/workspace/blog/src/.vuepress/public/images/qcc-lifecycle.png",
            dpi=170, facecolor=BG)
print("→ qcc-lifecycle.png")
