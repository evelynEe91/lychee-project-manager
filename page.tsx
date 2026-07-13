import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import {
  normalizedStatus,
  owners,
  statusStyles,
  workflowItems
} from "@/lib/mock-data";

export default function BoardPage() {
  const activeCount = workflowItems.filter(
    (item) => normalizedStatus(item.status) === "进行中"
  ).length;
  const riskCount = workflowItems.filter(
    (item) => normalizedStatus(item.status) === "有风险"
  ).length;
  const doneCount = workflowItems.filter(
    (item) => normalizedStatus(item.status) === "已完成"
  ).length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="总事项数" value={workflowItems.length} />
        <StatCard label="正常推进" value={activeCount} tone="blue" />
        <StatCard label="有风险" value={riskCount} tone="red" />
        <StatCard label="已完成" value={doneCount} tone="green" />
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h3 className="text-lg font-bold text-ink">W01-W12 工作流</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              点击卡片查看目标、任务、风险、历史会议更新、决策记录和项目问答。
            </p>
          </div>
          <Link
            href="/weekly-report"
            className="h-10 rounded-md bg-brand px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
          >
            生成本周周报
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <label className="grid gap-2 text-sm font-semibold text-ink">
            工作流
            <select className="h-10 rounded-md border border-line bg-white px-3 font-normal text-muted outline-none focus:border-brand">
              <option>全部工作流</option>
              {workflowItems.map((item) => (
                <option key={item.id}>{`${item.id} ${item.name}`}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            状态
            <select className="h-10 rounded-md border border-line bg-white px-3 font-normal text-muted outline-none focus:border-brand">
              <option>全部状态</option>
              <option>未启动</option>
              <option>规划中</option>
              <option>进行中</option>
              <option>有风险</option>
              <option>待验收</option>
              <option>已完成</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            风险等级
            <select className="h-10 rounded-md border border-line bg-white px-3 font-normal text-muted outline-none focus:border-brand">
              <option>全部风险</option>
              <option>低</option>
              <option>中</option>
              <option>高</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            负责人
            <select className="h-10 rounded-md border border-line bg-white px-3 font-normal text-muted outline-none focus:border-brand">
              <option>全部负责人</option>
              {owners.map((owner) => (
                <option key={owner}>{owner}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {workflowItems.map((item) => (
          <Link
            key={item.id}
            href={`/board/${item.id}`}
            className="rounded-lg border border-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-brand">{item.id}</p>
                <h3 className="mt-1 text-lg font-bold text-ink">{item.name}</h3>
              </div>
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[normalizedStatus(item.status)]}`}
              >
                {normalizedStatus(item.status)}
              </span>
            </div>
            <dl className="mt-4 grid gap-3 text-sm">
              <CardInfo label="目标" value={item.goal} />
              <CardInfo label="最新进展" value={item.progress} />
              <div className="grid gap-3 sm:grid-cols-2">
                <CardInfo label="负责人" value={item.owner} />
                <CardInfo label="截止时间" value={item.dueDate} />
              </div>
              <CardInfo label="风险" value={item.risk} />
              <CardInfo label="下一步动作" value={item.nextAction} />
            </dl>
          </Link>
        ))}
      </section>
    </div>
  );
}

function CardInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-ink">{label}</dt>
      <dd className="mt-1 leading-6 text-muted">{value}</dd>
    </div>
  );
}
