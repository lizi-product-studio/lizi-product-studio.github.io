import { COPY_YEAR, SITE, type PageId } from '../data/site';

/**
 * 渲染 Lusion × Framer 风格深空黑曜石毛玻璃导航栏、旋转激光流光主按钮与 Ctrl+K 指令舱入口
 */
export function renderHeader(activePage: PageId): string {
  const currentNavId = activePage === 'project' ? 'work' : activePage;
  const contactHref = activePage === 'about' ? '#contact' : 'about.html#contact';

  const desktopNav = SITE.nav
    .map((item) => {
      const isCurrent = item.id === currentNavId;
      return `<a href="${item.href}"${isCurrent ? ' aria-current="page"' : ''} class="relative inline-flex items-center h-[72px] px-2 text-sm font-medium transition-colors ${
        isCurrent
          ? 'text-white font-semibold'
          : 'text-slate-400 hover:text-white'
      }">${item.label}${
        isCurrent
          ? '<span aria-hidden="true" class="absolute inset-x-1 bottom-0 h-[2px] bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 rounded-full shadow-[0_0_12px_#38bdf8]"></span>'
          : ''
      }</a>`;
    })
    .join('');

  const mobileNavLinks = SITE.nav
    .map((item) => {
      const isCurrent = item.id === currentNavId;
      return `<a href="${item.href}"${isCurrent ? ' aria-current="page"' : ''} class="block px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
        isCurrent
          ? 'text-sky-300 bg-blue-500/15 border border-blue-400/30 font-semibold'
          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
      }">${item.label}</a>`;
    })
    .join('');

  return `<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-600 focus:text-white focus:text-sm focus:font-medium focus:shadow-lg">跳至主要内容</a>
<div id="page-progress" aria-hidden="true" class="fixed top-0 left-0 right-0 h-[2px] origin-left scale-x-0 z-50 pointer-events-none"></div>
<header class="sticky top-0 z-40 h-[72px] bg-[#040713]/80 backdrop-blur-xl border-b border-slate-800/80">
  <div class="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
    <a href="index.html" aria-label="${SITE.brandName}首页" class="inline-flex items-center gap-3 shrink-0 group">
      <span class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-sky-400 text-white font-bold text-lg tracking-tight shadow-[0_0_20px_-3px_rgba(56,189,248,0.65)] group-hover:scale-105 transition-transform">L</span>
      <span class="flex flex-col leading-tight">
        <span class="text-[15px] font-bold tracking-tight text-white">${SITE.brandName}</span>
        <span class="text-[10px] font-mono text-sky-400/80 tracking-widest">${SITE.brandEn}</span>
      </span>
    </a>

    <nav class="hidden md:flex items-center gap-7" aria-label="主导航">
      ${desktopNav}
    </nav>

    <div class="flex items-center gap-2.5 shrink-0">
      <button
        type="button"
        id="cmd-palette-trigger"
        aria-label="打开快捷指令舱 (Ctrl+K)"
        class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white transition-colors"
      >
        <span>指令舱</span>
        <kbd class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-sky-400">Ctrl K</kbd>
      </button>

      <a href="${contactHref}" class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold transition-all whitespace-nowrap">
        <span>联系咨询</span>
      </a>

      <button type="button" id="menu-toggle" aria-label="打开菜单" aria-expanded="false" aria-controls="mobile-nav" class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
        <svg id="menu-icon-open" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <svg id="menu-icon-close" class="w-5 h-5 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
  </div>
</header>
<div id="mobile-nav" inert class="hidden fixed inset-x-0 top-[72px] bottom-0 z-30 bg-[#050814]/95 backdrop-blur-xl border-t border-slate-800 overflow-y-auto md:hidden">
  <nav class="max-w-md mx-auto px-5 py-6 flex flex-col gap-2" aria-label="移动导航">
    ${mobileNavLinks}
    <div class="mt-6 pt-6 border-t border-slate-800 space-y-4">
      <a href="${contactHref}" class="block w-full text-center px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold">联系咨询</a>
      <div class="text-center text-xs text-slate-400 space-y-1">
        <p>电话 / 微信：<a href="tel:${SITE.phoneRaw}" class="font-semibold text-white tabular-nums">${SITE.phoneDisplay}</a></p>
        <p>邮箱：${SITE.email}</p>
      </div>
    </div>
  </nav>
</div>`;
}

/**
 * 渲染全局 Ctrl+K 极客指令舱与右下角快捷微信/电话咨询浮窗
 */
