'use client';

import '@/lib/pdf/font';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { TYPE_PALETTE, TYPE_DISPLAY, TYPE_REPRESENTATIVE } from '@/lib/colorData';
import { QuadrantChart } from './QuadrantChart';
import { ColorChip } from './ColorChip';
import { SeasonIcon } from './SeasonIcon';
import { seasonalStylingDatabase } from '@/lib/data/seasonalStyling';
import { PaletteGrid } from './PaletteGrid';
import { CelebrityCard } from './CelebrityCard';
import { ProductRecommendation } from './ProductRecommendation';
import { IconLabel } from './IconLabel';
import { cosmeticsDatabase } from '@/lib/data/cosmetics';
import { makeupTipsDatabase } from '@/lib/data/makeupTips';
import type { PersonalColorType } from '@/types';

const TOTAL = 6;

// ── Static metadata ──────────────────────────────────────────────

const TYPE_EN: Record<PersonalColorType, string> = {
  '봄 라이트':    'Spring Light',   '봄 브라이트':  'Spring Bright',
  '여름 라이트':  'Summer Light',   '여름 뮤트':    'Summer Muted',
  '가을 뮤트':    'Autumn Muted',   '가을 딥':      'Autumn Deep',
  '겨울 브라이트': 'Winter Bright', '겨울 딥':      'Winter Deep',
};

// x: -1=Cool,+1=Warm / y: -1=Deep,+1=Light
const CHART_POS: Record<PersonalColorType, [number, number]> = {
  '봄 라이트':    [0.45,  0.70], '봄 브라이트':  [0.65,  0.35],
  '여름 라이트':  [-0.35, 0.68], '여름 뮤트':    [-0.50, 0.20],
  '가을 뮤트':    [0.42, -0.28], '가을 딥':      [0.68, -0.65],
  '겨울 브라이트': [-0.48, 0.18], '겨울 딥':      [-0.65,-0.58],
};

interface ColorItem { hex: string; name: string }
interface TypeExtra {
  bestColors: ColorItem[];
  worstColors: ColorItem[];
  makeup: { lip: ColorItem[]; foundation: ColorItem[]; eyeshadow: ColorItem[]; blush: ColorItem[] };
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

// ── Hair color approximation ─────────────────────────────────────

function hairHex(name: string): string {
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

// ── Styles ───────────────────────────────────────────────────────

const PAD_H = 25;
const PAD_V = 25;

const S = StyleSheet.create({
  page: {
    fontFamily: 'Pretendard',
    backgroundColor: '#FBF9F4',
    paddingHorizontal: PAD_H,
    paddingTop: PAD_V,
    paddingBottom: 24,
    position: 'relative',
  },
  pageHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12, paddingBottom: 8,
    borderBottomWidth: 0.5, borderBottomColor: '#DDD8CC', borderBottomStyle: 'solid',
  },
  pageHeaderLeft: { fontSize: 7, color: '#AAA', letterSpacing: 1 },
  pageHeaderRight: { fontSize: 7, color: '#AAA' },
  sectionBlock: { marginBottom: 14 },
  sectionNum: { fontSize: 7.5, fontWeight: 700, letterSpacing: 2, color: '#BBB', marginBottom: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.4 },
  sectionDivider: { height: 0.5, backgroundColor: '#DDD8CC', marginVertical: 10 },
  subTitle: { fontSize: 12, fontWeight: 700, color: '#2A2A2A', marginBottom: 6 },
  body: { fontSize: 10.5, color: '#444', lineHeight: 1.7 },
  bodySmall: { fontSize: 8.5, color: '#555', lineHeight: 1.7 },
  caption: { fontSize: 8, color: '#999', lineHeight: 1.5 },
  coverMeta: { fontSize: 7, color: '#AAA', letterSpacing: 0.5, textAlign: 'right', lineHeight: 1.7 },
  coverNameLine: { fontSize: 22, fontWeight: 700, color: '#2A2A2A', letterSpacing: -0.5, marginBottom: 4 },
  coverTypeEn: { fontSize: 38, fontWeight: 700, color: '#2A2A2A', letterSpacing: -1, lineHeight: 1, marginBottom: 8 },
  coverTypeKo: { fontSize: 18, fontWeight: 400, color: '#666', marginBottom: 6 },
  coverDisplayName: { fontSize: 11, color: '#999', marginBottom: 16 },
  chip: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 0.5, borderColor: '#E0DCCC', borderStyle: 'solid',
  },
  chipLg: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 0.5, borderColor: '#E0DCCC', borderStyle: 'solid',
  },
  chipName: { fontSize: 7.5, color: '#555', marginTop: 3, textAlign: 'center', maxWidth: 60 },
  chipHex: { fontSize: 6, color: '#AAA', textAlign: 'center' },
  attrCard: {
    flex: 1, backgroundColor: '#F5F2EC', borderRadius: 6, padding: 8,
  },
  attrCardKey: { fontSize: 6.5, fontWeight: 700, letterSpacing: 1.2, color: '#AAA', marginBottom: 3 },
  attrCardLabel: { fontSize: 9, fontWeight: 700, color: '#2A2A2A', marginBottom: 2 },
  attrCardVal: { fontSize: 8, color: '#555' },
  keyFindingBox: {
    backgroundColor: '#F0ECF8', borderRadius: 6,
    borderLeftWidth: 3, borderLeftColor: '#7C3AED', borderLeftStyle: 'solid',
    padding: 8, marginTop: 6,
  },
  keyFindingLabel: { fontSize: 6.5, fontWeight: 700, letterSpacing: 1.2, color: '#7C3AED', marginBottom: 3 },
  keyFindingText: { fontSize: 10, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.5 },
  footer: {
    position: 'absolute', bottom: 12, left: PAD_H, right: PAD_H,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 0.5, borderTopColor: '#DDD8CC', borderTopStyle: 'solid',
    paddingTop: 6,
  },
  footerText: { fontSize: 7, color: '#BBB' },
  footerPage: { fontSize: 7.5, fontWeight: 700, color: '#CCC' },
  adviceBox: { backgroundColor: '#F8F5FC', borderRadius: 6, padding: 10 },
  adviceLabel: { fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: '#7C3AED', marginBottom: 6 },
  adviceText: { fontSize: 10, color: '#333', lineHeight: 1.6 },
});

