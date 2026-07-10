'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/primitives/Container';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { LineageStrip } from './LineageStrip';

const SAMPLE_QUESTIONS = [
  'Why did EMEA revenue drop on Monday?',
  'Which cohort has the best 90-day retention?',
  'Forecast Q4 close based on current run-rate',
  'Show me all anomalies in the last 24 hours',
];

type Answer = {
  body: string;
  bullets: string[];
  sources: string[];
  confidence: number;
};

const ANSWERS: Record<string, Answer> = {
  'Why did EMEA revenue drop on Monday?': {
    body:
      'EMEA revenue dropped 12.4% on Mon Aug 19 vs. the prior 4-week baseline. Two compounding factors:',
    bullets: [
      'Stripe webhook latency spiked to 4.2s at 09:14 UTC — 23% of orders landed >30s after cart, dropping conversion',
      'Refund rate on order_eur > €80 climbed to 7.1% (baseline 2.4%) — isolated to SKU WIDGET-PRO-2 from supplier ACME-EU',
    ],
    sources: ['stripe.payments', 'orders_eur_q3.csv', 'refund_events'],
    confidence: 0.94,
  },
  'Which cohort has the best 90-day retention?': {
    body:
      'Cohorts acquired via the Q2 partner program retain 38% better at day 90 vs. paid social. Breakdown by channel:',
    bullets: [
      'partner referral · 71% d90 retained (n=2,840)',
      'organic search · 58% d90 retained (n=8,210)',
      'paid social · 47% d90 retained (n=14,920)',
      'cold outbound · 31% d90 retained (n=1,180)',
    ],
    sources: ['mixpanel.events', 'hubspot.contacts', 'ltv_model_v3'],
    confidence: 0.91,
  },
  'Forecast Q4 close based on current run-rate': {
    body:
      'Based on the trailing 28-day run-rate, Q4 closes at $4.82M ARR — within 6% of the $5.1M board target. Confidence intervals:',
    bullets: [
      'p50 forecast · $4.82M (current trajectory)',
      'p90 forecast · $5.34M (assumes partner pipeline closes on schedule)',
      'p10 forecast · $4.21M (assumes Q4 paid social spend holds)',
    ],
    sources: ['stripe.subscriptions', 'salesforce.opportunities', 'forecast_model_v7'],
    confidence: 0.82,
  },
  'Show me all anomalies in the last 24 hours': {
    body: 'Xai surfaced 6 anomalies in the last 24h. Three warrant attention now:',
    bullets: [
      'signup_rate · EU-west · -34% · 03:42 UTC · likely regional CDN issue',
      'p95_latency · api.gateway · +180% · ongoing · page on-call',
      'refund_rate · WIDGET-PRO-2 · +210% · 07:15 UTC · supplier batch fault',
    ],
    sources: ['anomaly_detector.v4', 'pagerduty.incidents', 'supplier_quality_log'],
    confidence: 0.97,
  },
};

export function AskXai() {
  const [active, setActive] = useState(SAMPLE_QUESTIONS[0]);
  const [typed, setTyped] = useState('');
  const [showBullets, setShowBullets] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const inViewRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const answer = ANSWERS[active];

  // Trigger typing when section enters viewport (once)
  useEffect(() => {
    const el = inViewRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !hasTriggered) {
            setHasTriggered(true);
            startTyping();
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTriggered]);

  // Re-run typing when chip switches (only after first trigger)
  useEffect(() => {
    if (!hasTriggered) return;
    startTyping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  function startTyping() {
    if (typingRef.current) clearInterval(typingRef.current);
    setTyped('');
    setShowBullets(false);
    setShowMeta(false);
    const full = answer.body;
    let i = 0;
    typingRef.current = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        if (typingRef.current) clearInterval(typingRef.current);
        typingRef.current = null;
        setTimeout(() => setShowBullets(true), 200);
        setTimeout(() => setShowMeta(true), 600);
      }
    }, 14);
  }

  useEffect(
    () => () => {
      if (typingRef.current) clearInterval(typingRef.current);
    },
    [],
  );

  return (
    <section
      id="ask"
      ref={inViewRef}
      className="relative w-full border-t border-border py-32 md:py-48"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
      <Container size="wide" className="relative">
        <div className="mb-16 md:mb-20">
          <SectionHeading
            title="Ask anything."
            muted="Xai reasons over your data."
            body="Plain English. Every answer cites its sources. Every query stays in your workspace."
            maxWidth="820px"
          />
        </div>

        {/* The query surface */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-sm border border-border bg-bg-elev1"
        >
          {/* input row */}
          <div className="flex items-center gap-3 border-b border-border px-5 py-4 md:px-6">
            <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-fg shadow-[0_0_12px_rgba(250,250,250,0.6)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
              xai · workspace
            </span>
            <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
              ⌘ k
            </span>
          </div>

          {/* prompt input */}
          <div className="border-b border-border px-5 py-6 md:px-6 md:py-7">
            <div className="flex items-start gap-3">
              <span className="mt-2 font-mono text-xs text-fg-dim">{'>'}</span>
              <div className="flex-1">
                <div className="text-lg leading-snug text-fg md:text-xl">
                  {active}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="ml-1 inline-block h-5 w-[1.5px] -mb-1 bg-fg"
                  />
                </div>
                {/* chip row */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {SAMPLE_QUESTIONS.map((q) => {
                    const isActive = q === active;
                    return (
                      <button
                        key={q}
                        onClick={() => setActive(q)}
                        className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ${
                          isActive
                            ? 'border-fg bg-fg text-bg-base'
                            : 'border-border bg-bg-base text-fg-muted hover:border-border-hi hover:text-fg'
                        }`}
                      >
                        {q}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* answer panel */}
          <div className="min-h-[260px] px-5 py-7 md:px-6 md:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
                  answer · reasoning model ensemble · 0.{Math.floor(answer.confidence * 100)}s
                </div>
                <p className="mt-4 max-w-[820px] text-base leading-relaxed text-fg md:text-lg">
                  {typed}
                  {typed.length < answer.body.length && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      className="ml-0.5 inline-block h-4 w-[1.5px] -mb-0.5 bg-fg-muted"
                    />
                  )}
                </p>

                {showBullets && (
                  <motion.ul
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-5 flex flex-col gap-2"
                  >
                    {answer.bullets.map((b, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="flex items-start gap-3 text-sm leading-relaxed text-fg-muted md:text-base"
                      >
                        <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-fg" />
                        <span>{b}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}

                {showMeta && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim"
                  >
                    <div className="flex items-center gap-2">
                      <span>sources</span>
                      <span className="flex flex-wrap items-center gap-1.5 text-fg-muted normal-case tracking-normal">
                        {answer.sources.map((s, i) => (
                          <span key={s} className="flex items-center gap-1.5">
                            <span className="rounded-sm border border-border-hi bg-bg-elev2 px-1.5 py-0.5">
                              {s}
                            </span>
                            {i < answer.sources.length - 1 && <span>·</span>}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>confidence</span>
                      <span className="text-fg">
                        {(answer.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>trace</span>
                      <span className="text-fg">view</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </Container>

      <div className="relative mt-12">
        <LineageStrip />
      </div>
    </section>
  );
}