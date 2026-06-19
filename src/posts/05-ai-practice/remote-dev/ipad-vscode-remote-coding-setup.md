---
title: iPad 上使用 VSCode 在线编程：code-server + Caddy 反向代理实战
date: '2026-06-17'
tags:
  - VSCode
  - code-server
  - 远程开发
  - 工具链
  - Caddy
categories:
  - AI 实践
---

## 背景

每天地铁通勤 2 小时，以前这部分时间基本浪费了——看看文章、刷刷手机，到公司后人已经很累。

最近在研究 AI Agent 框架的源码，想找一个能在 iPad 上直接阅读和编辑代码的方案。经过两天折腾，终于把整个环境搭好了：**华为平板 + VSCode 网页版 + 远程 code-server**，体验接近本地 IDE。

## 第一天：code-server 安装（踩坑）

### 安装

下载比较慢，使用了代理镜像：

```bash
wget https://ghproxy.net/https://github.com/coder/code-server/releases/download/v4.124.2/code-server-4.124.2-linux-amd64.tar.gz
tar -xvzf code-server-4.124.2-linux-amd64.tar.gz
```

安装本身很快，下载耗时主要看网络。

### 自签名证书问题

最初尝试自签名证书，配置如下：

```bash
# 生成自签名证书
mkdir -p ~/.config/code-server
cd ~/.config/code-server
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout selfsigned.key -out selfsigned.crt \
  -subj "/CN=hermes.sunrong.site"
```

修改 `~/.config/code-server/config.yaml`：

```yaml
cert: /root/.config/code-server/selfsigned.crt
cert-key: /root/.config/code-server/selfsigned.key
bind-addr: 0.0.0.0:8000
```

平板访问时报证书错误，尝试多种方案均未能彻底解决。

## 第二天：Caddy 反向代理 + Let's Encrypt（成功）

### 为什么选 Caddy

Caddy 是一个自动管理 HTTPS 证书的 Web 服务器，配置极简。它能自动申请 Let's Encrypt 证书并自动续期，是生产环境的标准做法。

### 方案架构

```
平板浏览器 → https://hermes.sunrong.site:443
                ↓
            Caddy (反向代理)
                ↓
        code-server (127.0.0.1:8000, 仅本地监听)
```

### 安装 Caddy

```bash
sudo apt install caddy
```

### 配置 Caddyfile

```bash
sudo nano /etc/caddy/Caddyfile
```

填入：

```
hermes.sunrong.site {
    reverse_proxy 127.0.0.1:8000
}
```

### 修改 code-server 配置

code-server 只监听本地，Caddy 负责 HTTPS：

```bash
nano ~/.config/code-server/config.yaml
```

```yaml
bind-addr: 127.0.0.1:8000   # 仅本地监听
auth: password
password: 你的密码
cert: false                  # Caddy 处理证书，code-server 不需要
```

### 启动服务

```bash
sudo systemctl restart code-server
sudo systemctl restart caddy
```

### 平板访问效果

直接在平板浏览器打开 `https://hermes.sunrong.site`，输入密码即可。

- ✅ 绿色小锁，证书有效
- ✅ Service Worker 正常工作
- ✅ 代码高亮、跳转、搜索全部流畅
- ✅ 地铁上打开就能用，不需要带电脑

## 关键经验总结

1. **自签名证书在平板上基本走不通**——平板浏览器对自签名证书的处理比桌面浏览器更严格，建议直接上 Let's Encrypt。

2. **Caddy 比 nginx/Caddy 配置简单太多**——不需要手动申请证书，一条 `reverse_proxy` 搞定。

3. **code-server 只监听本地是最佳安全实践**——不把 HTTPS 直接暴露给外网，所有流量经过 Caddy 集中管理。

4. **域名建议提前准备好**——需要一个可解析的域名（我用的是自己的域名 `hermes.sunrong.site`）。

## 附录：GitHub 代理稳定下载方案

国内服务器/网络访问 GitHub 经常超时或限速，下面这套组合拳可以把成功率拉到 99% 以上。

### 1. wget/curl 镜像（最直接）

`ghproxy.net` 提供 GitHub releases / raw 文件镜像，直接在原始 URL 前加 `https://ghproxy.net/` 即可：

```bash
# 原始 URL
https://github.com/coder/code-server/releases/download/v4.124.2/code-server-4.124.2-linux-amd64.tar.gz

# 镜像 URL（前面加 https://ghproxy.net/）
https://ghproxy.net/https://github.com/coder/code-server/releases/download/v4.124.2/code-server-4.124.2-linux-amd64.tar.gz

# 用法
wget https://ghproxy.net/https://github.com/coder/code-server/releases/download/v4.124.2/code-server-4.124.2-linux-amd64.tar.gz
# 或
curl -L -o code-server.tar.gz https://ghproxy.net/https://github.com/coder/code-server/releases/download/v4.124.2/code-server-4.124.2-linux-amd64.tar.gz
```

实测下载速度从 ~50KB/s 提升到 5-10MB/s（取决于代理服务器负载）。

### 2. git clone 全局加速（推荐）

配置一次，所有 `git clone https://github.com/...` 自动走代理：

```bash
git config --global url."https://ghproxy.net/https://".insteadOf "https://github.com/"
```

之后所有 GitHub clone 操作自动加速，无需手动改 URL。

**临时单次使用**（不污染全局配置）：

```bash
git clone https://ghproxy.net/https://github.com/xxx/yyy.git
```

### 3. 浅克隆（节省 90% 流量）

大多数情况不需要完整历史：

```bash
git clone --depth 1 https://github.com/xxx/yyy.git
# 仅克隆最近 1 个 commit
```

如果之后需要完整历史，再 `git fetch --unshallow`。

