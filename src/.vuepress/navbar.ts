import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",//首页，必留
  {
    text: "作品",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
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
  { text: "测试", link: "/testing/" ,icon: "bug"},
  { text: "开发", link: "/dev/" ,icon: "code"},
  { text: "AI", link: "/AI/" ,icon: "star"},
  { text: "管理", link: "/manage/" ,icon: "heart"},
  { text: "关于", link: "/intro", icon: "user"}, 

  "/guide/",
]);
