import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }

  const { data } = await adminClient
    .from('test_sessions')
    .select('analysis_status, report_content')
    .eq('id', sessionId)
    .single();

  // analysis_status 컬럼이 없으면 report_content 유무로 판단
  const status: string =
    data?.analysis_status ??
    (data?.report_content ? 'completed' : 'processing');

  return NextResponse.json({ status });
}
