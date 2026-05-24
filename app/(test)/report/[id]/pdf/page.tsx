import { notFound, redirect } from 'next/navigation';
import { getTestSession } from '@/lib/utils/session';
import PdfViewerClient from '@/components/pdf/PdfViewerClient';
import type { PersonalColorType } from '@/types';
import { TYPE_INTRO } from '@/lib/pdf/typeIntro';

interface Props {
  params: { id: string };
}

export const metadata = {
  title: 'PDF 리포트 | 컬러랩',
};

export default async function PdfPage({ params }: Props) {
  let session;
  try {
    session = await getTestSession(params.id);
  } catch {
    notFound();
  }

  if (!session.is_paid) redirect(`/pay/${params.id}`);
  if (!session.report_content) redirect(`/upload/${params.id}`);

  const colorType = session.result_type as PersonalColorType;
  const name = session.customer_name?.trim() || '';
  const intro = TYPE_INTRO[colorType];

  return (
    <PdfViewerClient
      sessionId={params.id}
      colorType={colorType}
      reportContent={session.report_content}
      createdAt={session.created_at}
      customerName={name || undefined}
      personalIntro={name ? {
        greeting: `${name}님, 안녕하세요. 컬러랩에서 분석한 ${name}님만의 컬러 가이드를 보내드려요.`,
        colorTypeDescription: {
          summary: intro.summary,
          characteristics: intro.characteristics,
          bestFor: intro.bestFor,
        },
        photoImpression: `${name}님의 테스트 응답을 기반으로 정밀 분석한 결과입니다. ${colorType} 타입의 특성이 잘 나타나 있습니다.`,
        keyFinding: `${name}님은 ${intro.keyFinding}`,
      } : undefined}
    />
  );
}
