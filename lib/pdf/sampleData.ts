import type { ReportData } from '@/types/report';

const SAMPLE_REPORT_DATA: ReportData = {
  meta: {
    typeName: 'Spring Light',
    typeNameKr: '봄 라이트',
    toneStrength: 'Soft Light tendency, Yellow Base 경향',
    accentColor: '#F4A460',
    customerName: '김지은',
    analysisDate: '2026-05-14',
  },
  personalIntro: {
    greeting: '지은님, 안녕하세요. 컬러랩에서 분석한 지은님만의 컬러 가이드를 보내드려요.',
    colorTypeDescription: {
      summary: '봄 라이트 — 따뜻하고 부드러운 옐로우 베이스의 라이트 톤',
      characteristics: [
        '옐로우 베이스의 따뜻한 색감 (Warm Hue)',
        '밝고 환한 높은 명도 (High Value)',
        '부드러운 채도의 깨끗한 색조 (Soft Chroma · Clear)',
      ],
      bestFor: '맑고 화사한 인상과 부드러운 매력을 자연스럽게 살려줍니다.',
    },
    photoImpression: '지은님의 피부톤은 따뜻한 옐로우 베이스로, 부드러운 밝기가 인상적입니다. 자연스러운 햇살 같은 분위기를 가진 분이시네요.',
    keyFinding: '지은님은 명확한 봄 라이트 톤이지만, 컨트라스트가 낮은 소프트한 경향이 함께 있어 한층 부드러운 인상을 줍니다.',
  },
  analysis: {
    quadrant: { warmCool: 65, lightDeep: 30 },
    fourAttributes: {
      hue: 'Warm Yellow-Red',
      value: 'Light',
      chroma: 'Soft Muted',
      clarity: 'Clear',
    },
    base: 'Yellow Base',
    contrast: 'Low Contrast',
    keyInsight: '지은님은 옐로우 베이스의 따뜻하고 부드러운 톤을 가지고 계세요. 명도가 높고 채도가 부드러우며 청탁이 맑은 편이라 봄의 화사함과 여름의 부드러움이 함께 어우러진 매력을 가지셨어요.',
  },
  palette: {
    best: [
      { hex: '#FFB347', name: '피치 오렌지' },
      { hex: '#F4A7B9', name: '코랄 핑크' },
      { hex: '#FFDAB9', name: '피치 베이지' },
      { hex: '#FFD700', name: '골드 옐로우' },
      { hex: '#FF8C69', name: '살몬' },
      { hex: '#98FB98', name: '라이트 그린' },
      { hex: '#87CEEB', name: '스카이 블루' },
      { hex: '#F5DEB3', name: '위트 베이지' },
    ],
    worst: [
      { hex: '#2F4F4F', name: '다크 그린', reason: '피부를 칙칙하게' },
      { hex: '#191970', name: '네이비 블랙', reason: '노란빛 강조' },
      { hex: '#800000', name: '다크 버건디', reason: '얼굴색 가라앉음' },
      { hex: '#808080', name: '차콜 그레이', reason: '생기를 없앰' },
    ],
    stylingNotes: [
      '파스텔 계열로 전체 코디를 구성하고 코랄 포인트를 더하면 봄 라이트 타입의 화사함이 극대화됩니다.',
    ],
  },
  makeup: {
    lipstick: [],
    foundation: [],
    eyeshadow: [],
    blusher: [],
    tips: [
      '지은님께는 옐로우 베이스 파운데이션(N10~N20)이 자연스럽게 어울립니다.',
      '코랄·피치 계열 립 컬러가 피부를 환하고 생기 있게 살려줍니다.',
      '아이섀도우는 로즈 쿼츠, 샌드 베이지 등 소프트하고 맑은 컬러를 선택하세요.',
      '블러셔는 피치·살몬 계열로 자연스럽고 화사한 혈색을 연출하세요.',
      '과하지 않은 내추럴 글로우 피니시로 마무리하면 봄 라이트 특유의 맑은 매력이 완성됩니다.',
    ],
  },
  hair: {
    recommended: [
      { name: '골든 브라운', description: '따뜻한 황금빛 브라운으로 얼굴을 환하게' },
      { name: '라이트 카라멜', description: '부드러운 카라멜 컬러로 생기 있는 분위기' },
      { name: '애쉬 브라운', description: '약간의 쿨함을 더한 내추럴 브라운' },
    ],
    avoid: [
      { name: '블루 블랙', reason: '차가운 느낌이 강해 피부 톤과 부조화' },
      { name: '애쉬 그레이', reason: '너무 쿨한 톤으로 얼굴이 떠 보임' },
    ],
  },
  fashion: {
    main: ['아이보리', '피치', '살몬'],
    sub: ['민트', '라이트 블루', '코랄'],
    accent: ['골드', '옐로우 그린'],
    tips: [
      '파스텔 계열을 베이스로 코랄 포인트를 더하면 봄 라이트 특유의 화사함이 살아납니다.',
      '골드 액세서리가 실버보다 자연스럽게 피부 톤과 어우러집니다.',
      '전체적으로 밝고 맑은 파스텔 조합이 가장 잘 어울립니다.',
    ],
  },
  seasonalStyling: {
    spring: {
      title: '산뜻한 피크닉 룩',
      description: '피치 블라우스에 아이보리 슬랙스를 매치하고 골드 액세서리로 마무리하세요. 코랄 립 컬러로 생기를 더하면 완벽한 봄 룩이 완성됩니다.',
      mustHaves: [
        { icon: '👗', label: '피치 블라우스' },
        { icon: '👖', label: '아이보리 슬랙스' },
        { icon: '✨', label: '골드 액세서리' },
      ],
      colors: [
        { name: '피치', hex: '#FFDAB9' },
        { name: '아이보리', hex: '#FFFFF0' },
        { name: '골드', hex: '#FFD700' },
      ],
    },
    summer: {
      title: '시원한 리조트 룩',
      description: '민트 린넨 셔츠에 화이트 쇼츠를 매치하고 살몬 샌들로 포인트를 주세요. 가벼운 소재와 밝은 색상으로 시원하고 화사한 여름 분위기를 연출하세요.',
      mustHaves: [
        { icon: '👕', label: '민트 린넨 셔츠' },
        { icon: '🩳', label: '화이트 쇼츠' },
        { icon: '👡', label: '살몬 샌들' },
      ],
      colors: [
        { name: '민트', hex: '#98FF98' },
        { name: '화이트', hex: '#FFFFFF' },
        { name: '살몬', hex: '#FA8072' },
      ],
    },
    fall: {
      title: '따뜻한 가을 캐주얼',
      description: '카멜 가디건에 크림 팬츠를 매치하고 베이지 로퍼로 마무리하세요. 가을의 따뜻한 색감을 살리되 봄 라이트 특유의 밝은 분위기를 유지하는 것이 포인트입니다.',
      mustHaves: [
        { icon: '🧥', label: '카멜 가디건' },
        { icon: '👖', label: '크림 팬츠' },
        { icon: '👞', label: '베이지 로퍼' },
      ],
      colors: [
        { name: '카멜', hex: '#C19A6B' },
        { name: '크림', hex: '#FFFDD0' },
        { name: '베이지', hex: '#F5F5DC' },
      ],
    },
    winter: {
      title: '우아한 겨울 오피스 룩',
      description: '아이보리 터틀넥에 라이트 그레이 코트를 매치하고 골드 이어링으로 포인트를 주세요. 밝고 따뜻한 베이스 위에 골드 액세서리를 더하면 봄 라이트의 우아함이 빛납니다.',
      mustHaves: [
        { icon: '🧣', label: '아이보리 터틀넥' },
        { icon: '🧥', label: '라이트 그레이 코트' },
        { icon: '💎', label: '골드 이어링' },
      ],
      colors: [
        { name: '아이보리', hex: '#FFFFF0' },
        { name: '라이트 그레이', hex: '#D3D3D3' },
        { name: '골드', hex: '#FFD700' },
      ],
    },
  },
  celebrities: [
    {
      name: '아이유',
      profession: '가수·배우',
      similarity: '지은님과 같은 봄 라이트 톤. 옐로우 베이스의 따뜻한 명도가 공통점입니다.',
      iconicLook: '코랄 톤 메이크업과 라이트 브라운 헤어, 파스텔 의상',
      signatureColors: ['#FFB347', '#F4A7B9', '#FFDAB9'],
    },
    {
      name: '박보영',
      profession: '배우',
      similarity: '맑고 환한 봄 라이트 분위기. 자연스러운 부드러움이 비슷합니다.',
      iconicLook: '내추럴 메이크업과 따뜻한 베이지 컬러 의상',
      signatureColors: ['#FFDAB9', '#F5DEB3', '#FFB347'],
    },
  ],
  customAdvice: undefined,
};

export const SAMPLE_PDF_DATA = {
  reportData: SAMPLE_REPORT_DATA,
  sessionId: 'preview-sample-001',
  customerName: '김지은',
  createdAt: '2026-05-14',
};
