'use client';

import { SectionHeader } from '@/components/report/components/SectionHeader';
import type { ReportData } from '@/types/report';
import type { CosmeticProduct } from '@/lib/data/cosmetics';

interface SectionProps {
  data: ReportData;
  customerName: string;
}

export function MakeupSection({ data, customerName }: SectionProps) {
  const { makeup, meta } = data;
  const accent = meta.accentColor;

  return (
    <section className="py-6">
      <MakeupCategory
        number="06"
        title="추천 립스틱"
        subtitle="Lip Color"
        items={makeup.lipstick}
        accent={accent}
      />

      <div className="mt-10">
        <MakeupCategory
          number="07"
          title="추천 파운데이션"
          subtitle="Foundation"
          items={makeup.foundation}
          accent={accent}
        />
      </div>

      <div className="mt-10">
        <MakeupCategory
          number="08"
          title="추천 아이섀도우"
          subtitle="Eyeshadow"
          items={makeup.eyeshadow}
          accent={accent}
        />
      </div>

      <div className="mt-10">
        <MakeupCategory
          number="09"
          title="추천 블러셔"
          subtitle="Blusher"
          items={makeup.blusher}
          accent={accent}
        />
      </div>

      {makeup.tips && makeup.tips.length > 0 && (
        <div
          className="mt-10 rounded-2xl border-l-4 p-5"
          style={{ backgroundColor: accent + '10', borderLeftColor: accent }}
        >
          <p className="mb-4 font-mono text-xs font-bold tracking-widest" style={{ color: accent }}>
            {customerName}님을 위한 메이크업 팁
          </p>
          <ul className="space-y-2">
            {makeup.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 flex-shrink-0" style={{ color: accent }}>▸</span>
                <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-500">
          올리브영·시코르·세포라 등에서 시연 후 구매를 권장합니다.
          <br />
          제품 정보는 2025년 5월 기준이며, 변동될 수 있습니다.
        </p>
      </div>
    </section>
  );
}

function MakeupCategory({
  number,
  title,
  subtitle,
  items,
  accent,
}: {
  number: string;
  title: string;
  subtitle: string;
  items: CosmeticProduct[];
  accent: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <>
      <SectionHeader number={number} title={title} subtitle={subtitle} accentColor={accent} />
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 dark:border-gray-700"
          >
            <div
              className="h-14 w-14 flex-shrink-0 rounded-full shadow-sm"
              style={{ backgroundColor: item.hex }}
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900 dark:text-white">
                {item.brand} {item.product}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.shade}</p>
              <p className="font-mono text-xs text-gray-400">{item.hex}</p>
            </div>
            {item.purchaseLink && (
              <a
                href={item.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold text-white"
                style={{ backgroundColor: accent }}
              >
                구매
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
