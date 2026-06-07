"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { saveConversation } from "@/lib/store";
import { FUN_ZONE_PATCH } from "@/lib/scene-patches";
import type { Message } from "@/lib/types";
import { Send, Loader2, Sparkles, Gamepad2, ClipboardList } from "lucide-react";

const SUGGESTIONS = [
  "用荒诞的理论解释一下为什么周一总是来得特别快",
  "给我写一段像烟鬼的理论那样的胡话，主题是咖啡",
  "如果你是东北盐碱地上的一棵树，你会怎么吐槽这片土地",
];

const MODE_TAGS = [
  { label: "荒诞理论", prompt: "用荒诞的方式建立一套理论来解释" },
  { label: "文字游戏", prompt: "玩一个文字游戏" },
  { label: "角色扮演", prompt: "扮演一个角色和我对话" },
  { label: "吐槽模式", prompt: "来，一起吐槽" },
  { label: "诗性瞬间", prompt: "用诗意的语言描述一个日常场景" },
];

const QUIZ_MODULES = [
  { id: "big_five_lab", name: "大五人格实验室", desc: "五维度人格倾向", icon: "🧠" },
  { id: "enneagram_lab", name: "九型人格实验室", desc: "动机与防御方式", icon: "🎭" },
  { id: "career_interest_lab", name: "职业兴趣实验室", desc: "六类职业兴趣倾向", icon: "💼" },
  { id: "type_dynamics_lab", name: "16型认知偏好", desc: "信息加工与决策", icon: "⚡" },
  { id: "cognitive_style_lab", name: "认知风格实验室", desc: "思维与表达方式", icon: "🔬" },
  { id: "social_attachment_lab", name: "社交边界实验室", desc: "关系风格与边界", icon: "🛡️" },
];

const MOCK_REPLIES = [
  "哈哈哈哈你这个角度我没想。行，有道理，虽然这个道理大概是歪的。",
  "认真的吗？我脑子里已经自动生成了一套荒诞理论来解释你这个问题。",
  "好问题。但我今天不想给正经答案。我给你三个选项：1.认真的 2.离谱但自洽的 3.我现编一个名言来糊弄你。",
];

