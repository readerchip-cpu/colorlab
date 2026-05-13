'use client';

import '@/lib/pdf/font';
import { Document, Page, View, Text, StyleSheet, Link, Svg, Path } from '@react-pdf/renderer';
import { TYPE_PALETTE, TYPE_DISPLAY, TYPE_REPRESENTATIVE } from '@/lib/colorData';
import { QuadrantChart } from './QuadrantChart';
import { ColorChip } from './ColorChip';
import { SeasonCard } from './SeasonCard';
import { SeasonIcon } from './SeasonIcon';
import { seasonalStylingDatabase } from '@/lib/data/seasonalStyling';
import type { SeasonalStyling } from '@/lib/data/seasonalStyling';
import { PaletteGrid } from './PaletteGrid';
import { CelebrityCard } from './CelebrityCard';
import { ProductRecommendation } from './ProductRecommendation';
import { cosmeticsDatabase } from '@/lib/data/cosmetics';
import { makeupTipsDatabase } from '@/lib/data/makeupTips';
import type { PersonalColorType } from '@/types';

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
  // ── Page header (all non-cover pages) ──
  pageHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12, paddingBottom: 8,
    borderBottomWidth: 0.5, borderBottomColor: '#DDD8CC', borderBottomStyle: 'solid',
  },
  pageHeaderLeft: { fontSize: 7, color: '#AAA', letterSpacing: 1 },
  pageHeaderRight: { fontSize: 7, color: '#AAA' },
  // ── Section headings ──
  sectionBlock: { marginBottom: 14 },
  sectionNum: { fontSize: 7.5, fontWeight: 700, letterSpacing: 2, color: '#BBB', marginBottom: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.2 },
  sectionDivider: { height: 0.5, backgroundColor: '#DDD8CC', marginVertical: 10 },
  subTitle: { fontSize: 12, fontWeight: 700, color: '#2A2A2A', marginBottom: 6 },
  // ── Body text ──
  body: { fontSize: 10.5, color: '#444', lineHeight: 1.7 },
  bodySmall: { fontSize: 8.5, color: '#555', lineHeight: 1.6 },
  caption: { fontSize: 8, color: '#999' },
  // ── Cover ──
  coverMeta: { fontSize: 7, color: '#AAA', letterSpacing: 0.5, textAlign: 'right', lineHeight: 1.7 },
  coverNameLine: { fontSize: 22, fontWeight: 700, color: '#2A2A2A', letterSpacing: -0.5, marginBottom: 4 },
  coverTypeEn: { fontSize: 38, fontWeight: 700, color: '#2A2A2A', letterSpacing: -1, lineHeight: 1, marginBottom: 8 },
  coverTypeKo: { fontSize: 18, fontWeight: 400, color: '#666', marginBottom: 6 },
  coverDisplayName: { fontSize: 11, color: '#999', marginBottom: 16 },
  // ── Chips ──
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
  // ── Makeup lip strip ──
  lipStrip: {
    height: 14, borderRadius: 7, marginBottom: 5,
    borderWidth: 0.5, borderColor: '#E0DCCC', borderStyle: 'solid',
  },
  // ── Attribute card ──
  attrCard: {
    flex: 1, backgroundColor: '#F5F2EC', borderRadius: 6, padding: 8,
  },
  attrCardKey: { fontSize: 6.5, fontWeight: 700, letterSpacing: 1.2, color: '#AAA', marginBottom: 3 },
  attrCardLabel: { fontSize: 9, fontWeight: 700, color: '#2A2A2A', marginBottom: 2 },
  attrCardVal: { fontSize: 8, color: '#555' },
  // ── Key finding highlight ──
  keyFindingBox: {
    backgroundColor: '#F0ECF8', borderRadius: 6,
    borderLeftWidth: 3, borderLeftColor: '#7C3AED', borderLeftStyle: 'solid',
    padding: 8, marginTop: 6,
  },
  keyFindingLabel: { fontSize: 6.5, fontWeight: 700, letterSpacing: 1.2, color: '#7C3AED', marginBottom: 3 },
  keyFindingText: { fontSize: 10, fontWeight: 700, color: '#2A2A2A', lineHeight: 1.4 },
  // ── Celebrity card ──
  celebCard: {
    borderRadius: 8, padding: 12, marginBottom: 0,
    borderWidth: 0.5, borderColor: '#E0DCCC', borderStyle: 'solid',
  },
  celebName: { fontSize: 13, fontWeight: 700, color: '#2A2A2A', marginBottom: 2 },
  celebJob: { fontSize: 8, color: '#888', marginBottom: 6 },
  celebSimilarity: { fontSize: 9, color: '#444', lineHeight: 1.5, marginBottom: 4 },
  celebLook: { fontSize: 8.5, color: '#666', lineHeight: 1.4 },
  // ── Fashion color group ──
  fashionGroupLabel: { fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: '#AAA', marginBottom: 4 },
  fashionGroupText: { fontSize: 10, color: '#2A2A2A', lineHeight: 1.4 },
  // ── Tip bullet ──
  tipRow: { flexDirection: 'row', gap: 6, marginBottom: 5 },
  tipBullet: { width: 5, height: 5, borderRadius: 2.5, marginTop: 3 },
  tipText: { flex: 1, fontSize: 9.5, color: '#444', lineHeight: 1.5 },
  // ── Season card ──
  seasonCard: { flex: 1, borderRadius: 8, padding: 10 },
  seasonIcon: { fontSize: 13, marginBottom: 4 },
  seasonLabel: { fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: '#888', marginBottom: 4 },
  seasonText: { fontSize: 9, color: '#2A2A2A', lineHeight: 1.5 },
  // ── Footer ──
  footer: {
    position: 'absolute', bottom: 12, left: PAD_H, right: PAD_H,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 0.5, borderTopColor: '#DDD8CC', borderTopStyle: 'solid',
    paddingTop: 6,
  },
  footerText: { fontSize: 7, color: '#BBB' },
  footerPage: { fontSize: 7.5, fontWeight: 700, color: '#CCC' },
  // ── Custom advice ──
  adviceBox: { backgroundColor: '#F8F5FC', borderRadius: 6, padding: 10 },
  adviceLabel: { fontSize: 7.5, fontWeight: 700, letterSpacing: 1, color: '#7C3AED', marginBottom: 6 },
  adviceText: { fontSize: 10, color: '#333', lineHeight: 1.6 },
});

