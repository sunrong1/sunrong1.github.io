#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 QCC 流程图：PDCA 十步 × 工具 × 产出 × 常见坑。

主图（qcc-cheatsheet.png）给全局，这张给可执行细节：
每一步用什么工具、产出什么、最容易在哪翻车。
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
ZEBRA = "#f6f8fa"

C_P   = "#2f6fb3"
C_D   = "#2e8b6f"
C_C   = "#c8871b"
C_A   = "#6a5aa8"
C_RED = "#c0473c"

W, H = 136.0, 88.0

fig, ax = plt.subplots(figsize=(13.6, 8.8), dpi=170)
ax.set_xlim(0, W)
ax.set_ylim(0, H)
ax.axis("off")
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
fig.subplots_adjust(left=0.004, right=0.996, top=0.996, bottom=0.004)

# ───────────────────────── 标题 ─────────────────────────
ax.text(5, 84.6, "PDCA 十步 × 工具映射", ha="left", va="center",
        fontsize=22, color=INK, fontweight="bold")
ax.text(5, 80.4, "每一步用什么工具 · 产出什么 · 最容易在哪翻车",
        ha="left", va="center", fontsize=11.4, color=MUTED)

# ───────────────────────── 表头 ─────────────────────────
COLS = [(16.0, "步骤"), (40.0, "工具"), (70.0, "产出物"), (103.0, "常见坑")]
for cx, name in COLS:
    ax.text(cx, 76.6, name, ha="left", va="center",
            fontsize=10.6, color=INK, fontweight="bold")
ax.plot([5, 131.5], [74.6, 74.6], color=LINE, linewidth=1.2)

ROWS = [
    ("①", "选题",     "选题表 · 头脑风暴", "课题名称 + 选定理由", "宜小不宜大；名称含对象/问题/结果", C_P),
    ("②", "现状调查", "检查表 · 层别法",   "基准值（用数据说话）", "只登记不分析，漏掉分层线索", C_P),
    ("③", "设定目标", "基准/目标/挑战",    "目标值 + 达成期限",   "太低没意义，太高久攻不克", C_P),
    ("④", "原因分析", "鱼骨图 5M1E · 关联图", "末端原因清单",     "不少于两层；原因不用中性词", C_P),
    ("⑤", "确定主因", "要因确认表",        "2~4 条主要原因",     "不能凭经验拍板，要逐条验证", C_P),
    ("⑥", "制定对策", "5W1H 对策表",       "对策表（人/时/检查人）", "措施要具体到动作，不能写“加强”", C_P),
    ("⑦", "对策实施", "甘特图 · 检查表",   "实施过程记录",       "没有过程记录，评审会被打回", C_D),
    ("⑧", "效果确认", "柏拉图 · 控制图",   "实施前后对比数据",   "只报有利数据，等于没确认", C_C),
    ("⑨", "巩固措施", "标准 · 作业文件",   "纳入标准的文件",     "不纳入标准，成果一定反弹", C_A),
    ("⑩", "总结下一步", "成果报告",        "成果报告 + 下轮课题", "只做成 PPT，没有沉淀", C_A),
]

ROW_H = 6.2
Y0 = 71.4
ys = []
for i, (num, name, tool, out, pit, pc) in enumerate(ROWS):
    yc = Y0 - i * ROW_H
    ys.append(yc)
    if i % 2 == 0:
        ax.add_patch(FancyBboxPatch(
            (5, yc - ROW_H / 2), 126.5, ROW_H,
            boxstyle="square,pad=0", linewidth=0, facecolor=ZEBRA))

# 左侧阶段带
band_x, band_w = 5.0, 8.4
for idx0, idx1, phase, color in [(0, 5, "P", C_P), (6, 6, "D", C_D),
                                 (7, 7, "C", C_C), (8, 9, "A", C_A)]:
    top = ys[idx0] + ROW_H / 2 - 0.5
    bot = ys[idx1] - ROW_H / 2 + 0.5
    ax.add_patch(FancyBboxPatch(
        (band_x, bot), band_w, top - bot,
        boxstyle="round,pad=0,rounding_size=1.2",
        linewidth=0, facecolor=color))
    ax.text(band_x + band_w / 2, (top + bot) / 2, phase,
            ha="center", va="center", fontsize=15, color="white",
            fontweight="bold")

# 行内容
for i, (num, name, tool, out, pit, pc) in enumerate(ROWS):
    yc = ys[i]
    # 序号圆
    ax.add_patch(FancyBboxPatch(
        (16.0, yc - 1.15), 2.3, 2.3,
        boxstyle="round,pad=0,rounding_size=1.15",
        linewidth=0, facecolor=pc))
    ax.text(17.15, yc, num, ha="center", va="center",
            fontsize=8.8, color="white", fontweight="bold")
    ax.text(19.4, yc, name, ha="left", va="center",
            fontsize=10.6, color=pc, fontweight="bold")
    ax.text(40.0, yc, tool, ha="left", va="center",
            fontsize=9.2, color=INK)
    ax.text(70.0, yc, out, ha="left", va="center",
            fontsize=9.2, color=INK)
    ax.text(103.0, yc, pit, ha="left", va="center",
            fontsize=8.8, color=C_RED)

ax.plot([5, 131.5], [ys[-1] - ROW_H / 2, ys[-1] - ROW_H / 2], color=LINE, linewidth=1.2)

# ───────────────────────── 底部提示 ─────────────────────────
row_bot = ys[-1] - ROW_H / 2
box_top = row_bot - 1.2
box_h = 7.8
ax.add_patch(FancyBboxPatch(
    (5, box_top - box_h), 126.5, box_h,
    boxstyle="round,pad=0,rounding_size=1.6",
    linewidth=1.6, edgecolor=C_P, facecolor=C_P + "08"))
ax.text(7.0, box_top - 2.5,
        "最容易被跳过的两个环节：② 现状调查（没有基准值，目标就是拍脑袋）· ⑨ 巩固措施（不写进标准，成果必然反弹）",
        ha="left", va="center", fontsize=9.3, color=INK)
ax.text(7.0, box_top - 5.3,
        "评审重点查两件事：数据有没有捏造 · 是不是组长一个人包办",
        ha="left", va="center", fontsize=9.3, color=C_RED, fontweight="bold")

fig.savefig("/workspace/blog/src/images/qcc-pdca-10steps.png", dpi=170, facecolor=BG)
print("→ /workspace/blog/src/images/qcc-pdca-10steps.png")
