import type { PersonalColorType } from '@/types';

export interface CosmeticProduct {
  brand: string;
  product: string;
  shade: string;
  hex: string;
  price: number;
}

export interface TypeCosmetics {
  lipstick: CosmeticProduct[];
  foundation: CosmeticProduct[];
}

export const cosmeticsDatabase: Record<PersonalColorType, TypeCosmetics> = {
  '봄 라이트': {
    lipstick: [
      { brand: '롬앤',    product: '쥬시 래스팅 틴트',       shade: '#12 미스티 피치',       hex: '#F4A090', price: 10000 },
      { brand: '페리페라', product: '잉크 더 벨벳',           shade: '#22 코랄 핑크',         hex: '#F09080', price: 9000  },
      { brand: '어뮤즈',  product: '듀 벨벳 틴트',           shade: '#07 누드 오렌지',       hex: '#E8907A', price: 15000 },
      { brand: '에뛰드',  product: '픽싱 틴트',              shade: '#OR201 피치 코랄',      hex: '#F5A080', price: 9000  },
    ],
    foundation: [
      { brand: '헤라',    product: '실크 글로우 쿠션',        shade: '#21N 라이트 베이지',    hex: '#F5D5B5', price: 58000 },
      { brand: '에스쁘아', product: 'No Wear 파운데이션 쿠션', shade: '#14C 바닐라 아이보리',  hex: '#F0C898', price: 32000 },
      { brand: '클리오',  product: '킬커버 파운웨어 쿠션',    shade: '#3호 린넨',             hex: '#EDCBA8', price: 28000 },
    ],
  },

  '봄 브라이트': {
    lipstick: [
      { brand: '페리페라', product: '잉크 더 벨벳',           shade: '#01 코랄 페스타',       hex: '#FF7050', price: 9000  },
      { brand: '롬앤',    product: '쥬시 래스팅 틴트',        shade: '#06 피그 피그',         hex: '#FF8040', price: 10000 },
      { brand: '어뮤즈',  product: '듀 글로우 틴트',          shade: '#02 코랄 오렌지',       hex: '#FF7040', price: 15000 },
      { brand: '클리오',  product: '킬 레드 틴트',            shade: '#01 레드 오렌지',       hex: '#FF5030', price: 13000 },
    ],
    foundation: [
      { brand: '클리오',  product: '킬커버 파운웨어 쿠션',    shade: '#2.5호 내추럴 베이지',  hex: '#F2C8A0', price: 28000 },
      { brand: '헤라',    product: '블랙 쿠션',               shade: '#21W 웜 라이트',        hex: '#F0C890', price: 60000 },
      { brand: '미샤',    product: 'M 쿠션 파운데이션',        shade: '#21호 밝은 베이지',     hex: '#F5D0A0', price: 12000 },
    ],
  },

  '여름 라이트': {
    lipstick: [
      { brand: '롬앤',    product: '쥬시 래스팅 틴트',        shade: '#14 아라우카리아 핑크', hex: '#E8B0C8', price: 10000 },
      { brand: '데이지크', product: '워터 벨벳 틴트',          shade: '#21 라일락 핑크',       hex: '#D8B0D0', price: 12000 },
      { brand: '어뮤즈',  product: '듀 벨벳 틴트',            shade: '#05 로즈 퀀텀',         hex: '#D8A0C0', price: 15000 },
      { brand: '에뛰드',  product: '픽싱 틴트',               shade: '#PK002 소프트 핑크',    hex: '#F0C0D8', price: 9000  },
    ],
    foundation: [
      { brand: '헤라',    product: '실크 글로우 쿠션',         shade: '#21C 쿨 아이보리',      hex: '#F5E0EE', price: 58000 },
      { brand: '에스쁘아', product: 'No Wear 파운데이션 쿠션',  shade: '#12C 쿨 바닐라',        hex: '#F0D8E8', price: 32000 },
      { brand: '클리오',  product: '킬커버 파운웨어 쿠션',     shade: '#1호 라이트',           hex: '#F5E0E0', price: 28000 },
    ],
  },

  '여름 뮤트': {
    lipstick: [
      { brand: '롬앤',    product: '쥬시 래스팅 틴트',        shade: '#23 핑크 무드',         hex: '#C4A0B0', price: 10000 },
      { brand: '데이지크', product: '워터 벨벳 틴트',          shade: '#24 모브 로즈',         hex: '#B8A0B8', price: 12000 },
      { brand: '어뮤즈',  product: '듀 벨벳 틴트',            shade: '#09 모브 핑크',         hex: '#C0A0B8', price: 15000 },
      { brand: '에뛰드',  product: '픽싱 틴트',               shade: '#PK401 뮤트 모브',      hex: '#B0A0C0', price: 9000  },
    ],
    foundation: [
      { brand: '에스쁘아', product: 'No Wear 파운데이션 쿠션',  shade: '#22C 쿨 베이지',        hex: '#E8D5DF', price: 32000 },
      { brand: '클리오',  product: '킬커버 파운웨어 쿠션',     shade: '#2호 핑크 베이지',      hex: '#EDCCD8', price: 28000 },
      { brand: '맥',      product: '스튜디오 픽스 파운데이션',  shade: '#NC15 핑크 아이보리',   hex: '#ECD5D0', price: 55000 },
    ],
  },

  '가을 뮤트': {
    lipstick: [
      { brand: '롬앤',    product: '쥬시 래스팅 틴트',        shade: '#16 무화과 피그',       hex: '#C8A882', price: 10000 },
      { brand: '페리페라', product: '잉크 더 벨벳',            shade: '#14 테라코타 피그',     hex: '#A0785A', price: 9000  },
      { brand: '데이지크', product: '워터 벨벳 틴트',          shade: '#15 카멜 누드',         hex: '#C4A070', price: 12000 },
      { brand: '클리오',  product: '킬 레드 틴트',             shade: '#06 브릭 누드',         hex: '#B08060', price: 13000 },
    ],
    foundation: [
      { brand: '헤라',    product: '블랙 쿠션',               shade: '#23N 내추럴 베이지',    hex: '#E5BB99', price: 60000 },
      { brand: '에스쁘아', product: 'No Wear 파운데이션 쿠션',  shade: '#23W 웜 베이지',        hex: '#EDBB99', price: 32000 },
      { brand: '클리오',  product: '킬커버 파운웨어 쿠션',     shade: '#4호 베이지',           hex: '#E8B890', price: 28000 },
    ],
  },

  '가을 딥': {
    lipstick: [
      { brand: '롬앤',    product: '쥬시 래스팅 틴트',        shade: '#22 다크 오크',         hex: '#7B4030', price: 10000 },
      { brand: '맥',      product: '립스틱',                  shade: '#Cognac 브릭 레드',     hex: '#8B3A28', price: 38000 },
      { brand: '클리오',  product: '킬 레드 틴트',             shade: '#07 딥 브릭',           hex: '#7A3020', price: 13000 },
      { brand: '나스',    product: '오다시어스 립스틱',         shade: '#Lhassa 딥 브라운 레드', hex: '#6B2820', price: 45000 },
    ],
    foundation: [
      { brand: '헤라',    product: '블랙 쿠션',               shade: '#25W 딥 웜',            hex: '#E0B080', price: 60000 },
      { brand: '클리오',  product: '킬커버 파운웨어 쿠션',     shade: '#5호 딥 베이지',        hex: '#DAAA80', price: 28000 },
      { brand: '맥',      product: '스튜디오 픽스 파운데이션',  shade: '#NC30 웜 베이지',       hex: '#D8A878', price: 55000 },
    ],
  },

  '겨울 브라이트': {
    lipstick: [
      { brand: '롬앤',     product: '쥬시 래스팅 틴트',       shade: '#01 뱀파이어 딸기',     hex: '#CC0000', price: 10000 },
      { brand: '입생로랑',  product: '루쥬 퓨르 꾸뛰르',       shade: '#1 레 파리지엔 레드',   hex: '#CC1818', price: 55000 },
      { brand: '맥',       product: '루비 우 립스틱',          shade: '#루비 우 트루 레드',    hex: '#C80000', price: 38000 },
      { brand: '클리오',   product: '킬 레드 틴트',            shade: '#03 레드 벨벳',         hex: '#C80028', price: 13000 },
    ],
    foundation: [
      { brand: '헤라',     product: '실크 글로우 쿠션',        shade: '#17C 쿨 아이보리',      hex: '#F0E0EC', price: 58000 },
      { brand: '에스쁘아',  product: 'No Wear 파운데이션 쿠션', shade: '#11C 아이보리 쿨',      hex: '#F5E0E8', price: 32000 },
      { brand: '맥',       product: '스튜디오 픽스 파운데이션', shade: '#NW13 쿨 핑크',         hex: '#EDD5DF', price: 55000 },
    ],
  },

  '겨울 딥': {
    lipstick: [
      { brand: '롬앤',     product: '쥬시 래스팅 틴트',       shade: '#24 로즈 가든',         hex: '#800020', price: 10000 },
      { brand: '맥',       product: '립스틱',                 shade: '#더 루트비어 버건디',   hex: '#6A1020', price: 38000 },
      { brand: '입생로랑',  product: '루쥬 퓨르 꾸뛰르',       shade: '#4 루즈 반드 버건디',   hex: '#780018', price: 55000 },
      { brand: '나스',      product: '오다시어스 립스틱',       shade: '#Vera 딥 버건디',       hex: '#5A1020', price: 45000 },
    ],
    foundation: [
      { brand: '헤라',     product: '블랙 쿠션',              shade: '#25C 쿨 딥',            hex: '#D8C0CC', price: 60000 },
      { brand: '맥',       product: '스튜디오 픽스 파운데이션', shade: '#NW25 딥 쿨 베이지',    hex: '#D0B8C8', price: 55000 },
      { brand: '에스쁘아',  product: 'No Wear 파운데이션 쿠션', shade: '#24C 딥 쿨',            hex: '#CCBAD0', price: 32000 },
    ],
  },
};
