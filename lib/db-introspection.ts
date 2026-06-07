// 数据库内省层 — 自动识别项目数据库结构，为 Agent 提供 schema 描述

import { openDatabase } from "./db-helpers";
import type { DatabaseIntrospection, TableInfo, FieldInfo } from "./types";

export async function introspectDatabase(): Promise<DatabaseIntrospection> {
  try {
    const { db, close } = await openDatabase();

    const tableRows = db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_%' ORDER BY name"
    );

    const tables: TableInfo[] = [];

    if (tableRows[0]) {
      for (const [tableName] of tableRows[0].values) {
        const name = tableName as string;
        const cols = db.exec(`PRAGMA table_info("${name}")`);
        const fields: FieldInfo[] = [];
        if (cols[0]) {
          for (const col of cols[0].values) {
            fields.push({
              name: col[1] as string,
              type: col[2] as string,
              nullable: col[3] === 0 ? false : true,
              primaryKey: col[5] === 1,
            });
          }
        }
        const countResult = db.exec(`SELECT COUNT(*) FROM "${name}"`);
        const rowCount = (countResult[0]?.values[0]?.[0] as number) || 0;
        tables.push({ name, fields, rowCount });
      }
    }

    let categorySummary = "";
    try {
      const cats = db.exec("SELECT name, slug, description FROM categories ORDER BY id");
      if (cats[0]) {
        categorySummary = cats[0].values.map((r: unknown[]) => `- ${r[0]} (${r[1]}): ${r[2]}`).join("\n");
      }
    } catch {}

    close();

    return {
      provider: "sqlite",
      summary: `StyleAgent SQLite 数据库，包含 ${tables.length} 个表，${tables.reduce((s, t) => s + t.rowCount, 0)} 条记录。`,
      tables,
      categorySummary,
    };
  } catch (err) {
    return {
      provider: "sqlite",
      summary: `数据库读取失败: ${(err as Error).message}`,
      tables: [],
    };
  }
}

export function formatIntrospectionForAgent(intro: DatabaseIntrospection): string {
  if (intro.tables.length === 0) return `## 数据库状态\n${intro.summary}`;

  let text = `## 数据库 Schema (${intro.provider})\n${intro.summary}\n`;
  for (const table of intro.tables) {
    text += `\n### 表: ${table.name} (${table.rowCount} 行)\n| 字段 | 类型 | 可空 | 主键 |\n|------|------|------|------|\n`;
    for (const f of table.fields) {
      text += `| ${f.name} | ${f.type} | ${f.nullable ? "是" : "否"} | ${f.primaryKey ? "是" : "否"} |\n`;
    }
  }
  if (intro.categorySummary) text += `\n### 数据分类\n${intro.categorySummary}\n`;
  return text;
}
