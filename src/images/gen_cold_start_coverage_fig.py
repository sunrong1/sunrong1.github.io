#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""冷启动实测：repo map 三档 token 的目录覆盖率"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "WenQuanYi Zen Hei"]
plt.rcParams["axes.unicode_minus"] = False

C4K = "#2B6CB0"   # 蓝
C20K = "#2F855A"  # 绿
C60K = "#805AD5"  # 紫
MISS = "#C53030"  # 红（漏掉的）
GREY = "#718096"
DARK = "#1A202C"

fig, ax = plt.subplots(figsize=(15, 8.6), dpi=150)

dirs = ["core", "services", "app", "content", "components", "views"]
total = [14, 8, 5, 4, 16, 2]
c4 = [12, 8, 5, 4, 0, 0]
c20 = [13, 8, 5, 4, 0, 0]
c60 = [12, 8, 5, 4, 0, 0]

x = np.arange(len(dirs))
w = 0.26

# 画「漏掉的部分」用红色斜纹底
for i in range(len(dirs)):
    for off, cov, col in ((-w, c4, C4K), (0, c20, C20K), (w, c60, C60K)):
        miss = total[i] - cov[i]
        if miss > 0:
            ax.bar(x[i] + off, miss, bottom=cov[i], width=w * 0.92,
                   color="#FFF5F5", edgecolor=MISS, hatch="///", linewidth=1.4,
                   zorder=2)
    for off, cov, col in ((-w, c4, C4K), (0, c20, C20K), (w, c60, C60K)):
        ax.bar(x[i] + off, cov, width=w * 0.92, color=col, zorder=3,
               edgecolor="white", linewidth=0.6)

for i in range(len(dirs)):
    for off, cov in ((-w, c4[i]), (0, c20[i]), (w, c60[i])):
        ax.text(x[i] + off, cov + 0.35, str(cov), ha="center", va="bottom",
                fontsize=9, color=DARK, zorder=4)

ax.set_xticks(x)
ax.set_xticklabels([f"src/{d}/" for d in dirs], fontsize=11.5)
ax.set_ylabel("被 repo map 覆盖的文件数", fontsize=11)
ax.set_ylim(0, 18.5)
ax.grid(axis="y", alpha=0.25, zorder=0)
ax.set_axisbelow(True)

from matplotlib.patches import Patch
from matplotlib.lines import Line2D
ax.legend(handles=[
    Patch(facecolor=C4K, label="4k token"),
    Patch(facecolor=C20K, label="20k token"),
    Patch(facecolor=C60K, label="60k token"),
    Patch(facecolor="#FFF5F5", edgecolor=MISS, hatch="///", label="未覆盖（漏）"),
], loc="upper left", bbox_to_anchor=(0.005, 0.995), fontsize=10, framealpha=0.95, ncol=2)

fig.suptitle("repo map 覆盖率实测：token 翻 15 倍，components 仍是 0",
             fontsize=17, fontweight="bold", color=DARK, y=0.975)
fig.text(0.5, 0.935, "真实 TypeScript + Vue 项目 · 412 文件 / 65,775 行 · aider v0.86.2",
         ha="center", fontsize=11, color=GREY)

# 底部注解
fig.text(0.5, 0.035,
         "components/ 与 views/ 共 18 个 .vue 文件 —— 三档预算全部为 0\n"
         "根因：<script setup> 的顶层绑定不是 export，aider 的 repo map 只收 def / ref 标签",
         ha="center", fontsize=11, color=DARK,
         bbox=dict(boxstyle="round,pad=0.6", facecolor="#EDF2F7", edgecolor="#2D3748",
                   linewidth=1.2))

plt.tight_layout(rect=[0, 0.09, 1, 0.92])
plt.savefig("cold-start-repo-map-coverage.png", dpi=150, facecolor="white")
print("saved: cold-start-repo-map-coverage.png")
