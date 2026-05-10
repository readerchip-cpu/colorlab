'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import type { Question } from '@/types';

interface Props {
  question: Question;
  selectedValue?: string;
  onSelect: (value: string) => void;
}

const CATEGORY_STYLE: Record<string, string> = {
  피부: 'bg-rose-50 text-rose-500',
  눈: 'bg-sky-50 text-sky-500',
  머리: 'bg-amber-50 text-amber-500',
  스타일링: 'bg-violet-50 text-violet-500',
  고민: 'bg-emerald-50 text-emerald-500',
};

function TextOptions({
  options,
  selectedValue,
  onSelect,
}: {
  options: Question['options'];
  selectedValue?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const active = opt.value === selectedValue;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={cn(
              'w-full rounded-2xl border-2 px-5 py-4 text-left text-sm font-medium transition-all duration-150',
              active
                ? 'border-[#7C3AED] bg-violet-50 text-[#7C3AED]'
                : 'border-gray-100 bg-white text-gray-700 hover:border-violet-200 hover:bg-violet-50/40',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ImageOptions({
  options,
  selectedValue,
  onSelect,
}: {
  options: Question['options'];
  selectedValue?: string;
  onSelect: (value: string) => void;
}) {
  const isOdd = options.length % 2 !== 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt, idx) => {
        const active = opt.value === selectedValue;
        const isLast = isOdd && idx === options.length - 1;

        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={cn(
              'flex flex-col items-center gap-2.5 rounded-2xl border-2 p-3 text-center transition-all duration-150',
              isLast && 'col-span-2 mx-auto w-[calc(50%-6px)]',
              active
                ? 'border-[#7C3AED] bg-violet-50'
                : 'border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50/40',
            )}
          >
            <div
              className={cn(
                'flex h-24 w-full items-center justify-center overflow-hidden rounded-xl',
                active ? 'bg-violet-100' : 'bg-gray-50',
              )}
            >
              {opt.imageUrl ? (
                <Image
                  src={opt.imageUrl}
                  alt={opt.label}
                  width={160}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-300">이미지</span>
              )}
            </div>
            <span
              className={cn(
                'text-xs font-medium leading-tight',
                active ? 'text-[#7C3AED]' : 'text-gray-600',
              )}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function QuestionCard({ question, selectedValue, onSelect }: Props) {
  return (
    <div className="mx-auto max-w-xl px-5 pb-28 pt-28">
      <div className="mb-5">
        <span
          className={cn(
            'inline-block rounded-full px-3 py-1 text-xs font-semibold',
            CATEGORY_STYLE[question.category] ?? 'bg-gray-100 text-gray-500',
          )}
        >
          {question.category}
        </span>
      </div>

      <h2 className="mb-8 text-xl font-bold leading-snug tracking-tight text-gray-900">
        {question.question}
      </h2>

      {question.type === 'text' ? (
        <TextOptions
          options={question.options}
          selectedValue={selectedValue}
          onSelect={onSelect}
        />
      ) : (
        <ImageOptions
          options={question.options}
          selectedValue={selectedValue}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
