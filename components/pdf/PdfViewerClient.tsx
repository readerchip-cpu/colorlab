'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import type { PersonalColorType } from '@/types';

// PDFViewer, PDFDownloadLink, ReportPDF are all client/browser only
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then(m => ({ default: m.PDFViewer })),
  { ssr: false },
);

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(m => ({ default: m.PDFDownloadLink })),
  { ssr: false },
);

const ReportPDF = dynamic(
  () => import('./ReportPDF'),
  { ssr: false },
);

interface Props {
  sessionId:     string;
  colorType:     PersonalColorType;
  reportContent: string;
  createdAt:     string;
}

function Spinner() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#FAF8F3]">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">🎨</span>
      </div>
      <p className="text-sm font-medium text-gray-500">PDF를 생성하고 있어요…</p>
    </div>
  );
}

export default function PdfViewerClient({ sessionId, colorType, reportContent, createdAt }: Props) {
  const fileName = `컬러랩-${colorType}-리포트.pdf`;
  const backHref = `/report/${sessionId}`;

  const doc = (
    <ReportPDF
      colorType={colorType}
      sessionId={sessionId}
      reportContent={reportContent}
      createdAt={createdAt.slice(0, 10)}
    />
  );

  return (
    <div className="flex h-screen flex-col bg-[#FAF8F3]">
      {/* ── 상단 툴바 ── */}
      <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#EDE9E1] bg-white px-4 shadow-sm">
        <Link
          href={backHref}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          리포트로 돌아가기
        </Link>

        <span className="absolute left-1/2 -translate-x-1/2 text-sm font-bold text-gray-800">
          {colorType} 분석 리포트
        </span>

        {/* PDFDownloadLink — 동적 로드 후 렌더 */}
        <PDFDownloadLink document={doc} fileName={fileName}>
          {({ loading }) => (
            <button
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-violet-700 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {loading ? '생성 중…' : 'PDF 다운로드'}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {/* ── PDF 뷰어 ── */}
      <div className="flex-1 overflow-hidden">
        <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: 'none' }}>
          {doc}
        </PDFViewer>
      </div>
    </div>
  );
}
