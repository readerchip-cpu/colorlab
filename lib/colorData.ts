import type { PersonalColorType, Season } from '@/types';

export interface ColorSwatch {
  hex: string;
  name: string;
}

export const TYPE_DISPLAY: Record<PersonalColorType, string> = {
  봄밝음: '봄 웜 브라이트',
  봄연함: '봄 웜 라이트',
  여름연함: '여름 쿨 라이트',
  여름밝음: '여름 쿨 브라이트',
  여름뮤트: '여름 쿨 뮤트',
  가을뮤트: '가을 웜 뮤트',
  가을강함: '가을 웜 스트롱',
  가을딥: '가을 웜 딥',
  겨울딥: '겨울 쿨 딥',
  겨울밝음: '겨울 쿨 브라이트',
  겨울뮤트: '겨울 쿨 뮤트',
  겨울강함: '겨울 쿨 스트롱',
};

export const SEASON_GRADIENT: Record<Season, string> = {
  봄: 'from-rose-50 via-amber-50/50',
  여름: 'from-sky-50 via-pink-50/50',
  가을: 'from-amber-50 via-orange-50/50',
  겨울: 'from-violet-50 via-indigo-50/50',
};

export const TYPE_PALETTE: Record<PersonalColorType, [ColorSwatch, ColorSwatch, ColorSwatch]> = {
  봄밝음: [
    { hex: '#FFD580', name: '골든 옐로' },
    { hex: '#FF8C69', name: '살몬 코랄' },
    { hex: '#90EE90', name: '민트 그린' },
  ],
  봄연함: [
    { hex: '#FFB6C1', name: '베이비 핑크' },
    { hex: '#FFDAB9', name: '피치 베이지' },
    { hex: '#B0E0E6', name: '파우더 블루' },
  ],
  여름연함: [
    { hex: '#E6C8D8', name: '로즈 라일락' },
    { hex: '#B0C4DE', name: '라이트 스틸' },
    { hex: '#D8BFD8', name: '씨슬 모브' },
  ],
  여름밝음: [
    { hex: '#89CFF0', name: '베이비 블루' },
    { hex: '#F4C2C2', name: '밀키 핑크' },
    { hex: '#B8D8C8', name: '세이지 민트' },
  ],
  여름뮤트: [
    { hex: '#C4A0A0', name: '모브 로즈' },
    { hex: '#A0B4C8', name: '스틸 블루' },
    { hex: '#B8A8C8', name: '그레이 라벤더' },
  ],
  가을뮤트: [
    { hex: '#C8A882', name: '카멜 베이지' },
    { hex: '#8B7355', name: '토프 브라운' },
    { hex: '#A0A878', name: '올리브 카키' },
  ],
  가을강함: [
    { hex: '#B87333', name: '코퍼 오렌지' },
    { hex: '#8B4513', name: '새들 브라운' },
    { hex: '#6B8E23', name: '올리브 그린' },
  ],
  가을딥: [
    { hex: '#7B3F00', name: '초콜릿 브라운' },
    { hex: '#556B2F', name: '다크 올리브' },
    { hex: '#8B2500', name: '번트 시에나' },
  ],
  겨울딥: [
    { hex: '#1C1C2E', name: '딥 네이비' },
    { hex: '#2E0854', name: '다크 퍼플' },
    { hex: '#1A3A2A', name: '딥 포레스트' },
  ],
  겨울밝음: [
    { hex: '#F0F0FF', name: '아이시 화이트' },
    { hex: '#D0E8FF', name: '아이스 블루' },
    { hex: '#F0E8FF', name: '레이브 라벤더' },
  ],
  겨울뮤트: [
    { hex: '#8896A8', name: '쿨 그레이' },
    { hex: '#A0A0B8', name: '블루 그레이' },
    { hex: '#888898', name: '라벤더 그레이' },
  ],
  겨울강함: [
    { hex: '#CC0000', name: '트루 레드' },
    { hex: '#1A1AFF', name: '로열 블루' },
    { hex: '#00CC66', name: '에메랄드' },
  ],
};
