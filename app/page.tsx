import Link from 'next/link';
import { Camera, Palette, BookOpen, Star } from 'lucide-react';
import BusinessInfo from '@/components/BusinessInfo';
import { TYPE_PALETTE } from '@/lib/colorData';
import type { PersonalColorType } from '@/types';

// ────────────────────────────────────────────────────────────
// 정적 데이터
// ────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Camera,
    title: 'AI 사진 분석',
    desc: '셀카를 업로드하면 AI가 피부 톤·명도·채도를 직접 읽어 더 정확하게 진단해요.',
    chip: 'bg-violet-100 text-violet-600',
  },
  {
    icon: Palette,
    title: '8가지 세부 타입',
    desc: '봄·여름·가을·겨울을 넘어 8가지 세부 타입으로 나만의 컬러를 정확히 짚어드려요.',
    chip: 'bg-pink-100 text-pink-600',
  },
  {
    icon: BookOpen,
    title: '맞춤 컬러 가이드',
    desc: '메이크업·헤어·패션까지 퍼스널컬러를 일상에 쓰는 모든 방법을 알려드려요.',
    chip: 'bg-amber-100 text-amber-600',
  },
];

interface ShowcaseItem {
  type: PersonalColorType;
  tone: '웜톤' | '쿨톤';
  gradient: string;
  keywords: string[];
  desc: string;
}

const SHOWCASE: ShowcaseItem[] = [
  {
    type: '봄 브라이트',
    tone: '웜톤',
    gradient: 'from-rose-50 to-amber-50',
    keywords: ['화사한', '생기있는', '봄처럼 싱그러운'],
    desc: '따뜻하고 밝은 색이 얼굴을 환하게 빛내는 타입이에요.',
  },
  {
    type: '여름 뮤트',
    tone: '쿨톤',
    gradient: 'from-sky-50 to-violet-50',
    keywords: ['차분한', '세련된', '부드러운'],
    desc: '뮤트한 쿨톤이 지적이고 우아한 분위기를 만드는 타입이에요.',
  },
  {
    type: '겨울 딥',
    tone: '쿨톤',
    gradient: 'from-indigo-50 to-slate-100',
    keywords: ['강렬한', '시크한', '카리스마있는'],
    desc: '깊고 선명한 색이 강렬한 인상을 극대화하는 타입이에요.',
  },
];

const REVIEWS = [
  {
    name: '김**',
    type: '봄 라이트',
    rating: 5,
    date: '2024.12',
    text: '드디어 쇼핑할 때 뭘 고를지 알게 됐어요. 리포트 내용이 진짜 구체적이에요!',
  },
  {
    name: '이**',
    type: '겨울 브라이트',
    rating: 5,
    date: '2024.11',
    text: '사진 분석 결과가 신기하게 맞았어요. 평소 피하던 색이 오히려 잘 어울린다는 걸 알았어요.',
  },
  {
    name: '박**',
    type: '가을 뮤트',
    rating: 5,
    date: '2024.12',
    text: '메이크업 추천이 정말 실용적이에요. 파운데이션 쉐이드 고민이 한 번에 해결됐어요.',
  },
];

// ────────────────────────────────────────────────────────────
// 서브 컴포넌트
// ────────────────────────────────────────────────────────────

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

