'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/primitives/Container';
import { StatusPulse } from '@/components/primitives/StatusPulse';

const SOURCES = [
  'orders.csv',
  'stripe',
  'postgres',
  'segment',
  's3',
  'salesforce',
  'snowflake',
  'hubspot',
  'mixpanel',
  'kafka',
  'mongodb',
  'bigquery',
] as const;

export function LineageStrip() {
  return (
    <Container size="wide">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
        <StatusPulse label="sourced from" className="shrink-0 text-fg-dim" />
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {SOURCES.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{
                duration: 0.4,
                delay: i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-sm border border-border bg-bg-elev1 px-2.5 py-1 font-mono text-[11px] text-fg-muted"
            >
              {s}
            </motion.span>
          ))}
          <span className="font-mono text-[11px] text-fg-dim">
            +28 more
          </span>
        </div>
      </div>
    </Container>
  );
}