// ── Shared components ────────────────────────────────────────────

function PageHeader({ label, page }: { label: string; page: number }) {
  return (
    <View style={S.pageHeader}>
      <Text style={S.pageHeaderLeft}>COLORLAB · {label}</Text>
      <Text style={S.pageHeaderRight}>{page} / {TOTAL}</Text>
    </View>
  );
}

function Footer({ page, accent }: { page: number; accent: string }) {
  return (
    <View style={S.footer}>
      <Text style={S.footerText}>colorlab.kr  ·  본 리포트는 AI 분석에 기반한 참고용 자료입니다</Text>
      <Text style={[S.footerPage, { color: accent }]}>{page} / {TOTAL}</Text>
    </View>
  );
}

function SectionHead({ num, title, accent }: { num: string; title: string; accent: string }) {
  return (
    <View style={[S.sectionBlock, { borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid', paddingLeft: 10 }]}>
      <Text style={S.sectionNum}>{num}</Text>
      <Text style={S.sectionTitle}>{title}</Text>
    </View>
  );
}

// ── Page 1: Cover ────────────────────────────────────────────────

interface ColorTypeDescription {
  summary: string;
  characteristics: string[];
  bestFor: string;
}

function CoverPage({ colorType, sessionId, createdAt, accent, customerName, greeting, colorTypeDescription, palette }: {
  colorType: PersonalColorType; sessionId: string; createdAt: string; accent: string;
  customerName: string; greeting: string; colorTypeDescription?: ColorTypeDescription;
  palette: Array<{ hex: string; name: string }>;
}) {
  const typeEn = TYPE_EN[colorType];
  const display = TYPE_DISPLAY[colorType];
  const name = customerName || '고객';

  return (
    <Page size="A4" style={S.page}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: accent }} />
          <Text style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#2A2A2A' }}>COLORLAB</Text>
        </View>
        <View>
          <Text style={S.coverMeta}>Report ID: {sessionId.slice(0, 8).toUpperCase()}</Text>
          <Text style={S.coverMeta}>Date: {createdAt}</Text>
        </View>
      </View>

      <Text style={[S.coverNameLine, { fontSize: 28, color: accent }]}>{name}님의</Text>
      <Text style={S.coverTypeEn}>{typeEn}</Text>
      <Text style={S.coverTypeKo}>{colorType}</Text>
      <Text style={S.coverDisplayName}>{display}</Text>

      <View style={{ flexDirection: 'row', gap: 14, marginBottom: 24 }}>
        {palette.map(({ hex, name: cName }) => (
          <ColorChip key={hex} hex={hex} name={cName} size="large" showHex={false} />
        ))}
      </View>

      {/* PERSONAL MESSAGE */}
      <View style={{ backgroundColor: '#F5F2EC', borderRadius: 8, padding: 16, marginBottom: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.5, color: '#AAA', marginBottom: 10, textAlign: 'center' }}>
          PERSONAL MESSAGE
        </Text>

        {/* 인사말 */}
        {greeting ? (
          <Text style={{ fontSize: 13, fontWeight: 300, color: '#2A2A2A', lineHeight: 1.7, letterSpacing: 0.3, textAlign: 'center' }}>
            {greeting}
          </Text>
        ) : null}

        {/* 구분선 */}
        <View style={{ width: 30, height: 1, backgroundColor: accent, marginVertical: 14 }} />

        {colorTypeDescription ? (
          <>
            {/* 한 줄 요약 */}
            <Text style={{ fontSize: 13, fontWeight: 300, color: '#444', lineHeight: 1.7, letterSpacing: 0.2, textAlign: 'center', marginBottom: 14 }}>
              {colorTypeDescription.summary}
            </Text>

            {/* 3가지 특징 */}
            <View style={{ alignSelf: 'stretch', paddingHorizontal: 20, marginBottom: 14 }}>
              {colorTypeDescription.characteristics.map((char, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: accent, marginRight: 10, flexShrink: 0 }} />
                  <Text style={{ fontSize: 11, fontWeight: 300, color: '#555', flex: 1, lineHeight: 1.6 }}>{char}</Text>
                </View>
              ))}
            </View>

            {/* bestFor — 강조 */}
            <Text style={{ fontSize: 11.5, fontWeight: 300, color: accent, textAlign: 'center', lineHeight: 1.6 }}>
              {colorTypeDescription.bestFor}
            </Text>
          </>
        ) : null}
      </View>

      <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ height: 0.5, flex: 1, backgroundColor: '#E8E4DC' }} />
          <Text style={{ fontSize: 7, color: '#CCC', letterSpacing: 2 }}>MADE BY COLORLAB</Text>
          <View style={{ height: 0.5, flex: 1, backgroundColor: '#E8E4DC' }} />
        </View>
        <Text style={{ fontSize: 6.5, color: '#DDD', marginTop: 3, letterSpacing: 1 }}>AI PERSONAL COLOR ANALYSIS · colorlab.kr</Text>
      </View>

      <Footer page={1} accent={accent} />
    </Page>
  );
}

// ── Page 2: Analysis ─────────────────────────────────────────────

