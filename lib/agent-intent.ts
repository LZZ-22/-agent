// Agent 意图识别 — 判断用户问题需要什么类型的处理

export type AgentIntentType =
  | "general_chat"       // 普通对话，不需要数据库
  | "database_lookup"    // 需要查找特定数据
  | "database_summary"   // 需要数据汇总/统计
  | "database_reasoning"; // 需要数据 + 分析推断

export interface AgentIntentResult {
  intent: AgentIntentType;
  needsDatabase: boolean;
  confidence: number; // 0-1
  rationale: string;
  searchQuery?: string; // 如果 needsDatabase，建议的搜索词
}

// 数据库相关关键词
const DB_KEYWORDS = [
  "数据库", "记录", "数据", "表", "统计", "最近", "有哪些", "多少",
  "分类", "样本", "长文", "对话", "社交媒体", "心理支持", "补丁",
  "风格分析", "问答", "日常", "愤怒", "正式", "教学", "娱乐",
  "总共", "合计", "汇总", "列出", "查询", "查找", "搜索",
];

const SUMMARY_KEYWORDS = [
  "统计", "多少", "总共", "合计", "汇总", "分布", "比例",
  "分类统计", "各类", "每个分类", "概览",
];

const REASONING_KEYWORDS = [
  "分析", "为什么", "趋势", "模式", "特征", "规律",
  "建议", "怎么看", "怎么理解", "评估",
];

export function detectIntent(userMessage: string): AgentIntentResult {
  const msg = userMessage.toLowerCase();

  const hasDbKeyword = DB_KEYWORDS.some((k) => msg.includes(k));
  const hasSummaryKeyword = SUMMARY_KEYWORDS.some((k) => msg.includes(k));
  const hasReasoningKeyword = REASONING_KEYWORDS.some((k) => msg.includes(k));

  // 默认：普通对话
  if (!hasDbKeyword) {
    return {
      intent: "general_chat",
      needsDatabase: false,
      confidence: 0.9,
      rationale: "问题中未检测到数据库相关关键词，按普通对话处理。",
    };
  }

  // 提取搜索词：去掉常见的问句前缀
  let searchQuery = userMessage
    .replace(/请|帮我|能不能|可以|一下|吗|呢|？|？/g, "")
    .replace(/数据库|统计|有多少|有哪些|多少|最近/g, "")
    .trim();

  if (hasReasoningKeyword && hasDbKeyword) {
    return {
      intent: "database_reasoning",
      needsDatabase: true,
      confidence: 0.75,
      rationale: "问题涉及数据分析和推断，需要先检索数据库再结合风格规范生成回答。",
      searchQuery: searchQuery || userMessage,
    };
  }

  if (hasSummaryKeyword) {
    return {
      intent: "database_summary",
      needsDatabase: true,
      confidence: 0.85,
      rationale: "问题涉及数据汇总/统计，需要查询数据库分类和计数。",
      searchQuery: searchQuery || "stats",
    };
  }

  return {
    intent: "database_lookup",
    needsDatabase: true,
    confidence: 0.8,
    rationale: "问题涉及数据库内容查找。",
    searchQuery: searchQuery || userMessage,
  };
}
