'use client';

import { Page, View, Text } from '@react-pdf/renderer';
import { S, Footer, PageHeader, SectionHead } from '@/components/pdf/pdfShared';
import { TYPE_EXTRA } from '@/lib/pdf/typeExtra';
import type { PersonalColorType } from '@/types';

function getMood(colorName: string): string {
  if (colorName.includes('핑크') || colorName.includes('분홍')) return '청순';
  if (colorName.includes('코랄') || colorName.includes('살몬')) return '화사';
  if (colorName.includes('오렌지')) return '활기';
  if (colorName.includes('옐로') || colorName.includes('레몬') || colorName.includes('버터')) return '밝음';
  if (colorName.includes('민트') || colorName.includes('그린')) return '산뜻';
  if (colorName.includes('블루') || colorName.includes('스카이') || colorName.includes('파우더')) return '시원';
  if (colorName.includes('라벤더') || colorName.includes('라일락') || colorName.includes('퍼플') || colorName.includes('바이올렛')) return '신비';
  if (colorName.includes('모브') || colorName.includes('로즈')) return '로맨틱';
  if (colorName.includes('터키즈') || colorName.includes('틸')) return '생동';
  if (colorName.includes('그레이') || colorName.includes('차콜') || colorName.includes('슬레이트')) return '세련';
  if (colorName.includes('버건디') || colorName.includes('레드') || colorName.includes('브릭')) return '강렬';
  if (colorName.includes('골드') || colorName.includes('샴페인') || colorName.includes('카멜')) return '우아';
  if (colorName.includes('화이트') || colorName.includes('아이보리') || colorName.includes('크림') || colorName.includes('밀키')) return '청결';
  if (colorName.includes('베이지') || colorName.includes('브라운') || colorName.includes('토프')) return '따뜻';
  if (colorName.includes('블랙')) return '카리스마';
  return '매력';
}

interface Props {
  colorType: PersonalColorType;
  accent: string;
  customerName: string;
}

