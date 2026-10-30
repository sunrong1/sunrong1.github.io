#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 QCC 对比图：问题解决型 vs 课题达成型（创新型）。

对照两种课题类型的切入点、流程、工具取向，以及判断类型的四条标准。
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

C_SOLVE = "#2f6fb3"   # 问题解决型
C_GOAL  = "#6a5aa8"   # 课题达成型
C_RED   = "#c0473c"
C_D     = "#2e8b6f"

W, H = 136.0, 100.0

fig, ax = plt.subplots(figsize=(13.6, 10.0), dpi=170)
ax.set_xlim(0, W)
ax.set_ylim(0, H)
ax.axis("off")
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
fig.subplots_adjust(left=0.004, right=0.996, top=0.996, bottom=0.004)


def panel(x, y, w, h, title, color, sub):
    ax.add_patch(FancyBboxPatch(
        (x, y), w, h,
        boxstyle="round,pad=0,rounding_size=1.8",
        linewidth=1.9, edgecolor=color, facecolor=color + "08"))
    ax.add_patch(FancyBboxPatch(
        (x, y + h - 7.0), w, 7.0,
        boxstyle="round,pad=0,rounding_size=1.8",
        linewidth=0, facecolor=color))
    ax.text(x + 2.4, y + h - 3.4, title, ha="left", va="center",
            fontsize=14.0, color="white", fontweight="bold")
    ax.text(x + w - 2.4, y + h - 3.4, sub, ha="right", va="center",
            fontsize=9.6, color="white", alpha=0.9)
    return y + h - 7.0 - 2.0


def field(x, y, label, value, color, lw=11.0):
    ax.text(x, y, label, ha="left", va="center", fontsize=9.0,
            color=color, fontweight="bold")
    ax.text(x + lw, y, value, ha="left", va="center", fontsize=9.4, color=INK)


# ══════════════════ 标题 ══════════════════
ax.text(5, 94.6, "问题解决型 vs 课题达成型", ha="left", va="center",
        fontsize=23, color=INK, fontweight="bold")
ax.text(5, 89.8, "前者以「不良程度」为切入点，后者以「更好程度」为切入点 —— 选错型，程序就全错",
        ha="left", va="center", fontsize=11.6, color=MUTED)
ax.plot([5, 131.5], [86.2, 86.2], color=LINE, linewidth=1.1)

# ══════════════════ 左右两栏 ══════════════════
PY, PH = 20.0, 62.0

# ─── 左：问题解决型 ───
cx = 5.0
cy = panel(cx, PY, 61.0, PH, "问题解决型", C_SOLVE, "占绝大多数 · 必做现状调查与原因分析")
field(cx + 2.4, cy, "切入点", "以「不良程度」为切入点", C_SOLVE)
cy -= 2.9
field(cx + 2.4, cy, "本质", "在原有基础上改进、提升", C_SOLVE)
cy -= 2.9
field(cx + 2.4, cy, "现状数据", "必须有历史数据，现状即基准值", C_SOLVE)
cy -= 2.9
field(cx + 2.4, cy, "主用工具", "数据分析工具为主（柏拉图 / 控制图 / 直方图）", C_SOLVE)
cy -= 4.2

ax.plot([cx + 2.4, cx + 58.6], [cy + 1.6, cy + 1.6], color=LINE, linewidth=0.9)
ax.text(cx + 2.4, cy - 0.6, "活动程序（PDCA 十步）", ha="left", va="center",
        fontsize=9.6, color=C_SOLVE, fontweight="bold")
steps_solve = [
    "① 选择课题", "② 把握现状", "③ 设定目标", "④ 分析根因（5M1E）",
    "⑤ 确定主因", "⑥ 拟定对策（5W1H）", "⑦ 对策实施", "⑧ 效果确认",
    "⑨ 成果标准化", "⑩ 总结与今后打算",
]
for i, s in enumerate(steps_solve):
    yy = cy - 3.6 - i * 2.55
    ax.add_patch(FancyBboxPatch((cx + 2.4, yy - 0.85), 0.95, 0.95,
                                 boxstyle="round,pad=0,rounding_size=0.45",
                                 linewidth=0, facecolor=C_SOLVE))
    ax.text(cx + 4.2, yy, s, ha="left", va="center", fontsize=9.4, color=INK)
ax.text(cx + 2.4, PY + 3.2, "改进类课题的命门：现状调查 + 原因分析一个都不能省",
        ha="left", va="center", fontsize=8.8, color=C_SOLVE, fontweight="bold")

