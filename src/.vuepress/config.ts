import { defineUserConfig } from "vuepress";
import { searchPlugin } from "@vuepress/plugin-search";
import { rssPlugin } from "@vuepress/plugin-rss";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "DevFun",
  description: "sunrong's blog,Dev road",

  theme,

  // 配置插件
  plugins: [
    searchPlugin({
      placeholder: "搜索文档...",
      maxResults: 10,
      indexPages: true,
    }),
    rssPlugin({
      rss: [
        {
          path: "rss.xml",
          count: 20, // 最新 20 篇文章
        },
      ],
    }),
  ],

  // 添加 Umami 统计脚本
  head: [
    [
      "script",
      {
        defer: "",
        src: "https://cloud.umami.is/script.js",
        "data-website-id": "289eed61-a26d-4cd6-8ff8-214f51d0e7f2",
      },
    ],
  ],

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
