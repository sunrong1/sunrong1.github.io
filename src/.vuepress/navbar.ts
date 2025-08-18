import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",//首页，必留
  {
    text: "作品",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "AI",
        icon: "pen-to-square",
        prefix: "AI/",
        children: [
          { text: "prompt工程", icon: "pen-to-square", link: "prompt" },
          { text: "RAG技术", icon: "pen-to-square", link: "2" },
        ],
      },
      {
        text: "测试方法论",
        icon: "pen-to-square",
        link: "method/",
      },
      {
        text: "V2 文档",
        icon: "book",
        link: "https://theme-hope.vuejs.press/zh/",
      }
    ],
  },
  { text: "测试", link: "/testing" ,icon: "tag"},
  { text: "测试开发", link: "/dev" },
  { text: "AI", link: "/AI/" },
  { text: "管理", link: "/manage" },
  { text: "关于", link: "/intro", icon: "user"}, 

  "/demo/",
]);
