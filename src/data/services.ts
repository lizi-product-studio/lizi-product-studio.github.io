export type ScenarioKey = 'software' | 'agent' | 'workflow';

export interface ScenarioStep {
  code: string;
  label: string;
  category: string;
  title: string;
  description: string;
  output: string;
}

export interface ScenarioSpec {
  id: ScenarioKey;
  tabNumber: string;
  tabTitle: string;
  kicker: string;
  relatedConceptId: 'operations' | 'agent' | 'workflow';
  relatedConceptLabel: string;
  steps: readonly ScenarioStep[];
}

export const SERVICE_SCENARIOS: Record<ScenarioKey, ScenarioSpec> = {
  software: {
    id: 'software',
    tabNumber: '01',
    tabTitle: '企业软件开发',
    kicker: '订单处理 / ORDER OPERATIONS',
    relatedConceptId: 'operations',
    relatedConceptLabel: '体验运营工作台演示',
    steps: [
      {
        code: '01 / INPUT',
        label: '记录订单',
        category: '记录信息',
        title: '先把订单记下来。',
        description: '记录客户、商品、数量和交期。必要信息不完整时，提醒补充。',
        output: '订单信息 · 补充提醒'
      },
      {
        code: '02 / PROCESS',
        label: '分派处理',
        category: '安排处理',
        title: '让负责的人接到任务。',
        description: '按事先约定的方式分派订单，重复记录或需要特别处理的情况留给同事检查。',
        output: '负责人 · 待办事项'
      },
      {
        code: '03 / REVIEW',
        label: '负责人确认',
        category: '人工确认',
        title: '价格或交期有变化，先确认。',
        description: '需要负责人决定的事项，由人核对后继续，并记录谁在什么时候作了确认。',
        output: '确认意见 · 更新记录'
      },
      {
        code: '04 / OUTPUT',
        label: '查看进度',
        category: '查看进度',
        title: '回到订单，就能看见下一步。',
        description: '同事可以查看最新内容、处理状态和待办；需要传给其他工具的信息，再按约定处理。',
        output: '最新状态 · 待处理事项'
      }
    ]
  },
  agent: {
    id: 'agent',
    tabNumber: '02',
    tabTitle: 'AI Agent 搭建',
    kicker: '资料问答 / KNOWLEDGE ASSISTANCE',
    relatedConceptId: 'agent',
    relatedConceptLabel: '体验知识 Agent 演示',
    steps: [
      {
        code: '01 / INPUT',
        label: '提出问题',
        category: '提出问题',
        title: '说清想查什么。',
        description: '输入问题和必要背景，助手只在使用者有权查看的资料范围内查找。',
        output: '问题 · 可查资料范围'
      },
      {
        code: '02 / PROCESS',
        label: '查找资料',
        category: '查找依据',
        title: '从资料中找答案和出处。',
        description: '根据可用资料整理回答并附上来源；找不到依据时，明确提示资料不足。',
        output: '回答草稿 · 资料来源'
      },
      {
        code: '03 / REVIEW',
        label: '人工核对',
        category: '人工核对',
        title: '看一眼来源，再决定怎么用。',
        description: '使用者核对内容和出处；对外发送或修改业务信息等重要动作，由有权限的人确认。',
        output: '内容核对 · 人工确认'
      },
      {
        code: '04 / OUTPUT',
        label: '确认使用',
        category: '确认使用',
        title: '确认后再保存或使用。',
        description: '核对过的内容可以复制、保存，或按项目约定用于下一步；保留必要记录，方便回看。',
        output: '确认内容 · 使用记录'
      }
    ]
  },
  workflow: {
    id: 'workflow',
    tabNumber: '03',
    tabTitle: '工作流自动化',
    kicker: '重复步骤 / CONNECTED WORKFLOW',
    relatedConceptId: 'workflow',
    relatedConceptLabel: '体验审批工作流演示',
    steps: [
      {
        code: '01 / INPUT',
        label: '收到信息',
        category: '收到信息',
        title: '有人提交表单，流程开始。',
        description: '收到表单后先检查必要信息是否齐全；具体从哪里开始，由实际工作方式决定。',
        output: '表单信息 · 完整性检查'
      },
      {
        code: '02 / PROCESS',
        label: '按规则处理',
        category: '按规则处理',
        title: '把信息送到该去的地方。',
        description: '按约定整理信息、记录到目标工具，并通知对应同事；能否连接需要先确认。',
        output: '记录结果 · 处理提醒'
      },
      {
        code: '03 / REVIEW',
        label: '检查异常',
        category: '检查异常',
        title: '遇到问题，交给负责人。',
        description: '信息缺失、权限不足或结果不明确时，提示负责人核对；结果不明时先检查，再决定是否重试。',
        output: '异常提示 · 核对结果'
      },
      {
        code: '04 / OUTPUT',
        label: '查看结果',
        category: '查看结果',
        title: '知道哪些办好了，哪些还在等。',
        description: '记录处理结果和时间，让同事查看成功、失败及待处理的事项。',
        output: '处理记录 · 待办事项'
      }
    ]
  }
};

