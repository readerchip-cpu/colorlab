import { NextResponse } from 'next/server';
import { capturePaypalOrder, PAYPAL_PRICE_USD } from '@/lib/paypal/client';
import { updateSessionPaid } from '@/lib/utils/session';
import { adminClient } from '@/lib/supabase/admin';

// PayPal 주문 캡처(결제 확정). 클라이언트 Buttons의 onApprove에서 호출.
// Body: { orderID: string, sessionId: string }
// 서버에서 상태·금액·세션을 검증한 뒤 리포트 잠금을 해제한다.
export async function POST(request: Request) {
  let orderID: string;
  let sessionId: string;
  try {
    const body = (await request.json()) as { orderID?: string; sessionId?: string };
    orderID = body.orderID ?? '';
    sessionId = body.sessionId ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!orderID || !sessionId) {
    return NextResponse.json({ error: 'Missing orderID or sessionId' }, { status: 400 });
  }

  try {
    const result = await capturePaypalOrder(orderID);

    if (result.status !== 'COMPLETED') {
      return NextResponse.json({ error: `Payment not completed: ${result.status}` }, { status: 400 });
    }

    // 금액 검증 (USD 고정 금액)
    if (result.currency !== 'USD' || Number(result.amount) !== Number(PAYPAL_PRICE_USD)) {
      console.error(`[paypal capture] amount mismatch: got ${result.amount} ${result.currency}, expected ${PAYPAL_PRICE_USD} USD`);
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
    }

    // 세션 검증 (주문 생성 시 실어둔 custom_id와 일치해야 함)
    if (result.customId && result.customId !== sessionId) {
      console.error(`[paypal capture] session mismatch: ${result.customId} vs ${sessionId}`);
      return NextResponse.json({ error: 'Session mismatch' }, { status: 400 });
    }

    // 결제 기록 완료 처리 (payer 이메일로 리포트 발송)
    const { error: updateErr } = await adminClient
      .from('payments')
      .update({ status: 'done', payment_key: result.captureId, email: result.payerEmail })
      .eq('order_id', orderID);
    if (updateErr) throw updateErr;

    await updateSessionPaid(sessionId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[paypal capture-order] error:', err);
    return NextResponse.json({ error: 'Capture failed' }, { status: 500 });
  }
}
