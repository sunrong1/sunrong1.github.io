import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "职场成长",
      icon: "briefcase",
      prefix: "posts/01-career/",
      children: "structure",
    },
    {
      text: "育儿心得",
      icon: "baby",
      prefix: "posts/02-parenting/",
      children: "structure",
    },
    {
      text: "学习成长",
      icon: "graduation-cap",
      prefix: "posts/03-learning/",
      children: "structure",
    },
    {
      text: "AI 实践",
      icon: "robot",
      prefix: "posts/05-ai-practice/",
      children: "structure",
    },
    {
      text: "开发技术",
      icon: "code",
      prefix: "posts/06-dev/",
      children: "structure",
    },
    "posts/04-life/intro",
    "posts/README",
  ],
});
