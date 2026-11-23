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

  toast.innerHTML = `<div class="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/92 text-white text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md border border-slate-700/80">
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
    if (cls.includes('bg-blue-600') || cls.includes('bg-slate-900') || cls.includes('bg-emerald-600')) {
      el.classList.add('btn-fx-primary');
    } else if (cls.includes('border')) {
      el.classList.add('btn-fx-secondary');
    }

    // 桌面精细指针下的轻磁吸跟随效果（排除绝对定位悬浮按钮）
    if (window.matchMedia('(pointer: fine)').matches && !cls.includes('absolute') && !cls.includes('fixed')) {
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 360) return; // 超宽通栏按钮不做位移
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate3d(${(dx * 0.14).toFixed(2)}px, ${(dy * 0.2).toFixed(2)}px, 0)`;
      });

      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    }
  });
}

/**
 * 全局点击水波纹事件委托（支持静态与动态渲染的所有按钮和卡片链接）
 */
function initGlobalClickRipple(): void {
  document.addEventListener('pointerdown', (event) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('button, a.btn-fx');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.15;
    const ripple = document.createElement('span');
    const isLightBg =
      target.className.includes('bg-white') ||
      target.className.includes('bg-slate-100') ||
      target.className.includes('bg-slate-50');

    ripple.className = `click-ripple ${isLightBg ? 'click-ripple-dark' : ''}`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    target.classList.add('btn-fx');
    target.appendChild(ripple);
    window.setTimeout(() => {
      ripple.remove();
    }, 580);
  });
}

/**
 * 为卡片与视觉图框注入鼠标跟随聚光灯与 3D 悬浮微倾斜
 */
export function enhanceCardsAndTilt(root: ParentNode = document): void {
  const cards = root.querySelectorAll<HTMLElement>(
    'article, #home-services-grid > div, #guarantees-grid > div, #about-principles-grid > div, #approach-steps > div, #home-process-list > li'
  );

  cards.forEach((card) => {
    if (card.dataset.spotlightReady === 'true') return;
    card.dataset.spotlightReady = 'true';
    card.classList.add('spotlight-card', 'rounded-2xl');
    if (!card.className.includes('p-')) {
      card.classList.add('p-5', '-m-5');
    }

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${(event.clientX - rect.left).toFixed(1)}px`);
      card.style.setProperty('--my', `${(event.clientY - rect.top).toFixed(1)}px`);
    });
  });

  if (window.matchMedia('(pointer: fine)').matches) {
    const tiltTargets = root.querySelectorAll<HTMLElement>(
      '#work-cards-grid > article, #services-zig-zag img, #home-scenario-panel img'
    );

    tiltTargets.forEach((target) => {
      const frame = target.tagName === 'IMG' ? target.parentElement ?? target : target;
      if (frame.dataset.tiltReady === 'true') return;
      frame.dataset.tiltReady = 'true';
      frame.classList.add('tilt-card');

      frame.addEventListener('pointermove', (event) => {
        const rect = frame.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        frame.style.transform = `perspective(1000px) rotateX(${(-ny * 5).toFixed(2)}deg) rotateY(${(nx * 6).toFixed(2)}deg) translateY(-3px)`;
      });

      frame.addEventListener('pointerleave', () => {
        frame.style.transform = '';
      });
    });
  }
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
 * 拦截站内跨页链接点击，呈现平滑的顶部激光进度条 + 磨砂过渡加载动效
 */
function initPageTransitions(): void {
  let loader = document.getElementById('page-transition-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'page-transition-loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML = `<div class="loader-pill">
      <span class="loader-spinner"></span>
      <span id="loader-pill-text">正在切换页面…</span>
    </div>`;
    document.body.appendChild(loader);
  }

  // 处理浏览器后退/前进缓存恢复
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('is-page-leaving');
    loader?.classList.remove('is-active');
  });

  const pageNames: Record<string, string> = {
    'index.html': '首页',
    'capabilities.html': '核心服务',
    'work.html': '解决方案',
    'project.html': '在线原型体验',
    'about.html': '关于我们与联系'
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

    // 如果仅是当前页面的锚点跳转，交给浏览器平滑滚动
    if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && targetUrl.hash) {
      return;
    }

    // 如果点击的是当前完全相同的 URL，不重复跳转
    if (targetUrl.href === window.location.href) return;

    event.preventDefault();

    const fileName = targetUrl.pathname.split('/').pop() || 'index.html';
    const label = pageNames[fileName] || '目标页面';
    const pillText = document.getElementById('loader-pill-text');
    if (pillText) {
      pillText.textContent = `正在前往 · ${label}`;
    }

    const progressBar = document.getElementById('page-progress');
    if (progressBar) {
      progressBar.style.transform = 'scaleX(0.82)';
    }

    document.body.classList.add('is-page-leaving');
    loader?.classList.add('is-active');

    window.setTimeout(() => {
      window.location.href = targetUrl.href;
    }, 180);
  });
}

/**
 * 初始化全站共享交互：移动导航抽屉、阅读进度条、回到顶部、全站复制按钮、右下角快捷联系浮窗及全局动效
 */
export function initShell(): void {
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

  // 全站通用复制按钮（页脚微信号/邮箱、首页联系区、快捷浮窗等）
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

  // 启动全局水波纹、页面切换过渡，并在首帧及内容渲染后自动增强所有按钮与卡片
  initGlobalClickRipple();
  initPageTransitions();
  window.requestAnimationFrame(() => {
    enhanceInteractiveButtons();
    enhanceCardsAndTilt();
    initScrollReveals();
  });
}
