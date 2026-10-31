#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 QCC 巩固措施图：三层九件事。

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

C_STD = "#2f6fb3"
C_EXE = "#2e8b6f"
C_MGT = "#6a5aa8"
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
ax.text(5, 70.4, "成果怎么不反弹：三层九件事", ha="left", va="center",
        fontsize=23, color=INK, fontweight="bold")
ax.text(5, 65.4, "改进做完只是一半 —— 另一半全在巩固，而巩固失败的概率比改进本身还高",
        ha="left", va="center", fontsize=11.8, color=MUTED)
ax.plot([5, 131.5], [61.8, 61.8], color=LINE, linewidth=1.1)

# ══════════════ 三列 ══════════════
COLS = [
    (5.0, "一、标准", "标准本身写清楚", C_STD, [
        ("清晰", "让人一眼看懂，不靠口头传承"),
        ("实用", "解决真问题，不是为了有标准而写"),
        ("可执行", "现场的人照着就能做，不用回头问专家"),
    ]),
    (47.7, "二、执行", "标准落到人的行为上", C_EXE, [
        ("培训", "不是发下文件就完，是让人练一遍"),
        ("监督", "要有检查机制，不能靠自觉"),
        ("反馈", "执行中发现的问题要能回来"),
    ]),
    (90.4, "三、管理", "让标准长期有效", C_MGT, [
        ("机制", "把标准挂进流程，不是挂进抽屉"),
        ("考核", "不考核就等于没有"),
        ("持续改进", "标准本身也要迭代，不是写完就定型"),
    ]),
]

PY, PH = 28.0, 30.0

for x, title, sub, color, items in COLS:
    cw = 40.6
    ax.add_patch(FancyBboxPatch(
        (x, PY), cw, PH,
        boxstyle="round,pad=0,rounding_size=1.7",
        linewidth=1.8, edgecolor=color, facecolor=color + "07"))
    ax.add_patch(FancyBboxPatch(
        (x, PY + PH - 7.4), cw, 7.4,
        boxstyle="round,pad=0,rounding_size=1.7",
        linewidth=0, facecolor=color))
    ax.text(x + 2.4, PY + PH - 2.8, title, ha="left", va="center",
            fontsize=13.0, color="white", fontweight="bold")
    ax.text(x + 2.4, PY + PH - 5.6, sub, ha="left", va="center",
            fontsize=9.0, color="white", alpha=0.88)

    yy = PY + PH - 11.0
    for k, v in items:
        # 左侧色块标关键词
        ax.add_patch(FancyBboxPatch(
            (x + 2.2, yy - 1.75), 8.2, 3.5,
            boxstyle="round,pad=0,rounding_size=0.9",
            linewidth=0, facecolor=color))
        ax.text(x + 6.3, yy, k, ha="center", va="center",
                fontsize=9.6, color="white", fontweight="bold")
        ax.text(x + 11.6, yy, v, ha="left", va="center",
                fontsize=8.8, color=INK)
        yy -= 6.6

    # 失效点
    ax.text(x + 2.2, PY + 2.6, "缺这一层 →", ha="left", va="center",
            fontsize=8.4, color=color, fontweight="bold")
    ax.text(x + 11.6, PY + 2.6,
            {"一、标准": "照着做还是做不对",
             "二、执行": "文件在抽屉，行为没变",
             "三、管理": "一忙就退回老路，改进反弹"}[title],
            ha="left", va="center", fontsize=8.4, color=MUTED)

# ══════════════ 底部 ══════════════
BY, BH = 4.5, 13.5
ax.add_patch(FancyBboxPatch(
    (5, BY), 126.5, BH,
    boxstyle="round,pad=0,rounding_size=1.7",
    linewidth=1.8, edgecolor=C_RED, facecolor=C_RED + "08"))
ax.add_patch(FancyBboxPatch(
    (5, BY + BH - 4.8), 126.5, 4.8,
    boxstyle="round,pad=0,rounding_size=1.7",
    linewidth=0, facecolor=C_RED))
ax.text(7.0, BY + BH - 2.4, "巩固措施最常见的死法：三层各断一截",
        ha="left", va="center", fontsize=11.4, color="white", fontweight="bold")
ax.text(7.0, BY + 4.6,
        "标准写完了就以为完事了 —— 标准进了抽屉、执行靠自觉、考核不挂钩",
        ha="left", va="center", fontsize=9.4, color=INK)
ax.text(7.0, BY + 1.8,
        "改进照样反弹，而且反弹得更隐蔽：数据会好看一段时间，然后慢慢回去 —— 没人说得清是哪一步松的",
        ha="left", va="center", fontsize=9.4, color=C_RED, fontweight="bold")

fig.savefig("/workspace/blog/src/.vuepress/public/images/qcc-consolidation.png",
            dpi=170, facecolor=BG)
print("→ src/.vuepress/public/images/qcc-consolidation.png")
