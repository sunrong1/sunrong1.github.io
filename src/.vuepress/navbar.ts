import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/", // 首页，必留
  {
    text: "职场成长",
    icon: "fa-solid fa-briefcase",
    prefix: "/posts/01-career/",
    link: "posts/01-career/",
    children: [
      { text: "华为成长", link: "huawei-experience/" },
    ],
  },
  {
    text: "程序员爸爸",
    icon: "fa-solid fa-user-group",
    prefix: "/posts/02-parenting/",
    link: "posts/02-parenting/",
    children: [
      { text: "育儿心得", link: "programmer-dad/" },
    ],
  },
  {
    text: "学习之路",
    icon: "fa-solid fa-book",
    prefix: "/posts/03-learning/",
    link: "posts/03-learning/",
    children: [
      { text: "学习方法", link: "learning-method/" },
      { text: "洞察规划", link: "insight-planning/" },
      { text: "面试经验", link: "interview/" },
      { text: "托业备考", link: "toeic-prep/" },
    ],
  },
  {
    text: "生活随笔",
    icon: "fa-solid fa-pen-to-square",
    prefix: "/posts/04-life/",
    link: "posts/04-life/",
    children: [
      { text: "上海生活", link: "shanghai-life/" },
    ],
  },
  {
    text: "AI 实战",
    icon: "fa-solid fa-robot",
    prefix: "/posts/05-ai-practice/",
    link: "posts/05-ai-practice/",
    children: [
      { text: "AI 实践", link: "ai-practice/" },
    ],
  },
  {
    text: "技术文档",
    icon: "fa-solid fa-file-code",
    prefix: "/docs/",
    link: "docs/",
    children: [
      { text: "使用指南", link: "guides/guide/" },
      { text: "项目管理", link: "guides/manage/" },
      { text: "AI 技术", link: "tech/AI/" },
      { text: "开发技术", link: "tech/dev/" },
      { text: "测试技术", link: "tech/testing/" },
      { text: "英语学习", link: "tech/english/" },
    ],
  },
  { text: "关于我", link: "/posts/04-life/intro.html", icon: "fa-solid fa-user" },
]);