// ── Shared components ────────────────────────────────────────────

function PageHeader({ label, page, total }: { label: string; page: number; total: number }) {
  return (
    <View style={S.pageHeader}>
      <Text style={S.pageHeaderLeft}>COLORLAB · {label}</Text>
      <Text style={S.pageHeaderRight}>{page} / {total}</Text>
    </View>
  );
}

function Footer({ page, total, accent }: { page: number; total: number; accent: string }) {
  return (
    <View style={S.footer}>
      <Text style={S.footerText}>colorlab.kr  ·  본 리포트는 AI 분석에 기반한 참고용 자료입니다</Text>
      <Text style={[S.footerPage, { color: accent }]}>{page} / {total}</Text>
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

function CoverPage({ colorType, sessionId, createdAt, accent, customerName, greeting, bodyMessage, palette }: {
  colorType: PersonalColorType; sessionId: string; createdAt: string; accent: string;
  customerName: string; greeting: string; bodyMessage: string;
  palette: Array<{ hex: string; name: string }>;
}) {
  const typeEn = TYPE_EN[colorType];
  const display = TYPE_DISPLAY[colorType];
  const name = customerName || '고객';

  return (
    <Page size="A4" style={S.page}>
      {/* Header row */}
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

      {/* Name + type */}
      <Text style={S.coverNameLine}>{name}님의</Text>
      <Text style={S.coverTypeEn}>{typeEn}</Text>
      <Text style={S.coverTypeKo}>{colorType}</Text>
      <Text style={S.coverDisplayName}>{display}</Text>

      {/* Palette circles */}
      <View style={{ flexDirection: 'row', gap: 14, marginBottom: 24 }}>
        {palette.map(({ hex, name: cName }) => (
          <ColorChip key={hex} hex={hex} name={cName} size="large" showHex={false} />
        ))}
      </View>

      {/* Personal Message */}
      {greeting ? (
        <View style={{ backgroundColor: '#F5F2EC', borderRadius: 8, padding: 16, marginBottom: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.5, color: '#AAA', marginBottom: 10, textAlign: 'center' }}>
            PERSONAL MESSAGE
          </Text>

          {/* Greeting — Light weight */}
          <Text style={{ fontSize: 13, fontWeight: 300, color: '#2A2A2A', lineHeight: 1.7, letterSpacing: 0.3, textAlign: 'center' }}>
            {greeting}
          </Text>

          {/* Divider + body message */}
          {bodyMessage ? (
            <>
              <View style={{ width: 40, height: 1, backgroundColor: accent, marginVertical: 12 }} />
              <Text style={{ fontSize: 13, fontWeight: 300, color: '#444', lineHeight: 1.7, letterSpacing: 0.2, textAlign: 'center' }}>
                {bodyMessage}
              </Text>
            </>
          ) : null}
        </View>
      ) : null}

      {/* Watermark */}
      <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ height: 0.5, flex: 1, backgroundColor: '#E8E4DC' }} />
          <Text style={{ fontSize: 7, color: '#CCC', letterSpacing: 2 }}>MADE BY COLORLAB</Text>
          <View style={{ height: 0.5, flex: 1, backgroundColor: '#E8E4DC' }} />
        </View>
        <Text style={{ fontSize: 6.5, color: '#DDD', marginTop: 3, letterSpacing: 1 }}>AI PERSONAL COLOR ANALYSIS · colorlab.kr</Text>
      </View>

      <Footer page={1} total={6} accent={accent} />
    </Page>
  );
}

