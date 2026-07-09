'use client';

import { motion } from 'framer-motion';
import { FLOW_STEPS } from '@/lib/mockData';
import { StepVisual } from './StepVisual';

export function FlowStage() {
  return (
    <div className="grid grid-cols-1 gap-px md:grid-cols-3 md:gap-0">
      {FLOW_STEPS.map((step, idx) => (
        <motion.div
          key={step.n}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
            delay: idx * 0.12,
          }}
          whileHover={{ y: -4 }}
          className="group relative border border-border bg-bg-elev1 p-8 transition-colors duration-500 hover:border-border-hi md:p-10"
        >
          {/* index + visual */}
          <div className="flex items-start justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-dim">
              {step.n}
            </span>
            <StepVisual kind={step.visual} />
          </div>

          <h3 className="mt-12 text-2xl font-medium tracking-tight md:text-3xl">
            {step.title}
          </h3>
          <p className="mt-3 max-w-[320px] text-sm leading-relaxed text-fg-muted">
            {step.body}
          </p>

          {/* meta line */}
          <div className="mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
            <span className="grid h-1 w-1 place-items-center rounded-full bg-fg-dim" />
            <span>
              stage {step.n} · {step.visual}
            </span>
          </div>

          {/* corner tick */}
          <span className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] text-fg-dim opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            →
          </span>
        </motion.div>
      ))}
    </div>
  );
}