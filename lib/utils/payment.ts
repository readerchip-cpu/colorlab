import { adminClient } from '@/lib/supabase/admin';
import type { Payment } from '@/types';

export async function createPendingPaymentRecord({
  sessionId,
  orderId,
  amount,
  email,
}: {
  sessionId: string;
  orderId: string;
  amount: number;
  email?: string;
}): Promise<void> {
  const { error } = await adminClient.from('payments').insert({
    session_id: sessionId,
    order_id: orderId,
    amount,
    status: 'pending',
    email: email ?? null,
  });
  if (error) throw error;
}

export async function updatePaymentDone(
  orderId: string,
  paymentKey: string,
): Promise<void> {
  const { error } = await adminClient
    .from('payments')
    .update({ status: 'done', payment_key: paymentKey })
    .eq('order_id', orderId);
  if (error) throw error;
}

export async function updatePaymentFailed(orderId: string): Promise<void> {
  const { error } = await adminClient
    .from('payments')
    .update({ status: 'failed' })
    .eq('order_id', orderId);
  if (error) throw error;
}

export async function getPaymentByOrderId(orderId: string): Promise<Payment | null> {
  const { data, error } = await adminClient
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle();
  if (error) throw error;
  return data as Payment | null;
}

export async function getEmailBySessionId(sessionId: string): Promise<string | null> {
  const { data, error } = await adminClient
    .from('payments')
    .select('email')
    .eq('session_id', sessionId)
    .eq('status', 'done')
    .maybeSingle();
  if (error) throw error;
  return (data as { email: string | null } | null)?.email ?? null;
}
