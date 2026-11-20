import '../styles/main.css';
import { copyToClipboard, initShell } from '../components/shell';
import {
  ABOUT_FAQS,
  ABOUT_PRINCIPLES,
  ABOUT_PROCESS_STAGES,
  BRIEF_PLACEHOLDERS,
  BRIEF_SERVICE_OPTIONS,
  BRIEF_STAGE_OPTIONS,
  CONCEPT_REFERENCE_MAP,
  type ServiceOptionKey
} from '../data/about';
import { SITE } from '../data/site';

function renderStaticSections(): void {
  const principlesEl = document.getElementById('about-principles-list');
  if (principlesEl) {
    principlesEl.innerHTML = ABOUT_PRINCIPLES.map(
      (item) => `<article class="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
        <span class="text-xs font-mono font-bold text-blue-700">${item.index}</span>
        <h3 class="mt-2 text-base font-bold text-slate-950">${item.title}</h3>
        <p class="mt-2 text-sm text-slate-600 leading-relaxed">${item.description}</p>
      </article>`
    ).join('');
  }

  const processEl = document.getElementById('about-process-grid');
  if (processEl) {
    processEl.innerHTML = ABOUT_PROCESS_STAGES.map(
      (stage) => `<article class="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4">
        <div>
          <span class="text-xs font-mono font-bold text-blue-700">${stage.index}</span>
          <h3 class="mt-2 text-lg font-bold text-slate-950">${stage.title}</h3>
          <p class="mt-2 text-sm text-slate-600 leading-relaxed">${stage.description}</p>
        </div>
        <p class="text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg px-3 py-1.5">${stage.output}</p>
      </article>`
    ).join('');
  }

  const faqEl = document.getElementById('about-faq-list');
  if (faqEl) {
    faqEl.innerHTML = ABOUT_FAQS.map(
      (item) => `<details class="faq-item rounded-2xl border border-slate-200 bg-white open:border-blue-300 transition-colors">
        <summary class="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer text-sm sm:text-base font-semibold text-slate-950 select-none">
          <span>${item.question}</span>
          <svg aria-hidden="true" class="faq-chevron w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </summary>
        <div class="px-5 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
          ${item.answer}
        </div>
      </details>`
    ).join('');
  }
}

