'use client';

import Link from 'next/link';
import { CoverSection } from './sections/CoverSection';
import { ImpressionSection } from './sections/ImpressionSection';
import { PaletteSection } from './sections/PaletteSection';
import { MakeupSection } from './sections/MakeupSection';
import { HairFashionSection } from './sections/HairFashionSection';
import { CelebritySection } from './sections/CelebritySection';
import type { ReportData } from '@/types/report';

interface WebReportProps {
  data: ReportData;
  pdfPageHref: string;
  customerName: string;
  sessionId: string;
}

function SectionDivider() {
  return <div className="my-10 border-t border-gray-100 dark:border-gray-800" />;
}

function share(colorType: string) {
  const url = window.location.href;
  const text = `${colorType} 퍼스널컬러 분석 결과를 확인해보세요!`;
  if (navigator.share) {
    navigator.share({ title: '컬러랩 퍼스널컬러', text, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => alert('링크가 복사되었어요!')).catch(() => {});
  }
}

export function WebReport({ data, pdfPageHref, customerName, sessionId }: WebReportProps) {
  const accent = data.meta.accentColor;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">

        <CoverSection data={data} customerName={customerName} />
        <SectionDivider />

        <ImpressionSection data={data} customerName={customerName} />
        <SectionDivider />

        <PaletteSection data={data} customerName={customerName} />
        <SectionDivider />

        <MakeupSection data={data} customerName={customerName} />
        <SectionDivider />

        <HairFashionSection data={data} customerName={customerName} />
        <SectionDivider />

        <CelebritySection data={data} customerName={customerName} />

        {/* 하단 액션 영역 */}
        <div className="mt-12 space-y-3 pb-10">
          <Link
            href={pdfPageHref}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white shadow-lg transition hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            <span>PDF 보기 / 다운로드</span>
          </Link>

          <button
            onClick={() => share(data.meta.typeNameKr)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 py-4 text-base font-bold transition hover:bg-gray-50 dark:hover:bg-gray-800"
            style={{ borderColor: accent, color: accent }}
          >
            <span>결과 공유하기</span>
          </button>

          <div className="pt-4 text-center">
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">친구의 퍼스널컬러도 궁금하다면?</p>
            <Link
              href="/"
              className="inline-block rounded-2xl border-2 border-gray-200 px-8 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400"
            >
              컬러랩을 친구에게 공유하기
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
