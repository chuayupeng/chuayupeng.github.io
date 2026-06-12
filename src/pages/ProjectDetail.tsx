import { Suspense, lazy, useEffect, useRef, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MousePointerClick, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProjectBySlug, statusStyles, type ProjectDemo } from '@/data/projectsData';

// Lazy so each demo (and its fonts/CSS) only loads on the project page that uses it.
const demoComponents: Record<ProjectDemo, React.LazyExoticComponent<React.ComponentType>> = {
  affluent: lazy(() => import('@/components/affluent/AffluentApp')),
  suzaku: lazy(() => import('@/components/suzaku/SuzakuApp')),
  finrpg: lazy(() => import('@/components/finrpg/FinrpgApp')),
};

const CARD_MAX = 1152; // px — matches max-w-6xl
const CARD_RADIUS = 16; // px — matches rounded-2xl

/**
 * Frames the embedded demo as a contained card that smoothly expands to a
 * full-bleed, edge-to-edge panel as it scrolls up through the viewport, and
 * contracts back into a card on scroll up. Scroll-linked (not autoplay), so a
 * hard card→full-width breakpoint switch never jars. Honors reduced-motion by
 * staying a static card. The demo's own CSS is untouched.
 */
function ExpandingDemoFrame({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;

    // p: 0 = card, 1 = full-bleed.
    const apply = (p: number) => {
      const stageW = stage.clientWidth;
      const cardW = Math.min(CARD_MAX, stageW - 32); // 16px resting gutter each side
      const w = cardW + (stageW - cardW) * p;
      frame.style.width = `${w}px`;
      frame.style.maxWidth = 'none';
      frame.style.borderRadius = `${CARD_RADIUS * (1 - p)}px`;
      frame.style.borderColor = `rgba(255,255,255,${0.1 * (1 - p)})`;
    };

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      apply(0);
      const onResize = () => apply(0);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Card while the panel sits low in the viewport; fully expanded once its
      // top rises into the upper portion of the screen.
      const start = vh * 0.85;
      const end = vh * 0.4;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      apply(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={stageRef} className="w-full">
      <div
        ref={frameRef}
        className="mx-auto w-full max-w-[72rem] overflow-hidden bg-[#EEEFE8] shadow-2xl border border-white/10"
        style={{ borderRadius: `${CARD_RADIUS}px`, willChange: 'width' }}
      >
        <div className="overflow-x-auto">{children}</div>
      </div>
    </div>
  );
}

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-16">
          <div className="text-center">
            <div className="section-eyebrow justify-center">404 · No such project</div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              That project isn't on the shelf.
            </h1>
            <Link
              to="/projects"
              className="inline-flex items-center text-sm font-medium text-cyber-cyan hover:text-cyber-cyan/80"
            >
              <ArrowLeft size={14} className="mr-1.5" />
              Back to all projects
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Demo = project.demo ? demoComponents[project.demo] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <section className="relative pt-32 pb-12 px-4 overflow-hidden">
          <div className="absolute inset-0 grid-bg pointer-events-none" />
          <div className="container mx-auto max-w-5xl relative">
            <Link
              to="/projects"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-cyber-cyan transition-colors mb-8"
            >
              <ArrowLeft size={14} className="mr-1.5" />
              All projects
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="section-eyebrow !mb-0">Project</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
              <span className="text-muted-foreground/40">·</span>
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border ${statusStyles[project.status]}`}
              >
                {project.status === 'In development' && (
                  <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse motion-reduce:animate-none" />
                )}
                {project.status}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">{project.title}</h1>
            <p className="text-lg md:text-xl text-cyber-cyan/90 font-mono mb-8">{project.tagline}</p>

            {project.highlights && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-3xl">
                {project.highlights.map((h) => (
                  <div key={h.label} className="card-surface p-4">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                      {h.label}
                    </div>
                    <div className="text-sm font-semibold">{h.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/[0.08] bg-secondary/60 text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>

            {project.links && project.links.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mt-7">
                {project.links.map((l) => {
                  const external = /^https?:/.test(l.href);
                  return external ? (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-cyan text-cyber-blue font-medium text-sm hover:bg-cyber-cyan/90 transition-colors"
                    >
                      {l.label}
                      <ExternalLink size={15} />
                    </a>
                  ) : (
                    <Link
                      key={l.href}
                      to={l.href}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-secondary/60 text-foreground font-medium text-sm hover:border-cyber-cyan/30 hover:bg-secondary transition-colors"
                    >
                      {l.label}
                      <ArrowRight size={15} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Description */}
        <section className="px-4 pb-12">
          <div className="container mx-auto max-w-3xl space-y-5 text-foreground/85 leading-relaxed">
            {project.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* Live demo */}
        {Demo && (
          <section className="pb-24">
            {/* Label + note — kept inset/aligned with the page content. */}
            <div className="container mx-auto max-w-6xl px-4">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <MousePointerClick size={16} className="text-cyber-cyan" />
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {project.demoLabel ?? 'Live demo · interactive'}
                  </span>
                </div>
                {project.demoNote && (
                  <span className="font-mono text-[11px] text-muted-foreground/70">
                    {project.demoNote}
                  </span>
                )}
              </div>
            </div>

            {/* Starts contained as a card, smoothly expands to full-bleed as it
                scrolls up through the viewport, contracts back on scroll up. */}
            <ExpandingDemoFrame>
              <Suspense
                fallback={
                  <div className="py-32 text-center text-[#5A6B6D] font-mono text-sm">
                    Loading the demo…
                  </div>
                }
              >
                <Demo />
              </Suspense>
            </ExpandingDemoFrame>

            {/* Caption — inset/aligned with the page content. */}
            <div className="container mx-auto max-w-6xl px-4">
              {project.demoCaption && (
                <p className="text-xs text-muted-foreground/70 mt-4 text-center max-w-2xl mx-auto leading-relaxed">
                  {project.demoCaption}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Closing */}
        <section className="px-4 pb-24">
          <div className="container mx-auto max-w-3xl">
            <div className="card-surface p-8 md:p-10">
              <div className="section-eyebrow">Interested?</div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Want to talk about this one?
              </h2>
              <p className="text-muted-foreground mb-6">
                If {project.title} is the kind of thing you'd want to use, build on, or just argue
                with me about — I'd love to hear from you.
              </p>
              <Link
                to="/about#contact"
                className="inline-flex items-center text-sm font-medium text-cyber-cyan hover:text-cyber-cyan/80"
              >
                Get in touch
                <ArrowRight size={14} className="ml-1.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
