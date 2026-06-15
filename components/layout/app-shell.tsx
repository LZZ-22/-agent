"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { initStore } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => { initStore(); }, []);

  const isModule = pathname === "/writing" || pathname === "/chat" || pathname === "/evaluation";

  return (
    <div className="flex min-h-screen flex-col">
      {/* 纯色渐变背景 — 写作/对话/调整 */}
      {isModule && (
        <div className="fixed inset-0 z-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, #0A1628 0%, #0D1F3A 35%, #102340 65%, #122848 100%)" }} />
      )}

      {/* 左上角 Logo — 所有页面 */}
      <Link href="/" className="fixed top-4 left-6 z-50 font-serif text-lg italic font-bold text-[var(--color-canary)]">L.</Link>

      <main className="flex-1 relative z-10">{children}</main>
    </div>
  );
}