// ── Page 2: Photo Analysis + Type Diagnosis ──────────────────────

function AnalysisPage({ colorType, accent, customerName, photoImpression, keyFinding }: {
  colorType: PersonalColorType; accent: string; customerName: string;
  photoImpression?: string; keyFinding?: string;
}) {
  const extra = TYPE_EXTRA[colorType];
  const { attributes } = extra;
  const [posX, posY] = CHART_POS[colorType];
  const warmCool  = Math.round((posX + 1) / 2 * 100);
  const lightDeep = Math.round((1 - posY) / 2 * 100);
  const name = customerName || '고객';

  const contrastLevel = attributes.contrast.includes('High') ? 3 : attributes.contrast.includes('Medium') ? 2 : 1;
  const attrCards = [
    { key: 'HUE',     label: '색상', val: attributes.hue },
    { key: 'VALUE',   label: '명도', val: attributes.value },
    { key: 'CHROMA',  label: '채도', val: attributes.chroma },
    { key: 'CLARITY', label: '청탁', val: attributes.clarity },
  ];

  return (
    <Page size="A4" style={S.page}>
      <PageHeader label="타입 분석" page={2} total={6} />

      {/* Top: photo impression + chart side by side */}
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 14 }}>
        {/* Left: first impression */}
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

        {/* Right: quadrant chart */}
        <View style={{ alignItems: 'center', paddingTop: 8 }}>
          <QuadrantChart warmCool={warmCool} lightDeep={lightDeep} size={196} />
        </View>
      </View>

      <View style={S.sectionDivider} />

      {/* Bottom: type diagnosis */}
      <SectionHead num="02" title="정밀 분석" accent={accent} />

      {/* 4 attribute cards */}
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
        {attrCards.map(({ key, label, val }) => (
          <View key={key} style={S.attrCard}>
            <Text style={S.attrCardKey}>{key}</Text>
            <Text style={S.attrCardLabel}>{label}</Text>
            <Text style={S.attrCardVal}>{val}</Text>
          </View>
        ))}
      </View>

      {/* Base + Contrast */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <View style={{ flex: 1, backgroundColor: '#F5F2EC', borderRadius: 6, padding: 8 }}>
          <Text style={S.attrCardKey}>BASE TONE</Text>
          <Text style={[S.attrCardLabel, { color: accent }]}>{attributes.base}</Text>
        </View>
        <View style={{ flex: 2, backgroundColor: '#F5F2EC', borderRadius: 6, padding: 8 }}>
          <Text style={[S.attrCardKey, { marginBottom: 6 }]}>CONTRAST</Text>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            {[1, 2, 3].map((lv) => (
              <View key={lv} style={{ width: 40, height: 8, borderRadius: 4, backgroundColor: lv <= contrastLevel ? accent : '#E0DCCC' }} />
            ))}
            <Text style={[S.caption, { marginLeft: 6 }]}>{attributes.contrast}</Text>
          </View>
        </View>
      </View>

      {/* Academic citation box */}
      <View style={{
        backgroundColor: '#F0F4F8', borderRadius: 6, padding: 8,
        borderLeftWidth: 2, borderLeftColor: '#8FA8C0', borderLeftStyle: 'solid',
      }}>
        <Text style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: 1.2, color: '#8FA8C0', marginBottom: 3 }}>REFERENCE</Text>
        <Text style={{ fontSize: 8.5, color: '#555', lineHeight: 1.6 }}>
          본 분석은 한국색채학회 연구 및 국제 퍼스널컬러 분석 기준(ICA)을 기반으로 합니다. 결과는 촬영 환경·조명에 따라 다소 달라질 수 있으며, 전문가 상담과 병행 시 더 정확한 결과를 얻을 수 있습니다.
        </Text>
      </View>

      <Footer page={2} total={6} accent={accent} />
    </Page>
  );
}

