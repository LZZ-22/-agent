import { NextRequest, NextResponse } from "next/server";
import { QUIZ_MODULES } from "@/lib/quiz-data/index";
import { QUIZ_MODULE_LIST } from "@/lib/quiz-data/index";
import type { QuizModuleId, QuizVersion } from "@/lib/quiz-types";

// 内存会话存储（服务端）
const sessions = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, moduleId, version, sessionId, answer } = body as {
      action: string;
      moduleId?: QuizModuleId;
      version?: QuizVersion;
      sessionId?: string;
      answer?: number | string;
    };

    // 列出所有模块
    if (action === "list") {
      return NextResponse.json({ modules: QUIZ_MODULE_LIST });
    }

    // 开始新测试
    if (action === "start" && moduleId && version) {
      const mod = QUIZ_MODULES[moduleId as QuizModuleId];
      if (!mod) return NextResponse.json({ error: "未知模块" }, { status: 400 });
      const ver = mod.versions[version];
      if (!ver) return NextResponse.json({ error: "未知版本" }, { status: 400 });

      const sid = "quiz_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const session = { sessionId: sid, moduleId, version, currentQuestion: 0, answers: {} as Record<string,number>, startedAt: new Date().toISOString(), lastActiveAt: new Date().toISOString(), completed: false };
      sessions.set(sid, session);

      const q = ver.questions[0];
      return NextResponse.json({
        sessionId: sid,
        moduleName: mod.module_name,
        description: mod.description,
        disclaimer: mod.disclaimer,
        totalQuestions: ver.questions.length,
        currentQuestion: { index: 0, id: q.id, text: q.text },
        message: `开始${mod.module_name}（${version === "quick" ? "快速版" : version === "standard" ? "正常版" : "专业版"}），共${ver.questions.length}题。每题1-5分，也可以直接说'挺像我的''一般''不太像'。`,
      });
    }

    // 答题
    if (action === "answer" && sessionId && answer !== undefined) {
      const s = sessions.get(sessionId);
      if (!s) return NextResponse.json({ error: "会话不存在" }, { status: 400 });
      const mod = QUIZ_MODULES[s.moduleId as QuizModuleId];
      const questions = mod.versions[s.version as QuizVersion].questions;
      const q = questions[s.currentQuestion];
      if (!q) return NextResponse.json({ error: "测试已完成" }, { status: 400 });

      // 自然语言映射
      let score = typeof answer === "number" ? answer : mapNaturalLanguage(String(answer));
      score = Math.max(1, Math.min(5, score));

      s.answers[q.id] = score;
      s.currentQuestion++;
      s.lastActiveAt = new Date().toISOString();

      // 每5题提示进度
      const total = questions.length;
      const progressPct = Math.round((s.currentQuestion / total) * 100);
      const milestone = s.currentQuestion % 5 === 0 && s.currentQuestion < total;

      if (s.currentQuestion >= total) {
        s.completed = true;
        const result = calcResult(s, mod);
        return NextResponse.json({ done: true, result, message: "测试完成！下面是你的结果。" });
      }

      const nextQ = questions[s.currentQuestion];
      return NextResponse.json({
        done: false,
        progress: { current: s.currentQuestion, total, pct: progressPct },
        nextQuestion: { index: s.currentQuestion, id: nextQ.id, text: nextQ.text },
        milestone: milestone ? `已完成${s.currentQuestion}/${total}题（${progressPct}%）` : undefined,
      });
    }

    return NextResponse.json({ error: "未知操作" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function mapNaturalLanguage(input: string): number {
  const t = input.toLowerCase();
  if (/非常|很|特别|完全|绝对是|挺像|很像我|准|没错/.test(t)) return 5;
  if (/比较|有点|偏|算是|大概是|差不多/.test(t)) return 4;
  if (/一般|不确定|看情况|还行|有时候|中间/.test(t)) return 3;
  if (/不太|不怎么|不是很|偏不|不算/.test(t)) return 2;
  if (/完全不|根本不|一点都不|绝对不是|不像|不准/.test(t)) return 1;
  const n = parseInt(t);
  return isNaN(n) ? 3 : Math.max(1, Math.min(5, n));
}

function calcResult(s: any, mod: any) {
  const questions = mod.versions[s.version].questions;
  const rawScores: Record<string, { sum: number; count: number }> = {};
  for (const q of questions) {
    if (!rawScores[q.dimension]) rawScores[q.dimension] = { sum: 0, count: 0 };
    const ans = s.answers[q.id];
    if (ans === undefined) continue;
    rawScores[q.dimension].sum += q.reverse ? 6 - ans : ans;
    rawScores[q.dimension].count++;
  }
  const dimScores: any = {};
  for (const [dim, v] of Object.entries(rawScores)) {
    const avg = v.count > 0 ? v.sum / v.count : 3;
    const def = mod.dimensions.find((d: any) => d.id === dim);
    dimScores[dim] = { raw: Math.round(avg * 10) / 10, normalized: Math.round((avg / 5) * 100), label: avg >= 4 ? "偏高" : avg <= 2 ? "偏低" : "中等", name: def?.name || dim };
  }
  const top = Object.entries(dimScores).sort((a: any, b: any) => b[1].raw - a[1].raw).slice(0, 3).map(([d]: any) => d);
  const summary = `粗看下来，你在${top.map((d: string) => dimScores[d].name).join("、")}上倾向比较明显。`;
  return { sessionId: s.sessionId, moduleId: s.moduleId, version: s.version, dimensionScores: dimScores, topDimensions: top, summary, completedAt: new Date().toISOString() };
}
