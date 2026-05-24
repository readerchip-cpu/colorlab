'use client';

import { Page, View, Text } from '@react-pdf/renderer';
import { S, Footer, PageHeader, SectionHead } from '@/components/pdf/pdfShared';
import { TYPE_EXTRA, CHART_POS } from '@/lib/pdf/typeExtra';
import { QuadrantChart } from '@/components/pdf/QuadrantChart';
import type { PersonalColorType } from '@/types';

interface Props {
  colorType: PersonalColorType;
  accent: string;
  customerName: string;
  photoImpression?: string;
  keyFinding?: string;
  keyInsight?: string;
}

export default function AnalysisPage({ colorType, accent, customerName, photoImpression, keyFinding, keyInsight }: Props) {
  const extra = TYPE_EXTRA[colorType];
  const { attributes } = extra;
  const [posX, posY] = CHART_POS[colorType];
  const warmCool  = Math.round((posX + 1) / 2 * 100);
  const lightDeep = Math.round((1 - posY) / 2 * 100);
  const name = customerName || '고객';

  const contrastLevel = attributes.contrast.includes('High') ? 3 : attributes.contrast.includes('Medium') ? 2 : 1;
  const contrastLabel = contrastLevel === 3 ? 'High' : contrastLevel === 2 ? 'Medium' : 'Low';
  const contrastDesc = contrastLevel === 1
    ? '비슷한 명도끼리 매칭이 자연스러움'
    : contrastLevel === 2
    ? '적당한 명도 차이로 세련된 스타일링 가능'
    : '강한 명도 차이로 선명한 스타일링 적합';
  const baseToneDesc = attributes.base.includes('Yellow')
    ? '옐로우 베이스의 따뜻한 피부 톤'
    : '핑크 베이스의 시원한 피부 톤';

  const attrCards = [
    { key: 'HUE',     label: '색상', val: attributes.hue },
    { key: 'VALUE',   label: '명도', val: attributes.value },
    { key: 'CHROMA',  label: '채도', val: attributes.chroma },
    { key: 'CLARITY', label: '청탁', val: attributes.clarity },
  ];

  return (
    <Page size="A4" style={S.page}>
      <View wrap={false} style={{ flex: 1 }}>
        <PageHeader label="타입 분석" page={2} />

        {/* 01. 첫인상 + 차트 */}
        <View style={{ flexDirection: 'row', gap: 14, marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <SectionHead num="01" title={`${name}님의 첫인상`} accent={accent} />
            <Text style={[S.body, { marginBottom: 7 }]}>
              {photoImpression || `${name}님은 ${attributes.base}을 가진 ${colorType} 타입으로, ${attributes.value} 명도와 ${attributes.chroma} 채도의 특성을 지니고 있습니다.`}
            </Text>
            {keyFinding ? (
              <View style={S.keyFindingBox}>
                <Text style={S.keyFindingLabel}>KEY FINDING</Text>
                <Text style={S.keyFindingText}>{keyFinding}</Text>
              </View>
            ) : null}
          </View>
          <View style={{ alignItems: 'center', paddingTop: 6 }}>
            <QuadrantChart warmCool={warmCool} lightDeep={lightDeep} size={160} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 7 }}>
              <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#FF3B30' }} />
              <Text style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: '#FF3B30', fontFamily: 'Pretendard' }}>YOUR POSITION</Text>
            </View>
            <Text style={{ fontSize: 8, color: '#666', textAlign: 'center', marginTop: 3, fontFamily: 'Pretendard' }}>
              Warm {warmCool}% · Light {100 - lightDeep}%
            </Text>
          </View>
        </View>

        <View style={S.sectionDivider} />

        {/* 02. 정밀 분석 */}
        <SectionHead num="02" title="정밀 분석" accent={accent} />

        {/* 색의 4속성 카드 */}
        <View style={{
          backgroundColor: '#FAFAFA', borderRadius: 7, marginBottom: 8,
          borderLeftWidth: 4, borderLeftColor: accent, borderLeftStyle: 'solid',
          padding: 12,
        }}>
          <Text style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1, color: accent, marginBottom: 8, fontFamily: 'Pretendard' }}>
            색의 4속성 (Four Attributes)
          </Text>
          <View style={{ flexDirection: 'row' }}>
            {attrCards.map(({ key, label, val }, i) => (
              <View key={key} style={{
                flex: 1, paddingHorizontal: 10,
                borderLeftWidth: i > 0 ? 0.5 : 0,
                borderLeftColor: '#E0DCCC', borderLeftStyle: 'solid',
              }}>
                <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.5, color: accent, fontFamily: 'Pretendard' }}>{key}</Text>
                <Text style={{ fontSize: 8.5, color: '#666', marginTop: 2, marginBottom: 5, fontFamily: 'Pretendard' }}>{label}</Text>
                <View style={{ height: 1, width: '60%', backgroundColor: accent + '4D', marginBottom: 6 }} />
                <Text style={{ fontSize: 13, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.3, fontFamily: 'Pretendard' }}>{val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 베이스 + 컨트라스트 카드 */}
        <View style={{
          backgroundColor: '#FAFAFA', borderRadius: 7, marginBottom: 8,
          borderLeftWidth: 4, borderLeftColor: accent, borderLeftStyle: 'solid',
          flexDirection: 'row',
        }}>
          <View style={{ flex: 1, padding: 12, borderRightWidth: 0.5, borderRightColor: '#E0DCCC', borderRightStyle: 'solid' }}>
            <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.5, color: accent, fontFamily: 'Pretendard' }}>BASE TONE</Text>
            <Text style={{ fontSize: 8.5, color: '#666', marginTop: 2, marginBottom: 5, fontFamily: 'Pretendard' }}>베이스 톤</Text>
            <View style={{ height: 1, width: '60%', backgroundColor: accent + '4D', marginBottom: 6 }} />
            <Text style={{ fontSize: 15, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.2, fontFamily: 'Pretendard' }}>{attributes.base}</Text>
            <Text style={{ fontSize: 8, color: '#666', marginTop: 5, lineHeight: 1.5, fontFamily: 'Pretendard' }}>{baseToneDesc}</Text>
          </View>
          <View style={{ flex: 1, padding: 12 }}>
            <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.5, color: accent, fontFamily: 'Pretendard' }}>CONTRAST</Text>
            <Text style={{ fontSize: 8.5, color: '#666', marginTop: 2, marginBottom: 5, fontFamily: 'Pretendard' }}>컨트라스트</Text>
            <View style={{ height: 1, width: '60%', backgroundColor: accent + '4D', marginBottom: 6 }} />
            <Text style={{ fontSize: 15, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.2, fontFamily: 'Pretendard' }}>{contrastLabel} Contrast</Text>
            <View style={{ flexDirection: 'row', gap: 4, marginTop: 7, marginBottom: 3 }}>
              {[1, 2, 3].map((lv) => (
                <View key={lv} style={{ flex: 1, height: 5, borderRadius: 2.5, backgroundColor: lv === contrastLevel ? accent : (lv < contrastLevel ? accent + '50' : '#E0DCCC') }} />
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              {['Low', 'Mid', 'High'].map((lbl, i) => (
                <Text key={lbl} style={{ fontSize: 6, fontFamily: 'Pretendard', color: (i + 1) === contrastLevel ? accent : '#BBB', fontWeight: (i + 1) === contrastLevel ? 700 : 400 }}>{lbl}</Text>
              ))}
            </View>
            <Text style={{ fontSize: 8, color: '#666', lineHeight: 1.4, fontFamily: 'Pretendard' }}>{contrastDesc}</Text>
          </View>
        </View>

        {/* KEY INSIGHT */}
        {keyInsight ? (
          <View style={{
            backgroundColor: accent + '0A',
            borderRadius: 7,
            borderLeftWidth: 4, borderLeftColor: accent, borderLeftStyle: 'solid',
            padding: 10, marginBottom: 8,
          }}>
            <Text style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1, color: accent, marginBottom: 5, fontFamily: 'Pretendard' }}>
              {name}님의 핵심 인사이트
            </Text>
            <Text style={{ fontSize: 9, color: '#444', lineHeight: 1.65, fontFamily: 'Pretendard' }}>
              {keyInsight}
            </Text>
          </View>
        ) : null}
      </View>

      <Footer page={2} accent={accent} />
    </Page>
  );
}
