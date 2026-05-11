interface Props {
  current: number; // 1-indexed
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="fixed top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
      <div className="mx-auto max-w-xl px-5 pt-4 pb-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">퍼스널컬러 테스트</span>
          <span className="text-xs font-semibold text-[#7C3AED] dark:text-purple-400">
            {current} / {total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-[#7C3AED] transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
