import Anthropic from '@anthropic-ai/sdk';
import type { PersonalColorType, TestAnswers } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultHeaders: {
    'anthropic-beta': 'prompt-caching-2024-07-31',
  },
});

const MODEL = 'claude-opus-4-5';

// 시스템 프롬프트는 반복 호출 시 캐시됨
const EXPERT_SYSTEM = `당신은 10년 경력의 퍼스널컬러 전문 컨설턴트입니다.
과학적 색채 이론과 따뜻한 공감 능력을 겸비하고 있으며, 고객이 자신만의 색을 발견하는 기쁨을 함께 나눕니다.

응답 원칙:
- 반드시 한국어로 작성하세요
- 친근하면서도 전문적인 문체를 사용하세요
- 전문 용어는 쉽게 풀어 설명하세요
- 고객의 자존감과 개성을 존중하는 표현을 사용하세요
- 수치나 근거를 들 때는 색채 이론에 기반하여 설명하세요`;

// 내부 응답 코드 → 한국어 레이블 (프롬프트 가독성용)
const ANSWER_LABELS: Record<string, string> = {
  // Q1 — 햇볕 반응
  burn_red:        '금방 빨개졌다가 다시 하얘짐',
  tan_dark:        '까맣게 잘 타고 잘 안 돌아옴',
  gradual_tan:     '조금 붉어지다가 서서히 탐',
  no_change:       '거의 변화 없음',
  // Q2 — 혈관색
  blue_purple:     '파란빛·보라빛이 강함',
  green:           '초록빛이 강함',
  mix:             '파란빛과 초록빛이 섞여 있음',
  varies:          '빛에 따라 달라 보임',
  // Q3 — 피부 고민
  redness:         '붉은기·홍조가 잘 올라옴',
  dull_yellow:     '칙칙하고 노란빛이 돎',
  dark_circles:    '다크서클이 심함',
  none:            '특별한 피부 고민 없음',
  // Q4 — 눈동자
  black_sharp:     '진한 검정·테두리 선명',
  dark_brown:      '짙은 갈색·테두리 약간',
  light_brown:     '밝은 갈색·테두리 흐림',
  golden_olive:    '황갈색이나 올리브빛',
  // Q5 — 머리색
  blue_black:      '블루블랙·아주 진한 검정',
  natural_black:   '자연스러운 검정',
  brown_black:     '약간 갈빛이 도는 검정',
  brown_light:     '자연갈색 또는 밝은 갈색',
  // Q6 — 주얼리
  gold:            '골드가 잘 어울림',
  silver:          '실버가 잘 어울림',
  both:            '골드·실버 비슷함',
  no_jewelry:      '주얼리를 잘 안 함',
  // Q7 — 어울리는 색
  warm_colors:     '따뜻한 색(코랄·오렌지·카멜·머스타드)',
  cool_colors:     '차가운 색(라벤더·로즈·민트·아이시핑크)',
  deep_colors:     '깊은 색(버건디·네이비·올리브·초콜릿)',
  bright_vivid:    '밝고 선명한 색(빨강·로열블루·에메랄드)',
  // Q8 — 파운데이션
  pink_rose:       '핑크·로즈 계열',
  yellow_beige:    '옐로·베이지 계열',
  neutral:         '뉴트럴(중간)',
  no_foundation:   '파운데이션 미사용',
  // Q9 — 컬러 고민
  looks_bad:       '예쁜데 나한테만 안 어울림',
  achromatic_only: '항상 무채색만 고르게 됨',
  looks_floating:  '색을 입으면 얼굴이 떠 보임',
  cant_pull_trend: '트렌드 컬러 소화 어려움',
  // Q10 — 주변 평가
  pure_soft:       '청순하다·부드럽다는 말을 들음',
  chic_urban:      '세련됐다·도시적이라는 말을 들음',
  warm_friendly:   '따뜻하다·친근하다는 말을 들음',
  strong_unique:   '강렬하다·개성 있다는 말을 들음',
  // 공통
  unknown:         '잘 모르겠음',
};

const Q_KEYS = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10'] as const;
const Q_NAMES = [
  'Q1 햇볕 반응', 'Q2 혈관색', 'Q3 피부 고민', 'Q4 눈동자',
  'Q5 머리색', 'Q6 주얼리', 'Q7 어울리는 색', 'Q8 파운데이션',
  'Q9 컬러 고민', 'Q10 주변 평가',
];