export default function FunZonePage() {
  // Chat mode
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convSaved, setConvSaved] = useState(false);
  const [activeTag, setActiveTag] = useState("");
  // Mode switch
  const [mode, setMode] = useState<"chat" | "quiz">("chat");
  // Quiz mode
  const [quizState, setQuizState] = useState<any>(null);
  const [selectingVersion, setSelectingVersion] = useState<string | null>(null); // moduleId being selected
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (promptOverride?: string) => {
    const text = promptOverride || input.trim();
    if (!text) return;
    setConvSaved(false);
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: newMessages.map((m) => ({ role: m.role, content: m.content })), mode: "fun" }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([...newMessages, { role: "assistant", content: data.reply, isStyled: true }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)], isStyled: true }]);
    } finally { setLoading(false); }
  };

  const handleQuizStart = async (moduleId: string, version: string = "quick") => {
    try {
      const res = await fetch("/api/quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "start", moduleId, version }) });
      const data = await res.json();
      setQuizState({ ...data, moduleId, messages: [{ role: "assistant", content: data.message }] });
    } catch { alert("启动失败"); }
  };

  const handleQuizAnswer = async (n: number) => {
    if (!quizState) return;
    try {
      const res = await fetch("/api/quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "answer", sessionId: quizState.sessionId, answer: n }) });
      const data = await res.json();
      const msgs = [...quizState.messages, { role: "user", content: String(n) }];
      if (data.done) {
        msgs.push({ role: "assistant", content: "测试完成！下面是结果。" });
        setQuizState({ ...quizState, messages: msgs, result: data.result, done: true, currentQuestion: null });
      } else {
        msgs.push({ role: "assistant", content: data.nextQuestion.text });
        setQuizState({ ...quizState, messages: msgs, currentQuestion: data.nextQuestion, progress: data.progress, milestone: data.milestone });
      }
    } catch { alert("提交失败"); }
  };

  return (
    <div className="page-enter flex flex-col h-[calc(100vh-1px)] max-w-3xl mx-auto px-6">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-amber-500" />
            <h1 className="text-lg font-bold">娱乐分区</h1>
            <Badge variant="warning" className="text-[10px]">Fun Zone</Badge>
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
            场景补丁: {FUN_ZONE_PATCH.scene_name} v{FUN_ZONE_PATCH.version} · 风格强度 {FUN_ZONE_PATCH.style_strength}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setMode("chat"); setQuizState(null); }} className={`px-2.5 py-1 text-xs rounded-full border transition-colors cursor-pointer ${mode === "chat" ? "bg-amber-100 border-amber-300 text-amber-800" : "border-[var(--color-border)]"}`}>聊天</button>
          <button onClick={() => setMode("quiz")} className={`px-2.5 py-1 text-xs rounded-full border transition-colors cursor-pointer ${mode === "quiz" ? "bg-amber-100 border-amber-300 text-amber-800" : "border-[var(--color-border)]"}`}>测评</button>
        </div>
      </div>

      {/* QUIZ MODE */}
      {mode === "quiz" && (
        <div className="flex-1 overflow-y-auto py-6">
          {!quizState ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <ClipboardList className="h-10 w-10 mx-auto mb-2 text-amber-500 opacity-50" />
                <p className="text-sm font-medium">文字型娱乐测评</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">专业感强，不装，不土。选一个开始。</p>
              </div>
              <div className="grid gap-3">
                {QUIZ_MODULES.map((m) => (
                  <div key={m.id} className="cursor-pointer" onClick={() => setSelectingVersion(selectingVersion === m.id ? null : m.id)}>
                    <Card className={`p-4 transition-colors ${selectingVersion === m.id ? "border-amber-400 bg-amber-50" : "hover:border-amber-300"}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{m.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-xs text-[var(--color-muted-foreground)]">{m.desc}</p>
                          {selectingVersion === m.id && (
                            <div className="flex gap-2 mt-3">
                              {[
                                { v: "quick", label: "快速版", sub: "3-5min" },
                                { v: "standard", label: "标准版", sub: "6-10min" },
                                { v: "pro", label: "专业版", sub: "10-20min" },
                              ].map((opt) => (
                                <button key={opt.v} onClick={(e) => { e.stopPropagation(); handleQuizStart(m.id, opt.v); setSelectingVersion(null); }}
                                  className="px-3 py-2 text-xs rounded border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer text-center flex-1">
                                  <div className="font-medium">{opt.label}</div>
                                  <div className="text-[10px] text-[var(--color-muted-foreground)]">{opt.sub}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {quizState.messages?.map((msg: any, i: number) => (
                <Card key={i} className={`p-4 ${msg.role === "user" ? "bg-amber-50" : ""}`}><p className="text-sm whitespace-pre-wrap">{msg.content}</p></Card>
              ))}
              {quizState.result ? (
                <Card className="p-4 border-green-200 bg-green-50">
                  <p className="text-sm font-medium mb-2">📊 结果</p>
                  {Object.entries(quizState.result.dimensionScores || {}).map(([dim, score]: any) => (
                    <div key={dim} className="flex items-center gap-2 text-xs mb-1">
                      <span className="w-24 text-[var(--color-muted-foreground)]">{score.name}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full"><div className="h-2 bg-amber-500 rounded-full" style={{ width: `${score.normalized}%` }} /></div>
                      <span className="font-mono">{score.raw}</span>
                    </div>
                  ))}
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-2">{quizState.result.summary}</p>
                  <Button size="sm" className="mt-3" onClick={() => setQuizState(null)}>返回列表</Button>
                </Card>
              ) : quizState.currentQuestion && !quizState.done ? (
                <div className="space-y-3">
                  <p className="text-xs text-[var(--color-muted-foreground)]">{quizState.progress ? `[${quizState.progress.current + 1}/${quizState.progress.total}] ` : ""}{quizState.currentQuestion.text}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => handleQuizAnswer(n)} className="flex-1 py-2 text-sm rounded border border-[var(--color-border)] transition-colors cursor-pointer hover:bg-amber-50">{n}</button>
                    ))}
                  </div>
                  <p className="text-[10px] text-[var(--color-muted-foreground)] text-center">1=非常不同意 · 5=非常同意</p>
                  {quizState.milestone && <p className="text-xs text-amber-600 text-center">{quizState.milestone}</p>}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* CHAT MODE */}
      {mode === "chat" && (
        <>
          <div className="flex flex-wrap gap-2 py-3">
            {MODE_TAGS.map((tag) => (
              <button key={tag.label} onClick={() => { setActiveTag(tag.label); handleSend(tag.prompt); }} disabled={loading}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors cursor-pointer ${activeTag === tag.label ? "bg-amber-100 border-amber-300 text-amber-800" : "border-[var(--color-border)] hover:bg-[var(--color-muted)]"}`}>{tag.label}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12 text-[var(--color-muted-foreground)]">
                <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium mb-1">放松一下，这儿没有正经答案</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((q) => (<button key={q} className="px-3 py-1.5 text-xs border border-[var(--color-border)] rounded-full hover:bg-[var(--color-muted)] transition-colors cursor-pointer" onClick={() => setInput(q)}>{q.slice(0, 50)}{q.length > 50 ? "..." : ""}</button>))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><Sparkles className="h-4 w-4 text-amber-500" /></div>}
                <Card className={`max-w-[80%] p-4 ${msg.role === "user" ? "bg-[var(--color-primary)] text-white border-0" : "border-amber-100"}`}><div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div></Card>
              </div>
            ))}
            {loading && <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><Sparkles className="h-4 w-4 text-amber-500" /></div><Card className="p-4 border-amber-100"><Loader2 className="h-4 w-4 animate-spin text-amber-500" /></Card></div>}
            <div ref={bottomRef} />
          </div>
          <div className="py-4 border-t border-[var(--color-border)]">
            <div className="flex gap-3">
              <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="随便说点什么，不用太认真..." rows={2} className="flex-1"
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
              <Button onClick={() => handleSend()} disabled={loading || !input.trim()} className="flex-shrink-0 self-end bg-amber-500 hover:bg-amber-600">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
