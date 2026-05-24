import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getTestSession } from '@/lib/utils/session';
import { TYPE_REPRESENTATIVE, TYPE_PALETTE } from '@/lib/colorData';
import { TYPE_EN, TYPE_EXTRA } from '@/lib/pdf/typeExtra';
import { TYPE_INTRO } from '@/lib/pdf/typeIntro';
import { WebReport } from '@/components/report/WebReport';
import type { PersonalColorType } from '@/types';
import type { ReportData } from '@/types/report';

interface Props {
  params: { id: string };
}

const fetchSession = cache(async (id: string) => getTestSession(id));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const session = await fetchSession(params.id);
    if (!session.result_type) return {};
    return {
      title: `${session.result_type} 정밀 리포트 | 컬러랩`,
      description: `AI가 분석한 ${session.result_type} 타입의 퍼스널컬러 정밀 분석 리포트`,
    };
  } catch {
    return { title: '컬러랩 리포트' };
  }
}

export default async function ReportPage({ params }: Props) {
  let session;
  try {
    session = await fetchSession(params.id);
  } catch {
    notFound();
  }

  if (!session.is_paid) redirect(`/pay/${params.id}`);
  if (!session.report_content) redirect(`/upload/${params.id}`);

  const colorType = session.result_type as PersonalColorType;
  const name = session.customer_name?.trim() || '고객';
  const intro = TYPE_INTRO[colorType];
  const extra = TYPE_EXTRA[colorType];

  const reportData: ReportData = {
    meta: {
      typeName: TYPE_EN[colorType],
      typeNameKr: colorType,
      toneStrength: extra.attributes.base,
      accentColor: TYPE_REPRESENTATIVE[colorType] ?? '#7C3AED',
    },
    palette: {
      best: [...TYPE_PALETTE[colorType], ...extra.bestColors].slice(0, 8),
      worst: extra.worstColors,
    },
    personalIntro: {
      greeting: `${name}님, 안녕하세요. 컬러랩에서 분석한 ${name}님만의 컬러 가이드를 보내드려요.`,
      colorTypeDescription: {
        summary: intro.summary,
        characteristics: intro.characteristics,
        bestFor: intro.bestFor,
      },
      photoImpression: `${name}님의 테스트 응답을 기반으로 정밀 분석한 결과입니다. ${colorType} 타입의 특성이 잘 나타나 있습니다.`,
      keyFinding: `${name}님은 ${intro.keyFinding}`,
    },
  };

  return (
    <WebReport
      data={reportData}
      pdfPageHref={`/report/${params.id}/pdf`}
      customerName={name}
      sessionId={params.id}
    />
  );
}
