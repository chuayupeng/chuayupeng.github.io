
import { Link } from 'react-router-dom';
import { Shield, Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-cyber-blue text-cyber-light-slate py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-cyber-cyan" />
              <span className="font-bold text-lg text-white">CyberPortfolio</span>
            </Link>
            <p className="text-cyber-slate max-w-md">
              Cybersecurity professional with expertise in teaching, F&B, and entrepreneurship.
              Dedicated to sharing knowledge and building secure digital experiences.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-cyber-slate hover:text-cyber-cyan transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="text-cyber-slate hover:text-cyber-cyan transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-cyber-slate hover:text-cyber-cyan transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-cyber-slate hover:text-cyber-cyan transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-cyber-slate hover:text-cyber-cyan transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/timeline" className="text-cyber-slate hover:text-cyber-cyan transition-colors">Timeline</Link>
              </li>
              <li>
                <Link to="/blog" className="text-cyber-slate hover:text-cyber-cyan transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/about" className="text-cyber-slate hover:text-cyber-cyan transition-colors">About</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Areas of Expertise</h3>
            <ul className="space-y-2">
              <li className="text-cyber-slate">Cybersecurity</li>
              <li className="text-cyber-slate">Teaching & Education</li>
              <li className="text-cyber-slate">Food & Beverage</li>
              <li className="text-cyber-slate">Entrepreneurship</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cyber-navy mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cyber-slate text-sm">
            © {currentYear} CyberPortfolio. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-cyber-slate hover:text-cyber-cyan text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-cyber-slate hover:text-cyber-cyan text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
