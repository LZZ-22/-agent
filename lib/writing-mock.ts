import type { Article, WritingChatResponse, Paragraph } from "./types";
import { generateId } from "./utils";

// ─── Mock 风格画像 ─────────────────────────────────────
export const MOCK_LONGFORM_PROFILE = {
  extractedAt: new Date().toISOString(),
  sampleCount: 5,
  dominantTags: ["抒情", "哲思", "意象统一", "结构完整"],
  toneKeywords: ["克制", "真诚", "诗意", "留白", "怀旧"],
  structuralPatterns: ["意象贯穿全文", "首尾呼应", "由具体到抽象", "分节叙事"],
  commonImagery: ["雪", "夜晚", "土地", "泡沫", "路", "残阳", "树", "风"],
  topSamples: [
    { id: 4, title: "晚熟的果子", excerpt: "人生海海，很难讲清。凡事发生，小有遗憾的不少，十全十美和悔不当初的不多。" },
    { id: 2, title: "梦和死亡", excerpt: "人生如梦似幻，像个斑斓的泡沫，泡沫破裂，人死灯灭。" },
    { id: 5, title: "残阳坠落在北方的平原", excerpt: "羔羊低头吃草，鸟群飞翔，木讷的人就站在那，看着残阳一点一点沉没，霞光如血…" },
  ],
};

// ─── Mock 文章 ─────────────────────────────────────────
export function createMockArticle(title: string, genre: string): Article {
  const id = "art_" + generateId();
  const paragraphs: Paragraph[] = [
    {
      id: `p_${id}_00`, seq: 0, content: "北方的冬天来得总是很突然。前一天还是满树金黄的叶子，一夜之间就被风摘光了。剩下的枝干瘦瘦地立在灰白的天空下，像是一个不善于表达的人，把话都咽了回去。", version: 1, history: [],
    },
    {
      id: `p_${id}_01`, seq: 1, content: "我走在这样的街道上，脚下的落叶已经失去了颜色，踩上去只有细碎的声响。空气干燥而冷冽，每一次呼吸都像在喝冰水——不是那种让人难受的冷，而是一种让人清醒的冷。", version: 1, history: [],
    },
    {
      id: `p_${id}_02`, seq: 2, content: "小时候的冬天比现在漫长。记忆里的雪总是下得很大，大到可以把整个世界都涂成白色。那时候的我不觉得冷，因为冷是理所当然的——就像夏天的热一样，没什么好抱怨的。", version: 1, history: [],
    },
    {
      id: `p_${id}_03`, seq: 3, content: "后来我离开了北方，到南方读书。第一个冬天，我看着窗外依然翠绿的树，忽然觉得少了点什么。少了一场可以覆盖一切的大雪，少了一个让世界安静下来的理由。南方的冬天太温和了，温和到让人忘了季节在变化，也忘了自己在变化。", version: 1, history: [],
    },
    {
      id: `p_${id}_04`, seq: 4, content: "今年冬天我又回到了北方。走在同样的街道上，树还是那几棵树，风还是那样吹。只是我不再是当年那个在雪地里奔跑的孩子了——这也没什么不好的。冬天每年都会来，只是我们不再是同一个冬天里的人。", version: 1, history: [],
    },
  ];
  return { id, title, genre, status: "draft", paragraphs, conversationId: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

// ─── Mock 段落修改 ─────────────────────────────────────
const MOCK_REVISIONS: Record<string, string> = {
  shorten: "精简过的版本：这一段确实可以更短一些。删掉了多余的修饰，保留了核心的意象和感受。",
  expand: "展开后的版本：这一段我补充了更多的细节——那些被省略的画面、被压缩的感受，现在都慢慢舒展开来。就像把一张折叠的纸重新铺平。",
  lyrical: "调整语气后的版本：这一段现在多了一些抒情的感觉，节奏放慢了，像是在黄昏时分停下脚步，看着光一点点从树梢上滑落。",
};

// ─── Mock API 回复 ─────────────────────────────────────
export function mockWritingChat(
  messages: { role: string; content: string }[],
  _articleState?: any,
  selectedParagraphId?: string
): WritingChatResponse {
  const lastMsg = messages[messages.length - 1]?.content || "";

  // 段落修改模式
  if (selectedParagraphId) {
    const key = lastMsg.includes("精简") || lastMsg.includes("短") ? "shorten"
      : lastMsg.includes("展开") || lastMsg.includes("扩充") ? "expand"
      : "lyrical";
    return {
      reply: `已按照你的要求修改了段落 ${selectedParagraphId}。你看看效果怎么样？`,
      action: "paragraph_revised",
      articlePatch: {
        paragraphs: [{ seq: parseInt(selectedParagraphId.split("_").pop() || "0"), content: MOCK_REVISIONS[key] }],
      },
    };
  }

  // 初稿生成模式
  if (lastMsg.includes("写") || lastMsg.includes("生成") || lastMsg.includes("开始")) {
    return {
      reply: "初稿已经生成。每个段落都可以单独点击选中，然后告诉我你想怎么改。比如你可以说'第二段太长，精简到一半'或'最后一段加点抒情'。",
      action: "draft_generated",
      articlePatch: {
        title: "北方的冬天",
        genre: "散文",
        paragraphs: [
          { seq: 0, content: "北方的冬天来得总是很突然。前一天还是满树金黄的叶子，一夜之间就被风摘光了。剩下的枝干瘦瘦地立在灰白的天空下，像是一个不善于表达的人，把话都咽了回去。" },
          { seq: 1, content: "我走在这样的街道上，脚下的落叶已经失去了颜色，踩上去只有细碎的声响。空气干燥而冷冽，每一次呼吸都像在喝冰水——不是那种让人难受的冷，而是一种让人清醒的冷。" },
          { seq: 2, content: "小时候的冬天比现在漫长。记忆里的雪总是下得很大，大到可以把整个世界都涂成白色。那时候的我不觉得冷，因为冷是理所当然的——就像夏天的热一样，没什么好抱怨的。" },
          { seq: 3, content: "后来我离开了北方，到南方读书。第一个冬天，我看着窗外依然翠绿的树，忽然觉得少了点什么。少了一场可以覆盖一切的大雪，少了一个让世界安静下来的理由。" },
          { seq: 4, content: "今年冬天我又回到了北方。走在同样的街道上，树还是那几棵树，风还是那样吹。只是我不再是当年那个在雪地里奔跑的孩子了——这也没什么不好的。冬天每年都会来，只是我们不再是同一个冬天里的人。" },
        ],
      },
    };
  }

  // 默认：追问澄清
  return {
    reply: "好的，你想写什么类型的文章呢？比如散文、随笔、评论——或者你已经有具体的主题了？另外，文章的篇幅有要求吗？",
    action: "ask_clarify",
  };
}