function AnalysisPage({ colorType, accent, customerName, photoImpression, keyFinding, keyInsight }: {
  colorType: PersonalColorType; accent: string; customerName: string;
  photoImpression?: string; keyFinding?: string; keyInsight?: string;
}) {
  const extra = TYPE_EXTRA[colorType];
  const { attributes } = extra;
  const [posX, posY] = CHART_POS[colorType];
  const warmCool  = Math.round((posX + 1) / 2 * 100);
  const lightDeep = Math.round((1 - posY) / 2 * 100);
  const name = customerName || '고객';
  const contrastLevel = attributes.contrast.includes('High') ? 3 : attributes.contrast.includes('Medium') ? 2 : 1;
  const contrastLabel = contrastLevel === 3 ? 'High' : contrastLevel === 2 ? 'Medium' : 'Low';
  const contrastDesc = contrastLevel === 1
    ? '비슷한 명도끼리 매칭이 자연스러움'
    : contrastLevel === 2
    ? '적당한 명도 차이로 세련된 스타일링 가능'
    : '강한 명도 차이로 선명한 스타일링 적합';
  const baseToneDesc = attributes.base.includes('Yellow')
    ? '옐로우 베이스의 따뜻한 피부 톤'
    : '핑크 베이스의 시원한 피부 톤';

  const attrCards = [
    { key: 'HUE',     label: '색상', val: attributes.hue },
    { key: 'VALUE',   label: '명도', val: attributes.value },
    { key: 'CHROMA',  label: '채도', val: attributes.chroma },
    { key: 'CLARITY', label: '청탁', val: attributes.clarity },
  ];

  return (
    <Page size="A4" style={S.page}>
      <PageHeader label="타입 분석" page={2} />

      {/* 01. 첫인상 + 차트 나란히 */}
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 14 }}>
        <View style={{ flex: 1 }}>
          <SectionHead num="01" title={`${name}님의 첫인상`} accent={accent} />
          <Text style={[S.body, { marginBottom: 8 }]}>
            {photoImpression || `${name}님은 ${attributes.base}을 가진 ${colorType} 타입으로, ${attributes.value} 명도와 ${attributes.chroma} 채도의 특성을 지니고 있습니다.`}
          </Text>
          {keyFinding ? (
            <View style={S.keyFindingBox}>
              <Text style={S.keyFindingLabel}>KEY FINDING</Text>
              <Text style={S.keyFindingText}>{keyFinding}</Text>
            </View>
          ) : null}
        </View>
        <View style={{ alignItems: 'center', paddingTop: 8 }}>
          <QuadrantChart warmCool={warmCool} lightDeep={lightDeep} size={196} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30' }} />
            <Text style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#FF3B30', fontFamily: 'Pretendard' }}>YOUR POSITION</Text>
          </View>
          <Text style={{ fontSize: 9, color: '#666', textAlign: 'center', marginTop: 4, fontFamily: 'Pretendard' }}>
            {name}님의 위치는 Warm {warmCool}% · Light {100 - lightDeep}% 입니다.
          </Text>
        </View>
      </View>

      <View style={S.sectionDivider} />

      {/* 02. 정밀 분석 */}
      <SectionHead num="02" title="정밀 분석" accent={accent} />

      {/* [블록 1] 색의 4속성 통합 카드 */}
      <View style={{
        backgroundColor: '#FAFAFA', borderRadius: 8, marginBottom: 10,
        borderLeftWidth: 4, borderLeftColor: accent, borderLeftStyle: 'solid',
        padding: 16,
      }}>
        <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: accent, marginBottom: 10, fontFamily: 'Pretendard' }}>
          색의 4속성 (Four Attributes)
        </Text>
        <View style={{ flexDirection: 'row' }}>
          {attrCards.map(({ key, label, val }, i) => (
            <View key={key} style={{
              flex: 1, paddingHorizontal: 12,
              borderLeftWidth: i > 0 ? 0.5 : 0,
              borderLeftColor: '#E0DCCC', borderLeftStyle: 'solid',
            }}>
              <Text style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: accent, fontFamily: 'Pretendard' }}>{key}</Text>
              <Text style={{ fontSize: 9, color: '#666', marginTop: 2, marginBottom: 6, fontFamily: 'Pretendard' }}>{label}</Text>
              <View style={{ height: 1, width: '60%', backgroundColor: accent + '4D', marginBottom: 8 }} />
              <Text style={{ fontSize: 16, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.3, fontFamily: 'Pretendard' }}>{val}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* [블록 2] 베이스 톤 + 컨트라스트 통합 카드 */}
      <View style={{
        backgroundColor: '#FAFAFA', borderRadius: 8, marginBottom: 10,
        borderLeftWidth: 4, borderLeftColor: accent, borderLeftStyle: 'solid',
        flexDirection: 'row',
      }}>
        <View style={{ flex: 1, padding: 14, borderRightWidth: 0.5, borderRightColor: '#E0DCCC', borderRightStyle: 'solid' }}>
          <Text style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: accent, fontFamily: 'Pretendard' }}>BASE TONE</Text>
          <Text style={{ fontSize: 9, color: '#666', marginTop: 2, marginBottom: 6, fontFamily: 'Pretendard' }}>베이스 톤</Text>
          <View style={{ height: 1, width: '60%', backgroundColor: accent + '4D', marginBottom: 8 }} />
          <Text style={{ fontSize: 18, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.2, fontFamily: 'Pretendard' }}>{attributes.base}</Text>
          <Text style={{ fontSize: 8, color: '#666', marginTop: 6, lineHeight: 1.5, fontFamily: 'Pretendard' }}>{baseToneDesc}</Text>
        </View>
        <View style={{ flex: 1, padding: 14 }}>
          <Text style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: accent, fontFamily: 'Pretendard' }}>CONTRAST</Text>
          <Text style={{ fontSize: 9, color: '#666', marginTop: 2, marginBottom: 6, fontFamily: 'Pretendard' }}>컨트라스트</Text>
          <View style={{ height: 1, width: '60%', backgroundColor: accent + '4D', marginBottom: 8 }} />
          <Text style={{ fontSize: 18, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.2, fontFamily: 'Pretendard' }}>{contrastLabel} Contrast</Text>
          <View style={{ flexDirection: 'row', gap: 4, marginTop: 8, marginBottom: 3 }}>
            {[1, 2, 3].map((lv) => (
              <View key={lv} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: lv === contrastLevel ? accent : (lv < contrastLevel ? accent + '50' : '#E0DCCC') }} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            {['Low', 'Mid', 'High'].map((lbl, i) => (
              <Text key={lbl} style={{ fontSize: 6, fontFamily: 'Pretendard', color: (i + 1) === contrastLevel ? accent : '#BBB', fontWeight: (i + 1) === contrastLevel ? 700 : 400 }}>{lbl}</Text>
            ))}
          </View>
          <Text style={{ fontSize: 8, color: '#666', lineHeight: 1.4, fontFamily: 'Pretendard' }}>{contrastDesc}</Text>
        </View>
      </View>

      {/* KEY INSIGHT */}
      {keyInsight ? (
        <View style={{
          backgroundColor: accent + '0A',
          borderRadius: 8,
          borderLeftWidth: 4, borderLeftColor: accent, borderLeftStyle: 'solid',
          padding: 12, marginBottom: 10,
        }}>
          <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: accent, marginBottom: 6, fontFamily: 'Pretendard' }}>
            {name}님의 핵심 인사이트
          </Text>
          <Text style={{ fontSize: 11, color: '#444', lineHeight: 1.7, fontFamily: 'Pretendard' }}>
            {keyInsight}
          </Text>
        </View>
      ) : null}

      {/* Reference */}
      <View style={{
        backgroundColor: '#F0F4F8', borderRadius: 6, padding: 8,
        borderLeftWidth: 2, borderLeftColor: '#8FA8C0', borderLeftStyle: 'solid',
      }}>
        <Text style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: 1.2, color: '#8FA8C0', marginBottom: 3 }}>REFERENCE</Text>
        <Text style={{ fontSize: 8.5, color: '#555', lineHeight: 1.6 }}>
          본 분석은 한국색채학회 연구 및 국제 퍼스널컬러 분석 기준(ICA)을 기반으로 합니다. 결과는 촬영 환경·조명에 따라 다소 달라질 수 있으며, 전문가 상담과 병행 시 더 정확한 결과를 얻을 수 있습니다.
        </Text>
      </View>

      <Footer page={2} accent={accent} />
    </Page>
  );
}

