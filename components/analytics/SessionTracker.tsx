"use client";
import { useEffect } from 'react';

export function SessionTracker() {
  useEffect(() => {
    const existing = sessionStorage.getItem('tracking_info');
    if (existing) return; // 첫 진입 시 정보만 보존

    const params = new URLSearchParams(window.location.search);
    const tracking = {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      referrer: document.referrer || null,
    };

    if (tracking.utm_source || tracking.utm_medium || tracking.utm_campaign || tracking.referrer) {
      sessionStorage.setItem('tracking_info', JSON.stringify(tracking));
    }
  }, []);

  return null;
}
