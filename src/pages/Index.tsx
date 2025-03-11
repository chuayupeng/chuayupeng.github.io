
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Terminal, ChefHat, BookOpen, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogData } from '@/data/blogData';

const Index = () => {
  // Get the 3 most recent blog posts
  const recentPosts = [...blogData].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 3);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-cyber-blue to-cyber-dark-navy text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Where <span className="gradient-text">Security</span> Meets <span className="gradient-text">Innovation</span>
              </h1>
              <p className="text-lg text-cyber-slate max-w-lg">
                Cybersecurity professional with a passion for teaching, F&B innovation, and entrepreneurship.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild size="lg" className="bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/80">
                  <Link to="/timeline">View My Journey</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-cyber-cyan text-cyber-cyan hover:bg-cyber-navy">
                  <Link to="/about">About Me</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <div className="w-full h-96 bg-cyber-navy rounded-lg border border-cyber-cyan/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-cyber-cyan/10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Shield className="w-24 h-24 text-cyber-cyan animate-pulse-light" />
                </div>
                <div className="absolute top-6 left-6">
                  <Terminal className="w-10 h-10 text-cyber-cyan/60" />
                </div>
                <div className="absolute bottom-6 right-6">
                  <ChefHat className="w-10 h-10 text-cyber-cyan/60" />
                </div>
                <div className="absolute top-6 right-6">
                  <BookOpen className="w-10 h-10 text-cyber-cyan/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Areas of Expertise */}
      <section className="py-20 px-4 bg-white dark:bg-cyber-blue">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Areas of Expertise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bringing together diverse skills and experiences to create unique solutions and perspectives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Cybersecurity Card */}
            <div className="bg-white dark:bg-cyber-navy rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cybersecurity</h3>
              <p className="text-muted-foreground text-sm">
                Expertise in threat analysis, security architecture, and penetration testing.
              </p>
            </div>
            
            {/* Teaching Card */}
            <div className="bg-white dark:bg-cyber-navy rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Teaching</h3>
              <p className="text-muted-foreground text-sm">
                Passionate about education and making complex topics accessible to all learners.
              </p>
            </div>
            
            {/* F&B Card */}
            <div className="bg-white dark:bg-cyber-navy rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Food & Beverage</h3>
              <p className="text-muted-foreground text-sm">
                Creating culinary experiences that blend innovation with tradition.
              </p>
            </div>
            
            {/* Entrepreneurship Card */}
            <div className="bg-white dark:bg-cyber-navy rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <Terminal className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Entrepreneurship</h3>
              <p className="text-muted-foreground text-sm">
                Building and scaling businesses that solve real-world problems.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Blog Posts */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-cyber-navy">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recent Insights</h2>
              <p className="text-muted-foreground">
                Thoughts and perspectives on security, education, and business.
              </p>
            </div>
            <Button asChild variant="ghost" className="text-cyber-cyan">
              <Link to="/blog" className="flex items-center">
                View all posts <ArrowRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map(post => (
              <div key={post.id} className="bg-white dark:bg-cyber-blue rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <Link to={`/blog/${post.slug}`}>
                  <div 
                    className="h-48 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${post.image})` }}
                  ></div>
                </Link>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-opacity-10 text-cyber-cyan bg-cyber-cyan">
                      {post.category}
                    </span>
                  </div>
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="font-bold text-xl mb-2 hover:text-cyber-cyan transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className="text-cyber-cyan hover:text-cyber-cyan/80 font-medium text-sm inline-flex items-center"
                    >
                      Read more <ArrowRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-4 bg-cyber-blue text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
          <p className="text-cyber-slate max-w-2xl mx-auto mb-8">
            Whether you're interested in cybersecurity consulting, educational opportunities, or discussing innovative ideas, I'd love to hear from you.
          </p>
          <Button asChild size="lg" className="bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/80">
            <Link to="/about">Get in Touch</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
