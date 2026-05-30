import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTestSession } from '@/lib/utils/session';
import { getSeasonFromType, getToneFromType } from '@/lib/colorLogic';
import { TYPE_DISPLAY, SEASON_GRADIENT, TYPE_PALETTE, TYPE_DESCRIPTION } from '@/lib/colorData';
import ColorPalette from '@/components/result/ColorPalette';
import LockedContent from '@/components/result/LockedContent';
import ShareModal from '@/components/share/ShareModal';
import KarrotPixelEvent from '@/components/KarrotPixelEvent';
import MetaPixelEvent from '@/components/MetaPixelEvent';
import type { PersonalColorType } from '@/types';

interface Props {
  params: { id: string };
}

// 동일 렌더 사이클에서 중복 DB 조회 방지
const fetchSession = cache(async (id: string) => {
  return getTestSession(id);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const session = await fetchSession(params.id);
    if (!session.result_type) return { title: '컬러랩' };
    const display = TYPE_DISPLAY[session.result_type as PersonalColorType];
    return {
      title: `나의 퍼스널컬러: ${session.result_type} | 컬러랩`,
      description: `${display} 타입. 컬러랩 AI가 분석한 나만의 퍼스널컬러를 확인하세요.`,
      openGraph: {
        title: `나의 퍼스널컬러는 ${session.result_type}!`,
        description: `${display} 타입의 퍼스널컬러 분석 결과`,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/result/${params.id}`,
      },
    };
  } catch {
    return { title: '컬러랩' };
  }
}

export default async function ResultPage({ params }: Props) {
  let session;
  try {
    session = await fetchSession(params.id);
  } catch {
    notFound();
  }

  if (!session.result_type) notFound();

  // 이미 결제한 유저는 전체 리포트 페이지로 이동
  if (session.is_paid) {
    redirect(`/report/${params.id}`);
  }

  const colorType = session.result_type as PersonalColorType;
  const season = getSeasonFromType(colorType);
  const tone = getToneFromType(colorType);
  const displayName = TYPE_DISPLAY[colorType];
  const palette = TYPE_PALETTE[colorType];
  const gradient = SEASON_GRADIENT[season];
  const aiDescription = session.report_content || TYPE_DESCRIPTION[colorType];

  return (
    <main className="min-h-screen bg-white pb-28 dark:bg-gray-900">
      <KarrotPixelEvent event="ViewContent" />
      <MetaPixelEvent event="ViewContent" />

      {/* ── 1. 헤더 ── */}
      <header
        className={`bg-gradient-to-b ${gradient} to-white px-5 pb-12 pt-14 text-center dark:bg-gray-900 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900`}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
          컬러랩이 분석한 당신의 퍼스널컬러
        </p>
        <h1 className="mb-3 text-5xl font-black tracking-tight text-gray-900 dark:text-gray-100">
          {colorType}
        </h1>
        <p className="mb-5 text-sm font-medium text-gray-500 dark:text-gray-400">{displayName}</p>
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

      {/* ── 2. 대표 컬러 팔레트 ── */}
      <ColorPalette palette={palette} />

      {/* ── 3. AI 서사형 설명 ── */}
      <section className="mx-auto max-w-xl px-5 py-10">
        <div className="mb-10 border-t border-gray-100 dark:border-gray-700" />
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
          AI 분석
        </p>
        <p className="font-serif text-[17px] leading-[2] tracking-wide text-gray-700 dark:text-gray-300">
          {aiDescription}
        </p>
      </section>

      {/* 섹션 구분선 */}
      <div className="mx-auto max-w-xl px-5">
        <div className="border-t border-gray-100 dark:border-gray-700" />
      </div>

      {/* ── 4. 잠긴 콘텐츠 (블러) ── */}
      <LockedContent colorType={colorType} />

      {/* ── 5. 정밀 분석 리포트 blur 미리보기 ── */}
      <section className="mx-auto max-w-xl px-5 py-4">
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-purple-800 p-6 shadow-xl">
          <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-white/80">
            ✨ 정밀 분석 리포트 미리보기
          </p>
          <div className="mb-5 space-y-3">
            {[
              {
                title: '나에게 어울리는 셀러브리티 스타일 TOP 3',
                preview: '김태희 스타일 · 아이유 무드 · 제니 컬러 팔레트... 당신과 가장 가까운 셀럽 스타일을 분석했어요. 구체적인 메이크업과 코디 방법까지 알려드려요.',
              },
              {
                title: '피해야 할 컬러 & 소재 분석',
                preview: '쿨톤 민트, 차가운 실버 계열은 피부톤을 칙칙하게 만들어요. 피해야 할 7가지 컬러와 소재를 정리했어요. 쇼핑할 때 바로 활용하세요.',
              },
              {
                title: '계절별 추천 룩 가이드',
                preview: '봄엔 피치 블라우스, 여름엔 라벤더 원피스... 시즌마다 빛나는 컬러 코디법을 시즌별로 정리해드려요. 실제 옷 고를 때 바로 쓸 수 있어요.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm"
              >
                <div className="select-none px-4 py-4">
                  <p className="mb-1.5 text-xs font-bold text-white">{item.title}</p>
                  <p
                    className="text-xs leading-relaxed text-white/90"
                    style={{ filter: 'blur(5px)', userSelect: 'none' }}
                  >
                    {item.preview}
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-end bg-gradient-to-r from-transparent via-transparent to-purple-800/60 px-4">
                  <span className="text-sm">🔒</span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href={`/pay/${params.id}`}
            className="block w-full rounded-2xl bg-white py-4 text-center text-sm font-black text-violet-700 shadow-lg transition-opacity hover:opacity-90"
          >
            전체 리포트 보기 →
          </Link>
        </div>
      </section>

      {/* ── 6. 페이월 CTA ── */}
      <section className="mx-auto max-w-xl px-5 py-6">
        <div className="rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50 to-white p-7 dark:border-violet-800 dark:bg-gray-800 dark:from-gray-800 dark:to-gray-800">
          {/* 훅 문구 */}
          <p className="mb-1 text-center text-xs font-bold uppercase tracking-widest text-violet-400">
            정밀 진단
          </p>
          <h3 className="mb-3 text-center text-lg font-bold leading-snug text-gray-900 dark:text-gray-100">
            질문만으론 100% 확신할 수 없어요.
            <br />
            <span className="text-violet-600 dark:text-purple-400">내 사진을 분석하면 더 정확해요.</span>
          </h3>
          <p className="mb-6 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            AI가 피부 톤·명도·채도를 직접 읽어
            <br />더 정밀한 타입 분류와 맞춤 조언을 드려요.
          </p>

          {/* 포함 항목 */}
          <ul className="mb-6 space-y-2">
            {[
              '정밀 타입 재분석 (사진 기반)',
              '메이크업 컬러 추천 (립·파·섀도우)',
              '헤어 컬러 가이드',
              '패션 컬러 팔레트',
              '시즌별 스타일링',
              '맞춤 조언',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-600">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* 가격 */}
          <div className="flex items-baseline justify-center gap-3">
            <span className="text-sm text-gray-400 line-through">₩5,900</span>
            <span className="rounded-full bg-violet-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
              얼리버드
            </span>
            <span className="text-3xl font-black text-violet-700">₩4,900</span>
          </div>
        </div>
      </section>

      {/* ── 6. SNS 공유 ── */}
      <ShareModal sessionId={params.id} colorType={colorType} />

      {/* ── 하단 고정 CTA 버튼 ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white/95 px-5 pb-8 pt-3 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
        <Link
          href={`/upload/${params.id}`}
          className="mx-auto block max-w-xl rounded-2xl bg-[#7C3AED] py-4 text-center text-lg md:text-base font-bold text-white shadow-lg shadow-violet-200 transition-opacity hover:opacity-90"
        >
          사진으로 정밀 진단받기 →
        </Link>
      </div>
    </main>
  );
}
