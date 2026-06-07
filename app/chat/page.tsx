"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { saveConversation } from "@/lib/store";
import type { Message } from "@/lib/types";
import { Send, Loader2, User, Bot, MessageCircle, Heart, Gamepad2 } from "lucide-react";

type ChatMode = "styled" | "mental" | "fun";

const MODES: { id: ChatMode; label: string; icon: any; desc: string; accent: string; placeholder: string }[] = [
  { id: "styled", label: "通用对话", icon: MessageCircle, desc: "默认风格模式", accent: "text-[var(--color-canary)] border-[var(--color-canary)]", placeholder: "输入你的问题..." },
  { id: "mental", label: "心理支持", icon: Heart, desc: "陪伴与情绪梳理", accent: "text-rose-400 border-rose-400", placeholder: "在这里可以放松地说任何事..." },
  { id: "fun", label: "娱乐分区", icon: Gamepad2, desc: "轻松有趣互动", accent: "text-amber-400 border-amber-400", placeholder: "随便说点什么，不用太认真..." },
];

export default function ChatPage() {
  const [mode, setMode] = useState<ChatMode>("styled");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convSaved, setConvSaved] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
        body: JSON.stringify({ messages: newMessages.map((m) => ({ role: m.role, content: m.content })), mode }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([...newMessages, { role: "assistant", content: data.reply, isStyled: true }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "抱歉，出了点问题。请重试。" }]);
    } finally { setLoading(false); }
  };

  const handleSaveConv = () => {
    if (messages.length === 0) return;
    saveConversation({ title: messages[0].content.slice(0, 40), messages, styleVersion: mode });
    setConvSaved(true);
    setTimeout(() => setConvSaved(false), 2000);
  };

  const currentMode = MODES.find((m) => m.id === mode)!;

  return (
    <div className="page-enter flex flex-col h-screen max-w-3xl mx-auto px-6">
      {/* Header + Mode Tabs */}
      <div className="py-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-serif text-xl italic text-white/80 tracking-wider">对话</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px]">{messages.length} 条消息</Badge>
            <Button variant="outline" size="sm" onClick={handleSaveConv} disabled={messages.length === 0}>
              {convSaved ? "已保存" : "保存"}
            </Button>
          </div>
        </div>
        <div className="flex gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setMessages([]); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all border ${
                mode === m.id
                  ? `${m.accent} bg-white/5`
                  : "border-transparent text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              <m.icon className="h-3 w-3" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <currentMode.icon className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm font-light tracking-wider">{currentMode.desc}</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white/50" />
              </div>
            )}
            <Card className={`max-w-[80%] p-4 ${msg.role === "user" ? "bg-[var(--color-canary)]/10 border-[var(--color-canary)]/20 text-white/90" : "bg-white/[0.03] border-white/5"}`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </Card>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <User className="h-4 w-4 text-white/50" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white/50" />
            </div>
            <Card className="p-4 bg-white/[0.03] border-white/5">
              <Loader2 className="h-4 w-4 animate-spin text-white/30" />
            </Card>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="py-4 border-t border-white/5">
        <div className="flex gap-3">
          <Textarea
            value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={currentMode.placeholder} rows={2} className="flex-1 bg-white/[0.03] border-white/10 text-white/90"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()} className="flex-shrink-0 self-end bg-[var(--color-canary)] text-black hover:bg-white">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-white/20 mt-2">Enter 发送 · Shift+Enter 换行 · 当前模式: {currentMode.label}</p>
      </div>
    </div>
  );
}
