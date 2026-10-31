#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 QCC 选题决策图：组圈前的三关判断。

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

C_A = "#2f6fb3"   # 复杂性
C_B = "#c8871b"   # 影响力
C_C = "#2e8b6f"   # 能力匹配
C_RED = "#c0473c"
C_GREY = "#8a97a5"

W, H = 136.0, 88.0

fig, ax = plt.subplots(figsize=(13.6, 8.8), dpi=170)
ax.set_xlim(0, W)
ax.set_ylim(0, H)
ax.axis("off")
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
fig.subplots_adjust(left=0.004, right=0.996, top=0.996, bottom=0.004)

# ══════════════ 标题 ══════════════
ax.text(5, 82.6, "组圈前的三关判断", ha="left", va="center",
        fontsize=23, color=INK, fontweight="bold")
ax.text(5, 77.6, "个人能改的就别组圈 —— 判断该不该组圈，比组圈本身更值得练",
        ha="left", va="center", fontsize=11.8, color=MUTED)
ax.plot([5, 131.5], [74.2, 74.2], color=LINE, linewidth=1.1)

# ══════════════ 三关 ══════════════
GATES = [
    (5.0, 40.6, "第一关", "问题的复杂性与范围", C_A, [
        ("① 是否涉及多个部门或岗位？",
         ["需要跨部门协作、涉及多个流程或岗位，",
          "个人或小团队难以独立完成 → 圈能整合资源、统一目标"]),
        ("② 问题是否具有系统性？",
         ["不是孤立点，而是系统性、结构性的",
          "（流程设计 / 设备配置 / 管理机制）",
          "→ 圈的系统分析方法更有效"]),
    ]),
    (48.5, 40.6, "第二关", "问题的影响力", C_B, [
        ("③ 是否对组织目标有较大影响？",
         ["能显著提升效率、降低成本、改善质量",
          "或增强客户满意度 → 值得投入更多资源"]),
        ("④ 是否具有长期价值？",
         ["带来持续改进成果，而非短期「修补」",
          "→ 用圈推动标准化、制度化，避免反复出现"]),
    ]),
    (92.0, 39.5, "第三关", "资源与能力的匹配", C_C, [
        ("⑤ 是否需要专业技能或知识？",
         ["需要专业知识、数据分析能力或特定工具",
          "（PDCA / 5W1H / 鱼骨图）",
          "→ 圈能汇聚不同专业背景的成员"]),
        ("⑥ 是否需要团队协作？",
         ["需要多角度思考、多方面推动，个人覆盖不到",
          "→ 圈组协作激发团队智慧，形成合力"]),
    ]),
]

PY, PH = 22.0, 48.0

for x, cw, tag_, title, color, items in GATES:
    ax.add_patch(FancyBboxPatch(
        (x, PY), cw, PH,
        boxstyle="round,pad=0,rounding_size=1.6",
        linewidth=1.8, edgecolor=color, facecolor=color + "07"))
    ax.add_patch(FancyBboxPatch(
        (x, PY + PH - 7.0), cw, 7.0,
        boxstyle="round,pad=0,rounding_size=1.6",
        linewidth=0, facecolor=color))
    ax.text(x + 2.2, PY + PH - 2.6, tag_, ha="left", va="center",
            fontsize=9.4, color="white", alpha=0.85)
    ax.text(x + 2.2, PY + PH - 5.2, title, ha="left", va="center",
            fontsize=12.4, color="white", fontweight="bold")

    yy = PY + PH - 10.4
    for head, lines in items:
        ax.add_patch(FancyBboxPatch(
            (x + 2.0, yy - 0.75), 1.05, 1.05,
            boxstyle="round,pad=0,rounding_size=0.5",
            linewidth=0, facecolor=color))
        ax.text(x + 4.1, yy, head, ha="left", va="center",
                fontsize=9.3, color=color, fontweight="bold")
        yy -= 2.9
        for ln in lines:
            ax.text(x + 4.1, yy, ln, ha="left", va="center",
                    fontsize=8.5, color=INK if ln.startswith("→") else MUTED)
            yy -= 2.35
        yy -= 2.2

# ══════════════ 底部：三个出口 ══════════════
BY, BH = 4.0, 14.0
ax.add_patch(FancyBboxPatch(
    (5, BY), 126.5, BH,
    boxstyle="round,pad=0,rounding_size=1.6",
    linewidth=1.8, edgecolor=C_GREY, facecolor=C_GREY + "08"))
ax.add_patch(FancyBboxPatch(
    (5, BY + BH - 4.8), 126.5, 4.8,
    boxstyle="round,pad=0,rounding_size=1.6",
    linewidth=0, facecolor=C_GREY))
ax.text(7.0, BY + BH - 2.4, "三关过完，只有三种结局",
        ha="left", va="center", fontsize=11.2, color="white", fontweight="bold")

outs = [
    ("组圈做", "三关基本都过：复杂、有影响、且需要协作与专业",
     "开圈。注意课题要小 —— 「小实活新」的「小」是硬约束", C_A),
    ("自己改", "三关基本不过：一个人就能改透，影响也有限",
     "别开圈。组圈的成本远高于收益，还欠一份成果报告", C_GREY),
    ("只做第一关", "复杂且有长期价值，但缺专业能力或协作基础",
     "先把能力和协作搭起来，再组圈；组建程序选「上下结合」", C_C),
]
tx = 7.0
for k, when, act, color in outs:
    w = 40.0
    ax.add_patch(FancyBboxPatch(
        (tx, BY + 1.4), w, 7.0,
        boxstyle="round,pad=0,rounding_size=1.2",
        linewidth=1.5, edgecolor=color, facecolor=color + "12"))
    ax.text(tx + 1.8, BY + 6.7, k, ha="left", va="center",
            fontsize=10.2, color=color, fontweight="bold")
    ax.text(tx + 1.8, BY + 4.6, when, ha="left", va="center",
            fontsize=8.2, color=INK)
    ax.text(tx + 1.8, BY + 2.5, act, ha="left", va="center",
            fontsize=8.2, color=MUTED)
    tx += w + 1.2

fig.savefig("/workspace/blog/src/.vuepress/public/images/qcc-topic-decision.png",
            dpi=170, facecolor=BG)
print("→ src/.vuepress/public/images/qcc-topic-decision.png")
