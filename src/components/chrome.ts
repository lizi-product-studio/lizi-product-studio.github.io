import { COPY_YEAR, SITE, type PageId } from '../data/site';

/**
 * 渲染标准现代企业官网顶部导航栏与移动端抽屉菜单（构建期/开发期直出 HTML）
 */
export function renderHeader(activePage: PageId): string {
  const currentNavId = activePage === 'project' ? 'work' : activePage;
  const contactHref = activePage === 'about' ? '#contact' : 'about.html#contact';

  const desktopNav = SITE.nav
    .map((item) => {
      const isCurrent = item.id === currentNavId;
      return `<a href="${item.href}"${isCurrent ? ' aria-current="page"' : ''} class="relative inline-flex items-center h-[72px] px-1 text-sm font-medium transition-colors ${
        isCurrent
          ? 'text-blue-600 font-semibold'
          : 'text-slate-600 hover:text-slate-950'
      }">${item.label}${
        isCurrent
          ? '<span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-[2px] bg-blue-600 rounded-full"></span>'
          : ''
      }</a>`;
    })
    .join('');

  const mobileNavLinks = SITE.nav
    .map((item) => {
      const isCurrent = item.id === currentNavId;
      return `<a href="${item.href}"${isCurrent ? ' aria-current="page"' : ''} class="block px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
        isCurrent ? 'text-blue-600 bg-blue-50/70 font-semibold' : 'text-slate-800 hover:bg-slate-50'
      }">${item.label}</a>`;
    })
    .join('');

  return `<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-600 focus:text-white focus:text-sm focus:font-medium focus:shadow-lg">跳至主要内容</a>
<div id="page-progress" aria-hidden="true" class="fixed top-0 left-0 right-0 h-[2px] bg-blue-600 origin-left scale-x-0 z-50 pointer-events-none"></div>
<header class="sticky top-0 z-40 h-[72px] bg-white/95 backdrop-blur-md border-b border-slate-200/70">
  <div class="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
    <a href="index.html" aria-label="${SITE.brandName}首页" class="inline-flex items-center gap-3 shrink-0 group">
      <span class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white font-bold text-lg tracking-tight group-hover:bg-blue-700 transition-colors">L</span>
      <span class="flex flex-col leading-tight">
        <span class="text-[15px] font-bold tracking-tight text-slate-950">${SITE.brandName}</span>
        <span class="text-[10px] font-medium text-slate-400 tracking-wider">${SITE.brandEn}</span>
      </span>
    </a>

    <nav class="hidden md:flex items-center gap-8" aria-label="主导航">
      ${desktopNav}
    </nav>

    <div class="flex items-center gap-3 shrink-0">
      <a href="${contactHref}" class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap">
        联系咨询
      </a>
      <button type="button" id="menu-toggle" aria-label="打开菜单" aria-expanded="false" aria-controls="mobile-nav" class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
        <svg id="menu-icon-open" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <svg id="menu-icon-close" class="w-5 h-5 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
  </div>
</header>
<div id="mobile-nav" inert class="hidden fixed inset-x-0 top-[72px] bottom-0 z-30 bg-white border-t border-slate-200 overflow-y-auto md:hidden">
  <nav class="max-w-md mx-auto px-5 py-6 flex flex-col gap-1.5" aria-label="移动导航">
    ${mobileNavLinks}
    <div class="mt-6 pt-6 border-t border-slate-100 space-y-4">
      <a href="${contactHref}" class="block w-full text-center px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold">联系咨询</a>
      <div class="text-center text-xs text-slate-500 space-y-1">
        <p>电话 / 微信：<a href="tel:${SITE.phoneRaw}" class="font-semibold text-slate-800 tabular-nums">${SITE.phoneDisplay}</a></p>
        <p>邮箱：${SITE.email}</p>
      </div>
    </div>
  </nav>
</div>`;
}

/**
 * 渲染右下角全站快捷微信/电话咨询浮窗
 */
