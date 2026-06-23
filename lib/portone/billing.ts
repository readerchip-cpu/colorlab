// PortOne V2 빌링키 기반 정기결제(서버사이드)
// 발급된 billingKey로 실제 금액을 청구한다.

interface ChargeArgs {
  billingKey: string;
  paymentId: string;
  orderName: string;
  amount: number;
  customer: { email?: string; phoneNumber?: string };
}

export async function chargeBillingKey({
  billingKey,
  paymentId,
  orderName,
  amount,
  customer,
}: ChargeArgs): Promise<{ status: string; txId: string }> {
  const res = await fetch(
    `https://api.portone.io/payments/${encodeURIComponent(paymentId)}/billing-key`,
    {
      method: 'POST',
      headers: {
        Authorization: `PortOne ${process.env.PORTONE_API_SECRET!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        billingKey,
        orderName,
        amount: { total: amount },
        currency: 'KRW',
        customer,
      }),
      cache: 'no-store',
    },
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? `PortOne billing API ${res.status}`);
  }

  const payment = (data as { payment?: { status?: string; transactionId?: string } }).payment;
  return {
    status: payment?.status ?? 'UNKNOWN',
    txId: payment?.transactionId ?? paymentId,
  };
}
