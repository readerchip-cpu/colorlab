'use client';

import { useState } from 'react';
import type { PersonalColorType } from '@/types';

interface Props {
  sessionId: string;
  colorType: PersonalColorType;
}

export default function ShareButtons({ sessionId, colorType }: Props) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () =>
    typeof window !== 'undefined'
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_BASE_URL}/result/${sessionId}`;

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `내 퍼스널컬러는 ${colorType}!`,
          text: `컬러랩에서 내 퍼스널컬러를 알아봤어요. 나는 ${colorType} 타입!`,
          url,
        });
      } catch {
        // 취소 시 무시
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard 미지원 환경 무시
    }
  };

  return (
    <section className="mx-auto max-w-xl px-5 py-6">
      <p className="mb-4 text-center text-sm font-medium text-gray-400">결과 공유하기</p>
      <div className="flex gap-3">
        {/* 카카오톡 — 모바일 native share sheet 활용 */}
        <button
          onClick={handleNativeShare}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FEE500] py-3.5 text-sm font-bold text-[#3C1E1E] transition-opacity hover:opacity-90"
        >
          <KakaoIcon />
          카카오톡
        </button>

        {/* 링크 복사 */}
        <button
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-gray-100 py-3.5 text-sm font-medium text-gray-600 transition-all hover:border-gray-200 hover:text-gray-800"
        >
          {copied ? (
            <>
              <span className="text-emerald-500">✓</span> 복사됨
            </>
          ) : (
            <>
              <LinkIcon />
              링크 복사
            </>
          )}
        </button>
      </div>
    </section>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1C4.58 1 1 3.91 1 7.5c0 2.323 1.554 4.365 3.9 5.513L4.05 17l4.75-3.093c.065.003.13.005.2.005 4.42 0 8-2.91 8-6.5S13.42 1 9 1z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M8.5 5.5l1-1a2.828 2.828 0 114 4l-2 2a2.828 2.828 0 01-4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M6.5 9.5l-1 1a2.828 2.828 0 11-4-4l2-2a2.828 2.828 0 014 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
