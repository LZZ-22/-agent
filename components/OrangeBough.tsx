"use client";

// 右侧橙枝装饰 — 果实 / 切面 / 叶片 / 枝条，SVG 手绘感

interface Props { className?: string }

export default function OrangeBough({ className }: Props) {
  return (
    <div className={className} aria-hidden>
      <svg
        viewBox="0 0 420 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* 橙子主体渐变 */}
          <radialGradient id="orange-body" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="45%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </radialGradient>
          {/* 青橙主体 */}
          <radialGradient id="green-orange" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#A3E635" />
            <stop offset="45%" stopColor="#84CC16" />
            <stop offset="85%" stopColor="#65A30D" />
            <stop offset="100%" stopColor="#4D7C0F" />
          </radialGradient>
          {/* 切面果肉 */}
          <radialGradient id="flesh" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="60%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
          {/* 叶片渐变 */}
          <linearGradient id="leaf-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
        </defs>

        {/* ═══════════ 枝条 ═══════════ */}
        {/* 主枝 */}
        <path d="M280,120 Q310,280 290,450 Q270,600 300,720 Q310,800 295,870"
          stroke="#78350F" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
        {/* 上分支 → 切面橙 */}
        <path d="M295,250 Q340,240 370,220" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
        {/* 中分支 → 青橙 */}
        <path d="M288,420 Q340,430 375,410" stroke="#78350F" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.6" />
        {/* 下分支 → 叶片 */}
        <path d="M295,580 Q350,570 390,540" stroke="#78350F" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.55" />
        {/* 小枝 → 整橙 */}
        <path d="M290,350 Q240,360 210,340" stroke="#78350F" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.55" />

        {/* ═══════════ 切面橙子 ═══════════ */}
        <g transform="translate(370, 195)">
          {/* 外皮 */}
          <circle cx="0" cy="0" r="44" fill="#EA580C" opacity="0.9" />
          {/* 内皮白瓤 */}
          <circle cx="0" cy="0" r="38" fill="#FEF3C7" opacity="0.8" />
          {/* 果肉 */}
          <circle cx="0" cy="0" r="34" fill="url(#flesh)" />
          {/* 瓣膜线 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line key={deg} x1="0" y1="0" x2={34 * Math.cos((deg * Math.PI) / 180)} y2={34 * Math.sin((deg * Math.PI) / 180)}
              stroke="#F59E0B" strokeWidth="0.8" opacity="0.5" />
          ))}
          {/* 中心点 */}
          <circle cx="0" cy="0" r="3" fill="#FDE68A" opacity="0.9" />
          {/* 高光 */}
          <ellipse cx="-12" cy="-14" rx="10" ry="7" fill="white" opacity="0.15" />
        </g>

        {/* ═══════════ 青橙 ═══════════ */}
        <g transform="translate(375, 390)">
          <circle cx="0" cy="0" r="36" fill="url(#green-orange)" />
          {/* 果脐 */}
          <circle cx="0" cy="15" r="2.5" fill="#365314" opacity="0.5" />
          {/* 萼片 */}
          <path d="M-3,13 L-5,8 M0,12 L0,7 M3,13 L5,8" stroke="#4D7C0F" strokeWidth="1" fill="none" opacity="0.6" />
          {/* 顶部高光 */}
          <ellipse cx="-8" cy="-12" rx="9" ry="5" fill="white" opacity="0.18" />
          {/* 侧面微光 */}
          <ellipse cx="12" cy="4" rx="5" ry="10" fill="white" opacity="0.06" />
        </g>

        {/* ═══════════ 成熟整橙 ═══════════ */}
        <g transform="translate(210, 315)">
          <circle cx="0" cy="0" r="42" fill="url(#orange-body)" />
          {/* 表皮纹理点 */}
          <circle cx="-15" cy="-10" r="1" fill="#C2410C" opacity="0.3" />
          <circle cx="10" cy="-18" r="0.8" fill="#C2410C" opacity="0.25" />
          <circle cx="-8" cy="15" r="1.2" fill="#C2410C" opacity="0.2" />
          <circle cx="18" cy="5" r="0.7" fill="#C2410C" opacity="0.3" />
          {/* 果脐 */}
          <circle cx="0" cy="16" r="3" fill="#9A3412" opacity="0.5" />
          {/* 萼片 */}
          <path d="M-4,14 L-6,8 M0,13 L0,7 M4,14 L6,8" stroke="#78350F" strokeWidth="1.2" fill="none" opacity="0.55" />
          {/* 高光 */}
          <ellipse cx="-10" cy="-15" rx="12" ry="7" fill="white" opacity="0.2" />
        </g>

        {/* ═══════════ 半切橙（中段） ═══════════ */}
        <g transform="translate(385, 545)">
          {/* 外皮环 */}
          <circle cx="0" cy="0" r="30" fill="#EA580C" opacity="0.85" />
          <circle cx="0" cy="0" r="26" fill="url(#flesh)" />
          {/* 瓣膜 */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <line key={deg} x1="0" y1="0" x2={26 * Math.cos((deg * Math.PI) / 180)} y2={26 * Math.sin((deg * Math.PI) / 180)}
              stroke="#F59E0B" strokeWidth="0.7" opacity="0.45" />
          ))}
          <circle cx="0" cy="0" r="2.5" fill="#FDE68A" opacity="0.85" />
          <ellipse cx="-8" cy="-9" rx="7" ry="4" fill="white" opacity="0.14" />
        </g>

        {/* ═══════════ 叶片 1（上） ═══════════ */}
        <g transform="translate(390, 538)">
          <path d="M0,0 Q15,-18 30,-22 Q20,0 30,16 Q14,6 0,0 Z"
            fill="url(#leaf-grad)" opacity="0.85" />
          <path d="M0,0 Q14,-4 28,-3" stroke="#166534" strokeWidth="0.7" fill="none" opacity="0.5" />
        </g>

        {/* ═══════════ 叶片 2（中） ═══════════ */}
        <g transform="translate(295, 350) rotate(-15)">
          <path d="M0,0 Q-14,-22 -30,-28 Q-18,-4 -28,14 Q-12,5 0,0 Z"
            fill="url(#leaf-grad)" opacity="0.8" />
          <path d="M0,0 Q-12,-6 -24,-7" stroke="#166534" strokeWidth="0.7" fill="none" opacity="0.5" />
        </g>

        {/* ═══════════ 叶片 3（小，侧） ═══════════ */}
        <g transform="translate(340, 560) rotate(25)">
          <path d="M0,0 Q10,-14 22,-18 Q14,-2 22,10 Q10,4 0,0 Z"
            fill="url(#leaf-grad)" opacity="0.7" />
        </g>

        {/* ═══════════ 小橙子（青黄） ═══════════ */}
        <g transform="translate(310, 680)">
          <circle cx="0" cy="0" r="28" fill="url(#green-orange)" opacity="0.85" />
          {/* 渐变黄斑 */}
          <ellipse cx="8" cy="-6" rx="10" ry="12" fill="#FBBF24" opacity="0.3" />
          <circle cx="0" cy="11" r="2" fill="#365314" opacity="0.45" />
          <ellipse cx="-6" cy="-9" rx="7" ry="4" fill="white" opacity="0.16" />
        </g>

        {/* ═══════════ 掉落的橙瓣 ═══════════ */}
        <g transform="translate(340, 770)">
          <path d="M0,0 Q8,-12 16,-14 Q10,0 16,10 Q6,4 0,0 Z"
            fill="url(#flesh)" opacity="0.7" />
          <ellipse cx="-4" cy="-3" rx="3" ry="2" fill="white" opacity="0.12" />
        </g>
      </svg>
    </div>
  );
}
