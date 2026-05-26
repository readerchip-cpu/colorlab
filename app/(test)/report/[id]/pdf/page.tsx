import { notFound, redirect } from 'next/navigation';
import { getTestSession } from '@/lib/utils/session';
import PdfViewerClient from '@/components/pdf/PdfViewerClient';
import { TYPE_REPRESENTATIVE } from '@/lib/colorData';
import type { PersonalColorType } from '@/types';
import type { ReportData } from '@/types/report';

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

  let reportData: ReportData;
  try {
    reportData = JSON.parse(session.report_content) as ReportData;
  } catch {
    redirect(`/upload/${params.id}`);
  }

  if (!reportData.meta || !reportData.palette) redirect(`/upload/${params.id}`);

  const colorType = (session.result_type ?? reportData.meta.typeNameKr) as PersonalColorType;
  reportData.meta.accentColor = TYPE_REPRESENTATIVE[colorType] ?? '#7C3AED';

  if (!reportData.meta.customerName && session.customer_name) {
    reportData.meta.customerName = session.customer_name;
  }
  const customerName = reportData.meta.customerName || session.customer_name || undefined;

  return (
    <PdfViewerClient
      reportData={reportData}
      sessionId={params.id}
      customerName={customerName}
      createdAt={session.created_at}
    />
  );
}
