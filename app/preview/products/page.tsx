'use client';

import { cosmeticDatabase, getProductsByType } from '@/lib/data/cosmetics';
import type { PersonalColorType } from '@/types';

const TYPES: PersonalColorType[] = [
  '봄 라이트', '봄 브라이트',
  '여름 라이트', '여름 뮤트',
  '가을 뮤트', '가을 딥',
  '겨울 브라이트', '겨울 딥',
];

const CATEGORIES = ['lipstick', 'foundation', 'eyeshadow', 'blusher'] as const;
const CATEGORY_LABEL: Record<typeof CATEGORIES[number], string> = {
  lipstick:   '립스틱',
  foundation: '파운데이션',
  eyeshadow:  '아이섀도우',
  blusher:    '블러셔',
};

export default function ProductsPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">

        {/* 헤더 */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-violet-400">
            COLORLAB · Dev Preview
          </p>
          <h1 className="text-3xl font-bold text-gray-900">제품 DB 확인</h1>
          <p className="mt-1 text-gray-500">
            총 <span className="font-bold text-violet-700">{cosmeticDatabase.length}개</span> 제품 등록됨
            · AI가 임의 생성하지 않는 검증된 제품만 사용됩니다
          </p>
        </div>

        {/* 타입별 섹션 */}
        {TYPES.map(type => (
          <div key={type} className="mb-12">
            <h2 className="mb-4 text-xl font-bold text-violet-700">{type}</h2>

            <div className="grid grid-cols-4 gap-4">
              {CATEGORIES.map(cat => {
                const products = getProductsByType(type, cat, 5);
                const isShort = products.length < 2;

                return (
                  <div
                    key={cat}
                    className={`rounded-xl border p-4 ${
                      isShort
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <p className="mb-1 text-sm font-bold text-gray-800">
                      {CATEGORY_LABEL[cat]}{' '}
                      <span className={`text-xs font-normal ${isShort ? 'text-red-600' : 'text-gray-400'}`}>
                        ({products.length}개)
                      </span>
                    </p>

                    {isShort && (
                      <p className="mb-2 text-xs font-semibold text-red-600">
                        ⚠️ 제품 부족 — 추가 필요
                      </p>
                    )}

                    <ul className="space-y-1.5">
                      {products.map(p => (
                        <li key={p.id} className="flex items-center gap-2">
                          <span
                            className="h-4 w-4 flex-shrink-0 rounded-full border border-gray-200"
                            style={{ backgroundColor: p.hex }}
                          />
                          <span className="truncate text-xs text-gray-700">
                            <span className="font-medium">{p.brand}</span>{' '}
                            {p.shade}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {products.length === 0 && (
                      <p className="text-xs text-gray-400">등록된 제품 없음</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 전체 제품 목록 */}
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-gray-900">전체 제품 목록</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">색상</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">브랜드 · 제품명</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">카테고리</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">가격</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">태그</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">적용 타입</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cosmeticDatabase.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span
                        className="inline-block h-6 w-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: p.hex }}
                        title={p.hex}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{p.brand}</p>
                      <p className="text-xs text-gray-500">{p.product} · {p.shade}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{CATEGORY_LABEL[p.category]}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-700">
                      ₩{p.price.toLocaleString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map(tag => (
                          <span
                            key={tag}
                            className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.colorTypes.map(t => (
                          <span
                            key={t}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
