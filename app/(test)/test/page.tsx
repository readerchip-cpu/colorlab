'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/lib/questions';
import { useTestStore } from '@/lib/store/testStore';
import { submitTestAction } from '@/app/actions/test';
import ProgressBar from '@/components/test/ProgressBar';
import QuestionCard from '@/components/test/QuestionCard';
import FreeTextQuestion from '@/components/test/FreeTextQuestion';
import type { TestAnswers } from '@/types';

const LAST_STEP = QUESTIONS.length - 1; // 10 = Q11

export default function TestPage() {
  const router = useRouter();
  const { currentStep, answers, isLoading, setAnswer, nextStep, prevStep, setLoading } =
    useTestStore();

  const [visible, setVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentStep];

  // 질문 전환 fade 애니메이션
  const transition = useCallback((fn: () => void) => {
    setVisible(false);
    setTimeout(() => {
      fn();
      setVisible(true);
    }, 180);
  }, []);

  // 객관식 선택 → 300ms 후 자동 이동
  const handleSelect = useCallback(
    (value: string) => {
      const key = `Q${currentQuestion.id}` as keyof TestAnswers;
      setAnswer(key, value);

      setTimeout(() => {
        transition(() => nextStep());
      }, 300);
    },
    [currentQuestion.id, nextStep, setAnswer, transition],
  );

  const handleBack = useCallback(() => {
    setError(null);
    transition(() => prevStep());
  }, [prevStep, transition]);

  // Q11 제출
  const handleSubmit = useCallback(
    async (freeText?: string) => {
      setError(null);
      setLoading(true);

      const fullAnswers: TestAnswers = {
        ...(answers as Omit<TestAnswers, 'Q11'>),
        ...(freeText ? { Q11: freeText } : {}),
      };

      try {
        const sessionId = await submitTestAction(fullAnswers);
        router.push(`/result/${sessionId}`);
      } catch (err) {
        console.error('Test submission failed:', err);
        setError('분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
        setLoading(false);
      }
    },
    [answers, router, setLoading],
  );

  return (
    <main className="min-h-screen bg-white">
      {/* 상단 진행 바 */}
      <ProgressBar current={currentStep + 1} total={QUESTIONS.length} />

      {/* 질문 영역 — fade 전환 */}
      <div
        className="transition-all duration-200 ease-in-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        {currentStep < LAST_STEP ? (
          <QuestionCard
            question={currentQuestion}
            selectedValue={answers[`Q${currentQuestion.id}` as keyof TestAnswers]}
            onSelect={handleSelect}
          />
        ) : (
          <FreeTextQuestion
            onBack={handleBack}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* 오류 메시지 */}
      {error && (
        <div className="fixed bottom-24 left-0 right-0 z-30 px-5">
          <div className="mx-auto max-w-xl rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-500">
            {error}
          </div>
        </div>
      )}

      {/* 뒤로가기 — Q2~Q10에서만 표시 (Q11은 자체 버튼 보유) */}
      {currentStep > 0 && currentStep < LAST_STEP && !isLoading && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent pb-8 pt-10">
          <div className="mx-auto max-w-xl px-5">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-700"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              이전 문항
            </button>
          </div>
        </div>
      )}

      {/* 분석 로딩 오버레이 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <div className="relative mb-8 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-violet-100 border-t-[#7C3AED]" />
            <span className="text-2xl">🎨</span>
          </div>
          <p className="text-lg font-bold text-gray-800">퍼스널컬러를 분석하고 있어요</p>
          <p className="mt-2 text-sm text-gray-400">잠시만 기다려주세요...</p>
        </div>
      )}
    </main>
  );
}
