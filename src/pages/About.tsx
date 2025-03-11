
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
                  I'm a cybersecurity professional with a passion for teaching, food & beverage, and entrepreneurship.
                  With over a decade of experience across these diverse fields, I bring a unique perspective
                  to solving complex problems and creating innovative solutions.
                </p>
                <p className="text-cyber-slate mb-6">
                  My journey began in cybersecurity, where I've worked with organizations ranging from startups
                  to Fortune 500 companies to protect their digital assets and infrastructure. This foundation
                  in security thinking has informed my approach to every venture since.
                </p>
                <p className="text-cyber-slate">
                  Today, I continue to explore the intersections of these fields, finding connections and
                  opportunities that others might miss. Whether I'm securing a network, teaching a workshop,
                  developing a new culinary concept, or building a business, I bring the same dedication to
                  excellence and innovation.
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
        
        {/* Skills Section */}
        <section className="py-16 bg-white dark:bg-cyber-blue">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Skills & Expertise</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                My diverse background has allowed me to develop a unique skill set spanning multiple disciplines.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Cybersecurity Skills */}
              <div className="bg-gray-50 dark:bg-cyber-navy rounded-lg p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Cybersecurity</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Network Security</li>
                  <li>Penetration Testing</li>
                  <li>Security Architecture</li>
                  <li>Risk Assessment</li>
                  <li>Incident Response</li>
                  <li>Compliance & Governance</li>
                </ul>
              </div>
              
              {/* Teaching Skills */}
              <div className="bg-gray-50 dark:bg-cyber-navy rounded-lg p-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Teaching</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Curriculum Development</li>
                  <li>Workshop Facilitation</li>
                  <li>Technical Instruction</li>
                  <li>Educational Technology</li>
                  <li>Student Mentorship</li>
                  <li>Instructional Design</li>
                </ul>
              </div>
              
              {/* F&B Skills */}
              <div className="bg-gray-50 dark:bg-cyber-navy rounded-lg p-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                  <Coffee className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Food & Beverage</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Culinary Innovation</li>
                  <li>Menu Development</li>
                  <li>Restaurant Operations</li>
                  <li>Food Safety</li>
                  <li>Sustainable Practices</li>
                  <li>Flavor Profiling</li>
                </ul>
              </div>
              
              {/* Entrepreneurship Skills */}
              <div className="bg-gray-50 dark:bg-cyber-navy rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Entrepreneurship</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Business Strategy</li>
                  <li>Product Development</li>
                  <li>Startup Growth</li>
                  <li>Funding & Investment</li>
                  <li>Team Leadership</li>
                  <li>Market Analysis</li>
                </ul>
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
                    href="mailto:contact@example.com" 
                    className="flex items-center text-foreground hover:text-cyber-cyan transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-3" />
                    <span>contact@example.com</span>
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-foreground hover:text-cyber-cyan transition-colors"
                  >
                    <Linkedin className="w-5 h-5 mr-3" />
                    <span>linkedin.com/in/cyberprofessional</span>
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-foreground hover:text-cyber-cyan transition-colors"
                  >
                    <Github className="w-5 h-5 mr-3" />
                    <span>github.com/cyberprofessional</span>
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-foreground hover:text-cyber-cyan transition-colors"
                  >
                    <Twitter className="w-5 h-5 mr-3" />
                    <span>@cyberprofessional</span>
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
