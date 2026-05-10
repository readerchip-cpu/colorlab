'use client';

import { useEffect, useRef, useState } from 'react';
import type { PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import { createPendingPayment } from '@/app/actions/payment';
import { cn } from '@/lib/utils/cn';

interface Props {
  sessionId: string;
  amount: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PaymentWidget({ sessionId, amount }: Props) {
  const widgetRef = useRef<PaymentWidgetInstance | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { loadPaymentWidget } = await import('@tosspayments/payment-widget-sdk');
      const widget = await loadPaymentWidget(
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!,
        sessionId, // 세션 ID를 고객 키로 활용
      );
      widget.renderPaymentMethods('#toss-payment-methods', { value: amount });
      widget.renderAgreement('#toss-agreement');
      widgetRef.current = widget;
      setReady(true);
    }
    init().catch(console.error);
  }, [sessionId, amount]);

  const handlePay = async () => {
    setError(null);

    // 이메일 유효성 검사
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setEmailError('올바른 이메일 형식이 아니에요.');
      return;
    }
    setEmailError('');

    if (!widgetRef.current) return;
    setIsLoading(true);

    try {
      const orderId = `colorlab_${sessionId}_${Date.now()}`;

      // 결제 전 DB에 pending 기록 생성 (이메일 저장)
      await createPendingPayment({ sessionId, orderId, amount, email });

      // Toss 결제 요청 — 성공 시 브라우저가 successUrl로 이동
      await widgetRef.current.requestPayment({
        orderId,
        orderName: '컬러랩 퍼스널컬러 정밀 분석',
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/confirm`,
        failUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`,
        customerEmail: email,
        customerName: '컬러랩 고객',
      });
    } catch (err: unknown) {
      // 사용자가 직접 닫은 경우 (USER_CANCEL) 는 에러로 표시하지 않음
      const msg = err instanceof Error ? err.message : '';
      if (!msg.includes('USER_CANCEL')) {
        setError('결제 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* 이메일 입력 */}
      <div className="mb-6">
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">
          이메일 주소
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          placeholder="report@example.com"
          disabled={isLoading}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors disabled:opacity-60',
            emailError
              ? 'border-red-300 focus:border-red-400'
              : 'border-gray-200 focus:border-violet-400',
          )}
        />
        {emailError ? (
          <p className="mt-1.5 text-xs text-red-500">{emailError}</p>
        ) : (
          <p className="mt-1.5 text-xs text-gray-400">
            결제 완료 후 리포트 링크를 발송해드려요
          </p>
        )}
      </div>

      {/* Toss 위젯 영역 */}
      <div
        id="toss-payment-methods"
        className={cn('mb-4', !ready && 'animate-pulse rounded-xl bg-gray-50 h-52')}
      />
      <div id="toss-agreement" className="mb-6" />

      {/* 오류 메시지 */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* 결제 버튼 */}
      <button
        onClick={handlePay}
        disabled={isLoading || !ready}
        className="w-full rounded-2xl bg-[#7C3AED] py-4 text-base font-bold text-white shadow-lg shadow-violet-200 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? '결제 처리 중...' : `₩${amount.toLocaleString()} 결제하기`}
      </button>
    </div>
  );
}
