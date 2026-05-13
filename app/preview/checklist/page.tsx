'use client';

import { useState } from 'react';
import Link from 'next/link';

const ITEMS = [
  { id: 1,  text: '표지에 사용자 이름이 크게 표시되는가',                    section: '표지 (p.1)' },
  { id: 2,  text: '인사말이 자연스럽고 따뜻한가',                            section: '표지 (p.1)' },
  { id: 3,  text: '사진 분석 결과(photoImpression)가 구체적인가',             section: '타입 분석 (p.2)' },
  { id: 4,  text: '4분면 차트의 사용자 위치 점이 정확한가',                   section: '타입 분석 (p.2)' },
  { id: 5,  text: '컬러 팔레트(Best 8개, Worst 4개)가 시각적으로 풍부한가',   section: '컬러 팔레트 (p.3)' },
  { id: 6,  text: '메이크업 추천이 카드 형태로 정돈되어 있는가',               section: '메이크업 & 헤어 (p.4)' },
  { id: 7,  text: '헤어 컬러 섹션에 시각적 요소가 있는가',                    section: '메이크업 & 헤어 (p.4)' },
  { id: 8,  text: '시즌별 스타일링이 4계절 카드로 표현되는가',                 section: '패션 & 시즌 (p.5)' },
  { id: 9,  text: '유명인 4–5명이 카드 형태로 표시되는가',                    section: '셀러브리티 (p.6)' },
  { id: 10, text: '유명인 추천이 2030이 알 만한 인물인가',                    section: '셀러브리티 (p.6)' },
  { id: 11, text: '각 섹션에 사용자 이름이 자연스럽게 등장하는가',             section: '전체 페이지' },
  { id: 12, text: '여백이 적절히 채워져 있는가 (너무 비어 보이지 않음)',        section: '전체 페이지' },
  { id: 13, text: '페이지마다 페이지 번호와 섹션명이 있는가',                  section: '전체 페이지' },
  { id: 14, text: '푸터에 컬러랩 로고와 면책 문구가 있는가',                   section: '전체 페이지' },
] as const;

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const total = ITEMS.length;
  const done  = checked.size;
  const pct   = Math.round((done / total) * 100);

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-4 py-10">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold tracking-widest text-violet-400 uppercase">
            COLORLAB · Preview
          </p>
          <h1 className="text-2xl font-bold text-gray-900">PDF 리포트 체크리스트</h1>
          <p className="mt-1 text-sm text-gray-500">
            미리보기를 보면서 각 항목을 확인하세요.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm border border-[#EDE9E1]">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">진행률</span>
            <span className="font-bold text-violet-600">{done} / {total}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-violet-100">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          {done === total && (
            <p className="mt-2 text-center text-sm font-semibold text-violet-600">
              ✓ 모든 항목 확인 완료!
            </p>
          )}
        </div>

        {/* Preview link banner */}
        <Link
          href="/preview/report"
          target="_blank"
          className="mb-6 flex items-center justify-between rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
        >
          <span>📄 PDF 미리보기 새 탭에서 열기</span>
          <span className="text-violet-400">→</span>
        </Link>

        {/* Checklist */}
        <div className="space-y-2">
          {ITEMS.map((item) => {
            const isChecked = checked.has(item.id);
            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition ${
                  isChecked
                    ? 'border-violet-200 bg-violet-50'
                    : 'border-[#EDE9E1] bg-white'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggle(item.id)}
                  aria-label={isChecked ? '체크 해제' : '체크'}
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition ${
                    isChecked
                      ? 'border-violet-500 bg-violet-500 text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isChecked && (
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="mr-2 text-xs font-bold text-gray-300">
                        {String(item.id).padStart(2, '0')}
                      </span>
                      <span className={`text-sm font-medium ${isChecked ? 'text-violet-700 line-through decoration-violet-300' : 'text-gray-800'}`}>
                        {item.text}
                      </span>
                    </div>
                    <Link
                      href="/preview/report"
                      target="_blank"
                      className="flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-500 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
                    >
                      확인 →
                    </Link>
                  </div>
                  <span className="mt-0.5 block text-xs text-gray-400">{item.section}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          COLORLAB · PDF 프리뷰 체크리스트
        </div>
      </div>
    </div>
  );
}
