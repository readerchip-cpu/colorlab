'use client';

import { View, Text, Svg, Path, Circle } from '@react-pdf/renderer';

type IconKey = 'daily' | 'layer' | 'accent' | 'shop' | 'outfit' | 'tip';

function IconGraphic({ icon }: { icon: IconKey }) {
  if (icon === 'daily') {
    return (
      <Svg width={14} height={14} viewBox="0 0 16 16">
        <Path d="M3 8 L8 3 L13 8 L13 13 L3 13 Z" fill="#7C3AED" />
      </Svg>
    );
  }
  if (icon === 'layer') {
    return (
      <Svg width={14} height={14} viewBox="0 0 16 16">
        <Path d="M2 4 L14 4 M2 8 L14 8 M2 12 L14 12" stroke="#7C3AED" strokeWidth={2} />
      </Svg>
    );
  }
  if (icon === 'accent') {
    return (
      <Svg width={14} height={14} viewBox="0 0 16 16">
        <Path d="M8 2 L9 6 L13 6 L10 9 L11 13 L8 11 L5 13 L6 9 L3 6 L7 6 Z" fill="#7C3AED" />
      </Svg>
    );
  }
  if (icon === 'shop') {
    return (
      <Svg width={14} height={14} viewBox="0 0 16 16">
        <Path d="M3 6 L13 6 L12 13 L4 13 Z M5 6 L5 4 Q5 2 8 2 Q11 2 11 4 L11 6" fill="none" stroke="#7C3AED" strokeWidth={1.5} />
      </Svg>
    );
  }
  if (icon === 'outfit') {
    return (
      <Svg width={14} height={14} viewBox="0 0 16 16">
        <Path d="M5 2 L11 2 L13 5 L11 6 L11 13 L5 13 L5 6 L3 5 Z" fill="#7C3AED" />
      </Svg>
    );
  }
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16">
      <Circle cx={8} cy={8} r={6} fill="#7C3AED" />
    </Svg>
  );
}

interface IconLabelProps {
  icon: IconKey;
  label: string;
  fontSize?: number;
}

export function IconLabel({ icon, label, fontSize = 11 }: IconLabelProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <IconGraphic icon={icon} />
      <Text style={{ fontSize, fontWeight: 'bold', color: '#2A2A2A', fontFamily: 'Pretendard' }}>
        {label}
      </Text>
    </View>
  );
}
