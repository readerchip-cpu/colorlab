import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://colorlab.kr';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/test', '/privacy', '/terms'],
        // 개인 결과·결제·업로드 페이지는 색인 제외
        disallow: ['/result/', '/pay/', '/upload/', '/report/', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
