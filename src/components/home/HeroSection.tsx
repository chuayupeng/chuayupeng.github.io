
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, VenetianMask, Shield, GraduationCap, Wine, Flame, Trophy, Star } from 'lucide-react';
import { TimelineItemType } from '@/data/timelineData';

interface HeroSectionProps {
  level: number;
  currentLevelXP: number;
  xpToNextLevel: number;
  skills: Record<string, number>;
}

const HeroSection = ({ level, currentLevelXP, xpToNextLevel, skills }: HeroSectionProps) => {
  return (
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
              Leveling Up: From <span className="gradient-text">Elixirs</span> To <span className="gradient-text">Exploits</span>
            </h1>
            <p className="text-lg text-white/80 max-w-lg">
              Versatile cybersecurity professional with a wide range of passion projects.
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
              <Button asChild variant="outline" size="lg" className="border-cyber-cyan text-cyber-navy hover:bg-gray-100/70">
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
                  <div className="absolute w-full h-full top-4 flex items-center justify-center">
                    <VenetianMask className="w-16 h-16 rounded-lg" />
                  </div>

                  {/* Cybersecurity Armor (Shield) */}
                  <div className="absolute bottom-16 left-2 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-blue-400 rounded-full animate-pulse-glow" style={{animationDelay: "2s"}}/>
                  </div>
                  
                  {/* Teaching Armor (Cap) */}
                  <div className="absolute bottom-32 left-20 flex items-center justify-center">
                    <GraduationCap className="w-16 h-16 text-green-400 rounded-full animate-pulse-glow" style={{animationDelay: "0.5s"}} />
                  </div>
                  
                  {/* F&B Armor (Wine) */}
                  <div className="absolute bottom-16 right-2 flex items-center justify-center">
                    <Wine className="w-16 h-16 text-amber-400 rounded-full animate-pulse-glow" style={{animationDelay: "1s"}} />
                  </div>
                  
                  {/* Entrepreneurship Armor (Flame) */}
                  <div className="absolute bottom-0 left-20 flex items-center justify-center">
                    <Flame className="w-16 h-16 text-purple-400 rounded-full animate-pulse-glow" style={{animationDelay: "1.5s"}} />
                  </div>
                </div>
              </div>
              
              {/* Stats Display */}
              <div className="absolute top-4 left-4 bg-cyber-navy/80 backdrop-blur-sm p-3 rounded border border-cyber-cyan/30">
                <h3 className="text-xs font-bold text-white mb-2">Character Stats</h3>
                <div className="space-y-2">
                  {Object.entries(skills).map(([skill, value]) => (
                    <div key={skill} className="flex justify-between items-center gap-2">
                      <span className="text-xs capitalize text-white/80">
                        {skill === 'f&b' ? 'F&B' : skill.charAt(0).toUpperCase() + skill.slice(1)}
                      </span>
                      <div className="w-16 bg-muted/30 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${
                            skill === 'cybersecurity' ? 'bg-blue-500' :
                            skill === 'teaching' ? 'bg-green-500' :
                            skill === 'f&b' ? 'bg-amber-500' :
                            'bg-purple-500'
                          }`}
                          style={{ width: `${Math.min(100, value / 2)}%` }}
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
  );
};

export default HeroSection;
