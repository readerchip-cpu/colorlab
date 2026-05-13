'use client';

import { View, Text, Svg, Circle, Line, Path, G } from '@react-pdf/renderer';

const SEASON_CONFIG = {
  spring: { bg: '#FFF0F5', stripe: '#F098B0', label: 'SPRING 봄' },
  summer: { bg: '#F4F0FF', stripe: '#9878D8', label: 'SUMMER 여름' },
  autumn: { bg: '#FFF5EB', stripe: '#C87838', label: 'AUTUMN 가을' },
  winter: { bg: '#EEF4FF', stripe: '#5878C8', label: 'WINTER 겨울' },
} as const;

function FlowerIcon({ size }: { size: number }) {
  const c = size / 2;
  const pr = size * 0.17;
  const pd = size * 0.21;
  const angles = [0, 60, 120, 180, 240, 300].map((d) => (d * Math.PI) / 180);
  return (
    <Svg width={size} height={size}>
      {angles.map((rad, i) => (
        <Circle
          key={i}
          cx={c + pd * Math.cos(rad)}
          cy={c + pd * Math.sin(rad)}
          r={pr}
          fill="#F098B0"
          opacity={0.85}
        />
      ))}
      <Circle cx={c} cy={c} r={size * 0.13} fill="#FFD940" />
    </Svg>
  );
}

function SunIcon({ size }: { size: number }) {
  const c = size / 2;
  const ir = size * 0.2;
  const or = size * 0.43;
  const angles = [0, 45, 90, 135, 180, 225, 270, 315].map((d) => (d * Math.PI) / 180);
  return (
    <Svg width={size} height={size}>
      {angles.map((rad, i) => (
        <Line
          key={i}
          x1={c + ir * Math.cos(rad)} y1={c + ir * Math.sin(rad)}
          x2={c + or * Math.cos(rad)} y2={c + or * Math.sin(rad)}
          stroke="#FFB800" strokeWidth={1.5} strokeLinecap="round"
        />
      ))}
      <Circle cx={c} cy={c} r={size * 0.18} fill="#FFB800" />
      <Circle cx={c} cy={c} r={size * 0.1} fill="#FFE080" />
    </Svg>
  );
}

function LeafIcon({ size }: { size: number }) {
  const s = size;
  const leaf = `M ${s * 0.5} ${s * 0.94} Q ${s * 0.08} ${s * 0.62} ${s * 0.5} ${s * 0.06} Q ${s * 0.92} ${s * 0.62} ${s * 0.5} ${s * 0.94} Z`;
  return (
    <Svg width={size} height={size}>
      <Path d={leaf} fill="#C07838" opacity={0.85} />
      <Line x1={s * 0.5} y1={s * 0.9} x2={s * 0.5} y2={s * 0.1} stroke="#A05820" strokeWidth={0.7} opacity={0.5} />
    </Svg>
  );
}

function SnowflakeIcon({ size }: { size: number }) {
  const c = size / 2;
  const r = size * 0.43;
  const bl = size * 0.13;
  const bd = size * 0.26;
  const arms = [0, 60, 120].map((d) => (d * Math.PI) / 180);

  return (
    <Svg width={size} height={size}>
      {arms.map((rad, i) => {
        const perp = rad + Math.PI / 2;
        return (
          <G key={i}>
            <Line x1={c + r * Math.cos(rad)} y1={c + r * Math.sin(rad)}
                  x2={c - r * Math.cos(rad)} y2={c - r * Math.sin(rad)}
                  stroke="#5878C8" strokeWidth={1.2} />
            {[bd, -bd].map((d, j) => {
              const bx = c + d * Math.cos(rad);
              const by = c + d * Math.sin(rad);
              return (
                <Line key={j}
                  x1={bx - bl * Math.cos(perp)} y1={by - bl * Math.sin(perp)}
                  x2={bx + bl * Math.cos(perp)} y2={by + bl * Math.sin(perp)}
                  stroke="#5878C8" strokeWidth={0.8}
                />
              );
            })}
          </G>
        );
      })}
      <Circle cx={c} cy={c} r={2.5} fill="#5878C8" />
    </Svg>
  );
}

function SeasonIcon({ season, size }: { season: string; size: number }) {
  if (season === 'spring') return <FlowerIcon size={size} />;
  if (season === 'summer') return <SunIcon size={size} />;
  if (season === 'autumn') return <LeafIcon size={size} />;
  return <SnowflakeIcon size={size} />;
}

interface SeasonCardProps {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  outfit: string;
  accentColor?: string;
}

export function SeasonCard({ season, outfit }: SeasonCardProps) {
  const cfg = SEASON_CONFIG[season];

  return (
    <View style={{
      flex: 1, borderRadius: 8,
      backgroundColor: cfg.bg,
      borderTopWidth: 3, borderTopColor: cfg.stripe, borderTopStyle: 'solid',
      padding: 10,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 }}>
        <SeasonIcon season={season} size={20} />
        <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 0.8, color: cfg.stripe }}>
          {cfg.label}
        </Text>
      </View>
      <Text style={{ fontSize: 9, color: '#2A2A2A', lineHeight: 1.5 }}>{outfit}</Text>
    </View>
  );
}
