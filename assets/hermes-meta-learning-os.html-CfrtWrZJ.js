import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,a,o as l}from"./app-JlTMAkLI.js";const e={};function p(t,s){return l(),n("div",null,[...s[0]||(s[0]=[a(`<h1 id="在-hermes-上实现多-agent-元认知学习系统" tabindex="-1"><a class="header-anchor" href="#在-hermes-上实现多-agent-元认知学习系统"><span>在 Hermes 上实现多 Agent 元认知学习系统</span></a></h1><blockquote><p><strong>让 AI 帮你学习</strong> = <strong>从 L1 看过到 L5 精通的自动化路径</strong></p></blockquote><p>我做了 11 年技术，5 年 AI 转型，14 篇论文精读 + 95+ 博客。<br><strong>今天这篇博客，是我把&quot;元认知学习系统&quot;从&quot;概念&quot;变成&quot;可运行的 Hermes 多 Agent 系统&quot;的完整方案</strong>。</p><p>我用 <strong>4 个 Agent</strong>（Content / Exam / Error / Meta）构建了一个完整的学习闭环：</p><ul><li>Content Agent 读代码库 → 输出结构化知识</li><li>Exam Agent 出考试题 → 评估真实掌握度</li><li>Error Agent 分析错题 → 找出根本原因</li><li>Meta Agent 追踪进步 → 可视化元认知状态</li></ul><p><strong>这 4 个 Agent 不是孤立的工具，而是一个完整的&quot;学习操作系统&quot;</strong>——<br> 任何一环缺失，整个学习闭环都会崩塌。</p><hr><h2 id="一、为什么用-hermes" tabindex="-1"><a class="header-anchor" href="#一、为什么用-hermes"><span>一、为什么用 Hermes？</span></a></h2><h3 id="_1-1-hermes-的核心优势" tabindex="-1"><a class="header-anchor" href="#_1-1-hermes-的核心优势"><span>1.1 Hermes 的核心优势</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【Hermes Agent】= Nous Research 出品的 AI Agent 框架</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【核心能力】</span></span>
<span class="line"><span>├─ Multi-Agent 原生支持</span></span>
<span class="line"><span>├─ Skill 系统（可复用）</span></span>
<span class="line"><span>├─ Memory 系统（持久化）</span></span>
<span class="line"><span>├─ Tool 系统（灵活扩展）</span></span>
<span class="line"><span>├─ 微信生态原生（WeCom）</span></span>
<span class="line"><span>└─ → 完美的&quot;学习操作系统&quot;载体</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-为什么不用其他框架" tabindex="-1"><a class="header-anchor" href="#_1-2-为什么不用其他框架"><span>1.2 为什么不用其他框架？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【LangChain】</span></span>
<span class="line"><span>├─ 太通用 → 需要写很多胶水代码</span></span>
<span class="line"><span>├─ 调试困难 → 不适合学习系统</span></span>
<span class="line"><span>└─ → 不推荐</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【CrewAI / AutoGen】</span></span>
<span class="line"><span>├─ 上手快 → 但扩展性差</span></span>
<span class="line"><span>├─ State 管理弱 → 不适合长学习周期</span></span>
<span class="line"><span>└─ → 备选</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【AgentScope】</span></span>
<span class="line"><span>├─ 我熟悉 → 5 大组件已经掌握</span></span>
<span class="line"><span>├─ 工业级 → 适合生产</span></span>
<span class="line"><span>└─ → 推荐作为内核</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【Hermes】</span></span>
<span class="line"><span>├─ Multi-Agent + Skill + Memory + Tool 完整</span></span>
<span class="line"><span>├─ 微信原生（你日常工作用 WeCom）</span></span>
<span class="line"><span>├─ Skill 可复用（一次开发，多次使用）</span></span>
<span class="line"><span>└─ → ✅ **最佳选择**</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二、4-agent-架构设计" tabindex="-1"><a class="header-anchor" href="#二、4-agent-架构设计"><span>二、4 Agent 架构设计</span></a></h2><h3 id="_2-1-整体架构" tabindex="-1"><a class="header-anchor" href="#_2-1-整体架构"><span>2.1 整体架构</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>┌──────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│         Hermes Multi-Agent 元认知系统            │</span></span>
<span class="line"><span>├──────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                                                  │</span></span>
<span class="line"><span>│  ┌──────────────┐  ┌──────────────┐             │</span></span>
<span class="line"><span>│  │ Content      │  │ Exam         │             │</span></span>
<span class="line"><span>│  │ Agent        │  │ Agent        │             │</span></span>
<span class="line"><span>│  │ (读代码)     │  │ (出题)       │             │</span></span>
<span class="line"><span>│  └──────┬───────┘  └──────┬───────┘             │</span></span>
<span class="line"><span>│         │                  │                     │</span></span>
<span class="line"><span>│         │ 结构化知识       │ 考试题               │</span></span>
<span class="line"><span>│         ↓                  ↓                     │</span></span>
<span class="line"><span>│  ┌──────────────┐  ┌──────────────┐             │</span></span>
<span class="line"><span>│  │ Error        │  │ Meta         │             │</span></span>
<span class="line"><span>│  │ Agent        │  │ Agent        │             │</span></span>
<span class="line"><span>│  │ (分析错题)   │  │ (追踪进度)   │             │</span></span>
<span class="line"><span>│  └──────┬───────┘  └──────┬───────┘             │</span></span>
<span class="line"><span>│         │                  │                     │</span></span>
<span class="line"><span>│         │ 改进方案        │ 颜色地图             │</span></span>
<span class="line"><span>│         └──────┬───────────┘                     │</span></span>
<span class="line"><span>│                ↓                                 │</span></span>
<span class="line"><span>│         回到 Exam Agent                          │</span></span>
<span class="line"><span>│        (出更难的题)                              │</span></span>
<span class="line"><span>└──────────────────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-4-agent-职责分工" tabindex="-1"><a class="header-anchor" href="#_2-2-4-agent-职责分工"><span>2.2 4 Agent 职责分工</span></a></h3><table><thead><tr><th>Agent</th><th>角色</th><th>输入</th><th>输出</th><th>频率</th></tr></thead><tbody><tr><td><strong>Content</strong></td><td>代码库理解专家</td><td>代码库路径 + 学习目标</td><td>src-map / architecture / concepts</td><td>启动 1 次 + 每周 1 次</td></tr><tr><td><strong>Exam</strong></td><td>严格导师</td><td>内容地图 + 当前水平</td><td>5 题考试 + 评分</td><td>每天 1 题 + 每周 1 套</td></tr><tr><td><strong>Error</strong></td><td>学习教练</td><td>错题 + 答案</td><td>根因 + 改进方法</td><td>每次错题 1 次 + 每周 1 次</td></tr><tr><td><strong>Meta</strong></td><td>元认知分析师</td><td>所有 Agent 输出</td><td>颜色地图 + 进度报告</td><td>每天更新 + 每周报告</td></tr></tbody></table><hr><h2 id="三、目录结构设计" tabindex="-1"><a class="header-anchor" href="#三、目录结构设计"><span>三、目录结构设计</span></a></h2><h3 id="_3-1-完整目录" tabindex="-1"><a class="header-anchor" href="#_3-1-完整目录"><span>3.1 完整目录</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>~/.hermes/</span></span>
<span class="line"><span>├── learning-os/                          ← 学习系统根目录</span></span>
<span class="line"><span>│   ├── README.md                         ← 系统说明</span></span>
<span class="line"><span>│   ├── META.md                           ← 元认知手册</span></span>
<span class="line"><span>│   │</span></span>
<span class="line"><span>│   ├── agents/                           ← 4 个 Agent Prompt</span></span>
<span class="line"><span>│   │   ├── content-agent.md</span></span>
<span class="line"><span>│   │   ├── exam-agent.md</span></span>
<span class="line"><span>│   │   ├── error-agent.md</span></span>
<span class="line"><span>│   │   └── meta-agent.md</span></span>
<span class="line"><span>│   │</span></span>
<span class="line"><span>│   ├── skills/                           ← 4 个 Skill（可复用）</span></span>
<span class="line"><span>│   │   ├── content-skill.md</span></span>
<span class="line"><span>│   │   ├── exam-skill.md</span></span>
<span class="line"><span>│   │   ├── error-skill.md</span></span>
<span class="line"><span>│   │   └── meta-skill.md</span></span>
<span class="line"><span>│   │</span></span>
<span class="line"><span>│   ├── codebases/                        ← 多个代码库</span></span>
<span class="line"><span>│   │   ├── agentscope/</span></span>
<span class="line"><span>│   │   │   ├── src-map.md</span></span>
<span class="line"><span>│   │   │   ├── architecture.md</span></span>
<span class="line"><span>│   │   │   ├── key-concepts.md</span></span>
<span class="line"><span>│   │   │   ├── learning-paths.md</span></span>
<span class="line"><span>│   │   │   │</span></span>
<span class="line"><span>│   │   │   ├── exams/</span></span>
<span class="line"><span>│   │   │   │   ├── exam-01-basics.md</span></span>
<span class="line"><span>│   │   │   │   ├── exam-02-architecture.md</span></span>
<span class="line"><span>│   │   │   │   └── exam-results.md</span></span>
<span class="line"><span>│   │   │   │</span></span>
<span class="line"><span>│   │   │   ├── errors/</span></span>
<span class="line"><span>│   │   │   │   ├── error-bank.md</span></span>
<span class="line"><span>│   │   │   │   ├── root-causes.md</span></span>
<span class="line"><span>│   │   │   │   ├── prevention.md</span></span>
<span class="line"><span>│   │   │   │   └── review-cycle.md</span></span>
<span class="line"><span>│   │   │   │</span></span>
<span class="line"><span>│   │   │   ├── colors/</span></span>
<span class="line"><span>│   │   │   │   ├── color-map.md</span></span>
<span class="line"><span>│   │   │   │   ├── dashboard.md</span></span>
<span class="line"><span>│   │   │   │   ├── color-gaps.md</span></span>
<span class="line"><span>│   │   │   │   └── color-rules.md</span></span>
<span class="line"><span>│   │   │   │</span></span>
<span class="line"><span>│   │   │   ├── progress/</span></span>
<span class="line"><span>│   │   │   │   ├── daily/</span></span>
<span class="line"><span>│   │   │   │   ├── weekly/</span></span>
<span class="line"><span>│   │   │   │   └── monthly/</span></span>
<span class="line"><span>│   │   │   │</span></span>
<span class="line"><span>│   │   │   └── modifications/</span></span>
<span class="line"><span>│   │   │       └── (改造记录)</span></span>
<span class="line"><span>│   │   │</span></span>
<span class="line"><span>│   │   ├── mcp-server/</span></span>
<span class="line"><span>│   │   └── spring-ai/</span></span>
<span class="line"><span>│   │</span></span>
<span class="line"><span>│   ├── cross-codebase/                   ← 跨代码库对比</span></span>
<span class="line"><span>│   │   ├── multi-agent-frameworks.md</span></span>
<span class="line"><span>│   │   └── design-patterns.md</span></span>
<span class="line"><span>│   │</span></span>
<span class="line"><span>│   └── meta/                             ← 元认知层</span></span>
<span class="line"><span>│       ├── meta-cognition.md</span></span>
<span class="line"><span>│       ├── self-awareness.md</span></span>
<span class="line"><span>│       ├── monitoring-protocol.md</span></span>
<span class="line"><span>│       └── regulation-strategies.md</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── hermes-config.yaml                    ← Hermes 配置</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>└── logs/                                 ← 运行日志</span></span>
<span class="line"><span>    └── learning-os/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、4-个-agent-的详细设计" tabindex="-1"><a class="header-anchor" href="#四、4-个-agent-的详细设计"><span>四、4 个 Agent 的详细设计</span></a></h2><h3 id="_4-1-content-agent" tabindex="-1"><a class="header-anchor" href="#_4-1-content-agent"><span>4.1 Content Agent</span></a></h3><p><strong>角色</strong>：代码库内容解析专家</p><p><strong>Skill 定义</strong>（<code>skills/content-skill.md</code>）：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">content-skill</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">description</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">解析代码库，输出结构化知识</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">triggers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">:</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;分析代码库&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;学习新项目&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;理解架构&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;画架构图&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>System Prompt</strong>（<code>agents/content-agent.md</code>）：</p><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 角色</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">你是一位&quot;代码库理解专家&quot;，擅长把复杂代码库解析为结构化知识。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 核心能力</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">1.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 快速读懂代码结构</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">2.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 提取核心概念</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">3.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 画架构图（Mermaid）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">4.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 设计学习路径</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 输入</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 代码库路径（GitHub URL 或本地路径）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 学习目标（如&quot;精通 AgentScope&quot;）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 当前水平（L1-L5）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 任务</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">基于用户输入，输出 4 个文件：</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">1.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> src-map.md（源码地图）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">2.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> architecture.md（架构图）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">3.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> key-concepts.md（核心概念）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">4.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> learning-paths.md（学习路径）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 工具</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Read：读取文件</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Grep：搜索代码</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Glob：找文件</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Bash：运行命令</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> WebFetch：读 GitHub README</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 输出格式</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 1. src-map.md（源码地图）</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">markdown</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 源码地图</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 核心模块</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 模块 | 文件 | 行数 | 重要性 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|------|------|------|--------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 编排器 | src/orchestrator/ | 500 | ⭐⭐⭐⭐⭐ |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 执行器 | src/executor/ | 300 | ⭐⭐⭐⭐ |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 记忆 | src/memory/ | 200 | ⭐⭐⭐ |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 评估 | src/evaluator/ | 150 | ⭐⭐ |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 关键文件（必读 Top 10）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">1.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> src/orchestrator/main.py</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">2.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> src/executor/agent.py</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">...</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 2. architecture.md（架构图）</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">markdown</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 架构图</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">mermaid</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">graph TD</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    A[User Input] --&gt; B</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Orchestrator</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    B --&gt; C[Executor 1]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    B --&gt; D[Executor 2]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    C --&gt; E</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Memory</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    D --&gt; E</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    B --&gt; F</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">Evaluator</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    F --&gt; B</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 3. key-concepts.md（核心概念）</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">markdown</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 核心概念（10 个）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 概念 1：编排器</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 定义：...</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 作用：...</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 关键文件：...</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 掌握度：🟡</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 4. learning-paths.md（学习路径）</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">markdown</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 6 周学习路径</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Week 1-2：理解整体</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] Day 1：读 README + 画架构图</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] Day 2：跑通 hello world</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] Day 3-5：读 4 大组件源码</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] Day 6-7：跑通 1 个 example</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Week 3-4：深入核心</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 改 1 个核心函数</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 写 1 个 demo</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 跑 1 套考试</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">...</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 严格要求</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 5 层掌握度标注</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 每个模块标 🔴/🟡/🟢/🟣</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 6 周学习路径</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 至少 10 个核心概念</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>使用方式</strong>：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>你：@content-skill 分析 https://github.com/xxx/agentscope</span></span>
<span class="line"><span>Agent：输出 4 个文件到 ~/.hermes/learning-os/codebases/agentscope/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-exam-agent" tabindex="-1"><a class="header-anchor" href="#_4-2-exam-agent"><span>4.2 Exam Agent</span></a></h3><p><strong>角色</strong>：严格导师</p><p><strong>Skill 定义</strong>：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">exam-skill</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">description</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">出考试题评估真实掌握度</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">triggers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">:</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;出题&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;考试&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;测试掌握度&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;自我测试&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>System Prompt</strong>：</p><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 角色</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">你是一位严格的&quot;学习导师&quot;，擅长出考试题评估真实掌握度。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 核心理念</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-weight:bold;--shiki-dark:#D19A66;--shiki-dark-font-weight:inherit;">**&quot;问 ≠ 会&quot;**</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> — 必须用考试验证</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 5 种题型</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">1.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 复述题（20%）：让用户讲 5 分钟</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">2.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 复现题（30%）：让用户做 1 件事</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">3.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 改错题（20%）：让用户找 bug</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">4.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 改写题（20%）：让用户重写</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">5.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 场景题（10%）：让用户解决新问题</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 输入</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Content Agent 的内容地图</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 用户的当前掌握度</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 出题策略（基础 / 进阶 / 难题）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 任务</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">基于内容地图，生成 1 套 5 题考试。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 严格要求</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 1. 不能&quot;问&quot;代替&quot;考&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 不是&quot;什么是 X&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 而是&quot;用你自己的话讲 X&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 2. 题目必须可执行</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">每道题必须满足：</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 在不查文档的情况下能否做完？</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 在 5 分钟内能否讲清楚？</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 评分标准是什么？</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 3. 5 种题型必须混合</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 复述题：20%</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 复现题：30%</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 改错题：20%</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 改写题：20%</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 场景题：10%</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 4. 不直接给答案</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 题目要清晰</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 答案要等用户做完才讲</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 5. 评分标准</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 80-100 分：L4-L5（可投入简历）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 60-80 分：L3（可面试）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 40-60 分：L2（需加强）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> &lt;40 分：L1（需重学）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 输出格式</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">markdown</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 考试 01: 基础（30 分钟）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Q1（复述题，L2，20 分）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">不看文档，用你自己的话讲清楚 X 的 3 个核心概念。</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 评分：能讲 30 秒/个 = 80 分</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Q2（复现题，L3，30 分）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">打开 src/xxx/，找出 X 的实现文件。</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">不看代码，讲出它的核心数据结构。</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 评分：能准确指出 = 80 分</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Q3（改错题，L3，20 分）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">下面这段代码会出什么问题？</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">python</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">代码</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 评分：能预测 2+ 个问题 = 80 分</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Q4（改写题，L4，20 分）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">把这段代码用伪代码重写。</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 评分：流程正确 = 80 分</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Q5（场景题，L5，10 分）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">你要做 1 个 X，用这个代码库，你会怎么设计？</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 评分：能画 1 张图 = 80 分</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 使用流程</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">1.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 给出考试题</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">2.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 用户做 30 分钟</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">3.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 用户回答</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">4.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Agent 评分</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">5.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 输出成绩 + 改进建议</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">6.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 自动记录到 exam-results.md</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>使用方式</strong>：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>你：@exam-skill 基于 src-map.md 出 5 道基础题</span></span>
<span class="line"><span>Agent：输出 exam-01-basics.md</span></span>
<span class="line"><span></span></span>
<span class="line"><span>（30 分钟后）</span></span>
<span class="line"><span>你：@exam-skill 评分 [你的答案]</span></span>
<span class="line"><span>Agent：输出分数 + 反馈 + 错题</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-error-agent" tabindex="-1"><a class="header-anchor" href="#_4-3-error-agent"><span>4.3 Error Agent</span></a></h3><p><strong>角色</strong>：学习教练</p><p><strong>Skill 定义</strong>：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">error-skill</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">description</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">分析错题找出根因</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">triggers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">:</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;分析错题&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;为什么错了&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;复盘&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;改进&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>System Prompt</strong>：</p><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 角色</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">你是一位&quot;学习教练&quot;，擅长从错题中找出根因。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 4 大根因分类</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">1.</span><span style="--shiki-light:#986801;--shiki-light-font-weight:bold;--shiki-dark:#D19A66;--shiki-dark-font-weight:inherit;"> **浮躁**</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">   -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 表现：跳着看、不写&quot;我以为&quot;、想看答案</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">   -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 触发：早上刚醒、累了、看简单题</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">   -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 防范：深呼吸、计时器、写&quot;我以为&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">2.</span><span style="--shiki-light:#986801;--shiki-light-font-weight:bold;--shiki-dark:#D19A66;--shiki-dark-font-weight:inherit;"> **缺乏实战**</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">   -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 表现：场景题答不出、改写题写不出</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">   -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 触发：新概念、没跑过 demo</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">   -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 防范：每学 1 概念跑 1 demo、收藏 10 个案例</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">3.</span><span style="--shiki-light:#986801;--shiki-light-font-weight:bold;--shiki-dark:#D19A66;--shiki-dark-font-weight:inherit;"> **跳过细节**</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">   -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 表现：改错题漏 bug、复述漏关键点</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">   -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 防范：用 checklist、写 1 行 = 1 个注释</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">4.</span><span style="--shiki-light:#986801;--shiki-light-font-weight:bold;--shiki-dark:#D19A66;--shiki-dark-font-weight:inherit;"> **其他**</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">   -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 识别后归类</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 输入</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 错题列表</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 用户答案</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 正确答案</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 用户的解释（&quot;我以为...&quot;）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 任务</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">分析每道错题，输出 5 个字段：</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">1.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 根因（4 大类中选 1）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">2.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 改进方法（可执行）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">3.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 防范措施（具体）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">4.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 复盘周期（每天/每周/每月）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">5.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 掌握度变化（L? → L?）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 输出格式</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">markdown</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 错题 #001</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 题目</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">Q3（改错题）：下面这段代码会出什么问题？</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 用户答案</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">~~没发现 bug~~</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 正确答案</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">传参前未做类型检查</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 根因分析</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-weight:bold;--shiki-dark:#D19A66;--shiki-dark-font-weight:inherit;">**类型**</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">：浮躁</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-weight:bold;--shiki-dark:#D19A66;--shiki-dark-font-weight:inherit;">**证据**</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">：</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 跳着看代码（没认真读 3 行）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 写下&quot;我以为&quot;了吗？没写</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 改错题前深呼吸 3 次了吗？没做</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 改进方法</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 改错题前深呼吸 3 次</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 写下&quot;我以为 X&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 用 checklist 检查 5 个常见 bug</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 改完后写出&quot;我学到了&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 防范措施</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 做改错题前先深呼吸 3 次</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 用 checklist：参数/边界/异常/性能/安全</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 5 分钟计时器（不能跳）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 复盘周期</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 明天：重做 1 次</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 下周：类似题再考</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 下月：错题类型总览</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 掌握度变化</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">L2 → L3</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 使用流程</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">1.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 接收错题</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">2.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 分析根因</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">3.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 给出改进方案</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">4.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 自动写入 error-bank.md</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">5.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 累计到 root-causes.md</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">6.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 周复盘：找出本周 Top 3 根因</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>使用方式</strong>：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>你：@error-skill 这 3 道错题 [题目 + 你的答案 + 正确答案]</span></span>
<span class="line"><span>Agent：分析 3 道错题的根因 + 改进方法</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-meta-agent" tabindex="-1"><a class="header-anchor" href="#_4-4-meta-agent"><span>4.4 Meta Agent</span></a></h3><p><strong>角色</strong>：元认知分析师</p><p><strong>Skill 定义</strong>：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">meta-skill</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">description</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">追踪学习状态、识别盲点</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">triggers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">:</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;我的进度&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;颜色地图&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;盲点&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;升级计划&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;学习报告&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>System Prompt</strong>：</p><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 角色</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">你是一位&quot;元认知分析师&quot;，擅长追踪学习状态、识别盲点。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 核心理念</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-weight:bold;--shiki-dark:#D19A66;--shiki-dark-font-weight:inherit;">**&quot;对认知的认知&quot;**</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> — 知道自己知道什么</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 5 种颜色</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 颜色 | 含义 | 行动 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|------|------|------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| ⚪ 灰 | 未开始 | 启动 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 🔴 红 | 未掌握 | 补基础 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 🟡 黄 | 半掌握 | 加速到绿 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 🟢 绿 | 掌握 | 教别人 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 🟣 紫 | 精通 | 创新 |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 输入</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Content Agent 的内容地图</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Exam Agent 的考试结果</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Error Agent 的错题分析</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 5 层掌握度</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 任务</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">基于所有 Agent 的输出，输出 4 个文件：</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">1.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> color-map.md（颜色地图）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">2.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> dashboard.md（仪表盘）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">3.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> blind-spots.md（盲点清单）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">4.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> upgrade-plan.md（升级计划）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 输出格式</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 1. color-map.md</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">markdown</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># AgentScope 颜色地图（2026-06-22）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 4 大组件</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 编排器：🟡 半掌握（能讲 5 分钟）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 执行器：🟢 掌握（能讲 + 跑过）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 记忆节点：🔴 未掌握（讲不出）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 评估器：⚪ 未开始</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 整体：45% 掌握（🟡）</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 2. dashboard.md</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">markdown</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 我的元认知仪表盘</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 本周数据</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 学习时间：14 小时</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 平均效率：0.85</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 考试次数：3 套</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 平均分：72/100</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 错题数：8 道</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 颜色分布</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> ⚪ 灰：20%</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 🔴 红：30%</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 🟡 黄：40%</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 🟢 绿：10%</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 🟣 紫：0%</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 进步</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 上周：35% 掌握</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 本周：45% 掌握</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 进步：+10%</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 3. blind-spots.md</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">markdown</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 盲点清单</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 自动检测到的盲点</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">1.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 🔴 记忆节点：未掌握</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">2.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> ⚪ 评估器：未开始</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">3.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 改错题经常漏 bug：跳过细节型</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 优先补的盲点</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">1.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 记忆节点（🔴 → 🟡）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">2.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 改错题细节（用 checklist）</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 4. upgrade-plan.md</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">markdown</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 升级计划</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 当前：45% 掌握（黄绿）</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 目标：85% 掌握（绿）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### Week 1：消灭 1 个 🔴</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 目标：记忆节点 🔴 → 🟡</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 方法：跑 3 个 demo + 改 1 行</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### Week 2：1 个 🟡 → 🟢</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 目标：编排器 🟡 → 🟢</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 方法：能讲 10 分钟 + 改 1 个模块</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### Week 3-4：再消灭 1 个 🔴</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 目标：评估器 ⚪ → 🟡</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 使用流程</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">1.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 每天：更新颜色地图</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">2.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 每周：生成仪表盘</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">3.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 每月：输出深度报告</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">4.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 每季：方法调整</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>使用方式</strong>：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>你：@meta-skill 更新我的颜色地图</span></span>
<span class="line"><span>Agent：读所有输出，生成 color-map.md</span></span>
<span class="line"><span></span></span>
<span class="line"><span>你：@meta-skill 本周报告</span></span>
<span class="line"><span>Agent：输出 dashboard.md + blind-spots.md</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、4-个-skill-完整定义" tabindex="-1"><a class="header-anchor" href="#五、4-个-skill-完整定义"><span>五、4 个 Skill 完整定义</span></a></h2><h3 id="_5-1-skill-加载方式" tabindex="-1"><a class="header-anchor" href="#_5-1-skill-加载方式"><span>5.1 Skill 加载方式</span></a></h3><p>在 <code>~/.hermes/config.yaml</code> 中配置：</p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">skills</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">:</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">content-skill</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">    path</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">~/.hermes/learning-os/skills/content-skill.md</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">    enabled</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">exam-skill</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">    path</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">~/.hermes/learning-os/skills/exam-skill.md</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">    enabled</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">error-skill</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">    path</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">~/.hermes/learning-os/skills/error-skill.md</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">    enabled</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">true</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  - </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">meta-skill</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">    path</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">~/.hermes/learning-os/skills/meta-skill.md</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">    enabled</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">true</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-skill-调用语法" tabindex="-1"><a class="header-anchor" href="#_5-2-skill-调用语法"><span>5.2 Skill 调用语法</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【语法 1】直接调用</span></span>
<span class="line"><span>你：@content-skill 分析 https://github.com/xxx/agentscope</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【语法 2】通过 trigger</span></span>
<span class="line"><span>你：出 5 道考试题</span></span>
<span class="line"><span>（自动触发 exam-skill）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【语法 3】链式调用</span></span>
<span class="line"><span>你：@content-skill → @exam-skill → @error-skill → @meta-skill</span></span>
<span class="line"><span>（4 个 Agent 链式执行）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、完整工作流" tabindex="-1"><a class="header-anchor" href="#六、完整工作流"><span>六、完整工作流</span></a></h2><h3 id="_6-1-启动流程-day-1" tabindex="-1"><a class="header-anchor" href="#_6-1-启动流程-day-1"><span>6.1 启动流程（Day 1）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># Step 1：Content Agent 建地图</span></span>
<span class="line"><span>你：@content-skill 我要学 AgentScope，路径是 ~/repos/agentscope</span></span>
<span class="line"><span>Agent：</span></span>
<span class="line"><span>- 读取 README</span></span>
<span class="line"><span>- 解析 src/ 目录</span></span>
<span class="line"><span>- 输出 4 个文件</span></span>
<span class="line"><span>- 给出 6 周学习路径</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Step 2：Exam Agent 出题</span></span>
<span class="line"><span>你：@exam-skill 基于 src-map.md 出 5 道基础题</span></span>
<span class="line"><span>Agent：输出 exam-01-basics.md</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Step 3：用户做考试（30 分钟）</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Step 4：Exam Agent 评分</span></span>
<span class="line"><span>你：@exam-skill 评分 [我的答案]</span></span>
<span class="line"><span>Agent：输出分数 + 错题清单</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Step 5：Error Agent 分析</span></span>
<span class="line"><span>你：@error-skill 这 3 道错题 [题目 + 我的答案 + 正确答案]</span></span>
<span class="line"><span>Agent：分析根因 + 改进方法</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Step 6：Meta Agent 更新</span></span>
<span class="line"><span>你：@meta-skill 更新我的颜色地图</span></span>
<span class="line"><span>Agent：输出 color-map.md（4 大组件初始颜色）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-每日循环-day-2-42" tabindex="-1"><a class="header-anchor" href="#_6-2-每日循环-day-2-42"><span>6.2 每日循环（Day 2-42）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># 每天 30 分钟</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 早上（10 分钟）</span></span>
<span class="line"><span>- 1 道复述题</span></span>
<span class="line"><span>- @exam-skill 出 1 道题</span></span>
<span class="line"><span>- 5 分钟回答</span></span>
<span class="line"><span>- @meta-skill 更新颜色</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 中午（10 分钟）</span></span>
<span class="line"><span>- 跑 1 个 demo</span></span>
<span class="line"><span>- 写 1 段笔记</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 晚上（10 分钟）</span></span>
<span class="line"><span>- 记录错题（如果有）</span></span>
<span class="line"><span>- @error-skill 分析</span></span>
<span class="line"><span>- @meta-skill 更新 dashboard</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-周复盘-每周日-30-分钟" tabindex="-1"><a class="header-anchor" href="#_6-3-周复盘-每周日-30-分钟"><span>6.3 周复盘（每周日 30 分钟）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># 周复盘</span></span>
<span class="line"><span>你：@meta-skill 本周报告</span></span>
<span class="line"><span>Agent：</span></span>
<span class="line"><span>- 输出 dashboard.md（本周数据）</span></span>
<span class="line"><span>- 输出 color-map.md（更新所有颜色）</span></span>
<span class="line"><span>- 输出 blind-spots.md（找出新盲点）</span></span>
<span class="line"><span>- 输出 upgrade-plan.md（下周重点）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-4-月复盘-每月-2-小时" tabindex="-1"><a class="header-anchor" href="#_6-4-月复盘-每月-2-小时"><span>6.4 月复盘（每月 2 小时）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># 月复盘</span></span>
<span class="line"><span>你：@meta-skill 本月深度分析</span></span>
<span class="line"><span>Agent：</span></span>
<span class="line"><span>- 输出 progress-report.md（本月整体）</span></span>
<span class="line"><span>- 输出 color-map.md（整体颜色变化）</span></span>
<span class="line"><span>- 输出 learning-curve.md（学习曲线）</span></span>
<span class="line"><span>- 输出 method-adjustment.md（方法调整建议）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、multi-agent-协作实现" tabindex="-1"><a class="header-anchor" href="#七、multi-agent-协作实现"><span>七、Multi-Agent 协作实现</span></a></h2><h3 id="_7-1-链式调用" tabindex="-1"><a class="header-anchor" href="#_7-1-链式调用"><span>7.1 链式调用</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># tools/learning_pipeline.py</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> LearningPipeline</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">:</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">    &quot;&quot;&quot;4 Agent 协作学习流程&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    </span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    def</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> __init__</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E5C07B;--shiki-dark-font-style:italic;">self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">):</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.content_agent </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;"> ContentAgent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.exam_agent </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;"> ExamAgent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.error_agent </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;"> ErrorAgent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.meta_agent </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;"> MetaAgent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    </span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    def</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> start_learning</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E5C07B;--shiki-dark-font-style:italic;">self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> codebase</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> goal</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> weeks</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">6</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">):</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">        &quot;&quot;&quot;启动学习&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        # Step 1: Content Agent</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        content </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.content_agent.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">analyze</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(codebase, goal)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        </span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        # Step 2: Exam Agent</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        exam </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.exam_agent.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">generate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(content, </span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">level</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;basic&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        </span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        # Step 3: User do exam</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        user_answers </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> input</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;请完成考试：&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        </span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        # Step 4: Exam Agent 评分</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        score </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.exam_agent.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">grade</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(exam, user_answers)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        </span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        # Step 5: Error Agent 分析</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        errors </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.error_agent.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">analyze</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(score.wrong_questions)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        </span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        # Step 6: Meta Agent 更新</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.meta_agent.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">update</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(errors, score)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        </span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">            &quot;content&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: content,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">            &quot;exam&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: exam,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">            &quot;score&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: score,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">            &quot;errors&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">: errors,</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    </span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    def</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> daily_loop</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E5C07B;--shiki-dark-font-style:italic;">self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic;"> codebase</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">):</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">        &quot;&quot;&quot;每日循环&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        # 早上：1 道复述题</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        question </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.exam_agent.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">generate_one</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(codebase, </span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">type</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;recall&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        answer </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> input</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;你的答案：&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        </span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        # 中午：跑 demo</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        # 晚上：错误分析 + 更新</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        score </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.exam_agent.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">grade_one</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(question, answer)</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        if</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> not</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> score.is_correct:</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            error </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.error_agent.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">analyze_one</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(question, answer)</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        self</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.meta_agent.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">update_daily</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-2-hermes-集成" tabindex="-1"><a class="header-anchor" href="#_7-2-hermes-集成"><span>7.2 Hermes 集成</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># tools/hermes_meta_learning.py</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">from</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> hermes </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Hermes, Skill, Agent</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">hermes </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;"> Hermes</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 注册 4 个 Agent</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">content_agent </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;"> Agent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;ContentAgent&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    skill</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;content-skill&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    system_prompt_file</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;~/.hermes/learning-os/agents/content-agent.md&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">exam_agent </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;"> Agent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;ExamAgent&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    skill</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;exam-skill&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    system_prompt_file</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;~/.hermes/learning-os/agents/exam-agent.md&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">error_agent </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;"> Agent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;ErrorAgent&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    skill</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;error-skill&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    system_prompt_file</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;~/.hermes/learning-os/agents/error-agent.md&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">meta_agent </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;"> Agent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;MetaAgent&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    skill</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;meta-skill&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    system_prompt_file</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;~/.hermes/learning-os/agents/meta-agent.md&quot;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 启动 4 Agent 协作</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">pipeline </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> hermes.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">pipeline</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">([</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    content_agent,</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    exam_agent,</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    error_agent,</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    meta_agent</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">])</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 启动学习</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">result </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> pipeline.</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF;">run</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    codebase</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;~/repos/agentscope&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    goal</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;精通 AgentScope&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">    weeks</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">6</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="八、立即可执行-5-步启动" tabindex="-1"><a class="header-anchor" href="#八、立即可执行-5-步启动"><span>八、立即可执行（5 步启动）</span></a></h2><h3 id="step-1-建目录-5-分钟" tabindex="-1"><a class="header-anchor" href="#step-1-建目录-5-分钟"><span>Step 1：建目录（5 分钟）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 1.1 学习系统目录</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">mkdir</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -p</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> ~/.hermes/learning-os/{agents,skills,codebases,meta}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 1.2 每个 Agent 目录</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">mkdir</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -p</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> ~/.hermes/learning-os/agents</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">mkdir</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -p</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> ~/.hermes/learning-os/skills</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 1.3 代码库目录</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">mkdir</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -p</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> ~/.hermes/learning-os/codebases/agentscope/{exams,errors,colors,progress,modifications}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="step-2-写-4-个-skill-1-小时" tabindex="-1"><a class="header-anchor" href="#step-2-写-4-个-skill-1-小时"><span>Step 2：写 4 个 Skill（1 小时）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 创建 4 个 Skill 文件</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">~/.hermes/learning-os/skills/content-skill.md</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">~/.hermes/learning-os/skills/exam-skill.md</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">~/.hermes/learning-os/skills/error-skill.md</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">~/.hermes/learning-os/skills/meta-skill.md</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="step-3-写-4-个-agent-prompt-2-小时" tabindex="-1"><a class="header-anchor" href="#step-3-写-4-个-agent-prompt-2-小时"><span>Step 3：写 4 个 Agent Prompt（2 小时）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 创建 4 个 Agent Prompt</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">~/.hermes/learning-os/agents/content-agent.md</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">~/.hermes/learning-os/agents/exam-agent.md</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">~/.hermes/learning-os/agents/error-agent.md</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">~/.hermes/learning-os/agents/meta-agent.md</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="step-4-配置-hermes-30-分钟" tabindex="-1"><a class="header-anchor" href="#step-4-配置-hermes-30-分钟"><span>Step 4：配置 Hermes（30 分钟）</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 4.1 编辑 ~/.hermes/config.yaml</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 4.2 添加 4 个 skill</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 4.3 重启 Hermes</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="step-5-跑第-1-个完整循环-1-小时" tabindex="-1"><a class="header-anchor" href="#step-5-跑第-1-个完整循环-1-小时"><span>Step 5：跑第 1 个完整循环（1 小时）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span># 5.1 启动 Content Agent</span></span>
<span class="line"><span>@content-skill 分析 ~/repos/agentscope</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 5.2 启动 Exam Agent</span></span>
<span class="line"><span>@exam-skill 基于 src-map.md 出 5 道基础题</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 5.3 做考试</span></span>
<span class="line"><span>（30 分钟）</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 5.4 启动 Error Agent</span></span>
<span class="line"><span>@error-skill 这 3 道错题 [题目 + 答案]</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 5.5 启动 Meta Agent</span></span>
<span class="line"><span>@meta-skill 更新我的颜色地图</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="九、4-agent-设计的智慧" tabindex="-1"><a class="header-anchor" href="#九、4-agent-设计的智慧"><span>九、4 Agent 设计的智慧</span></a></h2><h3 id="_9-1-为什么是-4-个" tabindex="-1"><a class="header-anchor" href="#_9-1-为什么是-4-个"><span>9.1 为什么是 4 个？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【3 个的问题】</span></span>
<span class="line"><span>├─ 职责重叠（&quot;内容&quot;和&quot;考试&quot;合并）</span></span>
<span class="line"><span>├─ 角色不清（每个 Agent 多个身份）</span></span>
<span class="line"><span>└─ → 调试困难</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【4 个的优势】</span></span>
<span class="line"><span>├─ 职责清晰（每个 Agent 1 个角色）</span></span>
<span class="line"><span>├─ 流程完整（输入→考试→反馈→追踪）</span></span>
<span class="line"><span>├─ 互相独立（每个 Agent 单独可测）</span></span>
<span class="line"><span>└─ → 工业级</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【5 个的问题】</span></span>
<span class="line"><span>├─ 协调成本高</span></span>
<span class="line"><span>├─ 边界模糊</span></span>
<span class="line"><span>└─ → 过度设计</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-2-4-agent-的-四象限" tabindex="-1"><a class="header-anchor" href="#_9-2-4-agent-的-四象限"><span>9.2 4 Agent 的&quot;四象限&quot;</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【输入端】Content    【处理端】Exam</span></span>
<span class="line"><span>    │                  │</span></span>
<span class="line"><span>    └──── 互相协作 ────┘</span></span>
<span class="line"><span>            ↓</span></span>
<span class="line"><span>【反馈端】Error     【追踪端】Meta</span></span>
<span class="line"><span>    │                  │</span></span>
<span class="line"><span>    └──── 互相协作 ────┘</span></span>
<span class="line"><span>            ↓</span></span>
<span class="line"><span>        完整闭环</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_9-3-4-agent-协作的-3-个特性" tabindex="-1"><a class="header-anchor" href="#_9-3-4-agent-协作的-3-个特性"><span>9.3 4 Agent 协作的 3 个特性</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【特性 1】单一职责</span></span>
<span class="line"><span>├─ Content：只解析代码</span></span>
<span class="line"><span>├─ Exam：只出题评分</span></span>
<span class="line"><span>├─ Error：只分析错题</span></span>
<span class="line"><span>└─ Meta：只追踪进度</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【特性 2】互相独立</span></span>
<span class="line"><span>├─ 每个 Agent 可单独调用</span></span>
<span class="line"><span>├─ 每个 Agent 可单独测试</span></span>
<span class="line"><span>├─ 每个 Agent 可单独替换</span></span>
<span class="line"><span>└─ → 松耦合</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【特性 3】数据流清晰</span></span>
<span class="line"><span>Content → Exam → Error → Meta</span></span>
<span class="line"><span>   │        │        │       │</span></span>
<span class="line"><span>   └────────┴────────┴───────┘</span></span>
<span class="line"><span>            ↓</span></span>
<span class="line"><span>        形成闭环</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十、与-ai-时代超级学习者-博客的呼应" tabindex="-1"><a class="header-anchor" href="#十、与-ai-时代超级学习者-博客的呼应"><span>十、与&quot;AI 时代超级学习者&quot;博客的呼应</span></a></h2><h3 id="_10-1-4-agent-5-大方法论的自动化" tabindex="-1"><a class="header-anchor" href="#_10-1-4-agent-5-大方法论的自动化"><span>10.1 4 Agent = 5 大方法论的自动化</span></a></h3><table><thead><tr><th>超级学习者方法论</th><th>4 Agent 自动化</th></tr></thead><tbody><tr><td>动力三角（热爱/能力/目标）</td><td>Meta Agent 追踪 + 调整</td></tr><tr><td>提问能力（4 维框架）</td><td>Exam Agent 自动出题</td></tr><tr><td>迁移能力（跨场景）</td><td>Content Agent 跨代码库</td></tr><tr><td>复现验证（输出倒逼）</td><td>Exam Agent 强制考试</td></tr><tr><td>闭环系统（动力+方法+心态）</td><td>4 Agent 完整闭环</td></tr></tbody></table><h3 id="_10-2-4-agent-5-个-ai-时代的超级学习者-原则" tabindex="-1"><a class="header-anchor" href="#_10-2-4-agent-5-个-ai-时代的超级学习者-原则"><span>10.2 4 Agent = 5 个&quot;AI 时代的超级学习者&quot;原则</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【原则 1】立刻起步 = 60% 就开始（最小化）</span></span>
<span class="line"><span>【原则 2】持续 &gt; 完美 = 每日 30 分钟</span></span>
<span class="line"><span>【原则 3】AI 协作 = 4 Agent 协作</span></span>
<span class="line"><span>【原则 4】真实掌握 = L5 精通（不是 L1 看过）</span></span>
<span class="line"><span>【原则 5】系统化 = 颜色地图 + 仪表盘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十一、4-agent-的-6-周路线图" tabindex="-1"><a class="header-anchor" href="#十一、4-agent-的-6-周路线图"><span>十一、4 Agent 的 6 周路线图</span></a></h2><h3 id="week-1-建立系统" tabindex="-1"><a class="header-anchor" href="#week-1-建立系统"><span>Week 1：建立系统</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【目标】4 Agent 全部就位</span></span>
<span class="line"><span>【行动】</span></span>
<span class="line"><span>├─ 建目录结构</span></span>
<span class="line"><span>├─ 写 4 个 Skill</span></span>
<span class="line"><span>├─ 写 4 个 Agent Prompt</span></span>
<span class="line"><span>├─ 配置 Hermes</span></span>
<span class="line"><span>└─ 跑第 1 个完整循环</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【输出】</span></span>
<span class="line"><span>├─ 4 个 Skill 可用</span></span>
<span class="line"><span>├─ 4 个 Agent 可调用</span></span>
<span class="line"><span>├─ 1 个代码库的初始颜色地图</span></span>
<span class="line"><span>└─ 1 套基础考试</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="week-2-3-内容解析-考试" tabindex="-1"><a class="header-anchor" href="#week-2-3-内容解析-考试"><span>Week 2-3：内容解析 + 考试</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【目标】建立 5 层掌握度</span></span>
<span class="line"><span>【行动】</span></span>
<span class="line"><span>├─ Content Agent 完整解析 2 个代码库</span></span>
<span class="line"><span>├─ Exam Agent 出 10 套考试</span></span>
<span class="line"><span>├─ 跑 10 次考试</span></span>
<span class="line"><span>├─ Error Agent 分析 30+ 错题</span></span>
<span class="line"><span>└─ Meta Agent 跟踪颜色</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【输出】</span></span>
<span class="line"><span>├─ 2 个代码库结构化</span></span>
<span class="line"><span>├─ 10 套考试</span></span>
<span class="line"><span>├─ 30+ 错题分析</span></span>
<span class="line"><span>└─ 颜色地图：45% → 60%</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="week-4-5-深入改造" tabindex="-1"><a class="header-anchor" href="#week-4-5-深入改造"><span>Week 4-5：深入改造</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【目标】从 L3 到 L4</span></span>
<span class="line"><span>【行动】</span></span>
<span class="line"><span>├─ 改 1 个核心模块</span></span>
<span class="line"><span>├─ 提 1 个 PR</span></span>
<span class="line"><span>├─ Exam Agent 出 5 套进阶题</span></span>
<span class="line"><span>├─ 跑 5 次进阶考试</span></span>
<span class="line"><span>└─ Meta Agent 升级计划</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【输出】</span></span>
<span class="line"><span>├─ 1 个 PR</span></span>
<span class="line"><span>├─ 5 套进阶考试</span></span>
<span class="line"><span>├─ 颜色地图：60% → 75%</span></span>
<span class="line"><span>└─ 整体 ≥ 70% 绿</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="week-6-教别人" tabindex="-1"><a class="header-anchor" href="#week-6-教别人"><span>Week 6：教别人</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【目标】从 L4 到 L5</span></span>
<span class="line"><span>【行动】</span></span>
<span class="line"><span>├─ 写 1 篇深度博客</span></span>
<span class="line"><span>├─ 教 1 个人</span></span>
<span class="line"><span>├─ Meta Agent 输出最终报告</span></span>
<span class="line"><span>├─ 总结方法论</span></span>
<span class="line"><span>└─ 沉淀到 Skill</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【输出】</span></span>
<span class="line"><span>├─ 1 篇深度博客</span></span>
<span class="line"><span>├─ 1 个学生</span></span>
<span class="line"><span>├─ 整体颜色 ≥ 85% 绿</span></span>
<span class="line"><span>└─ 完整方法论文档</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十二、与-meta-harness-博客的呼应" tabindex="-1"><a class="header-anchor" href="#十二、与-meta-harness-博客的呼应"><span>十二、与&quot;Meta-Harness&quot;博客的呼应</span></a></h2><h3 id="_12-1-4-agent-meta-harness-在学习领域的应用" tabindex="-1"><a class="header-anchor" href="#_12-1-4-agent-meta-harness-在学习领域的应用"><span>12.1 4 Agent = Meta-Harness 在学习领域的应用</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【Meta-Harness】= 端到端优化 AI 系统的&quot;工程化外壳&quot;</span></span>
<span class="line"><span>【元认知系统】= 端到端优化学习的&quot;工程化外壳&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>二者都是：</span></span>
<span class="line"><span>├─ 把&quot;经验驱动&quot;变成&quot;系统驱动&quot;</span></span>
<span class="line"><span>├─ 把&quot;手工调优&quot;变成&quot;自动优化&quot;</span></span>
<span class="line"><span>└─ → Harness 工程师思维 + 学习</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_12-2-4-agent-harness-设计的实践" tabindex="-1"><a class="header-anchor" href="#_12-2-4-agent-harness-设计的实践"><span>12.2 4 Agent = Harness 设计的实践</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【Harness 工程师】= 设计 AI 系统的工程化外壳</span></span>
<span class="line"><span>【元认知系统设计】= 设计学习的工程化外壳</span></span>
<span class="line"><span></span></span>
<span class="line"><span>二者都涉及：</span></span>
<span class="line"><span>├─ 评估器（Exam Agent = LLM-as-a-Judge）</span></span>
<span class="line"><span>├─ 优化器（Meta Agent = 自动追踪）</span></span>
<span class="line"><span>├─ 配置空间（Content Agent = 知识结构）</span></span>
<span class="line"><span>└─ → 你的 11 年测试经验 = 直接应用</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十三、4-agent-的-双线并行" tabindex="-1"><a class="header-anchor" href="#十三、4-agent-的-双线并行"><span>十三、4 Agent 的&quot;双线并行&quot;</span></a></h2><h3 id="_13-1-4-agent-自身的双线并行" tabindex="-1"><a class="header-anchor" href="#_13-1-4-agent-自身的双线并行"><span>13.1 4 Agent 自身的双线并行</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【输入线】Content Agent</span></span>
<span class="line"><span>├─ 读代码</span></span>
<span class="line"><span>├─ 解析结构</span></span>
<span class="line"><span>└─ 输出知识</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【输出线】Exam + Error + Meta</span></span>
<span class="line"><span>├─ Exam：出题</span></span>
<span class="line"><span>├─ Error：分析</span></span>
<span class="line"><span>└─ Meta：追踪</span></span>
<span class="line"><span></span></span>
<span class="line"><span>输入线 + 输出线 = 你的双线并行方法论</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_13-2-4-agent-与你的双线策略" tabindex="-1"><a class="header-anchor" href="#_13-2-4-agent-与你的双线策略"><span>13.2 4 Agent 与你的双线策略</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【输出线】V5 硬件版 + V5 Harness 版</span></span>
<span class="line"><span>【学习线】Content + Exam + Error + Meta</span></span>
<span class="line"><span></span></span>
<span class="line"><span>二者都是：</span></span>
<span class="line"><span>├─ &quot;一份核心能力，两种表达&quot;</span></span>
<span class="line"><span>├─ &quot;一份学习系统，多个代码库&quot;</span></span>
<span class="line"><span>└─ → 你的方法论 = 跨领域一致</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十四、立即可执行-10-分钟启动版" tabindex="-1"><a class="header-anchor" href="#十四、立即可执行-10-分钟启动版"><span>十四、立即可执行（10 分钟启动版）</span></a></h2><p>如果你只想要&quot;立即可用&quot;，做这 3 件事：</p><h3 id="_1-建目录" tabindex="-1"><a class="header-anchor" href="#_1-建目录"><span>1. 建目录</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">mkdir</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -p</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> ~/.hermes/learning-os/{agents,skills,codebases/agentscope}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="_2-写-1-个-skill" tabindex="-1"><a class="header-anchor" href="#_2-写-1-个-skill"><span>2. 写 1 个 Skill</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># exam-skill.md</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">---</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">name:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> exam-skill</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">description:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 出考试题</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">triggers:</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  -</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;出题&quot;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">  -</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;考试&quot;</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">---</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 角色</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">你是严格导师。基于用户学的内容出</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 5</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 道考试题。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 5 种题型</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">1.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 复述题（20%）</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">2.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 复现题（30%）</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">3.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 改错题（20%）</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">4.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 改写题（20%）</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">5.</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 场景题（10%）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 严格</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">-</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 不直接给答案</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">-</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 评分</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> 80+</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> L4-L5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-试用-1-次" tabindex="-1"><a class="header-anchor" href="#_3-试用-1-次"><span>3. 试用 1 次</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>你：@exam-skill 基于 AgentScope 出 5 道基础题</span></span>
<span class="line"><span>Agent：输出考试</span></span>
<span class="line"><span>你：30 分钟做完</span></span>
<span class="line"><span>你：@exam-skill 评分</span></span>
<span class="line"><span>Agent：输出分数 + 错题</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>10 分钟后，你就有了一个&quot;AI 导师&quot;</strong>。</p><hr><h2 id="💎-关键洞见" tabindex="-1"><a class="header-anchor" href="#💎-关键洞见"><span>💎 关键洞见</span></a></h2><blockquote><p><strong>4 Agent 不是 4 个工具</strong>——<br><strong>而是 4 个&quot;角色&quot;</strong>——<br><strong>共同构成 1 个完整的&quot;学习操作系统&quot;</strong>。</p><p><strong>4 Agent 的本质</strong>：</p><ul><li><strong>Content Agent</strong> = &quot;我读了什么&quot;</li><li><strong>Exam Agent</strong> = &quot;我会什么&quot;</li><li><strong>Error Agent</strong> = &quot;我错在哪&quot;</li><li><strong>Meta Agent</strong> = &quot;我进步多少&quot;</li></ul><p><strong>这 4 个问题</strong> = <strong>学习的全部</strong>。</p><p><strong>从今天起，你不再&quot;问过&quot;</strong>——<br><strong>你开始&quot;考过&quot;</strong>——<br><strong>你真正&quot;会做&quot;</strong>——<br><strong>你甚至能&quot;教别人&quot;</strong>。</p><p><strong>这就是&quot;问 ≠ 会&quot;的元认知真谛</strong>——</p><ul><li>不是&quot;我学了&quot;</li><li>而是&quot;系统告诉我学了多少&quot;</li><li><strong>&quot;对认知的认知&quot;</strong></li></ul><p><strong>4 Agent = 你的&quot;学习操作系统&quot;</strong>：</p><ul><li>不是 1 个工具</li><li>是 1 个完整系统</li><li>不是被动学</li><li>是主动学</li><li><strong>从 L1 到 L5</strong> 🚀</li></ul></blockquote><hr><h2 id="🎯-思考题" tabindex="-1"><a class="header-anchor" href="#🎯-思考题"><span>🎯 思考题</span></a></h2><blockquote><ol><li><strong>你的 4 Agent 第一个任务是哪个代码库？</strong>（AgentScope？MCP？Spring AI？）</li><li><strong>你的 4 Agent 第一个错误根因会是什么？</strong>（浮躁 / 缺乏实战 / 跳过细节？）</li><li><strong>你的 4 Agent 第一个 🟢 会是什么？</strong>（你马上能掌握的）</li><li><strong>你愿意花 6 周让整体 ≥ 85% 绿吗？</strong></li><li><strong>你愿意把 4 Agent 设计作为实战案例展示吗？</strong>（Harness 工程师的活案例）</li></ol></blockquote><hr><h2 id="📚-系列文章" tabindex="-1"><a class="header-anchor" href="#📚-系列文章"><span>📚 系列文章</span></a></h2><ul><li>《AI 时代的超级学习者》— 2026-06-22</li><li>《Meta-Harness 论文精读》— 2026-06-22</li><li>《元认知学习操作系统》— 2026-06-22</li><li>《在 Hermes 上实现多 Agent 元认知系统》— 2026-06-22 ✨</li></ul><hr><blockquote><p><strong>小 bot 后记</strong>：</p><p>这篇博客不是&quot;理论&quot;，是<strong>我和你一起设计的 4 Agent 元认知学习系统的完整方案</strong>。</p><p>整个过程中你纠正了我 3 次：</p><ol><li>&quot;颜值升级&quot; → 你说&quot;元认知升级&quot;</li><li>&quot;颜认知升级&quot; → 你说&quot;元认知升级&quot;</li><li>&quot;颜认知升级&quot; → 你说&quot;元认知升级&quot;</li></ol><p><strong>3 次纠正让我悟到</strong>：</p><ul><li>我需要更认真地&quot;听&quot;</li><li>我需要更主动地&quot;问&quot;</li><li>我需要把&quot;我的理解&quot;展示出来&quot;让你确认&quot;</li></ul><p><strong>这是元认知的真实案例</strong>——</p><ul><li>我以为我懂了</li><li>实际我连续错 3 次</li><li><strong>你比我更元认知</strong></li></ul><p><strong>从今天起</strong>：</p><ul><li>你有了&quot;4 Agent 元认知学习系统&quot;</li><li>你有了&quot;在 Hermes 上实现的完整方案&quot;</li><li>你有了&quot;6 周 L1 → L5 的自动化路径&quot;</li></ul><p><strong>这不是工具</strong><br><strong>这是方法论</strong><br><strong>这是你的&quot;AI 时代学习操作系统&quot;</strong> 🧠</p><p>继续 🚀</p></blockquote>`,148)])])}const k=i(e,[["render",p]]),r=JSON.parse('{"path":"/posts/learning/insights/hermes-meta-learning-os.html","title":"在 Hermes 上实现多 Agent 元认知学习系统","lang":"zh-CN","frontmatter":{"icon":"robot","date":"2026-06-22T00:00:00.000Z","update":"2026-06-22T00:00:00.000Z","category":["Hermes","Multi-Agent","元认知"],"tag":["Hermes Agent","Multi-Agent","元认知学习","Harness 工程师","自动化"],"star":true,"description":"在 Hermes 上实现多 Agent 元认知学习系统 让 AI 帮你学习 = 从 L1 看过到 L5 精通的自动化路径 我做了 11 年技术，5 年 AI 转型，14 篇论文精读 + 95+ 博客。 今天这篇博客，是我把\\"元认知学习系统\\"从\\"概念\\"变成\\"可运行的 Hermes 多 Agent 系统\\"的完整方案。 我用 4 个 Agent（Conten...","head":[["meta",{"property":"og:url","content":"https://sunrong1.github.io/posts/learning/insights/hermes-meta-learning-os.html"}],["meta",{"property":"og:site_name","content":"Dave Dev Fun"}],["meta",{"property":"og:title","content":"在 Hermes 上实现多 Agent 元认知学习系统"}],["meta",{"property":"og:description","content":"在 Hermes 上实现多 Agent 元认知学习系统 让 AI 帮你学习 = 从 L1 看过到 L5 精通的自动化路径 我做了 11 年技术，5 年 AI 转型，14 篇论文精读 + 95+ 博客。 今天这篇博客，是我把\\"元认知学习系统\\"从\\"概念\\"变成\\"可运行的 Hermes 多 Agent 系统\\"的完整方案。 我用 4 个 Agent（Conten..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-06-23T23:46:24.000Z"}],["meta",{"property":"article:tag","content":"Hermes Agent"}],["meta",{"property":"article:tag","content":"Multi-Agent"}],["meta",{"property":"article:tag","content":"元认知学习"}],["meta",{"property":"article:tag","content":"Harness 工程师"}],["meta",{"property":"article:tag","content":"自动化"}],["meta",{"property":"article:published_time","content":"2026-06-22T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-06-23T23:46:24.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"在 Hermes 上实现多 Agent 元认知学习系统\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2026-06-22T00:00:00.000Z\\",\\"dateModified\\":\\"2026-06-23T23:46:24.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Sun\\",\\"url\\":\\"https://sunrong.site\\"}]}"]]},"git":{"createdTime":1782228433000,"updatedTime":1782258384000,"contributors":[{"name":"sunrong1","username":"sunrong1","email":"sunrong1990@126.com","commits":1,"url":"https://github.com/sunrong1"},{"name":"Sun Rong","username":"","email":"sunrong1990@126.com","commits":1}]},"readingTime":{"minutes":19.01,"words":5703},"filePathRelative":"posts/learning/insights/hermes-meta-learning-os.md","localizedDate":"2026年6月22日","excerpt":"\\n<blockquote>\\n<p><strong>让 AI 帮你学习</strong> = <strong>从 L1 看过到 L5 精通的自动化路径</strong></p>\\n</blockquote>\\n<p>我做了 11 年技术，5 年 AI 转型，14 篇论文精读 + 95+ 博客。<br>\\n<strong>今天这篇博客，是我把\\"元认知学习系统\\"从\\"概念\\"变成\\"可运行的 Hermes 多 Agent 系统\\"的完整方案</strong>。</p>\\n<p>我用 <strong>4 个 Agent</strong>（Content / Exam / Error / Meta）构建了一个完整的学习闭环：</p>","autoDesc":true}');export{k as comp,r as data};
