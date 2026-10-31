#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""QCC 工具全景图：QC 七大工具 + 进阶手法 + 两个骨架 + 按用途选型。

输出：src/.vuepress/public/images/qcc-tools-panorama.png
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

INK, MUTED, LINE, BG = "#1f2933", "#6b7785", "#d4dae1", "#ffffff"
BLUE, GREEN, AMBER, PURPLE, RED, TEAL = "#2f6fb3", "#2e8b6f", "#c8871b", "#6b5ba8", "#c0473c", "#1f7a8c"

W, H = 136.0, 76.0
fig, ax = plt.subplots(figsize=(13.6, 7.6), dpi=170)
ax.set_xlim(0, W); ax.set_ylim(0, H); ax.axis("off")
fig.patch.set_facecolor(BG); ax.set_facecolor(BG)
fig.subplots_adjust(left=0.004, right=0.996, top=0.996, bottom=0.004)

ax.text(5, 70.4, "QCC 的工具全景：七大工具只是起点", ha="left", va="center",
        fontsize=22, color=INK, fontweight="bold")
ax.text(5, 65.2, "石川馨的七大工具解决「用数据说话」，但原因分析、对策制定、成果固化要靠另外两类工具",
        ha="left", va="center", fontsize=11.2, color=MUTED)
ax.plot([5, 131.5], [61.6, 61.6], color=LINE, linewidth=1.1)

# ═════════ 左：七大工具 ═════════
LX, LW = 5.0, 52.0
ax.add_patch(FancyBboxPatch((LX, 24.0), LW, 36.0,
             boxstyle="round,pad=0,rounding_size=1.7",
             linewidth=1.9, edgecolor=BLUE, facecolor=BLUE + "07"))
ax.add_patch(FancyBboxPatch((LX, 51.6), LW, 8.4,
             boxstyle="round,pad=0,rounding_size=1.7",
             linewidth=0, facecolor=BLUE))
ax.text(LX + 2.4, 57.2, "QC 七大工具（石川馨）", ha="left", va="center",
        fontsize=12.0, color="white", fontweight="bold")
ax.text(LX + 2.4, 54.0, "《质量管理小组活动准则》推荐的基本工具集", ha="left", va="center",
        fontsize=8.0, color="white", alpha=0.88)

SEVEN = [
    ("流程图", "理清现状流程"),
    ("检查表", "记录事实数据"),
    ("帕累托图", "分清主次矛盾"),
    ("特性要因图", "鱼骨图 · 展开原因"),
    ("管理图 / 控制图", "看过程是否受控"),
    ("散布图", "判断相关关系"),
    ("直方图", "看数据分布形态"),
]
for i, (k, v) in enumerate(SEVEN):
    col, row = i % 2, i // 2
    bw = 23.0
    x = LX + 2.2 + col * (bw + 2.6)
    y = 48.4 - row * 5.6
    ax.add_patch(FancyBboxPatch((x, y - 2.3), bw, 4.6,
                 boxstyle="round,pad=0,rounding_size=0.8",
                 linewidth=1.1, edgecolor=BLUE + "66", facecolor="white"))
    ax.text(x + 1.6, y, k, ha="left", va="center",
            fontsize=8.8, color=BLUE, fontweight="bold")
    ax.text(x + bw - 1.4, y, v, ha="right", va="center",
            fontsize=7.5, color=MUTED)

ax.text(LX + 2.4, 26.2, "七个全是数据类工具 —— 共同点是「用数据说话」",
        ha="left", va="center", fontsize=8.2, color=BLUE, style="italic")
ax.text(LX + 2.4, 23.0, "这是 QCC 科学性的底座",
        ha="left", va="center", fontsize=8.2, color=BLUE, style="italic")

# ═════════ 右上：进阶手法 ═════════
RX, RW = 60.5, 71.0
ax.add_patch(FancyBboxPatch((RX, 36.0), RW, 24.0,
             boxstyle="round,pad=0,rounding_size=1.7",
             linewidth=1.9, edgecolor=AMBER, facecolor=AMBER + "07"))
ax.add_patch(FancyBboxPatch((RX, 51.6), RW, 8.4,
             boxstyle="round,pad=0,rounding_size=1.7",
             linewidth=0, facecolor=AMBER))
ax.text(RX + 2.4, 57.2, "进阶与辅助手法", ha="left", va="center",
        fontsize=12.0, color="white", fontweight="bold")
