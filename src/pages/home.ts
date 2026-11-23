import '../styles/main.css';
import heroVisualImg from '../assets/images/hero-visual.jpg';
import solutionAgentImg from '../assets/images/solution-agent.jpg';
import solutionSoftwareImg from '../assets/images/solution-software.jpg';
import solutionWorkflowImg from '../assets/images/solution-workflow.jpg';
import {
  enhanceCardsAndTilt,
  enhanceInteractiveButtons,
  initShell,
  scrambleText,
  setParticleForm
} from '../components/shell';
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

const PARTICLE_FORM_NAMES: readonly string[] = [
  '粒子拓扑：01 // 三维架构矩阵',
  '粒子拓扑：02 // 斐波那契神经球',
  '粒子拓扑：03 // 三叶结流转环',
  '粒子拓扑：04 // 谐波数字视界'
];

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
  const particleStatusEl = document.getElementById('particle-form-status');
  if (!root || !viewport || !caption || !tabsContainer) return;

  const slides = HERO_CAROUSEL_SLIDES;
  const SLIDE_DURATION_MS = 3500;

  let activeIndex = 0;
  let isHoverPaused = false;
  let elapsedMs = 0;
  let lastTickTime = Date.now();

  const computeSlideState = (idx: number, current: number): 'active' | 'prev' | 'next' | 'hidden' => {
    if (idx === current) return 'active';
    if (idx === (current - 1 + slides.length) % slides.length) return 'prev';
    if (idx === (current + 1) % slides.length) return 'next';
    return 'hidden';
  };

  viewport.innerHTML = `
    ${slides
      .map((slide, idx) => {
        const img = HERO_SLIDE_IMAGES[slide.id];
        const state = computeSlideState(idx, 0);
        return `<div
          data-carousel-slide="${idx}"
          data-state="${state}"
          aria-hidden="${state !== 'active'}"
          class="coverflow-slide"
        >
          <img src="${img.src}" alt="${img.alt}" class="w-full h-full object-cover block" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#050814]/65 via-transparent to-[#050814]/25 pointer-events-none"></div>
          <div class="absolute inset-x-0 top-0 p-3.5 sm:p-4 flex items-center justify-between gap-2 pointer-events-none">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#070B19]/88 backdrop-blur-md border border-sky-400/40 text-xs font-semibold text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
              <span>${slide.badge}</span>
            </span>
            <span class="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[#070B19]/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-medium text-slate-200">
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
      class="absolute left-3 top-1/2 -translate-y-1/2 z-30 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#070B19]/85 hover:bg-blue-600 text-white border border-slate-700/80 shadow-lg backdrop-blur-md transition-colors"
    >
      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd"/></svg>
    </button>
    <button
      type="button"
      id="hero-carousel-next"
      aria-label="下一项业务"
      class="absolute right-3 top-1/2 -translate-y-1/2 z-30 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#070B19]/85 hover:bg-blue-600 text-white border border-slate-700/80 shadow-lg backdrop-blur-md transition-colors"
    >
      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd"/></svg>
    </button>
  `;

  tabsContainer.innerHTML = slides
    .map(
      (slide, idx) => `<button
        type="button"
        role="tab"
        id="hero-slide-tab-${idx}"
        aria-selected="${idx === 0}"
        data-carousel-tab="${idx}"
        class="relative px-2 py-3 sm:px-3.5 text-center transition-colors overflow-hidden focus-visible:z-10 ${
          idx === 0 ? 'bg-blue-600/20 text-sky-300 font-semibold' : 'text-slate-400 hover:bg-slate-900 hover:text-white font-medium'
        }"
      >
        <span class="block text-xs sm:text-[13px] truncate">${slide.shortTab}</span>
        <span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-[3px] bg-slate-800">
          <span
            data-carousel-progress="${idx}"
            class="block h-full bg-gradient-to-r from-sky-400 to-blue-500 origin-left shadow-[0_0_10px_#38bdf8]"
            style="transform: scaleX(0)"
          ></span>
        </span>
      </button>`
    )
    .join('');

  const slideEls = [...viewport.querySelectorAll<HTMLElement>('[data-carousel-slide]')];
  const tabEls = [...tabsContainer.querySelectorAll<HTMLButtonElement>('[data-carousel-tab]')];
  const progressEls = [...tabsContainer.querySelectorAll<HTMLElement>('[data-carousel-progress]')];

  const renderCaption = (index: number, animateDecode = false) => {
    const slide = slides[index] ?? slides[0];
    caption.innerHTML = `<div class="panel-morph-enter flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h2 id="hero-caption-title" class="text-base sm:text-lg font-bold text-white truncate">${slide.title}</h2>
          <span class="text-xs font-mono text-sky-400 shrink-0">0${index + 1} / 0${slides.length}</span>
        </div>
        <p class="mt-1 text-xs sm:text-sm text-slate-300/90 line-clamp-2">${slide.summary}</p>
      </div>
      <a
        href="${slide.href}"
        class="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-sky-400 hover:text-sky-300 shrink-0"
      >
        <span>${slide.ctaLabel}</span>
        <span aria-hidden="true">→</span>
      </a>
    </div>`;

    if (animateDecode) {
      scrambleText(document.getElementById('hero-caption-title'), slide.title, 280);
    }
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
    lastTickTime = Date.now();

    // 触发三维粒子背景形态实时重组与状态解码
    setParticleForm(activeIndex);
    scrambleText(particleStatusEl, PARTICLE_FORM_NAMES[activeIndex] ?? PARTICLE_FORM_NAMES[0], 320);

    slideEls.forEach((el, idx) => {
      const state = computeSlideState(idx, activeIndex);
      el.dataset.state = state;
      el.setAttribute('aria-hidden', String(state !== 'active'));
    });

    tabEls.forEach((tab, idx) => {
      const current = idx === activeIndex;
      tab.setAttribute('aria-selected', String(current));
      tab.className = `relative px-2 py-3 sm:px-3.5 text-center transition-colors overflow-hidden focus-visible:z-10 ${
        current ? 'bg-blue-600/20 text-sky-300 font-semibold' : 'text-slate-400 hover:bg-slate-900 hover:text-white font-medium'
      }`;
    });

    renderCaption(activeIndex, true);
    updateProgressBars(0);
  };

  renderCaption(0, false);

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

  viewport.addEventListener('mouseenter', () => {
    isHoverPaused = true;
  });
  viewport.addEventListener('mouseleave', () => {
    isHoverPaused = false;
    lastTickTime = Date.now();
  });

  // 3D 微倾斜交互
  if (window.matchMedia('(pointer: fine)').matches) {
    root.addEventListener('pointermove', (event) => {
      const rect = root.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      root.style.transform = `perspective(1200px) rotateX(${(-ny * 3.5).toFixed(2)}deg) rotateY(${(nx * 4.5).toFixed(2)}deg)`;
    });
    root.addEventListener('pointerleave', () => {
      root.style.transform = '';
    });
  }

  window.setInterval(() => {
    const now = Date.now();
    if (!isHoverPaused && !document.hidden) {
      elapsedMs += now - lastTickTime;
      if (elapsedMs >= SLIDE_DURATION_MS) {
        goToSlide(activeIndex + 1);
      } else {
        updateProgressBars(elapsedMs / SLIDE_DURATION_MS);
      }
    }
    lastTickTime = now;
  }, 40);
}

function renderServices(): void {
  const container = document.getElementById('home-services-grid');
  if (!container) return;

  container.innerHTML = HOME_SERVICES.map(
    (item, idx) => `<div class="group p-6 flex flex-col justify-between">
      <div class="relative z-10">
        <div class="flex items-center justify-between">
          <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-500/15 border border-sky-400/30 text-sky-400 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
            ${item.iconSvg}
          </div>
          <span class="text-xs font-mono text-slate-500">0${idx + 1}</span>
        </div>
        <h3 class="mt-5 text-lg font-bold text-white group-hover:text-sky-300 transition-colors">${item.title}</h3>
        <p class="mt-2.5 text-sm text-slate-400 leading-relaxed">${item.summary}</p>
      </div>
      <div class="relative z-10 mt-6 pt-4 border-t border-slate-800/80">
        <a href="${item.href}" class="inline-flex items-center gap-1 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors">
          <span>了解详情</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>`
  ).join('');
}

function initScenarioTabs(): void {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-scene-tab]')];
  const progressBars = [...document.querySelectorAll<HTMLElement>('[data-scene-progress]')];
  const panel = document.getElementById('home-scenario-panel');
  if (!panel || tabs.length === 0) return;

  const scenarioOrder: readonly HomeScenarioId[] = ['operations', 'agent', 'workflow'];
  const SCENARIO_DURATION_MS = 4500;
  let activeId: HomeScenarioId = 'operations';
  let scenarioHovered = false;
  let scenarioElapsed = 0;
  let scenarioLastTick = Date.now();

  const updateScenarioProgress = (ratio: number) => {
    progressBars.forEach((bar) => {
      if (bar.dataset.sceneProgress === activeId) {
        bar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
      } else {
        bar.style.transform = 'scaleX(0)';
      }
    });
  };

  const renderPanel = (id: HomeScenarioId) => {
    const spec = HOME_SCENARIOS[id];
    const visual = SCENARIO_IMAGES[id];

    panel.setAttribute('aria-labelledby', `scene-tab-${id}`);
    panel.innerHTML = `<div class="panel-morph-enter relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <div class="lg:col-span-5">
        <h3 class="text-2xl font-bold text-white leading-snug">${spec.title}</h3>
        <p class="mt-3.5 text-sm sm:text-base text-slate-300 leading-relaxed">${spec.description}</p>
        <ul class="mt-6 space-y-3">
          ${spec.points
            .map(
              (point) => `<li class="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                <svg aria-hidden="true" class="w-4 h-4 text-sky-400 shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
                <span>${point}</span>
              </li>`
            )
            .join('')}
        </ul>
        <div class="mt-7">
          <a href="${spec.demoHref}" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold transition-all">
            <span>${spec.demoLabel}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div class="lg:col-span-7">
        <div class="rounded-xl overflow-hidden bg-[#070B18] border border-slate-700/80 shadow-xl">
          <img src="${visual.src}" alt="${visual.alt}" class="w-full aspect-video object-cover block" />
        </div>
      </div>
    </div>`;

    enhanceInteractiveButtons(panel);
    enhanceCardsAndTilt(panel);
  };

  const selectTab = (id: HomeScenarioId) => {
    activeId = id;
    scenarioElapsed = 0;
    scenarioLastTick = Date.now();

    tabs.forEach((tab) => {
      const active = tab.dataset.sceneTab === id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      tab.className = active
        ? 'relative overflow-hidden px-5 py-2.5 rounded-xl text-sm font-semibold transition-all bg-blue-600 text-white shadow-[0_0_25px_-4px_rgba(59,130,246,0.65)]'
        : 'relative overflow-hidden px-5 py-2.5 rounded-xl text-sm font-semibold transition-all bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700/80';
    });
    updateScenarioProgress(0);
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

  panel.addEventListener('mouseenter', () => {
    scenarioHovered = true;
  });
  panel.addEventListener('mouseleave', () => {
    scenarioHovered = false;
    scenarioLastTick = Date.now();
  });

  window.setInterval(() => {
    const now = Date.now();
    if (!scenarioHovered && !document.hidden) {
      scenarioElapsed += now - scenarioLastTick;
      if (scenarioElapsed >= SCENARIO_DURATION_MS) {
        const currentIdx = scenarioOrder.indexOf(activeId);
        const nextId = scenarioOrder[(currentIdx + 1) % scenarioOrder.length] ?? 'operations';
        selectTab(nextId);
      } else {
        updateScenarioProgress(scenarioElapsed / SCENARIO_DURATION_MS);
      }
    }
    scenarioLastTick = now;
  }, 40);

  selectTab('operations');
}

function renderProcessSteps(): void {
  const list = document.getElementById('home-process-list');
  if (!list) return;

  list.innerHTML = HOME_PROCESS_STEPS.map(
    (item) => `<li class="group p-6">
      <div class="relative z-10">
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/15 border border-sky-400/30 text-sky-400 text-base font-bold tabular-nums group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">${item.step}</span>
        <h3 class="mt-4 text-lg font-bold text-white group-hover:text-sky-300 transition-colors">${item.title}</h3>
        <p class="mt-2 text-sm text-slate-400 leading-relaxed">${item.description}</p>
      </div>
    </li>`
  ).join('');
}

initHeroCarousel();
renderServices();
initScenarioTabs();
renderProcessSteps();
initShell(0);
