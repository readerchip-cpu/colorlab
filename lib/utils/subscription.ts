import { adminClient } from '@/lib/supabase/admin';

export async function createSubscription({
  customerId,
  billingKey,
  email,
  phone,
  amount,
  nextPayAt,
}: {
  customerId: string;
  billingKey: string;
  email?: string;
  phone?: string;
  amount: number;
  nextPayAt: string;
}): Promise<void> {
  const { error } = await adminClient.from('billing_subscriptions').insert({
    customer_id: customerId,
    billing_key: billingKey,
    email: email ?? null,
    phone: phone ?? null,
    amount,
    status: 'active',
    last_paid_at: new Date().toISOString(),
    next_pay_at: nextPayAt,
  });
  if (error) throw error;
}

export async function cancelSubscription(customerId: string): Promise<void> {
  const { error } = await adminClient
    .from('billing_subscriptions')
    .update({ status: 'canceled', canceled_at: new Date().toISOString() })
    .eq('customer_id', customerId)
    .eq('status', 'active');
  if (error) throw error;
}
