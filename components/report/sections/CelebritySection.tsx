import { SectionHeader } from '@/components/report/components/SectionHeader';
import type { ReportData, Celebrity } from '@/types/report';

interface SectionProps {
  data: ReportData;
  customerName: string;
}

export function CelebritySection({ data, customerName }: SectionProps) {
  const { celebrities, customAdvice, meta } = data;
  const accent = meta.accentColor;

  return (
    <section className="py-6">
      <SectionHeader
        number="13"
        title={`${customerName}님과 같은 톤의 셀러브리티`}
        subtitle="Similar Tone Celebrities"
        accentColor={accent}
      />

      {celebrities && celebrities.length > 0 ? (
        <div className="mb-10 space-y-3">
          {celebrities.map((celeb, i) => (
            <CelebrityCard key={i} celebrity={celeb} />
          ))}
        </div>
      ) : (
        <div className="mb-6 rounded-2xl bg-gray-50 p-6 text-center dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            해당 톤의 셀러브리티 데이터를 준비 중입니다.
          </p>
        </div>
      )}

      <div className="mb-10 text-center">
        <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-500">
          셀러브리티 추천은 공개된 정보를 기반으로 한 분석가의 의견이며,
          <br />
          해당 인물의 공식 입장과 무관합니다.
        </p>
      </div>

      {customAdvice && (
        <>
          <SectionHeader
            number="14"
            title={`${customerName}님의 고민에 대한 답변`}
            subtitle="Personalized Advice"
            accentColor={accent}
          />

          {customAdvice.isRelated ? (
            <div
              className="mb-10 rounded-2xl border-l-4 p-5"
              style={{ backgroundColor: accent + '12', borderLeftColor: accent }}
            >
              <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
                {customAdvice.answer}
              </p>
            </div>
          ) : (
            <div className="mb-10 rounded-2xl bg-gray-50 p-5 text-center dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                해당 질문에는 답변이 불가합니다.
              </p>
            </div>
          )}
        </>
      )}

      {/* 마무리 메시지 */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: `linear-gradient(135deg, ${accent}15 0%, ${accent}08 100%)`,
          border: `1px solid ${accent}30`,
        }}
      >
        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
          {customerName}님께 어울리는 컬러로
          <br />더 자신감 있는 매일이 되길 응원해요.
        </p>
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">— ColorLab</p>
      </div>
    </section>
  );
}

function CelebrityCard({ celebrity }: { celebrity: Celebrity }) {
  const mainColor = celebrity.signatureColors?.[0] ?? '#7C3AED';

  return (
    <div
      className="rounded-2xl border border-gray-200 border-l-4 p-4 dark:border-gray-700"
      style={{ borderLeftColor: mainColor }}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{celebrity.name}</p>
          {celebrity.profession && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{celebrity.profession}</p>
          )}
        </div>

        {celebrity.signatureColors && (
          <div className="flex flex-shrink-0 gap-1.5">
            {celebrity.signatureColors.map((color, i) => (
              <div
                key={i}
                className="h-4 w-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>

      {celebrity.similarity && (
        <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {celebrity.similarity}
        </p>
      )}

      {celebrity.iconicLook && (
        <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
          <p className="mb-1 font-mono text-xs tracking-widest text-gray-400">SIGNATURE LOOK</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{celebrity.iconicLook}</p>
        </div>
      )}
    </div>
  );
}
