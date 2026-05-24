export async function GET() {
  const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
  const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
  const apiSecret = process.env.PORTONE_API_SECRET;

  return Response.json({
    storeId: { exists: !!storeId, first10: storeId?.substring(0, 10) || '없음' },
    channelKey: { exists: !!channelKey, first10: channelKey?.substring(0, 10) || '없음' },
    apiSecret: { exists: !!apiSecret },
  });
}
