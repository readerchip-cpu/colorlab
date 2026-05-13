'use client';

import {
  Svg, Rect, Line, Circle, Text, Defs, LinearGradient, Stop,
} from '@react-pdf/renderer';

interface QuadrantChartProps {
  /** 0 = 매우 Cool (오른쪽), 100 = 매우 Warm (왼쪽) */
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

  const flipLabel = dotX > mX;
  const labelX    = flipLabel ? dotX - 14 : dotX + 14;
  const labelAnchor = flipLabel ? 'end' : 'start';

  return (
    <Svg width={size} height={size}>
      <Defs>
        {/* Spring: warm+light → top-left, gradient from orange-tint to base */}
        <LinearGradient id="gSpring" x1="1" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFD8B0" stopOpacity={0.45} />
          <Stop offset="100%" stopColor="#FFF4EE" stopOpacity={0.2} />
        </LinearGradient>
        {/* Summer: cool+light → top-right */}
        <LinearGradient id="gSummer" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#C8B0F8" stopOpacity={0.35} />
          <Stop offset="100%" stopColor="#F4EEFF" stopOpacity={0.15} />
        </LinearGradient>
        {/* Autumn: warm+deep → bottom-left */}
        <LinearGradient id="gAutumn" x1="1" y1="1" x2="0" y2="0">
          <Stop offset="0%" stopColor="#C89060" stopOpacity={0.35} />
          <Stop offset="100%" stopColor="#F5F0E2" stopOpacity={0.15} />
        </LinearGradient>
        {/* Winter: cool+deep → bottom-right */}
        <LinearGradient id="gWinter" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0%" stopColor="#8090C0" stopOpacity={0.35} />
          <Stop offset="100%" stopColor="#E8EFF8" stopOpacity={0.15} />
        </LinearGradient>
      </Defs>

      {/* ── Quadrant base colors ── */}
      <Rect x={cL} y={cT} width={cW / 2} height={cH / 2} fill="#FFF4EE" />
      <Rect x={mX} y={cT} width={cW / 2} height={cH / 2} fill="#F4EEFF" />
      <Rect x={cL} y={mY} width={cW / 2} height={cH / 2} fill="#F5F0E2" />
      <Rect x={mX} y={mY} width={cW / 2} height={cH / 2} fill="#E8EFF8" />

      {/* ── Gradient overlays ── */}
      <Rect x={cL} y={cT} width={cW / 2} height={cH / 2} fill="url(#gSpring)" />
      <Rect x={mX} y={cT} width={cW / 2} height={cH / 2} fill="url(#gSummer)" />
      <Rect x={cL} y={mY} width={cW / 2} height={cH / 2} fill="url(#gAutumn)" />
      <Rect x={mX} y={mY} width={cW / 2} height={cH / 2} fill="url(#gWinter)" />

      {/* ── Chart border ── */}
      <Rect x={cL} y={cT} width={cW} height={cH} fill="none" stroke="#D8D4CC" strokeWidth={0.6} />

      {/* ── Axes ── */}
      <Line x1={cL} y1={mY} x2={cR} y2={mY} stroke="#C0BAB4" strokeWidth={0.8} />
      <Line x1={mX} y1={cT} x2={mX} y2={cB} stroke="#C0BAB4" strokeWidth={0.8} />

      {/* ── Season labels ── */}
      <Text x={cL + 7} y={cT + 15} fontSize={8} fontWeight={700} fill="#C8784A">SPRING</Text>
      <Text x={mX + 7} y={cT + 15} fontSize={8} fontWeight={700} fill="#9068C0">SUMMER</Text>
      <Text x={cL + 7} y={mY + 15} fontSize={8} fontWeight={700} fill="#8A7A58">AUTUMN</Text>
      <Text x={mX + 7} y={mY + 15} fontSize={8} fontWeight={700} fill="#5A789A">WINTER</Text>

      {/* ── Axis labels ── */}
      <Text x={cL + 3} y={mY - 5}  fontSize={9} fill="#AAA">Warm</Text>
      <Text x={cR - 3} y={mY - 5}  fontSize={9} fill="#AAA" textAnchor="end">Cool</Text>
      <Text x={mX} y={cT - 7}  fontSize={9} fill="#AAA" textAnchor="middle">Light</Text>
      <Text x={mX} y={cB + 17} fontSize={9} fill="#AAA" textAnchor="middle">Deep</Text>

      {/* ── Pulse rings (static emphasis) ── */}
      <Circle cx={dotX} cy={dotY} r={22} fill="#E53E3E" opacity={0.06} />
      <Circle cx={dotX} cy={dotY} r={17} fill="#E53E3E" opacity={0.1} />
      <Circle cx={dotX} cy={dotY} r={13} fill="#E53E3E" opacity={0.14} />

      {/* ── User position dot ── */}
      <Circle cx={dotX} cy={dotY} r={11} fill="white" />
      <Circle cx={dotX} cy={dotY} r={9}  fill="#E53E3E" />
      <Circle cx={dotX} cy={dotY} r={3}  fill="white" />

      {/* ── Label ── */}
      <Text
        x={labelX} y={dotY - 4}
        fontSize={7} fontWeight={700}
        fill="#E53E3E" textAnchor={labelAnchor}
      >
        YOUR POSITION
      </Text>
    </Svg>
  );
}
