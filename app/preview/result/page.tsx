import Link from 'next/link';
import ColorPalette from '@/components/result/ColorPalette';
import { TYPE_DISPLAY, SEASON_GRADIENT, TYPE_PALETTE, TYPE_DESCRIPTION } from '@/lib/colorData';
import { getSeasonFromType, getToneFromType } from '@/lib/colorLogic';
import type { PersonalColorType } from '@/types';

const SAMPLE_TYPE: PersonalColorType = '봄 라이트';
const SAMPLE_ID = 'preview-sample';

export default function PreviewResultPage() {
  const colorType = SAMPLE_TYPE;
  const season = getSeasonFromType(colorType);
  const tone = getToneFromType(colorType);
  const displayName = TYPE_DISPLAY[colorType];
  const palette = TYPE_PALETTE[colorType];
  const gradient = SEASON_GRADIENT[season];
  const aiDescription = TYPE_DESCRIPTION[colorType];

  return (
    <main className="min-h-screen bg-white pb-28 dark:bg-gray-900">
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
      <ColorPalette palette={palette} blurHex />

      {/* ── 3. AI 서사형 설명 ── */}
      <section className="mx-auto max-w-xl px-5 py-10">
        <div className="mb-10 border-t border-gray-100 dark:border-gray-700" />
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
          AI 분석
        </p>
        <div className="relative overflow-hidden">
          <p className="font-serif text-[17px] leading-[2] tracking-wide text-gray-700 dark:text-gray-300">
            {aiDescription.slice(0, 50)}
            <span style={{ filter: 'blur(4px)', userSelect: 'none' }}>
              {aiDescription.slice(50)}
            </span>
          </p>
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center bg-gradient-to-t from-white pb-2 pt-10 dark:from-gray-900">
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
              상세 리포트에서 전체 확인 →
            </span>
          </div>
        </div>
      </section>

      {/* ── 4. 정밀 분석 리포트 blur 미리보기 ── */}
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
        </div>
      </section>

      {/* ── 5. 가격 카드 ── */}
      <section className="mx-auto max-w-xl px-5 py-6">
        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50 to-white dark:border-violet-800 dark:bg-gray-800 dark:from-gray-800 dark:to-gray-800">
          <div className="bg-[#7C3AED] px-4 py-2.5 text-center">
            <p className="text-xs font-semibold text-white">오늘 진단받은 내 결과, 24시간만 유지돼요</p>
          </div>
          <div className="p-7">
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
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-sm text-gray-400 line-through">₩5,900</span>
              <span className="rounded-full bg-violet-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                얼리버드
              </span>
              <span className="text-3xl font-black text-violet-700">₩4,900</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 하단 고정 CTA 버튼 ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white/95 px-5 pb-8 pt-3 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
        <Link
          href={`/upload/${SAMPLE_ID}`}
          className="mx-auto block max-w-xl rounded-2xl bg-[#7C3AED] py-4 text-center text-lg md:text-base font-bold text-white shadow-lg shadow-violet-200 transition-opacity hover:opacity-90"
        >
          내 퍼스널컬러 상세 리포트 받기 ₩4,900 →
        </Link>
      </div>
    </main>
  );
}
