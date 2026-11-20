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

/**
 * 初始化全站共享交互：移动导航抽屉、阅读进度条、回到顶部、全站复制按钮
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

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  const desktopQuery = window.matchMedia('(min-width: 768px)');
  desktopQuery.addEventListener?.('change', (event) => {
    if (event.matches) setMenuOpen(false);
  });

  // 顶部细阅读进度条
  const progressBar = document.getElementById('page-progress');
  let rafPending = false;
  const updateProgress = () => {
    if (progressBar) {
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
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll<HTMLButtonElement>('[data-back-top]').forEach((button) => {
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  // 全站通用复制按钮（页脚微信号/邮箱、首页联系区等）
  const footerStatus = document.getElementById('footer-copy-status');
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy ?? '';
      if (!value) return;
      const defaultLabel = button.dataset.copyLabel || button.textContent || '复制';
      const copied = await copyToClipboard(value);

      if (copied) {
        button.textContent = '已复制 ✓';
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
}
