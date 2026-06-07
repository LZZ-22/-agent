import type { QuizModule, QuizSession, QuizResult, QuizModuleId, QuizVersion, EntertainmentProfile } from "./quiz-types";
import { QUIZ_MODULES } from "./quiz-data/index";
import { generateId } from "./utils";

// ─── 会话管理 ──────────────────────────────────────────
const sessions = new Map<string, QuizSession>();

export function startSession(moduleId: QuizModuleId, version: QuizVersion): QuizSession {
  const mod = QUIZ_MODULES[moduleId];
  if (!mod) throw new Error(`未知模块: ${moduleId}`);
  const ver = mod.versions[version];
  if (!ver) throw new Error(`未知版本: ${version}`);

  const session: QuizSession = {
    sessionId: "quiz_" + generateId(),
    moduleId,
    version,
    currentQuestion: 0,
    answers: {},
    startedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    completed: false,
  };
  sessions.set(session.sessionId, session);
  return session;
}

export function getSession(sessionId: string): QuizSession | undefined {
  return sessions.get(sessionId);
}

export function answerQuestion(sessionId: string, score: number): { done: boolean; progress: number; total: number } {
  const s = sessions.get(sessionId);
  if (!s) throw new Error("会话不存在");
  const mod = QUIZ_MODULES[s.moduleId];
  const questions = mod.versions[s.version].questions;
  const q = questions[s.currentQuestion];
  if (!q) throw new Error("题目不存在");

  s.answers[q.id] = Math.max(1, Math.min(5, score));
  s.lastActiveAt = new Date().toISOString();

  const total = questions.length;
  s.currentQuestion = Math.min(s.currentQuestion + 1, total);
  const done = s.currentQuestion >= total;

  if (done) s.completed = true;
  return { done, progress: s.currentQuestion, total };
}

export function getCurrentQuestion(sessionId: string): { index: number; total: number; question: { id: string; text: string } } | null {
  const s = sessions.get(sessionId);
  if (!s) return null;
  const mod = QUIZ_MODULES[s.moduleId];
  const questions = mod.versions[s.version].questions;
  if (s.currentQuestion >= questions.length) return null;
  const q = questions[s.currentQuestion];
  return { index: s.currentQuestion, total: questions.length, question: { id: q.id, text: q.text } };
}

// ─── 计分 ──────────────────────────────────────────────
export function calculateResult(sessionId: string): QuizResult {
  const s = sessions.get(sessionId);
  if (!s) throw new Error("会话不存在");
  const mod = QUIZ_MODULES[s.moduleId];
  const questions = mod.versions[s.version].questions;

  const rawScores: Record<string, { sum: number; count: number; max: number }> = {};
  for (const q of questions) {
    if (!rawScores[q.dimension]) rawScores[q.dimension] = { sum: 0, count: 0, max: 0 };
    const answer = s.answers[q.id];
    if (answer === undefined) continue;
    const score = q.reverse ? 6 - answer : answer;
    rawScores[q.dimension].sum += score;
    rawScores[q.dimension].count++;
    rawScores[q.dimension].max += 5;
  }

  const dimScores: QuizResult["dimensionScores"] = {};
  for (const [dim, v] of Object.entries(rawScores)) {
    const avg = v.count > 0 ? v.sum / v.count : 3;
    const dimDef = mod.dimensions.find((d) => d.id === dim);
    dimScores[dim] = {
      raw: Math.round(avg * 10) / 10,
      normalized: Math.round((avg / 5) * 100),
      max: 5,
      label: avg >= 4 ? "偏高" : avg <= 2 ? "偏低" : "中等",
    };
  }

  // 排名
  const topDims = Object.entries(dimScores)
    .sort((a, b) => b[1].raw - a[1].raw)
    .slice(0, 3)
    .map(([d]) => d);

  // 生成解释
  const explanations = Object.entries(dimScores).map(([dim, score]) => {
    const def = mod.dimensions.find((d) => d.id === dim);
    const template = score.raw >= 4 ? def?.highInterpretation : score.raw <= 2 ? def?.lowInterpretation : `${def?.name}处于中间区域，表示你在不同情境下可能灵活切换。`;
    return { dimension: dim, text: template || "" };
  });

  // 生成建议
  const suggestions = generateSuggestions(mod, dimScores);

  // 跨模块推荐
  const crossRecs = generateCrossRecommendations(mod, dimScores);

  const summary = generateSummary(mod, dimScores, topDims);

  return {
    sessionId,
    moduleId: s.moduleId,
    version: s.version,
    dimensionScores: dimScores,
    topDimensions: topDims,
    summary,
    explanations,
    suggestions,
    crossModuleRecommendations: crossRecs,
    completedAt: new Date().toISOString(),
  };
}

function generateSummary(mod: QuizModule, scores: QuizResult["dimensionScores"], top: string[]): string {
  const topDim = mod.dimensions.find((d) => d.id === top[0]);
  const lowDim = mod.dimensions.find((d) => d.id === Object.entries(scores).sort((a, b) => a[1].raw - b[1].raw)[0]?.[0]);
  if (!topDim) return "测试完成，各项得分已生成。";
  return `粗看下来，你在${topDim.name}上倾向比较明显，而${lowDim?.name || "其他维度"}则相对不那么突出。这并不意味着好坏——更像是一套你习惯的运行方式。`;
}

