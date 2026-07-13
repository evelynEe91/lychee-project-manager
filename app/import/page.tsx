"use client";

import Link from "next/link";
import { useState } from "react";
import {
  analyzeMeetingNote,
  emptyAnalysis,
  formatLocalDateTime,
  MEETING_ANALYSIS_STORAGE_KEY,
  type MeetingAnalysis,
  type NewDecision,
  type NewRisk,
  type WeeklyMustDo,
  type WorkflowUpdate
} from "@/lib/meeting-analysis";
import { statusStyles, workflowItems, type WorkflowStatus } from "@/lib/mock-data";

const exampleMeetingNote = `会议日期：2026-07-15

参会人：张老师、李工、小王、陈同学、周老师、刘工、Annie

本次会议主要围绕 lycheeVoice2.0 第一阶段交付进展进行同步。

一、数据购买方面，张老师提到目前已经初步确定两家语音数据供应商，但授权证明还没有完全收齐。小王负责在 7 月 19 日前整理数据采购清单，并向供应商确认数据是否可以用于模型训练和后续商业化使用。这个问题如果没有按时确认，可能会影响第一阶段数据交付。

二、数据管线方案设计方面，李工表示基础音频处理管线的第一版方案已经完成，包括音频切分、去噪、ASR 转写、语种识别和质量过滤几个步骤。下一步需要在 7 月 22 日前补充字段定义和质检标准。当前状态为进行中。

三、数据处理方面，刘工反馈目前已经完成 20 万小时原始音频的初步清洗，但在影视剧音频中发现背景音和多人重叠说话的问题比较多，可能会影响训练数据质量。刘工下周会继续优化过滤规则，并输出一份数据质量报告。

四、表征实验方面，周老师提到 speaker embedding 和 emotion representation 的对比实验还没有正式开始，原因是实验数据样本还没有完全准备好。该部分目前状态为未启动，预计等数据样例集完成后再启动。

五、沐曦 GPU 适配方面，李工反馈训练脚本已经可以在沐曦 GPU 环境上启动，但部分算子仍然存在兼容问题，训练速度也低于预期。这个问题可能影响预训练启动时间。李工负责在 7 月 25 日前整理问题清单，并和硬件支持团队沟通。

六、预训练方面，张老师决定先不启动大规模预训练，等数据管线和 GPU 适配稳定后再开始。当前预训练阶段状态为规划中，下一步是确认 baseline 模型结构和训练配置。

七、后训练方面，目前还没有进入正式执行阶段，但会议中讨论了后续需要支持情绪控制、音色克隆和副语言生成能力。陈同学负责先整理后训练能力需求清单，截止时间是 7 月 26 日。

八、Benchmark 与评测方面，周老师提出第一阶段必须尽快确认自动评测指标，包括 WER、CER、MOS、Speaker Similarity 和 RTF。Annie 负责在 7 月 23 日前整理一版 Benchmark 指标表，并标注哪些指标用于合同验收，哪些指标用于内部研发对比。

九、工程化与推理服务方面，刘工提到 Demo 服务的前端页面还没有开始，但推理接口可以先做一个内部测试版本。刘工负责在 8 月初前完成一个基础推理 API，供团队内部测试使用。

十、合同与验收管理方面，张老师提醒合同中仍然存在 2027 年 2 月 30 日这个无效日期，乙方主体信息和银行账户也还没有补齐。这个问题属于高优先级风险，可能影响合同生效和后续付款。小王负责整理合同修订问题清单，截止时间是 7 月 18 日。

十一、论文与技术成果方面，会议中提到第二阶段需要跟踪 3 篇论文成果，其中至少 1 篇需要达到 CCF-A 级别。但目前论文选题、作者顺序和目标会议都没有确定。周老师建议先把论文成果单独作为 W11 工作流管理，避免后续影响第二阶段验收。

十二、项目治理方面，张老师决定从本周开始建立固定周会机制，每周五下午同步项目进展。陈同学负责维护会议纪要、风险登记表和每周项目周报。每次会议后，需要把新增任务、风险和决策更新到项目管理网页中。

本次新增风险：
1. 数据授权证明未收齐，可能影响数据合法使用和第一阶段交付。
2. 沐曦 GPU 算子兼容问题可能影响预训练启动。
3. 合同日期无效和乙方信息缺失可能影响合同生效和付款。
4. 论文成果不可控，可能影响第二阶段验收。

本次新增决策：
1. 暂缓大规模预训练，等数据管线和 GPU 适配稳定后再启动。
2. 从本周开始建立固定周会机制。
3. W11 论文与技术成果需要单独作为工作流持续跟踪。
4. 第一阶段 Benchmark 指标需要先区分合同验收指标和内部研发指标。

本周必须完成：
1. 小王整理数据采购清单和合同修订问题清单。
2. 李工补充数据管线字段定义，并整理 GPU 适配问题。
3. Annie 整理 Benchmark 指标表。
4. 陈同学维护会议纪要和项目周报。`;

