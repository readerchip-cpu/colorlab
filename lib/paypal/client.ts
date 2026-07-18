// PayPal REST API 서버사이드 연동 (주문 생성 / 캡처 검증)
// 해외 고객용 USD 결제. 국내 결제는 PortOne(lib/portone)을 그대로 사용.

const PAYPAL_ENV = process.env.PAYPAL_ENV ?? 'live';
const BASE =
  PAYPAL_ENV === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

// PayPal 결제 금액 (USD). .env.local의 PAYPAL_PRICE_USD로 조정.
export const PAYPAL_PRICE_USD = process.env.PAYPAL_PRICE_USD ?? '10.00';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error('PayPal 자격 증명(NEXT_PUBLIC_PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)이 설정되지 않았습니다.');
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PayPal 토큰 발급 실패 ${res.status}: ${body}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

// 주문 생성 → PayPal orderID 반환. custom_id에 sessionId를 실어 세션과 연결.
export async function createPaypalOrder(sessionId: string): Promise<string> {
  const token = await getAccessToken();
  const res = await fetch(`${BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: sessionId,
          description: 'ColorLab Personal Color Analysis',
          amount: { currency_code: 'USD', value: PAYPAL_PRICE_USD },
        },
      ],
    }),
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PayPal 주문 생성 실패 ${res.status}: ${body}`);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

// 주문 캡처 → 결제 확정. 상태/금액/세션 검증에 필요한 값 반환.
export async function capturePaypalOrder(orderId: string): Promise<{
  status: string;
  amount: string;
  currency: string;
  customId: string | null;
  captureId: string;
  payerEmail: string | null;
}> {
  const token = await getAccessToken();
  const res = await fetch(
    `${BASE}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PayPal 캡처 실패 ${res.status}: ${body}`);
  }
  const data = (await res.json()) as {
    status: string;
    payer?: { email_address?: string };
    purchase_units?: Array<{
      custom_id?: string;
      payments?: {
        captures?: Array<{
          id?: string;
          custom_id?: string;
          amount?: { value?: string; currency_code?: string };
        }>;
      };
    }>;
  };

  const pu = data.purchase_units?.[0];
  const capture = pu?.payments?.captures?.[0];
  return {
    status: data.status, // 정상 결제 시 'COMPLETED'
    amount: capture?.amount?.value ?? '0',
    currency: capture?.amount?.currency_code ?? '',
    customId: capture?.custom_id ?? pu?.custom_id ?? null,
    captureId: capture?.id ?? orderId,
    payerEmail: data.payer?.email_address ?? null,
  };
}
