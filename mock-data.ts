export type WorkflowStatus =
  | "未启动"
  | "规划中"
  | "进行中"
  | "有风险"
  | "待验收"
  | "已完成";
export type RiskLevel = "低" | "中" | "高";

export type WorkflowItem = {
  id: string;
  name: string;
  goal: string;
  owner: string;
  dueDate: string;
  status: WorkflowStatus;
  riskLevel: RiskLevel;
  progress: string;
  risk: string;
  nextAction: string;
  updatedAt: string;
};

export const workflowItems: WorkflowItem[] = [
  {
    id: "W01",
    name: "数据购买",
    goal: "获取可用于训练的合法合规语音数据",
    owner: "林悦",
    dueDate: "2026-07-12",
    status: "进行中",
    riskLevel: "低",
    progress: "已完成三家数据供应商初筛，正在核对授权范围和样本覆盖。",
    risk: "部分数据集授权条款需要法务复核。",
    nextAction: "完成供应商数据清单对比，并提交法务确认。",
    updatedAt: "2026-07-02"
  },
  {
    id: "W02",
    name: "数据管线方案设计",
    goal: "设计从原始音频到训练样本的处理方案",
    owner: "陈航",
    dueDate: "2026-07-10",
    status: "进行中",
    riskLevel: "低",
    progress: "已完成原始音频入库、切分、转写、打标和质检节点草案。",
    risk: "管线各节点产物格式还需要统一。",
    nextAction: "输出数据管线字段规范和处理流程图。",
    updatedAt: "2026-07-02"
  },
  {
    id: "W03",
    name: "数据处理",
    goal: "执行清洗、切分、转写、打标、过滤和质检",
    owner: "周敏",
    dueDate: "2026-07-18",
    status: "有风险",
    riskLevel: "高",
    progress: "清洗和切分规则已开始验证，首批样本质检通过率低于预期。",
    risk: "噪声样本和说话人信息缺失会影响后续训练质量。",
    nextAction: "补充过滤规则，并抽样复核 200 条问题样本。",
    updatedAt: "2026-07-02"
  },
  {
    id: "W04",
    name: "表征实验",
    goal: "验证音频、语义、说话人和情绪表征方案",
    owner: "赵启",
    dueDate: "2026-07-22",
    status: "规划中",
    riskLevel: "低",
    progress: "已确定音频表征和说话人表征候选方案，等待样本集稳定。",
    risk: "不同表征方案的评测指标尚未完全对齐。",
    nextAction: "设计小规模 ablation 实验并确定指标口径。",
    updatedAt: "2026-07-02"
  },
  {
    id: "W05",
    name: "沐曦 GPU 适配",
    goal: "让训练和推理链路适配沐曦 GPU 环境",
    owner: "王若",
    dueDate: "2026-07-20",
    status: "有风险",
    riskLevel: "高",
    progress: "环境镜像已准备，训练依赖存在兼容性问题，推理链路尚未打通。",
    risk: "部分算子和依赖版本在沐曦环境下运行不稳定。",
    nextAction: "整理失败日志，与硬件和框架支持方同步适配清单。",
    updatedAt: "2026-07-02"
  },
  {
    id: "W06",
    name: "预训练",
    goal: "完成基础 TTS 或语音生成模型预训练",
    owner: "刘砚",
    dueDate: "2026-08-02",
    status: "规划中",
    riskLevel: "中",
    progress: "预训练配置模板已完成，等待高质量训练样本和 GPU 环境确认。",
    risk: "数据处理延期会压缩预训练窗口。",
    nextAction: "准备小样本 dry-run，并确认训练资源排期。",
    updatedAt: "2026-07-01"
  },
  {
    id: "W07",
    name: "后训练",
    goal: "完成情绪、音色、副语言等能力增强",
    owner: "何宁",
    dueDate: "2026-08-16",
    status: "未启动",
    riskLevel: "低",
    progress: "后训练能力清单已列出，尚未进入实验阶段。",
    risk: "依赖预训练模型基线质量。",
    nextAction: "确认情绪、音色和副语言样本需求。",
    updatedAt: "2026-07-01"
  },
  {
    id: "W08",
    name: "Benchmark 与评测",
    goal: "建立自动评测和人工听测体系",
    owner: "孙晴",
    dueDate: "2026-07-28",
    status: "进行中",
    riskLevel: "中",
    progress: "自动评测指标草案已完成，人工听测表单正在设计。",
    risk: "主观听测样本量不足会影响结论稳定性。",
    nextAction: "补充听测维度，并确定首轮评测样本集。",
    updatedAt: "2026-07-02"
  },
  {
    id: "W09",
    name: "工程化与推理服务",
    goal: "将模型包装成可以测试和展示的服务",
    owner: "赵启",
    dueDate: "2026-08-08",
    status: "规划中",
    riskLevel: "中",
    progress: "推理服务接口草案已完成，等待模型 checkpoint 和环境确认。",
    risk: "服务性能和沐曦适配结果存在联动风险。",
    nextAction: "定义推理 API、日志字段和演示调用方式。",
    updatedAt: "2026-07-01"
  },
  {
    id: "W10",
    name: "合同与验收管理",
    goal: "跟踪合同、交付、付款和验收材料",
    owner: "林悦",
    dueDate: "2026-07-30",
    status: "进行中",
    riskLevel: "低",
    progress: "合同节点和验收材料清单已整理，付款节点待财务确认。",
    risk: "验收材料模板需要与合同条款保持一致。",
    nextAction: "补充交付物清单，并同步财务付款节点。",
    updatedAt: "2026-07-02"
  },
  {
    id: "W11",
    name: "论文与技术成果",
    goal: "管理论文投稿、署名和技术成果",
    owner: "周敏",
    dueDate: "2026-08-20",
    status: "未启动",
    riskLevel: "中",
    progress: "已收集潜在投稿方向，尚未确定论文结构和署名方案。",
    risk: "实验结果未稳定前，论文选题和贡献点存在不确定性。",
    nextAction: "建立技术成果清单，并约定署名和材料沉淀规则。",
    updatedAt: "2026-07-01"
  },
  {
    id: "W12",
    name: "项目治理",
    goal: "管理周会、月报、风险、资源和决策",
    owner: "陈航",
    dueDate: "2026-07-31",
    status: "待验收",
    riskLevel: "中",
    progress: "周会、月报、风险和决策跟踪机制已建立，等待项目负责人确认。",
    risk: "跨团队资源排期变化可能影响整体节奏。",
    nextAction: "确认治理节奏，并固化周报和风险升级机制。",
    updatedAt: "2026-07-02"
  }
];

