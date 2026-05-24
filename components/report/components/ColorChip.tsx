interface ColorChipProps {
  hex: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showHex?: boolean;
}

const SIZE = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14 sm:w-16 sm:h-16',
  lg: 'w-16 h-16 sm:w-20 sm:h-20',
};

export function ColorChip({ hex, name, size = 'md', showName = true, showHex = false }: ColorChipProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={`${SIZE[size]} rounded-full shadow-sm ring-1 ring-black/5`}
        style={{ backgroundColor: hex }}
        title={name}
      />
      {showName && (
        <span className="max-w-[72px] text-center text-xs text-gray-600 dark:text-gray-400 leading-tight">
          {name}
        </span>
      )}
      {showHex && (
        <span className="font-mono text-[10px] text-gray-400">{hex}</span>
      )}
    </div>
  );
}
