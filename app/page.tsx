import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { workflowItems } from "@/lib/mock-data";

const projectInfo = [
  { label: "项目名称", value: "lycheeVoice2.0 训练项目" },
  { label: "项目类型", value: "TTS / 语音大模型训练项目" },
  { label: "项目状态", value: "已立项 / 待细化" },
  { label: "项目负责人", value: "待确认" },
  { label: "项目经理", value: "Codex" },
  { label: "创建日期", value: "2026-06-26" },
  { label: "当前阶段", value: "项目建档与目标澄清" }
];

const coreGoals = [
  "明确 lycheeVoice2.0 的模型训练目标、能力边界和验收指标。",
  "建立稳定的数据构建、训练、评测、推理和迭代流程。",
  "形成可用于内部研发、产品展示、客户试用或商业化包装的模型成果。",
  "按合同要求完成面向影视剧配音、多语种、情感可控、时长可控的新一代 TTS 大模型交付。",
  "建成语音 Benchmark 体系，用于识别准确率、生成自然度、说话人相似度、音质失真和实时率等指标评估。"
];

const projectMilestones = [
  {
    id: "M0",
    name: "项目定义",
    goal: "明确训练目标、资源、时间线",
    output: "项目章程 / 目标清单",
    status: "进行中"
  },
  {
    id: "M1",
    name: "数据准备",
    goal: "完成数据来源、格式、清洗和标注方案",
    output: "数据方案 / 样例数据集",
    status: "待启动"
  },
  {
    id: "M2",
    name: "基线模型",
    goal: "完成首个可跑通训练链路",
    output: "Baseline 模型 / 初版评测结果",
    status: "待启动"
  },
  {
    id: "M3",
    name: "能力增强",
    goal: "提升自然度、稳定性和可控性",
    output: "v0.5 模型 / 对比评测",
    status: "待启动"
  },
  {
    id: "M4",
    name: "Demo 版本",
    goal: "形成可展示语音生成效果",
    output: "Demo 音频 / 推理脚本 / 展示材料",
    status: "待启动"
  },
  {
    id: "M5",
    name: "版本冻结",
    goal: "确定 lycheeVoice2.0 阶段版本",
    output: "模型包 / 评测报告 / 复盘文档",
    status: "待启动"
  }
];

const contractMilestones = [
  {
    name: "合同启动",
    time: "合同签订后 15 日内",
    goal: "乙方计划方案获甲方书面认可",
    output: "阶段计划、项目目标、进度表",
    status: "待确认"
  },
  {
    name: "第一阶段",
    time: "2026-04-20 至 2026-10-30",
    goal: "完成第一版模型训练",
    output:
      "第一版模型、500 万小时数据、训练集群/存储方案、qwen3-omini 打标模型、数据处理管线、Benchmark 初版",
    status: "待启动"
  },
  {
    name: "第二阶段",
    time: "2026-10-30 至 2027-02-30",
    goal: "完成第二版语音模型",
    output: "音色设计模型、音色克隆去先验情感、副语言生成、3 篇论文成果",
    status: "日期需修订"
  },
  {
    name: "第三阶段",
    time: "2027-02-30 至 2027-04-20",
    goal: "模型及工程优化",
    output: "实时/非实时/视频生成融合场景优化",
    status: "日期需修订"
  },
  {
    name: "质保期",
    time: "交付后 1 年",
    goal: "技术支持与 BUG 修复",
    output: "24 小时响应，5 个工作日解决",
    status: "待启动"
  }
];

