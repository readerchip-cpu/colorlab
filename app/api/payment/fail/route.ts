import { NextResponse } from 'next/server';
import { parseSessionId } from '@/lib/toss/confirm';
import { updatePaymentFailed } from '@/lib/utils/payment';

// Toss가 결제 실패/취소 시 GET 리다이렉트로 이 URL을 호출
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  const code = searchParams.get('code') ?? 'UNKNOWN';
  const message = searchParams.get('message') ?? '';

  if (!orderId) {
    return NextResponse.redirect(`${origin}/`);
  }

  let sessionId: string;
  try {
    sessionId = parseSessionId(orderId);
  } catch {
    return NextResponse.redirect(`${origin}/`);
  }

  // payments 레코드가 없을 수도 있으므로 조용히 처리
  updatePaymentFailed(orderId).catch((err) =>
    console.error('updatePaymentFailed error:', err),
  );

  const params = new URLSearchParams({ error: code });
  if (message) params.set('message', message);

  return NextResponse.redirect(`${origin}/pay/${sessionId}?${params}`);
}
