import { ColorChip } from '@/components/report/components/ColorChip';
import type { ReportData } from '@/types/report';

interface CoverSectionProps {
  data: ReportData;
  customerName: string;
}

export function CoverSection({ data, customerName }: CoverSectionProps) {
  const { meta, palette, personalIntro } = data;
  const accent = meta.accentColor;

  return (
    <section className="py-10 text-center">
      {/* 상단 레이블 */}
      <p
        className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        PERSONAL COLOR REPORT
      </p>

      {/* 이름 + 타이틀 */}
      <h1 className="mb-1 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
        {customerName}님의
      </h1>
      <h1 className="mb-6 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
        Personal Color
      </h1>

      {/* 타입 강조 */}
      <div className="my-8">
        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">{meta.typeName}</p>
        <p
          className="text-4xl font-black sm:text-5xl"
          style={{ color: accent }}
        >
          {meta.typeNameKr}
        </p>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{meta.toneStrength}</p>
      </div>

      {/* 대표 컬러 3개 */}
      <div className="my-8 flex justify-center gap-5">
        {palette.best.slice(0, 3).map((color) => (
          <ColorChip key={color.hex} hex={color.hex} name={color.name} size="lg" />
        ))}
      </div>

      {/* 구분선 */}
      <div className="mx-auto my-8 h-px w-16" style={{ backgroundColor: accent + '50' }} />

      {/* 인사말 */}
      <div className="mx-auto max-w-md">
        <p className="mb-5 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          {personalIntro.greeting}
        </p>

        <div className="mx-auto my-6 h-px w-10" style={{ backgroundColor: accent }} />

        {/* 타입 요약 */}
        <p className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
          {personalIntro.colorTypeDescription.summary}
        </p>

        {/* 3가지 특징 */}
        <ul className="mx-auto mb-5 max-w-xs space-y-2.5 text-left">
          {personalIntro.colorTypeDescription.characteristics.map((char, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
              <span className="mt-0.5 flex-shrink-0" style={{ color: accent }}>•</span>
              <span>{char}</span>
            </li>
          ))}
        </ul>

        {/* bestFor */}
        <p className="text-sm italic" style={{ color: accent }}>
          {personalIntro.colorTypeDescription.bestFor}
        </p>
      </div>
    </section>
  );
}
