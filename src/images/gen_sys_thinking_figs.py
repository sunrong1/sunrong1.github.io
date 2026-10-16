#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""系统思维三张图：核心 CLD / 转移负担基模 / 4 步法流程"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle
import matplotlib.patches as mpatches

plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "WenQuanYi Zen Hei"]
plt.rcParams["axes.unicode_minus"] = False

C_R   = "#C53030"; C_B = "#2B6CB0"
C_POS = "#2F855A"; C_NEG = "#C05621"; C_EDGE = "#2D3748"
BR = "#FFF5F5"; BB = "#EBFBFF"; BG = "#F0FFF4"; BX = "#FAF5FF"

def sign_marker(ax, mx, my, s, color, fs=18):
    ax.text(mx, my, s, ha="center", va="center", fontsize=fs,
            fontweight="bold", color=color, zorder=9,
            bbox=dict(boxstyle="circle,pad=0.24", fc="white", ec=color, lw=1.2))

def box(ax, cx, cy, w, h, text, fc, ec, fs=13, bold=True, lw=2.2):
    ax.add_patch(FancyBboxPatch((cx-w/2, cy-h/2), w, h,
                 boxstyle="round,pad=0.5,rounding_size=1.0",
                 facecolor=fc, edgecolor=ec, linewidth=lw, zorder=3))
    ax.text(cx, cy, text, ha="center", va="center", fontsize=fs,
            fontweight="bold" if bold else "normal", zorder=4, linespacing=1.4)

def link(ax, p0, p1, color, lw=2.4, rad=0.0, ls="-", alpha=1.0):
    ax.add_patch(FancyArrowPatch(p0, p1, connectionstyle=f"arc3,rad={rad}",
                 arrowstyle="-|>", mutation_scale=20, color=color,
                 linewidth=lw, zorder=2, shrinkA=6, shrinkB=6,
                 linestyle=ls, alpha=alpha))


