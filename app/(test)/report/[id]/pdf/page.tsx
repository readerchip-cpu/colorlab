import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getTestSession } from '@/lib/utils/session';
import PdfViewerClient from '@/components/pdf/PdfViewerClient';
import type { PersonalColorType } from '@/types';

interface Props {
  params: { id: string };
}

export const metadata: Metadata = {
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

  return (
    <PdfViewerClient
      sessionId={params.id}
      colorType={session.result_type as PersonalColorType}
      reportContent={session.report_content}
      createdAt={session.created_at}
    />
  );
}
