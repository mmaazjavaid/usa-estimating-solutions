export function ConstructionEstimationHeroSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'h-auto w-full'}
    >
      <path
        d="M100 350 L300 280 L550 320 L350 390 Z"
        stroke="#d9d9d9"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M150 340 L280 290 L480 320 L350 370"
        stroke="#d9d9d9"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <g stroke="#d9d9d9" strokeWidth="1.5" fill="none">
        <ellipse cx="200" cy="95" rx="30" ry="12" />
        <path d="M170 95 Q170 70 200 65 Q230 70 230 95" />
        <line x1="200" y1="65" x2="200" y2="55" />
        <ellipse cx="200" cy="115" rx="18" ry="20" />
        <path d="M182 135 Q170 150 165 200 Q160 250 170 300" />
        <path d="M218 135 Q230 150 235 200 Q240 250 230 300" />
        <path d="M182 135 L218 135" />
        <path d="M175 160 Q150 180 160 220 Q170 260 220 280" />
        <path d="M225 160 Q250 180 260 220 Q265 250 250 280" />
      </g>
      <g stroke="#d9d9d9" strokeWidth="1.5" fill="none">
        <ellipse cx="350" cy="75" rx="28" ry="11" />
        <path d="M322 75 Q322 52 350 47 Q378 52 378 75" />
        <line x1="350" y1="47" x2="350" y2="38" />
        <ellipse cx="350" cy="95" rx="17" ry="18" />
        <path d="M333 113 Q320 130 315 180 Q310 230 320 280" />
        <path d="M367 113 Q380 130 385 180 Q390 230 380 280" />
        <path d="M333 113 L367 113" />
        <path d="M325 140 Q300 160 290 200 Q285 240 300 270" />
        <path d="M375 140 Q400 160 410 200 Q415 240 400 270" />
      </g>
      <g stroke="#d9d9d9" strokeWidth="1.5" fill="none">
        <ellipse cx="480" cy="80" rx="28" ry="11" />
        <path d="M452 80 Q452 57 480 52 Q508 57 508 80" />
        <line x1="480" y1="52" x2="480" y2="43" />
        <ellipse cx="480" cy="100" rx="17" ry="18" />
        <path d="M463 118 Q450 135 445 185 Q440 235 450 285" />
        <path d="M497 118 Q510 135 515 185 Q520 235 510 285" />
        <path d="M463 118 L497 118" />
        <path d="M455 145 Q430 165 420 205 Q415 245 430 275" />
        <path d="M505 145 Q530 165 540 205 Q545 235 530 265" />
      </g>
    </svg>
  );
}
