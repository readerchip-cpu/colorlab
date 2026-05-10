'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // 에러 모니터링 서비스 연동 시 여기에 추가 (e.g. Sentry)
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-5 text-center">
      <div className="mb-6 text-5xl">😵</div>
      <h1 className="mb-2 text-xl font-black text-gray-900">
        일시적인 오류가 발생했어요
      </h1>
      <p className="mb-8 text-sm leading-relaxed text-gray-500">
        잠시 후 다시 시도해주세요.
        <br />
        문제가 계속되면{' '}
        <a
          href="mailto:readerchip@gmail.com"
          className="text-[#7C3AED] hover:underline"
        >
          readerchip@gmail.com
        </a>
        으로 문의해주세요.
      </p>

      {process.env.NODE_ENV === 'development' && (
        <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-left font-mono text-xs text-red-600">
          {error.message}
          {error.digest && <span className="block mt-1 text-red-400">digest: {error.digest}</span>}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-xl border-2 border-gray-100 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-200"
        >
          홈으로
        </Link>
      </div>
    </main>
  );
}
