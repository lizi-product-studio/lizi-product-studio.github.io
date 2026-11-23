import '../styles/main.css';
import heroVisualImg from '../assets/images/hero-visual.jpg';
import solutionAgentImg from '../assets/images/solution-agent.jpg';
import solutionSoftwareImg from '../assets/images/solution-software.jpg';
import solutionWorkflowImg from '../assets/images/solution-workflow.jpg';
import { initShell } from '../components/shell';
import {
  HERO_CAROUSEL_SLIDES,
  HOME_PROCESS_STEPS,
  HOME_SCENARIOS,
  HOME_SERVICES,
  type HeroCarouselSlide,
  type HomeScenarioId
} from '../data/home';

const HERO_SLIDE_IMAGES: Record<HeroCarouselSlide['id'], { src: string; alt: string }> = {
  software: { src: solutionSoftwareImg, alt: '企业软件开发与订单协同系统视觉' },
  agent: { src: solutionAgentImg, alt: '企业知识问答 AI Agent 视觉' },
  automation: { src: solutionWorkflowImg, alt: '工作流自动化与审批流转视觉' },
  web: { src: heroVisualImg, alt: '企业品牌官网与数字门户架构视觉' }
};

const SCENARIO_IMAGES: Record<HomeScenarioId, { src: string; alt: string }> = {
  operations: { src: solutionSoftwareImg, alt: '运营与订单协同系统三维视觉图' },
  agent: { src: solutionAgentImg, alt: '企业知识问答 AI 智能体三维视觉图' },
  workflow: { src: solutionWorkflowImg, alt: '企业自动化审批流转三维视觉图' }
};

