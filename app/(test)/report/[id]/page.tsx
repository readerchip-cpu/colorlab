import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTestSession } from '@/lib/utils/session';
import { TYPE_DISPLAY, TYPE_PALETTE, SEASON_GRADIENT } from '@/lib/colorData';
import { getSeasonFromType, getToneFromType } from '@/lib/colorLogic';
import { parseReportSections } from '@/lib/utils/parseReport';
import ColorPalette from '@/components/result/ColorPalette';
import ContentRenderer from '@/components/report/ContentRenderer';
import TableOfContents from '@/components/report/TableOfContents';
import ReviewForm from '@/components/report/ReviewForm';
import ShareModal from '@/components/share/ShareModal';
import type { PersonalColorType } from '@/types';

interface Props {
  params: { id: string };
}

const SECTION_META: Record<number, { icon: string; bg: string; text: string }> = {
  1: { icon: '🔬', bg: 'bg-violet-50',  text: 'text-violet-700' },
  2: { icon: '🚫', bg: 'bg-red-50',     text: 'text-red-600' },
  3: { icon: '💄', bg: 'bg-pink-50',    text: 'text-pink-600' },
  4: { icon: '✂️', bg: 'bg-amber-50',   text: 'text-amber-600' },
  5: { icon: '👗', bg: 'bg-sky-50',     text: 'text-sky-600' },
  6: { icon: '🌸', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  7: { icon: '✨', bg: 'bg-violet-50',  text: 'text-violet-700' },
};

const fetchSession = cache(async (id: string) => getTestSession(id));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const session = await fetchSession(params.id);
    if (!session.result_type) return {};
    return {
      title: `${session.result_type} 정밀 리포트 | 컬러랩`,
      description: `AI가 분석한 ${session.result_type} 타입의 퍼스널컬러 정밀 분석 리포트`,
    };
  } catch {
    return { title: '컬러랩 리포트' };
  }
}

export default async function ReportPage({ params }: Props) {
  let session;
  try {
    session = await fetchSession(params.id);
  } catch {
    notFound();
  }

  if (!session.is_paid) redirect(`/pay/${params.id}`);
  if (!session.report_content) redirect(`/upload/${params.id}`);

  const colorType = session.result_type as PersonalColorType;
  const season = getSeasonFromType(colorType);
  const tone = getToneFromType(colorType);
  const displayName = TYPE_DISPLAY[colorType];
  const palette = TYPE_PALETTE[colorType];
  const gradient = SEASON_GRADIENT[season];

  const sections = parseReportSections(session.report_content);
  // 섹션 7이 "해당 질문에는 답변이 불가합니다"면 숨김
  const visibleSections = sections.filter(
    (s) =>
      !(s.number === 7 && s.content.trim() === '해당 질문에는 답변이 불가합니다'),
  );

  return (
    <main className="min-h-screen bg-white pb-20 dark:bg-gray-900">

      {/* ── 1. 헤더 ── */}
      <header className={`bg-gradient-to-b ${gradient} to-white px-5 pb-10 pt-12 text-center dark:bg-gray-900 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900`}>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
          정밀 분석 리포트
        </p>
        <h1 className="mb-2 text-5xl font-black tracking-tight text-gray-900 dark:text-gray-100">
          {colorType}
        </h1>
        <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">{displayName}</p>
        <span
          className={`inline-block rounded-full px-5 py-1.5 text-sm font-bold ${
            tone === '웜톤'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-indigo-100 text-indigo-700'
          }`}
        >
          {tone}
        </span>
      </header>

      {/* 대표 컬러 팔레트 */}
      <ColorPalette palette={palette} />

      <div className="mx-auto max-w-xl px-5">
        <div className="border-t border-gray-100 dark:border-gray-700" />
      </div>

      {/* ── 2. 목차 네비게이션 ── */}
      <div className="mx-auto max-w-xl">
        <TableOfContents
          sections={visibleSections.map((s) => ({ number: s.number, title: s.title }))}
        />
      </div>

      {/* ── 3. 리포트 본문 ── */}
      <div className="mx-auto max-w-xl space-y-6 px-5 py-8">
        {visibleSections.map((section) => {
          const meta = SECTION_META[section.number] ?? SECTION_META[1];
          return (
            <section
              key={section.number}
              id={`section-${section.number}`}
              className="scroll-mt-16"
            >
              {/* 섹션 헤더 */}
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg ${meta.bg}`}
                >
                  {meta.icon}
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{section.title}</h2>
              </div>

              {/* 섹션 내용 */}
              <div className="rounded-2xl bg-gray-50 px-5 py-5 dark:bg-gray-800">
                <ContentRenderer content={section.content} />
              </div>
            </section>
          );
        })}
      </div>

      {/* ── 4. 하단 액션 ── */}
      <div className="mx-auto max-w-xl space-y-4 px-5">
        {/* 공유하기 */}
        <ShareModal sessionId={params.id} colorType={colorType} />

        {/* 별점 + 후기 */}
        <div className="rounded-3xl border border-gray-100 bg-white px-6 py-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <ReviewForm />
        </div>

        {/* 친구에게 공유 */}
        <div className="pb-6 text-center">
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">친구의 퍼스널컬러도 궁금하다면?</p>
          <Link
            href="/"
            className="inline-block rounded-2xl border-2 border-violet-200 px-8 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50 dark:border-violet-700 dark:text-purple-400 dark:hover:bg-violet-900/20"
          >
            컬러랩을 친구에게 공유하기 🎨
          </Link>
        </div>
      </div>
    </main>
  );
}
