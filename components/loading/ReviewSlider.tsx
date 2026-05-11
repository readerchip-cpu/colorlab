'use client';

import { useState, useEffect } from 'react';

const REVIEWS = [
  { text: '내가 봄 라이트라니! 매번 칙칙해 보였던 이유를 알았어요.', name: '김**' },
  { text: '10년간 의문이었던 색감 고민이 풀렸어요.', name: '이**' },
  { text: '친구도 결과 보고 자기도 해본대요.', name: '박**' },
  { text: '메이크업 가이드가 진짜 도움됐어요.', name: '최**' },
  { text: '립스틱 색 고르기가 이렇게 쉬울 줄이야.', name: '정**' },
];

const VISIBLE_MS = 2500; // 리뷰 노출 시간
const FADE_MS = 500;     // 페이드 전환 시간

export default function ReviewSlider() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);

    const hideTimer = setTimeout(() => setVisible(false), VISIBLE_MS);
    const nextTimer = setTimeout(() => {
      setCurrentIdx((i) => (i + 1) % REVIEWS.length);
    }, VISIBLE_MS + FADE_MS);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [currentIdx]);

  const review = REVIEWS[currentIdx];

  return (
    <div className="w-full max-w-sm">
      <div
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease-in-out`,
        }}
        className="rounded-3xl bg-white px-6 py-5 shadow-lg ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700"
      >
        {/* 별점 */}
        <div className="mb-3 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="#FACC15"
              aria-hidden="true"
            >
              <path d="M7 1l1.545 3.13 3.455.502-2.5 2.436.59 3.44L7 8.885 3.91 10.508l.59-3.44L2 4.632l3.455-.502L7 1z" />
            </svg>
          ))}
        </div>

        {/* 리뷰 텍스트 */}
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          &ldquo;{review.text}&rdquo;
        </p>

        {/* 작성자 */}
        <p className="mt-3 text-xs font-semibold text-gray-400 dark:text-gray-500">
          {review.name}
        </p>
      </div>

      {/* 인디케이터 */}
      <div className="mt-3 flex justify-center gap-1.5">
        {REVIEWS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIdx
                ? 'w-4 bg-violet-400'
                : 'w-1.5 bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
