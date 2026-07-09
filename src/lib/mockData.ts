export const KPIS = [
  {
    label: 'Records processed',
    value: 18429501,
    delta: '+12.4%',
    trend: [22, 24, 23, 27, 30, 28, 33, 36, 38, 41, 45, 48],
  },
  {
    label: 'Insights surfaced',
    value: 1284,
    delta: '+8.1%',
    trend: [10, 12, 11, 15, 14, 18, 20, 19, 23, 25, 28, 30],
  },
  {
    label: 'Automations running',
    value: 47,
    delta: '+3',
    trend: [12, 14, 14, 15, 17, 18, 19, 22, 23, 24, 25, 26],
  },
  {
    label: 'Mean latency',
    value: 184,
    suffix: 'ms',
    delta: '−42ms',
    trend: [38, 36, 35, 33, 32, 30, 29, 28, 26, 25, 24, 23],
    invert: true,
  },
];

export const TABLE_ROWS = [
  { id: 'A-1842', source: 'Stripe', kind: 'Transactions', count: 12844, status: 'Live', updated: '2m ago' },
  { id: 'A-1839', source: 'Postgres', kind: 'Users', count: 4912, status: 'Live', updated: '4m ago' },
  { id: 'A-1831', source: 'S3', kind: 'Events', count: 88211, status: 'Syncing', updated: '1m ago' },
  { id: 'A-1820', source: 'Segment', kind: 'Identities', count: 14402, status: 'Live', updated: '6m ago' },
  { id: 'A-1814', source: 'Snowflake', kind: 'Orders', count: 2204, status: 'Live', updated: '12m ago' },
  { id: 'A-1808', source: 'Mixpanel', kind: 'Sessions', count: 31188, status: 'Paused', updated: '38m ago' },
  { id: 'A-1801', source: 'Hubspot', kind: 'Contacts', count: 6022, status: 'Live', updated: '1h ago' },
  { id: 'A-1795', source: 'Linear', kind: 'Issues', count: 891, status: 'Live', updated: '2h ago' },
];

export const ACTIVITY = [
  { kind: 'insight', title: 'Churn risk cohort identified', actor: 'model.ensemble', time: 'Just now', live: true },
  { kind: 'automation', title: 'Daily revenue report dispatched', actor: 'automation.finance', time: '4m ago' },
  { kind: 'sync', title: 'Stripe → Warehouse backfill complete', actor: 'pipeline.stripe', time: '11m ago' },
  { kind: 'insight', title: 'Anomaly: signup drop in EU-west', actor: 'model.detector', time: '23m ago' },
  { kind: 'sync', title: 'Segment identities refreshed', actor: 'pipeline.segment', time: '1h ago' },
];

export const FLOW_STEPS = [
  {
    n: '01',
    title: 'Ingest',
    body: 'Connect any source. Streams, warehouses, APIs, files. Schema inferred automatically.',
    visual: 'ring',
  },
  {
    n: '02',
    title: 'Analyze',
    body: 'Models reason over the structured graph. Patterns surface without manual queries.',
    visual: 'node',
  },
  {
    n: '03',
    title: 'Surface',
    body: 'Insights route to the right person, dashboard, or automation — at the right moment.',
    visual: 'bar',
  },
] as const;