#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""系统基模 8 种（Senge《第五项修炼》原书）

图 A: 失控组 4 基模 —— 干预越用力越糟
图 B: 锁死/受阻组 4 基模 —— 结构性困局
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.patches as mpatches

plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "WenQuanYi Zen Hei"]
plt.rcParams["axes.unicode_minus"] = False

C_R  = "#C53030"; C_B = "#2B6CB0"
C_POS= "#2F855A"; C_NEG= "#C05621"; C_EDGE="#2D3748"
BR="#FFF5F5"; BB="#EBFBFF"; BW="#FAF5FF"; BY="#FFFAF0"
OR = "#DD6B20"; PU="#805AD5"

def box(ax, cx, cy, w, h, text, fc, ec, fs=11, bold=True, lw=1.8, tc=None):
    ax.add_patch(FancyBboxPatch((cx-w/2, cy-h/2), w, h,
                 boxstyle="round,pad=0.35,rounding_size=0.7",
                 facecolor=fc, edgecolor=ec, linewidth=lw, zorder=3))
    ax.text(cx, cy, text, ha="center", va="center", fontsize=fs,
            fontweight="bold" if bold else "normal", zorder=4,
            linespacing=1.35, color=tc or "#2D3748")

def link(ax, p0, p1, color=C_EDGE, lw=1.6, rad=0.0, ls="-", mut=13):
    ax.add_patch(FancyArrowPatch(p0, p1, connectionstyle=f"arc3,rad={rad}",
                 arrowstyle="-|>", mutation_scale=mut, color=color,
                 linewidth=lw, zorder=2, shrinkA=3, shrinkB=3, linestyle=ls))

def sg(ax, x, y, s, color, fs=13):
    ax.text(x, y, s, ha="center", va="center", fontsize=fs,
            fontweight="bold", color=color, zorder=9,
            bbox=dict(boxstyle="circle,pad=0.16", fc="white", ec=color, lw=0.9))


def quadrant(ax, x0, y0, w, h, no, title, sub, color):
    ax.add_patch(FancyBboxPatch((x0, y0), w, h,
                 boxstyle="round,pad=0.4,rounding_size=1.0",
                 facecolor="white", edgecolor=color, linewidth=2.0))
    ax.text(x0+3.5, y0+h-3.2, no, ha="left", fontsize=15,
            fontweight="bold", color=color)
    ax.text(x0+10, y0+h-3.2, title, ha="left", fontsize=12.5,
            fontweight="bold", color="#2D3748")
    ax.text(x0+w/2, y0+h-7.5, sub, ha="center", fontsize=9.3,
            color=C_MUTED_ if False else "#718096", style="italic")


