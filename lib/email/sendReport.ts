import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const BRAND = '#7C3AED';
const BRAND_LIGHT = '#F5F3FF';
const BRAND_DARK = '#5B21B6';

function buildHtml(reportUrl: string): string {
  return /* html */ `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>컬러랩 퍼스널컬러 분석 리포트</title>
</head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:'Apple SD Gothic Neo',Pretendard,-apple-system,sans-serif;color:#111827;">

  <!-- 래퍼 -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- 로고 헤더 -->
          <tr>
            <td style="padding-bottom:24px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="display:inline-table;">
                <tr>
                  <td style="width:10px;height:10px;border-radius:50%;background:${BRAND};vertical-align:middle;"></td>
                  <td style="padding-left:8px;font-size:20px;font-weight:900;color:${BRAND};letter-spacing:-0.5px;vertical-align:middle;">컬러랩</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 메인 카드 -->
          <tr>
            <td style="background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(124,58,237,0.08);">

              <!-- 카드 헤더 (보라색 띠) -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,${BRAND} 0%,${BRAND_DARK} 100%);padding:32px 40px;text-align:center;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:0.1em;text-transform:uppercase;">Personal Color Analysis</p>
                    <h1 style="margin:0;font-size:24px;font-weight:900;color:#FFFFFF;line-height:1.3;">
                      퍼스널컬러 분석 리포트가
                      <br />준비됐어요 🎨
                    </h1>
                  </td>
                </tr>
              </table>

              <!-- 본문 -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:36px 40px;">

                    <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#111827;">
                      안녕하세요!
                    </p>
                    <p style="margin:0 0 20px;font-size:14px;line-height:1.8;color:#4B5563;">
                      컬러랩 퍼스널컬러 정밀 분석이 완료됐어요.<br />
                      아래 버튼을 눌러 나만의 컬러 리포트를 확인하세요.
                    </p>

                    <!-- 리포트 버튼 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                      <tr>
                        <td align="center">
                          <a href="${reportUrl}"
                             style="display:inline-block;background:${BRAND};color:#FFFFFF;font-size:15px;font-weight:700;padding:16px 40px;border-radius:14px;text-decoration:none;letter-spacing:0.01em;">
                            리포트 확인하기 →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- 안내 박스 -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:${BRAND_LIGHT};border-radius:12px;padding:16px 20px;">
                          <p style="margin:0;font-size:13px;line-height:1.7;color:#5B21B6;">
                            🔗 이 링크는 언제든 다시 접속할 수 있어요.<br />
                            📱 모바일·PC 어디서든 열람 가능합니다.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- 구분선 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                      <tr>
                        <td style="border-top:1px solid #F3F4F6;"></td>
                      </tr>
                    </table>

                    <!-- 버튼 직접 URL (일부 클라이언트용) -->
                    <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
                      버튼이 보이지 않는다면 아래 링크를 복사해 브라우저에 붙여넣으세요.<br />
                      <a href="${reportUrl}" style="color:${BRAND};word-break:break-all;">${reportUrl}</a>
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 푸터 -->
          <tr>
            <td style="padding:24px 16px 0;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#9CA3AF;">
                본 메일은 컬러랩 서비스 결제 완료 후 자동 발송됩니다.
              </p>
              <p style="margin:0;font-size:11px;color:#D1D5DB;">
                © 2025 컬러랩. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`.trim();
}

export async function sendReportEmail(
  to: string,
  sessionId: string,
): Promise<void> {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const reportUrl = `${base}/report/${sessionId}`;

  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject: '[컬러랩] 퍼스널컬러 분석 리포트가 준비됐어요 🎨',
    html: buildHtml(reportUrl),
  });
}
