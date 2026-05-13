'use client';

import { View, Text } from '@react-pdf/renderer';

const DIMS = { small: 28, medium: 44, large: 60 } as const;

interface ColorChipProps {
  hex: string;
  name?: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'square';
  showHex?: boolean;
  opacity?: number;
}

export function ColorChip({
  hex, name, size = 'medium', shape = 'circle', showHex = true, opacity = 1,
}: ColorChipProps) {
  const dim = DIMS[size];
  const borderRadius = shape === 'circle' ? dim / 2 : 6;
  const nameFontSize = size === 'small' ? 6 : size === 'large' ? 8.5 : 7.5;

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{
        width: dim, height: dim, borderRadius,
        backgroundColor: hex, opacity,
        borderWidth: 0.5, borderColor: '#E0DCCC', borderStyle: 'solid',
      }} />
      {name ? (
        <Text style={{ fontSize: nameFontSize, color: '#555', marginTop: 3, textAlign: 'center', maxWidth: dim + 16 }}>
          {name}
        </Text>
      ) : null}
      {showHex ? (
        <Text style={{ fontSize: Math.max(5.5, nameFontSize - 2), color: '#AAA', textAlign: 'center' }}>
          {hex}
        </Text>
      ) : null}
    </View>
  );
}
