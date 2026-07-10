'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/primitives/Container';
import { Marquee } from '@/components/primitives/Marquee';

const ParticleField = dynamic(
  () => import('./ParticleField').then((m) => m.ParticleField),
  { ssr: false },
);

const heroEase = [0.22, 1, 0.36, 1] as const;

function Stat({
  label,
  value,
  active = false,
  dot = false,
}: {
  label: string;
  value: string;
  active?: boolean;
  dot?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      {dot && (
        <span className="relative grid h-1.5 w-1.5 place-items-center">
          <span className="absolute h-1.5 w-1.5 rounded-full bg-fg" />
        </span>
      )}
      <span className="text-fg-dim">{label}</span>
      <span className={active ? 'text-fg' : 'text-fg-muted'}>{value}</span>
    </span>
  );
}

function Sep() {
  return <span className="text-fg-dim/50">·</span>;
}

const TOTAL_RECORDS = 18_429_501;
const PROCESS_DURATION = 3000; // ms — slow morph, user feel data getting organized

type ProcessPhase = 'idle' | 'running' | 'done';

function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}

export function Hero() {
  const [triggered, setTriggered] = useState(false);
  const [phase, setPhase] = useState<ProcessPhase>('idle');
  const [progress, setProgress] = useState(0); // 0..1
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Drive a numeric progress over PROCESS_DURATION ms after trigger
  useEffect(() => {
    if (!triggered) return;
    setPhase('running');
    startRef.current = performance.now();
    setProgress(0);

    let lastPctShown = -1;
    const tick = (now: number) => {
      const elapsed = now - (startRef.current ?? now);
      const t = Math.min(elapsed / PROCESS_DURATION, 1);
      // Slight ease-out so it feels like the system is converging faster at the end
      const eased = 1 - Math.pow(1 - t, 1.4);
      // Throttle state updates to integer percent changes
      const pct = Math.floor(eased * 100);
      if (pct !== lastPctShown) {
        lastPctShown = pct;
        setProgress(pct / 100);
      }
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase('done');
        setProgress(1);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [triggered]);

  // Three parameters: records / categories discovered / index coverage %
  // categories = always 12 once user activates (the 12 named clusters)
  // index %    = climbs 0 → 100 over the morph window
  const total = TOTAL_RECORDS;
  const CATEGORY_COUNT = 12;
  const indexPct = phase === 'idle' ? 0 : Math.round(progress * 100);

  const fmt = formatCount;

  return (
    <section
      id="hero"
      className="relative isolate h-[100svh] w-full overflow-hidden"
    >
      {/* Canvas */}
      <div className="absolute inset-0">
        <ParticleField triggered={triggered} />
      </div>

      {/* Vignette */}
      <div className="vignette pointer-events-none absolute inset-0" />

      {/* Content */}
      <Container
        size="wide"
        className="relative z-10 flex h-full flex-col justify-between py-24 md:py-28"
      >
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

          {/* CTA + status */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: heroEase, delay: 0.9 }}
            className="mt-10 flex flex-col items-start gap-4"
          >
            <button
              onClick={() => setTriggered(true)}
              disabled={triggered}
              className="group relative overflow-hidden rounded-sm border border-fg px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-fg transition-opacity duration-500 disabled:cursor-default disabled:opacity-50 enabled:hover:opacity-90"
            >
              <span className="relative z-10 transition-colors duration-500 group-enabled:group-hover:text-bg-base">
                {triggered ? 'Xai active' : 'Activate Xai →'}
              </span>
              <span className="absolute inset-0 translate-y-full bg-fg transition-transform duration-500 ease-out-quart group-enabled:group-hover:translate-y-0" />
            </button>

            {/* Status — 3 parameters: total / categorized / indexed */}
            <motion.div
              animate={
                phase === 'idle'
                  ? { opacity: [0.45, 1, 0.45] }
                  : { opacity: 1 }
              }
              transition={
                phase === 'idle'
                  ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.3 }
              }
              className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-muted"
            >
              <Stat
                label="records"
                value={fmt(total)}
                active
                dot
              />
              <Sep />
              <Stat
                label="categories"
                value={phase === 'idle' ? '0' : String(CATEGORY_COUNT)}
              />
              <Sep />
              <Stat
                label="index"
                value={phase === 'idle' ? '0%' : `${indexPct}%`}
              />
            </motion.div>
          </motion.div>
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