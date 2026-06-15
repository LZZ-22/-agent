"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import IntroAnimation from "@/components/IntroAnimation";
import SpaceContent from "@/components/SpaceContent";

export default function HomePage() {
  const [glitch, setGlitch] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const played = sessionStorage.getItem("intro-played");
    if (!played) { setShowIntro(true); document.body.style.overflow = "hidden"; }
    else { setIntroDone(true); }
  }, []);

  const handleIntroDone = () => {
    sessionStorage.setItem("intro-played", "1");
    setShowIntro(false); setIntroDone(true);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const id = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 500); }, 5000);
    return () => clearInterval(id);
  }, []);

  if (!introDone && !showIntro) return null;
  if (showIntro) return <IntroAnimation onDone={handleIntroDone} />;

  return (
    <div className="page-enter min-h-screen flex flex-col">

      {/* ═══════ Hero ═══════ */}
      <section className="relative flex flex-col justify-center h-screen px-8 lg:px-20 py-24 overflow-hidden snap-start">
        <video className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" autoPlay muted loop playsInline src="/home-bg.mp4" />
        <div className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 85% 15%, rgba(0,0,0,0.18) 0%, transparent 50%),
              radial-gradient(ellipse 100% 60% at 50% 100%, rgba(0,0,0,0.15) 0%, transparent 55%),
              radial-gradient(ellipse 80% 50% at 5% 50%, rgba(0,0,0,0.08) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 70% 55%, rgba(0,0,0,0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 35% 38%, transparent 25%, rgba(0,0,0,0.10) 100%)
            `,
          }} />
        <div className="absolute bottom-8 right-10 z-10 pointer-events-none animate-arrow-bounce">
          <svg width="24" height="42" viewBox="0 0 24 42" fill="none"><path d="M2 2 L12 32" stroke="var(--color-canary)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" /><path d="M22 2 L12 32" stroke="var(--color-canary)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" /><path d="M2 2 L0 0" stroke="var(--color-canary)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.35" /><path d="M22 2 L24 0" stroke="var(--color-canary)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.35" /></svg>
        </div>
        <div className="relative z-10 flex flex-col justify-start h-full pt-[16vh]">
          <h1 className={`font-serif text-6xl md:text-[9rem] italic font-light text-[var(--color-canary)] tracking-[0.16em] uppercase leading-none select-none drop-shadow-sm ${glitch ? "glitch-active" : ""}`}>LIFE IS LIFE</h1>
          <div className="mt-10 max-w-xl space-y-3 border-l border-[var(--color-canary)]/30 pl-6 py-1">
            <p className="text-lg md:text-xl text-white/90 font-light tracking-widest leading-relaxed">&quot;在隆冬，我终于发现，我心里有一个不可战胜的夏天。&quot;</p>
            <p className="text-xs md:text-sm text-white/45 font-serif italic tracking-wider">« Au milieu de l&apos;hiver, j&apos;ai découvert qu&apos;il y avait en moi un été invincible. » —— 阿尔贝·加缪</p>
          </div>
        </div>
      </section>

      {/* ═══════ 晚熟的果子 ═══════ */}
      <section id="modules" className="relative min-h-screen pt-20 pb-24 px-8 lg:px-20 flex flex-col justify-center overflow-hidden snap-start">
<div className="relative z-10">
          <h2 className="font-serif text-3xl italic font-light text-white/80 tracking-wider mb-16 text-center lg:text-left">晚熟的果子</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto w-full">
            <Link href="/writing" className="group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] relative flex flex-col justify-between p-8 border border-white/10 bg-[#2a1e14]/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(180,130,80,0.25)]">
              <div><span className="text-[10px] tracking-[0.2em] text-[var(--color-canary-dim)]/80 font-light block mb-2">01 / CREATIVE</span><h3 className="font-serif text-2xl font-light tracking-widest text-white/90">写作</h3><p className="text-xs text-white/55 mt-2 font-light">触摸纸张的呼吸，在温润中留下笔迹。</p></div>
              <div className="w-full aspect-[4/3] paper-texture rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.35)] p-5 flex flex-col justify-between my-auto transition-transform duration-500 group-hover:scale-[1.03] group-hover:rotate-1"><div className="border-b border-black/5 pb-2 flex justify-between items-center"><span className="text-[8px] font-mono text-black/55 tracking-widest">COTTON PAPER N°01</span></div><div className="space-y-2"><div className="h-[1px] w-full bg-black/[0.06]" /><div className="h-[1px] w-11/12 bg-black/[0.06]" /><div className="h-[1px] w-4/5 bg-black/[0.06]" /></div><span className="text-black/60 font-serif italic text-xs text-right">Draft.</span></div>
              <span className="text-xs text-white/45 group-hover:text-[var(--color-canary)] transition-colors flex items-center gap-1">Enter space →</span>
            </Link>
            <Link href="/chat" className="group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] relative flex flex-col justify-between p-8 border border-white/10 bg-gradient-to-b from-[#2e2418]/60 to-[#241a0c]/70 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(180,130,80,0.25)]">
              <div><span className="text-[10px] tracking-[0.2em] text-[var(--color-canary-dim)]/80 font-light block mb-2">02 / DIALOGUE</span><h3 className="font-serif text-2xl font-light tracking-widest text-white/90">对话</h3><p className="text-xs text-white/55 mt-2 font-light">晨雾消散的窗口，聆听思想的落雨。</p></div>
              <div className="w-full aspect-[4/3] frosted-glass rounded-xl p-5 flex flex-col justify-between my-auto transition-transform duration-500 group-hover:scale-[1.03]"><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/55 animate-pulse" /><span className="text-[9px] text-white/55 tracking-[0.15em] uppercase">Ethereal Room</span></div><div className="bg-white/5 border border-white/5 p-3 rounded-lg text-[10px] text-white/70 max-w-[85%] self-end rounded-br-none backdrop-blur-sm">&quot;生活，本就是风的形状...&quot;</div></div>
              <span className="text-xs text-white/45 group-hover:text-[var(--color-canary)] transition-colors flex items-center gap-1">Enter space →</span>
            </Link>
            <Link href="/evaluation" className="group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] relative flex flex-col justify-between p-8 border border-white/10 bg-[#22180e]/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(180,130,80,0.25)]">
              <div><span className="text-[10px] tracking-[0.2em] text-[var(--color-canary-dim)]/80 font-light block mb-2">03 / CALIBRATION</span><h3 className="font-serif text-2xl font-light tracking-widest text-white/90">调整</h3><p className="text-xs text-white/55 mt-2 font-light">高精度物理面板，控制灵感的阈值。</p></div>
              <div className="w-full aspect-[4/3] brushed-metal rounded-xl p-5 flex flex-col justify-between my-auto border border-white/10 transition-transform duration-500 group-hover:scale-[1.03]"><div className="flex justify-between items-center"><span className="text-[8px] text-white/45 tracking-widest">CONSOLE N°402</span><span className="text-[9px] text-[var(--color-canary)] font-mono tracking-wider bg-[var(--color-canary)]/10 px-2 py-0.5 rounded">TENSION: 42.8%</span></div><div className="space-y-1.5 py-2"><div className="flex justify-between text-[7px] text-white/35 font-mono"><span>MIN</span><span>MAX</span></div><div className="w-full bg-black/60 h-2 rounded-full relative border border-white/5"><div className="absolute left-0 top-0 h-full w-[42.8%] bg-gradient-to-r from-blue-600 to-[var(--color-canary)]/60 rounded-full" /><div className="absolute left-[42.8%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-6 bg-white rounded shadow-lg border border-white/30 flex items-center justify-center"><div className="w-[1px] h-3 bg-black/30" /></div></div></div></div>
              <span className="text-xs text-white/45 group-hover:text-[var(--color-canary)] transition-colors flex items-center gap-1">Enter space →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ 进入空间 ═══════ */}
      <section className="relative min-h-screen overflow-hidden">

<div className="relative z-10">
          <SpaceContent />
        </div>
      </section>

    </div>
  );
}
