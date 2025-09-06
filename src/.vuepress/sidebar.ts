import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",

    {
      text: "文章",
      icon: "book",
      prefix: "posts/",
      children: "structure",
    },
    "intro",
    {
      text: "幻灯片",
      icon: "person-chalkboard",
      link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
    },
    {
      text: "如何使用",
      icon: "laptop-code",
      prefix: "guide/",
      link: "guide/",
      children: "structure",
    },
  ],
});