function ResultCardPreview() {
  const colors = TYPE_PALETTE['여름 뮤트'];
  return (
    <div className="mx-auto mt-12 max-w-xs">
      <div className="relative">
        <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-3xl bg-violet-300/40 blur-sm" />
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-violet-200/60 dark:bg-gray-800">
          {/* 카드 헤더 */}
          <div className="bg-gradient-to-r from-sky-50 to-violet-50 px-5 pt-5 pb-4 dark:bg-gray-900 dark:from-gray-900 dark:to-gray-900">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              퍼스널컬러 분석 결과
            </p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">여름 뮤트</h3>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                쿨톤
              </span>
            </div>
          </div>

          {/* 팔레트 */}
          <div className="flex items-center gap-3 px-5 py-4">
            {colors.map(({ hex, name }) => (
              <div key={hex} className="flex flex-col items-center gap-1.5">
                <div
                  className="h-11 w-11 rounded-full shadow ring-2 ring-white"
                  style={{ backgroundColor: hex }}
                />
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{name}</span>
              </div>
            ))}
          </div>

          {/* AI 요약 */}
          <div className="border-t border-gray-50 px-5 py-4 dark:border-gray-700">
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              차분하고 세련된 느낌의 쿨톤 색상이 잘 어울려요. 라벤더, 로즈, 스틸 블루 계열이 당신의 매력을 극대화해요.
            </p>
          </div>

          {/* 잠긴 섹션 힌트 */}
          <div className="flex items-center gap-2 border-t border-gray-50 bg-gray-50/80 px-5 py-3 dark:border-gray-700 dark:bg-gray-700/50">
            <span className="text-xs text-gray-400">🔒</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">메이크업 추천·헤어 가이드·패션 팁 포함</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
        ↑ 진단 완료 후 이런 결과를 확인할 수 있어요
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 메인 페이지
// ────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white dark:bg-gray-900">

      {/* ── 1. 히어로 섹션 ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-violet-50/30 to-white px-5 pb-20 pt-14 text-center dark:bg-gray-900 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        {/* 장식 blob */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-10 h-56 w-56 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-lg">
          <span className="mb-5 inline-block rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-violet-600 shadow-sm backdrop-blur-sm dark:border-violet-700 dark:bg-gray-800/80 dark:text-purple-400">
            ✨ AI 퍼스널컬러 진단 서비스
          </span>

          <h1 className="mb-4 text-[2.6rem] font-black leading-[1.15] tracking-tight text-gray-900 dark:text-gray-100">
            나에게 진짜 어울리는 색,
            <br />
            <span className="text-[#7C3AED]">지금 알아보세요</span>
          </h1>

          <p className="mb-8 text-base leading-relaxed text-gray-500 dark:text-gray-400">
            10문항 + AI 사진 분석으로
            <br />
            퍼스널컬러를 정확하게 진단해드려요
          </p>

          <Link
            href="/test"
            className="inline-block rounded-2xl bg-[#7C3AED] px-10 py-5 md:py-4 text-lg md:text-base font-bold text-white shadow-xl shadow-violet-300 transition-all hover:-translate-y-0.5 hover:shadow-violet-400 active:translate-y-0"
          >
            지금 무료로 진단 시작하기 →
          </Link>

          {/* 결과 카드 미리보기 */}
          <ResultCardPreview />
        </div>
      </section>

      {/* ── 2. 서비스 특징 ── */}
      <section className="bg-gray-50 px-5 py-16 dark:bg-gray-800/50">
        <div className="mx-auto max-w-lg">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 dark:text-purple-400">
            Features
          </p>
          <h2 className="mb-10 text-center text-2xl font-black text-gray-900 dark:text-gray-100">
            왜 컬러랩인가요?
          </h2>

          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, title, desc, chip }) => (
              <div key={title} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-800">
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${chip}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. 결과 예시 ── */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-lg">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 dark:text-purple-400">
            Result Preview
          </p>
          <h2 className="mb-2 text-center text-2xl font-black text-gray-900 dark:text-gray-100">
            어떤 결과가 나올까요?
          </h2>
          <p className="mb-10 text-center text-sm text-gray-400 dark:text-gray-500">
            8가지 타입 중 나의 타입을 정확하게 진단해드려요
          </p>

          <div className="space-y-4">
            {SHOWCASE.map((item) => {
              const palette = TYPE_PALETTE[item.type];
              return (
                <div
                  key={item.type}
                  className={`overflow-hidden rounded-3xl bg-gradient-to-br ${item.gradient} dark:bg-gray-800 dark:from-gray-800 dark:to-gray-800 p-5`}
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <h3 className="text-xl font-black text-gray-900 dark:text-gray-100">{item.type}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        item.tone === '웜톤'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {item.tone}
                    </span>
                  </div>

                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>

                  <div className="mb-4 flex items-center gap-3">
                    {palette.map(({ hex, name }) => (
                      <div key={hex} className="flex flex-col items-center gap-1.5">
                        <div
                          className="h-10 w-10 rounded-full shadow-md ring-2 ring-white"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {item.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-medium text-gray-700 backdrop-blur-sm"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. 사용자 후기 ── */}
      <section className="bg-gray-50 px-5 py-16 dark:bg-gray-800/50">
        <div className="mx-auto max-w-lg">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 dark:text-purple-400">
            Reviews
          </p>
          <h2 className="mb-10 text-center text-2xl font-black text-gray-900 dark:text-gray-100">
            실제 이용 후기
          </h2>

          <div className="space-y-3">
            {REVIEWS.map((review) => (
              <div
                key={review.name + review.date}
                className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-800"
              >
                <StarRow count={review.rating} />
                <p className="my-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{review.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-600 dark:bg-violet-900/40 dark:text-purple-400">
                      {review.type}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <StarRow count={5} />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">4.9 / 5.0</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">· 누적 후기 127개</span>
          </div>
        </div>
      </section>

      {/* ── 5. 하단 CTA ── */}
      <section className="px-5 py-16 text-center">
        <div className="mx-auto max-w-lg">
          <Link
            href="/test"
            className="inline-block rounded-2xl bg-[#7C3AED] px-10 py-5 md:py-4 text-lg md:text-base font-bold text-white shadow-xl shadow-violet-200 transition-all hover:-translate-y-0.5 hover:opacity-95"
          >
            지금 무료로 진단 시작하기 →
          </Link>

          <p className="mt-6 text-sm leading-relaxed text-gray-400 dark:text-gray-500">
            테스트는 무료입니다.
            <br />
            더 자세한 분석을 원하시면 결과 확인 후 선택할 수 있어요.
          </p>
        </div>
      </section>

      {/* ── 6. 서비스 안내 ── */}
      <section className="bg-gray-50 px-5 py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-lg">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 dark:text-purple-400">
            Service Information
          </p>
          <h2 className="mb-10 text-center text-2xl font-black text-gray-900 dark:text-gray-100">
            서비스 제공 안내
          </h2>

          <div className="space-y-5">
            {[
              { emoji: '📋', title: '상품 정보', desc: '컬러랩 퍼스널컬러 정밀 분석 리포트 (디지털 PDF + 웹 열람)' },
              { emoji: '💰', title: '가격', desc: '4,900원 (정가 5,900원 / 런칭 이벤트가)' },
              { emoji: '⏱️', title: '서비스 제공 기간', desc: '결제 완료 즉시 ~ 영구 제공 (다운로드 기간 제한 없음)' },
              { emoji: '📦', title: '제공 방식', desc: '결제 완료 후 사진 업로드 → AI 분석 (약 90초 소요) → 웹 리포트 즉시 열람 및 PDF 다운로드' },
              { emoji: '💌', title: '리포트 발송', desc: '입력하신 이메일로 PDF 리포트가 자동 발송됩니다' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="border-l-4 border-violet-600 pl-4">
                <p className="mb-1 text-sm font-bold text-gray-900 dark:text-white">{emoji} {title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            ))}
            <div className="border-l-4 border-violet-600 pl-4">
              <p className="mb-1 text-sm font-bold text-gray-900 dark:text-white">🔄 환불 정책</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                디지털 콘텐츠 특성상 결제 완료 후 리포트 열람 시 환불이 불가합니다. 단, 기술적 오류로 리포트가 제공되지 않은 경우 전액 환불됩니다.
              </p>
              <Link href="/refund" className="mt-1 inline-block text-sm text-violet-600 underline dark:text-violet-400">
                환불 정책 자세히 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. 푸터 ── */}
      <footer className="border-t border-gray-100 bg-gray-50 px-5 py-10 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="mx-auto max-w-lg">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#7C3AED]" />
            <span className="text-lg font-black tracking-tight text-gray-800 dark:text-gray-200">컬러랩</span>
          </div>

          <p className="mb-5 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
            AI 기반 퍼스널컬러 진단 서비스 · 누구나 자신에게 어울리는 색을 알 수 있어요.
          </p>

          <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-xs">
            <a
              href="mailto:readerchip@gmail.com"
              className="text-gray-500 transition-colors hover:text-violet-600 dark:text-gray-400 dark:hover:text-purple-400"
            >
              문의: readerchip@gmail.com
            </a>
            <Link href="/privacy" className="text-gray-500 transition-colors hover:text-violet-600 dark:text-gray-400 dark:hover:text-purple-400">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-gray-500 transition-colors hover:text-violet-600 dark:text-gray-400 dark:hover:text-purple-400">
              이용약관
            </Link>
            <Link href="/refund" className="text-gray-500 transition-colors hover:text-violet-600 dark:text-gray-400 dark:hover:text-purple-400">
              환불 정책
            </Link>
          </div>

          <div className="mb-4 border-t border-gray-100 pt-4 dark:border-gray-700">
            <BusinessInfo />
          </div>

          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            © 2025 컬러랩. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
