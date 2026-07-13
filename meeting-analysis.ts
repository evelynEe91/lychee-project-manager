import { type WorkflowStatus } from "@/lib/mock-data";

export const MEETING_ANALYSIS_STORAGE_KEY = "lycheeVoice.meetingAnalysis.v1";

export type MeetingInfo = {
  date: string;
  time: string;
  participants: string[];
  generated_at: string;
};

export type WorkflowUpdate = {
  workflow_id: string;
  workflow_name: string;
  progress: string;
  owner: string;
  deadline: string;
  risk: string;
  next_action: string;
  status: WorkflowStatus;
  affects_phase_one: boolean;
};

export type NewRisk = {
  risk: string;
  workflow_id: string;
  workflow_name: string;
  evidence: string;
  impact: string;
  owner: string;
  mitigation: string;
  severity: "高" | "中" | "低";
  affects_phase_one: boolean;
};

export type NewDecision = {
  decision: string;
  background: string;
  impact_scope: string;
  decision_maker: string;
  date: string;
};

export type WeeklyMustDo = {
  task: string;
  owner: string;
  deadline: string;
};

export type MeetingAnalysis = {
  meeting: MeetingInfo;
  workflow_updates: WorkflowUpdate[];
  new_risks: NewRisk[];
  new_decisions: NewDecision[];
  weekly_must_do: WeeklyMustDo[];
};

const workflowNames: Record<string, string> = {
  W01: "数据购买",
  W02: "数据管线方案设计",
  W03: "数据处理",
  W04: "表征实验",
  W05: "沐曦 GPU 适配",
  W06: "预训练",
  W07: "后训练",
  W08: "Benchmark 与评测",
  W09: "工程化与推理服务",
  W10: "合同与验收管理",
  W11: "论文与技术成果",
  W12: "项目治理"
};

export const emptyAnalysis = (): MeetingAnalysis => ({
  meeting: {
    date: "待确认",
    time: "未提及",
    participants: [],
    generated_at: formatLocalDateTime()
  },
  workflow_updates: [],
  new_risks: [],
  new_decisions: [],
  weekly_must_do: []
});