// ── Page 3: Color Palette ────────────────────────────────────────

function getMood(colorName: string): string {
  if (colorName.includes('핑크') || colorName.includes('분홍')) return '청순';
  if (colorName.includes('코랄') || colorName.includes('살몬')) return '화사';
  if (colorName.includes('오렌지')) return '활기';
  if (colorName.includes('옐로') || colorName.includes('레몬') || colorName.includes('버터')) return '밝음';
  if (colorName.includes('민트') || colorName.includes('그린')) return '산뜻';
  if (colorName.includes('블루') || colorName.includes('스카이') || colorName.includes('파우더')) return '시원';
  if (colorName.includes('라벤더') || colorName.includes('라일락') || colorName.includes('퍼플') || colorName.includes('바이올렛')) return '신비';
  if (colorName.includes('모브') || colorName.includes('로즈')) return '로맨틱';
  if (colorName.includes('터키즈') || colorName.includes('틸')) return '생동';
  if (colorName.includes('그레이') || colorName.includes('차콜') || colorName.includes('슬레이트')) return '세련';
  if (colorName.includes('버건디') || colorName.includes('레드') || colorName.includes('브릭')) return '강렬';
  if (colorName.includes('골드') || colorName.includes('샴페인') || colorName.includes('카멜')) return '우아';
  if (colorName.includes('화이트') || colorName.includes('아이보리') || colorName.includes('크림') || colorName.includes('밀키')) return '청결';
  if (colorName.includes('베이지') || colorName.includes('브라운') || colorName.includes('토프')) return '따뜻';
  if (colorName.includes('블랙')) return '카리스마';
  return '매력';
}

