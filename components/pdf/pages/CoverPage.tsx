'use client';

import { Page, View, Text } from '@react-pdf/renderer';
import { S, PAD_H, Footer } from '@/components/pdf/pdfShared';
import { ColorChip } from '@/components/pdf/ColorChip';
import type { ReportData } from '@/types/report';

interface Props {
  data: ReportData;
  sessionId: string;
  createdAt: string;
  accent: string;
  customerName: string;
}

export default function CoverPage({ data, sessionId, createdAt, accent, customerName }: Props) {
  const name = customerName || '고객';
  const { personalIntro, palette, meta } = data;
  const coverColors = palette.best.slice(0, 3);

  return (
    <Page size="A4" style={S.page}>
      <View wrap={false} style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: accent }} />
            <Text style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#2A2A2A' }}>COLORLAB</Text>
          </View>
          <View>
            <Text style={S.coverMeta}>Report ID: {sessionId.slice(0, 8).toUpperCase()}</Text>
            <Text style={S.coverMeta}>Date: {createdAt}</Text>
          </View>
        </View>

        <Text style={[S.coverNameLine, { fontSize: 28, color: accent }]}>{name}님의</Text>
        <Text style={S.coverTypeEn}>{meta.typeName}</Text>
        <Text style={S.coverTypeKo}>{meta.typeNameKr}</Text>
        <Text style={S.coverDisplayName}>{meta.typeNameKr}</Text>

        <View style={{ flexDirection: 'row', gap: 14, marginBottom: 22 }}>
          {coverColors.map(({ hex, name: cName }) => (
            <ColorChip key={hex} hex={hex} name={cName} size="large" showHex={false} />
          ))}
        </View>

        {/* PERSONAL MESSAGE */}
        <View style={{ backgroundColor: '#F5F2EC', borderRadius: 8, padding: 16, marginBottom: 14, alignItems: 'center' }}>
          <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.5, color: '#AAA', marginBottom: 10, textAlign: 'center' }}>
            PERSONAL MESSAGE
          </Text>

          {personalIntro.greeting ? (
            <Text style={{ fontSize: 12.5, fontWeight: 300, color: '#2A2A2A', lineHeight: 1.7, letterSpacing: 0.3, textAlign: 'center' }}>
              {personalIntro.greeting}
            </Text>
          ) : null}

          <View style={{ width: 30, height: 1, backgroundColor: accent, marginVertical: 12 }} />

          <Text style={{ fontSize: 12.5, fontWeight: 300, color: '#444', lineHeight: 1.7, letterSpacing: 0.2, textAlign: 'center', marginBottom: 12 }}>
            {personalIntro.colorTypeDescription.summary}
          </Text>

          <View style={{ alignSelf: 'stretch', paddingHorizontal: 16, marginBottom: 12 }}>
            {personalIntro.colorTypeDescription.characteristics.map((char, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: accent, marginRight: 10, flexShrink: 0 }} />
                <Text style={{ fontSize: 10.5, fontWeight: 300, color: '#555', flex: 1, lineHeight: 1.6 }}>{char}</Text>
              </View>
            ))}
          </View>

          <Text style={{ fontSize: 11, fontWeight: 300, color: accent, textAlign: 'center', lineHeight: 1.6 }}>
            {personalIntro.colorTypeDescription.bestFor}
          </Text>
        </View>

        <View style={{ alignItems: 'center', marginTop: 6, marginBottom: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 0.5, flex: 1, backgroundColor: '#E8E4DC' }} />
            <Text style={{ fontSize: 7, color: '#CCC', letterSpacing: 2 }}>MADE BY COLORLAB</Text>
            <View style={{ height: 0.5, flex: 1, backgroundColor: '#E8E4DC' }} />
          </View>
          <Text style={{ fontSize: 6.5, color: '#DDD', marginTop: 3, letterSpacing: 1 }}>AI PERSONAL COLOR ANALYSIS · colorlab.kr</Text>
        </View>
      </View>

      <Footer page={1} accent={accent} />
    </Page>
  );
}
