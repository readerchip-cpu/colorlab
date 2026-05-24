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

// paymentId 형식: cl_${32자 UUID 하이픈제거}_${4자 타임스탬프} (40자)
export function parseSessionId(paymentId: string): string {
  const first = paymentId.indexOf('_');
  const last = paymentId.lastIndexOf('_');
  if (first === last) throw new Error(`Invalid paymentId: ${paymentId}`);
  const middle = paymentId.substring(first + 1, last);
  // 32자 hex → UUID 형식으로 복원 (8-4-4-4-12)
  if (/^[0-9a-f]{32}$/i.test(middle)) {
    return `${middle.slice(0, 8)}-${middle.slice(8, 12)}-${middle.slice(12, 16)}-${middle.slice(16, 20)}-${middle.slice(20)}`;
  }
  return middle;
}
