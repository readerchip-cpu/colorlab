'use client';

import '@/lib/pdf/font';
import {
  Document, Page, View, Text, StyleSheet,
  Svg, Line, Circle as SvgCircle, Rect,
} from '@react-pdf/renderer';
import { TYPE_PALETTE, TYPE_DISPLAY, TYPE_REPRESENTATIVE } from '@/lib/colorData';
import type { PersonalColorType } from '@/types';

// ── Static type metadata ────────────────────────────────────────

const TYPE_EN: Record<PersonalColorType, string> = {
  '봄 라이트':    'Spring Light',
  '봄 브라이트':  'Spring Bright',
  '여름 라이트':  'Summer Light',
  '여름 뮤트':    'Summer Muted',
  '가을 뮤트':    'Autumn Muted',
  '가을 딥':      'Autumn Deep',
  '겨울 브라이트': 'Winter Bright',
  '겨울 딥':      'Winter Deep',
};

// x: -1=Cool, +1=Warm / y: -1=Deep, +1=Light
const CHART_POS: Record<PersonalColorType, [number, number]> = {
  '봄 라이트':    [0.45, 0.70],
  '봄 브라이트':  [0.65, 0.35],
  '여름 라이트':  [-0.35, 0.68],
  '여름 뮤트':    [-0.50, 0.20],
  '가을 뮤트':    [0.42, -0.28],
  '가을 딥':      [0.68, -0.65],
  '겨울 브라이트': [-0.48, 0.18],
  '겨울 딥':      [-0.65, -0.58],
};

interface ColorItem { hex: string; name: string }

interface TypeExtra {
  bestColors: ColorItem[];
  worstColors: ColorItem[];
  makeup: {
    lip: ColorItem[];
    foundation: ColorItem[];
    eyeshadow: ColorItem[];
    blush: ColorItem[];
  };
  hair: { recommended: Array<{ name: string; desc: string }>; avoid: string };
  fashion: { main: string; sub: string; accent: string; tip: string };
  attributes: { hue: string; value: string; chroma: string; clarity: string; base: string; contrast: string };
  seasonal: { spring: string; summer: string; autumn: string; winter: string };
}

