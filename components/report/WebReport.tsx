'use client';

import Script from 'next/script';
import { CoverSection } from './sections/CoverSection';
import { ImpressionSection } from './sections/ImpressionSection';
import { PaletteSection } from './sections/PaletteSection';
import { MakeupSection } from './sections/MakeupSection';
import { HairFashionSection } from './sections/HairFashionSection';
import { CelebritySection } from './sections/CelebritySection';
import { ShareButtons } from './ShareButtons';
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

export function WebReport({ data, pdfPageHref, customerName }: WebReportProps) {
  const accent = data.meta.accentColor;

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
      />

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

          <div className="mt-12 pb-12">
            <ShareButtons
              pdfHref={pdfPageHref}
              customerName={customerName}
              typeNameKr={data.meta.typeNameKr}
              accentColor={accent}
            />
          </div>

        </div>
      </div>
    </>
  );
}
