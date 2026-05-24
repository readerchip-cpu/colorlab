// PortOne V2 서버사이드 결제 검증
export async function verifyPortonePayment(paymentId: string): Promise<{
  status: string;
  amount: number;
  txId: string;
}> {
  const res = await fetch(
    `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: { Authorization: `PortOne ${process.env.PORTONE_API_SECRET!}` },
      cache: 'no-store',
    },
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `PortOne API ${res.status}`);
  }
  const data = await res.json() as {
    status: string;
    amount?: { total?: number };
    transactionId?: string;
  };
  return {
    status: data.status,
    amount: data.amount?.total ?? 0,
    txId: data.transactionId ?? paymentId,
  };
}

// paymentId 형식: colorlab_${sessionId}_${timestamp}
export function parseSessionId(paymentId: string): string {
  const first = paymentId.indexOf('_');
  const last = paymentId.lastIndexOf('_');
  if (first === last) throw new Error(`Invalid paymentId: ${paymentId}`);
  return paymentId.substring(first + 1, last);
}
