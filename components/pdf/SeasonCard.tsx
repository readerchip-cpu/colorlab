'use client';

import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { SeasonIcon } from './SeasonIcon';

export { SeasonIcon } from './SeasonIcon';

const SEASON_CONFIG = {
  spring: { bg: '#FFF0F5', stripe: '#F098B0', label: 'SPRING 봄' },
  summer: { bg: '#F4F0FF', stripe: '#9878D8', label: 'SUMMER 여름' },
  autumn: { bg: '#FFF5EB', stripe: '#C87838', label: 'AUTUMN 가을' },
  winter: { bg: '#EEF4FF', stripe: '#5878C8', label: 'WINTER 겨울' },
} as const;

interface MustHaveItem { icon?: string; label: string }
interface ColorItem { name: string; hex: string }

interface SeasonCardProps {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  title?: string;
  description?: string;
  mustHaves?: MustHaveItem[];
  colors?: ColorItem[];
  outfit?: string;
}

const S = StyleSheet.create({
  card: {
    flex: 1, borderRadius: 8,
    borderTopWidth: 3, borderTopStyle: 'solid',
    padding: 12,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  titleSection: { flex: 1 },
  seasonName: { fontSize: 14, fontWeight: 700, letterSpacing: 0.8, fontFamily: 'Pretendard' },
  lookTitle: { fontSize: 13, fontWeight: 700, color: '#2A2A2A', fontFamily: 'Pretendard', lineHeight: 1.4 },
  description: { fontSize: 10.5, color: '#444', lineHeight: 1.7, fontFamily: 'Pretendard', marginBottom: 8 },
  itemsLabel: { fontSize: 6.5, fontWeight: 700, letterSpacing: 1.2, color: '#AAA', marginBottom: 5, fontFamily: 'Pretendard' },
  itemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  itemEntry: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  itemDot: { width: 5, height: 5, borderRadius: 2.5 },
  itemText: { fontSize: 10, color: '#555', fontFamily: 'Pretendard' },
  colorsLabel: { fontSize: 6.5, fontWeight: 700, letterSpacing: 1.2, color: '#AAA', marginBottom: 5, fontFamily: 'Pretendard' },
  colorsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  colorEntry: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  colorChip: { width: 12, height: 12, borderRadius: 6, borderWidth: 0.3, borderStyle: 'solid', borderColor: '#CCC' },
  colorText: { fontSize: 9.5, color: '#666', fontFamily: 'Pretendard' },
  outfitText: { fontSize: 10.5, color: '#2A2A2A', lineHeight: 1.7, fontFamily: 'Pretendard' },
});

export function SeasonCard({ season, title, description, mustHaves, colors, outfit }: SeasonCardProps) {
  const cfg = SEASON_CONFIG[season];

  return (
    <View style={[S.card, { backgroundColor: cfg.bg, borderTopColor: cfg.stripe }]}>
      <View style={S.topRow}>
        <SeasonIcon season={season} size={28} />
        <View style={S.titleSection}>
          <Text style={[S.seasonName, { color: cfg.stripe }]}>{cfg.label}</Text>
          {title ? <Text style={S.lookTitle}>{title}</Text> : null}
        </View>
      </View>

      {description ? (
        <Text style={S.description}>{description}</Text>
      ) : outfit ? (
        <Text style={S.outfitText}>{outfit}</Text>
      ) : null}

      {mustHaves && mustHaves.length > 0 ? (
        <>
          <Text style={S.itemsLabel}>FOR THIS LOOK</Text>
          <View style={S.itemsRow}>
            {mustHaves.map((item, i) => (
              <View key={i} style={S.itemEntry}>
                <View style={[S.itemDot, { backgroundColor: cfg.stripe }]} />
                <Text style={S.itemText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {colors && colors.length > 0 ? (
        <>
          <Text style={S.colorsLabel}>COLORS</Text>
          <View style={S.colorsRow}>
            {colors.map(({ name, hex }) => (
              <View key={hex} style={S.colorEntry}>
                <View style={[S.colorChip, { backgroundColor: hex }]} />
                <Text style={S.colorText}>{name}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}