export interface CoreServiceSpec {
  id: string;
  anchor: string;
  index: string;
  title: string;
  enSubtitle: string;
  description: string;
  example?: string;
  tags: readonly string[];
  deliverable: string;
  preparation: string;
  serviceQuery: string;
  ctaLabel: string;
}

export const CORE_SERVICES: readonly CoreServiceSpec[] = [
  {
    id: 'software',
    anchor: 'software',
    index: '01',
    title: '企业软件开发',
    enSubtitle: 'SOFTWARE SYSTEMS',
    description:
      '订单改过几次、任务交给了谁、事情办到哪一步，都可以在同一个地方查看。我们根据业务开发订单、客户或项目管理系统，并按使用者设置权限。',
    tags: ['业务后台', '客户与订单管理', '业务门户', '系统接口集成'],
    deliverable: '可约定需求说明、页面原型、软件开发、部署和使用说明。',
    preparation: '可以带一份现有表格，讲讲从接单到交付是怎么做的。',
    serviceQuery: 'software',
    ctaLabel: '讨论软件需求'
  },
  {
    id: 'agent',
    anchor: 'agent',
    index: '02',
    title: 'AI Agent 搭建',
    enSubtitle: 'INTELLIGENT ASSISTANCE',
    description:
      '同样的问题反复查资料、反复问同事时，可以让知识助手先从确认可用的资料中寻找答案和来源。它也可以帮助整理信息、起草回复；重要内容由人核对。',
    example: '例如先用它查产品资料、整理会议记录，或起草需要同事核对的回复。',
    tags: ['知识检索', '信息抽取', '辅助回复', '工具调用'],
    deliverable: '可约定资料整理、知识助手配置、样本测试、使用说明及需要人工确认的环节。',
    preparation: '可以带一份常用资料、几个经常被问到的问题，说说希望谁来使用。',
    serviceQuery: 'agent',
    ctaLabel: '讨论 Agent 需求'
  },
  {
    id: 'automation',
    anchor: 'automation',
    index: '03',
    title: '工作流自动化',
    enSubtitle: 'CONNECTED OPERATIONS',
    description:
      '表单、表格和消息之间的重复复制，可以按约定规则交给流程处理。比如收到申请后记录信息、通知负责人；信息不全或处理失败时，留给同事检查。',
    tags: ['数据同步', '消息与任务提醒', '审批协同', '报表整理'],
    deliverable: '可约定流程梳理、工具连接、提醒设置、异常处理和使用说明。',
    preparation: '可以列出正在使用的工具，以及从收到信息到处理完成的步骤。',
    serviceQuery: 'workflow',
    ctaLabel: '讨论自动化需求'
  },
  {
    id: 'web',
    anchor: 'web',
    index: '04',
    title: '网站搭建',
    enSubtitle: 'WEBSITES & DIGITAL EXPERIENCE',
    description:
      '让客户打开网站，就能看懂你们提供什么服务、适合谁，以及怎样联系。我们整理内容、设计页面并开发网站，兼顾电脑和手机浏览。',
    tags: ['公司官网', '响应式界面', '交互原型', '发布与交接'],
    deliverable: '可约定页面结构、视觉设计、网站开发、发布和使用说明；域名及后续维护另行确认。',
    preparation: '可以带上已有介绍、图片和联系方式，以及希望访客了解的业务。',
    serviceQuery: 'web',
    ctaLabel: '讨论网站需求'
  }
];

export interface AcceptancePrinciple {
  index: string;
  title: string;
  description: string;
}

export const ACCEPTANCE_PRINCIPLES: readonly AcceptancePrinciple[] = [
  {
    index: '01',
    title: '先了解现状',
    description: '谁在做、用了什么工具、哪一步经常卡住？从一次实际操作开始聊。'
  },
  {
    index: '02',
    title: '约定这次做什么',
    description: '确认要做的功能、需要配合的工具和资料，以及这次暂时不做的部分。'
  },
  {
    index: '03',
    title: '按约定场景验收',
    description: '用准备好的业务样本检查操作结果，也看看信息缺失或处理失败时该怎么办。'
  }
];
