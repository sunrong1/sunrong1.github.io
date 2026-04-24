import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "职场成长",
      icon: "briefcase",
      prefix: "posts/career/",
      children: "structure",
    },
    {
      text: "育儿心得",
      icon: "baby",
      prefix: "posts/parenting/",
      children: "structure",
    },
    {
      text: "学习成长",
      icon: "graduation-cap",
      prefix: "posts/learning/",
      children: "structure",
    },
    {
      text: "AI 实践",
      icon: "robot",
      prefix: "posts/ai-practice/",
      children: "structure",
    },
    {
      text: "开发技术",
      icon: "code",
      prefix: "posts/dev/",
      children: "structure",
    },
    "posts/life/intro",
    "posts/README",
  ],
});
