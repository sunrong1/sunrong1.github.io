import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/", // 首页
  {
    text: "AI 实践",
    icon: "fa-solid fa-robot",
    prefix: "/posts/ai-practice/",
    link: "/posts/ai-practice/",
    children: [
      {
        text: "AI 理论",
        icon: "fa-solid fa-brain",
        prefix: "ai-theory/",
        link: "ai-theory/",
      },
      {
        text: "AI 应用",
        icon: "fa-solid fa-microchip",
        prefix: "ai-app/",
        link: "ai-app/",
      },
    ],
  },
  {
    text: "职场成长",
    icon: "fa-solid fa-briefcase",
    prefix: "/posts/career/",
    link: "/posts/career/",
    children: [
      { text: "华为成长", link: "huawei-experience/" },
      { text: "项目作品", link: "projects.html" },
      { text: "技术栈", link: "tech-stack.html" },
      { text: "技术文章", link: "tech-papers/" },
      { text: "英语学习", link: "../learning/english/" },
    ],
  },
  {
    text: "学习洞见",
    icon: "fa-solid fa-graduation-cap",
    link: "/posts/learning/insights/",
  },
  {
    text: "开发技术",
    icon: "fa-solid fa-laptop-code",
    prefix: "/posts/dev/",
    link: "/posts/dev/",
    children: [
      { text: "算法", link: "alg/" },
      { text: "数据库", link: "database/" },
      { text: "微服务/DDD", link: "java/" },
    ],
  },
  {
    text: "生活",
    icon: "fa-solid fa-ellipsis",
    prefix: "/posts/life/",
    link: "/posts/life/",
    children: [
      { text: "关于我", link: "intro.html" },
      { text: "我的博客", link: "myblog.html" },
      { text: "上海生活", link: "zhongshan-park-family-guide.html" },
      { text: "效率工具", link: "github-actions-deploy.html" },
      { text: "育儿心得", link: "/posts/parenting/" },
    ],
  },
  {
    text: "关于我",
    icon: "fa-solid fa-user",
    link: "/posts/life/intro.html",
  },
]);
