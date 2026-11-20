export interface AboutPrinciple {
  title: string;
  description: string;
}

export const ABOUT_PRINCIPLES: readonly AboutPrinciple[] = [
  {
    title: '从真实日常工作出发',
    description: '不必先写长篇需求文档，带着一份平时在用的表格或讲述一次具体操作，就能梳理出清晰方案。'
  },
  {
    title: '功能范围与边界透明',
    description: '开工前书面约定本期目标、交付物及需要配合的现有工具权限，避免中途堆砌冗余功能。'
  },
  {
    title: '重视落地使用与交接',
    description: '兼顾不同岗位的权限隔离与异常兜底，交付时提供清晰操作指引与约定范围内的后续支持。'
  }
];

export type ConsultServiceKey = 'software' | 'agent' | 'automation' | 'web' | 'undecided';

export const CONSULT_SERVICE_OPTIONS: readonly { key: ConsultServiceKey; label: string }[] = [
  { key: 'software', label: '企业软件开发' },
  { key: 'agent', label: 'AI Agent 搭建' },
  { key: 'automation', label: '工作流自动化' },
  { key: 'web', label: '企业官网建设' },
  { key: 'undecided', label: '尚未确定，先沟通需求' }
];
