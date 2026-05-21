import type { PersonalColorType } from '@/types';

export interface CosmeticProduct {
  id: string;
  brand: string;
  product: string;
  shade: string;
  hex: string;
  price: number;
  category: 'lipstick' | 'foundation' | 'eyeshadow' | 'blusher';
  colorTypes: PersonalColorType[];
  tags: string[];
  purchaseLink?: string;
  verified: true;
}

export const cosmeticDatabase: CosmeticProduct[] = [

  // ─── 립스틱 ───────────────────────────────────────────

  { id: 'rom_juicy_04', brand: '롬앤', product: '쥬시 래스팅 틴트', shade: '#04 피지', hex: '#FF9985', price: 10000, category: 'lipstick', colorTypes: ['봄 라이트', '봄 브라이트'], tags: ['데일리', '촉촉'], verified: true },
  { id: 'rom_juicy_07', brand: '롬앤', product: '쥬시 래스팅 틴트', shade: '#07 사탕수수', hex: '#FF7060', price: 10000, category: 'lipstick', colorTypes: ['봄 브라이트'], tags: ['포인트', '선명'], verified: true },
  { id: 'peripera_ink_07', brand: '페리페라', product: '잉크 더 벨벳', shade: '#07 오렌지 드 레', hex: '#FF6B35', price: 9500, category: 'lipstick', colorTypes: ['봄 라이트', '봄 브라이트', '가을 뮤트'], tags: ['매트', '데일리'], verified: true },
  { id: 'etude_fixing_coral', brand: '에뛰드', product: '픽싱 틴트', shade: '#04 코랄 핑크', hex: '#FF8C7A', price: 9000, category: 'lipstick', colorTypes: ['봄 라이트'], tags: ['자연스러운', '데일리'], verified: true },

  { id: 'rom_better_02', brand: '롬앤', product: '베터 댄 레드 에디션', shade: '#02 로즈 핑크', hex: '#E8799A', price: 10000, category: 'lipstick', colorTypes: ['여름 라이트', '여름 뮤트'], tags: ['로맨틱', '데일리'], verified: true },
  { id: 'clio_mad_04', brand: '클리오', product: '매드 매트 립', shade: '#04 베리 핑크', hex: '#D4607A', price: 13000, category: 'lipstick', colorTypes: ['여름 뮤트', '겨울 브라이트'], tags: ['매트', '포인트'], verified: true },
  { id: 'amuse_dew_05', brand: '어뮤즈', product: '듀 틴트', shade: '#05 말린 장미', hex: '#C97A8A', price: 14000, category: 'lipstick', colorTypes: ['여름 뮤트', '여름 라이트'], tags: ['촉촉', '자연스러운'], verified: true },

  { id: 'rom_juicy_22', brand: '롬앤', product: '쥬시 래스팅 틴트', shade: '#22 시나몬 베이지', hex: '#C47B5A', price: 10000, category: 'lipstick', colorTypes: ['가을 뮤트', '가을 딥'], tags: ['데일리', '내추럴'], verified: true },
  { id: 'daisy_mousse_05', brand: '데이지크', product: '벨벳 무드 무스 틴트', shade: '#05 테라코타', hex: '#B56B4A', price: 16000, category: 'lipstick', colorTypes: ['가을 딥', '가을 뮤트'], tags: ['매트', '포인트'], verified: true },
  { id: 'peripera_ink_02', brand: '페리페라', product: '잉크 더 벨벳', shade: '#02 벽돌 빨강', hex: '#A03020', price: 9500, category: 'lipstick', colorTypes: ['가을 딥', '겨울 딥'], tags: ['포인트', '강렬'], verified: true },

  { id: 'clio_mad_08', brand: '클리오', product: '매드 매트 립', shade: '#08 트루 레드', hex: '#CC1A1A', price: 13000, category: 'lipstick', colorTypes: ['겨울 브라이트', '겨울 딥'], tags: ['선명', '강렬'], verified: true },
  { id: 'rom_zero_velvet_10', brand: '롬앤', product: '제로 벨벳 틴트', shade: '#10 베리 버건디', hex: '#7D1A35', price: 10000, category: 'lipstick', colorTypes: ['겨울 딥', '가을 딥'], tags: ['매트', '시크'], verified: true },
  { id: 'mac_ruby', brand: 'M·A·C', product: '립스틱', shade: 'Ruby Woo', hex: '#CF1020', price: 38000, category: 'lipstick', colorTypes: ['겨울 브라이트', '겨울 딥'], tags: ['클래식', '선명'], verified: true },

  // ─── 파운데이션 ────────────────────────────────────────

  { id: 'hera_cushion_21', brand: '헤라', product: '블랙 쿠션 파운데이션', shade: '21N 라이트 베이지', hex: '#F5DEB3', price: 60000, category: 'foundation', colorTypes: ['봄 라이트', '봄 브라이트', '가을 뮤트'], tags: ['옐로우베이스', '커버'], verified: true },
  { id: 'clio_cushion_23', brand: '클리오', product: '킬커버 파운웨어 쿠션', shade: '3호 린넨', hex: '#DEB887', price: 28000, category: 'foundation', colorTypes: ['봄 라이트', '가을 뮤트', '가을 딥'], tags: ['고커버', '옐로우베이스'], verified: true },
  { id: 'espoir_cushion_ivory', brand: '에스쁘아', product: '프로 테일러 비글로우 쿠션', shade: '1N1 아이보리', hex: '#FAF0E6', price: 35000, category: 'foundation', colorTypes: ['봄 라이트', '봄 브라이트'], tags: ['자연스러운', '글로우'], verified: true },
  { id: 'missha_m21', brand: '미샤', product: 'M 퍼펙트 커버 BB크림', shade: '#21 밝은 베이지', hex: '#F0D9B5', price: 12000, category: 'foundation', colorTypes: ['봄 라이트', '봄 브라이트', '가을 뮤트'], tags: ['데일리', '가성비'], verified: true },

  { id: 'hera_cushion_13', brand: '헤라', product: '블랙 쿠션 파운데이션', shade: '13C 쿨 아이보리', hex: '#F5E6D3', price: 60000, category: 'foundation', colorTypes: ['여름 라이트', '여름 뮤트', '겨울 브라이트'], tags: ['핑크베이스', '쿨톤'], verified: true },
  { id: 'lancome_21', brand: '랑콤', product: '떵드 이돌 쿠션', shade: '21C 쿨 베이지', hex: '#E8D5C0', price: 78000, category: 'foundation', colorTypes: ['여름 뮤트', '겨울 브라이트', '겨울 딥'], tags: ['핑크베이스', '고급'], verified: true },
  { id: 'clio_cushion_21c', brand: '클리오', product: '킬커버 파운웨어 쿠션', shade: '1.5호 페탈', hex: '#F5E8D8', price: 28000, category: 'foundation', colorTypes: ['여름 라이트', '겨울 브라이트'], tags: ['쿨톤', '고커버'], verified: true },

  // ─── 아이섀도우 ────────────────────────────────────────

  { id: 'rom_better_palette_01', brand: '롬앤', product: '베터 댄 팔레트', shade: '#01 코럴 앤 핑크', hex: '#FFB3A7', price: 25000, category: 'eyeshadow', colorTypes: ['봄 라이트', '봄 브라이트', '여름 라이트'], tags: ['웜', '데일리'], verified: true },
  { id: 'clio_prism_05', brand: '클리오', product: '프리즘 에어 아이 팔레트', shade: '#05 샴페인 모먼트', hex: '#F7E7CE', price: 35000, category: 'eyeshadow', colorTypes: ['봄 라이트', '봄 브라이트', '가을 뮤트'], tags: ['글로우', '데일리'], verified: true },
  { id: 'etude_play_br401', brand: '에뛰드', product: '플레이 컬러 아이즈', shade: 'BR401 초코바나나', hex: '#C4956A', price: 15000, category: 'eyeshadow', colorTypes: ['가을 뮤트', '가을 딥'], tags: ['브라운', '내추럴'], verified: true },
  { id: 'peripera_daily_03', brand: '페리페라', product: '잉크 스포트라이트 팔레트', shade: '#03 로즈워터', hex: '#E8B4B8', price: 18000, category: 'eyeshadow', colorTypes: ['여름 라이트', '여름 뮤트', '겨울 브라이트'], tags: ['핑크', '쿨톤'], verified: true },
  { id: 'amuse_eye_04', brand: '어뮤즈', product: '비건 아이 팔레트', shade: '#04 뉴트럴 모카', hex: '#8B6F6F', price: 28000, category: 'eyeshadow', colorTypes: ['가을 딥', '겨울 딥', '여름 뮤트'], tags: ['뉴트럴', '깊은'], verified: true },
  { id: 'daisy_eye_icy', brand: '데이지크', product: '글램 아이 팔레트', shade: '아이시 파우더', hex: '#C8D8E8', price: 22000, category: 'eyeshadow', colorTypes: ['겨울 브라이트', '겨울 딥', '여름 라이트'], tags: ['쿨', '시크'], verified: true },

  // ─── 블러셔 ────────────────────────────────────────────

  { id: 'rom_better_cheek_01', brand: '롬앤', product: '베터 댄 치크', shade: '#01 피치 플로팅', hex: '#FFCBA4', price: 13000, category: 'blusher', colorTypes: ['봄 라이트', '봄 브라이트'], tags: ['피치', '데일리'], verified: true },
  { id: 'etude_blusher_or201', brand: '에뛰드', product: '러블리쿠키 블러셔', shade: 'OR201 코코넛 라떼', hex: '#E8B890', price: 11000, category: 'blusher', colorTypes: ['봄 라이트', '가을 뮤트'], tags: ['코랄', '자연스러운'], verified: true },
  { id: 'clio_nudism_02', brand: '클리오', product: '누디즘 블러셔', shade: '#02 피치 블룸', hex: '#FFB5A0', price: 18000, category: 'blusher', colorTypes: ['봄 브라이트', '여름 라이트'], tags: ['생기', '데일리'], verified: true },
  { id: 'amuse_blusher_rose', brand: '어뮤즈', product: '듀 블러셔', shade: '#03 로즈 모닝', hex: '#E8A0B0', price: 16000, category: 'blusher', colorTypes: ['여름 라이트', '여름 뮤트', '겨울 브라이트'], tags: ['로즈', '쿨톤'], verified: true },
  { id: 'daisy_blusher_02', brand: '데이지크', product: '블러리 무드 블러셔', shade: '#02 테라코타 선셋', hex: '#C07850', price: 18000, category: 'blusher', colorTypes: ['가을 뮤트', '가을 딥'], tags: ['어스', '내추럴'], verified: true },
  { id: 'peripera_blusher_12', brand: '페리페라', product: '잉크 무드 드롭퍼 블러셔', shade: '#12 베리 초크', hex: '#B06080', price: 14000, category: 'blusher', colorTypes: ['겨울 딥', '겨울 브라이트', '여름 뮤트'], tags: ['베리', '시크'], verified: true },
  { id: 'rom_blusher_mauve', brand: '롬앤', product: '베터 댄 치크', shade: '#07 더스티 모브', hex: '#B08098', price: 13000, category: 'blusher', colorTypes: ['겨울 딥', '여름 뮤트'], tags: ['모브', '차분'], verified: true },
];

