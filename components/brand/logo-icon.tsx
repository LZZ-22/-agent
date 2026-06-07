// 122 品牌图标 — 精简版（Navbar 小尺寸 / Favicon）

export function LogoIcon({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="122"
    >
      <defs>
        <radialGradient id="iBg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#10071D" />
          <stop offset="100%" stopColor="#020106" />
        </radialGradient>
        <linearGradient id="iWord" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#D8B4FE" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <filter id="iGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="120" height="120" rx="20" fill="url(#iBg)" />

      {/* 简化事件视界 */}
      <circle cx="62" cy="58" r="14" fill="none" stroke="#C084FC" strokeWidth="0.8" strokeOpacity="0.5" filter="url(#iGlow)" />
      <circle cx="62" cy="58" r="6" fill="#03020A" />
      <circle cx="62" cy="58" r="2.5" fill="#010103" />
      <ellipse cx="62" cy="58" rx="28" ry="1" fill="#FFFFFF" fillOpacity="0.4" filter="url(#iGlow)" />

      {/* 122 简化字标 */}
      <text x="28" y="98" fill="url(#iWord)" fontFamily="Inter, sans-serif" fontSize="44" fontWeight="700" letterSpacing="-0.5" filter="url(#iGlow)">
        122
      </text>
    </svg>
  );
}
