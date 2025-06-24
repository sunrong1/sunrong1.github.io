import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme(),

  lang: 'zh-CN',
  title: ' Sunrong\'s Blog',
  description: '这是我的测试领域站点',
  themeConfig: {
    nav: [  // 导航栏
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '关于我', link: '/about/' }
    ],
    sidebar: {  // 侧边栏（可选）
      '/blog/': [
        '',     // 对应 blog/README.md
        'post1', // 对应 blog/post1.md
      ]
    }
 }   
})
