import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "122 — 个人语言风格 AI 对话 Agent",
  description: "基于风格规范与评估闭环的个人语言风格 AI 对话 Agent。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,500&family=Inter:wght@200;300;400;500;700&family=JetBrains+Mono:wght@400&family=Noto+Serif+SC:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <video className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none" autoPlay muted loop playsInline src="/home-bg.mp4" />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
