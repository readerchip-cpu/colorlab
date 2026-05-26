import { SectionHeader } from '@/components/report/components/SectionHeader';
import { QuadrantChart } from '@/components/report/components/QuadrantChart';
import type { ReportData } from '@/types/report';

interface SectionProps {
  data: ReportData;
  customerName: string;
}

export function ImpressionSection({ data, customerName }: SectionProps) {
  const { personalIntro, analysis, meta } = data;
  const accent = meta.accentColor;

  return (
    <section className="py-6">
      <SectionHeader
        number="01"
        title={`${customerName}님의 첫인상`}
        subtitle="First Impression"
        accentColor={accent}
      />

      {/* 첫인상 텍스트 */}
      <div
        className="mb-4 rounded-2xl border-l-4 p-5"
        style={{ backgroundColor: accent + '12', borderLeftColor: accent }}
      >
        <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
          {personalIntro.photoImpression}
        </p>
      </div>

      {/* Key Finding */}
      <div className="mb-10 rounded-2xl bg-gray-50 p-5 dark:bg-gray-800">
        <p className="mb-2 font-mono text-xs font-bold tracking-widest" style={{ color: accent }}>
          KEY FINDING
        </p>
        <p className="text-lg font-bold leading-relaxed text-gray-900 dark:text-white sm:text-xl">
          {personalIntro.keyFinding}
        </p>
      </div>

      {/* 정밀 분석 */}
      <SectionHeader
        number="02"
        title="정밀 분석"
        subtitle="Precision Analysis"
        accentColor={accent}
      />

      {/* 4분면 차트 */}
      <div className="mb-4 rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
        <QuadrantChart
          warmCool={analysis.quadrant.warmCool}
          lightDeep={analysis.quadrant.lightDeep}
          accentColor={accent}
        />
      </div>

      {/* 4속성 카드 — 모바일 2x2 / 데스크탑 4x1 */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <AttributeCard label="HUE" korean="색상" value={analysis.fourAttributes.hue} accent={accent} />
        <AttributeCard label="VALUE" korean="명도" value={analysis.fourAttributes.value} accent={accent} />
        <AttributeCard label="CHROMA" korean="채도" value={analysis.fourAttributes.chroma} accent={accent} />
        <AttributeCard label="CLARITY" korean="청탁" value={analysis.fourAttributes.clarity} accent={accent} />
      </div>

      {/* 베이스 톤 + 컨트라스트 */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <InfoCard label="BASE TONE" labelKo="베이스 톤" value={analysis.base} accent={accent} />
        <InfoCard label="CONTRAST" labelKo="컨트라스트" value={analysis.contrast} accent={accent} />
      </div>

      {/* 핵심 인사이트 */}
      {analysis.keyInsight && (
        <div
          className="rounded-2xl border-l-4 p-5"
          style={{ backgroundColor: accent + '12', borderLeftColor: accent }}
        >
          <p className="mb-3 font-mono text-xs font-bold tracking-widest" style={{ color: accent }}>
            {customerName}님의 핵심 인사이트
          </p>
          <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
            {analysis.keyInsight}
          </p>
        </div>
      )}
    </section>
  );
}

function AttributeCard({
  label,
  korean,
  value,
  accent,
}: {
  label: string;
  korean: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl border border-gray-200 border-l-4 p-3 dark:border-gray-700"
      style={{ borderLeftColor: accent }}
    >
      <p className="mb-1 font-mono text-[10px] font-bold tracking-widest" style={{ color: accent }}>
        {label}
      </p>
      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{korean}</p>
      <p className="text-sm font-bold leading-tight text-gray-900 dark:text-white sm:text-base">
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  label,
  labelKo,
  value,
  accent,
}: {
  label: string;
  labelKo: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl border border-gray-200 border-l-4 p-4 dark:border-gray-700"
      style={{ borderLeftColor: accent }}
    >
      <p className="mb-1 font-mono text-xs font-bold tracking-widest" style={{ color: accent }}>
        {label}
      </p>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{labelKo}</p>
      <p className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">{value}</p>
    </div>
  );
}
