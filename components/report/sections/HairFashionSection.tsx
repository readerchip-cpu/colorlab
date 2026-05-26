import { SectionHeader } from '@/components/report/components/SectionHeader';
import type { ReportData } from '@/types/report';

interface SectionProps {
  data: ReportData;
  customerName: string;
}

export function HairFashionSection({ data, customerName }: SectionProps) {
  const { hair, fashion, seasonalStyling, meta } = data;
  const accent = meta.accentColor;

  return (
    <section className="py-6">
      {/* 헤어 컬러 추천 */}
      <SectionHeader
        number="10"
        title={`${customerName}님의 헤어 컬러`}
        subtitle="Hair Color Recommendations"
        accentColor={accent}
      />

      <div className="mb-4 space-y-3">
        {hair.recommended.map((h, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 border-l-4 p-4 dark:border-gray-700"
            style={{ borderLeftColor: accent }}
          >
            <p className="mb-1 text-base font-bold text-gray-900 dark:text-white">{h.name}</p>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{h.description}</p>
          </div>
        ))}
      </div>

      {/* 피해야 할 헤어 */}
      {hair.avoid && hair.avoid.length > 0 && (
        <div className="mb-10 rounded-2xl border-l-4 border-red-400 bg-red-50 p-4 dark:bg-red-950/20">
          <p className="mb-2 text-sm font-bold text-red-700 dark:text-red-400">
            피해야 할 헤어 컬러
          </p>
          <ul className="space-y-1">
            {hair.avoid.map((item, i) => (
              <li key={i} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                <span className="font-medium">{item.name}</span>
                {item.reason && <span className="text-gray-500"> — {item.reason}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 패션 컬러 가이드 */}
      <SectionHeader
        number="11"
        title="패션 컬러 가이드"
        subtitle="Fashion Color Guide"
        accentColor={accent}
      />

      <div className="mb-4 space-y-3">
        <ColorGroupCard
          label="MAIN"
          korean="메인 컬러"
          colors={fashion.main}
          description="기본이 되는 베이스 컬러"
          accent={accent}
        />
        <ColorGroupCard
          label="SUB"
          korean="서브 컬러"
          colors={fashion.sub}
          description="자연스럽게 어우러지는 컬러"
          accent={accent}
        />
        <ColorGroupCard
          label="ACCENT"
          korean="포인트 컬러"
          colors={fashion.accent}
          description="포인트로 활용하는 컬러"
          accent={accent}
        />
      </div>

      {/* 코디 팁 */}
      {fashion.tips && fashion.tips.length > 0 && (
        <div
          className="mb-10 rounded-2xl border-l-4 p-5"
          style={{ backgroundColor: accent + '10', borderLeftColor: accent }}
        >
          <p className="mb-3 font-mono text-xs font-bold tracking-widest" style={{ color: accent }}>
            {customerName}님을 위한 코디 팁
          </p>
          <ul className="space-y-2">
            {fashion.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 flex-shrink-0" style={{ color: accent }}>▸</span>
                <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 시즌별 스타일링 */}
      <SectionHeader
        number="12"
        title="시즌별 스타일링"
        subtitle="Seasonal Styling Guide"
        accentColor={accent}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SeasonCard season="SPRING" korean="봄" color="#E89B8C" data={seasonalStyling.spring} />
        <SeasonCard season="SUMMER" korean="여름" color="#6FA8DC" data={seasonalStyling.summer} />
        <SeasonCard season="AUTUMN" korean="가을" color="#C68642" data={seasonalStyling.fall} />
        <SeasonCard season="WINTER" korean="겨울" color="#4A5568" data={seasonalStyling.winter} />
      </div>
    </section>
  );
}

function ColorGroupCard({
  label,
  korean,
  colors,
  description,
  accent,
}: {
  label: string;
  korean: string;
  colors: string[];
  description: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl border border-gray-200 border-l-4 p-4 dark:border-gray-700"
      style={{ borderLeftColor: accent }}
    >
      <div className="mb-1 flex items-baseline gap-2">
        <p className="font-mono text-xs font-bold tracking-widest" style={{ color: accent }}>
          {label}
        </p>
        <p className="text-base font-bold text-gray-900 dark:text-white">{korean}</p>
      </div>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{description}</p>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, i) => (
          <span
            key={i}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {color}
          </span>
        ))}
      </div>
    </div>
  );
}

function SeasonCard({
  season,
  korean,
  color,
  data,
}: {
  season: string;
  korean: string;
  color: string;
  data: { title: string; description: string; mustHaves: Array<{ icon: string; label: string }>; colors: Array<{ name: string; hex: string }> };
}) {
  return (
    <div
      className="rounded-2xl border border-gray-200 border-l-4 p-5 dark:border-gray-700"
      style={{ borderLeftColor: color }}
    >
      <div className="mb-1 flex items-baseline gap-2">
        <p className="font-bold tracking-widest" style={{ color }}>
          {season}
        </p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{korean}</p>
      </div>

      <div className="my-3 h-0.5 w-8 opacity-40" style={{ backgroundColor: color }} />

      <p className="mb-2 text-base font-bold text-gray-900 dark:text-white">{data.title}</p>
      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {data.description}
      </p>

      <p className="mb-2 font-mono text-xs tracking-widest text-gray-400">FOR THIS LOOK</p>
      <ul className="mb-4 space-y-1">
        {data.mustHaves.map((item, i) => (
          <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
            {item.icon} {item.label}
          </li>
        ))}
      </ul>

      <p className="mb-2 font-mono text-xs tracking-widest text-gray-400">COLORS</p>
      <div className="flex flex-wrap gap-2">
        {data.colors.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2 py-1 dark:bg-gray-800">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: c.hex }}
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
