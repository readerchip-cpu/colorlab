'use server';

import { createPendingPaymentRecord } from '@/lib/utils/payment';

export async function createPendingPayment({
  sessionId,
  orderId,
  amount,
  email,
}: {
  sessionId: string;
  orderId: string;
  amount: number;
  email: string;
}): Promise<void> {
  await createPendingPaymentRecord({ sessionId, orderId, amount, email });
}