const TYPE_EXTRA: Record<PersonalColorType, TypeExtra> = {
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
    hair: {
      recommended: [
        { name: '골든 브라운', desc: '따뜻한 웜톤의 밝은 갈색' },
        { name: '애쉬 브라운', desc: '자연스러운 중간 갈색' },
        { name: '라이트 카라멜', desc: '밝고 따뜻한 카라멜 계열' },
      ],
      avoid: '쿨 블랙, 블루 블랙, 애쉬 그레이 계열',
    },
    fashion: {
      main: '아이보리, 피치, 살몬', sub: '코랄, 민트, 라이트 블루',
      accent: '골드, 옐로우 그린',
      tip: '밝고 맑은 파스텔 위에 코랄 포인트를 더하면 봄 라이트의 화사함이 살아납니다.',
    },
    attributes: { hue: 'Warm Yellow-Red', value: 'Light', chroma: 'Soft', clarity: 'Clear', base: 'Yellow Base', contrast: 'Low' },
    seasonal: {
      spring: '피치 블라우스 + 아이보리 슬랙스 + 골드 액세서리',
      summer: '민트 린넨 셔츠 + 화이트 쇼츠 + 살몬 샌들',
      autumn: '카멜 가디건 + 크림 팬츠 + 베이지 로퍼',
      winter: '아이보리 터틀넥 + 라이트 그레이 코트 + 골드 이어링',
    },
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
    hair: {
      recommended: [
        { name: '오렌지 브라운', desc: '활기차고 따뜻한 오렌지 계열' },
        { name: '골든 하이라이트', desc: '밝은 골드 하이라이트 믹스' },
        { name: '라이트 카퍼', desc: '구리빛의 밝은 브라운' },
      ],
      avoid: '쿨 애쉬, 블루 블랙, 무채색 계열',
    },
    fashion: {
      main: '오렌지, 코랄, 옐로우', sub: '민트, 터키즈, 그린',
      accent: '골드, 레드',
      tip: '코랄 + 민트처럼 보색 대비를 활용하면 봄 브라이트의 생기가 극대화됩니다.',
    },
    attributes: { hue: 'Warm Yellow-Orange', value: 'Light-Medium', chroma: 'Bright', clarity: 'Clear', base: 'Yellow Base', contrast: 'Medium-High' },
    seasonal: {
      spring: '코랄 탑 + 화이트 데님 + 골드 스니커즈',
      summer: '옐로우 원피스 + 터키즈 액세서리',
      autumn: '머스타드 재킷 + 오렌지 이너 + 카멜 팬츠',
      winter: '레드 코트 + 아이보리 터틀넥 + 골드 벨트',
    },
  },
  '여름 라이트': {
    bestColors: [
      { hex: '#E6C8D8', name: '로즈 라일락' }, { hex: '#B0C4DE', name: '라이트 스틸' },
      { hex: '#D8BFD8', name: '씨슬 모브' }, { hex: '#C9B1D3', name: '소프트 라벤더' },
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
    hair: {
      recommended: [
        { name: '애쉬 브라운', desc: '차갑고 세련된 애쉬 계열 갈색' },
        { name: '라이트 애쉬 블론드', desc: '밝고 쿨한 금발 계열' },
        { name: '베이지 브라운', desc: '쿨한 베이지 갈색' },
      ],
      avoid: '오렌지 브라운, 골든 블론드, 구리빛 계열',
    },
    fashion: {
      main: '라벤더, 파우더 블루, 로즈 핑크', sub: '소프트 화이트, 실버 그레이',
      accent: '딥 버건디, 네이비',
      tip: '라벤더 + 소프트 블루처럼 동계색을 레이어링하면 우아하고 시원한 분위기가 연출됩니다.',
    },
    attributes: { hue: 'Cool Pink-Blue', value: 'Light', chroma: 'Soft', clarity: 'Muted', base: 'Pink Base', contrast: 'Low' },
    seasonal: {
      spring: '라벤더 블라우스 + 화이트 스커트 + 실버 플랫',
      summer: '소프트 블루 린넨 + 파우더 핑크 액세서리',
      autumn: '로즈 그레이 니트 + 딥 버건디 팬츠',
      winter: '실버 화이트 코트 + 라이트 블루 터틀넥',
    },
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
      { hex: '#00FF00', name: '라임 그린' }, { hex: '#FF69B4', name: '핫 핑크' },
    ],
    makeup: {
      lip: [{ hex: '#C4A0A0', name: '모브 로즈' }, { hex: '#B8A8C8', name: '로즈 모브' }, { hex: '#A89098', name: '뮤트 로즈' }],
      foundation: [{ hex: '#E8D5DF', name: '쿨 베이지 C22' }, { hex: '#DCC8D5', name: '핑크 베이지 C31' }],
      eyeshadow: [{ hex: '#B8A8C8', name: '라일락 그레이' }, { hex: '#A0B4C8', name: '뮤트 블루' }],
      blush: [{ hex: '#C4A0A0', name: '로즈 뮤트' }, { hex: '#B8A8B8', name: '모브' }],
    },
    hair: {
      recommended: [
        { name: '애쉬 그레이 브라운', desc: '차갑고 뮤트한 회갈색' },
        { name: '쿨 다크 브라운', desc: '깊고 차가운 어두운 갈색' },
        { name: '라이트 애쉬', desc: '밝은 재색 계열' },
      ],
      avoid: '오렌지 브라운, 구리빛, 레드 브라운',
    },
    fashion: {
      main: '그레이 블루, 뮤트 라일락, 로즈 그레이', sub: '딥 네이비, 차콜 그레이',
      accent: '버건디, 다크 퍼플',
      tip: '그레이 블루 + 뮤트 로즈처럼 유사한 채도 레벨을 유지하면 세련된 분위기가 나옵니다.',
    },
    attributes: { hue: 'Cool Pink-Gray', value: 'Medium', chroma: 'Muted', clarity: 'Muted', base: 'Pink Base', contrast: 'Low-Medium' },
    seasonal: {
      spring: '뮤트 라벤더 블라우스 + 그레이 슬랙스',
      summer: '그레이 블루 린넨 셔츠 + 로즈 스커트',
      autumn: '차콜 니트 + 로즈 그레이 팬츠 + 버건디 스카프',
      winter: '딥 네이비 코트 + 뮤트 핑크 이너',
    },
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
    hair: {
      recommended: [
        { name: '다크 카라멜 브라운', desc: '깊고 따뜻한 카라멜 갈색' },
        { name: '올리브 브라운', desc: '녹빛이 감도는 어두운 갈색' },
        { name: '다크 초코', desc: '뮤트한 깊은 초콜릿 브라운' },
      ],
      avoid: '애쉬 블론드, 플래티넘, 밝은 쿨 계열',
    },
    fashion: {
      main: '카멜, 베이지, 테라코타', sub: '올리브, 머스타드, 카키',
      accent: '버건디, 다크 브라운',
      tip: '카멜 + 올리브처럼 따뜻하면서도 채도 낮은 조합이 가을 뮤트의 성숙미를 살립니다.',
    },
    attributes: { hue: 'Warm Yellow-Brown', value: 'Medium', chroma: 'Muted', clarity: 'Muted', base: 'Yellow Base', contrast: 'Medium' },
    seasonal: {
      spring: '베이지 재킷 + 화이트 이너 + 카멜 팬츠',
      summer: '올리브 린넨 셔츠 + 카키 쇼츠',
      autumn: '테라코타 니트 + 머스타드 스커트 + 브라운 부츠',
      winter: '카멜 울코트 + 버건디 터틀넥 + 다크 브라운 팬츠',
    },
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
    hair: {
      recommended: [
        { name: '딥 에스프레소', desc: '진하고 깊은 에스프레소 블랙' },
        { name: '다크 올리브 브라운', desc: '녹색기의 매우 어두운 갈색' },
        { name: '버건디 브라운', desc: '레드기의 깊은 갈색' },
      ],
      avoid: '라이트 브라운, 블론드, 밝은 하이라이트',
    },
    fashion: {
      main: '다크 브라운, 에스프레소, 버건디', sub: '다크 올리브, 카키',
      accent: '딥 골드, 레드',
      tip: '에스프레소 + 버건디처럼 명도 차이가 적은 조합이 가을 딥의 카리스마를 극대화합니다.',
    },
    attributes: { hue: 'Warm Deep Brown-Red', value: 'Deep', chroma: 'Muted-Rich', clarity: 'Muted', base: 'Yellow Base', contrast: 'Medium-High' },
    seasonal: {
      spring: '버건디 재킷 + 카멜 이너 + 다크 브라운 팬츠',
      summer: '다크 올리브 셔츠 + 카키 팬츠',
      autumn: '딥 브라운 코트 + 에스프레소 터틀넥 + 가죽 부츠',
      winter: '다크 버건디 울코트 + 블랙 이너 + 골드 액세서리',
    },
  },
  '겨울 브라이트': {
    bestColors: [
      { hex: '#CC0000', name: '트루 레드' }, { hex: '#0000CD', name: '로얄 블루' },
      { hex: '#FFFFFF', name: '퓨어 화이트' }, { hex: '#111111', name: '트루 블랙' },
      { hex: '#9400D3', name: '바이올렛' }, { hex: '#00CED1', name: '다크 터키즈' },
      { hex: '#FF00FF', name: '마젠타' },   { hex: '#006400', name: '다크 그린' },
    ],
    worstColors: [
      { hex: '#C8A882', name: '카멜 베이지' }, { hex: '#FFDAB9', name: '피치' },
      { hex: '#C4A0A0', name: '뮤트 로즈' }, { hex: '#D4A574', name: '샌드 베이지' },
    ],
    makeup: {
      lip: [{ hex: '#CC0000', name: '트루 레드' }, { hex: '#9400D3', name: '베리 퍼플' }, { hex: '#FF1493', name: '딥 핑크' }],
      foundation: [{ hex: '#F5E6EF', name: '쿨 아이보리 C10' }, { hex: '#E8D5DF', name: '핑크 페어 C21' }],
      eyeshadow: [{ hex: '#111111', name: '블랙' }, { hex: '#0000CD', name: '네이비 블루' }],
      blush: [{ hex: '#CC4488', name: '핑크 마젠타' }, { hex: '#9B2335', name: '딥 로즈' }],
    },
    hair: {
      recommended: [
        { name: '블루 블랙', desc: '차갑고 선명한 블루 기반 블랙' },
        { name: '플래티넘 실버', desc: '밝고 차가운 은발 계열' },
        { name: '내추럴 블랙', desc: '순수하고 선명한 블랙' },
      ],
      avoid: '오렌지 브라운, 골든 블론드, 레드 브라운, 카라멜',
    },
    fashion: {
      main: '트루 화이트, 트루 블랙, 트루 레드', sub: '로얄 블루, 바이올렛',
      accent: '마젠타, 실버',
      tip: '블랙 + 레드처럼 명도 대비가 강한 컬러 조합이 겨울 브라이트의 카리스마를 살립니다.',
    },
    attributes: { hue: 'Cool Blue-Pink', value: 'Light-Deep', chroma: 'Bright', clarity: 'Clear', base: 'Pink Base', contrast: 'High' },
    seasonal: {
      spring: '화이트 블라우스 + 네이비 팬츠 + 레드 포인트 백',
      summer: '블루+화이트 스트라이프 마린 룩',
      autumn: '블랙 코트 + 레드 이너 + 실버 액세서리',
      winter: '퓨어 화이트 코트 + 블랙 터틀넥 + 바이올렛 스카프',
    },
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
    hair: {
      recommended: [
        { name: '블루 블랙', desc: '가장 깊고 차가운 블루 블랙' },
        { name: '내추럴 블랙', desc: '깊고 선명한 블랙' },
        { name: '다크 버건디', desc: '매우 어두운 버건디 계열' },
      ],
      avoid: '브라운 계열, 골든 계열, 밝은 색 전반',
    },
    fashion: {
      main: '딥 블랙, 미드나이트 네이비, 버건디', sub: '인디고, 딥 틸',
      accent: '실버, 딥 골드',
      tip: '블랙 + 버건디 또는 네이비 + 인디고처럼 어두운 계열 안에서 명도 차이를 활용하면 겨울 딥의 강렬미가 완성됩니다.',
    },
    attributes: { hue: 'Cool Blue-Red', value: 'Deep', chroma: 'Clear-Rich', clarity: 'Clear', base: 'Pink Base', contrast: 'High' },
    seasonal: {
      spring: '네이비 블레이저 + 화이트 이너 + 블랙 팬츠',
      summer: '딥 버건디 셔츠 + 블랙 팬츠',
      autumn: '블랙 코트 + 버건디 터틀넥 + 다크 네이비 팬츠',
      winter: '미드나이트 네이비 코트 + 블랙 + 실버 액세서리',
    },
  },
};

