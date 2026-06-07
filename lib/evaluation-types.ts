// ═══════════════════════════════════════════════════════
// Agent 对话评估标准系统 — 类型定义
// ═══════════════════════════════════════════════════════

// ─── 评估来源 ──────────────────────────────────────────
export type EvaluatorSource = "human" | "model" | "hybrid";

// ─── 评估层级 ──────────────────────────────────────────
export type EvaluationLevel =
  | "response"     // 单条回复
  | "turn"         // 单轮任务
  | "conversation" // 多轮会话
  | "style"        // 风格一致性
  | "scene"        // 场景适配度
  | "safety";      // 安全边界

// ─── 场景类型 ──────────────────────────────────────────
export type SceneType =
  | "general_chat"
  | "mental_support"
  | "fun_zone"
  | "advice_mode"
  | "comfort_mode"
  | "analysis_mode"
  | "execution_mode"
  | "decision_mode"
  | "brainstorm_mode"
  | "reflection_mode"
  | "learning_mode"
  | "social_reply_mode"
  | "motivation_mode";

// ─── 严重级别 ──────────────────────────────────────────
export type Severity = "critical" | "major" | "minor" | "cosmetic";

// ─── 调整目标层 ────────────────────────────────────────
export type AdjustmentTarget =
  | "base_style_spec"
  | "scene_patch"
  | "system_prompt"
  | "tone_parameters"
  | "structure_rules"
  | "safety_rules"
  | "few_shot_examples"
  | "fallback_strategy"
  | "ui_guidance";

// ─── 评估维度定义 ──────────────────────────────────────
export interface EvaluationDimension {
  id: string;            // "style_consistency" | "clarity" | ...
  name: string;          // 中文名称
  description: string;   // 评估什么
  scoreRange: [number, number]; // [1, 5]
  applicableLevels: EvaluationLevel[];
  evaluatorType: EvaluatorSource; // 推荐评估方式
}

// ─── 维度得分 ──────────────────────────────────────────
export interface DimensionScore {
  dimensionId: string;
  score: number;          // 1-5
  weight: number;         // 权重 0-1
  weightedScore: number;  // score * weight
  reason: string;         // 评分理由
  evidence?: string;      // 引用原文证据
}

// ─── 失败标签 ──────────────────────────────────────────
export interface FailureTag {
  code: string;           // "F_STYLE_001"
  category: string;       // "style" | "structure" | "tone" | "safety" | "usefulness" | "logic"
  name: string;           // 中文名称
  description: string;
  severity: Severity;
  examples: string[];
}

// ─── 诊断结果 ──────────────────────────────────────────
export interface Diagnosis {
  suspectedCauses: string[];       // 可能原因
  primaryFailureTags: string[];    // 主要失败标签 code
  affectedDimensions: string[];    // 受影响的维度
  severity: Severity;
  isHardFail: boolean;             // 是否触发硬失败（强制不合格）
}

// ─── 改进动作 ──────────────────────────────────────────
export interface ImprovementAction {
  target: AdjustmentTarget;        // 调整目标层
  action: string;                  // 具体调整建议
  priority: number;                // 1-5
  expectedEffect: string;          // 预期效果
  verificationMethod: string;      // 如何验证调整有效
}

// ─── 场景权重配置 ──────────────────────────────────────
export interface SceneWeightConfig {
  sceneType: SceneType;
  dimensionWeights: Record<string, number>; // dimensionId → weight
  hardFailRules: HardFailRule[];
  sceneSpecificCriteria: string[];
}

export interface HardFailRule {
  id: string;
  description: string;
  condition: string;      // 触发条件的描述
  failureTags: string[];  // 关联的 failure tag codes
}

// ─── 评估量规（Rubric）─────────────────────────────────
export interface EvaluationRubric {
  id: string;
  version: string;
  name: string;
  dimensions: EvaluationDimension[];
  sceneWeights: SceneWeightConfig[];
  failureTags: FailureTag[];
  createdAt: string;
  updatedAt: string;
}

// ─── 评估记录（完整版）─────────────────────────────────
export interface EvaluationRecord {
  id: string;
  rubricVersion: string;
  level: EvaluationLevel;
  sceneType: SceneType;

  // 被评估对象
  target: {
    conversationId?: string;
    messageId?: string;
    responseContent: string;
    context?: {
      userMessage?: string;
      precedingMessages?: { role: string; content: string }[];
      scenePatchId?: string;
      styleProfileVersion?: string;
    };
  };

  // 评分
  dimensionScores: DimensionScore[];
  overallScore: number;        // 加权总分 1-5
  normalizedScore: number;     // 百分制 0-100

  // 诊断
  diagnosis: Diagnosis;

  // 改进
  improvements: ImprovementAction[];

  // 元数据
  evaluator: {
    source: EvaluatorSource;
    modelName?: string;        // 如果用模型评估
    evaluatorName?: string;    // 如果人工评估
    evaluatedAt: string;
    timeSpentSeconds?: number;
  };

  // 人工标注附加字段
  humanAnnotation?: {
    annotatorId: string;
    confidence: number;        // 标注者置信度 1-5
    notes: string;
    tags: string[];
    reviewed: boolean;
    reviewedBy?: string;
  };

  // 后续验证
  followUp?: {
    actionTaken: string;
    actionDate: string;
    reEvaluationId?: string;
    scoreDelta?: number;       // 调整后的分数变化
    verified: boolean;
  };
}

// ─── MVP 精简版评估记录 ───────────────────────────────
export interface EvaluationRecordMVP {
  id: string;
  conversationId: string;
  responseContent: string;
  sceneType: SceneType;
  scores: {
    style: number;
    clarity: number;
    naturalness: number;
    usefulness: number;
    safety: number;
  };
  overallScore: number;
  failureTags: string[];
  improvementNote: string;
  evaluator: "human" | "model";
  evaluatedAt: string;
}

// ─── 聚合统计 ──────────────────────────────────────────
export interface EvaluationStats {
  totalEvaluations: number;
  averageOverallScore: number;
  scoreDistribution: { range: string; count: number }[]; // "4-5", "3-4", ...
  dimensionAverages: Record<string, number>;
  topFailureTags: { code: string; count: number }[];
  sceneBreakdown: {
    sceneType: SceneType;
    count: number;
    avgScore: number;
    topIssues: string[];
  }[];
  trendData: { date: string; avgScore: number; count: number }[];
}

// ─── 评估汇总（Dashboard 用）───────────────────────────
export interface EvaluationSummary {
  period: { start: string; end: string };
  stats: EvaluationStats;
  recentRecords: EvaluationRecordMVP[];
  improvementQueue: { action: string; target: AdjustmentTarget; priority: number }[];
}
