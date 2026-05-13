'use client';

import { View, Text } from '@react-pdf/renderer';
import type { CosmeticProduct } from '@/lib/data/cosmetics';

function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원';
}

interface ProductRecommendationProps {
  product: CosmeticProduct;
  accentColor?: string;
}

export function ProductRecommendation({ product, accentColor = '#7C3AED' }: ProductRecommendationProps) {
  return (
    <View style={{
      flexDirection: 'row', gap: 10, alignItems: 'center',
      backgroundColor: '#FDFCF9', borderRadius: 6, padding: 7,
      borderWidth: 0.5, borderColor: '#E8E4DC', borderStyle: 'solid',
      marginBottom: 4,
    }}>
      {/* Color chip */}
      <View style={{
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: product.hex,
        borderWidth: 0.5, borderColor: '#DDD8CC', borderStyle: 'solid',
        flexShrink: 0,
      }} />

      {/* Product info */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 6.5, color: '#BBB', letterSpacing: 0.5, marginBottom: 1 }}>
          {product.brand}
        </Text>
        <Text style={{ fontSize: 9, fontWeight: 700, color: '#2A2A2A', marginBottom: 1 }}>
          {product.product}
        </Text>
        <Text style={{ fontSize: 7.5, color: '#777' }}>{product.shade}</Text>
      </View>

      {/* Price tag */}
      <View style={{
        backgroundColor: accentColor + '18', borderRadius: 4,
        paddingHorizontal: 7, paddingVertical: 4, flexShrink: 0,
      }}>
        <Text style={{ fontSize: 8.5, fontWeight: 700, color: accentColor }}>
          {formatPrice(product.price)}
        </Text>
      </View>
    </View>
  );
}
