import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github, Linkedin, Mail, Shield, Wine, Rocket } from 'lucide-react';

interface HeroSectionProps {
  level: number;
  currentLevelXP: number;
  xpToNextLevel: number;
  skills: Record<string, number>;
}

// Self-reported focus levels — kept manual so they reflect intent, not item counts.
const FOCUS_SKILLS = [
  { key: 'cybersecurity',    label: 'Security',         icon: Shield, color: 'text-blue-400',   gradient: 'from-blue-500 to-blue-400',     pct: 75 },
  { key: 'entrepreneurship', label: 'Entrepreneurship', icon: Rocket, color: 'text-purple-400', gradient: 'from-purple-500 to-purple-400', pct: 35 },
  { key: 'f&b',              label: 'F&B',              icon: Wine,   color: 'text-amber-400',  gradient: 'from-amber-500 to-amber-400',   pct: 20 },
] as const;

const HeroSection = ({ level }: HeroSectionProps) => {
  return (
    <section className="relative pt-36 pb-24 px-4 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-7 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="chip">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
                Available for new quests
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              From <span className="gradient-text">elixirs</span>
              <br />
              to <span className="gradient-text">exploits</span>.
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              I'm <span className="text-foreground font-medium">Yu Peng</span> — a cybersecurity
              engineer and entrepreneur, with side quests through F&amp;B. I break and harden systems
              by day, and build the things I wish existed by night.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button asChild size="lg" className="bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/90 group">
                <Link to="/timeline" className="inline-flex items-center">
                  View timeline
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/10 hover:bg-secondary text-foreground">
                <Link to="/about">About me</Link>
              </Button>
              <div className="flex items-center gap-1 ml-2">
                <a href="https://github.com/chuayupeng" target="_blank" rel="noreferrer"
                   className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-cyber-cyan hover:bg-secondary transition-colors" aria-label="GitHub">
                  <Github size={18} />
                </a>
                <a href="https://linkedin.com/in/chuayupeng" target="_blank" rel="noreferrer"
                   className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-cyber-cyan hover:bg-secondary transition-colors" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href="mailto:yupeng@u.nus.edu"
                   className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-cyber-cyan hover:bg-secondary transition-colors" aria-label="Email">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Terminal-style stats card */}
          <div className="lg:col-span-5">
            <div className="card-surface overflow-hidden animate-fade-in" style={{ animationDelay: '120ms' }}>
              {/* window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-black/20">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">~/character.json</span>
              </div>

              <div className="p-6 space-y-5 font-mono text-sm">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">years_in_security</div>
                    <div className="text-3xl font-bold text-foreground tabular-nums">
                      {String(level).padStart(2, '0')}
                      <span className="text-base font-normal text-muted-foreground ml-1">yrs</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">since</div>
                    <div className="text-foreground tabular-nums">
                      {new Date().getFullYear() - level}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-1 border-t border-white/[0.06]">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground pt-3">
                    focus_areas
                  </div>
                  {FOCUS_SKILLS.map(({ key, label, icon: Icon, color, gradient, pct }) => (
                    <div key={key} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className={color} />
                          <span className="text-foreground/90">{label}</span>
                        </div>
                        <span className="text-muted-foreground tabular-nums">{pct}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1 overflow-hidden">
                        <div
                          className={`h-1 rounded-full bg-gradient-to-r ${gradient}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 text-xs text-muted-foreground border-t border-white/[0.06]">
                  <span className="terminal-cursor">$ ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
