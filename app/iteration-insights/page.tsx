"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getEvalRecords } from "@/lib/evaluation-storage";
import { analyzeHistory } from "@/lib/iteration-insights";
import type { IterationInsights } from "@/lib/iteration-insights";
import { TrendingUp, AlertTriangle, Lightbulb, BarChart3 } from "lucide-react";

export default function IterationInsightsPage() {
  const [insights, setInsights] = useState<IterationInsights | null>(null);
  const [loaded, setLoaded] = useState(false);

  const loadInsights = () => {
    const records = getEvalRecords();
    setInsights(analyzeHistory(records));
    setLoaded(true);
  };

  if (!loaded) {
    loadInsights();
  }

  return (
    <div className="page-enter max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">迭代洞察</h1>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-8">从评估历史中自动发现模式和优化方向</p>

      {!insights || insights.totalRecords === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm font-medium mb-1">暂无评估数据</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">去评估页完成一些评估后，这里会自动生成洞察。</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader><CardTitle className="text-base">概览</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{insights.totalRecords}</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">评估总数</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{insights.averageTotalScore}</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">平均总分</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{insights.patterns.length}</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">发现模式</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dimension Rankings */}
          <Card>
            <CardHeader className="flex-row items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <CardTitle className="text-base">维度排名（从弱到强）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {insights.dimensionStats.map((d) => (
                  <div key={d.dimension} className="flex items-center gap-3 text-sm">
                    <span className="w-28 text-[var(--color-muted-foreground)]">{d.label}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${d.avgScore >= 7 ? "bg-green-500" : d.avgScore >= 5 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${(d.avgScore / 10) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs w-8 text-right">{d.avgScore}</span>
                    <span className="text-[10px] text-[var(--color-muted-foreground)] w-16 text-right">{d.recordCount}次</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Patterns */}
          {insights.patterns.length > 0 && (
            <Card>
              <CardHeader className="flex-row items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-base">发现的问题模式</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.patterns.map((p, i) => (
                    <div key={i} className={`p-3 rounded border ${p.severity === "high" ? "border-red-200 bg-red-50" : p.severity === "medium" ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={p.severity === "high" ? "destructive" : p.severity === "medium" ? "warning" : "outline"} className="text-[10px]">{p.severity}</Badge>
                        <span className="text-sm font-medium">{p.description}</span>
                      </div>
                      <p className="text-xs text-[var(--color-muted-foreground)]">证据: {p.evidence}</p>
                      <p className="text-xs mt-1">💡 {p.suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Issues */}
          {insights.topIssues.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">高频问题</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {insights.topIssues.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span>{item.issue}</span>
                      <Badge variant="outline" className="text-[10px]">{item.count}次</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card>
            <CardHeader className="flex-row items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base">优化建议</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {insights.recommendedActions.map((a, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-amber-500">{i + 1}.</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
