import { Radar, Bug, ChefHat, ShieldCheck } from 'lucide-react';
import { KaliDragonIcon, SpiderIcon, ChainsIcon, WolfIcon, lineIcon } from '@/components/home/offsecIcons';

/** Broad discipline a credential evidences — used to group the skill areas. */
export type Domain =
  | 'Offensive Security'
  | 'Web Security'
  | 'AI Security'
  | 'Security Assessment'
  | 'Food Safety';

export interface Certification {
  title: string;
  org: string;
  description: string;
  /** Short form shown on the cards: a single year, or a range for time-boxed certs. */
  year: string;
  icon: any;
  color: string;
  active: boolean;
  domain: Domain;
  /** Vendor course code, where the cert maps to one (PEN-200, AI-300, …). */
  code?: string;
  /** Exact dates, where they're known from the credential record. */
  issued?: string;
  expires?: string;
  /** Exam format, for the certs whose format is a matter of public record. */
  exam?: string;
  verifyUrl?: string;
}

export const certifications: Certification[] = [
  {
    title: 'OSCP', org: 'OffSec', description: 'OffSec Certified Professional',
    year: '2019', icon: KaliDragonIcon, color: 'text-red-400', active: true,
    domain: 'Offensive Security', code: 'PEN-200',
    issued: '2019', expires: 'Does not expire',
    exam: '24-hour practical exam',
  },
  {
    title: 'OSWE', org: 'OffSec', description: 'OffSec Web Expert',
    year: '2020', icon: SpiderIcon, color: 'text-purple-400', active: true,
    domain: 'Web Security', code: 'WEB-300',
    issued: '2020', expires: 'Does not expire',
    exam: '48-hour practical exam',
  },
  {
    title: 'OSEP', org: 'OffSec', description: 'OffSec Experienced Penetration Tester',
    year: '2026', icon: ChainsIcon, color: 'text-orange-400', active: true,
    domain: 'Offensive Security', code: 'PEN-300',
    issued: '2026', expires: 'Does not expire',
    exam: '48-hour practical exam',
  },
  {
    title: 'OSAI', org: 'OffSec', description: 'OffSec AI Red Teamer',
    year: '2026', icon: WolfIcon, color: 'text-rose-500', active: true,
    domain: 'AI Security', code: 'AI-300',
    issued: '4 September 2026', expires: 'Does not expire',
    exam: '24-hour proctored AI red team engagement',
    verifyUrl: 'https://credentials.offsec.com/e6e5c3e8-f187-4f21-9a44-fe3ff4652704',
  },
  {
    title: 'OSAI+', org: 'OffSec', description: 'OffSec AI Red Teamer, 3-year designation',
    year: '2026–2029', icon: WolfIcon, color: 'text-rose-500', active: true,
    domain: 'AI Security', code: 'AI-300',
    issued: '4 September 2026', expires: '3 September 2029',
    exam: '24-hour proctored AI red team engagement',
    verifyUrl: 'https://credentials.offsec.com/cf4d802f-0118-442e-9c0f-d5255a2c5d2d',
  },
  {
    title: 'CRTO', org: 'Zero-Point Security', description: 'Certified Red Team Operator',
    year: '2021', icon: lineIcon(Radar, 'Radar'), color: 'text-rose-400', active: true,
    domain: 'Offensive Security',
    issued: '2021', expires: 'Does not expire',
  },
  {
    title: 'CPSA', org: 'CREST', description: 'Practitioner Security Analyst',
    year: '2019–2022', icon: lineIcon(ShieldCheck, 'ShieldCheck'), color: 'text-blue-400', active: false,
    domain: 'Security Assessment',
    issued: '2019', expires: '2022',
  },
  {
    title: 'CRT', org: 'CREST', description: 'Registered Penetration Tester',
    year: '2019–2022', icon: lineIcon(Bug, 'Bug'), color: 'text-sky-400', active: false,
    domain: 'Offensive Security',
    issued: '2019', expires: '2022',
  },
  {
    title: 'WSQ FSC L3', org: 'SkillsFuture Singapore', description: 'Food Safety & Hygiene Officer',
    year: '2024', icon: lineIcon(ChefHat, 'ChefHat'), color: 'text-amber-400', active: true,
    domain: 'Food Safety',
    issued: '2024', expires: 'Does not expire',
  },
];

/**
 * Focus areas as shown in the hero's character.json, with the credentials that
 * back each one. Weights match the hero so the two don't drift apart.
 */
export const focusAreas: { label: string; weight: number; domains: Domain[] }[] = [
  { label: 'Security',         weight: 75, domains: ['Offensive Security', 'Web Security', 'AI Security', 'Security Assessment'] },
  { label: 'Entrepreneurship', weight: 35, domains: [] },
  { label: 'F&B',              weight: 20, domains: ['Food Safety'] },
];

export const certsForDomains = (domains: Domain[]) =>
  certifications.filter((c) => domains.includes(c.domain));

/** Passport holder details, kept here so both page designs read from one source. */
export const holder = {
  surname: 'CHUA',
  givenNames: 'YU PENG',
  alias: 'yup.eng',
  role: 'Security Engineer',
  nationality: 'Singapore',
  nationalityCode: 'SGP',
  authority: 'Self-issued',
  since: 2019,
};

/**
 * Builds the two 44-character machine-readable lines shown along the foot of
 * the passport. Line 1 follows the real ICAO name format; line 2 is a
 * deliberate riff on it, packing the credential codes instead of a document
 * number.
 */
export const mrzLines = (): [string, string] => {
  const pad = (s: string) => (s + '<'.repeat(44)).slice(0, 44);
  const name = `P<${holder.nationalityCode}${holder.surname}<<${holder.givenNames.replace(/ /g, '<')}`;
  const codes = certifications
    .filter((c) => c.active)
    .map((c) => `${c.title.replace('+', 'P')}${c.issued?.slice(-4) ?? ''}`)
    .join('<');
  return [pad(name), pad(codes)];
};
