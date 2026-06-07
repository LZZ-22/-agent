import { generateMockReply, generateMockEvaluation } from "./mock";
import { composePrompt } from "./prompts";
import { GENERAL_CHAT_PATCH, MENTAL_SUPPORT_PATCH, FUN_ZONE_PATCH } from "./scene-patches";
import {
  buildWritingClarifyPrompt,
  buildWritingOutlinePrompt,
  buildWritingDraftPrompt,
  buildWritingRevisePrompt,
} from "./writing-prompts";
import type { ChatResponse, EvaluateResponse, ScenePatch } from "./types";

// ─── 配置检测 ──────────────────────────────────────────

function isMockMode(): boolean {
  return !process.env.DEEPSEEK_API_KEY;
}

function getConfig() {
  return {
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    model: process.env.DEEPSEEK_MODEL || "deepseek-v4-pro",
  };
}

// ─── 通用 LLM 调用 ─────────────────────────────────────

async function callLLM(
  systemPrompt: string,
  userMessage: string,
  options?: { jsonMode?: boolean }
): Promise<string> {
  const config = getConfig();

  const body: Record<string, unknown> = {
    model: config.model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  };

  if (options?.jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(`${config.baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ─── 风格化对话（支持 DB 补丁注入）─────────────────────

export async function styledChat(
  userMessage: string,
  patch?: ScenePatch
): Promise<ChatResponse> {
  const effectivePatch = patch || (GENERAL_CHAT_PATCH as unknown as ScenePatch);
  if (isMockMode()) {
    const mock = generateMockReply(userMessage, true);
    return { reply: mock, isStyled: true };
  }
  const systemPrompt = composePrompt(effectivePatch);
  const reply = await callLLM(systemPrompt, userMessage);
  return { reply, isStyled: true };
}

// ─── 心理支持对话 ──────────────────────────────────────

export async function mentalChat(
  userMessage: string,
  patch?: ScenePatch
): Promise<ChatResponse> {
  const effectivePatch = patch || (MENTAL_SUPPORT_PATCH as unknown as ScenePatch);
  if (isMockMode()) {
    const replies = [
      "我能感觉到你现在不太好受。不用急着说清楚——有时候情绪本身就是乱糟糟的，这很正常。\n\n你想多聊聊吗？我在这儿听着。",
      "谢谢你愿意说出来。这些事情放在心里确实很重。\n\n我不会跟你说'想开点'——那种话没什么用。但我可以陪你一起理一理，如果你愿意的话。",
      "听你这么说，我觉得你已经在很努力地面对了。有时候光是扛着就已经很不容易了。\n\n深呼吸一下。不用急着解决什么，我们先让情绪落一落。",
    ];
    return { reply: replies[Math.floor(Math.random() * replies.length)], isStyled: true };
  }
  const systemPrompt = composePrompt(effectivePatch);
  const reply = await callLLM(systemPrompt, userMessage);
  return { reply, isStyled: true };
}

// ─── 娱乐分区对话 ──────────────────────────────────────

export async function funChat(
  userMessage: string,
  patch?: ScenePatch
): Promise<ChatResponse> {
  const effectivePatch = patch || (FUN_ZONE_PATCH as unknown as ScenePatch);
  if (isMockMode()) {
    const replies = [
      "哈哈哈哈你这个角度我没想到。行，有道理，虽然这个道理大概是歪的。\n\n让我想想怎么接——算了不接了，你这个话题值得喝一口。🍺",
      "认真的吗？我脑子里已经自动生成了一套荒诞理论来解释你这个问题。\n\n你要是真想听，我可以给你展开讲讲——但先说好，听了别骂我。",
      "好问题。但我今天不想给正经答案。\n\n我给你三个选项：\n1. 一个认真的回答\n2. 一个离谱但自洽的回答\n3. 我现编一个名言来糊弄你\n\n你选。",
    ];
    return { reply: replies[Math.floor(Math.random() * replies.length)], isStyled: true };
  }
  const systemPrompt = composePrompt(effectivePatch);
  const reply = await callLLM(systemPrompt, userMessage);
  return { reply, isStyled: true };
}

// ─── 普通对话（无风格注入）─────────────────────────────

export async function normalChat(userMessage: string): Promise<ChatResponse> {
  if (isMockMode()) {
    const mock = generateMockReply(userMessage, false);
    return { reply: mock, isStyled: false };
  }

  const reply = await callLLM(
    "你是一个有帮助的 AI 助手。请直接、准确地回答用户的问题。",
    userMessage
  );
  return { reply, isStyled: false };
}

// ─── 自动评估 ──────────────────────────────────────────

export async function evaluateAnswer(
  evaluatorPrompt: string
): Promise<EvaluateResponse> {
  if (isMockMode()) {
    return generateMockEvaluation();
  }

  const result = await callLLM(evaluatorPrompt, "请对上述回答进行评分。", {
    jsonMode: true,
  });

  try {
    // 清理可能的 markdown 代码块标记
    const cleaned = result.replace(/```json\s*|```\s*/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse evaluation result: ${result}`);
  }
}

