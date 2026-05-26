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

  // paymentId 없으면 홈으로
  if (!paymentId) return NextResponse.redirect(`${origin}/`);

  // sessionId: paymentId 파싱 우선, 실패 시 query param fallback
  let sessionId: string;
  try {
    sessionId = parseSessionId(paymentId);
  } catch {
    const fallback = searchParams.get('sessionId');
    if (fallback) {
      sessionId = fallback;
    } else {
      console.error('parseSessionId failed and no sessionId fallback:', paymentId);
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // 결제 실패 또는 취소 (code가 비어 있지 않은 경우만)
  if (code) {
    console.log('Payment failure/cancel code:', code);
    const params = new URLSearchParams({ error: code });
    const message = searchParams.get('message');
    if (message) params.set('message', message);
    return NextResponse.redirect(`${origin}/pay/${sessionId}?${params}`);
  }

  try {
    const { status, amount, txId } = await verifyPortonePayment(paymentId);

    if (status !== 'PAID') throw new Error(`Payment status not PAID: ${status}`);
    if (amount !== PRICE) {
      console.error(`Amount mismatch: expected ${PRICE}, got ${amount}`);
      return NextResponse.redirect(`${origin}/pay/${sessionId}?error=amount_mismatch`);
    }

    // getPaymentByOrderId는 사용하지 않으므로 제거
    // (불필요한 Promise.all 실패가 updateSessionPaid를 건너뛰게 만들던 버그 수정)
    await updatePaymentDone(paymentId, txId);
    await updateSessionPaid(sessionId);

    return NextResponse.redirect(`${origin}/upload/${sessionId}`);
  } catch (err) {
    console.error('Payment confirm GET error:', err);
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
