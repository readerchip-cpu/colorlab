import { SectionHeader } from '@/components/report/components/SectionHeader';
import type { ReportData } from '@/types/report';

interface SectionProps {
  data: ReportData;
  customerName: string;
}

export function PaletteSection({ data, customerName }: SectionProps) {
  const { palette, meta } = data;
  const accent = meta.accentColor;

  return (
    <section className="py-6">
      {/* Best Colors */}
      <SectionHeader
        number="03"
        title={`${customerName}님께 어울리는 컬러`}
        subtitle="Best Colors"
        accentColor={accent}
      />

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {palette.best.map((color) => (
          <div key={color.hex} className="text-center">
            <div
              className="mb-2 aspect-square rounded-2xl shadow-sm"
              style={{ backgroundColor: color.hex }}
            />
            <p className="text-sm font-bold text-gray-900 dark:text-white">{color.name}</p>
            <p className="font-mono text-xs text-gray-400">{color.hex}</p>
          </div>
        ))}
      </div>

      {/* Colors to Avoid */}
      <SectionHeader
        number="04"
        title="피해야 할 컬러"
        subtitle="Colors to Avoid"
        accentColor={accent}
      />

      <div className="mb-10 rounded-2xl border-l-4 border-red-400 bg-red-50 p-4 dark:bg-red-950/20">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {palette.worst.map((color) => (
            <div key={color.hex} className="text-center">
              <div
                className="mb-2 aspect-square rounded-2xl border-2 border-dashed border-gray-300 opacity-60"
                style={{ backgroundColor: color.hex }}
              />
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{color.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Styling Notes */}
      {palette.stylingNotes && palette.stylingNotes.length > 0 && (
        <>
          <SectionHeader
            number="05"
            title="스타일링 가이드"
            subtitle="Styling Notes"
            accentColor={accent}
          />
          <div
            className="rounded-2xl border-l-4 p-5"
            style={{ backgroundColor: accent + '10', borderLeftColor: accent }}
          >
            <ul className="space-y-3">
              {palette.stylingNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 flex-shrink-0" style={{ color: accent }}>▸</span>
                  <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
