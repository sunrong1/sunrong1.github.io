#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""CTO 路径的系统思维分析

三栏对比：现状 → 加大力度（无效）→ 换杠杆点（有效）
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "WenQuanYi Zen Hei"]
plt.rcParams["axes.unicode_minus"] = False

C_R="#C53030"; C_B="#2B6CB0"; C_POS="#2F855A"; C_NEG="#C05621"
C_EDGE="#2D3748"; C_MUT="#718096"
BR="#FFF5F5"; BB="#EBFBFF"; BG="#F0FFF4"; BY="#FFFAF0"; BW="#FAF5FF"
PU="#805AD5"

def box(ax,cx,cy,w,h,text,fc,ec,fs=9.8,lw=1.7):
    ax.add_patch(FancyBboxPatch((cx-w/2,cy-h/2),w,h,
        boxstyle="round,pad=0.30,rounding_size=0.6",
        facecolor=fc,edgecolor=ec,linewidth=lw,zorder=3))
    ax.text(cx,cy,text,ha="center",va="center",fontsize=fs,
        fontweight="bold",zorder=4,linespacing=1.32,color="#2D3748")

def link(ax,p0,p1,color=C_EDGE,lw=1.5,rad=0.0,ls="-",mut=12):
    ax.add_patch(FancyArrowPatch(p0,p1,connectionstyle=f"arc3,rad={rad}",
        arrowstyle="-|>",mutation_scale=mut,color=color,linewidth=lw,
        zorder=2,shrinkA=3,shrinkB=3,linestyle=ls))

def sg(ax,x,y,s,color,fs=12):
    ax.text(x,y,s,ha="center",va="center",fontsize=fs,fontweight="bold",
        color=color,zorder=9,bbox=dict(boxstyle="circle,pad=0.15",
        fc="white",ec=color,lw=0.9))

fig, ax = plt.subplots(figsize=(17.5, 12.4), dpi=150)
ax.set_xlim(0, 150); ax.set_ylim(0, 96); ax.axis("off")

ax.text(75, 84, "职业诊断：三种走法，同一个起点", ha="center",
        fontsize=19, fontweight="bold", color="#2D3748")

PW, PH, Y0 = 46, 58, 16
HDR = 6.6

def panel(x0, no, title, color, tint, badge, badge_fc):
    ax.add_patch(FancyBboxPatch((x0,Y0),PW,PH,
        boxstyle="round,pad=0.4,rounding_size=1.0",
        facecolor="white",edgecolor=color,linewidth=2.0))
    ax.add_patch(FancyBboxPatch((x0,Y0+PH-HDR),PW,HDR,
        boxstyle="round,pad=0.4,rounding_size=1.0",
        facecolor=tint,edgecolor="none",zorder=1))
    ax.text(x0+3.2, Y0+PH-3.4, no, ha="left", fontsize=14.5,
            fontweight="bold", color=color, zorder=4)
    ax.text(x0+10.5, Y0+PH-3.4, title, ha="left", fontsize=11.5,
            fontweight="bold", color="#2D3748", zorder=4)
    # badge 放在标题上方（面板外的空白带）
    cx = x0+PW/2
    ax.text(cx, Y0+PH+HDR/2+1.6, badge, ha="center", va="center",
            fontsize=10.2, fontweight="bold", color=color, zorder=4,
            bbox=dict(boxstyle="round,pad=0.35", fc=badge_fc, ec=color, lw=1.3))

Y = [54, 39.5, 25.5, 12]   # 四个节点的高度

# ═════ ① 现状 ═════
x=2; cx=x+PW/2
panel(x,"①","现状：越优秀，越难动",PU,BW,"基模：富者愈富 + 目标侵蚀",BW)
box(ax,cx,Y[0],30,6.2,"当前位置不错\n（专家 · 核心项目 · 带队）",BR,C_R)
box(ax,cx,Y[1],27,6,"资源和关注\n持续流向这里",BR,C_R)
box(ax,cx,Y[2],28,6,"方向决策机会\n基本没有",BY,"#DD6B20")
box(ax,cx,Y[3],30,6,"「我上不去」\n→ 目标下移",BW,PU)
link(ax,(cx,Y[0]-3.4),(cx,Y[1]+3.4),C_POS); sg(ax,cx+4.5,(Y[0]+Y[1])/2,"+",C_POS)
link(ax,(cx,Y[1]-3.4),(cx,Y[2]+3.4),C_POS); sg(ax,cx+4.5,(Y[1]+Y[2])/2,"+",C_POS)
link(ax,(cx,Y[2]-3.4),(cx,Y[3]+3.4),C_NEG); sg(ax,cx+4.5,(Y[2]+Y[3])/2,"-",C_NEG)
link(ax,(cx-11,Y[3]),(cx-11,Y[2]),C_NEG,rad=-0.5); sg(ax,cx-17,(Y[2]+Y[3])/2,"-",C_NEG)
link(ax,(cx+11,Y[3]),(cx+11,Y[0]),C_NEG,rad=0.5); sg(ax,cx+17,(Y[2]+Y[0])/2,"+",C_NEG)

