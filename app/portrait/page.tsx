"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2, User, Brain, Palette, MessageCircle } from "lucide-react";

export default function PortraitPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 收集网站内所有数据
  const collectAllData = () => {
    const data: any = {};
    try { data.profile = JSON.parse(localStorage.getItem("styleagent_profile") || "null"); } catch {}
    try { data.conversations = JSON.parse(localStorage.getItem("styleagent_conv") || "[]"); } catch {}
    try { data.comparisons = JSON.parse(localStorage.getItem("styleagent_compare") || "[]"); } catch {}
    try { data.evaluations = JSON.parse(localStorage.getItem("styleagent_eval") || "[]"); } catch {}
    try { data.evalHistory = JSON.parse(localStorage.getItem("styleagent_eval_history") || "[]"); } catch {}
    try { data.spaceCollection = JSON.parse(localStorage.getItem("styleagent_space_data") || "null"); } catch {}
    try { data.writingHistory = JSON.parse(localStorage.getItem("styleagent_writing_history") || "[]"); } catch {}
    return data;
  };

  const analyzePortrait = async () => {
    setLoading(true);
    const allData = collectAllData();

    // 汇总统计
    const totalConvs = allData.conversations?.length || 0;
    const totalEvals = allData.evaluations?.length || 0;
    const spaceItems = allData.spaceCollection
      ? Object.values(allData.spaceCollection).reduce((s: number, c: any) => s + (c?.items?.length || 0), 0)
      : 0;
    const writingSessions = allData.writingHistory?.length || 0;

    // 从收藏数据中提取偏好
    const collectionTags: string[] = [];
    const collectionCreators: string[] = [];
    if (allData.spaceCollection) {
      Object.values(allData.spaceCollection).forEach((cat: any) => {
        cat?.items?.forEach((item: any) => {
          if (item.tags) collectionTags.push(...item.tags);
          if (item.creator) collectionCreators.push(item.creator);
        });
      });
    }

    // 标签频率
    const tagFreq: Record<string, number> = {};
    collectionTags.forEach((t) => { tagFreq[t] = (tagFreq[t] || 0) + 1; });
    const topTags = Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // 从对话中提取主题
    const convThemes = allData.conversations?.map((c: any) => c.title || c.messages?.[0]?.content?.slice(0, 30)) || [];

    // 从风格规范中提取
    const styleName = allData.profile?.name || "未定义";

    // 分类统计
    const categoryStats: Record<string, number> = {};
    if (allData.spaceCollection) {
      Object.entries(allData.spaceCollection).forEach(([key, cat]: [string, any]) => {
        categoryStats[key] = cat?.items?.length || 0;
      });
    }

    try {
      const res = await fetch("/api/portrait/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          styleName,
          totalConvs,
          writingSessions,
          spaceItems,
          topTags,
          convThemes: convThemes.slice(0, 5),
          categoryStats,
          creatorCount: collectionCreators.length,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      // Fallback: 本地生成画像
      setResult({
        summary: `${styleName} 的风格画像`,
        traits: [
          `收藏了 ${spaceItems} 件作品，涵盖 ${Object.keys(categoryStats).filter(k => categoryStats[k] > 0).length} 个领域`,
          `最关注的标签：${topTags.slice(0, 3).map(t => t[0]).join("、")}`,
          `完成了 ${totalConvs} 次对话和 ${writingSessions} 次写作`,
          `风格定位：${styleName}`,
        ],
        rawData: { topTags, categoryStats, convThemes, styleName },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter min-h-screen max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-canary)]/30" />
          <span className="text-[10px] tracking-[0.3em] text-white/25 uppercase">AI Portrait</span>
        </div>
        <h1 className="font-serif text-3xl italic font-light text-white/80 tracking-wider">画像</h1>
        <p className="mt-4 text-sm text-white/45 font-light max-w-xl leading-relaxed">
          Agent 通过分析你在网站内的所有数据——收藏、对话、写作、评估——生成你的个人画像。
        </p>
      </div>

      {!result && !loading && (
        <button
          onClick={analyzePortrait}
          className="px-8 py-4 bg-[var(--color-canary)] text-black rounded-full font-medium text-sm tracking-wider hover:bg-white transition-colors flex items-center gap-2 mx-auto"
        >
          <Sparkles className="w-4 h-4" /> 生成画像
        </button>
      )}

      {loading && (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-canary)] mx-auto mb-4" />
          <p className="text-sm text-white/45">Agent 正在分析你的数据...</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex-row items-center gap-3">
              <User className="w-5 h-5 text-[var(--color-canary)]" />
              <CardTitle className="text-lg">你的画像</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 leading-relaxed">{result.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center gap-3">
              <Brain className="w-5 h-5 text-[var(--color-canary)]" />
              <CardTitle className="text-lg">特征分析</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(result.traits || []).map((trait: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm text-white/65">
                    <span className="text-[var(--color-canary)] mt-0.5">•</span>
                    <span>{trait}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {result.rawData?.topTags?.length > 0 && (
            <Card>
              <CardHeader className="flex-row items-center gap-3">
                <Palette className="w-5 h-5 text-[var(--color-canary)]" />
                <CardTitle className="text-lg">兴趣标签</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.rawData.topTags.map(([tag, count]: [string, number]) => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/55">
                      {tag} <span className="text-white/25 ml-1">{count}</span>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {result.rawData?.categoryStats && (
            <Card>
              <CardHeader className="flex-row items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[var(--color-canary)]" />
                <CardTitle className="text-lg">收藏分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(result.rawData.categoryStats).map(([key, count]: [string, any]) => (
                    <div key={key} className="flex items-center gap-3 text-sm">
                      <span className="w-20 text-white/45">{key === "film" ? "电影" : key === "music" ? "音乐" : key === "architecture" ? "建筑" : key === "literature" ? "文学" : key === "philosophy" ? "哲学" : key}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full">
                        <div className="h-2 bg-[var(--color-canary)]/40 rounded-full" style={{ width: `${Math.min((count / 5) * 100, 100)}%` }} />
                      </div>
                      <span className="w-8 text-right text-white/35 font-mono text-xs">{count}</span>
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
