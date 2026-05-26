'use client';

import { Page, View, Text } from '@react-pdf/renderer';
import { S, Footer, PageHeader, SectionHead } from '@/components/pdf/pdfShared';
import { ProductRecommendation } from '@/components/pdf/ProductRecommendation';
import { IconLabel } from '@/components/pdf/IconLabel';
import type { ReportData } from '@/types/report';

interface Props {
  data: ReportData;
  accent: string;
  customerName: string;
}

export default function MakeupPage({ data, accent, customerName }: Props) {
  const { makeup } = data;
  const name = customerName || '고객';
  const tips = makeup.tips ?? [];

  return (
    <Page size="A4" style={S.page}>
      <View wrap={false} style={{ flex: 1 }}>
        <PageHeader label="메이크업 추천" page={4} />

        {/* 06. 립스틱 */}
        <SectionHead num="06" title={`${name}님께 추천하는 립스틱`} accent={accent} />
        <View style={{ marginBottom: 4 }}>
          {makeup.lipstick && makeup.lipstick.length > 0 ? (
            makeup.lipstick.map((p, i) => (
              <ProductRecommendation key={p.id ?? i} product={p} accentColor={accent} />
            ))
          ) : (
            <Text style={{ fontSize: 8, color: '#AAA', padding: 8, fontFamily: 'Pretendard' }}>해당 톤에 맞는 추천 제품을 준비 중입니다.</Text>
          )}
        </View>

        <View style={S.sectionDivider} />

        {/* 07. 베이스: 파운데이션 + 아이섀도우 */}
        <Text style={{ fontSize: 9, fontWeight: 700, color: '#2A2A2A', marginBottom: 6, letterSpacing: 0.3 }}>07. 베이스 추천</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 7.5, fontWeight: 700, color: '#888', marginBottom: 5, letterSpacing: 0.5 }}>파운데이션</Text>
            {makeup.foundation && makeup.foundation.length > 0 ? (
              makeup.foundation.map((p, i) => (
                <ProductRecommendation key={p.id ?? i} product={p} accentColor={accent} />
              ))
            ) : (
              <Text style={{ fontSize: 8, color: '#AAA', padding: 8, fontFamily: 'Pretendard' }}>준비 중</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 7.5, fontWeight: 700, color: '#888', marginBottom: 5, letterSpacing: 0.5 }}>아이섀도우</Text>
            {makeup.eyeshadow && makeup.eyeshadow.length > 0 ? (
              makeup.eyeshadow.map((p, i) => (
                <ProductRecommendation key={p.id ?? i} product={p} accentColor={accent} />
              ))
            ) : (
              <Text style={{ fontSize: 8, color: '#AAA', padding: 8, fontFamily: 'Pretendard' }}>준비 중</Text>
            )}
          </View>
        </View>

        <View style={S.sectionDivider} />

        {/* 08. 포인트 메이크업: 블러셔 + 팁 */}
        <Text style={{ fontSize: 9, fontWeight: 700, color: '#2A2A2A', marginBottom: 6, letterSpacing: 0.3 }}>08. 포인트 메이크업</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 6 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 7.5, fontWeight: 700, color: '#888', marginBottom: 5, letterSpacing: 0.5 }}>블러셔</Text>
            {makeup.blusher && makeup.blusher.length > 0 ? (
              makeup.blusher.map((p, i) => (
                <ProductRecommendation key={p.id ?? i} product={p} accentColor={accent} />
              ))
            ) : (
              <Text style={{ fontSize: 8, color: '#AAA', padding: 8, fontFamily: 'Pretendard' }}>준비 중</Text>
            )}
          </View>
          <View style={{ flex: 1.3, backgroundColor: '#FBF8F0', borderRadius: 6, padding: 10, borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid' }}>
            <Text style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: accent, marginBottom: 6 }}>메이크업 팁</Text>
            {tips.slice(0, 4).map((tip, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 5, marginBottom: 4 }}>
                <Text style={{ fontSize: 8, color: accent, marginTop: 1 }}>-</Text>
                <Text style={{ flex: 1, fontSize: 8, color: '#444', lineHeight: 1.5 }}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 구매처 */}
        <View style={{ backgroundColor: '#F0F4F8', borderRadius: 6, padding: 9, marginBottom: 6 }}>
          <View style={{ marginBottom: 4 }}>
            <IconLabel icon="shop" label="어디서 구매하나요?" fontSize={8} />
          </View>
          <Text style={{ fontSize: 8.5, color: '#555', lineHeight: 1.6 }}>
            올리브영·시코르·세포라에서 대부분의 제품을 시연 후 구매 가능합니다. 온라인 구매 시 컬러랩에서 추천한 정확한 호수를 선택하세요.
          </Text>
        </View>

        <View style={{ borderTopWidth: 0.5, borderTopColor: '#DDD8CC', borderTopStyle: 'solid', paddingTop: 5 }}>
          <Text style={{ fontSize: 7, color: '#BBB', lineHeight: 1.5 }}>
            제품 추천은 일반적인 가이드이며, 실제 사용 시 매장 시연 후 구매를 권장합니다. 제품 정보는 2025년 5월 기준이며 변경될 수 있습니다.
          </Text>
        </View>
      </View>

      <Footer page={4} accent={accent} />
    </Page>
  );
}
