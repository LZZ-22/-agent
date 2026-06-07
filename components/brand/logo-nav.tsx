// 122 导航栏 Logo — 横向字标精简版

export function LogoNav({ className }: { className?: string }) {
  return (
    <svg
      width="112"
      height="28"
      viewBox="0 0 112 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="122"
    >
      <defs>
        <linearGradient id="nWord" x1="0" y1="0" x2="112" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#D8B4FE" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <filter id="nGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 微型事件视界 */}
      <circle cx="58" cy="14" r="5.5" fill="none" stroke="#C084FC" strokeWidth="0.6" strokeOpacity="0.5" />
      <circle cx="58" cy="14" r="2.5" fill="#03020A" />
      <ellipse cx="58" cy="14" rx="12" ry="0.6" fill="#FFFFFF" fillOpacity="0.3" />

      {/* 数字 1 */}
      <path d="M10 6 L10 22" stroke="url(#nWord)" strokeWidth="3" strokeLinecap="round" filter="url(#nGlow)" />

      {/* 第一个 2 */}
      <path d="M30 7 C38 5, 46 5, 50 8 C54 11, 54 14, 50 16 C45 19, 36 20, 28 22 L50 22" stroke="url(#nWord)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#nGlow)" />

      {/* 第二个 2 */}
      <path d="M66 7 C74 5, 82 5, 86 8 C90 11, 90 14, 86 16 C81 19, 72 20, 64 22 L86 22" stroke="url(#nWord)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#nGlow)" />
    </svg>
  );
}
