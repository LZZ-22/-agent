"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-enter min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex flex-col justify-center min-h-screen px-8 lg:px-20 py-24">
        <header className="flex justify-between items-center mb-auto">
          <span className="font-serif italic text-white/50 tracking-[0.25em] text-xs">STYLE AGENT</span>
          <span className="text-[10px] tracking-[0.2em] text-white/30">N° 01 / 2025</span>
        </header>

        <div className="my-auto py-8">
          <h1 className="font-serif text-5xl md:text-8xl italic font-light text-[var(--color-canary)] tracking-[0.18em] uppercase leading-none select-none drop-shadow-sm">
            LIFE IS LIFE
          </h1>

          <div className="mt-10 max-w-xl space-y-3 border-l border-[var(--color-canary)]/30 pl-6 py-1">
            <p className="text-base md:text-lg text-white/90 font-light tracking-widest leading-relaxed">
              "在隆冬，我终于发现，我心里有一个不可战胜的夏天。"
            </p>
            <p className="text-xs md:text-sm text-white/40 font-serif italic tracking-wider">
              "In the midst of winter, I found there was, within me, an invincible summer." — Albert Camus
            </p>
          </div>

          <div className="mt-12 flex gap-6">
            <Link href="/chat"
              className="px-8 py-3 bg-[var(--color-canary)] text-black font-medium rounded-full hover:bg-white hover:scale-105 transition-all text-xs tracking-[0.15em] uppercase">
              进入空间
            </Link>
            <a href="#modules"
              className="px-8 py-3 border border-white/10 rounded-full hover:bg-white/5 transition-all text-xs tracking-[0.15em] uppercase text-white/60">
              探索维度
            </a>
          </div>
        </div>

        <div className="flex justify-between items-end mt-auto">
          <span className="text-[9px] text-white/20 tracking-[0.3em]">KLEIN BLUE SYSTEM</span>
          <a href="#modules" className="flex items-center gap-2 text-[10px] text-[var(--color-canary-dim)]/70 tracking-[0.2em]">
            向下翻页
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </a>
        </div>
      </section>

      {/* Three Modules */}
      <section id="modules" className="min-h-screen py-24 px-8 lg:px-20 flex flex-col justify-center">
        <h2 className="font-serif text-2xl italic text-white/30 mb-16 tracking-[0.2em] uppercase text-center lg:text-left">工作舱 / Three Dimensions</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto w-full">

          {/* 写作 — 艺术棉纸 */}
          <Link href="/writing" className="group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] relative flex flex-col justify-between p-8 border border-white/5 bg-[var(--color-bg-elevated)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,47,167,0.25)]">
            <div>
              <span className="text-[10px] tracking-[0.2em] text-[var(--color-canary-dim)]/80 font-light block mb-2">01 / CREATIVE</span>
              <h3 className="font-serif text-2xl font-light tracking-widest text-white/90">写作</h3>
              <p className="text-xs text-white/40 mt-2 font-light">触摸纸张的呼吸，在温润中留下笔迹。</p>
            </div>
            <div className="w-full aspect-[4/3] paper-texture rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.35)] p-5 flex flex-col justify-between my-auto transition-transform duration-500 group-hover:scale-[1.03] group-hover:rotate-1">
              <div className="border-b border-black/5 pb-2 flex justify-between items-center">
                <span className="text-[8px] font-mono text-black/30 tracking-widest">COTTON PAPER N°01</span>
                <span className="w-1.5 h-1.5 rounded-full bg-black/10" />
              </div>
              <div className="space-y-2">
                <div className="h-[1px] w-full bg-black/[0.06]" />
                <div className="h-[1px] w-11/12 bg-black/[0.06]" />
                <div className="h-[1px] w-4/5 bg-black/[0.06]" />
              </div>
              <span className="text-black/60 font-serif italic text-xs text-right">Draft.</span>
            </div>
            <span className="text-xs text-white/30 group-hover:text-[var(--color-canary)] transition-colors flex items-center gap-1">Enter space <span className="group-hover:translate-x-1 transition-transform">→</span></span>
          </Link>

          {/* 对话 — 晨雾磨砂玻璃 */}
          <Link href="/chat" className="group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] relative flex flex-col justify-between p-8 border border-white/5 bg-gradient-to-b from-[#001344] to-[#002685] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,47,167,0.25)]">
            <div>
              <span className="text-[10px] tracking-[0.2em] text-[var(--color-canary-dim)]/80 font-light block mb-2">02 / DIALOGUE</span>
              <h3 className="font-serif text-2xl font-light tracking-widest text-white/90">对话</h3>
              <p className="text-xs text-white/40 mt-2 font-light">晨雾消散的窗口，聆听思想的落雨。</p>
            </div>
            <div className="w-full aspect-[4/3] frosted-glass rounded-xl p-5 flex flex-col justify-between my-auto transition-transform duration-500 group-hover:scale-[1.03]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                <span className="text-[9px] text-white/40 tracking-[0.15em] uppercase">Ethereal Room</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-lg text-[10px] text-white/70 max-w-[85%] self-end rounded-br-none backdrop-blur-sm">
                "生活，本就是风的形状..."
              </div>
            </div>
            <span className="text-xs text-white/30 group-hover:text-[var(--color-canary)] transition-colors flex items-center gap-1">Enter space <span className="group-hover:translate-x-1 transition-transform">→</span></span>
          </Link>

          {/* 调整 — 拉丝金属 */}
          <Link href="/evaluation" className="group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] relative flex flex-col justify-between p-8 border border-white/5 bg-[#000a1f] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,47,167,0.25)]">
            <div>
              <span className="text-[10px] tracking-[0.2em] text-[var(--color-canary-dim)]/80 font-light block mb-2">03 / CALIBRATION</span>
              <h3 className="font-serif text-2xl font-light tracking-widest text-white/90">调整</h3>
              <p className="text-xs text-white/40 mt-2 font-light">高精度物理面板，控制灵感的阈值。</p>
            </div>
            <div className="w-full aspect-[4/3] brushed-metal rounded-xl p-5 flex flex-col justify-between my-auto border border-white/10 transition-transform duration-500 group-hover:scale-[1.03]">
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-white/30 tracking-widest">CONSOLE N°402</span>
                <span className="text-[9px] text-[var(--color-canary)] font-mono tracking-wider bg-[var(--color-canary)]/10 px-2 py-0.5 rounded">TENSION: 42.8%</span>
              </div>
              <div className="space-y-1.5 py-2">
                <div className="flex justify-between text-[7px] text-white/20 font-mono"><span>MIN</span><span>MAX</span></div>
                <div className="w-full bg-black/60 h-2 rounded-full relative border border-white/5">
                  <div className="absolute left-0 top-0 h-full w-[42.8%] bg-gradient-to-r from-blue-600 to-[var(--color-canary)]/60 rounded-full" />
                  <div className="absolute left-[42.8%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-6 bg-white rounded shadow-lg border border-white/30 flex items-center justify-center">
                    <div className="w-[1px] h-3 bg-black/30" />
                  </div>
                </div>
              </div>
            </div>
            <span className="text-xs text-white/30 group-hover:text-[var(--color-canary)] transition-colors flex items-center gap-1">Enter space <span className="group-hover:translate-x-1 transition-transform">→</span></span>
          </Link>

        </div>
      </section>
    </div>
  );
}
