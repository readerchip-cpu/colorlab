'use client';

import { useState } from 'react';
import type { PersonalColorType } from '@/types';

interface Props {
  sessionId: string;
  colorType: PersonalColorType;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://colorlab.kr';

export default function ShareModal({ sessionId, colorType }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const shareUrl = `${BASE_URL}/result/${sessionId}`;
  const cardUrl = `/api/share-card?session_id=${sessionId}`;
  const cardAbsoluteUrl = `${BASE_URL}/api/share-card?session_id=${sessionId}`;

  const isMobile =
    typeof navigator !== 'undefined' &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const close = () => setIsOpen(false);

  // ── 카카오톡 ─────────────────────────────────────────────
  const handleKakao = () => {
    if (typeof window === 'undefined' || !window.Kakao?.isInitialized()) {
      showToast('카카오 SDK를 불러오는 중이에요. 잠시 후 다시 시도해주세요.');
      close();
      return;
    }
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `내 퍼스널컬러는 ${colorType}!`,
        description: '컬러랩 AI 퍼스널컬러 진단에서 확인해봤어요.',
        imageUrl: cardAbsoluteUrl,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [
        {
          title: '나도 진단받기',
          link: { mobileWebUrl: BASE_URL, webUrl: BASE_URL },
        },
      ],
    });
    close();
  };

  // ── 인스타그램 ────────────────────────────────────────────
  const handleInstagram = async () => {
    setDownloading(true);
    try {
      const res = await fetch(cardUrl);
      if (!res.ok) throw new Error('fetch_failed');
      const blob = await res.blob();
      const file = new File([blob], 'colorlab-result.png', { type: 'image/png' });

      // 모바일: 네이티브 공유 시트 (인스타그램 포함)
      if (isMobile && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `내 퍼스널컬러는 ${colorType}!`,
        });
      } else {
        // 데스크탑: 이미지 다운로드
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'colorlab-result.png';
        a.click();
        URL.revokeObjectURL(url);
        showToast('이미지를 저장했어요! 인스타그램에서 공유해보세요.');
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        showToast('이미지 생성에 실패했어요. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setDownloading(false);
      close();
    }
  };

  // ── 링크 복사 ─────────────────────────────────────────────
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        close();
      }, 1500);
    } catch {
      showToast('복사에 실패했어요. URL을 직접 복사해주세요.');
    }
  };

  return (
    <>
      {/* 트리거 버튼 */}
      <section className="mx-auto max-w-xl px-5 py-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-gray-100 py-3.5 text-sm font-semibold text-gray-600 transition-all hover:border-gray-200 hover:text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200"
        >
          <ShareIcon />
          결과 공유하기
        </button>
      </section>

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-24 left-0 right-0 z-[60] px-5">
          <div className="mx-auto max-w-xl rounded-2xl bg-gray-900 px-4 py-3 text-center text-sm text-white shadow-lg">
            {toast}
          </div>
        </div>
      )}

      {/* 바텀 시트 */}
      {isOpen && (
        <>
          {/* 딤 오버레이 */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={close}
          />

          {/* 시트 */}
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white px-5 pb-10 pt-4 shadow-2xl dark:bg-gray-900">
            {/* 핸들바 */}
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />

            {/* 헤더 */}
            <div className="mb-7 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                공유하기
              </h3>
              <button
                onClick={close}
                aria-label="닫기"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <CloseIcon />
              </button>
            </div>

            {/* 공유 옵션 */}
            <div className="mb-7 flex justify-around">

              {/* 카카오톡 */}
              <button
                onClick={handleKakao}
                className="flex flex-col items-center gap-2.5"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FEE500] shadow-sm transition-transform hover:scale-105 active:scale-95">
                  <KakaoIcon />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  카카오톡
                </span>
              </button>

              {/* 인스타그램 */}
              <button
                onClick={handleInstagram}
                disabled={downloading}
                className="flex flex-col items-center gap-2.5 disabled:opacity-60"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] shadow-sm transition-transform hover:scale-105 active:scale-95">
                  {downloading ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <InstagramIcon />
                  )}
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {downloading ? '저장 중...' : isMobile ? '인스타그램' : '이미지 저장'}
                </span>
              </button>

              {/* 링크 복사 */}
              <button
                onClick={handleCopy}
                className="flex flex-col items-center gap-2.5"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm transition-all hover:scale-105 active:scale-95 ${
                    copied
                      ? 'bg-emerald-500'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  {copied ? <CheckIcon /> : <LinkIcon />}
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {copied ? '복사됨!' : '링크 복사'}
                </span>
              </button>
            </div>

            {/* 취소 */}
            <button
              onClick={close}
              className="w-full rounded-2xl bg-gray-50 py-3.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              취소
            </button>
          </div>
        </>
      )}
    </>
  );
}

// ── 아이콘 ─────────────────────────────────────────────────

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="13" cy="3" r="1.8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="13" cy="13" r="1.8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="3" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.7 7.1l6.6-3.2M4.7 8.9l6.6 3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 5.533 2 9.9c0 2.917 1.933 5.487 4.85 6.938L5.8 21l6.2-3.96c.065.003.13.005.2.005 5.523 0 10-3.533 10-7.9C22 5.533 17.523 2 12 2z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M11.5 7.5l1.5-1.5a3.536 3.536 0 015 5l-2.5 2.5a3.536 3.536 0 01-5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8.5 12.5l-1.5 1.5a3.536 3.536 0 01-5-5l2.5-2.5a3.536 3.536 0 015 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10l5 5 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
