#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""输出位置：src/.vuepress/public/images/（public 目录才会进 dist，src/images 下未被引用的图会 404）

生成 QCC 速查图：自主性的小组制改进。

一张图装下 QCC 复习的全部骨架：
定义起源 / 四大特点 / 三个角色 / 三种组建程序 / 课题三维度分类 /
PDCA 十步 / 七大工具 / 硬约束 / 两大常见病。

风格与博客其他配图一致：白底、深色墨迹、圆角描边块、PDCA 四阶段配色。
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

C_P    = "#2f6fb3"
C_D    = "#2e8b6f"
C_C    = "#c8871b"
C_A    = "#6a5aa8"
C_RED  = "#c0473c"
C_GREY = "#8a97a5"

W, H = 136.0, 88.0

fig, ax = plt.subplots(figsize=(13.6, 8.8), dpi=170)
ax.set_xlim(0, W)
ax.set_ylim(0, H)
ax.axis("off")
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
fig.subplots_adjust(left=0.004, right=0.996, top=0.996, bottom=0.004)


def card(x, y, w, h, title, color, title_fs=13.0, head=5.4):
    ax.add_patch(FancyBboxPatch(
        (x, y), w, h,
        boxstyle="round,pad=0,rounding_size=1.6",
        linewidth=1.7, edgecolor=color, facecolor=color + "08"))
    ax.add_patch(FancyBboxPatch(
        (x, y + h - head), w, head,
        boxstyle="round,pad=0,rounding_size=1.6",
        linewidth=0, facecolor=color))
    ax.text(x + 2.0, y + h - head / 2, title, ha="left", va="center",
            fontsize=title_fs, color="white", fontweight="bold")
    return y + h - head - 1.8


def tag(x, y, w, h, text, color, fs=9.6):
    ax.add_patch(FancyBboxPatch(
        (x, y), w, h,
        boxstyle="round,pad=0,rounding_size=1.0",
        linewidth=1.2, edgecolor=color, facecolor=color + "10"))
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center",
            fontsize=fs, color=color, fontweight="bold")


# ══════════════════════ 标题区 ══════════════════════
ax.text(5, 82.0, "QCC 速查图", ha="left", va="center",
        fontsize=25, color=INK, fontweight="bold")
ax.text(5, 76.6, "自主性的小组制改进 —— 与 6Sigma 的分界在驱动源，不在方向",
        ha="left", va="center", fontsize=12.0, color=MUTED)

# 右上：起源时间轴
ax.plot([88.0, 121.0], [79.6, 79.6], color=LINE, linewidth=1.3)
for i, (xx, tt, c) in enumerate([
    (90.0, "1962\n日本", C_P),
    (107.0, "1978\n中国第一组", C_D),
]):
    ax.add_patch(FancyBboxPatch((xx - 1.1, 78.5), 2.2, 2.2,
                                 boxstyle="round,pad=0,rounding_size=1.1",
                                 linewidth=0, facecolor=c))
    ax.text(xx, 81.4, tt, ha="center", va="bottom",
            fontsize=8.4, color=INK, linespacing=1.3)
tag(124.0, 78.0, 8.0, 4.2, "小实活新", C_A, fs=9.0)

ax.plot([5, 131.5], [73.2, 73.2], color=LINE, linewidth=1.1)


# ═══════════════ 第一行：特点 / 角色 / 组建 ═══════════════
y1, h1 = 54.5, 17.5

cy = card(5, y1, 40.5, h1, "四大特点（QCC 的身份证）", C_P)
for i, (k, v) in enumerate([
        ("自主性", "自愿参加 · 自我管理"),
        ("群众性", "一线操作者为主"),
        ("民主性", "组长可轮换 · 不分职级"),
        ("科学性", "数据说话 · PDCA 推进")]):
    yy = cy - i * 2.6
    ax.text(7.0, yy, k, ha="left", va="center", fontsize=10.2,
            color=C_P, fontweight="bold")
    ax.text(15.2, yy, v, ha="left", va="center", fontsize=9.3, color=INK)

