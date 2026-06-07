import initSqlJs, { type Database } from "sql.js";
import * as fs from "fs";
import * as path from "path";

const DB_PATH = path.join(__dirname, "style_samples.db");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");
const SEED_PATH = path.join(__dirname, "seed.sql");

async function setup() {
  // 删除旧数据库
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log("🗑  已删除旧数据库");
  }

  // 初始化 sql.js
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  db.run("PRAGMA journal_mode = WAL;");
  db.run("PRAGMA foreign_keys = ON;");

  // 执行 Schema
  const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
  db.run(schema);
  console.log("✅ Schema 已创建");

  // 执行种子数据
  const seed = fs.readFileSync(SEED_PATH, "utf-8");
  db.run(seed);
  console.log("✅ 分类数据已写入");

  // 验证
  const categories = db.exec("SELECT * FROM categories");
  console.log("\n📂 分类列表:");
  if (categories[0]) {
    for (const row of categories[0].values) {
      console.log(`   ${row[0]}. ${row[1]} (${row[2]}) — ${row[3]}`);
    }
  }

  // 列出所有表
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log(`\n📊 共 ${tables[0]?.values.length || 0} 个表: ${tables[0]?.values.map((r) => r[0]).join(", ")}`);

  // 写入磁盘
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
  db.close();

  console.log(`\n🎉 数据库已就绪: ${DB_PATH}`);
}

setup().catch((err) => {
  console.error("❌ 初始化失败:", err.message);
  process.exit(1);
});
