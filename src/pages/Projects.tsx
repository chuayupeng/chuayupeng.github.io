import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { projectsData, statusStyles } from '@/data/projectsData';

const Projects = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <section className="relative pt-36 pb-12 px-4 overflow-hidden">
          <div className="absolute inset-0 grid-bg pointer-events-none" />
          <div className="container mx-auto max-w-6xl relative">
            <div className="section-eyebrow">Projects</div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              Things I'm <span className="gradient-text">building</span>.
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Side projects and experiments — some are toys, some want to be products.
              A few ship with a live, interactive demo you can poke at right here.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="px-4 pb-24">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projectsData.map((project) => {
                const Icon = project.icon;
                return (
                  <Link
                    key={project.slug}
                    to={`/projects/${project.slug}`}
                    className="card-surface group p-6 md:p-7 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center border"
                        style={{
                          background: `${project.accent}1A`,
                          borderColor: `${project.accent}40`,
                          color: project.accent,
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border ${statusStyles[project.status]}`}
                      >
                        {project.status === 'In development' && (
                          <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse motion-reduce:animate-none" />
                        )}
                        {project.status}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-1.5">
                      <h2 className="text-xl font-semibold tracking-tight group-hover:text-cyber-cyan transition-colors">
                        {project.title}
                      </h2>
                      <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
                    </div>
                    <p className="text-sm text-cyber-cyan/80 font-mono mb-3">{project.tagline}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                      {project.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mb-5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/[0.08] bg-secondary/60 text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <span className="inline-flex items-center text-sm font-medium text-cyber-cyan mt-auto">
                      {project.demo ? 'Explore the live demo' : 'View project'}
                      <ArrowRight
                        size={14}
                        className="ml-1.5 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
