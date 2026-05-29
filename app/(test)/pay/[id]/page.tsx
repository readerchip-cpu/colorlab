import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTestSession } from '@/lib/utils/session';
import { TYPE_DISPLAY } from '@/lib/colorData';
import PaymentWidget from '@/components/payment/PaymentWidget';
import MetaPixelEvent from '@/components/MetaPixelEvent';
import KarrotPixelEvent from '@/components/KarrotPixelEvent';
import type { PersonalColorType } from '@/types';
import { adminClient } from '@/lib/supabase/admin';

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

  // 페이월 최초 진입 기록 (실패해도 결제 흐름에 영향 없음)
  try {
    if (!session.reached_paywall) {
      await adminClient
        .from('test_sessions')
        .update({
          reached_paywall: true,
          paywall_reached_at: new Date().toISOString(),
        })
        .eq('id', params.id)
        .eq('reached_paywall', false);
    }
  } catch (e) {
    console.error('페이월 기록 실패 (무시):', e);
  }

  const colorType = session.result_type as PersonalColorType;
  const displayName = TYPE_DISPLAY[colorType];
  const failError = searchParams.error;

  return (
    <main className="min-h-screen bg-gray-50 pb-16 dark:bg-gray-950">
      <MetaPixelEvent event="InitiateCheckout" />
      <KarrotPixelEvent event="InitiateCheckout" />
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
              : failError === 'amount_mismatch'
                ? '결제 금액이 일치하지 않아요. 고객센터에 문의해주세요.'
                : failError === 'confirm_failed'
                  ? '결제 확인 중 오류가 발생했어요. 고객센터에 문의해주세요.'
                  : searchParams.message
                    ? `결제 오류: ${decodeURIComponent(searchParams.message)}`
                    : `결제 오류가 발생했어요. (${failError})`}
          </div>
        )}

        {/* 상단 안심 안내 배너 */}
        <div className="mb-5 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-900 p-6 shadow-xl text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <span className="text-sm">💡</span>
            <span className="text-xs font-bold">진단 전 꼭 확인하세요</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-tight">
            화장 지울 필요 없이<br />
            셀카 1장이면 충분해요
          </h2>
          <p className="text-sm sm:text-base text-white/90 mb-6 leading-relaxed">
            AI가 메이크업 영향을 자동으로 보정해서<br />
            본래 피부톤·언더톤을 정확하게 찾아드려요
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-xl mb-1.5">💄</div>
              <p className="text-xs font-bold mb-0.5">화장 OK</p>
              <p className="text-[11px] text-white/80 leading-tight">AI가 자동 보정</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-xl mb-1.5">📸</div>
              <p className="text-xs font-bold mb-0.5">지금 촬영 OK</p>
              <p className="text-[11px] text-white/80 leading-tight">미리 준비 불필요</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-xl mb-1.5">🔒</div>
              <p className="text-xs font-bold mb-0.5">AI만 분석</p>
              <p className="text-[11px] text-white/80 leading-tight">사람은 안 봐요</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-xl mb-1.5">⚡</div>
              <p className="text-xs font-bold mb-0.5">즉시 삭제</p>
              <p className="text-[11px] text-white/80 leading-tight">저장 안 함</p>
            </div>
          </div>
        </div>

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

        {/* 서비스 제공 안내 */}
        <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-3 text-sm font-bold text-gray-900 dark:text-white">서비스 제공 안내</p>
          <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <li>
              <strong className="text-gray-900 dark:text-gray-200">제공 방식:</strong>
              <span className="ml-1">결제 완료 후 즉시 웹 리포트 열람 및 PDF 다운로드 가능</span>
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-200">서비스 제공 기간:</strong>
              <span className="ml-1">결제 완료 후 즉시 ~ 영구 제공 (다운로드 가능 기간: 결제일로부터 무제한)</span>
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-200">리포트 발송:</strong>
              <span className="ml-1">입력하신 이메일로 PDF 리포트 자동 발송</span>
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-200">환불 정책:</strong>
              <span className="ml-1">디지털 콘텐츠 특성상 리포트 열람 시 환불이 불가합니다. 단, 기술적 오류로 리포트가 제공되지 않은 경우 전액 환불됩니다.</span>
            </li>
            <li>
              <strong className="text-gray-900 dark:text-gray-200">문의:</strong>
              <span className="ml-1">kumokiri@naver.com / 010-2060-7039</span>
            </li>
          </ul>
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
