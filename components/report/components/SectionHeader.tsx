interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export function SectionHeader({ number, title, subtitle, accentColor = '#7C3AED' }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <p
        className="mb-2 font-mono text-xs font-bold tracking-widest"
        style={{ color: accentColor }}
      >
        {number}
      </p>
      <h2 className="mb-1 text-2xl font-black text-gray-900 dark:text-white sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}
