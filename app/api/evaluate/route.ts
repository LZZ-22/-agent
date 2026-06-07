import { NextRequest, NextResponse } from "next/server";
import { evaluateAnswer } from "@/lib/llm";
import { buildEvaluatorPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answer } = body as { answer: string };

    if (!answer) {
      return NextResponse.json(
        { error: "answer is required" },
        { status: 400 }
      );
    }

    const prompt = buildEvaluatorPrompt(answer);
    const result = await evaluateAnswer(prompt);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
