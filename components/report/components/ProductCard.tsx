interface ProductCardProps {
  brand: string;
  name: string;
  shade?: string;
  price?: number;
  colorHex?: string;
  accentColor?: string;
}

export function ProductCard({ brand, name, shade, price, colorHex, accentColor = '#7C3AED' }: ProductCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
      {colorHex && (
        <div
          className="h-10 w-10 flex-shrink-0 rounded-full ring-1 ring-black/10"
          style={{ backgroundColor: colorHex }}
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{brand}</p>
        <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{name}</p>
        {shade && (
          <p className="text-xs" style={{ color: accentColor }}>{shade}</p>
        )}
      </div>
      {price && (
        <p className="flex-shrink-0 text-sm font-bold text-gray-700 dark:text-gray-300">
          ₩{price.toLocaleString()}
        </p>
      )}
    </div>
  );
}
