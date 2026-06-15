import Link from "next/link";

export default function ModulesPage() {
  return (
    <div className="page-enter min-h-screen pt-20 pb-24 px-8 lg:px-20 flex flex-col justify-center">
      <div className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-white/5 bg-[var(--color-bg)]/80 backdrop-blur-xl flex items-center px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-serif text-lg italic font-bold text-[var(--color-canary)]">L.</span>
        </Link>
      </div>
      <h2 className="font-serif text-2xl italic text-white/45 mb-16 tracking-[0.2em] uppercase text-center lg:text-left">工作舱 / Three Dimensions</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto w-full">

        <Link href="/writing" className="group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] relative flex flex-col justify-between p-8 border border-white/5 bg-[var(--color-bg-elevated)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,47,167,0.25)]">
          <div>
            <span className="text-[10px] tracking-[0.2em] text-[var(--color-canary-dim)]/80 font-light block mb-2">01 / CREATIVE</span>
            <h3 className="font-serif text-2xl font-light tracking-widest text-white/90">写作</h3>
            <p className="text-xs text-white/55 mt-2 font-light">触摸纸张的呼吸，在温润中留下笔迹。</p>
          </div>
          <div className="w-full aspect-[4/3] paper-texture rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.35)] p-5 flex flex-col justify-between my-auto transition-transform duration-500 group-hover:scale-[1.03] group-hover:rotate-1">
            <div className="border-b border-black/5 pb-2 flex justify-between items-center">
              <span className="text-[8px] font-mono text-black/55 tracking-widest">COTTON PAPER N°01</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black/10" />
            </div>
            <div className="space-y-2"><div className="h-[1px] w-full bg-black/[0.06]" /><div className="h-[1px] w-11/12 bg-black/[0.06]" /><div className="h-[1px] w-4/5 bg-black/[0.06]" /></div>
            <span className="text-black/60 font-serif italic text-xs text-right">Draft.</span>
          </div>
          <span className="text-xs text-white/45 group-hover:text-[var(--color-canary)] transition-colors flex items-center gap-1">Enter space <span className="group-hover:translate-x-1 transition-transform">→</span></span>
        </Link>

        <Link href="/chat" className="group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] relative flex flex-col justify-between p-8 border border-white/5 bg-gradient-to-b from-[var(--color-bg-elevated)] to-[var(--color-klein)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,47,167,0.25)]">
          <div>
            <span className="text-[10px] tracking-[0.2em] text-[var(--color-canary-dim)]/80 font-light block mb-2">02 / DIALOGUE</span>
            <h3 className="font-serif text-2xl font-light tracking-widest text-white/90">对话</h3>
            <p className="text-xs text-white/55 mt-2 font-light">晨雾消散的窗口，聆听思想的落雨。</p>
          </div>
          <div className="w-full aspect-[4/3] frosted-glass rounded-xl p-5 flex flex-col justify-between my-auto transition-transform duration-500 group-hover:scale-[1.03]">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/55 animate-pulse" /><span className="text-[9px] text-white/55 tracking-[0.15em] uppercase">Ethereal Room</span></div>
            <div className="bg-white/5 border border-white/5 p-3 rounded-lg text-[10px] text-white/70 max-w-[85%] self-end rounded-br-none backdrop-blur-sm">&quot;生活，本就是风的形状...&quot;</div>
          </div>
          <span className="text-xs text-white/45 group-hover:text-[var(--color-canary)] transition-colors flex items-center gap-1">Enter space <span className="group-hover:translate-x-1 transition-transform">→</span></span>
        </Link>

        <Link href="/evaluation" className="group cursor-pointer rounded-2xl overflow-hidden aspect-[3/4] relative flex flex-col justify-between p-8 border border-white/5 bg-[var(--color-bg)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,47,167,0.25)]">
          <div>
            <span className="text-[10px] tracking-[0.2em] text-[var(--color-canary-dim)]/80 font-light block mb-2">03 / CALIBRATION</span>
            <h3 className="font-serif text-2xl font-light tracking-widest text-white/90">调整</h3>
            <p className="text-xs text-white/55 mt-2 font-light">高精度物理面板，控制灵感的阈值。</p>
          </div>
          <div className="w-full aspect-[4/3] brushed-metal rounded-xl p-5 flex flex-col justify-between my-auto border border-white/10 transition-transform duration-500 group-hover:scale-[1.03]">
            <div className="flex justify-between items-center"><span className="text-[8px] text-white/45 tracking-widest">CONSOLE N°402</span><span className="text-[9px] text-[var(--color-canary)] font-mono tracking-wider bg-[var(--color-canary)]/10 px-2 py-0.5 rounded">TENSION: 42.8%</span></div>
            <div className="space-y-1.5 py-2"><div className="flex justify-between text-[7px] text-white/35 font-mono"><span>MIN</span><span>MAX</span></div><div className="w-full bg-black/60 h-2 rounded-full relative border border-white/5"><div className="absolute left-0 top-0 h-full w-[42.8%] bg-gradient-to-r from-blue-600 to-[var(--color-canary)]/60 rounded-full" /><div className="absolute left-[42.8%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-6 bg-white rounded shadow-lg border border-white/30 flex items-center justify-center"><div className="w-[1px] h-3 bg-black/30" /></div></div></div>
          </div>
          <span className="text-xs text-white/45 group-hover:text-[var(--color-canary)] transition-colors flex items-center gap-1">Enter space <span className="group-hover:translate-x-1 transition-transform">→</span></span>
        </Link>

      </div>
    </div>
  );
}
