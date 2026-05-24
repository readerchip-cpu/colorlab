import type { PersonalColorType } from '@/types';

export interface ColorItem { hex: string; name: string }
export interface TypeExtra {
  bestColors: ColorItem[];
  worstColors: ColorItem[];
  makeup: { lip: ColorItem[]; foundation: ColorItem[]; eyeshadow: ColorItem[]; blush: ColorItem[] };
  hair: { recommended: Array<{ name: string; desc: string }>; avoid: string };
  fashion: { main: string; sub: string; accent: string; tip: string };
  attributes: { hue: string; value: string; chroma: string; clarity: string; base: string; contrast: string };
  seasonal: { spring: string; summer: string; autumn: string; winter: string };
}

export const TYPE_EN: Record<PersonalColorType, string> = {
  '봄 라이트':    'Spring Light',   '봄 브라이트':  'Spring Bright',
  '여름 라이트':  'Summer Light',   '여름 뮤트':    'Summer Muted',
  '가을 뮤트':    'Autumn Muted',   '가을 딥':      'Autumn Deep',
  '겨울 브라이트': 'Winter Bright', '겨울 딥':      'Winter Deep',
};

export const CHART_POS: Record<PersonalColorType, [number, number]> = {
  '봄 라이트':    [0.45,  0.70], '봄 브라이트':  [0.65,  0.35],
  '여름 라이트':  [-0.35, 0.68], '여름 뮤트':    [-0.50, 0.20],
  '가을 뮤트':    [0.42, -0.28], '가을 딥':      [0.68, -0.65],
  '겨울 브라이트': [-0.48, 0.18], '겨울 딥':      [-0.65,-0.58],
};

export function hairHex(name: string): string {
  if (name.includes('블루블랙') || name.includes('블루 블랙')) return '#1A1A2E';
  if (name.includes('블랙') || name.includes('검정')) return '#252525';
  if (name.includes('플래티넘') || name.includes('실버')) return '#C8C0BC';
  if (name.includes('에스프레소')) return '#3C1810';
  if (name.includes('버건디')) return '#800020';
  if (name.includes('올리브')) return '#4A4818';
  if (name.includes('골든') || name.includes('골드')) return '#C89010';
  if (name.includes('카라멜') || name.includes('카퍼')) return '#C87A3C';
  if (name.includes('오렌지')) return '#D4600A';
  if (name.includes('애쉬 그레이') || name.includes('그레이 브라운')) return '#8A8880';
  if (name.includes('애쉬')) return '#7A7468';
  if (name.includes('다크') || name.includes('초코') || name.includes('딥')) return '#3C2010';
  if (name.includes('라이트') || name.includes('밝')) return '#A87840';
  return '#6B4423';
}

export const SEASON_TEXT_META = [
  { key: 'spring' as const, color: '#E89B8C', label: 'SPRING', labelKo: '봄' },
  { key: 'summer' as const, color: '#6FA8DC', label: 'SUMMER', labelKo: '여름' },
  { key: 'autumn' as const, color: '#C68642', label: 'AUTUMN', labelKo: '가을' },
  { key: 'winter' as const, color: '#4A5568', label: 'WINTER', labelKo: '겨울' },
];

