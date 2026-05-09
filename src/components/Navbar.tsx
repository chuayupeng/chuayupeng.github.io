import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const close = () => setIsOpen(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/timeline', label: 'Timeline' },
    { path: '/blog', label: 'Writing' },
    { path: '/about', label: 'About' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/70 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" onClick={close}>
          <div className="w-8 h-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center group-hover:bg-cyber-cyan/20 transition-colors">
            <Terminal className="h-4 w-4 text-cyber-cyan" />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">
            <span className="text-foreground">yup</span>
            <span className="text-cyber-cyan">.eng</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? 'text-cyber-cyan'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent" />
                )}
              </Link>
            );
          })}
          <Button
            asChild
            size="sm"
            className="ml-2 bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/90 font-medium"
          >
            <Link to="/about#contact">Contact</Link>
          </Button>
        </nav>

        <button
          className="md:hidden text-foreground/80 hover:text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={`md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-xl transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col p-6 gap-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={close}
                className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  active
                    ? 'bg-cyber-cyan/10 text-cyber-cyan'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Button
            asChild
            size="lg"
            className="mt-4 bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/90 font-medium"
            onClick={close}
          >
            <Link to="/about#contact">Contact</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
