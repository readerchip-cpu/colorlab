'use client';
import { useEffect } from 'react';

export default function KarrotPixelEvent({ event }: { event: string }) {
  useEffect(() => {
    let tries = 0;
    const id = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pixel = (window as any).karrotPixel;
      if (pixel) {
        pixel.track(event);
        clearInterval(id);
      } else if (++tries > 30) {
        clearInterval(id);
      }
    }, 100);
    return () => clearInterval(id);
  }, [event]);
  return null;
}
