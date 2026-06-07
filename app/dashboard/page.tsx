"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getStats, exportAllData, getComparisons } from "@/lib/store";
import type { DashboardStats } from "@/lib/types";
import { MessageCircle, Star, BarChart3, ThumbsUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<{ name: string; score: number }[]>([]);

  useEffect(() => {
    setStats(getStats());

    // Build chart data from comparisons
    const comparisons = getComparisons();
    const data = comparisons
      .filter((c) => c.ratings)
      .slice(0, 10)
      .reverse()
      .map((c) => ({
        name: new Date(c.createdAt).toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
        score: c.ratings
          ? Math.round(
              ((c.ratings.styleConsistency +
                c.ratings.clarity +
                c.ratings.naturalness +
                c.ratings.usefulness +
                c.ratings.warmth) /
                25) *
                100
            )
          : 0,
      }));
    setChartData(data);
  }, []);

  const handleExport = () => {
    const blob = new Blob([exportAllData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "styleagent-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!stats) {
    return <div className="p-12"><div className="skeleton h-96 w-full max-w-3xl mx-auto" /></div>;
  }

  const statCards = [
    { label: "总对话数", value: stats.totalConversations, icon: MessageCircle },
    { label: "总评分数", value: stats.totalEvaluations, icon: Star },
    { label: "风格偏好率", value: stats.styledPreferenceRate + "%", icon: ThumbsUp },
    { label: "平均风格一致性", value: stats.avgStyleConsistency + "/5", icon: BarChart3 },
  ];

  return (
    <div className="page-enter max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">数据面板</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            风格 Agent 的运行数据和用户反馈统计
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4" /> 导出 JSON
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
                <s.icon className="h-4 w-4" />
                <span className="text-xs">{s.label}</span>
              </div>
              <CardTitle className="text-2xl">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Detailed averages */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">评分维度平均分</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: "风格一致性", value: stats.avgStyleConsistency },
              { label: "清晰度", value: stats.avgClarity },
              { label: "自然度", value: stats.avgNaturalness },
              { label: "有用性", value: stats.avgUsefulness },
            ].map((dim) => (
              <div key={dim.label} className="flex items-center gap-4">
                <span className="text-sm w-24">{dim.label}</span>
                <div className="flex-1 h-2 bg-[var(--color-muted)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                    style={{ width: `${(dim.value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-mono w-10 text-right">{dim.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">最近回答风格评分趋势</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-[var(--color-muted-foreground)] text-center py-8">
              暂无评分数据。去对比模式中为回答打分吧。
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">最近反馈</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentFeedback.length > 0 ? (
            <div className="space-y-2">
              {stats.recentFeedback.map((fb) => (
                <div key={fb.id} className="flex items-center justify-between p-3 bg-[var(--color-muted)] rounded-[var(--radius-md)] text-sm">
                  <span className="truncate flex-1">{fb.question}</span>
                  <span className="ml-4 text-[var(--color-muted-foreground)] text-xs">
                    {fb.preference === "styled" ? "偏好风格化" : fb.preference === "normal" ? "偏好普通" : "未标注"}
                    {" · "}
                    {new Date(fb.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-muted-foreground)] py-4 text-center">
              暂无反馈数据
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
