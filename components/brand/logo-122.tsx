// 122 品牌字标 — 完整版（Hero / 大尺寸使用）

export function Logo122({ className, size = 320 }: { className?: string; size?: number }) {
  const h = Math.round(size * 0.267); // maintain 1200:320 ratio
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 1200 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="122 StyleAgent"
    >
      <defs>
        <radialGradient id="lBg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#10071D" />
          <stop offset="55%" stopColor="#070412" />
          <stop offset="100%" stopColor="#020106" />
        </radialGradient>
        <linearGradient id="lWord" x1="160" y1="80" x2="880" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="28%" stopColor="#F3E8FF" />
          <stop offset="65%" stopColor="#D8B4FE" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <radialGradient id="lRing" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="22%" stopColor="#F5E8FF" />
          <stop offset="45%" stopColor="#D8B4FE" />
          <stop offset="72%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#4C1D95" stopOpacity="0" />
        </radialGradient>
        <filter id="lSoft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="lRingG" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="18" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b2" />
          <feMerge>
            <feMergeNode in="b1" />
            <feMergeNode in="b2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1200" height="320" rx="28" fill="url(#lBg)" />

      {/* 吸积盘光带 */}
      <ellipse cx="586" cy="160" rx="138" ry="6" fill="#C084FC" fillOpacity="0.22" filter="url(#lRingG)" />
      <ellipse cx="586" cy="160" rx="94" ry="3.5" fill="#FFFFFF" fillOpacity="0.85" filter="url(#lSoft)" />

      {/* 事件视界核心 */}
      <circle cx="586" cy="152" r="36" fill="url(#lRing)" filter="url(#lRingG)" />
      <circle cx="586" cy="152" r="19" fill="#03020A" />
      <circle cx="586" cy="152" r="8" fill="#010103" />

      {/* 数字 1 — 挺拔光柱 */}
      <path
        d="M188 95 C198 87, 212 86, 223 91 C233 96, 239 107, 239 120 L239 222 C239 238, 226 251, 210 251 C194 251, 181 238, 181 222 L181 144 C174 149, 164 151, 155 148 C143 144, 136 132, 138 119 C140 107, 149 97, 161 93 C171 89, 180 90, 188 95Z"
        fill="url(#lWord)" filter="url(#lSoft)"
      />

      {/* 第一个 2 — 雕塑感艺术核心 */}
      <path
        d="M334 116 C371 82, 430 76, 478 91 C523 105, 552 136, 552 170 C552 197, 535 219, 508 233 C487 244, 459 250, 432 255 C407 260, 388 266, 377 275 L519 275 C535 275, 548 288, 548 304 C548 320, 535 333, 519 333 L336 333 C318 333, 304 328, 294 317 C285 306, 283 291, 289 278 C297 257, 315 242, 343 232 C364 225, 390 220, 415 215 C440 210, 461 206, 476 198 C489 191, 497 182, 497 170 C497 157, 487 146, 469 140 C445 132, 414 137, 390 157 C378 167, 363 170, 350 166 C337 162, 328 151, 328 138 C328 130, 331 122, 334 116Z"
        fill="url(#lWord)" filter="url(#lSoft)"
      />

      {/* 第二个 2 — 轨道延续 */}
      <path
        d="M637 116 C673 82, 731 76, 779 91 C824 105, 853 136, 853 170 C853 197, 836 219, 809 233 C788 244, 760 250, 733 255 C708 260, 689 266, 678 275 L820 275 C836 275, 849 288, 849 304 C849 320, 836 333, 820 333 L637 333 C619 333, 605 328, 595 317 C586 306, 584 291, 590 278 C598 257, 616 242, 644 232 C665 225, 691 220, 716 215 C741 210, 762 206, 777 198 C790 191, 798 182, 798 170 C798 157, 788 146, 770 140 C746 132, 715 137, 691 157 C679 167, 664 170, 651 166 C638 162, 629 151, 629 138 C629 130, 632 122, 637 116Z"
        fill="url(#lWord)" filter="url(#lSoft)"
      />

      {/* 微星点缀 */}
      <circle cx="540" cy="88" r="1.5" fill="#E9D5FF" fillOpacity="0.7" />
      <circle cx="618" cy="82" r="1.3" fill="#D8B4FE" fillOpacity="0.7" />
      <circle cx="663" cy="108" r="1.1" fill="#FFFFFF" fillOpacity="0.6" />
    </svg>
  );
}
