import { SectionHeader } from '@/components/report/components/SectionHeader';
import type { ReportData } from '@/types/report';

interface SectionProps {
  data: ReportData;
  customerName: string;
}

export function MakeupSection({ data, customerName }: SectionProps) {
  const accent = data.meta.accentColor;
  return (
    <section className="py-6">
      <SectionHeader
        number="04"
        title={`${customerName}님의 메이크업 추천`}
        subtitle="Makeup & Product Recommendations"
        accentColor={accent}
      />
      <div className="rounded-2xl bg-gray-50 px-5 py-8 text-center dark:bg-gray-800">
        <p className="text-sm text-gray-400">다음 단계에서 채워집니다.</p>
      </div>
    </section>
  );
}
