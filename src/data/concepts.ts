export type ConceptId = 'operations' | 'agent' | 'workflow';

export interface ConceptTabSpec {
  id: string;
  label: string;
}

export interface ConceptScopeRow {
  index: string;
  title: string;
  detail: string;
  status: string;
  present: boolean;
}

export interface ConceptSpec {
  id: ConceptId;
  number: string;
  name: string;
  subtitle: string;
  english: string;
  categoryTag: string;
  filterCategory: 'software' | 'agent' | 'workflow';
  serviceKey: 'software' | 'agent' | 'workflow';
  shortSummary: string;
  typeLabel: string;
  fieldsLabel: string;
  contextTitle: string;
  contextBody: string;
  contextQuestion: string;
  approachTitle: string;
  steps: readonly { index: string; tag: string; title: string; detail: string }[];
  scopeIntro: string;
  scopes: readonly ConceptScopeRow[];
  tabs: readonly ConceptTabSpec[];
  nextId: ConceptId;
}

export const CONCEPTS: Record<ConceptId, ConceptSpec> = {
  operations: {
    id: 'operations',
    number: '01',
    name: '序章',
    subtitle: '运营工作台',
    english: 'OPERATIONS',
    categoryTag: '企业软件开发',
    filterCategory: 'software',
    serviceKey: 'software',
    shortSummary: '把项目进度、负责人与操作记录收拢到一个工作台，试着确认一项示例任务并查看记录联动。',
    typeLabel: '企业协作 · 交互概念',
    fieldsLabel: '产品设计 / 交互结构 / 前端原型',
    contextTitle: '任务发在群里，进度还要挨个问。',
    contextBody:
      '多个人同时做事时，任务可能在群聊里，进度记在表格里，确认结果又散在不同消息里。这个概念把项目、负责人、任务状态和操作记录放在一起，看看日常协作可以如何进行。',
    contextQuestion: '谁在负责，下一步等什么？',
    approachTitle: '打开任务，就能看到进展。',
    steps: [
      {
        index: '01',
        tag: '01 / 项目与任务',
        title: '看清项目与负责人',
        detail: '从项目列表查看当前阶段，再进入具体任务，知道谁负责、还需要做什么。'
      },
      {
        index: '02',
        tag: '02 / 工作信息',
        title: '把相关信息放在一起',
        detail: '任务旁展示相关说明和交付内容，减少在不同消息中来回寻找。'
      },
      {
        index: '03',
        tag: '03 / 操作记录',
        title: '确认后留下记录',
        detail: '在演示中确认任务，状态随之变化，操作记录也会同步更新。'
      }
    ],
    scopeIntro:
      '这是可交互的前端概念，可以切换视图并确认一项示例任务。真实业务接入、账号、数据存储与多人协作功能需要按实际需求开发。',
    scopes: [
      { index: '01', title: '界面与信息架构', detail: '项目、任务与操作记录视图', status: '本页可体验', present: true },
      { index: '02', title: '示例交互操作', detail: '切换视图、确认任务、同步状态', status: '本页可体验', present: true },
      { index: '03', title: '真实数据与协作', detail: '账号体系、数据库保存与权限隔离', status: '实际项目开发', present: false },
      { index: '04', title: '上线与维护', detail: '测试验收、部署及后续运维支持', status: '按合作约定', present: false }
    ],
    tabs: [
      { id: 'overview', label: '项目总览' },
      { id: 'tasks', label: '任务协作' },
      { id: 'activity', label: '操作记录' }
    ],
    nextId: 'agent'
  },
  agent: {
    id: 'agent',
    number: '02',
    name: '知间',
    subtitle: '知识 Agent',
    english: 'KNOWLEDGE AGENT',
    categoryTag: 'AI Agent 搭建',
    filterCategory: 'agent',
    serviceKey: 'agent',
    shortSummary: '切换 3 个典型团队问题，看看助手如何带出答案、对应原文来源以及权限边界提示。',
    typeLabel: '企业知识 · 交互概念',
    fieldsLabel: '场景设计 / 检索交互 / 前端原型',
    contextTitle: '资料放在不同文件里，找答案要翻好几处。',
    contextBody:
      '制度、操作说明和团队资料多起来后，同一个问题可能需要反复查找，也要确认看到的是不是合适的版本。这个概念展示问题、参考回答与可核对来源如何放在一起。',
    contextQuestion: '找到答案后，怎么核对出处？',
    approachTitle: '回答旁边，放上可查看的来源。',
    steps: [
      {
        index: '01',
        tag: '01 / 资料范围',
        title: '先确定能查哪些资料',
        detail: '真实使用时，需要根据使用者身份确定可查范围，不能把无权查看的资料带入回答。'
      },
      {
        index: '02',
        tag: '02 / 查看来源',
        title: '回答和出处一起看',
        detail: '展示对应资料和原文片段，让使用者核对来源、版本与上下文。'
      },
      {
        index: '03',
        tag: '03 / 人工确认',
        title: '重要事项由人确认',
        detail: '资料不够时提示继续核对；涉及业务承诺和重要决定时，交由负责人判断。'
      }
    ],
    scopeIntro:
      '页面展示预设问题、参考回答和示例资料，尚未接入真实知识库、大模型接口或服务端权限校验。',
    scopes: [
      { index: '01', title: '问答与引用展示', detail: '切换预设问题、回答与来源定位', status: '本页可体验', present: true },
      { index: '02', title: '资料与边界说明', detail: '资料原文查看、权限范围示意', status: '本页可体验', present: true },
      { index: '03', title: '知识库与模型接入', detail: '文档解析切片、检索调优与模型调用', status: '实际项目开发', present: false },
      { index: '04', title: '账号与权限控制', detail: '组织身份认证、文档级别访问隔离', status: '实际项目开发', present: false }
    ],
    tabs: [
      { id: 'overview', label: '问答空间' },
      { id: 'sources', label: '知识来源' },
      { id: 'boundary', label: '权限边界' }
    ],
    nextId: 'workflow'
  },
  workflow: {
    id: 'workflow',
    number: '03',
    name: '有序',
    subtitle: '审批工作流',
    english: 'WORKFLOW',
    categoryTag: '工作流自动化',
    filterCategory: 'workflow',
    serviceKey: 'workflow',
    shortSummary: '切换不同采购金额档位，逐步模拟申请进入规则判断与人工审批节点的过程。',
    typeLabel: '采购审批 · 交互概念',
    fieldsLabel: '流程梳理 / 规则设计 / 前端原型',
    contextTitle: '申请发出去之后，不知道到了谁手里。',
    contextBody:
      '采购申请有时在群里提出，再手动登记、转交。这个概念用不同金额的示例申请展示规则判断、审批路径和处理记录，让申请人随时知道当前停在哪一步。',
    contextQuestion: '这笔申请交给谁，现在进行到哪一步？',
    approachTitle: '按金额找到负责人，把经过记录下来。',
    steps: [
      {
        index: '01',
        tag: '01 / 检查申请',
        title: '先检查申请信息',
        detail: '看看金额和材料是否齐全，缺少时先请申请人补充。'
      },
      {
        index: '02',
        tag: '02 / 审批路径',
        title: '按金额选择路径',
        detail: '用示例金额展示不同审批路径；真实规则需要根据组织实际制度确认。'
      },
      {
        index: '03',
        tag: '03 / 处理记录',
        title: '查看流转到哪一步',
        detail: '演示提交、规则判断和等待审批的过程；实际使用还需接入消息通知与异常处理。'
      }
    ],
    scopeIntro:
      '可以在本页切换示例金额并逐步模拟流转到人工审批节点。操作仅改变当前页面状态，不会发送真实通知或连接外部系统。',
    scopes: [
      { index: '01', title: '流程画布与分支', detail: '申请提交、金额判断与审批节点', status: '本页可体验', present: true },
      { index: '02', title: '多档金额模拟', detail: '切换金额档位、查看同步流转记录', status: '本页可体验', present: true },
      { index: '03', title: '真实审批与通知', detail: '企业微信/钉钉集成、组织架构同步', status: '实际项目开发', present: false },
      { index: '04', title: '异常与撤回处理', detail: '退回补充、撤回、重试与超时提醒', status: '实际项目开发', present: false }
    ],
    tabs: [
      { id: 'overview', label: '流程画布' },
      { id: 'runs', label: '运行记录' },
      { id: 'rules', label: '规则配置' }
    ],
    nextId: 'operations'
  }
};

