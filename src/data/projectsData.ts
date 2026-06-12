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
    tagline: 'Your money, shown plainly.',
    summary:
      'A local-first financial literacy engine for Singapore. It computes, compares, and explains, but never tells you what to buy.',
    description: [
      "af.fluent is a dual-mode financial literacy engine for Singapore. A public education mode computes, compares, and teaches, but never recommends. A gated adviser mode, unlocked only behind the operator's licensed status, adds the tailored recommendations and compliance scaffolding the Financial Advisers Act requires.",
      "The hard part was never the arithmetic. It's the line between education and advice. Every figure traces back to a pure calculation layer; the model only picks which calc to run and narrates the result, never inventing a number. In public mode, the recommendation capability isn't hidden, it's absent.",
      'The numbers are real and dated: 2026 CPF tables, MediShield Life premiums, and MAS planning benchmarks, all versioned and refreshed each January rather than hardcoded in logic. CPF is projected year by year to retirement, through SA closing into RA at 55, the MediSave cap, and CPF LIFE.',
      "The demo below is the live public-education frontend: change any input and every panel recomputes. It's an early prototype of something that could stand on its own as a product.",
    ],
    status: 'In development',
    year: '2026',
    stack: ['React', 'TypeScript', 'Python', 'FastAPI', 'DuckDB', 'Local LLM'],
    domains: ['Fintech', 'Singapore', 'Financial literacy'],
    accent: '#2F7F66',
    icon: LineChart,
    demo: 'affluent',
    demoLabel: 'Live demo · public-education mode · fully interactive',
    demoNote: 'Nothing you type is stored.',
    demoCaption:
      'Figures are illustrative estimates computed from your inputs against published 2026 Singapore methodology. af.fluent computes and compares; it never tells you what to buy.',
    highlights: [
      { label: 'Modes', value: 'Public + Adviser' },
      { label: 'Jurisdiction', value: 'Singapore · 2026' },
      { label: 'Stance', value: 'Education, not advice' },
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
