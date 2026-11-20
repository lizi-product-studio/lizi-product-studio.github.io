import '../styles/main.css';
import { initShell } from '../components/shell';
import {
  AGENT_PRESET_QUESTIONS,
  CONCEPTS,
  WORKFLOW_PRESETS,
  type ConceptId
} from '../data/concepts';

function getConceptFromQuery(): ConceptId {
  const raw = new URLSearchParams(window.location.search).get('project');
  if (raw === 'operations' || raw === 'agent' || raw === 'workflow') {
    return raw;
  }
  return 'operations';
}

function initProjectPage(): void {
  let currentConceptId: ConceptId = getConceptFromQuery();
  let activeView = 'overview';

  // 各演示概念内部的交互状态
  let taskDone = false;
  let questionIndex = 0;
  let workflowPresetKey: 'small' | 'large' = 'small';
  let flowStep = 0;

  const tabsContainer = document.getElementById('demo-tabs');
  const viewContainer = document.getElementById('demo-view');
  const breadcrumbEl = document.getElementById('demo-breadcrumb');
  const switcherButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-concept-switch]')];

  if (!tabsContainer || !viewContainer || !breadcrumbEl) return;

  const setText = (id: string, value: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  const renderSectionHeading = (eyebrow: string, heading: string, subtitle: string, rightSlot = '') =>
    `<div class="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200/80">
      <div>
        <p class="text-[11px] font-mono font-semibold text-blue-700 uppercase tracking-wider">${eyebrow}</p>
        <h2 class="mt-1 text-xl font-bold text-slate-950">${heading}</h2>
        <p class="mt-1 text-xs sm:text-sm text-slate-600">${subtitle}</p>
      </div>
      ${rightSlot}
    </div>`;

  const renderOperationsView = (): string => {
    if (activeView === 'overview') {
      return `${renderSectionHeading('演示空间 / 总览', '项目总览', '看看示例项目、待办事项与操作留痕的联动效果。')}
      <div class="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <p class="text-xs text-slate-500">演示项目</p>
          <p class="mt-1 text-2xl font-bold text-slate-950 tabular-nums">03 <span class="text-xs font-normal text-slate-500">个项目</span></p>
          <p class="mt-1 text-xs text-slate-500">集中查看负责人与当前阶段</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <p class="text-xs text-slate-500">需要确认</p>
          <p class="mt-1 text-2xl font-bold tabular-nums ${taskDone ? 'text-emerald-700' : 'text-amber-600'}">${taskDone ? '00' : '01'} <span class="text-xs font-normal text-slate-500">项任务</span></p>
          <p class="mt-1 text-xs text-slate-500">${taskDone ? '当前演示任务已完成确认' : '原型方案等待你的确认'}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <p class="text-xs text-slate-500">操作留痕</p>
          <p class="mt-1 text-2xl font-bold text-blue-700 tabular-nums">${taskDone ? '04' : '03'} <span class="text-xs font-normal text-slate-500">条动态</span></p>
          <p class="mt-1 text-xs text-slate-500">确认后自动同步至操作记录</p>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-900">进行中的项目</h3>
        <span class="text-xs text-slate-500">示例项目 / 03</span>
      </div>
      <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="rounded-xl border border-slate-200 p-4 bg-white">
          <span class="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">产品设计</span>
          <h4 class="mt-2.5 text-sm font-bold text-slate-950">客户服务平台</h4>
          <p class="mt-1 text-xs text-slate-600">客户列表、服务记录与任务分配。</p>
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="px-2 py-0.5 rounded-full font-medium ${taskDone ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}">${taskDone ? '设计已确认' : '待确认方案'}</span>
            <span class="text-slate-500">林澈</span>
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 p-4 bg-white">
          <span class="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">业务工具</span>
          <h4 class="mt-2.5 text-sm font-bold text-slate-950">供应链管理工具</h4>
          <p class="mt-1 text-xs text-slate-600">整理采购、供应商与订单协作关系。</p>
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">需求梳理</span>
            <span class="text-slate-500">张也</span>
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 p-4 bg-white">
          <span class="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">知识管理</span>
          <h4 class="mt-2.5 text-sm font-bold text-slate-950">团队知识空间</h4>
          <p class="mt-1 text-xs text-slate-600">整理团队资料目录与文档结构。</p>
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">信息结构</span>
            <span class="text-slate-500">余禾</span>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-900">我的待办任务</h3>
        <button type="button" data-goto="tasks" class="text-xs font-semibold text-blue-700 hover:text-blue-800">进入任务协作确认 →</button>
      </div>
      <div class="mt-3 rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
        <div class="px-4 py-3 flex flex-wrap items-center justify-between gap-2 bg-white">
          <div>
            <p class="font-semibold text-slate-900 ${taskDone ? 'line-through text-slate-400' : ''}">确认客户服务平台的原型方案</p>
            <p class="text-[11px] text-slate-500 mt-0.5">客户服务平台 · 负责人：林澈</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full font-medium ${taskDone ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}">${taskDone ? '已完成' : '待确认'}</span>
            <button type="button" data-goto="tasks" class="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300 text-slate-700 font-medium">去操作</button>
          </div>
        </div>
        <div class="px-4 py-3 flex items-center justify-between gap-2 bg-white">
          <div>
            <p class="font-semibold text-slate-900">整理供应链管理需要记录的字段清单</p>
            <p class="text-[11px] text-slate-500 mt-0.5">供应链管理工具 · 负责人：张也</p>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium shrink-0">进行中</span>
        </div>
      </div>`;
    }

    if (activeView === 'tasks') {
      return `${renderSectionHeading('演示空间 / 任务协作', '确认示例任务', '点击下方确认按钮，观察任务状态与「操作记录」视图的实时联动。')}
      <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${taskDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${taskDone ? '已完成' : '待确认'}</span>
          <span class="text-xs font-mono text-slate-500">DESIGN-012</span>
        </div>
        <div>
          <h3 class="text-lg font-bold text-slate-950">确认客户服务平台的原型方案</h3>
          <p class="mt-1.5 text-sm text-slate-600 leading-relaxed">请核对客户列表、服务记录与任务分配三个界面，确认信息结构与关键操作符合日常协作场景。</p>
        </div>
        <dl class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div class="rounded-lg bg-white border border-slate-200/80 p-3">
            <dt class="text-slate-500">负责人</dt>
            <dd class="mt-1 font-semibold text-slate-900">林澈</dd>
          </div>
          <div class="rounded-lg bg-white border border-slate-200/80 p-3">
            <dt class="text-slate-500">所属项目</dt>
            <dd class="mt-1 font-semibold text-slate-900">客户服务平台</dd>
          </div>
          <div class="rounded-lg bg-white border border-slate-200/80 p-3">
            <dt class="text-slate-500">验收条件</dt>
            <dd class="mt-1 font-semibold text-slate-900">结构完整，路径可操作</dd>
          </div>
        </dl>
        <div class="rounded-xl bg-white border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
          <p class="text-xs sm:text-sm font-medium ${taskDone ? 'text-emerald-700' : 'text-slate-700'}">
            ${taskDone ? '✓ 方案已确认，操作记录已自动新增一条同步动态。' : '确认后将更新任务状态，并在「操作记录」中保留操作人与说明。'}
          </p>
          <div class="flex items-center gap-2.5">
            ${taskDone ? '<button type="button" data-goto="activity" class="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50">查看操作记录 →</button>' : ''}
            <button type="button" id="task-toggle" class="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${taskDone ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'bg-blue-700 hover:bg-blue-800 text-white'}">
              ${taskDone ? '重置演示状态' : '确认方案完成 ✓'}
            </button>
          </div>
        </div>
      </div>`;
    }

    return `${renderSectionHeading('演示空间 / 操作记录', '操作留痕记录', '记录谁在什么时候确认了哪项工作，方便事后追溯。')}
    <div class="mt-5 space-y-3">
      ${
        taskDone
          ? `<article class="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-[11px] font-semibold text-emerald-700">刚刚 · 本次页面演示触发</p>
                <h3 class="mt-0.5 text-sm font-bold text-slate-950">林澈确认了原型方案</h3>
                <p class="mt-0.5 text-xs text-slate-600">客户服务平台 · 状态由「待确认」变更为「已完成」</p>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">状态已同步</span>
            </article>`
          : ''
      }
      <article class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-[11px] text-slate-400">示例记录 · 10:30</p>
        <h3 class="mt-0.5 text-sm font-semibold text-slate-900">林澈更新了原型说明文档</h3>
        <p class="mt-1 text-xs text-slate-600">上传示例交付物，补充关键操作路径说明。</p>
      </article>
      <article class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-[11px] text-slate-400">示例记录 · 09:45</p>
        <h3 class="mt-0.5 text-sm font-semibold text-slate-900">张也创建了字段整理任务</h3>
        <p class="mt-1 text-xs text-slate-600">供应链管理工具 · 已关联业务负责人与范围说明。</p>
      </article>
      <article class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-[11px] text-slate-400">示例记录 · 09:00</p>
        <h3 class="mt-0.5 text-sm font-semibold text-slate-900">余禾建立了团队知识空间目录</h3>
        <p class="mt-1 text-xs text-slate-600">梳理首批常用制度、产品资料与操作规范分类。</p>
      </article>
    </div>`;
  };

  const renderAgentView = (): string => {
    const preset = AGENT_PRESET_QUESTIONS[questionIndex] ?? AGENT_PRESET_QUESTIONS[0];

    if (activeView === 'overview') {
      const questionTabs = AGENT_PRESET_QUESTIONS.map(
        (q, idx) => `<button type="button" data-question-index="${idx}" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          idx === questionIndex
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }">${q.tag}</button>`
      ).join('');

      return `${renderSectionHeading(
        '演示空间 / 问答空间',
        '预设问题与出处核对',
        '切换下方 3 个常见业务问题，看看回答如何与团队原文依据绑定。'
      )}
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <span class="text-xs font-medium text-slate-500">选择预设问题：</span>
        ${questionTabs}
      </div>

      <div class="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-4">
        <div class="flex items-start gap-3">
          <span class="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-bold shrink-0 mt-0.5">提问</span>
          <p class="text-sm sm:text-base font-bold text-slate-950">${preset.question}</p>
        </div>

        <div class="rounded-xl border border-indigo-200/80 bg-white p-4 sm:p-5 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-bold text-indigo-700">知间 · 参考回答（基于已授权资料）</span>
            <span class="text-[11px] text-slate-400">未调用真实大模型</span>
          </div>
          <p class="text-sm text-slate-700">${preset.answerLead}</p>
          <ol class="space-y-1.5 text-sm text-slate-800 list-decimal pl-5 leading-relaxed">
            ${preset.bullets.map((item) => `<li>${item}</li>`).join('')}
          </ol>

          <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button type="button" data-goto="sources" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold transition-colors text-left">
              <span>引用出处：《${preset.sourceTitle}》· ${preset.sectionTitle}</span>
              <span aria-hidden="true">查看原文 →</span>
            </button>
            <span class="text-xs text-slate-500">重要决定仍由负责人核对确认</span>
          </div>
        </div>
      </div>`;
    }

    if (activeView === 'sources') {
      return `${renderSectionHeading(
        '演示空间 / 知识来源',
        '原文依据预览',
        '点击问答中的来源即可定位到对应制度原文，方便快速核对版本与上下文。'
      )}
      <div class="mt-5 rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div class="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 class="text-sm font-bold text-slate-950">《${preset.sourceTitle}》</h3>
            <p class="text-xs text-slate-500">${preset.sourceVersion} · ${preset.sectionTitle}</p>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">团队权限可见</span>
        </div>
        <div class="p-5 space-y-3 text-sm text-slate-700 leading-relaxed">
          <h4 class="font-bold text-slate-950">${preset.docHeading}</h4>
          <p>${preset.docContext}</p>
          <blockquote class="rounded-lg bg-indigo-50/70 border-l-4 border-indigo-600 px-4 py-3 text-slate-900 font-medium">
            “${preset.quote}”
          </blockquote>
          <div class="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>文档维护人：${preset.maintainer}</span>
            <button type="button" data-goto="overview" class="text-indigo-700 font-semibold hover:underline">← 返回问答空间切换问题</button>
          </div>
        </div>
      </div>`;
    }

    return `${renderSectionHeading(
      '演示空间 / 权限边界',
      '可信使用与人工复核机制',
      '企业知识助手必须遵循既有的岗位权限与责任边界。'
    )}
    <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
      <article class="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <span class="text-xs font-mono font-semibold text-indigo-700">01 / 资料权限</span>
        <h3 class="mt-2 text-sm font-bold text-slate-950">仅检索有权查看的内容</h3>
        <p class="mt-1.5 text-xs text-slate-600 leading-relaxed">真实项目在服务端校验账号身份，只检索当前员工被授权查看的文档范围。</p>
      </article>
      <article class="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <span class="text-xs font-mono font-semibold text-indigo-700">02 / 信息缺口</span>
        <h3 class="mt-2 text-sm font-bold text-slate-950">找不到依据直接提示</h3>
        <p class="mt-1.5 text-xs text-slate-600 leading-relaxed">资料不足或存在冲突版本时明确说明缺口，不硬编答案，提示联系维护人。</p>
      </article>
      <article class="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <span class="text-xs font-mono font-semibold text-amber-700">03 / 人工确认</span>
        <h3 class="mt-2 text-sm font-bold text-slate-950">关键决策交由人确认</h3>
        <p class="mt-1.5 text-xs text-slate-600 leading-relaxed">对外报价承诺、制度解释与系统写入操作，保留人工确认开关。</p>
      </article>
    </div>`;
  };

  const renderWorkflowView = (): string => {
    const preset = WORKFLOW_PRESETS[workflowPresetKey];
    const flowStatusLabels = ['待发起模拟', '材料完整性已校验', '金额分支已匹配', `已送达：${preset.approverTitle}`];

    if (activeView === 'overview') {
      const presetButtons = (['small', 'large'] as const)
        .map((key) => {
          const item = WORKFLOW_PRESETS[key];
          const active = workflowPresetKey === key;
          return `<button type="button" data-wf-preset="${key}" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            active ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }">${item.label}</button>`;
        })
        .join('');

      const nodes = [
        { step: 1, title: '提交采购申请', detail: `${preset.itemTitle} · ${preset.amountText}` },
        { step: 2, title: '按金额判断路径', detail: `规则判定：${preset.ruleMatch}` },
        { step: 3, title: preset.approverTitle, detail: preset.approverRole }
      ];

      return `${renderSectionHeading(
        '演示空间 / 流程画布',
        '多档金额审批模拟',
        '选择示例申请金额后，点击右下角按钮逐步观察流转进度。',
        `<span class="px-2.5 py-1 rounded-full text-xs font-semibold ${flowStep === 3 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}">${flowStatusLabels[flowStep]}</span>`
      )}
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <span class="text-xs font-medium text-slate-500">切换申请金额：</span>
        ${presetButtons}
      </div>

      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        ${nodes
          .map((node) => {
            const done = flowStep > node.step || (flowStep === 3 && node.step < 3);
            const current = flowStep === node.step;
            return `<div class="rounded-xl border p-4 transition-colors ${
              current
                ? 'border-blue-600 bg-blue-50/70'
                : done
                  ? 'border-emerald-300 bg-emerald-50/60'
                  : 'border-slate-200 bg-white'
            }">
              <div class="flex items-center justify-between text-xs">
                <span class="font-mono font-semibold ${current ? 'text-blue-700' : done ? 'text-emerald-700' : 'text-slate-400'}">STEP 0${node.step}</span>
                <span>${done ? '✓ 已通过' : current ? '● 当前所在' : '待流转'}</span>
              </div>
              <h3 class="mt-2 text-sm font-bold text-slate-950">${node.title}</h3>
              <p class="mt-1 text-xs text-slate-600">${node.detail}</p>
            </div>`;
          })
          .join('')}
      </div>

      <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-[11px] font-mono text-slate-500">SIMULATION / 0${flowStep} OF 03</p>
          <p class="mt-0.5 text-sm font-medium text-slate-900">${
            [
              '点击「开始模拟」，把当前申请放入流转规则中检查。',
              '申请必填字段与凭证材料校验完整，下一步匹配审批金额分支。',
              `系统已匹配「${preset.ruleMatch}」，正在流转至「${preset.approverTitle}」。`,
              `已抵达人工审批节点（${preset.approverTitle}），保留人工作出最终批准的权利。`
            ][flowStep]
          }</p>
        </div>
        <button type="button" id="flow-next" class="px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-colors shrink-0">
          ${['开始模拟 →', '匹配金额规则 →', '送达审批节点 →', '重新演示 ↺'][flowStep]}
        </button>
      </div>`;
    }

    if (activeView === 'runs') {
      const logs = [
        { title: '申请已进入流程', desc: `事项：${preset.itemTitle} · 申请金额：${preset.amountText}` },
        { title: '规则匹配完成', desc: `材料完整 · 匹配规则：${preset.ruleMatch}` },
        { title: `已送达：${preset.approverTitle}`, desc: '等待负责人人工审批（演示不自动批准申请）。' }
      ].slice(0, flowStep);

      return `${renderSectionHeading('演示空间 / 运行记录', '本次流转日志', '按顺序记录申请经过的规则判断与当前停留节点。')}
      <div class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs text-slate-500">${preset.itemTitle}</p>
          <p class="text-base font-bold text-slate-950 tabular-nums">${preset.amountText}</p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${flowStep === 3 ? 'bg-amber-100 text-amber-800' : 'bg-white border border-slate-200 text-slate-700'}">${flowStatusLabels[flowStep]}</span>
      </div>
      <div class="mt-4 space-y-2.5">
        ${
          logs.length === 0
            ? `<div class="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <p class="text-sm font-semibold text-slate-800">还没有模拟运行记录</p>
                <p class="mt-1 text-xs text-slate-500">请先回到「流程画布」点击开始模拟。</p>
                <button type="button" data-goto="overview" class="mt-3 px-4 py-2 rounded-lg bg-blue-700 text-white text-xs font-semibold">前往流程画布 →</button>
              </div>`
            : logs
                .map(
                  (log, idx) => `<article class="rounded-xl border border-slate-200 bg-white p-4">
                    <p class="text-[11px] font-mono text-emerald-700 font-semibold">演示步骤 0${idx + 1}</p>
                    <h3 class="mt-0.5 text-sm font-bold text-slate-950">${log.title}</h3>
                    <p class="mt-1 text-xs text-slate-600">${log.desc}</p>
                  </article>`
                )
                .join('')
        }
      </div>`;
    }

    return `${renderSectionHeading('演示空间 / 规则配置', '示例金额路由规则', '以下金额条件仅作演示参考，实际实施按贵司审批制度配置。')}
    <div class="mt-5 rounded-xl border border-slate-200 divide-y divide-slate-200 bg-white text-sm">
      <div class="px-5 py-3.5 flex items-center justify-between bg-slate-50">
        <span class="font-bold text-slate-900">采购申请 · 金额分支规则</span>
        <span class="text-xs text-slate-500">只读规则示例</span>
      </div>
      <div class="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
        <span class="text-slate-500">路径 A · 申请金额 ≤ ¥5,000</span>
        <span class="font-semibold text-slate-900">→ 部门负责人审批</span>
      </div>
      <div class="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
        <span class="text-slate-500">路径 B · 申请金额 ＞ ¥5,000</span>
        <span class="font-semibold text-slate-900">→ 财务负责人审批</span>
      </div>
      <div class="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
        <span class="text-slate-500">异常兜底 · 字段或附件缺失</span>
        <span class="font-semibold text-amber-700">→ 自动退回申请人补充说明</span>
      </div>
    </div>`;
  };

  const renderDemoBody = () => {
    const spec = CONCEPTS[currentConceptId];
    const activeTab = spec.tabs.find((t) => t.id === activeView) ?? spec.tabs[0];

    breadcrumbEl.textContent = `演示空间 / ${activeTab.label}`;
    viewContainer.setAttribute('aria-labelledby', `tab-${activeView}`);

    if (currentConceptId === 'operations') viewContainer.innerHTML = renderOperationsView();
    else if (currentConceptId === 'agent') viewContainer.innerHTML = renderAgentView();
    else viewContainer.innerHTML = renderWorkflowView();

    viewContainer.querySelectorAll<HTMLElement>('[data-goto]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.goto;
        if (target) selectView(target, true);
      });
    });

    viewContainer.querySelector('#task-toggle')?.addEventListener('click', () => {
      taskDone = !taskDone;
      renderDemoBody();
      (viewContainer.querySelector('#task-toggle') as HTMLElement | null)?.focus({ preventScroll: true });
    });

    viewContainer.querySelectorAll<HTMLButtonElement>('[data-question-index]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextIdx = Number(btn.dataset.questionIndex);
        if (!Number.isNaN(nextIdx)) {
          questionIndex = nextIdx;
          renderDemoBody();
        }
      });
    });

    viewContainer.querySelectorAll<HTMLButtonElement>('[data-wf-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.wfPreset as 'small' | 'large' | undefined;
        if (key) {
          workflowPresetKey = key;
          flowStep = 0;
          renderDemoBody();
        }
      });
    });

    viewContainer.querySelector('#flow-next')?.addEventListener('click', () => {
      flowStep = (flowStep + 1) % 4;
      renderDemoBody();
      (viewContainer.querySelector('#flow-next') as HTMLElement | null)?.focus({ preventScroll: true });
    });
  };

  const selectView = (tabId: string, focusPanel = false) => {
    activeView = tabId;
    tabsContainer.querySelectorAll<HTMLButtonElement>('button[data-view]').forEach((btn) => {
      const selected = btn.dataset.view === tabId;
      btn.setAttribute('aria-selected', String(selected));
      btn.tabIndex = selected ? 0 : -1;
      btn.className = selected
        ? 'flex items-center justify-center lg:justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors bg-blue-700 text-white shadow-xs'
        : 'flex items-center justify-center lg:justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors text-slate-700 hover:bg-slate-200/70';
    });
    renderDemoBody();
    if (focusPanel) {
      viewContainer.focus({ preventScroll: true });
    }
  };

  const renderConcept = (conceptId: ConceptId, syncUrl = false) => {
    currentConceptId = conceptId;
    const spec = CONCEPTS[conceptId];
    const nextSpec = CONCEPTS[spec.nextId];
    activeView = spec.tabs[0].id;

    document.title = `${spec.name} · ${spec.subtitle} — 栗子软件科技`;
    if (syncUrl) {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('project', conceptId);
      window.history.replaceState(null, '', nextUrl);
    }

    switcherButtons.forEach((btn) => {
      const isCurrent = btn.dataset.conceptSwitch === conceptId;
      btn.className = isCurrent
        ? 'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors bg-blue-700 text-white shadow-xs'
        : 'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200';
    });

    setText('project-number', `交互概念 ${spec.number} / 03`);
    setText('project-category', spec.categoryTag);
    setText('project-title', `${spec.name} · ${spec.subtitle}`);
    setText('project-description', spec.shortSummary);
    setText('project-type', spec.typeLabel);
    setText('project-fields', spec.fieldsLabel);
    setText('demo-brand-icon', spec.name[0] ?? 'L');
    setText('demo-brand-name', spec.name);
    setText('demo-brand-en', spec.english);

    setText('context-title', spec.contextTitle);
    setText('context-copy', spec.contextBody);
    setText('context-question', spec.contextQuestion);
    setText('approach-title', spec.approachTitle);
    setText('scope-copy', spec.scopeIntro);

    const stepsEl = document.getElementById('approach-steps');
    if (stepsEl) {
      stepsEl.innerHTML = spec.steps
        .map(
          (step) => `<article class="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
            <span class="text-xs font-mono font-semibold text-blue-700">${step.tag}</span>
            <h3 class="mt-2 text-base font-bold text-slate-950">${step.title}</h3>
            <p class="mt-2 text-sm text-slate-600 leading-relaxed">${step.detail}</p>
          </article>`
        )
        .join('');
    }

    const scopeListEl = document.getElementById('scope-list');
    if (scopeListEl) {
      scopeListEl.innerHTML = spec.scopes
        .map(
          (row) => `<div class="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-start gap-4">
              <span class="text-xs font-mono text-slate-400 pt-0.5">${row.index}</span>
              <div>
                <h3 class="text-sm font-bold text-slate-950">${row.title}</h3>
                <p class="text-xs sm:text-sm text-slate-600 mt-0.5">${row.detail}</p>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${
              row.present
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }">${row.status}</span>
          </div>`
        )
        .join('');
    }

    const briefLink = document.getElementById('project-brief-link') as HTMLAnchorElement | null;
    if (briefLink) {
      briefLink.href = `about.html?service=${spec.serviceKey}&project=${spec.id}#project-brief`;
    }

    const nextLink = document.getElementById('next-project-link') as HTMLAnchorElement | null;
    if (nextLink) {
      nextLink.href = `project.html?project=${nextSpec.id}`;
      const eyebrow = nextLink.querySelector('span');
      if (eyebrow) eyebrow.textContent = `下一个方案 / ${nextSpec.number}`;
      setText('next-project-title', `${nextSpec.name} · ${nextSpec.subtitle}`);
      setText('next-project-copy', nextSpec.shortSummary);
    }

    tabsContainer.innerHTML = spec.tabs
      .map(
        (tab, i) => `<button type="button" role="tab" id="tab-${tab.id}" aria-selected="${i === 0}" aria-controls="demo-view" tabindex="${i === 0 ? '0' : '-1'}" data-view="${tab.id}" class="flex items-center justify-center lg:justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors">${tab.label}</button>`
      )
      .join('');

    selectView(activeView);
  };

  tabsContainer.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('button[data-view]');
    if (button?.dataset.view) selectView(button.dataset.view);
  });

  tabsContainer.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const buttons = [...tabsContainer.querySelectorAll<HTMLButtonElement>('button[data-view]')];
    let idx = buttons.findIndex((b) => b.dataset.view === activeView);
    if (event.key === 'Home') idx = 0;
    else if (event.key === 'End') idx = buttons.length - 1;
    else idx = (idx + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;

    const target = buttons[idx];
    if (target?.dataset.view) {
      selectView(target.dataset.view);
      target.focus();
    }
  });

  switcherButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextId = btn.dataset.conceptSwitch as ConceptId | undefined;
      if (nextId && nextId !== currentConceptId) {
        renderConcept(nextId, true);
      }
    });
  });

  renderConcept(currentConceptId, false);
}

initShell();
initProjectPage();
