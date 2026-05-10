import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없어요 | 컬러랩',
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-5 text-center">
      <div className="mb-6 text-6xl">🎨</div>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#7C3AED]">
        404
      </p>
      <h1 className="mb-3 text-2xl font-black text-gray-900">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mb-8 text-sm leading-relaxed text-gray-500">
        링크가 만료되었거나 주소가 잘못됐을 수 있어요.
        <br />
        결과 링크는 이메일로 발송된 주소를 다시 확인해주세요.
      </p>
      <Link
        href="/"
        className="rounded-2xl bg-[#7C3AED] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition-all hover:-translate-y-0.5 hover:opacity-95"
      >
        컬러랩 홈으로 →
      </Link>
    </main>
  );
}
