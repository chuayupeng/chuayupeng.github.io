import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';

const CallToActionSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-cyber-cyan/[0.08] via-card to-card p-10 md:p-16">
          <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
          <div className="relative max-w-2xl">
            <div className="section-eyebrow">Let's talk</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Have a problem worth <span className="gradient-text">solving</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Whether it's a security review, a teaching gig, or just a good idea to bounce around —
              I'm always up for an interesting conversation.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/90 group">
                <Link to="/about#contact" className="inline-flex items-center">
                  Get in touch
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/10 hover:bg-secondary">
                <a href="mailto:yupeng@u.nus.edu" className="inline-flex items-center">
                  <Mail size={16} className="mr-2" />
                  yupeng@u.nus.edu
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
