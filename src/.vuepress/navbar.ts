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
    ],
  },
  {
    text: "学习成长",
    icon: "fa-solid fa-graduation-cap",
    prefix: "/posts/",
    children: [
      {
        text: "学习方法",
        icon: "fa-solid fa-book",
        prefix: "03-learning/learning-method/",
        link: "03-learning/learning-method/",
      },
      {
        text: "洞察规划",
        icon: "fa-solid fa-compass",
        prefix: "03-learning/insight-planning/",
        link: "03-learning/insight-planning/",
      },
      {
        text: "面试经验",
        icon: "fa-solid fa-user-tie",
        prefix: "03-learning/interview/",
        link: "03-learning/interview/",
      },
      {
        text: "英语学习",
        icon: "fa-solid fa-language",
        prefix: "03-learning/toeic-prep/",
        link: "03-learning/toeic-prep/",
      },
      {
        text: "AI 实践",
        icon: "fa-solid fa-robot",
        prefix: "05-ai-practice/ai-practice/",
        link: "05-ai-practice/ai-practice/",
      },
    ],
  },
  {
    text: "技术空间",
    icon: "fa-solid fa-code",
    prefix: "/docs/",
    link: "docs/",
    children: [
      { text: "AI 技术", link: "tech/AI/" },
      { text: "开发技术", link: "tech/dev/" },
      { text: "测试技术", link: "tech/testing/" },
    ],
  },
]);
