import { LineChart, type LucideIcon } from 'lucide-react';

export type ProjectStatus = 'Live' | 'In development' | 'Prototype' | 'Archived';

// Which embedded interactive demo (if any) the detail page should mount.
export type ProjectDemo = 'affluent';

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
    highlights: [
      { label: 'Modes', value: 'Public + Adviser' },
      { label: 'Jurisdiction', value: 'Singapore · 2026' },
      { label: 'Stance', value: 'Education, not advice' },
    ],
  },
];

// Shared so the listing card and the detail header colour status identically.
export const statusStyles: Record<ProjectStatus, string> = {
  Live: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  'In development': 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  Prototype: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  Archived: 'border-white/10 bg-secondary text-muted-foreground',
};

export const getProjectBySlug = (slug?: string): ProjectType | undefined =>
  projectsData.find((p) => p.slug === slug);
