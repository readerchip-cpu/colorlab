import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportEmail(
  email: string,
  sessionId: string,
): Promise<void> {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const uploadUrl = `${base}/upload/${sessionId}`;
  const reportUrl = `${base}/report/${sessionId}`;

  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: email,
    subject: '[컬러랩] 퍼스널컬러 정밀 분석 리포트 준비 완료 🎨',
    html: `
<!DOCTYPE html>
<html lang="ko">
<body style="font-family:'Apple SD Gothic Neo',Pretendard,sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#111827;background:#ffffff;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="font-size:22px;font-weight:900;color:#7C3AED;letter-spacing:-0.5px;">컬러랩</span>
  </div>

  <h2 style="font-size:20px;font-weight:700;margin-bottom:10px;">정밀 분석 리포트가 준비됐어요 🎨</h2>
  <p style="line-height:1.85;color:#4B5563;margin-bottom:28px;">
    결제가 완료되었습니다. 사진을 업로드하면 AI가<br/>
    피부 톤·명도·채도를 직접 분석해 정밀 리포트를 완성해드려요.
  </p>

  <div style="margin-bottom:32px;text-align:center;">
    <a href="${uploadUrl}"
       style="display:inline-block;background:#7C3AED;color:#fff;font-weight:700;font-size:15px;padding:15px 36px;border-radius:14px;text-decoration:none;">
      사진 업로드하고 리포트 받기 →
    </a>
  </div>

  <div style="border-top:1px solid #F3F4F6;padding-top:20px;">
    <p style="font-size:12px;color:#9CA3AF;line-height:1.8;margin:0;">
      이 링크는 고유 URL입니다. 타인과 공유하지 마세요.<br/>
      리포트는 언제든지
      <a href="${reportUrl}" style="color:#7C3AED;text-decoration:none;">이 링크</a>
      에서 확인하실 수 있습니다.
    </p>
  </div>
</body>
</html>`.trim(),
  });
}