# ══════════════════════ 图 1：核心 CLD ══════════════════════
def fig1(path):
    fig, ax = plt.subplots(figsize=(15, 10), dpi=150)
    ax.set_xlim(0, 100); ax.set_ylim(0, 100); ax.axis("off")
    NW, NH = 21, 8

    box(ax, 50, 14, NW, NH, "AI 代码占比", BB, C_B, 15)
    box(ax, 20, 32, NW, NH, "Review 一次性\n通过率", BB, C_B, 12.5)
    box(ax, 80, 32, NW, NH, "团队信任度\n（敢不敢用）", BB, C_B, 12.5)
    box(ax, 50, 50, NW, NH, "线上缺陷密度", BB, C_B, 14)
    box(ax, 50, 70, 25, NH, "AI Review 门禁 + 归因闭环", BG, C_R, 13)
    box(ax, 78, 87, 17, 7, "返工成本 ↓", BG, C_R, 12.5)
    box(ax, 22, 87, 17, 7, "AI 使用量 ↑", BG, C_R, 12.5)

    # --- B1 ---
    link(ax, (41, 18.5), (27, 28), C_POS, rad=0.12)
    sign_marker(ax, 33.5, 25.5, "+", C_POS)
    link(ax, (30.5, 32), (69.5, 32), C_POS)
    sign_marker(ax, 50, 32, "+", C_POS)
    link(ax, (73, 28), (59, 18.5), C_POS, rad=-0.12)
    sign_marker(ax, 66, 25, "+", C_POS)
    link(ax, (50, 18), (50, 45.8), C_NEG)
    sign_marker(ax, 50, 33, "-", C_NEG)
    link(ax, (61, 47.5), (71, 38.5), C_NEG, rad=0.22)
    sign_marker(ax, 69, 46, "-", C_NEG)
    link(ax, (25, 28.5), (41, 19), C_NEG, rad=0.16)
    sign_marker(ax, 30, 22, "-", C_NEG)

    # 调节杠杆
    link(ax, (56.5, 54), (53, 66), C_B, lw=2.8)
    sign_marker(ax, 53.5, 60, "-", C_B, 16)
    link(ax, (47, 66), (44, 54), C_B, lw=2.8)
    sign_marker(ax, 45, 60, "-", C_B, 16)

    # --- R1 ---
    link(ax, (62.5, 70), (70.5, 83.5), C_POS, rad=0.10)
    sign_marker(ax, 69, 79, "+", C_POS, 16)
    link(ax, (69.5, 87), (30.5, 87), C_POS)
    sign_marker(ax, 50, 87, "+", C_POS)
    link(ax, (28, 83.5), (39, 73.5), C_POS, rad=-0.10)
    sign_marker(ax, 30, 76, "+", C_POS, 16)
    link(ax, (22, 83.5), (13, 18), C_R, rad=0.13, lw=2.8)
    sign_marker(ax, 12, 50, "+", C_R, 20)

    ax.text(50, 3.5,
        "B1　对抗回路（负反馈）：AI 占比↑ → 缺陷↑ → 信任↓ → 不敢用 → AI 占比↓",
        ha="center", va="center", fontsize=13.5, fontweight="bold", color=C_B,
        bbox=dict(boxstyle="round,pad=0.5", fc=BB, ec=C_B, lw=1.4))
    ax.text(50, 96.8,
        "R1　增强回路（正反馈）：AI Review 基建 → 返工成本↓ → 用量↑ → 基建更值 → 基建投入↑",
        ha="center", va="center", fontsize=13.5, fontweight="bold", color=C_R,
        bbox=dict(boxstyle="round,pad=0.5", fc=BR, ec=C_R, lw=1.4))

    ax.text(90, 64, "真正的杠杆点：\n不是要求大家用 AI（推症状）\n而是降低 Review 成本（调结构）",
            fontsize=12, ha="center", va="center", color="#744210",
            bbox=dict(boxstyle="round,pad=0.7", fc="#FFFAF0", ec="#DD6B20", lw=1.8))
    ax.add_patch(FancyArrowPatch((76, 64), (52, 64), arrowstyle="->",
                 mutation_scale=18, color="#DD6B20", lw=2, zorder=8))

    ax.legend(handles=[
        mpatches.Patch(fc="white", ec=C_R, lw=2.4, label="增强回路 R（正反馈）"),
        mpatches.Patch(fc="white", ec=C_B, lw=2.4, label="调节回路 B（负反馈）"),
        mpatches.Patch(fc="white", ec=C_POS, lw=2.4, label="+ 正因果（A 增，B 也增）"),
        mpatches.Patch(fc="white", ec=C_NEG, lw=2.4, label="- 负因果（A 增，B 反而减）"),
    ], loc="lower left", bbox_to_anchor=(0.005, 0.045), fontsize=11, frameon=True,
       edgecolor="#CBD5E0")

    plt.savefig(path, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close()
    print("saved:", path)


# ══════════════════════ 图 2：转移负担基模 ══════════════════════
def fig2(path):
    fig, ax = plt.subplots(figsize=(13, 8.5), dpi=150)
    ax.set_xlim(0, 100); ax.set_ylim(0, 68); ax.axis("off")

    box(ax, 26, 46, 22, 8, "问题症状\n（AI 占比低 / 质量不稳）", "#FFF5F5", C_R, 12.5)
    box(ax, 74, 46, 22, 8, "表面解法\n（要求必须用 AI）", "#FFF5F5", C_R, 12.5)
    box(ax, 50, 26, 24, 8, "短期见效\n（指标达标）", "#FFFAF0", "#DD6B20", 13)
    box(ax, 22, 10, 22, 7, "根本解法\n（降低 Review 成本）", BG, C_B, 12)
    box(ax, 78, 10, 22, 7, "长期副作用\n（能力退化 / 依赖）", "#FFF5F5", C_R, 12)

    # 症状 → 表面解法
    link(ax, (37.5, 48.5), (62, 48.5), C_NEG)
    sign_marker(ax, 50, 48.5, "+", C_NEG, 16)
    # 表面解法 → 短期见效
    link(ax, (76, 41.5), (62, 30.5), C_POS, rad=-0.08)
    sign_marker(ax, 72, 36, "+", C_POS, 16)
    # 短期见效 → 症状
    link(ax, (38, 27.5), (20, 41.5), C_POS, rad=0.08)
    sign_marker(ax, 28, 34, "+", C_POS, 16)
    # 短期见效 → 副作用
    link(ax, (61, 23), (70, 13.5), C_NEG, rad=-0.10)
    sign_marker(ax, 67, 18, "+", C_NEG, 16)
    # 副作用 → 症状（长外弧，绕右侧上行，符号放右侧空档）
    link(ax, (88, 13), (90, 46), C_NEG, rad=0.30, lw=2.6)
    sign_marker(ax, 96, 30, "-", C_NEG, 18)
    link(ax, (90, 46), (38, 48.5), C_NEG, rad=-0.10, lw=2.6)
    sign_marker(ax, 64, 55, "-", C_NEG, 18)
    # 根本解法 → 症状（虚线结构干预）
    link(ax, (28, 13.5), (19, 41.5), C_B, rad=0.05, lw=2.8, ls=(0,(5,3)))
    sign_marker(ax, 13, 28, "-", C_B, 18)

    ax.text(50, 63, "转移负担基模（Shifting the Burden）",
            ha="center", fontsize=16, fontweight="bold", color="#2D3748")
    ax.text(50, 58.5, "越治越重：你把「结构问题」换成了「人的负担」，短期指标好看，长期问题更大",
            ha="center", fontsize=12.5, color="#4A5568")

    ax.text(50, 1.8, "打破点：不加新的解法，而是把「根本解法」接进回路（虚线蓝）",
            ha="center", fontsize=12.5, fontweight="bold", color=C_B,
            bbox=dict(boxstyle="round,pad=0.5", fc=BB, ec=C_B, lw=1.4))
    ax.legend(handles=[
        mpatches.Patch(fc="white", ec=C_POS, lw=2.4, label="+ 正因果"),
        mpatches.Patch(fc="white", ec=C_NEG, lw=2.4, label="- 负因果"),
        mpatches.Patch(fc="white", ec=C_B, lw=2.4, label="结构干预点"),
    ], loc="upper right", bbox_to_anchor=(0.995, 0.90), fontsize=11,
       frameon=True, edgecolor="#CBD5E0")

    plt.savefig(path, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close()
    print("saved:", path)


# ══════════════════════ 图 3：4 步法 + 迭代回环 ══════════════════════
def fig3(path):
    fig, ax = plt.subplots(figsize=(14, 7), dpi=150)
    ax.set_xlim(0, 100); ax.set_ylim(0, 50); ax.axis("off")

    steps = [
        (14, "① 确定目标", "要什么？\n可度量", BB, C_B),
        (38, "② 找元素 + 画连接", "系统里有什么\n怎么连", BB, C_B),
        (62, "③ 找延迟（关键）", "哪些是因\n哪些是果", "#FFFAF0", "#DD6B20"),
        (86, "④ 可视化", "画成回路图\n看清结构", BB, C_B),
    ]
    for x, t, s, fc, ec in steps:
        box(ax, x, 32, 20, 11, "", fc, ec)
        ax.text(x, 34.5, t, ha="center", fontsize=12.5, fontweight="bold", color="#2D3748")
        ax.text(x, 29.5, s, ha="center", fontsize=10.5, color="#4A5568", linespacing=1.3)

    for i in range(3):
        x0 = steps[i][0] + 10.5
        x1 = steps[i+1][0] - 10.5
        link(ax, (x0, 32), (x1, 32), C_EDGE, lw=2.6)
        sign_marker(ax, (x0+x1)/2, 32, "", C_EDGE, 1)
        ax.text((x0+x1)/2, 35, "→", ha="center", fontsize=17, color=C_EDGE, fontweight="bold")

    # ⑤ 抓主要矛盾（下方）
    box(ax, 50, 12, 26, 9, "⑤ 抓主要矛盾 + 找高杠杆点", BX, C_R, 13.5)
    link(ax, (86, 26), (63, 15), C_R, rad=0.06, lw=2.8)
    ax.text(78, 18, "在这里下手", ha="center", fontsize=11,
            color=C_R, fontweight="bold",
            bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="none"))

    # 迭代回环
    link(ax, (50, 16.5), (50, 5), C_POS, rad=0.55, lw=2.4, ls=(0,(4,3)))
    link(ax, (50, 5), (14, 8), C_POS, rad=0.0, lw=2.4, ls=(0,(4,3)))
    link(ax, (14, 8), (14, 26), C_POS, lw=2.4, ls=(0,(4,3)))
    ax.text(30, 3.2, "画完发现目标定错了？回到 ① 重新来",
            ha="center", fontsize=11.5, color=C_POS, fontweight="bold")

    plt.savefig(path, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close()
    print("saved:", path)


if __name__ == "__main__":
    base = "/workspace/blog/src/images/"
    fig1(base + "sys-thinking-cld-core.png")
    fig2(base + "sys-thinking-shifting-burden.png")
    fig3(base + "sys-thinking-4steps.png")
