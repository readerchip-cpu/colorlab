'use client';

import '@/lib/pdf/font';
import { Document } from '@react-pdf/renderer';
import CoverPage from '@/components/pdf/pages/CoverPage';
import AnalysisPage from '@/components/pdf/pages/AnalysisPage';
import ColorPalettePage from '@/components/pdf/pages/ColorPalettePage';
import MakeupPage from '@/components/pdf/pages/MakeupPage';
import HairFashionSeasonPage from '@/components/pdf/pages/HairFashionSeasonPage';
import CelebrityAndAdvicePage from '@/components/pdf/pages/CelebrityAndAdvicePage';
import type { ReportData } from '@/types/report';

export interface ReportPDFProps {
  data:       ReportData;
  sessionId:  string;
  createdAt?: string;
}

export default function ReportPDF({ data, sessionId, createdAt }: ReportPDFProps) {
  const accent = data.meta.accentColor;
  const date   = createdAt ?? new Date().toISOString().slice(0, 10);
  const name   = data.meta.customerName?.trim() || '고객';

  return (
    <Document title={`${name}님 컬러랩 퍼스널컬러 리포트 · ${data.meta.typeNameKr}`} author="COLORLAB">
      <CoverPage
        data={data} sessionId={sessionId} createdAt={date}
        accent={accent} customerName={name}
      />
      <AnalysisPage data={data} accent={accent} customerName={name} />
      <ColorPalettePage data={data} accent={accent} customerName={name} />
      <MakeupPage data={data} accent={accent} customerName={name} />
      <HairFashionSeasonPage data={data} accent={accent} customerName={name} />
      <CelebrityAndAdvicePage data={data} accent={accent} customerName={name} />
    </Document>
  );
}
