import { historyRecords } from "@/lib/mock-data";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <h3 className="text-lg font-bold text-ink">历史记录</h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          汇总会议导入、看板更新、任务变更和周报生成记录。第一版使用模拟数据。
        </p>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="space-y-4">
          {historyRecords.map((record) => (
            <article
              key={`${record.type}-${record.title}`}
              className="flex flex-col gap-3 rounded-lg bg-panel p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-brand">
                  {record.type}
                </span>
                <p className="mt-3 font-semibold text-ink">{record.title}</p>
              </div>
              <p className="text-sm text-muted">
                {record.date} · 操作人：{record.operator}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
