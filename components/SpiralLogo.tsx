export function SpiralLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SPIRAI">
      <path
        d="M16 4C9.373 4 4 9.373 4 16c0 5.523 4.477 10 10 10 4.418 0 8-3.582 8-8 0-3.314-2.686-6-6-6-2.485 0-4.5 2.015-4.5 4.5"
        stroke="#5B5BFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LogoWordmark({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <SpiralLogo size={size} />
      <span className="font-semibold tracking-wide text-primaryText" style={{ fontSize: size * 0.7 }}>
        SPIRAI
      </span>
    </div>
  );
}
