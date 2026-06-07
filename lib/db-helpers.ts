// 数据库辅助函数 — 统一 sql.js 初始化和路径解析

let _SQL: any = null;
let _wasmPath: string | null = null;

async function getSqlJs() {
  if (_SQL) return _SQL;
  const initSqlJs = (await import("sql.js")).default;

  // 尝试找到 WASM 文件
  if (!_wasmPath) {
    const fs = await import("fs");
    const path = await import("path");
    const candidates = [
      path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
      path.join(process.cwd(), "..", "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) { _wasmPath = c; break; }
    }
  }

  _SQL = _wasmPath
    ? await initSqlJs({ locateFile: () => _wasmPath! })
    : await initSqlJs();
  return _SQL;
}

export async function openDatabase(): Promise<{ db: any; close: () => void }> {
  const SQL = await getSqlJs();
  const fs = await import("fs");
  const path = await import("path");

  const dbPath = path.join(process.cwd(), "db", "style_samples.db");
  if (!fs.existsSync(dbPath)) {
    throw new Error(`数据库文件未找到: ${dbPath}`);
  }

  const buf = fs.readFileSync(dbPath);
  const db = new SQL.Database(buf);
  return { db, close: () => db.close() };
}
