'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  pdfHref: string;
  customerName: string;
  typeNameKr: string;
  accentColor: string;
}

export function ShareButtons({ pdfHref, customerName, typeNameKr, accentColor }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleKakao = () => {
    const Kakao = (window as any).Kakao;
    if (!Kakao) return;

    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
    }

    const url = window.location.href;
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${customerName}님의 퍼스널컬러는 ${typeNameKr}`,
        description: '컬러랩에서 AI로 분석한 나의 퍼스널컬러 리포트',
        imageUrl: `${window.location.origin}/og-image.png`,
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [
        {
          title: '나도 진단하기',
          link: {
            mobileWebUrl: window.location.origin,
            webUrl: window.location.origin,
          },
        },
      ],
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API 미지원 브라우저 대응
      const el = document.createElement('input');
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      <Link
        href={pdfHref}
        className="flex w-full items-center justify-center rounded-2xl py-4 text-base font-bold text-white shadow-lg transition hover:opacity-90"
        style={{ backgroundColor: accentColor }}
      >
        PDF 보기 / 다운로드
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleKakao}
          className="rounded-2xl bg-[#FEE500] py-4 text-sm font-bold text-gray-900 transition hover:bg-[#F4DC00]"
        >
          카카오톡 공유
        </button>

        <button
          onClick={handleCopy}
          className="rounded-2xl border-2 py-4 text-sm font-bold transition"
          style={{ borderColor: accentColor, color: copied ? '#16a34a' : accentColor }}
        >
          {copied ? '✓ 복사됨' : '링크 복사'}
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        친구에게 결과를 공유하고 싶다면
        <br />
        위 공유 버튼을 활용해보세요!
      </p>
    </div>
  );
}
