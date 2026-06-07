import { NextRequest, NextResponse } from "next/server";
import { writingChat } from "@/lib/llm";
import { mockWritingChat } from "@/lib/writing-mock";

function isMockMode(): boolean {
  return !process.env.DEEPSEEK_API_KEY;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, articleState, selectedParagraphId } = body as {
      messages: { role: string; content: string }[];
      articleState?: { title?: string; genre?: string; paragraphs?: { seq: number; content: string }[] };
      selectedParagraphId?: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Mock 模式：使用预设数据跑通交互
    if (isMockMode()) {
      const result = mockWritingChat(messages, articleState, selectedParagraphId || undefined);
      return NextResponse.json(result);
    }

    // 真实 LLM 模式：调用 DeepSeek + 风格 Prompt
    const result = await writingChat({
      messages,
      articleState: articleState || null,
      selectedParagraphId: selectedParagraphId || null,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[writing/chat]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
