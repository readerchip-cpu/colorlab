'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/lib/questions';
import { useTestStore } from '@/lib/store/testStore';
import { submitTestAction } from '@/app/actions/test';
import ProgressBar from '@/components/test/ProgressBar';
import QuestionCard from '@/components/test/QuestionCard';
import ReviewSlider from '@/components/loading/ReviewSlider';
import type { TestAnswers } from '@/types';

const LAST_STEP = QUESTIONS.length - 1; // 9 = Q10

export default function TestPage() {
  const router = useRouter();
  const { currentStep, isLoading, setAnswer, toggleMultiAnswer, nextStep, prevStep, setLoading } =
    useTestStore();
  const answers = useTestStore((s) => s.answers);

  const [visible, setVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentStep];
  const isMulti = currentQuestion.multiSelect;

  // 현재 다중 선택 문항에서 1개 이상 선택됐는지 확인
  const currentAnswer = answers[`Q${currentQuestion.id}` as keyof TestAnswers];
  const hasMultiSelection = Array.isArray(currentAnswer) && currentAnswer.length > 0;

  const transition = useCallback((fn: () => void) => {
    setVisible(false);
    setTimeout(() => {
      fn();
      setVisible(true);
    }, 180);
  }, []);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setLoading(true);
    const freshAnswers = useTestStore.getState().answers;
    try {
      const meta = {
        referrer: document.referrer || undefined,
        utm_source: new URLSearchParams(window.location.search).get('utm_source') ?? undefined,
      };
      const sessionId = await submitTestAction(freshAnswers as TestAnswers, meta);
      router.push(`/result/${sessionId}`);
    } catch (err) {
      console.error('Test submission failed:', err);
      setError('분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      setLoading(false);
    }
  }, [router, setLoading]);

  // 단일 선택: 답변 저장 후 자동 진행
  const handleSingleSelect = useCallback(
    (value: string) => {
      const key = `Q${currentQuestion.id}` as keyof TestAnswers;
      setAnswer(key, value);

      if (currentStep === LAST_STEP) {
        setTimeout(() => handleSubmit(), 300);
      } else {
        setTimeout(() => transition(() => nextStep()), 300);
      }
    },
    [currentQuestion.id, currentStep, handleSubmit, nextStep, setAnswer, transition],
  );

  // 다중 선택: 값 토글만 수행 (진행은 "다음" 버튼)
  const handleMultiToggle = useCallback(
    (value: string) => {
      const key = `Q${currentQuestion.id}` as 'Q3' | 'Q9' | 'Q10';
      toggleMultiAnswer(key, value);
    },
    [currentQuestion.id, toggleMultiAnswer],
  );

  // 다중 선택 "다음" 버튼
  const handleNext = useCallback(() => {
    if (currentStep === LAST_STEP) {
      handleSubmit();
    } else {
      transition(() => nextStep());
    }
  }, [currentStep, handleSubmit, nextStep, transition]);

  const handleBack = useCallback(() => {
    setError(null);
    transition(() => prevStep());
  }, [prevStep, transition]);

  const showBottomBar = !isLoading && (currentStep > 0 || isMulti);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
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
        <QuestionCard
          question={currentQuestion}
          selectedValue={currentAnswer}
          onSelect={isMulti ? handleMultiToggle : handleSingleSelect}
        />
      </div>

      {/* 오류 메시지 */}
      {error && (
        <div className="fixed bottom-24 left-0 right-0 z-30 px-5">
          <div className="mx-auto max-w-xl rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-500 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* 하단 고정 버튼 영역 */}
      {showBottomBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent pb-8 pt-6 dark:bg-gray-900 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
          <div className="mx-auto flex max-w-xl flex-col gap-3 px-5">
            {/* 다중 선택 "다음" 버튼 */}
            {isMulti && (
              <button
                onClick={handleNext}
                disabled={!hasMultiSelection}
                className="w-full rounded-2xl bg-[#7C3AED] py-4 text-lg md:text-base font-bold text-white shadow-lg shadow-violet-200 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                다음
              </button>
            )}

            {/* 이전 문항 버튼 */}
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
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
            )}
          </div>
        </div>
      )}

      {/* 분석 로딩 오버레이 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white px-5 dark:bg-gray-900">
          {/* 스피너 */}
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-violet-100 border-t-[#7C3AED]" />
            <span className="text-xl">🎨</span>
          </div>

          {/* 상태 텍스트 */}
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
              퍼스널컬러를 분석하고 있어요
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              잠시만 기다려주세요...
            </p>
          </div>

          {/* 리뷰 슬라이더 */}
          <ReviewSlider />
        </div>
      )}
    </main>
  );
}
