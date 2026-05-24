import type { PersonalColorType, Season } from '@/types';

export interface ColorSwatch {
  hex: string;
  name: string;
}

export const TYPE_EN: Record<PersonalColorType, string> = {
  '봄 라이트':    'Spring Light',
  '봄 브라이트':  'Spring Bright',
  '여름 라이트':  'Summer Light',
  '여름 뮤트':    'Summer Muted',
  '가을 뮤트':    'Autumn Muted',
  '가을 딥':      'Autumn Deep',
  '겨울 브라이트': 'Winter Bright',
  '겨울 딥':      'Winter Deep',
};

export const TYPE_DISPLAY: Record<PersonalColorType, string> = {
  '봄 라이트':    '봄 웜 라이트',
  '봄 브라이트':  '봄 웜 브라이트',
  '여름 라이트':  '여름 쿨 라이트',
  '여름 뮤트':   '여름 쿨 뮤트',
  '가을 뮤트':   '가을 웜 뮤트',
  '가을 딥':     '가을 웜 딥',
  '겨울 브라이트': '겨울 쿨 브라이트',
  '겨울 딥':     '겨울 쿨 딥',
};

export const SEASON_GRADIENT: Record<Season, string> = {
  봄: 'from-rose-50 via-amber-50/50',
  여름: 'from-sky-50 via-pink-50/50',
  가을: 'from-amber-50 via-orange-50/50',
  겨울: 'from-violet-50 via-indigo-50/50',
};

export const TYPE_PALETTE: Record<PersonalColorType, [ColorSwatch, ColorSwatch, ColorSwatch]> = {
  '봄 라이트': [
    { hex: '#FFB6C1', name: '베이비 핑크' },
    { hex: '#FFDAB9', name: '피치 베이지' },
    { hex: '#B0E0E6', name: '파우더 블루' },
  ],
  '봄 브라이트': [
    { hex: '#FFD580', name: '골든 옐로' },
    { hex: '#FF8C69', name: '살몬 코랄' },
    { hex: '#90EE90', name: '민트 그린' },
  ],
  '여름 라이트': [
    { hex: '#E6C8D8', name: '로즈 라일락' },
    { hex: '#B0C4DE', name: '라이트 스틸' },
    { hex: '#D8BFD8', name: '씨슬 모브' },
  ],
  '여름 뮤트': [
    { hex: '#C4A0A0', name: '모브 로즈' },
    { hex: '#A0B4C8', name: '스틸 블루' },
    { hex: '#B8A8C8', name: '그레이 라벤더' },
  ],
  '가을 뮤트': [
    { hex: '#C8A882', name: '카멜 베이지' },
    { hex: '#8B7355', name: '토프 브라운' },
    { hex: '#A0A878', name: '올리브 카키' },
  ],
  '가을 딥': [
    { hex: '#7B3F00', name: '초콜릿 브라운' },
    { hex: '#556B2F', name: '다크 올리브' },
    { hex: '#8B2500', name: '번트 시에나' },
  ],
  '겨울 브라이트': [
    { hex: '#CC0000', name: '트루 레드' },
    { hex: '#1A1AFF', name: '로열 블루' },
    { hex: '#00CC66', name: '에메랄드' },
  ],
  '겨울 딥': [
    { hex: '#1C1C2E', name: '딥 네이비' },
    { hex: '#2E0854', name: '다크 퍼플' },
    { hex: '#1A3A2A', name: '딥 포레스트' },
  ],
};

// 타입별 서사형 설명 (report_content 없을 때 폴백)
export const TYPE_DESCRIPTION: Record<PersonalColorType, string> = {
  '봄 라이트':    '지금까지 고른 색들이 틀렸던 게 아니에요. 단지 당신의 색이 아니었을 뿐이에요. 따뜻하고 투명한 봄 라이트 타입인 당신에게는 피치·베이비 핑크·밀키 화이트처럼 부드럽고 맑은 컬러가 피부를 가장 환하게 살려줘요.',
  '봄 브라이트':  '당신의 색은 생각보다 훨씬 선명하고 따뜻해요. 봄 브라이트 타입인 당신에게는 코랄·오렌지·골든 옐로처럼 채도 높은 웜톤 컬러들이 피부에 건강한 생기를 불어넣어줘요.',
  '여름 라이트':  '당신에게 어울리는 색은 힘을 뺄수록 더 빛나요. 여름 라이트 타입인 당신에게는 라벤더·로즈 핑크·파우더 블루처럼 맑고 차분한 쿨톤 컬러들이 자연스러운 투명감을 살려줘요.',
  '여름 뮤트':   '세련미는 화려함에서 오지 않아요. 여름 뮤트 타입인 당신에게는 그레이 라벤더·모브 로즈·스틸 블루처럼 채도를 낮춘 쿨톤 컬러들이 어른스럽고 차분한 아우라를 완성시켜줘요.',
  '가을 뮤트':   '당신의 매력은 깊고 따뜻해요. 가을 뮤트 타입인 당신에게는 카멜·테라코타·올리브처럼 자연에서 온 어스톤 컬러들이 피부를 더욱 윤기 있고 성숙하게 만들어줘요.',
  '가을 딥':     '강렬한 색이 두렵지 않아도 돼요, 오히려 당신의 무기예요. 가을 딥 타입인 당신에게는 딥 브라운·번트 시에나·다크 올리브처럼 어둡고 풍부한 웜톤 컬러들이 가장 자연스럽게 어울려요.',
  '겨울 브라이트': '당신은 원색을 소화할 수 있는 드문 타입이에요. 겨울 브라이트 타입인 당신에게는 트루 레드·로열 블루·에메랄드처럼 선명한 쿨톤 컬러들이 또렷한 이목구비를 더욱 돋보이게 해줘요.',
  '겨울 딥':     '당신의 색은 어두울수록 강해져요. 겨울 딥 타입인 당신에게는 미드나이트 네이비·딥 버건디·다크 퍼플처럼 깊고 차가운 딥 컬러들이 신비롭고 강렬한 존재감을 완성시켜줘요.',
};

// 타입별 대표 단색 (OG 이미지·미리보기용)
export const TYPE_REPRESENTATIVE: Record<PersonalColorType, string> = {
  '봄 라이트':    '#FFB6C1',
  '봄 브라이트':  '#FFD580',
  '여름 라이트':  '#E6C8D8',
  '여름 뮤트':   '#C4A0A0',
  '가을 뮤트':   '#C8A882',
  '가을 딥':     '#7B3F00',
  '겨울 브라이트': '#CC0000',
  '겨울 딥':     '#1C1C2E',
};