function renderFloatingWidgets(activePage: PageId): string {
  const formHref = activePage === 'about' ? '#contact' : 'about.html#contact';
  return `
<!-- 右下角全站快捷咨询浮窗 -->
<div id="quick-contact-widget" class="fixed bottom-5 right-5 z-40 flex flex-col items-end">
  <div
    id="quick-contact-panel"
    hidden
    role="dialog"
    aria-label="快捷联系栗子软件科技"
    class="hidden mb-2.5 w-72 sm:w-80 rounded-2xl bg-[#090D1C]/95 backdrop-blur-xl border border-slate-700/80 shadow-[0_24px_60px_rgba(0,0,0,0.75)] p-4 sm:p-5 text-slate-100"
  >
    <div class="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
      <div>
        <p class="text-sm font-bold text-white">快捷联系我们</p>
        <p class="text-xs text-slate-400 mt-0.5">微信或电话直连，快速评估需求</p>
      </div>
      <button
        type="button"
        id="quick-contact-close"
        aria-label="收起快捷联系"
        class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
      >
        ✕
      </button>
    </div>

    <div class="mt-3.5 space-y-2.5 text-xs">
      <div class="rounded-xl bg-slate-900/90 border border-slate-800 p-3 flex items-center justify-between gap-2">
        <div>
          <p class="text-slate-400">电话 / 微信同号</p>
          <p class="mt-0.5 text-sm font-bold text-white tabular-nums">${SITE.phoneDisplay}</p>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            data-copy="${SITE.phoneRaw}"
            data-copy-label="复制微信"
            class="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            复制微信
          </button>
          <a
            href="tel:${SITE.phoneRaw}"
            class="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:border-sky-400 font-semibold transition-colors"
          >
            拨打
          </a>
        </div>
      </div>

      <div class="rounded-xl bg-slate-900/90 border border-slate-800 p-3 flex items-center justify-between gap-2">
        <div class="min-w-0">
          <p class="text-slate-400">联系邮箱</p>
          <p class="mt-0.5 text-xs font-semibold text-white truncate">${SITE.email}</p>
        </div>
        <button
          type="button"
          data-copy="${SITE.email}"
          data-copy-label="复制邮箱"
          class="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:border-sky-400 font-semibold transition-colors shrink-0"
        >
          复制邮箱
        </button>
      </div>
    </div>

    <a
      href="${formHref}"
      id="quick-contact-form-link"
      class="mt-3.5 flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all"
    >
      <span>在线填写需求咨询单</span>
      <span aria-hidden="true">→</span>
    </a>
  </div>

  <button
    type="button"
    id="quick-contact-toggle"
    aria-expanded="false"
    aria-controls="quick-contact-panel"
    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-semibold shadow-[0_0_30px_-4px_rgba(56,189,248,0.65)] transition-all"
  >
    <span class="w-2 h-2 rounded-full bg-sky-300 animate-ping"></span>
    <span>微信 / 电话咨询</span>
  </button>
</div>

<!-- 全局 Ctrl+K 极客快捷指令舱 -->
<div
  id="cmd-palette-modal"
  hidden
  role="dialog"
  aria-modal="true"
  aria-label="快捷指令舱"
  class="hidden fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 bg-slate-950/75 backdrop-blur-md p-4"
>
  <div class="w-full max-w-lg rounded-2xl bg-[#0A0F1E] border border-slate-700/80 shadow-[0_30px_80px_rgba(0,0,0,0.85)] overflow-hidden">
    <div class="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5 text-xs font-mono text-sky-400">
        <span>⌘</span>
        <span>LIZI COMMAND PALETTE // 快速导航与指令</span>
      </div>
      <button type="button" id="cmd-palette-close" class="px-2 py-1 rounded bg-slate-800 text-xs text-slate-400 hover:text-white">ESC</button>
    </div>
    <div class="p-3 space-y-1.5 text-sm">
      <p class="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-500">快速跳转页面</p>
      <a href="index.html" class="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-white transition-colors">
        <span>01 · 首页（三维粒子舞台与四大核心业务轮播）</span>
        <span class="text-xs font-mono text-sky-400">→</span>
      </a>
      <a href="capabilities.html" class="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-white transition-colors">
        <span>02 · 核心服务（软件定制 / AI Agent / 自动化 / 官网）</span>
        <span class="text-xs font-mono text-sky-400">→</span>
      </a>
      <a href="work.html" class="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-white transition-colors">
        <span>03 · 解决方案总览</span>
        <span class="text-xs font-mono text-sky-400">→</span>
      </a>
      <a href="project.html?project=operations" class="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-white transition-colors">
        <span>04 · 在线交互原型体验（序章 / 知间 / 有序）</span>
        <span class="text-xs font-mono text-sky-400">→</span>
      </a>
      <a href="about.html#contact" class="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-600/20 text-slate-200 hover:text-white transition-colors">
        <span>05 · 关于我们与在线咨询单生成</span>
        <span class="text-xs font-mono text-sky-400">→</span>
      </a>
      <div class="pt-2 mt-2 border-t border-slate-800/80">
        <p class="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-500">快捷操作</p>
        <button type="button" data-copy="${SITE.phoneRaw}" data-copy-label="一键复制微信号：${SITE.phoneDisplay}" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-emerald-500/20 text-emerald-300 font-medium transition-colors text-left">
          <span>一键复制微信号：${SITE.phoneDisplay}</span>
          <span class="text-xs font-mono">COPY</span>
        </button>
      </div>
    </div>
  </div>
</div>`;
}

