'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Container } from '@/components/primitives/Container';
import { Marquee } from '@/components/primitives/Marquee';

const ParticleField = dynamic(
  () => import('./ParticleField').then((m) => m.ParticleField),
  { ssr: false },
);

const heroEase = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate h-[100svh] w-full overflow-hidden"
    >
      {/* Canvas */}
      <div className="absolute inset-0">
        <ParticleField />
      </div>

      {/* Vignette */}
      <div className="vignette pointer-events-none absolute inset-0" />

      {/* Content */}
      <Container className="relative z-10 flex h-full flex-col justify-between py-24 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: heroEase, delay: 0.1 }}
          className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted"
        >
          <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-fg shadow-[0_0_12px_rgba(250,250,250,0.6)]" />
          <span>Intelligence Workspace</span>
        </motion.div>

        <div className="max-w-[820px]">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: heroEase, delay: 0.2 }}
            className="text-balance text-[44px] font-medium leading-[1.02] tracking-[-0.04em] text-fg md:text-[72px] lg:text-[88px]"
          >
            From raw data
            <br />
            <span className="text-fg-muted">to decisions.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: heroEase, delay: 0.5 }}
            className="mt-6 max-w-[520px] text-balance text-base leading-relaxed text-fg-muted md:text-lg"
          >
            Xai ingests, structures, and surfaces insight — automatically.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex justify-center font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <span>↓</span>
            <span>↓</span>
          </motion.div>
        </motion.div>
      </Container>

      {/* Marquee strip at bottom edge */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <Marquee
          items={[
            'real-time ingest',
            'graph-based reasoning',
            'schema inference',
            'sub-second query',
            'multi-source sync',
            'audit trail',
            'role-based access',
            'zero-config deploy',
          ]}
        />
      </div>
    </section>
  );
}