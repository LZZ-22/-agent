"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { initStore } from "@/lib/store";

const navItems = [
  { href: "/", icon: "home", label: "首页" },
  { href: "/writing", icon: "writing", label: "写作" },
  { href: "/chat", icon: "dialogue", label: "对话" },
  { href: "/evaluation", icon: "control", label: "调整" },
];

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const c = active ? "text-[var(--color-canary)]" : "text-white/40";
  return (
    <svg className={`w-4 h-4 ${c}`} fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      {type === "home" && <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
      {type === "writing" && <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />}
      {type === "dialogue" && <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
      {type === "control" && <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />}
    </svg>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => { initStore(); }, []);

  return (
    <div className="flex min-h-screen">
      {/* Side Icon Nav */}
      <nav className="fixed left-0 top-0 h-screen w-16 flex flex-col justify-between items-center py-8 border-r border-white/5 z-50 bg-[var(--color-bg)]/80 backdrop-blur-md">
        <Link href="/" className="text-lg font-serif italic font-bold text-[var(--color-canary)]">L.</Link>
        <div className="flex flex-col gap-7">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} title={item.label}
              className="hover:text-[var(--color-canary)] transition-all hover:scale-110">
              <NavIcon type={item.icon} active={pathname === item.href} />
            </Link>
          ))}
        </div>
        <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-serif italic text-white/40">C</div>
      </nav>

      <main className="flex-1 ml-16">{children}</main>
    </div>
  );
}
