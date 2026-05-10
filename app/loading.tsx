export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="relative mb-5 flex h-14 w-14 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-violet-100 border-t-[#7C3AED]" />
        <span className="text-xl">🎨</span>
      </div>
      <p className="text-sm font-medium text-gray-500">불러오는 중...</p>
    </div>
  );
}
