import '../styles/main.css';
import { initShell } from '../components/shell';
import { CONCEPTS } from '../data/concepts';

function renderCards(): void {
  const grid = document.getElementById('work-cards-grid');
  if (!grid) return;

  const list = [CONCEPTS.operations, CONCEPTS.agent, CONCEPTS.workflow];
  grid.innerHTML = list
    .map(
      (item) => `<article data-category="${item.filterCategory}" class="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-blue-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all flex flex-col justify-between">
        <div>
          <a href="project.html?project=${item.id}" class="block overflow-hidden bg-[#F4F7FB] border-b border-slate-100">
            <img src="${item.image}" alt="${item.imageAlt}" class="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-300 block" />
          </a>
          <div class="p-6">
            <p class="text-xs font-semibold text-blue-600">${item.categoryTag}</p>
            <h2 class="mt-2 text-xl font-bold text-slate-950">
              <a href="project.html?project=${item.id}" class="hover:text-blue-600 transition-colors">${item.name} · ${item.subtitle}</a>
            </h2>
            <p class="mt-2.5 text-sm text-slate-600 leading-relaxed">${item.shortSummary}</p>
          </div>
        </div>

        <div class="px-6 pb-6">
          <a href="project.html?project=${item.id}" class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            <span>在线体验原型</span>
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
  const empty = document.getElementById('work-empty');
  const grid = document.getElementById('work-cards-grid');

  const applyFilter = (filter: string) => {
    buttons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.setAttribute('aria-pressed', String(active));
      button.className = active
        ? 'px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-blue-600 text-white'
        : 'px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-white text-slate-700 hover:bg-slate-100 border border-slate-200';
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

initShell();
renderCards();
initFilters();
