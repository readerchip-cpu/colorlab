import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '환불 정책 - 컬러랩',
  description: '컬러랩 퍼스널컬러 정밀 분석 리포트 환불 정책',
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">환불 정책</h1>
      <p className="mb-10 text-sm text-gray-500 dark:text-gray-400">Refund Policy</p>

      <div className="space-y-8 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">1. 환불 원칙</h2>
          <p>
            컬러랩(이하 &ldquo;회사&rdquo;)이 제공하는 퍼스널컬러 정밀 분석 리포트는 디지털 콘텐츠로,
            결제 완료 후 리포트 열람 시 환불이 불가합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">2. 환불 가능 조건</h2>
          <ul className="ml-4 space-y-2">
            <li>• 기술적 오류로 리포트가 정상 제공되지 않은 경우</li>
            <li>• 결제 후 리포트를 열람하지 않은 상태이며 결제일로부터 1시간 이내 요청한 경우</li>
            <li>• 사진 업로드 또는 AI 분석 단계에서 시스템 오류로 분석이 완료되지 않은 경우</li>
            <li>• 동일 상품을 중복 결제한 경우 (중복 결제 건에 한해 환불)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">3. 환불 불가 조건</h2>
          <ul className="ml-4 space-y-2">
            <li>• 리포트 열람 또는 PDF 다운로드를 완료한 경우</li>
            <li>• 단순 변심 또는 분석 결과에 대한 주관적 불만족</li>
            <li>• 결제 후 1시간 이상 경과하고 분석이 정상 진행된 경우</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">4. 환불 요청 방법</h2>
          <ul className="ml-4 space-y-2">
            <li>• 이메일: kumokiri@naver.com</li>
            <li>• 전화: 010-2060-7039</li>
            <li>• 처리 기간: 영업일 기준 3~5일 (환불 사유 확인 후)</li>
            <li>• 필요 정보: 주문번호, 결제 이메일, 환불 사유</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">5. 환불 처리</h2>
          <p className="mb-2">
            환불은 결제 수단과 동일한 방식으로 처리되며, 카드사 정책에 따라 영업일 기준 3~7일 소요될 수 있습니다.
          </p>
          <p>
            결제 취소 시 PG사(KG이니시스/카카오페이/네이버페이)를 통해 자동 처리되며,
            취소 완료 알림은 결제 시 입력한 이메일로 발송됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">6. 분쟁 해결</h2>
          <p>
            본 환불 정책과 관련된 분쟁이 발생한 경우 회사와 회원 간에 상호 협의하여 해결하며,
            협의가 이루어지지 않을 경우 「전자상거래 등에서의 소비자보호에 관한 법률」 및 관련 법령을 따릅니다.
          </p>
        </section>

        <section className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-700">
          <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">사업자 정보</h2>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <p>상호명: 컬러랩</p>
            <p>대표자: 이형진</p>
            <p>사업자등록번호: 602-18-96743</p>
            <p>통신판매업 신고번호: 2026-경기양주-1851</p>
            <p>주소: 경기도 양주시 삼숭로58번길 141 704-103</p>
            <p>이메일: kumokiri@naver.com</p>
            <p>전화: 010-2060-7039</p>
          </div>
        </section>

        <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          본 환불 정책은 2026년 5월 27일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
}
