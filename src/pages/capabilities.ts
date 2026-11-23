import '../styles/main.css';
import heroVisualImg from '../assets/images/hero-visual.jpg';
import solutionAgentImg from '../assets/images/solution-agent.jpg';
import solutionSoftwareImg from '../assets/images/solution-software.jpg';
import solutionWorkflowImg from '../assets/images/solution-workflow.jpg';
import { initShell, setParticleForm } from '../components/shell';
import { CORE_SERVICES, DELIVERY_GUARANTEES, type CoreServiceSpec } from '../data/services';

const SERVICE_VISUALS: Record<CoreServiceSpec['id'], { src: string; alt: string }> = {
  software: { src: solutionSoftwareImg, alt: '企业软件开发模块化架构视觉图' },
  agent: { src: solutionAgentImg, alt: '企业 AI Agent 知识检索视觉图' },
  automation: { src: solutionWorkflowImg, alt: '工作流自动化连接视觉图' },
  web: { src: heroVisualImg, alt: '企业官网建设三维架构视觉图' }
};

function renderServices(): void {
  const container = document.getElementById('services-zig-zag');
  if (!container) return;

  container.innerHTML = CORE_SERVICES.map((service, index) => {
    const visual = SERVICE_VISUALS[service.id];
    const imageFirst = index % 2 === 1;

    return `<section id="${service.id}" data-particle-form="${index}" class="holo-surface rounded-3xl p-6 sm:p-10 lg:p-12 scroll-mt-24">
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        <div class="lg:col-span-6 ${imageFirst ? 'lg:order-2' : ''}">
          <div class="inline-flex items-center gap-2 text-xs font-mono text-sky-400">
            <span>0${index + 1}</span>
            <span>//</span>
            <span>${service.subtitle}</span>
          </div>
          <h2 class="mt-2.5 text-2xl sm:text-3xl font-bold tracking-tight text-white">${service.title}</h2>
          <p class="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">${service.description}</p>

          <ul class="mt-6 space-y-3">
            ${service.points
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

          <p class="mt-6 pt-5 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
            <strong class="font-semibold text-slate-200">常见交付内容：</strong>${service.deliverable}
          </p>

          <div class="mt-6">
            <a href="about.html?service=${service.serviceQuery}#contact" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold transition-all">
              <span>咨询此项服务</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div class="lg:col-span-6 ${imageFirst ? 'lg:order-1' : ''}">
          <div class="rounded-2xl overflow-hidden bg-[#070B18] border border-slate-700/80 shadow-2xl">
            <img src="${visual.src}" alt="${visual.alt}" class="w-full aspect-video object-cover block" />
          </div>
        </div>
      </div>
    </section>`;
  }).join('');

  // 鼠标移入不同服务板块时，联动改变三维粒子背景拓扑形态
  container.querySelectorAll<HTMLElement>('[data-particle-form]').forEach((sec) => {
    sec.addEventListener('mouseenter', () => {
      const idx = Number(sec.dataset.particleForm ?? 0);
      setParticleForm(idx);
    });
  });
}

function renderGuarantees(): void {
  const grid = document.getElementById('guarantees-grid');
  if (!grid) return;

  grid.innerHTML = DELIVERY_GUARANTEES.map(
    (item, idx) => `<div class="p-6">
      <div class="relative z-10">
        <span class="text-xs font-mono text-sky-400">0${idx + 1} // GUARANTEE</span>
        <h3 class="mt-3 text-lg font-bold text-white">${item.title}</h3>
        <p class="mt-2.5 text-sm text-slate-400 leading-relaxed">${item.description}</p>
      </div>
    </div>`
  ).join('');
}

renderServices();
renderGuarantees();
initShell(1);
