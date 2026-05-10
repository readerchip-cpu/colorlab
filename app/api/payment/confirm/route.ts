import { NextResponse } from 'next/server';
import { confirmTossPayment, parseSessionId } from '@/lib/toss/confirm';
import { getPaymentByOrderId, updatePaymentDone } from '@/lib/utils/payment';
import { updateSessionPaid } from '@/lib/utils/session';
import { sendReportEmail } from '@/lib/email/sendReport';

const PRICE = Number(process.env.PRICE ?? 4900);

// Toss가 결제 완료 후 GET 리다이렉트로 이 URL을 호출
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  // 필수 파라미터 누락
  if (!paymentKey || !orderId || !amount) {
    return NextResponse.redirect(`${origin}/`);
  }

  // 금액 변조 방지
  if (Number(amount) !== PRICE) {
    console.error(`Amount mismatch: expected ${PRICE}, got ${amount}`);
    return NextResponse.redirect(`${origin}/`);
  }

  let sessionId: string;
  try {
    sessionId = parseSessionId(orderId);
  } catch {
    return NextResponse.redirect(`${origin}/`);
  }

  try {
    // 1. 토스 결제 승인 API 호출
    await confirmTossPayment(paymentKey, orderId, Number(amount));

    // 2. DB 업데이트 (결제 키 저장 + is_paid)
    const [payment] = await Promise.all([
      getPaymentByOrderId(orderId),
      updatePaymentDone(orderId, paymentKey),
    ]);
    await updateSessionPaid(sessionId);

    // 3. 이메일 발송 (실패해도 결제 플로우는 계속)
    if (payment?.email) {
      sendReportEmail(payment.email, sessionId).catch((err) =>
        console.error('Email send failed:', err),
      );
    }

    return NextResponse.redirect(`${origin}/upload/${sessionId}`);
  } catch (err) {
    console.error('Payment confirm error:', err);
    return NextResponse.redirect(
      `${origin}/pay/${sessionId}?error=confirm_failed`,
    );
  }
}
