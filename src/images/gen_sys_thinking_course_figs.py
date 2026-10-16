#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""系统思维课程 blog 配图（通用版，不含具体业务场景）

图 1: 系统的 5 大属性
图 2: 线性思维 → 系统思维 的 6 个转变
图 3: 三种基本回路速查（R / B / 延迟）
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Wedge
import matplotlib.patches as mpatches

plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "WenQuanYi Zen Hei"]
plt.rcParams["axes.unicode_minus"] = False

C_CORE   = "#2B6CB0"
C_R      = "#C53030"
C_B      = "#2B6CB0"
C_POS    = "#2F855A"
C_NEG    = "#C05621"
C_EDGE   = "#2D3748"
C_MUTED  = "#718096"
BC = "#EBFBFF"
BR = "#FFF5F5"
BG = "#F0FFF4"
BY = "#FFFAF0"
BW = "#FAF5FF"


def box(ax, cx, cy, w, h, text, fc, ec, fs=12.5, bold=True, lw=2.0, tc="#2D3748"):
    ax.add_patch(FancyBboxPatch((cx-w/2, cy-h/2), w, h,
                 boxstyle="round,pad=0.45,rounding_size=0.9",
                 facecolor=fc, edgecolor=ec, linewidth=lw, zorder=3))
    ax.text(cx, cy, text, ha="center", va="center", fontsize=fs,
            fontweight="bold" if bold else "normal", zorder=4,
            linespacing=1.45, color=tc)

def link(ax, p0, p1, color=C_EDGE, lw=2.0, rad=0.0, ls="-", alpha=1.0):
    ax.add_patch(FancyArrowPatch(p0, p1, connectionstyle=f"arc3,rad={rad}",
                 arrowstyle="-|>", mutation_scale=17, color=color,
                 linewidth=lw, zorder=2, shrinkA=5, shrinkB=5,
                 linestyle=ls, alpha=alpha))

def sign_marker(ax, x, y, s, color, fs=16):
    ax.text(x, y, s, ha="center", va="center", fontsize=fs,
            fontweight="bold", color=color, zorder=9,
            bbox=dict(boxstyle="circle,pad=0.22", fc="white", ec=color, lw=1.1))


