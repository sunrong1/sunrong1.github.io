import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "AI 实践",
      icon: "robot",
      prefix: "posts/ai-practice/",
      children: [
        {
          text: "AI 理论",
          icon: "brain",
          prefix: "ai-theory/",
          children: "structure",
        },
        {
          text: "AI 应用",
          icon: "microchip",
          prefix: "ai-app/",
          children: "structure",
        },
      ],
    },
    {
      text: "职场成长",
      icon: "briefcase",
      prefix: "posts/career/",
      children: "structure",
    },
    {
      text: "学习洞见",
      icon: "graduation-cap",
      prefix: "posts/learning/insights/",
      children: "structure",
    },
    {
      text: "英语学习",
      icon: "book",
      prefix: "posts/learning/english/",
      children: "structure",
    },
    {
      text: "开发技术",
      icon: "code",
      prefix: "posts/dev/",
      children: "structure",
    },
    {
      text: "生活",
      icon: "ellipsis",
      prefix: "posts/life/",
      children: "structure",
    },
    {
      text: "育儿心得",
      icon: "baby",
      prefix: "posts/parenting/",
      children: "structure",
    },
    "intro",
  ],
  "/posts/ai-practice/": [
    "",
    {
      text: "AI 理论",
      icon: "brain",
      prefix: "ai-theory/",
      children: "structure",
    },
    {
      text: "AI 应用",
      icon: "microchip",
      prefix: "ai-app/",
      children: "structure",
    },
  ],
});
