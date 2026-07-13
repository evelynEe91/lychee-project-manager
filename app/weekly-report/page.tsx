"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  emptyAnalysis,
  formatLocalDateTime,
  MEETING_ANALYSIS_STORAGE_KEY,
  type MeetingAnalysis
} from "@/lib/meeting-analysis";

export default function WeeklyReportPage() {
  const [{ analysis, loadedFromMeeting }] = useState(readStoredAnalysis);

  const summary = useMemo(() => buildSummary(analysis), [analysis]);
  const focusItems = useMemo(() => buildFocusItems(analysis), [analysis]);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-lg border border-line bg-white p-6 shadow-soft">
          <div className="mb-6 border-b border-line pb-5">
            <p className="text-sm font-semibold text-brand">周报内容预览</p>
            <h3 className="mt-2 text-2xl font-bold text-ink">
              lycheeVoice2.0 项目周报
            </h3>
            <p className="mt-3 text-sm text-muted">
              根据会议纪要结构化结果自动生成
            </p>
          </div>

          <div className="space-y-7">
            <ReportBlock title="一、会议信息">
              <InfoList
                items={[
                  ["会议日期", analysis.meeting.date || "待确认"],
                  ["会议时间", analysis.meeting.time || "未提及"],
                  ["参会人", participantText(analysis.meeting.participants)],
                  ["周报生成时间", analysis.meeting.generated_at || formatLocalDateTime()]
                ]}
              />
            </ReportBlock>

            <ReportBlock title="二、本周总体情况">
              <ul className="space-y-2">
                {summary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ReportBlock>

            <ReportBlock title="三、按工作流更新">
              {analysis.workflow_updates.length === 0 ? (
                <EmptyLine text="暂无工作流更新，请先在会议纪要页完成 AI 分析。" />
              ) : (
                <div className="space-y-5">
                  {analysis.workflow_updates.map((item) => (
                    <section key={`${item.workflow_id}-${item.workflow_name}`} className="rounded-lg border border-line bg-panel p-4">
                      <h4 className="font-bold text-ink">
                        {item.workflow_id} {item.workflow_name}
                      </h4>
                      <InfoList
                        items={[
                          ["当前进展", item.progress],
                          ["责任人", item.owner],
                          ["截止时间", item.deadline],
                          ["风险 / 阻塞", item.risk],
                          ["下一步", item.next_action],
                          ["是否影响第一阶段交付", item.affects_phase_one ? "是" : "否"]
                        ]}
                      />
                    </section>
                  ))}
                </div>
              )}
            </ReportBlock>

            <ReportBlock title="四、本次新增风险">
              {analysis.new_risks.length === 0 ? (
                <EmptyLine text="本次会议未识别到明确风险，请人工确认。" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-[1120px] w-full border-separate border-spacing-0 text-left text-sm">
                    <thead>
                      <tr className="bg-panel text-muted">
                        <TableHead>风险</TableHead>
                        <TableHead>所属工作流</TableHead>
                        <TableHead>原文依据</TableHead>
                        <TableHead>影响</TableHead>
                        <TableHead>责任人</TableHead>
                        <TableHead>应对</TableHead>
                        <TableHead>等级</TableHead>
                        <TableHead>是否影响第一阶段</TableHead>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.new_risks.map((risk, index) => (
                        <tr key={`${risk.risk}-${index}`} className="align-top">
                          <TableCell>{risk.risk}</TableCell>
                          <TableCell>{risk.workflow_id} {risk.workflow_name}</TableCell>
                          <TableCell>{risk.evidence}</TableCell>
                          <TableCell>{risk.impact}</TableCell>
                          <TableCell>{risk.owner}</TableCell>
                          <TableCell>{risk.mitigation}</TableCell>
                          <TableCell>{risk.severity}</TableCell>
                          <TableCell>{risk.affects_phase_one ? "是" : "否"}</TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ReportBlock>

            <ReportBlock title="五、本次新增决策">
              {analysis.new_decisions.length === 0 ? (
                <EmptyLine text="暂无新增决策。" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-[760px] w-full border-separate border-spacing-0 text-left text-sm">
                    <thead>
                      <tr className="bg-panel text-muted">
                        <TableHead>决策</TableHead>
                        <TableHead>背景</TableHead>
                        <TableHead>影响范围</TableHead>
                        <TableHead>决策人</TableHead>
                        <TableHead>日期</TableHead>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.new_decisions.map((decision, index) => (
                        <tr key={`${decision.decision}-${index}`} className="align-top">
                          <TableCell>{decision.decision}</TableCell>
                          <TableCell>{decision.background}</TableCell>
                          <TableCell>{decision.impact_scope}</TableCell>
                          <TableCell>{decision.decision_maker}</TableCell>
                          <TableCell>{decision.date}</TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ReportBlock>

            <ReportBlock title="六、本周必须完成">
              {analysis.weekly_must_do.length === 0 ? (
                <EmptyLine text="暂无本周必须完成事项。" />
              ) : (
                <ul className="space-y-2">
                  {analysis.weekly_must_do.map((task, index) => (
                    <li key={`${task.task}-${index}`}>
                      <span className="font-mono">[ ]</span> {task.task}
                      <span className="text-muted"> 负责人：{task.owner} 截止时间：{task.deadline}</span>
                    </li>
                  ))}
                </ul>
              )}
            </ReportBlock>

            <ReportBlock title="七、下周关注重点">
              <ul className="space-y-2">
                {focusItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ReportBlock>
          </div>
        </article>

        <aside className="space-y-4">
          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h3 className="text-lg font-bold text-ink">生成状态</h3>
            <div className="mt-4 space-y-3 text-sm">
              <StatusRow label="来源" value={loadedFromMeeting ? "会议纪要分析结果" : "暂无已保存分析结果"} />
              <StatusRow label="会议日期" value={analysis.meeting.date || "待确认"} />
              <StatusRow label="会议时间" value={analysis.meeting.time || "未提及"} />
              <StatusRow label="生成时间" value={analysis.meeting.generated_at || formatLocalDateTime()} />
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h3 className="text-lg font-bold text-ink">内容统计</h3>
            <div className="mt-4 space-y-3 text-sm">
              <StatusRow label="工作流更新" value={`${analysis.workflow_updates.length} 条`} />
              <StatusRow label="新增风险" value={`${analysis.new_risks.length} 条`} />
              <StatusRow label="新增决策" value={`${analysis.new_decisions.length} 条`} />
              <StatusRow label="本周必须完成" value={`${analysis.weekly_must_do.length} 项`} />
            </div>
          </div>

          <Link
            href="/import"
            className="block h-10 rounded-md border border-line bg-white px-4 py-2 text-center text-sm font-semibold text-ink hover:bg-panel"
          >
            返回修改
          </Link>
        </aside>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-soft sm:flex-row sm:justify-end">
        <button className="h-10 rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink hover:bg-panel">
          复制周报
        </button>
        <button className="h-10 rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700">
          保存
        </button>
        <Link
          href="/import"
          className="h-10 rounded-md border border-line bg-white px-4 py-2 text-center text-sm font-semibold text-ink hover:bg-panel"
        >
          返回修改
        </Link>
      </section>
    </div>
  );
}

function buildSummary(analysis: MeetingAnalysis) {
  const workflows = analysis.workflow_updates
    .map((item) => `${item.workflow_id} ${item.workflow_name}`)
    .slice(0, 5)
    .join("、");
  const risks = analysis.new_risks.map((item) => item.risk).slice(0, 2).join("、");
  const affects = analysis.workflow_updates.some((item) => item.affects_phase_one);

  return [
    workflows
      ? `本周主要推进了 ${workflows} 等工作流。`
      : "本周暂无已保存的工作流更新。",
    risks ? `当前主要风险包括：${risks}。` : "当前未识别到新增风险。",
    affects
      ? "已有事项可能影响第一阶段交付，需要优先跟进。"
      : "暂未标记影响第一阶段交付的事项。"
  ];
}

function readStoredAnalysis() {
  if (typeof window === "undefined") {
    return { analysis: emptyAnalysis(), loadedFromMeeting: false };
  }

  const raw = window.localStorage.getItem(MEETING_ANALYSIS_STORAGE_KEY);
  if (!raw) {
    return { analysis: emptyAnalysis(), loadedFromMeeting: false };
  }

  try {
    const parsed = JSON.parse(raw) as MeetingAnalysis;
    return {
      analysis: {
        ...parsed,
        meeting: {
          ...parsed.meeting,
          participants: Array.isArray(parsed.meeting.participants)
            ? parsed.meeting.participants.filter((item) => item && item !== "待确认")
            : [],
          generated_at: formatLocalDateTime()
        },
        new_risks: (parsed.new_risks ?? []).map((risk) => ({
          risk: risk.risk,
          workflow_id: risk.workflow_id,
          workflow_name: risk.workflow_name || "",
          evidence: risk.evidence || risk.risk,
          impact: risk.impact,
          owner: risk.owner,
          mitigation: risk.mitigation,
          severity: risk.severity || "中",
          affects_phase_one: Boolean(risk.affects_phase_one)
        }))
      },
      loadedFromMeeting: true
    };
  } catch {
    return { analysis: emptyAnalysis(), loadedFromMeeting: false };
  }
}

function buildFocusItems(analysis: MeetingAnalysis) {
  const fromActions = analysis.workflow_updates
    .map((item) => `${item.workflow_id} ${item.next_action}`)
    .filter(Boolean)
    .slice(0, 5);

  if (fromActions.length > 0) return fromActions;

  return [
    "补充会议纪要分析结果后自动生成关注重点。",
    "优先确认风险、决策和本周必须完成事项。"
  ];
}

function participantText(participants: string[]) {
  if (!participants || participants.length === 0) return "待确认";
  return participants.join("、");
}

function ReportBlock({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <div className="mt-3 text-sm leading-7 text-ink">{children}</div>
    </section>
  );
}

function InfoList({ items }: { items: Array<[string, string]> }) {
  return (
    <dl className="mt-3 grid gap-3">
      {items.map(([label, value]) => (
        <div key={label} className="grid gap-1 sm:grid-cols-[160px_1fr]">
          <dt className="font-semibold text-muted">{label}</dt>
          <dd className="text-ink">{value || "待确认"}</dd>
        </div>
      ))}
    </dl>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <p className="rounded-lg bg-panel p-4 text-sm text-muted">{text}</p>;
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-panel px-3 py-3">
      <span className="text-muted">{label}</span>
      <span className="text-right font-semibold text-ink">{value}</span>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="border-b border-line px-3 py-3 font-semibold">{children}</th>;
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="border-b border-line px-3 py-3 leading-6">{children}</td>;
}
