import Link from 'next/link';
import type { Metadata } from 'next';
import BusinessInfo from '@/components/BusinessInfo';

export const metadata: Metadata = {
  title: '이용약관 | 컬러랩',
};

const LAST_UPDATED = '2025년 5월 1일';
const PRICE = 4900;

interface SectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

function Section({ number, title, children }: SectionProps) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-base font-bold text-gray-900">
        제{number}조 {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-gray-600">
        {children}
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
      {children}
    </div>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="border-b border-gray-100 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link href="/" className="text-sm font-semibold text-[#7C3AED]" aria-label="홈으로">
            ← 컬러랩
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-8">
          <h1 className="mb-1.5 text-2xl font-black text-gray-900">이용약관</h1>
          <p className="text-xs text-gray-400">시행일: {LAST_UPDATED} · 최종 업데이트: {LAST_UPDATED}</p>
        </div>

        <div className="mb-8 rounded-2xl border border-violet-100 bg-violet-50/60 p-5 text-sm leading-relaxed text-violet-800">
          본 약관은 컬러랩(이하 &ldquo;서비스&rdquo;)이 제공하는 AI 퍼스널컬러 분석 서비스의
          이용 조건 및 절차, 이용자와 서비스 간의 권리·의무를 규정합니다.
          서비스를 이용함으로써 본 약관에 동의한 것으로 간주합니다.
        </div>

        <Section number="1" title="서비스 목적 및 제공 내용">
          <P>
            컬러랩은 온라인 설문 및 AI 사진 분석을 통해 이용자의 퍼스널컬러 타입을 진단하고,
            메이크업·헤어·패션 관련 맞춤 가이드를 제공하는 디지털 컨텐츠 서비스입니다.
          </P>
          <P>① <strong>무료 서비스:</strong> 10문항 퍼스널컬러 진단 및 기본 결과 확인</P>
          <P>② <strong>유료 서비스 (₩{PRICE.toLocaleString()}):</strong> AI 사진 분석 기반 정밀 리포트
            (정밀 타입 분석·메이크업·헤어·패션·시즌별 스타일링·맞춤 조언)
          </P>
          <Notice>
            ⚠️ <strong>면책 고지</strong><br />
            본 서비스의 분석 결과는 AI 알고리즘과 통계적 방법론에 기반한 <strong>참고용 정보</strong>이며,
            전문 퍼스널컬러 컨설턴트의 대면 진단을 대체하지 않습니다.
            진단 결과의 정확성은 입력된 답변 및 사진의 품질에 따라 달라질 수 있습니다.
          </Notice>
        </Section>

        <Section number="2" title="이용자의 의무">
          <P>이용자는 다음 행위를 하여서는 안 됩니다.</P>
          <ul className="list-inside list-disc space-y-1 pl-1">
            <li>타인의 개인정보(사진 포함)를 무단으로 사용하는 행위</li>
            <li>서비스 운영을 방해하거나 서버에 과도한 부하를 주는 행위</li>
            <li>분석 리포트를 상업적 목적으로 무단 재배포하는 행위</li>
            <li>법령 또는 공서양속에 반하는 행위</li>
          </ul>
        </Section>

        <Section number="3" title="결제 및 이용권">
          <P>① 유료 서비스 이용을 위해 서비스 내 결제 수단(토스페이먼츠)으로 결제해야 합니다.</P>
          <P>② 결제 완료 시 해당 세션 ID에 연결된 리포트를 영구적으로 열람할 수 있습니다.</P>
          <P>③ 결제는 이용자 1인 1세션에 적용되며, 제3자에게 양도할 수 없습니다.</P>
          <P>④ 세션 ID(URL) 분실 시 결제 시 입력한 이메일 주소로 재발송을 요청할 수 있습니다.</P>
        </Section>

        <Section number="4" title="환불 정책">
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">상황</th>
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">환불 가능 여부</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                <tr className="border-b border-gray-50">
                  <td className="px-4 py-3">결제 후 리포트 미확인 상태 (24시간 이내)</td>
                  <td className="px-4 py-3 font-medium text-emerald-600">전액 환불 가능</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="px-4 py-3">리포트 확인 후 (이용 완료)</td>
                  <td className="px-4 py-3 text-gray-500">원칙적으로 환불 불가<br />(단, 서비스 오류로 인한 경우 환불)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">서비스 장애로 리포트 미생성</td>
                  <td className="px-4 py-3 font-medium text-emerald-600">전액 환불 또는 재발급</td>
                </tr>
              </tbody>
            </table>
          </div>
          <P>
            환불 요청은{' '}
            <a href="mailto:readerchip@gmail.com" className="text-[#7C3AED] hover:underline">
              readerchip@gmail.com
            </a>
            으로 주문 번호와 함께 문의해주세요.
            접수 후 3영업일 이내에 처리됩니다.
          </P>
        </Section>

        <Section number="5" title="지식재산권">
          <P>
            서비스 내 모든 콘텐츠(텍스트·UI·알고리즘·AI 리포트)의 저작권은 컬러랩에 귀속됩니다.
          </P>
          <P>
            이용자는 개인적 목적으로만 리포트를 활용할 수 있으며, 상업적 재배포·판매·공유는 금지됩니다.
          </P>
          <P>
            단, 결과 타입명과 대표 컬러는 개인 SNS에 공유할 수 있습니다.
          </P>
        </Section>

        <Section number="6" title="서비스 변경 및 중단">
          <P>
            서비스는 운영상·기술상의 이유로 서비스 내용을 변경하거나 일시 중단할 수 있습니다.
            중요한 변경 사항은 서비스 내 공지를 통해 사전 안내합니다.
          </P>
          <P>
            서비스 종료 시 최소 30일 전 공지하며, 미사용 결제 금액에 대해서는 환불 처리합니다.
          </P>
        </Section>

        <Section number="7" title="면책 조항">
          <Notice>
            본 서비스는 퍼스널컬러에 관한 일반적인 가이드를 제공하는 참고 서비스입니다.
          </Notice>
          <P>① 서비스는 분석 결과의 절대적 정확성을 보장하지 않습니다.</P>
          <P>② 분석 결과를 기반으로 한 구매·시술 결정에 대한 결과는 이용자 본인의 책임입니다.</P>
          <P>③ 이용자 귀책 사유로 발생한 데이터 손실에 대해 서비스는 책임지지 않습니다.</P>
          <P>④ 천재지변·네트워크 장애 등 불가항력으로 인한 서비스 중단에 대해서는 책임을 지지 않습니다.</P>
        </Section>

        <Section number="8" title="분쟁 해결 및 준거법">
          <P>본 약관은 대한민국 법령에 따라 해석되며, 서비스와 이용자 간의 분쟁은
            서울중앙지방법원을 제1심 관할 법원으로 합니다.</P>
          <P>
            분쟁 발생 시 먼저{' '}
            <a href="mailto:readerchip@gmail.com" className="text-[#7C3AED] hover:underline">
              readerchip@gmail.com
            </a>
            으로 협의를 시도합니다.
          </P>
        </Section>

        <Section number="9" title="약관 변경">
          <P>
            서비스는 필요 시 본 약관을 변경할 수 있으며, 변경 시 적용일 7일 전에 서비스 내 공지를 통해 안내합니다.
            변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.
          </P>
        </Section>

        {/* 사업자 정보 */}
        <div className="mt-10 rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            사업자 정보
          </p>
          <BusinessInfo />
        </div>

        {/* 하단 네비게이션 */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6 text-xs text-gray-400">
          <span>시행일: {LAST_UPDATED}</span>
          <Link href="/privacy" className="text-[#7C3AED] hover:underline">
            개인정보처리방침 →
          </Link>
        </div>
      </div>
    </main>
  );
}