// ─── 文章写作 ──────────────────────────────────────────

interface WritingChatParams {
  messages: { role: string; content: string }[];
  articleState: { title?: string; genre?: string; paragraphs?: { seq: number; content: string }[] } | null;
  selectedParagraphId: string | null;
}

export async function writingChat(params: WritingChatParams): Promise<{
  reply: string;
  action: string;
  articlePatch?: { title?: string; genre?: string; paragraphs?: { seq: number; content: string }[] };
}> {
  const { messages, articleState, selectedParagraphId } = params;
  const userMessage = messages[messages.length - 1]?.content || "";

  // 判断当前阶段
  const hasArticle = !!articleState?.paragraphs?.length;
  const isRevise = hasArticle && selectedParagraphId;

  if (isMockMode()) {
    // Mock 模式由 API route 处理
    throw new Error("Mock mode handled by API route");
  }

  if (isRevise) {
    // 段落修改
    const seq = parseInt(selectedParagraphId!.split("_").pop() || "0");
    const paragraphs = articleState!.paragraphs!;
    const targetPara = paragraphs.find((p) => p.seq === seq);
    const prevPara = seq > 0 ? paragraphs.find((p) => p.seq === seq - 1) : null;
    const nextPara = paragraphs.find((p) => p.seq === seq + 1) || null;

    if (!targetPara) throw new Error(`Paragraph seq=${seq} not found`);

    const systemPrompt = buildWritingRevisePrompt(
      { title: articleState!.title || "未命名", genre: articleState!.genre || "文章" },
      targetPara.content,
      seq,
      prevPara?.content || null,
      nextPara?.content || null,
      userMessage
    );

    const revised = await callLLM(systemPrompt, "请按照要求修改指定段落。");
    return {
      reply: `已修改第 ${seq + 1} 段。`,
      action: "paragraph_revised",
      articlePatch: { paragraphs: [{ seq, content: revised.trim() }] },
    };
  }

  if (hasArticle) {
    // 已有文章，用户提出新修改需求但没有选中具体段落 → 当作全文讨论
    const systemPrompt = `${buildWritingClarifyPrompt(userMessage)}\n\n当前已有文章《${articleState!.title}》，用户可能在讨论全文修改。请回应并引导用户选中具体段落进行修改。`;
    const reply = await callLLM(systemPrompt, userMessage);
    return { reply, action: "ask_clarify" };
  }

  // 首轮对话：澄清或生成
  const clarifyPrompt = buildWritingClarifyPrompt(userMessage);
  const reply = await callLLM(clarifyPrompt, userMessage);

  // 判断是否应该直接生成初稿
  const shouldDraft = userMessage.includes("写") &&
    (userMessage.length > 30 || messages.length > 2);

  if (shouldDraft) {
    const draftPrompt = buildWritingDraftPrompt(
      userMessage,
      articleState?.genre || "散文",
      "",
      "中等"
    );
    const draftText = await callLLM(draftPrompt, "请生成完整文章。");
    const paragraphs = parseDraftParagraphs(draftText);
    return {
      reply: "初稿已生成。点击任意段落可以对该段落进行修改。",
      action: "draft_generated",
      articlePatch: {
        title: extractTitle(userMessage),
        genre: articleState?.genre || "散文",
        paragraphs,
      },
    };
  }

  return { reply, action: "ask_clarify" };
}

// ─── 辅助：解析带 <paragraph> 标签的初稿 ────────────────

function parseDraftParagraphs(text: string): { seq: number; content: string }[] {
  const regex = /<paragraph\s+seq="(\d+)"\s*>\s*([\s\S]*?)\s*<\/paragraph>/g;
  const result: { seq: number; content: string }[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    result.push({ seq: parseInt(match[1]), content: match[2].trim() });
  }
  // 如果没有匹配到标签，按空行分段落
  if (result.length === 0) {
    const parts = text.split(/\n\n+/).filter((p) => p.trim());
    parts.forEach((p, i) => result.push({ seq: i, content: p.trim() }));
  }
  return result;
}

function extractTitle(userMessage: string): string {
  const cleaned = userMessage
    .replace(/帮我写一篇|写一篇|生成一篇|关于|的散文$|的随笔$|的文章$/g, "")
    .trim();
  return cleaned.length > 30 ? cleaned.slice(0, 30) + "..." : cleaned || "未命名";
}
