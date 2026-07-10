'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Container } from '@/components/primitives/Container';
import { Reveal } from '@/components/primitives/Reveal';
import { MagneticButton } from '@/components/primitives/MagneticButton';
import { ParallaxLayers } from './ParallaxLayers';

const ReactiveObject = dynamic(
  () => import('./ReactiveObject').then((m) => m.ReactiveObject),
  { ssr: false },
);

export function SignatureSection() {
  return (
    <section
      id="signature"
      className="relative w-full overflow-hidden border-t border-border py-32 md:py-48"
    >
      <ParallaxLayers />

      <Container size="wide" className="relative z-10 flex flex-col items-center gap-16 text-center">
        {/* canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
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
    </section>
  );
}