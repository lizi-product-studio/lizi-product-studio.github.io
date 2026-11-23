import '../styles/main.css';
import { copyToClipboard, initShell, showToast } from '../components/shell';
import { ABOUT_PRINCIPLES, CONSULT_SERVICE_OPTIONS, type ConsultServiceKey } from '../data/about';
import { SITE } from '../data/site';

function renderPrinciples(): void {
  const grid = document.getElementById('about-principles-grid');
  if (!grid) return;

  grid.innerHTML = ABOUT_PRINCIPLES.map(
    (item, idx) => `<div class="holo-card holo-surface rounded-2xl p-6">
      <span class="text-xs font-mono font-bold text-sky-400">PRINCIPLE 0${idx + 1}</span>
      <h3 class="mt-2.5 text-lg font-bold text-white">${item.title}</h3>
      <p class="mt-2 text-sm text-slate-400 leading-relaxed">${item.description}</p>
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

  // 确认弹窗相关元素
  const modal = document.getElementById('consult-modal');
  const modalCloseBtn = document.getElementById('consult-modal-close') as HTMLButtonElement | null;
  const modalPreview = document.getElementById('consult-modal-preview') as HTMLTextAreaElement | null;
  const modalCopySummaryBtn = document.getElementById('modal-copy-summary') as HTMLButtonElement | null;
  const modalCopyWechatBtn = document.getElementById('modal-copy-wechat-id') as HTMLButtonElement | null;
  const modalMailtoLink = document.getElementById('modal-mailto-link') as HTMLAnchorElement | null;
  const modalFeedback = document.getElementById('modal-copy-feedback');

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

  const buildConsultSummary = (): { summary: string; serviceLabel: string } | null => {
    const message = messageInput.value.trim();
    if (!message) {
      messageInput.setCustomValidity('请简单填写您想解决的问题或需求。');
      messageInput.reportValidity();
      return null;
    }

    const name = nameInput.value.trim() || '未填写';
    const serviceKey = (serviceSelect.value as ConsultServiceKey) || 'undecided';
    const serviceLabel = labelByKey[serviceKey] ?? '尚未确定，先沟通需求';

    const summary = [
      `咨询对象：${SITE.brandName}`,
      `称呼 / 公司：${name}`,
      `咨询方向：${serviceLabel}`,
      '',
      '需求描述：',
      message
    ].join('\n');

    return { summary, serviceLabel };
  };

  const syncModalMailto = (summaryText: string, serviceLabel: string) => {
    if (!modalMailtoLink) return;
    const subject = encodeURIComponent(`官网需求咨询｜${serviceLabel}`);
    const body = encodeURIComponent(summaryText);
    modalMailtoLink.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  let lastTriggerEl: HTMLElement | null = null;

  const openConfirmModal = async () => {
    const result = buildConsultSummary();
    if (!result) return;

    lastTriggerEl = document.activeElement as HTMLElement | null;

    if (modal && modalPreview) {
      modalPreview.value = result.summary;
      syncModalMailto(result.summary, result.serviceLabel);
      modal.hidden = false;
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      modalCopySummaryBtn?.focus({ preventScroll: true });
    }

    const copied = await copyToClipboard(result.summary);

    if (modal && modalPreview) {
      if (modalFeedback) {
        modalFeedback.textContent = copied
          ? `✓ 咨询单已自动复制到剪贴板，可前往微信添加 ${SITE.phoneDisplay} 直接粘贴。`
          : `您可以点击上方「复制咨询单内容」或通过邮件发送。`;
      }
    } else if (statusEl) {
      statusEl.className = 'text-xs text-emerald-400 font-medium min-h-[1rem]';
      statusEl.textContent = copied
        ? `✓ 咨询内容已复制！请添加微信 ${SITE.phoneDisplay} 直接粘贴发送。`
        : `请手动复制需求说明，并添加微信 ${SITE.phoneDisplay}。`;
    }
  };

  const closeConfirmModal = () => {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    lastTriggerEl?.focus({ preventScroll: true });
  };

  messageInput.addEventListener('input', () => messageInput.setCustomValidity(''));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await openConfirmModal();
  });

  copyWechatBtn?.addEventListener('click', async () => {
    await openConfirmModal();
  });

  modalPreview?.addEventListener('input', () => {
    const serviceKey = (serviceSelect.value as ConsultServiceKey) || 'undecided';
    const serviceLabel = labelByKey[serviceKey] ?? '业务咨询';
    syncModalMailto(modalPreview.value, serviceLabel);
  });

  modalCopySummaryBtn?.addEventListener('click', async () => {
    if (!modalPreview) return;
    const copied = await copyToClipboard(modalPreview.value);
    if (modalFeedback) {
      modalFeedback.textContent = copied
        ? `✓ 已复制最新咨询单内容！请前往微信（${SITE.phoneDisplay}）粘贴发送。`
        : '请全选上方文本框按 Ctrl+C 复制。';
    }
  });

  modalCopyWechatBtn?.addEventListener('click', async () => {
    const copied = await copyToClipboard(SITE.phoneRaw);
    if (modalFeedback) {
      modalFeedback.textContent = copied
        ? `✓ 微信号 ${SITE.phoneDisplay} 已复制，可直接前往微信搜索添加。`
        : `请手动添加微信号：${SITE.phoneDisplay}`;
    }
  });

  modalCloseBtn?.addEventListener('click', closeConfirmModal);

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeConfirmModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) {
      closeConfirmModal();
    }
  });

  document.querySelectorAll<HTMLButtonElement>('[data-contact-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.contactCopy ?? '';
      if (!value) return;
      const copied = await copyToClipboard(value);
      if (copied) {
        showToast(`已复制到剪贴板：${value}`);
      }
      if (contactCopyStatus) {
        contactCopyStatus.textContent = copied ? `已复制到剪贴板：${value}` : `请手动复制：${value}`;
      }
    });
  });
}

renderPrinciples();
initShell(3);
initConsultSection();
