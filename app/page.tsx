import Link from 'next/link';
import { Camera, Palette, BookOpen, CheckCircle2, Star } from 'lucide-react';
import { TYPE_PALETTE } from '@/lib/colorData';
import type { PersonalColorType } from '@/types';

const PRICE = Number(process.env.PRICE ?? 4900);
const ORIGINAL_PRICE = 5900;
const DISCOUNT_RATE = Math.round((1 - PRICE / ORIGINAL_PRICE) * 100);

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
    title: '12가지 세부 타입',
    desc: '봄·여름·가을·겨울을 넘어 12가지 세부 타입으로 나만의 컬러를 정확히 짚어드려요.',
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
    type: '봄밝음',
    tone: '웜톤',
    gradient: 'from-rose-50 to-amber-50',
    keywords: ['화사한', '생기있는', '봄처럼 싱그러운'],
    desc: '따뜻하고 밝은 색이 얼굴을 환하게 빛내는 타입이에요.',
  },
  {
    type: '여름뮤트',
    tone: '쿨톤',
    gradient: 'from-sky-50 to-violet-50',
    keywords: ['차분한', '세련된', '부드러운'],
    desc: '뮤트한 쿨톤이 지적이고 우아한 분위기를 만드는 타입이에요.',
  },
  {
    type: '겨울딥',
    tone: '쿨톤',
    gradient: 'from-indigo-50 to-slate-100',
    keywords: ['강렬한', '시크한', '카리스마있는'],
    desc: '깊고 선명한 색이 강렬한 인상을 극대화하는 타입이에요.',
  },
];

const REVIEWS = [
  {
    name: '김**',
    type: '봄연함',
    rating: 5,
    date: '2024.12',
    text: '드디어 쇼핑할 때 뭘 고를지 알게 됐어요. 리포트 내용이 진짜 구체적이에요!',
  },
  {
    name: '이**',
    type: '겨울강함',
    rating: 5,
    date: '2024.11',
    text: '사진 분석 결과가 신기하게 맞았어요. 평소 피하던 색이 오히려 잘 어울린다는 걸 알았어요.',
  },
  {
    name: '박**',
    type: '가을뮤트',
    rating: 5,
    date: '2024.12',
    text: '메이크업 추천이 정말 실용적이에요. 파운데이션 쉐이드 고민이 한 번에 해결됐어요.',
  },
];

