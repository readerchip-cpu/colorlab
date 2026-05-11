import type { Metadata, Viewport } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '@/components/ui/ThemeToggle';
import KakaoScript from '@/components/KakaoScript';
import './globals.css';

// 한국어 본문용 — 필요한 weight만 로드
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto',
  display: 'swap',
});

// 코드·hex 색상 표기용
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://colorlab.kr';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: '컬러랩 | AI 퍼스널컬러 진단',
    template: '%s | 컬러랩',
  },
  description:
    '10문항 + AI 사진 분석으로 나만의 퍼스널컬러를 정확하게 알아보세요. 메이크업·헤어·패션 맞춤 가이드 제공.',
  keywords: ['퍼스널컬러', '퍼스널컬러 진단', 'AI 퍼스널컬러', '봄여름가을겨울', '웜톤 쿨톤', '컬러랩'],
  authors: [{ name: '컬러랩' }],
  creator: '컬러랩',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: BASE_URL,
    siteName: '컬러랩',
    title: '컬러랩 | AI 퍼스널컬러 진단',
    description: '나에게 진짜 어울리는 색, 10분 만에 알아보세요.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: '컬러랩 AI 퍼스널컬러 진단',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '컬러랩 | AI 퍼스널컬러 진단',
    description: '나에게 진짜 어울리는 색, 10분 만에 알아보세요.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // 모바일 핀치줌 제한 (뷰티 앱 UX 관행)
  themeColor: '#7C3AED',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${geistMono.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-[family-name:var(--font-noto)] antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <ThemeToggle />
          <KakaoScript />
        </ThemeProvider>
      </body>
    </html>
  );
}
