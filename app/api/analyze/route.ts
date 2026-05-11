import { NextResponse } from 'next/server';
import { generateFullReport } from '@/lib/anthropic/client';
import { getTestSession, saveReportContent } from '@/lib/utils/session';
import type { PersonalColorType } from '@/types';

// Anthropic API 호출 시간을 고려해 60초로 설정
export const maxDuration = 60;
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

    // 입력값 검증
    if (typeof sessionId !== 'string' || !sessionId) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }
    if (!(imageFile instanceof File)) {
      return NextResponse.json({ error: 'image file is required' }, { status: 400 });
    }

    // 결제 여부 확인
    const session = await getTestSession(sessionId);
    if (!session.is_paid) {
      return NextResponse.json({ error: 'Payment required' }, { status: 401 });
    }

    // 이미지 유효성 검증 (MIME + 크기)
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

    // 리포트 생성 (Vision + 답변 + 고민 종합)
    const report = await generateFullReport(
      session.answers,
      session.result_type as PersonalColorType,
      imageBase64,
      freeConcern || session.free_concern || undefined,
      mimeType,
    );

    // base64 즉시 해제 (GC 대상)
    imageBase64 = null;

    // DB에 리포트 저장
    await saveReportContent(sessionId, report);

    return NextResponse.json({ redirectUrl: `/report/${sessionId}` });
  } catch (err) {
    // 에러 발생 시에도 base64 해제 보장
    imageBase64 = null;

    console.error('Analyze error:', err);
    const status = err instanceof Error && err.message.includes('401') ? 401 : 500;
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status },
    );
  }
}
