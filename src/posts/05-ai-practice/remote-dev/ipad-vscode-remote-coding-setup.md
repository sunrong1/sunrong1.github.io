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

## 后续用法

现在的使用场景：

- 通勤路上用 iPad 阅读 AI Agent 框架源码（AgentScope、LangChain 等）
- 配合 LLM（ChatGPT/Claude）做代码 review：边看边问
- 随时记录代码片段和设计思路

整个方案成本极低（一台低配云服务器 + 域名），效果接近本地开发体验。

---

*如果你有更好的远程开发方案，欢迎交流。*
