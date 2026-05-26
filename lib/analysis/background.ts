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
  const t0 = Date.now();
  const ms = () => `${Date.now() - t0}ms`;

  try {
    console.log(`[BG-1] 분석 시작: ${sessionId} (0ms)`);

    console.log(`[BG-2] Claude API 호출 직전 (${ms()})`);
    const report = await generateFullReport(
      answers,
      colorType,
      imageBase64,
      freeConcern,
      imageMediaType,
    );
    console.log(`[BG-3] Claude API 응답 완료 (${ms()})`);

    console.log(`[BG-4] saveReportContent 직전 (${ms()})`);
    await saveReportContent(sessionId, report, customerName);
    console.log(`[BG-5] saveReportContent 완료 (${ms()})`);

    console.log(`[BG-6] analysis_status 업데이트 직전 (${ms()})`);
    const { error: statusError } = await adminClient
      .from('test_sessions')
      .update({ analysis_status: 'completed' })
      .eq('id', sessionId);

    if (statusError) {
      console.error(`[BG-7] ❌ analysis_status 업데이트 실패 (${ms()}):`, statusError);
    } else {
      console.log(`[BG-7] ✅ analysis_status → completed (${ms()})`);
    }

    console.log(`[BG-8] 이메일 발송 시작 (${ms()})`);
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
        console.log(`[BG-9] 이메일 발송 완료 (${ms()})`);
      } else {
        console.log(`[BG-9] 이메일 없음 — 발송 생략 (${ms()})`);
      }
    } catch (emailErr) {
      console.error(`[BG-9] 이메일 발송 실패 (무시) (${ms()}):`, emailErr);
    }

    console.log(`[BG-10] 🎉 전체 완료 (${ms()})`);

  } catch (error) {
    console.error(`[BG-ERROR] 분석 실패 (${ms()}):`, error);

    try {
      const { error: failError } = await adminClient
        .from('test_sessions')
        .update({ analysis_status: 'failed' })
        .eq('id', sessionId);
      if (failError) {
        console.error(`[BG-FAIL] failed 상태 업데이트 실패:`, failError);
      } else {
        console.log(`[BG-FAIL] analysis_status → failed`);
      }
    } catch (e) {
      console.error(`[BG-FAIL] failed 상태 업데이트 예외:`, e);
    }

    throw error;
  }
}
