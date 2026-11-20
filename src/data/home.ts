export type HeroSystemMode = 'software' | 'agent' | 'workflow';

export interface HeroModeSpec {
  id: HeroSystemMode;
  tabLabel: string;
  badge: string;
  headline: string;
  summary: string;
  demoHref: string;
  demoLabel: string;
}

export const HERO_MODES: Record<HeroSystemMode, HeroModeSpec> = {
  software: {
    id: 'software',
    tabLabel: '业务软件',
    badge: '序章 · 运营工作台',
    headline: '订单、任务与进度集中在一个面板查看',
    summary: '替代散落在多个表格与群聊里的手工对齐，负责人与交付状态一目了然。',
    demoHref: 'project.html?project=operations',
    demoLabel: '体验工作台演示'
  },
  agent: {
    id: 'agent',
    tabLabel: 'AI Agent',
    badge: '知间 · 知识 Agent',
    headline: '围绕企业确认可用资料检索答案并附带原文出处',
    summary: '限定员工有权查看的知识范围，重要答复与对外决策仍由人工核对确认。',
    demoHref: 'project.html?project=agent',
    demoLabel: '体验知识问答演示'
  },
  workflow: {
    id: 'workflow',
    tabLabel: '工作流自动化',
    badge: '有序 · 审批工作流',
    headline: '按预设规则整理表单、触发审批并自动留存记录',
    summary: '减少重复复制粘贴；遇到信息缺失或异常情况时及时通知对应负责人核查。',
    demoHref: 'project.html?project=workflow',
    demoLabel: '体验流程流转演示'
  }
};

export interface ProblemScenarioCard {
  index: string;
  service: string;
  title: string;
  pain: string;
  solution: string;
  outcome: string;
  href: string;
  cta: string;
}

export const HOME_PROBLEMS: readonly ProblemScenarioCard[] = [
  {
    index: '01',
    service: '企业软件开发',
    title: '订单改了，发货还在看旧表。',
    pain: '订单、交期和进度分散在几份表里，问到哪一步还得逐个找人。',
    solution: '根据现有做事方式搭建业务系统，把订单、更新记录和负责人放到一起。',
    outcome: '发货同事打开订单就能看最新内容；负责人也能看到谁在处理、下一步等什么。',
    href: 'capabilities.html?scenario=software#cap-experience',
    cta: '看看订单怎么管理'
  },
  {
    index: '02',
    service: 'AI Agent 搭建',
    title: '资料都在，问题还是反复问。',
    pain: '制度、产品资料和操作说明散在不同文件里，新同事找不到，熟悉业务的人常常要停下来回答。',
    solution: '把确认可用的资料整理成知识助手，查找常见问题时同时列出来源。',
    outcome: '同事可以先查答案、打开原文核对；资料不足时再找负责人，重要答复仍由人确认。',
    href: 'capabilities.html?scenario=agent#cap-experience',
    cta: '看看知识助手怎么用'
  },
  {
    index: '03',
    service: '工作流自动化',
    title: '一份信息，要填好几遍。',
    pain: '客户提交表单后，还要复制进表格、通知同事，再追着确认有没有处理。',
    solution: '先看现有工具能否连接，再设置收到表单后的记录和提醒步骤。',
    outcome: '新表单进来后，信息自动记到指定位置并提醒负责同事；信息缺失或异常时交由负责人检查。',
    href: 'capabilities.html?scenario=workflow#cap-experience',
    cta: '看看重复步骤怎么处理'
  },
  {
    index: '04',
    service: '网站搭建',
    title: '客户打开官网，却看不清能做什么。',
    pain: '业务介绍分散，手机上阅读不方便，想联系时也找不到入口。',
    solution: '先整理服务内容和客户关心的问题，再设计适合电脑和手机浏览的网站。',
    outcome: '客户进站后能快速了解业务介绍、服务范围与合作方式，也能顺畅找到联系入口。',
    href: 'capabilities.html#web',
    cta: '看看网站怎么做'
  }
];

export interface CooperationStep {
  step: string;
  phase: string;
  title: string;
  description: string;
}

export const COOPERATION_STEPS: readonly CooperationStep[] = [
  {
    step: '01',
    phase: '了解现状',
    title: '先聊怎么做事',
    description: '看看现在用什么工具，哪一步最费事，谁会使用。'
  },
  {
    step: '02',
    phase: '确认方案',
    title: '把要做的说清楚',
    description: '约定功能、范围和验收方式，必要时先用原型确认操作。'
  },
  {
    step: '03',
    phase: '开发验证',
    title: '拿实际场景来试',
    description: '按约定节点查看进展，用业务样本检查正常情况和异常情况。'
  },
  {
    step: '04',
    phase: '验收交接',
    title: '交付后知道怎么用',
    description: '按约定验收，交接使用说明，并明确后续支持范围。'
  }
];
