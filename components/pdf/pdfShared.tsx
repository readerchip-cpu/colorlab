'use client';

import '@/lib/pdf/font';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';

export const TOTAL = 6;
export const PAD_H = 25;
export const PAD_V = 25;

export const S = StyleSheet.create({
  page: {
    fontFamily: 'Pretendard',
    backgroundColor: '#FBF9F4',
    paddingHorizontal: PAD_H,
    paddingTop: PAD_V,
    paddingBottom: 24,
    position: 'relative',
  },
  pageHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10, paddingBottom: 7,
    borderBottomWidth: 0.5, borderBottomColor: '#DDD8CC', borderBottomStyle: 'solid',
  },
  pageHeaderLeft: { fontSize: 7, color: '#AAA', letterSpacing: 1 },
  pageHeaderRight: { fontSize: 7, color: '#AAA' },
  sectionBlock: { marginBottom: 10 },
  sectionNum: { fontSize: 7.5, fontWeight: 700, letterSpacing: 2, color: '#BBB', marginBottom: 2 },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.3 },
  sectionDivider: { height: 0.5, backgroundColor: '#DDD8CC', marginVertical: 8 },
  subTitle: { fontSize: 11, fontWeight: 700, color: '#2A2A2A', marginBottom: 5 },
  body: { fontSize: 10, color: '#444', lineHeight: 1.65 },
  bodySmall: { fontSize: 8.5, color: '#555', lineHeight: 1.65 },
  caption: { fontSize: 8, color: '#999', lineHeight: 1.5 },
  coverMeta: { fontSize: 7, color: '#AAA', letterSpacing: 0.5, textAlign: 'right', lineHeight: 1.7 },
  coverNameLine: { fontSize: 22, fontWeight: 700, color: '#2A2A2A', letterSpacing: -0.5, marginBottom: 4 },
  coverTypeEn: { fontSize: 38, fontWeight: 700, color: '#2A2A2A', letterSpacing: -1, lineHeight: 1, marginBottom: 8 },
  coverTypeKo: { fontSize: 18, fontWeight: 400, color: '#666', marginBottom: 6 },
  coverDisplayName: { fontSize: 11, color: '#999', marginBottom: 16 },
  chip: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 0.5, borderColor: '#E0DCCC', borderStyle: 'solid',
  },
  chipName: { fontSize: 7.5, color: '#555', marginTop: 3, textAlign: 'center', maxWidth: 60 },
  chipHex: { fontSize: 6, color: '#AAA', textAlign: 'center' },
  keyFindingBox: {
    backgroundColor: '#F0ECF8', borderRadius: 6,
    borderLeftWidth: 3, borderLeftColor: '#7C3AED', borderLeftStyle: 'solid',
    padding: 8, marginTop: 5,
  },
  keyFindingLabel: { fontSize: 6.5, fontWeight: 700, letterSpacing: 1.2, color: '#7C3AED', marginBottom: 3 },
  keyFindingText: { fontSize: 9.5, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.5 },
  footer: {
    position: 'absolute', bottom: 12, left: PAD_H, right: PAD_H,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 0.5, borderTopColor: '#DDD8CC', borderTopStyle: 'solid',
    paddingTop: 5,
  },
  footerText: { fontSize: 7, color: '#BBB' },
  footerPage: { fontSize: 7.5, fontWeight: 700, color: '#CCC' },
  adviceBox: { backgroundColor: '#F8F5FC', borderRadius: 6, padding: 10 },
  adviceLabel: { fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: '#7C3AED', marginBottom: 6 },
  adviceText: { fontSize: 10, color: '#333', lineHeight: 1.6 },
});

export function PageHeader({ label, page }: { label: string; page: number }) {
  return (
    <View style={S.pageHeader}>
      <Text style={S.pageHeaderLeft}>COLORLAB · {label}</Text>
      <Text style={S.pageHeaderRight}>{page} / {TOTAL}</Text>
    </View>
  );
}

export function Footer({ page, accent }: { page: number; accent: string }) {
  return (
    <View style={S.footer}>
      <Text style={S.footerText}>colorlab.kr  ·  본 리포트는 AI 분석에 기반한 참고용 자료입니다</Text>
      <Text style={[S.footerPage, { color: accent }]}>{page} / {TOTAL}</Text>
    </View>
  );
}

export function SectionHead({ num, title, accent }: { num: string; title: string; accent: string }) {
  return (
    <View style={[S.sectionBlock, { borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid', paddingLeft: 10 }]}>
      <Text style={S.sectionNum}>{num}</Text>
      <Text style={S.sectionTitle}>{title}</Text>
    </View>
  );
}

// Re-export Page for page component files
export { Page };
