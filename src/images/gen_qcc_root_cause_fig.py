#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 QCC 真因判定图：六种方法 + 两条判据。

输出位置：src/.vuepress/public/images/（public 目录才会进 dist，src/images 下未被引用的图会 404）
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from matplotlib import font_manager

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

C_1 = "#2f6fb3"   # 找候选
C_2 = "#c8871b"   # 验真假
C_3 = "#2e8b6f"   # 定根因
C_RED = "#c0473c"

W, H = 136.0, 76.0

fig, ax = plt.subplots(figsize=(13.6, 7.6), dpi=170)
ax.set_xlim(0, W)
ax.set_ylim(0, H)
ax.axis("off")
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
fig.subplots_adjust(left=0.004, right=0.996, top=0.996, bottom=0.004)

# ══════════════ 标题 ══════════════
ax.text(5, 70.4, "真因怎么判定：六种方法 + 两条判据", ha="left", va="center",
        fontsize=22, color=INK, fontweight="bold")
ax.text(5, 65.2, "分析原因容易，确认它才是根因难 —— 绝大多数改进做不下去，是主因选错了却当成对的往下做",
        ha="left", va="center", fontsize=11.4, color=MUTED)
ax.plot([5, 131.5], [61.8, 61.8], color=LINE, linewidth=1.1)

# ══════════════ 三段流水线 ══════════════
PY, PH = 17.6, 39.4

STAGES = [
    (5.0, 36.0, "① 找候选", "解决「有没有漏」", C_1, [
        ("5W1H 提问法", "连问五个为什么，把表层问题往下挖"),
        ("鱼骨图分析", "系统性列出可能原因，不遗漏分支"),
    ], "产出的是「可能的原因」，还不是「原因」"),
    (47.0, 42.0, "② 验真假", "解决「哪个是真的」", C_2, [
        ("数据验证法", "数据对比 · 趋势分析 · 相关性分析"),
        ("假设检验法", "先设定假设，再拿数据去验"),
        ("排除法", "逐一排除不成立的原因"),
        ("逻辑推理法", "判断因果关系是否合理"),
    ], "四把刀一起上，单靠一把都不够"),
    (95.0, 36.0, "③ 定根因", "解决「凭什么认定」", C_3, [
        ("判别标准", "定量验证，高于标准为根因，低于标准不是"),
        ("贡献程度", "对改进目标贡献大者，才是真的根因"),
    ], "过了这两条线，才敢写进对策表"),
]

for x, cw, title, sub, color, items, footer in STAGES:
    ax.add_patch(FancyBboxPatch(
        (x, PY), cw, PH,
        boxstyle="round,pad=0,rounding_size=1.7",
        linewidth=1.8, edgecolor=color, facecolor=color + "07"))
    ax.add_patch(FancyBboxPatch(
        (x, PY + PH - 7.2), cw, 7.2,
        boxstyle="round,pad=0,rounding_size=1.7",
        linewidth=0, facecolor=color))
    ax.text(x + 2.4, PY + PH - 2.8, title, ha="left", va="center",
            fontsize=13.0, color="white", fontweight="bold")
    ax.text(x + 2.4, PY + PH - 5.4, sub, ha="left", va="center",
            fontsize=8.8, color="white", alpha=0.88)

    yy = PY + PH - 11.6
    gap = 6.4 if len(items) <= 2 else 5.7
    for k, v in items:
        tw = 1.18 * len(k) + 1.9          # 标签宽度随文字自适应
        ax.add_patch(FancyBboxPatch(
            (x + 2.2, yy - 1.6), tw, 3.2,
            boxstyle="round,pad=0,rounding_size=0.9",
            linewidth=0, facecolor=color))
        ax.text(x + 2.2 + tw / 2, yy, k, ha="center", va="center",
                fontsize=9.2, color="white", fontweight="bold")
        ax.text(x + 2.2 + tw + 1.2, yy, v, ha="left", va="center",
                fontsize=8.4, color=INK)
        yy -= gap

    # 卡片底部小结
    ax.text(x + 2.4, PY + 3.0, footer, ha="left", va="center",
            fontsize=8.2, color=color, alpha=0.95, style="italic")

# 阶段箭头
for a1, a2, lab in [(41.6, 46.4, "候选"), (89.6, 94.4, "筛过")]:
    ax.annotate("", xy=(a2, PY + PH - 3.6), xytext=(a1, PY + PH - 3.6),
                arrowprops=dict(arrowstyle="-|>", mutation_scale=11,
                                linewidth=1.6, color=MUTED))
    ax.text((a1 + a2) / 2, PY + PH - 7.6, lab, ha="center", va="center",
            fontsize=8.0, color=MUTED)

# ══════════════ 底部 ══════════════
BY, BH = 2.6, 13.4
ax.add_patch(FancyBboxPatch(
    (5, BY), 126.5, BH,
    boxstyle="round,pad=0,rounding_size=1.7",
    linewidth=1.8, edgecolor=C_RED, facecolor=C_RED + "08"))
ax.add_patch(FancyBboxPatch(
    (5, BY + BH - 4.6), 126.5, 4.6,
    boxstyle="round,pad=0,rounding_size=1.7",
    linewidth=0, facecolor=C_RED))
ax.text(7.0, BY + BH - 2.3, "为什么必须是定量：相关不等于因果",
        ha="left", va="center", fontsize=11.0, color="white", fontweight="bold")

causes = ["A 导致 B", "B 导致 A", "C 同时导致 A 和 B", "纯属巧合"]
tx, cw2 = 7.0, 16.6
for c in causes:
    ax.add_patch(FancyBboxPatch(
        (tx, BY + 1.5), cw2, 4.0,
        boxstyle="round,pad=0,rounding_size=0.9",
        linewidth=1.2, edgecolor=C_RED, facecolor=C_RED + "12"))
    ax.text(tx + cw2 / 2, BY + 3.5, c, ha="center", va="center",
            fontsize=8.6, color=C_RED, fontweight="bold")
    tx += cw2 + 1.2

ax.text(81.5, BY + 3.9,
        "讨论和经验分不出这四种 —— 只有数据能分",
        ha="left", va="center", fontsize=9.0, color=INK, fontweight="bold")
ax.text(81.5, BY + 1.2,
        "逻辑推理能排除明显不合理的，但排不掉「看起来都通」的那一个",
        ha="left", va="center", fontsize=8.0, color=MUTED)

fig.savefig("/workspace/blog/src/.vuepress/public/images/qcc-root-cause.png",
            dpi=170, facecolor=BG)
print("→ src/.vuepress/public/images/qcc-root-cause.png")
