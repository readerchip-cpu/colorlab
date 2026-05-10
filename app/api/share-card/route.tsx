import { ImageResponse } from 'next/og';
import { getTestSession } from '@/lib/utils/session';
import { TYPE_DISPLAY, TYPE_PALETTE } from '@/lib/colorData';
import { getSeasonFromType, getToneFromType } from '@/lib/colorLogic';
import type { PersonalColorType, Season } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let fontCache: ArrayBuffer | null = null;

async function loadNotoSansKR(): Promise<ArrayBuffer | null> {
  if (fontCache) return fontCache;
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120',
        },
      },
    ).then((r) => r.text());

    const match = css.match(/url\(([^)]+\.woff2)\)/);
    if (!match) return null;

    const data = await fetch(match[1]).then((r) => r.arrayBuffer());
    fontCache = data;
    return data;
  } catch {
    return null;
  }
}

const SEASON_BG: Record<Season, [string, string]> = {
  봄: ['#FFF5EE', '#FFE4C4'],
  여름: ['#F0F0FF', '#DDE0FF'],
  가을: ['#FFFAF0', '#FFE8B0'],
  겨울: ['#F0F0F8', '#DCDCF0'],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return new Response('Missing session_id', { status: 400 });
  }

  let session;
  try {
    session = await getTestSession(sessionId);
  } catch {
    return new Response('Session not found', { status: 404 });
  }

  if (!session.result_type) {
    return new Response('No result type', { status: 400 });
  }

  const colorType = session.result_type as PersonalColorType;
  const displayName = TYPE_DISPLAY[colorType];
  const palette = TYPE_PALETTE[colorType];
  const season = getSeasonFromType(colorType);
  const tone = getToneFromType(colorType);
  const [bgFrom, bgTo] = SEASON_BG[season];
  const toneStyle =
    tone === '웜톤'
      ? { bg: '#FEF3C7', color: '#92400E' }
      : { bg: '#E0E7FF', color: '#3730A3' };

  const fontData = await loadNotoSansKR();

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: `linear-gradient(135deg, ${bgFrom} 0%, ${bgTo} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 68px',
          fontFamily: fontData ? '"Noto Sans KR"' : 'system-ui, sans-serif',
        }}
      >
        {/* 상단 바 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 52,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 12, height: 12,
                borderRadius: '50%',
                background: '#7C3AED',
              }}
            />
            <span style={{ fontSize: 28, fontWeight: 800, color: '#7C3AED', letterSpacing: '-0.5px' }}>
              컬러랩
            </span>
          </div>
          <span style={{ fontSize: 15, color: '#9CA3AF', letterSpacing: '0.12em' }}>
            PERSONAL COLOR ANALYSIS
          </span>
        </div>

        {/* 메인 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: 20, color: '#9CA3AF', marginBottom: 14 }}>
            나의 퍼스널컬러는
          </p>
          <h1
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: '#111827',
              margin: '0 0 10px',
              lineHeight: 1,
              letterSpacing: '-2px',
            }}
          >
            {colorType}
          </h1>
          <p style={{ fontSize: 22, color: '#6B7280', marginBottom: 48 }}>
            {displayName}
          </p>

          {/* 컬러 칩 + 톤 배지 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {palette.map(({ hex, name }) => (
              <div
                key={hex}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
              >
                <div
                  style={{
                    width: 72, height: 72,
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

            <div
              style={{
                marginLeft: 20,
                padding: '10px 26px',
                borderRadius: 999,
                background: toneStyle.bg,
                color: toneStyle.color,
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              {tone}
            </div>
          </div>
        </div>

        {/* 하단 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 15, color: '#9CA3AF' }}>colorlab.kr</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [{ name: 'Noto Sans KR', data: fontData, weight: 700 as const }]
        : [],
    },
  );
}
