#!/usr/bin/env python3
"""批量把 categories: → category: 和 tags: → tag:（只在 frontmatter 内）"""
import re
from pathlib import Path

POSTS_DIR = Path("/workspace/sunrong1.github.io/src/posts")

def fix_file(path: Path) -> bool:
    """修复单个 .md 文件的 frontmatter。返回是否改动。"""
    content = path.read_text(encoding="utf-8")

    if not content.startswith("---\n"):
        return False

    m = re.search(r"\n---\n", content[4:])
    if not m:
        return False

    end_idx = m.start() + 4 + 4
    front = content[4:end_idx]
    body = content[end_idx:]

    new_front = front
    changed = False

    if re.search(r"^categories:", new_front, re.MULTILINE):
        new_front = re.sub(r"^categories:", "category:", new_front, flags=re.MULTILINE)
        changed = True

    if re.search(r"^tags:", new_front, re.MULTILINE):
        new_front = re.sub(r"^tags:", "tag:", new_front, flags=re.MULTILINE)
        changed = True

    if changed:
        new_content = "---\n" + new_front + "---\n" + body
        path.write_text(new_content, encoding="utf-8")

    return changed

def main():
    fixed = []
    for md in POSTS_DIR.rglob("*.md"):
        if fix_file(md):
            fixed.append(md)

    print(f"修复文件数: {len(fixed)}")
    for f in fixed[:5]:
        print(f"  {f.relative_to(POSTS_DIR.parent.parent)}")
    if len(fixed) > 5:
        print(f"  ... 还有 {len(fixed)-5} 个")

if __name__ == "__main__":
    main()
