export type PageId = 'home' | 'work' | 'project' | 'capabilities' | 'about';

export interface NavItem {
  id: Exclude<PageId, 'project'>;
  label: string;
  href: string;
}

export const SITE = {
  brandName: '栗子软件科技',
  brandEn: 'LIZI SOFTWARE',
  legalEntity: '定兴县栗子软件科技店',
  tagline: '企业软件开发 · AI Agent 搭建 · 工作流自动化 · 官网建设',
  description:
    '栗子软件科技（定兴县栗子软件科技店）专注企业软件开发、AI Agent 搭建、工作流自动化与企业官网建设，让企业日常流程更清晰高效。',
  phoneDisplay: '199 3259 9869',
  phoneRaw: '19932599869',
  email: 'dingxinglizi@outlook.com',
  nav: [
    { id: 'home', label: '首页', href: 'index.html' },
    { id: 'capabilities', label: '核心服务', href: 'capabilities.html' },
    { id: 'work', label: '解决方案', href: 'work.html' },
    { id: 'about', label: '关于我们', href: 'about.html' }
  ] satisfies readonly NavItem[]
} as const;

export const COPY_YEAR = 2026;
