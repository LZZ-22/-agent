// 娱乐测评系统 — 类型定义

export type QuizModuleId =
  | "big_five_lab" | "enneagram_lab" | "career_interest_lab"
  | "type_dynamics_lab" | "cognitive_style_lab" | "social_attachment_lab";

export type QuizVersion = "quick" | "standard" | "pro";

export interface QuizQuestion {
  id: string;
  dimension: string;
  text: string;
  reverse: boolean;
  key?: string;
}

export interface QuizVersionConfig {
  estimated_time: string;
  question_count: number;
  questions: QuizQuestion[];
}

export interface QuizDimension {
  id: string;
  name: string;
  description: string;
  highLabel: string;
  lowLabel: string;
  highInterpretation: string;
  lowInterpretation: string;
}

export interface CrossModuleBridge {
  conditions: { moduleId: QuizModuleId; dimension: string; threshold: "high" | "low" }[];
  insight: string;
  recommendModule?: QuizModuleId;
  recommendReason?: string;
}

export interface QuizModule {
  module_id: QuizModuleId;
  module_name: string;
  description: string;
  disclaimer: string;
  versions: Record<QuizVersion, QuizVersionConfig>;
  dimensions: QuizDimension[];
  crossBridges: CrossModuleBridge[];
}

export interface QuizSession {
  sessionId: string;
  moduleId: QuizModuleId;
  version: QuizVersion;
  currentQuestion: number;
  answers: Record<string, number>;
  startedAt: string;
  lastActiveAt: string;
  completed: boolean;
}

export interface QuizResult {
  sessionId: string;
  moduleId: QuizModuleId;
  version: QuizVersion;
  dimensionScores: Record<string, { raw: number; normalized: number; max: number; label: string }>;
  topDimensions: string[];
  summary: string;
  explanations: { dimension: string; text: string }[];
  suggestions: string[];
  crossModuleRecommendations: { moduleId: QuizModuleId; reason: string }[];
  completedAt: string;
}

export interface EntertainmentProfile {
  completedTests: { moduleId: QuizModuleId; version: QuizVersion; completedAt: string }[];
  results: Partial<Record<QuizModuleId, QuizResult>>;
  stablePatterns: string[];
  confidenceNotes: string[];
  preferredExplanationStyle: string;
  preferredTestLength: QuizVersion;
  responseBehavior: {
    fastAnswering: boolean;
    hesitantAnswering: boolean;
    likesDirectInterpretation: boolean;
    likesStructuredOutput: boolean;
    dislikesFluffyEncouragement: boolean;
  };
}
