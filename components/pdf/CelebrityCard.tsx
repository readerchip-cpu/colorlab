'use client';

import { View, Text } from '@react-pdf/renderer';

interface CelebrityCardProps {
  name: string;
  profession: string;
  similarity: string;
  iconicLook: string;
  accentColor?: string;
  compact?: boolean;
}

export function CelebrityCard({
  name, profession, similarity, iconicLook, accentColor = '#7C3AED', compact = false,
}: CelebrityCardProps) {
  const initial = name.charAt(0);
  const circleDim = compact ? 36 : 44;
  const circleFontSize = compact ? 14 : 18;

  return (
    <View style={{
      flexDirection: 'row', gap: 10,
      backgroundColor: accentColor + '12',
      borderRadius: 10, padding: compact ? 10 : 12,
      borderWidth: 0.5, borderColor: accentColor + '38', borderStyle: 'solid',
    }}>
      {/* Initial circle */}
      <View style={{
        width: circleDim, height: circleDim, borderRadius: circleDim / 2,
        backgroundColor: accentColor + '22',
        borderWidth: 1.5, borderColor: accentColor + '55', borderStyle: 'solid',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Text style={{ fontSize: circleFontSize, fontWeight: 700, color: accentColor }}>
          {initial}
        </Text>
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: compact ? 11 : 13, fontWeight: 700, color: '#2A2A2A', marginBottom: 1 }}>
          {name}
        </Text>
        <Text style={{ fontSize: 7.5, color: '#888', marginBottom: compact ? 3 : 5 }}>
          {profession}
        </Text>
        <Text style={{ fontSize: 9, color: '#444', lineHeight: 1.5, marginBottom: 4 }}>
          {similarity}
        </Text>
        <View style={{
          borderTopWidth: 0.5, borderTopColor: '#DDD', borderTopStyle: 'solid', paddingTop: 4,
        }}>
          <Text style={{ fontSize: 8.5, color: '#666', lineHeight: 1.4 }}>✨ {iconicLook}</Text>
        </View>
      </View>
    </View>
  );
}
