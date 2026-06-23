import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '결제 완료 - 컬러랩',
  description: '컬러랩 퍼스널컬러 정밀 분석 리포트 결제가 완료되었습니다.',
};

// PG 심사 제출용 결제 완료(주문 완료) 화면 — 실제 결제 흐름과 무관한 정적 안내 페이지
export default function PaymentCompletePage() {
  const order = {
    orderNo: 'cl_20260623_0001',
    productName: '컬러랩 퍼스널컬러 정밀 분석',
    amount: 4900,
    method: '신용·체크카드',
    paidAt: '2026-06-23 14:32',
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      {/* 성공 아이콘 */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      </div>

      {/* 안내 문구 */}
      <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
        결제가 완료되었습니다
      </h1>
      <p className="mb-10 text-center text-sm text-gray-500 dark:text-gray-400">
        주문이 정상적으로 접수되었어요. 입력하신 이메일로 리포트 링크를 발송해드립니다.
      </p>

      {/* 주문 정보 */}
      <div className="rounded-2xl border border-gray-200 p-6 dark:border-gray-700">
        <h2 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">주문 정보</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 dark:text-gray-400">주문번호</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">{order.orderNo}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 dark:text-gray-400">상품명</dt>
            <dd className="text-right font-medium text-gray-900 dark:text-gray-100">{order.productName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 dark:text-gray-400">결제수단</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">{order.method}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500 dark:text-gray-400">결제일시</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">{order.paidAt}</dd>
          </div>
          <div className="mt-3 flex justify-between gap-4 border-t border-gray-200 pt-3 dark:border-gray-700">
            <dt className="font-bold text-gray-900 dark:text-white">결제금액</dt>
            <dd className="text-base font-bold text-[#7C3AED]">₩{order.amount.toLocaleString()}</dd>
          </div>
        </dl>
      </div>

      {/* 버튼 */}
      <div className="mt-8 space-y-3">
        <Link
          href="/"
          className="block w-full rounded-2xl bg-[#7C3AED] py-4 text-center text-base font-bold text-white shadow-lg shadow-violet-200 transition-opacity hover:opacity-90"
        >
          홈으로 돌아가기
        </Link>
        <Link
          href="/refund"
          className="block w-full text-center text-xs text-gray-400 underline-offset-2 hover:underline dark:text-gray-500"
        >
          환불 정책 보기
        </Link>
      </div>

      {/* 사업자 정보 */}
      <div className="mt-12 border-t border-gray-200 pt-6 dark:border-gray-700">
        <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
          <p>상호명: 컬러랩 · 대표자: 이형진</p>
          <p>사업자등록번호: 602-18-96743</p>
          <p>통신판매업 신고번호: 2026-경기양주-1851</p>
          <p>고객센터: 010-2060-7039 · kumokiri@naver.com</p>
        </div>
      </div>
    </div>
  );
}
