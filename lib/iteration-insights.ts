// 迭代洞察 — 从评估历史中发现模式

import type { EvalRecord } from "./evaluation-storage";

export interface DimensionStats {
  dimension: string;
  label: string;
  avgScore: number;
  minScore: number;
  maxScore: number;
  recordCount: number;
  trend: "improving" | "declining" | "stable";
}

export interface PatternFinding {
  type: "weak_dimension" | "recurring_issue" | "trend_change";
  description: string;
  severity: "high" | "medium" | "low";
  evidence: string;
  suggestion: string;
}

export interface IterationInsights {
  totalRecords: number;
  averageTotalScore: number;
  dimensionStats: DimensionStats[];
  patterns: PatternFinding[];
  topIssues: { issue: string; count: number }[];
  recommendedActions: string[];
}

const DIM_LABELS: Record<string, string> = {
  accuracy: "事实准确性",
  database_grounding: "数据库依据",
  style_consistency: "风格一致性",
  question_understanding: "问题理解",
  structure_clarity: "结构清晰度",
  completeness: "完整性",
  usefulness: "有用性",
  conciseness: "简洁性",
  hallucination_risk: "胡编风险",
  overclaim_risk: "过度肯定风险",
};

export function analyzeHistory(records: EvalRecord[]): IterationInsights {
  if (records.length === 0) {
    return { totalRecords: 0, averageTotalScore: 0, dimensionStats: [], patterns: [], topIssues: [], recommendedActions: ["暂无评估记录，开始评估后系统将自动生成洞察。"] };
  }

  // 各维度统计
  const dimMap = new Map<string, number[]>();
  for (const r of records) {
    for (const [dim, score] of Object.entries(r.dimensionScores)) {
      if (!dimMap.has(dim)) dimMap.set(dim, []);
      dimMap.get(dim)!.push(score.score);
    }
  }

  const dimensionStats: DimensionStats[] = [];
  for (const [dim, scores] of dimMap) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    dimensionStats.push({
      dimension: dim,
      label: DIM_LABELS[dim] || dim,
      avgScore: Math.round(avg * 10) / 10,
      minScore: Math.min(...scores),
      maxScore: Math.max(...scores),
      recordCount: scores.length,
      trend: "stable",
    });
  }
  dimensionStats.sort((a, b) => a.avgScore - b.avgScore); // 最差的排前面

  // 平均总分
  const avgTotal = records.reduce((a, r) => a + r.totalScore, 0) / records.length;

  // 问题模式
  const patterns: PatternFinding[] = [];
  const issueCount = new Map<string, number>();
  for (const r of records) {
    for (const issue of r.keyIssues) {
      issueCount.set(issue, (issueCount.get(issue) || 0) + 1);
    }
  }

  // 检查最弱维度
  if (dimensionStats.length > 0) {
    const weakest = dimensionStats[0];
    if (weakest.avgScore < 6) {
      patterns.push({
        type: "weak_dimension",
        description: `"${weakest.label}"是近期最弱评估维度`,
        severity: weakest.avgScore < 4 ? "high" : "medium",
        evidence: `近 ${weakest.recordCount} 次评估平均 ${weakest.avgScore} 分`,
        suggestion: `建议优先检查 agent 在 ${weakest.label} 方面的表现，调整对应的 prompt 约束或策略。`,
      });
    }
  }

  // 检查重复出现的 issue
  const topIssues = [...issueCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([issue, count]) => ({ issue, count }));

  if (topIssues.length > 0 && topIssues[0].count >= 2) {
    patterns.push({
      type: "recurring_issue",
      description: `"${topIssues[0].issue}"反复出现`,
      severity: topIssues[0].count >= 4 ? "high" : "medium",
      evidence: `在 ${topIssues[0].count} 次评估中被标记`,
      suggestion: "建议检查是否有系统性问题导致该问题反复出现。",
    });
  }

  // 生成建议
  const recommendedActions: string[] = [];
  if (dimensionStats[0]?.avgScore < 6) {
    recommendedActions.push(`优先提升"${dimensionStats[0].label}"维度：检查相关 prompt 约束是否足够明确。`);
  }
  if (records.length < 5) {
    recommendedActions.push("评估样本量较少（<5条），建议增加评估次数以获得更可靠的洞察。");
  }
  if (avgTotal < 6) {
    recommendedActions.push("整体评分偏低，建议做一次全面的 agent 策略复盘。");
  }

  return {
    totalRecords: records.length,
    averageTotalScore: Math.round(avgTotal * 10) / 10,
    dimensionStats,
    patterns,
    topIssues,
    recommendedActions,
  };
}