const highPriorityRisks = [
  {
    title: "合同日期无效或冲突",
    impact: "影响履约和验收节点",
    action: "修订 2027-02-30 及合作期限",
    status: "高优先级"
  },
  {
    title: "乙方信息空白",
    impact: "影响合同生效和付款",
    action: "补齐乙方主体、联系人、地址、账户",
    status: "高优先级"
  },
  {
    title: "“彻底消除先验情感”等指标不可量化",
    impact: "可能导致验收争议",
    action: "转换为可测指标和验收样例",
    status: "高优先级"
  },
  {
    title: "论文成果不完全可控",
    impact: "影响第二阶段付款和违约责任",
    action: "论文单独立项，拆分投稿、录用、发表风险",
    status: "高优先级"
  },
  {
    title: "第三方知识产权风险",
    impact: "影响模型、代码、数据可商用",
    action: "要求乙方披露第三方依赖及授权证明",
    status: "高优先级"
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand">项目总览</p>
            <h3 className="mt-2 text-3xl font-bold text-ink">
              lycheeVoice2.0 训练项目
            </h3>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-muted">
              lycheeVoice2.0 是面向高质量语音生成场景的新一代语音模型训练项目，目标是形成可持续迭代的数据、训练、评测与交付闭环。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="项目建档与目标澄清" tone="blue" />
            <StatusBadge status="已立项 / 待细化" tone="gray" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="当前阶段"
          value="建档澄清"
          helper="项目建档与目标澄清"
          tone="blue"
        />
        <StatCard
          label="工作流数量"
          value={workflowItems.length}
          helper="W01-W12 固定工作流"
          tone="slate"
        />
        <StatCard
          label="高优先级风险"
          value={highPriorityRisks.length}
          helper="合同、验收、知识产权等"
          tone="red"
        />
        <StatCard
          label="待确认问题"
          value={4}
          helper="负责人、乙方信息、日期、验收指标"
          tone="amber"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="项目基本信息">
          <dl className="grid gap-3 sm:grid-cols-2">
            {projectInfo.map((item) => (
              <div key={item.label} className="rounded-lg bg-panel p-4">
                <dt className="text-sm font-semibold text-muted">{item.label}</dt>
                <dd className="mt-2 text-sm font-bold leading-6 text-ink">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="项目一句话定义">
          <div className="rounded-lg bg-blue-50 p-5 text-sm leading-7 text-blue-900">
            lycheeVoice2.0 是面向高质量语音生成场景的新一代语音模型训练项目，目标是形成可持续迭代的数据、训练、评测与交付闭环。
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/board"
              className="h-10 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              查看工作流看板
            </Link>
            <Link
              href="/import"
              className="h-10 rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-panel"
            >
              导入会议纪要
            </Link>
          </div>
        </Panel>
      </section>

      <Panel title="项目核心目标">
        <div className="grid gap-3 lg:grid-cols-2">
          {coreGoals.map((goal, index) => (
            <div key={goal} className="flex gap-3 rounded-lg bg-panel p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-100 text-sm font-bold text-brand">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-ink">{goal}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="项目里程碑">
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {projectMilestones.map((item) => (
            <article key={item.id} className="rounded-lg border border-line bg-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-brand">{item.id}</p>
                  <h4 className="mt-1 text-lg font-bold text-ink">{item.name}</h4>
                </div>
                <StatusBadge status={item.status} tone={statusTone(item.status)} />
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <Info label="目标" value={item.goal} />
                <Info label="预计产出" value={item.output} />
              </dl>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="合同里程碑">
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-800">
          2027-02-30 为无效日期，需要修订合同日期和合作期限。
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="bg-panel text-muted">
                <TableHead>阶段</TableHead>
                <TableHead>时间</TableHead>
                <TableHead>核心目标</TableHead>
                <TableHead>交付物</TableHead>
                <TableHead>状态</TableHead>
              </tr>
            </thead>
            <tbody>
              {contractMilestones.map((item) => (
                <tr key={item.name} className="align-top">
                  <TableCell strong>{item.name}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>{item.goal}</TableCell>
                  <TableCell>{item.output}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} tone={statusTone(item.status)} />
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="高优先级风险">
        <div className="grid gap-4 xl:grid-cols-2">
          {highPriorityRisks.map((risk) => (
            <article key={risk.title} className="rounded-lg border border-red-100 bg-red-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-bold leading-6 text-ink">{risk.title}</h4>
                <StatusBadge status={risk.status} tone="red" />
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <Info label="影响" value={risk.impact} />
                <Info label="应对方式" value={risk.action} />
              </dl>
            </article>
          ))}
        </div>
      </Panel>
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
      <div className="mt-4">{children}</div>
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

function StatusBadge({
  status,
  tone
}: {
  status: string;
  tone: "blue" | "gray" | "red" | "amber" | "green";
}) {
  const toneClass = {
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-slate-100 text-slate-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-800",
    green: "bg-emerald-100 text-emerald-700"
  };

  return (
    <span
      className={`inline-flex w-fit shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${toneClass[tone]}`}
    >
      {status}
    </span>
  );
}

function statusTone(status: string) {
  if (status === "进行中") return "blue";
  if (status === "日期需修订" || status === "高优先级") return "red";
  if (status === "已完成") return "green";
  if (status === "待确认") return "gray";
  return "gray";
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-line px-4 py-3 text-sm font-semibold">
      {children}
    </th>
  );
}

function TableCell({
  children,
  strong
}: {
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <td
      className={`border-b border-line px-4 py-4 leading-6 ${
        strong ? "font-bold text-ink" : "text-muted"
      }`}
    >
      {children}
    </td>
  );
}
