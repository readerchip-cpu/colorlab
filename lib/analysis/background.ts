import { generateFullReport } from '@/lib/anthropic/client';
import { saveReportContent } from '@/lib/utils/session';
import { getEmailBySessionId } from '@/lib/utils/payment';
import { sendReport } from '@/lib/email/sendReport';
import { adminClient } from '@/lib/supabase/admin';
import { TYPE_EN } from '@/lib/colorData';
import type { PersonalColorType, TestAnswers } from '@/types';

interface BackgroundParams {
  sessionId: string;
  answers: TestAnswers;
  colorType: PersonalColorType;
  imageBase64: string;
  imageMediaType: 'image/jpeg' | 'image/png' | 'image/webp';
  freeConcern?: string;
  customerName: string;
}

export async function processAnalysisInBackground(params: BackgroundParams): Promise<void> {
  const { sessionId, answers, colorType, imageBase64, imageMediaType, freeConcern, customerName } = params;

  try {
    console.log('[BG] 분석 시작:', sessionId);

    const report = await generateFullReport(
      answers,
      colorType,
      imageBase64,
      freeConcern,
      imageMediaType,
    );
    console.log('[BG] Claude 분석 완료');

    await saveReportContent(sessionId, report, customerName);
    console.log('[BG] 리포트 저장 완료');

    const { error: statusError } = await adminClient
      .from('test_sessions')
      .update({ analysis_status: 'completed' })
      .eq('id', sessionId);

    if (statusError) {
      console.error('[BG] analysis_status 업데이트 실패:', statusError);
    } else {
      console.log('[BG] analysis_status → completed');
    }

    // 이메일 발송 — 실패해도 분석 결과에는 영향 없음
    try {
      const email = await getEmailBySessionId(sessionId);
      if (email) {
        const base = process.env.NEXT_PUBLIC_BASE_URL ?? '';
        await sendReport(email, {
          sessionId,
          typeName:   TYPE_EN[colorType] ?? colorType,
          typeNameKr: colorType,
          reportUrl:  `${base}/report/${sessionId}`,
          pdfUrl:     `${base}/api/pdf/${sessionId}`,
        });
        console.log('[BG] 이메일 발송 완료');
      }
    } catch (emailErr) {
      console.error('[BG] 이메일 발송 실패 (무시):', emailErr);
    }

  } catch (error) {
    console.error('[BG] 분석 실패:', error);

    try {
      const { error: failError } = await adminClient
        .from('test_sessions')
        .update({ analysis_status: 'failed' })
        .eq('id', sessionId);
      if (failError) console.error('[BG] failed 상태 업데이트 실패:', failError);
    } catch (e) {
      console.error('[BG] failed 상태 업데이트 예외:', e);
    }

    throw error;
  }
}
