'use client';

export function Marquee({
  items,
  className = '',
}: {
  items: string[];
  className?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={`overflow-hidden border-y border-border ${className}`}>
      <div className="marquee-track flex w-max gap-12 py-4 font-mono text-xs uppercase tracking-[0.18em] text-fg-dim">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-12 whitespace-nowrap">
            <span>{item}</span>
            <span className="text-fg-dim/60">◇</span>
          </span>
        ))}
      </div>
    </div>
  );
}