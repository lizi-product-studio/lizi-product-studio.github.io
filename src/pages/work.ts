import '../styles/main.css';
import { initShell } from '../components/shell';
import { CONCEPTS, type ConceptId } from '../data/concepts';

function renderConceptVisual(id: ConceptId): string {
  if (id === 'operations') {
    return `<div class="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
      <div class="flex items-center justify-between text-xs">
        <span class="font-semibold text-slate-900">序章 · 项目总览</span>
        <span class="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] text-slate-600">演示空间</span>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div class="rounded-lg bg-white border border-slate-200/80 p-2.5">
          <p class="text-[11px] text-slate-500">待确认</p>
          <p class="mt-0.5 text-base font-bold text-amber-600 tabular-nums">01</p>
        </div>
        <div class="rounded-lg bg-white border border-slate-200/80 p-2.5">
          <p class="text-[11px] text-slate-500">进行中</p>
          <p class="mt-0.5 text-base font-bold text-blue-700 tabular-nums">03</p>
        </div>
        <div class="rounded-lg bg-white border border-slate-200/80 p-2.5">
          <p class="text-[11px] text-slate-500">动态留痕</p>
          <p class="mt-0.5 text-base font-bold text-emerald-700 tabular-nums">04</p>
        </div>
      </div>
      <div class="rounded-lg bg-white border border-slate-200/80 divide-y divide-slate-100 text-xs">
        <div class="px-3 py-2 flex items-center justify-between">
          <span class="font-medium text-slate-800 truncate">客户服务平台</span>
          <span class="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">设计确认</span>
        </div>
        <div class="px-3 py-2 flex items-center justify-between">
          <span class="font-medium text-slate-800 truncate">供应链管理工具</span>
          <span class="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">需求梳理</span>
        </div>
      </div>
    </div>`;
  }

  if (id === 'agent') {
    return `<div class="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
      <div class="flex items-center justify-between text-xs">
        <span class="font-semibold text-slate-900">知间 · 知识问答</span>
        <span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[11px] font-medium">3 个预设问题</span>
      </div>
      <div class="rounded-lg bg-white border border-slate-200/80 p-3 space-y-2 text-xs">
        <p class="font-semibold text-slate-900">问：新同事入职，需要准备什么？</p>
        <ol class="space-y-1 text-slate-600 pl-4 list-decimal">
          <li>开通工作账号与工具权限</li>
          <li>确认第一周工作计划</li>
        </ol>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-700 font-medium">
          <span>来源：《团队入职指引》第 2 节</span>
          <span>原文可核对 ↗</span>
        </div>
      </div>
    </div>`;
  }

  return `<div class="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
    <div class="flex items-center justify-between text-xs">
      <span class="font-semibold text-slate-900">有序 · 审批流程</span>
      <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-medium">支持多档金额</span>
    </div>
    <div class="space-y-2 text-xs">
      <div class="rounded-lg bg-white border border-slate-200/80 px-3 py-2 flex items-center justify-between">
        <span class="font-medium text-slate-800">01 提交采购申请</span>
        <span class="text-[11px] text-emerald-700 font-semibold">信息齐全 ✓</span>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="rounded-lg bg-white border border-blue-200 px-2.5 py-2">
          <p class="text-[10px] font-mono text-slate-400">≤ ¥5,000</p>
          <p class="font-semibold text-slate-900 mt-0.5">部门负责人</p>
        </div>
        <div class="rounded-lg bg-white border border-indigo-200 px-2.5 py-2">
          <p class="text-[10px] font-mono text-slate-400">＞ ¥5,000</p>
          <p class="font-semibold text-slate-900 mt-0.5">财务负责人</p>
        </div>
      </div>
    </div>
  </div>`;
}

function getBadgeClass(category: 'software' | 'agent' | 'workflow'): string {
  if (category === 'software') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (category === 'agent') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
}

function renderCards(): void {
  const grid = document.getElementById('work-cards-grid');
  if (!grid) return;

  const list = [CONCEPTS.operations, CONCEPTS.agent, CONCEPTS.workflow];
  grid.innerHTML = list
    .map(
      (item) => `<article data-category="${item.filterCategory}" class="rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-md hover:shadow-slate-200/50 transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-md border text-xs font-semibold ${getBadgeClass(item.filterCategory)}">${item.number} / ${item.categoryTag}</span>
            <span class="text-[11px] font-medium text-slate-400">自主概念</span>
          </div>

          <a href="project.html?project=${item.id}" class="block mt-4 group">
            ${renderConceptVisual(item.id)}
          </a>

          <h2 class="mt-5 text-xl font-bold text-slate-950">
            <a href="project.html?project=${item.id}" class="hover:text-blue-700 transition-colors">${item.name} · ${item.subtitle}</a>
          </h2>
          <p class="mt-2 text-sm text-slate-600 leading-relaxed">${item.shortSummary}</p>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <span class="text-xs text-slate-500">${item.fieldsLabel}</span>
          <a href="project.html?project=${item.id}" class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800 shrink-0">
            <span>进入交互演示</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </article>`
    )
    .join('');
}

function initFilters(): void {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const cards = [...document.querySelectorAll<HTMLElement>('[data-category]')];
  const counter = document.getElementById('work-count');
  const empty = document.getElementById('work-empty');
  const grid = document.getElementById('work-cards-grid');

  const applyFilter = (filter: string) => {
    buttons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.setAttribute('aria-pressed', String(active));
      button.className = active
        ? 'px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors bg-blue-700 text-white shadow-xs'
        : 'px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200/80';
    });

    let visibleCount = 0;
    cards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visibleCount += 1;
    });

    if (grid) {
      grid.className =
        visibleCount === 1
          ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
          : 'grid grid-cols-1 lg:grid-cols-3 gap-6';
    }
    if (counter) {
      counter.textContent = `当前显示 ${String(visibleCount).padStart(2, '0')} 个方案`;
    }
    if (empty) {
      empty.hidden = visibleCount !== 0;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter ?? 'all';
      applyFilter(filter);
    });
  });
}

initShell();
renderCards();
initFilters();
