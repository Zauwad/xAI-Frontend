'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export function CountUp({
  to,
  duration = 1100,
  suffix = '',
  format = 'integer',
}: {
  to: number;
  duration?: number;
  suffix?: string;
  format?: 'integer' | 'compact';
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setVal(to * easeOutQuart(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  const formatted =
    format === 'compact'
      ? Intl.NumberFormat('en', { notation: 'compact' }).format(Math.round(val))
      : Math.round(val).toLocaleString('en-US');

  return (
    <span ref={ref} className="tabular">
      {formatted}
      {suffix}
    </span>
  );
}