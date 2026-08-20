#!/usr/bin/env python3
"""
敏感词扫描脚本
- 扫描所有博客
- 报告敏感词位置
- 不直接修改，由用户确认后手动替换
"""
import re
from pathlib import Path

posts_dir = Path('/root/repos/sunrong1.github.io/src/posts')

# 完整敏感词清单
SENSITIVE_KEYWORDS = {
    # 个人信息
    '个人信息': ['孙荣', 'sunrong', 'SunRong', 'MR.Sun', 'Mr.Sun', 'Mr. Sun'],
    # 公司
    '公司': ['华为', 'Huawei', 'Momenta', '文远', 'WeRide', '字节', 'ByteDance',
           '阶跃', 'StepFun', '小红书', '阿里', '阿里云', 'Alibaba', 'Aliyun',
           '腾讯', 'Tencent', '百度', 'Baidu', '美团', 'Meituan', '拼多多',
           'Pinduoduo', '蚂蚁', '蚂蚁集团', '京东', 'JD', '滴滴', 'DiDi',
           '快手', 'Kwai', '理想', 'Li Auto', '蔚来', 'NIO', '小鹏', 'Xpeng',
           '小米', 'Xiaomi', '大疆', 'DJI', 'OPPO', 'VIVO', 'vivo',
           '微软', 'Microsoft', 'Google', 'OpenAI', 'Anthropic', 'Meta',
           '西门子', 'Siemens', 'ABB', '是德', 'Keysight', '优必选', 'UBTECH'],
    # 职业决策
    '职业决策': ['跳槽', '离职', '裁员', '被裁', 'HR谈话', '辞退', '开除'],
    # 财务
    '薪资数字': [],
    # 时间
    '年限': [],
    # 招聘平台
    '招聘平台': ['BOSS直聘', '猎聘', '拉勾', '智联'],
    # 内部项目代号
    '项目代号': ['HERO', 'TMG', '云核', '无线'],
}

# 数字 + K 薪资模式
SALARY_PATTERNS = [
    (r'\d{1,3}K\b', '数字K'),
    (r'\d{1,3}k\b', '数字k'),
    (r'\d{1,3}-\d{1,3}K\b', '范围K'),
    (r'\d{1,3}-\d{1,3}k\b', '范围k'),
]

# 检索
def scan_blog(md_path):
    """扫描单篇博客"""
    content = md_path.read_text(encoding='utf-8')
    findings = []

    # 文本敏感词
    for category, keywords in SENSITIVE_KEYWORDS.items():
        for kw in keywords:
            if kw in content:
                count = content.count(kw)
                findings.append((category, kw, count))

    # 数字 + K 薪资
    for pattern, name in SALARY_PATTERNS:
        matches = list(re.finditer(pattern, content))
        if matches:
            findings.append(('薪资数字', f'{name} ({len(matches)} 处)', len(matches)))

    return findings

# 全局扫描
all_findings = {}
total_blogs = 0
total_issues = 0

for md in sorted(posts_dir.rglob('*.md')):
    if md.name.lower() == 'readme.md':
        continue
    total_blogs += 1
    findings = scan_blog(md)
    if findings:
        all_findings[md.relative_to(posts_dir)] = findings
        total_issues += len(findings)

print(f'=== 敏感词扫描报告 ===')
print(f'总博客数: {total_blogs}')
print(f'有问题的博客数: {len(all_findings)}')
print(f'总问题数: {total_issues}')
print()

# 按问题分类
from collections import defaultdict
category_summary = defaultdict(list)
for blog, findings in all_findings.items():
    for category, kw, count in findings:
        category_summary[category].append((blog, kw, count))

for category, items in sorted(category_summary.items()):
    print(f'\n【{category}】：{len(items)} 篇博客')
    for blog, kw, count in items[:20]:  # 最多显示 20 篇
        print(f'  - {blog}: "{kw}" ({count} 次)')
    if len(items) > 20:
        print(f'  ...还有 {len(items) - 20} 篇')
