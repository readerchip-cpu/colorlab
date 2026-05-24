'use client';

import { useState } from 'react';
import { createPendingPayment } from '@/app/actions/payment';
import { cn } from '@/lib/utils/cn';

interface Props {
  sessionId: string;
  amount: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type PayMethod = 'CARD' | 'KAKAO' | 'NAVER';

const isValidChannelKey = (key: string | undefined): boolean =>
  !!key &&
  key !== 'your_kakaopay_channel_key_here' &&
  key !== 'your_naverpay_channel_key_here' &&
  key.startsWith('channel-key-');

export default function PaymentWidget({ sessionId, amount }: Props) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loadingMethod, setLoadingMethod] = useState<PayMethod | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLoading = loadingMethod !== null;
  const showKakao = isValidChannelKey(process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_KAKAO);
  const showNaver = isValidChannelKey(process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_NAVER);
  const hasEasyPay = showKakao || showNaver;

  const validateEmail = (): boolean => {
    if (!email.trim()) { setEmailError('이메일을 입력해주세요.'); return false; }
    if (!EMAIL_RE.test(email)) { setEmailError('올바른 이메일 형식이 아니에요.'); return false; }
    setEmailError('');
    return true;
  };

  const handlePay = async (method: PayMethod) => {
    if (!validateEmail()) return;
    setError(null);
    setLoadingMethod(method);

    try {
      const paymentId = `colorlab_${sessionId}_${Date.now()}`;
      await createPendingPayment({ sessionId, orderId: paymentId, amount, email });

      const PortOne = await import('@portone/browser-sdk/v2');
      const { Currency, EasyPayProvider } = PortOne.Entity;

      const channelKey =
        method === 'KAKAO'
          ? process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_KAKAO!
          : method === 'NAVER'
            ? process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_NAVER!
            : process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!;

      const common = {
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey,
        paymentId,
        orderName: '컬러랩 퍼스널컬러 정밀 분석',
        totalAmount: amount,
        currency: Currency.KRW,
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/confirm`,
        customer: { email, fullName: '컬러랩 고객' },
      };

      const response =
        method === 'KAKAO'
          ? await PortOne.requestPayment({ ...common, payMethod: 'EASY_PAY', easyPay: { easyPayProvider: EasyPayProvider.KAKAOPAY } })
          : method === 'NAVER'
            ? await PortOne.requestPayment({ ...common, payMethod: 'EASY_PAY', easyPay: { easyPayProvider: EasyPayProvider.NAVERPAY } })
            : await PortOne.requestPayment({ ...common, payMethod: 'CARD' });

      // 팝업 방식(데스크탑 카드)은 response 객체가 반환됨
      if (response) {
        if (response.code) {
          if (response.code !== 'PAYMENT_CANCELLED') {
            setError(response.message || '결제 중 오류가 발생했어요.');
          }
        } else {
          window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/confirm?paymentId=${response.paymentId}&txId=${response.txId}`;
        }
      }
      // response undefined → 리다이렉트 방식 (이미 페이지 이동 중)
    } catch {
      setError('결제 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoadingMethod(null);
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
          <p className="mt-1.5 text-xs text-gray-400">결제 완료 후 리포트 링크를 발송해드려요</p>
        )}
      </div>

      {/* 간편결제 버튼 (채널 키 설정 시에만 표시) */}
      {hasEasyPay && (
        <>
          <div className="mb-3 space-y-2.5">
            {showKakao && (
              <button
                onClick={() => handlePay('KAKAO')}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FEE500] py-3.5 text-sm font-bold text-[#3C1E1E] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loadingMethod === 'KAKAO' ? '처리 중...' : <><KakaoIcon />카카오페이</>}
              </button>
            )}
            {showNaver && (
              <button
                onClick={() => handlePay('NAVER')}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#03C75A] py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loadingMethod === 'NAVER' ? '처리 중...' : <><NaverIcon />네이버페이</>}
              </button>
            )}
          </div>

          {/* 구분선 */}
          <div className="mb-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs text-gray-400">또는</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
        </>
      )}

      {/* 카드 결제 버튼 */}
      <button
        onClick={() => handlePay('CARD')}
        disabled={isLoading}
        className="w-full rounded-2xl bg-[#7C3AED] py-4 text-base font-bold text-white shadow-lg shadow-violet-200 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loadingMethod === 'CARD' ? '결제 처리 중...' : `신용·체크카드  ₩${amount.toLocaleString()}`}
      </button>

      {!hasEasyPay && (
        <p className="mt-2 text-center text-xs text-gray-400">카카오페이·네이버페이는 준비 중입니다.</p>
      )}

      {/* 오류 메시지 */}
      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1.5C4.858 1.5 1.5 4.134 1.5 7.375c0 2.106 1.4 3.953 3.514 5.004l-.9 3.35a.234.234 0 0 0 .362.255L8.27 13.19c.24.02.484.031.73.031 4.142 0 7.5-2.634 7.5-5.875S13.142 1.5 9 1.5Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M10.254 9.27 7.56 5H5v8h2.746V8.73L10.44 13H13V5h-2.746v4.27Z"
        fill="white"
      />
    </svg>
  );
}