cy = card(48.5, y1, 32.0, h1, "三个角色", C_D)
for i, (k, v) in enumerate([
        ("圈长", "思维分析 · 沟通协调"),
        ("辅导员", "改进知识与工具支持"),
        ("圈员", "立足本职 · 执行落地")]):
    yy = cy - i * 2.6
    ax.text(50.5, yy, k, ha="left", va="center", fontsize=10.2,
            color=C_D, fontweight="bold")
    ax.text(58.5, yy, v, ha="left", va="center", fontsize=9.3, color=INK)
ax.text(50.5, cy - 3 * 2.6 + 0.2, "可同时参加多个圈 · 限制是立足本职",
        ha="left", va="center", fontsize=8.2, color=C_RED, fontweight="bold")

cy = card(83.5, y1, 48.0, h1, "三种组建程序", C_A)
for i, (k, v, c) in enumerate([
        ("自下而上", "小组自主找题、自主选人 · 积极性最高", C_GREY),
        ("自上而下", "上级指派课题与人 · 中国企业最普遍", C_GREY),
        ("上下结合", "上级给范围，上下协商 · 官方推荐", C_A)]):
    yy = cy - i * 2.6
    ax.text(85.5, yy, k, ha="left", va="center", fontsize=10.2,
            color=c, fontweight="bold")
    ax.text(96.0, yy, v, ha="left", va="center", fontsize=9.0, color=INK)
ax.text(85.5, cy - 3 * 2.6 + 0.2,
        "6Sigma / TOPN 是自上而下的项目制；QCC 三种程序都可用",
        ha="left", va="center", fontsize=8.2, color=MUTED)


# ═══════════ 第二行：课题三维度 / PDCA 十步 ═══════════
y2, h2 = 18.0, 35.0

# ── 左：课题分类 ──
cy = card(5, y2, 44.0, h2, "课题分类：三个独立维度", C_C)
yy = cy
for name, c, subs in [
    ("按活动性质", C_C, ["问题解决型 → 现场 / 服务 / 攻关 / 管理",
                          "课题达成型（= 创新型）→ 达成新目标"]),
    ("按目标来源", C_A, ["自定目标课题",
                          "指令性目标课题（上级下达）"]),
    ("按问题性质", C_D, ["品质改善 / 效率提升",
                          "成本降低 / 安全保障"]),
]:
    ax.text(7.0, yy, name, ha="left", va="center", fontsize=10.4,
            color=c, fontweight="bold")
    yy -= 2.9
    for s in subs:
        ax.add_patch(FancyBboxPatch((7.6, yy - 0.7), 0.95, 0.95,
                                     boxstyle="round,pad=0,rounding_size=0.45",
                                     linewidth=0, facecolor=c))
        ax.text(9.3, yy, s, ha="left", va="center", fontsize=9.1, color=INK)
        yy -= 2.5
    yy -= 0.9
ax.text(7.0, yy + 1.2, "课题达成型 = 创新型（源自日本「课题达成型」），非目标来源维度",
        ha="left", va="center", fontsize=8.4, color=C_RED, fontweight="bold")

# ── 右：PDCA 十步（纵向 4 阶段，步骤横排）──
cy = card(52, y2, 79.5, h2, "PDCA 十步流程", C_P)

STAGE_X = 53.8
STEP_X0 = 58.6


def stage_row(y_name, y_sub, phase, color, steps, step_w=None):
    """一行阶段：左侧阶段 badge，右侧步骤横排。返回下一步起始 y。"""
    ax.add_patch(FancyBboxPatch((STAGE_X, y_name - 1.5), 3.6, 4.6,
                                 boxstyle="round,pad=0,rounding_size=1.0",
                                 linewidth=0, facecolor=color))
    ax.text(STAGE_X + 1.8, y_name + 0.8, phase, ha="center", va="center",
            fontsize=12.5, color="white", fontweight="bold")
    if len(steps) == 1:
        avail = 79.5 - (STEP_X0 - 52) - 1.5
        sw = avail
    else:
        sw = step_w or (79.5 - (STEP_X0 - 52) - 1.5 - 0.4 * (len(steps) - 1)) / len(steps)
    x = STEP_X0
    for name, sub in steps:
        ax.text(x, y_name, name, ha="left", va="center",
                fontsize=9.3, color=color, fontweight="bold")
        ax.text(x, y_sub, sub, ha="left", va="center",
                fontsize=8.1, color=MUTED)
        x += sw + 0.4
    return x


