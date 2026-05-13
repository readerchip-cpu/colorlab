'use client';

import { View, Text } from '@react-pdf/renderer';
import type { CosmeticProduct } from '@/lib/data/cosmetics';

function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
}

function getUsage(price: number): string {
  if (price <= 15000) return '데일리';
  if (price <= 40000) return '포인트';
  return '특별한 날';
}

const USAGE_COLOR: Record<string, string> = {
  '데일리':    '#4CAF80',
  '포인트':    '#7C3AED',
  '특별한 날': '#E87040',
};

interface ProductRecommendationProps {
  product: CosmeticProduct;
  accentColor?: string;
}

export function ProductRecommendation({ product, accentColor = '#7C3AED' }: ProductRecommendationProps) {
  const usage = getUsage(product.price);
  const usageColor = USAGE_COLOR[usage] ?? accentColor;

  return (
    <View style={{
      flexDirection: 'row', gap: 10, alignItems: 'center',
      backgroundColor: '#FDFCF9', borderRadius: 6, padding: 9,
      borderWidth: 0.5, borderColor: '#E8E4DC', borderStyle: 'solid',
      marginBottom: 5,
    }}>
      {/* Color chip — 40×40 */}
      <View style={{
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: product.hex,
        borderWidth: 0.5, borderColor: '#DDD8CC', borderStyle: 'solid',
        flexShrink: 0,
      }} />

      {/* Product info */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 8, color: '#BBB', letterSpacing: 0.5, marginBottom: 1 }}>
          {product.brand}
        </Text>
        <Text style={{ fontSize: 11, fontWeight: 700, color: '#2A2A2A', marginBottom: 2 }}>
          {product.product}
        </Text>
        <Text style={{ fontSize: 9, color: '#777' }}>{product.shade}</Text>
      </View>

      {/* Price + usage badge */}
      <View style={{ alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <Text style={{ fontSize: 9.5, fontWeight: 700, color: accentColor }}>
          {formatPrice(product.price)}
        </Text>
        <View style={{
          backgroundColor: usageColor + '18', borderRadius: 3,
          paddingHorizontal: 5, paddingVertical: 2,
        }}>
          <Text style={{ fontSize: 7, fontWeight: 700, color: usageColor }}>
            {usage}
          </Text>
        </View>
      </View>
    </View>
  );
}
