
import { Link } from 'react-router-dom';
import { Shield, Github, Linkedin, Twitter, Mail, VenetianMask } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-cyber-blue text-cyber-light-slate py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-3">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <VenetianMask className="h-6 w-6 text-cyber-cyan" />
              <span className="font-bold text-lg text-white">yup.eng</span>
            </Link>
            <p className="text-cyber-slate max-w-md">
              Cybersecurity professional with side expertise in teaching, F&B, and entrepreneurship.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com/chuayupeng" className="text-cyber-slate hover:text-cyber-cyan transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com/in/chuayupeng" className="text-cyber-slate hover:text-cyber-cyan transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="mailto:yupeng@u.nus.edu" className="text-cyber-slate hover:text-cyber-cyan transition-colors" aria-label="Email">
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
          
        </div>
        
        <div className="border-t border-cyber-navy mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cyber-slate text-sm">
            © {currentYear} yup.eng - Some rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
