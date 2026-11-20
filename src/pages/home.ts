import '../styles/main.css';
import { initShell } from '../components/shell';
import {
  COOPERATION_STEPS,
  HERO_MODES,
  HOME_PROBLEMS,
  type HeroSystemMode
} from '../data/home';

function renderHeroPreviewVisual(mode: HeroSystemMode): string {
  if (mode === 'software') {
    return `<div class="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
      <div class="grid grid-cols-3 gap-2.5">
        <div class="rounded-lg bg-white border border-slate-200/80 p-2.5">
          <p class="text-[11px] text-slate-500">待确认事项</p>
          <p class="mt-1 text-lg font-bold text-slate-950 tabular-nums">02 <span class="text-xs font-normal text-amber-600">项</span></p>
        </div>
        <div class="rounded-lg bg-white border border-slate-200/80 p-2.5">
          <p class="text-[11px] text-slate-500">推进中项目</p>
          <p class="mt-1 text-lg font-bold text-slate-950 tabular-nums">04 <span class="text-xs font-normal text-blue-700">个</span></p>
        </div>
        <div class="rounded-lg bg-white border border-slate-200/80 p-2.5">
          <p class="text-[11px] text-slate-500">今日留痕</p>
          <p class="mt-1 text-lg font-bold text-slate-950 tabular-nums">08 <span class="text-xs font-normal text-emerald-700">条</span></p>
        </div>
      </div>
      <div class="rounded-lg bg-white border border-slate-200/80 divide-y divide-slate-100 text-xs">
        <div class="px-3 py-2.5 flex items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="font-semibold text-slate-900 truncate">客户服务平台 · 原型方案</p>
            <p class="text-[11px] text-slate-500 mt-0.5">负责人：林澈</p>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 font-medium shrink-0">待确认</span>
        </div>
        <div class="px-3 py-2.5 flex items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="font-semibold text-slate-900 truncate">供应链管理工具 · 需求梳理</p>
            <p class="text-[11px] text-slate-500 mt-0.5">负责人：张也</p>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 font-medium shrink-0">进行中</span>
        </div>
      </div>
    </div>`;
  }

  if (mode === 'agent') {
    return `<div class="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
      <div class="flex items-start gap-2.5">
        <span class="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[11px] font-semibold shrink-0 mt-0.5">提问</span>
        <p class="text-xs font-semibold text-slate-900 leading-relaxed">客户临时改了交期或报价，流程怎么留痕？</p>
      </div>
      <div class="rounded-lg bg-white border border-slate-200/80 p-3 space-y-2.5">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-semibold text-indigo-700">知间 · 来源检索回答</span>
          <span class="text-[11px] text-slate-400">附带可核对原文</span>
        </div>
        <ul class="space-y-1.5 text-xs text-slate-700 leading-relaxed">
          <li class="flex items-start gap-1.5"><span class="text-indigo-600 font-bold">1.</span><span>在原订单记录下填写变更原因与客户沟通依据。</span></li>
          <li class="flex items-start gap-1.5"><span class="text-indigo-600 font-bold">2.</span><span>涉及交期或金额变化，由对应负责人复核确认并留痕。</span></li>
        </ul>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-medium">引用：订单与变更管理规范 v2.0</span>
          <span class="text-slate-500">重要决定由人确认</span>
        </div>
      </div>
    </div>`;
  }

  return `<div class="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
    <div class="flex items-center justify-between text-[11px] text-slate-500 px-1">
      <span>触发：收到采购申请（¥ 3,200.00）</span>
      <span class="font-semibold text-emerald-700">规则分支生效</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <div class="rounded-lg bg-white border border-emerald-200 p-2.5">
        <span class="text-[10px] font-mono text-emerald-700 font-semibold">01 / TRIGGER</span>
        <p class="mt-1 text-xs font-semibold text-slate-900">提交申请</p>
        <p class="mt-0.5 text-[11px] text-slate-500">必填信息完整 ✓</p>
      </div>
      <div class="rounded-lg bg-white border border-emerald-200 p-2.5">
        <span class="text-[10px] font-mono text-emerald-700 font-semibold">02 / RULE</span>
        <p class="mt-1 text-xs font-semibold text-slate-900">金额分支</p>
        <p class="mt-0.5 text-[11px] text-slate-500">≤ ¥5,000 路径</p>
      </div>
      <div class="rounded-lg bg-amber-50/80 border border-amber-200 p-2.5">
        <span class="text-[10px] font-mono text-amber-700 font-semibold">03 / HUMAN</span>
        <p class="mt-1 text-xs font-semibold text-slate-900">部门负责人</p>
        <p class="mt-0.5 text-[11px] text-amber-700">等待人工审批</p>
      </div>
    </div>
  </div>`;
}

