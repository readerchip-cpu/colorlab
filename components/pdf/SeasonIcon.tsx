'use client';

import { Svg, Path, Circle } from '@react-pdf/renderer';

type SeasonKey = 'spring' | 'summer' | 'autumn' | 'fall' | 'winter';

const SEASON_COLORS: Record<string, string> = {
  spring: '#FF9E80',
  summer: '#FFD700',
  autumn: '#CD853F',
  fall:   '#CD853F',
  winter: '#6FA8DC',
};

interface SeasonIconProps {
  season: SeasonKey;
  size?: number;
  color?: string;
}

export function SeasonIcon({ season, size = 24, color }: SeasonIconProps) {
  const c = color ?? SEASON_COLORS[season] ?? '#2A2A2A';

  if (season === 'spring') {
    return (
      <Svg viewBox="0 0 24 24" width={size} height={size}>
        <Path
          d="M12 6 Q9 9 6 12 Q9 15 12 18 Q15 15 18 12 Q15 9 12 6 Z"
          fill={c}
        />
        <Circle cx={12} cy={12} r={2.5} fill="#fff" />
      </Svg>
    );
  }

  if (season === 'summer') {
    return (
      <Svg viewBox="0 0 24 24" width={size} height={size}>
        <Circle cx={12} cy={12} r={5} fill={c} />
        <Path
          d="M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12 M4.9 4.9 L7 7 M17 17 L19.1 19.1 M4.9 19.1 L7 17 M17 7 L19.1 4.9"
          stroke={c}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (season === 'autumn' || season === 'fall') {
    return (
      <Svg viewBox="0 0 24 24" width={size} height={size}>
        <Path
          d="M12 3 Q6 8 6 14 Q6 19 12 21 Q18 19 18 14 Q18 8 12 3 Z"
          fill={c}
        />
        <Path
          d="M12 3 L12 21"
          stroke="#fff"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  // winter
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path
        d="M12 2 L12 22 M2 12 L22 12 M4.9 4.9 L19.1 19.1 M19.1 4.9 L4.9 19.1"
        stroke={c}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Circle cx={12} cy={12} r={2.5} fill={c} />
    </Svg>
  );
}
