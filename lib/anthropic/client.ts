import Anthropic from '@anthropic-ai/sdk';
import type { PersonalColorType, TestAnswers } from '@/types';
import { getProductsByType, type CosmeticProduct } from '@/lib/data/cosmetics';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-sonnet-4-6';

// ── 내부 응답 코드 → 한국어 레이블 ────────────────────────────

const ANSWER_LABELS: Record<string, string> = {
  burn_red: '금방 빨개졌다가 다시 하얘짐',
  tan_dark: '까맣게 잘 타고 잘 안 돌아옴',
  gradual_tan: '조금 붉어지다가 서서히 탐',
  no_change: '거의 변화 없음',
  blue_purple: '파란빛·보라빛이 강함',
  green: '초록빛이 강함',
  mix: '파란빛과 초록빛이 섞여 있음',
  varies: '빛에 따라 달라 보임',
  redness: '붉은기·홍조가 잘 올라옴',
  dull_yellow: '칙칙하고 노란빛이 돎',
  dark_circles: '다크서클이 심함',
  none: '특별한 피부 고민 없음',
  black_sharp: '진한 검정·테두리 선명',
  dark_brown: '짙은 갈색·테두리 약간',
  light_brown: '밝은 갈색·테두리 흐림',
  golden_olive: '황갈색이나 올리브빛',
  blue_black: '블루블랙·아주 진한 검정',
  natural_black: '자연스러운 검정',
  brown_black: '약간 갈빛이 도는 검정',
  brown_light: '자연갈색 또는 밝은 갈색',
  gold: '골드가 잘 어울림',
  silver: '실버가 잘 어울림',
  both: '골드·실버 비슷함',
  no_jewelry: '주얼리를 잘 안 함',
  warm_colors: '따뜻한 색(코랄·오렌지·카멜·머스타드)',
  cool_colors: '차가운 색(라벤더·로즈·민트·아이시핑크)',
  deep_colors: '깊은 색(버건디·네이비·올리브·초콜릿)',
  bright_vivid: '밝고 선명한 색(빨강·로열블루·에메랄드)',
  pink_rose: '핑크·로즈 계열',
  yellow_beige: '옐로·베이지 계열',
  neutral_shade: '뉴트럴(중간)',
  no_foundation: '파운데이션 미사용',
  looks_bad: '예쁜데 나한테만 안 어울림',
  achromatic_only: '항상 무채색만 고르게 됨',
  looks_floating: '색을 입으면 얼굴이 떠 보임',
  cant_pull_trend: '트렌드 컬러 소화 어려움',
  pure_soft: '청순하다·부드럽다는 말을 들음',
  chic_urban: '세련됐다·도시적이라는 말을 들음',
  warm_friendly: '따뜻하다·친근하다는 말을 들음',
  strong_unique: '강렬하다·개성 있다는 말을 들음',
  unknown: '잘 모르겠음',
};

const Q_KEYS = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10'] as const;
const Q_NAMES = [
  'Q1 햇볕 반응', 'Q2 혈관색', 'Q3 피부 고민', 'Q4 눈동자',
  'Q5 머리색', 'Q6 주얼리', 'Q7 어울리는 색', 'Q8 파운데이션',
  'Q9 컬러 고민', 'Q10 주변 평가',
];

function formatAnswers(answers: TestAnswers): string {
  return Q_KEYS
    .map((key, i) => {
      const val = answers[key];
      const label = Array.isArray(val)
        ? val.map((v) => ANSWER_LABELS[v] ?? v).join(', ')
        : (ANSWER_LABELS[val as string] ?? val);
      return `${Q_NAMES[i]}: ${label}`;
    })
    .join('\n');
}

// ── 공통 학술 시스템 프롬프트 ─────────────────────────────────

