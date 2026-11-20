import '../styles/main.css';
import solutionAgentImg from '../assets/images/solution-agent.jpg';
import solutionSoftwareImg from '../assets/images/solution-software.jpg';
import solutionWorkflowImg from '../assets/images/solution-workflow.jpg';
import { initShell } from '../components/shell';
import {
  HOME_PROCESS_STEPS,
  HOME_SCENARIOS,
  HOME_SERVICES,
  type HomeScenarioId
} from '../data/home';

const SCENARIO_IMAGES: Record<HomeScenarioId, { src: string; alt: string }> = {
  operations: { src: solutionSoftwareImg, alt: '运营与订单协同系统三维视觉图' },
  agent: { src: solutionAgentImg, alt: '企业知识问答 AI 智能体三维视觉图' },
  workflow: { src: solutionWorkflowImg, alt: '企业自动化审批流转三维视觉图' }
};

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
renderServices();
initScenarioTabs();
renderProcessSteps();
