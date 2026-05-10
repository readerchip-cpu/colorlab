import { createClient } from '@supabase/supabase-js';

// service_role key 사용 — API Route / Server Action 전용
// 브라우저 번들에 절대 포함되지 않도록 주의
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
