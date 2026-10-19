#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""系统思维完整框架速查图：3 要素 + 4 步骤 + 5 属性 + 2 回路"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np

plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "WenQuanYi Zen Hei"]
plt.rcParams["axes.unicode_minus"] = False

C1 = "#2B6CB0"   # 要素 蓝
C2 = "#2F855A"   # 步骤 绿
C3 = "#805AD5"   # 属性 紫
C4 = "#C53030"   # 回路 红
C_EDGE = "#2D3748"
GREY = "#718096"

BOX = dict(boxstyle="round,pad=0.4,rounding_size=1.2", linewidth=2.2)

fig, ax = plt.subplots(figsize=(17, 10), dpi=150)
ax.set_xlim(0, 170); ax.set_ylim(0, 98); ax.axis("off")

ax.text(85, 97, "系统思维完整框架 · 速查", ha="center", fontsize=22,
        fontweight="bold", color="#1A202C")
ax.text(85, 92.5, "3 要素 + 4 步骤 + 5 属性 + 2 回路", ha="center",
        fontsize=14, color=GREY)


def block(x0, y0, w, h, tag, title, color, tint):
    ax.add_patch(FancyBboxPatch((x0, y0), w, h, facecolor="white",
                 edgecolor=color, **BOX))
    # 头部色带
    ax.add_patch(FancyBboxPatch((x0, y0+h-7.5), w, 7.5,
                 boxstyle="round,pad=0.4,rounding_size=1.2",
                 facecolor=tint, edgecolor="none", zorder=1))
    ax.text(x0+3.5, y0+h-3.8, tag, ha="left", fontsize=13,
            fontweight="bold", color=color, zorder=4)
    ax.text(x0+13.5, y0+h-3.8, title, ha="left", fontsize=14,
            fontweight="bold", color="#1A202C", zorder=4)


def item(cx, cy, w, h, text, fc, ec, fs=10.2):
    ax.add_patch(FancyBboxPatch((cx-w/2, cy-h/2), w, h,
                 boxstyle="round,pad=0.28,rounding_size=0.5",
                 facecolor=fc, edgecolor=ec, linewidth=1.5, zorder=3))
    ax.text(cx, cy, text, ha="center", va="center", fontsize=fs,
            fontweight="bold", zorder=4, linespacing=1.3, color="#2D3748")


# ════════════ ① 3 大要素 ════════════
block(3, 46, 52, 44, "3", "大要素", C1, "#EBFBFF")
c = 29
item(c, 81, 44, 6.5, "元素：系统里有什么", "#FFFFFF", C1, 11)
item(c, 73.5, 44, 6.5, "连接：元素之间怎么连", "#FFFFFF", C1, 11)
item(c, 66, 44, 6.5, "目的 / 功能：为谁、干什么", "#FFFFFF", C1, 11)
item(c, 55, 46, 6.5, "只有元素 = 集合，不是系统", "#F7FAFC", GREY, 10)
ax.text(c, 48.5, "少了「目的」，就只是一堆零件",
        ha="center", fontsize=10, color=GREY, style="italic")

# ════════════ ② 4 大步骤 ════════════
block(59, 46, 52, 44, "4", "大步骤", C2, "#F0FFF4")
steps = [("1. 确定目标", "要什么 · 可度量"),
         ("2. 找元素 + 画连接", "有什么 · 怎么连"),
         ("3. 找延迟（关键）", "哪些是因 · 哪些是果"),
         ("4. 可视化", "画成图 · 看清结构")]
ys = [81.5, 74, 66.5, 59]
for (t, s), y in zip(steps, ys):
    item(85, y, 46, 5.6, "", "#FFFFFF", C2)
    ax.text(63.5, y, t, ha="left", va="center", fontsize=10.8,
            fontweight="bold", color=C2, zorder=5)
    ax.text(84, y, s, ha="left", va="center", fontsize=9.6,
            color=GREY, zorder=5)
# 箭头
for i in range(3):
    ax.add_patch(FancyArrowPatch((85, ys[i]-2.8), (85, ys[i+1]+2.8),
                 arrowstyle="-|>", mutation_scale=13, color=C2,
                 linewidth=1.6, zorder=2))
item(85, 54, 46, 6, "5. 抓主要矛盾 + 找杠杆点", "#FFF5F5", C4, 10.8)
ax.text(85, 48.5, "画完发现目标定错了？回到第 1 步重来",
        ha="center", fontsize=10, color=C4, style="italic")

# ════════════ ③ 5 大属性 ════════════
block(115, 46, 52, 44, "5", "大属性", C3, "#FAF5FF")
attrs = [("① 目的性", "系统的起点"),
         ("② 开放性", "与环境持续交互"),
         ("③ 演化性", "没有静止的系统"),
         ("④ 多维度", "多角度看同一个"),
         ("⑤ 涌现性", "整体 > 单个之和  ⭐")]
