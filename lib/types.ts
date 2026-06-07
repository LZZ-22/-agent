// ─── 场景补丁 ──────────────────────────────────────────
export interface ScenePatch {
  scene_id: string;
  scene_name: string;
  scene_type: "general_chat" | "mental_support" | "fun_zone";
  version: string;
  scene_goal: string;
  typical_user_need: string;
  primary_output_goal: string;
  tone_adjustment: string[];
  structure_adjustment: string[];
  style_strength: number; // 0-100, 风格强度百分比
  allowed_behaviors: string[];
  disallowed_behaviors: string[];
  risk_boundary: string[];
  response_strategy: string;
  fallback_strategy: string;
  example_instruction: string;
  ui_hint: string;
  evaluation_focus: string[];
  example: string;
}

// ─── 风格规范 ──────────────────────────────────────────
export interface StyleProfile {
  name: string;
  persona: string;
  tone: string;
  structure: string;
  sentenceStyle: string;
  commonPhrases: string;
  avoidPhrases: string;
  lengthPreference: string;
  exampleAnswer: string;
  updatedAt: string;
}

// ─── 对话 ──────────────────────────────────────────────
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  styleVersion: string;
  createdAt: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  isStyled?: boolean;
}

// ─── 对比结果 ──────────────────────────────────────────
export interface ComparisonResult {
  id: string;
  question: string;
  normalAnswer: string;
  styledAnswer: string;
  preference: "normal" | "styled" | null;
  ratings: {
    styleConsistency: number;
    clarity: number;
    naturalness: number;
    usefulness: number;
    warmth: number;
  } | null;
  feedback: string;
  createdAt: string;
}

// ─── 评估结果 ──────────────────────────────────────────
export interface EvaluationResult {
  id: string;
  conversationId: string;
  answerText: string;
  scores: {
    styleConsistency: { score: number; reason: string };
    clarity: { score: number; reason: string };
    naturalness: { score: number; reason: string };
    usefulness: { score: number; reason: string };
    avoidance: { score: number; reason: string };
  };
  overallScore: number;
  revisionAdvice: string[];
  rewrittenAnswer: string;
  createdAt: string;
}

// ─── API 类型 ──────────────────────────────────────────
export interface ChatRequest {
  messages: { role: string; content: string }[];
  styleProfile: StyleProfile;
}

export interface ChatResponse {
  reply: string;
  isStyled: boolean;
}

export interface EvaluateRequest {
  answer: string;
  styleProfile: StyleProfile;
}

export interface EvaluateResponse {
  style_consistency: { score: number; reason: string };
  clarity: { score: number; reason: string };
  naturalness: { score: number; reason: string };
  usefulness: { score: number; reason: string };
  avoidance: { score: number; reason: string };
  overall_score: number;
  revision_advice: string[];
  rewritten_answer: string;
}

// ─── 仪表盘统计 ────────────────────────────────────────
export interface DashboardStats {
  totalConversations: number;
  totalEvaluations: number;
  avgStyleConsistency: number;
  avgClarity: number;
  avgNaturalness: number;
  avgUsefulness: number;
  styledPreferenceRate: number;
  recentFeedback: { id: string; question: string; preference: string | null; createdAt: string }[];
}

// ─── 文章写作分区 ──────────────────────────────────────

export interface Paragraph {
  id: string;           // "p_{articleId}_{seq}"
  seq: number;          // 段落序号 (0-based)
  content: string;
  version: number;
  history: ParagraphVersion[];
}

export interface ParagraphVersion {
  version: number;
  content: string;
  modifiedAt: string;
  instruction: string;
}

export interface Article {
  id: string;
  title: string;
  genre: string;
  status: "outline" | "draft" | "revising" | "done";
  paragraphs: Paragraph[];
  conversationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WritingSession {
  id: string;
  articleId: string | null;
  messages: WritingMessage[];
  currentPhase: "clarify" | "outline" | "draft" | "revise";
  createdAt: string;
}

export interface WritingMessage {
  role: "user" | "assistant" | "system";
  content: string;
  action?: "ask_clarify" | "generate_outline" | "generate_draft" | "revise_paragraph";
  targetParagraphId?: string;
}

export interface WritingChatResponse {
  reply: string;
  action: "ask_clarify" | "outline_proposal" | "draft_generated" | "paragraph_revised";
  articlePatch?: {
    title?: string;
    genre?: string;
    paragraphs?: { seq: number; content: string }[];
  };
}

export interface LongformStyleProfile {
  extractedAt: string;
  sampleCount: number;
  dominantTags: string[];
  toneKeywords: string[];
  structuralPatterns: string[];
  commonImagery: string[];
  topSamples: { id: number; title: string; relevanceScore: number; excerpt: string }[];
}

// ─── 数据库内省 ────────────────────────────────────────
export interface FieldInfo {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}

export interface TableInfo {
  name: string;
  fields: FieldInfo[];
  rowCount: number;
}

export interface DatabaseIntrospection {
  provider: string;
  summary: string;
  tables: TableInfo[];
  categorySummary?: string;
}
