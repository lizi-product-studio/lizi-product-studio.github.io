import solutionAgentImg from '../assets/images/solution-agent.jpg';
import solutionSoftwareImg from '../assets/images/solution-software.jpg';
import solutionWorkflowImg from '../assets/images/solution-workflow.jpg';

export type ConceptId = 'operations' | 'agent' | 'workflow';

export interface ConceptTabSpec {
  id: string;
  label: string;
}

export interface ConceptScopeRow {
  title: string;
  detail: string;
  includedInDemo: boolean;
}

export interface ConceptSpec {
  id: ConceptId;
  name: string;
  subtitle: string;
  categoryTag: string;
  filterCategory: 'software' | 'agent' | 'workflow';
  serviceKey: 'software' | 'agent' | 'automation';
  image: string;
  imageAlt: string;
  shortSummary: string;
  contextTitle: string;
  contextBody: string;
  approachSteps: readonly { title: string; detail: string }[];
  scopes: readonly ConceptScopeRow[];
  tabs: readonly ConceptTabSpec[];
  nextId: ConceptId;
}

export const CONCEPTS: Record<ConceptId, ConceptSpec> = {
  operations: {
    id: 'operations',
    name: '序章',
    subtitle: '运营工作台',
    categoryTag: '企业软件',
    filterCategory: 'software',
    serviceKey: 'software',
    image: solutionSoftwareImg,
    imageAlt: '企业运营协同系统模块化 3D 视觉图',
    shortSummary: '把散落在表格和群聊中的项目进展、责任人与操作记录集中到一个清晰的工作台。',
    contextTitle: '任务发在群里，进度还要逐个追问',
    contextBody:
      '多部门协同做事时，最新要求常散落在聊天记录与多份表格里。这个原型演示了如何将项目进度、待确认事项与操作留痕统一在同一个视角下。',
    approachSteps: [
      {
        title: '看清项目与负责人',
        detail: '从项目总览掌握当前推进阶段，点击进入对应任务即可知道谁在负责、还需要确认什么。'
      },
      {
        title: '关键信息集中放置',
        detail: '任务旁集中展示背景说明、验收标准与交付物信息，减少在聊天记录里反复翻找。'
      },
      {
        title: '状态确认自动留痕',
        detail: '在本页确认示例任务后，项目待办状态与操作记录会实时同步更新，便于后续追溯。'
      }
    ],
    scopes: [
      { title: '界面架构与项目总览视图', detail: '项目进展卡片与我的待办任务列表', includedInDemo: true },
      { title: '示例任务确认与留痕联动', detail: '页面内切换状态并实时同步操作动态', includedInDemo: true },
      { title: '企业账号体系与数据存储', detail: '部门权限隔离、真实数据库持久化保存', includedInDemo: false },
      { title: '现有工具对接与上线运维', detail: '系统测试验证、部署上线与操作交接', includedInDemo: false }
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
    name: '知间',
    subtitle: '知识 Agent',
    categoryTag: 'AI Agent',
    filterCategory: 'agent',
    serviceKey: 'agent',
    image: solutionAgentImg,
    imageAlt: '企业知识库与智能检索 3D 视觉图',
    shortSummary: '围绕企业确认可用的资料库进行问答，回答旁边直接关联可核对的制度原文出处。',
    contextTitle: '制度与产品资料都在，问题却还是反复问',
    contextBody:
      '团队文档变多后，同事常找不到最新版规范，熟悉业务的人需要频繁停下来答疑。这个原型展示了如何让回答附带可溯源出处并强调权限边界。',
    approachSteps: [
      {
        title: '限定授权可查范围',
        detail: '在真实落地系统中，助手严格依据员工岗位权限检索文档，绝不带入无权查看的资料。'
      },
      {
        title: '回答与原文并排核对',
        detail: '每条预设回答下方附带对应制度名称、章节与版本号，点击即可跳转查看原文片段。'
      },
      {
        title: '关键决策保留人工确认',
        detail: '遇到资料依据不足时提示补充核对，涉及对外报价承诺或制度解释仍交由负责人把关。'
      }
    ],
    scopes: [
      { title: '多组业务问题问答切换', detail: '内置新同事入职、项目启动、报价变更 3 组示例', includedInDemo: true },
      { title: '引用原文定位与权限说明', detail: '支持点击出处跳转至对应文档原文预览', includedInDemo: true },
      { title: '知识库接入与大模型调优', detail: '文档解析切片、检索召回优化与模型调用', includedInDemo: false },
      { title: '组织身份认证与文档权限隔离', detail: '按员工角色在服务端动态校验可见范围', includedInDemo: false }
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
    name: '有序',
    subtitle: '审批工作流',
    categoryTag: '工作流自动化',
    filterCategory: 'workflow',
    serviceKey: 'automation',
    image: solutionWorkflowImg,
    imageAlt: '企业自动化审批与流程路由 3D 视觉图',
    shortSummary: '按预设金额与条件自动分发审批路径，支持多档金额流转模拟与执行记录查看。',
    contextTitle: '申请发出去之后，不知道到了谁手里',
    contextBody:
      '常规采购或业务申请如果在群里手工登记转交，很容易遗漏或延误。这个原型展示了从材料校验、金额路由判断到抵达人工审批节点的完整流转。',
    approachSteps: [
      {
        title: '先校验必填材料完整性',
        detail: '收到申请后首先检查金额、事由与凭证是否齐全，信息缺失时提前提示补充。'
      },
      {
        title: '按规则匹配审批人路径',
        detail: '在演示中可切换小额与大额两档金额，观察系统如何分别匹配部门负责人或财务负责人。'
      },
      {
        title: '推进留痕且不越权代批',
        detail: '每一步判断自动记录日志供随时查看，流程送达审批节点后仍交由负责人作出审批决定。'
      }
    ],
    scopes: [
      { title: '两档采购金额路径切换', detail: '对比 ¥3,200 与 ¥12,800 的不同流转路由', includedInDemo: true },
      { title: '分步模拟推进与日志同步', detail: '完整体验提交、校验、路由与抵达审批节点', includedInDemo: true },
      { title: 'IM 通知与业务系统对接', detail: '企业微信/钉钉消息推送及组织架构同步', includedInDemo: false },
      { title: '退回、撤回与异常重试', detail: '覆盖真实生产中的各类审批异常分支', includedInDemo: false }
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