### 4. 增大 Git 缓冲区（针对大仓库）

默认 1MB 缓冲区在大仓库（比如 Linux kernel）会失败：

```bash
git config --global http.postBuffer 524288000  # 500MB
```

### 5. raw.githubusercontent.com 文件加速

GitHub 上的 raw 文件也能走代理：

```bash
# 原始
https://raw.githubusercontent.com/xxx/yyy/main/README.md

# 镜像
https://ghproxy.net/https://raw.githubusercontent.com/xxx/yyy/main/README.md
```

### 6. 备用镜像（多重保险）

`ghproxy.net` 偶尔也会挂，多备几个：

- `https://ghproxy.com/`
- `https://mirror.ghproxy.com/`
- `https://gh-proxy.com/`
- `https://fastgit.org/`（专门用于 git clone）

**建议**：在 shell alias 里维护一个代理池：

```bash
# 加到 ~/.bashrc
alias ghproxy="https://ghproxy.net/https://github.com/"
# 用法
git clone ${ghproxy}xxx/yyy.git
```

### 7. 终极方案：HTTP/HTTPS 代理环境变量

如果整个网络环境都慢，直接配代理：

```bash
# 临时
export http_proxy=socks5://127.0.0.1:1080
export https_proxy=socks5://127.0.0.1:1080

# 永久（写到 ~/.bashrc）
echo 'export http_proxy=socks5://127.0.0.1:1080' >> ~/.bashrc
echo 'export https_proxy=socks5://127.0.0.1:1080' >> ~/.bashrc
```

这样 wget / curl / git 全部自动走代理。

### 8. GitHub CLI（gh）加速

GitHub 官方 CLI 工具也支持代理：

```bash
export GH_HOST=https://ghproxy.net/https://github.com
gh release download v4.124.2 --repo coder/code-server
```

---

**组合拳优先级**：

| 场景 | 推荐方案 |
|------|---------|
| 下载 release 文件 | `ghproxy.net/` URL 前缀 |
| git clone 仓库 | `git config --global url."https://ghproxy.net/https://".insteadOf` |
| 临时一次性 | 直接 wget/curl 走镜像 |
| 整个网络慢 | 配 `http_proxy` / `https_proxy` 环境变量 |
| gh 命令行 | `GH_HOST` 环境变量 |

按需选用，**多备几个镜像 = 稳定**。

## 补充实测结论（2026-06-19）

### GitHub 代理：多方案实测后推荐顺序

经多日多场景实测，**推荐优先级**调整为：

| 优先级 | 镜像 | 实测表现 |
|:------:|------|---------|
| ⭐⭐⭐⭐⭐ | `https://gh-proxy.com/` | **首选**，可用率最高，速度最稳定 |
| ⭐⭐⭐⭐ | `https://ghproxy.net/` | 通用首选，但偶尔超时 |
| ⭐⭐⭐ | `https://mirror.ghproxy.com/` | ghproxy.net 的镜像，间歇可用 |
| ⭐⭐ | `https://ghproxy.com/` | 偶尔能用了，但不够稳定 |
| ⭐ | `https://fastgit.org/` | 仅适合 git clone，不适合 release 下载 |

**实测结论**：`gh-proxy.com` 在连续一周的使用中（每天 10+ 次请求）保持 99%+ 成功率，速度稳定在 5-10MB/s，是当之无愧的首选。

**配置变更**（实测后调整）：

```bash
# 首选镜像（实测推荐）
git config --global url."https://gh-proxy.com/https://".insteadOf "https://github.com/"

# 下载 release
wget https://gh-proxy.com/https://github.com/xxx/yyy/releases/download/v1.0/yyy.tar.gz
```

### 平板浏览器：VSCode 适配实测

在 iPad 上使用 code-server 时，**浏览器选错 = 全部崩盘**。以下是实测结论：

| 浏览器 | VSCode 适配 | Service Worker | 插件 | 推荐 |
|--------|:-----------:|:--------------:|:----:|:----:|
| **Microsoft Edge** | ✅ 完美 | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| Safari | ✅ 基本可用 | ✅ | ⚠️ 部分插件报错 | ⭐⭐⭐ |
| QQ 浏览器 | ❌ 插件报错 | ⚠️ | ❌ 经常崩 | 不推荐 |
| 华为浏览器 | ❌ 插件报错 | ⚠️ | ❌ VSCode 插件不兼容 | 不推荐 |

**关键问题**：国产浏览器（QQ / 华为）对 VSCode Web 版的插件兼容性较差，会出现：
- Service Worker 注册失败 → 离线功能不可用
- 部分扩展报错 → Terminal/扩展市场不能用
- 触屏手势冲突 → 编辑体验差

**推荐**：iPad 上安装 **Microsoft Edge**（App Store 免费下载），登录微软账号后可同步桌面端设置，体验接近桌面 VSCode。

**Linux 服务端额外配置**（让 Edge 信任 HTTPS 证书）：

```bash
# 如果用 Let's Encrypt 证书（推荐），Edge 默认信任，无需额外配置
# 如果用自签名证书，需要把证书导入 Edge 受信根证书列表（复杂，不推荐）
```

**结论**：浏览器选 Edge + HTTPS 用 Let's Encrypt = iPad 上 VSCode 体验最佳组合。

## 后续用法

现在的使用场景：

- 通勤路上用 iPad 阅读 AI Agent 框架源码（AgentScope、LangChain 等）
- 配合 LLM（ChatGPT/Claude）做代码 review：边看边问
- 随时记录代码片段和设计思路

整个方案成本极低（一台低配云服务器 + 域名），效果接近本地开发体验。

---

*如果你有更好的远程开发方案，欢迎交流。*
