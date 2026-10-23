#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
repo map 覆盖率实测脚本
=======================
目的：量化 aider --show-repo-map 对一个真实仓库的覆盖能力，
      并定位「哪些文件类型会被完全漏掉」。

用法：
    python3 measure-repo-map-coverage.py <repo_path> [out_dir]

依赖：aider（pip install aider-chat），仅需 --show-repo-map，不需要 LLM key。
      但 aider 启动时会检查模型，若无 key 需设一个假 key：
          export OPENAI_API_KEY=sk-fake-for-measurement

输出：
    <out_dir>/_repo-map-<tokens>.txt   各档 token 的 repo map 原文
    <out_dir>/coverage-report.md       汇总报告
"""
import os
import re
import subprocess
import sys
from collections import Counter

BUDGETS = [4000, 20000, 60000]
SRC_EXTS = (".ts", ".tsx", ".js", ".jsx", ".vue", ".py", ".go", ".java", ".rs")


def run_repo_map(repo: str, tokens: int, out_dir: str) -> str:
    """跑一次 aider --show-repo-map，落盘原文。"""
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"_repo-map-{tokens}.txt")
    env = dict(os.environ)
    env.setdefault("OPENAI_API_KEY", "sk-fake-for-measurement")
    cmd = [
        "aider", "--show-repo-map",
        "--map-tokens", str(tokens),
        "--no-gitignore", "--no-show-model-warnings",
    ]
    with open(out_path, "w", encoding="utf-8") as f:
        subprocess.run(cmd, cwd=repo, stdout=f, stderr=subprocess.DEVNULL,
                       env=env, timeout=600)
    return out_path


def norm(p: str) -> str:
    """归一化路径：去掉 ./ 前缀，统一分隔符。"""
    p = p.replace(os.sep, "/")
    return p[2:] if p.startswith("./") else p


def parse_map(path: str):
    """解析 repo map。

    实测格式（aider v0.86.x）是两段：
      1) 文件清单段：每行一个纯文件名（无冒号）
      2) 符号详情段：'路径:' 开头，后跟 │ 开头的符号行
    """
    listed, detailed = set(), set()
    for line in open(path, encoding="utf-8", errors="replace"):
        line = line.rstrip("\n")
        s = line.strip()
        if not s or s.startswith(("│", "⋮")):
            continue
        if s.endswith(":"):
            detailed.add(norm(s[:-1]))
            continue
        # 清单段：只接受「像路径」的行 —— 不含空格/引号/括号等代码符号
        if re.fullmatch(r"[\w.\-/@]+\.\w+", s):
            listed.add(norm(s))
    return listed, detailed


def source_files(repo: str):
    out = []
    for dp, dns, fs in os.walk(repo):
        dns[:] = [d for d in dns if d not in
                  (".git", "node_modules", "dist", "build", ".venv", "__pycache__")]
        for f in fs:
            if f.endswith(SRC_EXTS):
                rel = os.path.relpath(os.path.join(dp, f), repo)
                out.append(rel.replace(os.sep, "/"))
    return out


def main():
    repo = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
    out_dir = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else "./_repo-map-measure")
    os.makedirs(out_dir, exist_ok=True)

    srcs = source_files(repo)
    by_ext = Counter(os.path.splitext(s)[1] for s in srcs)
    print(f"仓库: {repo}")
    print(f"源码文件: {len(srcs)}  按类型: {dict(by_ext)}\n")

    results = {}
    for b in BUDGETS:
        p = run_repo_map(repo, b, out_dir)
        listed, detailed = parse_map(p)
        results[b] = (listed, detailed)
        hit = [s for s in srcs if s in listed]
        detail_hit = [s for s in srcs if s in detailed]
        print(f"--map-tokens {b:>6}: 有符号详情 {len(detail_hit):>3}/{len(srcs)} "
              f"({len(detail_hit)*100//max(len(srcs),1):>2}%)  "
              f"（清单段列出 {len(hit)}，仅参考）")

    # 按扩展名看「有符号详情」的比例 —— 这里会暴露 .vue 的塌陷
    print("\n按扩展名统计「有符号详情」比例（决定 LLM 能不能从 map 读到内容）：")
    for ext, cnt in sorted(by_ext.items(), key=lambda kv: -kv[1]):
        group = [s for s in srcs if s.endswith(ext)]
        _, det = results[max(BUDGETS)]
        n = sum(1 for s in group if s in det)
        flag = "  <== 完全失效" if n == 0 else ""
        print(f"  {ext:8s} {n:>3}/{cnt:<3} ({n*100//max(cnt,1):>3}%){flag}")

    with open(os.path.join(out_dir, "coverage-report.md"), "w",
              encoding="utf-8") as f:
        f.write(f"# repo map 覆盖率实测\n\n仓库: `{repo}`\n\n")
        f.write(f"源码文件总数: **{len(srcs)}**\n\n")
        f.write("| --map-tokens | 有符号详情的文件 | 覆盖率 |\n|---|---|---|\n")
        for b in BUDGETS:
            _, detailed = results[b]
            dh = sum(1 for s in srcs if s in detailed)
            f.write(f"| {b} | {dh}/{len(srcs)} | {dh*100//max(len(srcs),1)}% |\n")
        f.write("\n## 按扩展名（有符号详情）\n\n")
        f.write("| 扩展名 | 有详情/总数 | 覆盖率 |\n|---|---|---|\n")
        _, det = results[max(BUDGETS)]
        for ext, cnt in sorted(by_ext.items(), key=lambda kv: -kv[1]):
            group = [s for s in srcs if s.endswith(ext)]
            n = sum(1 for s in group if s in det)
            f.write(f"| `{ext}` | {n}/{cnt} | {n*100//max(cnt,1)}% |\n")
    print(f"\n报告已写入 {out_dir}/coverage-report.md")


if __name__ == "__main__":
    main()
