---
date: 2026-03-18
author: Mr.Sun
tags:
  - 开源项目
  - 测试技术
category: 使用指南
cover: /assets/images/github-actions-blog.png
---

# GitHub Actions 自动构建部署博客教程

> 本文介绍如何使用 GitHub Actions 自动构建和部署 VuePress 博客，实现"推送即发布"的自动化工作流。

<!-- more -->

## 📋 背景

之前我的博客部署流程是这样的：

```bash
# 1. 写 markdown 文章
vim src/posts/my-post.md

# 2. 本地构建
npm run build

# 3. 推送到 gh-pages 分支
npm run deploy
```

这个流程有几个问题：

1. **需要本地构建** - 每次发布都要等构建完成
2. **依赖本地环境** - Node.js 版本、依赖包等可能不一致
3. **容易出错** - 忘记构建就直接推送，导致线上代码不是最新
4. **无法回滚** - 构建产物提交到 git，历史记录混乱

---

## 🎯 解决方案：GitHub Actions

使用 GitHub Actions 后，流程简化为：

```bash
# 1. 写 markdown 文章
vim src/posts/my-post.md

# 2. 提交并推送
git add src/posts/my-post.md
git commit -m "feat: 新文章"
git push origin main

# 3. 等待自动部署（1-2 分钟）
# GitHub Actions 会自动构建并部署
```

---

## 🔧 配置步骤

### 步骤 1：创建 Workflow 文件

在仓库中创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Blog to GitHub Pages

on:
  push:
    branches:
      - main

  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build with VuePress
        run: npm run build
        env:
          NODE_ENV: production

      - name: Copy CNAME
        run: cp CNAME src/.vuepress/dist/

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./src/.vuepress/dist
          publish_branch: gh-pages
          user_name: 'github-actions[bot]'
          user_email: 'github-actions[bot]@users.noreply.github.com'
          commit_message: 'chore: auto deploy from main branch'
```

### 步骤 2：推送到 GitHub

```bash
# 添加 workflow 文件
git add .github/workflows/deploy.yml

# 提交
git commit -m "chore: add GitHub Actions auto deploy workflow"

# 推送到 main 分支
git push origin main
```

### 步骤 3：启用 GitHub Actions

1. 访问 https://github.com/你的用户名/你的仓库名/actions
2. 如果是第一次使用，点击 **"I understand my workflows, go ahead and enable them"**
3. 确认工作流已启用

### 步骤 4：验证部署

1. 访问 https://github.com/你的用户名/你的仓库名/actions
2. 查看构建日志，确认构建成功
3. 访问博客，确认新文章已发布

---

## 📊 工作流程对比

### 之前的流程

```
┌─────────────┐
│ 写 markdown  │
└──────┬──────┘
       ↓
┌─────────────┐
│ 本地构建    │ ← 耗时、依赖环境
└──────┬──────┘
       ↓
┌─────────────┐
│ 推送 gh-pages│
└──────┬──────┘
       ↓
┌─────────────┐
│ GitHub Pages│
└─────────────┘
```

### 现在的流程

```
┌─────────────┐
│ 写 markdown  │
└──────┬──────┘
       ↓
┌─────────────┐
│ git push    │ ← 只需这一步
└──────┬──────┘
       ↓
┌─────────────┐
│  Actions    │ ← GitHub 自动构建
└──────┬──────┘
       ↓
┌─────────────┐
│ GitHub Pages│
└─────────────┘
```

---

## ✅ 优势总结

| 方面 | 之前 | 现在 |
|------|------|------|
| **构建环境** | 本地 | GitHub 统一环境 |
| **构建速度** | 依赖本地性能 | 云端并行构建 |
| **部署流程** | 手动执行命令 | 自动触发 |
| **历史记录** | 包含构建产物 | 只有源码 |
| **回滚能力** | 困难 | 简单（git revert） |
| **协作友好** | 需要统一环境 | 无需配置 |

---

## 🔍 配置说明

### 1. 触发条件

```yaml
on:
  push:
    branches:
      - main
```

- 推送到 `main` 分支时触发
- 可以改为 `master` 或其他分支名

### 2. Node.js 版本

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 20
```

- 根据你的 `package.json` 要求设置
- 建议使用 LTS 版本

### 3. 缓存依赖

```yaml
cache: npm
```

- 自动缓存 `node_modules`
- 加速后续构建

### 4. 部署配置

```yaml
- name: Deploy to gh-pages
  uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./src/.vuepress/dist
    publish_branch: gh-pages
```

- `publish_dir`: 构建产物目录
- `publish_branch`: 部署分支
- `GITHUB_TOKEN`: 自动提供的 token，无需手动配置

---

## 🐛 常见问题

### 问题 1：构建失败

**现象：** Actions 显示构建失败

**排查：**

1. 检查 `package.json` 中的 `build` 命令是否正确
2. 查看构建日志，找到具体错误信息
3. 本地执行 `npm run build` 测试

### 问题 2：部署后博客未更新

**现象：** Actions 成功，但博客内容未变

**排查：**

1. 检查 `publish_dir` 路径是否正确
2. 确认 `CNAME` 文件是否复制
3. 清除浏览器缓存

### 问题 3：权限错误

**现象：** 推送 gh-pages 分支失败

**解决：**

```yaml
permissions:
  contents: write
```

确保 workflow 有写入权限。

---

## 📚 参考资料

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [VuePress 部署指南](https://vuepress.vuejs.org/zh/guide/deploy.html)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [GitHub Pages 文档](https://pages.github.com/)

---

## 🎉 总结

使用 GitHub Actions 后，博客部署变得简单可靠：

- ✅ **自动化** - 推送即发布
- ✅ **标准化** - 统一构建环境
- ✅ **可追溯** - 每次部署都有记录
- ✅ **易协作** - 团队成员无需配置环境

强烈推荐给所有使用 GitHub Pages 的朋友！

---

_本文完_
