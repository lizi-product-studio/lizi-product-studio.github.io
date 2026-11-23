import { initParticleStage, setParticleForm } from './particleStage';

export { setParticleForm };

/**
 * 复制文本到剪贴板，优先使用 Clipboard API，并在非安全上下文回退到 execCommand
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
  document.body.appendChild(textarea);

  const previouslyFocused = document.activeElement as HTMLElement | null;
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }

  textarea.remove();
  previouslyFocused?.focus({ preventScroll: true });
  return copied;
}

let toastTimer: number | undefined;

/**
 * 弹出全局顶部毛玻璃悬浮通知胶囊
 */
export function showToast(message: string): void {
  let toast = document.getElementById('lizi-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'lizi-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<div class="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#090E1E]/95 text-white text-xs sm:text-sm font-semibold shadow-[0_0_30px_rgba(56,189,248,0.45)] backdrop-blur-xl border border-sky-400/40">
    <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold">✓</span>
    <span>${message}</span>
  </div>`;

  toast.classList.add('is-visible');
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast?.classList.remove('is-visible');
  }, 2600);
}

/**
 * Lusion 风格赛博文字逐字解码特效 (Kinetic Text Scramble)
 */
const SCRAMBLE_GLYPHS = '01<>/_+#*LIZI∆◊';

export function scrambleText(el: HTMLElement | null, targetText: string, durationMs = 340): void {
  if (!el) return;
  const start = performance.now();
  const chars = [...targetText];

  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / durationMs);
    const resolvedCount = Math.floor(progress * chars.length);
    let out = '';

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (i < resolvedCount || ch === ' ' || ch === '·' || ch === '/') {
        out += ch;
      } else {
        out += SCRAMBLE_GLYPHS[(i + Math.floor(now / 28)) % SCRAMBLE_GLYPHS.length];
      }
    }

    el.textContent = out;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.textContent = targetText;
    }
  };

  window.requestAnimationFrame(step);
}

/**
 * Lusion 风格自定义双环磁性流体光标
 */
function initCustomMagneticCursor(): void {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (document.getElementById('lizi-cursor-dot')) return;

  const dot = document.createElement('div');
  dot.id = 'lizi-cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  const ring = document.createElement('div');
  ring.id = 'lizi-cursor-ring';
  ring.setAttribute('aria-hidden', 'true');

  document.body.append(dot, ring);

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener(
    'pointermove',
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX - 3.5}px, ${mouseY - 3.5}px, 0)`;

      const interactive = (event.target as HTMLElement | null)?.closest('a, button, select, input, textarea, [data-carousel-tab]');
      ring.classList.toggle('is-hovering', Boolean(interactive));
    },
    { passive: true }
  );

  const animateCursor = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    const sizeOffset = ring.classList.contains('is-hovering') ? 27 : 17;
    ring.style.transform = `translate3d(${(ringX - sizeOffset).toFixed(1)}px, ${(ringY - sizeOffset).toFixed(1)}px, 0)`;
    window.requestAnimationFrame(animateCursor);
  };
  window.requestAnimationFrame(animateCursor);
}

/**
 * 为全站按钮与 CTA 注入流光、磁吸悬浮与点击坐标水波纹
 */
