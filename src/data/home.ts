export interface HeroCarouselSlide {
  id: 'software' | 'agent' | 'automation' | 'web';
  badge: string;
  shortTab: string;
  title: string;
  summary: string;
  highlightTag: string;
  href: string;
  ctaLabel: string;
}

export const HERO_CAROUSEL_SLIDES: readonly HeroCarouselSlide[] = [
  {
    id: 'software',
    badge: '01 · 企业软件开发',
    shortTab: '企业软件',
    title: '定制业务与订单协同系统',
    summary: '把散落在多份表格与群聊里的订单进度、交期变更和责任人统一到一个工作台。',
    highlightTag: '实时同步订单状态与操作留痕',
    href: 'capabilities.html#software',
    ctaLabel: '查看软件定制服务'
  },
  {
    id: 'agent',
    badge: '02 · AI Agent 搭建',
    shortTab: 'AI Agent',
    title: '有出处、守权限的企业知识助手',
    summary: '基于企业确认可用的制度与产品资料快速回答常见问题，每条结论附带原文出处。',
    highlightTag: '按岗位权限检索 · 关键回复人工复核',
    href: 'project.html?project=agent',
    ctaLabel: '体验知识 Agent 原型'
  },
  {
    id: 'automation',
    badge: '03 · 工作流自动化',
    shortTab: '工作流',
    title: '跨工具数据同步与自动审批流转',
    summary: '减少表单、表格与群聊之间的重复手工搬运，按规则自动分发审批并在异常时提醒。',
    highlightTag: '多条件分支路由 · 异常节点人工兜底',
    href: 'project.html?project=workflow',
    ctaLabel: '体验审批工作流原型'
  },
  {
    id: 'web',
    badge: '04 · 企业官网建设',
    shortTab: '官网建设',
    title: '清晰易懂、多端适配的品牌官网',
    summary: '梳理企业核心业务价值与服务体系，打造电脑与手机端都加载迅速、方便咨询的品牌门户。',
    highlightTag: '响应式多端适配 · 清晰转化路径',
    href: 'capabilities.html#web',
    ctaLabel: '查看官网建设服务'
  }
];

export interface HomeServiceItem {
  id: string;
  title: string;
  summary: string;
  href: string;
  iconSvg: string;
}

export const HOME_SERVICES: readonly HomeServiceItem[] = [
  {
    id: 'software',
    title: '企业软件开发',
    summary: '贴合实际业务逻辑定制订单、客户与项目协同系统，数据统一且权限清晰。',
    href: 'capabilities.html#software',
    iconSvg:
      '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></svg>'
  },
  {
    id: 'agent',
    title: 'AI Agent 搭建',
    summary: '基于团队确认可用资料建立知识问答与内容起草助手，答案附带可核对来源。',
    href: 'capabilities.html#agent',
    iconSvg:
      '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/><circle cx="12" cy="12" r="4" fill="white"/></svg>'
  },
  {
    id: 'automation',
    title: '工作流自动化',
    summary: '减少表单、表格与群聊之间的重复搬运，按规则自动同步记录与提醒负责人。',
    href: 'capabilities.html#automation',
    iconSvg:
      '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="7" height="6" rx="1.5"/><rect x="14" y="14" width="7" height="6" rx="1.5"/><path d="M10 7h5a2 2 0 0 1 2 2v5M7 10v5a2 2 0 0 0 2 2h5"/></svg>'
  },
  {
    id: 'web',
    title: '企业官网建设',
    summary: '梳理企业核心业务表达，打造电脑与手机端都清晰易懂、方便转化的品牌官网。',
    href: 'capabilities.html#web',
    iconSvg:
      '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18"/></svg>'
  }
];

export type HomeScenarioId = 'operations' | 'agent' | 'workflow';

export interface HomeScenarioSpec {
  id: HomeScenarioId;
  tabLabel: string;
  title: string;
  description: string;
  points: readonly string[];
  demoHref: string;
  demoLabel: string;
}

export const HOME_SCENARIOS: Record<HomeScenarioId, HomeScenarioSpec> = {
  operations: {
    id: 'operations',
    tabLabel: '运营与订单协同',
    title: '告别多表核对，进度与责任人一目了然',
    description:
      '把散落在群聊、表格与个人备忘里的订单交期、任务归属和操作记录集中到一个清晰的工作台。',
    points: [
      '订单改期或变更后，发货与跟单同事打开同一页面即可查看最新版',
      '每项关键任务绑定责任人与验收条件，减少反复在群里追问进度',
      '操作确认自动留痕，随时追溯谁在什么时候完成了哪一步'
    ],
    demoHref: 'project.html?project=operations',
    demoLabel: '体验运营工作台演示'
  },
  agent: {
    id: 'agent',
    tabLabel: '企业知识问答 AI',
    title: '让团队资料直接开口回答，每条结论可溯源',
    description:
      '将零散的产品说明、制度规范与常见问题整理为知识助手，按岗位权限检索并展示原文出处。',
    points: [
      '仅检索授权范围内的企业资料，无权限文档绝不越权带入回答',
      '回答下方直接关联原文片段与版本号，方便人工快速点开核对',
      '遇到资料不足或关键业务承诺，明确提示并保留人工最终复核'
    ],
    demoHref: 'project.html?project=agent',
    demoLabel: '体验知识 Agent 演示'
  },
  workflow: {
    id: 'workflow',
    tabLabel: '自动化审批流转',
    title: '按约定规则自动流转，异常节点人工兜底',
    description:
      '打通申请提交、规则判断与审批提醒，让重复性的信息登记与分发交给流程自动完成。',
    points: [
      '提交申请时先做必填字段校验，信息缺失及时提示补充',
      '按金额或业务类型自动匹配审批路径，并第一时间提醒对应负责人',
      '遇到异常或驳回情况清楚留痕，最终审批决定仍由人作出'
    ],
    demoHref: 'project.html?project=workflow',
    demoLabel: '体验审批工作流演示'
  }
};

export interface HomeProcessStep {
  step: string;
  title: string;
  description: string;
}

export const HOME_PROCESS_STEPS: readonly HomeProcessStep[] = [
  {
    step: '01',
    title: '需求沟通',
    description: '了解当前工作方式与最耗时的卡点，先不急着推翻原有工具。'
  },
  {
    step: '02',
    title: '方案确认',
    description: '明确本期要做的功能范围、交付清单与验收标准，必要时先出原型。'
  },
  {
    step: '03',
    title: '开发验证',
    description: '按约定节点同步进展，结合真实业务样本测试正常与异常场景。'
  },
  {
    step: '04',
    title: '验收交付',
    description: '按约定标准共同核对验收，交接使用说明并明确后续支持范围。'
  }
];
