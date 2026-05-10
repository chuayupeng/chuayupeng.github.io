import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const close = () => setIsOpen(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/timeline', label: 'Timeline' },
    { path: '/blog', label: 'Writing' },
    { path: '/about', label: 'About' },
  ];

  return (
    <>
    <header
      className="fixed top-0 inset-x-0 z-50 h-20 bg-cyber-blue/85 backdrop-blur-xl border-b border-cyber-cyan/25 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.6)]"
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

    </header>

    {isOpen && (
      <div className="md:hidden fixed left-0 right-0 top-20 bottom-0 z-[60] bg-cyber-blue overflow-y-auto">
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
    )}
    </>
  );
};

export default Navbar;
