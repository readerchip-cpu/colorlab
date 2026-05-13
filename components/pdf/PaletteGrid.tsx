'use client';

import { View, Text } from '@react-pdf/renderer';

interface ColorItem {
  hex: string;
  name?: string;
}

interface PaletteGridProps {
  colors: ColorItem[];
  columns?: number;
  label?: string;
  opacity?: number;
  chipSize?: number;
  gap?: number;
}

export function PaletteGrid({ colors, columns = 4, label, opacity = 1, chipSize, gap = 0 }: PaletteGridProps) {
  const pct = `${Math.floor(100 / columns)}%`;
  const dim = chipSize ?? (columns <= 4 ? 44 : columns <= 6 ? 34 : 26);
  const nameFontSize = columns <= 4 ? 7.5 : 6.5;

  return (
    <View>
      {label ? (
        <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.2, color: '#888', marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
        {colors.map(({ hex, name }) => (
          <View key={hex} style={{ width: pct, alignItems: 'center', paddingVertical: 6 }}>
            <Text style={{ fontSize: 5.5, color: '#BBB', marginBottom: 2, textAlign: 'center' }}>{hex}</Text>
            <View style={{
              width: dim, height: dim, borderRadius: dim / 2,
              backgroundColor: hex, opacity,
              borderWidth: 0.5, borderColor: '#E0DCCC', borderStyle: 'solid',
            }} />
            {name ? (
              <Text style={{ fontSize: nameFontSize, color: '#555', marginTop: 3, textAlign: 'center', maxWidth: dim + 16 }}>
                {name}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
