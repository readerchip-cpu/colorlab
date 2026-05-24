import { Lock } from 'lucide-react';
import type { PersonalColorType } from '@/types';

interface LockedItem {
  title: string;
  hint: string;
  emoji: string;
}

const LOCKED_DATA: Record<PersonalColorType, LockedItem[]> = {
  '봄 라이트': [
    { title: '메이크업 추천', hint: '립 컬러 #F4A7B9 코랄 핑크 · 파운데이션 피치 베이지 계열 · 파우더 블루 아이섀도우로 청순함을 완성하세요.', emoji: '💄' },
    { title: '헤어 컬러 추천', hint: '골든 브라운, 라이트 카라멜이 잘 어울립니다. 블루블랙, 애쉬 그레이 계열은 피하세요.', emoji: '✂️' },
    { title: '패션 컬러 가이드', hint: '아이보리, 피치, 살몬 팔레트로 코디하면 봄 라이트의 화사함이 자연스럽게 빛납니다.', emoji: '👗' },
    { title: '맞춤 조언', hint: '웜톤 코랄 포인트와 골드 액세서리로 당신만의 봄 스타일링을 완성하는 방법을 알려드려요.', emoji: '✨' },
  ],
  '봄 브라이트': [
    { title: '메이크업 추천', hint: '립 컬러 #FF6F61 코랄 레드 · 파운데이션 피치 라이트 계열 · 골드 아이섀도우로 생기를 더하세요.', emoji: '💄' },
    { title: '헤어 컬러 추천', hint: '오렌지 브라운, 골든 하이라이트가 잘 어울립니다. 쿨 애쉬, 블루블랙 계열은 피하세요.', emoji: '✂️' },
    { title: '패션 컬러 가이드', hint: '오렌지, 코랄, 옐로우 팔레트로 코디하면 봄 브라이트의 생기가 극대화됩니다.', emoji: '👗' },
    { title: '맞춤 조언', hint: '선명한 웜톤 컬러로 트렌드를 소화하는 방법과 코랄+민트 보색 조합 팁을 알려드려요.', emoji: '✨' },
  ],
  '여름 라이트': [
    { title: '메이크업 추천', hint: '립 컬러 #E8ADC8 모브 핑크 · 파운데이션 쿨 아이보리 계열 · 라벤더 아이섀도우로 청순함을 더하세요.', emoji: '💄' },
    { title: '헤어 컬러 추천', hint: '애쉬 브라운, 라이트 애쉬 블론드가 잘 어울립니다. 오렌지 브라운, 골든 계열은 피하세요.', emoji: '✂️' },
    { title: '패션 컬러 가이드', hint: '라벤더, 로즈 화이트, 파우더 블루 팔레트로 코디하면 자연스럽게 빛납니다.', emoji: '👗' },
    { title: '맞춤 조언', hint: '쿨톤 파스텔로 트렌드를 소화하는 방법과 시즌별 컬러 전략을 알려드려요.', emoji: '✨' },
  ],
  '여름 뮤트': [
    { title: '메이크업 추천', hint: '립 컬러 #C4A0A0 모브 로즈 · 파운데이션 쿨 베이지 계열 · 라일락 그레이 아이섀도우로 세련됨을 더하세요.', emoji: '💄' },
    { title: '헤어 컬러 추천', hint: '애쉬 그레이 브라운, 쿨 다크 브라운이 잘 어울립니다. 오렌지, 구리빛 계열은 피하세요.', emoji: '✂️' },
    { title: '패션 컬러 가이드', hint: '그레이 블루, 뮤트 라일락, 로즈 그레이 팔레트로 코디하면 어른스러운 아우라가 완성됩니다.', emoji: '👗' },
    { title: '맞춤 조언', hint: '뮤트 쿨톤 컬러로 세련된 스타일링을 완성하는 방법과 시즌별 전략을 알려드려요.', emoji: '✨' },
  ],
  '가을 뮤트': [
    { title: '메이크업 추천', hint: '립 컬러 #C8A882 카멜 · 파운데이션 웜 베이지 계열 · 골든 베이지 아이섀도우로 성숙미를 더하세요.', emoji: '💄' },
    { title: '헤어 컬러 추천', hint: '다크 카라멜 브라운, 올리브 브라운이 잘 어울립니다. 플래티넘, 밝은 쿨 계열은 피하세요.', emoji: '✂️' },
    { title: '패션 컬러 가이드', hint: '카멜, 테라코타, 올리브 팔레트로 코디하면 가을 뮤트의 성숙미가 자연스럽게 빛납니다.', emoji: '👗' },
    { title: '맞춤 조언', hint: '어스톤 컬러로 트렌드를 소화하는 방법과 시즌별 웜톤 스타일링 전략을 알려드려요.', emoji: '✨' },
  ],
  '가을 딥': [
    { title: '메이크업 추천', hint: '립 컬러 #7B3F00 브릭 레드 · 파운데이션 카멜 베이지 계열 · 다크 올리브 아이섀도우로 강렬함을 더하세요.', emoji: '💄' },
    { title: '헤어 컬러 추천', hint: '딥 에스프레소, 버건디 브라운이 잘 어울립니다. 밝은 브라운, 블론드 계열은 피하세요.', emoji: '✂️' },
    { title: '패션 컬러 가이드', hint: '다크 브라운, 에스프레소, 버건디 팔레트로 코디하면 가을 딥의 카리스마가 완성됩니다.', emoji: '👗' },
    { title: '맞춤 조언', hint: '깊고 진한 컬러로 트렌드를 소화하는 방법과 시즌별 딥 웜톤 스타일링 전략을 알려드려요.', emoji: '✨' },
  ],
  '겨울 브라이트': [
    { title: '메이크업 추천', hint: '립 컬러 #CC0000 트루 레드 · 파운데이션 쿨 아이보리 계열 · 블랙 아이라이너로 또렷함을 살려보세요.', emoji: '💄' },
    { title: '헤어 컬러 추천', hint: '블루블랙, 플래티넘 실버가 잘 어울립니다. 오렌지 브라운, 카라멜 계열은 피하세요.', emoji: '✂️' },
    { title: '패션 컬러 가이드', hint: '트루 화이트, 트루 블랙, 로열 블루 팔레트로 코디하면 겨울 브라이트의 카리스마가 빛납니다.', emoji: '👗' },
    { title: '맞춤 조언', hint: '선명한 쿨톤 원색으로 트렌드를 소화하는 방법과 블랙+레드 대비 스타일링 전략을 알려드려요.', emoji: '✨' },
  ],
  '겨울 딥': [
    { title: '메이크업 추천', hint: '립 컬러 #800020 버건디 · 파운데이션 핑크 베이지 C31 계열 · 스모키 네이비 아이섀도우로 신비로움을 더하세요.', emoji: '💄' },
    { title: '헤어 컬러 추천', hint: '블루블랙, 다크 버건디가 잘 어울립니다. 브라운 계열, 골든 계열은 피하세요.', emoji: '✂️' },
    { title: '패션 컬러 가이드', hint: '딥 블랙, 미드나이트 네이비, 버건디 팔레트로 코디하면 겨울 딥의 강렬함이 완성됩니다.', emoji: '👗' },
    { title: '맞춤 조언', hint: '어두운 딥 컬러로 트렌드를 소화하는 방법과 블랙+버건디 시즌별 스타일링 전략을 알려드려요.', emoji: '✨' },
  ],
};

interface Props {
  colorType: PersonalColorType;
}

export default function LockedContent({ colorType }: Props) {
  const items = LOCKED_DATA[colorType];

  return (
    <section className="mx-auto max-w-xl px-5 py-4">
      <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">전체 분석 리포트</h2>
      <div className="space-y-3">
        {items.map((item) => (
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
