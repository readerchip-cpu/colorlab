'use client';

import { useState } from 'react';

interface Props {
  sessionId: string;
}

export default function ShareCardButton({ sessionId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const cardUrl = `/api/share-card?session_id=${sessionId}`;

      // 모바일: 네이티브 공유 시트로 이미지 파일 공유
      if (navigator.canShare?.({ files: [new File([], 'test.png')] })) {
        const res = await fetch(cardUrl);
        if (!res.ok) throw new Error();
        const blob = await res.blob();
        const file = new File([blob], 'colorlab-result.png', { type: 'image/png' });
        await navigator.share({ files: [file], title: '내 퍼스널컬러 결과 카드' });
      } else {
        // 데스크탑: 새 탭으로 이미지 열기 (저장 가능)
        window.open(cardUrl, '_blank', 'noopener');
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('카드 생성에 실패했어요. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-violet-200 bg-violet-50 py-3.5 text-sm font-semibold text-violet-700 transition-all hover:bg-violet-100 disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
            카드 생성 중...
          </>
        ) : (
          <>
            <span className="text-base">🎨</span>
            SNS 공유 카드 만들기
          </>
        )}
      </button>
      {error && (
        <p className="mt-1.5 text-center text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
