import '../styles/main.css';
import { initShell, setParticleForm } from '../components/shell';
import { CONCEPTS } from '../data/concepts';

function renderCards(): void {
  const grid = document.getElementById('work-cards-grid');
  if (!grid) return;

  const list = [CONCEPTS.operations, CONCEPTS.agent, CONCEPTS.workflow];
  grid.innerHTML = list
    .map(
      (item, idx) => `<article data-category="${item.filterCategory}" data-particle-idx="${idx}" class="group rounded-2xl overflow-hidden flex flex-col justify-between">
        <div class="relative z-10">
          <a href="project.html?project=${item.id}" class="block overflow-hidden bg-[#070B18] border-b border-slate-800/80">
            <img src="${item.image}" alt="${item.imageAlt}" class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500 block" />
          </a>
          <div class="p-6">
            <p class="text-xs font-mono font-semibold text-sky-400">0${idx + 1} // ${item.categoryTag}</p>
            <h2 class="mt-2 text-xl font-bold text-white">
              <a href="project.html?project=${item.id}" class="hover:text-sky-300 transition-colors">${item.name} · ${item.subtitle}</a>
            </h2>
            <p class="mt-2.5 text-sm text-slate-400 leading-relaxed">${item.shortSummary}</p>
          </div>
        </div>

        <div class="relative z-10 px-6 pb-6">
          <a href="project.html?project=${item.id}" class="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors">
            <span>在线体验原型</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </article>`
    )
    .join('');

  grid.querySelectorAll<HTMLElement>('[data-particle-idx]').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const idx = Number(card.dataset.particleIdx ?? 0);
      setParticleForm(idx);
    });
  });
}

function initFilters(): void {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const cards = [...document.querySelectorAll<HTMLElement>('[data-category]')];
  const empty = document.getElementById('work-empty');
  const grid = document.getElementById('work-cards-grid');

  const filterFormMap: Record<string, number> = {
    all: 2,
    software: 0,
    agent: 1,
    workflow: 2
  };

  const applyFilter = (filter: string) => {
    setParticleForm(filterFormMap[filter] ?? 2);

    buttons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.setAttribute('aria-pressed', String(active));
      button.className = active
        ? 'px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-blue-600 text-white'
        : 'px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700/80';
    });

    let visibleCount = 0;
    cards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) {
        visibleCount += 1;
        card.classList.remove('panel-morph-enter');
        void card.offsetWidth;
        card.classList.add('panel-morph-enter');
      }
    });

    if (grid) {
      grid.className =
        visibleCount === 1
          ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
          : 'grid grid-cols-1 lg:grid-cols-3 gap-8';
    }
    if (empty) {
      empty.hidden = visibleCount !== 0;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      applyFilter(button.dataset.filter ?? 'all');
    });
  });
}

renderCards();
initFilters();
initShell(2);
