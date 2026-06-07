"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AGENT_STRATEGIES } from "@/lib/experiment-strategies";
import { saveExperimentRecord, getExperimentRecords, type ExperimentRecord } from "@/lib/evaluation-storage";
import { Loader2, FlaskConical, ChevronDown, ChevronUp, History } from "lucide-react";

export default function ExperimentsPage() {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string[]>(["db_augmented_with_style", "db_augmented_with_style_and_guardrails"]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExperimentRecord | null>(null);
  const [expandedAnswer, setExpandedAnswer] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ExperimentRecord[]>([]);

  const toggleStrategy = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const runExperiment = async () => {
    if (!input.trim() || selected.length === 0) return;
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/experiments/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputMessage: input.trim(), strategyIds: selected }),
      });
      const data = await res.json();
      setResult(data);
      saveExperimentRecord(data);
    } catch (err: any) {
      alert("实验运行失败: " + err.message);
    } finally { setRunning(false); }
  };

  const loadHistory = () => {
    setHistory(getExperimentRecords());
    setShowHistory(!showHistory);
  };

  return (
    <div className="page-enter max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">实验对比</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">同一问题，多策略并行运行 + 自动评估 + 横向对比</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadHistory}>
          <History className="h-4 w-4" /> {showHistory ? "隐藏历史" : "历史记录"}
        </Button>
      </div>

      {/* Input */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">测试问题</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="输入一个测试问题，例如：数据库里有哪些类型的语言样本？" rows={3} />
          <div>
            <p className="text-xs text-[var(--color-muted-foreground)] mb-2">选择要对比的策略：</p>
            <div className="flex flex-wrap gap-2">
              {AGENT_STRATEGIES.map((s) => (
                <button key={s.id} onClick={() => toggleStrategy(s.id)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors cursor-pointer ${selected.includes(s.id) ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]" : "border-[var(--color-border)]"}`}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={runExperiment} disabled={running || !input.trim() || selected.length === 0} className="w-full">
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlaskConical className="h-4 w-4" />}
            {running ? "实验中..." : `运行实验 (${selected.length} 个策略)`}
          </Button>
        </CardContent>
      </Card>

      {/* Results Table */}
      {result && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">实验结果</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xs text-[var(--color-muted-foreground)] mb-3">问题: {result.inputMessage}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-3">策略</th>
                    <th className="text-center py-2 px-2">总分</th>
                    <th className="text-center py-2 px-2">准确性</th>
                    <th className="text-center py-2 px-2">DB依据</th>
                    <th className="text-center py-2 px-2">风格</th>
                    <th className="text-center py-2 px-2">有用性</th>
                    <th className="text-left py-2 pl-3">回答</th>
                  </tr>
                </thead>
                <tbody>
                  {result.variants.map((v) => {
                    const dims: any = v.dimensionScores || {};
                    const getScore = (key: string) => {
                      if (Array.isArray(dims)) return dims.find((d: any) => d.dimensionId === key)?.score || "-";
                      return dims[key]?.score || "-";
                    };
                    return (
                      <tr key={v.strategyId} className="border-b hover:bg-[var(--color-muted)]/50">
                        <td className="py-2 pr-3 font-medium">{v.strategyName}</td>
                        <td className="text-center py-2"><Badge variant={v.totalScore >= 4 ? "success" : "warning"}>{v.totalScore}</Badge></td>
                        <td className="text-center py-2">{typeof getScore("style_consistency") === "number" ? getScore("style_consistency") : "-"}</td>
                        <td className="text-center py-2">-</td>
                        <td className="text-center py-2">-</td>
                        <td className="text-center py-2">-</td>
                        <td className="py-2 pl-3">
                          <button onClick={() => setExpandedAnswer(expandedAnswer === v.strategyId ? null : v.strategyId)}
                            className="text-xs text-[var(--color-primary)] hover:underline cursor-pointer flex items-center gap-1">
                            {expandedAnswer === v.strategyId ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            查看回答
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {expandedAnswer && (
              <div className="mt-4 p-4 bg-[var(--color-muted)] rounded-[var(--radius-md)]">
                <p className="text-xs font-medium mb-1">
                  {result.variants.find((v) => v.strategyId === expandedAnswer)?.strategyName}
                </p>
                <p className="text-xs whitespace-pre-wrap">{result.variants.find((v) => v.strategyId === expandedAnswer)?.answer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* History */}
      {showHistory && (
        <Card>
          <CardHeader><CardTitle className="text-base">历史实验 ({history.length})</CardTitle></CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-xs text-[var(--color-muted-foreground)]">暂无历史实验</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 10).map((h) => (
                  <div key={h.id} className="p-3 bg-[var(--color-muted)] rounded text-xs">
                    <p className="font-medium">{h.inputMessage.slice(0, 80)}</p>
                    <p className="text-[var(--color-muted-foreground)] mt-1">
                      {h.variants.length} 个策略 · {new Date(h.createdAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
