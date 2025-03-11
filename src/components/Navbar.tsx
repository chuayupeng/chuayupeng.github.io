
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/timeline', label: 'Timeline' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'About' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-cyber-blue/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <Shield className="h-8 w-8 text-cyber-cyan" />
          <span className="font-bold text-xl text-white">CyberPortfolio</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative py-2 text-sm font-medium transition-colors text-white/90
                ${location.pathname === item.path 
                  ? 'text-cyber-cyan' 
                  : 'hover:text-cyber-cyan'
                }
                after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyber-cyan 
                after:transition-all after:duration-300 hover:after:w-full
              `}
            >
              {item.label}
            </Link>
          ))}
          <Button size="sm" variant="default" className="bg-cyber-cyan hover:bg-cyber-cyan/80 text-cyber-blue font-medium">
            Contact
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden fixed inset-0 bg-background/95 backdrop-blur-sm z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-center items-center space-y-8 p-8">
          <div className="flex items-center space-x-2 mb-8">
            <Cpu className="h-10 w-10 text-cyber-cyan animate-pulse-light" />
          </div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-2xl font-medium ${
                location.pathname === item.path ? 'text-cyber-cyan' : ''
              }`}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <Button size="lg" className="mt-8 bg-cyber-cyan hover:bg-cyber-cyan/80 text-cyber-blue font-medium w-full">
            Contact
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
