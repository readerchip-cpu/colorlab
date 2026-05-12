'use client';

import {
  Svg, Rect, Line, Circle, Text,
} from '@react-pdf/renderer';

interface QuadrantChartProps {
  /** 0 = 매우 Cool (오른쪽), 100 = 매우 Warm (왼쪽) */
  warmCool: number;
  /** 0 = 매우 Light (위), 100 = 매우 Deep (아래) */
  lightDeep: number;
  size?: number;
}

export function QuadrantChart({ warmCool, lightDeep, size = 240 }: QuadrantChartProps) {
  const PAD = 36;             // axis label margin
  const cL  = PAD;            // chart left
  const cR  = size - PAD;     // chart right
  const cT  = PAD;            // chart top
  const cB  = size - PAD;     // chart bottom
  const cW  = cR - cL;        // chart width
  const cH  = cB - cT;        // chart height
  const mX  = cL + cW / 2;   // horizontal axis center
  const mY  = cT + cH / 2;   // vertical axis center

  // Warm = LEFT (small x), Cool = RIGHT (large x)
  const dotX = cL + (1 - warmCool / 100) * cW;
  // Light = TOP (small y), Deep = BOTTOM (large y)
  const dotY = cT + (lightDeep / 100) * cH;

  // Flip "YOUR POSITION" label if dot is on the right half
  const flipLabel = dotX > mX;
  const labelX    = flipLabel ? dotX - 14 : dotX + 14;
  const labelAnchor = flipLabel ? 'end' : 'start';

  return (
    <Svg width={size} height={size}>
      {/* ── Quadrant backgrounds ── */}
      {/* SPRING — Warm + Light (top-left) */}
      <Rect x={cL} y={cT} width={cW / 2} height={cH / 2} fill="#FFF4EE" />
      {/* SUMMER — Cool + Light (top-right) */}
      <Rect x={mX} y={cT} width={cW / 2} height={cH / 2} fill="#F4EEFF" />
      {/* AUTUMN — Warm + Deep (bottom-left) */}
      <Rect x={cL} y={mY} width={cW / 2} height={cH / 2} fill="#F5F0E2" />
      {/* WINTER — Cool + Deep (bottom-right) */}
      <Rect x={mX} y={mY} width={cW / 2} height={cH / 2} fill="#E8EFF8" />

      {/* ── Chart border ── */}
      <Rect
        x={cL} y={cT} width={cW} height={cH}
        fill="none" stroke="#D8D4CC" strokeWidth={0.6}
      />

      {/* ── Axes ── */}
      <Line x1={cL} y1={mY} x2={cR} y2={mY} stroke="#C0BAB4" strokeWidth={0.8} />
      <Line x1={mX} y1={cT} x2={mX} y2={cB} stroke="#C0BAB4" strokeWidth={0.8} />

      {/* ── Season labels (inside quadrants) ── */}
      <Text x={cL + 7} y={cT + 15} fontSize={8} fontWeight={700} fill="#C8784A">SPRING</Text>
      <Text x={mX + 7} y={cT + 15} fontSize={8} fontWeight={700} fill="#9068C0">SUMMER</Text>
      <Text x={cL + 7} y={mY + 15} fontSize={8} fontWeight={700} fill="#8A7A58">AUTUMN</Text>
      <Text x={mX + 7} y={mY + 15} fontSize={8} fontWeight={700} fill="#5A789A">WINTER</Text>

      {/* ── Horizontal axis labels: Warm ↔ Cool ── */}
      <Text x={cL + 3} y={mY - 5}  fontSize={9} fill="#AAA">Warm</Text>
      <Text x={cR - 3} y={mY - 5}  fontSize={9} fill="#AAA" textAnchor="end">Cool</Text>

      {/* ── Vertical axis labels: Light ↔ Deep ── */}
      <Text x={mX} y={cT - 7}  fontSize={9} fill="#AAA" textAnchor="middle">Light</Text>
      <Text x={mX} y={cB + 17} fontSize={9} fill="#AAA" textAnchor="middle">Deep</Text>

      {/* ── User position dot ── */}
      {/* White halo */}
      <Circle cx={dotX} cy={dotY} r={11} fill="white" />
      {/* Red fill */}
      <Circle cx={dotX} cy={dotY} r={9}  fill="#E53E3E" />
      {/* Inner white dot */}
      <Circle cx={dotX} cy={dotY} r={3}  fill="white" />

      {/* ── YOUR POSITION label ── */}
      <Text
        x={labelX}
        y={dotY - 4}
        fontSize={7}
        fontWeight={700}
        fill="#E53E3E"
        textAnchor={labelAnchor}
      >
        YOUR POSITION
      </Text>
    </Svg>
  );
}
