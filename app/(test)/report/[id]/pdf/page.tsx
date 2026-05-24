import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getTestSession } from '@/lib/utils/session';
import PdfViewerClient from '@/components/pdf/PdfViewerClient';
import type { PersonalColorType } from '@/types';

// Static personalIntro data per type (for PDF cover page)
const TYPE_INTRO: Record<PersonalColorType, {
  summary: string;
  characteristics: [string, string, string];
  bestFor: string;
  keyFinding: string;
}> = {
  '봄 라이트': {
    summary: '봄 라이트 — 따뜻하고 부드러운 옐로우 베이스의 라이트 톤',
    characteristics: ['옐로우 베이스의 따뜻한 색감 (Warm Hue)', '밝고 환한 높은 명도 (High Value)', '부드러운 채도의 깨끗한 색조 (Soft Chroma · Clear)'],
    bestFor: '맑고 화사한 인상과 부드러운 매력을 자연스럽게 살려줍니다.',
    keyFinding: '옐로우 베이스의 맑고 투명한 Clear 라이트 타입입니다.',
  },
  '봄 브라이트': {
    summary: '봄 브라이트 — 선명하고 따뜻한 옐로우-오렌지 베이스의 브라이트 톤',
    characteristics: ['옐로우-오렌지 베이스의 생기 있는 색감 (Warm Vivid Hue)', '밝고 선명한 높은 채도 (Bright Chroma)', '맑고 투명한 클리어 특성 (Clear · Light)'],
    bestFor: '생동감 넘치는 인상과 활기찬 에너지를 자연스럽게 표현합니다.',
    keyFinding: '옐로우-오렌지 베이스의 선명하고 맑은 Bright Clear 타입입니다.',
  },
  '여름 라이트': {
    summary: '여름 라이트 — 차분하고 맑은 쿨 핑크 베이스의 라이트 톤',
    characteristics: ['쿨 핑크 베이스의 차분한 색감 (Cool Hue)', '밝고 부드러운 높은 명도 (Light · Clear Value)', '섬세한 쿨 클리어 특성 (Cool · Clear)'],
    bestFor: '청아하고 투명한 인상과 은은한 우아함을 자연스럽게 살려줍니다.',
    keyFinding: '쿨 핑크 베이스의 맑고 부드러운 Clear 라이트 타입입니다.',
  },
  '여름 뮤트': {
    summary: '여름 뮤트 — 차분하고 세련된 쿨 핑크 베이스의 뮤트 톤',
    characteristics: ['쿨 핑크 베이스의 부드러운 색감 (Cool Muted Hue)', '중간 명도의 차분한 인상 (Medium Value)', '낮은 채도의 성숙한 뮤트 특성 (Muted · Soft)'],
    bestFor: '세련되고 차분한 어른스러운 매력을 자연스럽게 완성합니다.',
    keyFinding: '쿨 베이스의 부드럽고 차분한 Muted 타입입니다.',
  },
  '가을 뮤트': {
    summary: '가을 뮤트 — 따뜻하고 자연스러운 옐로우 베이스의 어스 뮤트 톤',
    characteristics: ['옐로우 베이스의 깊고 따뜻한 색감 (Warm Earth Hue)', '중간 명도의 안정감 있는 인상 (Medium Value)', '낮은 채도의 자연스러운 어스 톤 (Muted · Warm)'],
    bestFor: '깊고 따뜻한 자연미와 성숙한 매력을 자연스럽게 표현합니다.',
    keyFinding: '옐로우 베이스의 따뜻하고 자연스러운 Muted 어스 톤 타입입니다.',
  },
  '가을 딥': {
    summary: '가을 딥 — 강렬하고 풍부한 옐로우-레드 베이스의 딥 어스 톤',
    characteristics: ['옐로우-레드 베이스의 깊고 강렬한 색감 (Deep Warm Hue)', '낮은 명도의 풍부한 인상 (Deep Value)', '중간 채도의 농후한 어스 특성 (Muted · Deep Warm)'],
    bestFor: '강렬하고 풍부한 존재감과 독보적인 카리스마를 살려줍니다.',
    keyFinding: '옐로우-레드 베이스의 깊고 강렬한 Deep 어스 타입입니다.',
  },
  '겨울 브라이트': {
    summary: '겨울 브라이트 — 선명하고 세련된 쿨 베이스의 브라이트 톤',
    characteristics: ['쿨 핑크-블루 베이스의 선명한 색감 (Cool Vivid Hue)', '중간 명도의 또렷한 인상 (Medium · Clear Value)', '높은 채도의 투명한 선명함 (Bright · Clear)'],
    bestFor: '또렷하고 강렬한 인상과 세련된 도시적 매력을 완성합니다.',
    keyFinding: '쿨 베이스의 선명하고 투명한 Bright Clear 타입입니다.',
  },
  '겨울 딥': {
    summary: '겨울 딥 — 깊고 강렬한 쿨 베이스의 딥 다크 톤',
    characteristics: ['쿨 블루-레드 베이스의 깊은 색감 (Cool Dark Hue)', '낮은 명도의 강렬한 인상 (Deep · Dark Value)', '중간 채도의 신비로운 딥 톤 (Muted · Deep Cool)'],
    bestFor: '깊고 신비로운 카리스마와 강렬한 존재감을 자연스럽게 살려줍니다.',
    keyFinding: '쿨 베이스의 깊고 신비로운 Deep 다크 타입입니다.',
  },
};

interface Props {
  params: { id: string };
}

export const metadata = {
  title: 'PDF 리포트 | 컬러랩',
};

export default async function PdfPage({ params }: Props) {
  let session;
  try {
    session = await getTestSession(params.id);
  } catch {
    notFound();
  }

  if (!session.is_paid) redirect(`/pay/${params.id}`);
  if (!session.report_content) redirect(`/upload/${params.id}`);

  const colorType = session.result_type as PersonalColorType;
  const name = session.customer_name?.trim() || '';
  const intro = TYPE_INTRO[colorType];

  return (
    <PdfViewerClient
      sessionId={params.id}
      colorType={colorType}
      reportContent={session.report_content}
      createdAt={session.created_at}
      customerName={name || undefined}
      personalIntro={name ? {
        greeting: `${name}님, 안녕하세요. 컬러랩에서 분석한 ${name}님만의 컬러 가이드를 보내드려요.`,
        colorTypeDescription: {
          summary: intro.summary,
          characteristics: intro.characteristics,
          bestFor: intro.bestFor,
        },
        photoImpression: `${name}님의 테스트 응답을 기반으로 정밀 분석한 결과입니다. ${colorType} 타입의 특성이 잘 나타나 있습니다.`,
        keyFinding: `${name}님은 ${intro.keyFinding}`,
      } : undefined}
    />
  );
}
