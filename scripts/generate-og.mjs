/**
 * OG 이미지 생성 스크립트
 * 실행 전: npm install -D satori sharp
 * 실행:    node scripts/generate-og.mjs
 *
 * 결과물: public/og-image.png (1200×630)
 */

import satori from 'satori';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_PATH = join(ROOT, 'public', 'og-image.png');

// ── 8가지 타입 대표색 ────────────────────────────────────────
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

// ── Google Fonts에서 Noto Sans KR 로드 ───────────────────────
async function loadFont() {
  console.log('폰트 로딩 중...');
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' } },
    ).then((r) => r.text());

    const match = css.match(/url\(([^)]+\.woff2)\)/);
    if (!match) throw new Error('woff2 URL을 찾을 수 없습니다.');

    const buffer = await fetch(match[1]).then((r) => r.arrayBuffer());
    console.log('폰트 로드 완료');
    return buffer;
  } catch (err) {
    console.warn('폰트 로드 실패 (시스템 폰트 사용):', err.message);
    return null;
  }
}

// ── satori 엘리먼트 정의 ─────────────────────────────────────
// satori는 JSX 없이 순수 JS 객체도 받습니다
function buildElement() {
  const chip = (color, label, size = 52) => ({
    type: 'div',
    props: {
      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
              border: '3px solid rgba(255,255,255,0.35)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            },
            children: '',
          },
        },
        {
          type: 'span',
          props: {
            style: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },
            children: label,
          },
        },
      ],
    },
  });

  return {
    type: 'div',
    props: {
      style: {
        width: 1200,
        height: 630,
        background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 72px',
        fontFamily: '"Noto Sans KR", system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        // 장식 원
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: -80,
              right: -80,
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            },
            children: '',
          },
        },

        // 로고
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 10 },
            children: [
              {
                type: 'div',
                props: {
                  style: { width: 14, height: 14, borderRadius: '50%', background: '#fff' },
                  children: '',
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    fontSize: 26,
                    fontWeight: 900,
                    color: 'rgba(255,255,255,0.95)',
                    letterSpacing: '-0.5px',
                  },
                  children: '컬러랩',
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    marginLeft: 8,
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.15em',
                  },
                  children: 'COLORLAB.KR',
                },
              },
            ],
          },
        },

        // 메인 카피
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: 16 },
            children: [
              {
                type: 'p',
                props: {
                  style: { fontSize: 18, color: 'rgba(255,255,255,0.7)', margin: 0, letterSpacing: '0.05em' },
                  children: 'AI 퍼스널컬러 진단 서비스',
                },
              },
              {
                type: 'h1',
                props: {
                  style: {
                    fontSize: 68,
                    fontWeight: 900,
                    color: '#fff',
                    margin: 0,
                    lineHeight: 1.15,
                    letterSpacing: '-2px',
                  },
                  children: '나에게 진짜 어울리는 색, 컬러랩',
                },
              },
              {
                type: 'p',
                props: {
                  style: { fontSize: 24, color: 'rgba(255,255,255,0.75)', margin: 0 },
                  children: 'AI가 분석하는 퍼스널컬러 진단',
                },
              },
            ],
          },
        },

        // 컬러 칩
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: 10 },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', gap: 12 },
                  children: COLOR_CHIPS.slice(0, 4).map(({ color, label }) => chip(color, label)),
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', gap: 12 },
                  children: COLOR_CHIPS.slice(4).map(({ color, label }) => chip(color, label)),
                },
              },
            ],
          },
        },
      ],
    },
  };
}

// ── 메인 ─────────────────────────────────────────────────────
async function main() {
  const fontData = await loadFont();
  const fonts = fontData
    ? [{ name: 'Noto Sans KR', data: fontData, weight: 700, style: 'normal' }]
    : [];

  console.log('SVG 생성 중 (satori)...');
  const svg = await satori(buildElement(), {
    width: 1200,
    height: 630,
    fonts,
  });

  console.log('PNG 변환 중 (sharp)...');
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  const publicDir = join(ROOT, 'public');
  if (!existsSync(publicDir)) await mkdir(publicDir, { recursive: true });

  await writeFile(OUT_PATH, png);
  console.log(`✅ 생성 완료: ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('❌ 생성 실패:', err);
  process.exit(1);
});