# ════════════════ 图 1：系统 5 大属性 ════════════════
def fig1(path):
    fig, ax = plt.subplots(figsize=(14, 10.5), dpi=150)
    ax.set_xlim(0, 100); ax.set_ylim(0, 82); ax.axis("off")

    # 中心
    ax.add_patch(Circle((50, 39), 11.5, facecolor="#EDF2F7",
                        edgecolor=C_CORE, linewidth=2.8, zorder=4))
    ax.text(50, 41.5, "系统", ha="center", va="center",
            fontsize=19, fontweight="bold", color=C_CORE, zorder=5)
    ax.text(50, 36.5, "相互连接的元素\n实现目标或功能的整体",
            ha="center", va="center", fontsize=10.2, color="#4A5568",
            zorder=5, linespacing=1.4)

    attrs = [
        (50, 70, "① 目的性", "系统的起点\n为什么存在", BC, C_B),
        (83, 55, "② 开放性", "系统是环境的一部分\n持续与环境交互", BC, C_B),
        (83, 23, "③ 演化性", "进化与演进\n没有静止的系统", BC, C_B),
        (50, 8,  "④ 多维度", "可以从很多维度看\n同一个系统", BC, C_B),
        (17, 23, "⑤ 涌现性", "整体出现单个元素\n没有的特性", BR, C_R),
    ]
    for x, y, t, s, fc, ec in attrs:
        box(ax, x, y, 21, 10, "", fc, ec)
        ax.text(x, y+2.2, t, ha="center", fontsize=13.5, fontweight="bold", color=ec, zorder=5)
        ax.text(x, y-1.8, s, ha="center", fontsize=10, color="#4A5568",
                zorder=5, linespacing=1.4)

    # 连线
    for x, y in [(50,65), (72.5,55), (72.5,23), (50,13), (27.5,23)]:
        link(ax, (50, 39), (x, y), C_MUTED, lw=1.6, ls=(0,(3,3)))

    # 涌现性高亮注释
    ax.text(17, 11.5, "系统的「魔法」：发生质的变化", ha="center", fontsize=10.5,
            fontweight="bold", color=C_R,
            bbox=dict(boxstyle="round,pad=0.35", fc=BR, ec=C_R, lw=1.3))

    ax.text(50, 79.5, "系统的 5 大属性", ha="center", fontsize=17,
            fontweight="bold", color="#2D3748")
    ax.text(50, 1.0, "前 4 条是所有系统都有的；第 5 条（涌现性）是系统最迷人的地方",
            ha="center", fontsize=11.5, color="#4A5568")

    plt.savefig(path, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close()
    print("saved:", path)


# ════════════════ 图 2：6 个转变 ════════════════
def fig2(path):
    fig, ax = plt.subplots(figsize=(14, 9.5), dpi=150)
    ax.set_xlim(0, 100); ax.set_ylim(0, 80); ax.axis("off")

    ax.text(50, 77, "线性思维  →  系统思维", ha="center", fontsize=19,
            fontweight="bold", color="#2D3748")

    rows = [
        ("深入本质", "表象", "透过现象看结构"),
        ("全局思考", "局部", "看更大范围的外部环境"),
        ("动态思考", "静态", "看变化的过程，不只看当下"),
        ("整体思考", "局部", "看见系统内部的结构模式"),
        ("增量思考", "存量", "创造未来，而不是维持现状"),
        ("原理思考", "现象", "追问机制为什么这样运转"),
    ]

    # 表头
    ax.text(17, 68.5, "线性思维", ha="center", fontsize=15, fontweight="bold", color=C_MUTED)
    ax.text(17, 64.8, "惯性思维 · 机械思考", ha="center", fontsize=10.5, color=C_MUTED)
    ax.text(60, 68.5, "系统思维", ha="center", fontsize=15, fontweight="bold", color=C_CORE)
    ax.text(60, 64.8, "面向复杂系统更有效", ha="center", fontsize=10.5, color=C_CORE)
    ax.plot([4, 96], [61.5, 61.5], color="#CBD5E0", lw=1.2, zorder=1)

    top, gap = 56.5, 9.0
    for i, (sys_t, lin_t, meaning) in enumerate(rows):
        y = top - i*gap
        # 左：线性
        box(ax, 18, y, 26, 7.0, f"盯着：{lin_t}", "#F7FAFC", "#CBD5E0", 12,
            bold=False, tc="#4A5568")
        # 中：箭头
        link(ax, (32, y), (44.5, y), C_CORE, lw=2.6)
        # 右：系统
        box(ax, 60, y, 30, 7.0, sys_t, BC, C_CORE, 13.5)
        # 释义
        ax.text(78, y, meaning, ha="left", va="center", fontsize=10.2,
                color="#4A5568", linespacing=1.3)

    ax.text(50, 1.8,
            "适用：AI 能力提升 · 个人能力提升 · 软件系统设计",
            ha="center", fontsize=12, fontweight="bold", color=C_CORE,
            bbox=dict(boxstyle="round,pad=0.45", fc=BC, ec=C_CORE, lw=1.4))

    plt.savefig(path, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close()
    print("saved:", path)


# ════════════════ 图 3：三种基本回路速查 ════════════════
def fig3(path):
    fig, ax = plt.subplots(figsize=(15, 5.6), dpi=150)
    ax.set_xlim(0, 150); ax.set_ylim(0, 52); ax.axis("off")

    def panel(x0, title, color, kind):
        ax.add_patch(FancyBboxPatch((x0, 3), 44, 45,
                     boxstyle="round,pad=0.5,rounding_size=1.2",
                     facecolor="white", edgecolor=color, linewidth=2.2))
        ax.text(x0+22, 45, title, ha="center", fontsize=13.5,
                fontweight="bold", color=color)

    # ---------- ① 增强回路 R ----------
    panel(2, "增强回路 R（正反馈）", C_R, "R")
    a = (13, 20); b = (35, 20)
    box(ax, *a, 14, 8, "产量", BR, C_R, 12)
    box(ax, *b, 14, 8, "信心", BR, C_R, 12)
    link(ax, (20, 21.8), (28, 21.8), C_POS, lw=2.2)
    sign_marker(ax, 24, 24.5, "+", C_POS, 14)
    link(ax, (28, 18.2), (20, 18.2), C_POS, lw=2.2)
    sign_marker(ax, 24, 14.5, "+", C_POS, 14)
    ax.text(24, 9.5, "越滚越大", ha="center", fontsize=11, fontweight="bold", color=C_R)
    ax.text(24, 36, "偶数个负号 = R", ha="center", fontsize=10.5,
            color=C_MUTED, style="italic")

    # ---------- ② 调节回路 B ----------
    panel(53, "调节回路 B（负反馈）", C_B, "B")
    a2 = (64, 20); b2 = (86, 20)
    box(ax, *a2, 14, 8, "压力", BC, C_B, 12)
    box(ax, *b2, 14, 8, "应对", BC, C_B, 12)
    link(ax, (71, 21.8), (79, 21.8), C_POS, lw=2.2)
    sign_marker(ax, 75, 24.5, "+", C_POS, 14)
    link(ax, (79, 18.2), (71, 18.2), C_NEG, lw=2.2)
    sign_marker(ax, 75, 14.5, "-", C_NEG, 14)
    ax.text(75, 9.5, "自我稳定", ha="center", fontsize=11, fontweight="bold", color=C_B)
    ax.text(75, 36, "奇数个负号 = B", ha="center", fontsize=10.5,
            color=C_MUTED, style="italic")

    # ---------- ③ 时间延迟 ----------
    panel(104, "时间延迟（滞后）", "#DD6B20", "L")
    ax.plot([113, 145], [20, 20], color="#DD6B20", lw=2.4, zorder=3)
    for xx in [113, 129, 145]:
        ax.plot([xx, xx], [18.4, 21.6], color="#DD6B20", lw=1.6, zorder=3)
    ax.text(121, 24.5, "投入基建", ha="center", fontsize=10.5, color="#4A5568")
    ax.text(137, 24.5, "指标变化", ha="center", fontsize=10.5, color="#4A5568")
    link(ax, (129, 27), (129, 22), C_EDGE, lw=1.8, ls=(0,(3,2)))
    ax.text(129, 29.5, "滞后期", ha="center", fontsize=10.5,
            fontweight="bold", color="#DD6B20")
    ax.text(126, 8.5, "因和果不在同一时刻", ha="center", fontsize=10.8,
            fontweight="bold", color="#DD6B20")
    ax.text(126, 36, "最反直觉，也最容易漏", ha="center", fontsize=10.5,
            color=C_MUTED, style="italic")

    ax.text(75, 0.8, "判定法则：沿着回路数负号个数 —— 偶数 = 增强 R，奇数 = 调节 B",
            ha="center", fontsize=12.5, fontweight="bold", color="#2D3748",
            bbox=dict(boxstyle="round,pad=0.45", fc="#EDF2F7", ec="#CBD5E0", lw=1.4))

    plt.savefig(path, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close()
    print("saved:", path)


if __name__ == "__main__":
    base = "/workspace/blog/src/images/"
    fig1(base + "sys-thinking-5-attributes.png")
    fig2(base + "sys-thinking-6-shifts.png")
    fig3(base + "sys-thinking-3-loops.png")
