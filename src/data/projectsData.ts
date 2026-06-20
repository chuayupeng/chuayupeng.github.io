import { LineChart, Gamepad2, ShieldAlert, type LucideIcon } from 'lucide-react';

export type ProjectStatus =
  | 'Live'
  | 'Active · internal use only'
  | 'In development'
  | 'Prototype'
  | 'Archived';

// Which embedded interactive demo (if any) the detail page should mount.
export type ProjectDemo = 'affluent' | 'suzaku' | 'finrpg';

export interface ProjectType {
  slug: string;
  title: string;
  tagline: string;
  /** One-liner for the listing card. */
  summary: string;
  /** Paragraphs for the detail page intro. */
  description: string[];
  status: ProjectStatus;
  year: string;
  stack: string[];
  domains: string[];
  /** Accent hex used for the card glow / icon chip. */
  accent: string;
  icon: LucideIcon;
  /** Mounts the matching live demo on the detail page. */
  demo?: ProjectDemo;
  /** Per-demo framing copy shown around the embed on the detail page. */
  demoLabel?: string;
  demoNote?: string;
  demoCaption?: string;
  /** Small stat chips shown in the detail header. */
  highlights?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
}

export const projectsData: ProjectType[] = [
  {
    slug: 'affluent',
    title: 'af.fluent',
    tagline: 'Your whole financial life, planned.',
    summary:
      'A local-first personal finance planner for Singapore: track your money, budget, investments, CPF, retirement and insurance in one place — and get told exactly what to do.',
    description: [
      'af.fluent is a complete personal-finance operating system for Singapore. Nine modules — dashboard, cashflow, investments, goals, retirement, tax, CPF, insurance and settings — share one data model, so the take-home in your budget, the CPF LIFE floor in your retirement plan, the SRS relief in your tax view, and the premiums in your protection checklist all agree.',
      "It doesn't just compute — it prescribes. It tells you the exact dollar amount to invest into ETFs each month, projects your nest egg and models the drawdown to your planned age (with CPF LIFE as the guaranteed floor), sizes every protection line against your DIME needs, prices your tax and the SRS/top-up moves that cut it, and ranks your next moves by impact via a financial-health score.",
      'The numbers are real and dated: 1 Jan 2026 CPF contribution and allocation tables, retirement sums, the Basic Healthcare Sum, MediShield Life premiums, IRAS resident tax brackets and MoneySense/LIA benchmarks — verified against official sources and refreshed each January. CPF is projected year by year through SA→RA at 55, the MediSave cap and CPF LIFE.',
      'Everything is local-first: your data lives only in your browser, persists across visits, and exports to a file you own. Light and dark themes, a guided first-run, and full keyboard/mobile support. The demo below is the full product — change any input and every module recomputes live.',
    ],
    status: 'Live',
    year: '2026',
    stack: ['React', 'TypeScript', 'Local-first', 'CPF / IRAS 2026 data', 'SVG charts'],
    domains: ['Fintech', 'Singapore', 'Personal finance'],
    accent: '#2F7F66',
    icon: LineChart,
    demo: 'affluent',
    demoLabel: 'Live product · tracks locally · fully interactive',
    demoNote: 'Your data stays in your browser.',
    demoCaption:
      'A working planner, not a mockup. Figures are computed from your inputs against verified 1 Jan 2026 Singapore methodology; investment returns and inflation are assumptions you control. Everything persists locally to this browser.',
    highlights: [
      { label: 'Modules', value: '9 · one data model' },
      { label: 'Jurisdiction', value: 'Singapore · 2026' },
      { label: 'Output', value: 'Prescriptive plan' },
    ],
  },
  {
    slug: 'suzaku',
    title: 'Suzaku',
    tagline: 'Find the click before the attacker does.',
    summary:
      'A phishing-simulation and security-awareness platform: launch authorized campaigns, watch who opens, clicks, and reports, and measure human risk in real time.',
    description: [
      'Suzaku is a phishing-simulation platform for security teams — the same category as GoPhish or KnowBe4. It runs authorized, consent-based simulated phishing against an organization\'s own staff, then turns the results into targeted awareness training. A defensive instrument: find who would click before a real attacker does. It was built and run internally for an authorized campaign.',
      'The dashboard below is the part worth showing: an attack funnel from sent → opened → clicked → credentials captured → reported, a per-department breakdown of who fell for it, and a live event stream — with a risk level derived from the capture rate so a security lead can read it at a glance. The technical anatomy of one such lure (calendar injection, OAuth redirect laundering, and a spoofed Teams button) is in the linked writeup.',
      'What you see here is a front-end mockup only: sample data, no backend, no email sending, no credential capture. Every button is a visual no-op — it exists purely to show the platform UI.',
    ],
    status: 'Active · internal use only',
    year: '2025',
    stack: ['React', 'Vite', 'Recharts', 'Python', 'FastAPI'],
    domains: ['Security', 'Awareness training', 'Phishing simulation'],
    accent: '#ef4444',
    icon: ShieldAlert,
    demo: 'suzaku',
    demoLabel: 'Live demo · campaign analytics · UI mockup',
    demoNote: 'Sample data — no live functionality.',
    demoCaption:
      'A front-end mockup of the campaign-analytics dashboard. No emails are sent and nothing is captured — every figure here is hardcoded sample data.',
    links: [{ label: 'Read the campaign writeup', href: '/blog/calendar-phishing-chain' }],
    highlights: [
      { label: 'Category', value: 'Awareness training' },
      { label: 'Use', value: 'Authorized testing only' },
      { label: 'This demo', value: 'UI mockup, no functionality' },
    ],
  },
  {
    slug: 'finrpg',
    title: 'FinRPG',
    tagline: 'Money pets that thrive when you do.',
    summary:
      'A gamified personal-finance tracker where four "money pets" grow, evolve, or sulk based on your savings, net worth, debt, and assets.',
    description: [
      'FinRPG turns personal finance into something you actually want to check. Your money is four creatures — a Phoenix for savings, a Dragon for net worth, a Tortoise for debt, a Tiger for owned assets — that evolve through six stages and shift mood with your real numbers. Pay down the bad debt and the Tortoise calms; let spending outrun income and the Phoenix sulks.',
      "Under the gamification is a real finance app: net worth, savings rate, income and spending, good-vs-bad debt, budgets, and transaction logging. It's offline-first, so everything you enter stays on your own device via the browser's IndexedDB — no account, no server, nothing uploaded.",
      'The screen below is the home dashboard, rendered with sample data.',
    ],
    status: 'Live',
    year: '2025',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Dexie / IndexedDB', 'PWA'],
    domains: ['Fintech', 'Gamification', 'Mobile'],
    accent: '#f59e0b',
    icon: Gamepad2,
    demo: 'finrpg',
    demoLabel: 'Live demo · home dashboard · sample data',
    demoNote: 'Sample data — in the real app, everything stays on your device.',
    demoCaption:
      'A static showcase of the FinRPG home screen. The live app at finrpg.vercel.app stores all your data locally on-device — nothing is ever uploaded.',
    links: [{ label: 'Open the live app', href: 'https://finrpg.vercel.app/' }],
    highlights: [
      { label: 'Concept', value: 'Four money pets' },
      { label: 'Live at', value: 'finrpg.vercel.app' },
      { label: 'Your data', value: 'On-device only' },
    ],
  },
];

// Shared so the listing card and the detail header colour status identically.
export const statusStyles: Record<ProjectStatus, string> = {
  Live: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  'Active · internal use only': 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  'In development': 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Prototype: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  Archived: 'border-white/10 bg-secondary text-muted-foreground',
};

export const getProjectBySlug = (slug?: string): ProjectType | undefined =>
  projectsData.find((p) => p.slug === slug);
