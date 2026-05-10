'use client';

import { cn } from '@/lib/utils/cn';

interface Section {
  number: number;
  title: string;
}

interface Props {
  sections: Section[];
}

const SECTION_ICON: Record<number, string> = {
  1: '🔬', 2: '🚫', 3: '💄', 4: '✂️', 5: '👗', 6: '🌸', 7: '✨',
};

export default function TableOfContents({ sections }: Props) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // sticky TOC 높이(약 52px)를 감안한 offset
    const y = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-0 z-10 -mx-5 overflow-x-auto border-b border-gray-100 bg-white/95 px-5 py-2.5 backdrop-blur-sm">
      <div className="flex min-w-max gap-2">
        {sections.map((s) => (
          <button
            key={s.number}
            onClick={() => scrollTo(`section-${s.number}`)}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600',
              'transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700',
            )}
          >
            <span>{SECTION_ICON[s.number]}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
