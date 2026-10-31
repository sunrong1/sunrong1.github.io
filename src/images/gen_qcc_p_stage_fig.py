#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""输出位置：src/.vuepress/public/images/（public 目录才会进 dist，src/images 下未被引用的图会 404）

生成 QCC 流程图：P 阶段深挖（选题 → 现状 → 目标 → 析因 → 主因 → 对策）。

把 QCC 的 P 阶段六步拆开，每一步给「怎么做」与「主用工具」，
底部标三阶段评审（主题 / 对策 / 成功）。
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

C_P   = "#2f6fb3"
C_RED = "#c0473c"
C_GRN = "#2e8b6f"

W, H = 136.0, 76.0

fig, ax = plt.subplots(figsize=(13.6, 7.6), dpi=170)
ax.set_xlim(0, W)
ax.set_ylim(0, H)
ax.axis("off")
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
fig.subplots_adjust(left=0.004, right=0.996, top=0.996, bottom=0.004)

# ═══════════════ 标题 ═══════════════
ax.text(5, 70.4, "P 阶段深挖：从选题到对策的六步", ha="left", va="center",
        fontsize=22, color=INK, fontweight="bold")
ax.text(5, 65.4, "问题解决型的核心 —— 选错型、走错步，后面全是白干",
        ha="left", va="center", fontsize=11.6, color=MUTED)
ax.plot([5, 131.5], [61.8, 61.8], color=LINE, linewidth=1.1)

# ═══════════════ 六列 ═══════════════
COLS = [
    ("①", "选择课题", C_P, [
        "头脑风暴出候选课题",
        "有意义：重要性 · 紧急性",
        "可管理：可行性 · 工作量",
        "SIPOC 界定范围、挤掉水分",
        "动宾结构命名，不写口号",
    ], "工具：头脑风暴 · SIPOC"),
    ("②", "把握现状", C_P, [
        "找出问题的症结",
        "业务现状：柏拉图 · 因果矩阵",
        "能力现状：雷达图（成员与活动）",
        "只基于事实和数据说话",
    ], "工具：柏拉图 · 因果矩阵 · 雷达图"),
    ("③", "设定目标", C_P, [
        "目标要 SMART、要有依据",
        "一般只设 1~2 个目标",
        "数据采样：控制图 · 直方图",
        "整体检验：均值（趋中）/ 中位数",
    ], "工具：控制图 · 直方图 · 整体检验"),
    ("④", "原因分析", C_P, [
        "所有可能原因尽量找全",
        "鱼骨图 —— 单一问题",
        "系统图 —— 原因之间无交叉",
        "关联图 —— 原因缠绕 · 多问题",
        "辅助：头脑风暴 · 5W",
    ], "工具：鱼骨图 · 系统图 · 关联图"),
    ("⑤", "确定主因", C_P, [
        "专家识别法 · 30 分打分法",
        "RPN = 严重度 × 发生频度",
        "× 可探测度（1~10 各一项）",
        "根因验证：客观事实 + 客观数据",
        "看影响程度与变化程度",
    ], "工具：RPN（严重度 / 频度 / 可探测度）"),
    ("⑥", "拟定对策", C_P, [
        "针对每条主因逐条制定",
        "5W1H 对策表",
        "措施要能落到人和时间",
    ], "工具：5W1H 对策拟定表"),
]

X0, CW, GAP = 5.0, 20.9, 0.8
TOP, CH = 58.6, 32.6

