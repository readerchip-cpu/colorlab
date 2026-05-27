'use client';

import { useState, useEffect } from 'react';

interface Props {
  customerName?: string;
}

const TOTAL_SECONDS = 100;

const STEPS = [
  {
    label: '사진 분석 중',
    detail: 'AI가 피부톤·언더톤을 정밀하게 분석하고 있어요',
    icon: '📸',
    from: 0,
    to: 25,
  },
  {
    label: '컬러 타입 매칭',
    detail: '8가지 퍼스널컬러 타입 중 가장 잘 어울리는 톤을 찾고 있어요',
    icon: '🎨',
    from: 25,
    to: 55,
  },
  {
    label: '셀러브리티 비교',
    detail: '비슷한 톤의 유명인을 찾아 스타일링 참고 자료를 만들고 있어요',
    icon: '✨',
    from: 55,
    to: 80,
  },
  {
    label: '맞춤 리포트 작성',
    detail: '메이크업·헤어·패션·계절별 스타일링 가이드를 정리하고 있어요',
    icon: '📝',
    from: 80,
    to: 100,
  },
] as const;

export function AnalysisProgress({ customerName = '고객' }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((prev) => (prev >= TOTAL_SECONDS ? TOTAL_SECONDS : prev + 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const currentStep = STEPS.findIndex((s) => elapsed >= s.from && elapsed < s.to);
  const activeStep = currentStep === -1 ? STEPS.length - 1 : currentStep;

  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);
  const remainingDisplay =
    remaining > 60
      ? `약 ${Math.ceil(remaining / 60)}분`
      : remaining > 0
        ? `약 ${remaining}초`
        : '거의 다 됐어요!';

  const progressPercent = Math.min((elapsed / TOTAL_SECONDS) * 100, 100);

  return (
    <div className="mx-auto w-full max-w-md px-6 py-8">
      {/* 메인 메시지 */}
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          AI가 분석 중이에요
        </h2>
        <p className="mb-1 text-base text-gray-600 dark:text-gray-400">
          {customerName}님의 사진을 정밀하게 살펴보고 있어요
        </p>
        <p className="text-sm font-bold text-violet-600 dark:text-violet-400">
          남은 시간: {remainingDisplay}
        </p>
      </div>

      {/* 진행 단계 */}
      <div className="mb-8 space-y-3">
        {STEPS.map((step, i) => {
          const isActive = i === activeStep;
          const isDone = i < activeStep;

          return (
            <div
              key={step.label}
              className={[
                'flex items-center gap-3 rounded-xl border-l-4 p-4 transition-all duration-500',
                isActive
                  ? 'scale-[1.02] border-violet-600 bg-violet-50 dark:bg-violet-950/30'
                  : isDone
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                    : 'border-gray-300 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800',
              ].join(' ')}
            >
              <span className="flex-shrink-0 text-2xl">
                {isDone ? '✓' : step.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={[
                    'mb-0.5 text-sm font-bold',
                    isActive
                      ? 'text-violet-700 dark:text-violet-400'
                      : isDone
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400',
                  ].join(' ')}
                >
                  {step.label}
                  {isActive && <span className="ml-2 animate-pulse">...</span>}
                </p>
                {isActive && (
                  <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    {step.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 진행 바 */}
      <div className="mb-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-violet-600 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          {Math.round(progressPercent)}% 완료
        </p>
      </div>

      {/* 이탈 경고 */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-500">
        ⚠️ 페이지를 닫거나 새로고침하지 마세요
      </p>
    </div>
  );
}
