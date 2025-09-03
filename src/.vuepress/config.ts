import { defineUserConfig } from "vuepress";
// 导入搜索插件
import {searchPlugin } from "@vuepress/plugin-search";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "TestingFun",
  description: "sunrong's blog,Testing road",

  theme,
    // 新增：启用搜索插件
    plugins: [
      searchPlugin({
        // 搜索框配置（可选）
        placeholder: "搜索文档...", // 搜索框提示文字（默认："搜索..."）
        maxResults: 10, // 最多显示的搜索结果数量（默认：10）
        // 索引配置（可选）
        indexPages: true, // 是否索引页面内容（默认：true）
        // 排除不需要索引的页面（可选）
        // exclude: ['/404.html'], // 示例：排除 404 页面
        // 自定义搜索逻辑（高级用法，可选）
        // transformer: (result) => { ... }, // 自定义搜索结果格式
      }),
    ],
  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