# ═════ ② 加大力度 ═════
x=52; cx=x+PW/2
panel(x,"②","加大力度：做更多同类的事",C_MUT,"#F7FAFC","基模：转移负担","#F7FAFC")
box(ax,cx,Y[0],30,6.2,"焦虑：「我还不够格」","#F7FAFC",C_MUT,10)
box(ax,cx,Y[1],31,6.2,"补技术 · 考证 · 多写文章","#F7FAFC",C_MUT)
box(ax,cx,Y[2],29,6,"专业能力提升\n（这是「因」的一部分）",BB,C_B)
box(ax,cx,Y[3],31,6,"但「决策证据」\n还是 0",BR,C_R)
link(ax,(cx,Y[0]-3.4),(cx,Y[1]+3.4),C_POS); sg(ax,cx+4.5,(Y[0]+Y[1])/2,"+",C_POS)
link(ax,(cx,Y[1]-3.4),(cx,Y[2]+3.4),C_POS); sg(ax,cx+4.5,(Y[1]+Y[2])/2,"+",C_POS)
link(ax,(cx,Y[2]-3.4),(cx,Y[3]+3.4),C_NEG); sg(ax,cx+4.5,(Y[2]+Y[3])/2,"-",C_NEG)
link(ax,(cx+12,Y[3]),(cx+12,Y[0]),C_NEG,rad=0.5); sg(ax,cx+18.5,(Y[2]+Y[0])/2,"-",C_NEG)

# ═════ ③ 换杠杆 ═════
x=102; cx=x+PW/2
panel(x,"③","换杠杆：改变目标的定义",C_B,BG,"Meadows：改变目标 = 最强杠杆点",BG)
box(ax,cx,Y[0],32,6.2,"主动要一个「小方向」\n3-5 人 + 定义方向",BG,C_B)
box(ax,cx,Y[1],30,6,"在不确定中做 1-2 次\n方向性判断",BG,C_B)
box(ax,cx,Y[2],29,6,"判断被验证\n→ 拿到「决策证据」",BG,C_B)
box(ax,cx,Y[3],32,6,"上升路径变得可信\n→ 目标不再下移",BG,C_B)
link(ax,(cx,Y[0]-3.4),(cx,Y[1]+3.4),C_POS); sg(ax,cx+4.5,(Y[0]+Y[1])/2,"+",C_POS)
link(ax,(cx,Y[1]-3.4),(cx,Y[2]+3.4),C_POS); sg(ax,cx+4.5,(Y[1]+Y[2])/2,"+",C_POS)
link(ax,(cx,Y[2]-3.4),(cx,Y[3]+3.4),C_POS); sg(ax,cx+4.5,(Y[2]+Y[3])/2,"+",C_POS)
link(ax,(cx-11,Y[3]),(cx-11,Y[0]),C_POS,rad=-0.5,lw=1.8)
sg(ax,cx-16.5,(Y[2]+Y[0])/2,"+",C_POS,14)

# 面板间箭头
link(ax,(48.8,38),(51.2,38),C_EDGE,lw=2.4,mut=16)
link(ax,(98.8,38),(101.2,38),C_B,lw=2.8,mut=18)

# 副注
ax.text(25, 5.2, "把结构问题换成个人努力", ha="center", fontsize=9.0,
        color=C_MUT, style="italic")
ax.text(125, 5.2, "不是「头衔」，是「可操作的位置」", ha="center", fontsize=9.0,
        color=C_B, style="italic")

ax.text(75, 1.2, "关键区别：② 改的是「我」 —— ③ 改的是「位置」",
        ha="center", fontsize=13, fontweight="bold", color="#2D3748",
        bbox=dict(boxstyle="round,pad=0.5", fc="#EDF2F7", ec="#CBD5E0", lw=1.4))

plt.savefig("/workspace/blog/src/images/sys-cto-path-analysis.png",
            dpi=150, bbox_inches="tight", facecolor="white")
print("saved: sys-cto-path-analysis.png")
