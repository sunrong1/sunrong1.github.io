#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""AI Coding 5 大心法速查图"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "WenQuanYi Zen Hei"]
plt.rcParams["axes.unicode_minus"] = False

C1 = "#2B6CB0"   # 蓝
C2 = "#2F855A"   # 绿
C3 = "#805AD5"   # 紫
C4 = "#C53030"   # 红
C5 = "#B7791F"   # 橙
GREY = "#718096"
DARK = "#1A202C"

BOX = dict(boxstyle="round,pad=0.4,rounding_size=1.2", linewidth=2.2)

# 画布：1 个 y 单位 ≈ 13.7px，字号 10.4pt ≈ 21.7px ≈ 1.6 单位
LH = 2.75          # 行高（单位）
fig, ax = plt.subplots(figsize=(16, 9.8), dpi=150)
ax.set_xlim(0, 160); ax.set_ylim(0, 96); ax.axis("off")

ax.text(80, 94, "AI Coding 5 大心法 · 速查", ha="center", fontsize=22,
        fontweight="bold", color=DARK)
ax.text(80, 89.6, "想清楚做什么  >  砍到最小  >  一轮轮迭代  >  喂足上下文",
        ha="center", fontsize=13, color=GREY)


def card(x0, y0, w, h, num, title, color, tint, lines, tag=None):
    """一张心法卡：头部色带 + 要点行 + 底部斜体注脚"""
    ax.add_patch(FancyBboxPatch((x0, y0), w, h, facecolor="white",
                 edgecolor=color, **BOX))
    ax.add_patch(FancyBboxPatch((x0, y0 + h - 7.0), w, 7.0,
                 boxstyle="round,pad=0.4,rounding_size=1.2",
                 facecolor=tint, edgecolor="none", zorder=1))
    ax.text(x0 + 3.2, y0 + h - 3.6, num, ha="left", fontsize=12,
            fontweight="bold", color=color, zorder=4)
    ax.text(x0 + 11.5, y0 + h - 3.6, title, ha="left", fontsize=12.8,
            fontweight="bold", color=DARK, zorder=4)

    ys = y0 + h - 10.8
    for txt, sz, bold, col in lines:
        if txt:
            ax.text(x0 + 4.0, ys, txt, ha="left", fontsize=sz,
                    fontweight="bold" if bold else "normal",
                    color=col, zorder=4)
        ys -= LH
    if tag:
        ax.text(x0 + 4.0, y0 + 2.6, tag, ha="left", fontsize=9.4,
                color=color, style="italic", zorder=4)


# ---------- 上排：心法一 / 二 / 三 ----------
card(3, 51, 50, 33, "心法一", "Planning is Everything", C1, "#EBFBFF",
     [("AI 帮你想「怎么做」", 10.2, True, DARK),
      ("不帮你想「做什么」", 10.2, True, C1),
      ("", 5, False, DARK),
      ("开工前写清 4 件事：", 9.6, True, DARK),
      ("背景 · 目标 · 范围 · 验收", 9.4, False, GREY)],
     tag="先让 AI 出方案，点头了再写代码")

card(55, 51, 50, 33, "心法二", "MVP 思维", C2, "#F0FFF4",
     [("先做能跑的版本", 10.2, True, C2),
      ("不要过度设计", 10.2, True, DARK),
      ("", 5, False, DARK),
      ("先验最便宜的假设：", 9.6, True, DARK),
      ("技术可行 < 有人用 < 体验好", 9.4, False, GREY)],
     tag="MVP 砍掉的是幻觉，不是功能")

card(107, 51, 50, 33, "心法三", "迭代优于完美", C3, "#FAF5FF",
     [("一步到位是幻觉", 10.2, True, C3),
      ("能跑起来才是起点", 10.2, True, DARK),
      ("", 5, False, DARK),
      ("三轮推进：", 9.6, True, DARK),
      ("骨架能跑 > 主功能能用 > 该改再改", 9.4, False, GREY)],
     tag="一次只让它改一个地方")

# 三张卡之间的向下箭头
for cx in (28, 80, 132):
    ax.add_patch(FancyArrowPatch((cx, 49.6), (cx, 47.4),
                 arrowstyle="-|>", mutation_scale=14,
                 color="#CBD5E0", linewidth=1.8, zorder=2))

# ---------- 中排：心法四 + 心法五 ----------
card(3, 10, 76, 36, "心法四", "上下文是王道", C4, "#FFF5F5",
     [("AI 不知道你脑子里在想什么", 10.2, True, C4),
      ("你给的上下文越少，它猜得越多", 10.2, True, DARK),
      ("", 5, False, DARK),
      ("四个层次：", 9.6, True, DARK),
      ("会话内 · 项目级 CLAUDE.md · 任务级 · 外部文档", 9.4, False, GREY),
      ("", 5, False, DARK),
      ("CLAUDE.md 里最值钱的两段：", 9.6, True, DARK),
      ("「关键决策」和「已知限制」—— 记录为什么现在长这样", 9.2, False, GREY)],
     tag="git diff 看一眼再接受，每轮都提交")

card(85, 10, 72, 36, "心法五", "像产品经理一样思考", C5, "#FFFAF0",
     [("你是产品经理：想清楚做什么", 10.2, True, C5),
      ("AI 是工程师：负责实现出来", 10.2, True, DARK),
      ("", 5, False, DARK),
      ("三个必问：", 9.6, True, DARK),
      ("值得做吗 · 最小可行是什么样 · 怎么算做完了", 9.4, False, GREY),
      ("", 5, False, DARK),
      ("验收写成 AI 自己能测的断言", 9.6, True, DARK),
      ("「输错密码 3 次锁定 15 分钟」强过「登录要能用」", 9.2, False, GREY)],
     tag="你不是在指挥 AI，你是在跟它分工")

# ---------- 底部：闭环 ----------
ax.add_patch(FancyBboxPatch((3, 1), 154, 5.4,
             boxstyle="round,pad=0.4,rounding_size=1.2",
             facecolor="#EDF2F7", edgecolor="#2D3748", linewidth=1.6, zorder=1))
ax.text(80, 3.7, "每轮迭代结束  →  回到心法五：这一轮验证到了什么？  →  没验证到东西的迭代，就是白干",
        ha="center", fontsize=10.4, color=DARK, zorder=4)

plt.savefig("ai-coding-5-mindset.png", dpi=150, bbox_inches="tight",
            facecolor="white", pad_inches=0.3)
print("saved: ai-coding-5-mindset.png")
