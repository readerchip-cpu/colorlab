'use client';
import { useEffect } from 'react';

export default function MetaPixelEvent({ event }: { event: string }) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fbq = (window as any).fbq;
    if (fbq) fbq('track', event);
  }, [event]);
  return null;
}
