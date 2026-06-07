import { NextRequest, NextResponse } from "next/server";
import { AGENT_STRATEGIES } from "@/lib/experiment-strategies";
import { generateMockReply } from "@/lib/mock";

function isMockMode() { return !process.env.DEEPSEEK_API_KEY; }

// 模拟不同策略的回答差异
function mockAnswerForStrategy(input: string, strategyId: string): string {
  const base = generateMockReply(input, true);
  switch (strategyId) {
    case "baseline_direct_llm":
      return `[Baseline] 这是一个直接回答，没有数据库支持，也没有风格注入。基于一般常识：${base.slice(0, 100)}`;
    case "db_augmented_agent":
      return `[DB Augmented] 根据数据库查询结果（159条样本，10个分类），结合事实分析：${base.slice(0, 100)}`;
    case "db_augmented_with_style":
      return `[DB + Style] 先说结论——从数据库来看，信息还算清楚。${base.slice(0, 80)}。建议你根据实际情况进一步确认，别全信我这个数据库。`;
    case "db_augmented_with_style_and_guardrails":
      return `[DB + Style + Guardrails] 结论先行：当前数据库显示相关记录存在，但信息量有限——我不会假装知道数据库里没有的东西。${base.slice(0, 80)}`;
    default:
      return base;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inputMessage, strategyIds } = body as { inputMessage: string; strategyIds: string[] };

    if (!inputMessage || !strategyIds?.length) {
      return NextResponse.json({ error: "inputMessage and strategyIds required" }, { status: 400 });
    }

    const variants = [];
    for (const sid of strategyIds) {
      const strategy = AGENT_STRATEGIES.find((s) => s.id === sid);
      if (!strategy) continue;

      let answer: string;
      if (isMockMode()) {
        answer = mockAnswerForStrategy(inputMessage, sid);
      } else {
        // 真实模式：调用 /api/agent 并指定策略参数
        const res = await fetch(`${req.nextUrl.origin}/api/agent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: inputMessage,
            // 传递策略参数（agent route 需要支持）
            strategy: sid,
          }),
        });
        const data = await res.json();
        answer = data.answer || "Agent 未返回有效回答";
      }

      // 对每个变体执行自动评估
      let evalResult = null;
      try {
        const evalRes = await fetch(`${req.nextUrl.origin}/api/evaluation/auto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            responseContent: answer,
            userMessage: inputMessage,
            sceneType: "general_chat",
          }),
        });
        evalResult = await evalRes.json();
      } catch {}

      variants.push({
        strategyId: sid,
        strategyName: strategy.name,
        answer,
        totalScore: evalResult?.overallScore || 0,
        dimensionScores: evalResult?.dimensionScores || {},
      });
    }

    return NextResponse.json({
      id: "exp_" + Date.now().toString(36),
      inputMessage,
      variants,
      createdAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
