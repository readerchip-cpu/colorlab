import { NextResponse } from 'next/server';
import { verifyPortonePayment, parseSessionId } from '@/lib/portone/confirm';
import { getPaymentByOrderId, updatePaymentDone } from '@/lib/utils/payment';
import { updateSessionPaid } from '@/lib/utils/session';

const PRICE = Number(process.env.PRICE ?? 4900);

// PortOne이 결제 후 GET 리다이렉트로 이 URL을 호출
// 성공: ?paymentId=...&txId=...
// 실패: ?paymentId=...&code=...&message=...
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');
  const code = searchParams.get('code');

  if (!paymentId) return NextResponse.redirect(`${origin}/`);

  let sessionId: string;
  try {
    sessionId = parseSessionId(paymentId);
  } catch {
    return NextResponse.redirect(`${origin}/`);
  }

  // 결제 실패/취소
  if (code) {
    const params = new URLSearchParams({ error: code });
    const message = searchParams.get('message');
    if (message) params.set('message', message);
    return NextResponse.redirect(`${origin}/pay/${sessionId}?${params}`);
  }

  try {
    const { status, amount, txId } = await verifyPortonePayment(paymentId);

    if (status !== 'PAID') {
      throw new Error(`Payment status not PAID: ${status}`);
    }

    if (amount !== PRICE) {
      console.error(`Amount mismatch: expected ${PRICE}, got ${amount}`);
      return NextResponse.redirect(`${origin}/`);
    }

    await Promise.all([
      getPaymentByOrderId(paymentId),
      updatePaymentDone(paymentId, txId),
    ]);
    await updateSessionPaid(sessionId);

    return NextResponse.redirect(`${origin}/upload/${sessionId}`);
  } catch (err) {
    console.error('Payment confirm error:', err);
    return NextResponse.redirect(`${origin}/pay/${sessionId}?error=confirm_failed`);
  }
}
