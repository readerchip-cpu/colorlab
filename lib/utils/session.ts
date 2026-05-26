import { adminClient } from '@/lib/supabase/admin';
import type { FreeResult, TestAnswers, TestSession } from '@/types';

export async function createTestSession(
  answers: TestAnswers,
  freeResult: FreeResult,
): Promise<string> {
  const { data, error } = await adminClient
    .from('test_sessions')
    .insert({
      answers,
      free_concern: null,
      result_type: freeResult.colorType,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function getTestSession(id: string): Promise<TestSession> {
  const { data, error } = await adminClient
    .from('test_sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as TestSession;
}

export async function updateSessionPaid(id: string): Promise<void> {
  const { error } = await adminClient
    .from('test_sessions')
    .update({ is_paid: true })
    .eq('id', id);

  if (error) throw error;
}

export async function saveReportContent(
  id: string,
  content: string,
  customerName?: string,
): Promise<void> {
  const patch: Record<string, unknown> = {
    report_content: content,
    analysis_status: 'completed',
  };
  if (customerName !== undefined) patch.customer_name = customerName || null;

  const { error } = await adminClient
    .from('test_sessions')
    .update(patch)
    .eq('id', id);

  if (error) throw error;
}

/*
 * ── Supabase 마이그레이션 안내 ──────────────────────────────────
 * customer_name 컬럼이 없는 경우, Supabase SQL Editor에서 아래 SQL을 실행하세요:
 *
 *   ALTER TABLE test_sessions
 *     ADD COLUMN IF NOT EXISTS customer_name text;
 *
 * ──────────────────────────────────────────────────────────────
 */