# ─── 右：课题达成型 ───
cx = 70.0
cy = panel(cx, PY, 61.0, PH, "课题达成型（= 创新型）", C_GOAL, "中国创新型课题即源自日本课题达成型")
field(cx + 2.4, cy, "切入点", "以「更好程度」为切入点", C_GOAL)
cy -= 2.9
field(cx + 2.4, cy, "本质", "从未有过的新目标，从无到有", C_GOAL)
cy -= 2.9
field(cx + 2.4, cy, "现状数据", "没有历史数据 → 不做现状调查", C_GOAL)
cy -= 2.9
field(cx + 2.4, cy, "主用工具", "非数据分析工具为主（头脑风暴 / 亲和图 / PDPC）", C_GOAL)
cy -= 4.2

ax.plot([cx + 2.4, cx + 58.6], [cy + 1.6, cy + 1.6], color=LINE, linewidth=0.9)
ax.text(cx + 2.4, cy - 0.6, "活动程序（八步）", ha="left", va="center",
        fontsize=9.6, color=C_GOAL, fontweight="bold")
steps_goal = [
    "① 选定课题", "② 确定突破口、设定目标",
    "③ 提出各种方案并确定最正确方案", "④ 制定对策",
    "⑤ 按对策表施行", "⑥ 确认效果",
    "⑦ 稳固措施标准化", "⑧ 总结与今后打算",
]
for i, s in enumerate(steps_goal):
    yy = cy - 3.6 - i * 2.55
    ax.add_patch(FancyBboxPatch((cx + 2.4, yy - 0.85), 0.95, 0.95,
                                 boxstyle="round,pad=0,rounding_size=0.45",
                                 linewidth=0, facecolor=C_GOAL))
    ax.text(cx + 4.2, yy, s, ha="left", va="center", fontsize=9.4, color=INK)

# 三大类
gy = cy - 3.6 - len(steps_goal) * 2.55 - 1.2
ax.plot([cx + 2.4, cx + 58.6], [gy + 1.4, gy + 1.4], color=LINE, linewidth=0.9)
ax.text(cx + 2.4, gy - 0.4, "课题达成型三大类（日科技连）", ha="left", va="center",
        fontsize=9.4, color=C_GOAL, fontweight="bold")
for i, (k, v) in enumerate([
        ("新规业务的因应", "手工作业转电脑化"),
        ("现况突破", "舍弃原有作法，创出达成所期的新作法"),
        ("魅力性质量的创造", "消费者事先没想到，一接触就欣喜")]):
    yy = gy - 3.4 - i * 2.35
    ax.text(cx + 2.6, yy, k, ha="left", va="center", fontsize=8.9,
            color=C_GOAL, fontweight="bold")
    ax.text(cx + 20.0, yy, v, ha="left", va="center", fontsize=8.5, color=MUTED)

# ══════════════════ 底部：判断标准 ══════════════════
BY, BH = 4.0, 14.0
ax.add_patch(FancyBboxPatch(
    (5, BY), 126.5, BH,
    boxstyle="round,pad=0,rounding_size=1.8",
    linewidth=1.9, edgecolor=C_D, facecolor=C_D + "08"))
ax.add_patch(FancyBboxPatch(
    (5, BY + BH - 4.8), 126.5, 4.8,
    boxstyle="round,pad=0,rounding_size=1.8",
    linewidth=0, facecolor=C_D))
ax.text(7.0, BY + BH - 2.4, "怎么判断一个课题是哪一型（实操判据）",
        ha="left", va="center", fontsize=11.4, color="white", fontweight="bold")

crit = [
    ("① 有没有之前的课题", "没有 → 达成型"),
    ("② 之前是否做过多次", "做过很多次 → 解决型"),
    ("③ 对策是否已知", "已知 → 解决型"),
    ("④ 原因能否分析和改进", "能 → 解决型"),
]
tx = 7.0
for i, (k, v) in enumerate(crit):
    w = 30.0
    ax.add_patch(FancyBboxPatch(
        (tx, BY + 4.0), w, 4.2,
        boxstyle="round,pad=0,rounding_size=1.0",
        linewidth=1.3, edgecolor=C_D, facecolor=C_D + "14"))
    ax.text(tx + 1.6, BY + 6.1, k, ha="left", va="center",
            fontsize=9.2, color=INK, fontweight="bold")
    ax.text(tx + 1.6, BY + 4.9, v, ha="left", va="center",
            fontsize=8.4, color=C_D)
    tx += w + 1.4

ax.text(7.0, BY + 1.6,
        "最大的坑：程序混用 —— 解决型课题套用达成型的「提出方案选最优」，或达成型课题硬做现状调查与原因分析",
        ha="left", va="center", fontsize=9.0, color=C_RED, fontweight="bold")

fig.savefig("/workspace/blog/src/images/qcc-two-types.png", dpi=170, facecolor=BG)
print("→ /workspace/blog/src/images/qcc-two-types.png")
