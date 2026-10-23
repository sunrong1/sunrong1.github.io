#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
L1.5 契约层提取器：抽取源文件的头部文档注释
============================================
AST（repo map）给不了「为什么」，但很多项目把「为什么」写在了文件头的
块注释里。这一层就是把它们抽出来 —— 零幻觉、零 LLM。

用法：
    python3 extract-header-docs.py <src_root> [-o out.md] [--min-chars 40]

支持：
  - <script setup> 之后的第一个 /** */ 块注释
  - .ts/.js 文件开头的 /** */ 块注释
  - 连续 /** */ 之后紧跟的 // 行注释（补充说明）
"""
import argparse
import re
import sys
from pathlib import Path

EXT = (".ts", ".tsx", ".js", ".jsx", ".vue", ".py", ".go", ".java", ".rs", ".rb")

BLOCK_RE = re.compile(r"/\*\*.*?\*/", re.S)
SCRIPT_RE = re.compile(r"<script[^>]*>", re.I)
LINE_RE = re.compile(r"^(?://|#)\s?(.*)$")


def clean(doc: str) -> str:
    """去掉每行前导的 * 和对齐空格。"""
    lines = []
    for ln in doc.split("\n"):
        ln = re.sub(r"^\s*\*\s?", "", ln).rstrip()
        lines.append(ln)
    # 去掉首尾空行
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return "\n".join(lines)


def extract(path: Path) -> str | None:
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return None

    # 优先取 <script> 标签之后的块注释
    m = SCRIPT_RE.search(text)
    start = m.end() if m else 0
    region = text[start:]

    bm = BLOCK_RE.search(region)
    if not bm:
        return None
    doc = clean(bm.group(0))

    # 块注释后紧跟的行注释也收进来（补充说明常在这里）
    tail = region[bm.end():]
    extra = []
    for raw in tail.split("\n"):
        s = raw.strip()
        if not s:
            if extra:
                break
            continue
        lm = LINE_RE.match(s)
        if lm:
            extra.append(lm.group(1).rstrip())
        elif extra:
            break
        else:
            break
    if extra:
        doc += "\n" + "\n".join(extra)

    return doc if doc.strip() else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src", nargs="?", default="src")
    ap.add_argument("-o", "--out")
    ap.add_argument("--min-chars", type=int, default=40)
    args = ap.parse_args()

    root = Path(args.src)
    files = [p for p in sorted(root.rglob("*"))
             if p.is_file() and p.suffix in EXT and "node_modules" not in p.parts]

    found, missed = [], []
    for p in files:
        doc = extract(p)
        if doc and len(doc) >= args.min_chars:
            found.append((p, doc))
        else:
            missed.append(p)

    out = []
    out.append(f"# 文件头注释提取（L1.5 契约层）\n")
    out.append(f"> 源目录：`{root}`")
    out.append(f"> 有头注释：**{len(found)}** / 共 {len(files)} 个源文件 "
               f"（{len(found)*100//max(len(files),1)}%）\n")
    out.append("---\n")
    for p, doc in found:
        out.append(f"### {p}\n\n{doc}\n")

    text = "\n".join(out)
    if args.out:
        Path(args.out).write_text(text, encoding="utf-8")
        print(f"已写入 {args.out}（{len(text)} 字符）")
    else:
        print(text)

    print(f"\n有头注释: {len(found)}/{len(files)} "
          f"({len(found)*100//max(len(files),1)}%)", file=sys.stderr)
    ext_found, ext_all = {}, {}
    for p, _doc in found:
        ext_found[p.suffix] = ext_found.get(p.suffix, 0) + 1
    for p in files:
        ext_all[p.suffix] = ext_all.get(p.suffix, 0) + 1
    for ext, n in sorted(ext_all.items(), key=lambda kv: -kv[1]):
        f = ext_found.get(ext, 0)
        flag = "  <== 失效" if f == 0 else ""
        print(f"  {ext:8s} {f:>3}/{n:<3} ({f*100//max(n,1):>3}%){flag}",
              file=sys.stderr)


if __name__ == "__main__":
    main()
