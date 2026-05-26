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

    await adminClient
      .from('test_sessions')
      .update({ analysis_status: 'completed' })
      .eq('id', sessionId);
    console.log('[BG] DB 업데이트 완료');

    // 이메일 발송 — 실패해도 무시
    getEmailBySessionId(sessionId)
      .then((email) => {
        if (!email) return;
        const base = process.env.NEXT_PUBLIC_BASE_URL ?? '';
        return sendReport(email, {
          sessionId,
          typeName:   TYPE_EN[colorType] ?? colorType,
          typeNameKr: colorType,
          reportUrl:  `${base}/report/${sessionId}`,
          pdfUrl:     `${base}/api/pdf/${sessionId}`,
        });
      })
      .catch((err) => console.error('[BG] 이메일 발송 실패:', err));

  } catch (error) {
    console.error('[BG] 분석 실패:', error);
    await adminClient
      .from('test_sessions')
      .update({ analysis_status: 'failed' })
      .eq('id', sessionId)
      .catch(() => {});
    throw error;
  }
}
