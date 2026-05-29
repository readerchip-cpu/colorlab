-- UTM 추적 컬럼 추가
ALTER TABLE test_sessions
  ADD COLUMN IF NOT EXISTS utm_medium   text,
  ADD COLUMN IF NOT EXISTS utm_campaign text;

-- 채널별 성과 분석 View
CREATE OR REPLACE VIEW marketing_by_channel AS
SELECT
  COALESCE(utm_source,
    CASE
      WHEN referrer LIKE '%instagram%' THEN 'instagram (organic)'
      WHEN referrer LIKE '%karrot%' OR referrer LIKE '%daangn%' THEN 'karrot (organic)'
      WHEN referrer LIKE '%google%' THEN 'google'
      WHEN referrer LIKE '%naver%' THEN 'naver'
      WHEN referrer IS NULL OR referrer = '' THEN 'direct/messenger'
      ELSE 'other'
    END
  ) AS 채널,
  COUNT(*) AS 무료진단,
  COUNT(*) FILTER (WHERE is_paid = true) AS 결제,
  ROUND(
    COUNT(*) FILTER (WHERE is_paid = true)::numeric
    / NULLIF(COUNT(*), 0) * 100, 1
  ) AS 결제전환율
FROM test_sessions
WHERE result_type IS NOT NULL
GROUP BY 채널
ORDER BY 결제 DESC;
