// 黑洞事件视界 — 品牌核心视觉符号

export function BlackHoleLogo({ size = 240, className }: { size?: number; className?: string }) {
  const s = size;
  const half = s / 2;
  const coreR = s * 0.06;
  const ring1R = s * 0.14;
  const ring2R = s * 0.24;
  const ring3R = s * 0.35;
  const diskW = s * 0.55;
  return (
    <div className={className} style={{ width: s, height: s, position: "relative" }} aria-label="StyleAgent">
      {/* 外层光晕 */}
      <div style={{
        position: "absolute", inset: -s * 0.2, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(168,85,247,0.08) 0%, rgba(139,92,246,0.03) 45%, transparent 70%)`,
        filter: "blur(32px)",
      }} />
      {/* 最外层环 */}
      <div style={{
        position: "absolute", left: half - ring3R, top: half - ring3R,
        width: ring3R * 2, height: ring3R * 2, borderRadius: "50%",
        border: "1px solid rgba(168,85,247,0.08)",
        boxShadow: "0 0 24px rgba(168,85,247,0.06), inset 0 0 24px rgba(168,85,247,0.04)",
        filter: "blur(1px)",
      }} />
      {/* 中层环 */}
      <div style={{
        position: "absolute", left: half - ring2R, top: half - ring2R,
        width: ring2R * 2, height: ring2R * 2, borderRadius: "50%",
        border: "1px solid rgba(192,132,252,0.15)",
        boxShadow: "0 0 16px rgba(192,132,252,0.12), inset 0 0 16px rgba(192,132,252,0.08)",
        filter: "blur(0.5px)",
      }} />
      {/* 内层发光环 */}
      <div style={{
        position: "absolute", left: half - ring1R, top: half - ring1R,
        width: ring1R * 2, height: ring1R * 2, borderRadius: "50%",
        border: "1.5px solid rgba(168,85,247,0.3)",
        boxShadow: "0 0 12px rgba(168,85,247,0.25), 0 0 32px rgba(168,85,247,0.1), inset 0 0 10px rgba(168,85,247,0.1)",
      }} />
      {/* 吸积盘光带 */}
      <div style={{
        position: "absolute", left: half - diskW / 2, top: half - 2,
        width: diskW, height: 4, borderRadius: 2,
        background: `linear-gradient(90deg,
          transparent 0%,
          rgba(168,85,247,0.05) 15%,
          rgba(192,132,252,0.25) 35%,
          rgba(255,255,255,0.7) 48%,
          rgba(255,255,255,0.9) 50%,
          rgba(255,255,255,0.7) 52%,
          rgba(192,132,252,0.25) 65%,
          rgba(168,85,247,0.05) 85%,
          transparent 100%
        )`,
        filter: "blur(1.5px)",
        zIndex: 5,
      }} />
      {/* 吸积盘光晕 */}
      <div style={{
        position: "absolute", left: half - diskW / 2, top: half - 16,
        width: diskW, height: 32,
        background: `linear-gradient(90deg,
          transparent 0%,
          rgba(168,85,247,0.02) 25%,
          rgba(255,255,255,0.08) 48%,
          rgba(255,255,255,0.12) 50%,
          rgba(255,255,255,0.08) 52%,
          rgba(168,85,247,0.02) 75%,
          transparent 100%
        )`,
        filter: "blur(12px)",
        zIndex: 4,
      }} />
      {/* 黑洞核心 */}
      <div style={{
        position: "absolute", left: half - coreR, top: half - coreR,
        width: coreR * 2, height: coreR * 2, borderRadius: "50%",
        background: "#020106",
        boxShadow: `0 0 4px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.4), 0 0 24px rgba(168,85,247,0.5), 0 0 48px rgba(168,85,247,0.25), 0 0 72px rgba(139,92,246,0.12)`,
        zIndex: 6,
      }} />
    </div>
  );
}

// Navbar 精简版
export function BlackHoleNav({ className }: { className?: string }) {
  return (
    <div className={className} style={{ width: 28, height: 28, position: "relative", flexShrink: 0 }} aria-label="StyleAgent">
      <div style={{
        position: "absolute", left: 6, top: 6, width: 16, height: 16, borderRadius: "50%",
        border: "1px solid rgba(168,85,247,0.3)",
        boxShadow: "0 0 6px rgba(168,85,247,0.2)",
      }} />
      <div style={{
        position: "absolute", left: 10.5, top: 10.5, width: 7, height: 7, borderRadius: "50%",
        background: "#020106",
        boxShadow: "0 0 2px rgba(255,255,255,0.8), 0 0 6px rgba(168,85,247,0.4)",
        zIndex: 2,
      }} />
      <div style={{
        position: "absolute", left: 0, top: 13, width: 28, height: 2,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 60%, transparent)",
        filter: "blur(0.5px)",
      }} />
    </div>
  );
}
