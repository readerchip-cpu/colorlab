import { adminClient } from '@/lib/supabase/admin';
import type { FreeResult, TestAnswers, TestSession } from '@/types';

export async function createTestSession(
  answers: TestAnswers,
  freeResult: FreeResult,
  meta?: { referrer?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string },
): Promise<string> {
  const now = new Date().toISOString();
  const { data, error } = await adminClient
    .from('test_sessions')
    .insert({
      answers,
      free_concern: null,
      result_type: freeResult.colorType,
      started_at: now,
      diagnosis_completed_at: now,
      referrer: meta?.referrer || null,
      utm_source: meta?.utm_source || null,
      utm_medium: meta?.utm_medium || null,
      utm_campaign: meta?.utm_campaign || null,
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
    .update({ is_paid: true, paid_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function saveReportContent(
  id: string,
  content: string,
  customerName?: string,
): Promise<void> {
  const safeName = customerName?.trim() || '고객';

  const { error } = await adminClient
    .from('test_sessions')
    .update({
      report_content: content,
      analysis_status: 'completed',
      analysis_completed_at: new Date().toISOString(),
      customer_name: safeName,
    })
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
