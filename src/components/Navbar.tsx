import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
      className={`fixed top-0 inset-x-0 z-50 h-20 transition-colors duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_2px_20px_-8px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" onClick={close}>
          <div className="h-16 flex items-center transition-transform group-hover:scale-110">
            <img
              src="/usb.png"
              alt=""
              aria-hidden
              className="h-full w-auto object-contain drop-shadow-[0_0_10px_rgba(139,92,246,0.45)]"
              style={{ imageRendering: 'pixelated' }}
            />
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
        className={`md:hidden fixed inset-0 top-20 bg-background/95 backdrop-blur-xl transition-all duration-300 ${
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