function PalettePage({ colorType, accent, customerName }: { colorType: PersonalColorType; accent: string; customerName: string }) {
  const { bestColors, worstColors, fashion, attributes } = TYPE_EXTRA[colorType];
  const name = customerName || '고객';
  const contrastLevel = attributes.contrast.includes('High') ? 3 : attributes.contrast.includes('Medium') ? 2 : 1;

  const combinations = [
    {
      type: '모노톤', typeEn: 'Mono Tone',
      description: '같은 색상 계열로 안정적인 통일감을 만들어요',
      colors: bestColors.slice(0, 3),
    },
    {
      type: '톤온톤', typeEn: 'Tone on Tone',
      description: '같은 명도의 다른 색상으로 부드러운 조화를 연출해요',
      colors: [bestColors[0], bestColors[3], bestColors[5]],
    },
    {
      type: '포인트', typeEn: 'Accent Color',
      description: `${fashion.accent} 포인트 컬러로 생기 있는 스타일링을 완성해요`,
      colors: [bestColors[1], bestColors[4], bestColors[7]],
    },
  ];

  const stylingNotes = [
    fashion.tip,
    attributes.base.includes('Yellow')
      ? '골드 액세서리가 실버보다 자연스럽게 어우러져요.'
      : '실버 액세서리가 쿨하고 세련된 느낌을 더해줘요.',
    contrastLevel === 1
      ? '비슷한 명도끼리 매칭이 자연스럽고 조화로워요.'
      : contrastLevel === 2
      ? '적절한 명도 차이 레이어드 코디가 세련되어 보여요.'
      : '과감한 명도 대비 코디가 특히 잘 어울려요.',
    attributes.chroma.includes('Soft') || attributes.chroma.includes('Muted')
      ? '원색보다 파스텔·뮤트 톤이 자연스러운 매력을 살려줘요.'
      : '선명한 컬러가 생기와 에너지를 극대화해줘요.',
    `${fashion.main} 계열을 베이스로, ${fashion.sub} 컬러를 레이어드하면 가장 자연스러운 코디가 완성돼요.`,
  ];

  return (
    <Page size="A4" style={S.page}>
      <PageHeader label="컬러 팔레트" page={3} />

      {/* 03. Best Colors 헤더 */}
      <View style={[S.sectionBlock, { borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid', paddingLeft: 10, marginBottom: 10 }]}>
        <Text style={S.sectionNum}>03</Text>
        <Text style={S.sectionTitle}>{name}님께 어울리는 컬러</Text>
        <Text style={{ fontSize: 9, color: '#AAA', marginTop: 2, fontFamily: 'Pretendard' }}>Best Colors · {fashion.main}</Text>
      </View>

      {/* Best Colors Grid — 4×2, 큰 칩 + 별점 + 키워드 */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {bestColors.map(({ hex, name: cName }, i) => (
          <View key={hex} style={{
            width: '23%', alignItems: 'center',
            backgroundColor: '#FAFAFA', borderRadius: 8, padding: 10,
          }}>
            <View style={{
              width: 64, height: 64, borderRadius: 32,
              backgroundColor: hex,
              borderWidth: 0.5, borderColor: '#E0DCCC', borderStyle: 'solid',
              marginBottom: 7,
            }} />
            <Text style={{ fontSize: 9, fontWeight: 700, color: '#2A2A2A', textAlign: 'center', marginBottom: 2, fontFamily: 'Pretendard' }}>{cName}</Text>
            <Text style={{ fontSize: 6.5, color: '#BBB', textAlign: 'center', marginBottom: 5, fontFamily: 'Pretendard' }}>{hex}</Text>
            {/* 별점 (처음 4개 5점, 나머지 4점) */}
            <View style={{ flexDirection: 'row', gap: 2, marginBottom: 5 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <View key={s} style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: s <= (i < 4 ? 5 : 4) ? accent : '#E0DCCC' }} />
              ))}
            </View>
            {/* 분위기 키워드 배지 */}
            <View style={{ backgroundColor: accent + '18', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ fontSize: 6.5, color: accent, fontFamily: 'Pretendard', textAlign: 'center' }}>{getMood(cName)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={S.sectionDivider} />

      {/* 04. 피해야 할 컬러 */}
      <View style={{
        backgroundColor: '#FFF5F5', borderRadius: 8,
        borderLeftWidth: 4, borderLeftColor: '#FF3B30', borderLeftStyle: 'solid',
        padding: 10, marginBottom: 10,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 9, fontWeight: 700, color: '#fff', lineHeight: 1 }}>!</Text>
          </View>
          <Text style={{ fontSize: 11, fontWeight: 700, color: '#FF3B30', fontFamily: 'Pretendard' }}>04. 피해야 할 컬러</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {worstColors.map(({ hex, name: cName }) => (
            <View key={hex} style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 6 }}>
              <View style={{
                width: 46, height: 46, borderRadius: 23,
                backgroundColor: hex, opacity: 0.4,
                borderWidth: 2, borderColor: '#999', borderStyle: 'dashed',
                marginBottom: 5,
              }} />
              <Text style={{ fontSize: 8, fontWeight: 700, color: '#2A2A2A', textAlign: 'center', marginBottom: 1, fontFamily: 'Pretendard' }}>{cName}</Text>
              <Text style={{ fontSize: 6.5, color: '#888', textAlign: 'center', lineHeight: 1.4, fontFamily: 'Pretendard' }}>피부 톤을 칙칙하게</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={S.sectionDivider} />

      {/* 05. 컬러 조합 가이드 */}
      <View style={{ marginBottom: 10 }}>
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: '#AAA', fontFamily: 'Pretendard' }}>05. COLOR COMBINATION GUIDE</Text>
          <Text style={{ fontSize: 12, fontWeight: 700, color: '#2A2A2A', marginTop: 2, fontFamily: 'Pretendard' }}>{name}님을 위한 컬러 조합 가이드</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {combinations.map(({ type, typeEn, description, colors }) => (
            <View key={type} style={{
              flex: 1, backgroundColor: '#FAFAFA', borderRadius: 8, padding: 10,
              borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid',
            }}>
              <Text style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: 0.5, color: accent, marginBottom: 2, fontFamily: 'Pretendard' }}>{typeEn}</Text>
              <Text style={{ fontSize: 9.5, fontWeight: 700, color: '#2A2A2A', marginBottom: 6, fontFamily: 'Pretendard' }}>{type}</Text>
              <View style={{ flexDirection: 'row', gap: 5, marginBottom: 7 }}>
                {colors.map(c => (
                  <View key={c.hex} style={{ alignItems: 'center' }}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: c.hex, borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid', marginBottom: 3 }} />
                    <Text style={{ fontSize: 5.5, color: '#888', textAlign: 'center', maxWidth: 30, fontFamily: 'Pretendard' }}>{c.name}</Text>
                  </View>
                ))}
              </View>
              <Text style={{ fontSize: 7.5, color: '#555', lineHeight: 1.5, fontFamily: 'Pretendard' }}>{description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 06. 스타일링 노트 */}
      <View style={{
        backgroundColor: accent + '08',
        borderRadius: 8,
        borderLeftWidth: 4, borderLeftColor: accent, borderLeftStyle: 'solid',
        padding: 12,
      }}>
        <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: accent, marginBottom: 8, fontFamily: 'Pretendard' }}>
          06. {name}님을 위한 스타일링 노트
        </Text>
        {stylingNotes.map((note, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 7, marginBottom: 5 }}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: accent, marginTop: 4, flexShrink: 0 }} />
            <Text style={{ flex: 1, fontSize: 9, color: '#444', lineHeight: 1.6, fontFamily: 'Pretendard' }}>{note}</Text>
          </View>
        ))}
      </View>

      <Footer page={3} accent={accent} />
    </Page>
  );
}

