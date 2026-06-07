import { NextRequest, NextResponse } from "next/server";
import { buildAutoEvalPrompt } from "@/lib/evaluation-prompts";
import type { SceneType } from "@/lib/evaluation-types";

function isMockMode(): boolean {
  return !process.env.DEEPSEEK_API_KEY;
}

async function callLLM(systemPrompt: string, userMessage: string): Promise<string> {
  const config = {
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    model: process.env.DEEPSEEK_MODEL || "deepseek-v4-pro",
  };
  const res = await fetch(`${config.baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`LLM API error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

function mockEvalResult(sceneType: string) {
  const isMentalSupport = sceneType === "mental_support";
  return {
    dimensionScores: [
      { dimensionId: "style_consistency", score: isMentalSupport ? 3 : 4, reason: isMentalSupport ? "风格底色保留但可更温和" : "整体风格符合预设", evidence: "..." },
      { dimensionId: "clarity", score: 4, reason: "结构清晰，逻辑可跟随", evidence: "..." },
      { dimensionId: "naturalness", score: isMentalSupport ? 4 : 4, reason: "表达自然流畅", evidence: "..." },
      { dimensionId: "usefulness", score: 4, reason: "给出了有价值的建议", evidence: "..." },
      { dimensionId: "safety", score: 5, reason: "无禁忌表达，安全边界完整", evidence: "..." },
      { dimensionId: "scene_fit", score: isMentalSupport ? 3 : 4, reason: isMentalSupport ? "可增加共情深度" : "场景适配良好", evidence: "..." },
    ],
    overallScore: isMentalSupport ? 3.5 : 4.0,
    failureTags: isMentalSupport ? ["F_TONE_003"] : [],
    diagnosis: {
      suspectedCauses: isMentalSupport ? ["心理支持场景中温度权重不足"] : [],
      severity: isMentalSupport ? "minor" : "minor",
      isHardFail: false,
    },
    improvements: isMentalSupport ? [
      { target: "scene_patch", action: "在心理支持补丁中增加共情权重，降低理性分析强度", priority: 3, expectedEffect: "提升场景适配度 0.5-1 分", verificationMethod: "用 3 条典型安慰型问题重新评估" },
    ] : [],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { responseContent, userMessage, sceneType, contextMessages } = body as {
      responseContent: string;
      userMessage?: string;
      sceneType: SceneType;
      contextMessages?: { role: string; content: string }[];
    };

    if (!responseContent) {
      return NextResponse.json({ error: "responseContent required" }, { status: 400 });
    }

    if (isMockMode()) {
      return NextResponse.json(mockEvalResult(sceneType || "general_chat"));
    }

    const prompt = buildAutoEvalPrompt({
      responseContent,
      userMessage,
      sceneType: sceneType || "general_chat",
      contextMessages,
    });
    const result = await callLLM(prompt, "请对上述回复进行评分。");
    const cleaned = result.replace(/```json\s*|```\s*/g, "").trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[evaluation/auto]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
