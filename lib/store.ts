import type { StyleProfile, Conversation, ComparisonResult, EvaluationResult, DashboardStats } from "./types";
import { generateId } from "./utils";
import { defaultProfile, mockConversations, mockComparisons, mockEvaluations } from "./mock";

const KEYS = {
  profile: "styleagent_profile",
  conversations: "styleagent_conv",
  comparisons: "styleagent_compare",
  evaluations: "styleagent_eval",
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── 风格规范 ──────────────────────────────────────────

export function getProfile(): StyleProfile {
  return getItem<StyleProfile>(KEYS.profile, defaultProfile);
}

export function saveProfile(profile: StyleProfile): void {
  setItem(KEYS.profile, { ...profile, updatedAt: new Date().toISOString() });
}

export function exportProfileJSON(): string {
  return JSON.stringify(getProfile(), null, 2);
}

// ─── 对话 ──────────────────────────────────────────────

export function getConversations(): Conversation[] {
  return getItem<Conversation[]>(KEYS.conversations, mockConversations);
}

export function saveConversation(conv: Omit<Conversation, "id" | "createdAt">): Conversation {
  const conversations = getConversations();
  const created: Conversation = { ...conv, id: generateId(), createdAt: new Date().toISOString() };
  conversations.unshift(created);
  setItem(KEYS.conversations, conversations);
  return created;
}

export function updateConversation(id: string, updates: Partial<Conversation>): void {
  const conversations = getConversations().map((c) => (c.id === id ? { ...c, ...updates } : c));
  setItem(KEYS.conversations, conversations);
}

// ─── 对比结果 ──────────────────────────────────────────

export function getComparisons(): ComparisonResult[] {
  return getItem<ComparisonResult[]>(KEYS.comparisons, mockComparisons);
}

export function saveComparison(cmp: Omit<ComparisonResult, "id" | "createdAt">): ComparisonResult {
  const comparisons = getComparisons();
  const created: ComparisonResult = { ...cmp, id: generateId(), createdAt: new Date().toISOString() };
  comparisons.unshift(created);
  setItem(KEYS.comparisons, comparisons);
  return created;
}

export function updateComparison(id: string, updates: Partial<ComparisonResult>): void {
  const comparisons = getComparisons().map((c) => (c.id === id ? { ...c, ...updates } : c));
  setItem(KEYS.comparisons, comparisons);
}

// ─── 评估结果 ──────────────────────────────────────────

export function getEvaluations(): EvaluationResult[] {
  return getItem<EvaluationResult[]>(KEYS.evaluations, mockEvaluations);
}

export function saveEvaluation(eval_: Omit<EvaluationResult, "id" | "createdAt">): EvaluationResult {
  const evaluations = getEvaluations();
  const created: EvaluationResult = { ...eval_, id: generateId(), createdAt: new Date().toISOString() };
  evaluations.unshift(created);
  setItem(KEYS.evaluations, evaluations);
  return created;
}

// ─── 统计 ──────────────────────────────────────────────

export function getStats(): DashboardStats {
  const conversations = getConversations();
  const evaluations = getEvaluations();
  const comparisons = getComparisons();

  const scores = evaluations.map((e) => e.scores);
  const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * 10) / 10 : 0);

  const preferred = comparisons.filter((c) => c.preference === "styled").length;
  const rated = comparisons.filter((c) => c.preference !== null).length;

  return {
    totalConversations: conversations.length,
    totalEvaluations: evaluations.length,
    avgStyleConsistency: avg(scores.map((s) => s.styleConsistency.score)),
    avgClarity: avg(scores.map((s) => s.clarity.score)),
    avgNaturalness: avg(scores.map((s) => s.naturalness.score)),
    avgUsefulness: avg(scores.map((s) => s.usefulness.score)),
    styledPreferenceRate: rated > 0 ? Math.round((preferred / rated) * 100) : 0,
    recentFeedback: comparisons.slice(0, 10).map((c) => ({
      id: c.id,
      question: c.question.slice(0, 60),
      preference: c.preference,
      createdAt: c.createdAt,
    })),
  };
}

// ─── 导出全部数据 ──────────────────────────────────────

export function exportAllData(): string {
  return JSON.stringify(
    {
      profile: getProfile(),
      conversations: getConversations(),
      comparisons: getComparisons(),
      evaluations: getEvaluations(),
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );
}

// ─── 初始化 ────────────────────────────────────────────

export function initStore(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(KEYS.profile)) setItem(KEYS.profile, defaultProfile);
  if (!localStorage.getItem(KEYS.conversations)) setItem(KEYS.conversations, mockConversations);
  if (!localStorage.getItem(KEYS.comparisons)) setItem(KEYS.comparisons, mockComparisons);
  if (!localStorage.getItem(KEYS.evaluations)) setItem(KEYS.evaluations, mockEvaluations);
}