/**
 * 渲染暗夜深空企业页脚
 */
export function renderFooter(activePage: PageId): string {
  const isCompact = activePage === 'about';
  const year = COPY_YEAR;
  const widgetHtml = renderFloatingWidgets(activePage);

  if (isCompact) {
    return `<footer class="bg-[#040711]/90 backdrop-blur-md border-t border-slate-800/80">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
    <p>© ${year} ${SITE.brandName} · 经营主体：${SITE.legalEntity}</p>
    <div class="flex items-center gap-6">
      <nav class="flex items-center gap-5 text-slate-400" aria-label="页脚导航">
        <a href="index.html" class="hover:text-sky-400 transition-colors">首页</a>
        <a href="capabilities.html" class="hover:text-sky-400 transition-colors">核心服务</a>
        <a href="work.html" class="hover:text-sky-400 transition-colors">解决方案</a>
      </nav>
      <button type="button" data-back-top class="text-slate-300 hover:text-white font-medium transition-colors">回到顶部 ↑</button>
    </div>
  </div>
</footer>
${widgetHtml}`;
  }

  const navLinks = SITE.nav
    .map(
      (item) =>
        `<li><a href="${item.href}" class="text-sm text-slate-400 hover:text-sky-400 transition-colors">${item.label}</a></li>`
    )
    .join('');

  return `<footer class="bg-[#040711]/90 backdrop-blur-md border-t border-slate-800/80">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
      <div class="md:col-span-5 space-y-4">
        <div class="flex items-center gap-2.5">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-sky-400 text-white font-bold text-base">L</span>
          <span class="text-base font-bold text-white">${SITE.brandName}</span>
        </div>
        <p class="text-sm text-slate-400 leading-relaxed max-w-sm">
          专注企业软件开发、AI Agent 搭建、工作流自动化与企业官网建设，帮助团队以轻量务实的方式理顺日常业务流程。
        </p>
        <p class="text-xs text-slate-500">经营主体：${SITE.legalEntity}</p>
      </div>

      <div class="md:col-span-3">
        <h2 class="text-sm font-semibold text-white">快速导航</h2>
        <ul class="mt-4 space-y-2.5">
          ${navLinks}
        </ul>
      </div>

      <div class="md:col-span-4">
        <h2 class="text-sm font-semibold text-white">联系我们</h2>
        <div class="mt-4 space-y-3 text-sm">
          <div class="flex items-center justify-between gap-3">
            <span class="text-slate-400">电话 / 微信：<a href="tel:${SITE.phoneRaw}" class="font-semibold text-white tabular-nums hover:text-sky-400">${SITE.phoneDisplay}</a></span>
            <button type="button" data-copy="${SITE.phoneRaw}" data-copy-label="复制微信号" class="text-xs font-medium text-sky-400 hover:text-sky-300 shrink-0">复制微信号</button>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-slate-400 truncate">邮箱：<a href="mailto:${SITE.email}" class="font-semibold text-white hover:text-sky-400">${SITE.email}</a></span>
            <button type="button" data-copy="${SITE.email}" data-copy-label="复制邮箱" class="text-xs font-medium text-sky-400 hover:text-sky-300 shrink-0">复制邮箱</button>
          </div>
          <p id="footer-copy-status" role="status" aria-live="polite" class="text-xs text-emerald-400 min-h-[1rem]"></p>
        </div>
      </div>
    </div>

    <div class="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
      <p>© ${year} ${SITE.brandName} · ${SITE.legalEntity}</p>
      <button type="button" data-back-top class="text-slate-400 hover:text-white font-medium transition-colors">回到顶部 ↑</button>
    </div>
  </div>
</footer>
${widgetHtml}`;
}
