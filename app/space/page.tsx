"use client";

import SpaceContent from "@/components/SpaceContent";

export default function SpacePage() {
  return (
    <div className="page-enter min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[var(--color-bg)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center">
          <span className="font-serif text-lg italic font-bold text-[var(--color-canary)] tracking-wider">空间</span>
        </div>
      </header>
      <SpaceContent />
      <footer className="border-t border-white/5 py-12 text-center">
        <p className="text-[10px] text-white/15 tracking-[0.3em] font-mono">KLEIN BLUE VAULT · N° 122</p>
      </footer>
    </div>
  );
}
