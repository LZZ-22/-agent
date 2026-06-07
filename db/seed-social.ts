import * as fs from "fs";
import * as path from "path";
import { addSample, getStats } from "./query";

interface SocialDef {
  file: string;
  tags: string;
  notes: string;
}

const definitions: SocialDef[] = [
  {
    file: "post-01.txt",
    tags: "阿根廷,足球,世界杯,马拉多纳,传奇,应援",
    notes: "情绪表达/赛事应援。热烈、真诚、群体情绪、致敬。偏爱集体情绪与标志性视觉符号结合。",
  },
  {
    file: "post-02.txt",
    tags: "西西弗斯,荒诞,哲学,无意义感,克制",
    notes: "哲思短句。冷静、疏离、轻微戏谑。一句话完成哲思和消解，带有知识引用感。",
  },
  {
    file: "post-03.txt",
    tags: "生命,花朵,枯萎,哀伤,诗意",
    notes: "诗性表达。抒情、哀伤、克制、文学性。典型诗性句子，意象集中。",
  },
  {
    file: "post-04.txt",
    tags: "大连,旅行,海鸥,朋友,吐槽,夏天",
    notes: "旅行记录/幽默碎片。轻松、调侃、生活化、有画面感。把狼狈感、幽默感和风景感放在一起。",
  },
  {
    file: "post-05.txt",
    tags: "朋友,祝福,温柔,简短表达",
    notes: "祝福短句。真诚、温柔、平静。温柔表达不靠煽情，借事件或共同经历承载情绪。",
  },
  {
    file: "post-06.txt",
    tags: "摇滚,双关,幽默,短句",
    notes: "幽默短句。戏谑、轻松、俏皮。把'摇滚'理解成一种生活方式：上路、朋友、夜晚、随拍。",
  },
  {
    file: "post-07.txt",
    tags: "afternoon,night,双语,日常美感,时间",
    notes: "情绪记录/双语短句。轻盈、平静、感受式。双语使用让表达更轻，像即时感叹。",
  },
  {
    file: "post-08.txt",
    tags: "二十岁,成长,人生,自嘲,轻松",
    notes: "年龄感慨/自我鼓劲。自嘲、豁达、轻松。用轻松句式化解年龄焦虑，保留生活细节。",
  },
  {
    file: "post-09.txt",
    tags: "西语,玫瑰,爱情,诗句,荒芜",
    notes: "引用式抒情。深情、抒情、文学性。西语和玫瑰emoji增加浪漫气质。",
  },
  {
    file: "post-10.txt",
    tags: "周末,天气,日常,简单记录",
    notes: "日常记录。轻松、简洁、明快。拍光线、空气、云、水和出门时的零碎心情。",
  },
  {
    file: "post-11.txt",
    tags: "木漏れ日,树影,阳光,自然,日系审美",
    notes: "意象命名/审美记录。安静、清透、审美化。不拍对象，拍光线如何落在对象上。",
  },
  {
    file: "post-12.txt",
    tags: "crazy,夜晚,公路,朋友,城市,速度",
    notes: "情绪命名/状态记录。兴奋、混乱、青春感、夜行。用极短词作为整组图的标题，让图片完成叙事。",
  },
];

async function seed() {
  console.log("📝 开始导入 12 条社交媒体文案...\n");

  for (let i = 0; i < definitions.length; i++) {
    const def = definitions[i];
    try {
      const content = fs.readFileSync(
        path.join(__dirname, "samples", "social", def.file),
        "utf-8"
      ).trim();
      const result = await addSample({
        categorySlug: "social",
        content,
        source: "社交媒体",
        tags: def.tags,
        notes: def.notes,
      });
      const preview = result.content.replace(/\n/g, " // ");
      console.log(`✅ [${i + 1}/12] ${preview}`);
    } catch (err: any) {
      console.error(`❌ [${i + 1}/12] ${def.file}: ${err.message}`);
    }
  }

  console.log("\n---");
  const stats = await getStats();
  console.log(`\n📊 数据库状态: ${stats.total} 条样本`);
  for (const c of stats.byCategory) {
    console.log(`   ${c.name}: ${c.count} 条 | ${c.totalChars} 字符`);
  }
}

seed().catch((err) => {
  console.error("❌ 脚本执行失败:", err.message);
  process.exit(1);
});
