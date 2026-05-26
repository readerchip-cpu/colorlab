import { createClient } from '@supabase/supabase-js';

// service_role key 사용 — API Route / Server Action 전용
// 브라우저 번들에 절대 포함되지 않도록 주의
//
// global.fetch에 cache: 'no-store'를 주입해 Next.js Data Cache가
// Supabase 쿼리 결과를 stale로 반환하는 버그를 방지한다.
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
    },
  },
);
