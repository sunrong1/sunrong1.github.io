#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Karpathy LLM Wiki 原始架构 vs 三个开源实现 对照图"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "WenQuanYi Zen Hei"]
plt.rcParams["axes.unicode_minus"] = False

KA = "#2B6CB0"   # Karpathy 蓝
CW = "#2F855A"   # Code Wiki 绿
WI = "#805AD5"   # wiki-init 紫
GREY = "#718096"
DARK = "#1A202C"
LINE = "#2D3748"

fig, ax = plt.subplots(figsize=(16.5, 10.2), dpi=150)
ax.set_xlim(0, 165); ax.set_ylim(0, 100); ax.axis("off")

ax.text(82.5, 97.2, "Karpathy LLM Wiki 原始架构 vs 三个开源实现", ha="center",
        fontsize=21, fontweight="bold", color=DARK)
ax.text(82.5, 92.8, "同一套三层架构，三种落地形态 —— 社区接力把「想法」变成了「工具」",
        ha="center", fontsize=12.5, color=GREY)

# ---------- 列头 ----------
COLS = [
    (26.0, 76.0, "Karpathy 原始 gist", KA, "#EBFBFF",
     "2026 · idea 文件 · 一手来源"),
    (78.0, 118.5, "Code Wiki", CW, "#F0FFF4",
     "mraza007 · 代码库版"),
    (120.5, 161.5, "wiki-init-skill", WI, "#FAF5FF",
     "liuly66 · 通用知识库版"),
]

for x0, x1, name, color, tint, sub in COLS:
    ax.add_patch(FancyBboxPatch((x0, 79.5), x1 - x0, 8.6,
                 boxstyle="round,pad=0.35,rounding_size=1.0",
                 facecolor=tint, edgecolor=color, linewidth=2.0, zorder=2))
    ax.text((x0 + x1) / 2, 85.0, name, ha="center", fontsize=12.2,
            fontweight="bold", color=color, zorder=4)
    ax.text((x0 + x1) / 2, 81.4, sub, ha="center", fontsize=8.8,
            color=GREY, zorder=4)

# ---------- 行数据 ----------
ROWS = [
    ("L1 原始层", "Raw sources", "不可变", [
        ["策展的源文档：文章、论文、数据", "LLM 只读不改", "这是 source of truth"],
        ["源码本身 + _meta.yaml", "source_files 字段记录来源", "变更即触发文章 stale"],
        ["raw/ + raw/assets/", "Web Clipper 剪藏进这里", "附件本地化到 assets/"],
    ]),
    ("L2 知识层", "The wiki", "LLM 全权拥有", [
        ["摘要 · 实体页 · 概念页 · 对比", "总览 · 综合", "交叉引用由 LLM 维护"],
        ["_architecture.md 系统总览", "_patterns.md 复现模式", "modules/ concepts/ decisions/", "learnings/ queries/"],
        ["entities/ 人物组织工具", "concepts/ 想法框架技术", "sources/ comparisons/", "synthesis/ 跨领域综合"],
    ]),
    ("L3 规则层", "The schema", "最关键配置", [
        ["schema 概念：CLAUDE.md", "或 AGENTS.md", "你与 LLM 共同演进"],
        ["cw setup claude-code", "→ 装 skill 到 ~/.claude/skills/", "cw setup codex → AGENTS.md"],
        ["AGENTS.md + templates/ + prompts/", "命名带类别前缀", "entity- / concept- / source-"],
    ]),
    ("Ingest 采集", "Put source in raw/", "一份牵动 10-15 页", [
        ["读 → 讨论 → 写 source 页", "更新 index + 相关 entity 页", "追加 log.md"],
        ["会话开始 cw status", "首次全量编译 · 过期增量更新", "新鲜则跳过，直接干活"],
        ["prompts/ingest.md 11 步", "新页面初始 status: draft", "规范 kebab-case + 双链"],
    ]),
    ("Query 供给", "Ask the wiki", "好答案要归档", [
        ["先读 index.md 定位", "再钻进页面综合 · 带引用", "好答案回填 wiki"],
        ["Agent 查 wiki 而非重读源码", "跨切面问题一篇文章串起多文件", "cw setup qmd 检索"],
        ["prompts/query.md", "无答案就明说不编造", "优先链到已有页面"],
    ]),
    ("Lint 治理", "Health check", "只进不出的出口", [
        ["矛盾 · 过时 · 孤儿 · 缺页", "缺引用 · 数据缺口", "仅描述，未实现"],
        ["[未实现]  README 待办里列着 cw lint", "", "find contradictions, gaps"],
        ["[已做实]  8 项检查", "过时 = date_updated > 90 天", "冲突检测后让人来判"],
    ]),
]

ROW_Y = [67.0, 54.0, 41.0, 28.0, 15.0, 2.0]
ROW_H = 11.6

for (label, sub, badge, cells), y0 in zip(ROWS, ROW_Y):
    # 行标签
    ax.add_patch(FancyBboxPatch((3, y0), 21.5, ROW_H,
                 boxstyle="round,pad=0.35,rounding_size=1.0",
                 facecolor="#EDF2F7", edgecolor=LINE, linewidth=1.6, zorder=2))
    ax.text(13.75, y0 + ROW_H - 3.6, label, ha="center", fontsize=10.6,
            fontweight="bold", color=DARK, zorder=4)
    ax.text(13.75, y0 + 4.2, sub, ha="center", fontsize=8.4,
            color=GREY, zorder=4)
    ax.text(13.75, y0 + 1.4, badge, ha="center", fontsize=8.4,
            fontweight="bold", color=LINE, zorder=4)

    # 三个单元格
    for (x0, x1, _, color, tint, _), lines in zip(COLS, cells):
        ax.add_patch(FancyBboxPatch((x0, y0), x1 - x0, ROW_H,
                     boxstyle="round,pad=0.35,rounding_size=1.0",
                     facecolor="white", edgecolor=color, linewidth=1.4, zorder=2))
        ys = y0 + ROW_H - 3.4
        for ln in lines:
            bold = ln.startswith(("[未实现]", "[已做实]")) or "牵动" in ln \
                   or "stale" in ln
            ax.text(x0 + 1.8, ys, ln, ha="left", fontsize=8.5,
                    fontweight="bold" if bold else "normal",
                    color=color if bold else DARK, zorder=4)
            ys -= 2.55

plt.savefig("knowledge-engineering-implementations.png", dpi=150,
            bbox_inches="tight", facecolor="white", pad_inches=0.3)
print("saved: knowledge-engineering-implementations.png")
