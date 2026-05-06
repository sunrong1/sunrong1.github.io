import type { Plugin } from "@vuepress/core";
import { readFile, writeFile } from "fs";
import { join } from "path";

/**
 * 不蒜子阅读数插件
 * 在文章页底部注入阅读数统计
 */
export const busuanziPlugin: Plugin = {
  name: "vuepress-plugin-busuanzi",

  onGenerated: (app) => {
    const promises: Promise<void>[] = [];
    const outDir = app.outDir || join(app.dir.source(), ".vuepress/dist");

    for (const page of app.pages) {
      if (!page.path.startsWith("/posts/")) continue;

      let normalizedPath = page.path;

      // 1. 以 / 结尾的路径（如 /posts/dev/）→ 加 index.html
      if (normalizedPath.endsWith("/")) {
        normalizedPath = normalizedPath + "index.html";
      }
      // 2. 不以 .html 结尾的路径 → 加 .html
      else if (!normalizedPath.endsWith(".html")) {
        normalizedPath = normalizedPath + ".html";
      }
      // 3. 否则直接使用

      const pagePath = join(outDir, normalizedPath);

      const promise = new Promise<void>((resolve) => {
        readFile(pagePath, "utf-8", (err, data) => {
          if (err) {
            console.warn(`[busuanzi] Cannot read: ${pagePath}`);
            resolve();
            return;
          }
          injectAndWrite(pagePath, data, resolve);
        });
      });

      promises.push(promise);
    }

    return Promise.all(promises).then(() => {
      console.log(`[busuanzi] Processed ${promises.length} article pages`);
    });
  },
};

function injectAndWrite(filePath: string, data: string, resolve: () => void): void {
  const busuanziHTML = `<span id="busuanzi_container_page_pv" style="display:inline;margin:0 8px;color:#999;font-size:14px;">
    <span class="busuanzi-value" id="busuanzi_value_page_pv"></span> 次阅读
  </span>`;

  let newData = data;

  const footerWrapperMatch = data.match(/(<footer class="vp-footer-wrapper[^>]*>)/);
  if (footerWrapperMatch) {
    newData = data.replace(
      footerWrapperMatch[1],
      `<div style="text-align:center;padding:16px 0;color:#999;font-size:14px;">${busuanziHTML}</div>\n$1`
    );
  } else {
    const commentMatch = data.match(/(<div id="comment"[^>]*>)/);
    if (commentMatch) {
      newData = data.replace(
        commentMatch[1],
        `<div style="text-align:center;padding:16px 0;color:#999;font-size:14px;">${busuanziHTML}</div>\n$1`
      );
    }
  }

  writeFile(filePath, newData, "utf-8", () => {
    resolve();
  });
}
