'use client';

import { Page, View, Text } from '@react-pdf/renderer';
import { S, Footer, PageHeader, SectionHead } from '@/components/pdf/pdfShared';
import { hairHex, SEASON_TEXT_META } from '@/lib/pdf/typeExtra';
import type { ReportData } from '@/types/report';

interface Props {
  data: ReportData;
  accent: string;
  customerName: string;
}

export default function HairFashionSeasonPage({ data, accent, customerName }: Props) {
  const { hair, fashion, palette, seasonalStyling } = data;
  const name = customerName || '고객';
  const bestColors = palette.best;
  const avoidList = (hair.avoid ?? []).slice(0, 4);

  const colorGroups = [
    { label: 'MAIN COLOR', val: fashion.main.slice(0, 3).join(' / '),   colors: bestColors.slice(0, 3) },
    { label: 'SUB COLOR',  val: fashion.sub.slice(0, 3).join(' / '),    colors: bestColors.slice(3, 6) },
    { label: 'ACCENT',     val: fashion.accent.slice(0, 2).join(' / '), colors: bestColors.slice(6, 8) },
  ];

  return (
    <Page size="A4" style={S.page}>
      <View wrap={false} style={{ flex: 1 }}>
        <PageHeader label="헤어 & 패션 & 시즌 스타일링" page={5} />

        {/* 09. 헤어 컬러 */}
        <SectionHead num="09" title={`${name}님께 어울리는 헤어 컬러`} accent={accent} />

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
          {hair.recommended.map(({ name: hName, description }) => (
            <View key={hName} style={{
              flex: 1, backgroundColor: '#F5F2EC', borderRadius: 7, padding: 8, alignItems: 'center',
            }}>
              <View style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: hairHex(hName),
                borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid', marginBottom: 5,
              }} />
              <Text style={{ fontSize: 8, fontWeight: 700, color: '#2A2A2A', marginBottom: 2, textAlign: 'center' }}>{hName}</Text>
              <Text style={{ fontSize: 6.5, color: '#666', textAlign: 'center', lineHeight: 1.3 }}>{description}</Text>
            </View>
          ))}
        </View>

        {avoidList.length > 0 && (
          <View style={{
            backgroundColor: '#FFF5F5', borderRadius: 6, padding: 6,
            borderLeftWidth: 3, borderLeftColor: '#FF3B30', borderLeftStyle: 'solid',
            marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8,
          }}>
            <Text style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1, color: '#FF3B30', flexShrink: 0 }}>AVOID</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 }}>
              {avoidList.map((avoid, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: hairHex(avoid.name), borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid' }} />
                  <Text style={{ fontSize: 7.5, color: '#555' }}>x {avoid.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

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

        {fashion.tips && fashion.tips.length > 0 && (
          <View style={{
            backgroundColor: accent + '08', borderRadius: 6, padding: 7,
            borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid',
            marginBottom: 8,
          }}>
            <Text style={{ fontSize: 8.5, color: '#444', lineHeight: 1.5, fontFamily: 'Pretendard' }}>{fashion.tips[0]}</Text>
          </View>
        )}

        <View style={S.sectionDivider} />

        {/* 11. 시즌별 스타일링 — 2×2 카드 */}
        <SectionHead num="11" title={`${name}님의 시즌별 스타일링`} accent={accent} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {SEASON_TEXT_META.map(({ key, color, label, labelKo }) => {
            const seasonKey = (key === 'autumn' ? 'fall' : key) as keyof typeof seasonalStyling;
            const season = seasonalStyling[seasonKey];
            return (
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
                <Text style={{ fontSize: 9, fontWeight: 700, color: '#2A2A2A', marginBottom: 3, fontFamily: 'Pretendard' }}>
                  {labelKo}
                </Text>
                {season?.title ? (
                  <Text style={{ fontSize: 8, fontWeight: 700, color: '#444', marginBottom: 3, fontFamily: 'Pretendard' }}>
                    {season.title}
                  </Text>
                ) : null}
                <Text style={{ fontSize: 8.5, color: '#555', lineHeight: 1.6, fontFamily: 'Pretendard' }}>
                  {season?.description ?? ''}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <Footer page={5} accent={accent} />
    </Page>
  );
}
