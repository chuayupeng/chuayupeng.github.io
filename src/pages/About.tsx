import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Shield, Wine, Rocket, Code2,
  Mail, Linkedin, Github, Send, MapPin
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
            <div className="section-eyebrow">About</div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Engineer, founder,<br />perpetual <span className="gradient-text">tinkerer</span>.
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl flex items-center gap-2">
              <MapPin size={16} className="text-cyber-cyan" />
              Based in Singapore — working globally.
            </p>
          </div>
        </section>

        {/* Bio */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-5 text-foreground/85 leading-relaxed">
                <p>
                  I'm a cybersecurity specialist with hands-on experience across offensive security,
                  red teaming, and incident response. I've tested and hardened defenses for
                  organizations of every size, and continually explore emerging vulnerabilities
                  through independent research and practical write-ups.
                </p>
                <p>
                  Outside of security, I'm a founder at heart. I've co-founded ventures in F&amp;B
                  and security tooling, turning rough ideas into shipped products and learning the
                  unglamorous parts — operations, hiring, and the slow grind of distribution — the
                  hard way.
                </p>
                <p>
                  I work best at the intersection of rigor and experimentation: data-driven, but
                  always shipping. The opportunities I find most interesting are the ones where
                  security thinking and entrepreneurial speed compound on each other.
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
          <div className="container mx-auto max-w-5xl">
            <div className="card-surface p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <div className="section-eyebrow">Contact</div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Get in touch
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Have a question or looking to collaborate? Drop a message — I read everything.
                  </p>

                  <div className="space-y-3">
                    <a href="mailto:yupeng@u.nus.edu"
                       className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-secondary/50 hover:border-cyber-cyan/30 hover:bg-cyber-cyan/[0.04] transition-colors group">
                      <div className="w-10 h-10 rounded-md bg-cyber-cyan/10 text-cyber-cyan flex items-center justify-center">
                        <Mail size={16} />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-mono">email</div>
                        <div className="text-sm font-medium">yupeng@u.nus.edu</div>
                      </div>
                    </a>
                    <a href="https://linkedin.com/in/chuayupeng" target="_blank" rel="noreferrer"
                       className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-secondary/50 hover:border-cyber-cyan/30 hover:bg-cyber-cyan/[0.04] transition-colors group">
                      <div className="w-10 h-10 rounded-md bg-cyber-cyan/10 text-cyber-cyan flex items-center justify-center">
                        <Linkedin size={16} />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-mono">linkedin</div>
                        <div className="text-sm font-medium">linkedin.com/in/chuayupeng</div>
                      </div>
                    </a>
                    <a href="https://github.com/chuayupeng" target="_blank" rel="noreferrer"
                       className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-secondary/50 hover:border-cyber-cyan/30 hover:bg-cyber-cyan/[0.04] transition-colors group">
                      <div className="w-10 h-10 rounded-md bg-cyber-cyan/10 text-cyber-cyan flex items-center justify-center">
                        <Github size={16} />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-mono">github</div>
                        <div className="text-sm font-medium">github.com/chuayupeng</div>
                      </div>
                    </a>
                  </div>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Name</label>
                      <Input id="name" placeholder="Your name" required className="bg-secondary border-white/[0.06]" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Email</label>
                      <Input id="email" type="email" placeholder="you@domain.com" required className="bg-secondary border-white/[0.06]" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Subject</label>
                    <Input id="subject" placeholder="What's this about?" required className="bg-secondary border-white/[0.06]" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Message</label>
                    <Textarea id="message" placeholder="Your message" rows={6} required className="bg-secondary border-white/[0.06]" />
                  </div>
                  <Button type="submit" className="w-full bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/90 font-medium">
                    <Send className="w-4 h-4 mr-2" />
                    Send message
                  </Button>
                </form>
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
