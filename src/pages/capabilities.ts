import '../styles/main.css';
import { initShell } from '../components/shell';
import {
  ACCEPTANCE_PRINCIPLES,
  CORE_SERVICES,
  SERVICE_SCENARIOS,
  type ScenarioKey
} from '../data/services';

function getInitialScenario(): ScenarioKey {
  const param = new URLSearchParams(window.location.search).get('scenario');
  if (param === 'software' || param === 'agent' || param === 'workflow') {
    return param;
  }
  return 'software';
}

function initScenarioExplorer(): void {
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-scenario]')];
  const nodes = [...document.querySelectorAll<HTMLButtonElement>('[data-step]')];
  const panel = document.getElementById('scenario-panel');
  const lineProgress = document.getElementById('cap-line-progress');
  const nextButton = document.getElementById('next-step');

  if (!panel || tabs.length === 0 || nodes.length === 0) return;

  let activeScenario: ScenarioKey = getInitialScenario();
  let currentStep = 0;

  const setText = (id: string, text: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const render = () => {
    const spec = SERVICE_SCENARIOS[activeScenario];
    const stepSpec = spec.steps[currentStep] ?? spec.steps[0];

    setText('scenario-kicker', spec.kicker);
    setText('step-number', `${String(currentStep + 1).padStart(2, '0')} / 04`);
    setText('step-category', stepSpec.category);
    setText('step-title', stepSpec.title);
    setText('step-description', stepSpec.description);
    setText('step-output', stepSpec.output);

    if (lineProgress) {
      lineProgress.style.width = `${(currentStep / 3) * 100}%`;
    }

    nodes.forEach((node, idx) => {
      const nodeData = spec.steps[idx];
      if (!nodeData) return;
      const isCurrent = idx === currentStep;
      const isPast = idx < currentStep;
      node.setAttribute('aria-pressed', String(isCurrent));
      node.className = isCurrent
        ? 'cap-node relative z-10 text-left rounded-xl border-2 border-blue-600 bg-blue-50 p-3.5 shadow-xs transition-all'
        : isPast
          ? 'cap-node relative z-10 text-left rounded-xl border border-emerald-300 bg-white p-3.5 hover:border-blue-300 transition-all'
          : 'cap-node relative z-10 text-left rounded-xl border border-slate-200 bg-white p-3.5 hover:border-blue-300 transition-all';

      node.innerHTML = `<div class="flex items-center justify-between gap-2 text-[11px] font-mono">
          <span class="${isCurrent ? 'text-blue-700 font-bold' : isPast ? 'text-emerald-700 font-semibold' : 'text-slate-400'}">${nodeData.code}</span>
          <span>${isPast ? '✓' : isCurrent ? '●' : ''}</span>
        </div>
        <p class="mt-1.5 text-sm font-bold text-slate-950">${nodeData.label}</p>`;
    });

    const conceptLink = document.getElementById('cap-related-concept') as HTMLAnchorElement | null;
    if (conceptLink) {
      conceptLink.href = `project.html?project=${spec.relatedConceptId}`;
      conceptLink.textContent = `${spec.relatedConceptLabel} →`;
    }

    const briefLink = document.getElementById('cap-scenario-brief') as HTMLAnchorElement | null;
    if (briefLink) {
      briefLink.href = `about.html?service=${spec.id}#project-brief`;
    }

    if (nextButton) {
      const labelSpan = nextButton.firstElementChild;
      if (labelSpan) {
        labelSpan.textContent = currentStep === 3 ? '从第一步重看' : '下一环节';
      }
      nextButton.setAttribute(
        'aria-label',
        currentStep === 3 ? '返回第一个流程步骤' : `查看第 ${currentStep + 2} 个流程步骤`
      );
    }
  };

  const selectTab = (scenario: ScenarioKey, syncUrl = true) => {
    activeScenario = scenario;
    currentStep = 0;

    tabs.forEach((tab) => {
      const selected = tab.dataset.scenario === scenario;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.className = selected
        ? 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors bg-blue-700 text-white shadow-xs'
        : 'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200';
      if (selected) {
        panel.setAttribute('aria-labelledby', tab.id);
      }
    });

    if (syncUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('scenario', scenario);
      window.history.replaceState(null, '', url);
    }

    render();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.scenario as ScenarioKey | undefined;
      if (key) selectTab(key, true);
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
      const key = targetTab?.dataset.scenario as ScenarioKey | undefined;
      if (targetTab && key) {
        selectTab(key, true);
        targetTab.focus();
      }
    });
  });

  nodes.forEach((node) => {
    node.addEventListener('click', () => {
      const stepIdx = Number(node.dataset.step);
      if (!Number.isNaN(stepIdx)) {
        currentStep = stepIdx;
        render();
      }
    });
  });

  nextButton?.addEventListener('click', () => {
    currentStep = (currentStep + 1) % 4;
    render();
  });

  selectTab(activeScenario, false);
}

function renderServicesGrid(): void {
  const grid = document.getElementById('core-services-grid');
  if (!grid) return;

  grid.innerHTML = CORE_SERVICES.map(
    (service) => `<article id="${service.anchor}" class="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between gap-3">
          <span class="text-xs font-mono font-bold text-blue-700">${service.index} / ${service.enSubtitle}</span>
        </div>
        <h3 class="mt-2.5 text-2xl font-bold text-slate-950">${service.title}</h3>
        <p class="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">${service.description}</p>
        ${
          service.example
            ? `<p class="mt-2.5 text-xs sm:text-sm text-indigo-800 bg-indigo-50/70 border border-indigo-200/70 rounded-lg px-3.5 py-2">${service.example}</p>`
            : ''
        }

        <ul class="mt-4 flex flex-wrap gap-2" aria-label="${service.title}包含方向">
          ${service.tags
            .map(
              (tag) =>
                `<li class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">${tag}</li>`
            )
            .join('')}
        </ul>

        <div class="mt-5 space-y-2.5 pt-4 border-t border-slate-100 text-xs sm:text-sm">
          <p class="text-slate-700"><strong class="font-semibold text-slate-950">可约定的交付物：</strong>${service.deliverable}</p>
          <p class="text-slate-500"><strong class="font-semibold text-slate-700">沟通前可准备：</strong>${service.preparation}</p>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <a href="about.html?service=${service.serviceQuery}#project-brief" class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">
          <span>${service.ctaLabel}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>`
  ).join('');
}

function renderAcceptanceGrid(): void {
  const grid = document.getElementById('acceptance-grid');
  if (!grid) return;

  grid.innerHTML = ACCEPTANCE_PRINCIPLES.map(
    (item) => `<article class="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
      <span class="text-xs font-mono font-bold text-blue-700">${item.index}</span>
      <h3 class="mt-2 text-lg font-bold text-slate-950">${item.title}</h3>
      <p class="mt-2 text-sm text-slate-600 leading-relaxed">${item.description}</p>
    </article>`
  ).join('');
}

initShell();
initScenarioExplorer();
renderServicesGrid();
renderAcceptanceGrid();