const ACADEMIC_SYSTEM = `당신은 한국 퍼스널컬러 학회 기반의 공인 전문 분석가입니다.
색채과학 학위와 10년 이상의 임상 진단 경험을 보유하고 있으며,
매거진 컬러 칼럼니스트로도 활동 중입니다.

■ 반드시 사용해야 할 학술 용어

1. 색의 4속성
   - 색상(Hue): 색의 종류 — Warm Yellow-Red / Cool Pink-Blue 등으로 표현
   - 명도(Value): 색의 밝고 어두운 정도 — Light / Medium / Deep
   - 채도(Chroma): 색의 선명하고 탁한 정도 — Bright / Muted / Soft
   - 청탁(Clear/Mute): 색의 투명감·선명도 — Clear(맑음) / Muted(탁함)

2. 베이스 톤
   - Yellow Base (웜 베이스): 피부에 황색 기운이 도는 웜톤
   - Pink Base (쿨 베이스): 피부에 분홍·붉은 기운이 도는 쿨톤
   - Neutral Base: 두 기운이 혼재하는 중립형

3. 톤(Tone) 분류
   - Pale, Light, Bright, Vivid, Strong, Deep, Dark, Soft, Muted

4. 컨트라스트 레벨
   - High Contrast: 피부와 눈·머리 간 명도(Value) 차이가 큰 유형
   - Medium Contrast: 중간 수준의 대비감
   - Low Contrast: 전반적으로 유사한 명도 분포

5. 4분면 좌표 (Warm–Cool 축 × Light–Deep 축)
   - 봄 라이트/브라이트: Warm × Light
   - 여름 라이트/뮤트: Cool × Light~Medium
   - 가을 뮤트/딥: Warm × Medium~Deep
   - 겨울 브라이트/딥: Cool × Medium~Deep

■ 문체 원칙
- 학술 용어 첫 등장 시 반드시 괄호 안에 설명 추가
  예) "명도(Value, 색의 밝기)", "채도(Chroma, 색의 선명도)"
- 매거진 컬러 칼럼 스타일: 전문적이면서도 읽기 쉽고 부드러운 문체
- "~입니다" 정중체 사용, 친근한 2인칭 "당신"으로 호칭
- 고객의 개성과 자존감을 존중하는 표현
- 수치와 근거는 반드시 색채 이론에 기반하여 제시
- 한국어로만 작성`;

// ── 유명인 후보풀 ─────────────────────────────────────────────

const CELEBRITY_POOL = `
■ 유명인 후보풀 (타입별 참고 — 최근 활동 활발한 인물 우선)
봄 라이트:    아이유, 박보영, 정채연, 한지민
봄 브라이트:  카리나, 윈터, 박은빈, 김유정
여름 라이트:  김다미, 김지원, 박소이, 채수빈
여름 뮤트:    한소희, 정유미, 송혜교, 이은샘
가을 뮤트:    김태리, 박서준, 한예슬, 이성경
가을 딥:      전지현, 김희애, 공효진
겨울 브라이트: 제니, 차은우, 이도현
겨울 딥:      김혜수, 송중기, 김다미

선정 기준: 2030 세대가 즉시 알아볼 수 있는 인물, 최근 3년 내 활발히 활동 중인 인물 우선.
위 목록 외에도 적절한 인물 추천 가능 (단, 한국에서 인지도 높은 인물).
`;

function buildPersonalizationSystem(name: string, colorType: PersonalColorType): string {
  const n = name || '고객';
  return `
■ 개인화 리포트 지침 — 반드시 준수

이 리포트는 "${n}"님께 보내는 개인 맞춤 분석 보고서입니다.

호칭 규칙:
- 모든 섹션에서 "${n}님은~", "${n}님께~" 형식을 자연스럽게 사용하세요
- 일방적 정보 전달이 아닌, 내담자에게 직접 말하는 따뜻한 어조
- Q11 고민에 대한 답변은 특별히 공감적이고 따뜻하게

유명인 추천 기준:
- 2030 세대(만 20~39세)가 즉시 알아볼 수 있는 인물
- 한국에서 활동 중이거나 잘 알려진 K-POP 아이돌·한국 배우·글로벌 셀럽
- 너무 옛날이거나 잘 알려지지 않은 인물 ❌
- 4~5명 추천, 각각 왜 같은 톤인지 짧게 설명
- 동성 인물을 우선 추천하되, 다양한 직군 포함

${CELEBRITY_POOL}

사진 분석 지침 (사진이 제공된 경우):
- personalIntro.photoImpression에 피부 밝기·톤, 분위기, 어울리는 메이크업 스타일을 구체적으로 서술
- 분석 데이터(quadrant, fourAttributes)에도 사진 관찰 결과를 반영
- "[n]님의 사진에서 느껴지는..." 형식으로 직접 언급
`.trim();
}

// ── 1. 무료 결과 — 서사형 2~3문장 ────────────────────────────

