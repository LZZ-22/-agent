"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProfile, saveComparison } from "@/lib/store";
import type { StyleProfile } from "@/lib/types";
import { GitCompare, Loader2, ThumbsUp, Star } from "lucide-react";

const RATING_DIMS = [
  { key: "styleConsistency", label: "风格一致性" },
  { key: "clarity", label: "清晰度" },
  { key: "naturalness", label: "自然度" },
  { key: "usefulness", label: "有用性" },
  { key: "warmth", label: "温度感" },
] as const;

export default function ComparePage() {
  const [question, setQuestion] = useState("");
  const [normal, setNormal] = useState("");
  const [styled, setStyled] = useState("");
  const [loading, setLoading] = useState(false);
  const [preference, setPreference] = useState<"normal" | "styled" | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [saved, setSaved] = useState(false);

  const handleCompare = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setNormal("");
    setStyled("");
    setPreference(null);
    setRatings({});
    setFeedback("");
    setSaved(false);

    const profile = getProfile();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: question.trim() }],
          mode: "both",
        }),
      });
      const data = await res.json();
      setNormal(data.normal || "生成失败");
      setStyled(data.styled || "生成失败");
    } catch (err: any) {
      setNormal(`错误: ${err.message}`);
      setStyled(`错误: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    saveComparison({
      question: question.trim(),
      normalAnswer: normal,
      styledAnswer: styled,
      preference,
      ratings: Object.keys(ratings).length === 5 ? (ratings as any) : null,
      feedback,
    });
    setSaved(true);
  };

  return (
    <div className="page-enter max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">对比模式</h1>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-8">
        输入同一个问题，对比普通回答（A）和风格化回答（B）的差异
      </p>

      {/* Input */}
      <div className="flex gap-3 mb-8">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="输入一个问题..."
          rows={3}
          className="flex-1"
        />
        <Button onClick={handleCompare} disabled={loading || !question.trim()} className="flex-shrink-0 self-end">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitCompare className="h-4 w-4" />}
          {loading ? "生成中..." : "对比"}
        </Button>
      </div>

      {/* Results */}
      {(normal || styled) && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className={preference === "normal" ? "ring-2 ring-[var(--color-primary)]" : ""}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">A · 普通回答</CardTitle>
              <Badge variant="outline">无风格注入</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{normal}</div>
              {normal && (
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setPreference("normal")}>
                  <ThumbsUp className="h-3 w-3" /> 偏好 A
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className={preference === "styled" ? "ring-2 ring-[var(--color-primary)]" : ""}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">B · 风格化回答</CardTitle>
              <Badge>风格注入</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{styled}</div>
              {styled && (
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setPreference("styled")}>
                  <ThumbsUp className="h-3 w-3" /> 偏好 B
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rating for B */}
      {styled && preference && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">为风格化回答评分（B）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RATING_DIMS.map((dim) => (
                <div key={dim.key} className="flex items-center gap-4">
                  <span className="text-sm w-24">{dim.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRatings({ ...ratings, [dim.key]: n })}
                        className={`p-1 rounded cursor-pointer transition-colors ${
                          ratings[dim.key] >= n ? "text-[var(--color-warning)]" : "text-[var(--color-border)]"
                        }`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-1">文字反馈</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="你觉得风格化回答怎么样？有什么改进建议？"
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} disabled={saved}>
                {saved ? "已保存" : "保存评分"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
