'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface Props {
  amount: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^010\d{8}$/;

export default function SubscribeWidget({ amount }: Props) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ nextPayAt: string } | null>(null);

  const validate = (): boolean => {
    let ok = true;
    if (!EMAIL_RE.test(email)) { setEmailError('올바른 이메일을 입력해주세요.'); ok = false; } else setEmailError('');
    if (!PHONE_RE.test(phone)) { setPhoneError('010으로 시작하는 11자리 숫자를 입력해주세요.'); ok = false; } else setPhoneError('');
    return ok;
  };

  const handleSubscribe = async () => {
    if (!validate()) return;
    setError(null);
    setLoading(true);

    try {
      const customerId = `cl_cus_${crypto.randomUUID().replace(/-/g, '')}`;
      const PortOne = await import('@portone/browser-sdk/v2');

      const channelKey =
        process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_BILLING ||
        process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!;

      // 1) 카드 등록 → 빌링키 발급
      const response = await PortOne.requestIssueBillingKey({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey,
        billingKeyMethod: 'CARD',
        issueName: '컬러랩 정기 구독',
        customer: { customerId, email, phoneNumber: phone },
      });

      if (!response || response.code) {
        if (response?.code !== 'BILLING_KEY_CANCELLED') {
          setError(response?.message || '카드 등록 중 오류가 발생했어요.');
        }
        setLoading(false);
        return;
      }

      // 2) 서버에서 첫 달 청구 + 구독 등록
      const res = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billingKey: response.billingKey, customerId, email, phone }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || '정기결제 등록 중 오류가 발생했어요.');
        setLoading(false);
        return;
      }

      setDone({ nextPayAt: result.nextPayAt });
    } catch {
      setError('정기결제 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    const next = new Date(done.nextPayAt).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    return (
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6 text-center dark:border-violet-800 dark:bg-violet-900/20">
        <p className="mb-2 text-lg font-bold text-gray-900 dark:text-white">정기결제가 등록되었어요</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          첫 결제가 완료되었고, 다음 결제일은 <b>{next}</b> 입니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <label htmlFor="sub-email" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
          이메일 주소
        </label>
        <input
          id="sub-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
          placeholder="report@example.com"
          disabled={loading}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors disabled:opacity-60 dark:bg-gray-700 dark:text-gray-100',
            emailError ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-violet-400 dark:border-gray-600',
          )}
        />
        {emailError && <p className="mt-1.5 text-xs text-red-500">{emailError}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="sub-phone" className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">
          휴대폰 번호
        </label>
        <input
          id="sub-phone"
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value.replace(/[^0-9]/g, '')); if (phoneError) setPhoneError(''); }}
          placeholder="01012345678 (- 없이 입력)"
          maxLength={11}
          disabled={loading}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors disabled:opacity-60 dark:bg-gray-700 dark:text-gray-100',
            phoneError ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-violet-400 dark:border-gray-600',
          )}
        />
        {phoneError && <p className="mt-1.5 text-xs text-red-500">{phoneError}</p>}
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full rounded-2xl bg-[#7C3AED] py-4 text-base font-bold text-white shadow-lg shadow-violet-200 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? '처리 중...' : `카드 등록하고 정기결제 시작  (월 ₩${amount.toLocaleString()})`}
      </button>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">{error}</div>
      )}
    </div>
  );
}
