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

      {/* ── 4. 전환 포인트 섹션 ── */}
      <section className="mx-auto max-w-xl px-5 pb-4 pt-0">
        <div
          style={{
            background: '#F5F0FF',
            border: '1px solid #7C3AED',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#7C3AED', marginBottom: '12px' }}>
            ⚠️ 질문만으로는 한계가 있어요
          </p>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7, marginBottom: '16px' }}>
            지금 결과는 10가지 질문을 기반으로 한 예측이에요.
            <br />
            AI가 실제 내 피부 톤·명도·채도를 직접 분석하면
            <br />
            더 정밀한 타입과 맞춤 컬러를 알 수 있어요.
          </p>
          <div style={{ borderTop: '1px solid #DDD4FF', margin: '16px 0' }} />
          <div className="flex flex-wrap gap-3">
            <div className="min-w-[120px] flex-1">
              <p style={{ fontSize: '13px', color: '#999', fontWeight: 600, marginBottom: '8px' }}>
                질문 기반 진단
              </p>
              <ul className="space-y-1.5">
                {['피부 톤 직접 측정 불가', '조명·메이크업 변수 반영 안됨', '예측 기반 결과'].map(
                  (item) => (
                    <li
                      key={item}
                      style={{ fontSize: '13px', color: '#999', display: 'flex', gap: '6px', alignItems: 'flex-start' }}
                    >
                      <span>✗</span>
                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="min-w-[120px] flex-1">
              <p style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 600, marginBottom: '8px' }}>
                AI 사진 분석
              </p>
              <ul className="space-y-1.5">
                {['실제 피부 톤·명도 직접 측정', '셀카 1장으로 즉시 분석', '메이크업·헤어 컬러까지'].map(
                  (item) => (
                    <li
                      key={item}
                      style={{ fontSize: '13px', color: '#7C3AED', display: 'flex', gap: '6px', alignItems: 'flex-start' }}
                    >
                      <span>✓</span>
                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. 정밀 분석 리포트 blur 미리보기 ── */}
      <section className="mx-auto max-w-xl px-5 py-4">
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-purple-800 p-6 shadow-xl">
          <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-white/80">
            ✨ 정밀 분석 리포트 미리보기
          </p>
          <div className="space-y-3">
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

      {/* ── 6. 인페이지 CTA 버튼 ── */}
      <section className="mx-auto max-w-xl px-5 py-4">
        <Link
          href={`/upload/${SAMPLE_ID}`}
          className="block w-full rounded-2xl bg-[#7C3AED] py-4 text-center text-base font-bold text-white shadow-lg shadow-violet-200 transition-opacity hover:opacity-90"
        >
          셀카로 정밀 분석받기 ₩4,900 →
        </Link>
      </section>

      {/* ── 7. 가격 카드 ── */}
      <section className="mx-auto max-w-xl px-5 py-2 pb-6">
        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50 to-white dark:border-violet-800 dark:bg-gray-800 dark:from-gray-800 dark:to-gray-800">
          <div className="bg-[#7C3AED] px-4 py-2.5 text-center">
            <p className="text-xs font-semibold text-white">오늘 진단받은 내 결과, 24시간만 유지돼요</p>
          </div>
          <div className="p-7">
            <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-violet-400">
              AI 사진 정밀 분석에 포함된 것
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
          셀카로 정밀 분석받기 ₩4,900 →
        </Link>
      </div>
    </main>
  );
}
