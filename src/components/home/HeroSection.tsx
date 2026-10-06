import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import InteractiveTerminal from './InteractiveTerminal';
import CharacterPanel from './CharacterPanel';

interface HeroSectionProps {
  level: number;
  currentLevelXP: number;
  xpToNextLevel: number;
  skills: Record<string, number>;
}

const HeroSection = ({ level }: HeroSectionProps) => {
  return (
    <section className="relative pt-36 pb-24 px-4 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="container mx-auto max-w-6xl px-0 relative">
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

            <InteractiveTerminal />

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

          <div className="lg:col-span-5">
            <CharacterPanel level={level} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