ax.text(RX + 2.4, 54.0, "不在七大工具内，但原因分析和方案生成离不开", ha="left", va="center",
        fontsize=8.0, color="white", alpha=0.88)

ADV = ["头脑风暴", "关联图", "层别法", "亲和图", "系统图（树图）", "PDPC 法", "正交试验"]
for i, t in enumerate(ADV):
    w = 9.6
    x = RX + 2.2 + (i % 4) * (w + 1.6)
    y = 47.2 - (i // 4) * 5.6
    ax.add_patch(FancyBboxPatch((x, y - 2.1), w, 4.2,
                 boxstyle="round,pad=0,rounding_size=0.8",
                 linewidth=0, facecolor=AMBER + "20"))
    ax.text(x + w / 2, y, t, ha="center", va="center",
            fontsize=8.2, color=AMBER, fontweight="bold")

# ═════════ 右下：两个骨架 ═════════
SY, SH = 24.0, 10.6
for x, w, t, d, note in [
    (RX + 2.2, 32.0, "5M1E", "人 · 机 · 料 · 法 · 环 · 测", "原因分析的鱼骨图骨架"),
    (RX + 37.0, 31.8, "5W1H", "What · Why · Who · Where · When · How", "对策表的填写骨架"),
]:
    ax.add_patch(FancyBboxPatch((x, SY), w, SH,
                 boxstyle="round,pad=0,rounding_size=1.5",
                 linewidth=1.7, edgecolor=TEAL, facecolor=TEAL + "0C"))
    ax.text(x + 2.2, SY + 7.4, t, ha="left", va="center",
            fontsize=11.4, color=TEAL, fontweight="bold")
    ax.text(x + 2.2, SY + 4.6, d, ha="left", va="center",
            fontsize=7.8, color=INK)
    ax.text(x + 2.2, SY + 2.0, note, ha="left", va="center",
            fontsize=7.8, color=MUTED)

# ═════════ 底部：按用途选型 ═════════
BY, BH = 3.0, 18.0
ax.add_patch(FancyBboxPatch((5, BY), 126.5, BH,
             boxstyle="round,pad=0,rounding_size=1.7",
             linewidth=1.9, edgecolor=GREEN, facecolor=GREEN + "07"))
ax.add_patch(FancyBboxPatch((5, BY + BH - 4.4), 126.5, 4.4,
             boxstyle="round,pad=0,rounding_size=1.7",
             linewidth=0, facecolor=GREEN))
ax.text(7.0, BY + BH - 2.2, "按用途选工具：别拿错工具干错活", ha="left", va="center",
        fontsize=11.0, color="white", fontweight="bold")

USE = [
    ("找原因", "鱼骨图 / 系统图 / 关联图", ["原因越交叉", "越不能用单一工具"], BLUE),
    ("定主因", "要因确认表 / RPN / 判别标准", ["必须逐条验证", "不能凭经验拍板"], RED),
    ("定目标", "控制图 / 直方图 / 整体检验", ["目标要有基准值", "不能拍脑袋"], AMBER),
    ("做对策", "5W1H 对策表 / 甘特图", ["措施要具体到动作", "责任人和时间点"], TEAL),
    ("看效果", "柏拉图 / 控制图 / 检查表", ["实施前后对比", "只报有利数据等于没确认"], PURPLE),
    ("做固化", "标准 / 作业文件", ["改进必须写进某份标准", "否则一定反弹"], GREEN),
]
ux, uw = 7.0, 19.4
for k, tools, notes, c in USE:
    ax.add_patch(FancyBboxPatch((ux, 4.0), uw, 10.6,
                 boxstyle="round,pad=0,rounding_size=1.1",
                 linewidth=1.4, edgecolor=c, facecolor=c + "10"))
    ax.text(ux + uw / 2, 12.0, k, ha="center", va="center",
            fontsize=9.8, color=c, fontweight="bold")
    ax.text(ux + uw / 2, 9.0, tools, ha="center", va="center",
            fontsize=7.2, color=INK)
    ax.text(ux + uw / 2, 6.4, notes[0], ha="center", va="center",
            fontsize=6.9, color=MUTED)
    ax.text(ux + uw / 2, 4.9, notes[1], ha="center", va="center",
            fontsize=6.9, color=MUTED)
    ux += uw + 1.5

fig.savefig("/workspace/blog/src/.vuepress/public/images/qcc-tools-panorama.png",
            dpi=170, facecolor=BG)
print("→ qcc-tools-panorama.png")
