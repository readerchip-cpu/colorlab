import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTestSession } from '@/lib/utils/session';
import UploadZone from '@/components/upload/UploadZone';
import KarrotPixelEvent from '@/components/KarrotPixelEvent';
import MetaPixelEvent from '@/components/MetaPixelEvent';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export const metadata: Metadata = {
  title: '사진 업로드 | 컬러랩',
};

export default async function UploadPage({ params }: Props) {
  let session;
  try {
    session = await getTestSession(params.id);
  } catch {
    notFound();
  }

  console.log('[upload page] id:', params.id, '| is_paid:', session?.is_paid);

  if (!session.is_paid) redirect(`/pay/${params.id}`);

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <KarrotPixelEvent event="Purchase" />
      <MetaPixelEvent event="Purchase" />
      <div className="mx-auto max-w-lg px-5 pt-10">

        {/* 헤더 */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            href={`/result/${params.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-colors hover:text-gray-800"
            aria-label="뒤로가기"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">사진 분석</p>
            <h1 className="text-xl font-bold text-gray-900">사진 업로드</h1>
          </div>
        </div>

        {/* ── 1. 안심 문구 배너 ── */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-2xl p-5 mb-6 border-l-4 border-purple-600">
          <div className="flex items-start gap-3">
            <span className="text-3xl flex-shrink-0">💄</span>
            <div className="flex-1">
              <p className="text-base font-bold text-gray-900 dark:text-white mb-2">
                화장 지울 필요 없이 찍어서 보내세요
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                AI가 메이크업 컬러를 자동으로 인식하고 본래 피부톤·언더톤을 추출해서 분석해요.
                지금 모습 그대로 셀카 한 장이면 충분해요!
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 rounded-md">
                  🔒 AI만 분석
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 rounded-md">
                  ⚡ 즉시 삭제
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 rounded-md">
                  📸 지금 촬영 OK
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. 업로드 가이드 ── */}
        <div className="mb-5 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-gray-800">📸 이런 사진이 좋아요</h2>

          <div className="grid grid-cols-2 gap-3">
            {/* 올바른 예 */}
            <div>
              <div className="mb-2 flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-amber-50">
                <span className="text-6xl flex-shrink-0" aria-hidden="true">😊</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">✓</span>
                <span className="text-xs font-semibold text-gray-700">올바른 예</span>
              </div>
              <ul className="mt-1.5 space-y-0.5 text-xs text-gray-500">
                <li><span className="flex-shrink-0">👤</span> 정면 얼굴</li>
                <li><span className="flex-shrink-0">✨</span> 자연광 / 밝은 조명</li>
                <li><span className="flex-shrink-0">💄</span> 가벼운 메이크업 OK (AI 보정)</li>
              </ul>
            </div>

            {/* 잘못된 예 */}
            <div>
              <div className="mb-2 flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                <span className="text-6xl flex-shrink-0" aria-hidden="true">😷</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-red-400 text-[10px] font-bold text-white">✕</span>
                <span className="text-xs font-semibold text-gray-700">피해 주세요</span>
              </div>
              <ul className="mt-1.5 space-y-0.5 text-xs text-gray-500">
                <li><span className="flex-shrink-0">📐</span> 측면·뒷모습</li>
                <li><span className="flex-shrink-0">🌑</span> 어둡거나 역광</li>
                <li><span className="flex-shrink-0">🕶️</span> 선글라스·마스크 착용</li>
              </ul>
            </div>
          </div>

          <p className="mt-4 rounded-xl bg-violet-50 px-3 py-2.5 text-xs text-violet-600">
            💡 자연광 아래 정면 셀카 사진이 가장 정확한 분석 결과를 드려요.
          </p>
        </div>

        {/* ── 3 & 4. 업로드 영역 + 분석 버튼 ── */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <UploadZone sessionId={params.id} />
        </div>
      </div>
    </main>
  );
}

