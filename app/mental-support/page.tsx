"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { saveConversation } from "@/lib/store";
import { MENTAL_SUPPORT_PATCH } from "@/lib/scene-patches";
import type { Message } from "@/lib/types";
import { Send, Loader2, Heart, Shield, AlertTriangle } from "lucide-react";

const SUGGESTIONS = [
  "最近压力有点大，想找人说说话",
  "有时候觉得自己不够好，这种感觉怎么处理？",
  "和朋友之间发生了一些事，心里堵得慌",
  "对未来感到很迷茫，不知道方向在哪里",
];

const MOCK_REPLIES = [
  "我能感觉到你现在不太好受。不用急着说清楚——有时候情绪本身就是乱糟糟的，这很正常。\n\n你想多聊聊吗？我在这儿听着。",
  "谢谢你愿意说出来。这些事情放在心里确实很重。\n\n我不会跟你说'想开点'——那种话没什么用。但我可以陪你一起理一理，如果你愿意的话。",
  "听你这么说，我觉得你已经在很努力地面对了。有时候光是扛着就已经很不容易了。\n\n深呼吸一下。不用急着解决什么，我们先让情绪落一落。",
];

export default function MentalSupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convSaved, setConvSaved] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setConvSaved(false);
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          mode: "mental",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([...newMessages, { role: "assistant", content: data.reply, isStyled: true }]);
    } catch {
      const mock = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
      setMessages([...newMessages, { role: "assistant", content: mock, isStyled: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConv = () => {
    if (messages.length === 0) return;
    saveConversation({
      title: "💚 " + (messages[0].content.slice(0, 30) + (messages[0].content.length > 30 ? "..." : "")),
      messages,
      styleVersion: "心理支持模式",
    });
    setConvSaved(true);
    setTimeout(() => setConvSaved(false), 2000);
  };

  return (
    <div className="page-enter flex flex-col h-[calc(100vh-1px)] max-w-3xl mx-auto px-6">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-400" />
            <h1 className="text-lg font-bold">心理支持</h1>
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
            场景补丁: {MENTAL_SUPPORT_PATCH.scene_name} v{MENTAL_SUPPORT_PATCH.version} · 风格强度 {MENTAL_SUPPORT_PATCH.style_strength}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">{messages.length} 条消息</Badge>
          <Button variant="outline" size="sm" onClick={handleSaveConv} disabled={messages.length === 0}>
            {convSaved ? "已保存" : "保存"}
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 py-3 px-4 bg-amber-50 border border-amber-200 rounded-[var(--radius-md)] text-xs text-amber-800 my-3">
        <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>
          这是一个 AI 心理支持对话实验，不提供医疗诊断或治疗。如果你正在经历严重的心理困扰，请寻求专业心理咨询师或医生的帮助。
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-16 text-[var(--color-muted-foreground)]">
            <Heart className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium mb-1">这里是一个可以放松说话的地方</p>
            <p className="text-xs mb-6">没有评判，没有急着给建议的冲动，只有倾听和陪伴</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  className="px-3 py-1.5 text-xs border border-[var(--color-border)] rounded-full hover:bg-[var(--color-muted)] transition-colors cursor-pointer"
                  onClick={() => setInput(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                <Heart className="h-4 w-4 text-rose-400" />
              </div>
            )}
            <Card className={`max-w-[80%] p-4 ${msg.role === "user" ? "bg-[var(--color-primary)] text-white border-0" : "border-rose-100"}`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </Card>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <Heart className="h-4 w-4 text-rose-400" />
            </div>
            <Card className="p-4 border-rose-100">
              <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
            </Card>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Risk notice */}
      {messages.length > 0 && (
        <div className="flex items-center gap-1.5 py-1.5 text-[10px] text-[var(--color-muted-foreground)] justify-center">
          <AlertTriangle className="h-3 w-3" />
          如果话题涉及自伤、伤害他人等高风险内容，系统将引导寻求专业帮助
        </div>
      )}

      {/* Input */}
      <div className="py-4 border-t border-[var(--color-border)]">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="在这里可以放松地说任何事..."
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
            className="flex-shrink-0 self-end bg-rose-400 hover:bg-rose-500"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
