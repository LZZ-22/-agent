import { NextRequest, NextResponse } from "next/server";
import { styledChat, normalChat, mentalChat, funChat } from "@/lib/llm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, mode = "styled" } = body as {
      messages: { role: string; content: string }[];
      mode?: "styled" | "normal" | "both" | "mental" | "fun";
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const userMessage = messages[messages.length - 1].content;

    if (mode === "both") {
      const [styledRes, normalRes] = await Promise.all([
        styledChat(userMessage),
        normalChat(userMessage),
      ]);
      return NextResponse.json({ styled: styledRes.reply, normal: normalRes.reply });
    }

    if (mode === "normal") {
      const res = await normalChat(userMessage);
      return NextResponse.json({ reply: res.reply, isStyled: false });
    }

    if (mode === "mental") {
      const res = await mentalChat(userMessage);
      return NextResponse.json({ reply: res.reply, isStyled: true, mode: "mental" });
    }

    if (mode === "fun") {
      const res = await funChat(userMessage);
      return NextResponse.json({ reply: res.reply, isStyled: true, mode: "fun" });
    }

    // 默认：风格化模式
    const res = await styledChat(userMessage);
    return NextResponse.json({ reply: res.reply, isStyled: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
