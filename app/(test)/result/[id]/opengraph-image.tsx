import { ImageResponse } from 'next/og';
import { getTestSession } from '@/lib/utils/session';
import { TYPE_DISPLAY, TYPE_PALETTE } from '@/lib/colorData';
import { getSeasonFromType, getToneFromType } from '@/lib/colorLogic';
import type { PersonalColorType, Season } from '@/types';

export const runtime = 'nodejs';
export const alt = '내 퍼스널컬러 분석 결과';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// 시즌별 배경 색상 (Tailwind 클래스 불가 — 인라인 RGB)
const SEASON_BG: Record<Season, { from: string; to: string }> = {
  봄: { from: '#FFF5EE', to: '#FFE8D0' },
  여름: { from: '#EEF2FF', to: '#DDE0FF' },
  가을: { from: '#FFFAF0', to: '#FFE8B0' },
  겨울: { from: '#F0F0FA', to: '#DCDCF0' },
};

const TONE_BADGE: Record<string, { bg: string; color: string }> = {
  웜톤: { bg: '#FEF3C7', color: '#92400E' },
  쿨톤: { bg: '#E0E7FF', color: '#3730A3' },
};

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' } },
    ).then((r) => r.text());
    const match = css.match(/url\(([^)]+\.woff2)\)/);
    if (!match) return null;
    return await fetch(match[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: { id: string } }) {
  let colorType: PersonalColorType = '봄 라이트';
  let displayName = '';
  let palette: ReturnType<typeof TYPE_PALETTE[PersonalColorType]> | null = null;
  let season: Season = '봄';
  let tone = '웜톤';

  try {
    const session = await getTestSession(params.id);
    if (session.result_type) {
      colorType = session.result_type as PersonalColorType;
      displayName = TYPE_DISPLAY[colorType] ?? '';
      palette = TYPE_PALETTE[colorType] ?? null;
      season = getSeasonFromType(colorType);
      tone = getToneFromType(colorType);
    }
  } catch {
    // 세션 조회 실패 시 기본값 유지
  }

  const fontData = await loadFont();
  const bg = SEASON_BG[season];
  const toneBadge = TONE_BADGE[tone] ?? TONE_BADGE['쿨톤'];

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: `linear-gradient(135deg, ${bg.from} 0%, ${bg.to} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          padding: '52px 68px',
          fontFamily: fontData ? '"Noto Sans KR"' : 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 장식 원 */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'rgba(124,58,237,0.06)',
          }}
        />

        {/* 상단 바 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 48,
          }}
        >
          {/* 컬러랩 로고 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#7C3AED',
              }}
            />
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: '#7C3AED',
                letterSpacing: '-0.5px',
              }}
            >
              컬러랩
            </span>
          </div>

          {/* 안내 텍스트 */}
          <span style={{ fontSize: 14, color: '#9CA3AF', letterSpacing: '0.1em' }}>
            PERSONAL COLOR ANALYSIS
          </span>
        </div>

        {/* 메인 콘텐츠 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: 18, color: '#9CA3AF', margin: '0 0 12px', letterSpacing: '0.05em' }}>
            나의 퍼스널컬러는
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 10 }}>
            <h1
              style={{
                fontSize: 88,
                fontWeight: 900,
                color: '#111827',
                margin: 0,
                lineHeight: 1,
                letterSpacing: '-2px',
              }}
            >
              {colorType}
            </h1>

            {/* 톤 배지 */}
            <div
              style={{
                padding: '10px 22px',
                borderRadius: 999,
                background: toneBadge.bg,
                color: toneBadge.color,
                fontSize: 20,
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              {tone}
            </div>
          </div>

          {displayName && (
            <p style={{ fontSize: 22, color: '#6B7280', margin: '0 0 40px' }}>
              {displayName}
            </p>
          )}

          {/* 컬러 팔레트 */}
          {palette && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {palette.map(({ hex, name }) => (
                <div
                  key={hex}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: '50%',
                      background: hex,
                      boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
                      border: '4px solid rgba(255,255,255,0.85)',
                    }}
                  />
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
                    {name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 하단 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 14, color: '#9CA3AF' }}>colorlab.kr</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: 'Noto Sans KR', data: fontData, weight: 700 as const }]
        : [],
    },
  );
}
