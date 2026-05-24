'use client';

import { Page, View, Text } from '@react-pdf/renderer';
import { S, Footer, PageHeader, SectionHead } from '@/components/pdf/pdfShared';
import { TYPE_EXTRA, hairHex, SEASON_TEXT_META } from '@/lib/pdf/typeExtra';
import type { PersonalColorType } from '@/types';

interface Props {
  colorType: PersonalColorType;
  accent: string;
  customerName: string;
}

export default function HairFashionSeasonPage({ colorType, accent, customerName }: Props) {
  const { hair, fashion, bestColors, seasonal } = TYPE_EXTRA[colorType];
  const name = customerName || '고객';
  const avoidList = hair.avoid.split(',').map((s) => s.trim()).slice(0, 4);

  const colorGroups = [
    { label: 'MAIN COLOR', val: fashion.main,   colors: bestColors.slice(0, 3) },
    { label: 'SUB COLOR',  val: fashion.sub,    colors: bestColors.slice(3, 6) },
    { label: 'ACCENT',     val: fashion.accent, colors: bestColors.slice(6, 8) },
  ];

  return (
    <Page size="A4" style={S.page}>
      <View wrap={false} style={{ flex: 1 }}>
        <PageHeader label="헤어 & 패션 & 시즌 스타일링" page={5} />

        {/* 09. 헤어 컬러 */}
        <SectionHead num="09" title={`${name}님께 어울리는 헤어 컬러`} accent={accent} />

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
          {hair.recommended.map(({ name: hName, desc }) => (
            <View key={hName} style={{
              flex: 1, backgroundColor: '#F5F2EC', borderRadius: 7, padding: 8, alignItems: 'center',
            }}>
              <View style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: hairHex(hName),
                borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid', marginBottom: 5,
              }} />
              <Text style={{ fontSize: 8, fontWeight: 700, color: '#2A2A2A', marginBottom: 2, textAlign: 'center' }}>{hName}</Text>
              <Text style={{ fontSize: 6.5, color: '#666', textAlign: 'center', lineHeight: 1.3 }}>{desc}</Text>
            </View>
          ))}
        </View>

        <View style={{
          backgroundColor: '#FFF5F5', borderRadius: 6, padding: 6,
          borderLeftWidth: 3, borderLeftColor: '#FF3B30', borderLeftStyle: 'solid',
          marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8,
        }}>
          <Text style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1, color: '#FF3B30', flexShrink: 0 }}>AVOID</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 }}>
            {avoidList.map((avoid, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: hairHex(avoid), borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid' }} />
                <Text style={{ fontSize: 7.5, color: '#555' }}>x {avoid}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={S.sectionDivider} />

        {/* 10. 패션 컬러 */}
        <SectionHead num="10" title={`${name}님의 패션 컬러`} accent={accent} />

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
          {colorGroups.map(({ label, val, colors }) => (
            <View key={label} style={{
              flex: 1, backgroundColor: '#F5F2EC', borderRadius: 8, padding: 9,
              borderTopWidth: 3, borderTopColor: accent, borderTopStyle: 'solid',
            }}>
              <Text style={{ fontSize: 6, fontWeight: 700, letterSpacing: 1.5, color: '#AAA', marginBottom: 3 }}>{label}</Text>
              <Text style={{ fontSize: 9, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.4, marginBottom: 7 }}>{val}</Text>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {colors.map(({ hex, name: cn }) => (
                  <View key={hex} style={{ alignItems: 'center' }}>
                    <View style={{ width: 17, height: 17, borderRadius: 8.5, backgroundColor: hex, borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid', marginBottom: 2 }} />
                    <Text style={{ fontSize: 5, color: '#888', textAlign: 'center', maxWidth: 24 }}>{cn}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={{
          backgroundColor: accent + '08', borderRadius: 6, padding: 7,
          borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid',
          marginBottom: 8,
        }}>
          <Text style={{ fontSize: 8.5, color: '#444', lineHeight: 1.5, fontFamily: 'Pretendard' }}>{fashion.tip}</Text>
        </View>

        <View style={S.sectionDivider} />

        {/* 11. 시즌별 스타일링 — 2×2 텍스트 전용 카드 */}
        <SectionHead num="11" title={`${name}님의 시즌별 스타일링`} accent={accent} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {SEASON_TEXT_META.map(({ key, color, label, labelKo }) => (
            <View key={key} style={{
              width: '48%',
              backgroundColor: color + '12',
              borderRadius: 7,
              borderTopWidth: 3, borderTopColor: color, borderTopStyle: 'solid',
              padding: 10,
            }}>
              <Text style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color, marginBottom: 2, fontFamily: 'Pretendard' }}>
                {label}
              </Text>
              <Text style={{ fontSize: 9, fontWeight: 700, color: '#2A2A2A', marginBottom: 5, fontFamily: 'Pretendard' }}>
                {labelKo}
              </Text>
              <Text style={{ fontSize: 9, color: '#444', lineHeight: 1.6, fontFamily: 'Pretendard' }}>
                {seasonal[key]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Footer page={5} accent={accent} />
    </Page>
  );
}
