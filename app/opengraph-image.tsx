import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = '컬러랩 | AI 퍼스널컬러 진단';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// 8가지 타입 대표색 (배치용)
const COLOR_CHIPS = [
  { color: '#FFB6C1', label: '봄 라이트' },
  { color: '#FFD580', label: '봄 브라이트' },
  { color: '#E6C8D8', label: '여름 라이트' },
  { color: '#C4A0A0', label: '여름 뮤트' },
  { color: '#C8A882', label: '가을 뮤트' },
  { color: '#7B3F00', label: '가을 딥' },
  { color: '#CC0000', label: '겨울 브라이트' },
  { color: '#1C1C2E', label: '겨울 딥' },
];

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

export default async function Image() {
  const fontData = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 72px',
          fontFamily: fontData ? '"Noto Sans KR"' : 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 장식 원 */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: 320,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />

        {/* 상단 로고 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#fff',
            }}
          />
          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '-0.5px',
            }}
          >
            컬러랩
          </span>
          <span
            style={{
              marginLeft: 8,
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.15em',
            }}
          >
            COLORLAB.KR
          </span>
        </div>

        {/* 메인 카피 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.7)',
              margin: 0,
              letterSpacing: '0.05em',
            }}
          >
            AI 퍼스널컬러 진단 서비스
          </p>
          <h1
            style={{
              fontSize: 68,
              fontWeight: 900,
              color: '#fff',
              margin: 0,
              lineHeight: 1.15,
              letterSpacing: '-2px',
            }}
          >
            나에게 진짜
            <br />
            어울리는 색, 컬러랩
          </h1>
          <p
            style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.75)',
              margin: 0,
            }}
          >
            AI가 분석하는 퍼스널컬러 진단
          </p>
        </div>

        {/* 색상 칩 2열 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* 1행 */}
          <div style={{ display: 'flex', gap: 12 }}>
            {COLOR_CHIPS.slice(0, 4).map(({ color, label }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: color,
                    border: '3px solid rgba(255,255,255,0.35)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  }}
                />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          {/* 2행 */}
          <div style={{ display: 'flex', gap: 12 }}>
            {COLOR_CHIPS.slice(4).map(({ color, label }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: color,
                    border: '3px solid rgba(255,255,255,0.35)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  }}
                />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
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
