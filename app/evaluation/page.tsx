"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getConversations } from "@/lib/store";
import { saveEvalRecord, getEvalRecords, type EvalRecord } from "@/lib/evaluation-storage";
import type { Conversation } from "@/lib/types";
import { Loader2, Sparkles, ChevronDown, AlertTriangle, CheckCircle, Info, History, Save } from "lucide-react";

const SCENES = [
  { value: "general_chat", label: "通用对话" },
  { value: "mental_support", label: "心理支持" },
  { value: "fun_zone", label: "娱乐分区" },
  { value: "advice_mode", label: "建议型" },
  { value: "comfort_mode", label: "安慰型" },
  { value: "analysis_mode", label: "分析型" },
];

const DIM_LABELS: Record<string, string> = {
  style_consistency: "风格一致性",
  clarity: "清晰度",
  naturalness: "自然度",
  usefulness: "有用性",
  safety: "安全边界",
  scene_fit: "场景适配",
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  major: "bg-orange-100 text-orange-700 border-orange-200",
  minor: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cosmetic: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function EvaluationPage() {
  const [mode, setMode] = useState<"from_conv" | "manual">("manual");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [sceneType, setSceneType] = useState("general_chat");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<EvalRecord[]>([]);

  useEffect(() => { setConversations(getConversations()); }, []);

  const conv = conversations.find((c) => c.id === selectedConv);

  const saveToHistory = () => {
    if (!result || !answerText) return;
    saveEvalRecord({
      id: "eval_" + Date.now().toString(36),
      inputMessage: userMessage || "(手动输入)",
      agentAnswer: answerText,
      totalScore: result.overallScore || 0,
      dimensionScores: (result.dimensionScores || []).reduce((acc: any, d: any) => {
        acc[d.dimensionId] = { score: d.score, reason: d.reason || "" };
        return acc;
      }, {}),
      keyIssues: result.failureTags || [],
      summary: result.diagnosis?.suspectedCauses?.join("; ") || "",
      improvementSuggestions: (result.improvements || []).map((i: any) => i.action),
      usedDatabase: false,
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadHistory = () => {
    setHistory(getEvalRecords());
    setShowHistory(!showHistory);
  };

  const handleEvaluate = async () => {
    if (!answerText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/evaluation/auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseContent: answerText,
          userMessage: userMessage || undefined,
          sceneType,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      alert("评估失败: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">自动评估</h1>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-8">
        6 维评分 + 失败标签诊断 + 改进建议
      </p>

      {/* Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">输入待评估内容</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode tabs */}
          <div className="flex gap-2">
            {(["manual", "from_conv"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                  mode === m ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]" : "border-[var(--color-border)]"
                }`}
              >
                {m === "manual" ? "手动输入" : "从对话选择"}
              </button>
            ))}
          </div>

          {mode === "from_conv" && (
            <div className="relative">
              <select
                value={selectedConv}
                onChange={(e) => {
                  setSelectedConv(e.target.value);
                  setAnswerText("");
                }}
                className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm bg-[var(--color-surface)] appearance-none cursor-pointer"
              >
                <option value="">选择一条对话...</option>
                {conversations.map((c) => (
                  <option key={c.id} value={c.id}>{c.title} ({new Date(c.createdAt).toLocaleDateString("zh-CN")})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-[var(--color-muted-foreground)] pointer-events-none" />
              {conv && (
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {conv.messages.filter((m) => m.role === "assistant").map((m, i) => (
                    <div key={i} onClick={() => setAnswerText(m.content)}
                      className={`p-3 rounded-[var(--radius-md)] border cursor-pointer text-sm ${
                        answerText === m.content ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5" : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                      }`}>
                      <div className="line-clamp-3 whitespace-pre-wrap">{m.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--color-muted-foreground)] mb-1 block">场景类型</label>
              <select value={sceneType} onChange={(e) => setSceneType(e.target.value)}
                className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm bg-[var(--color-surface)] cursor-pointer">
                {SCENES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--color-muted-foreground)] mb-1 block">用户原始消息（可选）</label>
              <input value={userMessage} onChange={(e) => setUserMessage(e.target.value)}
                placeholder="用户问了什么..."
                className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm bg-[var(--color-surface)]" />
            </div>
          </div>

          <Textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)}
            placeholder="粘贴或选择 AI 回复内容..." rows={4} />

          <div className="flex gap-2">
            <Button onClick={handleEvaluate} disabled={loading || !answerText.trim()} className="flex-1">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "评估中..." : "开始评估"}
            </Button>
            {result && (
              <Button variant="outline" onClick={saveToHistory} disabled={saved}>
                <Save className="h-4 w-4" /> {saved ? "已保存" : "保存记录"}
              </Button>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-[var(--color-muted-foreground)]">评估结果会自动分析模式</span>
            <button onClick={loadHistory} className="text-[10px] text-[var(--color-primary)] hover:underline cursor-pointer flex items-center gap-1">
              <History className="h-3 w-3" /> {showHistory ? "隐藏历史" : `历史记录 (${getEvalRecords().length})`}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      {showHistory && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">评估历史 ({history.length})</CardTitle></CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-xs text-[var(--color-muted-foreground)]">暂无记录</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.slice(0, 20).map((r) => (
                  <div key={r.id} className="p-2 bg-[var(--color-muted)] rounded text-xs flex justify-between">
                    <span className="truncate flex-1">{r.inputMessage.slice(0, 50)}</span>
                    <Badge variant={r.totalScore >= 4 ? "success" : "warning"} className="ml-2 text-[10px]">{r.totalScore}</Badge>
                    <span className="ml-2 text-[var(--color-muted-foreground)]">{new Date(r.createdAt).toLocaleDateString("zh-CN")}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Overall */}
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">评估结果</CardTitle>
              <Badge variant={result.overallScore >= 4 ? "success" : result.overallScore >= 3 ? "warning" : "destructive"}>
                总分: {result.overallScore}/5
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {(result.dimensionScores || []).map((d: any) => (
                  <div key={d.dimensionId} className="text-center p-3 bg-[var(--color-muted)] rounded-[var(--radius-md)]">
                    <div className="text-2xl font-bold">{d.score}</div>
                    <div className="text-[10px] text-[var(--color-muted-foreground)]">{DIM_LABELS[d.dimensionId] || d.dimensionId}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dimension details */}
          <Card>
            <CardHeader><CardTitle className="text-base">维度详情</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(result.dimensionScores || []).map((d: any) => (
                <div key={d.dimensionId} className="flex items-start gap-3 p-3 bg-[var(--color-muted)] rounded-[var(--radius-md)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {d.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{DIM_LABELS[d.dimensionId] || d.dimensionId}</div>
                    <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{d.reason}</div>
                    {d.evidence && d.evidence !== "..." && (
                      <div className="text-[10px] text-[var(--color-muted-foreground)] mt-1 italic">证据: "{d.evidence}"</div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Failure tags */}
          {result.failureTags?.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader className="flex-row items-center gap-2 pb-3">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <CardTitle className="text-base">失败标签</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.failureTags.map((tag: string) => (
                    <Badge key={tag} variant="warning" className="text-[10px] font-mono">{tag}</Badge>
                  ))}
                </div>
                {result.diagnosis && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--color-muted-foreground)]">严重级别:</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${SEVERITY_COLORS[result.diagnosis.severity] || ""}`}>
                        {result.diagnosis.severity}
                      </span>
                      {result.diagnosis.isHardFail && (
                        <Badge variant="destructive" className="text-[10px]">硬失败</Badge>
                      )}
                    </div>
                    {result.diagnosis.suspectedCauses?.length > 0 && (
                      <div>
                        <span className="text-xs text-[var(--color-muted-foreground)]">可能原因:</span>
                        <ul className="mt-1 space-y-1">
                          {result.diagnosis.suspectedCauses.map((c: string, i: number) => (
                            <li key={i} className="text-xs text-[var(--color-muted-foreground)] flex gap-1">
                              <span className="text-orange-400">•</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Improvements */}
          {result.improvements?.length > 0 && (
            <Card className="border-green-200">
              <CardHeader className="flex-row items-center gap-2 pb-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <CardTitle className="text-base">改进建议</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.improvements.map((imp: any, i: number) => (
                    <div key={i} className="p-3 bg-green-50 rounded-[var(--radius-md)] text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] font-mono">{imp.target}</Badge>
                        <span className="text-[10px] text-[var(--color-muted-foreground)]">优先级 {imp.priority}/5</span>
                      </div>
                      <p className="text-sm">{imp.action}</p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-[var(--color-muted-foreground)]">
                        <Info className="h-3 w-3" />
                        <span>验证: {imp.verificationMethod}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
