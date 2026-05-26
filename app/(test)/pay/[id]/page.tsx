import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTestSession } from '@/lib/utils/session';
import { TYPE_DISPLAY } from '@/lib/colorData';
import PaymentWidget from '@/components/payment/PaymentWidget';
import type { PersonalColorType } from '@/types';

interface Props {
  params: { id: string };
  searchParams: { error?: string; message?: string };
}

const PRICE = Number(process.env.PRICE ?? 4900);
const ORIGINAL_PRICE = 5900;
const DISCOUNT = ORIGINAL_PRICE - PRICE;

export const metadata: Metadata = {
  title: '정밀 분석 구매 | 컬러랩',
};

export default async function PayPage({ params, searchParams }: Props) {
  let session;
  try {
    session = await getTestSession(params.id);
  } catch {
    notFound();
  }

  if (session.is_paid) redirect(`/report/${params.id}`);
  if (!session.result_type) redirect('/test');

  const colorType = session.result_type as PersonalColorType;
  const displayName = TYPE_DISPLAY[colorType];
  const failError = searchParams.error;

  return (
    <main className="min-h-screen bg-gray-50 pb-16 dark:bg-gray-950">
      <div className="mx-auto max-w-lg px-5 pt-10">

        {/* 헤더 */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            href={`/result/${params.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-colors hover:text-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="뒤로가기"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">결제</p>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">정밀 분석 구매</h1>
          </div>
        </div>

        {/* 결제 실패 알림 (failUrl에서 리다이렉트 시) */}
        {failError && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-600 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
            {failError === 'USER_CANCEL'
              ? '결제가 취소됐어요. 다시 시도해주세요.'
              : '결제 중 오류가 발생했어요. 다시 시도해주세요.'}
          </div>
        )}

        {/* 주문 요약 */}
        <div className="mb-5 overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-gray-800">
          {/* 상품 정보 */}
          <div className="border-b border-gray-50 px-6 py-5 dark:border-gray-700">
            <div className="mb-1 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">컬러랩 퍼스널컬러 정밀 분석</p>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{displayName} 타입 맞춤 리포트</p>
              </div>
              <span className="mt-0.5 flex-shrink-0 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                1건
              </span>
            </div>
          </div>

          {/* 포함 항목 */}
          <div className="border-b border-gray-50 px-6 py-4 dark:border-gray-700">
            <p className="mb-2.5 text-xs font-semibold text-gray-400 dark:text-gray-500">포함 항목</p>
            <ul className="space-y-1.5">
              {[
                '정밀 타입 재분석 (사진 기반)',
                '메이크업 컬러 추천',
                '헤어 컬러 가이드',
                '패션 컬러 팔레트',
                '시즌별 스타일링',
                '맞춤 조언',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-violet-400">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 금액 */}
          <div className="px-6 py-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">정가</span>
              <span className="text-gray-400 line-through dark:text-gray-500">₩{ORIGINAL_PRICE.toLocaleString()}</span>
            </div>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium text-violet-600 dark:text-violet-400">얼리버드 할인</span>
              <span className="font-medium text-violet-600 dark:text-violet-400">
                -₩{DISCOUNT.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-gray-100">최종 결제금액</span>
              <div className="text-right">
                <span className="text-2xl font-black text-violet-700 dark:text-violet-400">
                  ₩{PRICE.toLocaleString()}
                </span>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  ₩{DISCOUNT.toLocaleString()} 절약
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 수단 선택 + 이메일 입력 */}
        <div className="rounded-3xl bg-white px-6 py-6 shadow-sm dark:bg-gray-800">
          <PaymentWidget sessionId={params.id} amount={PRICE} />
        </div>

        <p className="mt-5 text-center text-xs text-gray-400 dark:text-gray-500">
          결제는 포트원(KG이니시스)을 통해 안전하게 처리됩니다
        </p>
      </div>
    </main>
  );
}
