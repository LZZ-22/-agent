// Agent 上下文组装器 — 将用户问题、风格规范、数据库信息组装为 Agent 可消费的上下文

import type { StyleProfile } from "./types";
import { detectIntent } from "./agent-intent";
import type { AgentIntentResult } from "./agent-intent";
import type { DataQueryResult } from "./data-access";

export interface AgentContext {
  userMessage: string;
  styleProfile: StyleProfile | null;
  intent: AgentIntentResult;
  dbSchemaDescription: string;
  queryResults: DataQueryResult | null;
  queryStats: DataQueryResult | null;
  historySummary?: string;
}

export function buildAgentContext(params: {
  userMessage: string;
  styleProfile?: StyleProfile | null;
  dbSchemaDescription: string;
  queryResults?: DataQueryResult | null;
  queryStats?: DataQueryResult | null;
  historySummary?: string;
}): AgentContext {
  return {
    userMessage: params.userMessage,
    styleProfile: params.styleProfile || null,
    intent: detectIntent(params.userMessage),
    dbSchemaDescription: params.dbSchemaDescription,
    queryResults: params.queryResults || null,
    queryStats: params.queryStats || null,
    historySummary: params.historySummary,
  };
}

// 格式化上下文为 prompt 可用的文本
export function formatContextForPrompt(ctx: AgentContext): string {
  const parts: string[] = [];

  // 数据库 Schema
  if (ctx.dbSchemaDescription) {
    parts.push(ctx.dbSchemaDescription);
  }

  // 意图分析
  parts.push(`\n## 用户意图分析\n- 意图类型: ${ctx.intent.intent}`);
  parts.push(`- 需要数据库: ${ctx.intent.needsDatabase ? "是" : "否"}`);
  parts.push(`- 置信度: ${Math.round(ctx.intent.confidence * 100)}%`);
  parts.push(`- 判断依据: ${ctx.intent.rationale}`);

  // 查询结果
  if (ctx.queryResults && ctx.queryResults.ok && ctx.queryResults.rowCount > 0) {
    parts.push(`\n## 数据库查询结果 (${ctx.queryResults.rowCount} 条)`);
    parts.push(`搜索: "${ctx.queryResults.queryDescription}"`);
    parts.push(`\n\`\`\`json`);
    parts.push(JSON.stringify(ctx.queryResults.rows.slice(0, 10), null, 2));
    if (ctx.queryResults.rows.length > 10) {
      parts.push(`... (还有 ${ctx.queryResults.rows.length - 10} 条未显示)`);
    }
    parts.push(`\`\`\``);
  } else if (ctx.queryResults && ctx.queryResults.ok && ctx.queryResults.rowCount === 0) {
    parts.push(`\n## 数据库查询结果\n未找到匹配记录。搜索词: "${ctx.queryResults.queryDescription}"`);
  }

  // 分类统计
  if (ctx.queryStats && ctx.queryStats.ok && ctx.queryStats.rowCount > 0) {
    parts.push(`\n## 数据库分类统计\n| 分类 | 数量 | 总字符数 |`);
    parts.push(`|------|------|----------|`);
    for (const row of ctx.queryStats.rows) {
      parts.push(`| ${row.category} | ${row.count} | ${row.total_chars || 0} |`);
    }
  }

  // 历史摘要
  if (ctx.historySummary) {
    parts.push(`\n## 对话历史摘要\n${ctx.historySummary}`);
  }

  return parts.join("\n");
}
