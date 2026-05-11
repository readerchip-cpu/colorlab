import type { PersonalColorType, Season } from '@/types';

export interface ColorSwatch {
  hex: string;
  name: string;
}

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
