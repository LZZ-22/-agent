"use client";
import { useEffect, useState } from "react";

interface Props { onDone: () => void; }

const STAGES = [
  { key: "black",        duration: 1000 },
  { key: "flash",        duration: 60   },
  { key: "life1",        duration: 940  },
  { key: "is",           duration: 1000 },
  { key: "life2-glitch", duration: 1000 },
  { key: "life2-hold",   duration: 1000 },
  { key: "life2-solid",  duration: 1000 },
  { key: "video-hold",   duration: 2000 },
  { key: "fadeout",      duration: 600  },
] as const;

export default function IntroAnimation({ onDone }: Props) {
  const [stageIndex, setStageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (stageIndex >= STAGES.length) { onDone(); return; }
    if (STAGES[stageIndex].key === "fadeout") setFadeOut(true);
    const t = setTimeout(() => setStageIndex((i) => i + 1), STAGES[stageIndex].duration);
    return () => clearTimeout(t);
  }, [stageIndex, onDone]);

  const stage = STAGES[stageIndex]?.key;
  const baseCls = "absolute font-serif italic font-light text-[--color-canary] tracking-[0.16em] leading-none select-none";

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center overflow-hidden transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
      aria-hidden
    >
      {/* 全屏视频背景 */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline
        src="https://github.com/LZZ-22/-agent/releases/download/v1.0-assets/intro-bg.mp4"
      />
      {stage === "flash" && <div className="absolute inset-0 bg-white crt-flash" />}
      {/* 世界 — 左上角 */}
      {stage === "life1" && <span className={`${baseCls} text-[11vw] intro-glitch`} style={{ left: "6%", top: "10%", fontFamily: "var(--font-serif-cn)" }}>世界</span>}
      {/* 人类 — 左下靠中间 */}
      {stage === "is"   && <span className={`${baseCls} text-[8vw] intro-glitch`} style={{ left: "20%", top: "60%", fontFamily: "var(--font-serif-cn)" }}>人类</span>}
      {/* 理想 — 右侧闪烁 */}
      {stage === "life2-glitch" && (
        <span className={`${baseCls} text-[20vw] intro-glitch`}
          style={{ right: "8%", top: "28%", fontFamily: "var(--font-serif-cn)" }}
        >理想</span>
      )}
      {/* 自由 — 正中闪烁 */}
      {stage === "life2-hold" && (
        <span className="text-[20vw] intro-glitch text-[--color-canary] leading-none select-none"
          style={{ fontFamily: "var(--font-serif-cn)" }}
        >自由</span>
      )}
      {/* 自由 — 正中常亮 */}
      {stage === "life2-solid" && (
        <span className="text-[20vw] text-[--color-canary] leading-none select-none"
          style={{ fontFamily: "var(--font-serif-cn)" }}
        >自由</span>
      )}
    </div>
  );
}
