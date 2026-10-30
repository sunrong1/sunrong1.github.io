#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 CSDN 文章封面图（16:9, 1200x675）。

用法:
    python3 gen_csdn_covers.py

产出 3 张，与已发布的 3 篇 CSDN 文章一一对应。
风格与博客配图一致：白底、深色墨迹、圆角描边块、彩色点缀。
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

OUT = "/workspace/output"


def wrap_cn(text, per_line):
    """按视觉宽度折行（中文算 1 个宽度单位，ASCII 算 0.5）。"""
    lines, cur, w = [], "", 0.0
    for ch in text:
        cw = 0.5 if ord(ch) < 128 else 1.0
        if w + cw > per_line:
            lines.append(cur)
            cur, w = "", 0.0
        cur += ch
        w += cw
    if cur:
        lines.append(cur)
    return lines


def cover(fname, title, subtitle, tags, accents, kicker="AI 实践笔记"):
    fig, ax = plt.subplots(figsize=(12, 6.75), dpi=100)
    ax.set_xlim(0, 120)
    ax.set_ylim(0, 67.5)
    ax.axis("off")
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    # 左侧竖条
    ax.add_patch(FancyBboxPatch(
        (5.0, 6.0), 1.0, 55.5,
        boxstyle="round,pad=0,rounding_size=0.5",
        linewidth=0, facecolor=accents[0]))

    # 右上角装饰方块
    for i, c in enumerate(accents):
        ax.add_patch(FancyBboxPatch(
            (104.0 + i * 4.4, 55.0), 3.2, 3.2,
            boxstyle="round,pad=0,rounding_size=0.8",
            linewidth=0, facecolor=c, alpha=0.85 - i * 0.2))

    # kicker
    ax.text(10.5, 56.0, kicker, fontsize=11.5, color=accents[0],
            va="center", ha="left", fontweight="bold")

    # 主标题
    tlines = wrap_cn(title, 13)
    ty = 48.0 - (len(tlines) - 1) * 4.4
    for i, ln in enumerate(tlines):
        ax.text(10.5, ty - i * 4.4, ln, fontsize=25, color=INK,
                va="center", ha="left", fontweight="bold")

    # 副标题
    sub_y = ty - (len(tlines) - 1) * 4.4 - 7.0
    for i, ln in enumerate(wrap_cn(subtitle, 30)):
        ax.text(10.5, sub_y - i * 3.6, ln, fontsize=12.5, color=MUTED,
                va="center", ha="left")

    # 分隔线
    line_y = max(12.0, sub_y - len(wrap_cn(subtitle, 30)) * 3.6 - 3.0)
    ax.plot([10.5, 112.0], [line_y, line_y], color=LINE, linewidth=1.1)

    # 标签 pill
    px = 10.5
    for i, tag in enumerate(tags):
        w = len(tag) * 1.42 + 3.4
        c = accents[i % len(accents)]
        ax.add_patch(FancyBboxPatch(
            (px, line_y - 7.6), w, 5.0,
            boxstyle="round,pad=0,rounding_size=2.5",
            linewidth=1.4, edgecolor=c, facecolor=c + "12"))
        ax.text(px + w / 2, line_y - 5.1, tag, fontsize=10.5, color=c,
                va="center", ha="center", fontweight="bold")
        px += w + 2.6

    # 页脚
    ax.text(10.5, 6.5, "sunrong.site", fontsize=9.5, color=MUTED,
            va="center", ha="left")
    ax.text(112.0, 6.5, "Mr.Sun", fontsize=9.5, color=MUTED,
            va="center", ha="right")

    path = f"{OUT}/{fname}"
    fig.savefig(path, dpi=100, facecolor=BG)
    plt.close(fig)
    print(f"  -> {path}")


if __name__ == "__main__":
    import os
    os.makedirs(OUT, exist_ok=True)
    print("生成 CSDN 封面：")

    cover("csdn-cover-01-two-talents.png",
          "AI 时代的两种人",
          "构建者与审查者：两种稀缺能力的产品选择与迁移路径",
          ["构建者", "审查组", "护城河", "职业选择"],
          ["#2f6fb3", "#c8871b"])

    cover("csdn-cover-02-claude-code.png",
          "Claude Code 上下文机制拆解",
          "/init 生成了什么、压缩三档怎么算、自建 Agent 的六层分层",
          ["/init", "上下文压缩", "Subagents", "Skills"],
          ["#6a5aa8", "#2f6fb3"])

    cover("csdn-cover-03-bmad-wiki.png",
          "BMAD × 知识库",
          "两套状态机怎么不打架：流程状态与知识状态的正交设计",
          ["BMAD", ".wiki", "状态机", "集成规范"],
          ["#2e8b6f", "#c8871b"])
