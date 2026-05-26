export async function GET() {
  const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
  const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
  const apiSecret = process.env.PORTONE_API_SECRET;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  return Response.json({
    storeId: { exists: !!storeId, first10: storeId?.substring(0, 10) || '없음' },
    channelKey: { exists: !!channelKey, first10: channelKey?.substring(0, 10) || '없음' },
    apiSecret: { exists: !!apiSecret },
    anthropic: {
      exists: !!anthropicKey,
      length: anthropicKey?.length || 0,
      first15: anthropicKey?.substring(0, 15) || '없음',
      hasNewline: anthropicKey?.includes('\n') || false,
      hasSpace: anthropicKey?.includes(' ') || false,
      hasTrailingWhitespace: anthropicKey ? anthropicKey !== anthropicKey.trim() : false,
    },
  });
}