export function enhanceInteractiveButtons(root: ParentNode = document): void {
  const candidates = root.querySelectorAll<HTMLElement>(
    'a[class*="rounded-lg"], a[class*="rounded-xl"], a[class*="rounded-full"], button[class*="rounded-lg"], button[class*="rounded-xl"], button[class*="rounded-full"]'
  );

  candidates.forEach((el) => {
    if (el.dataset.fxReady === 'true') return;
    el.dataset.fxReady = 'true';
    el.classList.add('btn-fx');

    const cls = el.className;
    if (cls.includes('bg-blue-600') || cls.includes('from-blue-600')) {
      el.classList.add('btn-fx-primary');
    } else if (cls.includes('border')) {
      el.classList.add('btn-fx-secondary');
    }

    if (window.matchMedia('(pointer: fine)').matches && !cls.includes('absolute') && !cls.includes('fixed')) {
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 360) return;
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate3d(${(dx * 0.16).toFixed(2)}px, ${(dy * 0.22).toFixed(2)}px, 0)`;
      });

      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    }
  });
}

/**
 * 全局点击水波纹事件委托
 */
function initGlobalClickRipple(): void {
  document.addEventListener('pointerdown', (event) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('button, a.btn-fx');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.25;
    const ripple = document.createElement('span');

    ripple.className = 'click-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    target.classList.add('btn-fx');
    target.appendChild(ripple);
    window.setTimeout(() => {
      ripple.remove();
    }, 620);
  });
}

/**
 * 为全站卡片与视觉图框注入全息棱镜折射聚光灯与 3D 悬浮倾斜
 */
export function enhanceCardsAndTilt(root: ParentNode = document): void {
  const cards = root.querySelectorAll<HTMLElement>(
    'article, #home-services-grid > div, #guarantees-grid > div, #about-principles-grid > div, #approach-steps > div, #home-process-list > li, .holo-surface'
  );

  cards.forEach((card) => {
    if (card.dataset.spotlightReady === 'true') return;
    card.dataset.spotlightReady = 'true';
    card.classList.add('holo-card', 'rounded-2xl');
    if (!card.className.includes('p-')) {
      card.classList.add('p-6');
    }

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty('--mx', `${x.toFixed(1)}px`);
      card.style.setProperty('--my', `${y.toFixed(1)}px`);

      if (window.matchMedia('(pointer: fine)').matches && rect.width < 680) {
        const nx = x / rect.width - 0.5;
        const ny = y / rect.height - 0.5;
        card.style.transform = `perspective(1100px) rotateX(${(-ny * 6).toFixed(2)}deg) rotateY(${(nx * 7).toFixed(2)}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * 为页面区块注入滚动渐进揭示动画
 */
export function initScrollReveals(): void {
  const targets = document.querySelectorAll<HTMLElement>(
    '#home-services-grid > div, #home-process-list > li, #services-zig-zag > section .grid > div, #guarantees-grid > div, #work-cards-grid > article, #about-principles-grid > div, #approach-steps > div'
  );

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.02, rootMargin: '0px 0px 80px 0px' }
  );

  targets.forEach((el, index) => {
    if (el.dataset.revealReady === 'true') return;
    el.dataset.revealReady = 'true';
    const staggerMs = (index % 4) * 65;
    el.style.setProperty('--reveal-delay', `${staggerMs}ms`);
    el.classList.add('reveal-item');

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 80 && rect.bottom > 0) {
      el.classList.add('is-revealed');
    } else {
      observer.observe(el);
    }
  });
}

/**
 * 拦截站内跨页链接点击，呈现电影级时空门转场与激光进度条
 */
function initPageTransitions(): void {
  let loader = document.getElementById('page-transition-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'page-transition-loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML = `<div class="loader-pill">
      <span class="loader-spinner"></span>
      <span id="loader-pill-text">LIZI // 正在切换空间…</span>
    </div>`;
    document.body.appendChild(loader);
  }

  window.addEventListener('pageshow', () => {
    document.body.classList.remove('is-page-leaving');
    loader?.classList.remove('is-active');
  });

  const pageNames: Record<string, string> = {
    'index.html': '首页 · 三维粒子舞台',
    'capabilities.html': '核心服务 · 数字化体系',
    'work.html': '解决方案 · 架构展厅',
    'project.html': '交互原型实验室',
    'about.html': '关于我们与需求咨询'
  };

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!anchor) return;

    const rawHref = anchor.getAttribute('href') ?? '';
    if (
      !rawHref ||
      rawHref.startsWith('#') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:') ||
      rawHref.startsWith('javascript:') ||
      anchor.target === '_blank' ||
      anchor.hasAttribute('download')
    ) {
      return;
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }

    if (targetUrl.origin !== window.location.origin) return;
    if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && targetUrl.hash) {
      return;
    }
    if (targetUrl.href === window.location.href) return;

    event.preventDefault();

    const fileName = targetUrl.pathname.split('/').pop() || 'index.html';
    const label = pageNames[fileName] || '目标模块';
    const pillText = document.getElementById('loader-pill-text');
    if (pillText) {
      pillText.textContent = `LIZI // 正在载入 · ${label}`;
    }

    const progressBar = document.getElementById('page-progress');
    if (progressBar) {
      progressBar.style.transform = 'scaleX(0.86)';
    }

    document.body.classList.add('is-page-leaving');
    loader?.classList.add('is-active');

    window.setTimeout(() => {
      window.location.href = targetUrl.href;
    }, 185);
  });
}

/**
 * 全局 Ctrl+K / ⌘K 极客指令舱
 */
