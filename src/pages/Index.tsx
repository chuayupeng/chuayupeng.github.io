
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Terminal, ChefHat, BookOpen, ArrowRight, Zap, Star, Trophy } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogData } from '@/data/blogData';
import { timelineData } from '@/data/timelineData';

const Index = () => {
  // Get the 3 most recent blog posts
  const recentPosts = [...blogData].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 3);
  
  // Calculate RPG stats based on timeline data
  const totalExperience = timelineData.length * 150;
  const level = Math.floor(totalExperience / 500) + 1;
  const currentLevelXP = totalExperience % 500;
  
  // Skill stats based on timeline categories
  const skills = {
    cybersecurity: timelineData.filter(item => item.category === 'cybersecurity').length * 15,
    teaching: timelineData.filter(item => item.category === 'teaching').length * 15,
    'f&b': timelineData.filter(item => item.category === 'f&b').length * 15,
    entrepreneurship: timelineData.filter(item => item.category === 'entrepreneurship').length * 15,
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-cyber-blue to-cyber-dark-navy text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-medium px-3 py-1 w-fit rounded-full bg-accent/20 text-accent-foreground mb-3">
                <Zap size={16} className="text-primary" />
                <span>Level {level} Security Expert</span>
                <Zap size={16} className="text-primary" />
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Where <span className="gradient-text">Security</span> Meets <span className="gradient-text">Innovation</span>
              </h1>
              <p className="text-lg text-white/80 max-w-lg">
                Cybersecurity professional with a passion for teaching, F&B innovation, and entrepreneurship.
              </p>
              
              {/* XP Progress Bar */}
              <div className="mt-4 mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Level {level}</span>
                  <span>{currentLevelXP}/500 XP to Level {level + 1}</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className="rpg-progress" 
                    style={{ width: `${(currentLevelXP / 500) * 100}%` }} 
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild size="lg" className="bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/80">
                  <Link to="/timeline">View My Quest Log</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-cyber-cyan text-cyber-cyan hover:bg-cyber-navy">
                  <Link to="/about">Character Profile</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <div className="w-full h-96 bg-cyber-navy rounded-lg border border-cyber-cyan/20 overflow-hidden relative rpg-card rpg-border">
                {/* Character Sprite Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Base Character */}
                  <div className="relative w-56 h-56 animate-float">
                    {/* Shared character base */}
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-white/10 rounded-full"></div>
                    </div>
                    
                    {/* Cybersecurity Armor (Shield) */}
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <Shield className="w-32 h-32 text-blue-400 animate-pulse-glow" />
                    </div>
                    
                    {/* Teaching Armor (Book) */}
                    <div className="absolute top-10 right-4 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-green-400 animate-pulse-glow" style={{animationDelay: "0.5s"}} />
                    </div>
                    
                    {/* F&B Armor (Chef Hat) */}
                    <div className="absolute bottom-10 left-4 flex items-center justify-center">
                      <ChefHat className="w-16 h-16 text-amber-400 animate-pulse-glow" style={{animationDelay: "1s"}} />
                    </div>
                    
                    {/* Entrepreneurship Armor (Terminal) */}
                    <div className="absolute bottom-10 right-4 flex items-center justify-center">
                      <Terminal className="w-16 h-16 text-purple-400 animate-pulse-glow" style={{animationDelay: "1.5s"}} />
                    </div>
                  </div>
                </div>
                
                {/* Stats Display */}
                <div className="absolute top-4 left-4 bg-cyber-navy/80 backdrop-blur-sm p-3 rounded border border-cyber-cyan/30">
                  <h3 className="text-xs font-bold text-white mb-2">Character Stats</h3>
                  <div className="space-y-2">
                    {Object.entries(skills).map(([skill, value]) => (
                      <div key={skill} className="flex justify-between items-center gap-2">
                        <span className="text-xs capitalize text-white/80">{skill}</span>
                        <div className="w-16 bg-muted/30 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${
                              skill === 'cybersecurity' ? 'bg-blue-500' :
                              skill === 'teaching' ? 'bg-green-500' :
                              skill === 'f&b' ? 'bg-amber-500' :
                              'bg-purple-500'
                            }`}
                            style={{ width: `${(value / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Equipment Rating */}
                <div className="absolute bottom-4 right-4 bg-cyber-navy/80 backdrop-blur-sm p-2 rounded border border-cyber-cyan/30 flex items-center">
                  <Trophy size={14} className="text-yellow-400 mr-1" />
                  <span className="text-xs text-white">Legendary Gear</span>
                  <div className="flex ml-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={10} 
                        className="text-yellow-400 fill-yellow-400" 
                      />
                    ))}
                  </div>
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
            <h2 className="text-3xl font-bold mb-4">Class Specializations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Multi-class character with unique abilities in diverse skill trees.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Cybersecurity Card */}
            <div className="rpg-card bg-white dark:bg-cyber-navy p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Security Mage</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Masters of defense magic, specialized in threat detection and magical barriers.
              </p>
              <div className="flex items-center gap-0.5 mb-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
              </div>
              <div className="text-xs text-muted-foreground">Legendary Class</div>
            </div>
            
            {/* Teaching Card */}
            <div className="rpg-card bg-white dark:bg-cyber-navy p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Knowledge Sage</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Wielders of ancient wisdom who can transfer knowledge and empower others.
              </p>
              <div className="flex items-center gap-0.5 mb-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-gray-300" />
              </div>
              <div className="text-xs text-muted-foreground">Epic Class</div>
            </div>
            
            {/* F&B Card */}
            <div className="rpg-card bg-white dark:bg-cyber-navy p-6">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
                <ChefHat className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Culinary Alchemist</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Combines rare ingredients to create powerful consumables with magical effects.
              </p>
              <div className="flex items-center gap-0.5 mb-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-gray-300" />
                <Star size={12} className="text-gray-300" />
              </div>
              <div className="text-xs text-muted-foreground">Rare Class</div>
            </div>
            
            {/* Entrepreneurship Card */}
            <div className="rpg-card bg-white dark:bg-cyber-navy p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
                <Terminal className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Guild Master</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Leaders who build and manage thriving guilds that solve world problems.
              </p>
              <div className="flex items-center gap-0.5 mb-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <Star size={12} className="text-gray-300" />
              </div>
              <div className="text-xs text-muted-foreground">Epic Class</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Blog Posts */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-cyber-navy">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Quest Scrolls</h2>
              <p className="text-muted-foreground">
                Wisdom and knowledge gathered during adventures.
              </p>
            </div>
            <Button asChild variant="ghost" className="text-cyber-cyan">
              <Link to="/blog" className="flex items-center">
                View all scrolls <ArrowRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map(post => (
              <div key={post.id} className="rpg-card bg-white dark:bg-cyber-blue rounded-lg overflow-hidden">
                <Link to={`/blog/${post.slug}`} className="block">
                  <div 
                    className="h-48 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${post.image})` }}
                  >
                    {/* Decorative frame corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>
                  </div>
                </Link>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-opacity-10 text-cyber-cyan bg-cyber-cyan">
                      {post.category}
                    </span>
                    
                    {/* Quest Rarity */}
                    <div className="float-right flex items-center">
                      {[...Array(post.id <= 2 ? 5 : post.id <= 4 ? 4 : post.id <= 6 ? 3 : 2)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className="text-yellow-400 fill-yellow-400" 
                        />
                      ))}
                    </div>
                  </div>
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="font-bold text-xl mb-2 hover:text-cyber-cyan transition-colors">{post.title}</h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className="text-cyber-cyan hover:text-cyber-cyan/80 font-medium text-sm inline-flex items-center"
                    >
                      Begin Quest <ArrowRight size={14} className="ml-1" />
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
          <h2 className="text-3xl font-bold mb-4">Join My Guild</h2>
          <p className="text-cyber-slate max-w-2xl mx-auto mb-8">
            Whether you seek cybersecurity consulting, knowledge sharing, or collaborative quests, I'm ready to adventure together.
          </p>
          <Button asChild size="lg" className="bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/80">
            <Link to="/about">Form Party</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
