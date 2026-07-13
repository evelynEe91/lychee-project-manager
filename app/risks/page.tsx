import { decisionItems, riskStyles, workflowItems } from "@/lib/mock-data";

export default function RisksPage() {
  const riskItems = workflowItems.filter((item) => item.riskLevel !== "低");

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <h3 className="text-lg font-bold text-ink">风险列表</h3>
        <div className="mt-5 space-y-4">
          {riskItems.map((item) => (
            <article key={item.id} className="rounded-lg border border-line bg-panel p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-brand">{item.id} {item.name}</p>
                  <p className="mt-2 text-sm leading-6 text-ink">{item.risk}</p>
                </div>
                <span
                  className={`w-fit rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${riskStyles[item.riskLevel]}`}
                >
                  {item.riskLevel}风险
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">
                负责人：{item.owner} · 处理动作：{item.nextAction}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <h3 className="text-lg font-bold text-ink">决策记录</h3>
        <div className="mt-5 space-y-4">
          {decisionItems.map((item) => (
            <article key={item.id} className="rounded-lg bg-panel p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-brand">{item.id}</span>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-muted">
                  {item.status}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-ink">
                {item.title}
              </p>
              <p className="mt-2 text-sm text-muted">
                来源：{item.source} · 负责人：{item.owner} · {item.date}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
