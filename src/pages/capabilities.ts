import '../styles/main.css';
import heroVisualImg from '../assets/images/hero-visual.jpg';
import solutionAgentImg from '../assets/images/solution-agent.jpg';
import solutionSoftwareImg from '../assets/images/solution-software.jpg';
import solutionWorkflowImg from '../assets/images/solution-workflow.jpg';
import { initShell } from '../components/shell';
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
    const sectionBg = index % 2 === 1 ? 'bg-[#F7F9FC]' : 'bg-white';

    return `<section id="${service.id}" class="py-16 lg:py-24 scroll-mt-20 ${sectionBg}">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div class="lg:col-span-6 ${imageFirst ? 'lg:order-2' : ''}">
            <p class="text-sm font-semibold text-blue-600">${service.subtitle}</p>
            <h2 class="mt-2.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">${service.title}</h2>
            <p class="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">${service.description}</p>

            <ul class="mt-6 space-y-3">
              ${service.points
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

            <p class="mt-6 pt-5 border-t border-slate-200/80 text-xs sm:text-sm text-slate-500">
              <strong class="font-semibold text-slate-800">常见交付内容：</strong>${service.deliverable}
            </p>

            <div class="mt-6">
              <a href="about.html?service=${service.serviceQuery}#contact" class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                <span>咨询此项服务</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div class="lg:col-span-6 ${imageFirst ? 'lg:order-1' : ''}">
            <div class="rounded-2xl overflow-hidden bg-[#F4F7FB] border border-slate-200/70 shadow-sm">
              <img src="${visual.src}" alt="${visual.alt}" class="w-full aspect-video object-cover block" />
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }).join('');
}

function renderGuarantees(): void {
  const grid = document.getElementById('guarantees-grid');
  if (!grid) return;

  grid.innerHTML = DELIVERY_GUARANTEES.map(
    (item) => `<div>
      <h3 class="text-lg font-bold text-slate-950">${item.title}</h3>
      <p class="mt-2.5 text-sm text-slate-600 leading-relaxed">${item.description}</p>
    </div>`
  ).join('');
}

initShell();
renderServices();
renderGuarantees();
