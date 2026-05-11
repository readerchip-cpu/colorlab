import type { PersonalColorType, Season, Tone, TestAnswers, FreeResult } from '@/types';

// ────────────────────────────────────────────────────────────
// 내부 점수 구조
// warmScore  > 0 → 웜톤 (봄/가을),  < 0 → 쿨톤 (여름/겨울)
// depthScore > 0 → 딥/다크,         < 0 → 라이트/소프트
// clarityScore > 0 → 클리어/비비드,  < 0 → 뮤트/소프트
// "잘 모르겠어요" (value: 'unknown') → 모든 축 0점
// ────────────────────────────────────────────────────────────

interface Scores {
  warm: number;
  depth: number;
  clarity: number;
}

function buildScores(answers: TestAnswers): Scores {
  let warm = 0;
  let depth = 0;
  let clarity = 0;

  // Q1 — 햇볕 반응 (웜/쿨 핵심 지표)
  switch (answers.Q1) {
    case 'burn_red':    warm -= 2; break; // 쿨톤: 쉽게 빨개짐
    case 'tan_dark':    warm += 2; break; // 웜톤: 잘 탐
    case 'gradual_tan': warm += 1; break;
    case 'no_change':   warm += 1; break;
  }

  // Q2 — 손목 혈관색 (웜/쿨 핵심 지표)
  switch (answers.Q2) {
    case 'blue_purple': warm -= 2; break;
    case 'green':       warm += 2; break;
    // mix / varies → 중립
  }

  // Q3 — 피부 고민 (웜/쿨 보조) — 다중 선택, 선택지별 합산
  for (const v of answers.Q3) {
    switch (v) {
      case 'redness':      warm -= 1; break; // 홍조 → 쿨 성향
      case 'dull_yellow':  warm += 2; break; // 노란빛 → 웜 성향
      case 'dark_circles': warm -= 1; break; // 다크서클 → 쿨 성향
    }
  }

  // Q4 — 눈동자 색 (웜/쿨 + 깊이)
  switch (answers.Q4) {
    case 'black_sharp':  warm -= 1; depth += 2; break; // 겨울
    case 'dark_brown':              depth += 1; break;
    case 'light_brown':  warm += 1; depth -= 2; break; // 봄/여름
    case 'golden_olive': warm += 2;             break; // 가을
  }

  // Q5 — 자연 머리색 (웜/쿨 + 깊이)
  switch (answers.Q5) {
    case 'blue_black':    warm -= 2; depth += 2; break; // 겨울 딥
    case 'natural_black':            depth += 1; break;
    case 'brown_black':   warm += 1;             break;
    case 'brown_light':   warm += 2; depth -= 2; break; // 봄/여름 라이트
  }

  // Q6 — 골드 vs 실버 (웜/쿨 핵심 지표)
  switch (answers.Q6) {
    case 'gold':   warm += 2; break;
    case 'silver': warm -= 2; break;
  }

  // Q7 — 얼굴 밝아 보이는 색 (웜/쿨 + 깊이 + 선명도)
  switch (answers.Q7) {
    case 'warm_colors': warm += 2;                       break;
    case 'cool_colors': warm -= 2;                       break;
    case 'deep_colors': warm += 1; depth += 2;           break; // 가을 딥/뮤트
    case 'bright_vivid': warm -= 1; depth += 1; clarity += 2; break; // 겨울 비비드
  }

  // Q8 — 파운데이션 쉐이드 (웜/쿨 핵심 지표)
  switch (answers.Q8) {
    case 'pink_rose':    warm -= 2; break;
    case 'yellow_beige': warm += 2; break;
  }

  // Q9 — 컬러 고민 (깊이 + 선명도 보조) — 다중 선택, 선택지별 합산
  for (const v of answers.Q9) {
    switch (v) {
      case 'achromatic_only': depth += 1; clarity -= 1; break; // 무채색 선호 → 뮤트/딥
      case 'looks_floating':  depth -= 2; clarity -= 2; break; // 뜨면 뮤트/소프트 타입
    }
  }

  // Q10 — 주변 평가 (깊이 + 선명도 보조) — 다중 선택, 선택지별 합산
  for (const v of answers.Q10) {
    switch (v) {
      case 'pure_soft':     depth -= 2; clarity -= 1; break; // 봄 라이트/여름 라이트
      case 'chic_urban':    warm -= 1; depth += 1; clarity += 1; break; // 겨울 계열
      case 'warm_friendly': warm += 1; depth -= 1; break; // 봄/가을
      case 'strong_unique':            depth += 2; clarity += 2; break; // 겨울 브라이트/가을 딥
    }
  }

  return { warm, depth, clarity };
}

// ────────────────────────────────────────────────────────────
// 점수 → 타입 매핑
// ────────────────────────────────────────────────────────────

function scoresToType({ warm, depth, clarity }: Scores): PersonalColorType {
  if (warm >= 0) {
    // 웜톤: 봄 or 가을
    if (depth > 0) {
      // 가을: 깊이가 강하거나 선명도가 높으면 딥, 그 외 뮤트
      if (depth >= 4 || clarity >= 2)  return '가을 딥';
      return '가을 뮤트';
    } else {
      // 봄: 선명하면 브라이트, 그 외 라이트
      if (clarity >= 1)    return '봄 브라이트';
      return '봄 라이트';
    }
  } else {
    // 쿨톤: 여름 or 겨울
    if (depth > 0) {
      // 겨울: 선명도가 있으면 브라이트, 그 외 딥
      if (clarity >= 1)    return '겨울 브라이트';
      return '겨울 딥';
    } else {
      // 여름: 매우 밝거나 선명하면 라이트, 그 외 뮤트
      if (depth <= -3 || clarity >= 1)  return '여름 라이트';
      return '여름 뮤트';
    }
  }
}

// ────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────

export function determineColorType(answers: TestAnswers): PersonalColorType {
  return scoresToType(buildScores(answers));
}

export function getSeasonFromType(type: PersonalColorType): Season {
  if (type.startsWith('봄')) return '봄';
  if (type.startsWith('여름')) return '여름';
  if (type.startsWith('가을')) return '가을';
  return '겨울';
}

export function getToneFromType(type: PersonalColorType): Tone {
  const season = getSeasonFromType(type);
  return season === '봄' || season === '가을' ? '웜톤' : '쿨톤';
}

// 대표 추천 컬러 (hex 3개) — 추후 디자인 확정 후 교체 가능
const TYPE_COLORS: Record<PersonalColorType, [string, string, string]> = {
  '봄 라이트':    ['#FFB6C1', '#FFDAB9', '#B0E0E6'],
  '봄 브라이트':  ['#FFD580', '#FF8C69', '#90EE90'],
  '여름 라이트':  ['#E6C8D8', '#B0C4DE', '#D8BFD8'],
  '여름 뮤트':   ['#C4A0A0', '#A0B4C8', '#B8A8C8'],
  '가을 뮤트':   ['#C8A882', '#8B7355', '#A0A878'],
  '가을 딥':     ['#7B3F00', '#556B2F', '#8B2500'],
  '겨울 브라이트': ['#CC0000', '#0000CC', '#00CC66'],
  '겨울 딥':     ['#1C1C2E', '#2E0854', '#1A3A2A'],
};

export function buildFreeResult(
  sessionId: string,
  answers: TestAnswers,
): FreeResult {
  const colorType = determineColorType(answers);
  return {
    sessionId,
    colorType,
    season: getSeasonFromType(colorType),
    tone: getToneFromType(colorType),
    topColors: TYPE_COLORS[colorType],
    summary: '', // AI 생성 or 정적 텍스트로 채울 것
  };
}
