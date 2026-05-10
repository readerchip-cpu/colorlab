-- ============================================================
-- colorlab 초기 스키마
-- 접근 방식: RLS 비활성화 + 서버 사이드에서 service_role key 전용 사용
-- 클라이언트(브라우저)에서 직접 Supabase에 접근하지 않음
-- ============================================================


-- ------------------------------------------------------------
-- 1. test_sessions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS test_sessions (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  answers        jsonb       NOT NULL,                  -- { "Q1": "A", "Q2": "C", ... }
  free_concern   text,                                  -- Q11 주관식 (nullable)
  result_type    text,                                  -- 12가지 타입 코드 (nullable until calculated)
  is_paid        boolean     NOT NULL DEFAULT false,
  report_content text,                                  -- AI 생성 전문 리포트 (nullable until generated)
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- RLS 비활성화 — 모든 접근은 서버에서 service_role key를 통해서만 이루어짐
ALTER TABLE test_sessions DISABLE ROW LEVEL SECURITY;


-- ------------------------------------------------------------
-- 2. payments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid        NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
  order_id    text        NOT NULL UNIQUE,              -- 토스페이먼츠 주문 ID
  payment_key text,                                     -- 토스페이먼츠 결제 키 (승인 후 발급)
  amount      integer     NOT NULL,                     -- 결제 금액 (원)
  status      text        NOT NULL DEFAULT 'pending'    -- pending | done | failed
                          CHECK (status IN ('pending', 'done', 'failed')),
  email       text,                                     -- 영수증 발송용 (nullable)
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS 비활성화 — 모든 접근은 서버에서 service_role key를 통해서만 이루어짐
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;


-- ------------------------------------------------------------
-- 인덱스
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_payments_session_id ON payments(session_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id   ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_result_type ON test_sessions(result_type);
