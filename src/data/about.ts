export interface PrincipleItem {
  index: string;
  title: string;
  description: string;
}

export interface ProcessStageItem {
  index: string;
  title: string;
  description: string;
  output: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const ABOUT_PRINCIPLES: readonly PrincipleItem[] = [
  {
    index: '01',
    title: '了解现在怎么做',
    description: '先看看谁在做、用了哪些工具，带着一份日常表格或一个实际例子来聊，会更容易说清楚。'
  },
  {
    index: '02',
    title: '约定这次做什么',
    description: '一起确认功能范围、交付物和验收方式；做的过程中如果业务有调整，再共同评估影响。'
  },
  {
    index: '03',
    title: '想好怎么使用和交接',
    description: '考虑不同岗位的查看和操作权限，遇到异常谁来处理；交付时按约定提供使用说明。'
  }
];

export const ABOUT_PROCESS_STAGES: readonly ProcessStageItem[] = [
  {
    index: '01',
    title: '聊聊现状',
    description: '说说现在怎么做、哪里最费事或容易出错，以及希望谁来使用。',
    output: '形成 · 问题与需求范围'
  },
  {
    index: '02',
    title: '确定方案',
    description: '说明准备怎么做，必要时先做原型界面确认操作，并约定范围和验收方式。',
    output: '形成 · 方案与交付约定'
  },
  {
    index: '03',
    title: '开发与试用',
    description: '按约定节点查看进展，用真实业务样本试一试正常和异常情况。',
    output: '形成 · 功能与验证记录'
  },
  {
    index: '04',
    title: '验收与交接',
    description: '按约定核对交付结果，交接操作说明，并明确后续维护支持方式。',
    output: '形成 · 验收与交接记录'
  }
];

export const ABOUT_FAQS: readonly FaqItem[] = [
  {
    question: '一定要重新开发一套完整系统吗？',
    answer: '不一定。我们先看看现在怎么做、问题卡在哪一段，再判断是调整现有流程、补一个小工具，还是有必要开发新系统。'
  },
  {
    question: '原来的表格和日常软件还能继续用吗？',
    answer: '可以先梳理哪些需要保留。能否与新功能打通连接，要看现有工具提供的接口能力、权限和实际需要，确认后再定方案。'
  },
  {
    question: 'AI 现阶段适合先用在公司哪件事上？',
    answer: '建议从查找产品资料、整理会议纪要或起草常见客服回复开始，挑一件资料较全、有人能够核对结果的事先行试用。重要内容仍由人确认。'
  },
  {
    question: '还没想清楚具体要做什么，也能沟通吗？',
    answer: '完全可以。带一份平时在用的表格，或者讲一次具体的操作过程和遇到的卡点，就能作为沟通的起点。'
  }
];

export type ServiceOptionKey = 'software' | 'agent' | 'workflow' | 'web' | 'undecided';

export const BRIEF_SERVICE_OPTIONS: readonly { key: ServiceOptionKey; label: string }[] = [
  { key: 'software', label: '企业软件开发' },
  { key: 'agent', label: 'AI Agent 搭建' },
  { key: 'workflow', label: '工作流自动化' },
  { key: 'web', label: '网站搭建' },
  { key: 'undecided', label: '尚未确定，先聊聊' }
];

export const BRIEF_PLACEHOLDERS: Record<ServiceOptionKey, string> = {
  software: '例如：订单修改过后，发货同事还在看旧表格，希望所有人都能在一个地方看到最新进度和负责人。',
  agent: '例如：产品与制度资料分散在不同文件里，同事经常反复问相同问题，想做一个可核对来源的知识助手。',
  workflow: '例如：客户提交表单后还要人工复制到表格并去群里提醒同事，希望减少这类重复手工操作。',
  web: '例如：现在官网内容分散，手机上看不清楚业务和案例，希望重做一套更清晰、容易找到联系入口的官网。',
  undecided: '例如：目前每天是怎么完成这项工作的？哪一个环节最耗时间或最容易出错？'
};

export const BRIEF_STAGE_OPTIONS: readonly string[] = [
  '初步想法，希望先梳理',
  '已有明确需求，准备推进',
  '已有系统或表格，希望优化整合'
];

export const CONCEPT_REFERENCE_MAP: Record<string, { service: ServiceOptionKey; name: string }> = {
  operations: { service: 'software', name: '序章 · 运营工作台' },
  agent: { service: 'agent', name: '知间 · 知识 Agent' },
  workflow: { service: 'workflow', name: '有序 · 审批工作流' }
};
