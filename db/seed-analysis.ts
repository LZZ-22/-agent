import initSqlJs from "sql.js";
import * as fs from "fs";
import * as path from "path";

const DB_PATH = path.join(__dirname, "style_samples.db");

async function seed() {
  const SQL = await initSqlJs();
  const buf = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(buf);

  // 添加新分类：风格分析
  try {
    db.run("INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)", [
      "风格分析",
      "style-analysis",
      "语言风格和审美风格的元分析文档，供 StyleAgent 参考调用",
    ]);
    console.log("✅ 新增分类: 风格分析 (style-analysis)");
  } catch (e: any) {
    if (e.message?.includes("UNIQUE")) {
      console.log("⏭  分类已存在，跳过");
    } else {
      throw e;
    }
  }

  // 获取分类 ID
  const cat = db.exec("SELECT id FROM categories WHERE slug = 'style-analysis'");
  const catId = cat[0]?.values[0][0];
  const content = fs.readFileSync(
    path.join(__dirname, "samples", "style-analysis.txt"),
    "utf-8"
  ).trim();

  // 插入分析文档
  db.run(
    `INSERT INTO samples (category_id, content, source, tags, word_count, char_count, language, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      catId,
      content,
      "风格分析",
      "语言风格,审美风格,元分析,StyleAgent参考,留白,短句,多语言,视觉偏好",
      0,
      content.length,
      "zh",
      "用户个人语言风格和审美风格的完整分析文档。用途：辅助 StyleAgent 了解用户风格，为 prompt 构建和风格一致性评估提供参考基准。",
    ]
  );

  console.log(`✅ 风格分析文档已写入 (${content.length} 字符)`);

  // 保存数据库
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
  db.close();

  console.log("\n📂 当前分类:");
  const SQL2 = await initSqlJs();
  const db2 = new SQL2.Database(fs.readFileSync(DB_PATH));
  const cats = db2.exec(
    "SELECT c.name, COUNT(s.id) as cnt, COALESCE(SUM(s.char_count),0) as chars FROM categories c LEFT JOIN samples s ON s.category_id = c.id GROUP BY c.id ORDER BY c.id"
  );
  if (cats[0]) {
    for (const row of cats[0].values) {
      console.log(`   ${row[0]}: ${row[1]} 条 | ${row[2]} 字符`);
    }
  }
  db2.close();
}

seed().catch((err) => {
  console.error("❌ 失败:", err.message);
  process.exit(1);
});