function initBriefTool(): void {
  const form = document.getElementById('brief-form') as HTMLFormElement | null;
  const serviceChoicesEl = document.getElementById('brief-service-choices');
  const stageSelect = document.getElementById('brief-stage') as HTMLSelectElement | null;
  const scenarioInput = document.getElementById('brief-scenario') as HTMLTextAreaElement | null;
  const resultBox = document.getElementById('brief-result');
  const outputArea = document.getElementById('brief-output') as HTMLTextAreaElement | null;
  const copyStatus = document.getElementById('copy-status');
  const refPanel = document.getElementById('brief-reference');
  const refNameEl = document.getElementById('brief-reference-name');
  const refStatusEl = document.getElementById('reference-status');
  const mailtoLink = document.getElementById('mailto-brief') as HTMLAnchorElement | null;

  if (!form || !serviceChoicesEl || !stageSelect || !scenarioInput || !resultBox || !outputArea) return;

  const params = new URLSearchParams(window.location.search);
  const reqService = params.get('service') as ServiceOptionKey | null;
  const reqProject = params.get('project');

  let reference = reqProject && Object.hasOwn(CONCEPT_REFERENCE_MAP, reqProject) ? CONCEPT_REFERENCE_MAP[reqProject] : null;
  let initialService: ServiceOptionKey =
    reqService && Object.hasOwn(BRIEF_PLACEHOLDERS, reqService)
      ? reqService
      : reference?.service ?? 'undecided';

  if (reference && reference.service !== initialService) {
    reference = null;
  }

  serviceChoicesEl.innerHTML = BRIEF_SERVICE_OPTIONS.map(
    (opt) => `<label class="cursor-pointer">
      <input type="radio" name="service" value="${opt.key}" ${opt.key === initialService ? 'checked' : ''} class="peer sr-only" />
      <span class="inline-flex items-center px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 peer-checked:bg-blue-700 peer-checked:text-white peer-checked:border-blue-700 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 transition-colors">
        ${opt.label}
      </span>
    </label>`
  ).join('');

  stageSelect.innerHTML = BRIEF_STAGE_OPTIONS.map((stage) => `<option value="${stage}">${stage}</option>`).join('');

  const getSelectedService = (): ServiceOptionKey => {
    const checked = form.querySelector<HTMLInputElement>('input[name="service"]:checked');
    const val = checked?.value as ServiceOptionKey | undefined;
    return val && Object.hasOwn(BRIEF_PLACEHOLDERS, val) ? val : 'undecided';
  };

  const syncPlaceholder = () => {
    const svc = getSelectedService();
    scenarioInput.placeholder = BRIEF_PLACEHOLDERS[svc];
  };

  const renderReference = () => {
    if (!refPanel || !refNameEl) return;
    refPanel.hidden = !reference;
    refNameEl.textContent = reference?.name ?? '';
  };

  syncPlaceholder();
  renderReference();

  form.addEventListener('change', (event) => {
    const target = event.target as HTMLElement | null;
    if (target instanceof HTMLInputElement && target.name === 'service') {
      syncPlaceholder();
      if (reference && reference.service !== target.value) {
        reference = null;
        renderReference();
        if (refStatusEl) refStatusEl.textContent = '已按你新选择的方向清除原参考概念。';
      }
    }
  });

  document.getElementById('clear-reference')?.addEventListener('click', () => {
    reference = null;
    renderReference();
    if (refStatusEl) refStatusEl.textContent = '已清除参考概念。';
    form.querySelector<HTMLInputElement>('input[name="service"]:checked')?.focus({ preventScroll: true });
  });

  const updateMailtoHref = (briefText: string, serviceLabel: string) => {
    if (!mailtoLink) return;
    const subject = encodeURIComponent(`需求沟通简报｜${serviceLabel}`);
    const body = encodeURIComponent(briefText);
    mailtoLink.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  let previousFocus: HTMLElement | null = null;
  const serviceLabelMap = Object.fromEntries(BRIEF_SERVICE_OPTIONS.map((item) => [item.key, item.label])) as Record<
    ServiceOptionKey,
    string
  >;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const scenario = scenarioInput.value.trim();
    if (!scenario) {
      scenarioInput.setCustomValidity('请填写目前遇到的主要问题或想改善的步骤。');
      scenarioInput.reportValidity();
      return;
    }

    const data = new FormData(form);
    const svcKey = getSelectedService();
    const svcLabel = serviceLabelMap[svcKey] ?? '尚未确定';
    const optional = (field: string) => String(data.get(field) || '').trim() || '待沟通确认';

    const lines = [
      `需求简报｜${SITE.brandName}`,
      '',
      `服务方向：${svcLabel}`,
      ...(reference && reference.service === svcKey ? [`参考概念：${reference.name}（交互演示参考）`] : []),
      `当前阶段：${String(data.get('stage') || BRIEF_STAGE_OPTIONS[0])}`,
      '',
      '目前遇到的问题：',
      scenario,
      '',
      `目前使用的工具或表格：${optional('tools')}`,
      `期望开始时间：${optional('time')}`,
      '',
      '待一起沟通：本期范围、交付清单与验收方式。'
    ];

    const briefText = lines.join('\n');
    outputArea.value = briefText;
    updateMailtoHref(briefText, svcLabel);

    previousFocus = document.activeElement as HTMLElement | null;
    form.hidden = true;
    resultBox.hidden = false;
    if (copyStatus) {
      copyStatus.textContent = '复制简报后，可直接发至微信（199 3259 9869）或点击发送邮件。';
    }
    outputArea.focus({ preventScroll: true });
  });

  scenarioInput.addEventListener('input', () => scenarioInput.setCustomValidity(''));

  outputArea.addEventListener('input', () => {
    const svcLabel = serviceLabelMap[getSelectedService()] ?? '需求沟通';
    updateMailtoHref(outputArea.value, svcLabel);
  });

  document.getElementById('edit-brief')?.addEventListener('click', () => {
    resultBox.hidden = true;
    form.hidden = false;
    (previousFocus ?? scenarioInput).focus({ preventScroll: true });
  });

  document.getElementById('copy-brief')?.addEventListener('click', async () => {
    const copied = await copyToClipboard(outputArea.value);
    if (copyStatus) {
      copyStatus.textContent = copied
        ? '✓ 需求简报已复制！打开微信添加 199 3259 9869 粘贴发送即可。'
        : '已为您全选文本，请按 Ctrl+C（手机端长按）复制。';
    }
    if (!copied) {
      outputArea.focus();
      outputArea.select();
    }
  });

  document.getElementById('copy-wechat-from-brief')?.addEventListener('click', async () => {
    const copied = await copyToClipboard(SITE.phoneRaw);
    if (copyStatus) {
      copyStatus.textContent = copied
        ? `✓ 微信号 ${SITE.phoneDisplay} 已复制，可直接前往微信添加好友。`
        : `请手动添加微信：${SITE.phoneDisplay}`;
    }
  });

  const contactStatus = document.getElementById('contact-status');
  document.querySelectorAll<HTMLButtonElement>('[data-contact-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.contactCopy ?? '';
      if (!value) return;
      const copied = await copyToClipboard(value);
      if (contactStatus) {
        contactStatus.textContent = copied ? `已复制到剪贴板：${value}` : `请手动复制：${value}`;
      }
    });
  });
}

initShell();
renderStaticSections();
initBriefTool();