// ── Page 4: Makeup ───────────────────────────────────────────────

function MakeupPage({ colorType, accent, customerName }: {
  colorType: PersonalColorType; accent: string; customerName: string;
}) {
  const cosmetics = cosmeticsDatabase[colorType];
  const tips = makeupTipsDatabase[colorType];
  const name = customerName || '고객';

  return (
    <Page size="A4" style={S.page}>
      <PageHeader label="메이크업 추천" page={4} />

      {/* 06. 립스틱 (3개) */}
      <SectionHead num="06" title={`${name}님께 추천하는 립스틱`} accent={accent} />
      <View style={{ marginBottom: 4 }}>
        {cosmetics.lipstick.slice(0, 3).map((p, i) => (
          <ProductRecommendation key={i} product={p} accentColor={accent} />
        ))}
      </View>

      <View style={S.sectionDivider} />

      {/* 06. 베이스 추천: 파운데이션(좌) + 아이섀도우(우) */}
      <Text style={{ fontSize: 9, fontWeight: 700, color: '#2A2A2A', marginBottom: 6, letterSpacing: 0.3 }}>07. 베이스 추천</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 7.5, fontWeight: 700, color: '#888', marginBottom: 5, letterSpacing: 0.5 }}>파운데이션</Text>
          {cosmetics.foundation.slice(0, 2).map((p, i) => (
            <ProductRecommendation key={i} product={p} accentColor={accent} />
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 7.5, fontWeight: 700, color: '#888', marginBottom: 5, letterSpacing: 0.5 }}>아이섀도우</Text>
          {cosmetics.eyeshadow.slice(0, 2).map((p, i) => (
            <ProductRecommendation key={i} product={p} accentColor={accent} />
          ))}
        </View>
      </View>

      <View style={S.sectionDivider} />

      {/* 07. 포인트 메이크업: 블러셔(좌) + 팁(우) */}
      <Text style={{ fontSize: 9, fontWeight: 700, color: '#2A2A2A', marginBottom: 6, letterSpacing: 0.3 }}>08. 포인트 메이크업</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 6 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 7.5, fontWeight: 700, color: '#888', marginBottom: 5, letterSpacing: 0.5 }}>블러셔</Text>
          {cosmetics.blusher.slice(0, 2).map((p, i) => (
            <ProductRecommendation key={i} product={p} accentColor={accent} />
          ))}
        </View>
        <View style={{ flex: 1.3, backgroundColor: '#FBF8F0', borderRadius: 6, padding: 10, borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid' }}>
          <Text style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: accent, marginBottom: 6 }}>
            메이크업 팁
          </Text>
          {tips.slice(0, 4).map((tip, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 5, marginBottom: 4 }}>
              <Text style={{ fontSize: 8, color: accent, marginTop: 1 }}>-</Text>
              <Text style={{ flex: 1, fontSize: 8, color: '#444', lineHeight: 1.5 }}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 구매처 */}
      <View style={{ backgroundColor: '#F0F4F8', borderRadius: 6, padding: 9, marginBottom: 6 }}>
        <View style={{ marginBottom: 4 }}>
          <IconLabel icon="shop" label="어디서 구매하나요?" fontSize={8} />
        </View>
        <Text style={{ fontSize: 8.5, color: '#555', lineHeight: 1.6 }}>
          올리브영·시코르·세포라에서 대부분의 제품을 시연 후 구매 가능합니다. 온라인 구매 시 컬러랩에서 추천한 정확한 호수를 선택하세요.
        </Text>
      </View>

      <View style={{ borderTopWidth: 0.5, borderTopColor: '#DDD8CC', borderTopStyle: 'solid', paddingTop: 5 }}>
        <Text style={{ fontSize: 7, color: '#BBB', lineHeight: 1.5 }}>
          제품 추천은 일반적인 가이드이며, 실제 사용 시 매장 시연 후 구매를 권장합니다. 제품 정보는 2025년 5월 기준이며 변경될 수 있습니다.
        </Text>
      </View>

      <Footer page={4} accent={accent} />
    </Page>
  );
}

// ── Page 5: Hair + Fashion + Seasonal Styling ────────────────────

const SEASON_META = [
  { key: 'spring', bg: '#FFF0F5', leftBg: '#FFE0EB', stripe: '#F098B0' },
  { key: 'summer', bg: '#F4F0FF', leftBg: '#E4DCFF', stripe: '#9878D8' },
  { key: 'autumn', bg: '#FFF5EB', leftBg: '#FFE8CC', stripe: '#C87838' },
  { key: 'winter', bg: '#EEF4FF', leftBg: '#DDE8FF', stripe: '#5878C8' },
] as const;

