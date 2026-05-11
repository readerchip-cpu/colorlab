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
): Promise<void> {
  const { error } = await adminClient
    .from('test_sessions')
    .update({ report_content: content })
    .eq('id', id);

  if (error) throw error;
}
