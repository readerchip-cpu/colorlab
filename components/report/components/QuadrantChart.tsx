'use client';

interface QuadrantChartProps {
  warmCool: number;   // 0–100 (0=Cool, 100=Warm)
  lightDeep: number;  // 0–100 (0=Light, 100=Deep)
  accentColor?: string;
  size?: number;
}

export function QuadrantChart({ warmCool, lightDeep, accentColor = '#7C3AED', size = 240 }: QuadrantChartProps) {
  const dotX = (warmCool / 100) * size;
  const dotY = (lightDeep / 100) * size;
  const half = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* 배경 */}
        <rect x={0} y={0} width={half} height={half} fill="#FFF5F5" />
        <rect x={half} y={0} width={half} height={half} fill="#FFF9F0" />
        <rect x={0} y={half} width={half} height={half} fill="#F0F5FF" />
        <rect x={half} y={half} width={half} height={half} fill="#F5F0FF" />

        {/* 축 */}
        <line x1={half} y1={0} x2={half} y2={size} stroke="#E0DCCC" strokeWidth={1} />
        <line x1={0} y1={half} x2={size} y2={half} stroke="#E0DCCC" strokeWidth={1} />

        {/* 축 레이블 */}
        <text x={8} y={half - 6} fontSize={9} fill="#AAA">Cool</text>
        <text x={size - 28} y={half - 6} fontSize={9} fill="#AAA">Warm</text>
        <text x={half + 5} y={12} fontSize={9} fill="#AAA">Light</text>
        <text x={half + 5} y={size - 4} fontSize={9} fill="#AAA">Deep</text>

        {/* 포지션 점 */}
        <circle cx={dotX} cy={dotY} r={7} fill={accentColor} opacity={0.2} />
        <circle cx={dotX} cy={dotY} r={4} fill={accentColor} />
      </svg>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Warm {warmCool}% · Light {100 - lightDeep}%
      </p>
    </div>
  );
}