function HairFashionSeasonalPage({ colorType, accent, customerName }: {
  colorType: PersonalColorType; accent: string; customerName: string;
}) {
  const { hair, fashion, bestColors } = TYPE_EXTRA[colorType];
  const seasonal = seasonalStylingDatabase[colorType];
  const name = customerName || '고객';
  const avoidList = hair.avoid.split(',').map((s) => s.trim()).slice(0, 4);

  const colorGroups = [
    { label: 'MAIN COLOR', val: fashion.main,   colors: bestColors.slice(0, 3) },
    { label: 'SUB COLOR',  val: fashion.sub,    colors: bestColors.slice(3, 6) },
    { label: 'ACCENT',     val: fashion.accent, colors: bestColors.slice(6, 8) },
  ];

  return (
    <Page size="A4" style={S.page}>
      <PageHeader label="헤어 & 패션 & 시즌 스타일링" page={5} />

      {/* 09. 헤어 컬러 (compact) */}
      <SectionHead num="09" title={`${name}님께 어울리는 헤어 컬러`} accent={accent} />

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
        {hair.recommended.map(({ name: hName, desc }) => (
          <View key={hName} style={{
            flex: 1, backgroundColor: '#F5F2EC', borderRadius: 7, padding: 8, alignItems: 'center',
          }}>
            <View style={{
              width: 34, height: 34, borderRadius: 17,
              backgroundColor: hairHex(hName),
              borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid', marginBottom: 5,
            }} />
            <Text style={{ fontSize: 8, fontWeight: 700, color: '#2A2A2A', marginBottom: 2, textAlign: 'center' }}>{hName}</Text>
            <Text style={{ fontSize: 6.5, color: '#666', textAlign: 'center', lineHeight: 1.3 }}>{desc}</Text>
          </View>
        ))}
      </View>

      <View style={{
        backgroundColor: '#FFF5F5', borderRadius: 6, padding: 7,
        borderLeftWidth: 3, borderLeftColor: '#FF3B30', borderLeftStyle: 'solid',
        marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 8,
      }}>
        <Text style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1, color: '#FF3B30', flexShrink: 0 }}>AVOID</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 }}>
          {avoidList.map((avoid, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: hairHex(avoid), borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid' }} />
              <Text style={{ fontSize: 7.5, color: '#555' }}>x {avoid}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={S.sectionDivider} />

      {/* 10. 패션 컬러 */}
      <SectionHead num="10" title={`${name}님의 패션 컬러`} accent={accent} />

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 7 }}>
        {colorGroups.map(({ label, val, colors }) => (
          <View key={label} style={{
            flex: 1, backgroundColor: '#F5F2EC', borderRadius: 8, padding: 10,
            borderTopWidth: 3, borderTopColor: accent, borderTopStyle: 'solid',
          }}>
            <Text style={{ fontSize: 6, fontWeight: 700, letterSpacing: 1.5, color: '#AAA', marginBottom: 4 }}>{label}</Text>
            <Text style={{ fontSize: 9, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.4, marginBottom: 8 }}>{val}</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {colors.map(({ hex, name: cn }) => (
                <View key={hex} style={{ alignItems: 'center' }}>
                  <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: hex, borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid', marginBottom: 2 }} />
                  <Text style={{ fontSize: 5, color: '#888', textAlign: 'center', maxWidth: 26 }}>{cn}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={{
        backgroundColor: accent + '08', borderRadius: 6, padding: 8,
        borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid',
        marginBottom: 10,
      }}>
        <Text style={{ fontSize: 8.5, color: '#444', lineHeight: 1.5, fontFamily: 'Pretendard' }}>{fashion.tip}</Text>
      </View>

      <View style={S.sectionDivider} />

      {/* 11. 시즌별 스타일링 */}
      <SectionHead num="11" title={`${name}님의 시즌별 스타일링`} accent={accent} />

      <View style={{ flexDirection: 'column', gap: 6, flex: 1 }}>
        {SEASON_META.map(({ key, bg, leftBg, stripe }) => {
          const look = seasonal[key];
          return (
            <View key={key} style={{
              flex: 1, flexDirection: 'row',
              backgroundColor: bg, borderRadius: 7,
              borderTopWidth: 3, borderTopColor: stripe, borderTopStyle: 'solid',
            }}>
              <View style={{
                width: '20%', backgroundColor: leftBg,
                alignItems: 'center', justifyContent: 'center',
                paddingVertical: 6,
                borderRightWidth: 0.5, borderRightColor: stripe + '50', borderRightStyle: 'solid',
              }}>
                <SeasonIcon season={key} size={30} />
                <Text style={{ fontSize: 6.5, fontWeight: 700, color: stripe, letterSpacing: 0.3, marginTop: 3, textAlign: 'center' }}>
                  {key === 'spring' ? 'SPRING' : key === 'summer' ? 'SUMMER' : key === 'autumn' ? 'AUTUMN' : 'WINTER'}
                </Text>
              </View>
              <View style={{ flex: 1, padding: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: 700, color: '#2A2A2A', marginBottom: 3, lineHeight: 1.4, fontFamily: 'Pretendard' }}>{look.title}</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  {look.mustHaves.map((item, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: stripe }} />
                      <Text style={{ fontSize: 8.5, color: '#555', fontFamily: 'Pretendard' }}>{item.label}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                  {look.colors.map(({ name: cName, hex }) => (
                    <View key={hex} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: hex, borderWidth: 0.3, borderColor: '#CCC', borderStyle: 'solid' }} />
                      <Text style={{ fontSize: 8, color: '#666', fontFamily: 'Pretendard' }}>{cName}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <Footer page={5} accent={accent} />
    </Page>
  );
}

// ── Page 7: Celebrities + Custom Advice ─────────────────────────

interface CelebrityItem {
  name: string;
  profession: string;
  similarity: string;
  iconicLook: string;
}

function CelebAdvicePage({
  colorType, accent, customerName, celebrities, customAdvice,
}: {
  colorType: PersonalColorType; accent: string; customerName: string;
  celebrities?: CelebrityItem[];
  customAdvice?: { answer: string; isRelated: boolean };
}) {
  const name = customerName || '고객';
  const sigColors = TYPE_EXTRA[colorType].bestColors.slice(0, 3).map((c) => c.hex);
  const showAdvice = customAdvice?.isRelated === true;

  return (
    <Page size="A4" style={S.page}>
      <PageHeader label="셀러브리티 & 맞춤 답변" page={6} />

      <SectionHead num="12" title={`${name}님과 같은 톤의 셀러브리티`} accent={accent} />

      {celebrities && celebrities.length > 0 ? (
        <View style={{ flexDirection: 'column', gap: 0, marginBottom: 6 }}>
          {celebrities.map((celeb) => (
            <CelebrityCard
              key={celeb.name}
              name={celeb.name}
              profession={celeb.profession}
              similarity={celeb.similarity}
              iconicLook={celeb.iconicLook}
              signatureColors={sigColors}
            />
          ))}
        </View>
      ) : (
        <View style={{ backgroundColor: '#F5F2EC', borderRadius: 8, padding: 14, marginBottom: 8 }}>
          <Text style={S.body}>셀러브리티 정보를 불러오는 중입니다. 상세 분석 리포트에서 확인하세요.</Text>
        </View>
      )}

      {showAdvice ? (
        <>
          <View style={S.sectionDivider} />
          <SectionHead num="13" title={`${name}님의 고민에 대한 답변`} accent={accent} />
          <View style={S.adviceBox}>
            <Text style={S.adviceLabel}>AI 맞춤 조언</Text>
            <Text style={S.adviceText}>{customAdvice!.answer}</Text>
          </View>
        </>
      ) : (
        <>
          <View style={S.sectionDivider} />
          <View style={{
            backgroundColor: accent + '08', borderRadius: 10, padding: 16,
            borderLeftWidth: 4, borderLeftColor: accent, borderLeftStyle: 'solid',
          }}>
            <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: accent, marginBottom: 10, fontFamily: 'Pretendard' }}>
              {name}님을 위한 컬러랩 스타일링 가이드
            </Text>
            {[
              TYPE_EXTRA[colorType].fashion.tip,
              `메인 컬러 ${TYPE_EXTRA[colorType].fashion.main} 계열을 베이스로 코디를 시작하세요.`,
              `${TYPE_EXTRA[colorType].fashion.sub} 컬러로 레이어링하면 자연스러운 조합이 완성됩니다.`,
              `포인트 컬러 ${TYPE_EXTRA[colorType].fashion.accent}를 액세서리나 백으로 활용해보세요.`,
              TYPE_EXTRA[colorType].attributes.base.includes('Yellow')
                ? '금 소재 액세서리(골드·브라스)가 피부 톤과 가장 잘 어울립니다.'
                : '실버·화이트 골드 소재 액세서리가 쿨한 피부 톤을 돋보이게 합니다.',
              `헤어는 ${TYPE_EXTRA[colorType].hair.recommended[0].name} 계열을 1순위로 추천드려요.`,
            ].map((tip, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: accent, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Text style={{ fontSize: 8, fontWeight: 700, color: '#fff', fontFamily: 'Pretendard' }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 9.5, color: '#444', lineHeight: 1.6, fontFamily: 'Pretendard' }}>{tip}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Disclaimer */}
      <View style={{ marginTop: 12, padding: 8, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E5E5E5', borderTopStyle: 'solid' }}>
        <Text style={{ fontSize: 7, color: '#888', textAlign: 'center', lineHeight: 1.4 }}>
          셀러브리티 추천은 공개된 정보를 기반으로 한 분석가의 의견이며, 해당 인물의 공식 입장과 무관합니다.
        </Text>
      </View>

      {/* Final footer */}
      <View style={[S.footer, { flexDirection: 'column', alignItems: 'flex-start' }]}>
        <View style={{ borderTopWidth: 0.5, borderTopColor: '#DDD8CC', borderTopStyle: 'solid', width: '100%', paddingTop: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={S.footerText}>colorlab.kr  ·  본 리포트는 AI 분석에 기반한 참고용 자료입니다</Text>
            <Text style={[S.footerPage, { color: accent }]}>6 / 6</Text>
          </View>
          <Text style={[S.footerText, { marginTop: 2 }]}>Powered by COLORLAB AI  ·  © 2025 컬러랩</Text>
        </View>
      </View>
    </Page>
  );
}

// ── Props & Main export ──────────────────────────────────────────

export interface ReportPDFProps {
  colorType:     PersonalColorType;
  sessionId:     string;
  reportContent: string;
  createdAt?:    string;
  customerName?: string;
  personalIntro?: {
    greeting:              string;
    colorTypeDescription?: ColorTypeDescription;
    photoImpression:       string;
    keyFinding:            string;
    keyInsight?:           string;
  };
  celebrities?: CelebrityItem[];
  customAdvice?: {
    answer:    string;
    isRelated: boolean;
  };
}

export default function ReportPDF({
  colorType, sessionId, reportContent, createdAt,
  customerName, personalIntro, celebrities, customAdvice,
}: ReportPDFProps) {
  const accent  = TYPE_REPRESENTATIVE[colorType] ?? '#7C3AED';
  const date    = createdAt ?? new Date().toISOString().slice(0, 10);
  const name    = customerName?.trim() || '고객';
  const palette = TYPE_PALETTE[colorType];

  return (
    <Document title={`${name}님 컬러랩 퍼스널컬러 리포트 · ${colorType}`} author="COLORLAB">
      <CoverPage
        colorType={colorType} sessionId={sessionId} createdAt={date}
        accent={accent} customerName={name}
        greeting={personalIntro?.greeting ?? ''}
        colorTypeDescription={personalIntro?.colorTypeDescription}
        palette={[...palette]}
      />
      <AnalysisPage
        colorType={colorType} accent={accent} customerName={name}
        photoImpression={personalIntro?.photoImpression}
        keyFinding={personalIntro?.keyFinding}
        keyInsight={personalIntro?.keyInsight}
      />
      <PalettePage colorType={colorType} accent={accent} customerName={name} />
      <MakeupPage colorType={colorType} accent={accent} customerName={name} />
      <HairFashionSeasonalPage colorType={colorType} accent={accent} customerName={name} />
      <CelebAdvicePage
        colorType={colorType} accent={accent} customerName={name}
        celebrities={celebrities}
        customAdvice={customAdvice}
      />
    </Document>
  );
}
