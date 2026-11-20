import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import type { PageId } from './src/data/site';
import { renderFooter, renderHeader } from './src/components/chrome';

function resolvePageId(filePath: string): PageId {
  if (filePath.includes('work.html')) return 'work';
  if (filePath.includes('project.html')) return 'project';
  if (filePath.includes('capabilities.html')) return 'capabilities';
  if (filePath.includes('about.html')) return 'about';
  return 'home';
}

/**
 * 在开发与构建期将共享 Header 与 Footer 注入 HTML 占位符，保持多页单点维护且无运行时闪烁
 */
function injectChromePlugin(): Plugin {
  return {
    name: 'lizi-inject-chrome',
    transformIndexHtml(html, ctx) {
      const pageId = resolvePageId(ctx.path || 'index.html');
      return html
        .replace('<!-- SITE_HEADER -->', renderHeader(pageId))
        .replace('<!-- SITE_FOOTER -->', renderFooter(pageId));
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [tailwindcss(), injectChromePlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work.html'),
        project: resolve(__dirname, 'project.html'),
        capabilities: resolve(__dirname, 'capabilities.html'),
        about: resolve(__dirname, 'about.html')
      }
    }
  }
});
