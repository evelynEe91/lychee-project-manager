import Link from "next/link";
import { notFound } from "next/navigation";
import {
  decisionItems,
  historyRecords,
  normalizedStatus,
  riskStyles,
  statusStyles,
  taskItems,
  workflowItems
} from "@/lib/mock-data";

export function generateStaticParams() {
  return workflowItems.map((item) => ({ id: item.id }));
}

export default async function WorkflowDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workflow = workflowItems.find((item) => item.id === id);

  if (!workflow) {
    notFound();
  }

  const tasks = taskItems.filter((item) => item.workflowId === workflow.id);
  const decisions = decisionItems.filter((item) => item.source === workflow.id);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link href="/board" className="text-sm font-semibold text-brand">
              返回工作流看板
            </Link>
            <p className="mt-4 text-sm font-bold text-brand">{workflow.id}</p>
            <h3 className="mt-1 text-2xl font-bold text-ink">{workflow.name}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
              工作流目标：{workflow.goal}
            </p>
          </div>
          <span
            className={`rounded-md px-3 py-1.5 text-sm font-semibold ${statusStyles[normalizedStatus(workflow.status)]}`}
          >
            {normalizedStatus(workflow.status)}
          </span>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Panel title="当前任务">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-lg bg-panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-ink">{task.title}</p>
                    <p className="mt-2 text-sm text-muted">
                      负责人：{task.owner} · 截止时间：{task.dueDate}
                    </p>
                  </div>
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[task.status]}`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </Panel>

          <Panel title="风险">
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-ink">{workflow.risk}</p>
                <span
                  className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${riskStyles[workflow.riskLevel]}`}
                >
                  {workflow.riskLevel}风险
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-red-800">
                建议动作：{workflow.nextAction}
              </p>
            </div>
          </Panel>

          <Panel title="历史会议更新">
            {historyRecords.slice(0, 3).map((record) => (
              <div key={record.title} className="rounded-lg bg-panel p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-ink">{record.title}</span>
                  <span className="text-muted">{record.date}</span>
                </div>
                <p className="mt-2 text-muted">操作人：{record.operator}</p>
              </div>
            ))}
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="基本信息">
            <dl className="space-y-3 text-sm">
              <Info label="负责人" value={workflow.owner} />
              <Info label="截止时间" value={workflow.dueDate} />
              <Info label="最近更新" value={workflow.updatedAt} />
              <Info label="工作流目标" value={workflow.goal} />
              <Info label="当前进展" value={workflow.progress} />
            </dl>
          </Panel>

          <Panel title="决策记录">
            {decisions.length === 0 ? (
              <p className="text-sm text-muted">暂无该工作流的决策记录。</p>
            ) : (
              decisions.map((item) => (
                <div key={item.id} className="rounded-lg bg-panel p-4 text-sm">
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="mt-2 text-muted">{item.date} · {item.status}</p>
                </div>
              ))
            )}
          </Panel>

          <Panel title="相关项目问答">
            <textarea
              rows={5}
              placeholder={`输入关于 ${workflow.id} 的问题，例如：当前风险是什么？`}
              className="w-full resize-none rounded-md border border-line px-3 py-3 text-sm outline-none focus:border-brand"
            />
            <button className="mt-3 h-10 w-full rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700">
              查询
            </button>
          </Panel>
        </aside>
      </section>
    </div>
  );
}

function Panel({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-muted">{label}</dt>
      <dd className="mt-1 leading-6 text-ink">{value}</dd>
    </div>
  );
}
