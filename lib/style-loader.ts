// 服务端：从 SQLite 数据库加载长文样本并提取风格特征
// 浏览器端回退到硬编码的 MOCK_LONGFORM_PROFILE

import type { LongformStyleProfile } from "./types";

// ─── 硬编码回退 ────────────────────────────────────────

const FALLBACK_PROFILE: LongformStyleProfile = {
  extractedAt: new Date().toISOString(),
  sampleCount: 5,
  dominantTags: ["抒情", "哲思", "意象统一", "结构完整"],
  toneKeywords: ["克制", "真诚", "诗意", "留白", "怀旧", "苍凉", "自嘲"],
  structuralPatterns: ["意象贯穿全文", "首尾呼应", "由具体到抽象", "从场景到感悟"],
  commonImagery: ["雪", "夜晚", "土地", "泡沫", "路", "残阳", "树", "风", "烟", "冬天"],
  topSamples: [
    { id: 4, title: "晚熟的果子", relevanceScore: 5, excerpt: "人生海海，很难讲清。凡事发生，小有遗憾的不少，十全十美和悔不当初的不多。囫囵吞枣，不得滋味。" },
    { id: 2, title: "梦和死亡", relevanceScore: 5, excerpt: "人生如梦似幻，像个斑斓的泡沫，泡沫破裂，人死灯灭。忽的一瞬，那个叫做生命的美丽的泡沫便没有了。" },
    { id: 5, title: "残阳坠落在北方的平原", relevanceScore: 4, excerpt: "羔羊低头吃草，鸟群飞翔，木讷的人就站在那，看着残阳一点一点沉没，霞光如血…" },
    { id: 1, title: "烟鬼的理论", relevanceScore: 4, excerpt: "我想，一个平凡普通的大学生，在一个不喜欢的大学、不知道前途未来的专业、在空虚空洞的生活中，如果不能呐喊的话，起码能点上一支烟。" },
    { id: 3, title: "晚上好，雪小姐", relevanceScore: 4, excerpt: "一个东北人注定要和雪结缘，一个哈尔滨的孩子注定要在漫长冬夜里怀念他人生中的那场大雪。" },
  ],
};

let cachedProfile: LongformStyleProfile | null = null;

// ─── 服务端加载 ────────────────────────────────────────

export async function loadLongformProfile(): Promise<LongformStyleProfile> {
  if (cachedProfile) return cachedProfile;

  try {
    const initSqlJs = (await import("sql.js")).default;
    const fs = await import("fs");
    const path = await import("path");

    const dbPath = path.join(process.cwd(), "db", "style_samples.db");
    if (!fs.existsSync(dbPath)) {
      console.warn("[style-loader] DB not found, using fallback");
      return FALLBACK_PROFILE;
    }

    const SQL = await initSqlJs();
    const buf = fs.readFileSync(dbPath);
    const db = new SQL.Database(buf);

    const cat = db.exec("SELECT id FROM categories WHERE slug = 'longform'");
    if (!cat[0] || cat[0].values.length === 0) {
      db.close();
      return FALLBACK_PROFILE;
    }

    const catId = cat[0].values[0][0];
    const rows = db.exec(
      "SELECT id, content, tags, notes, char_count FROM samples WHERE category_id = ? ORDER BY char_count DESC",
      [catId]
    );

    if (!rows[0] || rows[0].values.length === 0) {
      db.close();
      return FALLBACK_PROFILE;
    }

    const samples = rows[0].values.map((r) => ({
      id: r[0] as number,
      content: r[1] as string,
      tags: (r[2] as string || "").split(",").map((t) => t.trim()).filter(Boolean),
      notes: r[3] as string,
      charCount: r[4] as number,
    }));

    // 提取风格特征
    const allTags = samples.flatMap((s) => s.tags);
    const tagFreq = new Map<string, number>();
    allTags.forEach((t) => tagFreq.set(t, (tagFreq.get(t) || 0) + 1));
    const dominantTags = [...tagFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([t]) => t);

    // 聚合语气关键词
    const toneKeywords = [...new Set([
      ...dominantTags.filter((t) => ["抒情", "怀旧", "哲思", "温柔伤感", "自嘲", "克制", "苍凉", "诗意", "荒诞"].includes(t)),
      "真诚", "留白", "意象化",
    ])];

    // 结构模式推断
    const structuralPatterns = [
      "意象贯穿全文（如'泡沫''雪''残阳'）",
      "由具体场景→抽象感悟的自然推进",
      "首尾呼应",
      "分节叙事，段落之间有呼吸感",
    ];

    // 常用意象提取
    const imageryKeywords = ["雪", "夜晚", "土地", "泡沫", "路", "残阳", "树", "风", "烟", "冬天", "梦", "死亡", "天空", "水", "光"];
    const commonImagery = imageryKeywords.filter((img) =>
      samples.some((s) => s.content.includes(img))
    );

    const profile: LongformStyleProfile = {
      extractedAt: new Date().toISOString(),
      sampleCount: samples.length,
      dominantTags,
      toneKeywords: toneKeywords.slice(0, 8),
      structuralPatterns,
      commonImagery: commonImagery.slice(0, 10),
      topSamples: samples.slice(0, 5).map((s) => ({
        id: s.id,
        title: extractTitle(s.content),
        relevanceScore: 5,
        excerpt: s.content.slice(0, 200).replace(/\n/g, " "),
      })),
    };

    db.close();
    cachedProfile = profile;
    console.log(`[style-loader] Extracted profile from ${samples.length} longform samples`);
    return profile;
  } catch (err) {
    console.warn("[style-loader] Load failed, using fallback:", (err as Error).message);
    return FALLBACK_PROFILE;
  }
}

function extractTitle(content: string): string {
  const firstLine = content.split("\n")[0]?.trim() || "";
  return firstLine.length > 30 ? firstLine.slice(0, 30) + "..." : firstLine;
}

// 浏览器端同步回退
export function getFallbackProfile(): LongformStyleProfile {
  return FALLBACK_PROFILE;
}
