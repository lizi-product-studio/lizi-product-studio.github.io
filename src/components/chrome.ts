import { COPY_YEAR, SITE, type PageId } from '../data/site';

/**
 * 渲染全站共享顶部导航栏与移动端抽屉菜单（构建期/开发期直出 HTML，无首屏闪烁）
 */
export function renderHeader(activePage: PageId): string {
  const currentNavId = activePage === 'project' ? 'work' : activePage;
  const briefHref = activePage === 'about' ? '#project-brief' : 'about.html#project-brief';

  const desktopNav = SITE.nav
    .map((item) => {
      const isCurrent = item.id === currentNavId;
      return `<a href="${item.href}"${isCurrent ? ' aria-current="page"' : ''} class="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        isCurrent
          ? 'text-blue-700 bg-blue-50/90'
          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
      }">${item.label}</a>`;
    })
    .join('');

  const mobileNavLinks = SITE.nav
    .map((item) => {
      const isCurrent = item.id === currentNavId;
      return `<a href="${item.href}"${isCurrent ? ' aria-current="page"' : ''} class="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
        isCurrent
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : 'text-slate-800 hover:bg-slate-50 border border-transparent'
      }"><span>${item.label}</span><span class="text-xs font-mono text-slate-400">${item.code}</span></a>`;
    })
    .join('');

  return `<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-700 focus:text-white focus:text-sm focus:font-medium focus:shadow-lg">跳至主要内容</a>
<div id="page-progress" aria-hidden="true" class="fixed top-0 left-0 right-0 h-[2.5px] bg-blue-700 origin-left scale-x-0 z-50 pointer-events-none"></div>
<header class="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
  <div class="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
    <a href="index.html" aria-label="${SITE.brandName}首页" class="inline-flex items-center gap-3 shrink-0 group">
      <span class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-700 text-white font-bold text-lg tracking-tight shadow-xs group-hover:bg-blue-800 transition-colors">L</span>
      <span class="flex flex-col leading-tight">
        <span class="text-sm font-bold tracking-tight text-slate-950">${SITE.brandName}</span>
        <span class="text-[11px] font-medium text-slate-500 tracking-wide">LIZI SOFTWARE</span>
      </span>
    </a>

    <nav class="hidden md:flex items-center gap-1" aria-label="主导航">
      ${desktopNav}
    </nav>

    <div class="flex items-center gap-2.5 shrink-0">
      <a href="${briefHref}" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-xs transition-colors whitespace-nowrap">
        <span>聊聊需求</span>
        <span aria-hidden="true">→</span>
      </a>
      <button type="button" id="menu-toggle" aria-label="打开菜单" aria-expanded="false" aria-controls="mobile-nav" class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
        <svg id="menu-icon-open" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <svg id="menu-icon-close" class="w-5 h-5 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
  </div>
</header>
<div id="mobile-nav" inert class="hidden fixed inset-x-0 top-16 bottom-0 z-30 bg-white border-t border-slate-200 overflow-y-auto md:hidden">
  <nav class="max-w-lg mx-auto px-4 py-6 flex flex-col gap-2" aria-label="移动导航">
    ${mobileNavLinks}
    <div class="mt-4 pt-5 border-t border-slate-200 flex flex-col gap-3">
      <a href="${briefHref}" class="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold">在线整理需求简报 →</a>
      <div class="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <p class="text-xs text-slate-500">直接电话 / 微信沟通</p>
          <p class="text-sm font-semibold text-slate-900 tabular-nums mt-0.5">${SITE.phoneDisplay}</p>
        </div>
        <a href="tel:${SITE.phoneRaw}" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:border-blue-300">拨打电话</a>
      </div>
    </div>
  </nav>
</div>`;
}

/**
 * 渲染全站共享页脚（在 about 页自动使用精简版避免联系方式重复）
 */
export function renderFooter(activePage: PageId): string {
  const isCompact = activePage === 'about';
  const year = COPY_YEAR;

  if (isCompact) {
    return `<footer class="bg-slate-50 border-t border-slate-200 mt-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
      <span class="font-semibold text-slate-800">© ${year} ${SITE.brandName}</span>
      <span>经营主体：${SITE.legalEntity}</span>
    </div>
    <div class="flex items-center gap-4">
      <nav class="flex items-center gap-4 text-xs font-medium text-slate-600" aria-label="页脚导航">
        <a href="index.html" class="hover:text-blue-700">首页</a>
        <a href="work.html" class="hover:text-blue-700">方案演示</a>
        <a href="capabilities.html" class="hover:text-blue-700">服务与交付</a>
      </nav>
      <button type="button" data-back-top class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-300 hover:text-slate-950 transition-colors">
        <span>回到顶部</span>
        <span aria-hidden="true">↑</span>
      </button>
    </div>
  </div>
</footer>`;
  }

  const navLinks = SITE.nav
    .map(
      (item) =>
        `<li><a href="${item.href}" class="text-sm text-slate-600 hover:text-blue-700 transition-colors">${item.label}</a></li>`
    )
    .join('');

  return `<footer class="bg-slate-50 border-t border-slate-200 mt-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-slate-200">
      <div class="md:col-span-5">
        <div class="flex items-center gap-2.5">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-700 text-white font-bold text-base">L</span>
          <span class="text-base font-bold text-slate-950">${SITE.brandName}</span>
        </div>
        <p class="mt-4 text-sm text-slate-600 leading-relaxed max-w-md">
          专注企业软件开发、AI Agent 搭建、工作流自动化与网站搭建。从实际业务中卡顿的一步聊起，把工具做成团队每天顺手在用的样子。
        </p>
        <div class="mt-5">
          <a href="about.html#project-brief" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors">
            <span>在线整理需求简报</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div class="md:col-span-3">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400">网站导航</h2>
        <ul class="mt-4 space-y-2.5">
          ${navLinks}
        </ul>
      </div>

      <div class="md:col-span-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400">直接联系</h2>
        <div class="mt-4 space-y-3">
          <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200">
            <div>
              <p class="text-[11px] font-medium text-slate-500">电话 / 微信</p>
              <a href="tel:${SITE.phoneRaw}" class="text-sm font-semibold text-slate-900 tabular-nums hover:text-blue-700">${SITE.phoneDisplay}</a>
            </div>
            <button type="button" data-copy="${SITE.phoneRaw}" data-copy-label="复制微信号" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-xs font-semibold text-slate-700 transition-colors shrink-0">
              复制微信号
            </button>
          </div>

          <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200">
            <div class="min-w-0">
              <p class="text-[11px] font-medium text-slate-500">联系邮箱</p>
              <a href="mailto:${SITE.email}" class="block text-sm font-semibold text-slate-900 truncate hover:text-blue-700">${SITE.email}</a>
            </div>
            <button type="button" data-copy="${SITE.email}" data-copy-label="复制邮箱" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-xs font-semibold text-slate-700 transition-colors shrink-0">
              复制邮箱
            </button>
          </div>
        </div>
        <p id="footer-copy-status" role="status" aria-live="polite" class="mt-2.5 text-xs text-emerald-700 min-h-[1rem]"></p>
      </div>
    </div>

    <div class="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>© ${year} ${SITE.brandName} · 软件设计与开发</span>
        <span>经营主体：${SITE.legalEntity}</span>
      </div>
      <button type="button" data-back-top class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-300 hover:text-slate-950 transition-colors">
        <span>回到顶部</span>
        <span aria-hidden="true">↑</span>
      </button>
    </div>
  </div>
</footer>`;
}
