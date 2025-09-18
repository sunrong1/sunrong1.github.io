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
        link: "learning-method/",
      },
      {
        text: "洞察",
        icon: "book",
        link: "insight-planning/",
      }
    ],
  },
  { text: "测试", link: "/testing/" ,icon: "bug"},
  { text: "开发", link: "/dev/" ,icon: "code"},
  { text: "AI", link: "/AI/" ,icon: "star"},
  { text: "管理", link: "/manage/" ,icon: "heart"},
  { text: "关于", link: "/intro", icon: "user"}, 
  { text: "其他", 
    children: [
      {
        text: "英语",
        icon: "pen-to-square",
        link: "other/",
      },
      {
        text: "V2 文档",
        icon: "book",
        link: "https://theme-hope.vuejs.press/zh/",
      }
    ],
    icon: "user"
  }, 
]);
