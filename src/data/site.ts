export type PageId = 'home' | 'work' | 'project' | 'capabilities' | 'about';

export interface NavItem {
  id: Exclude<PageId, 'project'>;
  label: string;
  href: string;
  code: string;
}

export const SITE = {
  brandName: '栗子软件科技',
  brandMark: 'LIZI.',
  legalEntity: '定兴县栗子软件科技店',
  tagline: '企业软件开发 · AI Agent 搭建 · 工作流自动化 · 网站搭建',
  description:
    '栗子软件科技（定兴县栗子软件科技店）专注企业软件开发、AI Agent 搭建、工作流自动化与企业网站搭建，把分散的业务流程变成顺手好用的软件与 AI 工具。',
  phoneDisplay: '199 3259 9869',
  phoneRaw: '19932599869',
  email: 'dingxinglizi@outlook.com',
  nav: [
    { id: 'home', label: '首页', href: 'index.html', code: '01' },
    { id: 'work', label: '方案演示', href: 'work.html', code: '02' },
    { id: 'capabilities', label: '服务与交付', href: 'capabilities.html', code: '03' },
    { id: 'about', label: '关于与联系', href: 'about.html', code: '04' }
  ] satisfies readonly NavItem[]
} as const;

export const COPY_YEAR = 2026;
