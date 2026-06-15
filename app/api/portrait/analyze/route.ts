import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json({
        summary: `基于你的风格规范「${body.styleName || "未命名"}」生成的画像`,
        traits: body.topTags?.length
          ? [
              `你收藏了 ${body.spaceItems} 件作品，涵盖 ${Object.values(body.categoryStats || {}).filter((v: any) => v > 0).length} 个领域`,
              `最关注的标签：${body.topTags?.slice(0, 3).map((t: any) => t[0]).join("、")}`,
              `完成了 ${body.totalConvs} 次对话和 ${body.writingSessions} 次写作`,
              `风格定位：${body.styleName || "未定义"}`,
            ]
          : ["暂无足够数据生成画像，请先添加收藏或进行对话。"],
        rawData: body,
      });
    }

    const prompt = `你是一位敏锐的个人风格分析师。请根据以下数据，生成一份简洁的个人画像分析：

- 风格名称：${body.styleName}
- 收藏作品数：${body.spaceItems} 件
- 收藏分布：${JSON.stringify(body.categoryStats)}
- 高频标签：${JSON.stringify(body.topTags?.slice(0, 5))}
- 对话主题：${JSON.stringify(body.convThemes)}
- 完成对话数：${body.totalConvs}
- 写作次数：${body.writingSessions}

请用中文输出 JSON：
{
  "summary": "一段 2-3 句话的整体画像概述，语气温暖、敏锐，像一位了解你的朋友",
  "traits": ["特征1", "特征2", "特征3", "特征4", "特征5"]
}

不要包含任何其他文字。`;

    // 这里使用简单的 fetch 调用 AI
    const aiRes = await fetch(`${process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com"}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${DEEPSEEK_API_KEY}` },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: [
          { role: "system", content: "你是一位个人风格分析师。以 JSON 格式输出。" },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 600,
        response_format: { type: "json_object" },
      }),
    });

    if (aiRes.ok) {
      const aiData = await aiRes.json();
      const content = aiData.choices?.[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      return NextResponse.json({ ...parsed, rawData: body });
    }

    throw new Error("AI call failed");
  } catch {
    return NextResponse.json({
      summary: "画像生成中...",
      traits: ["Agent 正在学习你的数据"],
      rawData: {},
    });
  }
}
