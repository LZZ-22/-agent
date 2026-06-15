"use client";

import { useState, useCallback, useEffect } from "react";
import type { Article, WritingMessage, Paragraph } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { ChatZone } from "@/components/writing/chat-zone";
import { ArticleZone } from "@/components/writing/article-zone";
import { History, CheckCircle, RefreshCw, X } from "lucide-react";

const WRITING_KEY = "styleagent_active_writing";
const WRITING_HISTORY_KEY = "styleagent_writing_history";

interface WritingSession { id: string; title: string; messages: WritingMessage[]; article: Article | null; updatedAt: number; }

function loadHistory(): WritingSession[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(WRITING_HISTORY_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveHistory(sessions: WritingSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WRITING_HISTORY_KEY, JSON.stringify(sessions.slice(0, 50)));
}

export default function WritingPage() {
  const [messages, setMessages] = useState<WritingMessage[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [selectedParagraphId, setSelectedParagraphId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => Date.now().toString(36));
  const [history, setHistory] = useState<WritingSession[]>([]);
  const [ended, setEnded] = useState(false);
  const [continuingId, setContinuingId] = useState<string | null>(null);

  // ─── 加载历史 ──────────────────────────────────────────
  useEffect(() => { setHistory(loadHistory()); }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WRITING_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.messages?.length || s.article) {
          setMessages(s.messages || []);
          setArticle(s.article || null);
          setSessionId(s.id || Date.now().toString(36));
          return;
        }
      }
    } catch {}
  }, []);

  // ─── 自动保存 ──────────────────────────────────────────
  useEffect(() => {
    if (ended) return;
    if (messages.length > 0 || article) {
      localStorage.setItem(WRITING_KEY, JSON.stringify({ id: sessionId, messages, article, updatedAt: Date.now() }));
    }
  }, [messages, article, sessionId, ended]);

  // ─── 结束 ──────────────────────────────────────────────
  const handleEnd = () => {
    if (messages.length === 0 && !article) return;
    const h = loadHistory();
    const title = article?.title || messages[0]?.content?.slice(0, 40) || "写作";
    if (continuingId) {
      // 合并到原历史记录
      const idx = h.findIndex((s) => s.id === continuingId);
      if (idx >= 0) {
        h[idx] = { ...h[idx], messages, article, title, updatedAt: Date.now() };
      } else {
        h.unshift({ id: continuingId, title, messages, article, updatedAt: Date.now() });
      }
    } else {
      h.unshift({ id: sessionId, title, messages, article, updatedAt: Date.now() });
    }
    saveHistory(h); setHistory(h);
    setMessages([]); setArticle(null);
    setSessionId(Date.now().toString(36));
    setEnded(true); setContinuingId(null);
    localStorage.removeItem(WRITING_KEY);
  };

  // ─── 删除历史 ──────────────────────────────────────────
  const handleDeleteHistory = (id: string) => {
    const h = loadHistory().filter((s) => s.id !== id);
    saveHistory(h);
    setHistory(h);
  };

  // ─── 继续历史 ──────────────────────────────────────────
  const handleContinue = (s: WritingSession) => {
    setMessages(s.messages);
    setArticle(s.article);
    setSessionId(s.id);
    setContinuingId(s.id);
    setEnded(false);
    localStorage.setItem(WRITING_KEY, JSON.stringify({ id: s.id, messages: s.messages, article: s.article, updatedAt: Date.now() }));
  };

  // 选中段落
  const handleSelectParagraph = useCallback((id: string) => {
    setSelectedParagraphId((prev) => (prev === id ? null : id));
  }, []);

  // 发送消息
  const handleSend = useCallback(
    async (content: string) => {
      const userMsg: WritingMessage = { role: "user", content };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setLoading(true);

      try {
        const res = await fetch("/api/writing/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
            articleState: article
              ? {
                  title: article.title,
                  genre: article.genre,
                  paragraphs: article.paragraphs.map((p) => ({
                    seq: p.seq,
                    content: p.content,
                  })),
                }
              : undefined,
            selectedParagraphId: selectedParagraphId || undefined,
          }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const assistantMsg: WritingMessage = {
          role: "assistant",
          content: data.reply,
          action: data.action,
        };
        setMessages([...newMessages, assistantMsg]);

        // 处理文章更新
        if (data.action === "draft_generated" && data.articlePatch) {
          const artId = "art_" + generateId();
          const paragraphs: Paragraph[] = (data.articlePatch.paragraphs || []).map(
            (p: { seq: number; content: string }) => ({
              id: `p_${artId}_${String(p.seq).padStart(2, "0")}`,
              seq: p.seq,
              content: p.content,
              version: 1,
              history: [],
            })
          );
          setArticle({
            id: artId,
            title: data.articlePatch.title || "未命名",
            genre: data.articlePatch.genre || "文章",
            status: "draft",
            paragraphs,
            conversationId: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          setSelectedParagraphId(null);
        }

        // 处理段落修改
        if (data.action === "paragraph_revised" && data.articlePatch && article) {
          const updatedParagraphs = article.paragraphs.map((p) => {
            const patch = (data.articlePatch?.paragraphs || []).find(
              (pp: { seq: number; content: string }) => pp.seq === p.seq
            );
            if (patch) {
              return {
                ...p,
                content: patch.content,
                version: p.version + 1,
                history: [
                  ...p.history,
                  {
                    version: p.version + 1,
                    content: patch.content,
                    modifiedAt: new Date().toISOString(),
                    instruction: content,
                  },
                ],
              };
            }
            return p;
          });
          setArticle({ ...article, paragraphs: updatedParagraphs, updatedAt: new Date().toISOString() });
          setSelectedParagraphId(null);
        }
      } catch (err: any) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: `出错了: ${err.message}` },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, article, selectedParagraphId]
  );

  // 撤销段落修改
  const handleUndoParagraph = useCallback(
    (paragraphId: string) => {
      if (!article) return;
      const updatedParagraphs = article.paragraphs.map((p) => {
        if (p.id === paragraphId && p.history.length > 0) {
          const prevVersion = p.history[p.history.length - 1];
          return {
            ...p,
            content: prevVersion.content,
            version: p.version + 1,
            history: p.history.slice(0, -1),
          };
        }
        return p;
      });
      setArticle({ ...article, paragraphs: updatedParagraphs, updatedAt: new Date().toISOString() });
      setMessages((prev) => [
        ...prev,
        { role: "system", content: `已撤销段落 ${paragraphId.split("_").pop()} 的修改` },
      ]);
    },
    [article]
  );

  // 导出文章
  const handleExport = useCallback(() => {
    if (!article) return;
    const text = [
      `# ${article.title}`,
      `> ${article.genre} · ${article.paragraphs.length} 段 · ${article.paragraphs.reduce((s, p) => s + p.content.length, 0)} 字`,
      "",
      ...article.paragraphs.map((p) => `${p.content}\n`),
    ].join("\n");

    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.title || "文章"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [article]);

  return (
    <div className="page-enter flex h-[calc(100vh-1px)]">
      {/* ═══ 左侧：历史 ═══ */}
      <div className="hidden lg:flex flex-col w-44 border-r border-white/5 px-3 pt-4 overflow-y-auto shrink-0">
        <div className="flex items-center gap-2 mb-3 text-white/40">
          <History className="w-3.5 h-3.5" />
          <span className="text-[10px] tracking-[0.2em] uppercase">过去写作</span>
        </div>
        {history.length === 0 ? (
          <p className="text-[10px] text-white/20">暂无</p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 20).map((s) => (
              <div key={s.id} className="group relative">
                <button onClick={() => handleContinue(s)}
                  className="w-full text-left p-2 pr-8 rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all">
                  <p className="text-xs text-white/60 truncate group-hover:text-white/80">{s.title || "写作"}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-white/25">{new Date(s.updatedAt).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}</span>
                    <RefreshCw className="w-3 h-3 text-white/20 group-hover:text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteHistory(s.id); }}
                  className="absolute top-1.5 right-1.5 p-1 rounded opacity-0 group-hover:opacity-100 hover:text-red-400 text-white/25 transition-all">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 对话区 */}
      <div className="w-[35%] min-w-[280px] border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col">
        <div className="flex-1 flex flex-col">
          <ChatZone
            messages={messages}
            onSend={handleSend}
            loading={loading}
            selectedParagraphId={selectedParagraphId}
            hasArticle={article !== null}
          />
          {/* 结束按钮 */}
          {article && !ended && (
            <div className="flex justify-center py-2 border-t border-[var(--color-border)]">
              <button onClick={handleEnd}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--color-canary)] text-black text-xs font-medium hover:bg-white transition-colors">
                <CheckCircle className="w-3 h-3" /> 结束写作
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 文章区 */}
      <div className="flex-1 bg-[var(--color-bg)]">
        <ArticleZone
          article={article}
          selectedId={selectedParagraphId}
          onSelectParagraph={handleSelectParagraph}
          onUndoParagraph={handleUndoParagraph}
          onExport={handleExport}
          generating={loading && !article}
        />
      </div>
    </div>
  );
}