export interface AgentQuestionPreset {
  id: string;
  tag: string;
  question: string;
  answerLead: string;
  bullets: readonly string[];
  sourceTitle: string;
  sourceVersion: string;
  sectionTitle: string;
  docHeading: string;
  quote: string;
  docContext: string;
  maintainer: string;
}

export const AGENT_PRESET_QUESTIONS: readonly AgentQuestionPreset[] = [
  {
    id: 'onboarding',
    tag: '新同事入职',
    question: '新同事入职，需要准备什么？',
    answerLead: '根据团队的入职指引，建议按顺序完成以下三项准备：',
    bullets: [
      '开通工作账号，按岗位申请常用工具与资料目录权限。',
      '与直属负责人确认第一周的工作计划与协作联系人。',
      '了解团队常用协作方式，预约一次跨岗位简短交流。'
    ],
    sourceTitle: '团队入职指引',
    sourceVersion: 'v1.2 · 内部通用',
    sectionTitle: '第 2 节 · 入职第一周',
    docHeading: '入职第一周的准备事项',
    quote: '入职第一周，请先完成工作账号与基础工具权限申请，并与直属负责人共同确认首周工作计划。',
    docContext:
      '团队协作依赖清晰的信息交接。权限开通应遵循最小够用原则，遇到岗位特殊工具需求由负责人审批补充。',
    maintainer: '团队行政与协作负责人'
  },
  {
    id: 'kickoff',
    tag: '项目启动',
    question: '项目启动前，需要确认哪些信息？',
    answerLead: '项目启动清单里列出了三项开项前必须对齐的要素：',
    bullets: [
      '明确当前要解决的业务痛点，以及本期暂时不做的边界范围。',
      '确认业务接口人、开发/实施负责人与日常沟通反馈节奏。',
      '约定交付清单、测试样本数据以及最终上线验收条件。'
    ],
    sourceTitle: '项目协作手册',
    sourceVersion: 'v1.4 · 交付标准',
    sectionTitle: '第 1 节 · 启动准备',
    docHeading: '项目启动信息清单',
    quote: '启动项目前，应书面明确业务目标、接口人分工、本期边界与验收标准，并由双方负责人确认。',
    docContext:
      '提前把边界与验收标准放在纸面上，能够避免开发过程中频繁返工，也能让业务侧尽早准备真实测试样本。',
    maintainer: '项目交付负责人'
  },
  {
    id: 'quote-change',
    tag: '报价变更',
    question: '客户临时改了交期或报价，流程怎么留痕？',
    answerLead: '涉及交期调整或报价变更时，必须走以下确认与留痕动作：',
    bullets: [
      '在原订单记录下发起变更备注，写明变更原因与对应客户沟通依据。',
      '交期缩短或金额变化超过预设比例时，触发对应负责人二次核对确认。',
      '确认完成后自动同步至发货或执行排期视图，保留操作人与时间戳。'
    ],
    sourceTitle: '订单与变更管理规范',
    sourceVersion: 'v2.0 · 业务规则',
    sectionTitle: '第 4 节 · 订单变更留痕',
    docHeading: '交期与报价修改规范',
    quote: '任何影响交付时间或结算金额的修改，均不得仅在群聊口头确认，必须在系统记录中完成负责人复核留痕。',
    docContext:
      '通过将变更记录直接挂接在订单详情下，发货、财务与跟单同事打开同一页面即可看到最新版信息，避免信息差错漏。',
    maintainer: '运营与交付管理组'
  }
];

export interface WorkflowAmountPreset {
  id: 'small' | 'large';
  label: string;
  itemTitle: string;
  amountText: string;
  ruleMatch: string;
  approverTitle: string;
  approverRole: string;
}

export const WORKFLOW_PRESETS: Record<'small' | 'large', WorkflowAmountPreset> = {
  small: {
    id: 'small',
    label: '小额申请（¥3,200）',
    itemTitle: '办公外设与配件采购',
    amountText: '¥ 3,200.00',
    ruleMatch: '金额 ≤ ¥5,000',
    approverTitle: '部门负责人审批',
    approverRole: '部门负责人 · 待人工审批'
  },
  large: {
    id: 'large',
    label: '大额申请（¥12,800）',
    itemTitle: '云服务器年度续费申请',
    amountText: '¥ 12,800.00',
    ruleMatch: '金额 ＞ ¥5,000',
    approverTitle: '财务负责人审批',
    approverRole: '财务负责人 · 待人工审批'
  }
};