/** 타입 + 카테고리별 제품 반환 — DB에 없는 제품은 절대 포함하지 않음 */
export function getProductsByType(
  colorType: PersonalColorType,
  category: CosmeticProduct['category'],
  count: number = 3,
): CosmeticProduct[] {
  return cosmeticDatabase
    .filter(p => p.category === category && p.colorTypes.includes(colorType))
    .slice(0, count);
}

/** 개발 환경에서 타입별·카테고리별 최소 2개 제품 확보 여부 검증 */
export function validateProductCoverage(): void {
  const types: PersonalColorType[] = [
    '봄 라이트', '봄 브라이트',
    '여름 라이트', '여름 뮤트',
    '가을 뮤트', '가을 딥',
    '겨울 브라이트', '겨울 딥',
  ];
  const categories = ['lipstick', 'foundation', 'eyeshadow', 'blusher'] as const;

  types.forEach(type => {
    categories.forEach(cat => {
      const count = cosmeticDatabase.filter(
        p => p.category === cat && p.colorTypes.includes(type),
      ).length;
      if (count < 2) {
        console.warn(`⚠️ 제품 부족: ${type} - ${cat} (${count}개, 최소 2개 필요)`);
      }
    });
  });
  console.log('✅ 제품 DB 검증 완료');
}
