import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const C = {
  brand:      '#7C3AED',
  brandDark:  '#5B21B6',
  brandLight: '#F5F3FF',
  bg:         '#FAF8F3',
  card:       '#FFFFFF',
  text:       '#2A2A2A',
  muted:      '#6B7280',
  border:     '#EDE9E1',
} as const;

interface SendReportData {
  sessionId:     string;
  typeName:      string;   // 영문 타입명 (예: Spring Light)
  typeNameKr:    string;   // 한글 타입명 (예: 봄 라이트)
  reportUrl:     string;   // 웹 결과 페이지
  pdfUrl:        string;   // PDF 직접 다운로드 링크
  customerName?: string;   // 사용자 이름 (선택)
}

function buildHtml(data: SendReportData): string {
  const { typeName, typeNameKr, reportUrl, pdfUrl } = data;

  return /* html */ `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>컬러랩 퍼스널컬러 분석 리포트</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:'Apple SD Gothic Neo',Pretendard,-apple-system,sans-serif;color:${C.text};">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- 로고 -->
          <tr>
            <td style="padding-bottom:28px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="display:inline-table;">
                <tr>
                  <td style="width:9px;height:9px;border-radius:50%;background:${C.brand};vertical-align:middle;"></td>
                  <td style="padding-left:7px;font-size:19px;font-weight:900;color:${C.brand};letter-spacing:-0.5px;vertical-align:middle;">컬러랩</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 메인 카드 -->
          <tr>
            <td style="background:${C.card};border-radius:20px;overflow:hidden;box-shadow:0 4px 28px rgba(124,58,237,0.09);">

              <!-- 카드 헤더 (보라 그라데이션) -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,${C.brand} 0%,${C.brandDark} 100%);padding:32px 40px;text-align:center;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.65);letter-spacing:0.15em;text-transform:uppercase;">Personal Color Analysis</p>
                    <h1 style="margin:0;font-size:22px;font-weight:900;color:#FFFFFF;line-height:1.35;">
                      분석이 완료됐어요! 🎨
                    </h1>
                  </td>
                </tr>
              </table>

              <!-- 본문 -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:36px 40px 40px;">

                    <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:${C.text};">안녕하세요!</p>
                    <p style="margin:0 0 24px;font-size:14px;line-height:1.8;color:${C.muted};">
                      컬러랩 AI 퍼스널컬러 정밀 분석이 완료됐어요.<br />
                      나만의 컬러 리포트와 PDF를 확인해보세요.
                    </p>

                    <!-- 타입 강조 박스 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="background:${C.bg};border:1.5px solid ${C.border};border-radius:14px;padding:20px 24px;text-align:center;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:${C.brand};letter-spacing:0.12em;text-transform:uppercase;">YOUR PERSONAL COLOR</p>
                          <p style="margin:0 0 2px;font-size:28px;font-weight:900;color:${C.text};letter-spacing:-0.5px;">${typeNameKr}</p>
                          <p style="margin:0;font-size:13px;font-weight:500;color:${C.muted};">${typeName}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- 버튼 2개 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <!-- 웹 결과 보기 -->
                        <td width="48%" style="padding-right:6px;">
                          <a href="${reportUrl}"
                             style="display:block;background:${C.brand};color:#FFFFFF;font-size:14px;font-weight:700;padding:15px 8px;border-radius:12px;text-decoration:none;text-align:center;letter-spacing:0.01em;">
                            웹에서 결과 보기
                          </a>
                        </td>
                        <!-- PDF 다운로드 -->
                        <td width="4%"></td>
                        <td width="48%" style="padding-left:6px;">
                          <a href="${pdfUrl}"
                             style="display:block;background:${C.bg};border:1.5px solid ${C.brand};color:${C.brand};font-size:14px;font-weight:700;padding:15px 8px;border-radius:12px;text-decoration:none;text-align:center;letter-spacing:0.01em;">
                            PDF 다운로드
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- 안내 박스 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="background:${C.brandLight};border-radius:12px;padding:15px 18px;">
                          <p style="margin:0;font-size:12.5px;line-height:1.75;color:${C.brandDark};">
                            🔗 이 링크들은 영구적으로 유효합니다.<br />
                            📱 모바일·PC 어디서든 바로 확인할 수 있어요.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- 구분선 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                      <tr><td style="border-top:1px solid ${C.border};"></td></tr>
                    </table>

                    <!-- URL 텍스트 폴백 -->
                    <p style="margin:0 0 8px;font-size:11.5px;color:#9CA3AF;line-height:1.6;">
                      버튼이 보이지 않는다면 아래 링크를 복사해 브라우저에 붙여넣으세요.
                    </p>
                    <p style="margin:0 0 4px;font-size:11px;color:#9CA3AF;">
                      결과 페이지: <a href="${reportUrl}" style="color:${C.brand};word-break:break-all;">${reportUrl}</a>
                    </p>
                    <p style="margin:0;font-size:11px;color:#9CA3AF;">
                      PDF: <a href="${pdfUrl}" style="color:${C.brand};word-break:break-all;">${pdfUrl}</a>
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 푸터 -->
          <tr>
            <td style="padding:24px 8px 0;text-align:center;">
              <p style="margin:0 0 5px;font-size:11.5px;color:#9CA3AF;">
                본 메일은 컬러랩 분석 완료 후 자동 발송됩니다.
              </p>
              <p style="margin:0;font-size:11px;color:#D1D5DB;">© 2025 컬러랩. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`.trim();
}

export async function sendReport(
  to: string,
  data: SendReportData,
): Promise<void> {
  const sendPromise = resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject: `[컬러랩] ${data.customerName ? `${data.customerName}님의 ` : ''}${data.typeNameKr} 분석 리포트가 준비됐어요`,
    html: buildHtml(data),
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Resend timeout (10s)')), 10_000);
  });

  const result = await Promise.race([sendPromise, timeoutPromise]);

  if (result.error) {
    console.error('[sendReport] Resend 에러:', result.error);
    throw new Error(result.error.message || 'Resend 발송 실패');
  }
}

/** @deprecated use sendReport instead */
export async function sendReportEmail(to: string, sessionId: string): Promise<void> {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  await sendReport(to, {
    sessionId,
    typeName:   '',
    typeNameKr: '퍼스널컬러',
    reportUrl:  `${base}/report/${sessionId}`,
    pdfUrl:     `${base}/report/${sessionId}`,
  });
}
