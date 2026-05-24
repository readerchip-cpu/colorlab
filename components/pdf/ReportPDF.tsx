'use client';

import '@/lib/pdf/font';
import { Document } from '@react-pdf/renderer';
import { TYPE_PALETTE } from '@/lib/colorData';
import { TYPE_REPRESENTATIVE } from '@/lib/colorData';
import CoverPage from '@/components/pdf/pages/CoverPage';
import AnalysisPage from '@/components/pdf/pages/AnalysisPage';
import ColorPalettePage from '@/components/pdf/pages/ColorPalettePage';
import MakeupPage from '@/components/pdf/pages/MakeupPage';
import HairFashionSeasonPage from '@/components/pdf/pages/HairFashionSeasonPage';
import CelebrityAndAdvicePage from '@/components/pdf/pages/CelebrityAndAdvicePage';
import type { PersonalColorType } from '@/types';

interface ColorTypeDescription {
  summary: string;
  characteristics: string[];
  bestFor: string;
}

export interface ReportPDFProps {
  colorType:     PersonalColorType;
  sessionId:     string;
  reportContent: string;
  createdAt?:    string;
  customerName?: string;
  personalIntro?: {
    greeting:              string;
    colorTypeDescription?: ColorTypeDescription;
    photoImpression:       string;
    keyFinding:            string;
    keyInsight?:           string;
  };
  celebrities?: {
    name: string;
    profession: string;
    similarity: string;
    iconicLook: string;
  }[];
  customAdvice?: {
    answer:    string;
    isRelated: boolean;
  };
}

export default function ReportPDF({
  colorType, sessionId, reportContent, createdAt,
  customerName, personalIntro, celebrities, customAdvice,
}: ReportPDFProps) {
  const accent  = TYPE_REPRESENTATIVE[colorType] ?? '#7C3AED';
  const date    = createdAt ?? new Date().toISOString().slice(0, 10);
  const name    = customerName?.trim() || '고객';
  const palette = TYPE_PALETTE[colorType];

  return (
    <Document title={`${name}님 컬러랩 퍼스널컬러 리포트 · ${colorType}`} author="COLORLAB">
      <CoverPage
        colorType={colorType} sessionId={sessionId} createdAt={date}
        accent={accent} customerName={name}
        greeting={personalIntro?.greeting ?? ''}
        colorTypeDescription={personalIntro?.colorTypeDescription}
        palette={[...palette]}
      />
      <AnalysisPage
        colorType={colorType} accent={accent} customerName={name}
        photoImpression={personalIntro?.photoImpression}
        keyFinding={personalIntro?.keyFinding}
        keyInsight={personalIntro?.keyInsight}
      />
      <ColorPalettePage colorType={colorType} accent={accent} customerName={name} />
      <MakeupPage colorType={colorType} accent={accent} customerName={name} />
      <HairFashionSeasonPage colorType={colorType} accent={accent} customerName={name} />
      <CelebrityAndAdvicePage
        colorType={colorType} accent={accent} customerName={name}
        celebrities={celebrities}
        customAdvice={customAdvice}
      />
    </Document>
  );
}