export async function generateFreeResult(
  answers: TestAnswers,
  colorType: PersonalColorType,
): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: [
      {
        type: 'text',
        text: ACADEMIC_SYSTEM,
        cache_control: { type: 'ephemeral' },
      },
    ] as Anthropic.TextBlockParam[],
    messages: [
      {
        role: 'user',
        content: `응답자의 퍼스널컬러 타입은 **${colorType}**입니다.

테스트 응답:
${formatAnswers(answers)}

이 분에게 전달할 서사형 설명을 2~3문장으로 작성해주세요.

조건:
- 공감, 발견의 감정을 자극하는 문체
- 예시 톤: "지금까지 고른 색들이 틀렸던 게 아니에요. 단지 당신의 색이 아니었을 뿐이에요."
- 반드시 200자 이내
- 순수 텍스트만 출력 (제목·마크다운·따옴표 없이)`,
      },
    ],
  });

  console.log(`[Claude/freeResult] stop_reason: ${response.stop_reason} | output: ${response.usage?.output_tokens}tok`);
  const block = response.content[0];
  return block.type === 'text' ? block.text.trim() : '';
}

// ── 2. 유료 전체 리포트 — 7개 섹션 마크다운 (개선판) ─────────

export async function generateFullReport(
  answers: TestAnswers,
  colorType: PersonalColorType,
  imageBase64?: string,
  freeConcern?: string,
  imageMediaType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
): Promise<string> {
  const section7 = freeConcern
    ? `## [섹션 7] 당신의 고민에 대한 맞춤 답변
아래 고민을 참고하세요:
"${freeConcern}"

판단 기준:
- 퍼스널컬러·뷰티·패션·메이크업과 관련된 고민 → 전문가로서 학술 용어를 활용한 맞춤 조언 작성
- 관련 없는 고민 → 정확히 다음 문장만 출력: "해당 질문에는 답변이 불가합니다"`
    : '섹션 7은 작성하지 마세요.';

  const photoInstruction = imageBase64
    ? '\n첨부된 사진을 분석하여 피부 색상(Hue), 명도(Value), 채도(Chroma)를 파악하고 리포트에 반영하세요.'
    : '';

  const userText = `응답자 퍼스널컬러 타입: **${colorType}**${photoInstruction}

테스트 응답:
${formatAnswers(answers)}

아래 형식으로 퍼스널컬러 전문 리포트를 작성해주세요.
각 섹션은 반드시 ## [섹션 번호] 형태의 헤더로 구분하세요.
학술 용어(색의 4속성, 베이스 톤, 컨트라스트)를 적극 활용하고,
용어 첫 등장 시 괄호 안에 설명을 추가하세요.

## [섹션 1] 정밀 타입 분석
${colorType} 타입의 색상(Hue)·명도(Value)·채도(Chroma)·청탁(Clear/Mute) 특성.
피부·눈·머리색의 상관관계와 컨트라스트(Contrast) 레벨 분석.
4분면(Warm-Cool × Light-Deep) 상의 위치와 이 타입이 가진 고유한 매력.

## [섹션 2] 피해야 할 색상
어울리지 않는 색상과 그 이유를 색의 4속성 관점에서 설명.
구체적인 색상명과 피해야 하는 색채 이론적 근거 포함.

## [섹션 3] 메이크업 컬러 추천
립 컬러 3가지 이상 (색상명 + 톤 설명 + 추천 이유).
파운데이션 쉐이드 방향 (Yellow Base / Pink Base / Neutral Base 기준).
아이섀도우 컬러 추천 (명도·채도 기준으로 설명).

## [섹션 4] 헤어 컬러 추천
잘 어울리는 헤어 컬러 3가지 이상 (톤 설명 포함).
피해야 할 헤어 컬러와 그 이유.

## [섹션 5] 패션 컬러 가이드
베스트 컬러 팔레트 (메인·서브·포인트 컬러 구분).
코디 조합 팁 (컨트라스트 레벨 활용법 포함).

## [섹션 6] 시즌별 스타일링
봄·여름·가을·겨울 각 시즌에 맞는 컬러 스타일링 제안.
시즌별 색상 조합 예시 포함.

${section7}`;

  const userContent: Anthropic.MessageParam['content'] = imageBase64
    ? [
        {
          type: 'image',
          source: { type: 'base64', media_type: imageMediaType, data: imageBase64 },
        },
        { type: 'text', text: userText },
      ]
    : userText;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: [
      {
        type: 'text',
        text: ACADEMIC_SYSTEM,
        cache_control: { type: 'ephemeral' },
      },
    ] as Anthropic.TextBlockParam[],
    messages: [{ role: 'user', content: userContent }],
  });

  console.log(`[Claude/fullReport] stop_reason: ${response.stop_reason} | input: ${response.usage?.input_tokens}tok | output: ${response.usage?.output_tokens}tok`);

  if (response.stop_reason === 'max_tokens') {
    console.error(`[Claude/fullReport] ⚠️ 응답이 max_tokens 한계로 잘렸습니다 (output: ${response.usage?.output_tokens}tok)`);
    throw new Error('리포트가 토큰 한계로 잘렸습니다. max_tokens를 늘려주세요.');
  }

  const block = response.content[0];
  const text = block.type === 'text' ? block.text.trim() : '';
  console.log(`[Claude/fullReport] 응답 길이: ${text.length}자`);

  // 필수 섹션 헤더 존재 여부 확인
  const requiredSections = ['[섹션 1]', '[섹션 2]', '[섹션 3]', '[섹션 4]', '[섹션 5]', '[섹션 6]'];
  const missingSections = requiredSections.filter(s => !text.includes(s));
  if (missingSections.length > 0) {
    console.error(`[Claude/fullReport] ⚠️ 누락된 섹션: ${missingSections.join(', ')} | 응답 길이: ${text.length}자`);
    throw new Error(`리포트 섹션 누락: ${missingSections.join(', ')}`);
  }

  return text;
}

