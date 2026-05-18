'use client';

import { useState } from 'react';

const DEVICES = [
  { label: 'iPhone SE', width: 375, height: 667 },
  { label: 'iPhone 14 Pro', width: 393, height: 852 },
  { label: 'Galaxy S23', width: 360, height: 780 },
] as const;

const PAGES = [
  { label: '홈', path: '/' },
  { label: '테스트', path: '/test' },
  { label: '미리보기 리포트', path: '/preview/report' },
  { label: '체크리스트', path: '/preview/checklist' },
] as const;

export default function MobileTestPage() {
  const [device, setDevice] = useState<(typeof DEVICES)[number]>(DEVICES[0]);
  const [page, setPage] = useState<string>(PAGES[0].path);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">모바일 뷰 테스터</h1>
        <p className="mt-1 text-sm text-gray-500">모바일 뷰포트에서 각 페이지 가독성을 확인하세요.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        {/* 기기 선택 */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">기기</p>
          <div className="flex gap-2">
            {DEVICES.map((d) => (
              <button
                key={d.label}
                onClick={() => setDevice(d)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  device.label === d.label
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-gray-700 shadow-sm hover:bg-violet-50'
                }`}
              >
                {d.label}
                <span className="ml-1.5 text-[10px] opacity-70">{d.width}px</span>
              </button>
            ))}
          </div>
        </div>

        {/* 페이지 선택 */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">페이지</p>
          <div className="flex gap-2">
            {PAGES.map((p) => (
              <button
                key={p.path}
                onClick={() => setPage(p.path)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  page === p.path
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-gray-700 shadow-sm hover:bg-violet-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* iframe 프리뷰 */}
      <div className="flex items-start gap-6">
        <div
          className="overflow-hidden rounded-3xl shadow-2xl"
          style={{
            width: device.width + 2,
            border: '1px solid #CBD5E1',
            background: '#fff',
          }}
        >
          {/* 가짜 상태바 */}
          <div className="flex h-8 items-center justify-between bg-white px-5">
            <span className="text-[11px] font-semibold text-gray-800">9:41</span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-4 rounded-sm border border-gray-700 bg-gray-700" />
            </div>
          </div>

          <iframe
            key={`${device.label}-${page}`}
            src={page}
            style={{
              width: device.width,
              height: device.height,
              border: 'none',
              display: 'block',
            }}
            title={`${device.label} 뷰포트 미리보기`}
          />
        </div>

        {/* 치수 정보 */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">현재 설정</p>
          <table className="text-sm">
            <tbody className="space-y-2">
              {[
                ['기기', device.label],
                ['너비', `${device.width}px`],
                ['높이', `${device.height}px`],
                ['페이지', page],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className="pr-4 text-gray-400">{k}</td>
                  <td className="font-medium text-gray-800">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="mb-2 text-xs font-bold text-gray-400">결제 필요 페이지</p>
            <p className="text-xs leading-relaxed text-gray-500">
              /result, /pay, /upload, /report 등<br />
              실제 세션 ID가 필요합니다.<br />
              로컬 테스트 후 직접 URL 입력하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
