// 评估历史存储 — localStorage 封装

export interface EvalRecord {
  id: string;
  inputMessage: string;
  agentAnswer: string;
  totalScore: number;
  dimensionScores: Record<string, { score: number; reason: string }>;
  keyIssues: string[];
  summary: string;
  improvementSuggestions: string[];
  strategyId?: string;
  usedDatabase: boolean;
  createdAt: string;
}

export interface ExperimentRecord {
  id: string;
  inputMessage: string;
  variants: {
    strategyId: string;
    strategyName: string;
    answer: string;
    totalScore: number;
    dimensionScores: Record<string, { score: number; reason: string }>;
  }[];
  createdAt: string;
}

const EVAL_KEY = "styleagent_eval_history";
const EXPERIMENT_KEY = "styleagent_experiment_history";

// ─── 评估记录 ──────────────────────────────────────────

export function saveEvalRecord(record: EvalRecord): void {
  if (typeof window === "undefined") return;
  const records = getEvalRecords();
  records.unshift(record);
  if (records.length > 100) records.length = 100; // cap at 100
  localStorage.setItem(EVAL_KEY, JSON.stringify(records));
}

export function getEvalRecords(): EvalRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(EVAL_KEY) || "[]");
  } catch { return []; }
}

export function deleteEvalRecord(id: string): void {
  const records = getEvalRecords().filter((r) => r.id !== id);
  localStorage.setItem(EVAL_KEY, JSON.stringify(records));
}

export function clearEvalHistory(): void {
  localStorage.removeItem(EVAL_KEY);
}

// ─── 实验记录 ──────────────────────────────────────────

export function saveExperimentRecord(record: ExperimentRecord): void {
  if (typeof window === "undefined") return;
  const records = getExperimentRecords();
  records.unshift(record);
  if (records.length > 50) records.length = 50;
  localStorage.setItem(EXPERIMENT_KEY, JSON.stringify(records));
}

export function getExperimentRecords(): ExperimentRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(EXPERIMENT_KEY) || "[]");
  } catch { return []; }
}
