import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { adminClient } from '@/lib/supabase/admin';
import { TYPE_REPRESENTATIVE } from '@/lib/colorData';
import { WebReport } from '@/components/report/WebReport';
import type { PersonalColorType } from '@/types';
import type { ReportData } from '@/types/report';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: { id: string };
}

const fetchSession = cache(async (id: string) => {
  const { data, error } = await adminClient
    .from('test_sessions')
    .select('id, is_paid, result_type, report_content, customer_name, analysis_status, created_at')
    .eq('id', id)
    .single();
  if (error || !data) throw new Error('session not found');
  return data;
});

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
  const sessionId = params.id;
  console.log('[ReportPage] sessionId:', sessionId);

  let session;
  try {
    session = await fetchSession(sessionId);
  } catch {
    notFound();
  }

  console.log('[ReportPage] is_paid:', session.is_paid);
  console.log('[ReportPage] analysis_status:', session.analysis_status);
  console.log('[ReportPage] report_content 길이:', session.report_content?.length ?? 0);

  if (!session.is_paid) redirect(`/pay/${sessionId}`);
  if (!session.report_content) redirect(`/upload/${sessionId}`);

  // JSON 파싱
  let reportData: ReportData;
  try {
    reportData = JSON.parse(session.report_content) as ReportData;
  } catch (parseError) {
    console.error('[ReportPage] report_content JSON 파싱 실패:', parseError);
    redirect(`/upload/${sessionId}`);
  }

  // 필수 필드 무결성 확인
  if (!reportData.meta || !reportData.palette) {
    console.error('[ReportPage] reportData 구조 손상:', Object.keys(reportData ?? {}));
    redirect(`/upload/${sessionId}`);
  }

  console.log('[ReportPage] reportData 키:', Object.keys(reportData));
  console.log('[ReportPage] celebrities 수:', reportData.celebrities?.length ?? 0);
  console.log('[ReportPage] customAdvice:', reportData.customAdvice);

  // accentColor 주입 (Claude JSON에 없으므로 타입 기반으로 결정)
  const colorType = (session.result_type ?? reportData.meta.typeNameKr) as PersonalColorType;
  reportData.meta.accentColor = TYPE_REPRESENTATIVE[colorType] ?? '#7C3AED';

  // customerName 보강
  if (!reportData.meta.customerName && session.customer_name) {
    reportData.meta.customerName = session.customer_name;
  }
  const customerName = reportData.meta.customerName || session.customer_name || '고객';

  return (
    <WebReport
      data={reportData}
      pdfPageHref={`/report/${sessionId}/pdf`}
      customerName={customerName}
      sessionId={sessionId}
    />
  );
}
