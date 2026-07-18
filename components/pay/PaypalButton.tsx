'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  sessionId: string;
}

// PayPal SDK 타입은 최소한만 선언 (any 허용)
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paypal?: any;
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export default function PaypalButton({ sessionId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'processing' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!CLIENT_ID) {
      setStatus('error');
      setError('PayPal 설정이 없습니다. (NEXT_PUBLIC_PAYPAL_CLIENT_ID)');
      return;
    }

    let cancelled = false;

    const renderButtons = () => {
      if (renderedRef.current || cancelled || !window.paypal || !containerRef.current) return;
      renderedRef.current = true;
      setStatus('ready');

      window.paypal
        .Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
          createOrder: async () => {
            const res = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId }),
            });
            const data = await res.json();
            if (!res.ok || !data.orderID) {
              throw new Error(data.error || 'create order failed');
            }
            return data.orderID as string;
          },
          onApprove: async (data: { orderID: string }) => {
            setStatus('processing');
            try {
              const res = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID: data.orderID, sessionId }),
              });
              const result = await res.json();
              if (!res.ok || !result.success) {
                setStatus('error');
                setError('결제는 완료됐지만 처리 중 오류가 발생했어요. 고객센터에 문의해주세요.');
                return;
              }
              window.location.href = `/upload/${sessionId}`;
            } catch {
              setStatus('error');
              setError('결제 확인 중 오류가 발생했어요. 고객센터에 문의해주세요.');
            }
          },
          onError: () => {
            setStatus('error');
            setError('PayPal 결제 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
          },
          onCancel: () => {
            // 사용자가 취소 — 조용히 무시
          },
        })
        .render(containerRef.current);
    };

    if (window.paypal) {
      renderButtons();
      return () => {
        cancelled = true;
      };
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-paypal-sdk]');
    if (existing) {
      existing.addEventListener('load', renderButtons);
      return () => {
        cancelled = true;
        existing.removeEventListener('load', renderButtons);
      };
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD&disable-funding=venmo`;
    script.async = true;
    script.dataset.paypalSdk = 'true';
    script.onload = renderButtons;
    script.onerror = () => {
      setStatus('error');
      setError('PayPal을 불러오지 못했어요. 네트워크를 확인하고 새로고침해주세요.');
    };
    document.body.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (status === 'processing') {
    return (
      <div className="flex items-center justify-center gap-3 py-6 text-sm text-gray-500 dark:text-gray-400">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-[#7C3AED]" />
        결제 확인 중이에요...
      </div>
    );
  }

  return (
    <div>
      {status === 'loading' && (
        <div className="py-4 text-center text-sm text-gray-400 dark:text-gray-500">
          PayPal 불러오는 중...
        </div>
      )}
      <div ref={containerRef} />
      {error && (
        <div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
