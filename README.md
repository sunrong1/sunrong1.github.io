# Dave Dev Fun

> Dev together, innovate, fun! —— 一个开发人的自我修养

🌐 **线上站点**：<https://sunrong.site>

VuePress 2 驱动的个人技术博客。写 AI 工程实践、职场成长、认知学习，也写带娃。

---

## 📚 这里有什么

169 篇长文。篇数会持续增长，下表是 2026-11 的快照。

| 分类 | 源目录 | 篇数 | 内容 |
| --- | --- | --- | --- |
| **AI 实践** | `src/posts/ai-practice/` | 102 | AI 理论 39 · AI 应用 37 · vibe-coding 1 · 顶层 25 |
| **学习洞见** | `src/posts/learning/` | 29 | 洞见 26 · 认知 1 · 英语 2 |
| **职场成长** | `src/posts/career/` | 20 | 求职、面试、职业选择；成长系列 4 · 技术论文 2 |
| **育儿心得** | `src/posts/parenting/` | 9 | Max STEM 课程与家庭教育 |
| **开发技术** | `src/posts/dev/` | 6 | Java 2 · 算法 1 · 数据库 1 · 远程开发 1 |
| **生活** | `src/posts/life/` | 3 | 碎片记录 |

**AI 实践占六成**（102/169），是这个站的主线。其余分类按「工作里真遇到的问题」长出来，不是先立目录再填内容。

除目录分类外，文章还带 `categories` / `tags`，会生成独立聚合页：

- 分类页：`/category/<名称>/`（当前 41 个）
- 标签页：`/tag/<名称>/`（当前 462）

---

## 🚀 本地跑起来

需要 Node.js 20+。

```bash
npm ci          # 安装依赖
npm run dev     # 本地预览 http://localhost:8080
npm run build   # 构建到 src/.vuepress/dist
```

---

## ✍️ 写一篇新文章

### 1. 放对目录

分类归属由**目录位置**决定，侧边栏是按目录结构自动生成的。

| 要发在哪 | 放哪 |
| --- | --- |
| AI 理论 / AI 应用 | `src/posts/ai-practice/ai-theory/` · `ai-app/` |
| 职场成长 | `src/posts/career/` |
| 学习洞见 | `src/posts/learning/insights/` |
| 开发技术 | `src/posts/dev/<子主题>/` |
| 育儿心得 | `src/posts/parenting/` |

> ⚠️ 不要把 `.md` 直接丢在 `src/posts/` 根目录 —— 那里没有侧边栏归属。

### 2. frontmatter

```yaml
---
title: 文章标题
icon: compass            # Font Awesome 图标名，见 theme.ts 的 icon.prefix
date: 2026-11-07         # 发布时间，决定列表排序
update: 2026-11-07       # 最后更新（可选）
categories:              # 分类，数组
  - 职业发展
tags:                    # 标签，数组
  - 系统思维
  - 工程方法
author: Mr.Sun
---
```

- `categories` / `tags` **用复数数组形式**（一篇文章可属多个分类）。单数 `category:` / `tag:` 也能识别，历史文章里有混用，新文章一律用复数。
- `icon` 不写也能发，但列表里会少一个视觉锚点。
- `cover` 可选，指向 `src/images/` 下的图片。

### 3. 正文从场景开篇

技术文章按这个顺序写：**使用场景 → 使用样例 → 深入分析**。

先说「什么情况下你会需要这东西」，再给可复制的输入 / 命令 / prompt，最后才讲架构和设计取舍。上来就贴目录结构和类名清单的，读者接不住。

---

## 🚀 发布

```
push master ──► GitHub Actions(约 2 分钟) ──► 推 gh-pages 分支 ──► Pages 构建(数小时) ──► sunrong.site
```

CI 配置在 `.github/workflows/deploy.yml`，Node 20 → `npm ci` → `npm run build` → `peaceiris/actions-gh-pages` 推到 `gh-pages` 分支。

> ⚠️ **别以为 push 完就上线了。** Pages 的构建周期是**小时级**（实测 6–19 小时），线上内容在构建**完成**时才切换。
> ⭐ 所以推完之后线上还是旧内容，这是正常的，别急着改代码重推 —— 重推只会多排一个构建。
> ⭐ 判断有没有上线，看 `GET /repos/{owner}/{repo}/pages` 的 `status`：`built` = 已上线，`building` = 还在构建，`errored` = 构建失败。
> ⭐ 真实失败会在 **10 分钟内**报 `errored`；超过 10 分钟还在 `building`，基本就是正常的慢构建。

**本地也能手动部署**（需要仓库写权限）：

```bash
npm run deploy
```

> ⚠️ **构建内存会随文章数增长。** CI 里设了 `NODE_OPTIONS=--max-old-space-size=6144`（GitHub runner 约 7GB 内存，4096 不够用）。文章逼近 200 篇时这个值可能失效 —— 届时单纯加内存没用，需要拆构建或换静态生成器。改 CI 时别把这个 env 删了。

---

## 🔒 内容约束

这个博客是公开的。**写作和提交前过一遍这份清单：**

| 不写 | 替代做法 |
| --- | --- |
| 真名、笔名 | 用「我」/「Mr.Sun」 |
| 职级、公司内部信息 | 描述问题本身，不描述组织 |
| 团队人数、薪资、绩效细节 | 用量级区间（"数十人"）或不提 |
| 具体厂商的未公开信息 | 写公开资料能佐证的部分 |
| 内部系统截图（带真实域名/内网地址） | 脱敏后重画，或用示意图 |

**引用别人的框架要注明出处**（书名、论文、标准、官方文档）。

---

## 🧩 站点配置在哪改

| 想改什么 | 改哪个文件 |
| --- | --- |
| 站点标题、描述、SEO、统计脚本 | `src/.vuepress/config.ts` |
| 导航栏 | `src/.vuepress/navbar.ts` |
| 侧边栏分类树 | `src/.vuepress/sidebar.ts` |
| 作者信息、社交链接、加密文章、评论、搜索 | `src/.vuepress/theme.ts` |
| 首页 | `src/README.md`（VuePress 的首页约定） |
| 「关于我」 | `src/intro.md` |
| 全局样式 | `src/.vuepress/styles/` |

> 💡 `src/README.md` 是**网站首页**，不是仓库说明。仓库说明是根目录这个文件。

---

## ⚠️ 踩过的坑

**构建 OOM。** vuepress-vite 构建期内存随文章数线性增长，150 篇左右就吃满 runner 默认堆，报 `exit code 134`。修法是把 `NODE_OPTIONS` 提到 6144。

**搜索框消失。** `vuepress-theme-hope` 不会自动启用搜索插件，必须在 `theme.ts` 的 `plugins.search` 里显式配置。删了 `config.ts` 里的 `searchPlugin` 又没在 theme 补回来，导航栏就没搜索框了。

**改目录名或文件名后老链接 404。** `theme.ts` 里 `plugins.redirect` 可以配 301 跳转，改名时同步加一条。

**表格里放 wikilink 会破版。** 竖线要转义成 `\|`，否则 Markdown 表格会按竖线切列，把链接截断成 `[[`。

---

## 📄 License

MIT
