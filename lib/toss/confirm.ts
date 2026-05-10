// Toss Payments 서버 사이드 결제 승인 API 호출
export async function confirmTossPayment(
  paymentKey: string,
  orderId: string,
  amount: number,
): Promise<void> {
  const auth = Buffer.from(`${process.env.TOSS_SECRET_KEY!}:`).toString('base64');

  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Unknown Toss error' }));
    throw new Error(body.message ?? `Toss confirm failed: ${response.status}`);
  }
}

// orderId 에서 sessionId 추출
// 형식: colorlab_${sessionId}_${timestamp}
// UUID는 하이픈만 포함하므로 앞뒤 _로 정확히 분리 가능
export function parseSessionId(orderId: string): string {
  const first = orderId.indexOf('_');
  const last = orderId.lastIndexOf('_');
  if (first === last) throw new Error(`Invalid orderId format: ${orderId}`);
  return orderId.substring(first + 1, last);
}
