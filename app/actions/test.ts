'use server';

import { buildFreeResult, determineColorType } from '@/lib/colorLogic';
import { generateFreeResult } from '@/lib/anthropic/client';
import { createTestSession, saveReportContent } from '@/lib/utils/session';
import type { TestAnswers } from '@/types';

export async function submitTestAction(answers: TestAnswers): Promise<string> {
  const colorType = determineColorType(answers);
  const freeResult = buildFreeResult('', answers);

  // 세션 생성과 AI 요약 생성을 병렬 실행
  const [sessionId, summary] = await Promise.all([
    createTestSession(answers, freeResult),
    generateFreeResult(answers, colorType).catch(() => ''),
  ]);

  if (summary) {
    await saveReportContent(sessionId, summary);
  }

  return sessionId;
}
