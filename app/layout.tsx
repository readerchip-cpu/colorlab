import type { Metadata, Viewport } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '@/components/ui/ThemeToggle';
import KakaoScript from '@/components/KakaoScript';
import { SessionTracker } from '@/components/analytics/SessionTracker';
import Script from 'next/script';
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
    '화장한 그대로 OK. AI가 90초만에 분석하는 퍼스널컬러 진단. 사진은 즉시 삭제, 사람은 안 봐요. 4,900원.',
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
  maximumScale: 5,
  userScalable: true,
  themeColor: '#7C3AED',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${geistMono.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-[family-name:var(--font-noto)] antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SessionTracker />
          {children}
          <ThemeToggle />
          <KakaoScript />
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1724677232068213');
            fbq('track', 'PageView');
          `}</Script>
          <noscript>
            <img height="1" width="1" style={{display:'none'}}
              src="https://www.facebook.com/tr?id=1724677232068213&ev=PageView&noscript=1"
            />
          </noscript>
          {/* Danggeun Market Code */}
          <Script id="karrot-pixel" strategy="afterInteractive">{`
            (function() {
              var s = document.createElement('script');
              s.src = 'https://karrot-pixel.business.daangn.com/karrot-pixel.js';
              s.async = true;
              s.onload = function() {
                window.karrotPixel.init('1779948295388137001');
                window.karrotPixel.track('ViewPage');
              };
              document.head.appendChild(s);
            })();
          `}</Script>
          {/* End Danggeun Market Code */}
        </ThemeProvider>
      </body>
    </html>
  );
}