function initCommandPalette(): void {
  const trigger = document.getElementById('cmd-palette-trigger');
  const modal = document.getElementById('cmd-palette-modal');
  const closeBtn = document.getElementById('cmd-palette-close');
  if (!modal) return;

  const setOpen = (open: boolean) => {
    modal.hidden = !open;
    modal.classList.toggle('hidden', !open);
  };

  trigger?.addEventListener('click', () => setOpen(modal.hidden));
  closeBtn?.addEventListener('click', () => setOpen(false));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      setOpen(modal.hidden);
    } else if (event.key === 'Escape' && !modal.hidden) {
      setOpen(false);
    }
  });
}

/**
 * 初始化全站共享交互：3D 粒子舞台、磁性双环光标、指令舱、抽屉导航、阅读进度条、快捷联系浮窗及全息卡片
 */
export function initShell(initialParticleForm = 0): void {
  initParticleStage(initialParticleForm);
  initCustomMagneticCursor();
  initCommandPalette();

  const menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement | null;
  const mobileNav = document.getElementById('mobile-nav');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  const setMenuOpen = (open: boolean) => {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    mobileNav.classList.toggle('hidden', !open);
    mobileNav.inert = !open;
    document.body.classList.toggle('overflow-hidden', open);
    iconOpen?.classList.toggle('hidden', open);
    iconClose?.classList.toggle('hidden', !open);
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });

  mobileNav?.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('a')) {
      setMenuOpen(false);
    }
  });

  const desktopQuery = window.matchMedia('(min-width: 768px)');
  desktopQuery.addEventListener?.('change', (event) => {
    if (event.matches) setMenuOpen(false);
  });

  // 右下角快捷联系浮窗
  const quickWidget = document.getElementById('quick-contact-widget');
  const quickToggle = document.getElementById('quick-contact-toggle') as HTMLButtonElement | null;
  const quickPanel = document.getElementById('quick-contact-panel');
  const quickClose = document.getElementById('quick-contact-close');
  const quickFormLink = document.getElementById('quick-contact-form-link');

  const setQuickOpen = (open: boolean) => {
    if (!quickToggle || !quickPanel) return;
    quickToggle.setAttribute('aria-expanded', String(open));
    quickPanel.hidden = !open;
    quickPanel.classList.toggle('hidden', !open);
  };

  quickToggle?.addEventListener('click', () => {
    const isOpen = quickToggle.getAttribute('aria-expanded') === 'true';
    setQuickOpen(!isOpen);
  });

  quickClose?.addEventListener('click', () => {
    setQuickOpen(false);
    quickToggle?.focus({ preventScroll: true });
  });

  quickFormLink?.addEventListener('click', () => {
    setQuickOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!quickWidget || !quickToggle || quickToggle.getAttribute('aria-expanded') !== 'true') return;
    const target = event.target as Node | null;
    if (target && !quickWidget.contains(target)) {
      setQuickOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (menuToggle?.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        menuToggle.focus();
      }
      if (quickToggle?.getAttribute('aria-expanded') === 'true') {
        setQuickOpen(false);
        quickToggle.focus({ preventScroll: true });
      }
    }
  });

  // 顶部细阅读进度条
  const progressBar = document.getElementById('page-progress');
  let rafPending = false;
  const updateProgress = () => {
    if (progressBar && !document.body.classList.contains('is-page-leaving')) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      progressBar.style.transform = `scaleX(${ratio})`;
    }
    rafPending = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateProgress);
      }
    },
    { passive: true }
  );
  updateProgress();

  // 回到顶部
  document.querySelectorAll<HTMLButtonElement>('[data-back-top]').forEach((button) => {
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // 全站通用复制按钮
  const footerStatus = document.getElementById('footer-copy-status');
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy ?? '';
      if (!value) return;
      const defaultLabel = button.dataset.copyLabel || button.textContent || '复制';
      const copied = await copyToClipboard(value);

      if (copied) {
        button.textContent = '已复制 ✓';
        showToast(`已复制到剪贴板：${value}`);
        if (footerStatus) {
          footerStatus.textContent = `已复制到剪贴板：${value}`;
        }
        window.setTimeout(() => {
          button.textContent = defaultLabel;
        }, 2400);
      } else if (footerStatus) {
        footerStatus.textContent = `请手动复制：${value}`;
      }
    });
  });

  initGlobalClickRipple();
  initPageTransitions();
  window.requestAnimationFrame(() => {
    enhanceInteractiveButtons();
    enhanceCardsAndTilt();
    initScrollReveals();
  });
}