# P 行
stage_row(43.6, 41.2, "P", C_P, [
    ("① 选题", "小 · 宜小不宜大"),
    ("② 现状调查", "取基准值"),
    ("③ 设定目标", "基准/目标/挑战"),
    ("④ 原因分析", "5M1E 展开"),
    ("⑤ 确定主因", "逐条确认验证"),
    ("⑥ 制定对策", "5W1H 对策表"),
])
ax.plot([53.8, 130.0], [39.8, 39.8], color=LINE, linewidth=0.9)

# D 行
stage_row(37.4, 35.0, "D", C_D, [("⑦ 对策实施", "逐条落地并与对策目标对比")])
ax.plot([53.8, 130.0], [33.6, 33.6], color=LINE, linewidth=0.9)

# C 行
stage_row(31.2, 28.8, "C", C_C, [("⑧ 效果确认", "与对策实施前的现状对比，判断改善程度")])
ax.plot([53.8, 130.0], [27.4, 27.4], color=LINE, linewidth=0.9)

# A 行
stage_row(25.0, 22.6, "A", C_A, [
    ("⑨ 巩固措施", "纳入标准 / 工艺 / 作业文件"),
    ("⑩ 总结与下一步", "遗留问题进入下一轮 PDCA"),
])

ax.text(53.8, 20.2,
        "PDCA 四阶段八步骤：P 找问题 / 析原因 / 找主因 / 订对策 → D 执行 → C 检查 → A 巩固",
        ha="left", va="center", fontsize=8.2, color=MUTED)


# ═══════════ 第三行：七大工具 / 硬约束 ═══════════
y3, h3 = 3.6, 12.5

ax.add_patch(FancyBboxPatch(
    (5, y3), 88.0, h3,
    boxstyle="round,pad=0,rounding_size=1.6",
    linewidth=1.7, edgecolor=C_P, facecolor=C_P + "08"))
ax.add_patch(FancyBboxPatch(
    (5, y3 + h3 - 4.8), 88.0, 4.8,
    boxstyle="round,pad=0,rounding_size=1.6",
    linewidth=0, facecolor=C_P))
ax.text(7.0, y3 + h3 - 2.4, "QC 七大工具（石川馨）", ha="left", va="center",
        fontsize=11.6, color="white", fontweight="bold")
tx = 7.0
for t in ["流程图", "检查表", "柏拉图", "鱼骨图", "控制图", "散布图", "直方图"]:
    w = len(t) * 1.55 + 3.0
    tag(tx, 7.3, w, 4.0, t, C_P, fs=10.0)
    tx += w + 1.8
ax.text(7.0, 5.6,
        "头脑风暴 / 关联图 / 层别法属进阶手法，不在七大工具内  ·  原因分析骨架 = 5M1E  ·  对策表 = 5W1H",
        ha="left", va="center", fontsize=8.4, color=MUTED)

ax.add_patch(FancyBboxPatch(
    (96, y3), 35.5, h3,
    boxstyle="round,pad=0,rounding_size=1.6",
    linewidth=1.7, edgecolor=C_RED, facecolor=C_RED + "08"))
ax.add_patch(FancyBboxPatch(
    (96, y3 + h3 - 4.8), 35.5, 4.8,
    boxstyle="round,pad=0,rounding_size=1.6",
    linewidth=0, facecolor=C_RED))
ax.text(98.0, y3 + h3 - 2.4, "硬约束 · 两大常见病", ha="left", va="center",
        fontsize=11.6, color="white", fontweight="bold")
ax.text(98.0, 10.0, "硬约束：课题 ≤ 半年 · 每月 ≥ 2 次会",
        ha="left", va="center", fontsize=8.6, color=INK)
ax.text(98.0, 7.3, "每半月交中间报告（小组注册 + 课题注册双轨）",
        ha="left", va="center", fontsize=8.6, color=INK)
ax.text(98.0, 4.6, "常见病：虎头蛇尾 · 走过场（假数据）",
        ha="left", va="center", fontsize=8.6, color=C_RED, fontweight="bold")

fig.savefig("/workspace/blog/src/.vuepress/public/images/qcc-cheatsheet.png", dpi=170, facecolor=BG)
print("→ /workspace/blog/src/.vuepress/public/images/qcc-cheatsheet.png")