// ── 3. 구조화 리포트 데이터 — PDF 컴포넌트용 JSON ────────────

export interface ReportColorItem {
  name: string;
  hex: string;
}

export interface WorstColorItem {
  name: string;
  hex: string;
  reason: string;
}

export interface ReportMakeupItem {
  name: string;
  hex: string;
  description: string;
}

export interface Celebrity {
  name: string;
  profession: string;
  similarity: string;
  iconicLook: string;
}

export interface ReportData {
  meta: {
    typeName: string;
    typeNameKr: string;
    toneStrength: string;
    issueDate: string;
    reportId: string;
    customerName: string;
  };
  personalIntro: {
    greeting: string;
    colorTypeDescription: {
      summary: string;
      characteristics: string[];
      bestFor: string;
    };
    photoImpression: string;
    keyFinding: string;
  };
  celebrities: Celebrity[];
  analysis: {
    summary: string;
    quadrant: {
      warmCool: number;  // 0: 매우 쿨, 100: 매우 웜
      lightDeep: number; // 0: 매우 라이트, 100: 매우 딥
    };
    fourAttributes: {
      hue: string;
      value: string;
      chroma: string;
      clarity: string;
    };
    base: string;
    contrast: string;
  };
  palette: {
    best: ReportColorItem[];    // 8개
    worst: WorstColorItem[];    // 4개 (name, hex, reason 포함)
  };
  makeup: {
    lipstick:   CosmeticProduct[]; // 3개 — DB에서 주입
    foundation: CosmeticProduct[]; // 2개 — DB에서 주입
    eyeshadow:  CosmeticProduct[]; // 2개 — DB에서 주입
    blusher:    CosmeticProduct[]; // 2개 — DB에서 주입
    tips: string[];                // 4-5개 맞춤 팁 (Claude 생성)
  };
  hair: {
    recommended: Array<{ name: string; description: string }>;  // 3개
    avoid: Array<{ name: string; reason: string }>;             // 2개
  };
  fashion: {
    main: string[];
    sub: string[];
    accent: string[];
    tips: string[];
  };
  seasonalStyling: {
    spring: { title: string; description: string; mustHaves: Array<{ icon: string; label: string }>; colors: Array<{ name: string; hex: string }> };
    summer: { title: string; description: string; mustHaves: Array<{ icon: string; label: string }>; colors: Array<{ name: string; hex: string }> };
    fall:   { title: string; description: string; mustHaves: Array<{ icon: string; label: string }>; colors: Array<{ name: string; hex: string }> };
    winter: { title: string; description: string; mustHaves: Array<{ icon: string; label: string }>; colors: Array<{ name: string; hex: string }> };
  };
  customAdvice?: {
    answer: string;
    isRelated: boolean;
  };
}

