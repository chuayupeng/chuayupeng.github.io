import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Shield, Wine, Rocket, Code2,
  Mail, Linkedin, Github, MapPin
} from 'lucide-react';

const pillars = [
  { icon: Shield, label: 'Security',         blurb: 'Offensive security, red teaming, and incident response.' },
  { icon: Rocket, label: 'Entrepreneurship', blurb: 'Founding ventures and turning ideas into shipped products.' },
  { icon: Code2,  label: 'Building',         blurb: 'Side projects in security tooling, automation, and the web.' },
  { icon: Wine,   label: 'F&B',              blurb: 'Mixology and small-batch experiments, data-driven.' },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Intro */}
        <section className="relative pt-36 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 grid-bg pointer-events-none" />
          <div className="container mx-auto max-w-5xl relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-7">
                <div className="section-eyebrow">About</div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                  Engineer, founder,<br />perpetual <span className="gradient-text">tinkerer</span>.
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl flex items-center gap-2">
                  <MapPin size={16} className="text-cyber-cyan" />
                  Based in Singapore — working globally.
                </p>
              </div>
              <div className="md:col-span-5 flex justify-center md:justify-end">
                <img
                  src="/hero.png"
                  alt="yup.eng — pixel-art portrait"
                  className="w-full max-w-xs rounded-full border border-cyber-cyan/20 shadow-[0_0_60px_-10px_rgba(139,92,246,0.28)]"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bio */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-5 text-foreground/85 leading-relaxed">
                <p>
                  I'm a cybersecurity specialist with hands-on experience across offensive
                  security, red teaming, and incident response. I've tested and hardened
                  defenses for organizations of every size — from scrappy startups to a
                  sovereign defense agency.
                </p>
                <p>
                  I've also co-founded a couple of F&amp;B ventures — a cocktail label and
                  a hawker stall. Neither changed the world, but each was an honest
                  education in the half of building nobody
                  warns you about: ops, hiring, distribution, the long tail between
                  &ldquo;this works&rdquo; and &ldquo;people will pay for it.&rdquo;
                </p>
                <p>
                  What I'm actually drawn to lives at the seam. Security people tend to think
                  too cautiously about shipping; founders tend to think too late about
                  security. The interesting bit sits in the middle — where the discipline of
                  one tempers the impatience of the other.
                </p>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-3 self-start">
                {pillars.map(({ icon: Icon, label, blurb }) => (
                  <div key={label} className="card-surface p-5">
                    <Icon className="w-5 h-5 text-cyber-cyan mb-3" />
                    <div className="font-semibold text-sm mb-1">{label}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{blurb}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="px-4 pb-24 pt-4 scroll-mt-24">
          <div className="container mx-auto max-w-3xl">
            <div className="card-surface p-8 md:p-10">
              <div className="section-eyebrow">Contact</div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Get in touch
              </h2>
              <p className="text-muted-foreground mb-8">
                Email is the surest way to reach me. I read everything.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a href="mailto:yupeng@u.nus.edu"
                   className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-secondary/50 hover:border-cyber-cyan/30 hover:bg-cyber-cyan/[0.04] transition-colors group">
                  <div className="shrink-0 w-10 h-10 rounded-md bg-cyber-cyan/10 text-cyber-cyan flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground font-mono">email</div>
                    <div className="text-sm font-medium truncate">yupeng@u.nus.edu</div>
                  </div>
                </a>
                <a href="https://linkedin.com/in/chuayupeng" target="_blank" rel="noreferrer"
                   className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-secondary/50 hover:border-cyber-cyan/30 hover:bg-cyber-cyan/[0.04] transition-colors group">
                  <div className="shrink-0 w-10 h-10 rounded-md bg-cyber-cyan/10 text-cyber-cyan flex items-center justify-center">
                    <Linkedin size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground font-mono">linkedin</div>
                    <div className="text-sm font-medium truncate">@chuayupeng</div>
                  </div>
                </a>
                <a href="https://github.com/chuayupeng" target="_blank" rel="noreferrer"
                   className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-secondary/50 hover:border-cyber-cyan/30 hover:bg-cyber-cyan/[0.04] transition-colors group">
                  <div className="shrink-0 w-10 h-10 rounded-md bg-cyber-cyan/10 text-cyber-cyan flex items-center justify-center">
                    <Github size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground font-mono">github</div>
                    <div className="text-sm font-medium truncate">@chuayupeng</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
