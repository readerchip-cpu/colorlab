'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsLoading(true);
    // TODO: POST /api/review when reviews table is added
    await new Promise((r) => setTimeout(r, 700));
    setSubmitted(true);
    setIsLoading(false);
  };

  if (submitted) {
    return (
      <div className="py-6 text-center">
        <p className="mb-2 text-3xl">💜</p>
        <p className="font-bold text-gray-800">소중한 후기 감사해요!</p>
        <p className="mt-1 text-sm text-gray-500">더 좋은 서비스로 보답할게요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-800">컬러랩 분석은 어떠셨나요?</h3>

      {/* 별점 */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered || rating);
          return (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="text-3xl transition-transform hover:scale-110 active:scale-95"
              aria-label={`${star}점`}
            >
              {filled ? '⭐' : '☆'}
            </button>
          );
        })}
      </div>

      {/* 한줄 후기 (별점 선택 후 표시) */}
      {rating > 0 && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="한줄 후기를 남겨주세요 (선택)"
            maxLength={100}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-violet-400"
          />
          <p className="text-right text-xs text-gray-400">{comment.length} / 100</p>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={cn(
              'w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50',
            )}
          >
            {isLoading ? '제출 중...' : '후기 남기기'}
          </button>
        </div>
      )}
    </div>
  );
}