export const TYPE_EXTRA: Record<PersonalColorType, TypeExtra> = {
  '봄 라이트': {
    bestColors: [
      { hex: '#FFB6C1', name: '베이비 핑크' }, { hex: '#FFDAB9', name: '피치 베이지' },
      { hex: '#FFF0F0', name: '밀키 화이트' }, { hex: '#FFE4B5', name: '버터 옐로' },
      { hex: '#B0E0E6', name: '파우더 블루' }, { hex: '#98D8C8', name: '민트 그린' },
      { hex: '#F4A7B9', name: '코랄 핑크' },  { hex: '#FFECD2', name: '샴페인 베이지' },
    ],
    worstColors: [
      { hex: '#1A1A2E', name: '네이비 블랙' }, { hex: '#8B0000', name: '다크 레드' },
      { hex: '#4B0082', name: '다크 퍼플' },  { hex: '#2F4F4F', name: '다크 슬레이트' },
    ],
    makeup: {
      lip: [{ hex: '#F4A7B9', name: '코랄 핑크' }, { hex: '#FFB6C1', name: '라이트 핑크' }, { hex: '#FF8C69', name: '살몬 오렌지' }],
      foundation: [{ hex: '#FDEBD0', name: '라이트 피치 N10' }, { hex: '#FAD5A5', name: '웜 아이보리 N20' }],
      eyeshadow: [{ hex: '#F7CAC9', name: '로즈 쿼츠' }, { hex: '#C9B8A8', name: '샌드 베이지' }],
      blush: [{ hex: '#FFB7B2', name: '코랄 핑크' }, { hex: '#FFD1DC', name: '피치 핑크' }],
    },
    hair: { recommended: [{ name: '골든 브라운', desc: '따뜻한 웜톤의 밝은 갈색' }, { name: '애쉬 브라운', desc: '자연스러운 중간 갈색' }, { name: '라이트 카라멜', desc: '밝고 따뜻한 카라멜 계열' }], avoid: '쿨 블랙, 블루 블랙, 애쉬 그레이 계열' },
    fashion: { main: '아이보리, 피치, 살몬', sub: '코랄, 민트, 라이트 블루', accent: '골드, 옐로우 그린', tip: '밝고 맑은 파스텔 위에 코랄 포인트를 더하면 봄 라이트의 화사함이 살아납니다.' },
    attributes: { hue: 'Warm Yellow-Red', value: 'Light', chroma: 'Soft', clarity: 'Clear', base: 'Yellow Base', contrast: 'Low' },
    seasonal: { spring: '피치 블라우스 + 아이보리 슬랙스 + 골드 액세서리', summer: '민트 린넨 셔츠 + 화이트 쇼츠 + 살몬 샌들', autumn: '카멜 가디건 + 크림 팬츠 + 베이지 로퍼', winter: '아이보리 터틀넥 + 라이트 그레이 코트 + 골드 이어링' },
  },
  '봄 브라이트': {
    bestColors: [
      { hex: '#FFD700', name: '골든 옐로' }, { hex: '#FF8C69', name: '살몬 코랄' },
      { hex: '#90EE90', name: '민트 그린' }, { hex: '#FF6F61', name: '코랄 레드' },
      { hex: '#FFA500', name: '오렌지' },   { hex: '#FFFACD', name: '레몬 크림' },
      { hex: '#40E0D0', name: '터키즈' },   { hex: '#FF69B4', name: '핫 핑크' },
    ],
    worstColors: [
      { hex: '#708090', name: '슬레이트 그레이' }, { hex: '#4B0082', name: '인디고' },
      { hex: '#A9A9A9', name: '뮤트 그레이' },    { hex: '#696969', name: '딤 그레이' },
    ],
    makeup: {
      lip: [{ hex: '#FF6F61', name: '코랄 레드' }, { hex: '#FF8C69', name: '살몬 핑크' }, { hex: '#FFA500', name: '오렌지 코랄' }],
      foundation: [{ hex: '#FDEBD0', name: '피치 라이트 N21' }, { hex: '#F5CBA7', name: '웜 베이지 W23' }],
      eyeshadow: [{ hex: '#FFD580', name: '골드' }, { hex: '#A0522D', name: '테라코타' }],
      blush: [{ hex: '#FF8C69', name: '살몬' }, { hex: '#FFA07A', name: '코랄' }],
    },
    hair: { recommended: [{ name: '오렌지 브라운', desc: '활기차고 따뜻한 오렌지 계열' }, { name: '골든 하이라이트', desc: '밝은 골드 하이라이트 믹스' }, { name: '라이트 카퍼', desc: '구리빛의 밝은 브라운' }], avoid: '쿨 애쉬, 블루 블랙, 무채색 계열' },
    fashion: { main: '오렌지, 코랄, 옐로우', sub: '민트, 터키즈, 그린', accent: '골드, 레드', tip: '코랄 + 민트처럼 보색 대비를 활용하면 봄 브라이트의 생기가 극대화됩니다.' },
    attributes: { hue: 'Warm Yellow-Orange', value: 'Light-Medium', chroma: 'Bright', clarity: 'Clear', base: 'Yellow Base', contrast: 'Medium-High' },
    seasonal: { spring: '코랄 탑 + 화이트 데님 + 골드 스니커즈', summer: '옐로우 원피스 + 터키즈 액세서리', autumn: '머스타드 재킷 + 오렌지 이너 + 카멜 팬츠', winter: '레드 코트 + 아이보리 터틀넥 + 골드 벨트' },
  },
  '여름 라이트': {
    bestColors: [
      { hex: '#E6C8D8', name: '로즈 라일락' }, { hex: '#B0C4DE', name: '라이트 스틸' },
      { hex: '#D8BFD8', name: '씨슬 모브' },  { hex: '#C9B1D3', name: '소프트 라벤더' },
      { hex: '#F0E6EF', name: '파우더 핑크' }, { hex: '#B0E0E6', name: '파우더 블루' },
      { hex: '#E8E8E8', name: '라이트 실버' }, { hex: '#FFF5EE', name: '플로럴 화이트' },
    ],
    worstColors: [
      { hex: '#FF6600', name: '오렌지' }, { hex: '#8B4513', name: '새들 브라운' },
      { hex: '#B8860B', name: '다크 골든' }, { hex: '#228B22', name: '포레스트 그린' },
    ],
    makeup: {
      lip: [{ hex: '#E8ADC8', name: '모브 핑크' }, { hex: '#D8A0B8', name: '로즈 핑크' }, { hex: '#C8B0D0', name: '라일락 핑크' }],
      foundation: [{ hex: '#F5E6EF', name: '쿨 아이보리 C10' }, { hex: '#E8D5DF', name: '핑크 베이지 C21' }],
      eyeshadow: [{ hex: '#C9B1D3', name: '라벤더' }, { hex: '#B0C4DE', name: '스카이 블루' }],
      blush: [{ hex: '#E6C8D8', name: '라이트 로즈' }, { hex: '#D8BFD8', name: '핑크 라일락' }],
    },
    hair: { recommended: [{ name: '애쉬 브라운', desc: '차갑고 세련된 애쉬 계열 갈색' }, { name: '라이트 애쉬 블론드', desc: '밝고 쿨한 금발 계열' }, { name: '베이지 브라운', desc: '쿨한 베이지 갈색' }], avoid: '오렌지 브라운, 골든 블론드, 구리빛 계열' },
    fashion: { main: '라벤더, 파우더 블루, 로즈 핑크', sub: '소프트 화이트, 실버 그레이', accent: '딥 버건디, 네이비', tip: '라벤더 + 소프트 블루처럼 동계색을 레이어링하면 우아하고 시원한 분위기가 연출됩니다.' },
    attributes: { hue: 'Cool Pink-Blue', value: 'Light', chroma: 'Soft', clarity: 'Muted', base: 'Pink Base', contrast: 'Low' },
    seasonal: { spring: '라벤더 블라우스 + 화이트 스커트 + 실버 플랫', summer: '소프트 블루 린넨 + 파우더 핑크 액세서리', autumn: '로즈 그레이 니트 + 딥 버건디 팬츠', winter: '실버 화이트 코트 + 라이트 블루 터틀넥' },
  },
  '여름 뮤트': {
    bestColors: [
      { hex: '#C4A0A0', name: '모브 로즈' }, { hex: '#A0B4C8', name: '스틸 블루' },
      { hex: '#B8A8C8', name: '그레이 라벤더' }, { hex: '#9EB8B8', name: '틸 그레이' },
      { hex: '#B8B0C8', name: '그레이 퍼플' }, { hex: '#C8B8B8', name: '로즈 그레이' },
      { hex: '#A8B8C8', name: '뮤트 스틸' }, { hex: '#D8CCC8', name: '핑키 베이지' },
    ],
    worstColors: [
      { hex: '#FF4500', name: '오렌지 레드' }, { hex: '#FFD700', name: '브라이트 옐로' },
      { hex: '#00FF00', name: '라임 그린' },  { hex: '#FF69B4', name: '핫 핑크' },
    ],
    makeup: {
      lip: [{ hex: '#C4A0A0', name: '모브 로즈' }, { hex: '#B8A8C8', name: '로즈 모브' }, { hex: '#A89098', name: '뮤트 로즈' }],
      foundation: [{ hex: '#E8D5DF', name: '쿨 베이지 C22' }, { hex: '#DCC8D5', name: '핑크 베이지 C31' }],
      eyeshadow: [{ hex: '#B8A8C8', name: '라일락 그레이' }, { hex: '#A0B4C8', name: '뮤트 블루' }],
      blush: [{ hex: '#C4A0A0', name: '로즈 뮤트' }, { hex: '#B8A8B8', name: '모브' }],
    },
    hair: { recommended: [{ name: '애쉬 그레이 브라운', desc: '차갑고 뮤트한 회갈색' }, { name: '쿨 다크 브라운', desc: '깊고 차가운 어두운 갈색' }, { name: '라이트 애쉬', desc: '밝은 재색 계열' }], avoid: '오렌지 브라운, 구리빛, 레드 브라운' },
    fashion: { main: '그레이 블루, 뮤트 라일락, 로즈 그레이', sub: '딥 네이비, 차콜 그레이', accent: '버건디, 다크 퍼플', tip: '그레이 블루 + 뮤트 로즈처럼 유사한 채도 레벨을 유지하면 세련된 분위기가 나옵니다.' },
    attributes: { hue: 'Cool Pink-Gray', value: 'Medium', chroma: 'Muted', clarity: 'Muted', base: 'Pink Base', contrast: 'Low-Medium' },
    seasonal: { spring: '뮤트 라벤더 블라우스 + 그레이 슬랙스', summer: '그레이 블루 린넨 셔츠 + 로즈 스커트', autumn: '차콜 니트 + 로즈 그레이 팬츠 + 버건디 스카프', winter: '딥 네이비 코트 + 뮤트 핑크 이너' },
  },
  '가을 뮤트': {
    bestColors: [
      { hex: '#C8A882', name: '카멜 베이지' }, { hex: '#8B7355', name: '토프 브라운' },
      { hex: '#A0785A', name: '테라코타 브라운' }, { hex: '#D4A574', name: '샌드 베이지' },
      { hex: '#8B6914', name: '올리브 골드' }, { hex: '#B89878', name: '모카 베이지' },
      { hex: '#C4A87A', name: '머스타드 베이지' }, { hex: '#9A7B5A', name: '카키 브라운' },
    ],
    worstColors: [
      { hex: '#FF69B4', name: '핫 핑크' }, { hex: '#00BFFF', name: '딥 스카이 블루' },
      { hex: '#9400D3', name: '다크 바이올렛' }, { hex: '#FF4500', name: '오렌지 레드' },
    ],
    makeup: {
      lip: [{ hex: '#C8A882', name: '카멜' }, { hex: '#A0785A', name: '테라코타' }, { hex: '#8B6914', name: '머스타드 브라운' }],
      foundation: [{ hex: '#F5CBA7', name: '웜 베이지 W23' }, { hex: '#EDBB99', name: '카멜 베이지 W31' }],
      eyeshadow: [{ hex: '#C4A87A', name: '골든 베이지' }, { hex: '#8B6914', name: '올리브 골드' }],
      blush: [{ hex: '#C8A882', name: '피치 베이지' }, { hex: '#E5AA70', name: '살몬 베이지' }],
    },
    hair: { recommended: [{ name: '다크 카라멜 브라운', desc: '깊고 따뜻한 카라멜 갈색' }, { name: '올리브 브라운', desc: '녹빛이 감도는 어두운 갈색' }, { name: '다크 초코', desc: '뮤트한 깊은 초콜릿 브라운' }], avoid: '애쉬 블론드, 플래티넘, 밝은 쿨 계열' },
    fashion: { main: '카멜, 베이지, 테라코타', sub: '올리브, 머스타드, 카키', accent: '버건디, 다크 브라운', tip: '카멜 + 올리브처럼 따뜻하면서도 채도 낮은 조합이 가을 뮤트의 성숙미를 살립니다.' },
    attributes: { hue: 'Warm Yellow-Brown', value: 'Medium', chroma: 'Muted', clarity: 'Muted', base: 'Yellow Base', contrast: 'Medium' },
    seasonal: { spring: '베이지 재킷 + 화이트 이너 + 카멜 팬츠', summer: '올리브 린넨 셔츠 + 카키 쇼츠', autumn: '테라코타 니트 + 머스타드 스커트 + 브라운 부츠', winter: '카멜 울코트 + 버건디 터틀넥 + 다크 브라운 팬츠' },
  },
  '가을 딥': {
    bestColors: [
      { hex: '#7B3F00', name: '다크 초코' }, { hex: '#8B4513', name: '새들 브라운' },
      { hex: '#4A3728', name: '에스프레소' }, { hex: '#6B3A2A', name: '딥 테라코타' },
      { hex: '#556B2F', name: '다크 올리브' }, { hex: '#704214', name: '버번 브라운' },
      { hex: '#8B6914', name: '다크 골드' }, { hex: '#5C4033', name: '딥 코코아' },
    ],
    worstColors: [
      { hex: '#FFB6C1', name: '라이트 핑크' }, { hex: '#E0E0FF', name: '라이트 라벤더' },
      { hex: '#B0E0E6', name: '파우더 블루' }, { hex: '#98FB98', name: '페일 그린' },
    ],
    makeup: {
      lip: [{ hex: '#7B3F00', name: '브릭 레드' }, { hex: '#8B0000', name: '딥 레드' }, { hex: '#A0522D', name: '테라코타' }],
      foundation: [{ hex: '#EDBB99', name: '카멜 베이지 W31' }, { hex: '#E0A080', name: '딥 웜 W41' }],
      eyeshadow: [{ hex: '#556B2F', name: '다크 올리브' }, { hex: '#7B3F00', name: '다크 브라운' }],
      blush: [{ hex: '#8B4513', name: '테라코타' }, { hex: '#A0522D', name: '브릭' }],
    },
    hair: { recommended: [{ name: '딥 에스프레소', desc: '진하고 깊은 에스프레소 블랙' }, { name: '다크 올리브 브라운', desc: '녹색기의 매우 어두운 갈색' }, { name: '버건디 브라운', desc: '레드기의 깊은 갈색' }], avoid: '라이트 브라운, 블론드, 밝은 하이라이트' },
    fashion: { main: '다크 브라운, 에스프레소, 버건디', sub: '다크 올리브, 카키', accent: '딥 골드, 레드', tip: '에스프레소 + 버건디처럼 명도 차이가 적은 조합이 가을 딥의 카리스마를 극대화합니다.' },
    attributes: { hue: 'Warm Deep Brown-Red', value: 'Deep', chroma: 'Muted-Rich', clarity: 'Muted', base: 'Yellow Base', contrast: 'Medium-High' },
    seasonal: { spring: '버건디 재킷 + 카멜 이너 + 다크 브라운 팬츠', summer: '다크 올리브 셔츠 + 카키 팬츠', autumn: '딥 브라운 코트 + 에스프레소 터틀넥 + 가죽 부츠', winter: '다크 버건디 울코트 + 블랙 이너 + 골드 액세서리' },
  },
  '겨울 브라이트': {
    bestColors: [
      { hex: '#CC0000', name: '트루 레드' },  { hex: '#0000CD', name: '로얄 블루' },
      { hex: '#FFFFFF', name: '퓨어 화이트' }, { hex: '#111111', name: '트루 블랙' },
      { hex: '#9400D3', name: '바이올렛' },   { hex: '#00CED1', name: '다크 터키즈' },
      { hex: '#FF00FF', name: '마젠타' },     { hex: '#006400', name: '다크 그린' },
    ],
    worstColors: [
      { hex: '#C8A882', name: '카멜 베이지' }, { hex: '#FFDAB9', name: '피치' },
      { hex: '#C4A0A0', name: '뮤트 로즈' },  { hex: '#D4A574', name: '샌드 베이지' },
    ],
    makeup: {
      lip: [{ hex: '#CC0000', name: '트루 레드' }, { hex: '#9400D3', name: '베리 퍼플' }, { hex: '#FF1493', name: '딥 핑크' }],
      foundation: [{ hex: '#F5E6EF', name: '쿨 아이보리 C10' }, { hex: '#E8D5DF', name: '핑크 페어 C21' }],
      eyeshadow: [{ hex: '#111111', name: '블랙' }, { hex: '#0000CD', name: '네이비 블루' }],
      blush: [{ hex: '#CC4488', name: '핑크 마젠타' }, { hex: '#9B2335', name: '딥 로즈' }],
    },
    hair: { recommended: [{ name: '블루 블랙', desc: '차갑고 선명한 블루 기반 블랙' }, { name: '플래티넘 실버', desc: '밝고 차가운 은발 계열' }, { name: '내추럴 블랙', desc: '순수하고 선명한 블랙' }], avoid: '오렌지 브라운, 골든 블론드, 레드 브라운, 카라멜' },
    fashion: { main: '트루 화이트, 트루 블랙, 트루 레드', sub: '로얄 블루, 바이올렛', accent: '마젠타, 실버', tip: '블랙 + 레드처럼 명도 대비가 강한 컬러 조합이 겨울 브라이트의 카리스마를 살립니다.' },
    attributes: { hue: 'Cool Blue-Pink', value: 'Light-Deep', chroma: 'Bright', clarity: 'Clear', base: 'Pink Base', contrast: 'High' },
    seasonal: { spring: '화이트 블라우스 + 네이비 팬츠 + 레드 포인트 백', summer: '블루+화이트 스트라이프 마린 룩', autumn: '블랙 코트 + 레드 이너 + 실버 액세서리', winter: '퓨어 화이트 코트 + 블랙 터틀넥 + 바이올렛 스카프' },
  },
  '겨울 딥': {
    bestColors: [
      { hex: '#1C1C2E', name: '블랙 퍼플' }, { hex: '#003366', name: '다크 네이비' },
      { hex: '#2C3E50', name: '미드나이트 블루' }, { hex: '#800020', name: '버건디' },
      { hex: '#006060', name: '딥 틸' }, { hex: '#4B0082', name: '인디고' },
      { hex: '#1A1A1A', name: '딥 블랙' }, { hex: '#36013F', name: '딥 퍼플' },
    ],
    worstColors: [
      { hex: '#FFDAB9', name: '피치' }, { hex: '#FFD580', name: '골든 옐로' },
      { hex: '#C8A882', name: '카멜' }, { hex: '#98FB98', name: '페일 그린' },
    ],
    makeup: {
      lip: [{ hex: '#800020', name: '버건디' }, { hex: '#4B0082', name: '플럼' }, { hex: '#CC0000', name: '딥 레드' }],
      foundation: [{ hex: '#DCC8D5', name: '핑크 베이지 C31' }, { hex: '#CCB8C8', name: '쿨 딥 C41' }],
      eyeshadow: [{ hex: '#2C3E50', name: '스모키 네이비' }, { hex: '#4B0082', name: '딥 퍼플' }],
      blush: [{ hex: '#800020', name: '딥 로즈' }, { hex: '#9B2335', name: '다크 베리' }],
    },
    hair: { recommended: [{ name: '블루 블랙', desc: '가장 깊고 차가운 블루 블랙' }, { name: '내추럴 블랙', desc: '깊고 선명한 블랙' }, { name: '다크 버건디', desc: '매우 어두운 버건디 계열' }], avoid: '브라운 계열, 골든 계열, 밝은 색 전반' },
    fashion: { main: '딥 블랙, 미드나이트 네이비, 버건디', sub: '인디고, 딥 틸', accent: '실버, 딥 골드', tip: '블랙 + 버건디 또는 네이비 + 인디고처럼 어두운 계열 안에서 명도 차이를 활용하면 겨울 딥의 강렬미가 완성됩니다.' },
    attributes: { hue: 'Cool Blue-Red', value: 'Deep', chroma: 'Clear-Rich', clarity: 'Clear', base: 'Pink Base', contrast: 'High' },
    seasonal: { spring: '네이비 블레이저 + 화이트 이너 + 블랙 팬츠', summer: '딥 버건디 셔츠 + 블랙 팬츠', autumn: '블랙 코트 + 버건디 터틀넥 + 다크 네이비 팬츠', winter: '미드나이트 네이비 코트 + 블랙 + 실버 액세서리' },
  },
};
