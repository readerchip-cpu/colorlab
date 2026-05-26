import { NextResponse } from 'next/server';
import { verifyPortonePayment, parseSessionId } from '@/lib/portone/confirm';
import { updatePaymentDone } from '@/lib/utils/payment';
import { updateSessionPaid } from '@/lib/utils/session';

const PRICE = Number(process.env.PRICE ?? 4900);

// 모바일 리다이렉트 방식: PortOne이 결제 후 GET으로 이 URL을 호출
// 성공: ?paymentId=...&txId=...
// 실패/취소: ?paymentId=...&code=ERROR_CODE&message=...
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');
  const code = searchParams.get('code');

  console.log('[GET confirm] called — paymentId:', paymentId, 'code:', code, 'url:', request.url);

  if (!paymentId) {
    console.error('[GET confirm] missing paymentId, redirecting home');
    return NextResponse.redirect(`${origin}/`);
  }

  let sessionId: string;
  try {
    sessionId = parseSessionId(paymentId);
    console.log('[GET confirm] parsed sessionId:', sessionId);
  } catch {
    const fallback = searchParams.get('sessionId');
    if (fallback) {
      sessionId = fallback;
      console.log('[GET confirm] using fallback sessionId:', sessionId);
    } else {
      console.error('[GET confirm] parseSessionId failed and no sessionId fallback:', paymentId);
      return NextResponse.redirect(`${origin}/`);
    }
  }

  if (code) {
    console.log('[GET confirm] failure/cancel code:', code);
    const params = new URLSearchParams({ error: code });
    const message = searchParams.get('message');
    if (message) params.set('message', message);
    return NextResponse.redirect(`${origin}/pay/${sessionId}?${params}`);
  }

  try {
    console.log('[GET confirm] verifying payment:', paymentId);
    const { status, amount, txId } = await verifyPortonePayment(paymentId);
    console.log('[GET confirm] verification result — status:', status, 'amount:', amount, 'txId:', txId);

    if (status !== 'PAID') throw new Error(`Payment status not PAID: ${status}`);
    if (amount !== PRICE) {
      console.error(`[GET confirm] amount mismatch: expected ${PRICE}, got ${amount}`);
      return NextResponse.redirect(`${origin}/pay/${sessionId}?error=amount_mismatch`);
    }

    await updatePaymentDone(paymentId, txId);
    await updateSessionPaid(sessionId);
    console.log('[GET confirm] done — redirecting to upload:', sessionId);

    return NextResponse.redirect(`${origin}/upload/${sessionId}`);
  } catch (err) {
    console.error('[GET confirm] error:', err);
    return NextResponse.redirect(`${origin}/pay/${sessionId}?error=confirm_failed`);
  }
}

// PC 팝업 방식: 클라이언트가 결제 완료 후 직접 POST로 검증 요청
// Body: { paymentId: string, sessionId: string }
export async function POST(request: Request) {
  let paymentId: string;
  let sessionId: string;

  try {
    const body = await request.json() as { paymentId?: string; sessionId?: string };
    paymentId = body.paymentId ?? '';
    sessionId = body.sessionId ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!paymentId || !sessionId) {
    return NextResponse.json({ error: 'Missing paymentId or sessionId' }, { status: 400 });
  }

  try {
    const { status, amount, txId } = await verifyPortonePayment(paymentId);

    if (status !== 'PAID') {
      return NextResponse.json({ error: `Payment not paid: ${status}` }, { status: 400 });
    }

    if (amount !== PRICE) {
      console.error(`Amount mismatch: expected ${PRICE}, got ${amount}`);
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
    }

    await updatePaymentDone(paymentId, txId);
    await updateSessionPaid(sessionId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Payment confirm POST error:', err);
    return NextResponse.json({ error: 'Confirm failed' }, { status: 500 });
  }
}
