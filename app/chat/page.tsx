"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { saveConversation, getConversations, updateConversation } from "@/lib/store";
import type { Message, Conversation } from "@/lib/types";
import { Send, Loader2, User, Bot, MessageCircle, Heart, Gamepad2, Plus, History, CheckCircle, RefreshCw, X } from "lucide-react";

const CHAT_STORAGE_KEY = "styleagent_active_chat";

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
  const [convId, setConvId] = useState<string>(() => Date.now().toString(36));
  const [history, setHistory] = useState<Conversation[]>([]);
  const [ended, setEnded] = useState(false);
  const [continuingId, setContinuingId] = useState<string | null>(null); // 正在继续的历史对话 ID
  const bottomRef = useRef<HTMLDivElement>(null);

  const refreshHistory = useCallback(() => {
    setHistory(getConversations().filter((c: any) => c.styleVersion === mode));
  }, [mode]);

  // ─── 加载历史 + 活动对话 ──────────────────────────────
  useEffect(() => { refreshHistory(); }, [refreshHistory]);

  useEffect(() => {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        if (saved[mode]?.messages?.length) {
          setMessages(saved[mode].messages);
          setConvId(saved[mode].id || Date.now().toString(36));
          setEnded(false);
          return;
        }
      } catch {}
    }
    setMessages([]);
    setConvId(Date.now().toString(36));
    setEnded(false);
  }, [mode]);

  // ─── 自动保存 ──────────────────────────────────────────
  const autoSave = useCallback((msgs: Message[], mid: string, m: ChatMode) => {
    if (msgs.length === 0) return;
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    saved[m] = { id: mid, messages: msgs, updatedAt: Date.now() };
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(saved));
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !ended) autoSave(messages, convId, mode);
  }, [messages, convId, mode, ended, autoSave]);

  // ─── 结束对话 ──────────────────────────────────────────
  const handleEndConv = () => {
    if (messages.length === 0) return;
    if (continuingId) {
      updateConversation(continuingId, { messages, title: messages[0].content.slice(0, 40) });
    } else {
      saveConversation({ title: messages[0].content.slice(0, 40), messages, styleVersion: mode });
    }
    setMessages([]); setConvId(Date.now().toString(36));
    setEnded(true); setContinuingId(null);
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (raw) { const saved = JSON.parse(raw); delete saved[mode]; localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(saved)); }
    refreshHistory();
  };

  // ─── 继续历史对话 ──────────────────────────────────────
  const handleContinue = (conv: Conversation) => {
    setMessages(conv.messages);
    setConvId(conv.id);
    setContinuingId(conv.id);
    setEnded(false);
    autoSave(conv.messages, conv.id, mode);
  };

  // ─── 新建对话 ──────────────────────────────────────────
  const handleNewConv = () => {
    if (messages.length > 0 && !ended) {
      saveConversation({ title: messages[0].content.slice(0, 40), messages, styleVersion: mode });
    }
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (raw) { const saved = JSON.parse(raw); delete saved[mode]; localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(saved)); }
    setMessages([]); setConvId(Date.now().toString(36));
    setEnded(false); setContinuingId(null);
    refreshHistory();
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setEnded(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.map((m) => ({ role: m.role, content: m.content })), mode }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([...newMessages, { role: "assistant", content: data.reply, isStyled: true }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "抱歉，出了点问题。请重试。" }]);
    } finally { setLoading(false); }
  };

  const currentMode = MODES.find((m) => m.id === mode)!;
  const lastAssistantIdx = [...messages].reverse().findIndex(m => m.role === "assistant");
  const hasAssistantReply = lastAssistantIdx >= 0;

  return (
    <div className="page-enter flex h-screen max-w-6xl mx-auto px-6 gap-6">
      {/* ═══ 左侧：对话区 ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="py-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-serif text-xl italic text-white/80 tracking-wider">对话</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">{messages.length} 条消息</Badge>
              <Button variant="outline" size="sm" onClick={handleNewConv} disabled={messages.length === 0}>
                <Plus className="w-3.5 h-3.5" /> 新对话
              </Button>
            </div>
          </div>
          <div className="flex gap-1.5">
            {MODES.map((m) => (
              <button key={m.id} onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all border ${mode === m.id ? `${m.accent} bg-white/5` : "border-transparent text-white/40 hover:text-white/70 hover:bg-white/5"}`}>
                <m.icon className="h-3 w-3" />{m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20 text-white/30">
              <currentMode.icon className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm font-light tracking-wider">{currentMode.desc}</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i}>
              <div className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white/50" />
                  </div>
                )}
                <Card className={`max-w-[85%] p-4 ${msg.role === "user" ? "bg-[var(--color-canary)]/10 border-[var(--color-canary)]/20 text-white/90" : "bg-white/[0.03] border-white/5"}`}>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                </Card>
                {msg.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-white/50" />
                  </div>
                )}
              </div>
              {/* 每个 agent 回复后：结束按钮 */}
              {msg.role === "assistant" && !ended && i === messages.length - 1 && (
                <div className="flex mt-3 ml-11">
                  <button onClick={handleEndConv}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--color-canary)] text-black text-xs font-medium hover:bg-white transition-colors">
                    <CheckCircle className="w-3 h-3" /> 结束对话
                  </button>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><Bot className="h-4 w-4 text-white/50" /></div>
              <Card className="p-4 bg-white/[0.03] border-white/5"><Loader2 className="h-4 w-4 animate-spin text-white/30" /></Card>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="py-4 border-t border-white/5 px-2">
          <div className="flex items-end gap-2.5">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={currentMode.placeholder} rows={1}
              className="flex-1 h-11 resize-none bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-white/20"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              style={{ minHeight: "2.75rem", maxHeight: "8rem" }} />
            <Button onClick={handleSend} disabled={loading || !input.trim()} size="sm" className="flex-shrink-0 h-11 w-11 p-0 bg-[var(--color-canary)] text-black hover:bg-white rounded-xl">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-white/20 mt-2 px-1">Enter 发送 · Shift+Enter 换行 · {currentMode.label}</p>
        </div>
      </div>

      {/* ═══ 右侧：历史对话 ═══ */}
      <div className="hidden lg:flex flex-col w-56 border-l border-white/5 pl-4 pt-20 shrink-0 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4 text-white/40">
          <History className="w-3.5 h-3.5" />
          <span className="text-[10px] tracking-[0.2em] uppercase">过去对话</span>
        </div>
        {history.length === 0 ? (
          <p className="text-[10px] text-white/20">暂无历史对话</p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 20).map((conv) => (
              <div key={conv.id} className="group relative">
                <button
                  onClick={() => handleContinue(conv)}
                  className="w-full text-left p-2.5 pr-8 rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all">
                  <p className="text-xs text-white/60 truncate group-hover:text-white/80">{conv.title || "对话"}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-white/25">{new Date(conv.createdAt).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}</span>
                    <RefreshCw className="w-3 h-3 text-white/20 group-hover:text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); const convs = getConversations().filter((c: any) => c.id !== conv.id); localStorage.setItem("styleagent_conv", JSON.stringify(convs)); refreshHistory(); }}
                  className="absolute top-1.5 right-1.5 p-1 rounded opacity-0 group-hover:opacity-100 hover:text-red-400 text-white/25 transition-all">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