function initHeroTabs(): void {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-hero-mode]')];
  const panel = document.getElementById('hero-preview-panel');
  if (!panel || tabs.length === 0) return;

  let activeMode: HeroSystemMode = 'software';

  const renderPanel = (mode: HeroSystemMode) => {
    const spec = HERO_MODES[mode];
    panel.setAttribute('aria-labelledby', `hero-tab-${mode}`);
    panel.innerHTML = `<div class="space-y-4">
      <div>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">${spec.badge}</span>
        <h2 class="mt-2.5 text-lg font-bold text-slate-950 leading-snug">${spec.headline}</h2>
        <p class="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">${spec.summary}</p>
      </div>
      ${renderHeroPreviewVisual(mode)}
      <div class="pt-1 flex items-center justify-between gap-3">
        <span class="text-xs text-slate-500">前端交互原型 · 支持试操作</span>
        <a href="${spec.demoHref}" class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-800 shrink-0">
          <span>${spec.demoLabel}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>`;
  };

  const selectTab = (mode: HeroSystemMode) => {
    activeMode = mode;
    tabs.forEach((tab) => {
      const selected = tab.dataset.heroMode === mode;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.className = selected
        ? 'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors bg-blue-700 text-white shadow-xs'
        : 'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors bg-white text-slate-700 border border-slate-200 hover:bg-slate-100';
    });
    renderPanel(mode);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.heroMode as HeroSystemMode | undefined;
      if (mode) selectTab(mode);
    });
    tab.addEventListener('keydown', (event) => {
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;

      event.preventDefault();
      const targetTab = tabs[nextIndex];
      const mode = targetTab?.dataset.heroMode as HeroSystemMode | undefined;
      if (targetTab && mode) {
        selectTab(mode);
        targetTab.focus();
      }
    });
  });

  selectTab(activeMode);
}

function renderProblemsGrid(): void {
  const container = document.getElementById('home-problems-grid');
  if (!container) return;

  container.innerHTML = HOME_PROBLEMS.map(
    (item) => `<a href="${item.href}" class="group rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 hover:border-blue-300 hover:shadow-md hover:shadow-slate-200/50 transition-all flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between gap-2">
          <span class="inline-flex items-center gap-2 text-xs font-semibold text-blue-700">
            <span class="font-mono">${item.index}</span>
            <span>/</span>
            <span>${item.service}</span>
          </span>
          <span aria-hidden="true" class="text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform">↗</span>
        </div>
        <h3 class="mt-3.5 text-xl font-bold text-slate-950 group-hover:text-blue-700 transition-colors">${item.title}</h3>
        <div class="mt-4 space-y-2.5 text-sm leading-relaxed">
          <p class="text-slate-500"><strong class="font-semibold text-slate-700">常见现状：</strong>${item.pain}</p>
          <p class="text-slate-700"><strong class="font-semibold text-slate-900">解决思路：</strong>${item.solution}</p>
          <p class="text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 rounded-lg px-3 py-2 text-xs sm:text-sm"><strong class="font-semibold">改善结果：</strong>${item.outcome}</p>
        </div>
      </div>
      <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-blue-700">
        <span>${item.cta}</span>
        <span aria-hidden="true">→</span>
      </div>
    </a>`
  ).join('');
}

