import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
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
        <div className="mb-6 flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
          <div>
            <p className="mb-0.5 text-sm font-bold text-emerald-800">
              개인정보 완전 보호
            </p>
            <p className="text-xs leading-relaxed text-emerald-700">
              업로드하신 사진은 AI 분석에만 사용돼요.
              <br />
              서버에 저장되지 않으며, 분석이 끝나는 순간 완전히 사라집니다.
            </p>
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
                <li><span className="flex-shrink-0">💆‍♀️</span> 메이크업 최소화</li>
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

