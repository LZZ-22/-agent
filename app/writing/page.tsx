"use client";

import { useState, useCallback } from "react";
import type { Article, WritingMessage, Paragraph } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { ChatZone } from "@/components/writing/chat-zone";
import { ArticleZone } from "@/components/writing/article-zone";

export default function WritingPage() {
  const [messages, setMessages] = useState<WritingMessage[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [selectedParagraphId, setSelectedParagraphId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      {/* 对话区 */}
      <div className="w-[40%] min-w-[320px] border-r border-[var(--color-border)] bg-[var(--color-surface)]">
        <ChatZone
          messages={messages}
          onSend={handleSend}
          loading={loading}
          selectedParagraphId={selectedParagraphId}
          hasArticle={article !== null}
        />
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
