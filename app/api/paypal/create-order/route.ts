import { NextResponse } from 'next/server';
import { getTestSession } from '@/lib/utils/session';
import { createPaypalOrder, PAYPAL_PRICE_USD } from '@/lib/paypal/client';
import { createPendingPaymentRecord } from '@/lib/utils/payment';

// PayPal 주문 생성. 클라이언트 Buttons의 createOrder에서 호출.
// Body: { sessionId: string }
export async function POST(request: Request) {
  let sessionId: string;
  try {
    const body = (await request.json()) as { sessionId?: string };
    sessionId = body.sessionId ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  try {
    const session = await getTestSession(sessionId);
    if (session.is_paid) {
      return NextResponse.json({ error: 'Already paid' }, { status: 400 });
    }

    const orderID = await createPaypalOrder(sessionId);

    // pending 결제 기록 (USD 금액). 캡처 성공 시 done으로 갱신.
    await createPendingPaymentRecord({
      sessionId,
      orderId: orderID,
      amount: Number(PAYPAL_PRICE_USD),
    });

    return NextResponse.json({ orderID });
  } catch (err) {
    console.error('[paypal create-order] error:', err);
    return NextResponse.json({ error: 'Create order failed' }, { status: 500 });
  }
}
