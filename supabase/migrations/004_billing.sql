-- ============================================================
-- colorlab 정기결제(빌링키 구독) 스키마 (004)
-- 목적: PortOne 빌링키 기반 월 정기결제 구독 정보를 저장한다.
--       기존 일회성 payments 테이블과 독립적으로 동작.
-- 주의: 이름 충돌을 피하려고 테이블명을 billing_subscriptions 로 사용한다.
-- 실행: Supabase 대시보드 → SQL Editor 에 붙여넣고 Run (반복 실행 안전)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing_subscriptions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   text        NOT NULL,
  billing_key   text        NOT NULL,
  email         text,
  phone         text,
  amount        integer     NOT NULL,
  -- active(구독중) / canceled(해지) / failed(발급·결제 실패)
  status        text        NOT NULL DEFAULT 'active',
  last_paid_at  timestamptz,
  next_pay_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  canceled_at   timestamptz
);

-- 이미 테이블이 있던 경우를 대비한 컬럼 보강 (idempotent)
ALTER TABLE billing_subscriptions ADD COLUMN IF NOT EXISTS customer_id  text;
ALTER TABLE billing_subscriptions ADD COLUMN IF NOT EXISTS billing_key  text;
ALTER TABLE billing_subscriptions ADD COLUMN IF NOT EXISTS email        text;
ALTER TABLE billing_subscriptions ADD COLUMN IF NOT EXISTS phone        text;
ALTER TABLE billing_subscriptions ADD COLUMN IF NOT EXISTS amount       integer;
ALTER TABLE billing_subscriptions ADD COLUMN IF NOT EXISTS status       text DEFAULT 'active';
ALTER TABLE billing_subscriptions ADD COLUMN IF NOT EXISTS last_paid_at timestamptz;
ALTER TABLE billing_subscriptions ADD COLUMN IF NOT EXISTS next_pay_at  timestamptz;
ALTER TABLE billing_subscriptions ADD COLUMN IF NOT EXISTS canceled_at  timestamptz;

ALTER TABLE billing_subscriptions DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_customer_id ON billing_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_status      ON billing_subscriptions(status);
