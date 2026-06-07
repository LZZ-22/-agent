import initSqlJs, { type Database } from "sql.js";
import * as fs from "fs";
import * as path from "path";

const DB_PATH = path.join(__dirname, "style_samples.db");

let SQL: any = null;

async function getDb(): Promise<Database> {
  if (!SQL) SQL = await initSqlJs();
  const buffer = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(buffer);
  db.run("PRAGMA foreign_keys = ON;");
  return db;
}

function saveDb(db: Database): void {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// ─── 类型 ──────────────────────────────────────────────

export interface SampleInput {
  categorySlug: string;
  content: string;
  source?: string;
  tags?: string;
  language?: string;
  notes?: string;
}

export interface Sample extends SampleInput {
  id: number;
  categoryName: string;
  wordCount: number;
  charCount: number;
  capturedAt: string;
}

export interface CategoryStats {
  name: string;
  count: number;
  totalWords: number;
  totalChars: number;
}

// ─── 工具函数 ──────────────────────────────────────────

function execOne(db: Database, sql: string, params: any[] = []): any {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function execAll(db: Database, sql: string, params: any[] = []): any[] {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows: any[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// ─── 插入样本 ──────────────────────────────────────────

export async function addSample(input: SampleInput): Promise<Sample> {
  const db = await getDb();

  const cat = execOne(db, "SELECT id, name FROM categories WHERE slug = ?", [input.categorySlug]);
  if (!cat) {
    throw new Error(`未知分类: "${input.categorySlug}"。可用: daily, longform, social`);
  }

  const words = input.content.replace(/\s/g, "").length > 0
    ? input.content.split(/[\s\n]+/).filter(Boolean).length
    : 0;
  const chars = input.content.length;

  db.run(
    `INSERT INTO samples (category_id, content, source, tags, word_count, char_count, language, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [cat.id, input.content, input.source || null, input.tags || null, words, chars, input.language || "zh", input.notes || null]
  );

  const lastId = execOne(db, "SELECT last_insert_rowid() AS id");
  const id = lastId.id as number;

  saveDb(db);
  db.close();

  return {
    id,
    categorySlug: input.categorySlug,
    categoryName: cat.name as string,
    content: input.content,
    source: input.source,
    tags: input.tags,
    wordCount: words,
    charCount: chars,
    language: input.language || "zh",
    capturedAt: new Date().toISOString(),
    notes: input.notes,
  };
}

// ─── 查询样本 ──────────────────────────────────────────

export async function getSamples(options?: {
  categorySlug?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}): Promise<Sample[]> {
  const db = await getDb();
  const { categorySlug, tag, limit = 50, offset = 0 } = options || {};

  let sql = `
    SELECT s.*, c.name AS category_name, c.slug AS category_slug
    FROM samples s
    JOIN categories c ON s.category_id = c.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (categorySlug) {
    sql += " AND c.slug = ?";
    params.push(categorySlug);
  }
  if (tag) {
    sql += " AND s.tags LIKE ?";
    params.push(`%${tag}%`);
  }

  sql += " ORDER BY s.captured_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const rows = execAll(db, sql, params);
  db.close();

  return rows.map((r: any) => ({
    id: r.id,
    categorySlug: r.category_slug,
    categoryName: r.category_name,
    content: r.content,
    source: r.source,
    tags: r.tags,
    wordCount: r.word_count,
    charCount: r.char_count,
    language: r.language,
    capturedAt: r.captured_at,
    notes: r.notes,
  }));
}

// ─── 全文搜索（FTS5 回退到 LIKE 搜索） ─────────────────

export async function searchSamples(query: string, limit = 20): Promise<Sample[]> {
  const db = await getDb();

  // 先尝试 FTS5
  let rows: any[] = [];
  try {
    rows = execAll(
      db,
      `SELECT s.*, c.name AS category_name, c.slug AS category_slug
       FROM samples_fts f
       JOIN samples s ON f.rowid = s.id
       JOIN categories c ON s.category_id = c.id
       WHERE samples_fts MATCH ?
       ORDER BY rank
       LIMIT ?`,
      [query, limit]
    );
  } catch {
    // FTS5 不可用时回退到 LIKE
    rows = execAll(
      db,
      `SELECT s.*, c.name AS category_name, c.slug AS category_slug
       FROM samples s
       JOIN categories c ON s.category_id = c.id
       WHERE s.content LIKE ? OR s.tags LIKE ? OR s.notes LIKE ?
       ORDER BY s.captured_at DESC
       LIMIT ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`, limit]
    );
  }

  db.close();

  return rows.map((r: any) => ({
    id: r.id,
    categorySlug: r.category_slug,
    categoryName: r.category_name,
    content: r.content,
    source: r.source,
    tags: r.tags,
    wordCount: r.word_count,
    charCount: r.char_count,
    language: r.language,
    capturedAt: r.captured_at,
    notes: r.notes,
  }));
}

// ─── 删除样本 ──────────────────────────────────────────

export async function deleteSample(id: number): Promise<boolean> {
  const db = await getDb();
  db.run("DELETE FROM samples WHERE id = ?", [id]);
  const changes = db.getRowsModified();
  saveDb(db);
  db.close();
  return changes > 0;
}

// ─── 统计 ──────────────────────────────────────────────

export async function getStats(): Promise<{ total: number; byCategory: CategoryStats[] }> {
  const db = await getDb();
  const totalRow = execOne(db, "SELECT COUNT(*) AS count FROM samples");
  const byCat = execAll(
    db,
    `SELECT c.name, COUNT(s.id) AS count,
            COALESCE(SUM(s.word_count), 0) AS totalWords,
            COALESCE(SUM(s.char_count), 0) AS totalChars
     FROM categories c
     LEFT JOIN samples s ON s.category_id = c.id
     GROUP BY c.id
     ORDER BY c.id`
  );
  db.close();
  return {
    total: totalRow?.count || 0,
    byCategory: byCat.map((r: any) => ({
      name: r.name,
      count: r.count,
      totalWords: r.totalWords,
      totalChars: r.totalChars,
    })),
  };
}

// ─── CLI 运行 ──────────────────────────────────────────

async function main() {
  console.log("📊 语言样本数据库状态\n");

  const stats = await getStats();
  console.log(`总样本数: ${stats.total}`);
  console.log("\n分类统计:");
  for (const c of stats.byCategory) {
    console.log(`  ${c.name}: ${c.count} 条 | ${c.totalWords} 词 | ${c.totalChars} 字符`);
  }

  if (stats.total > 0) {
    console.log("\n📝 最近 5 条样本:");
    const recent = await getSamples({ limit: 5 });
    for (const s of recent) {
      const preview = s.content.slice(0, 60).replace(/\n/g, " ");
      console.log(`  [${s.categoryName}] ${preview}${s.content.length > 60 ? "..." : ""}`);
      console.log(`    — 来源: ${s.source || "未标注"} | 标签: ${s.tags || "无"} | ${s.capturedAt}`);
    }
  }
}

main().catch((err) => {
  console.error("❌ 查询失败:", err.message);
  process.exit(1);
});
