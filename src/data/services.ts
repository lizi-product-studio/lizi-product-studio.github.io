export interface CoreServiceSpec {
  id: 'software' | 'agent' | 'automation' | 'web';
  title: string;
  subtitle: string;
  description: string;
  points: readonly string[];
  deliverable: string;
  serviceQuery: string;
}

export const CORE_SERVICES: readonly CoreServiceSpec[] = [
  {
    id: 'software',
    title: '企业软件开发',
    subtitle: '贴合实际业务流程的定制系统',
    description:
      '当客户、订单与任务分散在多份表格和群聊中时，我们根据企业实际运转方式开发集中化的业务管理后台或工作门户，让每个人都能看到权限范围内的最新进度。',
    points: [
      '客户、订单与项目全流程进度统一管理',
      '按部门与岗位划分查看、编辑及审批权限',
      '评估现有工具接口能力，实现稳妥的数据衔接'
    ],
    deliverable: '需求范围说明、交互原型、定制系统开发、部署上线与使用说明。',
    serviceQuery: 'software'
  },
  {
    id: 'agent',
    title: 'AI Agent 搭建',
    subtitle: '有出处、守权限的企业智能助手',
    description:
      '针对产品手册、团队规范和常见业务咨询反复查问的痛点，依托确认可用的内部资料搭建知识问答与辅助处理助手，让一线同事更快找到依据。',
    points: [
      '企业知识库检索与回答，同步附带可核对的原文来源',
      '会议纪要整理、常见客户回复起草与关键字段提取',
      '严格遵循资料访问权限，重要对外答复由人工确认'
    ],
    deliverable: '资料目录梳理、知识助手配置、样本测试验证、人工确认规范及操作说明。',
    serviceQuery: 'agent'
  },
  {
    id: 'automation',
    title: '工作流自动化',
    subtitle: '减少重复手工搬运的连接流程',
    description:
      '把表单收集、表格记录、状态通知与常规审批串联起来。收到外部申请或变更后，系统按既定规则自动推进并在异常时提醒相关负责人检查。',
    points: [
      '表单、业务后台与即时通讯工具之间的自动同步',
      '按金额、类型或状态自动触发任务分配与消息提醒',
      '信息不全、接口超时或处理失败时清晰告警留痕'
    ],
    deliverable: '现有流程梳理、工具连接配置、提醒与异常处理机制及操作交接文档。',
    serviceQuery: 'automation'
  },
  {
    id: 'web',
    title: '企业官网建设',
    subtitle: '让客户一眼看懂核心业务的品牌门户',
    description:
      '围绕客户最关心的问题重新组织信息结构，设计兼顾桌面端与移动端浏览体验的企业官网，让访客顺畅理解公司能做什么并快速联系沟通。',
    points: [
      '清晰的业务价值表达与服务结构梳理',
      '适配手机、平板与桌面显示器的响应式排版',
      '轻量高效的页面性能与清晰的咨询转化路径'
    ],
    deliverable: '页面结构规划、视觉设计与前端开发、上线部署与基础维护指引。',
    serviceQuery: 'web'
  }
];

export interface DeliveryGuarantee {
  title: string;
  description: string;
}

export const DELIVERY_GUARANTEES: readonly DeliveryGuarantee[] = [
  {
    title: '先保留有用的，再补不足的',
    description: '现有表格和工具不一定要全部推翻，先评估哪里真正费事、哪里值得连接或优化。'
  },
  {
    title: '开发前把边界谈清楚',
    description: '书面约定本期做什么、暂时不做什么以及验收依据，避免中途频繁返工与沟通偏差。'
  },
  {
    title: '拿真实样本共同验收',
    description: '不仅看页面能不能点，还要用实际业务数据测试正常流转与异常退回，确保团队真正用得起来。'
  }
];
