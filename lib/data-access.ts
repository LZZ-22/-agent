// 统一数据访问层 — 为 Agent 提供安全的数据库查询接口

import { openDatabase } from "./db-helpers";

export interface DataQueryResult {
  ok: boolean;
  summary: string;
  rows: Record<string, unknown>[];
  rowCount: number;
  queryDescription: string;
}

// 服务端：全文搜索
export async function searchProjectData(query: string): Promise<DataQueryResult> {
  try {
    const { db, close } = await openDatabase();
    const safe = query.replace(/'/g, "''");
    const likePattern = `%${safe}%`;

    const result = db.exec(
      `SELECT s.id, c.name AS category, s.tags, SUBSTR(s.content, 1, 300) AS preview, s.char_count, s.captured_at
       FROM samples s JOIN categories c ON s.category_id = c.id
       WHERE s.content LIKE '${likePattern}' OR s.tags LIKE '${likePattern}' OR s.source LIKE '${likePattern}'
       ORDER BY s.id DESC LIMIT 20`
    );

    close();

    if (!result[0] || result[0].values.length === 0) {
      return { ok: true, summary: `未找到与"${query}"相关的记录`, rows: [], rowCount: 0, queryDescription: query };
    }

    const cols = result[0].columns;
    const rows = result[0].values.map((vals: unknown[]) => {
      const obj: Record<string, unknown> = {};
      cols.forEach((col: string, i: number) => { obj[col] = vals[i]; });
      return obj;
    });

    return { ok: true, summary: `找到 ${rows.length} 条与"${query}"相关的记录`, rows, rowCount: rows.length, queryDescription: query };
  } catch (err) {
    return { ok: false, summary: `查询失败: ${(err as Error).message}`, rows: [], rowCount: 0, queryDescription: query };
  }
}

// 获取最近记录
export async function getRecentRecords(limit = 5): Promise<DataQueryResult> {
  try {
    const { db, close } = await openDatabase();
    const result = db.exec(
      `SELECT s.id, c.name AS category, s.tags, SUBSTR(s.content, 1, 200) AS preview, s.char_count, s.captured_at
       FROM samples s JOIN categories c ON s.category_id = c.id
       ORDER BY s.id DESC LIMIT ${limit}`
    );
    close();

    if (!result[0]) return { ok: true, summary: "无记录", rows: [], rowCount: 0, queryDescription: "recent" };

    const cols = result[0].columns;
    const rows = result[0].values.map((vals: unknown[]) => {
      const obj: Record<string, unknown> = {};
      cols.forEach((col: string, i: number) => { obj[col] = vals[i]; });
      return obj;
    });
    return { ok: true, summary: `最近 ${rows.length} 条记录`, rows, rowCount: rows.length, queryDescription: "recent" };
  } catch (err) {
    return { ok: false, summary: `查询失败: ${(err as Error).message}`, rows: [], rowCount: 0, queryDescription: "recent" };
  }
}

// 按分类获取统计
export async function getCategoryStats(): Promise<DataQueryResult> {
  try {
    const { db, close } = await openDatabase();
    const result = db.exec(
      "SELECT c.name AS category, c.slug, COUNT(s.id) AS count, COALESCE(SUM(s.char_count),0) AS total_chars FROM categories c LEFT JOIN samples s ON s.category_id=c.id GROUP BY c.id ORDER BY c.id"
    );
    close();

    if (!result[0]) return { ok: true, summary: "无统计信息", rows: [], rowCount: 0, queryDescription: "stats" };

    const cols = result[0].columns;
    const rows = result[0].values.map((vals: unknown[]) => {
      const obj: Record<string, unknown> = {};
      cols.forEach((col: string, i: number) => { obj[col] = vals[i]; });
      return obj;
    });
    return { ok: true, summary: `数据库包含 ${rows.length} 个分类`, rows, rowCount: rows.length, queryDescription: "stats" };
  } catch (err) {
    return { ok: false, summary: `查询失败: ${(err as Error).message}`, rows: [], rowCount: 0, queryDescription: "stats" };
  }
}
