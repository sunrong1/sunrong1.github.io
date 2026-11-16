#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""QCC 工作的质量保证图：三现（现场/现物/现实）+ 两个原则 + 准则五条基本原则。

输出：src/.vuepress/public/images/qcc-quality-assurance.png
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
BLUE, GREEN, AMBER, PURPLE, RED, TEAL = "#2f6fb3", "#2e8b6f", "#c8871b", "#6b5ba8", "#c0473c", "#1f7a8c"

W, H = 136.0, 76.0
fig, ax = plt.subplots(figsize=(13.6, 7.6), dpi=170)
ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis("off")
fig.patch.set_facecolor(BG); ax.set_facecolor(BG)
fig.subplots_adjust(left=0.004, right=0.996, top=0.996, bottom=0.004)

ax.text(5, 70.4, "QCC 工作的质量保证：三现 + 两个原则", ha="left", va="center",
        fontsize=22, color=INK, fontweight="bold")
ax.text(5, 65.2, "三现管「怎么拿到真事实」，两个原则管「拿到之后怎么办」 —— 违反了哪个，成果都会失真",
        ha="left", va="center", fontsize=11.2, color=MUTED)
ax.plot([5, 131.5], [61.6, 61.6], color=LINE, linewidth=1.1)

# ═══════════ 上层：三现 ═══════════
ax.text(5, 58.0, "一、三现原则 —— 现状调查怎么取得事实", ha="left", va="center",
        fontsize=11.6, color=INK, fontweight="bold")

GENBA = [
    (5.0, "现场", "Gemba", "到现场", "到问题发生的地方去\n会议室里讨论不出现场问题", BLUE),
    (48.0, "现物", "Genbutsu", "用眼睛看", "看问题涉及的具体实物\n不良品长什么样，坏在哪", TEAL),
    (91.0, "现实", "Genjitsu", "用手操作处理", "基于事实和数据做判断\n测出来的，不是听说的", GREEN),
]
for x, cn, jp, act, desc, c in GENBA:
    ax.add_patch(FancyBboxPatch((x, 39.0), 40.0, 16.0,
                 boxstyle="round,pad=0,rounding_size=1.6",
                 linewidth=1.8, edgecolor=c, facecolor=c + "08"))
    ax.add_patch(FancyBboxPatch((x, 48.6), 40.0, 6.4,
                 boxstyle="round,pad=0,rounding_size=1.6",
                 linewidth=0, facecolor=c))
    ax.text(x + 2.4, 51.8, f"{cn} · {jp}", ha="left", va="center",
            fontsize=11.6, color="white", fontweight="bold")
    ax.text(x + 2.4, 45.6, act, ha="left", va="center",
            fontsize=10.2, color=c, fontweight="bold")
    ax.text(x + 2.4, 41.2, desc, ha="left", va="center",
            fontsize=8.2, color=INK, linespacing=1.6)

for x1, x2 in [(45.6, 47.4), (88.6, 90.4)]:
    ax.add_patch(FancyArrowPatch((x1, 47.0), (x2, 47.0),
                 arrowstyle="-|>", mutation_scale=12, linewidth=1.6, color=MUTED))

ax.text(131.5, 36.0, "现场有神灵，答案永远在现场", ha="right", va="center",
        fontsize=8.6, color=MUTED, style="italic")

# ═══════════ 中层：两个原则 ═══════════
ax.text(5, 31.0, "二、两个原则 —— 拿到事实之后怎么用", ha="left", va="center",
        fontsize=11.6, color=INK, fontweight="bold")

PRIN = [
    (5.0, 62.0, "原则一：用数据、科学的工具进行逻辑分析",
     "准则 d) 基于客观事实与数据 —— 基于客观事实与数据进行调查、分析、评价与决策",
     "准则 e) 应用统计方法 —— 适宜、正确地应用统计方法，整理、分析、验证并作出结论",
     "→ 相关不等于因果，必须靠定量验证落锤", AMBER),
    (70.0, 61.5, "原则二：遵循既定的规则和顺序",
     "准则 c) 遵循 PDCA 循环 —— 策划 P / 实施 D / 检查 C / 处置 A",
     "程序不是束缚，是防止漏步和走过场的护栏",
     "→ 跳过现状调查和巩固措施，成果必然反弹", PURPLE),
]
for x, w, t, l1, l2, tail, c in PRIN:
    ax.add_patch(FancyBboxPatch((x, 16.5), w, 13.0,
                 boxstyle="round,pad=0,rounding_size=1.6",
                 linewidth=1.8, edgecolor=c, facecolor=c + "08"))
    ax.add_patch(FancyBboxPatch((x, 26.0), w, 3.5,
                 boxstyle="round,pad=0,rounding_size=1.6",
                 linewidth=0, facecolor=c))
    ax.text(x + 2.4, 27.75, t, ha="left", va="center",
            fontsize=10.4, color="white", fontweight="bold")
    ax.text(x + 2.4, 22.8, l1, ha="left", va="center",
            fontsize=8.1, color=INK)
    ax.text(x + 2.4, 20.0, l2, ha="left", va="center",
            fontsize=8.1, color=INK)
    ax.text(x + 2.4, 17.6, tail, ha="left", va="center",
            fontsize=8.2, color=c, fontweight="bold")

# ═══════════ 底部：五条基本原则 ═══════════
BY, BH = 3.0, 11.0
ax.add_patch(FancyBboxPatch((5, BY), 126.5, BH,
             boxstyle="round,pad=0,rounding_size=1.6",
             linewidth=1.8, edgecolor=BLUE, facecolor=BLUE + "06"))
ax.text(7.0, BY + BH - 2.4, "准则 0.2 —— 质量管理小组活动的五条基本原则",
        ha="left", va="center", fontsize=9.8, color=BLUE, fontweight="bold")

FIVE = ["全员参与", "持续改进和创新", "遵循 PDCA 循环", "基于客观事实与数据", "应用统计方法"]
fx = 7.0
for i, t in enumerate(FIVE):
    w = 23.4
    c = [BLUE, GREEN, PURPLE, AMBER, TEAL][i]
    ax.add_patch(FancyBboxPatch((fx, BY + 1.2), w, 4.4,
                 boxstyle="round,pad=0,rounding_size=0.9",
                 linewidth=1.3, edgecolor=c, facecolor=c + "14"))
    ax.text(fx + w / 2, BY + 3.4, t, ha="center", va="center",
            fontsize=8.8, color=c, fontweight="bold")
    fx += w + 1.2

fig.savefig("/workspace/blog/src/.vuepress/public/images/qcc-quality-assurance.png",
            dpi=170, facecolor=BG)
print("→ qcc-quality-assurance.png")
