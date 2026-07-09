'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  data: number[];
  invert?: boolean;
  height?: number;
  width?: number;
};

export function Sparkline({ data, invert = false, height = 64, width = 240 }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const pts = data.map((v, i) => {
    const x = i * stepX;
    const norm = (v - min) / range;
    const y = invert ? norm * height : (1 - norm) * height;
    return [x, y];
  });

  const linePath = pts
    .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
    .join(' ');
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  const onMove = (e: React.PointerEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const idx = Math.round(x / stepX);
    setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
  };

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      onPointerMove={onMove}
      onPointerLeave={() => setHoverIdx(null)}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={`grad-${invert ? 'inv' : 'std'}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(250,250,250,0.18)" />
          <stop offset="100%" stopColor="rgba(250,250,250,0)" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#grad-${invert ? 'inv' : 'std'})`} />
      <path
        d={linePath}
        stroke="#fafafa"
        strokeWidth="1.25"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {hoverIdx !== null && pts[hoverIdx] && (
        <>
          <line
            x1={pts[hoverIdx][0]}
            x2={pts[hoverIdx][0]}
            y1={0}
            y2={height}
            stroke="rgba(250,250,250,0.12)"
            strokeDasharray="2 2"
          />
          <circle
            cx={pts[hoverIdx][0]}
            cy={pts[hoverIdx][1]}
            r="3"
            fill="#fafafa"
            stroke="#08080b"
            strokeWidth="1.5"
          />
        </>
      )}
    </svg>
  );
}