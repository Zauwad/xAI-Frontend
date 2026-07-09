'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Container } from '@/components/primitives/Container';
import { Reveal } from '@/components/primitives/Reveal';
import { KPIS } from '@/lib/mockData';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { KpiCard } from './KpiCard';
import { DataTable } from './DataTable';
import { ActivityFeed } from './ActivityFeed';
import { Sparkline } from './Sparkline';

const TABS = [
  { id: 'live', label: 'Live now' },
  { id: 'insights', label: 'Insights' },
  { id: 'automations', label: 'Automations' },
];

export function DashboardPreview() {
  const [tab, setTab] = useState('live');
  const [autoCycle, setAutoCycle] = useState(false);

  useEffect(() => {
    const onCycle = () => setAutoCycle(true);
    const onStop = () => setAutoCycle(false);
    window.addEventListener('xai:demo-cycle', onCycle);
    window.addEventListener('xai:demo-stop', onStop);
    return () => {
      window.removeEventListener('xai:demo-cycle', onCycle);
      window.removeEventListener('xai:demo-stop', onStop);
    };
  }, []);

  useEffect(() => {
    if (!autoCycle) return;
    const order = ['live', 'insights', 'automations'];
    let i = 0;
    setTab(order[i]);
    const id = setInterval(() => {
      i = (i + 1) % order.length;
      setTab(order[i]);
    }, 4500);
    return () => clearInterval(id);
  }, [autoCycle]);

  return (
    <section
      id="dashboard"
      className="relative w-full border-t border-border py-32 md:py-48"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
      <Container size="wide" className="relative">
        <div className="mb-20 flex flex-col gap-6 md:mb-24">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-fg-muted">
              <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-fg" />
              <span>03 — product</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="max-w-[760px] text-balance text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-6xl">
              The surface
              <br />
              <span className="text-fg-muted">where it lands.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="max-w-[520px] text-base leading-relaxed text-fg-muted">
              A real workspace. Sidebar, KPIs, datasets, activity. Tabs swap,
              numbers count up, hover states breathe.
            </p>
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-md border border-border bg-bg-elev1"
        >
          <div className="flex h-[640px] md:h-[720px]">
            <Sidebar />
            <div className="flex flex-1 flex-col">
              <TopBar />

              {/* tab strip */}
              <div className="flex items-center gap-1 border-b border-border bg-bg-elev1 px-6">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`relative px-3 py-2.5 font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${
                      tab === t.id ? 'text-fg' : 'text-fg-muted hover:text-fg'
                    }`}
                  >
                    {t.label}
                    {tab === t.id && (
                      <motion.span
                        layoutId="tab-underline"
                        className="absolute inset-x-0 bottom-0 h-px bg-fg"
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                  {autoCycle && (
                    <motion.span
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 rounded-sm border border-border-hi bg-bg-elev2 px-2 py-0.5 text-fg"
                    >
                      <span className="relative grid h-1.5 w-1.5 place-items-center">
                        <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-fg/60" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-fg" />
                      </span>
                      auto
                    </motion.span>
                  )}
                  <span>last sync</span>
                  <span className="text-fg-muted">2m ago</span>
                </div>
              </div>

              {/* content */}
              <div className="flex-1 overflow-hidden bg-bg-base p-6">
                <AnimatePresence mode="wait">
                  {tab === 'live' && (
                    <motion.div
                      key="live"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4 }}
                      className="grid h-full grid-rows-[auto_1fr_auto] gap-6"
                    >
                      <div className="grid grid-cols-2 gap-px md:grid-cols-4">
                        {KPIS.map((k, i) => (
                          <KpiCard key={k.label} {...k} delay={i * 0.06} />
                        ))}
                      </div>
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
                        <DataTable />
                        <ActivityFeed />
                      </div>
                      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                        <span>rendering 1,500 pts · 60 fps · 0 ms jank</span>
                        <span>esc to close · ⌘K to search</span>
                      </div>
                    </motion.div>
                  )}
                  {tab === 'insights' && (
                    <motion.div
                      key="insights"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4 }}
                      className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2"
                    >
                      <InsightCard
                        kind="anomaly"
                        title="EU-west signup drop"
                        body="Signups down 18% in last 6h. Cohort: organic, EU-west. Suspected: pricing page regression."
                        cta="Investigate"
                      />
                      <InsightCard
                        kind="opportunity"
                        title="Expansion candidates"
                        body="47 accounts match expansion pattern (5+ active seats, weekly active). ARR opportunity: $184k."
                        cta="Open cohort"
                      />
                      <InsightCard
                        kind="trend"
                        title="Adoption of Insights tab"
                        body="+34% week-over-week. Power users averaging 11.2 sessions/week."
                        cta="View trend"
                      />
                      <InsightCard
                        kind="alert"
                        title="Pipeline latency"
                        body="Stripe → warehouse pipeline P95 latency at 4.2s. Threshold 3.0s. Likely cause: schema drift."
                        cta="Inspect"
                      />
                    </motion.div>
                  )}
                  {tab === 'automations' && (
                    <motion.div
                      key="automations"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4 }}
                      className="grid h-full grid-cols-1 gap-6 lg:grid-cols-3"
                    >
                      {[
                        {
                          name: 'Daily revenue digest',
                          trigger: 'cron · 08:00 UTC',
                          target: 'Slack · #finance',
                          runs: 142,
                        },
                        {
                          name: 'Churn risk escalation',
                          trigger: 'model.score > 0.78',
                          target: 'PagerDuty · on-call',
                          runs: 12,
                        },
                        {
                          name: 'Schema drift detector',
                          trigger: 'on schema change',
                          target: 'Email · data-platform@',
                          runs: 8,
                        },
                      ].map((a) => (
                        <div
                          key={a.name}
                          className="flex flex-col gap-4 border border-border bg-bg-elev1 p-6 transition-colors duration-300 hover:border-border-hi"
                        >
                          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                            <span>automation</span>
                            <span className="tabular text-fg-muted">
                              {a.runs} runs
                            </span>
                          </div>
                          <h4 className="text-lg">{a.name}</h4>
                          <div className="mt-auto space-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                            <p>
                              when · <span className="text-fg-muted">{a.trigger}</span>
                            </p>
                            <p>
                              to · <span className="text-fg-muted">{a.target}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* subtle outer glow */}
          <div className="pointer-events-none absolute -inset-px rounded-md opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        </motion.div>

        {/* meta strip below the surface */}
        <div className="mt-6 grid grid-cols-2 gap-6 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim md:grid-cols-4">
          <span>
            surface · <span className="text-fg-muted">dashboard v0.1</span>
          </span>
          <span>
            components · <span className="text-fg-muted">9 inline</span>
          </span>
          <span>
            deps · <span className="text-fg-muted">0 chart libs</span>
          </span>
          <span>
            motion · <span className="text-fg-muted">framer + tailwind</span>
          </span>
        </div>
      </Container>
    </section>
  );
}

function InsightCard({
  kind,
  title,
  body,
  cta,
}: {
  kind: string;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group flex flex-col gap-4 border border-border bg-bg-elev1 p-6 transition-colors duration-500 hover:border-border-hi"
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
        <span>{kind}</span>
        <span>model.ensemble</span>
      </div>
      <h4 className="text-lg font-medium tracking-tight">{title}</h4>
      <p className="text-sm leading-relaxed text-fg-muted">{body}</p>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-muted transition-colors duration-300 group-hover:text-fg">
          {cta} →
        </span>
        <Sparkline
          data={[5, 7, 6, 8, 7, 9, 11, 10, 13, 15, 14, 18]}
          height={28}
        />
      </div>
    </motion.div>
  );
}