for i, (t, s) in enumerate(attrs):
    y = 82.5 - i * 6.1
    fc = "#FFF5F5" if i == 4 else "#FFFFFF"
    ec = C4 if i == 4 else C3
    item(141, y, 46, 5.4, "", fc, ec)
    ax.text(120, y, t, ha="left", va="center", fontsize=10.5,
            fontweight="bold", color=ec, zorder=5)
    ax.text(141, y, s, ha="right", va="center", fontsize=9.4,
            color=GREY, zorder=5)
ax.text(141, 48.5, "前 4 条所有系统都有；第 5 条最迷人",
        ha="center", fontsize=10, color=GREY, style="italic")

# ════════════ ④ 2 大回路（核心）════════════
block(3, 4, 164, 38, "2", "大回路 —— 系统思维真正的分析工具", C4, "#FFF5F5")

# 增强回路 R
item(40, 27, 52, 19, "", "#FFFFFF", C4)
ax.text(40, 33.5, "增强回路 R（正反馈）", ha="center", fontsize=12.5,
        fontweight="bold", color=C4)
item(28, 27.5, 17, 6, "变量 A", "#FFF5F5", C4)
item(52, 27.5, 17, 6, "变量 B", "#FFF5F5", C4)
ax.add_patch(FancyArrowPatch((36.8, 29), (43.2, 29), arrowstyle="-|>",
             mutation_scale=16, color=C4, linewidth=2, zorder=2))
ax.text(40, 31.8, "+", ha="center", va="center", fontsize=15,
        fontweight="bold", color=C4, zorder=5,
        bbox=dict(boxstyle="circle,pad=0.18", fc="white", ec=C4, lw=1))
ax.add_patch(FancyArrowPatch((43.2, 26), (36.8, 26), arrowstyle="-|>",
             mutation_scale=16, color=C4, linewidth=2, zorder=2))
ax.text(40, 23.6, "+", ha="center", va="center", fontsize=15,
        fontweight="bold", color=C4, zorder=5,
        bbox=dict(boxstyle="circle,pad=0.18", fc="white", ec=C4, lw=1))
ax.text(40, 17.5, "越滚越大 · 加力就有效", ha="center", fontsize=10.5,
        fontweight="bold", color=C4)

# 调节回路 B
item(130, 27, 52, 19, "", "#FFFFFF", C1)
ax.text(130, 33.5, "调节回路 B（负反馈）", ha="center", fontsize=12.5,
        fontweight="bold", color=C1)
item(118, 27.5, 17, 6, "变量 A", "#EBFBFF", C1)
item(142, 27.5, 17, 6, "变量 B", "#EBFBFF", C1)
ax.add_patch(FancyArrowPatch((126.8, 29), (133.2, 29), arrowstyle="-|>",
             mutation_scale=16, color="#2F855A", linewidth=2, zorder=2))
ax.text(130, 31.8, "+", ha="center", va="center", fontsize=15,
        fontweight="bold", color="#2F855A", zorder=5,
        bbox=dict(boxstyle="circle,pad=0.18", fc="white", ec="#2F855A", lw=1))
ax.add_patch(FancyArrowPatch((133.2, 26), (126.8, 26), arrowstyle="-|>",
             mutation_scale=16, color="#C05621", linewidth=2, zorder=2))
ax.text(130, 23.6, "-", ha="center", va="center", fontsize=15,
        fontweight="bold", color="#C05621", zorder=5,
        bbox=dict(boxstyle="circle,pad=0.18", fc="white", ec="#C05621", lw=1))
ax.text(130, 17.5, "自我稳定 · 加力会反弹", ha="center", fontsize=10.5,
        fontweight="bold", color=C1)

# 中间的判定法则
ax.add_patch(FancyBboxPatch((76, 13), 18, 20,
             boxstyle="round,pad=0.4,rounding_size=1.2",
             facecolor="#FFFAF0", edgecolor="#DD6B20", linewidth=2.2, zorder=2))
ax.text(85, 30, "判定法则", ha="center", fontsize=11.5,
        fontweight="bold", color="#DD6B20", zorder=4)
ax.text(85, 25.5, "数负号个数", ha="center", fontsize=10,
        color="#744210", zorder=4)
ax.text(85, 19.5, "偶数 → R\n奇数 → B", ha="center", fontsize=12,
        fontweight="bold", color="#C2410C", zorder=4, linespacing=1.5)
ax.text(85, 14.5, "3 秒判断", ha="center", fontsize=9.6,
        color="#744210", zorder=4, style="italic")

# 延迟提醒
ax.add_patch(FancyBboxPatch((3, 5.5), 164, 4.0,
             boxstyle="round,pad=0.35,rounding_size=0.9",
             facecolor="#EDF2F7", edgecolor="#CBD5E0", linewidth=1.4, zorder=1))
ax.text(85, 7.5, "别忘了 延迟（Delay）：因果在时空上不紧密相连 —— 这是最容易被漏掉、也最容易让人看错方向的一项",
        ha="center", va="center", fontsize=11, fontweight="bold", color="#2D3748")

plt.savefig("/workspace/blog/src/images/sys-thinking-framework-cheatsheet.png",
            dpi=150, bbox_inches="tight", facecolor="white")
print("saved: sys-thinking-framework-cheatsheet.png")
