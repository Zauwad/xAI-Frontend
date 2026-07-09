'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: 'Navigate' | 'Insights' | 'Automations' | 'Demo' | 'Help';
  shortcut?: string;
  run: () => void;
};

const FUZZY_SCORE = (q: string, s: string) => {
  if (!q) return 1;
  q = q.toLowerCase();
  s = s.toLowerCase();
  let qi = 0;
  let score = 0;
  let streak = 0;
  for (let i = 0; i < s.length && qi < q.length; i++) {
    if (s[i] === q[qi]) {
      qi++;
      streak++;
      score += 10 + streak * 4;
    } else {
      streak = 0;
    }
  }
  if (qi < q.length) return -1;
  if (s.startsWith(q)) score += 50;
  return score;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = (id: string) => {
    setOpen(false);
    setQ('');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const actions: Action[] = useMemo(
    () => [
      {
        id: 'hero',
        label: 'Go to Hero',
        hint: 'From raw data to decisions',
        group: 'Navigate',
        run: () => navigate('hero'),
      },
      {
        id: 'flow',
        label: 'Go to Process',
        hint: 'How Xai works',
        group: 'Navigate',
        run: () => navigate('flow'),
      },
      {
        id: 'dashboard',
        label: 'Go to Product',
        hint: 'The dashboard surface',
        group: 'Navigate',
        run: () => navigate('dashboard'),
      },
      {
        id: 'signature',
        label: 'Go to Signature',
        hint: 'Cursor-reactive object',
        group: 'Navigate',
        run: () => navigate('signature'),
      },
      {
        id: 'top',
        label: 'Back to top',
        group: 'Navigate',
        run: () => navigate('top'),
      },
      {
        id: 'demo-cycle',
        label: 'Auto-cycle dashboard tabs',
        hint: 'Demo mode — runs every 6s',
        group: 'Demo',
        run: () => window.dispatchEvent(new CustomEvent('xai:demo-cycle')),
      },
      {
        id: 'demo-stop',
        label: 'Stop demo',
        group: 'Demo',
        run: () => window.dispatchEvent(new CustomEvent('xai:demo-stop')),
      },
      {
        id: 'demo-explode',
        label: 'Trigger signature explosion',
        hint: 'Shatter mesh into 12 shards',
        group: 'Demo',
        run: () => window.dispatchEvent(new CustomEvent('xai:explode')),
      },
      {
        id: 'insight-anomaly',
        label: 'Insight: EU-west signup drop',
        hint: 'anomaly · model.detector',
        group: 'Insights',
        run: () => navigate('dashboard'),
      },
      {
        id: 'insight-expansion',
        label: 'Insight: Expansion candidates',
        hint: 'opportunity · $184k ARR',
        group: 'Insights',
        run: () => navigate('dashboard'),
      },
      {
        id: 'auto-revenue',
        label: 'Automation: Daily revenue digest',
        hint: 'cron 08:00 UTC → Slack',
        group: 'Automations',
        run: () => navigate('dashboard'),
      },
      {
        id: 'auto-churn',
        label: 'Automation: Churn risk escalation',
        hint: 'model.score > 0.78 → PagerDuty',
        group: 'Automations',
        run: () => navigate('dashboard'),
      },
      {
        id: 'shortcuts',
        label: 'Show keyboard shortcuts',
        hint: '⌘K · G H · G P · G S · X to explode',
        group: 'Help',
        run: () => alert('⌘K — palette\nG then H — Hero\nG then P — Product\nG then S — Signature\nX — explode mesh'),
      },
      {
        id: 'about',
        label: 'About this prototype',
        hint: 'stack + decisions',
        group: 'Help',
        run: () =>
          alert(
            'Xai prototype.\nNext 14 · R3F · GSAP · Framer.\nHand-rolled shaders, no chart libs, no UI kits.\nRead README.md for engineering notes.',
          ),
      },
    ],
    [],
  );

  const filtered: Action[] = useMemo(() => {
    if (!q.trim()) return actions.slice(0, 10);
    const scored = actions
      .map((a) => ({
        a,
        s: Math.max(FUZZY_SCORE(q, a.label), FUZZY_SCORE(q, a.hint ?? '')),
      }))
      .filter((x) => x.s > 0)
      .sort((x, y) => y.s - x.s)
      .slice(0, 10);
    return scored.map((x) => x.a);
  }, [q, actions]);

  // open with ⌘K / Ctrl-K / "/" when not in input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const inField = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
        setQ('');
        return;
      }
      if (e.key === '/' && !inField) {
        e.preventDefault();
        setOpen(true);
        setQ('');
        return;
      }
      // shortcuts
      if (!inField && !open) {
        if (e.key === 'x' || e.key === 'X') {
          window.dispatchEvent(new CustomEvent('xai:explode'));
        }
        if (e.key === 'g' || e.key === 'G') {
          const next = (ev: KeyboardEvent) => {
            document.removeEventListener('keydown', next, true);
            const key = ev.key.toLowerCase();
            if (key === 'h') navigate('hero');
            else if (key === 'p') navigate('dashboard');
            else if (key === 's') navigate('signature');
            else if (key === 'f') navigate('flow');
            else if (key === 't') navigate('top');
          };
          document.addEventListener('keydown', next, true);
        }
      }
      if (open) {
        if (e.key === 'Escape') {
          setOpen(false);
          setQ('');
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setIdx((i) => Math.min(filtered.length - 1, i + 1));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setIdx((i) => Math.max(0, i - 1));
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          filtered[idx]?.run();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, filtered, idx]);

  // focus input on open
  useEffect(() => {
    if (open) {
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const groups = useMemo(() => {
    const map = new Map<string, Action[]>();
    filtered.forEach((a) => {
      if (!map.has(a.group)) map.set(a.group, []);
      map.get(a.group)!.push(a);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-bg-base/70 px-4 pt-[14vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[620px] overflow-hidden rounded-md border border-border-hi bg-bg-elev1 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* input */}
            <div className="flex items-center gap-3 border-b border-border px-4">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-fg-dim">
                ⌘K
              </span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setIdx(0);
                }}
                placeholder="Jump anywhere. Search anything."
                className="flex-1 bg-transparent py-4 text-base text-fg placeholder:text-fg-dim focus:outline-none"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-dim">
                esc
              </span>
            </div>

            {/* results */}
            <div className="max-h-[58vh] overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-4 py-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-fg-dim">
                  no commands match
                </div>
              )}
              {groups.map(([group, items]) => (
                <div key={group} className="px-2 py-2">
                  <div className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-dim">
                    {group}
                  </div>
                  {items.map((a) => {
                    const flatIndex = filtered.indexOf(a);
                    const active = flatIndex === idx;
                    return (
                      <button
                        key={a.id}
                        onMouseEnter={() => setIdx(flatIndex)}
                        onClick={() => a.run()}
                        className={`flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                          active
                            ? 'bg-bg-elev2 text-fg'
                            : 'text-fg-muted hover:bg-bg-elev2'
                        }`}
                      >
                        <span className="flex flex-col">
                          <span>{a.label}</span>
                          {a.hint && (
                            <span className="font-mono text-[11px] text-fg-dim">
                              {a.hint}
                            </span>
                          )}
                        </span>
                        {active && (
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg">
                            ↵
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between border-t border-border bg-bg-elev2 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-dim">
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ run</span>
                <span>esc close</span>
              </div>
              <span>xai · workspace</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Trigger button mounted in nav
export function PaletteTrigger({ className = '' }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <button
      onClick={() => {
        const ev = new KeyboardEvent('keydown', {
          key: 'k',
          metaKey: true,
        });
        document.dispatchEvent(ev);
      }}
      className={`flex items-center gap-2 rounded-sm border border-border bg-bg-elev2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted transition-colors duration-300 hover:border-border-hi hover:text-fg ${className}`}
    >
      <span>search</span>
      <span className="text-fg-dim">⌘K</span>
    </button>
  );
}