export default function ColorPalettePage({ colorType, accent, customerName }: Props) {
  const { bestColors, worstColors, fashion, attributes } = TYPE_EXTRA[colorType];
  const name = customerName || '고객';
  const contrastLevel = attributes.contrast.includes('High') ? 3 : attributes.contrast.includes('Medium') ? 2 : 1;

  const combinations = [
    {
      type: '모노톤', typeEn: 'Mono Tone',
      description: '같은 색상 계열로 안정적인 통일감을 만들어요',
      colors: bestColors.slice(0, 3),
    },
    {
      type: '톤온톤', typeEn: 'Tone on Tone',
      description: '같은 명도의 다른 색상으로 부드러운 조화를 연출해요',
      colors: [bestColors[0], bestColors[3], bestColors[5]],
    },
    {
      type: '포인트', typeEn: 'Accent Color',
      description: `${fashion.accent} 포인트 컬러로 생기 있는 스타일링을 완성해요`,
      colors: [bestColors[1], bestColors[4], bestColors[7]],
    },
  ];

  const stylingNotes = [
    fashion.tip,
    attributes.base.includes('Yellow')
      ? '골드 액세서리가 실버보다 자연스럽게 어우러져요.'
      : '실버 액세서리가 쿨하고 세련된 느낌을 더해줘요.',
    contrastLevel === 1
      ? '비슷한 명도끼리 매칭이 자연스럽고 조화로워요.'
      : contrastLevel === 2
      ? '적절한 명도 차이 레이어드 코디가 세련되어 보여요.'
      : '과감한 명도 대비 코디가 특히 잘 어울려요.',
    attributes.chroma.includes('Soft') || attributes.chroma.includes('Muted')
      ? '원색보다 파스텔·뮤트 톤이 자연스러운 매력을 살려줘요.'
      : '선명한 컬러가 생기와 에너지를 극대화해줘요.',
    `${fashion.main} 계열을 베이스로, ${fashion.sub} 컬러를 레이어드하면 가장 자연스러운 코디가 완성돼요.`,
  ];

  return (
    <Page size="A4" style={S.page}>
      <View wrap={false} style={{ flex: 1 }}>
        <PageHeader label="컬러 팔레트" page={3} />

        {/* 03. Best Colors */}
        <View style={[S.sectionBlock, { borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid', paddingLeft: 10, marginBottom: 8 }]}>
          <Text style={S.sectionNum}>03</Text>
          <Text style={S.sectionTitle}>{name}님께 어울리는 컬러</Text>
          <Text style={{ fontSize: 9, color: '#AAA', marginTop: 2, fontFamily: 'Pretendard' }}>Best Colors · {fashion.main}</Text>
        </View>

        {/* Best Colors Grid 4×2 */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 7 }}>
          {bestColors.map(({ hex, name: cName }, i) => (
            <View key={hex} style={{
              width: '23%', alignItems: 'center',
              backgroundColor: '#FAFAFA', borderRadius: 8, padding: 7,
            }}>
              <View style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: hex,
                borderWidth: 0.5, borderColor: '#E0DCCC', borderStyle: 'solid',
                marginBottom: 5,
              }} />
              <Text style={{ fontSize: 9, fontWeight: 700, color: '#2A2A2A', textAlign: 'center', marginBottom: 2, fontFamily: 'Pretendard' }}>{cName}</Text>
              <Text style={{ fontSize: 6.5, color: '#BBB', textAlign: 'center', marginBottom: 4, fontFamily: 'Pretendard' }}>{hex}</Text>
              <View style={{ flexDirection: 'row', gap: 2, marginBottom: 4 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <View key={s} style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: s <= (i < 4 ? 5 : 4) ? accent : '#E0DCCC' }} />
                ))}
              </View>
              <View style={{ backgroundColor: accent + '18', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ fontSize: 6.5, color: accent, fontFamily: 'Pretendard', textAlign: 'center' }}>{getMood(cName)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={S.sectionDivider} />

        {/* 04. 피해야 할 컬러 */}
        <View style={{
          backgroundColor: '#FFF5F5', borderRadius: 8,
          borderLeftWidth: 4, borderLeftColor: '#FF3B30', borderLeftStyle: 'solid',
          padding: 9, marginBottom: 8,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 7 }}>
            <View style={{ width: 15, height: 15, borderRadius: 7.5, backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 8, fontWeight: 700, color: '#fff', lineHeight: 1 }}>!</Text>
            </View>
            <Text style={{ fontSize: 10.5, fontWeight: 700, color: '#FF3B30', fontFamily: 'Pretendard' }}>04. 피해야 할 컬러</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {worstColors.map(({ hex, name: cName }) => (
              <View key={hex} style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 6 }}>
                <View style={{
                  width: 36, height: 36, borderRadius: 18,
                  backgroundColor: hex, opacity: 0.4,
                  borderWidth: 2, borderColor: '#999', borderStyle: 'dashed',
                  marginBottom: 5,
                }} />
                <Text style={{ fontSize: 8, fontWeight: 700, color: '#2A2A2A', textAlign: 'center', marginBottom: 1, fontFamily: 'Pretendard' }}>{cName}</Text>
                <Text style={{ fontSize: 6.5, color: '#888', textAlign: 'center', lineHeight: 1.4, fontFamily: 'Pretendard' }}>피부 톤을 칙칙하게</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={S.sectionDivider} />

        {/* 05. 컬러 조합 가이드 */}
        <View style={{ marginBottom: 8 }}>
          <View style={{ marginBottom: 7 }}>
            <Text style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1, color: '#AAA', fontFamily: 'Pretendard' }}>05. COLOR COMBINATION GUIDE</Text>
            <Text style={{ fontSize: 11, fontWeight: 700, color: '#2A2A2A', marginTop: 2, fontFamily: 'Pretendard' }}>{name}님을 위한 컬러 조합 가이드</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {combinations.map(({ type, typeEn, description, colors }) => (
              <View key={type} style={{
                flex: 1, backgroundColor: '#FAFAFA', borderRadius: 8, padding: 9,
                borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid',
              }}>
                <Text style={{ fontSize: 6, fontWeight: 700, letterSpacing: 0.5, color: accent, marginBottom: 2, fontFamily: 'Pretendard' }}>{typeEn}</Text>
                <Text style={{ fontSize: 9, fontWeight: 700, color: '#2A2A2A', marginBottom: 5, fontFamily: 'Pretendard' }}>{type}</Text>
                <View style={{ flexDirection: 'row', gap: 5, marginBottom: 6 }}>
                  {colors.map(c => (
                    <View key={c.hex} style={{ alignItems: 'center' }}>
                      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: c.hex, borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid', marginBottom: 3 }} />
                      <Text style={{ fontSize: 5.5, color: '#888', textAlign: 'center', maxWidth: 28, fontFamily: 'Pretendard' }}>{c.name}</Text>
                    </View>
                  ))}
                </View>
                <Text style={{ fontSize: 7.5, color: '#555', lineHeight: 1.5, fontFamily: 'Pretendard' }}>{description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 06. 스타일링 노트 */}
        <View style={{
          backgroundColor: accent + '08',
          borderRadius: 8,
          borderLeftWidth: 4, borderLeftColor: accent, borderLeftStyle: 'solid',
          padding: 10,
        }}>
          <Text style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1, color: accent, marginBottom: 7, fontFamily: 'Pretendard' }}>
            06. {name}님을 위한 스타일링 노트
          </Text>
          {stylingNotes.map((note, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 7, marginBottom: 4 }}>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: accent, marginTop: 3, flexShrink: 0 }} />
              <Text style={{ flex: 1, fontSize: 9, color: '#444', lineHeight: 1.6, fontFamily: 'Pretendard' }}>{note}</Text>
            </View>
          ))}
        </View>
      </View>

      <Footer page={3} accent={accent} />
    </Page>
  );
}
