import { Lock } from 'lucide-react';

const LOCKED_ITEMS = [
  {
    title: '메이크업 추천',
    hint: '립 컬러 #C8A0A0 · 파운데이션 핑크 베이지 계열 · 쿨톤 아이섀도우로 청순함을 더하세요.',
    emoji: '💄',
  },
  {
    title: '헤어 컬러 추천',
    hint: '애쉬 브라운, 쿨 그레이, 블루블랙이 잘 어울립니다. 레드·웜 브라운 계열은 피하세요.',
    emoji: '✂️',
  },
  {
    title: '패션 컬러 가이드',
    hint: '라벤더, 로즈 화이트, 아이시 블루 팔레트로 코디하면 자연스럽게 빛납니다.',
    emoji: '👗',
  },
  {
    title: '맞춤 조언',
    hint: '트렌드 컬러를 소화하는 나만의 방법과 시즌별 컬러 전략을 알려드려요.',
    emoji: '✨',
  },
];

export default function LockedContent() {
  return (
    <section className="mx-auto max-w-xl px-5 py-4">
      <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">전체 분석 리포트</h2>
      <div className="space-y-3">
        {LOCKED_ITEMS.map((item) => (
          <div
            key={item.title}
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            {/* 배경 힌트 텍스트 (블러) */}
            <div className="select-none px-5 py-5">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-base">{item.emoji}</span>
                <span className="text-sm font-semibold text-gray-200 dark:text-gray-700">{item.title}</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-200 dark:text-gray-700" style={{ filter: 'blur(3px)' }}>
                {item.hint}
              </p>
            </div>

            {/* 잠금 오버레이 */}
            <div className="absolute inset-0 flex items-center justify-between bg-white/75 px-5 backdrop-blur-[2px] dark:bg-gray-800/75">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.title}</span>
              </div>
              <Lock className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
