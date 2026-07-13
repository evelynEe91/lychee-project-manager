import {
  riskStyles,
  statusStyles,
  taskItems
} from "@/lib/mock-data";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h3 className="text-lg font-bold text-ink">任务列表</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              汇总 W01-W12 中提取出的下一步动作，第一版使用模拟数据展示。
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <select className="h-10 rounded-md border border-line bg-white px-3 text-sm text-muted outline-none focus:border-brand">
              <option>全部工作流</option>
              <option>W01-W12</option>
            </select>
            <select className="h-10 rounded-md border border-line bg-white px-3 text-sm text-muted outline-none focus:border-brand">
              <option>全部状态</option>
              <option>进行中</option>
              <option>有风险</option>
              <option>已完成</option>
            </select>
            <select className="h-10 rounded-md border border-line bg-white px-3 text-sm text-muted outline-none focus:border-brand">
              <option>全部负责人</option>
              <option>林悦</option>
              <option>陈航</option>
              <option>周敏</option>
            </select>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        <div className="hidden grid-cols-[110px_1.6fr_160px_110px_120px_110px] gap-4 border-b border-line bg-panel px-5 py-3 text-sm font-semibold text-muted lg:grid">
          <span>任务编号</span>
          <span>任务名称</span>
          <span>所属工作流</span>
          <span>负责人</span>
          <span>截止时间</span>
          <span>状态</span>
        </div>
        <div className="divide-y divide-line">
          {taskItems.map((task) => (
            <article
              key={task.id}
              className="grid gap-3 px-5 py-4 text-sm lg:grid-cols-[110px_1.6fr_160px_110px_120px_110px] lg:items-center lg:gap-4"
            >
              <span className="font-semibold text-brand">{task.id}</span>
              <div>
                <p className="font-semibold text-ink">{task.title}</p>
                <span
                  className={`mt-2 inline-flex rounded-md px-2 py-1 text-xs font-semibold ring-1 ${riskStyles[task.riskLevel]}`}
                >
                  {task.riskLevel}风险
                </span>
              </div>
              <span className="text-muted">{task.workflowId} {task.workflowName}</span>
              <span className="text-muted">{task.owner}</span>
              <span className="text-muted">{task.dueDate}</span>
              <span
                className={`w-fit rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[task.status]}`}
              >
                {task.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
