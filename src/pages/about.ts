import '../styles/main.css';
import { copyToClipboard, initShell } from '../components/shell';
import { ABOUT_PRINCIPLES, CONSULT_SERVICE_OPTIONS, type ConsultServiceKey } from '../data/about';
import { SITE } from '../data/site';

function renderPrinciples(): void {
  const grid = document.getElementById('about-principles-grid');
  if (!grid) return;

  grid.innerHTML = ABOUT_PRINCIPLES.map(
    (item, idx) => `<div>
      <span class="text-sm font-bold text-blue-600">0${idx + 1}</span>
      <h3 class="mt-2.5 text-lg font-bold text-slate-950">${item.title}</h3>
      <p class="mt-2 text-sm text-slate-600 leading-relaxed">${item.description}</p>
    </div>`
  ).join('');
}

function initConsultSection(): void {
  const form = document.getElementById('consult-form') as HTMLFormElement | null;
  const nameInput = document.getElementById('consult-name') as HTMLInputElement | null;
  const serviceSelect = document.getElementById('consult-service') as HTMLSelectElement | null;
  const messageInput = document.getElementById('consult-message') as HTMLTextAreaElement | null;
  const copyWechatBtn = document.getElementById('copy-consult-wechat') as HTMLButtonElement | null;
  const statusEl = document.getElementById('consult-status');
  const contactCopyStatus = document.getElementById('contact-copy-status');

  if (!form || !nameInput || !serviceSelect || !messageInput) return;

  serviceSelect.innerHTML = CONSULT_SERVICE_OPTIONS.map(
    (opt) => `<option value="${opt.key}">${opt.label}</option>`
  ).join('');

  const reqService = new URLSearchParams(window.location.search).get('service') as ConsultServiceKey | null;
  const matchedOption = CONSULT_SERVICE_OPTIONS.find((opt) => opt.key === reqService);
  if (matchedOption) {
    serviceSelect.value = matchedOption.key;
  }

  const labelByKey = Object.fromEntries(
    CONSULT_SERVICE_OPTIONS.map((opt) => [opt.key, opt.label])
  ) as Record<ConsultServiceKey, string>;

  const buildConsultSummary = (): string | null => {
    const message = messageInput.value.trim();
    if (!message) {
      messageInput.setCustomValidity('请简单填写您想解决的问题或需求。');
      messageInput.reportValidity();
      return null;
    }

    const name = nameInput.value.trim() || '未填写';
    const serviceKey = (serviceSelect.value as ConsultServiceKey) || 'undecided';
    const serviceLabel = labelByKey[serviceKey] ?? '尚未确定，先沟通需求';

    return [
      `咨询对象：${SITE.brandName}`,
      `称呼 / 公司：${name}`,
      `咨询方向：${serviceLabel}`,
      '',
      '需求描述：',
      message
    ].join('\n');
  };

  messageInput.addEventListener('input', () => messageInput.setCustomValidity(''));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const summary = buildConsultSummary();
    if (!summary) return;

    const serviceKey = (serviceSelect.value as ConsultServiceKey) || 'undecided';
    const serviceLabel = labelByKey[serviceKey] ?? '业务咨询';
    const subject = encodeURIComponent(`官网需求咨询｜${serviceLabel}`);
    const body = encodeURIComponent(summary);

    if (statusEl) {
      statusEl.className = 'text-xs text-emerald-700 font-medium min-h-[1rem]';
      statusEl.textContent = `正在打开邮件客户端发送至 ${SITE.email}…如未自动弹出，可点击「复制内容发微信」。`;
    }
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  });

  copyWechatBtn?.addEventListener('click', async () => {
    const summary = buildConsultSummary();
    if (!summary) return;

    const copied = await copyToClipboard(summary);
    if (statusEl) {
      statusEl.className = 'text-xs text-emerald-700 font-medium min-h-[1rem]';
      statusEl.textContent = copied
        ? `✓ 咨询内容已复制！请添加微信 ${SITE.phoneDisplay} 直接粘贴发送。`
        : `请手动复制上方需求说明，并添加微信 ${SITE.phoneDisplay}。`;
    }
  });

  document.querySelectorAll<HTMLButtonElement>('[data-contact-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.contactCopy ?? '';
      if (!value) return;
      const copied = await copyToClipboard(value);
      if (contactCopyStatus) {
        contactCopyStatus.textContent = copied ? `已复制到剪贴板：${value}` : `请手动复制：${value}`;
      }
    });
  });
}

initShell();
renderPrinciples();
initConsultSection();
