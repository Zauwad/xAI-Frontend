'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/primitives/Container';
import { Reveal } from '@/components/primitives/Reveal';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { StatusPulse } from '@/components/primitives/StatusPulse';
import { Sparkline } from '@/components/dashboard/Sparkline';

type Auto = {
  idx: string;
  name: string;
  trigger: string;
  destination: string;
  schedule: string;
  lastFired: string;
  runs: number;
  successRate: number;
  status: 'running' | 'idle' | 'error';
  sparkline: number[];
};

const AUTOMATIONS: Auto[] = [
  {
    idx: 'a01',
    name: 'Daily revenue snapshot',
    trigger: 'cron · 09:00 UTC weekdays',
    destination: 'slack · #exec-room',
    schedule: 'every weekday',
    lastFired: '2h ago',
    runs: 184,
    successRate: 100,
    status: 'idle',
    sparkline: [40, 38, 42, 41, 39, 44, 41, 43, 42, 45, 43, 47],
  },
  {
    idx: 'a02',
    name: 'Refund-rate anomaly alert',
    trigger: 'stream · refund_rate > 4%',
    destination: 'pagerduty + slack · #ops',
    schedule: 'real-time',
    lastFired: '11m ago',
    runs: 7,
    successRate: 100,
    status: 'running',
    sparkline: [0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 3, 0],
  },
  {
    idx: 'a03',
    name: 'Weekly cohort refresh',
    trigger: 'cron · Mon 04:00 UTC',
    destination: 'snowflake · analytics.cohorts',
    schedule: 'weekly',
    lastFired: '1d ago',
    runs: 24,
    successRate: 96,
    status: 'idle',
    sparkline: [100, 98, 100, 100, 92, 100, 100, 100, 100, 100, 100, 96],
  },
  {
    idx: 'a04',
    name: 'Schema drift detector',
    trigger: 'ingest · new column or type change',
    destination: 'linear · Data Eng inbox',
    schedule: 'on event',
    lastFired: '4h ago',
    runs: 12,
    successRate: 92,
    status: 'error',
    sparkline: [100, 100, 100, 80, 100, 100, 100, 60, 100, 100, 100, 100],
  },
];

const STATUS_LABEL: Record<Auto['status'], string> = {
  running: 'running',
  idle: 'idle',
  error: 'attention',
};

export function Automations() {
  return (
    <section
      id="automations"
      className="relative w-full border-t border-border py-16 md:py-24"
    >
      <Container size="wide">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <SectionHeading
            title="Work that runs itself."
            body="Schedules, alerts, and triggers. Xai watches your data and ships the answer before you ask."
          />
          <Reveal delay={0.3}>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
              4 active · 227 runs · 30d
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
          {AUTOMATIONS.map((a, idx) => (
            <motion.div
              key={a.idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: (idx % 2) * 0.1,
              }}
              className="group flex flex-col gap-6 bg-bg-base p-7 transition-colors duration-500 hover:bg-bg-elev1 md:p-9"
            >
              {/* header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <StatusPulse
                    size="sm"
                    className="mt-1.5 text-fg-dim"
                  />
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
                      {a.idx} · {STATUS_LABEL[a.status]}
                    </div>
                    <h3 className="mt-1.5 text-xl font-medium tracking-tight md:text-2xl">
                      {a.name}
                    </h3>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
                  {a.schedule}
                </span>
              </div>

              {/* trigger → destination */}
              <div className="grid grid-cols-1 gap-3 border-y border-border py-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-dim">
                    trigger
                  </span>
                  <span className="font-mono text-[12px] text-fg-muted">
                    {a.trigger}
                  </span>
                </div>
                <span className="hidden font-mono text-[12px] text-fg-dim sm:block">
                  →
                </span>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-dim">
                    destination
                  </span>
                  <span className="font-mono text-[12px] text-fg-muted">
                    {a.destination}
                  </span>
                </div>
              </div>

              {/* sparkline + stats */}
              <div className="flex items-end justify-between gap-4">
                <div
                  className={`flex-1 ${
                    a.status === 'error'
                      ? 'text-fg/70'
                      : a.status === 'idle'
                      ? 'text-fg/40'
                      : 'text-fg/90'
                  }`}
                >
                  <Sparkline data={a.sparkline} height={24} />
                </div>
                <div className="flex shrink-0 items-end gap-6 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
                  <div className="flex flex-col items-end gap-0.5">
                    <span>last fired</span>
                    <span className="text-fg-muted">{a.lastFired}</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span>runs 30d</span>
                    <span className="tabular text-fg-muted">{a.runs}</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span>success</span>
                    <span className="tabular text-fg-muted">
                      {a.successRate}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}