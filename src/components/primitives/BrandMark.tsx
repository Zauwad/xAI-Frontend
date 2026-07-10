'use client';

type Props = {
  href?: string;
  className?: string;
  showTag?: boolean;
  size?: 'sm' | 'md';
};

const SIZES = {
  sm: { box: 'h-5 w-5 text-[9px]', text: 'text-xs', gap: 'gap-1.5' },
  md: { box: 'h-6 w-6 text-[10px]', text: 'text-sm', gap: 'gap-2' },
};

export function BrandMark({
  href = '#top',
  className = '',
  showTag = true,
  size = 'md',
}: Props) {
  const s = SIZES[size];
  return (
    <a
      href={href}
      className={`inline-flex items-center ${s.gap} font-mono ${s.text} tracking-tight ${className}`}
    >
      <span
        className={`grid place-items-center rounded-sm border border-border-hi bg-bg-elev1 ${s.box}`}
      >
        ✕
      </span>
      <span className="text-fg">xai</span>
      {showTag && (
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
          /workspace
        </span>
      )}
    </a>
  );
}