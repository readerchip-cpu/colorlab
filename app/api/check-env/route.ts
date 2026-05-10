export async function GET() {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  const secretKey = process.env.TOSS_SECRET_KEY;

  return Response.json({
    client: {
      exists: !!clientKey,
      length: clientKey?.length || 0,
      first15: clientKey?.substring(0, 15) || "없음",
      startsCorrectly: clientKey?.startsWith("test_ck_") || false,
    },
    secret: {
      exists: !!secretKey,
      length: secretKey?.length || 0,
      first15: secretKey?.substring(0, 15) || "없음",
      startsCorrectly: secretKey?.startsWith("test_sk_") || false,
    },
  });
}