export const sampleMeetingNote = `会议主题：lycheeVoice2.0 项目周会
会议日期：2026-07-02
参会人员：林悦、陈航、周敏、赵启、王若、刘砚、孙晴

1. W01 数据购买已完成三家供应商初筛，需要继续核对授权范围。
2. W02 数据管线方案已形成草案，下一步输出字段规范和流程图。
3. W03 数据处理首批样本质检通过率低于预期，需要补充过滤规则。
4. W05 沐曦 GPU 适配存在依赖兼容问题，需要整理失败日志并同步支持方。
5. W08 Benchmark 与评测已完成自动评测指标草案，需要补充人工听测维度。
6. W12 项目治理机制已建立，等待项目负责人确认周报和风险升级机制。`;

export const statusStyles: Record<WorkflowStatus, string> = {
  未启动: "bg-slate-100 text-slate-700",
  规划中: "bg-yellow-100 text-yellow-800",
  进行中: "bg-blue-100 text-blue-700",
  有风险: "bg-red-100 text-red-700",
  待验收: "bg-purple-100 text-purple-700",
  已完成: "bg-emerald-100 text-emerald-700"
};

export const riskStyles: Record<RiskLevel, string> = {
  低: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  中: "bg-amber-50 text-amber-800 ring-amber-200",
  高: "bg-red-50 text-red-700 ring-red-200"
};

export const owners = Array.from(new Set(workflowItems.map((item) => item.owner)));

export const normalizedStatus = (status: WorkflowStatus) => {
  return status;
};

export const workflowAnalysisItems = workflowItems.slice(0, 6).map((item) => ({
  workflowId: item.id,
  progress: item.progress,
  owner: item.owner,
  dueDate: item.dueDate,
  risk: item.risk,
  nextAction: item.nextAction,
  status: normalizedStatus(item.status)
}));

export const milestones = [
  { name: "数据合规采购", progress: 45, status: "进行中" },
  { name: "数据管线与处理", progress: 35, status: "有风险" },
  { name: "训练与 GPU 适配", progress: 20, status: "规划中" },
  { name: "评测与验收治理", progress: 55, status: "进行中" }
];

export const recentMeetings = [
  { title: "项目周会", date: "2026-07-02", summary: "同步数据购买、数据处理、沐曦 GPU 适配和评测风险。" },
  { title: "数据管线评审", date: "2026-07-01", summary: "确认原始音频到训练样本的处理节点和字段草案。" },
  { title: "GPU 适配同步会", date: "2026-06-30", summary: "梳理训练依赖和推理链路在沐曦环境下的阻塞项。" }
];

export const taskItems = workflowItems.map((item, index) => ({
  id: `T-${String(index + 1).padStart(3, "0")}`,
  title: item.nextAction,
  workflowId: item.id,
  workflowName: item.name,
  owner: item.owner,
  dueDate: item.dueDate,
  status: normalizedStatus(item.status),
  riskLevel: item.riskLevel
}));

export const decisionItems = [
  {
    id: "D-001",
    title: "所有采购数据必须先完成授权范围和合规复核",
    source: "W01",
    owner: "林悦",
    date: "2026-07-01",
    status: "已确认"
  },
  {
    id: "D-002",
    title: "数据管线先统一中间产物字段，再进入大规模处理",
    source: "W02",
    owner: "陈航",
    date: "2026-07-02",
    status: "已确认"
  },
  {
    id: "D-003",
    title: "沐曦 GPU 适配问题按训练依赖和推理链路分两类跟踪",
    source: "W05",
    owner: "王若",
    date: "2026-07-02",
    status: "待确认"
  }
];

export const historyRecords = [
  { type: "会议纪要", title: "导入 lycheeVoice2.0 项目周会", date: "2026-07-02", operator: "林悦" },
  { type: "看板更新", title: "更新 W03 数据处理风险状态", date: "2026-07-02", operator: "周敏" },
  { type: "周报", title: "生成 2026-06-29 项目周报", date: "2026-07-02", operator: "林悦" },
  { type: "任务", title: "新增 W05 沐曦 GPU 适配问题清单", date: "2026-07-01", operator: "王若" }
];
