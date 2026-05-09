import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Terminal } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-background">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
                <Terminal className="h-4 w-4 text-cyber-cyan" />
              </div>
              <span className="font-mono text-sm font-semibold">
                <span className="text-foreground">yup</span>
                <span className="text-cyber-cyan">.eng</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              Cybersecurity engineer, founder, and tinkerer. Breaking things on purpose by day,
              shipping the things I wish existed by night.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
              Sitemap
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-foreground/80 hover:text-cyber-cyan transition-colors">Home</Link></li>
              <li><Link to="/timeline" className="text-foreground/80 hover:text-cyber-cyan transition-colors">Timeline</Link></li>
              <li><Link to="/blog" className="text-foreground/80 hover:text-cyber-cyan transition-colors">Writing</Link></li>
              <li><Link to="/about" className="text-foreground/80 hover:text-cyber-cyan transition-colors">About</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
              Connect
            </h3>
            <div className="flex gap-2">
              <a href="https://github.com/chuayupeng" target="_blank" rel="noreferrer"
                 className="w-10 h-10 rounded-lg border border-white/[0.06] bg-secondary flex items-center justify-center text-muted-foreground hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-colors" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com/in/chuayupeng" target="_blank" rel="noreferrer"
                 className="w-10 h-10 rounded-lg border border-white/[0.06] bg-secondary flex items-center justify-center text-muted-foreground hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="mailto:yupeng@u.nus.edu"
                 className="w-10 h-10 rounded-lg border border-white/[0.06] bg-secondary flex items-center justify-center text-muted-foreground hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-colors" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-mono">
            © {currentYear} yup.eng — some rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/70 font-mono">
            Built with React, Tailwind &amp; ☕
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
