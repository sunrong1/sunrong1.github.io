import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,a,o as e}from"./app-9s6umXtu.js";const l={};function p(d,s){return e(),n("div",null,[...s[0]||(s[0]=[a(`<h1 id="sdd-模式实战指南-—-决策清单-三份标准模板" tabindex="-1"><a class="header-anchor" href="#sdd-模式实战指南-—-决策清单-三份标准模板"><span>SDD 模式实战指南 — 决策清单 + 三份标准模板</span></a></h1><blockquote><p>上篇博客《SDD 模式 AI Coding 实战感悟》讲了流程与踩坑。这篇是<strong>可直接复用的模板</strong>——包含&quot;该不该用 SDD&quot;的决策清单 + spec / design / tasks 三份标准模板。</p></blockquote><h2 id="写在前面-为什么需要这份模板" tabindex="-1"><a class="header-anchor" href="#写在前面-为什么需要这份模板"><span>写在前面：为什么需要这份模板</span></a></h2><p>SDD 模式不是万能的，但用对了是质变工具。用错了则是浪费时间。</p><p>本文解决两个核心问题：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1. 我这个项目，到底适不适合用 SDD？</span></span>
<span class="line"><span>2. 如果适合，三份文档应该怎么写？</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第一部分-sdd-适用性决策清单" tabindex="-1"><a class="header-anchor" href="#第一部分-sdd-适用性决策清单"><span>第一部分：SDD 适用性决策清单</span></a></h1><h2 id="一、sdd-不是银弹" tabindex="-1"><a class="header-anchor" href="#一、sdd-不是银弹"><span>一、SDD 不是银弹</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【SDD 的本质】</span></span>
<span class="line"><span>- 不是文档模板</span></span>
<span class="line"><span>- 是工作纪律</span></span>
<span class="line"><span>- 是&quot;先想清楚再动手&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【SDD 的代价】</span></span>
<span class="line"><span>- 前期文档投入大</span></span>
<span class="line"><span>- 一个人承担多个角色</span></span>
<span class="line"><span>- 认知负荷高</span></span>
<span class="line"><span>- 适合中小项目</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【SDD 的真实定位】</span></span>
<span class="line"><span>- 把&quot;AI 写代码&quot;从&quot;碰运气&quot;变成&quot;有纪律&quot;</span></span>
<span class="line"><span>- 适合 1-4 周中等项目</span></span>
<span class="line"><span>- 不适合 1 天小项目，也不适合 3 月大项目（拆分）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、适用的-7-大场景" tabindex="-1"><a class="header-anchor" href="#二、适用的-7-大场景"><span>二、适用的 7 大场景</span></a></h2><h3 id="✅-1-需求清晰但模糊" tabindex="-1"><a class="header-anchor" href="#✅-1-需求清晰但模糊"><span>✅ 1. 需求清晰但模糊</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 你知道大概要做什么</span></span>
<span class="line"><span>- 但边界 / 异常路径不清楚</span></span>
<span class="line"><span>- SDD 帮你&quot;写清楚&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="✅-2-技术栈熟悉" tabindex="-1"><a class="header-anchor" href="#✅-2-技术栈熟悉"><span>✅ 2. 技术栈熟悉</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 你对设计中的技术 80%+ 熟悉</span></span>
<span class="line"><span>- 不需要花时间学习新技术</span></span>
<span class="line"><span>- SDD 才能发挥效率</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="✅-3-复杂度中等" tabindex="-1"><a class="header-anchor" href="#✅-3-复杂度中等"><span>✅ 3. 复杂度中等</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 1-4 周项目</span></span>
<span class="line"><span>- 1-2 人月</span></span>
<span class="line"><span>- 太大了不行，太小了浪费</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="✅-4-需求变更可控" tabindex="-1"><a class="header-anchor" href="#✅-4-需求变更可控"><span>✅ 4. 需求变更可控</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 不会每周大改</span></span>
<span class="line"><span>- spec 一旦稳定 = 后续小修</span></span>
<span class="line"><span>- 频繁变更 = SDD 文档会过期</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="✅-5-团队-个人愿意写文档" tabindex="-1"><a class="header-anchor" href="#✅-5-团队-个人愿意写文档"><span>✅ 5. 团队 / 个人愿意写文档</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 不是&quot;赶紧出活&quot;</span></span>
<span class="line"><span>- 愿意&quot;先想再干&quot;</span></span>
<span class="line"><span>- 文化匹配</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="✅-6-有可验证里程碑" tabindex="-1"><a class="header-anchor" href="#✅-6-有可验证里程碑"><span>✅ 6. 有可验证里程碑</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 能拆分 phase</span></span>
<span class="line"><span>- 每个 phase 跑起来看效果</span></span>
<span class="line"><span>- 不可验证 = 别用 SDD</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="✅-7-独立可交付" tabindex="-1"><a class="header-anchor" href="#✅-7-独立可交付"><span>✅ 7. 独立可交付</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 不强依赖其他团队</span></span>
<span class="line"><span>- 不需要每日联调</span></span>
<span class="line"><span>- 可以独立 E2E 验证</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、不适用的-6-大场景" tabindex="-1"><a class="header-anchor" href="#三、不适用的-6-大场景"><span>三、不适用的 6 大场景</span></a></h2><h3 id="❌-1-紧急上线" tabindex="-1"><a class="header-anchor" href="#❌-1-紧急上线"><span>❌ 1. 紧急上线</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 时间紧到没时间写文档</span></span>
<span class="line"><span>- 1-3 天要上线</span></span>
<span class="line"><span>- 用 SDD = 拖延上线</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="❌-2-技术完全陌生" tabindex="-1"><a class="header-anchor" href="#❌-2-技术完全陌生"><span>❌ 2. 技术完全陌生</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 你对设计中的技术 50% 以下熟悉</span></span>
<span class="line"><span>- SDD 的 design 阶段 = 学习阶段</span></span>
<span class="line"><span>- 不如直接看代码 + 学</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="❌-3-需求完全模糊" tabindex="-1"><a class="header-anchor" href="#❌-3-需求完全模糊"><span>❌ 3. 需求完全模糊</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 你不知道要做什么</span></span>
<span class="line"><span>- 客户自己也说不清</span></span>
<span class="line"><span>- SDD = 把模糊变精确，但起点不能太模糊</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="❌-4-小项目-玩具" tabindex="-1"><a class="header-anchor" href="#❌-4-小项目-玩具"><span>❌ 4. 小项目 / 玩具</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 一个脚本 / 一个工具</span></span>
<span class="line"><span>- 1-2 天能写完</span></span>
<span class="line"><span>- SDD 文档时间 &gt; 开发时间</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="❌-5-高频变更" tabindex="-1"><a class="header-anchor" href="#❌-5-高频变更"><span>❌ 5. 高频变更</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 每周大改需求</span></span>
<span class="line"><span>- 客户没想清楚</span></span>
<span class="line"><span>- SDD 文档会变成废纸</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="❌-6-强依赖其他团队" tabindex="-1"><a class="header-anchor" href="#❌-6-强依赖其他团队"><span>❌ 6. 强依赖其他团队</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- API 没稳定</span></span>
<span class="line"><span>- 数据没准备好</span></span>
<span class="line"><span>- 强依赖 = 你的 spec 不可控</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="四、10-个关键判断问题" tabindex="-1"><a class="header-anchor" href="#四、10-个关键判断问题"><span>四、10 个关键判断问题</span></a></h2><h3 id="q1-项目时间跨度" tabindex="-1"><a class="header-anchor" href="#q1-项目时间跨度"><span>Q1：项目时间跨度？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【&lt; 1 周】  → 不适合 SDD，直接干</span></span>
<span class="line"><span>【1-4 周】  → 适合 SDD ✅ 性价比最高</span></span>
<span class="line"><span>【1-3 月】  → 适合 SDD，但要拆分多个项目</span></span>
<span class="line"><span>【&gt; 3 月】  → 必须拆分，每个独立 SDD</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q2-你的技术熟悉度" tabindex="-1"><a class="header-anchor" href="#q2-你的技术熟悉度"><span>Q2：你的技术熟悉度？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【100% 熟悉】  → 适合 SDD ✅ design 阶段最快</span></span>
<span class="line"><span>【80% 熟悉】   → 适合 SDD ✅ 1-2 天补 20%</span></span>
<span class="line"><span>【50% 熟悉】   → 边缘情况，慎用 SDD</span></span>
<span class="line"><span>【&lt; 50% 熟悉】 → 不适合 SDD，先学习技术</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q3-需求清晰度" tabindex="-1"><a class="header-anchor" href="#q3-需求清晰度"><span>Q3：需求清晰度？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【非常清晰】→ 适合 SDD ✅ spec 阶段最快</span></span>
<span class="line"><span>【基本清晰】→ 适合 SDD ✅ spec 帮你&quot;写清楚&quot;</span></span>
<span class="line"><span>【模糊】     → 不适合 SDD，先做原型 / spike</span></span>
<span class="line"><span>【完全模糊】 → 完全不适合 SDD，先做需求调研</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q4-需求变更频率" tabindex="-1"><a class="header-anchor" href="#q4-需求变更频率"><span>Q4：需求变更频率？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【基本不变】     → 适合 SDD ✅</span></span>
<span class="line"><span>【小变更(&lt;5%/周)】→ 适合 SDD ✅</span></span>
<span class="line"><span>【中变更(5-20%)】 → 边缘情况</span></span>
<span class="line"><span>【大变更(&gt;20%)】  → 不适合 SDD，文档会过期</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q5-可验证里程碑" tabindex="-1"><a class="header-anchor" href="#q5-可验证里程碑"><span>Q5：可验证里程碑？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【可拆分 phase + 每个可跑】→ 适合 SDD ✅ 最佳情况</span></span>
<span class="line"><span>【只能整体验证】            → 边缘情况，需要拆 phase</span></span>
<span class="line"><span>【不可验证】                → 不适合 SDD，重新设计项目</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q6-依赖关系" tabindex="-1"><a class="header-anchor" href="#q6-依赖关系"><span>Q6：依赖关系？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【独立项目】    → 适合 SDD ✅</span></span>
<span class="line"><span>【弱依赖】      → 适合 SDD ✅ mock 即可</span></span>
<span class="line"><span>【强依赖】      → 不适合 SDD，等依赖稳定</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q7-团队-个人文化" tabindex="-1"><a class="header-anchor" href="#q7-团队-个人文化"><span>Q7：团队 / 个人文化？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【重视文档】 → 适合 SDD ✅</span></span>
<span class="line"><span>【重视速度】 → 不适合 SDD，用敏捷 + 短迭代</span></span>
<span class="line"><span>【重视规范】 → 适合 SDD ✅</span></span>
<span class="line"><span>【重视灵活】 → 不适合 SDD</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q8-失败成本" tabindex="-1"><a class="header-anchor" href="#q8-失败成本"><span>Q8：失败成本？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【高（生产环境 / 钱）】→ 适合 SDD ✅ 文档 = 风险控制</span></span>
<span class="line"><span>【低（demo / 内部）】 → 不一定要 SDD</span></span>
<span class="line"><span>【极高（医疗 / 金融）】→ 必须 SDD + 额外规范</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q9-复盘价值" tabindex="-1"><a class="header-anchor" href="#q9-复盘价值"><span>Q9：复盘价值？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【项目值得长期维护】→ 适合 SDD ✅</span></span>
<span class="line"><span>【一次性项目】       → 不一定要 SDD</span></span>
<span class="line"><span>【学习项目】         → 不适合 SDD</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q10-ai-能力" tabindex="-1"><a class="header-anchor" href="#q10-ai-能力"><span>Q10：AI 能力？</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【AI 能写 70%+ 代码】→ 适合 SDD ✅</span></span>
<span class="line"><span>【AI 能写 30-70%】   → 适合 SDD，但 review 工作量大</span></span>
<span class="line"><span>【AI 能写 &lt; 30%】    → 不适合 SDD</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="五、决策流程图" tabindex="-1"><a class="header-anchor" href="#五、决策流程图"><span>五、决策流程图</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【步骤 1】时间跨度</span></span>
<span class="line"><span>  &lt; 1 周？ → 不适合</span></span>
<span class="line"><span>  &gt; 3 月？ → 拆分</span></span>
<span class="line"><span>  1-4 周？ → 进入步骤 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【步骤 2】技术熟悉度</span></span>
<span class="line"><span>  &lt; 50%？ → 不适合</span></span>
<span class="line"><span>  50-80%？ → 慎用</span></span>
<span class="line"><span>  &gt; 80%？ → 进入步骤 3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【步骤 3】需求清晰度</span></span>
<span class="line"><span>  完全模糊？ → 不适合</span></span>
<span class="line"><span>  基本清晰 / 非常清晰？ → 进入步骤 4</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【步骤 4】变更频率</span></span>
<span class="line"><span>  &gt; 20%/周？ → 不适合</span></span>
<span class="line"><span>  &lt; 5%/周？ → 进入步骤 5</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【步骤 5】可验证里程碑</span></span>
<span class="line"><span>  不可验证？ → 重新设计</span></span>
<span class="line"><span>  可验证？ → 进入步骤 6</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【步骤 6】依赖关系</span></span>
<span class="line"><span>  强依赖？ → 等稳定</span></span>
<span class="line"><span>  独立 / 弱依赖？ → 进入步骤 7</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【步骤 7】失败成本</span></span>
<span class="line"><span>  高？ → 强烈推荐 SDD ✅</span></span>
<span class="line"><span>  低？ → 看你</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【最终决策】</span></span>
<span class="line"><span>  5/7 通过 = 用 SDD ✅</span></span>
<span class="line"><span>  3-4/7 通过 = 慎用</span></span>
<span class="line"><span>  &lt; 3/7 通过 = 不用</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="六、sdd-失败的-5-大征兆" tabindex="-1"><a class="header-anchor" href="#六、sdd-失败的-5-大征兆"><span>六、SDD 失败的 5 大征兆</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【征兆 1】spec 写了 1 周还没定稿</span></span>
<span class="line"><span>  = 需求太模糊 / 项目太大</span></span>
<span class="line"><span>  = 应该拆分 / 先做原型</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【征兆 2】design 改了 10+ 轮还没稳定</span></span>
<span class="line"><span>  = 技术选型有问题</span></span>
<span class="line"><span>  = 应该回到 spec 重新定义</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【征兆 3】tasks 拆分完发现 phase 跑不起来</span></span>
<span class="line"><span>  = 可验证性设计失败</span></span>
<span class="line"><span>  = 应该重新拆 phase</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【征兆 4】develop 阶段频繁大改 spec</span></span>
<span class="line"><span>  = 需求变更失控</span></span>
<span class="line"><span>  = 暂停开发，重新对齐</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【征兆 5】文档没人看 / 没人维护</span></span>
<span class="line"><span>  = 团队文化不匹配</span></span>
<span class="line"><span>  = 改用敏捷 / 不写文档</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="七、sdd-成功的-5-大征兆" tabindex="-1"><a class="header-anchor" href="#七、sdd-成功的-5-大征兆"><span>七、SDD 成功的 5 大征兆</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【征兆 1】spec 1-3 天稳定</span></span>
<span class="line"><span>【征兆 2】design 3-6 轮收敛</span></span>
<span class="line"><span>【征兆 3】tasks 拆分清晰可验证</span></span>
<span class="line"><span>【征兆 4】develop 阶段 spec/design 基本不变</span></span>
<span class="line"><span>【征兆 5】完成时文档 = 真实交付物</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第二部分-三份标准模板" tabindex="-1"><a class="header-anchor" href="#第二部分-三份标准模板"><span>第二部分：三份标准模板</span></a></h1><h2 id="模板使用-5-大原则" tabindex="-1"><a class="header-anchor" href="#模板使用-5-大原则"><span>模板使用 5 大原则</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1. 不要追求一次写对</span></span>
<span class="line"><span>   - spec 迭代 3+ 次是正常的</span></span>
<span class="line"><span>   - design 校验 6+ 次是正常的</span></span>
<span class="line"><span>   - tasks 拆分调整是正常的</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 每个 phase 必填可验证</span></span>
<span class="line"><span>   - phase 完成后必须能跑起来</span></span>
<span class="line"><span>   - 不能&quot;等联调&quot;才验证</span></span>
<span class="line"><span>   - 不可验证 = phase 拆分有问题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 每个 phase 必填 checklist</span></span>
<span class="line"><span>   - 防止中期遗忘</span></span>
<span class="line"><span>   - 沟通完成度</span></span>
<span class="line"><span>   - 自我校准</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 三份文档一起迭代</span></span>
<span class="line"><span>   - spec 改 → design 跟着改</span></span>
<span class="line"><span>   - design 改 → tasks 跟着改</span></span>
<span class="line"><span>   - 不能脱节</span></span>
<span class="line"><span></span></span>
<span class="line"><span>5. 坚持串讲</span></span>
<span class="line"><span>   - spec 写完串讲</span></span>
<span class="line"><span>   - design 校验完串讲</span></span>
<span class="line"><span>   - tasks 拆完串讲</span></span>
<span class="line"><span>   - 串讲 = 发现盲区</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="📄-模板-1-spec-md-需求规格" tabindex="-1"><a class="header-anchor" href="#📄-模板-1-spec-md-需求规格"><span>📄 模板 1：<a href="http://spec.md" target="_blank" rel="noopener noreferrer">spec.md</a>（需求规格）</span></a></h2><h3 id="完整模板" tabindex="-1"><a class="header-anchor" href="#完整模板"><span>完整模板</span></a></h3><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">项目名</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> - Spec</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#5C6370;--shiki-dark-font-style:inherit;">&gt; 本文档是项目需求的精确描述。所有模糊点在串讲中解决。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 1. 项目背景</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 1.1 业务背景</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">为什么做这个？解决什么问题？</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 1.2 目标用户</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">谁会用？有什么特点？</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 1.3 核心价值</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">做完之后，用户的最大收益是什么？</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 2. 功能需求</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 2.1 核心功能（Must-have）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] F1: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">功能描述</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">  -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 输入：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">  -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 输出：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">  -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 边界：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">  -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 异常：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] F2: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">功能描述</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 2.2 次要功能（Nice-to-have）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] F3: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] F4: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 2.3 非功能需求</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 性能：[QPS / 响应时间]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 安全：[鉴权 / 数据加密]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 可用性：[99.9% / 容灾]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 可维护性：[代码规范 / 测试覆盖率]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 3. 用户故事</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### US1: </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">用户角色</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> 能 </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">做什么</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> 从而 </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">获得什么价值</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 验收标准 1：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 验收标准 2：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 4. 数据模型</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 4.1 核心实体</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Entity1: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">字段定义</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Entity2: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">字段定义</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 4.2 实体关系</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[ER 图或文字描述]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 5. 接口定义（可选）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### API 1</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 方法：POST /api/xxx</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 入参：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 出参：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 错误码：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 6. 边界与异常</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 6.1 边界情况</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 边界 1：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 边界 2：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 6.2 异常路径</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 异常 1：[场景 + 处理]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 异常 2：[场景 + 处理]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 7. 验收标准</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 7.1 功能验收</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] F1 满足所有验收标准</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] F2 满足所有验收标准</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 7.2 质量验收</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 测试覆盖率 ≥ 80%</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 无 P0 / P1 bug</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 性能达标</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 8. 范围之外（Out of Scope）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 不做 X：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">原因</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 不做 Y：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">原因</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 9. 待澄清问题（Open Questions）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Q1: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> → 待确认</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Q2: </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> → 待确认</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 10. 修订历史</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 版本 | 日期 | 作者 | 变更 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|------|------|------|------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| v1.0 | 2026-08-03 | </span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> | 初稿 |</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实战示例-数字员工-ai-项目" tabindex="-1"><a class="header-anchor" href="#实战示例-数字员工-ai-项目"><span>实战示例（数字员工 AI 项目）</span></a></h3><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 数字员工 AI - Spec</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#5C6370;--shiki-dark-font-style:inherit;">&gt; 项目：基于大模型的测试用例自动生成工具</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 1. 项目背景</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 1.1 业务背景</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">传统测试流程中，工程师 60% 时间花在重复劳动上</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">（用例编写 / Bug 分析）。数字员工 AI 旨在通过</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">AI 辅助，将重复工作自动化。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 1.2 目标用户</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 主要：测试工程师</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 次要：开发工程师 / 项目经理</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 1.3 核心价值</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 用例编写时间减少 50%</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Bug 分析效率提升 3x</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 2. 功能需求</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 2.1 核心功能</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] F1: AI 自动生成测试用例</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">  -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 输入：需求文档（文本）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">  -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 输出：结构化测试用例</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">  -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 边界：长文档（&gt; 1 万字）/ 短文档 / 多语言</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">  -</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 异常：AI 失败 → 兜底提示</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 2.3 非功能需求</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 性能：单次生成 ≤ 30 秒</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 安全：API Key 加密存储</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 可用性：99.5%</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 9. 待澄清问题</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> Q1: 是否需要支持多语言？</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  → 决定：v1.0 只支持中文</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="📄-模板-2-design-md-设计文档" tabindex="-1"><a class="header-anchor" href="#📄-模板-2-design-md-设计文档"><span>📄 模板 2：<a href="http://design.md" target="_blank" rel="noopener noreferrer">design.md</a>（设计文档）</span></a></h2><h3 id="完整模板-1" tabindex="-1"><a class="header-anchor" href="#完整模板-1"><span>完整模板</span></a></h3><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">项目名</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> - Design</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#5C6370;--shiki-dark-font-style:inherit;">&gt; 本文档是技术方案的蓝图。经过多轮校验后稳定。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 1. 架构总览</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 1.1 系统架构图</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[架构图：客户端 / 网关 / 业务层 / 数据层]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 1.2 技术选型</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 层 | 技术 | 理由 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|----|------|------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 前端 | Vue3 | 团队熟悉 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 后端 | Python | AI 生态 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 数据库 | PostgreSQL | 复杂查询 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 缓存 | Redis | 高频读 |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 1.3 部署架构</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[单机 / 集群 / K8s]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 2. 模块设计</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 2.1 模块 A: </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">名称</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 职责：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 接口：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 依赖：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 数据：</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">...</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 3. 数据流</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 3.1 核心流程</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[用户操作 → 系统响应 → 数据变化]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 3.2 异常流程</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[异常 → 检测 → 兜底]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 4. 数据模型</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 4.1 表结构</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">\`\`\`sql</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">CREATE</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> TABLE</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> entity</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  id </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">BIGINT</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> PRIMARY KEY</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  ...</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-索引设计" tabindex="-1"><a class="header-anchor" href="#_4-2-索引设计"><span>4.2 索引设计</span></a></h3><ul><li>idx_xxx: [字段] → [查询场景]</li></ul><h2 id="_5-接口设计" tabindex="-1"><a class="header-anchor" href="#_5-接口设计"><span>5. 接口设计</span></a></h2><h3 id="_5-1-restful-api" tabindex="-1"><a class="header-anchor" href="#_5-1-restful-api"><span>5.1 RESTful API</span></a></h3><ul><li>GET /api/v1/xxx → [用途]</li><li>POST /api/v1/xxx → [用途]</li></ul><h3 id="_5-2-错误码定义" tabindex="-1"><a class="header-anchor" href="#_5-2-错误码定义"><span>5.2 错误码定义</span></a></h3><ul><li>200: 成功</li><li>400: 参数错误</li><li>500: 系统错误</li></ul><h2 id="_6-关键算法" tabindex="-1"><a class="header-anchor" href="#_6-关键算法"><span>6. 关键算法</span></a></h2><h3 id="_6-1-算法-a-名称" tabindex="-1"><a class="header-anchor" href="#_6-1-算法-a-名称"><span>6.1 算法 A: [名称]</span></a></h3><ul><li>输入：[...]</li><li>输出：[...]</li><li>步骤： <ol><li>[...]</li><li>[...]</li></ol></li></ul><h2 id="_7-性能与可用性" tabindex="-1"><a class="header-anchor" href="#_7-性能与可用性"><span>7. 性能与可用性</span></a></h2><h3 id="_7-1-性能目标" tabindex="-1"><a class="header-anchor" href="#_7-1-性能目标"><span>7.1 性能目标</span></a></h3><ul><li>接口响应：P99 ≤ 500ms</li><li>吞吐量：1000 QPS</li></ul><h3 id="_7-2-可用性设计" tabindex="-1"><a class="header-anchor" href="#_7-2-可用性设计"><span>7.2 可用性设计</span></a></h3><ul><li>容灾：[主从 / 多活]</li><li>限流：[QPS / 并发数]</li><li>降级：[策略]</li></ul><h2 id="_8-安全设计" tabindex="-1"><a class="header-anchor" href="#_8-安全设计"><span>8. 安全设计</span></a></h2><h3 id="_8-1-鉴权" tabindex="-1"><a class="header-anchor" href="#_8-1-鉴权"><span>8.1 鉴权</span></a></h3><ul><li>JWT / OAuth</li></ul><h3 id="_8-2-数据安全" tabindex="-1"><a class="header-anchor" href="#_8-2-数据安全"><span>8.2 数据安全</span></a></h3><ul><li>加密：[算法]</li><li>脱敏：[字段]</li></ul><h2 id="_9-可观测性" tabindex="-1"><a class="header-anchor" href="#_9-可观测性"><span>9. 可观测性</span></a></h2><h3 id="_9-1-日志" tabindex="-1"><a class="header-anchor" href="#_9-1-日志"><span>9.1 日志</span></a></h3><ul><li>业务日志：[字段]</li><li>错误日志：[字段]</li></ul><h3 id="_9-2-监控" tabindex="-1"><a class="header-anchor" href="#_9-2-监控"><span>9.2 监控</span></a></h3><ul><li>关键指标：[QPS / 延迟 / 错误率]</li><li>告警：[阈值]</li></ul><h2 id="_10-测试策略" tabindex="-1"><a class="header-anchor" href="#_10-测试策略"><span>10. 测试策略</span></a></h2><h3 id="_10-1-单元测试" tabindex="-1"><a class="header-anchor" href="#_10-1-单元测试"><span>10.1 单元测试</span></a></h3><ul><li>覆盖率目标：≥ 80%</li></ul><h3 id="_10-2-集成测试" tabindex="-1"><a class="header-anchor" href="#_10-2-集成测试"><span>10.2 集成测试</span></a></h3><ul><li>关键场景：[...]</li></ul><h3 id="_10-3-端到端测试" tabindex="-1"><a class="header-anchor" href="#_10-3-端到端测试"><span>10.3 端到端测试</span></a></h3><ul><li>验收场景：[...]</li></ul><h2 id="_11-风险与对冲" tabindex="-1"><a class="header-anchor" href="#_11-风险与对冲"><span>11. 风险与对冲</span></a></h2><table><thead><tr><th>风险</th><th>概率</th><th>影响</th><th>对冲</th></tr></thead><tbody><tr><td>AI 接口不稳定</td><td>高</td><td>中</td><td>多家供应商</td></tr><tr><td>数据量超预期</td><td>中</td><td>高</td><td>分库分表</td></tr></tbody></table><h2 id="_12-修订历史" tabindex="-1"><a class="header-anchor" href="#_12-修订历史"><span>12. 修订历史</span></a></h2><table><thead><tr><th>版本</th><th>日期</th><th>作者</th><th>校验轮次</th><th>变更</th></tr></thead><tbody><tr><td>v1.0</td><td>...</td><td>...</td><td>1</td><td>初稿</td></tr><tr><td>v1.5</td><td>...</td><td>...</td><td>6</td><td>6 轮校验后稳定</td></tr></tbody></table><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span></span></span>
<span class="line"><span>### 实战示例（数字员工 AI 项目）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`markdown</span></span>
<span class="line"><span># 数字员工 AI - Design</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 1. 架构总览</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 1.1 系统架构</span></span>
<span class="line"><span>┌─────────┐     ┌─────────┐     ┌─────────┐</span></span>
<span class="line"><span>│  前端   │────▶│  网关   │────▶│  AI 服务 │</span></span>
<span class="line"><span>└─────────┘     └─────────┘     └─────────┘</span></span>
<span class="line"><span>                     │              │</span></span>
<span class="line"><span>                     ▼              ▼</span></span>
<span class="line"><span>                ┌─────────┐    ┌─────────┐</span></span>
<span class="line"><span>                │ 用户 DB │    │ Prompt DB│</span></span>
<span class="line"><span>                └─────────┘    └─────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 1.2 技术选型</span></span>
<span class="line"><span>| 层 | 技术 | 理由 |</span></span>
<span class="line"><span>|----|------|------|</span></span>
<span class="line"><span>| 前端 | Vue3 + TS | 团队熟悉 |</span></span>
<span class="line"><span>| 后端 | FastAPI | Python 生态 + 异步 |</span></span>
<span class="line"><span>| AI | Claude / GPT | 多家供应商 |</span></span>
<span class="line"><span>| 数据库 | PostgreSQL | 复杂查询 + JSON |</span></span>
<span class="line"><span>| 缓存 | Redis | 高频读 |</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 11. 风险与对冲</span></span>
<span class="line"><span></span></span>
<span class="line"><span>| 风险 | 概率 | 影响 | 对冲 |</span></span>
<span class="line"><span>|------|------|------|------|</span></span>
<span class="line"><span>| AI 接口超时 | 高 | 中 | 多家供应商 + 超时降级 |</span></span>
<span class="line"><span>| Prompt 泄漏 | 中 | 高 | 加密存储 + 访问审计 |</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="📄-模板-3-tasks-md-任务拆分" tabindex="-1"><a class="header-anchor" href="#📄-模板-3-tasks-md-任务拆分"><span>📄 模板 3：<a href="http://tasks.md" target="_blank" rel="noopener noreferrer">tasks.md</a>（任务拆分）</span></a></h2><h3 id="完整模板-2" tabindex="-1"><a class="header-anchor" href="#完整模板-2"><span>完整模板</span></a></h3><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># </span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">[</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">项目名</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">]</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> - Tasks</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#5C6370;--shiki-dark-font-style:inherit;">&gt; 本文档是开发任务的拆分。按 phase 划分，每个 phase 可验证。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Phase 总览</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| Phase | 名称 | 周期 | 可验证产出 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|-------|------|------|----------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P0 | 项目脚手架 | 1 天 | 项目跑起来 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P1 | 核心功能 A | 2 天 | 功能 A 可用 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P2 | 核心功能 B | 2 天 | 功能 B 可用 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P3 | 联调 + 集成 | 2 天 | E2E 通 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P4 | 优化 + 测试 | 1 天 | 性能达标 |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Phase 0: 项目脚手架</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 目标</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">项目能跑起来</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 任务</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T0.1: 初始化仓库</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T0.2: 配置 CI</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T0.3: 配置部署</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 验收</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 仓库可访问</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] CI 跑通</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 部署成功</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### Checklist</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] README 写好</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 环境变量文档化</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Phase 1: [核心功能 A]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 目标</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[功能 A] 能跑通</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 任务</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T1.1: 数据模型</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T1.2: API 实现</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T1.3: 前端页面</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T1.4: 联调</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 验收</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] API 返回正确数据</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 前端展示正确</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 错误处理完备</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### Checklist</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 单元测试覆盖</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 边界测试</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 错误日志</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Phase 2: [核心功能 B]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">（同 Phase 1 结构）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">---</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Phase N: 联调 + 集成</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 目标</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">所有功能 E2E 通</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 任务</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] TN.1: 集成测试</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] TN.2: 性能测试</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] TN.3: 安全审计</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 验收</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 核心场景 E2E 通</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 性能达标</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 无 P0/P1 bug</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 风险跟踪</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 风险 | 状态 | 处理 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|------|------|------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| T1.2 可能超时 | 待观察 | 预留 buffer |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## 修订历史</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| 版本 | 日期 | 作者 | 变更 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|------|------|------|------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| v1.0 | ... | ... | 初稿 |</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实战示例-数字员工-ai-项目-1" tabindex="-1"><a class="header-anchor" href="#实战示例-数字员工-ai-项目-1"><span>实战示例（数字员工 AI 项目）</span></a></h3><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"># 数字员工 AI - Tasks</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Phase 总览</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| Phase | 名称 | 周期 | 可验证产出 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">|-------|------|------|----------|</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P0 | 项目脚手架 | 0.5 天 | 项目能跑 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P1 | AI 用例生成 | 2 天 | 单功能可用 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P2 | AI Bug 分析 | 2 天 | 单功能可用 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P3 | 用户系统 | 1 天 | 登录可用 |</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">| P4 | 集成 + E2E | 1 天 | 完整流程通 |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">---</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">## Phase 1: AI 用例生成</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 目标</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">输入需求文档 → 输出结构化测试用例</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 任务</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T1.1: Prompt 模板设计</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T1.2: AI 服务调用封装</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T1.3: 结果解析 + 格式化</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] T1.4: 前端页面</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### 验收</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 输入需求 → 30 秒内输出用例</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 用例结构化（场景 + 步骤 + 预期）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 失败有兜底</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">### Checklist</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 单元测试覆盖</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 边界测试（空 / 长 / 短文档）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 错误日志完整</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">-</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> [ ] 用户体验：进度提示</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第三部分-常见坑-我的真实经验" tabindex="-1"><a class="header-anchor" href="#第三部分-常见坑-我的真实经验"><span>第三部分：常见坑 + 我的真实经验</span></a></h1><h2 id="写-spec-时的-3-个常见坑" tabindex="-1"><a class="header-anchor" href="#写-spec-时的-3-个常见坑"><span>写 spec 时的 3 个常见坑</span></a></h2><h3 id="坑-1-写得太泛" tabindex="-1"><a class="header-anchor" href="#坑-1-写得太泛"><span>坑 1：写得太泛</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>❌ &quot;系统要快&quot;</span></span>
<span class="line"><span>✅ &quot;API P99 ≤ 500ms&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="坑-2-写得太细" tabindex="-1"><a class="header-anchor" href="#坑-2-写得太细"><span>坑 2：写得太细</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>❌ &quot;按钮颜色是 #FF0000&quot;</span></span>
<span class="line"><span>✅ 移到 design 文档</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="坑-3-不写边界" tabindex="-1"><a class="header-anchor" href="#坑-3-不写边界"><span>坑 3：不写边界</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>❌ &quot;用户登录&quot;</span></span>
<span class="line"><span>✅ &quot;连续失败 5 次锁定 30 分钟&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="写-design-时的-3-个常见坑" tabindex="-1"><a class="header-anchor" href="#写-design-时的-3-个常见坑"><span>写 design 时的 3 个常见坑</span></a></h2><h3 id="坑-1-选错技术栈" tabindex="-1"><a class="header-anchor" href="#坑-1-选错技术栈"><span>坑 1：选错技术栈</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 太新 / 太小众</span></span>
<span class="line"><span>- 团队不熟悉</span></span>
<span class="line"><span>- 招不到人维护</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="坑-2-模块边界不清" tabindex="-1"><a class="header-anchor" href="#坑-2-模块边界不清"><span>坑 2：模块边界不清</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- A 模块调用 B 模块内部</span></span>
<span class="line"><span>- 接口不清晰</span></span>
<span class="line"><span>- 测试难写</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="坑-3-没考虑异常" tabindex="-1"><a class="header-anchor" href="#坑-3-没考虑异常"><span>坑 3：没考虑异常</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- AI 调用失败 = 整个服务挂</span></span>
<span class="line"><span>- 必须有兜底</span></span>
<span class="line"><span>- 必须有降级</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="写-tasks-时的-3-个常见坑" tabindex="-1"><a class="header-anchor" href="#写-tasks-时的-3-个常见坑"><span>写 tasks 时的 3 个常见坑</span></a></h2><h3 id="坑-1-phase-太大" tabindex="-1"><a class="header-anchor" href="#坑-1-phase-太大"><span>坑 1：phase 太大</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 做完才能验证</span></span>
<span class="line"><span>- 不可验证 = 拆错</span></span>
<span class="line"><span>- 重新拆 phase</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="坑-2-任务太碎" tabindex="-1"><a class="header-anchor" href="#坑-2-任务太碎"><span>坑 2：任务太碎</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 1 小时任务 = 太小</span></span>
<span class="line"><span>- 拆得太细 = overhead 大</span></span>
<span class="line"><span>- 1-2 天任务 = 合适</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="坑-3-缺-checklist" tabindex="-1"><a class="header-anchor" href="#坑-3-缺-checklist"><span>坑 3：缺 checklist</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 中期遗忘 = 返工</span></span>
<span class="line"><span>- checklist = 导航仪</span></span>
<span class="line"><span>- 必填</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第四部分-sdd-实战-checklist-开始用前必看" tabindex="-1"><a class="header-anchor" href="#第四部分-sdd-实战-checklist-开始用前必看"><span>第四部分：SDD 实战 checklist（开始用前必看）</span></a></h1><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【决策 checklist】</span></span>
<span class="line"><span>- [ ] 项目时间 1-4 周</span></span>
<span class="line"><span>- [ ] 技术熟悉度 ≥ 80%</span></span>
<span class="line"><span>- [ ] 需求基本清晰</span></span>
<span class="line"><span>- [ ] 变更频率 &lt; 5%/周</span></span>
<span class="line"><span>- [ ] 可拆 phase + 可验证</span></span>
<span class="line"><span>- [ ] 独立 / 弱依赖</span></span>
<span class="line"><span>- [ ] 失败成本不低</span></span>
<span class="line"><span>- [ ] 愿意写文档</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【spec checklist】</span></span>
<span class="line"><span>- [ ] 业务背景写清楚</span></span>
<span class="line"><span>- [ ] 核心功能 + 边界 + 异常</span></span>
<span class="line"><span>- [ ] 非功能需求具体（性能 / 安全 / 可用性）</span></span>
<span class="line"><span>- [ ] 用户故事可验收</span></span>
<span class="line"><span>- [ ] 范围之外明确</span></span>
<span class="line"><span>- [ ] 待澄清问题列出</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【design checklist】</span></span>
<span class="line"><span>- [ ] 架构图清晰</span></span>
<span class="line"><span>- [ ] 技术选型有理由</span></span>
<span class="line"><span>- [ ] 模块边界清晰</span></span>
<span class="line"><span>- [ ] 数据流自洽</span></span>
<span class="line"><span>- [ ] 异常路径有兜底</span></span>
<span class="line"><span>- [ ] 风险与对冲列出</span></span>
<span class="line"><span>- [ ] 6 轮校验后稳定</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【tasks checklist】</span></span>
<span class="line"><span>- [ ] 每个 phase 可验证</span></span>
<span class="line"><span>- [ ] 每个 phase 有 checklist</span></span>
<span class="line"><span>- [ ] 任务大小合适（1-2 天）</span></span>
<span class="line"><span>- [ ] 依赖关系清晰</span></span>
<span class="line"><span>- [ ] 风险跟踪机制</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第五部分-sdd-的-4-大变体" tabindex="-1"><a class="header-anchor" href="#第五部分-sdd-的-4-大变体"><span>第五部分：SDD 的 4 大变体</span></a></h1><p>根据项目规模选择不同变体：</p><h3 id="变体-1-极简-sdd-1-3-天小项目" tabindex="-1"><a class="header-anchor" href="#变体-1-极简-sdd-1-3-天小项目"><span>变体 1：极简 SDD（1-3 天小项目）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- spec + tasks + 简短 design（1 页）</span></span>
<span class="line"><span>- 适合：脚本 / 工具 / 内部小工具</span></span>
<span class="line"><span>- 时间投入：1-3 天</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="变体-2-标准-sdd-1-4-周" tabindex="-1"><a class="header-anchor" href="#变体-2-标准-sdd-1-4-周"><span>变体 2：标准 SDD（1-4 周）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 完整的 spec + design + tasks + develop</span></span>
<span class="line"><span>- 适合：中等项目 / 个人开发</span></span>
<span class="line"><span>- 时间投入：1-4 周（含文档）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="变体-3-严格-sdd-1-3-月" tabindex="-1"><a class="header-anchor" href="#变体-3-严格-sdd-1-3-月"><span>变体 3：严格 SDD（1-3 月）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 完整的 SDD + 多次迭代 + 串讲</span></span>
<span class="line"><span>- 适合：复杂项目 / 团队协作</span></span>
<span class="line"><span>- 时间投入：1-3 月（含文档 30%+）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="变体-4-sdd-敏捷混合" tabindex="-1"><a class="header-anchor" href="#变体-4-sdd-敏捷混合"><span>变体 4：SDD + 敏捷混合</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>- 用 SDD 做主框架</span></span>
<span class="line"><span>- 用敏捷做小迭代</span></span>
<span class="line"><span>- 适合：长期项目 / 持续交付</span></span>
<span class="line"><span>- 时间投入：长期</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="写在最后-模板只是起点" tabindex="-1"><a class="header-anchor" href="#写在最后-模板只是起点"><span>写在最后：模板只是起点</span></a></h1><p>三份模板不是&quot;填空&quot;，而是&quot;思考框架&quot;。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【模板的本质】</span></span>
<span class="line"><span>- 不是格式</span></span>
<span class="line"><span>- 是思考路径</span></span>
<span class="line"><span>- 是&quot;这个项目你真的想清楚了吗？&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【用模板的方法】</span></span>
<span class="line"><span>1. 复制模板</span></span>
<span class="line"><span>2. 改 30% 适配项目</span></span>
<span class="line"><span>3. 串讲发现盲区</span></span>
<span class="line"><span>4. 迭代 3-6 次</span></span>
<span class="line"><span>5. 稳定后再开始开发</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="思维模型附录" tabindex="-1"><a class="header-anchor" href="#思维模型附录"><span>思维模型附录</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1. 第一性原理：从本质理解 SDD = 工作纪律</span></span>
<span class="line"><span>2. 系统思维：四份文档是有机整体</span></span>
<span class="line"><span>3. 反馈闭环：AI 上下文 = 你的反馈质量</span></span>
<span class="line"><span>4. 边界管理：一个人 = 多个角色 = 知道极限</span></span>
<span class="line"><span>5. 决策矩阵：7 个适用 + 6 个不适用</span></span>
<span class="line"><span>6. 模板复用：模板是起点，不是终点</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="给读者的-3-个问题" tabindex="-1"><a class="header-anchor" href="#给读者的-3-个问题"><span>给读者的 3 个问题</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1. 你在决策时最容易忽视哪个维度？</span></span>
<span class="line"><span>   我：可验证里程碑（容易做得太大）</span></span>
<span class="line"><span>2. 你的 spec 阶段最长花过多少时间？</span></span>
<span class="line"><span>   我：1 天 + 3 次迭代</span></span>
<span class="line"><span>3. 你在 design 阶段发现的最大问题是什么？</span></span>
<span class="line"><span>   我：技术选型在实践上行不通</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>SDD 不是工具，是纪律。模板不是填空，是思考路径。</strong></p><p><strong>用对 SDD = 把&quot;AI 写代码&quot;从碰运气变成有纪律。</strong></p>`,172)])])}const t=i(l,[["render",p]]),c=JSON.parse('{"path":"/posts/learning/insights/SDD%E6%A8%A1%E5%BC%8F%E5%AE%9E%E6%88%98%E6%8C%87%E5%8D%97.html","title":"SDD 模式实战指南 — 决策清单 + 三份标准模板","lang":"zh-CN","frontmatter":{"title":"SDD 模式实战指南 — 决策清单 + 三份标准模板","category":"AI Coding","tag":"SDD / 实战模板 / 个人复盘","cover":"/img/cover-sdd-templates.jpg","icon":"📐","date":"2026-08-03T08:15:00.000Z","description":"上篇博客《SDD 模式 AI Coding 实战感悟》讲了流程与踩坑。这篇是可直接复用的模板——包含\\"该不该用 SDD\\"的决策清单 + spec / design / tasks 三份标准模板。 写在前面：为什么需要这份模板","head":[["meta",{"property":"og:url","content":"https://sunrong1.github.io/posts/learning/insights/SDD%E6%A8%A1%E5%BC%8F%E5%AE%9E%E6%88%98%E6%8C%87%E5%8D%97.html"}],["meta",{"property":"og:site_name","content":"Dave Dev Fun"}],["meta",{"property":"og:title","content":"SDD 模式实战指南 — 决策清单 + 三份标准模板"}],["meta",{"property":"og:description","content":"上篇博客《SDD 模式 AI Coding 实战感悟》讲了流程与踩坑。这篇是可直接复用的模板——包含\\"该不该用 SDD\\"的决策清单 + spec / design / tasks 三份标准模板。 写在前面：为什么需要这份模板"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://sunrong1.github.io/img/cover-sdd-templates.jpg"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-08-06T23:57:31.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:src","content":"https://sunrong1.github.io/img/cover-sdd-templates.jpg"}],["meta",{"name":"twitter:image:alt","content":"SDD 模式实战指南 — 决策清单 + 三份标准模板"}],["meta",{"property":"article:tag","content":"SDD / 实战模板 / 个人复盘"}],["meta",{"property":"article:published_time","content":"2026-08-03T08:15:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-08-06T23:57:31.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"SDD 模式实战指南 — 决策清单 + 三份标准模板\\",\\"image\\":[\\"https://sunrong1.github.io/img/cover-sdd-templates.jpg\\"],\\"datePublished\\":\\"2026-08-03T08:15:00.000Z\\",\\"dateModified\\":\\"2026-08-06T23:57:31.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Sun\\",\\"url\\":\\"https://sunrong.site\\"}]}"]]},"git":{"createdTime":1785855809000,"updatedTime":1786060651000,"contributors":[{"name":"Sun Rong","username":"","email":"sunrong1990@126.com","commits":3}]},"readingTime":{"minutes":14.92,"words":4477},"filePathRelative":"posts/learning/insights/SDD模式实战指南.md","localizedDate":"2026年8月3日","excerpt":"\\n<blockquote>\\n<p>上篇博客《SDD 模式 AI Coding 实战感悟》讲了流程与踩坑。这篇是<strong>可直接复用的模板</strong>——包含\\"该不该用 SDD\\"的决策清单 + spec / design / tasks 三份标准模板。</p>\\n</blockquote>\\n<h2>写在前面：为什么需要这份模板</h2>\\n","autoDesc":true}');export{t as comp,c as data};
