// 从 SQLite 数据库加载场景补丁
// 如果数据库不可用（如浏览器环境），回退到 lib/scene-patches.ts 的硬编码版本数

import type { ScenePatch } from "./types";
import { GENERAL_CHAT_PATCH, MENTAL_SUPPORT_PATCH, FUN_ZONE_PATCH } from "./scene-patches";

// 硬编码回退映射
const FALLBACK_MAP: Record<string, ScenePatch> = {
  general_chat: GENERAL_CHAT_PATCH as unknown as ScenePatch,
  mental_support: MENTAL_SUPPORT_PATCH as unknown as ScenePatch,
  fun_zone: FUN_ZONE_PATCH as unknown as ScenePatch,
};

// 补丁缓存（内存中）
let patchCache: Record<string, ScenePatch> | null = null;

// 服务端：从数据库加载全部补丁
export async function loadPatchesFromDB(): Promise<Record<string, ScenePatch>> {
  if (patchCache) return patchCache;

  try {
    // 动态导入 sql.js（仅服务端可用）
    const initSqlJs = (await import("sql.js")).default;
    const fs = await import("fs");
    const path = await import("path");

    const dbPath = path.join(process.cwd(), "db", "style_samples.db");
    if (!fs.existsSync(dbPath)) {
      console.warn("[scene-patches-db] 数据库文件不存在，使用回退补丁");
      return FALLBACK_MAP;
    }

    const SQL = await initSqlJs();
    const buf = fs.readFileSync(dbPath);
    const db = new SQL.Database(buf);

    const cat = db.exec("SELECT id FROM categories WHERE slug = 'scene-patches'");
    if (!cat[0] || cat[0].values.length === 0) {
      db.close();
      console.warn("[scene-patches-db] 场景补丁分类不存在，使用回退补丁");
      return FALLBACK_MAP;
    }

    const catId = cat[0].values[0][0];
    const rows = db.exec(
      "SELECT content FROM samples WHERE category_id = ? ORDER BY id",
      [catId]
    );

    const patches: Record<string, ScenePatch> = { ...FALLBACK_MAP };

    if (rows[0]) {
      for (const row of rows[0].values) {
        try {
          const content = row[0] as string;
          const patch = JSON.parse(content) as ScenePatch;
          patches[patch.scene_id] = patch;
        } catch {
          // 跳过解析失败的记录
        }
      }
    }

    db.close();
    patchCache = patches;
    console.log(`[scene-patches-db] 已加载 ${Object.keys(patches).length} 个场景补丁`);
    return patches;
  } catch (err) {
    console.warn("[scene-patches-db] 数据库加载失败，使用回退补丁:", (err as Error).message);
    return FALLBACK_MAP;
  }
}

// 通用：获取单个补丁（优先数据库，回退到硬编码）
export async function getPatchFromDB(sceneId: string): Promise<ScenePatch | undefined> {
  const patches = await loadPatchesFromDB();
  return patches[sceneId];
}

// 列出所有补丁 ID
export async function listPatchIds(): Promise<string[]> {
  const patches = await loadPatchesFromDB();
  return Object.keys(patches);
}

// 同步版本：仅返回硬编码回退（浏览器端使用）
export function getPatchSync(sceneId: string): ScenePatch | undefined {
  return FALLBACK_MAP[sceneId];
}
