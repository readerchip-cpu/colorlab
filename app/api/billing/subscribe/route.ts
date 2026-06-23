import { NextResponse } from 'next/server';
import { chargeBillingKey } from '@/lib/portone/billing';
import { createSubscription, cancelSubscription } from '@/lib/utils/subscription';

const PRICE = Number(process.env.SUBSCRIPTION_PRICE ?? 9900);
const ORDER_NAME = '컬러랩 정기 구독 (월)';

// 정기결제 등록: 클라이언트에서 빌링키 발급 후 호출
// Body: { billingKey, customerId, email, phone }
export async function POST(request: Request) {
  let body: { billingKey?: string; customerId?: string; email?: string; phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { billingKey, customerId, email, phone } = body;
  if (!billingKey || !customerId) {
    return NextResponse.json({ error: 'Missing billingKey or customerId' }, { status: 400 });
  }

  const paymentId = `cl_sub_${customerId}_${Date.now().toString().slice(-6)}`;

  try {
    // 1) 첫 달 즉시 청구
    const { status } = await chargeBillingKey({
      billingKey,
      paymentId,
      orderName: ORDER_NAME,
      amount: PRICE,
      customer: { email, phoneNumber: phone },
    });

    if (status !== 'PAID') {
      return NextResponse.json({ error: `First charge not paid: ${status}` }, { status: 400 });
    }

    // 2) 구독 정보 저장 (다음 결제일 = 한 달 뒤)
    const nextPayAt = new Date();
    nextPayAt.setMonth(nextPayAt.getMonth() + 1);

    await createSubscription({
      customerId,
      billingKey,
      email,
      phone,
      amount: PRICE,
      nextPayAt: nextPayAt.toISOString(),
    });

    return NextResponse.json({ success: true, nextPayAt: nextPayAt.toISOString() });
  } catch (err) {
    console.error('[billing subscribe] error:', err);
    return NextResponse.json({ error: '정기결제 등록 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 정기결제 해지
// Body: { customerId }
export async function DELETE(request: Request) {
  let body: { customerId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
  }

  try {
    await cancelSubscription(body.customerId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[billing cancel] error:', err);
    return NextResponse.json({ error: '해지 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