function initHeroCarousel(): void {
  const root = document.getElementById('hero-carousel');
  const viewport = document.getElementById('hero-carousel-viewport');
  const caption = document.getElementById('hero-carousel-caption');
  const tabsContainer = document.getElementById('hero-carousel-tabs');
  if (!root || !viewport || !caption || !tabsContainer) return;

  const slides = HERO_CAROUSEL_SLIDES;
  const SLIDE_DURATION_MS = 4800;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let activeIndex = 0;
  let isPaused = false;
  let elapsedMs = 0;
  let lastTimestamp = performance.now();

  // 渲染画面层与左右箭头、顶部悬浮业务焦点标签
  viewport.innerHTML = `
    ${slides
      .map((slide, idx) => {
        const img = HERO_SLIDE_IMAGES[slide.id];
        const isCurrent = idx === 0;
        return `<div
          data-carousel-slide="${idx}"
          aria-hidden="${!isCurrent}"
          class="absolute inset-0 transition-all duration-500 ease-out ${
            isCurrent ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-[1.03] z-0 pointer-events-none'
          }"
        >
          <img src="${img.src}" alt="${img.alt}" class="w-full h-full object-cover block" />
          <div class="absolute inset-x-0 top-0 p-3.5 sm:p-4 flex items-center justify-between gap-2 pointer-events-none">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/92 backdrop-blur-md border border-slate-200/80 text-xs font-semibold text-blue-700 shadow-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span>${slide.badge}</span>
            </span>
            <span class="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-[11px] font-medium text-white">
              ${slide.highlightTag}
            </span>
          </div>
        </div>`;
      })
      .join('')}
    <button
      type="button"
      id="hero-carousel-prev"
      aria-label="上一项业务"
      class="absolute left-3 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-800 border border-slate-200/80 shadow-sm backdrop-blur-sm transition-colors"
    >
      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd"/></svg>
    </button>
    <button
      type="button"
      id="hero-carousel-next"
      aria-label="下一项业务"
      class="absolute right-3 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-800 border border-slate-200/80 shadow-sm backdrop-blur-sm transition-colors"
    >
      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd"/></svg>
    </button>
  `;

  // 渲染底部 4 个带进度条的指示器按钮
  tabsContainer.innerHTML = slides
    .map(
      (slide, idx) => `<button
        type="button"
        role="tab"
        id="hero-slide-tab-${idx}"
        aria-selected="${idx === 0}"
        data-carousel-tab="${idx}"
        class="relative px-2 py-3 sm:px-3.5 text-center transition-colors overflow-hidden focus-visible:z-10 ${
          idx === 0 ? 'bg-white text-blue-600 font-semibold' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 font-medium'
        }"
      >
        <span class="block text-xs sm:text-[13px] truncate">${slide.shortTab}</span>
        <span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-[3px] bg-slate-200/70">
          <span
            data-carousel-progress="${idx}"
            class="block h-full bg-blue-600 origin-left transition-none"
            style="transform: scaleX(0)"
          ></span>
        </span>
      </button>`
    )
    .join('');

  const slideEls = [...viewport.querySelectorAll<HTMLElement>('[data-carousel-slide]')];
  const tabEls = [...tabsContainer.querySelectorAll<HTMLButtonElement>('[data-carousel-tab]')];
  const progressEls = [...tabsContainer.querySelectorAll<HTMLElement>('[data-carousel-progress]')];

  const renderCaption = (index: number) => {
    const slide = slides[index] ?? slides[0];
    caption.innerHTML = `<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h2 class="text-base sm:text-lg font-bold text-slate-950 truncate">${slide.title}</h2>
          <span class="text-xs font-mono text-slate-400 shrink-0">0${index + 1} / 0${slides.length}</span>
        </div>
        <p class="mt-1 text-xs sm:text-sm text-slate-600 line-clamp-2">${slide.summary}</p>
      </div>
      <a
        href="${slide.href}"
        class="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 shrink-0"
      >
        <span>${slide.ctaLabel}</span>
        <span aria-hidden="true">→</span>
      </a>
    </div>`;
  };

  const updateProgressBars = (ratio: number) => {
    progressEls.forEach((bar, idx) => {
      if (idx === activeIndex) {
        bar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
      } else {
        bar.style.transform = 'scaleX(0)';
      }
    });
  };

  const goToSlide = (nextIdx: number) => {
    activeIndex = (nextIdx + slides.length) % slides.length;
    elapsedMs = 0;
    lastTimestamp = performance.now();

    slideEls.forEach((el, idx) => {
      const current = idx === activeIndex;
      el.setAttribute('aria-hidden', String(!current));
      el.className = `absolute inset-0 transition-all duration-500 ease-out ${
        current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-[1.03] z-0 pointer-events-none'
      }`;
    });

    tabEls.forEach((tab, idx) => {
      const current = idx === activeIndex;
      tab.setAttribute('aria-selected', String(current));
      tab.className = `relative px-2 py-3 sm:px-3.5 text-center transition-colors overflow-hidden focus-visible:z-10 ${
        current ? 'bg-white text-blue-600 font-semibold' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 font-medium'
      }`;
    });

    renderCaption(activeIndex);
    updateProgressBars(0);
  };

  renderCaption(0);

  document.getElementById('hero-carousel-prev')?.addEventListener('click', () => {
    goToSlide(activeIndex - 1);
  });

  document.getElementById('hero-carousel-next')?.addEventListener('click', () => {
    goToSlide(activeIndex + 1);
  });

  tabEls.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      goToSlide(idx);
    });
    tab.addEventListener('keydown', (event) => {
      let targetIdx = idx;
      if (event.key === 'ArrowRight') targetIdx = (idx + 1) % slides.length;
      else if (event.key === 'ArrowLeft') targetIdx = (idx - 1 + slides.length) % slides.length;
      else if (event.key === 'Home') targetIdx = 0;
      else if (event.key === 'End') targetIdx = slides.length - 1;
      else return;
      event.preventDefault();
      goToSlide(targetIdx);
      tabEls[targetIdx]?.focus();
    });
  });

  // 触屏/鼠标横向滑动切换支持
  let pointerStartX: number | null = null;
  viewport.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
  });
  viewport.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const deltaX = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(deltaX) > 40) {
      goToSlide(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
    }
  });

  // 鼠标移入或焦点在轮播内时自动暂停
  root.addEventListener('mouseenter', () => {
    isPaused = true;
  });
  root.addEventListener('mouseleave', () => {
    isPaused = false;
    lastTimestamp = performance.now();
  });
  root.addEventListener('focusin', () => {
    isPaused = true;
  });
  root.addEventListener('focusout', (event) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (!nextTarget || !root.contains(nextTarget)) {
      isPaused = false;
      lastTimestamp = performance.now();
    }
  });

  // 读秒进度条与自动轮播循环
  if (!reducedMotion) {
    const tick = (now: number) => {
      if (!isPaused && !document.hidden) {
        const dt = now - lastTimestamp;
        elapsedMs += dt;
        if (elapsedMs >= SLIDE_DURATION_MS) {
          goToSlide(activeIndex + 1);
        } else {
          updateProgressBars(elapsedMs / SLIDE_DURATION_MS);
        }
      }
      lastTimestamp = now;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

function renderServices(): void {
  const container = document.getElementById('home-services-grid');
  if (!container) return;

  container.innerHTML = HOME_SERVICES.map(
    (item) => `<div class="flex flex-col justify-between">
      <div>
        <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600">
          ${item.iconSvg}
        </div>
        <h3 class="mt-5 text-lg font-bold text-slate-950">${item.title}</h3>
        <p class="mt-2.5 text-sm text-slate-600 leading-relaxed">${item.summary}</p>
      </div>
      <div class="mt-5">
        <a href="${item.href}" class="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          <span>了解详情</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>`
  ).join('');
}

function initScenarioTabs(): void {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-scene-tab]')];
  const panel = document.getElementById('home-scenario-panel');
  if (!panel || tabs.length === 0) return;

  const renderPanel = (id: HomeScenarioId) => {
    const spec = HOME_SCENARIOS[id];
    const visual = SCENARIO_IMAGES[id];

    panel.setAttribute('aria-labelledby', `scene-tab-${id}`);
    panel.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <div class="lg:col-span-5">
        <h3 class="text-2xl font-bold text-slate-950 leading-snug">${spec.title}</h3>
        <p class="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">${spec.description}</p>
        <ul class="mt-6 space-y-3">
          ${spec.points
            .map(
              (point) => `<li class="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                <svg aria-hidden="true" class="w-4 h-4 text-blue-600 shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
                <span>${point}</span>
              </li>`
            )
            .join('')}
        </ul>
        <div class="mt-7">
          <a href="${spec.demoHref}" class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            <span>${spec.demoLabel}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div class="lg:col-span-7">
        <div class="rounded-xl overflow-hidden bg-[#F4F7FB] border border-slate-200/70">
          <img src="${visual.src}" alt="${visual.alt}" class="w-full aspect-video object-cover block" />
        </div>
      </div>
    </div>`;
  };

  const selectTab = (id: HomeScenarioId) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.sceneTab === id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      tab.className = active
        ? 'px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-blue-600 text-white'
        : 'px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-white text-slate-700 hover:bg-slate-100 border border-slate-200';
    });
    renderPanel(id);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.sceneTab as HomeScenarioId | undefined;
      if (id) selectTab(id);
    });
    tab.addEventListener('keydown', (event) => {
      let nextIdx = index;
      if (event.key === 'ArrowRight') nextIdx = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIdx = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIdx = 0;
      else if (event.key === 'End') nextIdx = tabs.length - 1;
      else return;

      event.preventDefault();
      const targetTab = tabs[nextIdx];
      const id = targetTab?.dataset.sceneTab as HomeScenarioId | undefined;
      if (targetTab && id) {
        selectTab(id);
        targetTab.focus();
      }
    });
  });

  selectTab('operations');
}

function renderProcessSteps(): void {
  const list = document.getElementById('home-process-list');
  if (!list) return;

  list.innerHTML = HOME_PROCESS_STEPS.map(
    (item) => `<li>
      <span class="block text-2xl font-bold text-blue-600/80 tabular-nums">${item.step}</span>
      <h3 class="mt-3 text-lg font-bold text-slate-950">${item.title}</h3>
      <p class="mt-2 text-sm text-slate-600 leading-relaxed">${item.description}</p>
    </li>`
  ).join('');
}

initShell();
initHeroCarousel();
renderServices();
initScenarioTabs();
renderProcessSteps();