const INCLUDED = [
  '10문항 퍼스널컬러 진단 (무료)',
  'AI 사진 분석 (사진 기반 정밀 진단)',
  '12가지 세부 타입 분류',
  '메이크업 컬러 추천 (립·파운데이션·섀도우)',
  '헤어 컬러 & 패션 가이드',
  '시즌별 스타일링 조언',
  '맞춤 고민 답변',
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

// 히어로 영역 — 결과 카드 미리보기
function ResultCardPreview() {
  const colors = TYPE_PALETTE['여름뮤트'];
  return (
    <div className="mx-auto mt-12 max-w-xs">
      <div className="relative">
        {/* 그림자 레이어 */}
        <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-3xl bg-violet-300/40 blur-sm" />
        {/* 카드 */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-violet-200/60">
          {/* 카드 헤더 */}
          <div className="bg-gradient-to-r from-sky-50 to-violet-50 px-5 pt-5 pb-4">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              퍼스널컬러 분석 결과
            </p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight text-gray-900">여름뮤트</h3>
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
                <span className="text-[10px] font-medium text-gray-500">{name}</span>
              </div>
            ))}
          </div>

          {/* AI 요약 */}
          <div className="border-t border-gray-50 px-5 py-4">
            <p className="text-xs leading-relaxed text-gray-600">
              차분하고 세련된 느낌의 쿨톤 색상이 잘 어울려요. 라벤더, 로즈, 스틸 블루 계열이 당신의 매력을 극대화해요.
            </p>
          </div>

          {/* 잠긴 섹션 힌트 */}
          <div className="flex items-center gap-2 border-t border-gray-50 bg-gray-50/80 px-5 py-3">
            <span className="text-xs text-gray-400">🔒</span>
            <span className="text-xs text-gray-400">메이크업 추천·헤어 가이드·패션 팁 포함</span>
          </div>
        </div>
      </div>

      {/* 화살표 힌트 */}
      <p className="mt-4 text-center text-xs text-gray-400">
        ↑ 결제 후 전체 리포트를 확인할 수 있어요
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 메인 페이지
// ────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white">

      {/* ── 1. 이벤트 배너 ── */}
      <div className="bg-[#7C3AED] py-2 text-center text-xs font-semibold text-white/90">
        🎉 런칭 기념&nbsp;
        <span className="text-white/60 line-through">₩{ORIGINAL_PRICE.toLocaleString()}</span>
        &nbsp;→&nbsp;
        <span className="font-black text-yellow-300">₩{PRICE.toLocaleString()}</span>
        &nbsp;한정 할인 중
      </div>

      {/* ── 2. 히어로 섹션 ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-violet-50/30 to-white px-5 pb-20 pt-14 text-center">
        {/* 장식 blob */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-10 h-56 w-56 rounded-full bg-pink-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-lg">
          <span className="mb-5 inline-block rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-violet-600 shadow-sm backdrop-blur-sm">
            ✨ AI 퍼스널컬러 진단 서비스
          </span>

          <h1 className="mb-4 text-[2.6rem] font-black leading-[1.15] tracking-tight text-gray-900">
            나에게 진짜 어울리는 색,
            <br />
            <span className="text-[#7C3AED]">지금 알아보세요</span>
          </h1>

          <p className="mb-8 text-base leading-relaxed text-gray-500">
            10문항 + AI 사진 분석으로
            <br />
            퍼스널컬러를 정확하게 진단해드려요
          </p>

          <Link
            href="/test"
            className="inline-block rounded-2xl bg-[#7C3AED] px-10 py-4 text-base font-bold text-white shadow-xl shadow-violet-300 transition-all hover:-translate-y-0.5 hover:shadow-violet-400 active:translate-y-0"
          >
            무료로 진단 시작하기 →
          </Link>

          <p className="mt-3 text-xs text-gray-400">
            기본 진단 무료 · 정밀 분석 ₩{PRICE.toLocaleString()}
          </p>

          {/* 결과 카드 미리보기 */}
          <ResultCardPreview />
        </div>
      </section>

      {/* ── 3. 서비스 특징 ── */}
      <section className="bg-gray-50 px-5 py-16">
        <div className="mx-auto max-w-lg">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
            Features
          </p>
          <h2 className="mb-10 text-center text-2xl font-black text-gray-900">
            왜 컬러랩인가요?
          </h2>

          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, title, desc, chip }) => (
              <div key={title} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm">
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${chip}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-gray-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. 결과 예시 ── */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-lg">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
            Result Preview
          </p>
          <h2 className="mb-2 text-center text-2xl font-black text-gray-900">
            어떤 결과가 나올까요?
          </h2>
          <p className="mb-10 text-center text-sm text-gray-400">
            12가지 타입 중 나의 타입을 정확하게 진단해드려요
          </p>

          <div className="space-y-4">
            {SHOWCASE.map((item) => {
              const palette = TYPE_PALETTE[item.type];
              return (
                <div
                  key={item.type}
                  className={`overflow-hidden rounded-3xl bg-gradient-to-br ${item.gradient} p-5`}
                >
                  {/* 타입 헤더 */}
                  <div className="mb-3 flex items-center gap-2.5">
                    <h3 className="text-xl font-black text-gray-900">{item.type}</h3>
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

                  <p className="mb-4 text-sm text-gray-600">{item.desc}</p>

                  {/* 컬러 팔레트 */}
                  <div className="mb-4 flex items-center gap-3">
                    {palette.map(({ hex, name }) => (
                      <div key={hex} className="flex flex-col items-center gap-1.5">
                        <div
                          className="h-10 w-10 rounded-full shadow-md ring-2 ring-white"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-[10px] font-medium text-gray-500">{name}</span>
                      </div>
                    ))}
                  </div>

                  {/* 키워드 태그 */}
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

          {/* 더 보기 힌트 */}
          <p className="mt-5 text-center text-xs text-gray-400">
            봄밝음 · 봄연함 · 여름연함 · 여름밝음 · 여름뮤트 · 가을뮤트
            <br />
            가을강함 · 가을딥 · 겨울딥 · 겨울밝음 · 겨울뮤트 · 겨울강함
          </p>
        </div>
      </section>

      {/* ── 5. 사용자 후기 ── */}
      <section className="bg-gray-50 px-5 py-16">
        <div className="mx-auto max-w-lg">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
            Reviews
          </p>
          <h2 className="mb-10 text-center text-2xl font-black text-gray-900">
            실제 이용 후기
          </h2>

          <div className="space-y-3">
            {REVIEWS.map((review) => (
              <div
                key={review.name + review.date}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <StarRow count={review.rating} />
                <p className="my-3 text-sm leading-relaxed text-gray-700">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">{review.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-600">
                      {review.type}
                    </span>
                    <span className="text-[10px] text-gray-400">{review.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 총점 요약 */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <StarRow count={5} />
            <span className="text-sm font-bold text-gray-800">4.9 / 5.0</span>
            <span className="text-sm text-gray-400">· 누적 후기 127개</span>
          </div>
        </div>
      </section>

      {/* ── 6. 가격 섹션 ── */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-lg">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
            Pricing
          </p>
          <h2 className="mb-8 text-center text-2xl font-black text-gray-900">
            단 한 번의 분석으로<br />나만의 컬러를 찾으세요
          </h2>

          <div className="overflow-hidden rounded-3xl border-2 border-violet-200 shadow-2xl shadow-violet-100">
            {/* 할인 배너 */}
            <div className="bg-[#7C3AED] py-2 text-center text-xs font-bold tracking-wide text-white">
              🎉 런칭 기념 {DISCOUNT_RATE}% 할인 · 한정 수량
            </div>

            <div className="bg-gradient-to-b from-violet-50/60 to-white p-7">
              <p className="mb-1 text-center text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                정밀 분석 리포트
              </p>
              <h3 className="mb-7 text-center text-2xl font-black text-gray-900">
                컬러랩 퍼스널컬러 분석
              </h3>

              {/* 포함 항목 */}
              <ul className="mb-8 space-y-2.5">
                {INCLUDED.map((item, i) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                        i === 0 ? 'text-gray-400' : 'text-violet-500'
                      }`}
                    />
                    <span>
                      {item}
                      {i === 0 && (
                        <span className="ml-1.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                          FREE
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {/* 가격 표시 */}
              <div className="mb-6 text-center">
                <div className="mb-1.5 flex items-center justify-center gap-2">
                  <span className="text-sm text-gray-400 line-through">
                    ₩{ORIGINAL_PRICE.toLocaleString()}
                  </span>
                  <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-bold text-violet-700">
                    {DISCOUNT_RATE}% 할인
                  </span>
                </div>
                <p className="text-5xl font-black tracking-tight text-gray-900">
                  ₩{PRICE.toLocaleString()}
                </p>
                <p className="mt-1.5 text-xs text-gray-400">일회성 결제 · 평생 열람 가능</p>
              </div>

              <Link
                href="/test"
                className="block w-full rounded-2xl bg-[#7C3AED] py-4 text-center text-base font-bold text-white shadow-xl shadow-violet-200 transition-all hover:-translate-y-0.5 hover:opacity-95"
              >
                지금 바로 시작하기 →
              </Link>

              <p className="mt-3 text-center text-xs text-gray-400">
                기본 진단은 무료예요 · 결과가 마음에 드실 때 결제하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. 푸터 ── */}
      <footer className="border-t border-gray-100 bg-gray-50 px-5 py-10">
        <div className="mx-auto max-w-lg">
          {/* 로고 */}
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#7C3AED]" />
            <span className="text-lg font-black tracking-tight text-gray-800">컬러랩</span>
          </div>

          <p className="mb-5 text-xs leading-relaxed text-gray-400">
            AI 기반 퍼스널컬러 진단 서비스 · 누구나 자신에게 어울리는 색을 알 수 있어요.
          </p>

          <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 text-xs">
            <a
              href="mailto:readerchip@gmail.com"
              className="text-gray-500 transition-colors hover:text-violet-600"
            >
              문의: readerchip@gmail.com
            </a>
            <Link href="/privacy" className="text-gray-500 transition-colors hover:text-violet-600">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-gray-500 transition-colors hover:text-violet-600">
              이용약관
            </Link>
          </div>

          <p className="text-[11px] text-gray-400">
            © 2025 컬러랩. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
