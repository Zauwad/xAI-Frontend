'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Container } from '@/components/primitives/Container';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { PrimaryCTA } from '@/components/primitives/PrimaryCTA';
import { ParallaxLayers } from './ParallaxLayers';

const ReactiveObject = dynamic(
  () => import('./ReactiveObject').then((m) => m.ReactiveObject),
  { ssr: false },
);

export function SignatureSection() {
  return (
    <section
      id="signature"
      className="relative w-full overflow-hidden border-t border-border py-16 md:py-24"
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

        <SectionHeading
          title="Built for clarity."
          body="Every pixel reasoned about. Every motion earned. No decoration — only intent."
        />

        <PrimaryCTA href="#top">Begin →</PrimaryCTA>
      </Container>
    </section>
  );
}