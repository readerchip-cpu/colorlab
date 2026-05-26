'use client';

import { Page, View, Text } from '@react-pdf/renderer';
import { S, Footer, PageHeader, SectionHead } from '@/components/pdf/pdfShared';
import { CelebrityCard } from '@/components/pdf/CelebrityCard';
import type { ReportData } from '@/types/report';

interface Props {
  data: ReportData;
  accent: string;
  customerName: string;
}

export default function CelebrityAndAdvicePage({ data, accent, customerName }: Props) {
  const { celebrities, customAdvice, palette, fashion, hair } = data;
  const name = customerName || '고객';
  const sigColors = palette.best.slice(0, 3).map((c) => c.hex);
  const showAdvice = customAdvice?.isRelated === true;
  const hasCelebs = celebrities && celebrities.length > 0;

  return (
    <Page size="A4" style={S.page}>
      <View wrap={false} style={{ flex: 1 }}>
        <PageHeader label="셀러브리티 & 맞춤 답변" page={6} />

        <SectionHead num="12" title={`${name}님과 같은 톤의 셀러브리티`} accent={accent} />

        {hasCelebs ? (
          <View style={{ flexDirection: 'column', gap: 0, marginBottom: 6 }}>
            {celebrities!.map((celeb) => (
              <CelebrityCard
                key={celeb.name}
                name={celeb.name}
                profession={celeb.profession ?? ''}
                similarity={celeb.similarity ?? ''}
                iconicLook={celeb.iconicLook ?? ''}
                signatureColors={celeb.signatureColors ?? sigColors}
              />
            ))}
          </View>
        ) : (
          <View style={{
            backgroundColor: accent + '0A', borderRadius: 8,
            borderLeftWidth: 4, borderLeftColor: accent, borderLeftStyle: 'solid',
            padding: 14, marginBottom: 8,
          }}>
            <Text style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1, color: accent, marginBottom: 8, fontFamily: 'Pretendard' }}>
              {data.meta.typeNameKr} 타입의 대표 셀러브리티
            </Text>
            <Text style={{ fontSize: 9.5, color: '#444', lineHeight: 1.7, fontFamily: 'Pretendard' }}>
              {data.meta.typeNameKr} 타입은 {data.analysis.base}을 가진 {data.analysis.fourAttributes.value} 명도, {data.analysis.fourAttributes.chroma} 채도의 특성을 지닙니다.
              이 타입의 셀러브리티들은 자신의 자연스러운 색감을 살려 {fashion.main.slice(0, 2).join(', ')} 계열 컬러를 즐겨 활용합니다.
            </Text>
            <View style={{ height: 0.5, backgroundColor: accent + '30', marginVertical: 10 }} />
            <Text style={{ fontSize: 8.5, color: '#666', lineHeight: 1.6, fontFamily: 'Pretendard' }}>
              메인 컬러: {fashion.main.join(', ')}
            </Text>
            <Text style={{ fontSize: 8.5, color: '#666', lineHeight: 1.6, fontFamily: 'Pretendard' }}>
              서브 컬러: {fashion.sub.join(', ')}
            </Text>
            <Text style={{ fontSize: 8.5, color: '#666', lineHeight: 1.6, fontFamily: 'Pretendard' }}>
              포인트 컬러: {fashion.accent.join(', ')}
            </Text>
          </View>
        )}

        <View style={S.sectionDivider} />

        {showAdvice ? (
          <>
            <SectionHead num="13" title={`${name}님의 고민에 대한 답변`} accent={accent} />
            <View style={S.adviceBox}>
              <Text style={S.adviceLabel}>AI 맞춤 조언</Text>
              <Text style={S.adviceText}>{customAdvice!.answer}</Text>
            </View>
          </>
        ) : (
          <View style={{
            backgroundColor: accent + '08', borderRadius: 10, padding: 14,
            borderLeftWidth: 4, borderLeftColor: accent, borderLeftStyle: 'solid',
          }}>
            <Text style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1, color: accent, marginBottom: 9, fontFamily: 'Pretendard' }}>
              {name}님을 위한 컬러랩 스타일링 가이드
            </Text>
            {[
              fashion.tips?.[0] ?? `${fashion.main.slice(0, 2).join(', ')} 계열 컬러로 자연스러운 스타일링을 완성하세요.`,
              `메인 컬러 ${fashion.main.slice(0, 2).join(', ')} 계열을 베이스로 코디를 시작하세요.`,
              `${fashion.sub.slice(0, 2).join(', ')} 컬러로 레이어링하면 자연스러운 조합이 완성됩니다.`,
              `포인트 컬러 ${fashion.accent[0] ?? ''} 를 액세서리나 백으로 활용해보세요.`,
              data.analysis.base.includes('Yellow')
                ? '금 소재 액세서리(골드·브라스)가 피부 톤과 가장 잘 어울립니다.'
                : '실버·화이트 골드 소재 액세서리가 쿨한 피부 톤을 돋보이게 합니다.',
              hair.recommended[0]?.name
                ? `헤어는 ${hair.recommended[0].name} 계열을 1순위로 추천드려요.`
                : '',
            ].filter(Boolean).map((tip, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 8, marginBottom: 7 }}>
                <View style={{ width: 17, height: 17, borderRadius: 8.5, backgroundColor: accent, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Text style={{ fontSize: 8, fontWeight: 700, color: '#fff', fontFamily: 'Pretendard' }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 9.5, color: '#444', lineHeight: 1.6, fontFamily: 'Pretendard' }}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ marginTop: 10, padding: 7, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E5E5E5', borderTopStyle: 'solid' }}>
          <Text style={{ fontSize: 7, color: '#888', textAlign: 'center', lineHeight: 1.4 }}>
            셀러브리티 추천은 공개된 정보를 기반으로 한 분석가의 의견이며, 해당 인물의 공식 입장과 무관합니다.
          </Text>
        </View>
      </View>

      {/* Final footer with copyright */}
      <View style={[S.footer, { flexDirection: 'column', alignItems: 'flex-start' }]}>
        <View style={{ borderTopWidth: 0.5, borderTopColor: '#DDD8CC', borderTopStyle: 'solid', width: '100%', paddingTop: 5 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={S.footerText}>colorlab.kr  ·  본 리포트는 AI 분석에 기반한 참고용 자료입니다</Text>
            <Text style={[S.footerPage, { color: accent }]}>6 / 6</Text>
          </View>
          <Text style={[S.footerText, { marginTop: 2 }]}>Powered by COLORLAB AI  ·  © 2025 컬러랩</Text>
        </View>
      </View>
    </Page>
  );
}
