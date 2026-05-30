'use client';

import { useEffect, useState } from 'react';

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

export default function CountdownBanner() {
  const [seconds, setSeconds] = useState(getSecondsUntilMidnight);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(getSecondsUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="mb-5 rounded-2xl bg-[#7C3AED] px-5 py-4 text-center text-white shadow-lg">
      <p className="mb-0.5 text-sm font-bold sm:text-base">
        🎉 론칭 기념 할인가 ₩4,900{' '}
        <span className="opacity-70 line-through">(정가 ₩5,900)</span>
      </p>
      <p className="mb-2 text-xs text-white/75">한정 할인 종료까지</p>
      <p className="text-2xl font-black tracking-wider sm:text-3xl">
        {pad(h)}시간 {pad(m)}분 {pad(s)}초
      </p>
    </div>
  );
}