function renderQuickContactWidget(activePage: PageId): string {
  const formHref = activePage === 'about' ? '#contact' : 'about.html#contact';
  return `<div id="quick-contact-widget" class="fixed bottom-5 right-5 z-40 flex flex-col items-end">
  <div
    id="quick-contact-panel"
    hidden
    role="dialog"
    aria-label="快捷联系栗子软件科技"
    class="hidden mb-2.5 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200/90 shadow-xl p-4 sm:p-5 text-slate-900"
  >
    <div class="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
      <div>
        <p class="text-sm font-bold text-slate-950">快捷联系我们</p>
        <p class="text-xs text-slate-500 mt-0.5">微信或电话直连，快速评估需求</p>
      </div>
      <button
        type="button"
        id="quick-contact-close"
        aria-label="收起快捷联系"
        class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      >
        ✕
      </button>
    </div>

    <div class="mt-3.5 space-y-2.5 text-xs">
      <div class="rounded-xl bg-[#F7F9FC] p-3 flex items-center justify-between gap-2">
        <div>
          <p class="text-slate-500">电话 / 微信同号</p>
          <p class="mt-0.5 text-sm font-bold text-slate-950 tabular-nums">${SITE.phoneDisplay}</p>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            data-copy="${SITE.phoneRaw}"
            data-copy-label="复制微信"
            class="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            复制微信
          </button>
          <a
            href="tel:${SITE.phoneRaw}"
            class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-300 font-semibold transition-colors"
          >
            拨打
          </a>
        </div>
      </div>

      <div class="rounded-xl bg-[#F7F9FC] p-3 flex items-center justify-between gap-2">
        <div class="min-w-0">
          <p class="text-slate-500">联系邮箱</p>
          <p class="mt-0.5 text-xs font-semibold text-slate-900 truncate">${SITE.email}</p>
        </div>
        <button
          type="button"
          data-copy="${SITE.email}"
          data-copy-label="复制邮箱"
          class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-300 font-semibold transition-colors shrink-0"
        >
          复制邮箱
        </button>
      </div>
    </div>

    <a
      href="${formHref}"
      id="quick-contact-form-link"
      class="mt-3.5 flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
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
    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all"
  >
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <span>微信 / 电话咨询</span>
  </button>
</div>`;
}

/**
 * 渲染标准现代企业官网页脚（干净 3 列浅灰排版，附带全站右下角快捷咨询浮窗）
 */
export function renderFooter(activePage: PageId): string {
  const isCompact = activePage === 'about';
  const year = COPY_YEAR;
  const widgetHtml = renderQuickContactWidget(activePage);

  if (isCompact) {
    return `<footer class="bg-[#F7F9FC] border-t border-slate-200/80">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
    <p>© ${year} ${SITE.brandName} · 经营主体：${SITE.legalEntity}</p>
    <div class="flex items-center gap-6">
      <nav class="flex items-center gap-5 text-slate-600" aria-label="页脚导航">
        <a href="index.html" class="hover:text-blue-600 transition-colors">首页</a>
        <a href="capabilities.html" class="hover:text-blue-600 transition-colors">核心服务</a>
        <a href="work.html" class="hover:text-blue-600 transition-colors">解决方案</a>
      </nav>
      <button type="button" data-back-top class="text-slate-600 hover:text-slate-950 font-medium transition-colors">回到顶部 ↑</button>
    </div>
  </div>
</footer>
${widgetHtml}`;
  }

  const navLinks = SITE.nav
    .map(
      (item) =>
        `<li><a href="${item.href}" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">${item.label}</a></li>`
    )
    .join('');

  return `<footer class="bg-[#F7F9FC] border-t border-slate-200/80">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200/80">
      <div class="md:col-span-5 space-y-4">
        <div class="flex items-center gap-2.5">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-base">L</span>
          <span class="text-base font-bold text-slate-950">${SITE.brandName}</span>
        </div>
        <p class="text-sm text-slate-600 leading-relaxed max-w-sm">
          专注企业软件开发、AI Agent 搭建、工作流自动化与企业官网建设，帮助团队以轻量务实的方式理顺日常业务流程。
        </p>
        <p class="text-xs text-slate-500">经营主体：${SITE.legalEntity}</p>
      </div>

      <div class="md:col-span-3">
        <h2 class="text-sm font-semibold text-slate-950">快速导航</h2>
        <ul class="mt-4 space-y-2.5">
          ${navLinks}
        </ul>
      </div>

      <div class="md:col-span-4">
        <h2 class="text-sm font-semibold text-slate-950">联系我们</h2>
        <div class="mt-4 space-y-3 text-sm">
          <div class="flex items-center justify-between gap-3">
            <span class="text-slate-600">电话 / 微信：<a href="tel:${SITE.phoneRaw}" class="font-semibold text-slate-900 tabular-nums hover:text-blue-600">${SITE.phoneDisplay}</a></span>
            <button type="button" data-copy="${SITE.phoneRaw}" data-copy-label="复制微信号" class="text-xs font-medium text-blue-600 hover:text-blue-700 shrink-0">复制微信号</button>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-slate-600 truncate">邮箱：<a href="mailto:${SITE.email}" class="font-semibold text-slate-900 hover:text-blue-600">${SITE.email}</a></span>
            <button type="button" data-copy="${SITE.email}" data-copy-label="复制邮箱" class="text-xs font-medium text-blue-600 hover:text-blue-700 shrink-0">复制邮箱</button>
          </div>
          <p id="footer-copy-status" role="status" aria-live="polite" class="text-xs text-emerald-700 min-h-[1rem]"></p>
        </div>
      </div>
    </div>

    <div class="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
      <p>© ${year} ${SITE.brandName} · ${SITE.legalEntity}</p>
      <button type="button" data-back-top class="text-slate-600 hover:text-slate-950 font-medium transition-colors">回到顶部 ↑</button>
    </div>
  </div>
</footer>
${widgetHtml}`;
}
