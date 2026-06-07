import * as fs from "fs";
import * as path from "path";
import { addSample, getSamples, getStats } from "./query";

interface SampleDef {
  categorySlug: string;
  source: string;
  tags: string;
  notes: string;
  file: string;
}

const definitions: SampleDef[] = [
  {
    categorySlug: "longform",
    source: "个人随笔",
    tags: "荒诞,自嘲,口语化,情绪压抑,黑色幽默,结构松散但有表达感",
    notes: "场景：荒诞自嘲式的个人感想。表面上是在为吸烟辩护，实际上是在用一种荒诞的方式表达空虚、压抑和无聊时的自我消解。",
    file: "sample-01.txt",
  },
  {
    categorySlug: "longform",
    source: "个人随笔",
    tags: "哲思,抒情,虚无感,结构完整,意象统一,文学感",
    notes: "场景：关于梦境与死亡的抒情哲思。借'泡沫'比喻生命的短暂与虚空，表达对死亡终点的确信，以及对人生未满足感的复杂感受。",
    file: "sample-02.txt",
  },
  {
    categorySlug: "longform",
    source: "个人随笔",
    tags: "怀旧,抒情,温柔伤感,意象统一,时间感强,诗意",
    notes: "场景：关于雪、童年和成长遗憾的抒情回忆。以哈尔滨的雪为线索，写对童年冬天、过去的自己以及未完成遗憾的怀念。",
    file: "sample-03.txt",
  },
  {
    categorySlug: "longform",
    source: "个人随笔",
    tags: "成长反思,哲思,自我审视,结构完整,情绪克制,比喻丰富",
    notes: "场景：20岁生日后的成长回顾与自我整理。以'晚熟的果子'为题，回顾前二十年经历，反思拖延与完美主义。",
    file: "sample-04.txt",
  },
  {
    categorySlug: "longform",
    source: "个人随笔",
    tags: "苍凉,抒情,地域感强,意象统一,时间感,史诗感",
    notes: "场景：关于东北平原、土地与时间感的苍凉抒情。通过太阳、树、坟包、高压电塔等意象，写出这片土地上生命、历史和日常的重复与消散。",
    file: "sample-05.txt",
  },
];

async function seed() {
  console.log("📝 开始导入 5 个语言样本...\n");

  for (let i = 0; i < definitions.length; i++) {
    const def = definitions[i];
    try {
      const content = fs.readFileSync(path.join(__dirname, "samples", def.file), "utf-8").trim();
      const result = await addSample({
        categorySlug: def.categorySlug,
        content,
        source: def.source,
        tags: def.tags,
        notes: def.notes,
      });
      const preview = result.content.slice(0, 50).replace(/\n/g, " ");
      console.log(`✅ [${i + 1}/5] ${preview}...`);
      console.log(`   分类: ${result.categoryName} | ${result.wordCount} 词 | ${result.charCount} 字符`);
    } catch (err: any) {
      console.error(`❌ [${i + 1}/5] 失败: ${err.message}`);
    }
  }

  console.log("\n---");
  const stats = await getStats();
  console.log(`\n📊 数据库状态: ${stats.total} 条样本`);
  for (const c of stats.byCategory) {
    console.log(`   ${c.name}: ${c.count} 条 | ${c.totalWords} 词 | ${c.totalChars} 字符`);
  }
}

seed().catch((err) => {
  console.error("❌ 脚本执行失败:", err.message);
  process.exit(1);
});