# ════════════ 图 A：失控组 4 基模 ════════════
def figA(path):
    fig, ax = plt.subplots(figsize=(16, 11), dpi=150)
    ax.set_xlim(0, 100); ax.set_ylim(0, 74); ax.axis("off")

    ax.text(50, 71.5, "失控组：干预越用力，情况越糟", ha="center", fontsize=17,
            fontweight="bold", color=C_R)

    QW, QH = 47, 29

    # ① 饮鸩止渴
    x, y = 2, 40
    quadrant(ax, x, y, QW, QH, "①", "饮鸩止渴  Fixes that Fail", "同一个解法反复用，副作用越来越重", C_R)
    box(ax, x+10, y+17, 13, 5.5, "问题症状", BR, C_R, 10.5)
    box(ax, x+36, y+17, 13, 5.5, "采取解法", BR, C_R, 10.5)
    link(ax, (x+16.8, y+17), (x+29.2, y+17), C_POS)
    sg(ax, x+23, y+19.5, "+", C_POS, 12)
    box(ax, x+36, y+9, 13, 5.5, "短期见效", BY, OR, 10.5)
    link(ax, (x+36, y+14.2), (x+36, y+12), C_POS)
    sg(ax, x+39.5, y+13, "+", C_POS, 12)
    box(ax, x+23, y+9, 13, 5.5, "副作用\n（延迟）", BW, PU, 10)
    link(ax, (x+33, y+11.5), (x+30, y+11.5), PU, ls=(0,(3,2)))
    sg(ax, x+31.5, y+13.5, "-", PU, 12)
    link(ax, (x+16.8, y+9), (x+10, y+14.2), C_NEG, rad=0.12)
    sg(ax, x+12, y+10.5, "-", C_NEG, 12)
    ax.text(x+QW/2, y+3.2, "解法没错，但一直在治标", ha="center", fontsize=9.5,
            color=C_R, fontweight="bold")

    # ② 转移负担
    x, y = 51, 40
    quadrant(ax, x, y, QW, QH, "②", "转移负担  Shifting the Burden", "症状解越顺手，根本能力越退化", OR)
    box(ax, x+9, y+17, 12, 5.5, "问题症状", BR, C_R, 10.5)
    box(ax, x+27, y+17, 14, 5.5, "症状解法（快·有效）", BY, OR, 10)
    box(ax, x+9, y+8, 14, 5.5, "根本解法（慢）", BB, C_B, 10)
    link(ax, (x+15.2, y+17), (x+19.6, y+17), C_POS)
    sg(ax, x+17.4, y+19.5, "+", C_POS, 12)
    link(ax, (x+34, y+14.2), (x+17, y+14.2), C_NEG, rad=0.10)
    sg(ax, x+25, y+12.8, "-", C_NEG, 12)
    link(ax, (x+9, y+10.8), (x+7, y+14.2), C_POS, ls=(0,(3,2)), lw=1.2)
    box(ax, x+36, y+8, 13, 5.5, "根本能力退化", BR, C_R, 10)
    link(ax, (x+34, y+10.8), (x+30, y+8.5), C_POS)
    sg(ax, x+32, y+11.5, "+", C_POS, 12)
    link(ax, (x+39, y+5.2), (x+34, y+14.2), C_NEG, rad=-0.20)
    sg(ax, x+41, y+11, "+", C_NEG, 12)
    ax.text(x+QW/2, y+3.2, "唯一的出路：主动承受短期痛苦", ha="center", fontsize=9.5,
            color=OR, fontweight="bold")

    # ③ 意外之敌
    x, y = 2, 3
    quadrant(ax, x, y, QW, QH, "③", "意外之敌  Accidental Adversaries", "为了解决 A，把 B 激活了", PU)
    box(ax, x+11, y+17, 13, 5.5, "解决措施 A", BB, C_B, 10.5)
    box(ax, x+35, y+17, 13, 5.5, "副作用 B", BW, PU, 10.5)
    link(ax, (x+18, y+17), (x+28, y+17), C_POS)
    sg(ax, x+23, y+19.5, "+", C_POS, 12)
    box(ax, x+23, y+8, 16, 5.5, "针对 B 的解法", BW, PU, 10.5)
    link(ax, (x+32, y+14.2), (x+27, y+10.8), C_NEG, rad=-0.10)
    sg(ax, x+30, y+13.5, "+", C_NEG, 12)
    link(ax, (x+18, y+10.8), (x+16, y+14.2), C_NEG, rad=0.12)
    sg(ax, x+15, y+12.5, "-", C_NEG, 12)
    ax.text(x+QW/2, y+3.2, "解 A 越用力，B 反弹越狠", ha="center", fontsize=9.5,
            color=PU, fontweight="bold")

    # ④ 恶性竞争
    x, y = 51, 3
    quadrant(ax, x, y, QW, QH, "④", "恶性竞争  Escalation", "双方都在防御性升级，最后双输", C_R)
    box(ax, x+13, y+17, 15, 5.5, "A 采取行动", BR, C_R, 10.5)
    box(ax, x+36, y+17, 15, 5.5, "B 感到威胁", BR, C_R, 10.5)
    link(ax, (x+21, y+17), (x+28, y+17), C_POS)
    sg(ax, x+24.5, y+19.5, "+", C_POS, 12)
    box(ax, x+13, y+8, 15, 5.5, "A 升级应对", BR, C_R, 10.5)
    box(ax, x+36, y+8, 15, 5.5, "B 升级应对", BR, C_R, 10.5)
    link(ax, (x+34, y+14.2), (x+20, y+10.8), C_POS, rad=0.12)
    sg(ax, x+27, y+13.5, "+", C_POS, 12)
    link(ax, (x+20, y+10.8), (x+34, y+14.2), C_POS, rad=-0.12)
    sg(ax, x+27, y+10, "+", C_POS, 12)
    ax.text(x+QW/2, y+3.2, "破局：一方先停手，把博弈变合作", ha="center", fontsize=9.5,
            color=C_R, fontweight="bold")

    ax.text(50, 0.8, "共同点：这些结构都有自我强化的副作用回路，加力会让它更糟",
            ha="center", fontsize=11.5, fontweight="bold", color="#2D3748",
            bbox=dict(boxstyle="round,pad=0.4", fc="#EDF2F7", ec="#CBD5E0", lw=1.3))

    plt.savefig(path, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close()
    print("saved:", path)


# ════════════ 图 B：锁死/受阻组 4 基模 ════════════
def figB(path):
    fig, ax = plt.subplots(figsize=(16, 11), dpi=150)
    ax.set_xlim(0, 100); ax.set_ylim(0, 74); ax.axis("off")

    ax.text(50, 71.5, "受阻组 / 锁死组：结构本身把你困住", ha="center", fontsize=17,
            fontweight="bold", color=C_B)

    QW, QH = 47, 29

    # ⑤ 增长极限
    x, y = 2, 40
    quadrant(ax, x, y, QW, QH, "⑤", "增长极限  Limits to Growth", "不是增长不够猛，是撞上了约束", C_B)
    box(ax, x+10, y+16.5, 13, 5.5, "增长行动", BB, C_B, 10.5)
    box(ax, x+28, y+16.5, 13, 5.5, "增长成果", BB, C_B, 10.5)
    link(ax, (x+16.8, y+19), (x+21.2, y+19), C_POS)
    sg(ax, x+19, y+19, "+", C_POS, 12)
    link(ax, (x+34.8, y+19), (x+40, y+19), C_POS)
    sg(ax, x+37.5, y+19, "+", C_POS, 12)
    box(ax, x+37, y+7, 15, 5.5, "副作用 / 约束", BY, OR, 10.5)
    link(ax, (x+37, y+13.8), (x+37, y+9), C_NEG)
    sg(ax, x+39.5, y+11.5, "-", C_NEG, 12)
    link(ax, (x+34, y+9), (x+24, y+9), C_NEG, rad=0.0)
    sg(ax, x+29, y+7, "-", C_NEG, 12)
    link(ax, (x+19, y+9), (x+10, y+13.8), C_NEG, rad=0.14)
    sg(ax, x+13, y+11, "-", C_NEG, 12)
    ax.text(x+QW/2, y+3.2, "解法：解除约束，而不是加大增长", ha="center", fontsize=9.5,
            color=C_B, fontweight="bold")

    # ⑥ 目标侵蚀
    x, y = 51, 40
    quadrant(ax, x, y, QW, QH, "⑥", "目标侵蚀  Eroding Goals", "完不成就调低目标，水位悄悄下降", C_R)
    box(ax, x+13, y+16.5, 15, 5.5, "绩效与目标\n有差距", BR, C_R, 10.5)
    box(ax, x+36, y+16.5, 15, 5.5, "降低目标", BY, OR, 10.5)
    link(ax, (x+21, y+17), (x+28, y+17), C_POS)
    sg(ax, x+24.5, y+19.5, "+", C_POS, 12)
    box(ax, x+36, y+7, 15, 5.5, "期望降低\n压力减小", BY, OR, 10.5)
    link(ax, (x+40, y+13.8), (x+40, y+9), C_POS)
    sg(ax, x+42.5, y+11.5, "+", C_POS, 12)
    box(ax, x+13, y+7, 15, 5.5, "绩效继续下滑", BR, C_R, 10.5)
    link(ax, (x+28, y+9), (x+21, y+9), C_POS)
    sg(ax, x+24.5, y+7, "+", C_POS, 12)
    link(ax, (x+13, y+9), (x+13, y+13.8), C_NEG)
    sg(ax, x+15.5, y+11.5, "-", C_NEG, 12)
    ax.text(x+QW/2, y+3.2, "破局：守住目标，用绩效追上去", ha="center", fontsize=9.5,
            color=C_R, fontweight="bold")

    # ⑦ 富者愈富
    x, y = 2, 3
    quadrant(ax, x, y, QW, QH, "⑦", "富者愈富  Success to the Successful", "有限的资源流向本来就强的那个", PU)
    box(ax, x+12, y+16.5, 15, 5.5, "A 变成功", BW, PU, 10.5)
    box(ax, x+35, y+16.5, 15, 5.5, "获得更多资源", BW, PU, 10.5)
    link(ax, (x+20, y+19), (x+27, y+19), C_POS)
    sg(ax, x+23.5, y+19, "+", C_POS, 12)
    box(ax, x+12, y+7, 15, 5.5, "A 更成功", BW, PU, 10.5)
    link(ax, (x+35, y+13.8), (x+20, y+9), C_POS, rad=0.10)
    sg(ax, x+27, y+11, "+", C_POS, 12)
    box(ax, x+36, y+7, 15, 5.5, "B 资源更少", BR, C_R, 10.5)
    link(ax, (x+12, y+9), (x+12, y+13.8), C_NEG)
    sg(ax, x+14.5, y+11.5, "-", C_NEG, 12)
    link(ax, (x+28, y+9), (x+28, y+13.8), C_NEG, ls=(0,(3,2)), lw=1.2)
    ax.text(x+QW/2, y+3.2, "解法：资源分配主动均衡", ha="center", fontsize=9.5,
            color=PU, fontweight="bold")

    # ⑧ 公地悲剧
    x, y = 51, 3
    quadrant(ax, x, y, QW, QH, "⑧", "公地悲剧  Tragedy of the Commons", "每个人都理性，整体却崩溃", OR)
    box(ax, x+12, y+16.5, 16, 5.5, "各自增加使用量", BY, OR, 10.5)
    box(ax, x+36, y+16.5, 15, 5.5, "个人收益增加", BY, OR, 10.5)
    link(ax, (x+20.5, y+19), (x+28, y+19), C_POS)
    sg(ax, x+24, y+19, "+", C_POS, 12)
    box(ax, x+24, y+7, 16, 5.5, "共享资源\n被过度消耗", BR, C_R, 10.5)
    link(ax, (x+36, y+13.8), (x+30, y+9), C_POS, rad=-0.10)
    sg(ax, x+33, y+12, "+", C_POS, 12)
    link(ax, (x+16, y+9), (x+12, y+13.8), C_NEG, rad=0.12)
    sg(ax, x+11, y+11.5, "-", C_NEG, 12)
    ax.text(x+QW/2, y+3.2, "解法：建立使用规则，而不是靠自觉", ha="center", fontsize=9.5,
            color=OR, fontweight="bold")

    ax.text(50, 0.8, "共同点：结构决定了你能做什么，个人的努力只在结构内起作用",
            ha="center", fontsize=11.5, fontweight="bold", color="#2D3748",
            bbox=dict(boxstyle="round,pad=0.4", fc="#EDF2F7", ec="#CBD5E0", lw=1.3))

    plt.savefig(path, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close()
    print("saved:", path)


if __name__ == "__main__":
    base = "/workspace/blog/src/images/"
    figA(base + "sys-archetypes-uncontrolled.png")
    figB(base + "sys-archetypes-locked.png")