// ── Page 3: Color Palette ────────────────────────────────────────

function PalettePage({ colorType, accent, customerName }: { colorType: PersonalColorType; accent: string; customerName: string }) {
  const { bestColors, worstColors, fashion } = TYPE_EXTRA[colorType];
  const name = customerName || '고객';

  return (
    <Page size="A4" style={S.page}>
      <PageHeader label="컬러 팔레트" page={3} total={6} />

      <SectionHead num="03" title={`${name}님께 어울리는 컬러`} accent={accent} />

      {/* Best 8: 큰 칩, 좁은 gap */}
      <PaletteGrid colors={bestColors} columns={4} chipSize={70} gap={4} />

      <View style={S.sectionDivider} />

      {/* 04. 피해야 할 컬러 — 강조 경고 박스 */}
      <View style={{
        backgroundColor: '#FFF5F5',
        borderRadius: 8,
        borderLeftWidth: 4, borderLeftColor: '#FF3B30', borderLeftStyle: 'solid',
        padding: 10, marginBottom: 8,
      }}>
        {/* 경고 헤더 */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <View style={{
            width: 18, height: 18, borderRadius: 9,
            backgroundColor: '#FF3B30',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1 }}>!</Text>
          </View>
          <Text style={{ fontSize: 12, fontWeight: 700, color: '#FF3B30', fontFamily: 'Pretendard' }}>
            04. 피해야 할 컬러
          </Text>
        </View>

        {/* 피해야 할 컬러 카드 4개 */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {worstColors.map(({ hex, name: cName }) => (
            <View key={hex} style={{
              flex: 1, alignItems: 'center',
              backgroundColor: '#fff', padding: 8, borderRadius: 6,
            }}>
              {/* 색상 칩 + X 오버레이 */}
              <View style={{ width: 50, height: 50, position: 'relative', marginBottom: 6 }}>
                <View style={{
                  width: 50, height: 50, borderRadius: 25,
                  backgroundColor: hex, opacity: 0.55,
                  borderWidth: 0.5, borderColor: '#E0DCCC', borderStyle: 'solid',
                }} />
                <View style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Svg width={50} height={50}>
                    <Path
                      d="M12 12 L38 38 M38 12 L12 38"
                      stroke="#FF3B30"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                    />
                  </Svg>
                </View>
              </View>
              <Text style={{ fontSize: 8.5, fontWeight: 700, color: '#2A2A2A', textAlign: 'center', marginBottom: 2 }}>
                {cName}
              </Text>
              <Text style={{ fontSize: 7, color: '#888', textAlign: 'center', lineHeight: 1.4 }}>
                피부 톤을 칙칙하게 만듭니다
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={S.sectionDivider} />

      {/* Styling note - expanded */}
      <View style={{ backgroundColor: '#F5F2EC', borderRadius: 6, padding: 10 }}>
        <Text style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 1.2, color: '#888', marginBottom: 5 }}>STYLING NOTE</Text>
        <Text style={S.body}>{fashion.tip}</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
          {[
            { label: 'MAIN', val: fashion.main },
            { label: 'SUB',  val: fashion.sub },
            { label: 'ACCENT', val: fashion.accent },
          ].map(({ label, val }) => (
            <View key={label} style={{ flex: 1, backgroundColor: '#EDE9E0', borderRadius: 4, padding: 6 }}>
              <Text style={{ fontSize: 6, fontWeight: 700, letterSpacing: 1, color: '#999', marginBottom: 2 }}>{label}</Text>
              <Text style={{ fontSize: 8.5, color: '#555', lineHeight: 1.5 }}>{val}</Text>
            </View>
          ))}
        </View>
      </View>

      <Footer page={3} total={6} accent={accent} />
    </Page>
  );
}

// ── Page 4: Makeup + Hair ────────────────────────────────────────

function MakeupHairPage({ colorType, accent, customerName }: {
  colorType: PersonalColorType; accent: string; customerName: string;
}) {
  const { makeup, hair } = TYPE_EXTRA[colorType];
  const cosmetics = cosmeticsDatabase[colorType];
  const tips = makeupTipsDatabase[colorType];
  const name = customerName || '고객';

  return (
    <Page size="A4" style={S.page}>
      <PageHeader label="메이크업 & 헤어" page={4} total={6} />

      {/* 05: 립스틱 제품 추천 — 4개 */}
      <SectionHead num="05" title={`${name}님께 추천하는 립스틱`} accent={accent} />
      <View style={{ marginBottom: 3 }}>
        {cosmetics.lipstick.map((p, i) => (
          <ProductRecommendation key={i} product={p} accentColor={accent} />
        ))}
      </View>

      <View style={S.sectionDivider} />

      {/* 06: 파운데이션 제품 추천 — 3개 */}
      <SectionHead num="06" title={`${name}님께 추천하는 파운데이션`} accent={accent} />
      <View style={{ marginBottom: 3 }}>
        {cosmetics.foundation.map((p, i) => (
          <ProductRecommendation key={i} product={p} accentColor={accent} />
        ))}
      </View>

      <View style={S.sectionDivider} />

      {/* 아이섀도우 + 블러셔 + 헤어 — 3열 컴팩트 */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 6 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 7.5, fontWeight: 700, color: '#2A2A2A', marginBottom: 4 }}>아이섀도우</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {makeup.eyeshadow.map(({ hex, name: n }) => (
              <View key={hex} style={{ alignItems: 'center' }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: hex, borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid' }} />
                <Text style={{ fontSize: 6, color: '#666', marginTop: 2, textAlign: 'center' }}>{n}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 7.5, fontWeight: 700, color: '#2A2A2A', marginBottom: 4 }}>블러셔</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {makeup.blush.map(({ hex, name: n }) => (
              <View key={hex} style={{ alignItems: 'center' }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: hex, borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid' }} />
                <Text style={{ fontSize: 6, color: '#666', marginTop: 2, textAlign: 'center' }}>{n}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ flex: 1.2 }}>
          <Text style={{ fontSize: 7.5, fontWeight: 700, color: '#2A2A2A', marginBottom: 4 }}>헤어 추천</Text>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {hair.recommended.slice(0, 3).map(({ name: hName }) => (
              <View key={hName} style={{ alignItems: 'center' }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: hairHex(hName), borderWidth: 0.5, borderColor: '#DDD', borderStyle: 'solid' }} />
                <Text style={{ fontSize: 5.5, color: '#666', marginTop: 2, textAlign: 'center', maxWidth: 36 }}>{hName}</Text>
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 6, color: '#E05555', marginTop: 4 }}>✕ {hair.avoid.split(',')[0]}</Text>
        </View>
      </View>

      <View style={S.sectionDivider} />

      {/* 메이크업 팁 */}
      <View style={{
        backgroundColor: '#FBF8F0',
        borderRadius: 6, padding: 10,
        borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid',
        marginBottom: 6,
      }}>
        <Text style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: accent, marginBottom: 6 }}>
          💡 {name}님을 위한 메이크업 팁
        </Text>
        {tips.map((tip, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 5, marginBottom: 4 }}>
            <Text style={{ fontSize: 8, color: accent, marginTop: 1 }}>▸</Text>
            <Text style={{ flex: 1, fontSize: 8.5, color: '#444', lineHeight: 1.55 }}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* 구매처 안내 */}
      <View style={{
        backgroundColor: '#F0F4F8',
        borderRadius: 6, padding: 9,
        marginBottom: 6,
      }}>
        <Text style={{ fontSize: 8, fontWeight: 700, color: '#5878A8', marginBottom: 5 }}>
          🛍 어디서 구매하나요?
        </Text>
        <Text style={{ fontSize: 8.5, color: '#555', lineHeight: 1.6 }}>
          올리브영·시코르·세포라에서 대부분의 제품을 시연 후 구매 가능합니다.
        </Text>
        <Text style={{ fontSize: 8.5, color: '#555', lineHeight: 1.6 }}>
          제품마다 매장 보유 여부가 다르니 방문 전 확인을 권장합니다. 온라인 구매 시 컬러랩에서 추천한 정확한 호수를 선택하세요.
        </Text>
      </View>

      {/* Disclaimer */}
      <View style={{ borderTopWidth: 0.5, borderTopColor: '#DDD8CC', borderTopStyle: 'solid', paddingTop: 5 }}>
        <Text style={{ fontSize: 7, color: '#BBB', lineHeight: 1.5 }}>
          제품 추천은 일반적인 가이드이며, 실제 사용 시 매장 시연 후 구매를 권장합니다. 제품 정보는 2025년 5월 기준이며, 변경될 수 있습니다.
        </Text>
      </View>

      <Footer page={4} total={6} accent={accent} />
    </Page>
  );
}

// ── Page 5: Fashion + Seasonal ───────────────────────────────────

const SEASON_META = [
  { key: 'spring', bg: '#FFF0F5', leftBg: '#FFE0EB', stripe: '#F098B0' },
  { key: 'summer', bg: '#F4F0FF', leftBg: '#E4DCFF', stripe: '#9878D8' },
  { key: 'autumn', bg: '#FFF5EB', leftBg: '#FFE8CC', stripe: '#C87838' },
  { key: 'winter', bg: '#EEF4FF', leftBg: '#DDE8FF', stripe: '#5878C8' },
] as const;

function FashionSeasonPage({ colorType, accent, customerName }: {
  colorType: PersonalColorType; accent: string; customerName: string;
}) {
  const { fashion } = TYPE_EXTRA[colorType];
  const seasonal = seasonalStylingDatabase[colorType];
  const name = customerName || '고객';

  return (
    <Page size="A4" style={S.page}>
      <PageHeader label="패션 & 시즌" page={5} total={6} />

      {/* 07: 패션 컬러 가이드 — compact */}
      <SectionHead num="07" title="패션 컬러 가이드" accent={accent} />
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
        {([
          { label: 'MAIN COLOR', val: fashion.main },
          { label: 'SUB COLOR',  val: fashion.sub  },
          { label: 'ACCENT',     val: fashion.accent },
        ] as const).map(({ label, val }) => (
          <View key={label} style={{ flex: 1, backgroundColor: '#F5F2EC', borderRadius: 5, padding: 7 }}>
            <Text style={{ fontSize: 6, fontWeight: 700, letterSpacing: 1, color: '#AAA', marginBottom: 2 }}>{label}</Text>
            <Text style={{ fontSize: 9, color: '#2A2A2A', lineHeight: 1.5 }}>{val}</Text>
          </View>
        ))}
      </View>

      <View style={S.sectionDivider} />

      {/* 08: 시즌별 스타일링 — 큰 카드 4개 */}
      <SectionHead num="08" title={`${name}님의 시즌별 스타일링`} accent={accent} />

      <View style={{ flexDirection: 'column', gap: 7 }}>
        {SEASON_META.map(({ key, bg, leftBg, stripe }) => {
          const look = seasonal[key];
          return (
            <View key={key} style={{
              flexDirection: 'row',
              backgroundColor: bg,
              borderRadius: 7,
              borderTopWidth: 3, borderTopColor: stripe, borderTopStyle: 'solid',
            }}>
              {/* 좌측 패널 (30%): 시즌 아이콘 + 레이블 */}
              <View style={{
                width: '28%', backgroundColor: leftBg,
                alignItems: 'center', justifyContent: 'center',
                paddingVertical: 10, paddingHorizontal: 6,
                borderRightWidth: 0.5, borderRightColor: stripe + '50', borderRightStyle: 'solid',
              }}>
                <SeasonIcon season={key} size={42} />
                <Text style={{
                  fontSize: 8, fontWeight: 700, color: stripe,
                  letterSpacing: 0.5, marginTop: 5, textAlign: 'center',
                }}>
                  {key === 'spring' ? 'SPRING 봄'
                    : key === 'summer' ? 'SUMMER 여름'
                    : key === 'autumn' ? 'AUTUMN 가을'
                    : 'WINTER 겨울'}
                </Text>
              </View>

              {/* 우측 패널 (70%): 룩 상세 */}
              <View style={{ flex: 1, padding: 9 }}>
                {/* 제목 */}
                <Text style={{ fontSize: 11, fontWeight: 700, color: '#2A2A2A', marginBottom: 3 }}>
                  {look.title}
                </Text>

                {/* 설명 */}
                <Text style={{ fontSize: 8.5, color: '#444', lineHeight: 1.55, marginBottom: 5 }}>
                  {look.description}
                </Text>

                {/* 필수 아이템 */}
                <Text style={{ fontSize: 6, fontWeight: 700, letterSpacing: 1.2, color: '#AAA', marginBottom: 3 }}>
                  MUST HAVE
                </Text>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                  {look.mustHaves.map((item, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Text style={{ fontSize: 9 }}>{item.icon}</Text>
                      <Text style={{ fontSize: 7.5, color: '#555' }}>{item.label}</Text>
                    </View>
                  ))}
                </View>

                {/* 추천 컬러 칩 */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 6, color: '#BBB', letterSpacing: 0.5 }}>추천 컬러</Text>
                  {look.colors.map(({ name: cName, hex }) => (
                    <View key={hex} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <View style={{
                        width: 10, height: 10, borderRadius: 5,
                        backgroundColor: hex,
                        borderWidth: 0.3, borderColor: '#CCC', borderStyle: 'solid',
                      }} />
                      <Text style={{ fontSize: 6.5, color: '#666' }}>{cName}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <Footer page={5} total={6} accent={accent} />
    </Page>
  );
}

// ── Page 6: Celebrities + Custom Advice ─────────────────────────

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

  return (
    <Page size="A4" style={S.page}>
      <PageHeader label="셀러브리티 & 맞춤 답변" page={6} total={6} />

      <SectionHead num="09" title={`${name}님과 같은 톤의 셀러브리티`} accent={accent} />

      {celebrities && celebrities.length > 0 ? (
        <View style={{ flexDirection: 'column', gap: 0, marginBottom: 4 }}>
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

      {customAdvice !== undefined ? (
        <>
          <View style={S.sectionDivider} />
          <SectionHead num="10" title={`${name}님의 고민에 대한 답변`} accent={accent} />
          {customAdvice.isRelated ? (
            <View style={S.adviceBox}>
              <Text style={S.adviceLabel}>AI 맞춤 조언</Text>
              <Text style={S.adviceText}>{customAdvice.answer}</Text>
            </View>
          ) : (
            <View style={[S.adviceBox, { backgroundColor: '#F5F5F5' }]}>
              <Text style={[S.adviceText, { color: '#999' }]}>해당 질문에는 답변이 불가합니다.</Text>
            </View>
          )}
        </>
      ) : null}

      {/* More celebrities promo box */}
      <View style={{
        marginTop: 10,
        backgroundColor: accent + '10',
        borderRadius: 8,
        padding: 12,
        borderWidth: 0.5, borderColor: accent + '30', borderStyle: 'solid',
      }}>
        <Text style={{ fontSize: 9, fontWeight: 700, color: accent, marginBottom: 6 }}>
          💡 더 많은 셀러브리티 찾아보기
        </Text>
        <Text style={{ fontSize: 8.5, color: '#555', lineHeight: 1.6, marginBottom: 8 }}>
          매월 새로운 퍼스널컬러 셀럽 분석 콘텐츠를 업데이트합니다.
          인스타그램과 블로그에서 더 많은 셀럽의 컬러 스타일을 확인해보세요.
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Link src="https://instagram.com/colorlab.kr" style={{
            fontSize: 8, color: accent, fontFamily: 'Pretendard',
          }}>
            📸 인스타그램 @colorlab.kr
          </Link>
          <Link src="https://colorlab.kr/blog" style={{
            fontSize: 8, color: accent, fontFamily: 'Pretendard',
          }}>
            📝 컬러랩 블로그
          </Link>
        </View>
      </View>

      {/* Celebrity disclaimer */}
      <View style={{ marginTop: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 7, color: '#888', textAlign: 'center', lineHeight: 1.6 }}>
          셀러브리티 추천은 공개된 정보를 기반으로 한 분석가의 의견이며, 해당 인물의 공식 입장과 무관합니다.
        </Text>
        <Text style={{ fontSize: 7, color: '#888', textAlign: 'center', lineHeight: 1.6 }}>
          이미지 검색 링크를 통해 각 인물의 사진을 확인하실 수 있습니다.
        </Text>
      </View>

      {/* Final footer with full info */}
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
    greeting:        string;
    bodyMessage?:    string;
    photoImpression: string;
    keyFinding:      string;
  };
  celebrities?: CelebrityItem[];
  customAdvice?: {
    answer:     string;
    isRelated:  boolean;
  };
}

export default function ReportPDF({
  colorType, sessionId, reportContent, createdAt,
  customerName, personalIntro, celebrities, customAdvice,
}: ReportPDFProps) {
  const accent = TYPE_REPRESENTATIVE[colorType] ?? '#7C3AED';
  const date   = createdAt ?? new Date().toISOString().slice(0, 10);
  const name   = customerName?.trim() || '고객';
  const palette = TYPE_PALETTE[colorType];

  return (
    <Document title={`${name}님 컬러랩 퍼스널컬러 리포트 · ${colorType}`} author="COLORLAB">
      <CoverPage
        colorType={colorType} sessionId={sessionId} createdAt={date}
        accent={accent} customerName={name}
        greeting={personalIntro?.greeting ?? ''}
        bodyMessage={personalIntro?.bodyMessage ?? ''}
        palette={[...palette]}
      />
      <AnalysisPage
        colorType={colorType} accent={accent} customerName={name}
        photoImpression={personalIntro?.photoImpression}
        keyFinding={personalIntro?.keyFinding}
      />
      <PalettePage colorType={colorType} accent={accent} customerName={name} />
      <MakeupHairPage colorType={colorType} accent={accent} customerName={name} />
      <FashionSeasonPage colorType={colorType} accent={accent} customerName={name} />
      <CelebAdvicePage
        colorType={colorType} accent={accent} customerName={name}
        celebrities={celebrities}
        customAdvice={customAdvice}
      />
    </Document>
  );
}
