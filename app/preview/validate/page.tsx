import { SAMPLE_PDF_DATA } from '@/lib/pdf/sampleData';
import { validatePDFStructure } from '@/lib/pdf/validator';
import type { PageValidationResult } from '@/lib/pdf/validator';

export const metadata = { title: 'PDF 검증 | 컬러랩' };

function FillBar({ ratio }: { ratio: number }) {
  const pct = Math.round(ratio * 100);
  const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-500';
  return (
    <div className="w-full rounded-full bg-gray-200 h-3 overflow-hidden">
      <div className={`h-3 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function PageCard({ result }: { result: PageValidationResult }) {
  const pct = Math.round(result.estimatedFillRatio * 100);
  const isOk = result.warnings.length === 0 && pct >= 80;
  return (
    <div className={`rounded-2xl border p-5 ${isOk ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white ${isOk ? 'bg-green-500' : 'bg-amber-400'}`}>
            {result.pageNumber}
          </span>
          <div>
            <p className="font-bold text-gray-900 text-sm">{result.pageName}</p>
            <p className="text-xs text-gray-500">페이지 {result.pageNumber}</p>
          </div>
        </div>
        <span className={`text-sm font-bold ${pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
          {pct}%
        </span>
      </div>

      <FillBar ratio={result.estimatedFillRatio} />

      {result.warnings.length > 0 && (
        <ul className="mt-3 space-y-1">
          {result.warnings.map((w, i) => (
            <li key={i} className="text-xs text-amber-700 flex gap-1.5">
              <span className="flex-shrink-0">⚠️</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ValidatePage() {
  const results = validatePDFStructure(SAMPLE_PDF_DATA);
  const allOk = results.every(r => r.estimatedFillRatio >= 0.8 && r.warnings.length === 0);
  const hasWarnings = results.some(r => r.warnings.length > 0);
  const avgFill = Math.round(results.reduce((s, r) => s + r.estimatedFillRatio, 0) / results.length * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1">PDF 자동 검증 결과</h1>
          <p className="text-sm text-gray-500">샘플 데이터 기준 · 각 페이지 채움 비율 추정</p>
        </div>

        {/* 종합 결과 */}
        <div className={`rounded-2xl p-5 mb-6 ${allOk ? 'bg-green-100 border border-green-200' : 'bg-amber-100 border border-amber-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{allOk ? '✅' : '⚠️'}</span>
            <div>
              <p className="font-bold text-gray-900">{allOk ? '모든 페이지 정상' : '주의 필요한 페이지 있음'}</p>
              <p className="text-sm text-gray-600">전체 평균 채움 비율: {avgFill}%</p>
            </div>
          </div>
          {hasWarnings && (
            <p className="text-sm text-amber-700">
              아래 경고를 확인하고 누락된 데이터를 보완하세요.
            </p>
          )}
        </div>

        {/* 페이지별 결과 */}
        <div className="space-y-3 mb-8">
          {results.map(result => (
            <PageCard key={result.pageNumber} result={result} />
          ))}
        </div>

        {/* 범례 + 안내 */}
        <div className="rounded-2xl bg-violet-50 border border-violet-100 p-5 space-y-3">
          <p className="text-sm font-bold text-violet-800">채움 비율 기준</p>
          <div className="flex gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> 80% 이상 — 정상</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> 50–79% — 주의</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> 50% 미만 — 빈 페이지</span>
          </div>
          <p className="text-xs text-violet-700 leading-relaxed">
            페이지 2–5는 TYPE_EXTRA 정적 데이터가 항상 존재하므로 실제 PDF에서 빈 공간이 생기지 않습니다.<br />
            페이지 1(표지)은 personalIntro 필드, 페이지 6(셀러브리티)은 celebrities 배열 길이에 따라 달라집니다.
          </p>
          <div className="flex gap-3 pt-1">
            <a href="/preview/report" className="text-xs font-bold text-violet-700 hover:underline">→ PDF 미리보기</a>
            <a href="/preview/mobile-test" className="text-xs font-bold text-violet-700 hover:underline">→ 모바일 테스터</a>
          </div>
        </div>

      </div>
    </div>
  );
}
