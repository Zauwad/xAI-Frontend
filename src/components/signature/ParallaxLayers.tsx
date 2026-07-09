'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// 4 parallax depth layers, each translates based on pointer
export function ParallaxLayers() {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });

  // each layer at different depth (multiplier)
  const t1 = useTransform(sx, (v) => v * 8);
  const t2 = useTransform(sx, (v) => v * 18);
  const t3 = useTransform(sx, (v) => v * 32);
  const t4 = useTransform(sx, (v) => v * 48);

  const b1 = useTransform(sy, (v) => v * 8);
  const b2 = useTransform(sy, (v) => v * 18);
  const b3 = useTransform(sy, (v) => v * 32);
  const b4 = useTransform(sy, (v) => v * 48);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [px, py]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* distant grid */}
      <motion.div
        style={{ x: t1, y: b1, opacity: 0.5 }}
        className="absolute inset-0 grid-bg"
      />
      {/* mid grid — denser */}
      <motion.div
        style={{
          x: t2,
          y: b2,
          opacity: 0.4,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        className="absolute inset-0"
      />
      {/* floating numerals */}
      <motion.div
        style={{ x: t3, y: b3 }}
        className="absolute inset-0 font-mono text-[10px] tabular text-fg-dim"
      >
        <span className="absolute left-[12%] top-[18%] tabular">0.382</span>
        <span className="absolute left-[82%] top-[24%] tabular">1.618</span>
        <span className="absolute left-[18%] top-[72%] tabular">π</span>
        <span className="absolute left-[76%] top-[68%] tabular">φ</span>
        <span className="absolute left-[48%] top-[10%] tabular">∇</span>
        <span className="absolute left-[8%] top-[48%] tabular">2π</span>
        <span className="absolute left-[90%] top-[50%] tabular">Σ</span>
        <span className="absolute left-[42%] top-[88%] tabular">∞</span>
      </motion.div>
      {/* headline glow */}
      <motion.div
        style={{ x: t4, y: b4, opacity: 0.5 }}
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_70%)]"
      />
    </div>
  );
}