const statusOptions: WorkflowStatus[] = [
  "未启动",
  "规划中",
  "进行中",
  "有风险",
  "待验收",
  "已完成"
];

export default function ImportPage() {
  const [note, setNote] = useState("");
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);

  const hasAnalysis = Boolean(analysis);

  const saveAnalysis = (nextAnalysis = analysis) => {
    if (!nextAnalysis) return;
    const withFreshTime = {
      ...nextAnalysis,
      meeting: {
        ...nextAnalysis.meeting,
        generated_at: formatLocalDateTime()
      }
    };
    setAnalysis(withFreshTime);
    window.localStorage.setItem(
      MEETING_ANALYSIS_STORAGE_KEY,
      JSON.stringify(withFreshTime)
    );
  };

  const runAnalysis = () => {
    const nextAnalysis = analyzeMeetingNote(note.trim() || exampleMeetingNote);
    setAnalysis(nextAnalysis);
    window.localStorage.setItem(
      MEETING_ANALYSIS_STORAGE_KEY,
      JSON.stringify(nextAnalysis)
    );
  };

  const updateMeeting = (
    field: keyof MeetingAnalysis["meeting"],
    value: string
  ) => {
    setAnalysis((current) => {
      const base = current ?? emptyAnalysis();
      return {
        ...base,
        meeting: {
          ...base.meeting,
          [field]: field === "participants" ? splitParticipants(value) : value
        }
      };
    });
  };

  const updateWorkflow = (
    index: number,
    field: keyof WorkflowUpdate,
    value: string | boolean
  ) => {
    setAnalysis((current) => {
      if (!current) return current;
      return {
        ...current,
        workflow_updates: current.workflow_updates.map((item, itemIndex) => {
          if (itemIndex !== index) return item;
          if (field === "workflow_id") {
            const workflow = workflowItems.find((entry) => entry.id === value);
            return {
              ...item,
              workflow_id: String(value),
              workflow_name: workflow?.name ?? item.workflow_name
            };
          }
          return { ...item, [field]: value };
        })
      };
    });
  };

  const updateRisk = (
    index: number,
    field: keyof NewRisk,
    value: string | boolean
  ) => {
    setAnalysis((current) =>
      current
        ? {
            ...current,
            new_risks: current.new_risks.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [field]: value } : item
            )
          }
        : current
    );
  };

  const updateDecision = (
    index: number,
    field: keyof NewDecision,
    value: string
  ) => {
    setAnalysis((current) =>
      current
        ? {
            ...current,
            new_decisions: current.new_decisions.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [field]: value } : item
            )
          }
        : current
    );
  };

  const updateTask = (index: number, field: keyof WeeklyMustDo, value: string) => {
    setAnalysis((current) =>
      current
        ? {
            ...current,
            weekly_must_do: current.weekly_must_do.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [field]: value } : item
            )
          }
        : current
    );
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(360px,2fr)]">
        <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
          <div className="mb-5 border-b border-line pb-5">
            <h3 className="text-lg font-bold text-ink">粘贴完整会议纪要</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              用户只需要粘贴完整会议纪要，系统将自动提取会议信息、工作流更新、风险、决策和本周任务。
            </p>
          </div>

          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={22}
            placeholder="请粘贴包含会议日期、参会人、工作流更新、风险、决策和本周任务的完整会议纪要"
            className="w-full resize-y rounded-md border border-line px-3 py-3 text-sm leading-6 outline-none focus:border-brand"
          />

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={runAnalysis}
              className="h-10 rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              AI 分析并生成结构化结果
            </button>
            <button
              type="button"
              onClick={() => {
                setNote(exampleMeetingNote);
                setAnalysis(null);
              }}
              className="h-10 rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink hover:bg-panel"
            >
              示例内容
            </button>
            <button
              type="button"
              onClick={() => {
                setNote("");
                setAnalysis(null);
              }}
              className="h-10 rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink hover:bg-panel"
            >
              清空内容
            </button>
          </div>

          {hasAnalysis && analysis && (
            <div className="mt-6 rounded-lg border border-line bg-panel p-4">
              <h4 className="font-bold text-ink">自动提取的会议信息</h4>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <EditableField
                  label="会议日期"
                  value={analysis.meeting.date}
                  onChange={(value) => updateMeeting("date", value)}
                />
                <EditableField
                  label="会议时间"
                  value={analysis.meeting.time}
                  onChange={(value) => updateMeeting("time", value)}
                />
                <EditableField
                  label="参会人"
                  value={analysis.meeting.participants.join("、")}
                  onChange={(value) => updateMeeting("participants", value)}
                />
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-lg border border-line bg-white p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
            <div>
              <h3 className="text-lg font-bold text-ink">AI 分析结果</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                所有提取结果都可以编辑、删除、新增，并保存给周报生成使用。
              </p>
            </div>
            <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-brand">
              模拟
            </span>
          </div>

          {!hasAnalysis || !analysis ? (
            <div className="mt-6 flex min-h-80 items-center justify-center rounded-lg border border-dashed border-line bg-panel p-6 text-center">
              <div>
                <p className="text-base font-semibold text-ink">暂无 AI 分析结果</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                  粘贴会议纪要后点击“AI 分析并生成结构化结果”，这里会显示可编辑的工作流更新、风险、决策和本周任务。
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <ResultSection
                title="工作流更新"
                onAdd={() =>
                  setAnalysis({
                    ...analysis,
                    workflow_updates: [
                      ...analysis.workflow_updates,
                      {
                        workflow_id: "W01",
                        workflow_name: "数据购买",
                        progress: "",
                        owner: "待确认",
                        deadline: "待确认",
                        risk: "待确认",
                        next_action: "",
                        status: "进行中",
                        affects_phase_one: false
                      }
                    ]
                  })
                }
              >
                {analysis.workflow_updates.map((item, index) => (
                  <article key={`${item.workflow_id}-${index}`} className="rounded-lg border border-line bg-panel p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-brand">{item.workflow_id}</p>
                        <h4 className="mt-1 text-base font-bold text-ink">
                          {item.workflow_name}
                        </h4>
                      </div>
                      <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3">
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        所属工作流
                        <select
                          value={item.workflow_id}
                          onChange={(event) => updateWorkflow(index, "workflow_id", event.target.value)}
                          className="h-10 rounded-md border border-line bg-white px-3 font-normal outline-none focus:border-brand"
                        >
                          {workflowItems.map((workflow) => (
                            <option key={workflow.id} value={workflow.id}>
                              {workflow.id} {workflow.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <EditableField label="当前进展" value={item.progress} onChange={(value) => updateWorkflow(index, "progress", value)} />
                      <div className="grid gap-3 md:grid-cols-2">
                        <EditableField label="责任人" value={item.owner} onChange={(value) => updateWorkflow(index, "owner", value)} />
                        <EditableField label="截止时间" value={item.deadline} onChange={(value) => updateWorkflow(index, "deadline", value)} />
                      </div>
                      <EditableField label="阻塞 / 风险" value={item.risk} onChange={(value) => updateWorkflow(index, "risk", value)} />
                      <EditableField label="下一步动作" value={item.next_action} onChange={(value) => updateWorkflow(index, "next_action", value)} />
                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          当前状态
                          <select
                            value={item.status}
                            onChange={(event) => updateWorkflow(index, "status", event.target.value)}
                            className="h-10 rounded-md border border-line bg-white px-3 font-normal outline-none focus:border-brand"
                          >
                            {statusOptions.map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                        </label>
                        <label className="flex items-center justify-between rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink">
                          影响第一阶段交付
                          <input
                            type="checkbox"
                            checked={item.affects_phase_one}
                            onChange={(event) => updateWorkflow(index, "affects_phase_one", event.target.checked)}
                            className="h-4 w-4 accent-blue-700"
                          />
                        </label>
                      </div>
                    </div>
                    <DeleteButton onClick={() => setAnalysis({ ...analysis, workflow_updates: removeAt(analysis.workflow_updates, index) })} />
                  </article>
                ))}
              </ResultSection>

              <ResultSection
                title="本次新增风险"
                onAdd={() =>
                  setAnalysis({
                    ...analysis,
                    new_risks: [
                      ...analysis.new_risks,
                      {
                        risk: "",
                        workflow_id: "W01",
                        workflow_name: "数据购买",
                        evidence: "",
                        impact: "",
                        owner: "待确认",
                        mitigation: "",
                        severity: "中",
                        affects_phase_one: false
                      }
                    ]
                  })
                }
              >
                {analysis.new_risks.map((item, index) => (
                  <article key={`${item.workflow_id}-${index}`} className="rounded-lg border border-line bg-panel p-4">
                    <EditableField label="风险内容" value={item.risk} onChange={(value) => updateRisk(index, "risk", value)} />
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <EditableField label="所属工作流" value={item.workflow_id} onChange={(value) => updateRisk(index, "workflow_id", value)} />
                      <EditableField label="工作流名称" value={item.workflow_name} onChange={(value) => updateRisk(index, "workflow_name", value)} />
                    </div>
                    <div className="mt-3 grid gap-3">
                      <EditableField label="原文依据" value={item.evidence} onChange={(value) => updateRisk(index, "evidence", value)} />
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <EditableField label="责任人" value={item.owner} onChange={(value) => updateRisk(index, "owner", value)} />
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        等级
                        <select
                          value={item.severity}
                          onChange={(event) => updateRisk(index, "severity", event.target.value)}
                          className="h-10 rounded-md border border-line bg-white px-3 font-normal outline-none focus:border-brand"
                        >
                          <option>高</option>
                          <option>中</option>
                          <option>低</option>
                        </select>
                      </label>
                    </div>
                    <div className="mt-3 grid gap-3">
                      <EditableField label="影响" value={item.impact} onChange={(value) => updateRisk(index, "impact", value)} />
                      <EditableField label="应对方式" value={item.mitigation} onChange={(value) => updateRisk(index, "mitigation", value)} />
                      <label className="flex items-center justify-between rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink">
                        影响第一阶段
                        <input
                          type="checkbox"
                          checked={item.affects_phase_one}
                          onChange={(event) => updateRisk(index, "affects_phase_one", event.target.checked)}
                          className="h-4 w-4 accent-blue-700"
                        />
                      </label>
                    </div>
                    <DeleteButton onClick={() => setAnalysis({ ...analysis, new_risks: removeAt(analysis.new_risks, index) })} />
                  </article>
                ))}
              </ResultSection>

              <ResultSection
                title="本次新增决策"
                onAdd={() =>
                  setAnalysis({
                    ...analysis,
                    new_decisions: [
                      ...analysis.new_decisions,
                      {
                        decision: "",
                        background: "",
                        impact_scope: "",
                        decision_maker: "待确认",
                        date: analysis.meeting.date
                      }
                    ]
                  })
                }
              >
                {analysis.new_decisions.map((item, index) => (
                  <article key={`${item.decision}-${index}`} className="rounded-lg border border-line bg-panel p-4">
                    <EditableField label="决策内容" value={item.decision} onChange={(value) => updateDecision(index, "decision", value)} />
                    <div className="mt-3 grid gap-3">
                      <EditableField label="背景" value={item.background} onChange={(value) => updateDecision(index, "background", value)} />
                      <EditableField label="影响范围" value={item.impact_scope} onChange={(value) => updateDecision(index, "impact_scope", value)} />
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <EditableField label="决策人" value={item.decision_maker} onChange={(value) => updateDecision(index, "decision_maker", value)} />
                      <EditableField label="日期" value={item.date} onChange={(value) => updateDecision(index, "date", value)} />
                    </div>
                    <DeleteButton onClick={() => setAnalysis({ ...analysis, new_decisions: removeAt(analysis.new_decisions, index) })} />
                  </article>
                ))}
              </ResultSection>

              <ResultSection
                title="本周必须完成"
                onAdd={() =>
                  setAnalysis({
                    ...analysis,
                    weekly_must_do: [
                      ...analysis.weekly_must_do,
                      { task: "", owner: "待确认", deadline: "待确认" }
                    ]
                  })
                }
              >
                {analysis.weekly_must_do.map((item, index) => (
                  <article key={`${item.task}-${index}`} className="rounded-lg border border-line bg-panel p-4">
                    <EditableField label="任务" value={item.task} onChange={(value) => updateTask(index, "task", value)} />
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <EditableField label="负责人" value={item.owner} onChange={(value) => updateTask(index, "owner", value)} />
                      <EditableField label="截止时间" value={item.deadline} onChange={(value) => updateTask(index, "deadline", value)} />
                    </div>
                    <DeleteButton onClick={() => setAnalysis({ ...analysis, weekly_must_do: removeAt(analysis.weekly_must_do, index) })} />
                  </article>
                ))}
              </ResultSection>
            </div>
          )}
        </aside>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="h-10 rounded-md border border-line bg-white px-4 py-2 text-center text-sm font-semibold text-ink hover:bg-panel"
        >
          返回
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveAnalysis()}
            className="h-10 rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink hover:bg-panel"
          >
            保存修改
          </button>
          <Link
            href="/weekly-report"
            onClick={() => saveAnalysis()}
            className="h-10 rounded-md bg-brand px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
          >
            确认并生成周报
          </Link>
        </div>
      </section>
    </div>
  );
}

function EditableField({
  label,
  value,
  placeholder,
  onChange
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-md border border-line bg-white px-3 font-normal outline-none focus:border-brand"
      />
    </label>
  );
}

function ResultSection({
  title,
  onAdd,
  children
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-bold text-ink">{title}</h4>
        <button
          type="button"
          onClick={onAdd}
          className="h-8 rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink hover:bg-slate-50"
        >
          新增一条
        </button>
      </div>
      {children}
    </section>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="mt-4 flex justify-end">
      <button
        type="button"
        onClick={onClick}
        className="h-9 rounded-md border border-red-200 bg-white px-3 text-sm font-semibold text-red-700 hover:bg-red-50"
      >
        删除
      </button>
    </div>
  );
}

function removeAt<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

function splitParticipants(value: string) {
  const participants = value
    .split(/[、,，\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return participants;
}
