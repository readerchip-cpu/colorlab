import type { ReportPDFProps } from '@/components/pdf/ReportPDF';

export interface PageValidationResult {
  pageNumber: number;
  pageName: string;
  estimatedFillRatio: number;
  warnings: string[];
}

const A4_PT = 700;

export function validatePDFStructure(props: ReportPDFProps): PageValidationResult[] {
  return [
    validateCover(props),
    validateAnalysis(props),
    validatePalette(props),
    validateMakeup(props),
    validateHairFashionSeasonal(props),
    validateCelebrity(props),
  ];
}

function validateCover(props: ReportPDFProps): PageValidationResult {
  const warnings: string[] = [];
  const { data } = props;
  // 로고(40) + marginBottom(32) + 이름+타입EN+타입KO+displayName(120) + 컬러칩(90)
  let height = 282;

  if (!data?.meta?.customerName) {
    warnings.push('customerName 이 없습니다. 표지에 "고객님의"로 표시됩니다.');
  }

  if (data?.personalIntro?.greeting) {
    height += 65; // 인사말 1~2줄
  } else {
    warnings.push('personalIntro.greeting 이 없습니다. 인사말이 표시되지 않습니다.');
  }

  if (data?.personalIntro?.colorTypeDescription) {
    height += 265; // PERSONAL MESSAGE 박스 (summary + 3 char + bestFor + padding)
  } else {
    warnings.push('personalIntro.colorTypeDescription 이 없습니다. 타입 설명이 표시되지 않습니다.');
  }

  height += 35; // MADE BY COLORLAB 하단

  return {
    pageNumber: 1,
    pageName: '표지',
    estimatedFillRatio: Math.min(height / A4_PT, 1),
    warnings,
  };
}

function validateAnalysis(props: ReportPDFProps): PageValidationResult {
  const { data } = props;
  // Reference 박스 제거됨, 차트 196→160으로 압축
  let height = 55  // 페이지 헤더
    + 195          // 첫인상 + 4분면 차트(160)
    + 14           // 구분선
    + 35           // 정밀분석 섹션 제목
    + 105          // 4속성 통합 카드
    + 105;         // BASE+CONTRAST 통합 카드

  if (data?.analysis?.keyInsight) {
    height += 75;
  }

  return {
    pageNumber: 2,
    pageName: '첫인상 + 정밀 분석',
    estimatedFillRatio: Math.min(height / A4_PT, 1),
    warnings: [],
  };
}

function validatePalette(_props: ReportPDFProps): PageValidationResult {
  // palette.best(8) + palette.worst(4) + combinations + stylingNotes 항상 존재
  const height = 40   // 헤더
    + 260             // Best 4×2 그리드
    + 15              // 구분선
    + 110             // Worst 컬러 박스
    + 15              // 구분선
    + 140             // 조합 가이드 3카드
    + 120;            // 스타일링 노트

  return {
    pageNumber: 3,
    pageName: '컬러 팔레트',
    estimatedFillRatio: Math.min(height / A4_PT, 1),
    warnings: [],
  };
}

function validateMakeup(_props: ReportPDFProps): PageValidationResult {
  // makeup.lipstick/foundation/eyeshadow/blusher + tips 항상 존재
  const height = 40   // 헤더
    + 200             // 립스틱 3개
    + 15              // 구분선
    + 160             // 파운데이션 + 아이섀도우
    + 15              // 구분선
    + 150             // 블러셔 + 팁
    + 55              // 구매처
    + 25;             // 면책 문구

  return {
    pageNumber: 4,
    pageName: '메이크업 추천',
    estimatedFillRatio: Math.min(height / A4_PT, 1),
    warnings: [],
  };
}

function validateHairFashionSeasonal(_props: ReportPDFProps): PageValidationResult {
  // 2×2 텍스트 전용 시즌 카드로 압축
  const height = 35   // 헤더
    + 110             // 헤어 3카드 + avoid
    + 14              // 구분선
    + 115             // 패션 컬러 3카드 + 팁
    + 14              // 구분선
    + 35              // 시즌 섹션 제목
    + 160;            // 2×2 텍스트 카드 (2행 × 75pt)

  return {
    pageNumber: 5,
    pageName: '헤어 + 패션 + 시즌 스타일링',
    estimatedFillRatio: Math.min(height / A4_PT, 1),
    warnings: [],
  };
}

function validateCelebrity(props: ReportPDFProps): PageValidationResult {
  const warnings: string[] = [];
  const { data } = props;
  const celebCount = data?.celebrities?.length ?? 0;
  let height = 40 + celebCount * 110;

  if (celebCount === 0) {
    warnings.push('celebrities 배열이 비어 있습니다. 셀러브리티 섹션이 표시되지 않습니다.');
    height += 60;
  } else if (celebCount < 3) {
    warnings.push(`셀러브리티가 ${celebCount}명으로 적습니다. 페이지 하단에 빈 공간이 생길 수 있습니다.`);
  }

  if (data?.customAdvice?.isRelated) {
    height += 110; // 맞춤 답변 박스
  } else {
    height += 200; // 스타일링 가이드 대체 박스 (6개 팁)
  }

  return {
    pageNumber: 6,
    pageName: '셀러브리티 + 맞춤 답변',
    estimatedFillRatio: Math.min(height / A4_PT, 1),
    warnings,
  };
}
