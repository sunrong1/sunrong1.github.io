import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-9s6umXtu.js";const l={};function p(d,s){return e(),a("div",null,[...s[0]||(s[0]=[i(`<h1 id="sdd-敏捷混合工作流-—-长期项目的最优解" tabindex="-1"><a class="header-anchor" href="#sdd-敏捷混合工作流-—-长期项目的最优解"><span>SDD + 敏捷混合工作流 — 长期项目的最优解</span></a></h1><blockquote><p>前 3 篇博客讲了 SDD 实战感悟、模板、决策清单。本文是 SDD 系列第 4 篇——**长期项目（1 月 - 1 年）**的最优解：SDD + 敏捷混合工作流。</p></blockquote><h2 id="写在前面-为什么需要混合" tabindex="-1"><a class="header-anchor" href="#写在前面-为什么需要混合"><span>写在前面：为什么需要混合</span></a></h2><p>纯 SDD 和纯敏捷都有问题，长期项目需要混合。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【纯 SDD 的&lt;!-- more --&gt;</span></span>
<span class="line"><span>痛点】</span></span>
<span class="line"><span>- 前期慢</span></span>
<span class="line"><span>- 中后期变更成本高</span></span>
<span class="line"><span>- 不适合持续交付</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【纯敏捷的痛点】</span></span>
<span class="line"><span>- 文档缺失</span></span>
<span class="line"><span>- 架构漂移</span></span>
<span class="line"><span>- 长期项目失控</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【混合 = 取长补短】</span></span>
<span class="line"><span>- SDD 做骨架（spec / design / 总 tasks）</span></span>
<span class="line"><span>- 敏捷做血肉（每个 phase = 一个 sprint）</span></span>
<span class="line"><span>- 长期项目 = SDD 控盘</span></span>
<span class="line"><span>- 短期迭代 = 敏捷执行</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="一、总体架构-3-层结构" tabindex="-1"><a class="header-anchor" href="#一、总体架构-3-层结构"><span>一、总体架构（3 层结构）</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>┌──────────────────────────────────────┐</span></span>
<span class="line"><span>│         Layer 1：战略层（SDD）         │</span></span>
<span class="line"><span>│  ┌──────────────────────────────┐   │</span></span>
<span class="line"><span>│  │  spec.md（项目总需求）         │   │</span></span>
<span class="line"><span>│  │  design.md（项目总设计）       │   │</span></span>
<span class="line"><span>│  │  roadmap.md（路线图）          │   │</span></span>
<span class="line"><span>│  └──────────────────────────────┘   │</span></span>
<span class="line"><span>└──────────────┬───────────────────────┘</span></span>
<span class="line"><span>               │ 拆分</span></span>
<span class="line"><span>               ▼</span></span>
<span class="line"><span>┌──────────────────────────────────────┐</span></span>
<span class="line"><span>│      Layer 2：战术层（混合）          │</span></span>
<span class="line"><span>│  ┌──────────────────────────────┐   │</span></span>
<span class="line"><span>│  │  Phase 1 = 子 spec + 子 tasks │   │</span></span>
<span class="line"><span>│  │  Phase 2 = 子 spec + 子 tasks │   │</span></span>
<span class="line"><span>│  │  ...                          │   │</span></span>
<span class="line"><span>│  └──────────────────────────────┘   │</span></span>
<span class="line"><span>└──────────────┬───────────────────────┘</span></span>
<span class="line"><span>               │ 拆分</span></span>
<span class="line"><span>               ▼</span></span>
<span class="line"><span>┌──────────────────────────────────────┐</span></span>
<span class="line"><span>│         Layer 3：执行层（敏捷）        │</span></span>
<span class="line"><span>│  ┌──────────────────────────────┐   │</span></span>
<span class="line"><span>│  │  Sprint 1（1-2 周）           │   │</span></span>
<span class="line"><span>│  │  Sprint 2                     │   │</span></span>
<span class="line"><span>│  │  ...                          │   │</span></span>
<span class="line"><span>│  │  Demo + Retro                  │   │</span></span>
<span class="line"><span>│  └──────────────────────────────┘   │</span></span>
<span class="line"><span>└──────────────────────────────────────┘</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-层职责分工" tabindex="-1"><a class="header-anchor" href="#_3-层职责分工"><span>3 层职责分工</span></a></h3><table><thead><tr><th>层</th><th>文档</th><th>周期</th><th>稳定度</th><th>变更控制</th></tr></thead><tbody><tr><td><strong>战略层</strong></td><td>spec / design / roadmap</td><td>1-2 月</td><td>高</td><td>大变更才更新</td></tr><tr><td><strong>战术层</strong></td><td>phase-N-spec / phase-N-tasks</td><td>2-4 周</td><td>中</td><td>phase 调整</td></tr><tr><td><strong>执行层</strong></td><td>sprint backlog</td><td>1-2 周</td><td>低</td><td>sprint 内灵活</td></tr></tbody></table><hr><h2 id="二、4-大核心原则" tabindex="-1"><a class="header-anchor" href="#二、4-大核心原则"><span>二、4 大核心原则</span></a></h2><h3 id="_1-战略稳定-战术灵活" tabindex="-1"><a class="header-anchor" href="#_1-战略稳定-战术灵活"><span>1. 战略稳定，战术灵活</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【战略层】</span></span>
<span class="line"><span>- spec / design / roadmap</span></span>
<span class="line"><span>- 1-2 月稳定一次</span></span>
<span class="line"><span>- 大变更才更新</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【战术层】</span></span>
<span class="line"><span>- 每个 phase 的子 spec</span></span>
<span class="line"><span>- 2-4 周调整一次</span></span>
<span class="line"><span>- 跟随 sprint</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【执行层】</span></span>
<span class="line"><span>- sprint 内容</span></span>
<span class="line"><span>- 1-2 周调整</span></span>
<span class="line"><span>- 灵活应对</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-文档分层管理" tabindex="-1"><a class="header-anchor" href="#_2-文档分层管理"><span>2. 文档分层管理</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【战略文档】</span></span>
<span class="line"><span>- 全员共享</span></span>
<span class="line"><span>- 1-2 月 review</span></span>
<span class="line"><span>- Git + Wiki</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【战术文档】</span></span>
<span class="line"><span>- 团队共享</span></span>
<span class="line"><span>- 每 phase review</span></span>
<span class="line"><span>- Git + Notion</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【执行文档】</span></span>
<span class="line"><span>- 个人持有</span></span>
<span class="line"><span>- daily 更新</span></span>
<span class="line"><span>- Jira / Linear / GitHub Issues</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-review-三层节奏" tabindex="-1"><a class="header-anchor" href="#_3-review-三层节奏"><span>3. review 三层节奏</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【战略层 review】</span></span>
<span class="line"><span>- 每月 1 次</span></span>
<span class="line"><span>- 全员 + 利益相关方</span></span>
<span class="line"><span>- 检查 spec / design / roadmap 是否需要调整</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【战术层 review】</span></span>
<span class="line"><span>- 每 phase 1 次</span></span>
<span class="line"><span>- 团队 + tech lead</span></span>
<span class="line"><span>- 检查 phase spec / tasks 是否合理</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【执行层 review】</span></span>
<span class="line"><span>- 每个 sprint 1 次</span></span>
<span class="line"><span>- 团队 demo + retro</span></span>
<span class="line"><span>- 检查 sprint 任务是否完成</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-变更控制分层" tabindex="-1"><a class="header-anchor" href="#_4-变更控制分层"><span>4. 变更控制分层</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【战略层变更】</span></span>
<span class="line"><span>- 影响范围大</span></span>
<span class="line"><span>- 需要充分讨论</span></span>
<span class="line"><span>- spec 改 → design 改 → 全部 phase 改</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【战术层变更】</span></span>
<span class="line"><span>- 影响范围中</span></span>
<span class="line"><span>- 团队决策</span></span>
<span class="line"><span>- phase spec 改 + 当前 phase 调整</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【执行层变更】</span></span>
<span class="line"><span>- 影响范围小</span></span>
<span class="line"><span>- 个人决策</span></span>
<span class="line"><span>- sprint 内任务调整</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、实战流程" tabindex="-1"><a class="header-anchor" href="#三、实战流程"><span>三、实战流程</span></a></h2><h3 id="phase-0-项目启动-1-周" tabindex="-1"><a class="header-anchor" href="#phase-0-项目启动-1-周"><span>Phase 0：项目启动（1 周）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【用 SDD】</span></span>
<span class="line"><span>- 写 spec.md（项目总需求）</span></span>
<span class="line"><span>- 写 design.md（项目总设计）</span></span>
<span class="line"><span>- 写 roadmap.md（拆 N 个 phase）</span></span>
<span class="line"><span>- 串讲 + 团队 review</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【产出】</span></span>
<span class="line"><span>- 战略层文档稳定</span></span>
<span class="line"><span>- phase 划分清晰</span></span>
<span class="line"><span>- 团队对齐</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="phase-1-第一阶段-2-4-周" tabindex="-1"><a class="header-anchor" href="#phase-1-第一阶段-2-4-周"><span>Phase 1：第一阶段（2-4 周）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【第 1 周：mini-SDD】</span></span>
<span class="line"><span>- 写 phase-1-spec.md（细化 Phase 1 需求）</span></span>
<span class="line"><span>- 写 phase-1-tasks.md（Phase 1 任务拆分）</span></span>
<span class="line"><span>- 串讲 + 团队对齐</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【第 2-3 周：Sprint 1-2】</span></span>
<span class="line"><span>- 每周 1 个 sprint</span></span>
<span class="line"><span>- 每日 standup</span></span>
<span class="line"><span>- 每周五 demo + retro</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【第 4 周：Phase 1 收尾】</span></span>
<span class="line"><span>- Phase 1 验收</span></span>
<span class="line"><span>- 更新战略层（如需要）</span></span>
<span class="line"><span>- 启动 Phase 2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="phase-2-起-重复-phase-1-流程" tabindex="-1"><a class="header-anchor" href="#phase-2-起-重复-phase-1-流程"><span>Phase 2 起：重复 Phase 1 流程</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- mini-SDD（第 1 周）</span></span>
<span class="line"><span>- Sprint 3-4（第 2-3 周）</span></span>
<span class="line"><span>- Phase N 收尾（第 4 周）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="四、模板-roadmap-md-路线图" tabindex="-1"><a class="header-anchor" href="#四、模板-roadmap-md-路线图"><span>四、模板：<a href="http://roadmap.md" target="_blank" rel="noopener noreferrer">roadmap.md</a>（路线图）</span></a></h2><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">项目名</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> - Roadmap</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#5C6370;--shiki-dark-font-style:inherit;">&gt; 项目 N 个阶段的总路线图。每个 phase 是一个 mini-SDD。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 项目里程碑</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| Phase | 名称 | 周期 | 关键产出 | 负责人 | 状态 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|-------|------|------|---------|--------|------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P0 | 项目脚手架 | 1 周 | 项目能跑 | </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | ✅ |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P1 | [阶段 1] | 3 周 | [产出 1] | </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | 🚧 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P2 | [阶段 2] | 3 周 | [产出 2] | </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | 📋 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P3 | [阶段 3] | 4 周 | [产出 3] | </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | 📋 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P4 | 上线 + 优化 | 2 周 | 生产可用 | </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | 📋 |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Phase 详细拆分</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### Phase 1: </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">名称</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 周期：3 周（1 周 mini-SDD + 2 周 sprint）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 关键产出：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 验收标准：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 依赖：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### Phase 2: </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">名称</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">（同 Phase 1 结构）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 风险跟踪</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 风险 | 状态 | 处理 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|------|------|------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| Phase 1 延期 | 待观察 | 预留 buffer |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 修订历史</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 版本 | 日期 | 作者 | 变更 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|------|------|------|------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| v1.0 | ... | ... | 初稿 |</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="五、模板-phase-n-spec-md" tabindex="-1"><a class="header-anchor" href="#五、模板-phase-n-spec-md"><span>五、模板：<a href="http://phase-N-spec.md" target="_blank" rel="noopener noreferrer">phase-N-spec.md</a></span></a></h2><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">项目名</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> - Phase </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">N</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> Spec</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#5C6370;--shiki-dark-font-style:inherit;">&gt; 本文档是 Phase </span><span style="--shiki-light:#986801;--shiki-light-font-style:italic;--shiki-dark:#5C6370;--shiki-dark-font-style:inherit;">[</span><span style="--shiki-light:#4078F2;--shiki-light-font-style:italic;--shiki-dark:#61AFEF;--shiki-dark-font-style:inherit;">N</span><span style="--shiki-light:#986801;--shiki-light-font-style:italic;--shiki-dark:#5C6370;--shiki-dark-font-style:inherit;">]</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#5C6370;--shiki-dark-font-style:inherit;"> 的细化 spec，是从项目总 spec 拆出来的。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 1. 本阶段目标</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 1.1 业务目标</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">本阶段要解决什么业务问题？</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 1.2 验收标准</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 标准 1</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 标准 2</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 2. 功能需求（从总 spec 拆出）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 2.1 本阶段必须</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] F1.1: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] F1.2: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 2.2 本阶段可选（如时间允许）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] F1.3: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 3. 非功能需求</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 性能：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 安全：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 兼容：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 4. 与项目总 spec 的关系</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[本阶段对应总 spec 的哪几节？]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 5. 范围之外（Out of Scope）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [本阶段不做，但后续 phase 可能做的]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 6. 风险</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 风险 | 概率 | 影响 | 对冲 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|------|------|------|------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 7. 修订历史</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 版本 | 日期 | 作者 | 变更 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|------|------|------|------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| v1.0 | ... | ... | 初稿 |</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、模板-phase-n-tasks-md" tabindex="-1"><a class="header-anchor" href="#六、模板-phase-n-tasks-md"><span>六、模板：<a href="http://phase-N-tasks.md" target="_blank" rel="noopener noreferrer">phase-N-tasks.md</a></span></a></h2><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">项目名</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> - Phase </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">N</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> Tasks</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#5C6370;--shiki-dark-font-style:inherit;">&gt; 本阶段任务拆分，按 sprint 划分。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Sprint 总览</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| Sprint | 周期 | 目标 | 状态 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|--------|------|------|------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| Sprint N.1 | 2 周 | [目标 1] | 🚧 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| Sprint N.2 | 2 周 | [目标 2] | 📋 |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Sprint N.1: </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">名称</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 目标</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[sprint 目标]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 任务（按 backlog 排序）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T1: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">任务</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | 估时 2 天 | 状态 🚧</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T2: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">任务</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | 估时 1 天 | 状态 📋</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T3: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">任务</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | 估时 3 天 | 状态 📋</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 验收</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 标准 1</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 标准 2</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 风险</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 风险 1</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Sprint N.2: </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">名称</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">（同 Sprint N.1 结构）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 跨 Sprint 跟踪</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 任务 | Sprint | 状态 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|------|--------|------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| T1 | N.1 | 🚧 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| T2 | N.1 | 📋 |</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="七、sprint-节奏-敏捷部分" tabindex="-1"><a class="header-anchor" href="#七、sprint-节奏-敏捷部分"><span>七、Sprint 节奏（敏捷部分）</span></a></h2><h3 id="每日-standup-15-分钟" tabindex="-1"><a class="header-anchor" href="#每日-standup-15-分钟"><span>每日 standup（15 分钟）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【3 个问题】</span></span>
<span class="line"><span>1. 昨天做了什么？</span></span>
<span class="line"><span>2. 今天做什么？</span></span>
<span class="line"><span>3. 有什么阻碍？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【原则】</span></span>
<span class="line"><span>- 不解决问题，只同步</span></span>
<span class="line"><span>- 阻碍 → 会后单独解决</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="每周-demo-30-分钟" tabindex="-1"><a class="header-anchor" href="#每周-demo-30-分钟"><span>每周 demo（30 分钟）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【内容】</span></span>
<span class="line"><span>- 本周完成的 phase 子任务</span></span>
<span class="line"><span>- 演示给团队 + 利益相关方</span></span>
<span class="line"><span>- 收集反馈</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【原则】</span></span>
<span class="line"><span>- 必须可演示</span></span>
<span class="line"><span>- 不演示 = 没完成</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="每两周-retro-1-小时" tabindex="-1"><a class="header-anchor" href="#每两周-retro-1-小时"><span>每两周 retro（1 小时）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【3 个问题】</span></span>
<span class="line"><span>1. 什么做得好？</span></span>
<span class="line"><span>2. 什么做得不好？</span></span>
<span class="line"><span>3. 下次怎么改进？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【产出】</span></span>
<span class="line"><span>- 1-3 个改进行动</span></span>
<span class="line"><span>- 下次 retro 跟进</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="八、混合工作流的-5-大优势" tabindex="-1"><a class="header-anchor" href="#八、混合工作流的-5-大优势"><span>八、混合工作流的 5 大优势</span></a></h2><h3 id="_1-战略清晰" tabindex="-1"><a class="header-anchor" href="#_1-战略清晰"><span>1. 战略清晰</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 总 spec / design = 项目骨架</span></span>
<span class="line"><span>- 团队对齐不漂移</span></span>
<span class="line"><span>- 长期项目不失控</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-战术灵活" tabindex="-1"><a class="header-anchor" href="#_2-战术灵活"><span>2. 战术灵活</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 每个 phase = mini-SDD</span></span>
<span class="line"><span>- 跟随 sprint 调整</span></span>
<span class="line"><span>- 不被前期设计绑架</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-执行敏捷" tabindex="-1"><a class="header-anchor" href="#_3-执行敏捷"><span>3. 执行敏捷</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- Sprint 短迭代</span></span>
<span class="line"><span>- 每日 standup</span></span>
<span class="line"><span>- 每周 demo</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-文档分层" tabindex="-1"><a class="header-anchor" href="#_4-文档分层"><span>4. 文档分层</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 战略文档 = 稳定</span></span>
<span class="line"><span>- 战术文档 = 半稳定</span></span>
<span class="line"><span>- 执行文档 = 灵活</span></span>
<span class="line"><span>- 各层互不干扰</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-风险可控" tabindex="-1"><a class="header-anchor" href="#_5-风险可控"><span>5. 风险可控</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 战略层风险 = 1-2 月发现</span></span>
<span class="line"><span>- 战术层风险 = 2-4 周发现</span></span>
<span class="line"><span>- 执行层风险 = 每天发现</span></span>
<span class="line"><span>= 早发现早处理</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="九、混合-vs-纯-sdd-vs-纯敏捷" tabindex="-1"><a class="header-anchor" href="#九、混合-vs-纯-sdd-vs-纯敏捷"><span>九、混合 vs 纯 SDD vs 纯敏捷</span></a></h2><table><thead><tr><th>维度</th><th>纯 SDD</th><th>纯敏捷</th><th>混合</th></tr></thead><tbody><tr><td><strong>前期投入</strong></td><td>高</td><td>低</td><td>中</td></tr><tr><td><strong>中后期灵活</strong></td><td>低</td><td>高</td><td>高</td></tr><tr><td><strong>文档完整度</strong></td><td>高</td><td>低</td><td>中高</td></tr><tr><td><strong>团队对齐</strong></td><td>强</td><td>弱</td><td>强</td></tr><tr><td><strong>适用项目</strong></td><td>1-4 周</td><td>任意</td><td>1 月 - 1 年</td></tr><tr><td><strong>变更成本</strong></td><td>高</td><td>低</td><td>中</td></tr><tr><td><strong>失败风险</strong></td><td>设计错</td><td>架构漂移</td><td>可控</td></tr></tbody></table><hr><h2 id="十、适用-vs-不适用" tabindex="-1"><a class="header-anchor" href="#十、适用-vs-不适用"><span>十、适用 vs 不适用</span></a></h2><h3 id="✅-适用场景" tabindex="-1"><a class="header-anchor" href="#✅-适用场景"><span>✅ 适用场景</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1. 长期项目（1 月 - 1 年）</span></span>
<span class="line"><span>2. 持续交付（产品 + 迭代）</span></span>
<span class="line"><span>3. 团队规模 3-10 人</span></span>
<span class="line"><span>4. 需求基本清晰但允许变化</span></span>
<span class="line"><span>5. 失败成本中等</span></span>
<span class="line"><span>6. 团队愿意写文档</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="❌-不适用场景" tabindex="-1"><a class="header-anchor" href="#❌-不适用场景"><span>❌ 不适用场景</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1. 1 周小项目（直接 SDD）</span></span>
<span class="line"><span>2. 紧急上线（直接干）</span></span>
<span class="line"><span>3. 完全模糊需求（先调研）</span></span>
<span class="line"><span>4. 强依赖其他团队（等稳定）</span></span>
<span class="line"><span>5. 1 人小项目（纯 SDD 即可）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十一、实战案例-数字员工-ai-产品化" tabindex="-1"><a class="header-anchor" href="#十一、实战案例-数字员工-ai-产品化"><span>十一、实战案例（数字员工 AI 产品化）</span></a></h2><h3 id="项目背景" tabindex="-1"><a class="header-anchor" href="#项目背景"><span>项目背景</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 周期：3 月</span></span>
<span class="line"><span>- 团队：3 人</span></span>
<span class="line"><span>- 失败成本：中</span></span>
<span class="line"><span>- 目标：从 MVP 到生产可用</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="混合工作流实施" tabindex="-1"><a class="header-anchor" href="#混合工作流实施"><span>混合工作流实施</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>Month 1：</span></span>
<span class="line"><span>- Week 1: SDD（spec + design + roadmap）</span></span>
<span class="line"><span>- Week 2-3: Sprint 1-2（Phase 1: MVP 核心）</span></span>
<span class="line"><span>- Week 4: demo + retro + 启动 Phase 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Month 2：</span></span>
<span class="line"><span>- Week 5-6: Sprint 3-4（Phase 2: 功能完善）</span></span>
<span class="line"><span>- Week 7-8: Sprint 5-6（Phase 2 收尾）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Month 3：</span></span>
<span class="line"><span>- Week 9-10: Sprint 7-8（Phase 3: 性能 + 安全）</span></span>
<span class="line"><span>- Week 11-12: 上线 + 优化</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="产出清单" tabindex="-1"><a class="header-anchor" href="#产出清单"><span>产出清单</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【战略层】</span></span>
<span class="line"><span>- spec.md（项目总需求）</span></span>
<span class="line"><span>- design.md（项目总设计）</span></span>
<span class="line"><span>- roadmap.md（路线图）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【战术层】</span></span>
<span class="line"><span>- phase-1-spec.md / phase-1-tasks.md</span></span>
<span class="line"><span>- phase-2-spec.md / phase-2-tasks.md</span></span>
<span class="line"><span>- phase-3-spec.md / phase-3-tasks.md</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【执行层】</span></span>
<span class="line"><span>- 每个 sprint 的 backlog</span></span>
<span class="line"><span>- 每周 demo 视频</span></span>
<span class="line"><span>- 每两周 retro 记录</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十二、5-大常见坑-解决" tabindex="-1"><a class="header-anchor" href="#十二、5-大常见坑-解决"><span>十二、5 大常见坑 + 解决</span></a></h2><h3 id="坑-1-战略层频繁改动" tabindex="-1"><a class="header-anchor" href="#坑-1-战略层频繁改动"><span>坑 1：战略层频繁改动</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【症状】</span></span>
<span class="line"><span>- 每月改 spec</span></span>
<span class="line"><span>- 每月改 design</span></span>
<span class="line"><span>- 团队无所适从</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【解决】</span></span>
<span class="line"><span>- 战略层稳定窗口 = 至少 2 月</span></span>
<span class="line"><span>- 大变更才触发 review</span></span>
<span class="line"><span>- 区分&quot;小调整&quot;vs&quot;战略变更&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="坑-2-战术层不收敛" tabindex="-1"><a class="header-anchor" href="#坑-2-战术层不收敛"><span>坑 2：战术层不收敛</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【症状】</span></span>
<span class="line"><span>- phase 一直延期</span></span>
<span class="line"><span>- tasks 一直加</span></span>
<span class="line"><span>- 越做越乱</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【解决】</span></span>
<span class="line"><span>- 强制 phase 截止日</span></span>
<span class="line"><span>- 范围内 = 必做</span></span>
<span class="line"><span>- 范围外 = 下个 phase</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="坑-3-执行层-sprint-不规律" tabindex="-1"><a class="header-anchor" href="#坑-3-执行层-sprint-不规律"><span>坑 3：执行层 sprint 不规律</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【症状】</span></span>
<span class="line"><span>- sprint 长度混乱（1 周 / 3 周）</span></span>
<span class="line"><span>- standup 时有时无</span></span>
<span class="line"><span>- demo 跳票</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【解决】</span></span>
<span class="line"><span>- sprint 长度固定（2 周最佳）</span></span>
<span class="line"><span>- standup 强制</span></span>
<span class="line"><span>- demo 强制</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="坑-4-文档维护脱节" tabindex="-1"><a class="header-anchor" href="#坑-4-文档维护脱节"><span>坑 4：文档维护脱节</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【症状】</span></span>
<span class="line"><span>- sprint 完成但 tasks.md 没更新</span></span>
<span class="line"><span>- phase 完成但 phase-spec.md 没更新</span></span>
<span class="line"><span>- 战略层文档过期</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【解决】</span></span>
<span class="line"><span>- sprint 完成 = 自动更新 tasks.md</span></span>
<span class="line"><span>- phase 完成 = 自动更新 roadmap.md</span></span>
<span class="line"><span>- 每月 review 战略层</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="坑-5-角色混乱" tabindex="-1"><a class="header-anchor" href="#坑-5-角色混乱"><span>坑 5：角色混乱</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【症状】</span></span>
<span class="line"><span>- 谁都写 spec</span></span>
<span class="line"><span>- 谁都改 design</span></span>
<span class="line"><span>- 没有 owner</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【解决】</span></span>
<span class="line"><span>- 战略层：1 个 owner</span></span>
<span class="line"><span>- 战术层：每个 phase 1 个 lead</span></span>
<span class="line"><span>- 执行层：sprint 内灵活</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十三、工具栈推荐" tabindex="-1"><a class="header-anchor" href="#十三、工具栈推荐"><span>十三、工具栈推荐</span></a></h2><h3 id="战略层" tabindex="-1"><a class="header-anchor" href="#战略层"><span>战略层</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- Git + Markdown（spec / design / roadmap）</span></span>
<span class="line"><span>- Wiki（Confluence / Notion）</span></span>
<span class="line"><span>- 版本控制：Git</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="战术层" tabindex="-1"><a class="header-anchor" href="#战术层"><span>战术层</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- Git + Markdown（phase-N-spec / phase-N-tasks）</span></span>
<span class="line"><span>- Notion（团队协作）</span></span>
<span class="line"><span>- 文档评论 + 串讲</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="执行层" tabindex="-1"><a class="header-anchor" href="#执行层"><span>执行层</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- Jira / Linear / GitHub Issues（backlog）</span></span>
<span class="line"><span>- Slack / 飞书（standup）</span></span>
<span class="line"><span>- Miro / FigJam（demo 可视化）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十四、如何选择工作流" tabindex="-1"><a class="header-anchor" href="#十四、如何选择工作流"><span>十四、如何选择工作流</span></a></h2><h3 id="决策表" tabindex="-1"><a class="header-anchor" href="#决策表"><span>决策表</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【项目 &lt; 1 周】</span></span>
<span class="line"><span>  → 纯 SDD（或直接干）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【项目 1-4 周】</span></span>
<span class="line"><span>  → 标准 SDD</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【项目 1 月 - 1 年】</span></span>
<span class="line"><span>  → SDD + 敏捷混合 ✅</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【项目 &gt; 1 年】</span></span>
<span class="line"><span>  → 混合 + 多 team</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="团队规模适配" tabindex="-1"><a class="header-anchor" href="#团队规模适配"><span>团队规模适配</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【1 人】→ 纯 SDD</span></span>
<span class="line"><span>【2-3 人】→ SDD + 轻敏捷</span></span>
<span class="line"><span>【3-10 人】→ 混合工作流</span></span>
<span class="line"><span>【10+ 人】→ 混合 + 多 team</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="十五、sdd-系列总结" tabindex="-1"><a class="header-anchor" href="#十五、sdd-系列总结"><span>十五、SDD 系列总结</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【第 1 篇】SDD 模式 AI Coding 实战感悟（流程 + 踩坑）</span></span>
<span class="line"><span>【第 2 篇】SDD 模式实战指南（决策清单 + 三份模板）</span></span>
<span class="line"><span>【第 3 篇】（本文）SDD + 敏捷混合工作流（长期项目）</span></span>
<span class="line"><span>【第 4 篇】（待写）SDD 与 AI Coding 的未来</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="写在最后-混合是常态" tabindex="-1"><a class="header-anchor" href="#写在最后-混合是常态"><span>写在最后：混合是常态</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【工作流选择的真相】</span></span>
<span class="line"><span>- 没有&quot;最好的&quot;工作流</span></span>
<span class="line"><span>- 只有&quot;最适合的&quot;工作流</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【SDD 的本质】</span></span>
<span class="line"><span>- 不是&quot;写文档&quot;</span></span>
<span class="line"><span>- 是&quot;在变化中找到稳定&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【敏捷的本质】</span></span>
<span class="line"><span>- 不是&quot;快速迭代&quot;</span></span>
<span class="line"><span>- 是&quot;在稳定中拥抱变化&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【混合的本质】</span></span>
<span class="line"><span>- 战略稳定 + 战术灵活 + 执行敏捷</span></span>
<span class="line"><span>- 长期项目的不二之选</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="思维模型附录" tabindex="-1"><a class="header-anchor" href="#思维模型附录"><span>思维模型附录</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1. 分层思维：3 层结构 = 战略 + 战术 + 执行</span></span>
<span class="line"><span>2. 节奏思维：3 层 review 节奏不同</span></span>
<span class="line"><span>3. 变更控制：分层变更 = 不同风险等级</span></span>
<span class="line"><span>4. 文档分层：稳定 / 半稳定 / 灵活</span></span>
<span class="line"><span>5. 决策矩阵：根据项目时长 + 团队规模选择</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="给读者的-3-个问题" tabindex="-1"><a class="header-anchor" href="#给读者的-3-个问题"><span>给读者的 3 个问题</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1. 你目前项目用纯 SDD 还是纯敏捷？</span></span>
<span class="line"><span>   我：1 周内 SDD，1 月 + 混合</span></span>
<span class="line"><span>2. 你的战略层文档多久 review 一次？</span></span>
<span class="line"><span>   我：每月 1 次</span></span>
<span class="line"><span>3. 你的 sprint 长度固定吗？</span></span>
<span class="line"><span>   我：固定 2 周</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>SDD 不是工具，是纪律。敏捷不是混乱，是节奏。混合不是妥协，是最优。</strong></p><p><strong>长期项目 = SDD 控盘 + 敏捷执行 = 战略清晰 + 战术灵活。</strong></p>`,115)])])}const t=n(l,[["render",p]]),c=JSON.parse('{"path":"/posts/learning/insights/SDD%E6%95%8F%E6%8D%B7%E6%B7%B7%E5%90%88%E5%B7%A5%E4%BD%9C%E6%B5%81.html","title":"SDD + 敏捷混合工作流 — 长期项目的最优解","lang":"zh-CN","frontmatter":{"title":"SDD + 敏捷混合工作流 — 长期项目的最优解","category":"AI Coding","tag":"SDD / 敏捷 / 工程实践","cover":"/img/cover-sdd-agile.jpg","icon":"🔄","date":"2026-08-03T08:30:00.000Z","description":"前 3 篇博客讲了 SDD 实战感悟、模板、决策清单。本文是 SDD 系列第 4 篇——**长期项目（1 月 - 1 年）**的最优解：SDD + 敏捷混合工作流。 写在前面：为什么需要混合 纯 SDD 和纯敏捷都有问题，长期项目需要混合。","head":[["meta",{"property":"og:url","content":"https://sunrong1.github.io/posts/learning/insights/SDD%E6%95%8F%E6%8D%B7%E6%B7%B7%E5%90%88%E5%B7%A5%E4%BD%9C%E6%B5%81.html"}],["meta",{"property":"og:site_name","content":"Dave Dev Fun"}],["meta",{"property":"og:title","content":"SDD + 敏捷混合工作流 — 长期项目的最优解"}],["meta",{"property":"og:description","content":"前 3 篇博客讲了 SDD 实战感悟、模板、决策清单。本文是 SDD 系列第 4 篇——**长期项目（1 月 - 1 年）**的最优解：SDD + 敏捷混合工作流。 写在前面：为什么需要混合 纯 SDD 和纯敏捷都有问题，长期项目需要混合。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://sunrong1.github.io/img/cover-sdd-agile.jpg"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-08-06T23:57:31.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:src","content":"https://sunrong1.github.io/img/cover-sdd-agile.jpg"}],["meta",{"name":"twitter:image:alt","content":"SDD + 敏捷混合工作流 — 长期项目的最优解"}],["meta",{"property":"article:tag","content":"SDD / 敏捷 / 工程实践"}],["meta",{"property":"article:published_time","content":"2026-08-03T08:30:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-08-06T23:57:31.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"SDD + 敏捷混合工作流 — 长期项目的最优解\\",\\"image\\":[\\"https://sunrong1.github.io/img/cover-sdd-agile.jpg\\"],\\"datePublished\\":\\"2026-08-03T08:30:00.000Z\\",\\"dateModified\\":\\"2026-08-06T23:57:31.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Sun\\",\\"url\\":\\"https://sunrong.site\\"}]}"]]},"git":{"createdTime":1785894792000,"updatedTime":1786060651000,"contributors":[{"name":"Sun Rong","username":"","email":"sunrong1990@126.com","commits":2}]},"readingTime":{"minutes":9.11,"words":2732},"filePathRelative":"posts/learning/insights/SDD敏捷混合工作流.md","localizedDate":"2026年8月3日","excerpt":"\\n<blockquote>\\n<p>前 3 篇博客讲了 SDD 实战感悟、模板、决策清单。本文是 SDD 系列第 4 篇——**长期项目（1 月 - 1 年）**的最优解：SDD + 敏捷混合工作流。</p>\\n</blockquote>\\n<h2>写在前面：为什么需要混合</h2>\\n<p>纯 SDD 和纯敏捷都有问题，长期项目需要混合。</p>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span>【纯 SDD 的</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{t as comp,c as data};
