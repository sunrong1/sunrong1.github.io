import { defineUserConfig } from "vuepress";
import { searchPlugin } from "@vuepress/plugin-search";
import theme from "./theme.js";
import { busuanziPlugin } from "./plugins/busuanzi";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Dave Dev Fun",
  description: "Dev together, innovate, fun! 一个开发人的自我修养",

  theme,

  // 配置插件
  plugins: [
    searchPlugin({
      placeholder: "搜索文档...",
      maxResults: 10,
      indexPages: true,
    }),
    busuanziPlugin,
  ],

  // 添加 SEO 和统计脚本
  head: [
    // 百度统计
    [
      "script",
      {},
      `
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?40397fe5bc6d0c0c9fd718d8b4225476";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
      `
    ],
    // 百度主动推送脚本
    [
      "script",
      {},
      `
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
      `
    ],
    // Umami 统计
    [
      "script",
      {
        defer: "",
        src: "https://cloud.umami.is/script.js",
        "data-website-id": "289eed61-a26d-4cd6-8ff8-214f51d0e7f2",
      },
    ],
    // 不蒜子阅读数统计
    [
      "script",
      {
        defer: "",
        src: "https://busuanzi.42du.cn/static/js/bsz.js",
      },
    ],
    // 站点验证
    ["meta", { name: "baidu-site-verification", content: "YOUR_BAIDU_VERIFICATION_CODE" }],
    ["meta", { name: "description", content: "Sun 的技术博客，分享测试开发、AI 应用、职场成长、育儿心得" }],
    ["meta", { name: "keywords", content: "测试开发，AI 应用，职场成长，育儿，程序员，华为，上海" }],
  ],

  // 禁用预取以减少带宽
  shouldPrefetch: false,
});
