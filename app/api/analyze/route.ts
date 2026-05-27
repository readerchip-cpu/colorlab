import { NextResponse } from 'next/server';
import { generateReportData } from '@/lib/anthropic/client';
import { getTestSession, saveReportContent } from '@/lib/utils/session';
import { getEmailBySessionId } from '@/lib/utils/payment';
import { sendReport } from '@/lib/email/sendReport';
import { TYPE_EN } from '@/lib/colorData';
import { validateProductCoverage } from '@/lib/data/cosmetics';
import type { PersonalColorType } from '@/types';

if (process.env.NODE_ENV === 'development') {
  validateProductCoverage();
}

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
type AllowedMime = (typeof ALLOWED_TYPES)[number];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

function isAllowedMime(type: string): type is AllowedMime {
  return (ALLOWED_TYPES as readonly string[]).includes(type);
}

export async function POST(request: Request) {
  let imageBase64: string | null = null;

  try {
    const formData = await request.formData();
    const sessionId = formData.get('session_id');
    const imageFile = formData.get('image');
    const freeConcernRaw = formData.get('free_concern');
    const freeConcern = typeof freeConcernRaw === 'string' ? freeConcernRaw.trim() : undefined;
    const customerNameRaw = formData.get('customer_name');
    const customerName = typeof customerNameRaw === 'string' ? customerNameRaw.trim().slice(0, 10) : '';

    if (typeof sessionId !== 'string' || !sessionId) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }
    if (!(imageFile instanceof File)) {
      return NextResponse.json({ error: 'image file is required' }, { status: 400 });
    }

    const session = await getTestSession(sessionId);
    if (!session.is_paid) {
      return NextResponse.json({ error: 'Payment required' }, { status: 401 });
    }

    const mimeType = imageFile.type;
    if (!isAllowedMime(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported image format. Use JPEG, PNG, or WebP.' },
        { status: 415 },
      );
    }
    if (imageFile.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 413 },
      );
    }

    // 서버 메모리에서만 base64 변환 (파일 저장 없음)
    const arrayBuffer = await imageFile.arrayBuffer();
    imageBase64 = Buffer.from(arrayBuffer).toString('base64');

    // 리포트 생성 (Vision + 답변 + 고민 종합 → 구조화 JSON)
    const reportData = await generateReportData(
      session.answers,
      session.result_type as PersonalColorType,
      customerName,
      imageBase64,
      freeConcern || session.free_concern || undefined,
      mimeType,
    );

    // base64 즉시 해제 (GC 대상)
    imageBase64 = null;

    // JSON.stringify 후 DB 저장
    const reportContentJson = JSON.stringify(reportData);
    await saveReportContent(sessionId, reportContentJson, customerName);

    // 분석 완료 후 이메일 발송 — 실패해도 응답은 정상 반환
    const colorType = session.result_type as PersonalColorType;
    try {
      const email = await getEmailBySessionId(sessionId);
      if (email) {
        const base = process.env.NEXT_PUBLIC_BASE_URL ?? '';
        await sendReport(email, {
          customerName,
          sessionId,
          typeName:   TYPE_EN[colorType] ?? colorType,
          typeNameKr: colorType,
          reportUrl:  `${base}/report/${sessionId}`,
          pdfUrl:     `${base}/api/pdf/${sessionId}`,
        });
      } else {
        console.warn('[Analyze] payments에서 이메일 조회 실패, 발송 스킵');
      }
    } catch (emailErr) {
      console.error('[Analyze] ❌ 이메일 발송 실패 (응답은 정상):');
      console.error('Error name:', (emailErr as Error)?.name);
      console.error('Error message:', (emailErr as Error)?.message);
      console.error('Error stack:', (emailErr as Error)?.stack);
      console.error('Error full:', JSON.stringify(emailErr, null, 2));
    }

    return NextResponse.json({ redirectUrl: `/report/${sessionId}` });

  } catch (err) {
    imageBase64 = null;
    console.error('Analyze error:', err);
    const status = err instanceof Error && err.message.includes('401') ? 401 : 500;
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status },
    );
  }
}
