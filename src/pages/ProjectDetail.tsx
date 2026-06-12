import { Suspense, lazy, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MousePointerClick } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProjectBySlug, statusStyles, type ProjectDemo } from '@/data/projectsData';

// Lazy so the calculator (and its fonts/CSS) only load on a project page that uses it.
const demoComponents: Record<ProjectDemo, React.LazyExoticComponent<React.ComponentType>> = {
  affluent: lazy(() => import('@/components/affluent/AffluentApp')),
};

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
          <section className="px-4 pb-24">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <MousePointerClick size={16} className="text-cyber-cyan" />
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Live demo · public-education mode · fully interactive
                  </span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground/70">
                  Nothing you type is stored.
                </span>
              </div>

              {/* Outer frame rounds + clips; inner scrolls horizontally so the
                  demo is never clipped on narrow screens (it has its own min
                  content width below ~400px). */}
              <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#EEEFE8]">
                <div className="overflow-x-auto">
                  <Suspense
                    fallback={
                      <div className="py-32 text-center text-[#5A6B6D] font-mono text-sm">
                        Loading the calculator…
                      </div>
                    }
                  >
                    <Demo />
                  </Suspense>
                </div>
              </div>

              <p className="text-xs text-muted-foreground/70 mt-4 text-center max-w-2xl mx-auto leading-relaxed">
                Figures are illustrative estimates computed from your inputs against published 2026
                Singapore methodology. af.fluent computes and compares; it never tells you what to buy.
              </p>
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