for i, (num, name, color, points, tools) in enumerate(COLS):
    x = X0 + i * (CW + GAP)
    # 卡
    ax.add_patch(FancyBboxPatch(
        (x, TOP - CH), CW, CH,
        boxstyle="round,pad=0,rounding_size=1.6",
        linewidth=1.6, edgecolor=color, facecolor=color + "07"))
    # 序号 + 名称
    ax.add_patch(FancyBboxPatch(
        (x, TOP - 6.2), CW, 6.2,
        boxstyle="round,pad=0,rounding_size=1.6",
        linewidth=0, facecolor=color))
    ax.add_patch(FancyBboxPatch(
        (x + 1.3, TOP - 5.1), 3.6, 3.6,
        boxstyle="round,pad=0,rounding_size=1.8",
        linewidth=0, facecolor="white"))
    ax.text(x + 3.1, TOP - 3.3, num, ha="center", va="center",
            fontsize=10.5, color=color, fontweight="bold")
    ax.text(x + 6.0, TOP - 3.1, name, ha="left", va="center",
            fontsize=11.4, color="white", fontweight="bold")

    # 要点
    yy = TOP - 9.4
    for pt in points:
        ax.add_patch(FancyBboxPatch(
            (x + 1.5, yy - 0.62), 0.8, 0.8,
            boxstyle="round,pad=0,rounding_size=0.4",
            linewidth=0, facecolor=color))
        ax.text(x + 3.1, yy, pt, ha="left", va="center",
                fontsize=8.6, color=INK)
        yy -= 3.5

    # 工具条
    ty = TOP - CH + 5.6
    ax.plot([x + 1.5, x + CW - 1.5], [ty + 2.2, ty + 2.2], color=LINE, linewidth=0.9)
    ax.text(x + 1.5, ty, tools, ha="left", va="center",
            fontsize=8.0, color=MUTED)

    # 列间箭头
    if i < len(COLS) - 1:
        ax.annotate("", xy=(x + CW + GAP - 0.1, TOP - 3.1),
                    xytext=(x + CW + 0.1, TOP - 3.1),
                    arrowprops=dict(arrowstyle="-|>", mutation_scale=9,
                                    linewidth=1.2, color=C_P))

# ═══════════════ 底部：三阶段评审 ═══════════════
BY, BH = 4.5, 13.5
ax.add_patch(FancyBboxPatch(
    (5, BY), 126.5, BH,
    boxstyle="round,pad=0,rounding_size=1.6",
    linewidth=1.7, edgecolor=C_GRN, facecolor=C_GRN + "08"))
ax.add_patch(FancyBboxPatch(
    (5, BY + BH - 4.6), 126.5, 4.6,
    boxstyle="round,pad=0,rounding_size=1.6",
    linewidth=0, facecolor=C_GRN))
ax.text(7.0, BY + BH - 2.3, "三阶段评审（不是最后评一次，而是评三次）",
        ha="left", va="center", fontsize=11.2, color="white", fontweight="bold")

stages = [
    ("主题评审", "选题阶段", "课题选得对不对、范围清不清"),
    ("对策评审", "对策出来时", "措施能不能落地、5W1H 全不全"),
    ("成功评审", "成果固化后", "效果是否达标、措施能否标准化"),
]
tx = 7.0
for i, (k, when, what) in enumerate(stages):
    w = 40.0
    ax.add_patch(FancyBboxPatch(
        (tx, BY + 1.6), w, 4.8,
        boxstyle="round,pad=0,rounding_size=1.0",
        linewidth=1.3, edgecolor=C_GRN, facecolor=C_GRN + "14"))
    ax.text(tx + 1.6, BY + 4.9, k, ha="left", va="center",
            fontsize=9.6, color=INK, fontweight="bold")
    ax.text(tx + 13.0, BY + 4.9, when, ha="left", va="center",
            fontsize=8.4, color=C_GRN)
    ax.text(tx + 1.6, BY + 2.9, what, ha="left", va="center",
            fontsize=8.4, color=MUTED)
    if i < 2:
        ax.annotate("", xy=(tx + w + 0.8, BY + 4.0),
                    xytext=(tx + w + 0.1, BY + 4.0),
                    arrowprops=dict(arrowstyle="-|>", mutation_scale=8,
                                    linewidth=1.0, color=C_GRN))
    tx += w + 1.2

fig.savefig("/workspace/blog/src/.vuepress/public/images/qcc-p-stage-deep.png", dpi=170, facecolor=BG)
print("→ /workspace/blog/src/.vuepress/public/images/qcc-p-stage-deep.png")
