# 栗子软件科技官网（定兴县栗子软件科技店）

企业软件开发、AI Agent 搭建、工作流自动化与网站搭建服务官网。

线上地址：<https://lizi-product-studio.github.io/dingxinglizi-ideas/>

## 技术架构

- **Vite + TypeScript + Tailwind CSS v4** 多页静态应用（MPA）
- 构建配置 `base: './'`，兼容 GitHub Pages 子路径发布，不依赖运行期后端或 CDN
- 共享 Header / Footer 通过 [vite.config.ts](vite.config.ts) 在开发和构建期直接注入 HTML，避免首屏闪烁
- 字体资产使用本地打包的 Manrope 字体（许可见 `src/assets/fonts/manrope.OFL.txt`）

## 页面结构

- `index.html`：首页（清晰中文价值主张、系统联动预览、日常场景、交互概念入口与合作方式）
- `work.html`：方案演示总览（支持按方向筛选：企业软件开发 / AI Agent 搭建 / 工作流自动化）
- `project.html`：交互概念演示详情（序章·运营工作台、知间·知识 Agent、有序·审批工作流）
- `capabilities.html`：服务与交付（4 步交互式业务场景拆解、四项服务清单与验收原则）
- `about.html`：关于与合作（经营主体、合作原则与流程、常见问题、本地需求简报生成与联系方式）

## 本地开发与构建验证

```sh
# 安装依赖
npm install

# 本地开发预览
npm run dev

# 类型检查 + 构建 + 产物静态校验
npm run typecheck
npm run build
npm run check

# 本地预览构建产物
npm run preview
```

在 Windows PowerShell 中如遇执行策略限制，可改用 `npm.cmd` 与 `npx.cmd`。

## 自动部署

推送至 `main` 分支后，GitHub Actions（`.github/workflows/pages.yml`）会自动运行 `npm ci`、`npm run typecheck`、`npm run build`、`npm run check`，并将 `dist/` 发布到 GitHub Pages。
