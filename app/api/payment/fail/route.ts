import { NextResponse } from 'next/server';
import { parseSessionId } from '@/lib/portone/confirm';
import { updatePaymentFailed } from '@/lib/utils/payment';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');
  const code = searchParams.get('code') ?? 'UNKNOWN';
  const message = searchParams.get('message') ?? '';

  if (!paymentId) return NextResponse.redirect(`${origin}/`);

  let sessionId: string;
  try {
    sessionId = parseSessionId(paymentId);
  } catch {
    return NextResponse.redirect(`${origin}/`);
  }

  updatePaymentFailed(paymentId).catch((err) =>
    console.error('updatePaymentFailed error:', err),
  );

  const params = new URLSearchParams({ error: code });
  if (message) params.set('message', message);

  return NextResponse.redirect(`${origin}/pay/${sessionId}?${params}`);
}
