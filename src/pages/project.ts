import '../styles/main.css';
import {
  enhanceCardsAndTilt,
  enhanceInteractiveButtons,
  initScrollReveals,
  initShell,
  scrambleText,
  setParticleForm,
  showToast
} from '../components/shell';
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

  const renderSectionHeading = (heading: string, subtitle: string, rightSlot = '') =>
    `<div class="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800/80">
      <div>
        <h2 class="text-lg font-bold text-white">${heading}</h2>
        <p class="mt-1 text-xs sm:text-sm text-slate-400">${subtitle}</p>
      </div>
      ${rightSlot}
    </div>`;

  const renderOperationsView = (): string => {
    if (activeView === 'overview') {
      return `${renderSectionHeading('项目总览', '集中查看项目进展、待确认事项与操作留痕联动。')}
      <div class="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-xl bg-slate-900/85 border border-slate-800/80 p-4">
          <p class="text-xs text-slate-400">进行中项目</p>
          <p class="mt-1 text-2xl font-bold text-white tabular-nums">03</p>
        </div>
        <div class="rounded-xl bg-slate-900/85 border border-slate-800/80 p-4">
          <p class="text-xs text-slate-400">待确认任务</p>
          <p class="mt-1 text-2xl font-bold tabular-nums ${taskDone ? 'text-emerald-400' : 'text-sky-400'}">${taskDone ? '00' : '01'}</p>
        </div>
        <div class="rounded-xl bg-slate-900/85 border border-slate-800/80 p-4">
          <p class="text-xs text-slate-400">操作记录</p>
          <p class="mt-1 text-2xl font-bold text-white tabular-nums">${taskDone ? '04' : '03'}</p>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-200">我的待办任务</h3>
        <button type="button" data-goto="tasks" class="text-xs font-semibold text-sky-400 hover:text-sky-300">进入任务确认 →</button>
      </div>
      <div class="mt-3 divide-y divide-slate-800/80 border border-slate-800/80 bg-slate-900/50 rounded-xl text-sm">
        <div class="px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="font-semibold text-white ${taskDone ? 'line-through text-slate-500' : ''}">确认客户服务平台的原型方案</p>
            <p class="text-xs text-slate-400 mt-0.5">客户服务平台 · 负责人：林澈</p>
          </div>
          <div class="flex items-center gap-2.5">
            <span class="text-xs font-semibold ${taskDone ? 'text-emerald-400' : 'text-amber-400'}">${taskDone ? '已完成' : '待确认'}</span>
            <button type="button" data-goto="tasks" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-xs font-semibold text-slate-200 hover:text-white transition-colors">去处理</button>
          </div>
        </div>
        <div class="px-4 py-3.5 flex items-center justify-between gap-3">
          <div>
            <p class="font-semibold text-white">整理供应链管理需要记录的字段清单</p>
            <p class="text-xs text-slate-400 mt-0.5">供应链管理工具 · 负责人：张也</p>
          </div>
          <span class="text-xs font-medium text-sky-400 shrink-0">进行中</span>
        </div>
        <div class="px-4 py-3.5 flex items-center justify-between gap-3">
          <div>
            <p class="font-semibold text-white">梳理团队知识空间资料目录</p>
            <p class="text-xs text-slate-400 mt-0.5">团队知识空间 · 负责人：余禾</p>
          </div>
          <span class="text-xs font-medium text-slate-500 shrink-0">待开始</span>
        </div>
      </div>`;
    }

    if (activeView === 'tasks') {
      return `${renderSectionHeading('任务协作', '点击下方确认按钮，观察任务状态与「操作记录」视图的同步变化。')}
      <div class="mt-5 rounded-xl bg-slate-900/85 border border-slate-800/80 p-5 sm:p-6 space-y-4">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold ${taskDone ? 'text-emerald-400' : 'text-amber-400'}">${taskDone ? '已完成' : '待确认'}</span>
          <span class="font-mono text-slate-500">DESIGN-012</span>
        </div>
        <div>
          <h3 class="text-lg font-bold text-white">确认客户服务平台的原型方案</h3>
          <p class="mt-1.5 text-sm text-slate-300 leading-relaxed">请核对客户列表、服务记录与任务分配三个界面，确认信息结构与关键操作符合日常协作场景。</p>
        </div>
        <div class="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <p class="text-xs sm:text-sm ${taskDone ? 'text-emerald-400 font-medium' : 'text-slate-400'}">
            ${taskDone ? '✓ 方案已确认，操作记录已新增一条同步动态。' : '确认后将更新任务状态，并自动记入操作记录。'}
          </p>
          <div class="flex items-center gap-2.5">
            ${taskDone ? '<button type="button" data-goto="activity" class="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-sky-400">查看操作记录 →</button>' : ''}
            <button type="button" id="task-toggle" class="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${taskDone ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-blue-600 hover:bg-blue-500 text-white'}">
              ${taskDone ? '重置演示状态' : '确认方案完成 ✓'}
            </button>
          </div>
        </div>
      </div>`;
    }

    return `${renderSectionHeading('操作记录', '自动记录关键操作人与时间，方便后续核对。')}
    <div class="mt-5 space-y-3">
      ${
        taskDone
          ? `<article class="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-xs font-semibold text-emerald-400">刚刚 · 本次演示更新</p>
                <h3 class="mt-0.5 text-sm font-bold text-white">林澈确认了原型方案</h3>
                <p class="mt-0.5 text-xs text-slate-300">客户服务平台 · 状态由「待确认」变更为「已完成」</p>
              </div>
              <span class="text-xs font-semibold text-emerald-400">状态已同步</span>
            </article>`
          : ''
      }
      <article class="rounded-xl bg-slate-900/85 border border-slate-800/80 p-4">
        <p class="text-xs font-mono text-slate-500">10:30</p>
        <h3 class="mt-0.5 text-sm font-semibold text-white">林澈更新了原型说明文档</h3>
        <p class="mt-1 text-xs text-slate-400">补充客户服务平台关键操作路径说明。</p>
      </article>
      <article class="rounded-xl bg-slate-900/85 border border-slate-800/80 p-4">
        <p class="text-xs font-mono text-slate-500">09:45</p>
        <h3 class="mt-0.5 text-sm font-semibold text-white">张也创建了字段整理任务</h3>
        <p class="mt-1 text-xs text-slate-400">供应链管理工具 · 已关联业务负责人。</p>
      </article>
      <article class="rounded-xl bg-slate-900/85 border border-slate-800/80 p-4">
        <p class="text-xs font-mono text-slate-500">09:00</p>
        <h3 class="mt-0.5 text-sm font-semibold text-white">余禾建立了团队知识空间目录</h3>
        <p class="mt-1 text-xs text-slate-400">梳理首批常用制度、产品资料与操作规范分类。</p>
      </article>
    </div>`;
  };

  const renderAgentView = (): string => {
    const preset = AGENT_PRESET_QUESTIONS[questionIndex] ?? AGENT_PRESET_QUESTIONS[0];

    if (activeView === 'overview') {
      const questionTabs = AGENT_PRESET_QUESTIONS.map(
        (q, idx) => `<button type="button" data-question-index="${idx}" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
          idx === questionIndex
            ? 'bg-blue-600 text-white'
            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
        }">${q.tag}</button>`
      ).join('');

      return `${renderSectionHeading('问答空间', '切换常见业务问题，体验回答与原文出处的对应关系。')}
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <span class="text-xs text-slate-400">选择问题：</span>
        ${questionTabs}
      </div>

      <div class="mt-4 rounded-xl bg-slate-900/85 border border-slate-800/80 p-5 space-y-4">
        <p class="text-sm sm:text-base font-bold text-white">问：${preset.question}</p>
        <div class="rounded-xl bg-[#050814]/90 border border-slate-800 p-4 sm:p-5 space-y-3">
          <p class="text-sm text-slate-300">${preset.answerLead}</p>
          <ol class="space-y-1.5 text-sm text-slate-200 list-decimal pl-5 leading-relaxed">
            ${preset.bullets.map((item) => `<li>${item}</li>`).join('')}
          </ol>
          <div class="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <button type="button" data-goto="sources" class="font-semibold text-sky-400 hover:text-sky-300 text-left">
              引用出处：《${preset.sourceTitle}》· ${preset.sectionTitle} →
            </button>
            <span class="text-slate-500">重要决定仍由人核对确认</span>
          </div>
        </div>
      </div>`;
    }

    if (activeView === 'sources') {
      return `${renderSectionHeading('知识来源', '支持从回答引用一键定位到对应制度原文，快速核对版本。')}
      <div class="mt-5 rounded-xl border border-slate-800/80 bg-slate-900/85 p-5 sm:p-6 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <h3 class="text-sm font-bold text-white">《${preset.sourceTitle}》 · ${preset.sectionTitle}</h3>
          <span class="text-xs font-mono text-slate-400">${preset.sourceVersion}</span>
        </div>
        <h4 class="font-semibold text-slate-200 text-sm">${preset.docHeading}</h4>
        <p class="text-sm text-slate-400 leading-relaxed">${preset.docContext}</p>
        <blockquote class="rounded-lg bg-[#050814]/90 border-l-4 border-sky-400 px-4 py-3 text-sm text-slate-100 font-medium">
          “${preset.quote}”
        </blockquote>
        <div class="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>文档维护人：${preset.maintainer}</span>
          <button type="button" data-goto="overview" class="text-sky-400 font-semibold hover:underline">← 返回问答空间</button>
        </div>
      </div>`;
    }

    return `${renderSectionHeading('权限边界', '企业级知识助手必须遵循既有岗位权限与人工复核规范。')}
    <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
      <article class="rounded-xl bg-slate-900/85 border border-slate-800/80 p-4">
        <h3 class="text-sm font-bold text-white">按权限范围检索</h3>
        <p class="mt-1.5 text-xs text-slate-400 leading-relaxed">在服务端校验员工身份，仅检索其有权查阅的文档目录。</p>
      </article>
      <article class="rounded-xl bg-slate-900/85 border border-slate-800/80 p-4">
        <h3 class="text-sm font-bold text-white">依据不足直接提示</h3>
        <p class="mt-1.5 text-xs text-slate-400 leading-relaxed">找不到可靠依据或版本存在冲突时坦诚提示，避免编造回复。</p>
      </article>
      <article class="rounded-xl bg-slate-900/85 border border-slate-800/80 p-4">
        <h3 class="text-sm font-bold text-white">重要动作人工确认</h3>
        <p class="mt-1.5 text-xs text-slate-400 leading-relaxed">对外承诺、报价调整与业务系统写入，保留人工确认开关。</p>
      </article>
    </div>`;
  };

  const renderWorkflowView = (): string => {
    const preset = WORKFLOW_PRESETS[workflowPresetKey];
    const flowStatusLabels = ['待发起模拟', '材料已校验', '金额分支已匹配', `已送达：${preset.approverTitle}`];

    if (activeView === 'overview') {
      const presetButtons = (['small', 'large'] as const)
        .map((key) => {
          const item = WORKFLOW_PRESETS[key];
          const active = workflowPresetKey === key;
          return `<button type="button" data-wf-preset="${key}" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            active
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
          }">${item.label}</button>`;
        })
        .join('');

      const nodes = [
        { step: 1, title: '提交采购申请', detail: `${preset.itemTitle} · ${preset.amountText}` },
        { step: 2, title: '按金额判断路径', detail: `规则判定：${preset.ruleMatch}` },
        { step: 3, title: preset.approverTitle, detail: preset.approverRole }
      ];

      return `${renderSectionHeading(
        '流程画布',
        '切换不同申请金额档位，逐步模拟自动分发与人工审批过程。',
        `<span class="text-xs font-semibold ${flowStep === 3 ? 'text-amber-400' : 'text-sky-400'}">${flowStatusLabels[flowStep]}</span>`
      )}
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <span class="text-xs text-slate-400">切换申请金额：</span>
        ${presetButtons}
      </div>

      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        ${nodes
          .map((node) => {
            const done = flowStep > node.step || (flowStep === 3 && node.step < 3);
            const current = flowStep === node.step;
            return `<div class="rounded-xl border p-4 transition-colors ${
              current
                ? 'border-sky-400 bg-sky-500/15'
                : done
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-slate-800 bg-slate-900/80'
            }">
              <p class="text-[11px] font-semibold ${current ? 'text-sky-400' : done ? 'text-emerald-400' : 'text-slate-500'}">
                步骤 0${node.step} · ${done ? '已通过' : current ? '当前节点' : '待流转'}
              </p>
              <h3 class="mt-1.5 text-sm font-bold text-white">${node.title}</h3>
              <p class="mt-1 text-xs text-slate-400">${node.detail}</p>
            </div>`;
          })
          .join('')}
      </div>

      <div class="mt-5 rounded-xl bg-slate-900/85 border border-slate-800/80 p-4 flex flex-wrap items-center justify-between gap-4">
        <p class="text-sm text-slate-200">${
          [
            '点击右侧按钮，开始模拟该笔采购申请的流转判断。',
            '材料信息完整，下一步检查采购金额对应的审批规则。',
            `已匹配「${preset.ruleMatch}」，正在推送至「${preset.approverTitle}」。`,
            `已抵达人工审批节点（${preset.approverTitle}），等待负责人作出最终审批。`
          ][flowStep]
        }</p>
        <button type="button" id="flow-next" class="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors shrink-0">
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

      return `${renderSectionHeading('运行记录', '按顺序留存每一步规则判断与停留状态。')}
      <div class="mt-4 space-y-2.5">
        ${
          logs.length === 0
            ? `<div class="rounded-xl bg-slate-900/85 border border-slate-800/80 p-8 text-center">
                <p class="text-sm font-semibold text-white">暂无模拟记录</p>
                <p class="mt-1 text-xs text-slate-400">请回到「流程画布」点击开始模拟。</p>
                <button type="button" data-goto="overview" class="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold">前往流程画布 →</button>
              </div>`
            : logs
                .map(
                  (log, idx) => `<article class="rounded-xl bg-slate-900/85 border border-slate-800/80 p-4">
                    <p class="text-xs font-semibold text-sky-400">步骤 0${idx + 1}</p>
                    <h3 class="mt-0.5 text-sm font-bold text-white">${log.title}</h3>
                    <p class="mt-1 text-xs text-slate-400">${log.desc}</p>
                  </article>`
                )
                .join('')
        }
      </div>`;
    }

    return `${renderSectionHeading('规则配置', '示例金额路由规则（实际实施按组织制度配置）。')}
    <div class="mt-5 divide-y divide-slate-800/80 border border-slate-800/80 bg-slate-900/60 rounded-xl text-sm">
      <div class="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
        <span class="text-slate-300">申请金额 ≤ ¥5,000</span>
        <span class="font-semibold text-white">→ 部门负责人审批</span>
      </div>
      <div class="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
        <span class="text-slate-300">申请金额 ＞ ¥5,000</span>
        <span class="font-semibold text-white">→ 财务负责人审批</span>
      </div>
      <div class="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
        <span class="text-slate-300">字段或凭证缺失</span>
        <span class="font-semibold text-amber-400">→ 自动退回申请人补充</span>
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

    viewContainer.classList.remove('panel-morph-enter');
    void viewContainer.offsetWidth;
    viewContainer.classList.add('panel-morph-enter');
    enhanceInteractiveButtons(viewContainer);

    viewContainer.querySelectorAll<HTMLElement>('[data-goto]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.goto;
        if (target) selectView(target, true);
      });
    });

    viewContainer.querySelector('#task-toggle')?.addEventListener('click', () => {
      taskDone = !taskDone;
      showToast(taskDone ? '方案已确认，操作记录已实时同步' : '已重置为待确认演示状态');
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
        ? 'flex items-center justify-center lg:justify-start px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors bg-blue-600 text-white shadow-md shadow-blue-600/25'
        : 'flex items-center justify-center lg:justify-start px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors text-slate-300 hover:bg-slate-800/80 hover:text-white';
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

    // 联动 3D 粒子场形态
    const formIdx = conceptId === 'operations' ? 0 : conceptId === 'agent' ? 1 : 2;
    setParticleForm(formIdx);

    document.title = `${spec.name} · ${spec.subtitle} — 栗子软件科技`;
    if (syncUrl) {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('project', conceptId);
      window.history.replaceState(null, '', nextUrl);
    }

    switcherButtons.forEach((btn) => {
      const isCurrent = btn.dataset.conceptSwitch === conceptId;
      btn.className = isCurrent
        ? 'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors bg-blue-600 text-white shadow-lg shadow-blue-600/30'
        : 'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white';
    });

    setText('project-category', spec.categoryTag);
    scrambleText(document.getElementById('project-title'), `${spec.name} · ${spec.subtitle}`, 280);
    setText('project-description', spec.shortSummary);
    setText('demo-brand-icon', spec.name[0] ?? 'L');
    setText('demo-brand-name', spec.name);

    setText('context-title', spec.contextTitle);
    setText('context-copy', spec.contextBody);

    const stepsEl = document.getElementById('approach-steps');
    if (stepsEl) {
      stepsEl.innerHTML = spec.approachSteps
        .map(
          (step, idx) => `<div class="holo-card holo-surface rounded-2xl p-6">
            <span class="text-xs font-mono font-bold text-sky-400">STEP 0${idx + 1}</span>
            <h3 class="mt-2 text-lg font-bold text-white">${step.title}</h3>
            <p class="mt-2 text-sm text-slate-400 leading-relaxed">${step.detail}</p>
          </div>`
        )
        .join('');
      enhanceCardsAndTilt(stepsEl);
      initScrollReveals();
    }

    const scopeListEl = document.getElementById('scope-list');
    if (scopeListEl) {
      scopeListEl.innerHTML = spec.scopes
        .map(
          (row) => `<div class="flex items-start justify-between gap-4 py-3.5 border-b border-slate-800/80">
            <div>
              <h3 class="text-sm font-semibold text-white">${row.title}</h3>
              <p class="text-xs text-slate-400 mt-0.5">${row.detail}</p>
            </div>
            <span class="text-xs font-semibold shrink-0 ${row.includedInDemo ? 'text-emerald-400' : 'text-sky-400'}">
              ${row.includedInDemo ? '原型可体验' : '项目落地开发'}
            </span>
          </div>`
        )
        .join('');
    }

    const briefLink = document.getElementById('project-brief-link') as HTMLAnchorElement | null;
    if (briefLink) {
      briefLink.href = `about.html?service=${spec.serviceKey}#contact`;
    }

    const nextLink = document.getElementById('next-project-link') as HTMLAnchorElement | null;
    if (nextLink) {
      nextLink.href = `project.html?project=${nextSpec.id}`;
      nextLink.textContent = `体验：${nextSpec.name} · ${nextSpec.subtitle} →`;
    }

    tabsContainer.innerHTML = spec.tabs
      .map(
        (tab, i) => `<button type="button" role="tab" id="tab-${tab.id}" aria-selected="${i === 0}" aria-controls="demo-view" tabindex="${i === 0 ? '0' : '-1'}" data-view="${tab.id}">${tab.label}</button>`
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

initShell(0);
initProjectPage();
