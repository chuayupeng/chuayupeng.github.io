import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowRight, Compass, Home, ScrollText, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const waypoints = [
  { to: '/',         label: 'Tavern',          dest: 'Home',     icon: Home },
  { to: '/timeline', label: 'Quest Log',       dest: 'Timeline', icon: ScrollText },
  { to: '/blog',     label: 'Spell Scrolls',   dest: 'Writing',  icon: Compass },
  { to: '/about',    label: 'Character Sheet', dest: 'About',    icon: User },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404:', location.pathname);
  }, [location.pathname]);

  // Trim absurdly long paths so the terminal stays readable.
  const path = location.pathname.length > 80
    ? location.pathname.slice(0, 80) + '…'
    : location.pathname;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-16">
        <div className="container mx-auto max-w-3xl">
          <div className="card-surface overflow-hidden animate-fade-in">
            {/* Terminal chrome — matches the ~/character.json card on the home page */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-black/20">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                ~/quests/lost-scroll
              </span>
            </div>

            <div className="p-8 md:p-12 space-y-8">
              <div>
                <div className="section-eyebrow">404 · Uncharted Territory</div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
                  You wandered<br />
                  <span className="gradient-text">off the map</span>.
                </h1>
                <p className="text-muted-foreground mt-4 max-w-lg">
                  This corner of the realm hasn&rsquo;t been charted — or perhaps
                  mischievous goblins moved the signpost.
                </p>
              </div>

              {/* Terminal log */}
              <div className="font-mono text-sm space-y-3 rounded-lg border border-white/[0.06] bg-black/30 p-4 md:p-5">
                <div>
                  <div>
                    <span className="text-cyber-cyan">$</span>{' '}
                    <span className="text-foreground">cd {path}</span>
                  </div>
                  <div className="text-muted-foreground pl-4 mt-1">
                    bash: cd:{' '}
                    <span className="text-foreground/80 break-all">{path}</span>: no
                    such region in this realm
                  </div>
                </div>

                <div>
                  <div>
                    <span className="text-cyber-cyan">$</span>{' '}
                    <span className="text-foreground">cast detect_path</span>
                  </div>
                  <div className="text-muted-foreground pl-4 mt-1">
                    <span className="text-amber-300">⚠</span> the spell fizzles —
                    the scroll you seek does not exist
                  </div>
                </div>

                <div>
                  <div>
                    <span className="text-cyber-cyan">$</span>{' '}
                    <span className="text-foreground">fast_travel --list</span>
                  </div>
                </div>
              </div>

              {/* Waypoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {waypoints.map(({ to, label, dest, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex items-center gap-3 p-4 rounded-lg border border-white/[0.06] bg-secondary/40 hover:border-cyber-cyan/30 hover:bg-cyber-cyan/[0.04] transition-colors"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-md bg-cyber-cyan/10 text-cyber-cyan flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        → {dest}
                      </div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-cyber-cyan transition-colors">
                        {label}
                      </div>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground group-hover:text-cyber-cyan group-hover:translate-x-0.5 transition-all"
                    />
                  </Link>
                ))}
              </div>

              <div className="font-mono text-[11px] text-muted-foreground/70 pt-2 border-t border-white/[0.06]">
                # tip: check the spelling, or fast-travel home and start fresh.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
