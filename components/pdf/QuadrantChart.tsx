'use client';

import {
  View, Text, Svg, Rect, Line, Circle, Defs, LinearGradient, Stop,
} from '@react-pdf/renderer';

interface QuadrantChartProps {
  /** 0 = 매우 Cool, 100 = 매우 Warm */
  warmCool: number;
  /** 0 = 매우 Light (위), 100 = 매우 Deep (아래) */
  lightDeep: number;
  size?: number;
}

export function QuadrantChart({ warmCool, lightDeep, size = 240 }: QuadrantChartProps) {
  const PAD = 36;
  const cL  = PAD;
  const cR  = size - PAD;
  const cT  = PAD;
  const cB  = size - PAD;
  const cW  = cR - cL;
  const cH  = cB - cT;
  const mX  = cL + cW / 2;
  const mY  = cT + cH / 2;

  const dotX = cL + (1 - warmCool / 100) * cW;
  const dotY = cT + (lightDeep / 100) * cH;

  return (
    <View>
      {/* 상단 축 라벨 — LIGHT (밝은 명도) */}
      <View style={{ alignItems: 'center', marginBottom: 5 }}>
        <Text style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: '#666', fontFamily: 'Pretendard', textAlign: 'center' }}>
          LIGHT
        </Text>
        <Text style={{ fontSize: 6.5, color: '#999', fontFamily: 'Pretendard', textAlign: 'center', marginTop: 1 }}>
          밝은 명도
        </Text>
      </View>

      {/* 차트 행 — 좌우 라벨 + SVG */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>

        {/* 좌측 축 라벨 — WARM (따뜻한 색조) */}
        <View style={{ width: 38, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: '#666', fontFamily: 'Pretendard', textAlign: 'center' }}>
            WARM
          </Text>
          <Text style={{ fontSize: 6.5, color: '#999', fontFamily: 'Pretendard', textAlign: 'center', marginTop: 1 }}>
            따뜻한 색조
          </Text>
        </View>

        {/* 차트 SVG */}
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="gSpring" x1="1" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFD8B0" stopOpacity={0.45} />
              <Stop offset="100%" stopColor="#FFF4EE" stopOpacity={0.2} />
            </LinearGradient>
            <LinearGradient id="gSummer" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#C8B0F8" stopOpacity={0.35} />
              <Stop offset="100%" stopColor="#F4EEFF" stopOpacity={0.15} />
            </LinearGradient>
            <LinearGradient id="gAutumn" x1="1" y1="1" x2="0" y2="0">
              <Stop offset="0%" stopColor="#C89060" stopOpacity={0.35} />
              <Stop offset="100%" stopColor="#F5F0E2" stopOpacity={0.15} />
            </LinearGradient>
            <LinearGradient id="gWinter" x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0%" stopColor="#8090C0" stopOpacity={0.35} />
              <Stop offset="100%" stopColor="#E8EFF8" stopOpacity={0.15} />
            </LinearGradient>
          </Defs>

          {/* 사분면 배경색 */}
          <Rect x={cL} y={cT} width={cW / 2} height={cH / 2} fill="#FFF4EE" />
          <Rect x={mX} y={cT} width={cW / 2} height={cH / 2} fill="#F4EEFF" />
          <Rect x={cL} y={mY} width={cW / 2} height={cH / 2} fill="#F5F0E2" />
          <Rect x={mX} y={mY} width={cW / 2} height={cH / 2} fill="#E8EFF8" />

          {/* 그라데이션 오버레이 */}
          <Rect x={cL} y={cT} width={cW / 2} height={cH / 2} fill="url(#gSpring)" />
          <Rect x={mX} y={cT} width={cW / 2} height={cH / 2} fill="url(#gSummer)" />
          <Rect x={cL} y={mY} width={cW / 2} height={cH / 2} fill="url(#gAutumn)" />
          <Rect x={mX} y={mY} width={cW / 2} height={cH / 2} fill="url(#gWinter)" />

          {/* 외곽 테두리 */}
          <Rect x={cL} y={cT} width={cW} height={cH} fill="none" stroke="#D8D4CC" strokeWidth={0.6} />

          {/* 십자 축선 */}
          <Line x1={cL} y1={mY} x2={cR} y2={mY} stroke="#C0BAB4" strokeWidth={0.8} />
          <Line x1={mX} y1={cT} x2={mX} y2={cB} stroke="#C0BAB4" strokeWidth={0.8} />

          {/* 외광 */}
          <Circle cx={dotX} cy={dotY} r={14} fill="#FF3B30" opacity={0.19} />
          {/* 빨간 점 */}
          <Circle cx={dotX} cy={dotY} r={6} fill="#FF3B30" />
          {/* 흰 중심 */}
          <Circle cx={dotX} cy={dotY} r={2} fill="white" />
        </Svg>

        {/* 우측 축 라벨 — COOL (차가운 색조) */}
        <View style={{ width: 38, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: '#666', fontFamily: 'Pretendard', textAlign: 'center' }}>
            COOL
          </Text>
          <Text style={{ fontSize: 6.5, color: '#999', fontFamily: 'Pretendard', textAlign: 'center', marginTop: 1 }}>
            차가운 색조
          </Text>
        </View>
      </View>

      {/* 하단 축 라벨 — DEEP (깊은 명도) */}
      <View style={{ alignItems: 'center', marginTop: 5 }}>
        <Text style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: '#666', fontFamily: 'Pretendard', textAlign: 'center' }}>
          DEEP
        </Text>
        <Text style={{ fontSize: 6.5, color: '#999', fontFamily: 'Pretendard', textAlign: 'center', marginTop: 1 }}>
          깊은 명도
        </Text>
      </View>
    </View>
  );
}
