"use client";

import { useState, useRef, useEffect } from "react";
import type { WritingMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, Bot, User, PenLine } from "lucide-react";

interface ChatZoneProps {
  messages: WritingMessage[];
  onSend: (content: string) => void;
  loading: boolean;
  selectedParagraphId: string | null;
  hasArticle: boolean;
}

const PHASE_LABELS: Record<string, string> = {
  clarify: "需求澄清",
  outline: "提纲确认",
  draft: "初稿生成",
  revise: "段落修改",
};

export function ChatZone({
  messages,
  onSend,
  loading,
  selectedParagraphId,
  hasArticle,
}: ChatZoneProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  };

  const placeholder = selectedParagraphId
    ? `对段落 ${selectedParagraphId.split("_").pop()} 的修改要求...（如"精简到一半"或"加点抒情"）`
    : hasArticle
    ? "告诉 agent 你想怎么修改文章..."
    : "描述你想写的文章：主题、体裁、篇幅...";

  return (
    <div className="flex flex-col h-full">
      {/* 状态栏 */}
      <div className="px-4 py-2 border-b border-[var(--color-border)] flex items-center gap-2 flex-shrink-0">
        <PenLine className="h-4 w-4 text-[var(--color-muted-foreground)]" />
        <span className="text-xs text-[var(--color-muted-foreground)]">
          {selectedParagraphId
            ? `已选中段落 ${selectedParagraphId.split("_").pop()}`
            : hasArticle
            ? "文章已生成，点击右侧段落进行局部修改"
            : "描述你的写作需求"}
        </span>
        {selectedParagraphId && (
          <Badge variant="outline" className="text-[10px]">段落修改模式</Badge>
        )}
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-[var(--color-muted-foreground)]">
            <PenLine className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium mb-1">文章写作助手</p>
            <p className="text-xs mb-6 max-w-xs mx-auto">
              告诉我你想写什么——主题、体裁、篇幅、风格偏好。我会帮你完成从提纲到成稿的全过程。
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "帮我写一篇关于故乡冬天的散文",
                "写一篇回忆大学时光的随笔",
                "给这座城市写一封情书",
              ].map((q) => (
                <button
                  key={q}
                  className="px-3 py-1.5 text-xs border border-[var(--color-border)] rounded-full hover:bg-[var(--color-muted)] transition-colors cursor-pointer"
                  onClick={() => {
                    setInput(q);
                  }}
                >
                  {q.slice(0, 40)}{q.length > 40 ? "..." : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-[var(--color-primary)]" />
              </div>
            )}
            <Card
              className={`max-w-[85%] p-3 ${
                msg.role === "user" ? "bg-[var(--color-primary)] text-white border-0" : ""
              }`}
            >
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              {msg.action && (
                <div className="mt-2 pt-2 border-t border-[var(--color-border)]/20">
                  <Badge variant="outline" className="text-[10px]">
                    {PHASE_LABELS[msg.action] || msg.action}
                  </Badge>
                </div>
              )}
            </Card>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-muted)] flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-[var(--color-primary)]" />
            </div>
            <Card className="p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </Card>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 输入区 */}
      <div className="p-4 border-t border-[var(--color-border)] flex-shrink-0">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 self-end"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
