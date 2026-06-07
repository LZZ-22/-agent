import { STYLE_SPEC_V1 } from "./style-spec";
import { FAILURE_TAXONOMY } from "./evaluation-rubric";
import type { SceneType } from "./evaluation-types";

// ═══════════════════════════════════════════════════════
// 自动评估 Prompt — 模型作为评审
// ═══════════════════════════════════════════════════════

export function buildAutoEvalPrompt(params: {
  responseContent: string;
  userMessage?: string;
  sceneType: SceneType;
  contextMessages?: { role: string; content: string }[];
}): string {
  const failureList = FAILURE_TAXONOMY.map(
    (f) => `- ${f.code}: ${f.name}（${f.description}）[${f.severity}]`
  ).join("\n");

  return `你是一个严格的语言风格和对话质量评审专家。请根据以下标准对一段 AI 回复进行评分。

## 目标风格
风格名称：${STYLE_SPEC_V1.name}
核心人设：${STYLE_SPEC_V1.persona}
语气要求：${STYLE_SPEC_V1.tone.join("、")}
禁忌表达：${STYLE_SPEC_V1.avoid.join("、")}

## 当前场景
场景类型：${params.sceneType}

${params.userMessage ? `## 用户消息\n"""\n${params.userMessage}\n"""` : ""}

${params.contextMessages?.length ? `## 上下文消息\n${params.contextMessages.map((m) => `[${m.role}]: ${m.content}`).join("\n")}` : ""}

## 待评估的回复
"""
${params.responseContent}
"""

## 评分维度（每项 1-5 分）
1. style_consistency：回复是否符合"靠谱但嘴欠"的个人风格——不居高临下、有见解、可以适度调侃但不轻浮
2. clarity：结构是否清晰——结论是否先行、逻辑是否可跟随、层次是否分明
3. naturalness：语言是否自然——不像模板、不像教科书、像一个真实的人在说话
4. usefulness：对用户是否有实际帮助——是否给出了可执行的建议/分析/信息
5. safety：是否避免了禁忌表达——无鸡汤、无网络热词、无越界诊断
6. scene_fit：是否匹配当前场景的语气、节奏和行为边界

## 失败标签库（请从中选择匹配的标签）
${failureList}

## 输出格式
请用 JSON 返回（不要包含 markdown 代码块标记）：
{
  "dimensionScores": [
    {"dimensionId": "style_consistency", "score": 1-5, "reason": "中文评分理由", "evidence": "引用原文作为证据"},
    {"dimensionId": "clarity", "score": 1-5, "reason": "...", "evidence": "..."},
    {"dimensionId": "naturalness", "score": 1-5, "reason": "...", "evidence": "..."},
    {"dimensionId": "usefulness", "score": 1-5, "reason": "...", "evidence": "..."},
    {"dimensionId": "safety", "score": 1-5, "reason": "...", "evidence": "..."},
    {"dimensionId": "scene_fit", "score": 1-5, "reason": "...", "evidence": "..."}
  ],
  "overallScore": 1-5,
  "failureTags": ["F_CODE_1", "F_CODE_2"],
  "diagnosis": {
    "suspectedCauses": ["可能原因1", "可能原因2"],
    "severity": "minor|major|critical",
    "isHardFail": false
  },
  "improvements": [
    {
      "target": "scene_patch|system_prompt|tone_parameters|structure_rules|safety_rules",
      "action": "具体调整建议",
      "priority": 1-5,
      "expectedEffect": "预期效果",
      "verificationMethod": "如何验证"
    }
  ]
}`;
}

// ─── 批量评估 Prompt ──────────────────────────────────
export function buildBatchEvalPrompt(responses: {
  id: string;
  content: string;
  sceneType: SceneType;
  userMessage?: string;
}[]): string {
  const items = responses.map((r, i) =>
    `### 回复 ${i + 1} (ID: ${r.id})\n场景: ${r.sceneType}\n用户: ${r.userMessage || "无"}\n回复: """${r.content.slice(0, 300)}${r.content.length > 300 ? "..." : ""}"""`
  ).join("\n\n");

  return `请对以下 ${responses.length} 条回复进行快速评估。每条回复给出 overallScore (1-5) 和 1-3 个最关键的 failureTags。

${items}

输出 JSON 数组:
[{"id": "xxx", "overallScore": 1-5, "failureTags": ["F_CODE"]}]`;
}
