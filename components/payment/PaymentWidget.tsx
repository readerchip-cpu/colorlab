'use client';

import { loadPaymentWidget, ANONYMOUS } from '@tosspayments/payment-widget-sdk';
import { useEffect, useRef, useState } from 'react';
import type { PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import { createPendingPayment } from '@/app/actions/payment';
import { cn } from '@/lib/utils/cn';

interface Props {
  sessionId: string;
  amount: number;
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PaymentWidget({ sessionId, amount }: Props) {
  const widgetRef = useRef<PaymentWidgetInstance | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initWidget() {
      const paymentWidget = await loadPaymentWidget(clientKey, ANONYMOUS);
      paymentWidget.renderPaymentMethods('#payment-method', { value: amount });
      paymentWidget.renderAgreement('#agreement');
      widgetRef.current = paymentWidget;
      setReady(true);
    }
    initWidget().catch(console.error);
  }, [amount]);

  const handlePay = async () => {
    setError(null);

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

      await createPendingPayment({ sessionId, orderId, amount, email });

      await widgetRef.current.requestPayment({
        orderId,
        orderName: '컬러랩 퍼스널컬러 정밀 분석',
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/confirm`,
        failUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`,
        customerEmail: email,
      });
    } catch (err: unknown) {
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

      {/* Toss 위젯 렌더링 영역 */}
      <div
        id="payment-method"
        className={cn('mb-4', !ready && 'h-52 animate-pulse rounded-xl bg-gray-50')}
      />
      <div id="agreement" className="mb-6" />

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

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
