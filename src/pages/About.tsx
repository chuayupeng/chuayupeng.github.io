
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, GraduationCap, Coffee, Rocket,
  Mail, Linkedin, Github, Twitter, Send
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        {/* About Section */}
        <section className="py-16 bg-cyber-blue text-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl font-bold mb-6">About Me</h1>
                <p className="text-cyber-slate mb-6">
                  I’m a cybersecurity specialist with half a decade of hands-on experience in offensive security, red teaming,
                   and incident response. I’ve tested and hardened defenses for organizations of all sizes, and I continually explore 
                   emerging vulnerabilities through independent research and practical write-ups.
                </p>
                <p className="text-cyber-slate mb-6">
                  Alongside my technical work, I’ve devoted years to teaching and mentoring the next generation of computing
                   talent. From early classroom settings to competitive capture-the-flag teams and advanced exam preparation,
                    I translate complex security and programming concepts into engaging, real-world lessons that empower 
                    learners at every level.
                </p>
                <p className="text-cyber-slate mb-6">
                  As an entrepreneur, I merge analytical rigor with creative experimentation. I’ve launched side projects 
                  in security tooling and dabbled in small-batch mixology, applying a data-driven approach to everything I 
                  build. This unique blend of research, education, and hands-on innovation fuels my passion for solving 
                  tough challenges and uncovering new opportunities where security and entrepreneurship intersect.
                </p>
              </div>
              
              <div className="relative">
                <div className="w-full h-96 bg-cyber-navy rounded-lg border border-cyber-cyan/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-cyber-cyan/10"></div>
                  <div className="grid grid-cols-2 grid-rows-2 h-full w-full p-6 gap-6">
                    <div className="bg-cyber-dark-navy rounded-lg flex items-center justify-center p-6">
                      <Shield className="w-16 h-16 text-cyber-cyan" />
                    </div>
                    <div className="bg-cyber-dark-navy rounded-lg flex items-center justify-center p-6">
                      <GraduationCap className="w-16 h-16 text-cyber-cyan" />
                    </div>
                    <div className="bg-cyber-dark-navy rounded-lg flex items-center justify-center p-6">
                      <Coffee className="w-16 h-16 text-cyber-cyan" />
                    </div>
                    <div className="bg-cyber-dark-navy rounded-lg flex items-center justify-center p-6">
                      <Rocket className="w-16 h-16 text-cyber-cyan" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 bg-gray-50 dark:bg-cyber-navy">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Have a question or looking to collaborate? Feel free to reach out using the form
                  or connect with me directly through any of the channels below.
                </p>
                
                <div className="space-y-4">
                  <a 
                    href="mailto:yupeng@u.nus.edu" 
                    className="flex items-center text-foreground hover:text-cyber-cyan transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-3" />
                    <span>yupeng@u.nus.edu</span>
                  </a>
                  <a 
                    href="https://linkedin.com/in/chuayupeng" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-foreground hover:text-cyber-cyan transition-colors"
                  >
                    <Linkedin className="w-5 h-5 mr-3" />
                    <span>linkedin.com/in/chuayupeng</span>
                  </a>
                  <a 
                    href="https://github.com/chuayupeng" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-foreground hover:text-cyber-cyan transition-colors"
                  >
                    <Github className="w-5 h-5 mr-3" />
                    <span>github.com/chuayupeng</span>
                  </a>
                </div>
              </div>
              
              <div>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="Your email" required />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <Input id="subject" placeholder="What's this about?" required />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      placeholder="Your message" 
                      rows={6} 
                      required 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/80">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