export async function generateReportData(
  answers: TestAnswers,
  colorType: PersonalColorType,
  customerName?: string,
  imageBase64?: string,
  freeConcern?: string,
  imageMediaType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
): Promise<ReportData> {
  const today = new Date().toISOString().slice(0, 10);
  const reportId = `CL-${Date.now().toString(36).toUpperCase()}`;
  const name = customerName?.trim() || '고객';

  // ⭐ DB에서 실제 제품 사전 로드 — AI가 생성하지 않음
  const realProducts = {
    lipstick:   getProductsByType(colorType, 'lipstick',   3),
    foundation: getProductsByType(colorType, 'foundation', 2),
    eyeshadow:  getProductsByType(colorType, 'eyeshadow',  2),
    blusher:    getProductsByType(colorType, 'blusher',    2),
  };

  const photoInstruction = imageBase64
    ? `첨부 사진에서 ${name}님의 피부 색상(Hue)·명도(Value)·채도(Chroma)·분위기를 분석하여 personalIntro.photoImpression 및 분석 데이터에 반영하세요.`
    : '';

  const customAdviceInstruction = freeConcern
    ? `"customAdvice" 필드를 반드시 포함하세요.
고민: "${freeConcern}"
- 퍼스널컬러·뷰티·패션·메이크업 관련 → isRelated: true, answer에 전문 조언 작성
- 관련 없는 경우 → isRelated: false, answer: "해당 질문에는 답변이 불가합니다"`
    : '"customAdvice" 필드는 생략하세요.';

  const prompt = `⚠️ 출력 규칙 (반드시 준수):
1. 순수 JSON만 출력하세요. 첫 글자 '{', 마지막 글자 '}'.
2. 마크다운 코드블록(\`\`\`json 등), 설명 텍스트, 주석 절대 포함 금지.
3. makeup의 lipstick·foundation·eyeshadow·blusher는 반드시 빈 배열 []로 두세요.
4. celebrities는 4~5명, 각각 signatureColors(hex 2~3개)를 반드시 포함하세요.
5. JSON.parse()로 파싱 가능한 완전한 JSON이어야 합니다.

내담자: ${name}님 | 퍼스널컬러 타입: ${colorType}
${photoInstruction}
테스트 응답:
${formatAnswers(answers)}

${customAdviceInstruction}

아래 JSON 구조를 정확히 따르는 퍼스널컬러 분석 데이터를 생성하세요.
hex 값은 반드시 '#RRGGBB' 형식의 실제 색상 코드를 사용하세요.
모든 텍스트 필드에서 "${name}님" 호칭을 자연스럽게 사용하세요.
학술 용어(색의 4속성, Yellow/Pink/Neutral Base, Contrast 레벨)를 정확히 사용하세요.

{
  "meta": {
    "typeName": "영문 타입명 (예: Spring Light)",
    "typeNameKr": "${colorType}",
    "toneStrength": "톤 강도 설명 (예: Soft Light tendency, Yellow Base 경향)",
    "issueDate": "${today}",
    "reportId": "${reportId}",
    "customerName": "${name}"
  },
  "personalIntro": {
    "greeting": "${name}님께 건네는 따뜻한 첫 인사 (1~2문장)",
    "colorTypeDescription": {
      "summary": "${colorType}의 본질을 한 줄로 압축 — 타입명 포함. 예: '봄 라이트 — 따뜻하고 부드러운 옐로우 베이스의 라이트 톤'",
      "characteristics": [
        "색의 4속성 기반 핵심 특징 1 (30자 이내) — Hue 관점. 예: '옐로우 베이스의 따뜻한 색감 (Warm Hue)'",
        "핵심 특징 2 — Value 관점. 예: '밝고 환한 높은 명도 (High Value)'",
        "핵심 특징 3 — Chroma·Clarity 관점. 예: '부드러운 채도의 깨끗한 색조 (Soft Chroma · Clear)'"
      ],
      "bestFor": "이 톤이 살려주는 인상·매력 한 줄. 예: '맑고 화사한 인상과 부드러운 매력을 자연스럽게 살려줍니다'"
    },
    "photoImpression": "${name}님 사진에서 받은 첫인상 — 피부 밝기·톤, 전체적 분위기, 어울리는 메이크업 스타일 (2~3문장, 사진 없으면 테스트 응답 기반으로 작성)",
    "keyFinding": "가장 중요한 발견 한 문장 (예: '${name}님은 Yellow Base의 맑고 투명한 Clear 타입입니다.')"
  },
  "celebrities": [
    {
      "name": "유명인 이름 (예: 아이유)",
      "profession": "직업 (예: 가수·배우)",
      "signatureColors": ["#RRGGBB", "#RRGGBB", "#RRGGBB"],
      "similarity": "${name}님과 같은 타입인 이유 — 톤·명도·분위기 관점으로 설명",
      "iconicLook": "이 인물의 트레이드마크 스타일 설명"
    },
    (총 4~5명)
  ],
  "analysis": {
    "summary": "이 타입의 핵심 특징을 색의 4속성 관점에서 설명하는 2~3문장 요약",
    "quadrant": {
      "warmCool": 0~100 사이 숫자 (0=매우 쿨, 100=매우 웜),
      "lightDeep": 0~100 사이 숫자 (0=매우 라이트, 100=매우 딥)
    },
    "fourAttributes": {
      "hue": "색상 특성 (예: Warm Yellow-Red)",
      "value": "명도 특성 (예: Light to Medium)",
      "chroma": "채도 특성 (예: Soft Muted)",
      "clarity": "청탁 특성 (예: Clear tendency)"
    },
    "base": "Yellow Base / Pink Base / Neutral Base 중 하나",
    "contrast": "High / Medium / Low Contrast 중 하나"
  },
  "palette": {
    "best": [
      {"name": "색상명", "hex": "#RRGGBB"},
      (총 8개)
    ],
    "worst": [
      {"name": "색상명", "hex": "#RRGGBB", "reason": "피부 톤에 맞지 않는 이유 (10자 이내)"},
      (총 4개)
    ]
  },
  "makeup": {
    "lipstick": [],
    "foundation": [],
    "eyeshadow": [],
    "blusher": [],
    "tips": [
      "${name}님께 맞는 베이스 메이크업 팁 (1문장)",
      "립 컬러 선택 팁 (1문장)",
      "아이 메이크업 팁 (1문장)",
      "블러셔 팁 (1문장)",
      "전체 메이크업 마무리 팁 (1문장)"
    ]
  },

⚠️ 절대 금지: lipstick·foundation·eyeshadow·blusher 배열에 어떤 제품도 추가하지 마세요.
브랜드명·제품명·호수·가격을 절대 생성하지 마세요.
4개 배열은 반드시 빈 배열([])로 출력하세요. 제품 데이터는 백엔드 DB로 자동 교체됩니다.
  "hair": {
    "recommended": [
      {"name": "헤어 컬러명", "description": "톤 설명"},
      (총 3개)
    ],
    "avoid": [
      {"name": "피해야 할 헤어 컬러명", "reason": "피해야 하는 이유"},
      (총 2개)
    ]
  },
  "fashion": {
    "main": ["메인 컬러 추천 (2~3개)"],
    "sub": ["서브 컬러 추천 (2~3개)"],
    "accent": ["포인트 컬러 추천 (1~2개)"],
    "tips": ["코디 팁 (3~5개)"]
  },
  "seasonalStyling": {
    "spring": {
      "title": "봄 룩 제목 (예: '산뜻한 데이트 룩')",
      "description": "${name}님의 봄 스타일링 제안 — 2~3문장으로 구체적인 코디 방법 설명",
      "mustHaves": [
        {"icon": "이모지", "label": "필수 아이템 1"},
        {"icon": "이모지", "label": "필수 아이템 2"},
        {"icon": "이모지", "label": "필수 아이템 3"}
      ],
      "colors": [
        {"name": "컬러명", "hex": "#RRGGBB"},
        {"name": "컬러명", "hex": "#RRGGBB"},
        {"name": "컬러명", "hex": "#RRGGBB"}
      ]
    },
    "summer": {
      "title": "여름 룩 제목",
      "description": "${name}님의 여름 스타일링 제안 — 2~3문장",
      "mustHaves": [{"icon": "이모지", "label": "아이템"}],
      "colors": [{"name": "컬러명", "hex": "#RRGGBB"}]
    },
    "fall": {
      "title": "가을 룩 제목",
      "description": "${name}님의 가을 스타일링 제안 — 2~3문장",
      "mustHaves": [{"icon": "이모지", "label": "아이템"}],
      "colors": [{"name": "컬러명", "hex": "#RRGGBB"}]
    },
    "winter": {
      "title": "겨울 룩 제목",
      "description": "${name}님의 겨울 스타일링 제안 — 2~3문장",
      "mustHaves": [{"icon": "이모지", "label": "아이템"}],
      "colors": [{"name": "컬러명", "hex": "#RRGGBB"}]
    }
  }
}`;

  const userContent: Anthropic.MessageParam['content'] = imageBase64
    ? [
        {
          type: 'image',
          source: { type: 'base64', media_type: imageMediaType, data: imageBase64 },
        },
        { type: 'text', text: prompt },
      ]
    : prompt;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: [
      {
        type: 'text',
        text: ACADEMIC_SYSTEM,
        cache_control: { type: 'ephemeral' }, // 학술 프롬프트 캐시
      },
      {
        type: 'text',
        text: buildPersonalizationSystem(name, colorType), // 개인화 (캐시 불가)
      },
    ] as Anthropic.TextBlockParam[],
    messages: [{ role: 'user', content: userContent }],
  });

  console.log(`[Claude/reportData] stop_reason: ${response.stop_reason} | input: ${response.usage?.input_tokens}tok | output: ${response.usage?.output_tokens}tok`);

  if (response.stop_reason === 'max_tokens') {
    console.error(`[Claude/reportData] ⚠️ 응답이 max_tokens 한계로 잘렸습니다 (output: ${response.usage?.output_tokens}tok)`);
    throw new Error('리포트 JSON이 토큰 한계로 잘렸습니다. max_tokens를 늘려주세요.');
  }

  const block = response.content[0];
  if (block.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // JSON 추출 — 마크다운 코드블록이 포함된 경우 처리
  const raw = block.text.trim();
  console.log(`[Claude/reportData] 응답 길이: ${raw.length}자`);

  let jsonText = raw;
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  jsonText = jsonText.trim();

  if (!jsonText.startsWith('{') || !jsonText.endsWith('}')) {
    console.error('[generateReportData] JSON 형식 아님:', jsonText.substring(0, 200));
    throw new Error('Claude 응답이 JSON 형식이 아닙니다');
  }

  let data: ReportData;
  try {
    data = JSON.parse(jsonText) as ReportData;
  } catch (parseError) {
    console.error('[generateReportData] JSON 파싱 실패:', parseError);
    console.error('응답 일부:', jsonText.substring(0, 500));
    throw new Error('Claude 응답 JSON 파싱 실패');
  }
  console.log('[generateReportData] JSON 파싱 성공');
  console.log('[generateReportData] 셀러브리티 수:', data.celebrities?.length ?? 0);

  // 필수 최상위 필드 검증
  const requiredFields = ['meta', 'personalIntro', 'makeup', 'seasonalStyling'] as const;
  const missingFields = requiredFields.filter(f => !data[f]);
  if (missingFields.length > 0) {
    console.error(`[Claude/reportData] ⚠️ 누락 필드: ${missingFields.join(', ')} | 응답 길이: ${raw.length}자`);
    throw new Error(`리포트 JSON 필드 누락: ${missingFields.join(', ')}`);
  }
  console.log('[Claude/reportData] 필드 검증 완료');

  // 안전장치: AI 생성 제품 무시, DB의 verified 제품만 사용
  data.makeup.lipstick   = realProducts.lipstick.filter(p => p.verified === true);
  data.makeup.foundation = realProducts.foundation.filter(p => p.verified === true);
  data.makeup.eyeshadow  = realProducts.eyeshadow.filter(p => p.verified === true);
  data.makeup.blusher    = realProducts.blusher.filter(p => p.verified === true);

  if (data.makeup.lipstick.length === 0)   console.warn(`⚠️ ${colorType} 립스틱 DB 제품 없음 — PDF에 표시 안 됨`);
  if (data.makeup.foundation.length === 0) console.warn(`⚠️ ${colorType} 파운데이션 DB 제품 없음 — PDF에 표시 안 됨`);
  if (data.makeup.eyeshadow.length === 0)  console.warn(`⚠️ ${colorType} 아이섀도우 DB 제품 없음 — PDF에 표시 안 됨`);
  if (data.makeup.blusher.length === 0)    console.warn(`⚠️ ${colorType} 블러셔 DB 제품 없음 — PDF에 표시 안 됨`);

  console.log('[generateReportData] 셀럽 검증 완료, 최종:', data.celebrities?.length ?? 0);
  return data;
}