function renderConceptsGrid(): void {
  const container = document.getElementById('home-concepts-grid');
  if (!container) return;

  const cards = [
    {
      href: 'project.html?project=operations',
      badge: '01 / 企业软件开发',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      title: '序章 · 运营工作台',
      summary: '查看项目进度、待确认任务与操作留痕联动。',
      cta: '体验工作台演示',
      preview: `<div class="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2.5">
        <div class="flex items-center justify-between text-[11px] text-slate-500">
          <span class="font-semibold text-slate-800">演示空间 / 项目总览</span>
          <span class="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">3 个项目</span>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="rounded-lg bg-white p-2 border border-slate-200/60"><p class="text-[10px] text-slate-500">待处理</p><p class="text-sm font-bold text-slate-900 tabular-nums">01</p></div>
          <div class="rounded-lg bg-white p-2 border border-slate-200/60"><p class="text-[10px] text-slate-500">进行中</p><p class="text-sm font-bold text-blue-700 tabular-nums">03</p></div>
          <div class="rounded-lg bg-white p-2 border border-slate-200/60"><p class="text-[10px] text-slate-500">留痕记录</p><p class="text-sm font-bold text-emerald-700 tabular-nums">04</p></div>
        </div>
      </div>`
    },
    {
      href: 'project.html?project=agent',
      badge: '02 / AI Agent 搭建',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: '知间 · 知识 Agent',
      summary: '切换预设团队问题，查验回答依据、文档出处与权限提示。',
      cta: '体验知识问答演示',
      preview: `<div class="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2.5">
        <div class="rounded-lg bg-white border border-slate-200/80 px-3 py-2 text-xs font-medium text-slate-800">
          问：项目启动前，需要确认哪些信息？
        </div>
        <div class="rounded-lg bg-indigo-50/70 border border-indigo-200/70 px-3 py-2 text-[11px] text-indigo-900 flex items-center justify-between gap-2">
          <span class="truncate">来源：《项目协作手册》第 1 节</span>
          <span class="font-semibold shrink-0">查看原文 ↗</span>
        </div>
      </div>`
    },
    {
      href: 'project.html?project=workflow',
      badge: '03 / 工作流自动化',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: '有序 · 审批工作流',
      summary: '切换采购金额档位，逐步模拟规则判断与人工审批流转。',
      cta: '体验审批流转演示',
      preview: `<div class="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2.5">
        <div class="flex items-center justify-between text-[11px]">
          <span class="font-medium text-slate-700">采购申请 · 金额分支</span>
          <span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">等待审批</span>
        </div>
        <div class="flex items-center gap-1.5 text-[11px] text-slate-600">
          <span class="px-2 py-1 rounded bg-white border border-slate-200 font-medium">提交申请</span>
          <span aria-hidden="true">→</span>
          <span class="px-2 py-1 rounded bg-white border border-slate-200 font-medium">金额判断</span>
          <span aria-hidden="true">→</span>
          <span class="px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">人工审批</span>
        </div>
      </div>`
    }
  ];

  container.innerHTML = cards
    .map(
      (card) => `<a href="${card.href}" class="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-md hover:shadow-slate-200/50 transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-md border text-xs font-semibold ${card.badgeClass}">${card.badge}</span>
            <span class="text-[11px] font-medium text-slate-400">概念演示</span>
          </div>
          <div class="mt-4">${card.preview}</div>
          <h3 class="mt-5 text-lg font-bold text-slate-950 group-hover:text-blue-700 transition-colors">${card.title}</h3>
          <p class="mt-2 text-sm text-slate-600 leading-relaxed">${card.summary}</p>
        </div>
        <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-blue-700">
          <span>${card.cta}</span>
          <span aria-hidden="true" class="group-hover:translate-x-0.5 transition-transform">→</span>
        </div>
      </a>`
    )
    .join('');
}

function renderCooperationSteps(): void {
  const container = document.getElementById('home-coop-steps');
  if (!container) return;

  container.innerHTML = COOPERATION_STEPS.map(
    (item) => `<li class="rounded-2xl border border-slate-200 bg-white p-6">
      <div class="flex items-center justify-between text-xs font-semibold text-blue-700">
        <span class="font-mono">${item.step}</span>
        <span>${item.phase}</span>
      </div>
      <h3 class="mt-3 text-lg font-bold text-slate-950">${item.title}</h3>
      <p class="mt-2 text-sm text-slate-600 leading-relaxed">${item.description}</p>
    </li>`
  ).join('');
}

initShell();
initHeroTabs();
renderProblemsGrid();
renderConceptsGrid();
renderCooperationSteps();
