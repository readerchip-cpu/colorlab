'use client';

import { useState, useEffect } from 'react';

interface ShareButtonsProps {
  pdfHref: string;
  customerName: string;
  typeNameKr: string;
  accentColor: string;
  sessionId: string;
}

export function ShareButtons({ pdfHref, customerName, typeNameKr, accentColor, sessionId }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const Kakao = (window as any).Kakao;
    if (!Kakao) return;
    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
    }
    if (Kakao.Channel) {
      Kakao.Channel.createAddChannelButton({
        container: '#kakao-channel-button',
        channelPublicId: '_yDrxbX',
      });
    }
  }, []);

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
        {
          title: '카카오톡 채널 추가',
          link: {
            mobileWebUrl: 'https://pf.kakao.com/_yDrxbX',
            webUrl: 'https://pf.kakao.com/_yDrxbX',
          },
        },
      ],
    });
  };

  const handleInstagram = async () => {
    try {
      const res = await fetch(`/api/share-card?session=${sessionId}`);
      const blob = await res.blob();
      const file = new File([blob], 'colorlab-result.png', { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${typeNameKr} 퍼스널컬러` });
      } else {
        // 파일 공유 미지원 시 이미지 다운로드로 대체
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'colorlab-result.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // 사용자가 취소하거나 오류 발생 시 무시
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: `${customerName}님의 퍼스널컬러 — ${typeNameKr}`,
        text: '컬러랩 AI 퍼스널컬러 정밀 분석 결과',
        url: window.location.href,
      });
    } catch {
      // 사용자가 취소하거나 미지원 브라우저
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
      <a
        href={pdfHref}
        className="flex w-full items-center justify-center rounded-2xl py-4 text-base font-bold text-white shadow-lg transition hover:opacity-90"
        style={{ backgroundColor: accentColor }}
      >
        PDF 보기 / 다운로드
      </a>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleKakao}
          className="rounded-2xl bg-[#FEE500] py-4 text-sm font-bold text-gray-900 transition hover:bg-[#F4DC00]"
        >
          카카오톡 공유
        </button>

        <button
          onClick={handleInstagram}
          className="rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 py-4 text-sm font-bold text-white transition hover:opacity-90"
        >
          인스타그램 공유
        </button>

        <button
          onClick={handleCopy}
          className="rounded-2xl border-2 py-4 text-sm font-bold transition"
          style={{ borderColor: accentColor, color: copied ? '#16a34a' : accentColor }}
        >
          {copied ? '✓ 복사됨' : '링크 복사'}
        </button>

        {isMobile && typeof navigator !== 'undefined' && 'share' in navigator ? (
          <button
            onClick={handleNativeShare}
            className="rounded-2xl border-2 border-gray-200 py-4 text-sm font-bold text-gray-600 transition hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
          >
            더보기
          </button>
        ) : (
          <a
            href={pdfHref}
            className="flex items-center justify-center rounded-2xl border-2 border-gray-200 py-4 text-sm font-bold text-gray-600 transition hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"
          >
            PDF 저장
          </a>
        )}
      </div>

      <div id="kakao-channel-button" className="flex justify-center mt-4" />

      <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        친구에게 결과를 공유하고 싶다면
        <br />
        위 공유 버튼을 활용해보세요!
      </p>
    </div>
  );
}