function formatAnswers(answers: TestAnswers): string {
  return Q_KEYS
    .map((key, i) => `${Q_NAMES[i]}: ${ANSWER_LABELS[answers[key]] ?? answers[key]}`)
    .join('\n');
}

// ────────────────────────────────────────────────────────────
// 1. 무료 결과 — 서사형 2~3문장 (200자 이내)
// ────────────────────────────────────────────────────────────

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
        text: EXPERT_SYSTEM,
        cache_control: { type: 'ephemeral' },
      },
    ] as Anthropic.TextBlockParam[],
    messages: [
      {
        role: 'user',
        content: `응답자의 퍼스널컬러 타입은 **${colorType}**입니다.

테스트 응답:
${formatAnswers(answers)}

이 사람에게 전달할 서사형 설명을 2~3문장으로 작성해주세요.

조건:
- 공감, 놀람, 발견의 감정을 자극하는 문체
- 예시 톤: "지금까지 고른 색들이 틀렸던 게 아니에요. 단지 당신의 색이 아니었을 뿐이에요."
- 반드시 200자 이내
- 순수 텍스트만 출력 (제목·마크다운·따옴표 없이)`,
      },
    ],
  });

  const block = response.content[0];
  return block.type === 'text' ? block.text.trim() : '';
}

// ────────────────────────────────────────────────────────────
// 2. 유료 전체 리포트 — 7개 섹션 마크다운
// ────────────────────────────────────────────────────────────

export async function generateFullReport(
  answers: TestAnswers,
  colorType: PersonalColorType,
  imageBase64?: string,
  freeConcern?: string,
  imageMediaType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
): Promise<string> {
  const section7Instruction = freeConcern
    ? `## 7. 맞춤 조언
아래 고민을 참고하세요:
"${freeConcern}"

판단 기준:
- 이 고민이 퍼스널컬러·뷰티·패션·메이크업과 관련된 경우 → 전문가로서 맞춤 조언을 작성하세요
- 관련이 없는 경우 → 정확히 다음 문장만 출력하세요: "해당 질문에는 답변이 불가합니다"`
    : '섹션 7은 생략하세요.';

  const photoInstruction = imageBase64
    ? '\n첨부된 사진을 분석하여 피부 톤, 명도, 채도를 파악하고 리포트에 반영하세요.'
    : '';

  const userText = `응답자의 퍼스널컬러 타입: **${colorType}**
${photoInstruction}
테스트 응답:
${formatAnswers(answers)}

위 정보를 바탕으로 아래 형식의 퍼스널컬러 전문 리포트를 작성해주세요.
각 섹션은 마크다운 ## 헤더로 구분하고, 구체적이고 실용적인 내용으로 채워주세요.

## 1. 정밀 타입 분석
(${colorType} 타입의 특징, 피부·눈·머리색과의 연관성, 이 타입이 가진 고유한 매력)

## 2. 피해야 할 색상
(어울리지 않는 색상과 그 이유, 구체적인 색상명 포함)

## 3. 메이크업 추천
(립 컬러 추천 3가지 이상 / 파운데이션 쉐이드 방향 / 아이섀도우 컬러 추천)

## 4. 헤어 컬러 추천
(잘 어울리는 헤어 컬러 추천 3가지 이상, 피해야 할 헤어 컬러 포함)

## 5. 패션 컬러 가이드
(베스트 컬러 팔레트, 코디 조합 팁, 계절별 활용법)

## 6. 시즌별 스타일링
(봄·여름·가을·겨울 각 시즌에 맞는 컬러 스타일링 제안)

${section7Instruction}`;

  // 이미지가 있으면 vision 요청, 없으면 텍스트 전용
  const userContent: Anthropic.MessageParam['content'] = imageBase64
    ? [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: imageMediaType,
            data: imageBase64,
          },
        },
        { type: 'text', text: userText },
      ]
    : userText;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 3000,
    system: [
      {
        type: 'text',
        text: EXPERT_SYSTEM,
        cache_control: { type: 'ephemeral' },
      },
    ] as Anthropic.TextBlockParam[],
    messages: [
      {
        role: 'user',
        content: userContent,
      },
    ],
  });

  const block = response.content[0];
  return block.type === 'text' ? block.text.trim() : '';
}
