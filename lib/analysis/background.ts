// 사용되지 않음 — 비동기 처리 시 참고용으로 보관
import { generateReportData } from '@/lib/anthropic/client';
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
    const reportData = await generateReportData(
      answers,
      colorType,
      customerName,
      imageBase64,
      freeConcern,
      imageMediaType,
    );

    await saveReportContent(sessionId, JSON.stringify(reportData), customerName);

    const { error: statusError } = await adminClient
      .from('test_sessions')
      .update({ analysis_status: 'completed' })
      .eq('id', sessionId);

    if (statusError) {
      console.error('[BG] analysis_status 업데이트 실패:', statusError);
    }

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
      }
    } catch (emailErr) {
      console.error('[BG] 이메일 발송 실패:', emailErr);
    }

  } catch (error) {
    console.error('[BG] 분석 실패:', error);

    try {
      const { error: failError } = await adminClient
        .from('test_sessions')
        .update({ analysis_status: 'failed' })
        .eq('id', sessionId);
      if (failError) {
        console.error('[BG] failed 상태 업데이트 실패:', failError);
      }
    } catch (e) {
      console.error('[BG] failed 상태 업데이트 예외:', e);
    }

    throw error;
  }
}
