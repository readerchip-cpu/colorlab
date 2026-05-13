'use client';

import { View, Text } from '@react-pdf/renderer';
import { SeasonIcon } from './SeasonIcon';

export { SeasonIcon } from './SeasonIcon';

const SEASON_CONFIG = {
  spring: { bg: '#FFF0F5', stripe: '#F098B0', label: 'SPRING 봄' },
  summer: { bg: '#F4F0FF', stripe: '#9878D8', label: 'SUMMER 여름' },
  autumn: { bg: '#FFF5EB', stripe: '#C87838', label: 'AUTUMN 가을' },
  winter: { bg: '#EEF4FF', stripe: '#5878C8', label: 'WINTER 겨울' },
} as const;

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
