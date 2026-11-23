# 栗子软件科技官网（定兴县栗子软件科技店）

企业软件开发、AI Agent 搭建、工作流自动化与网站搭建服务官网。

线上地址：<https://lizisoft.github.io/>

## 技术架构

- **Vite + TypeScript + Tailwind CSS v4** 多页静态应用（MPA）
- 构建配置 `base: './'`，兼容 GitHub Pages 根域名或子路径发布，不依赖运行期后端或 CDN
- 共享 Header / Footer 通过 [vite.config.ts](vite.config.ts) 在开发和构建期直接注入 HTML，避免首屏闪烁
- 字体资产使用本地打包的 Manrope 字体（许可见 `src/assets/fonts/manrope.OFL.txt`）

## 页面结构

- `index.html`：首页（企业业务定位、四项核心服务、典型业务场景切换、合作流程与行动引导）
- `capabilities.html`：核心服务（企业软件开发、AI Agent 搭建、工作流自动化与官网建设图文详解及交付保障）
- `work.html`：解决方案总览（支持按方向筛选查看三套参考原型）
- `project.html`：方案原型体验（序章·运营工作台、知间·知识 Agent、有序·审批工作流在线交互原型）
- `about.html`：关于我们与联系（公司简介、工商经营主体、合作原则与双栏联系咨询表单）

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
