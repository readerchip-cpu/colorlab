import type { Metadata } from 'next';
import SubscribeWidget from '@/components/billing/SubscribeWidget';

export const metadata: Metadata = {
  title: '정기 구독 - 컬러랩',
  description: '컬러랩 월 정기 구독 결제 안내',
};

const AMOUNT = Number(process.env.NEXT_PUBLIC_SUBSCRIPTION_PRICE ?? 9900);

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-md px-6 py-14">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">정기 구독</h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        매월 자동으로 결제되는 정기 구독 상품입니다.
      </p>

      {/* 상품 안내 */}
      <div className="mb-6 rounded-2xl border border-gray-200 p-6 dark:border-gray-700">
        <h2 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">결제 정보</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">상품명</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">컬러랩 정기 구독</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">결제 주기</dt>
            <dd className="font-medium text-gray-900 dark:text-gray-100">매월 1회 (자동 갱신)</dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
            <dt className="font-bold text-gray-900 dark:text-white">월 결제금액</dt>
            <dd className="text-base font-bold text-[#7C3AED]">₩{AMOUNT.toLocaleString()}</dd>
          </div>
        </dl>
      </div>

      {/* 등록 위젯 */}
      <SubscribeWidget amount={AMOUNT} />

      {/* 정기결제 필수 고지 (PG 심사 요건) */}
      <div className="mt-8 rounded-xl bg-gray-50 p-5 text-xs leading-relaxed text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        <p className="mb-2 font-bold text-gray-700 dark:text-gray-300">정기결제 안내</p>
        <ul className="space-y-1.5">
          <li>• 카드 등록 시 첫 결제가 즉시 진행되며, 이후 매월 같은 날 자동으로 결제됩니다.</li>
          <li>• 등록하신 카드의 빌링키로 매월 ₩{AMOUNT.toLocaleString()}이 자동 청구됩니다.</li>
          <li>• 해지 전까지 매월 자동 갱신·결제되며, 별도 통지 없이 결제될 수 있습니다.</li>
          <li>• 해지를 원하시면 다음 결제일 이전에 고객센터로 요청해주세요. 해지 즉시 다음 회차부터 결제가 중단됩니다.</li>
          <li>• 이미 결제된 당월 구독료는 디지털 콘텐츠 특성상 환불되지 않습니다.</li>
          <li>• 고객센터: 010-2060-7039 · kumokiri@naver.com</li>
        </ul>
      </div>

      {/* 사업자 정보 */}
      <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
        <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
          <p>상호명: 컬러랩 · 대표자: 이형진</p>
          <p>사업자등록번호: 602-18-96743</p>
          <p>통신판매업 신고번호: 2026-경기양주-1851</p>
        </div>
      </div>
    </div>
  );
}