export function formatLocalDateTime(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function analyzeMeetingNote(note: string): MeetingAnalysis {
  const meetingDate = extractMeetingDate(note);
  const meeting = {
    date: meetingDate,
    time: extractMeetingTime(note),
    participants: extractParticipants(note),
    generated_at: formatLocalDateTime()
  };

  const sections = extractWorkflowSections(note);

  return {
    meeting,
    workflow_updates: buildWorkflowUpdates(sections, meetingDate),
    new_risks: extractNewRisks(note),
    new_decisions: extractNewDecisions(note, meetingDate),
    weekly_must_do: extractWeeklyMustDo(note)
  };
}

function extractMeetingDate(note: string) {
  const match = note.match(/会议日期[:：]\s*(\d{4})[-年](\d{1,2})[-月](\d{1,2})/);
  if (!match) return "待确认";
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

function extractMeetingTime(note: string) {
  const explicit = note.match(/会议时间[:：]\s*([^\n]+)/);
  if (explicit) return explicit[1].trim();
  const natural = note.match(/(上午|下午|晚上|中午)\s*\d{1,2}\s*点(?:半|到\s*\d{1,2}\s*点\s*\d{0,2}\s*分?)?/);
  if (natural) return natural[0].trim();
  const clock = note.match(/(\d{1,2})[:：](\d{2})/);
  if (clock) return `${clock[1].padStart(2, "0")}:${clock[2]}`;
  return "未提及";
}

function extractParticipants(note: string) {
  const patterns = [
    /参会人(?:员)?[:：]\s*([^\n。]+)/,
    /参会的有\s*([^\n。]+)/,
    /出席人员(?:包括|有|[:：])\s*([^\n。]+)/,
    /参加本次会议的人员(?:包括|有|[:：])\s*([^\n。]+)/,
    /与会人员(?:包括|有|[:：])\s*([^\n。]+)/,
    /到会人员(?:包括|有|[:：])\s*([^\n。]+)/
  ];
  const match = patterns.map((pattern) => note.match(pattern)).find(Boolean);
  if (!match?.[1]) return [];

  return match[1]
    .replace(/[。；;].*$/, "")
    .replace(/\s*(和|以及|及)\s*/g, "、")
    .split(/[、,，\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => !participantStopWords.has(item));
}

const participantStopWords = new Set([
  "今天下午",
  "本次会议",
  "主要同步",
  "lycheeVoice2.0",
  "第一阶段",
  "最近一周",
  "进展",
  "会议日期",
  "会议时间"
]);

function extractWorkflowSections(note: string) {
  const sectionMap: Record<string, string> = {};
  const lines = note.split(/\n+/);
  const markers = [
    ["W01", "数据购买"],
    ["W02", "数据管线方案设计"],
    ["W03", "数据处理"],
    ["W04", "表征实验"],
    ["W05", "沐曦 GPU 适配"],
    ["W06", "预训练"],
    ["W07", "后训练"],
    ["W08", "Benchmark 与评测"],
    ["W09", "工程化与推理服务"],
    ["W10", "合同与验收管理"],
    ["W11", "论文与技术成果"],
    ["W12", "项目治理"]
  ];

  for (const line of lines) {
    for (const [id, name] of markers) {
      if (line.includes(name) || line.includes(id)) {
        sectionMap[id] = line.trim();
      }
    }
  }

  return sectionMap;
}

function buildWorkflowUpdates(
  sections: Record<string, string>,
  meetingDate: string
): WorkflowUpdate[] {
  const year = meetingDate.match(/^\d{4}/)?.[0] ?? "2026";
  const known: Record<string, Omit<WorkflowUpdate, "workflow_name">> = {
    W01: {
      workflow_id: "W01",
      progress: "已经初步确定两家语音数据供应商，但授权证明还没有完全收齐",
      owner: "小王",
      deadline: `${year}-07-19`,
      risk: "如果没有按时确认，可能会影响第一阶段数据交付",
      next_action: "整理数据采购清单，并向供应商确认数据是否可以用于模型训练和后续商业化使用",
      status: "有风险",
      affects_phase_one: true
    },
    W02: {
      workflow_id: "W02",
      progress: "基础音频处理管线第一版方案已经完成，包括切分、去噪、ASR 转写、语种识别和质量过滤",
      owner: "李工",
      deadline: `${year}-07-22`,
      risk: "待补充字段定义和质检标准",
      next_action: "补充字段定义和质检标准",
      status: "进行中",
      affects_phase_one: true
    },
    W03: {
      workflow_id: "W03",
      progress: "已经完成 20 万小时原始音频的初步清洗",
      owner: "刘工",
      deadline: "下周",
      risk: "影视剧音频中背景音和多人重叠说话较多，可能影响训练数据质量",
      next_action: "继续优化过滤规则，并输出数据质量报告",
      status: "有风险",
      affects_phase_one: true
    },
    W04: {
      workflow_id: "W04",
      progress: "speaker embedding 和 emotion representation 对比实验还没有正式开始",
      owner: "周老师",
      deadline: "待确认",
      risk: "实验数据样本还没有完全准备好",
      next_action: "等待数据样例集完成后启动实验",
      status: "未启动",
      affects_phase_one: false
    },
    W05: {
      workflow_id: "W05",
      progress: "训练脚本已经可以在沐曦 GPU 环境上启动，但部分算子仍然存在兼容问题，训练速度低于预期",
      owner: "李工",
      deadline: `${year}-07-25`,
      risk: "可能影响预训练启动时间",
      next_action: "整理问题清单，并和硬件支持团队沟通",
      status: "有风险",
      affects_phase_one: true
    },
    W06: {
      workflow_id: "W06",
      progress: "决定先不启动大规模预训练，等待数据管线和 GPU 适配稳定",
      owner: "张老师",
      deadline: "待确认",
      risk: "数据管线和 GPU 适配尚未稳定",
      next_action: "确认 baseline 模型结构和训练配置",
      status: "规划中",
      affects_phase_one: true
    },
    W07: {
      workflow_id: "W07",
      progress: "尚未进入正式执行阶段，已讨论情绪控制、音色克隆和副语言生成能力需求",
      owner: "陈同学",
      deadline: `${year}-07-26`,
      risk: "待需求清单明确",
      next_action: "整理后训练能力需求清单",
      status: "规划中",
      affects_phase_one: false
    },
    W08: {
      workflow_id: "W08",
      progress: "第一阶段必须尽快确认自动评测指标，包括 WER、CER、MOS、Speaker Similarity 和 RTF",
      owner: "Annie",
      deadline: `${year}-07-23`,
      risk: "合同验收指标与内部研发指标需要区分",
      next_action: "整理 Benchmark 指标表，并标注合同验收指标和内部研发指标",
      status: "进行中",
      affects_phase_one: true
    },
    W09: {
      workflow_id: "W09",
      progress: "Demo 服务前端页面还没有开始，推理接口可以先做内部测试版本",
      owner: "刘工",
      deadline: "8月初",
      risk: "Demo 展示链路尚未形成",
      next_action: "完成基础推理 API，供团队内部测试使用",
      status: "规划中",
      affects_phase_one: false
    },
    W10: {
      workflow_id: "W10",
      progress: "合同中存在无效日期，乙方主体信息和银行账户尚未补齐",
      owner: "小王",
      deadline: `${year}-07-18`,
      risk: "可能影响合同生效和后续付款",
      next_action: "整理合同修订问题清单",
      status: "有风险",
      affects_phase_one: true
    },
    W11: {
      workflow_id: "W11",
      progress: "第二阶段需要跟踪 3 篇论文成果，论文选题、作者顺序和目标会议未确定",
      owner: "周老师",
      deadline: "待确认",
      risk: "论文成果不可控，可能影响第二阶段验收",
      next_action: "将论文成果单独作为 W11 工作流管理",
      status: "规划中",
      affects_phase_one: false
    },
    W12: {
      workflow_id: "W12",
      progress: "决定从本周开始建立固定周会机制，每周五下午同步项目进展",
      owner: "陈同学",
      deadline: "每周五下午",
      risk: "需要持续维护会议纪要、风险登记表和周报",
      next_action: "维护会议纪要、风险登记表和每周项目周报",
      status: "进行中",
      affects_phase_one: true
    }
  };

  return Object.keys(sections)
    .sort()
    .map((id) => {
      const update = known[id];
      return update ? { ...update, workflow_name: workflowNames[id] } : null;
    })
    .filter((item): item is WorkflowUpdate => item !== null);
}

function extractNewRisks(note: string): NewRisk[] {
  const rules: Array<{
    keywords: string[];
    risk: string;
    workflow_id: string;
    evidence: string;
    impact: string;
    owner: string;
    mitigation: string;
    severity: "高" | "中" | "低";
    affects_phase_one: boolean;
  }> = [
    {
      keywords: ["授权文件还没完全补齐", "授权证明还没有完全收齐", "数据授权证明未收齐"],
      risk: "数据授权文件未补齐",
      workflow_id: "W01",
      evidence: "授权文件还没完全补齐 / 授权证明还没有完全收齐",
      impact: "可能影响数据合规使用和第一阶段交付",
      owner: "小王",
      mitigation: "整理数据授权情况表并确认授权证明",
      severity: "高",
      affects_phase_one: true
    },
    {
      keywords: ["暂时不能确定这些数据是否可以用于商业化模型训练", "商业化模型训练"],
      risk: "供应商 B 数据商业化授权不明确",
      workflow_id: "W01",
      evidence: "供应商 B 暂时不能确定这些数据是否可以用于商业化模型训练",
      impact: "可能影响后续模型训练和商业化交付",
      owner: "小王",
      mitigation: "向供应商确认商业化训练授权边界",
      severity: "高",
      affects_phase_one: true
    },
    {
      keywords: ["背景音乐", "人声重叠", "环境噪音", "影响后面模型的自然度"],
      risk: "影视剧音频存在背景音乐、人声重叠和环境噪音",
      workflow_id: "W03",
      evidence: "影视剧音频里经常出现背景音乐、人声重叠和环境噪音",
      impact: "可能影响训练数据质量和模型自然度",
      owner: "李工 / 刘工",
      mitigation: "整理质检标准、过滤规则和数据质量问题清单",
      severity: "中",
      affects_phase_one: true
    },
    {
      keywords: ["多卡训练还是不太稳定", "跑到一半会中断", "影响 8 月初 baseline 训练的启动"],
      risk: "沐曦 GPU 多卡训练不稳定",
      workflow_id: "W05",
      evidence: "多卡训练还是不太稳定，有几次测试跑到一半会中断",
      impact: "可能影响 8 月初 baseline 训练启动",
      owner: "李工",
      mitigation: "整理 GPU 适配问题清单并联系沐曦技术支持",
      severity: "高",
      affects_phase_one: true
    },
    {
      keywords: ["还不清楚哪些指标是合同验收必须用的", "验收口径不一致", "容易有争议"],
      risk: "Benchmark 合同验收指标尚未明确",
      workflow_id: "W08",
      evidence: "现在还不清楚哪些指标是合同验收必须用的，后续验收口径不一致容易有争议",
      impact: "可能导致后续验收口径争议",
      owner: "Annie",
      mitigation: "将指标表拆分为合同验收指标和内部观察指标",
      severity: "高",
      affects_phase_one: true
    },
    {
      keywords: ["MOS 的人工听测流程也需要单独写出来", "不能只写一个分数"],
      risk: "MOS 人工听测流程不明确",
      workflow_id: "W08",
      evidence: "MOS 的人工听测流程也需要单独写出来，不能只写一个分数",
      impact: "可能影响验收口径",
      owner: "Annie",
      mitigation: "单独补充 MOS 人工听测流程",
      severity: "中",
      affects_phase_one: true
    },
    {
      keywords: ["乙方主体信息没有补齐", "银行账户也还空着", "乙方信息缺失"],
      risk: "乙方主体信息和银行账户缺失",
      workflow_id: "W10",
      evidence: "乙方主体信息没有补齐，银行账户也还空着",
      impact: "可能影响合同生效和付款",
      owner: "小王",
      mitigation: "整理合同修订问题清单并补齐乙方信息",
      severity: "高",
      affects_phase_one: true
    },
    {
      keywords: ["2027 年 2 月 30 日", "日期本身不存在", "无效日期"],
      risk: "合同日期无效",
      workflow_id: "W10",
      evidence: "合同里写了 2027 年 2 月 30 日，这个日期本身不存在",
      impact: "可能影响合同修订、履约和验收节点",
      owner: "小王",
      mitigation: "修订合同日期和合作期限",
      severity: "高",
      affects_phase_one: true
    },
    {
      keywords: ["负责人、截止时间、风险和决策提取得还不稳定", "提取得还不稳定"],
      risk: "项目管理网页字段提取不稳定",
      workflow_id: "W12",
      evidence: "负责人、截止时间、风险和决策提取得还不稳定",
      impact: "可能影响会议纪要自动沉淀和周报质量",
      owner: "陈同学",
      mitigation: "优先修复会议纪要提取和周报生成效果",
      severity: "中",
      affects_phase_one: false
    },
    {
      keywords: ["会议日期和生成时间显示也不太准确", "生成时间显示也不太准确"],
      risk: "周报会议日期和生成时间显示不准确",
      workflow_id: "W12",
      evidence: "周报里会议日期和生成时间显示也不太准确",
      impact: "可能影响周报可信度",
      owner: "陈同学",
      mitigation: "自动使用会议纪要日期和当前本地生成时间",
      severity: "中",
      affects_phase_one: false
    },
    {
      keywords: ["论文成果不可控"],
      risk: "论文成果不可控",
      workflow_id: "W11",
      evidence: "论文成果不可控，可能影响第二阶段验收",
      impact: "可能影响第二阶段验收",
      owner: "周老师",
      mitigation: "将论文成果单独作为 W11 工作流持续跟踪",
      severity: "中",
      affects_phase_one: false
    }
  ];

  return dedupeRisks(
    rules
      .filter((rule) => rule.keywords.some((keyword) => note.includes(keyword)))
      .map((rule) => ({
        risk: rule.risk,
        workflow_id: rule.workflow_id,
        workflow_name: workflowNames[rule.workflow_id],
        evidence: rule.evidence,
        impact: rule.impact,
        owner: rule.owner,
        mitigation: rule.mitigation,
        severity: rule.severity,
        affects_phase_one: rule.affects_phase_one
      }))
  );
}

function dedupeRisks(risks: NewRisk[]) {
  const seen = new Set<string>();
  return risks.filter((risk) => {
    const key = `${risk.workflow_id}-${risk.risk}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractNewDecisions(note: string, meetingDate: string): NewDecision[] {
  if (!note.includes("本次新增决策") && !note.includes("决定")) return [];
  return [
    {
      decision: "暂缓大规模预训练",
      background: "数据管线和 GPU 适配尚未稳定",
      impact_scope: "W06 预训练",
      decision_maker: "张老师",
      date: meetingDate
    },
    {
      decision: "从本周开始建立固定周会机制",
      background: "需要持续同步项目进展和风险",
      impact_scope: "W12 项目治理",
      decision_maker: "张老师",
      date: meetingDate
    },
    {
      decision: "W11 论文与技术成果需要单独作为工作流持续跟踪",
      background: "论文成果会影响第二阶段验收",
      impact_scope: "W11 论文与技术成果",
      decision_maker: "周老师",
      date: meetingDate
    },
    {
      decision: "第一阶段 Benchmark 指标需要先区分合同验收指标和内部研发指标",
      background: "评测指标需要服务验收和研发对比两类场景",
      impact_scope: "W08 Benchmark 与评测",
      decision_maker: "周老师",
      date: meetingDate
    }
  ];
}

function extractWeeklyMustDo(note: string): WeeklyMustDo[] {
  if (!note.includes("本周必须完成")) return [];
  return [
    {
      task: "整理数据采购清单和合同修订问题清单",
      owner: "小王",
      deadline: "本周内"
    },
    {
      task: "补充数据管线字段定义，并整理 GPU 适配问题",
      owner: "李工",
      deadline: "本周内"
    },
    {
      task: "整理 Benchmark 指标表",
      owner: "Annie",
      deadline: "本周内"
    },
    {
      task: "维护会议纪要和项目周报",
      owner: "陈同学",
      deadline: "本周内"
    }
  ];
}