// ── Styles ──────────────────────────────────────────────────────

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const PAD_H  = 50;
const PAD_V  = 56;

const S = StyleSheet.create({
  page: {
    fontFamily: 'Pretendard',
    backgroundColor: '#FAF8F3',
    paddingHorizontal: PAD_H,
    paddingTop: PAD_V,
    paddingBottom: 44,
    position: 'relative',
  },
  // ── Cover ──
  coverAccentBar: {
    position: 'absolute',
    top: 0, left: 0,
    width: PAGE_W,
    height: 320,
    backgroundColor: '#F5F0F8',
  },
  coverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 72,
  },
  logoMark: {
    width: 8, height: 8, borderRadius: 4,
    marginBottom: 5,
  },
  logoText: {
    fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#2A2A2A',
  },
  logoSub: {
    fontSize: 7.5, color: '#999', letterSpacing: 1, marginTop: 2,
  },
  coverMeta: {
    fontSize: 7.5, color: '#AAA', letterSpacing: 0.5, textAlign: 'right', lineHeight: 1.8,
  },
  coverMain: {
    marginBottom: 48,
  },
  coverLabel: {
    fontSize: 8, fontWeight: 700, letterSpacing: 3, color: '#AAA',
    marginBottom: 14, textTransform: 'uppercase',
  },
  coverTypeEn: {
    fontSize: 46, fontWeight: 700, color: '#2A2A2A', letterSpacing: -1, lineHeight: 1,
    marginBottom: 12,
  },
  coverTypeKo: {
    fontSize: 20, fontWeight: 400, color: '#555', marginBottom: 8,
  },
  coverDisplayName: {
    fontSize: 12, color: '#888', marginBottom: 32,
  },
  coverPalette: {
    flexDirection: 'row', gap: 12, marginTop: 8,
  },
  coverColorCircle: {
    width: 52, height: 52, borderRadius: 26,
  },
  coverColorLabel: {
    fontSize: 7.5, color: '#AAA', marginTop: 4, textAlign: 'center',
  },
  coverDivider: {
    height: 1, backgroundColor: '#E8E4DC', marginVertical: 32,
  },
  coverAttrRow: {
    flexDirection: 'row', gap: 32, marginBottom: 8,
  },
  coverAttrItem: {
    flex: 1,
  },
  coverAttrLabel: {
    fontSize: 7.5, fontWeight: 700, letterSpacing: 1.5, color: '#AAA', marginBottom: 2,
  },
  coverAttrValue: {
    fontSize: 10, color: '#2A2A2A',
  },
  disclaimer: {
    position: 'absolute',
    bottom: 28, left: PAD_H, right: PAD_H,
    borderTopWidth: 1, borderTopColor: '#E8E4DC', borderTopStyle: 'solid',
    paddingTop: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  disclaimerText: {
    fontSize: 7, color: '#BBB', lineHeight: 1.6,
  },
  pageNum: {
    fontSize: 8, color: '#CCC',
  },
  // ── Section pages ──
  sectionNum: {
    fontSize: 8, fontWeight: 700, letterSpacing: 2, color: '#CCC',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 700, color: '#2A2A2A', marginBottom: 24,
    borderBottomWidth: 2, borderBottomStyle: 'solid', paddingBottom: 10,
  },
  subSectionTitle: {
    fontSize: 12, fontWeight: 700, color: '#2A2A2A', marginBottom: 12, marginTop: 20,
  },
  bodyText: {
    fontSize: 10.5, color: '#444', lineHeight: 1.7,
  },
  // ── Color chips ──
  chipRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4,
  },
  chipItem: {
    alignItems: 'center', width: 54,
  },
  chip: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 1, borderColor: '#E8E4DC', borderStyle: 'solid',
  },
  chipHex: {
    fontSize: 6.5, color: '#999', marginTop: 3, textAlign: 'center',
  },
  chipName: {
    fontSize: 7.5, color: '#555', marginTop: 1, textAlign: 'center',
  },
  // ── Worst colors (smaller) ──
  worstChipRow: {
    flexDirection: 'row', gap: 12,
  },
  worstChip: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1, borderColor: '#E8E4DC', borderStyle: 'solid',
    opacity: 0.55,
  },
  // ── Attribute table ──
  attrTable: {
    marginTop: 8,
  },
  attrRow: {
    flexDirection: 'row', paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: '#F0ECE4', borderBottomStyle: 'solid',
  },
  attrKey: {
    width: 120, fontSize: 9, fontWeight: 700, color: '#888', letterSpacing: 0.5,
  },
  attrVal: {
    flex: 1, fontSize: 10, color: '#2A2A2A',
  },
  // ── Chart ──
  chartWrapper: {
    marginTop: 8, marginBottom: 16,
    flexDirection: 'row', gap: 24, alignItems: 'flex-start',
  },
  chartLegendBox: {
    flex: 1, paddingTop: 16,
  },
  chartLegendItem: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
  },
  chartDot: {
    width: 8, height: 8, borderRadius: 4,
  },
  chartLegendText: {
    fontSize: 9, color: '#555',
  },
  // ── Makeup ──
  makeupSection: {
    marginTop: 6,
  },
  makeupRow: {
    flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 10,
  },
  makeupLabel: {
    width: 80, fontSize: 9, fontWeight: 700, color: '#888',
  },
  makeupChip: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1, borderColor: '#E8E4DC', borderStyle: 'solid',
  },
  makeupItemName: {
    fontSize: 8.5, color: '#444',
  },
  makeupItemHex: {
    fontSize: 7, color: '#AAA',
  },
  makeupItemBox: {
    alignItems: 'center',
  },
  // ── Hair ──
  hairItem: {
    flexDirection: 'row', gap: 10, marginBottom: 10,
  },
  hairDot: {
    width: 8, height: 8, borderRadius: 4, marginTop: 3,
  },
  hairName: {
    fontSize: 10, fontWeight: 700, color: '#2A2A2A',
  },
  hairDesc: {
    fontSize: 9, color: '#777', marginTop: 1,
  },
  // ── Fashion ──
  fashionGrid: {
    flexDirection: 'row', gap: 16, marginTop: 8,
  },
  fashionCard: {
    flex: 1, backgroundColor: '#F5F2ED', borderRadius: 8, padding: 12,
  },
  fashionCardLabel: {
    fontSize: 7.5, fontWeight: 700, letterSpacing: 1.5, color: '#AAA', marginBottom: 4,
  },
  fashionCardValue: {
    fontSize: 10, color: '#2A2A2A', lineHeight: 1.5,
  },
  fashionTip: {
    marginTop: 14, backgroundColor: '#F0EDE8', borderRadius: 6,
    padding: 12,
  },
  fashionTipLabel: {
    fontSize: 7.5, fontWeight: 700, letterSpacing: 1.5, color: '#AAA', marginBottom: 4,
  },
  fashionTipText: {
    fontSize: 10, color: '#444', lineHeight: 1.6,
  },
  // ── Seasonal ──
  seasonGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8,
  },
  seasonCard: {
    width: '47%', backgroundColor: '#F5F2ED', borderRadius: 8, padding: 12,
  },
  seasonLabel: {
    fontSize: 7.5, fontWeight: 700, letterSpacing: 1.5, color: '#AAA', marginBottom: 5,
  },
  seasonText: {
    fontSize: 9.5, color: '#2A2A2A', lineHeight: 1.6,
  },
  // ── Q&A ──
  qaBox: {
    backgroundColor: '#F5F2ED', borderRadius: 8, padding: 16, marginTop: 12,
  },
  qaQuestion: {
    fontSize: 9, fontWeight: 700, color: '#888', marginBottom: 6,
  },
  qaAnswer: {
    fontSize: 10.5, color: '#2A2A2A', lineHeight: 1.7,
  },
  // ── Avoid box ──
  avoidBox: {
    borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: '#E0D8CC',
    paddingLeft: 12, marginTop: 8,
  },
  avoidLabel: {
    fontSize: 8, fontWeight: 700, color: '#AAA', letterSpacing: 1, marginBottom: 3,
  },
  avoidText: {
    fontSize: 9.5, color: '#666',
  },
  // ── Divider ──
  pageDivider: {
    height: 1, backgroundColor: '#EDE9E1', marginVertical: 18,
  },
});