function generateSuggestions(mod: QuizModule, scores: QuizResult["dimensionScores"]): string[] {
  const s: string[] = [];
  const high = Object.entries(scores).filter(([, v]) => v.raw >= 4);
  const low = Object.entries(scores).filter(([, v]) => v.raw <= 2);

  if (high.length > 0) {
    s.push(`你的高${high.map(([d]) => mod.dimensions.find((x) => x.id === d)?.name).join("、")}是你很自然的运行模式，不用刻意压着。`);
    s.push("可以利用这个倾向去选择更适合你的学习方式和工作节奏，而不是硬套别人那一套。");
  }
  if (low.length > 0) {
    s.push(`在${low.map(([d]) => mod.dimensions.find((x) => x.id === d)?.name).join("、")}上偏低，如果你觉得对生活有影响，可以有意识做一些小练习，但不是非要'改正'。`);
  }

  if (s.length === 0) s.push("你的各项指标比较均衡，可以根据具体情境灵活调整。");
  return s;
}

function generateCrossRecommendations(mod: QuizModule, scores: QuizResult["dimensionScores"]): { moduleId: QuizModuleId; reason: string }[] {
  const recs: { moduleId: QuizModuleId; reason: string }[] = [];

  for (const bridge of mod.crossBridges) {
    const match = bridge.conditions.every((c) => {
      const score = scores[c.dimension];
      if (!score) return false;
      return c.threshold === "high" ? score.raw >= 4 : score.raw <= 2;
    });
    if (match && bridge.recommendModule && bridge.recommendReason) {
      recs.push({ moduleId: bridge.recommendModule, reason: bridge.recommendReason });
    }
  }

  // 默认去重推荐
  const existing = new Set([mod.module_id]);
  for (const r of recs) {
    if (!existing.has(r.moduleId)) existing.add(r.moduleId);
  }
  // 补一个默认推荐
  const allModules: QuizModuleId[] = ["big_five_lab", "enneagram_lab", "career_interest_lab", "type_dynamics_lab", "cognitive_style_lab", "social_attachment_lab"];
  for (const m of allModules) {
    if (!existing.has(m) && recs.length < 3) {
      recs.push({ moduleId: m, reason: "这个模块可以从另一个角度帮你理解自己的偏好。" });
      existing.add(m);
    }
  }

  return recs.slice(0, 3);
}

// ─── 娱乐画像管理 ──────────────────────────────────────
const PROFILE_KEY = "quiz_entertainment_profile";

export function getProfile(): EntertainmentProfile {
  if (typeof window === "undefined") return createEmptyProfile();
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : createEmptyProfile();
  } catch { return createEmptyProfile(); }
}

function createEmptyProfile(): EntertainmentProfile {
  return {
    completedTests: [],
    results: {},
    stablePatterns: [],
    confidenceNotes: [],
    preferredExplanationStyle: "structured",
    preferredTestLength: "quick",
    responseBehavior: {
      fastAnswering: false,
      hesitantAnswering: false,
      likesDirectInterpretation: true,
      likesStructuredOutput: true,
      dislikesFluffyEncouragement: true,
    },
  };
}

export function saveProfile(profile: EntertainmentProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function recordResult(result: QuizResult): EntertainmentProfile {
  const profile = getProfile();
  profile.completedTests.push({ moduleId: result.moduleId, version: result.version, completedAt: result.completedAt });
  profile.results[result.moduleId] = result;

  // 跨模块模式检测
  detectStablePatterns(profile);
  saveProfile(profile);
  return profile;
}

function detectStablePatterns(profile: EntertainmentProfile): void {
  const patterns: string[] = [];
  const results = Object.values(profile.results).filter(Boolean) as QuizResult[];

  // 检测低外向+高反思模式
  const hasBigFive = results.find((r) => r.moduleId === "big_five_lab");
  const hasCognitive = results.find((r) => r.moduleId === "cognitive_style_lab");
  const hasSocial = results.find((r) => r.moduleId === "social_attachment_lab");

  if (hasBigFive && hasCognitive) {
    const bfExtra = hasBigFive.dimensionScores["extraversion"];
    const csRefl = hasCognitive.dimensionScores["reflection_depth"];
    if (bfExtra && csRefl && bfExtra.raw <= 2.5 && csRefl.raw >= 4) {
      patterns.push("你更像是那种先内部处理、再决定要不要表达的人。不是你不想交流，而是你对交流的质量和环境有门槛。");
    }
  }

  if (hasBigFive && hasCognitive && hasSocial) {
    const bfOpen = hasBigFive.dimensionScores["openness"];
    const csAbstr = hasCognitive.dimensionScores["abstractness"];
    if (bfOpen && csAbstr && bfOpen.raw >= 4 && csAbstr.raw >= 4) {
      patterns.push("抽象、模式、创意和意义建构是你反复出现的倾向。你大概率不是靠重复执行获得满足的人。");
    }
  }

  profile.stablePatterns = patterns;
}
