import { workflowItems } from "@/lib/mock-data";

export default function QaPage() {
  const w11 = workflowItems.find((item) => item.id === "W11");

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section className="rounded-lg border border-line bg-white p-6 shadow-soft">
        <h3 className="text-lg font-bold text-ink">项目问答</h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          第一版仅展示项目问答交互入口，不连接真实 AI 或检索服务。
        </p>
        <div className="mt-6 rounded-lg border border-line bg-panel p-4">
          <label className="grid gap-2 text-sm font-semibold text-ink">
            输入问题
            <textarea
              rows={7}
              defaultValue="请查询 W11 的任务、进展、风险和历史记录。"
              className="resize-none rounded-md border border-line bg-white px-3 py-3 font-normal leading-6 outline-none focus:border-brand"
            />
          </label>
          <button className="mt-4 h-10 rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-700">
            查询
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5">
          <p className="font-semibold text-ink">模拟回答</p>
          <p className="mt-3 text-sm leading-7 text-blue-900">
            W11 用户验收准备当前为未启动，负责人是 {w11?.owner}，截止时间为 {w11?.dueDate}。当前任务是根据第一版原型补充验收项。风险为：{w11?.risk}
          </p>
        </div>
      </section>

      <aside className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <h3 className="text-lg font-bold text-ink">推荐问题</h3>
        <div className="mt-4 space-y-3">
          {[
            "W03 当前最大的风险是什么？",
            "本周有哪些任务即将到期？",
            "W05 下一步动作是什么？",
            "请汇总所有高风险事项。"
          ].map((question) => (
            <button
              key={question}
              className="block w-full rounded-lg border border-line bg-panel px-4 py-3 text-left text-sm font-semibold text-ink hover:border-blue-200 hover:bg-blue-50"
            >
              {question}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
