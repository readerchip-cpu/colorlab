'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface Props {
  onBack: () => void;
  onSubmit: (text?: string) => void;
  isLoading: boolean;
}

const MAX = 200;

export default function FreeTextQuestion({ onBack, onSubmit, isLoading }: Props) {
  const [text, setText] = useState('');

  return (
    <div className="mx-auto max-w-xl px-5 pb-12 pt-28">
      {/* 뒤로가기 */}
      <button
        onClick={onBack}
        disabled={isLoading}
        className="mb-6 flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
      >
        ← 이전 문항
      </button>

      <div className="mb-5">
        <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-500">
          나의 고민
        </span>
      </div>

      <h2 className="mb-1.5 text-xl font-bold leading-snug tracking-tight text-gray-900">
        퍼스널컬러와 관련해 평소 고민이나 궁금한 점이 있다면 자유롭게 적어주세요.
      </h2>
      <p className="mb-7 text-sm text-gray-400">선택 사항이에요. 건너뛰어도 됩니다.</p>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX))}
          placeholder="예: 요즘 트렌드 컬러를 시도해보고 싶은데 어떻게 소화해야 할지 모르겠어요."
          rows={5}
          disabled={isLoading}
          className="w-full resize-none rounded-2xl border-2 border-gray-100 bg-white px-4 py-3.5 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-300 focus:border-[#7C3AED] disabled:opacity-60"
        />
        <span
          className={cn(
            'absolute bottom-3.5 right-4 text-xs transition-colors',
            text.length >= MAX ? 'text-red-400' : 'text-gray-300',
          )}
        >
          {text.length} / {MAX}
        </span>
      </div>

      {/* 버튼 */}
      <div className="mt-5 flex flex-col gap-3">
        <button
          onClick={() => onSubmit(text.trim() || undefined)}
          disabled={isLoading}
          className="w-full rounded-2xl bg-[#7C3AED] py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isLoading ? '분석 중...' : '결과 보기'}
        </button>
        <button
          onClick={() => onSubmit(undefined)}
          disabled={isLoading}
          className="w-full rounded-2xl border-2 border-gray-100 py-3.5 text-sm font-medium text-gray-500 transition-colors hover:border-gray-200 hover:text-gray-700 disabled:opacity-60"
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}
