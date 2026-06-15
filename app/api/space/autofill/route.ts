import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

function isMockMode() {
  return !DEEPSEEK_API_KEY;
}

async function callLLM(prompt: string): Promise<string> {
  const res = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: "system", content: "你是一个文化数据库助手。请以严格的 JSON 格式回答，不要包含任何其他文字。" },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "{}";
}

// 按分类生成 mock 数据
function mockAutofill(title: string, category: string): any {
  const mocks: Record<string, any[]> = {
    film: [
      { creator: "王家卫", year: "2000", tags: ["文艺", "香港", "经典"], note: "花样年华，光影迷离。" },
      { creator: "Christopher Nolan", year: "2010", tags: ["科幻", "烧脑", "好莱坞"], note: "时间的迷宫。" },
      { creator: "宫崎骏", year: "2001", tags: ["动画", "日本", "奇幻"], note: "每一帧都是壁纸。" },
    ],
    music: [
      { creator: "The Beatles", year: "1969", tags: ["Rock", "经典", "英伦"], note: "改变了流行音乐史。" },
      { creator: "坂本龙一", year: "1983", tags: ["电子", "日本", "实验"], note: "声音的哲学家。" },
      { creator: "Billie Eilish", year: "2019", tags: ["Pop", "Alternative", "新锐"], note: "Z世代的声波日记。" },
    ],
    architecture: [
      { creator: "安藤忠雄", year: "1989", tags: ["极简", "混凝土", "日本"], note: "光的建筑师。" },
      { creator: "Zaha Hadid", year: "2010", tags: ["参数化", "流动", "未来主义"], note: "曲线即力量。" },
    ],
    literature: [
      { creator: "村上春树", year: "1987", tags: ["日本", "超现实", "孤独"], note: "另一个世界的入口。" },
      { creator: "Jorge Luis Borges", year: "1941", tags: ["阿根廷", "迷宫", "无限"], note: "图书馆即是宇宙。" },
    ],
    philosophy: [
      { creator: "Friedrich Nietzsche", year: "1885", tags: ["德国", "超人", "虚无主义"], note: "上帝已死，人是桥梁。" },
      { creator: "Michel Foucault", year: "1975", tags: ["法国", "权力", "规训"], note: "知识即权力。" },
    ],
  };
  const pool = mocks[category] || mocks.film;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  const searchKeyword = encodeURIComponent(`${title} ${pick.creator} ${category}`);
  return {
    ...pick,
    image: `https://source.unsplash.com/featured/800x600/?${searchKeyword}`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { title, category } = (await req.json()) as { title: string; category: string };

    if (!title?.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    // Mock 模式
    if (isMockMode()) {
      return NextResponse.json(mockAutofill(title.trim(), category));
    }

    // LLM 模式
    const categoryLabels: Record<string, string> = {
      film: "电影", music: "音乐专辑", architecture: "建筑", literature: "文学书籍", philosophy: "哲学著作",
    };
    const catLabel = categoryLabels[category] || "作品";

    const prompt = `请为以下${catLabel}补全信息。所有字段必须使用中文，人名使用通用的中文译名，标签用中文。以 JSON 格式返回：

{
  "creator": "创作者中文名（如：克里斯托弗·诺兰、坂本龙一、安藤忠雄）",
  "year": "创作年份",
  "tags": ["中文标签1", "中文标签2", "中文标签3"],
  "note": "一句话中文笔记（可选，不知道可留空）",
  "searchKeyword": "英文关键词，用于搜索封面图（如 chinese-movie-poster、album-cover-vinyl、architecture-photography）"
}

作品名：${title.trim()}

重要：所有文字必须是中文。creator 用中文译名。tags 用中文。note 用中文。`;

    const result = await callLLM(prompt);
    const parsed = JSON.parse(result);

    const kw = encodeURIComponent(parsed.searchKeyword || `${title} ${parsed.creator}`);
    const image = `https://source.unsplash.com/featured/800x600/?${kw}`;

    return NextResponse.json({
      creator: parsed.creator || "",
      year: parsed.year || "",
      tags: parsed.tags || [],
      note: parsed.note || "",
      image,
    });
  } catch (err: any) {
    console.error("[autofill]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
