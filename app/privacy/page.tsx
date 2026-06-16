import Link from 'next/link';
import type { Metadata } from 'next';
import BusinessInfo from '@/components/BusinessInfo';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 컬러랩',
};

const LAST_UPDATED = '2025년 5월 1일';

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

function Table({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50">
            <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">
              항목
            </th>
            <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">
              내용
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3 font-medium text-gray-700 align-top">{label}</td>
              <td className="px-4 py-3 text-gray-600">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="border-b border-gray-100 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link
            href="/"
            className="text-sm font-semibold text-[#7C3AED]"
            aria-label="홈으로"
          >
            ← 컬러랩
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-8">
          <h1 className="mb-1.5 text-2xl font-black text-gray-900">개인정보처리방침</h1>
          <p className="text-xs text-gray-400">시행일: {LAST_UPDATED} · 최종 업데이트: {LAST_UPDATED}</p>
        </div>

        <div className="mb-8 rounded-2xl border border-violet-100 bg-violet-50/60 p-5 text-sm leading-relaxed text-violet-800">
          컬러랩(이하 &ldquo;서비스&rdquo;)은 이용자의 개인정보를 소중히 여기며, 「개인정보 보호법」 및 관련 법령을 준수합니다.
          본 방침은 서비스가 수집하는 개인정보의 항목·목적·보유기간 및 이용자의 권리를 안내합니다.
        </div>

        <Section number="1" title="수집하는 개인정보 항목">
          <Table
            rows={[
              ['이메일 주소', '결제 완료 후 리포트 링크 발송, 서비스 안내'],
              ['테스트 답변 (Q1~Q11)', '퍼스널컬러 타입 산출, AI 리포트 생성'],
              ['결제 정보', '포트원(PG사)이 직접 처리. 컬러랩은 카드번호 등 금융정보를 수집·저장하지 않음'],
              ['얼굴 사진 (선택)', '분석 후 즉시 삭제. 서버에 영구 저장하지 않음 (아래 제5조 참조)'],
              ['주문 ID · 결제 키', '결제 취소·환불 처리 목적으로만 보관'],
            ]}
          />
        </Section>

        <Section number="2" title="개인정보 수집 목적">
          <P>① 퍼스널컬러 AI 분석 리포트 생성 및 제공</P>
          <P>② 결제 완료 확인 및 리포트 링크 이메일 발송</P>
          <P>③ 결제 취소·환불 요청 처리</P>
          <P>④ 법령에 따른 의무 이행 (전자상거래법, 국세기본법 등)</P>
        </Section>

        <Section number="3" title="개인정보 보유 및 이용기간">
          <Table
            rows={[
              ['이메일 주소 · 테스트 답변 · AI 리포트', '마지막 접속일로부터 1년 (또는 이용자 삭제 요청 시)'],
              ['결제 기록 (주문 ID, 결제 키, 금액, 이메일)', '결제일로부터 5년 (전자상거래법 제6조)'],
              ['얼굴 사진', '분석 완료 즉시 삭제 — 보유 기간 없음'],
            ]}
          />
          <P>
            보유기간 만료 시 해당 정보는 지체 없이 파기합니다.
            단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 별도 보관 후 파기합니다.
          </P>
        </Section>

        <Section number="4" title="개인정보의 제3자 제공">
          <P>서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.</P>
          <P>
            단, 아래 경우에는 예외로 합니다.
          </P>
          <ul className="list-inside list-disc space-y-1 pl-1">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나 수사기관의 요청에 따른 경우</li>
          </ul>
          <P>
            결제 처리는 포트원을 통해 이루어지며, 해당 처리 과정에서 PG사 자체 개인정보처리방침이 적용됩니다.
          </P>
        </Section>

        <Section number="5" title="얼굴 사진 처리 방침">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="mb-1 font-bold text-emerald-800">📷 사진은 분석에만 사용되며, 서버에 저장되지 않습니다.</p>
            <p className="text-emerald-700">
              업로드된 사진은 Anthropic Claude Vision API에 전송되어 피부 톤·명도·채도 분석에만 활용됩니다.
              분석이 완료되는 즉시 서버 메모리에서 삭제되며, 데이터베이스나 스토리지에 저장하지 않습니다.
            </p>
          </div>
          <P>
            Anthropic의 API 이용 약관 및 개인정보 처리 방침은
            <a
              href="https://www.anthropic.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-[#7C3AED] hover:underline"
            >
              anthropic.com/privacy
            </a>
            에서 확인하실 수 있습니다.
          </P>
        </Section>

        <Section number="6" title="개인정보 파기 절차 및 방법">
          <P>① <strong>전자적 파일:</strong> 복구 불가능한 방법으로 영구 삭제</P>
          <P>② <strong>출력물·기록물:</strong> 해당 없음 (서비스는 디지털 데이터만 처리)</P>
          <P>③ 보유기간이 경과한 정보는 별도 DB로 이전 후 즉시 파기합니다.</P>
        </Section>

        <Section number="7" title="이용자의 권리 및 행사 방법">
          <P>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</P>
          <ul className="list-inside list-disc space-y-1 pl-1">
            <li>개인정보 조회·수정 요청</li>
            <li>개인정보 삭제(잊힐 권리) 요청</li>
            <li>개인정보 처리 정지 요청</li>
          </ul>
          <P>
            권리 행사는{' '}
            <a href="mailto:kumokiri@naver.com" className="text-[#7C3AED] hover:underline">
              kumokiri@naver.com
            </a>
            으로 이메일을 보내주시면 10영업일 내에 처리합니다.
          </P>
        </Section>

        <Section number="8" title="쿠키 및 자동 수집 정보">
          <P>서비스는 별도의 쿠키를 사용하지 않습니다.</P>
          <P>
            단, Supabase(데이터베이스)·Vercel(호스팅)·Anthropic(AI 분석) 등 제3자 서비스가
            자체적으로 수집하는 기술적 정보가 있을 수 있으며, 이는 각 서비스의 개인정보처리방침을 따릅니다.
          </P>
        </Section>

        <Section number="9" title="개인정보 보호책임자">
          <Table
            rows={[
              ['이름', '이형진'],
              ['이메일', 'kumokiri@naver.com'],
              ['연락처', '010-2060-7039'],
              ['처리 기한', '문의 접수 후 10영업일 이내'],
            ]}
          />
          <P>
            개인정보 침해 관련 신고·상담은 개인정보보호위원회(privacy.go.kr) 또는
            한국인터넷진흥원(kisa.or.kr)에 문의하실 수 있습니다.
          </P>
        </Section>

        <Section number="10" title="방침 변경 안내">
          <P>
            본 개인정보처리방침은 법령 개정 또는 서비스 변경에 따라 수정될 수 있습니다.
            변경 시 시행 7일 전에 서비스 내 공지사항을 통해 알려드립니다.
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
          <Link href="/terms" className="text-[#7C3AED] hover:underline">
            이용약관 →
          </Link>
        </div>
      </div>
    </main>
  );
}
