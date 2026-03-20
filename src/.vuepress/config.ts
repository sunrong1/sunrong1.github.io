import { defineUserConfig } from "vuepress";
import { searchPlugin } from "@vuepress/plugin-search";
import { rssPlugin } from "@vuepress/plugin-rss";
import { pwaPlugin } from "@vuepress/plugin-pwa";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "DevFun",
  description: "sunrong's blog,Dev road",

  theme,

  // 配置插件
  plugins: [
    searchPlugin({
      placeholder: "搜索文档...",
      maxResults: 10,
      indexPages: true,
    }),
    rssPlugin({
      rss: [
        {
          path: "rss.xml",
          count: 20,
        },
      ],
    }),
    pwaPlugin({
      manifest: {
        name: "DevFun - 一个开发人的自我修养",
        short_name: "DevFun",
        description: "sunrong 的技术博客，分享测试开发、AI 应用、职场成长、育儿心得",
        theme_color: "#2196f3",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/logo.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/logo.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
      update: "force", // 自动更新
      cacheHTML: true,
      cacheImage: true,
    }),
  ],

  // 添加 Umami 统计脚本
  head: [
    [
      "script",
      {
        defer: "",
        src: "https://cloud.umami.is/script.js",
        "data-website-id": "289eed61-a26d-4cd6-8ff8-214f51d0e7f2",
      },
    ],
    // 阅读进度条样式
    [
      "style",
      {},
      `
      #reading-progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #2196f3, #21cbf3);
        z-index: 9999;
        transition: width 0.1s ease;
      }
      .back-to-top {
        position: fixed;
        bottom: 40px;
        right: 40px;
        width: 50px;
        height: 50px;
        background: #2196f3;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 9998;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      }
      .back-to-top.visible {
        opacity: 1;
      }
      .back-to-top:hover {
        background: #1976d2;
        transform: translateY(-2px);
      }
      .back-to-top svg {
        width: 24px;
        height: 24px;
        fill: white;
      }
    `,
    ],
    // 阅读进度条和返回顶部脚本
    [
      "script",
      {},
      `
      // 阅读进度条
      (function() {
        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress-bar';
        document.body.appendChild(progressBar);
        
        function updateProgress() {
          const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = (winScroll / height) * 100;
          progressBar.style.width = scrolled + '%';
          
          // 返回顶部按钮
          const backToTop = document.querySelector('.back-to-top');
          if (backToTop) {
            if (winScroll > 300) {
              backToTop.classList.add('visible');
            } else {
              backToTop.classList.remove('visible');
            }
          }
        }
        
        window.addEventListener('scroll', updateProgress);
        updateProgress();
      })();
      
      // 返回顶部按钮
      (function() {
        const backToTop = document.createElement('div');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>';
        backToTop.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.appendChild(backToTop);
      })();
    `,
    ],
  ],

  // 禁用预取以减少带宽
  shouldPrefetch: false,
});