// ── Helper components ───────────────────────────────────────────

function PageFooter({ accent, num }: { accent: string; num: string }) {
  return (
    <View style={S.disclaimer}>
      <Text style={S.disclaimerText}>본 리포트는 AI 분석 결과로 참고용이며 전문 진단을 대체하지 않습니다.</Text>
      <Text style={[S.pageNum, { color: accent }]}>{num}</Text>
    </View>
  );
}

function SectionHeader({ num, title, accent }: { num: string; title: string; accent: string }) {
  return (
    <View>
      <Text style={S.sectionNum}>{num}</Text>
      <Text style={[S.sectionTitle, { borderBottomColor: accent }]}>{title}</Text>
    </View>
  );
}

// 4분면 차트 SVG
function QuadrantChart({ posX, posY, accent }: { posX: number; posY: number; accent: string }) {
  const SIZE = 180;
  const MID  = SIZE / 2;
  const MARGIN = 14;
  const RANGE  = MID - MARGIN;
  // SVG y-axis is inverted: posY +1 → top
  const dotX = MID + posX * RANGE;
  const dotY = MID - posY * RANGE;

  return (
    <Svg width={SIZE} height={SIZE} style={{ backgroundColor: '#F5F2ED', borderRadius: 8 }}>
      {/* Axes */}
      <Line x1={MARGIN} y1={MID} x2={SIZE - MARGIN} y2={MID} strokeWidth={0.8} stroke="#CCC" />
      <Line x1={MID} y1={MARGIN} x2={MID} y2={SIZE - MARGIN} strokeWidth={0.8} stroke="#CCC" />
      {/* Quadrant labels */}
      {/* User dot */}
      <SvgCircle cx={dotX} cy={dotY} r={7} fill={accent} opacity={0.9} />
      <SvgCircle cx={dotX} cy={dotY} r={3} fill="#FFF" />
    </Svg>
  );
}

