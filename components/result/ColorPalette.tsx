import type { ColorSwatch } from '@/lib/colorData';

interface Props {
  palette: [ColorSwatch, ColorSwatch, ColorSwatch];
  blurHex?: boolean;
}

export default function ColorPalette({ palette, blurHex = false }: Props) {
  return (
    <section className="mx-auto max-w-xl px-5 py-8">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
        베스트 컬러
      </p>
      <div className="flex justify-center gap-8">
        {palette.map((swatch) => (
          <div key={swatch.hex} className="flex flex-col items-center gap-2.5">
            <div
              className="h-[72px] w-[72px] rounded-full shadow-lg ring-4 ring-white dark:ring-gray-800"
              style={{ backgroundColor: swatch.hex }}
            />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{swatch.name}</span>
            <span
              className="font-mono text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500"
              style={blurHex ? { filter: 'blur(3px)', userSelect: 'none' } : undefined}
            >
              {swatch.hex}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
