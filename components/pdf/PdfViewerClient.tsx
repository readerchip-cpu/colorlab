'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import ReportPDF from './ReportPDF';
import type { ReportData } from '@/types/report';

// BlobProvider는 URL.createObjectURL 등 브라우저 API 사용 → SSR 비활성화
const BlobProvider = dynamic(
  () => import('@react-pdf/renderer').then(m => ({ default: m.BlobProvider })),
  { ssr: false },
);

interface Props {
  reportData: ReportData;
  sessionId: string;
  customerName?: string;
  createdAt: string;
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

export default function PdfViewerClient({ reportData, sessionId, customerName, createdAt }: Props) {
  const colorType = reportData.meta.typeNameKr;
  const safeName = (customerName ?? '').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '_').substring(0, 20);
  const dateStr = createdAt.slice(0, 10).replace(/-/g, '');
  const fileName = safeName ? `컬러랩_${safeName}_${dateStr}.pdf` : `컬러랩_${colorType.replace(/\s/g, '_')}_${dateStr}.pdf`;
  const backHref = `/report/${sessionId}`;

  // useMemo로 doc을 안정화 — 재렌더마다 새 객체가 생성되지 않도록
  const doc = useMemo(
    () => (
      <ReportPDF
        data={reportData}
        sessionId={sessionId}
        createdAt={createdAt.slice(0, 10)}
      />
    ),
    [reportData, sessionId, createdAt],
  );

  return (
    <BlobProvider document={doc}>
      {({ url, loading, error }) => (
        <div className="flex h-screen flex-col bg-[#FAF8F3]">

          {/* ── 상단 툴바 ── */}
          <div className="relative flex h-14 flex-shrink-0 items-center justify-between border-b border-[#EDE9E1] bg-white px-4 shadow-sm">
            <Link
              href={backHref}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              리포트로 돌아가기
            </Link>

            <span className="absolute left-1/2 -translate-x-1/2 hidden text-sm font-bold text-gray-800 sm:block">
              {colorType} 분석 리포트
            </span>

            {/* 다운로드: blob URL을 href로, download 속성으로 파일명 지정 */}
            <a
              href={url ?? undefined}
              download={fileName}
              aria-disabled={loading || !url}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white shadow transition ${
                loading || !url
                  ? 'pointer-events-none bg-violet-300'
                  : 'bg-violet-600 hover:bg-violet-700'
              }`}
            >
              <Download className="h-4 w-4" />
              {loading ? '생성 중…' : 'PDF 다운로드'}
            </a>
          </div>

          {/* ── 본문: 로딩 스피너 or PDF iframe ── */}
          <div className="flex-1 overflow-hidden">
            {error ? (
              <div className="flex h-full items-center justify-center text-red-500 text-sm">
                PDF 생성 중 오류가 발생했습니다. 페이지를 새로고침해 주세요.
              </div>
            ) : loading || !url ? (
              <Spinner />
            ) : (
              // blob URL은 브라우저 네이티브 PDF 뷰어로 표시
              <iframe
                src={url}
                title={`${colorType} 분석 리포트`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            )}
          </div>

        </div>
      )}
    </BlobProvider>
  );
}
