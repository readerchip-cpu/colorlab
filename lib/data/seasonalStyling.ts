import type { PersonalColorType } from '@/types';

export interface MustHaveItem {
  icon: string;
  label: string;
}

export interface SeasonColorChip {
  name: string;
  hex: string;
}

export interface SeasonalLook {
  title: string;
  description: string;
  mustHaves: MustHaveItem[];
  colors: SeasonColorChip[];
}

export interface SeasonalStyling {
  spring: SeasonalLook;
  summer: SeasonalLook;
  autumn: SeasonalLook;
  winter: SeasonalLook;
}

export const seasonalStylingDatabase: Record<PersonalColorType, SeasonalStyling> = {
  '봄 라이트': {
    spring: {
      title: '산뜻한 봄 데이트 룩',
      description: '피치 톤 쉬폰 블라우스에 아이보리 슬랙스를 매치하세요. 골드 액세서리로 따뜻한 분위기를 더하면 봄 라이트 타입의 맑은 화사함이 극대화됩니다.',
      mustHaves: [
        { icon: '👜', label: '베이지 토트백' },
        { icon: '👟', label: '화이트 스니커즈' },
        { icon: '💄', label: '코랄 립' },
      ],
      colors: [
        { name: '피치', hex: '#FFDAB9' },
        { name: '아이보리', hex: '#FFFFF0' },
        { name: '라이트 카멜', hex: '#C8A882' },
      ],
    },
    summer: {
      title: '청량한 휴양지 룩',
      description: '민트 톤 린넨 셔츠와 화이트 와이드 쇼츠로 시원함을 표현하세요. 살몬 컬러 샌들이 포인트가 되어 전체적인 봄 라이트 감성을 살려줍니다.',
      mustHaves: [
        { icon: '🕶', label: '골드 선글라스' },
        { icon: '👜', label: '라탄 백' },
        { icon: '💄', label: '살몬 립' },
      ],
      colors: [
        { name: '민트', hex: '#98D8C8' },
        { name: '화이트', hex: '#FFF8F0' },
        { name: '살몬', hex: '#FF8C69' },
      ],
    },
    autumn: {
      title: '내추럴 데일리 룩',
      description: '카멜 가디건에 크림 팬츠를 매치하고 베이지 로퍼로 마무리하세요. 지적이면서도 부드러운 인상을 주는 따뜻한 어스 톤 가을 스타일입니다.',
      mustHaves: [
        { icon: '🎩', label: '베이지 베레모' },
        { icon: '👜', label: '브라운 가죽백' },
        { icon: '💄', label: '카멜 누드 립' },
      ],
      colors: [
        { name: '카멜', hex: '#C8A882' },
        { name: '크림', hex: '#FDEBD0' },
        { name: '베이지', hex: '#D4A574' },
      ],
    },
    winter: {
      title: '세련된 모던 룩',
      description: '아이보리 터틀넥 위에 라이트 그레이 코트를 레이어드하세요. 골드 이어링으로 차가운 분위기를 따뜻하게 보완해 봄 라이트 특유의 우아함을 더합니다.',
      mustHaves: [
        { icon: '🧣', label: '캐멀 머플러' },
        { icon: '🥾', label: '브라운 부츠' },
        { icon: '✨', label: '골드 이어링' },
      ],
      colors: [
        { name: '아이보리', hex: '#FFFFF0' },
        { name: '라이트 그레이', hex: '#D3D3D3' },
        { name: '골드', hex: '#C89010' },
      ],
    },
  },

  '봄 브라이트': {
    spring: {
      title: '생기 있는 피크닉 룩',
      description: '코랄 탑과 화이트 데님의 상큼한 조합으로 봄 에너지를 표현하세요. 골드 스니커즈와 오렌지 스카프로 봄 브라이트 타입의 활기찬 매력이 빛납니다.',
      mustHaves: [
        { icon: '🌺', label: '오렌지 스카프' },
        { icon: '👟', label: '골드 스니커즈' },
        { icon: '💄', label: '코랄 레드 립' },
      ],
      colors: [
        { name: '코랄', hex: '#FF6F61' },
        { name: '화이트', hex: '#FFFFFF' },
        { name: '골드', hex: '#FFD700' },
      ],
    },
    summer: {
      title: '비비드 비치 룩',
      description: '옐로우 원피스에 터키즈 액세서리로 선명한 여름 대비를 연출하세요. 봄 브라이트 타입은 여름에도 채도 높은 컬러를 자신 있게 소화할 수 있습니다.',
      mustHaves: [
        { icon: '🕶', label: '컬러 선글라스' },
        { icon: '👜', label: '옐로우 버킷백' },
        { icon: '💄', label: '오렌지 립' },
      ],
      colors: [
        { name: '옐로우', hex: '#FFD700' },
        { name: '터키즈', hex: '#40E0D0' },
        { name: '화이트', hex: '#FFFFFF' },
      ],
    },
    autumn: {
      title: '컬러풀 어텀 캐주얼',
      description: '머스타드 재킷 아래 오렌지 이너와 카멜 팬츠로 가을다운 웜톤 레이어링을. 채도 있는 컬러 조합이 봄 브라이트의 활기를 가을에도 유지시켜 줍니다.',
      mustHaves: [
        { icon: '🎩', label: '머스타드 베레모' },
        { icon: '👜', label: '캐멀 토트백' },
        { icon: '💄', label: '오렌지 브라운 립' },
      ],
      colors: [
        { name: '머스타드', hex: '#FFD700' },
        { name: '오렌지', hex: '#FFA500' },
        { name: '카멜', hex: '#C8A882' },
      ],
    },
    winter: {
      title: '레드 포인트 홀리데이 룩',
      description: '레드 코트와 아이보리 터틀넥의 선명한 대비로 시즌 파티를 완성하세요. 골드 벨트가 봄 브라이트 타입의 화려한 에너지를 겨울에도 발휘하게 해줍니다.',
      mustHaves: [
        { icon: '👑', label: '골드 헤어밴드' },
        { icon: '👜', label: '블랙 클러치백' },
        { icon: '💄', label: '레드 립' },
      ],
      colors: [
        { name: '레드', hex: '#FF6F61' },
        { name: '아이보리', hex: '#FFF0DC' },
        { name: '골드', hex: '#FFD700' },
      ],
    },
  },

  '여름 라이트': {
    spring: {
      title: '로맨틱 가든 룩',
      description: '라벤더 블라우스와 화이트 스커트로 봄 가든 파티 분위기를 연출하세요. 실버 플랫 슈즈가 쿨한 우아함을 더하며 여름 라이트 타입의 부드러운 인상을 완성합니다.',
      mustHaves: [
        { icon: '🌸', label: '플로럴 헤어핀' },
        { icon: '👛', label: '화이트 미니백' },
        { icon: '💄', label: '로즈 모브 립' },
      ],
      colors: [
        { name: '라벤더', hex: '#C9B1D3' },
        { name: '화이트', hex: '#FFFFFF' },
        { name: '실버', hex: '#C0C0C0' },
      ],
    },
    summer: {
      title: '파스텔 비치 룩',
      description: '소프트 블루 린넨 상의에 파우더 핑크 액세서리로 부드러운 컬러 대비를 만드세요. 시원하고 여성스러운 여름 라이트 감성이 해변에서 빛을 발합니다.',
      mustHaves: [
        { icon: '🕶', label: '실버 선글라스' },
        { icon: '👜', label: '파우더 핑크 토트' },
        { icon: '💄', label: '소프트 핑크 립' },
      ],
      colors: [
        { name: '소프트 블루', hex: '#B0C4DE' },
        { name: '파우더 핑크', hex: '#F0E6EF' },
        { name: '화이트', hex: '#FFF5EE' },
      ],
    },
    autumn: {
      title: '소프트 레이어링 룩',
      description: '로즈 그레이 니트에 딥 버건디 팬츠로 쿨한 가을 레이어링을 시도하세요. 따뜻함과 우아함이 공존하는 여름 라이트 타입의 가을 스타일입니다.',
      mustHaves: [
        { icon: '🧣', label: '라이트 그레이 스카프' },
        { icon: '👜', label: '버건디 숄더백' },
        { icon: '💄', label: '모브 립' },
      ],
      colors: [
        { name: '로즈 그레이', hex: '#C4A0A0' },
        { name: '버건디', hex: '#800020' },
        { name: '라이트 그레이', hex: '#E8E8E8' },
      ],
    },
    winter: {
      title: '실버 무드 겨울 룩',
      description: '실버 화이트 코트와 라이트 블루 터틀넥의 쿨한 겨울 조합을 연출하세요. 라벤더 스카프 포인트가 차가운 겨울 감성을 우아하게 마무리합니다.',
      mustHaves: [
        { icon: '🧣', label: '라벤더 머플러' },
        { icon: '🥾', label: '실버 앵클부츠' },
        { icon: '💄', label: '로즈 핑크 립' },
      ],
      colors: [
        { name: '실버 화이트', hex: '#E8E8E8' },
        { name: '라이트 블루', hex: '#B0C4DE' },
        { name: '라벤더', hex: '#C9B1D3' },
      ],
    },
  },

  '여름 뮤트': {
    spring: {
      title: '소피스티케이티드 오피스 룩',
      description: '뮤트 라벤더 블라우스와 그레이 슬랙스의 세련된 봄 오피스 룩. 모노톤 컬러 레이어링이 여름 뮤트 타입의 도시적인 우아함을 봄에도 드러냅니다.',
      mustHaves: [
        { icon: '👜', label: '그레이 스트럭처백' },
        { icon: '👠', label: '라이트 그레이 펌프스' },
        { icon: '💄', label: '모브 립' },
      ],
      colors: [
        { name: '뮤트 라벤더', hex: '#B8A8C8' },
        { name: '그레이', hex: '#A0B4C8' },
        { name: '소프트 화이트', hex: '#F0E8F0' },
      ],
    },
    summer: {
      title: '미니멀 리조트 룩',
      description: '그레이 블루 린넨 셔츠와 로즈 스커트로 뮤트한 여름 감성을 표현하세요. 과하지 않은 컬러 조합이 여름에도 여름 뮤트 타입의 세련미를 유지합니다.',
      mustHaves: [
        { icon: '🕶', label: '실버 선글라스' },
        { icon: '👜', label: '뮤트 그린 라탄백' },
        { icon: '💄', label: '로즈 뮤트 립' },
      ],
      colors: [
        { name: '그레이 블루', hex: '#A0B4C8' },
        { name: '뮤트 로즈', hex: '#C4A0A0' },
        { name: '소프트 아이보리', hex: '#E8E8E8' },
      ],
    },
    autumn: {
      title: '무드 레이어링 룩',
      description: '차콜 니트에 로즈 그레이 팬츠, 버건디 스카프로 깊이 있는 가을 레이어링을. 뮤트한 톤의 레이어가 여름 뮤트 타입만의 세련미를 한층 높입니다.',
      mustHaves: [
        { icon: '🧣', label: '버건디 캐시미어 스카프' },
        { icon: '👜', label: '다크 브라운 백' },
        { icon: '💄', label: '뮤트 베리 립' },
      ],
      colors: [
        { name: '차콜', hex: '#9EB8B8' },
        { name: '로즈 그레이', hex: '#C8B8B8' },
        { name: '버건디', hex: '#800020' },
      ],
    },
    winter: {
      title: '딥 시크 모던 룩',
      description: '딥 네이비 코트와 뮤트 핑크 이너의 대비가 만드는 시크한 겨울 룩. 실버 액세서리로 완성도를 높이고 여름 뮤트 타입의 감각을 완성하세요.',
      mustHaves: [
        { icon: '💍', label: '실버 링 레이어링' },
        { icon: '👜', label: '네이비 구조적 백' },
        { icon: '💄', label: '버건디 립' },
      ],
      colors: [
        { name: '딥 네이비', hex: '#2C3E50' },
        { name: '뮤트 핑크', hex: '#D8CCC8' },
        { name: '실버', hex: '#C0C0C0' },
      ],
    },
  },

  '가을 뮤트': {
    spring: {
      title: '어스 톤 봄 내추럴 룩',
      description: '베이지 재킷에 화이트 이너와 카멜 팬츠의 자연스러운 어스 톤 조합. 가을 뮤트 타입이 봄에도 자연스러운 따뜻함으로 돋보이는 스타일입니다.',
      mustHaves: [
        { icon: '🌿', label: '베이지 슬링백슈즈' },
        { icon: '👜', label: '카멜 토트백' },
        { icon: '💄', label: '누드 베이지 립' },
      ],
      colors: [
        { name: '베이지', hex: '#D4A574' },
        { name: '화이트', hex: '#FDEBD0' },
        { name: '카멜', hex: '#C8A882' },
      ],
    },
    summer: {
      title: '내추럴 에코 여름 룩',
      description: '올리브 린넨 셔츠와 카키 쇼츠의 자연 친화적 조합. 가을 뮤트 타입의 어스 컬러 감성이 여름에도 세련되게 표현되는 내추럴 룩입니다.',
      mustHaves: [
        { icon: '🕶', label: '베이지 선글라스' },
        { icon: '👜', label: '올리브 캔버스백' },
        { icon: '💄', label: '테라코타 립' },
      ],
      colors: [
        { name: '올리브', hex: '#8B6914' },
        { name: '카키', hex: '#9A7B5A' },
        { name: '샌드 베이지', hex: '#D4A574' },
      ],
    },
    autumn: {
      title: '시그니처 어텀 룩',
      description: '테라코타 니트에 머스타드 스커트, 브라운 부츠의 완벽한 가을 조합. 가을 뮤트 타입이 가장 빛나는 시즌, 어스 톤 레이어링으로 성숙미를 살리세요.',
      mustHaves: [
        { icon: '🎩', label: '카키 베레모' },
        { icon: '👜', label: '브라운 버킷백' },
        { icon: '💄', label: '테라코타 립' },
      ],
      colors: [
        { name: '테라코타', hex: '#A0785A' },
        { name: '머스타드', hex: '#C4A87A' },
        { name: '브라운', hex: '#8B7355' },
      ],
    },
    winter: {
      title: '울 코트 클래식 룩',
      description: '카멜 울 코트에 버건디 터틀넥과 다크 브라운 팬츠의 성숙한 겨울 룩. 어스 톤 레이어링이 따뜻하면서도 세련된 가을 뮤트 겨울 스타일을 완성합니다.',
      mustHaves: [
        { icon: '🧣', label: '버건디 스카프' },
        { icon: '🥾', label: '다크 브라운 부츠' },
        { icon: '💄', label: '테라코타 립' },
      ],
      colors: [
        { name: '카멜', hex: '#C8A882' },
        { name: '버건디', hex: '#800020' },
        { name: '다크 브라운', hex: '#4A3728' },
      ],
    },
  },

  '가을 딥': {
    spring: {
      title: '다크 시크 봄 룩',
      description: '버건디 재킷과 카멜 이너, 다크 브라운 팬츠의 깊이 있는 봄 스타일. 가을 딥 타입은 봄에도 강한 인상을 남기는 딥 컬러로 카리스마를 표현하세요.',
      mustHaves: [
        { icon: '💍', label: '골드 주얼리' },
        { icon: '👜', label: '다크 브라운 레더백' },
        { icon: '💄', label: '브릭 레드 립' },
      ],
      colors: [
        { name: '버건디', hex: '#800020' },
        { name: '카멜', hex: '#C8A882' },
        { name: '다크 브라운', hex: '#4A3728' },
      ],
    },
    summer: {
      title: '어스 포스 여름 룩',
      description: '다크 올리브 셔츠와 카키 팬츠의 강인한 여름 스타일. 화려하지 않아도 존재감이 넘치는 가을 딥 타입의 여름 자연주의 룩입니다.',
      mustHaves: [
        { icon: '🕶', label: '다크 프레임 선글라스' },
        { icon: '👜', label: '브라운 레더 토트' },
        { icon: '💄', label: '테라코타 립' },
      ],
      colors: [
        { name: '다크 올리브', hex: '#556B2F' },
        { name: '카키', hex: '#6B3A2A' },
        { name: '다크 브라운', hex: '#4A3728' },
      ],
    },
    autumn: {
      title: '리치 카리스마 어텀 룩',
      description: '딥 브라운 코트와 에스프레소 터틀넥, 가죽 부츠의 절정 가을 룩. 가을 딥 타입이 가장 빛나는 시즌, 깊이 있는 컬러 레이어링으로 완성도를 높이세요.',
      mustHaves: [
        { icon: '⌚', label: '골드 메탈 워치' },
        { icon: '🥾', label: '가죽 첼시 부츠' },
        { icon: '💄', label: '딥 브릭 립' },
      ],
      colors: [
        { name: '에스프레소', hex: '#3C1810' },
        { name: '다크 브라운', hex: '#4A3728' },
        { name: '딥 올리브', hex: '#556B2F' },
      ],
    },
    winter: {
      title: '다크 럭셔리 겨울 룩',
      description: '다크 버건디 울 코트와 블랙 이너, 골드 액세서리의 럭셔리한 겨울 룩. 어두운 컬러와 골드의 대비가 가을 딥 타입의 카리스마를 완성합니다.',
      mustHaves: [
        { icon: '💍', label: '골드 레이어드 목걸이' },
        { icon: '👜', label: '블랙 레더 클러치' },
        { icon: '💄', label: '버건디 립' },
      ],
      colors: [
        { name: '버건디', hex: '#800020' },
        { name: '블랙', hex: '#1A1A1A' },
        { name: '딥 골드', hex: '#8B6914' },
      ],
    },
  },

  '겨울 브라이트': {
    spring: {
      title: '하이 컨트라스트 봄 룩',
      description: '화이트 블라우스와 네이비 팬츠, 레드 포인트 백의 강렬한 봄 스타일. 겨울 브라이트 타입은 봄에도 선명한 컬러 대비로 강한 인상을 유지하세요.',
      mustHaves: [
        { icon: '👜', label: '레드 포인트 백' },
        { icon: '👟', label: '화이트 스니커즈' },
        { icon: '💄', label: '레드 립' },
      ],
      colors: [
        { name: '화이트', hex: '#FFFFFF' },
        { name: '네이비', hex: '#001F5B' },
        { name: '레드', hex: '#CC0000' },
      ],
    },
    summer: {
      title: '클래식 마린 룩',
      description: '블루 화이트 스트라이프와 화이트 쇼츠의 클래식 마린 룩. 겨울 브라이트 타입의 선명한 컬러 감각이 마린 룩에서 완벽하게 발휘됩니다.',
      mustHaves: [
        { icon: '🕶', label: '블랙 선글라스' },
        { icon: '👜', label: '화이트 크로스백' },
        { icon: '💄', label: '코랄 레드 립' },
      ],
      colors: [
        { name: '로얄 블루', hex: '#0000CD' },
        { name: '화이트', hex: '#FFFFFF' },
        { name: '레드', hex: '#CC0000' },
      ],
    },
    autumn: {
      title: '블랙 & 레드 파워 룩',
      description: '블랙 코트와 레드 이너, 실버 액세서리의 파워풀한 가을 룩. 겨울 브라이트 타입의 강한 대비 감각이 가을에도 가장 돋보이는 컬러 조합입니다.',
      mustHaves: [
        { icon: '💍', label: '실버 이어링' },
        { icon: '👜', label: '블랙 레더백' },
        { icon: '💄', label: '트루 레드 립' },
      ],
      colors: [
        { name: '블랙', hex: '#111111' },
        { name: '레드', hex: '#CC0000' },
        { name: '실버', hex: '#C0C0C0' },
      ],
    },
    winter: {
      title: '아이코닉 모노 겨울 룩',
      description: '퓨어 화이트 코트와 블랙 터틀넥, 바이올렛 스카프의 극적인 겨울 룩. 가장 강한 컬러 대비로 겨울 브라이트 타입의 카리스마를 극대화하세요.',
      mustHaves: [
        { icon: '🧣', label: '바이올렛 머플러' },
        { icon: '👜', label: '블랙 스트럭처백' },
        { icon: '💄', label: '베리 퍼플 립' },
      ],
      colors: [
        { name: '퓨어 화이트', hex: '#FFFFFF' },
        { name: '트루 블랙', hex: '#111111' },
        { name: '바이올렛', hex: '#9400D3' },
      ],
    },
  },

  '겨울 딥': {
    spring: {
      title: '다크 엘레강스 봄 룩',
      description: '네이비 블레이저와 화이트 이너, 블랙 팬츠의 클래식한 봄 스타일. 겨울 딥 타입은 봄에도 어두운 기저 컬러로 고급스러운 존재감을 드러냅니다.',
      mustHaves: [
        { icon: '💍', label: '실버 핀 배지' },
        { icon: '👜', label: '블랙 레더백' },
        { icon: '💄', label: '딥 로즈 립' },
      ],
      colors: [
        { name: '다크 네이비', hex: '#003366' },
        { name: '화이트', hex: '#FFFFFF' },
        { name: '블랙', hex: '#1A1A1A' },
      ],
    },
    summer: {
      title: '딥 컬러 시크 리조트 룩',
      description: '딥 버건디 셔츠와 블랙 팬츠의 강렬한 여름 시크 룩. 밝은 색 대신 깊이 있는 톤으로 겨울 딥 타입의 존재감을 여름에도 유지합니다.',
      mustHaves: [
        { icon: '🕶', label: '블랙 선글라스' },
        { icon: '👜', label: '다크 레더 토트' },
        { icon: '💄', label: '버건디 립' },
      ],
      colors: [
        { name: '버건디', hex: '#800020' },
        { name: '블랙', hex: '#1A1A1A' },
        { name: '딥 틸', hex: '#006060' },
      ],
    },
    autumn: {
      title: '미드나이트 어텀 룩',
      description: '블랙 코트와 버건디 터틀넥, 다크 네이비 팬츠의 깊이 있는 레이어링. 겨울 딥 타입의 어두운 컬러 감성이 가을과 완벽하게 어우러집니다.',
      mustHaves: [
        { icon: '🥾', label: '블랙 레더 부츠' },
        { icon: '👜', label: '딥 버건디 백' },
        { icon: '💄', label: '플럼 립' },
      ],
      colors: [
        { name: '블랙', hex: '#1A1A1A' },
        { name: '버건디', hex: '#800020' },
        { name: '다크 네이비', hex: '#003366' },
      ],
    },
    winter: {
      title: '다크 럭셔리 피크 룩',
      description: '미드나이트 네이비 코트와 블랙 이너, 실버 액세서리로 겨울 딥의 절정을 보여주세요. 어두운 톤 속에서 실버 빛이 더욱 빛나는 겨울 룩입니다.',
      mustHaves: [
        { icon: '💍', label: '실버 레이어드 주얼리' },
        { icon: '🥾', label: '블랙 첼시 부츠' },
        { icon: '💄', label: '딥 버건디 립' },
      ],
      colors: [
        { name: '미드나이트 네이비', hex: '#2C3E50' },
        { name: '블랙', hex: '#1A1A1A' },
        { name: '딥 틸', hex: '#006060' },
      ],
    },
  },
};
