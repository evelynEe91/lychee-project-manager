import { riskStyles, statusStyles, type WorkflowItem } from "@/lib/mock-data";

type WorkflowCardProps = {
  item: WorkflowItem;
};

export function WorkflowCard({ item }: WorkflowCardProps) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand">{item.id}</p>
          <h3 className="mt-1 text-lg font-bold text-ink">{item.name}</h3>
        </div>
        <div className="flex gap-2">
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
          >
            {item.status}
          </span>
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${riskStyles[item.riskLevel]}`}
          >
            风险 {item.riskLevel}
          </span>
        </div>
      </div>
      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="font-semibold text-ink">最新进展</dt>
          <dd className="mt-1 text-muted">{item.progress}</dd>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-ink">负责人</dt>
            <dd className="mt-1 text-muted">{item.owner}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">截止时间</dt>
            <dd className="mt-1 text-muted">{item.dueDate}</dd>
          </div>
        </div>
        <div>
          <dt className="font-semibold text-ink">风险</dt>
          <dd className="mt-1 text-muted">{item.risk}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">下一步动作</dt>
          <dd className="mt-1 text-muted">{item.nextAction}</dd>
        </div>
      </dl>
    </article>
  );
}