// ── Page 1: Cover ───────────────────────────────────────────────

function CoverPage({
  colorType, sessionId, createdAt, accent,
}: {
  colorType: PersonalColorType;
  sessionId: string;
  createdAt: string;
  accent: string;
}) {
  const palette  = TYPE_PALETTE[colorType];
  const extra    = TYPE_EXTRA[colorType];
  const { attributes } = extra;
  const typeEn   = TYPE_EN[colorType];
  const display  = TYPE_DISPLAY[colorType];

  return (
    <Page size="A4" style={S.page}>
      {/* Accent background strip */}
      <View style={[S.coverAccentBar, { backgroundColor: accent + '18' }]} />

      {/* Header */}
      <View style={S.coverHeader}>
        <View>
          <View style={[S.logoMark, { backgroundColor: accent }]} />
          <Text style={S.logoText}>COLORLAB</Text>
          <Text style={S.logoSub}>Personal Color Analysis Report</Text>
        </View>
        <View>
          <Text style={S.coverMeta}>Report ID: {sessionId.slice(0, 8).toUpperCase()}</Text>
          <Text style={S.coverMeta}>Date: {createdAt}</Text>
          <Text style={S.coverMeta}>Version: 2.0</Text>
        </View>
      </View>

      {/* Main type display */}
      <View style={S.coverMain}>
        <Text style={S.coverLabel}>Personal Color Type</Text>
        <Text style={S.coverTypeEn}>{typeEn}</Text>
        <Text style={S.coverTypeKo}>{colorType}</Text>
        <Text style={S.coverDisplayName}>{display}</Text>

        {/* Palette circles */}
        <View style={S.coverPalette}>
          {palette.map(({ hex, name }) => (
            <View key={hex} style={{ alignItems: 'center' }}>
              <View style={[S.coverColorCircle, { backgroundColor: hex }]} />
              <Text style={S.coverColorLabel}>{name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Divider */}
      <View style={S.coverDivider} />

      {/* Attributes summary */}
      <View style={S.coverAttrRow}>
        {[
          { label: 'BASE TONE', value: attributes.base },
          { label: 'VALUE',     value: attributes.value },
          { label: 'CHROMA',    value: attributes.chroma },
          { label: 'CONTRAST',  value: attributes.contrast },
        ].map(({ label, value }) => (
          <View key={label} style={S.coverAttrItem}>
            <Text style={S.coverAttrLabel}>{label}</Text>
            <Text style={S.coverAttrValue}>{value}</Text>
          </View>
        ))}
      </View>

      <PageFooter accent={accent} num="1 / 5" />
    </Page>
  );
}

// ── Page 2: Type Analysis ───────────────────────────────────────

function TypeAnalysisPage({
  colorType, accent,
}: { colorType: PersonalColorType; accent: string }) {
  const extra = TYPE_EXTRA[colorType];
  const { attributes } = extra;
  const [posX, posY] = CHART_POS[colorType];

  return (
    <Page size="A4" style={S.page}>
      <SectionHeader num="01" title="정밀 타입 분석" accent={accent} />

      {/* Chart + legend */}
      <View style={S.chartWrapper}>
        <View>
          <QuadrantChart posX={posX} posY={posY} accent={accent} />
          {/* Axis labels below/beside chart */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, width: 180 }}>
            <Text style={{ fontSize: 7.5, color: '#AAA' }}>← Cool</Text>
            <Text style={{ fontSize: 7.5, color: '#AAA' }}>Warm →</Text>
          </View>
          <View style={{ alignItems: 'center', marginTop: 2 }}>
            <Text style={{ fontSize: 7.5, color: '#AAA' }}>↕ Light / Deep</Text>
          </View>
        </View>
        <View style={S.chartLegendBox}>
          <Text style={[S.subSectionTitle, { marginTop: 0 }]}>컬러 포지션</Text>
          <Text style={S.bodyText}>
            {TYPE_EN[colorType]} 타입은 {posX > 0 ? '웜' : '쿨'}톤 계열이며,
            {posY > 0 ? ' 라이트' : ' 딥'} 밝기 영역에 위치합니다.
            차트의 빨간 점이 {colorType}의 정확한 위치를 나타냅니다.
          </Text>
        </View>
      </View>

      {/* Attributes table */}
      <Text style={S.subSectionTitle}>색의 4속성 분석</Text>
      <View style={S.attrTable}>
        {[
          { key: 'HUE (색상)',       val: attributes.hue },
          { key: 'VALUE (명도)',      val: attributes.value },
          { key: 'CHROMA (채도)',     val: attributes.chroma },
          { key: 'CLARITY (청탁)',    val: attributes.clarity },
          { key: 'BASE TONE (베이스)', val: attributes.base },
          { key: 'CONTRAST (대비)',   val: attributes.contrast },
        ].map(({ key, val }) => (
          <View key={key} style={S.attrRow}>
            <Text style={S.attrKey}>{key}</Text>
            <Text style={S.attrVal}>{val}</Text>
          </View>
        ))}
      </View>

      <PageFooter accent={accent} num="2 / 5" />
    </Page>
  );
}

// ── Page 3: Palette & Makeup ────────────────────────────────────

function PaletteMakeupPage({
  colorType, accent,
}: { colorType: PersonalColorType; accent: string }) {
  const { bestColors, worstColors, makeup } = TYPE_EXTRA[colorType];

  return (
    <Page size="A4" style={S.page}>
      <SectionHeader num="02" title="어울리는 컬러 팔레트" accent={accent} />

      {/* Best colors */}
      <Text style={[S.subSectionTitle, { marginTop: 0 }]}>Best Colors · 추천 8가지</Text>
      <View style={S.chipRow}>
        {bestColors.map(({ hex, name }) => (
          <View key={hex} style={S.chipItem}>
            <View style={[S.chip, { backgroundColor: hex }]} />
            <Text style={S.chipName}>{name}</Text>
            <Text style={S.chipHex}>{hex}</Text>
          </View>
        ))}
      </View>

      {/* Worst colors */}
      <Text style={[S.subSectionTitle, { marginTop: 16 }]}>Worst Colors · 피해야 할 4가지</Text>
      <View style={S.worstChipRow}>
        {worstColors.map(({ hex, name }) => (
          <View key={hex} style={{ alignItems: 'center' }}>
            <View style={[S.worstChip, { backgroundColor: hex }]} />
            <Text style={[S.chipName, { opacity: 0.6 }]}>{name}</Text>
            <Text style={[S.chipHex, { opacity: 0.6 }]}>{hex}</Text>
          </View>
        ))}
      </View>

      <View style={S.pageDivider} />

      {/* Makeup */}
      <SectionHeader num="03" title="메이크업 컬러 추천" accent={accent} />

      {[
        { label: '립 컬러',        items: makeup.lip },
        { label: '파운데이션',      items: makeup.foundation },
        { label: '아이섀도우',      items: makeup.eyeshadow },
        { label: '블러셔',         items: makeup.blush },
      ].map(({ label, items }) => (
        <View key={label} style={S.makeupRow}>
          <Text style={S.makeupLabel}>{label}</Text>
          {items.map(({ hex, name }) => (
            <View key={hex} style={S.makeupItemBox}>
              <View style={[S.makeupChip, { backgroundColor: hex }]} />
              <Text style={S.makeupItemName}>{name}</Text>
              <Text style={S.makeupItemHex}>{hex}</Text>
            </View>
          ))}
        </View>
      ))}

      <PageFooter accent={accent} num="3 / 5" />
    </Page>
  );
}

// ── Page 4: Hair & Fashion ──────────────────────────────────────

function HairFashionPage({
  colorType, accent,
}: { colorType: PersonalColorType; accent: string }) {
  const { hair, fashion } = TYPE_EXTRA[colorType];

  return (
    <Page size="A4" style={S.page}>
      <SectionHeader num="04" title="헤어 컬러 추천" accent={accent} />

      {/* Recommended hair */}
      {hair.recommended.map(({ name, desc }, i) => (
        <View key={i} style={S.hairItem}>
          <View style={[S.hairDot, { backgroundColor: accent }]} />
          <View>
            <Text style={S.hairName}>{name}</Text>
            <Text style={S.hairDesc}>{desc}</Text>
          </View>
        </View>
      ))}

      {/* Avoid */}
      <View style={S.avoidBox}>
        <Text style={S.avoidLabel}>AVOID · 피해야 할 컬러</Text>
        <Text style={S.avoidText}>{hair.avoid}</Text>
      </View>

      <View style={S.pageDivider} />

      {/* Fashion */}
      <SectionHeader num="05" title="패션 컬러 가이드" accent={accent} />

      <View style={S.fashionGrid}>
        {[
          { label: 'MAIN COLOR',   value: fashion.main },
          { label: 'SUB COLOR',    value: fashion.sub },
          { label: 'ACCENT COLOR', value: fashion.accent },
        ].map(({ label, value }) => (
          <View key={label} style={S.fashionCard}>
            <Text style={S.fashionCardLabel}>{label}</Text>
            <Text style={S.fashionCardValue}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={[S.fashionTip, { borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: accent }]}>
        <Text style={S.fashionTipLabel}>STYLING TIP</Text>
        <Text style={S.fashionTipText}>{fashion.tip}</Text>
      </View>

      <PageFooter accent={accent} num="4 / 5" />
    </Page>
  );
}

// ── Page 5: Seasonal & Q&A ──────────────────────────────────────

function SeasonalQAPage({
  colorType, accent, reportContent,
}: { colorType: PersonalColorType; accent: string; reportContent: string }) {
  const { seasonal } = TYPE_EXTRA[colorType];

  // Extract section 7 (맞춤 답변) from reportContent
  const qaMatch = reportContent.match(/\[섹션 7[^\]]*\]([\s\S]*?)(?:\[섹션 \d|$)/);
  const qaText = qaMatch
    ? qaMatch[1].trim()
    : '';
  const showQA = qaText.length > 0 && qaText !== '해당 질문에는 답변이 불가합니다';

  return (
    <Page size="A4" style={S.page}>
      <SectionHeader num="06" title="시즌별 스타일링" accent={accent} />

      <View style={S.seasonGrid}>
        {[
          { label: '🌸 SPRING', text: seasonal.spring },
          { label: '☀️ SUMMER', text: seasonal.summer },
          { label: '🍂 AUTUMN', text: seasonal.autumn },
          { label: '❄️ WINTER', text: seasonal.winter },
        ].map(({ label, text }) => (
          <View key={label} style={S.seasonCard}>
            <Text style={S.seasonLabel}>{label}</Text>
            <Text style={S.seasonText}>{text}</Text>
          </View>
        ))}
      </View>

      {showQA && (
        <View style={{ marginTop: 24 }}>
          <SectionHeader num="07" title="당신의 고민에 대한 답변" accent={accent} />
          <View style={S.qaBox}>
            <Text style={S.qaQuestion}>AI 맞춤 답변</Text>
            <Text style={S.qaAnswer}>{qaText}</Text>
          </View>
        </View>
      )}

      {/* Footer with full info */}
      <View style={[S.disclaimer, { flexDirection: 'column', alignItems: 'flex-start', gap: 4 }]}>
        <View style={{ borderTopWidth: 1, borderTopColor: '#E8E4DC', borderTopStyle: 'solid', width: '100%', paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={S.disclaimerText}>본 리포트는 AI 분석 결과로 참고용이며 전문 진단을 대체하지 않습니다.</Text>
            <Text style={[S.pageNum, { color: accent }]}>5 / 5</Text>
          </View>
          <Text style={[S.disclaimerText, { marginTop: 3 }]}>colorlab.kr  ·  Powered by COLORLAB AI</Text>
        </View>
      </View>
    </Page>
  );
}

// ── Main Export ─────────────────────────────────────────────────

export interface ReportPDFProps {
  colorType: PersonalColorType;
  sessionId: string;
  reportContent: string;
  createdAt?: string;
}

export default function ReportPDF({
  colorType,
  sessionId,
  reportContent,
  createdAt,
}: ReportPDFProps) {
  const accent = TYPE_REPRESENTATIVE[colorType] ?? '#7C3AED';
  const date   = createdAt ?? new Date().toISOString().slice(0, 10);

  return (
    <Document title={`컬러랩 퍼스널컬러 리포트 · ${colorType}`} author="COLORLAB">
      <CoverPage
        colorType={colorType}
        sessionId={sessionId}
        createdAt={date}
        accent={accent}
      />
      <TypeAnalysisPage colorType={colorType} accent={accent} />
      <PaletteMakeupPage colorType={colorType} accent={accent} />
      <HairFashionPage colorType={colorType} accent={accent} />
      <SeasonalQAPage colorType={colorType} accent={accent} reportContent={reportContent} />
    </Document>
  );
}
