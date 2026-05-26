import { NextResponse } from 'next/server';
import { getTestSession } from '@/lib/utils/session';
import { adminClient } from '@/lib/supabase/admin';
import { processAnalysisInBackground } from '@/lib/analysis/background';
import { validateProductCoverage } from '@/lib/data/cosmetics';
import type { PersonalColorType } from '@/types';

if (process.env.NODE_ENV === 'development') {
  validateProductCoverage();
}

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
type AllowedMime = (typeof ALLOWED_TYPES)[number];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

function isAllowedMime(type: string): type is AllowedMime {
  return (ALLOWED_TYPES as readonly string[]).includes(type);
}

export async function POST(request: Request) {
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
    const imageBase64 = Buffer.from(arrayBuffer).toString('base64');

    // 분석 상태와 고객 정보를 즉시 저장
    try {
      await adminClient
        .from('test_sessions')
        .update({
          customer_name: customerName || null,
          free_concern: freeConcern || null,
          analysis_status: 'processing',
        })
        .eq('id', sessionId);
    } catch (err) {
      console.error('[analyze] status update failed (컬럼 없을 수 있음):', err);
    }

    // 백그라운드에서 분석 시작 (await 안 함 — 즉시 응답)
    processAnalysisInBackground({
      sessionId,
      answers: session.answers,
      colorType: session.result_type as PersonalColorType,
      imageBase64,
      imageMediaType: mimeType,
      freeConcern: freeConcern || session.free_concern || undefined,
      customerName,
    }).catch((err) => {
      console.error('[analyze] background process failed:', err);
    });

    return NextResponse.json({ success: true, sessionId });

  } catch (err) {
    console.error('[analyze] error:', err);
    const status = err instanceof Error && err.message.includes('401') ? 401 : 500;
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status },
    );
  }
}
