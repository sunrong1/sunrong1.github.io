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
      { text: "项目作品", link: "projects.html" },
      { text: "技术栈", link: "tech-stack.html" },
      { text: "测试技术", link: "testing/" },
    ],
  },
  {
    text: "学习成长",
    icon: "fa-solid fa-graduation-cap",
    prefix: "/posts/03-learning/",
    link: "03-learning/",
    children: [
      {
        text: "学习方法",
        icon: "fa-solid fa-book",
        prefix: "learning-method/",
        link: "learning-method/",
      },
      {
        text: "洞察规划",
        icon: "fa-solid fa-compass",
        prefix: "insight-planning/",
        link: "insight-planning/",
      },
      {
        text: "面试经验",
        icon: "fa-solid fa-user-tie",
        prefix: "interview/",
        link: "interview/",
      },
      {
        text: "英语学习",
        icon: "fa-solid fa-language",
        prefix: "english/",
        link: "english/",
      },
    ],
  },
  {
    text: "AI 实践",
    icon: "fa-solid fa-robot",
    prefix: "/posts/05-ai-practice/",
    link: "05-ai-practice/",
    children: [
      {
        text: "AI 理论",
        icon: "fa-solid fa-brain",
        prefix: "ai-theory/",
        link: "ai-theory/",
      },
      {
        text: "Agent 开发",
        icon: "fa-solid fa-microchip",
        prefix: "ai-practice/",
        link: "ai-practice/",
      },
      {
        text: "Claude Code",
        icon: "fa-solid fa-code",
        prefix: "claude-code/",
        link: "claude-code/",
      },
    ],
  },
  {
    text: "开发技术",
    icon: "fa-solid fa-laptop-code",
    prefix: "/posts/06-dev/",
    link: "06-dev/",
    children: [
      { text: "算法", link: "alg/" },
      { text: "数据库", link: "database/" },
      { text: "微服务", link: "java/" },
    ],
  },
  { text: "关于我", link: "/posts/04-life/intro.html", icon: "fa-solid fa-user" },
]);
