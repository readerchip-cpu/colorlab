'use client';

import { cn } from '@/lib/utils/cn';
import type { Question } from '@/types';

interface Props {
  question: Question;
  selectedValue?: string | string[];
  onSelect: (value: string) => void;
}

const CATEGORY_STYLE: Record<string, string> = {
  피부: 'bg-rose-50 text-rose-500 dark:bg-rose-900/40 dark:text-rose-400',
  눈: 'bg-sky-50 text-sky-500 dark:bg-sky-900/40 dark:text-sky-400',
  머리: 'bg-amber-50 text-amber-500 dark:bg-amber-900/40 dark:text-amber-400',
  스타일링: 'bg-violet-50 text-violet-500 dark:bg-violet-900/40 dark:text-violet-400',
  고민: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/40 dark:text-emerald-400',
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
              'w-full rounded-2xl border-2 px-5 py-4 text-left text-base md:text-sm font-medium transition-all duration-150',
              active
                ? 'border-[#7C3AED] bg-violet-50 text-[#7C3AED] dark:bg-violet-900/30 dark:text-purple-400'
                : 'border-gray-100 bg-white text-gray-700 hover:border-violet-200 hover:bg-violet-50/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-violet-700 dark:hover:bg-violet-900/20',
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
                ? 'border-[#7C3AED] bg-violet-50 dark:bg-violet-900/30'
                : 'border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50/40 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-violet-700 dark:hover:bg-violet-900/20',
            )}
          >
            <div
              className={cn(
                'flex h-24 w-full items-center justify-center overflow-hidden rounded-xl',
                active ? 'bg-violet-100 dark:bg-violet-900/40' : 'bg-gray-50 dark:bg-gray-700',
              )}
            >
              {opt.imageUrl ? (
                <img
                  src={opt.imageUrl}
                  alt={opt.label}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-xs text-gray-300 dark:text-gray-600">이미지</span>
              )}
            </div>
            <span
              className={cn(
                'text-xs font-medium leading-tight',
                active ? 'text-[#7C3AED] dark:text-purple-400' : 'text-gray-600 dark:text-gray-400',
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

function MultiSelectOptions({
  options,
  selectedValues,
  onToggle,
}: {
  options: Question['options'];
  selectedValues: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const active = selectedValues.includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => onToggle(opt.value)}
            className={cn(
              'flex w-full items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left text-base md:text-sm font-medium transition-all duration-150',
              active
                ? 'border-[#7C3AED] bg-violet-50 text-[#7C3AED] dark:bg-violet-900/30 dark:text-purple-400'
                : 'border-gray-100 bg-white text-gray-700 hover:border-violet-200 hover:bg-violet-50/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-violet-700 dark:hover:bg-violet-900/20',
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                active
                  ? 'border-[#7C3AED] bg-[#7C3AED]'
                  : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700',
              )}
            >
              {active && (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true">
                  <path
                    d="M1 4.5L4.5 8L11 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function QuestionCard({ question, selectedValue, onSelect }: Props) {
  const isMulti = question.multiSelect;
  const selectedArr = Array.isArray(selectedValue) ? selectedValue : [];
  const selectedStr = typeof selectedValue === 'string' ? selectedValue : undefined;

  return (
    <div className={cn('mx-auto max-w-xl px-5 pt-28', isMulti ? 'pb-52' : 'pb-28')}>
      <div className="mb-5">
        <span
          className={cn(
            'inline-block rounded-full px-3 py-1 text-xs font-semibold',
            CATEGORY_STYLE[question.category] ?? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
          )}
        >
          {question.category}
        </span>
      </div>

      <h2
        className={cn(
          'text-2xl md:text-xl font-bold leading-snug tracking-tight text-gray-900 dark:text-gray-100',
          isMulti ? 'mb-2' : 'mb-8',
        )}
      >
        {question.question}
      </h2>

      {isMulti && (
        <p className="mb-6 text-sm text-gray-400 dark:text-gray-500">(중복 선택 가능)</p>
      )}

      {isMulti ? (
        <MultiSelectOptions
          options={question.options}
          selectedValues={selectedArr}
          onToggle={onSelect}
        />
      ) : question.type === 'text' ? (
        <TextOptions
          options={question.options}
          selectedValue={selectedStr}
          onSelect={onSelect}
        />
      ) : (
        <ImageOptions
          options={question.options}
          selectedValue={selectedStr}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
