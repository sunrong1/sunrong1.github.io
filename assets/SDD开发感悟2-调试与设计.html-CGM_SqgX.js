import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as i,o as e}from"./app-gFNMr2bQ.js";const l={};function p(d,s){return e(),a("div",null,[...s[0]||(s[0]=[i(`<h1 id="sdd-开发感悟-2-—-调试-ai-代码-design-md-关键性-查缺补漏" tabindex="-1"><a class="header-anchor" href="#sdd-开发感悟-2-—-调试-ai-代码-design-md-关键性-查缺补漏"><span>SDD 开发感悟 2 — 调试 AI 代码 + <a href="http://design.md" target="_blank" rel="noopener noreferrer">design.md</a> 关键性 + 查缺补漏</span></a></h1><blockquote><p>上篇博客《SDD 模式 AI Coding 实战感悟》讲了整体流程与踩坑。这篇是 SDD 系列第 5 篇——<strong>开发过程中</strong>的真实感悟，聚焦 3 个关键议题：调试 AI 代码的陷阱、<a href="http://design.md" target="_blank" rel="noopener noreferrer">design.md</a> 的真正作用、<a href="http://design.md" target="_blank" rel="noopener noreferrer">design.md</a> 查缺补漏清单。</p></blockquote><h2 id="写在前面-与第-1-篇的区别" tabindex="-1"><a class="header-anchor" href="#写在前面-与第-1-篇的区别"><span>写在前面：与第 1 篇的区别</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【第 1 篇】SDD 模式 AI Coding 实战感悟</span></span>
<span class="line"><span>- 整体流程（spec → design → tasks → develop）</span></span>
<span class="line"><span>- 4 份文档的分工与时间投入</span></span>
<span class="line"><span>- 一个人跑全流程的真实感受</span></span>
<span class="line"><span>- 给后来者的 5 条建议</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【本篇】SDD 开发感悟 2</span></span>
<span class="line"><span>- 开发过程中的具体场景</span></span>
<span class="line"><span>- 调试 AI 代码的 7 大问题（你列出 3 个 + 我补充 4 个）</span></span>
<span class="line"><span>- design.md 为什么是&quot;关键&quot;</span></span>
<span class="line"><span>- design.md 查缺补漏 10 项清单</span></span>
<span class="line"><span>- AI 进死巷的 8 大破局方法</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="核心洞察-3-条" tabindex="-1"><a class="header-anchor" href="#核心洞察-3-条"><span>核心洞察 3 条</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【洞察 1】个人能力要让 AI 帮助快速成长</span></span>
<span class="line"><span>- AI 不是替代你思考</span></span>
<span class="line"><span>- 是你的&quot;陪练&quot;</span></span>
<span class="line"><span>- 5 大方式让 AI 加速你的成长</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【洞察 2】调试 AI 代码的 7 大问题</span></span>
<span class="line"><span>- 自己没理解代码或设计</span></span>
<span class="line"><span>- AI 上下文被污染</span></span>
<span class="line"><span>- AI 能力不足</span></span>
<span class="line"><span>- + 我补充的 4 个（见下文）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【洞察 3】design.md 真的是 AI 开发的&quot;关键</span></span>
<span class="line"><span>- 做好设计 = 代码完成 90%</span></span>
<span class="line"><span>- 但必须查缺补漏</span></span>
<span class="line"><span>- 时序、状态转换、异常处理等 10 项</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第一部分-个人能力-ai-加速成长" tabindex="-1"><a class="header-anchor" href="#第一部分-个人能力-ai-加速成长"><span>第一部分：个人能力 + AI 加速成长</span></a></h1><h2 id="_1-1-真正的问题不是-ai-写代码" tabindex="-1"><a class="header-anchor" href="#_1-1-真正的问题不是-ai-写代码"><span>1.1 真正的问题不是 AI 写代码</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【常见误解】</span></span>
<span class="line"><span>- &quot;AI 写代码 = 我不用写代码&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【真相】</span></span>
<span class="line"><span>- AI 帮你写代码 = 你要审更多代码</span></span>
<span class="line"><span>- AI 帮你做决策 = 你要审更多决策</span></span>
<span class="line"><span>- AI 帮你设计 = 你要审更多设计</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【本质转变】</span></span>
<span class="line"><span>- 你从&quot;打字的人&quot; → &quot;审的人 + 改需求的人 + 定架构的人&quot;</span></span>
<span class="line"><span>- 打字量减少，决策量增加</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1-2-ai-加速个人成长的-5-大方式" tabindex="-1"><a class="header-anchor" href="#_1-2-ai-加速个人成长的-5-大方式"><span>1.2 AI 加速个人成长的 5 大方式</span></a></h2><h3 id="方式-1-让-ai-解释你不懂的代码" tabindex="-1"><a class="header-anchor" href="#方式-1-让-ai-解释你不懂的代码"><span>方式 1：让 AI 解释你不懂的代码</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【问法】</span></span>
<span class="line"><span>- &quot;这段代码为什么这样写？&quot;</span></span>
<span class="line"><span>- &quot;这个设计选择背后的考量是什么？&quot;</span></span>
<span class="line"><span>- &quot;如果换成另一种实现，会怎样？&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【好处】</span></span>
<span class="line"><span>- 快速建立代码理解</span></span>
<span class="line"><span>- 不需要从头读所有代码</span></span>
<span class="line"><span>- 节省 70%+ 学习时间</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方式-2-让-ai-给你-假设性挑战" tabindex="-1"><a class="header-anchor" href="#方式-2-让-ai-给你-假设性挑战"><span>方式 2：让 AI 给你&quot;假设性挑战&quot;</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【问法】</span></span>
<span class="line"><span>- &quot;如果 X 输入改了，会发生什么？&quot;</span></span>
<span class="line"><span>- &quot;如果 Y 性能不够，怎么优化？&quot;</span></span>
<span class="line"><span>- &quot;如果 Z 安全要求提高，要改哪些地方？&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【好处】</span></span>
<span class="line"><span>- 训练边界思维</span></span>
<span class="line"><span>- 发现设计的脆弱点</span></span>
<span class="line"><span>- 提前考虑异常</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方式-3-让-ai-列出你的设计的所有妥协" tabindex="-1"><a class="header-anchor" href="#方式-3-让-ai-列出你的设计的所有妥协"><span>方式 3：让 AI 列出你的设计的所有妥协</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【问法】</span></span>
<span class="line"><span>- &quot;你做了哪些 trade-off？&quot;</span></span>
<span class="line"><span>- &quot;这个选择的代价是什么？&quot;</span></span>
<span class="line"><span>- &quot;有没有更简单的实现？&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【好处】</span></span>
<span class="line"><span>- 理解每个决策的成本</span></span>
<span class="line"><span>- 知道&quot;为什么不是另一种&quot;</span></span>
<span class="line"><span>- 知识沉淀</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方式-4-让-ai-反向推导设计意图" tabindex="-1"><a class="header-anchor" href="#方式-4-让-ai-反向推导设计意图"><span>方式 4：让 AI 反向推导设计意图</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【问法】</span></span>
<span class="line"><span>- &quot;从这段代码反推 spec，应该是什么？&quot;</span></span>
<span class="line"><span>- &quot;如果让你写 spec，你会怎么写？&quot;</span></span>
<span class="line"><span>- &quot;这段代码的设计哲学是什么？&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【好处】</span></span>
<span class="line"><span>- 验证你的理解</span></span>
<span class="line"><span>- 发现隐藏的设计意图</span></span>
<span class="line"><span>- 学习优秀代码的设计</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方式-5-让-ai-出题考你" tabindex="-1"><a class="header-anchor" href="#方式-5-让-ai-出题考你"><span>方式 5：让 AI 出题考你</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【问法】</span></span>
<span class="line"><span>- &quot;面试官会怎么问我这个项目？&quot;</span></span>
<span class="line"><span>- &quot;给我 10 个深度问题？&quot;</span></span>
<span class="line"><span>- &quot;我会卡在哪？&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【好处】</span></span>
<span class="line"><span>- 准备深度技术分享</span></span>
<span class="line"><span>- 找出自己的知识盲区</span></span>
<span class="line"><span>- 提升表达能力</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1-3-ai-是陪练-不是替代" tabindex="-1"><a class="header-anchor" href="#_1-3-ai-是陪练-不是替代"><span>1.3 AI 是陪练，不是替代</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【错误用法】</span></span>
<span class="line"><span>- AI 写，我审 → 审不动（因为不懂）</span></span>
<span class="line"><span>- AI 做决定 → 决定质量低（因为没思考）</span></span>
<span class="line"><span>- AI 出活 → 不可持续（因为没成长）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【正确用法】</span></span>
<span class="line"><span>- AI 当&quot;陪练&quot;</span></span>
<span class="line"><span>- 我决定 + AI 实现</span></span>
<span class="line"><span>- AI 反馈 + 我学习</span></span>
<span class="line"><span>- AI 加速 + 我吸收</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【最终目标】</span></span>
<span class="line"><span>- 我的能力提升</span></span>
<span class="line"><span>- AI 是杠杆，不是替代</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第二部分-调试-ai-代码的-7-大问题" tabindex="-1"><a class="header-anchor" href="#第二部分-调试-ai-代码的-7-大问题"><span>第二部分：调试 AI 代码的 7 大问题</span></a></h1><h2 id="_2-1-为什么调试-ai-代码特别难" tabindex="-1"><a class="header-anchor" href="#_2-1-为什么调试-ai-代码特别难"><span>2.1 为什么调试 AI 代码特别难</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【传统调试】</span></span>
<span class="line"><span>- 我写代码 → 我理解 → 我调试</span></span>
<span class="line"><span>- 知识在脑子里</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【AI 调试】</span></span>
<span class="line"><span>- AI 写代码 → 我不一定理解 → 我调试</span></span>
<span class="line"><span>- 知识分散在我AI 和 AI 之间</span></span>
<span class="line"><span>- 上下文不连续</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【调试陷阱】</span></span>
<span class="line"><span>- 我以为 AI 理解了</span></span>
<span class="line"><span>- AI 以为我理解了</span></span>
<span class="line"><span>- 实际两边都不完全理解</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-2-7-大问题-诊断方法" tabindex="-1"><a class="header-anchor" href="#_2-2-7-大问题-诊断方法"><span>2.2 7 大问题 + 诊断方法</span></a></h2><h3 id="问题-1-自己没理解代码或设计-⭐⭐⭐⭐⭐" tabindex="-1"><a class="header-anchor" href="#问题-1-自己没理解代码或设计-⭐⭐⭐⭐⭐"><span>问题 1：自己没理解代码或设计 ⭐⭐⭐⭐⭐</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【症状】</span></span>
<span class="line"><span>- AI 给出方案，但我不懂</span></span>
<span class="line"><span>- 调试时不知道为什么</span></span>
<span class="line"><span>- 改一行担心破坏其他地方</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【诊断】</span></span>
<span class="line"><span>- 自己读一遍代码</span></span>
<span class="line"><span>- 自己画一遍设计</span></span>
<span class="line"><span>- 自己写测试验证</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【解决】</span></span>
<span class="line"><span>- 不懂就问 AI</span></span>
<span class="line"><span>- 不懂就重新设计</span></span>
<span class="line"><span>- 不懂就换 AI 重写</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【关键】</span></span>
<span class="line"><span>- 调试的前提是理解</span></span>
<span class="line"><span>- 不理解 = 调不通</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="问题-2-ai-的上下文被污染了-⭐⭐⭐⭐⭐" tabindex="-1"><a class="header-anchor" href="#问题-2-ai-的上下文被污染了-⭐⭐⭐⭐⭐"><span>问题 2：AI 的上下文被污染了 ⭐⭐⭐⭐⭐</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【症状】</span></span>
<span class="line"><span>- AI 开始胡说八道</span></span>
<span class="line"><span>- AI 反复回到老问题</span></span>
<span class="line"><span>- AI 给的方案前后矛盾</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【诊断】</span></span>
<span class="line"><span>- 检查对话历史（是否太长）</span></span>
<span class="line"><span>- 检查 spec / design 是否被修改过</span></span>
<span class="line"><span>- 检查 AI 是否还记得最初需求</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【解决】</span></span>
<span class="line"><span>- 另起新 session + 完整 spec</span></span>
<span class="line"><span>- 清理无关历史</span></span>
<span class="line"><span>- 重新给 AI 完整背景</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【预防】</span></span>
<span class="line"><span>- 每个 phase 一个 session</span></span>
<span class="line"><span>- 不要在长对话里反复切换</span></span>
<span class="line"><span>- 定期清理上下文</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="问题-3-当前-ai-能力不足-⭐⭐⭐⭐" tabindex="-1"><a class="header-anchor" href="#问题-3-当前-ai-能力不足-⭐⭐⭐⭐"><span>问题 3：当前 AI 能力不足 ⭐⭐⭐⭐</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【症状】</span></span>
<span class="line"><span>- AI 给的方案太幼稚</span></span>
<span class="line"><span>- AI 不知道最新技术</span></span>
<span class="line"><span>- AI 写不出复杂逻辑</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【诊断】</span></span>
<span class="line"><span>- 任务是否超出当前 AI 能力</span></span>
<span class="line"><span>- 是否需要更强的 AI 模型</span></span>
<span class="line"><span>- 是否需要人接手</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【解决】</span></span>
<span class="line"><span>- 切小问题（拆给 AI）</span></span>
<span class="line"><span>- 切大任务（人接手）</span></span>
<span class="line"><span>- 升级 AI（用更强模型）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【接受】</span></span>
<span class="line"><span>- AI 有能力上限</span></span>
<span class="line"><span>- 不是所有事 AI 都能做</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="问题-4-spec-design-本身有歧义-⭐⭐⭐⭐" tabindex="-1"><a class="header-anchor" href="#问题-4-spec-design-本身有歧义-⭐⭐⭐⭐"><span>问题 4：spec / design 本身有歧义 ⭐⭐⭐⭐</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【症状】</span></span>
<span class="line"><span>- AI 的解读和你不同</span></span>
<span class="line"><span>- 同一个需求有多种实现</span></span>
<span class="line"><span>- 调试时发现两边理解不一样</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【诊断】</span></span>
<span class="line"><span>- 重读 spec，找歧义点</span></span>
<span class="line"><span>- 让 AI 复述需求，确认理解</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【解决】</span></span>
<span class="line"><span>- 消除歧义（重新写 spec）</span></span>
<span class="line"><span>- 补充用例（user story）</span></span>
<span class="line"><span>- 加验收标准</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【预防】</span></span>
<span class="line"><span>- spec 阶段串讲</span></span>
<span class="line"><span>- 让不同人复述，确认理解一致</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="问题-5-ai-用了错误的假设-⭐⭐⭐" tabindex="-1"><a class="header-anchor" href="#问题-5-ai-用了错误的假设-⭐⭐⭐"><span>问题 5：AI 用了错误的假设 ⭐⭐⭐</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【症状】</span></span>
<span class="line"><span>- &quot;我以为你懂这个&quot;（AI 经常说）</span></span>
<span class="line"><span>- AI 假设了不存在的前提</span></span>
<span class="line"><span>- AI 没问关键问题就直接写代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【诊断】</span></span>
<span class="line"><span>- 让 AI 列出所有假设</span></span>
<span class="line"><span>- 检查假设是否合理</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【解决】</span></span>
<span class="line"><span>- 明确列出所有假设</span></span>
<span class="line"><span>- 不合理的假设 = 改 spec</span></span>
<span class="line"><span>- 让 AI 假设显式化</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【预防】</span></span>
<span class="line"><span>- spec 写&quot;前置条件&quot;</span></span>
<span class="line"><span>- design 写&quot;假设清单&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="问题-6-测试用例不完整-⭐⭐⭐" tabindex="-1"><a class="header-anchor" href="#问题-6-测试用例不完整-⭐⭐⭐"><span>问题 6：测试用例不完整 ⭐⭐⭐</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【症状】</span></span>
<span class="line"><span>- 漏了边界条件</span></span>
<span class="line"><span>- 漏了异常路径</span></span>
<span class="line"><span>- 测试覆盖率低</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【诊断】</span></span>
<span class="line"><span>- 看测试用例覆盖了什么</span></span>
<span class="line"><span>- 列出&quot;可能出错的场景&quot;</span></span>
<span class="line"><span>- 手动跑边界条件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【解决】</span></span>
<span class="line"><span>- 补测试用例</span></span>
<span class="line"><span>- 手动验证关键路径</span></span>
<span class="line"><span>- 加 e2e 测试</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="问题-7-反馈给-ai-的信息不够-⭐⭐⭐" tabindex="-1"><a class="header-anchor" href="#问题-7-反馈给-ai-的信息不够-⭐⭐⭐"><span>问题 7：反馈给 AI 的信息不够 ⭐⭐⭐</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【症状】</span></span>
<span class="line"><span>- &quot;消息发送有问题&quot;（太模糊）</span></span>
<span class="line"><span>- AI 给了几个方向都没命中</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【诊断】</span></span>
<span class="line"><span>- 自己重新整理反馈</span></span>
<span class="line"><span>- 包含：上下文 + 触发动作 + 现象 + 预期 + 实际</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【解决】</span></span>
<span class="line"><span>- 完整反馈（5 个要素）</span></span>
<span class="line"><span>- 提供截图 / 日志 / 错误码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【实例对比】</span></span>
<span class="line"><span>❌ 差：&quot;消息发送有问题&quot;</span></span>
<span class="line"><span>✅ 好：&quot;成功创建 session 后，我刚发送消息，</span></span>
<span class="line"><span>   消息闪现一下后消失了。检查 WebSocket 处理。&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-3-7-大问题速查表" tabindex="-1"><a class="header-anchor" href="#_2-3-7-大问题速查表"><span>2.3 7 大问题速查表</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>| 问题 | 概率 | 难度 | 优先级 |</span></span>
<span class="line"><span>|------|------|------|-------|</span></span>
<span class="line"><span>| 自己没理解 | ⭐⭐⭐⭐⭐ | 中 | P0 |</span></span>
<span class="line"><span>| 上下文污染 | ⭐⭐⭐⭐⭐ | 低 | P0 |</span></span>
<span class="line"><span>| AI 能力不足 | ⭐⭐⭐⭐ | 高 | P1 |</span></span>
<span class="line"><span>| spec 歧义 | ⭐⭐⭐⭐ | 中 | P1 |</span></span>
<span class="line"><span>| AI 错误假设 | ⭐⭐⭐ | 低 | P1 |</span></span>
<span class="line"><span>| 测试不全 | ⭐⭐⭐ | 中 | P2 |</span></span>
<span class="line"><span>| 反馈不够 | ⭐⭐⭐ | 低 | P2 |</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第三部分-design-md-的关键作用" tabindex="-1"><a class="header-anchor" href="#第三部分-design-md-的关键作用"><span>第三部分：<a href="http://design.md" target="_blank" rel="noopener noreferrer">design.md</a> 的关键作用</span></a></h1><h2 id="_3-1-为什么-design-md-是-ai-开发的-关键" tabindex="-1"><a class="header-anchor" href="#_3-1-为什么-design-md-是-ai-开发的-关键"><span>3.1 为什么 <a href="http://design.md" target="_blank" rel="noopener noreferrer">design.md</a> 是 AI 开发的&quot;关键&quot;</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【SDD 4 份文档】</span></span>
<span class="line"><span>- spec.md = 需求</span></span>
<span class="line"><span>- design.md = 设计 ← 关键</span></span>
<span class="line"><span>- tasks.md = 任务</span></span>
<span class="line"><span>- develop.md = 开发</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【为什么 design.md 关键？】</span></span>
<span class="line"><span>1. 决策前置 = 避免代码级返工</span></span>
<span class="line"><span>2. 多 Agent 协作的统一语言</span></span>
<span class="line"><span>3. AI 理解的&quot;上下文窗口&quot;</span></span>
<span class="line"><span>4. 知识沉淀 = 下次复用</span></span>
<span class="line"><span>5. Review 的基准</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-2-设计做好-代码完成-90" tabindex="-1"><a class="header-anchor" href="#_3-2-设计做好-代码完成-90"><span>3.2 设计做好 = 代码完成 90%</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【为什么？】</span></span>
<span class="line"><span>- 设计 = 决策</span></span>
<span class="line"><span>- 决策 = 难的部分</span></span>
<span class="line"><span>- 实现 = 简单的部分</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【具体占比】</span></span>
<span class="line"><span>- 设计决策：占项目 70% 难度</span></span>
<span class="line"><span>- 代码实现：占项目 30% 难度</span></span>
<span class="line"><span>- 调试：占项目 50% 时间</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【如果设计错了】</span></span>
<span class="line"><span>- 代码写完才发现 = 100% 返工</span></span>
<span class="line"><span>- 测试写完才发现 = 50% 返工</span></span>
<span class="line"><span>- 上线后才发现 = 1000% 返工（业务损失）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【结论】</span></span>
<span class="line"><span>- 在 design 阶段多花 1 小时</span></span>
<span class="line"><span>- 在 develop 阶段省 10 小时</span></span>
<span class="line"><span>- 在 production 阶段省 100 小时</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-3-design-md-的-5-大具体维度" tabindex="-1"><a class="header-anchor" href="#_3-3-design-md-的-5-大具体维度"><span>3.3 <a href="http://design.md" target="_blank" rel="noopener noreferrer">design.md</a> 的 5 大具体维度</span></a></h2><h3 id="维度-1-接口设计-api-contract" tabindex="-1"><a class="header-anchor" href="#维度-1-接口设计-api-contract"><span>维度 1：接口设计（API contract）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【为什么关键】</span></span>
<span class="line"><span>- 接口 = 模块的&quot;合同&quot;</span></span>
<span class="line"><span>- 接口错 = 上下游都改</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【必填内容】</span></span>
<span class="line"><span>- 接口签名（method + 入参 + 出参）</span></span>
<span class="line"><span>- 错误码定义</span></span>
<span class="line"><span>- 兼容性约定</span></span>
<span class="line"><span>- 版本管理</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="维度-2-数据流-state-machine" tabindex="-1"><a class="header-anchor" href="#维度-2-数据流-state-machine"><span>维度 2：数据流（state machine）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【为什么关键】</span></span>
<span class="line"><span>- 数据流错 = 状态不一致</span></span>
<span class="line"><span>- 最难调试的 bug 都是状态相关</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【必填内容】</span></span>
<span class="line"><span>- 状态定义</span></span>
<span class="line"><span>- 转换条件</span></span>
<span class="line"><span>- 异常状态（dead end）</span></span>
<span class="line"><span>- 并发场景</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="维度-3-异常路径-error-handling" tabindex="-1"><a class="header-anchor" href="#维度-3-异常路径-error-handling"><span>维度 3：异常路径（error handling）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【为什么关键】</span></span>
<span class="line"><span>- 正常路径谁都能写</span></span>
<span class="line"><span>- 异常路径 = 健壮性的关键</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【必填内容】</span></span>
<span class="line"><span>- 异常分类（可恢复 / 不可恢复）</span></span>
<span class="line"><span>- 重试策略</span></span>
<span class="line"><span>- 降级方案</span></span>
<span class="line"><span>- 上报机制</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="维度-4-时序-concurrency-async" tabindex="-1"><a class="header-anchor" href="#维度-4-时序-concurrency-async"><span>维度 4：时序（concurrency / async）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【为什么关键】</span></span>
<span class="line"><span>- 时序错 = 死锁 / 竞态</span></span>
<span class="line"><span>- 最难重现的 bug</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【必填内容】</span></span>
<span class="line"><span>- 同步 / 异步边界</span></span>
<span class="line"><span>- 锁 / 临界区</span></span>
<span class="line"><span>- 顺序保证</span></span>
<span class="line"><span>- 超时机制</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="维度-5-模块边界-separation-of-concerns" tabindex="-1"><a class="header-anchor" href="#维度-5-模块边界-separation-of-concerns"><span>维度 5：模块边界（separation of concerns）</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【为什么关键】</span></span>
<span class="line"><span>- 边界不清 = 改动牵一发动全身</span></span>
<span class="line"><span>- 复用困难</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【必填内容】</span></span>
<span class="line"><span>- 模块职责</span></span>
<span class="line"><span>- 模块依赖（哪些不应该依赖）</span></span>
<span class="line"><span>- 数据所有权</span></span>
<span class="line"><span>- 测试边界</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第四部分-design-md-查缺补漏-10-项清单" tabindex="-1"><a class="header-anchor" href="#第四部分-design-md-查缺补漏-10-项清单"><span>第四部分：<a href="http://design.md" target="_blank" rel="noopener noreferrer">design.md</a> 查缺补漏 10 项清单</span></a></h1><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【design.md 必查的 10 项】</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 时序（sequence）</span></span>
<span class="line"><span>   - 调用顺序</span></span>
<span class="line"><span>   - 异步 / 同步</span></span>
<span class="line"><span>   - 超时机制</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. 状态转换（state machine）</span></span>
<span class="line"><span>   - 状态定义</span></span>
<span class="line"><span>   - 转换条件</span></span>
<span class="line"><span>   - 异常状态</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. 异常处理（error handling）</span></span>
<span class="line"><span>   - 异常分类</span></span>
<span class="line"><span>   - 重试 / 降级</span></span>
<span class="line"><span>   - 错误码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. 并发（concurrency）</span></span>
<span class="line"><span>   - 锁 / 临界区</span></span>
<span class="line"><span>   - 顺序保证</span></span>
<span class="line"><span>   - 资源竞争</span></span>
<span class="line"><span></span></span>
<span class="line"><span>5. 数据一致性（consistency）</span></span>
<span class="line"><span>   - 强一致 / 最终一致</span></span>
<span class="line"><span>   - 事务边界</span></span>
<span class="line"><span>   - 数据回滚</span></span>
<span class="line"><span></span></span>
<span class="line"><span>6. 边界条件（boundary）</span></span>
<span class="line"><span>   - 空值 / null</span></span>
<span class="line"><span>   - 极值（最大 / 最小）</span></span>
<span class="line"><span>   - 异常输入</span></span>
<span class="line"><span></span></span>
<span class="line"><span>7. 性能（performance）</span></span>
<span class="line"><span>   - QPS / 延迟</span></span>
<span class="line"><span>   - 资源使用</span></span>
<span class="line"><span>   - 瓶颈分析</span></span>
<span class="line"><span></span></span>
<span class="line"><span>8. 安全（security）</span></span>
<span class="line"><span>   - 鉴权 / 授权</span></span>
<span class="line"><span>   - 数据加密</span></span>
<span class="line"><span>   - 攻击防护</span></span>
<span class="line"><span></span></span>
<span class="line"><span>9. 可观测性（observability）</span></span>
<span class="line"><span>   - 日志</span></span>
<span class="line"><span>   - 监控 / 告警</span></span>
<span class="line"><span>   - 链路追踪</span></span>
<span class="line"><span></span></span>
<span class="line"><span>10. 可测试性（testability）</span></span>
<span class="line"><span>    - 单元测试边界</span></span>
<span class="line"><span>    - Mock 友好</span></span>
<span class="line"><span>    - 集成测试</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-1-容易忘记的-5-项-重点提醒" tabindex="-1"><a class="header-anchor" href="#_4-1-容易忘记的-5-项-重点提醒"><span>4.1 容易忘记的 5 项（重点提醒）</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【第 1】时序（最容易忘）</span></span>
<span class="line"><span>- 因为代码写完看起来&quot;对&quot;</span></span>
<span class="line"><span>- 但时序错 = 偶发 bug</span></span>
<span class="line"><span>- 调试时才发现 = 太晚</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【第 2】异常处理（最容易被忽略）</span></span>
<span class="line"><span>- 业务逻辑只考虑&quot;正常情况&quot;</span></span>
<span class="line"><span>- 异常 = 边界</span></span>
<span class="line"><span>- 不处理 = 雪崩</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【第 3】边界条件（最难想到）</span></span>
<span class="line"><span>- &quot;不会有人输入这个&quot; → 用户就会输入</span></span>
<span class="line"><span>- &quot;不可能为空&quot; → 就是会空</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【第 4】并发（最容易写错）</span></span>
<span class="line"><span>- 单线程逻辑 &quot;对&quot;</span></span>
<span class="line"><span>- 多线程 = 不一定对</span></span>
<span class="line"><span>- 必须显式处理</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【第 5】可观测性（最不被重视）</span></span>
<span class="line"><span>- &quot;代码能跑就行&quot;</span></span>
<span class="line"><span>- 但出问题时 = 不知道哪里错了</span></span>
<span class="line"><span>- 日志 / 监控 = 救命稻草</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-2-查缺补漏的方法" tabindex="-1"><a class="header-anchor" href="#_4-2-查缺补漏的方法"><span>4.2 查缺补漏的方法</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【方法 1】串讲（最有效）</span></span>
<span class="line"><span>- 给同事讲一遍设计</span></span>
<span class="line"><span>- 不熟的地方 = 你的盲区</span></span>
<span class="line"><span>- 别人一个问题 = 一个漏洞</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【方法 2】自问自答</span></span>
<span class="line"><span>- 每个模块问 5 个&quot;如果&quot;</span></span>
<span class="line"><span>  - 如果用户输入 X？</span></span>
<span class="line"><span>  - 如果服务挂掉？</span></span>
<span class="line"><span>  - 如果网络断？</span></span>
<span class="line"><span>  - 如果并发 1000？</span></span>
<span class="line"><span>  - 如果数据被改？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【方法 3】对照 checklist</span></span>
<span class="line"><span>- 打印上面的 10 项</span></span>
<span class="line"><span>- 一项一项对照</span></span>
<span class="line"><span>- 没写 = 必须补</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【方法 4】让 AI 找漏洞</span></span>
<span class="line"><span>- &quot;从安全 / 性能 / 并发角度，找设计的漏洞&quot;</span></span>
<span class="line"><span>- &quot;作为面试官，你会怎么问这个设计？&quot;</span></span>
<span class="line"><span>- &quot;有哪些边界条件没考虑到？&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【方法 5】跑通 prototype</span></span>
<span class="line"><span>- 写一个最小可行实现</span></span>
<span class="line"><span>- 跑起来看效果</span></span>
<span class="line"><span>- 比设计文档更真实</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第五部分-ai-进死巷的-8-大破局方法" tabindex="-1"><a class="header-anchor" href="#第五部分-ai-进死巷的-8-大破局方法"><span>第五部分：AI 进死巷的 8 大破局方法</span></a></h1><h2 id="_5-1-识别-死巷" tabindex="-1"><a class="header-anchor" href="#_5-1-识别-死巷"><span>5.1 识别&quot;死巷&quot;</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【死巷的 5 个信号】</span></span>
<span class="line"><span>1. AI 反复回到同样的错误</span></span>
<span class="line"><span>2. AI 给出 3+ 个方案都不对</span></span>
<span class="line"><span>3. AI 的回复越来越长（绕圈子）</span></span>
<span class="line"><span>4. AI 开始质疑你的需求</span></span>
<span class="line"><span>5. 你自己也说不清问题在哪</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【一旦识别】</span></span>
<span class="line"><span>- 不要继续&quot;试错&quot;</span></span>
<span class="line"><span>- 立即停下来</span></span>
<span class="line"><span>- 用下面的方法</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-2-8-大破局方法" tabindex="-1"><a class="header-anchor" href="#_5-2-8-大破局方法"><span>5.2 8 大破局方法</span></a></h2><h3 id="破局-1-停下来-自己先理解代码" tabindex="-1"><a class="header-anchor" href="#破局-1-停下来-自己先理解代码"><span>破局 1：停下来，自己先理解代码</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【做法】</span></span>
<span class="line"><span>- 停止和 AI 对话</span></span>
<span class="line"><span>- 自己读代码</span></span>
<span class="line"><span>- 自己画流程图</span></span>
<span class="line"><span>- 写自己的测试</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【为什么】</span></span>
<span class="line"><span>- AI 进死巷 = 你也可能不理解</span></span>
<span class="line"><span>- 两个人都不懂 = 永远解不开</span></span>
<span class="line"><span>- 必须有人懂</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【关键】</span></span>
<span class="line"><span>- 调试的前提是理解</span></span>
<span class="line"><span>- 不理解 = 调不动</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="破局-2-重读-spec-和-design" tabindex="-1"><a class="header-anchor" href="#破局-2-重读-spec-和-design"><span>破局 2：重读 spec 和 design</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【做法】</span></span>
<span class="line"><span>- 拿出最初的 spec</span></span>
<span class="line"><span>- 拿出 design.md</span></span>
<span class="line"><span>- 对照代码看是否一致</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【为什么】</span></span>
<span class="line"><span>- 可能是 spec 本身有歧义</span></span>
<span class="line"><span>- 可能是 design 漏了某场景</span></span>
<span class="line"><span>- 可能是实现偏离了设计</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【关键】</span></span>
<span class="line"><span>- spec / design 是&quot;锚点&quot;</span></span>
<span class="line"><span>- 偏离锚点 = 错</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="破局-3-给-ai-一个-全新-session" tabindex="-1"><a class="header-anchor" href="#破局-3-给-ai-一个-全新-session"><span>破局 3：给 AI 一个&quot;全新&quot;session</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【做法】</span></span>
<span class="line"><span>- 新开对话</span></span>
<span class="line"><span>- 重新给 AI：</span></span>
<span class="line"><span>   - 完整 spec</span></span>
<span class="line"><span>   - 完整 design</span></span>
<span class="line"><span>   - 当前的 bug 描述</span></span>
<span class="line"><span>   - 已尝试的所有方案</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【为什么】</span></span>
<span class="line"><span>- 上下文可能被污染</span></span>
<span class="line"><span>- 新 session = 干净起点</span></span>
<span class="line"><span>- 但要确保给的背景完整</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【关键】</span></span>
<span class="line"><span>- 不是&quot;换个 AI&quot;</span></span>
<span class="line"><span>- 是&quot;换个干净的 session&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="破局-4-让-ai-用其他思路" tabindex="-1"><a class="header-anchor" href="#破局-4-让-ai-用其他思路"><span>破局 4：让 AI 用其他思路</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【问法】</span></span>
<span class="line"><span>- &quot;如果不用 X，会怎么实现？&quot;</span></span>
<span class="line"><span>- &quot;能不能换个思路？&quot;</span></span>
<span class="line"><span>- &quot;完全抛弃当前方案，重新设计&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【为什么】</span></span>
<span class="line"><span>- AI 可能在&quot;局部最优&quot;</span></span>
<span class="line"><span>- 换思路 = 跳出死巷</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【关键】</span></span>
<span class="line"><span>- 不要让 AI 在错误方向上继续</span></span>
<span class="line"><span>- 明确要求&quot;换思路&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="破局-5-切小问题" tabindex="-1"><a class="header-anchor" href="#破局-5-切小问题"><span>破局 5：切小问题</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【做法】</span></span>
<span class="line"><span>- 把大问题拆成 N 个小问题</span></span>
<span class="line"><span>- 每个小问题给 AI</span></span>
<span class="line"><span>- 一个个解决</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【例子】</span></span>
<span class="line"><span>❌ &quot;为什么这个功能不对？&quot;</span></span>
<span class="line"><span>✅ &quot;为什么 X 输入时 Y 行为？&quot;</span></span>
<span class="line"><span>✅ &quot;为什么 Z 条件下 W 输出？&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【为什么】</span></span>
<span class="line"><span>- 大问题 = 信息量太大</span></span>
<span class="line"><span>- 小问题 = AI 更聚焦</span></span>
<span class="line"><span>- 小问题解决了 = 大问题解决</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="破局-6-手动验证" tabindex="-1"><a class="header-anchor" href="#破局-6-手动验证"><span>破局 6：手动验证</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【做法】</span></span>
<span class="line"><span>- 不要纯靠 AI</span></span>
<span class="line"><span>- 自己用 curl / postman / debug 工具</span></span>
<span class="line"><span>- 手动复现问题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【为什么】</span></span>
<span class="line"><span>- AI 看不到你的环境</span></span>
<span class="line"><span>- AI 不能跑代码</span></span>
<span class="line"><span>- 只有你能验证</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【关键】</span></span>
<span class="line"><span>- 调试不只是&quot;问 AI&quot;</span></span>
<span class="line"><span>- 是&quot;动手验证&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="破局-7-接受-ai-能力上限" tabindex="-1"><a class="header-anchor" href="#破局-7-接受-ai-能力上限"><span>破局 7：接受 AI 能力上限</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【做法】</span></span>
<span class="line"><span>- 判断任务是否超出当前 AI 能力</span></span>
<span class="line"><span>- 必要时人接手</span></span>
<span class="line"><span>- 必要时升级到更强 AI</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【例子】</span></span>
<span class="line"><span>- 复杂算法设计 → 高级 AI</span></span>
<span class="line"><span>- 系统架构 → 顶级 AI</span></span>
<span class="line"><span>- 简单实现 → 普通 AI</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【关键】</span></span>
<span class="line"><span>- AI 有上限</span></span>
<span class="line"><span>- 不是所有事 AI 都能做</span></span>
<span class="line"><span>- 该人做就人做</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="破局-8-休息一下" tabindex="-1"><a class="header-anchor" href="#破局-8-休息一下"><span>破局 8：休息一下</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【做法】</span></span>
<span class="line"><span>- 暂停 30 分钟</span></span>
<span class="line"><span>- 喝杯水 / 走一走</span></span>
<span class="line"><span>- 回来再看</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【为什么】</span></span>
<span class="line"><span>- 调试疲劳 = 看不出问题</span></span>
<span class="line"><span>- 大脑需要&quot;重启&quot;</span></span>
<span class="line"><span>- 休息后经常秒解</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【金句】</span></span>
<span class="line"><span>&quot;调试不下去 = 休息一下 = 秒解&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【关键】</span></span>
<span class="line"><span>- 不要&quot;死磕&quot;</span></span>
<span class="line"><span>- 死磕 = 低效</span></span>
<span class="line"><span>- 休息 = 高效</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-3-破局方法速查" tabindex="-1"><a class="header-anchor" href="#_5-3-破局方法速查"><span>5.3 破局方法速查</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>| 方法 | 适用场景 | 时间 | 优先级 |</span></span>
<span class="line"><span>|------|---------|------|-------|</span></span>
<span class="line"><span>| 1. 停下来理解 | 任何时候 | 30min | P0 |</span></span>
<span class="line"><span>| 2. 重读 spec | 设计怀疑错 | 30min | P0 |</span></span>
<span class="line"><span>| 3. 新 session | 上下文污染 | 20min | P0 |</span></span>
<span class="line"><span>| 4. 换思路 | AI 死循环 | 20min | P1 |</span></span>
<span class="line"><span>| 5. 切小问题 | 大问题 | 30min | P1 |</span></span>
<span class="line"><span>| 6. 手动验证 | 不确定环境 | 1h | P1 |</span></span>
<span class="line"><span>| 7. 接受上限 | 超出 AI 能力 | - | P2 |</span></span>
<span class="line"><span>| 8. 休息一下 | 调试疲劳 | 30min | P0 |</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第六部分-实战案例-数字员工-ai-项目调试实录" tabindex="-1"><a class="header-anchor" href="#第六部分-实战案例-数字员工-ai-项目调试实录"><span>第六部分：实战案例（数字员工 AI 项目调试实录）</span></a></h1><h2 id="_6-1-案例-1-上下文污染" tabindex="-1"><a class="header-anchor" href="#_6-1-案例-1-上下文污染"><span>6.1 案例 1：上下文污染</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【问题】</span></span>
<span class="line"><span>- 我让 AI 优化一个前端 Bug</span></span>
<span class="line"><span>- AI 反复给我类似方案</span></span>
<span class="line"><span>- 都不对</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【诊断】</span></span>
<span class="line"><span>- 上下文被前面 50+ 轮对话污染</span></span>
<span class="line"><span>- AI 忘了最初的需求</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【破局】</span></span>
<span class="line"><span>- 新开 session</span></span>
<span class="line"><span>- 给 AI：完整 spec + 当前 bug + 已尝试的方案</span></span>
<span class="line"><span>- AI 5 分钟定位</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【教训】</span></span>
<span class="line"><span>- 长对话 = 上下文污染</span></span>
<span class="line"><span>- 定期开新 session</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-2-案例-2-spec-歧义" tabindex="-1"><a class="header-anchor" href="#_6-2-案例-2-spec-歧义"><span>6.2 案例 2：spec 歧义</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【问题】</span></span>
<span class="line"><span>- AI 实现的功能和我预期不同</span></span>
<span class="line"><span>- 反复改都不对</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【诊断】</span></span>
<span class="line"><span>- spec 写&quot;消息发送有问题&quot;</span></span>
<span class="line"><span>- 太模糊</span></span>
<span class="line"><span>- AI 不懂我的具体需求</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【破局】</span></span>
<span class="line"><span>- 重写 spec：精确描述输入 / 输出 / 边界</span></span>
<span class="line"><span>- AI 一次写对</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【教训】</span></span>
<span class="line"><span>- spec 不够精确 = 调试反复</span></span>
<span class="line"><span>- 前期花 1 小时 = 后期省 10 小时</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-3-案例-3-ai-能力不足" tabindex="-1"><a class="header-anchor" href="#_6-3-案例-3-ai-能力不足"><span>6.3 案例 3：AI 能力不足</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【问题】</span></span>
<span class="line"><span>- 让 AI 设计一个复杂的分布式算法</span></span>
<span class="line"><span>- AI 方案太幼稚</span></span>
<span class="line"><span>- 多次迭代都不行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【诊断】</span></span>
<span class="line"><span>- 任务超出当前 AI 能力</span></span>
<span class="line"><span>- 我自己也半懂</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【破局】</span></span>
<span class="line"><span>- 切小问题（拆成 3 个）</span></span>
<span class="line"><span>- 第 1 个我自己设计</span></span>
<span class="line"><span>- 第 2、3 个 AI 实现</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【教训】</span></span>
<span class="line"><span>- 不是所有事都让 AI 做</span></span>
<span class="line"><span>- 复杂核心 = 人做</span></span>
<span class="line"><span>- 周边 = AI 做</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第七部分-核心金句" tabindex="-1"><a class="header-anchor" href="#第七部分-核心金句"><span>第七部分：核心金句</span></a></h1><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&quot;AI 是陪练，不是替代。</span></span>
<span class="line"><span> 你的能力成长 = 你的真正价值。&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;调试不下去 = 休息一下 = 秒解。</span></span>
<span class="line"><span> 死磕 = 低效；休息 = 高效。&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;design 阶段多花 1 小时，</span></span>
<span class="line"><span> develop 阶段省 10 小时，</span></span>
<span class="line"><span> production 阶段省 100 小时。&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;AI 进死巷的 5 个信号：</span></span>
<span class="line"><span>  反复错 + 方案多 + 回复长 + 质疑你 + 你不懂。&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&quot;个人能力 + AI 加速 = 杠杆；</span></span>
<span class="line"><span> 个人能力 - AI 替代 = 灾难。&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="第八部分-与第-1-篇的对比" tabindex="-1"><a class="header-anchor" href="#第八部分-与第-1-篇的对比"><span>第八部分：与第 1 篇的对比</span></a></h1><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【第 1 篇：流程视角】</span></span>
<span class="line"><span>- 整体流程</span></span>
<span class="line"><span>- 4 份文档</span></span>
<span class="line"><span>- 一个人全栈</span></span>
<span class="line"><span>- 给后来者的 5 条建议</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【本篇：开发视角】</span></span>
<span class="line"><span>- 调试 7 大问题</span></span>
<span class="line"><span>- design 5 大维度</span></span>
<span class="line"><span>- 查缺补漏 10 项</span></span>
<span class="line"><span>- 破局 8 大方法</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【第 3 篇：未来视角】（待写）</span></span>
<span class="line"><span>- SDD 与 AI Coding 的未来</span></span>
<span class="line"><span>- Agent 化 SDD</span></span>
<span class="line"><span>- 自动化文档</span></span>
<span class="line"><span>- 自我进化设计</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h1 id="写在最后-与-sdd-系列呼应" tabindex="-1"><a class="header-anchor" href="#写在最后-与-sdd-系列呼应"><span>写在最后：与 SDD 系列呼应</span></a></h1><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>【SDD 系列博客】</span></span>
<span class="line"><span>- 第 1 篇：SDD 模式 AI Coding 实战感悟（流程）</span></span>
<span class="line"><span>- 第 2 篇：SDD 模式实战指南（决策清单 + 模板）</span></span>
<span class="line"><span>- 第 3 篇：SDD + 敏捷混合工作流（长期项目）</span></span>
<span class="line"><span>- 第 4 篇：SDD 与 AI Coding 的未来（展望）</span></span>
<span class="line"><span>- 第 5 篇：（本文）SDD 开发感悟 2（开发过程）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>【形成闭环】</span></span>
<span class="line"><span>- 决策 → 流程 → 实践 → 调试 → 未来</span></span>
<span class="line"><span>- 完整的 SDD 实战体系</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="思维模型附录" tabindex="-1"><a class="header-anchor" href="#思维模型附录"><span>思维模型附录</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1. 杠杆思维：AI 是杠杆，不是替代</span></span>
<span class="line"><span>2. 决策前置：在 design 阶段做决策</span></span>
<span class="line"><span>3. 边界思维：5 个&quot;如果&quot;找盲区</span></span>
<span class="line"><span>4. 反馈完整性：5 个要素说清楚</span></span>
<span class="line"><span>5. 上下文管理：定期清理 / 开新 session</span></span>
<span class="line"><span>6. 调试纪律：先理解，再动手</span></span>
<span class="line"><span>7. 能力边界：AI 有上限，接受它</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="给读者的-3-个问题" tabindex="-1"><a class="header-anchor" href="#给读者的-3-个问题"><span>给读者的 3 个问题</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>1. 你最近一次调试 AI 代码，问题出在哪一类？</span></span>
<span class="line"><span>   我：上下文污染（最近 1 周）</span></span>
<span class="line"><span>2. 你的 design.md 漏过哪些关键项？</span></span>
<span class="line"><span>   我：时序 + 异常处理（最近发现）</span></span>
<span class="line"><span>3. 你会什么时候让 AI 接手 vs 人接手？</span></span>
<span class="line"><span>   我：核心算法 = 人；周边实现 = AI</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>AI 是陪练，不是替代。</strong></p><p><strong>design 是关键，调试是基本功。</strong></p><p><strong>AI 进死巷 = 8 大方法破局。</strong></p>`,118)])])}const v=n(l,[["render",p]]),u=JSON.parse('{"path":"/posts/learning/insights/SDD%E5%BC%80%E5%8F%91%E6%84%9F%E6%82%9F2-%E8%B0%83%E8%AF%95%E4%B8%8E%E8%AE%BE%E8%AE%A1.html","title":"SDD 开发感悟 2 — 调试 AI 代码 + design.md 关键性 + 查缺补漏","lang":"zh-CN","frontmatter":{"title":"SDD 开发感悟 2 — 调试 AI 代码 + design.md 关键性 + 查缺补漏","category":"AI Coding","tag":"SDD / AI工程化 / 个人复盘","cover":"/img/cover-sdd-debug.jpg","icon":"🐛","date":"2026-08-03T08:45:00.000Z","description":"上篇博客《SDD 模式 AI Coding 实战感悟》讲了整体流程与踩坑。这篇是 SDD 系列第 5 篇——开发过程中的真实感悟，聚焦 3 个关键议题：调试 AI 代码的陷阱、design.md 的真正作用、design.md 查缺补漏清单。","head":[["meta",{"property":"og:url","content":"https://sunrong1.github.io/posts/learning/insights/SDD%E5%BC%80%E5%8F%91%E6%84%9F%E6%82%9F2-%E8%B0%83%E8%AF%95%E4%B8%8E%E8%AE%BE%E8%AE%A1.html"}],["meta",{"property":"og:site_name","content":"Dave Dev Fun"}],["meta",{"property":"og:title","content":"SDD 开发感悟 2 — 调试 AI 代码 + design.md 关键性 + 查缺补漏"}],["meta",{"property":"og:description","content":"上篇博客《SDD 模式 AI Coding 实战感悟》讲了整体流程与踩坑。这篇是 SDD 系列第 5 篇——开发过程中的真实感悟，聚焦 3 个关键议题：调试 AI 代码的陷阱、design.md 的真正作用、design.md 查缺补漏清单。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://sunrong1.github.io/img/cover-sdd-debug.jpg"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-08-11T13:06:02.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:src","content":"https://sunrong1.github.io/img/cover-sdd-debug.jpg"}],["meta",{"name":"twitter:image:alt","content":"SDD 开发感悟 2 — 调试 AI 代码 + design.md 关键性 + 查缺补漏"}],["meta",{"property":"article:tag","content":"SDD / AI工程化 / 个人复盘"}],["meta",{"property":"article:published_time","content":"2026-08-03T08:45:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-08-11T13:06:02.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"SDD 开发感悟 2 — 调试 AI 代码 + design.md 关键性 + 查缺补漏\\",\\"image\\":[\\"https://sunrong1.github.io/img/cover-sdd-debug.jpg\\"],\\"datePublished\\":\\"2026-08-03T08:45:00.000Z\\",\\"dateModified\\":\\"2026-08-11T13:06:02.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Sun\\",\\"url\\":\\"https://sunrong.site\\"}]}"]]},"git":{"createdTime":1786453562000,"updatedTime":1786453562000,"contributors":[{"name":"Sun Rong","username":"","email":"sunrong1990@126.com","commits":1}]},"readingTime":{"minutes":15.55,"words":4664},"filePathRelative":"posts/learning/insights/SDD开发感悟2-调试与设计.md","localizedDate":"2026年8月3日","excerpt":"\\n<blockquote>\\n<p>上篇博客《SDD 模式 AI Coding 实战感悟》讲了整体流程与踩坑。这篇是 SDD 系列第 5 篇——<strong>开发过程中</strong>的真实感悟，聚焦 3 个关键议题：调试 AI 代码的陷阱、<a href=\\"http://design.md\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">design.md</a> 的真正作用、<a href=\\"http://design.md\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">design.md</a> 查缺补漏清单。</p>\\n</blockquote>\\n","autoDesc":true}');export{v as comp,u as data};
