'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/primitives/Container';
import { Reveal } from '@/components/primitives/Reveal';
import { MagneticButton } from '@/components/primitives/MagneticButton';
import { ParallaxLayers } from './ParallaxLayers';

const BOOT_LOG = [
  'booting intelligence workspace',
  'connecting warehouse cluster',
  'running schema inference',
  'loading model ensemble',
  'indexing 18,429,501 records',
  'ready.',
];

const ReactiveObject = dynamic(
  () => import('./ReactiveObject').then((m) => m.ReactiveObject),
  { ssr: false },
);

export function SignatureSection() {
  const [fps, setFps] = useState(60);
  const [lines, setLines] = useState<string[]>([]);
  const [hovered, setHovered] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  // FPS sampling
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      frameCount.current++;
      const now = performance.now();
      if (now - lastTime.current > 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastTime.current = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // type-on log
  useEffect(() => {
    let cancelled = false;
    let i = 0;
    const run = () => {
      if (cancelled) return;
      if (i >= BOOT_LOG.length) return;
      setLines((prev) => [...prev, BOOT_LOG[i]]);
      i++;
      setTimeout(run, 280);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="signature"
      className="relative w-full overflow-hidden border-t border-border py-32 md:py-48"
    >
      <ParallaxLayers />

      <Container className="relative z-10 flex flex-col items-center gap-16 text-center">
        {/* canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group relative aspect-square w-full max-w-[640px]"
        >
          <ReactiveObject />
          {/* press-X hint */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-dim opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span>press</span>
            <kbd className="rounded-sm border border-border-hi bg-bg-elev2 px-1.5 py-0.5 text-fg-muted">
              X
            </kbd>
            <span>to explode</span>
          </div>
        </motion.div>

        <Reveal delay={0.1}>
          <h2 className="max-w-[760px] text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-6xl">
            Built for clarity.
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="max-w-[520px] text-base leading-relaxed text-fg-muted">
            Every pixel reasoned about. Every motion earned. No decoration —
            only intent.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <MagneticButton
            href="#top"
            className="group relative overflow-hidden rounded-sm border border-fg px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-fg"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-bg-base">
              Begin →
            </span>
            <span className="absolute inset-0 translate-y-full bg-fg transition-transform duration-500 ease-out-quart group-hover:translate-y-0" />
          </MagneticButton>
        </Reveal>
      </Container>

      {/* telemetry strip */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-border bg-bg-elev1/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 overflow-hidden px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim md:px-10">
          <div className="flex shrink-0 items-center gap-2">
            <span className="grid h-1.5 w-1.5 place-items-center">
              <span
                className={`absolute h-1.5 w-1.5 rounded-full ${
                  hovered ? 'bg-fg' : 'bg-fg-muted'
                }`}
              />
              <span
                className={`absolute h-1.5 w-1.5 rounded-full bg-fg/60 ${
                  hovered ? 'animate-ping' : ''
                }`}
              />
            </span>
            <span className="text-fg-muted">
              {hovered ? 'engaged' : 'idle'}
            </span>
          </div>
          <div className="hidden flex-1 items-center gap-4 overflow-hidden md:flex">
            <span className="shrink-0">fps {fps.toString().padStart(2, '0')}</span>
            <span className="shrink-0">draw 12</span>
            <span className="shrink-0">tris 1.2k</span>
            <span className="shrink-0 text-fg-dim">|</span>
            <div className="flex flex-1 items-center gap-3 overflow-hidden">
              {lines.slice(-4).map((l, i) => (
                <span
                  key={`${l}-${i}`}
                  className="shrink-0 truncate text-fg-muted"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div className="shrink-0 tabular text-fg-muted">
            xai · workspace · v0.1
          </div>
        </div>
      </div>
    </section>
  );
}