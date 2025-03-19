import { useState } from 'react';
import { timelineData, CategoryType } from '@/data/timelineData';
import TimelineItem from '@/components/TimelineItem';
import FilterButtons from '@/components/FilterButtons';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Trophy, Zap, X, ArrowLeft, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Timeline = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [statsVisible, setStatsVisible] = useState(false);
  const [statsPosition, setStatsPosition] = useState('right'); // 'right' or 'left'
  
  const filteredData = activeFilter === 'all' 
    ? timelineData 
    : timelineData.filter(item => {
        // Check if the category is an array and if it contains the active filter
        if (Array.isArray(item.category)) {
          return item.category.includes(activeFilter as CategoryType);
        }
        // Or if it's a single category matching the filter
        return item.category === activeFilter;
      });

  // Extract all unique categories
  const allCategories = timelineData.flatMap(item => 
    Array.isArray(item.category) ? item.category : [item.category]
  );
  const categories = Array.from(new Set(allCategories));
  
  // Calculate stats based on timeline entries
  const totalExperience = timelineData.length * 150;
  const level = Math.floor(totalExperience / 500) + 1;
  const currentLevelXP = totalExperience % 500;
  const xpToNextLevel = 500 - currentLevelXP;
  
  // RPG-style skill stats - count appearances in categories
  const skills = {
    cybersecurity: timelineData.filter(item => 
      Array.isArray(item.category) 
        ? item.category.includes('cybersecurity')
        : item.category === 'cybersecurity'
    ).length * 15,
    teaching: timelineData.filter(item => 
      Array.isArray(item.category) 
        ? item.category.includes('teaching')
        : item.category === 'teaching'
    ).length * 15,
    'f&b': timelineData.filter(item => 
      Array.isArray(item.category) 
        ? item.category.includes('f&b')
        : item.category === 'f&b'
    ).length * 15,
    entrepreneurship: timelineData.filter(item => 
      Array.isArray(item.category) 
        ? item.category.includes('entrepreneurship')
        : item.category === 'entrepreneurship'
    ).length * 15,
  };

  const toggleStats = () => {
    setStatsVisible(!statsVisible);
  };

  const togglePosition = () => {
    setStatsPosition(statsPosition === 'right' ? 'left' : 'right');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <div className="mb-2 inline-flex items-center justify-center gap-2 text-sm font-medium px-3 py-1 rounded-full bg-accent/20 text-accent-foreground">
              <Zap size={16} className="text-primary" />
              <span>Level {level} Professional</span>
              <Zap size={16} className="text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 gradient-text">Professional Quest Log</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A chronological journey through my career across different domains.
              Filter by skill class to explore specific areas of expertise.
            </p>

            {/* Character Stats Toggle Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleStats}
              className="mt-4 bg-card/50 backdrop-blur-sm border-primary/20 hover:bg-card/80"
            >
              <User size={16} className="mr-2" />
              {statsVisible ? "Hide Character Sheet" : "Show Character Sheet"}
            </Button>
          </div>
          
          <FilterButtons 
            activeFilter={activeFilter} 
            setActiveFilter={setActiveFilter}
            categories={categories}
          />
          
          {/* Floating Character Stats Card */}
          <div 
            className={`fixed ${statsPosition === 'right' ? 'right-0' : 'left-0'} top-1/3 transform transition-all duration-300 ease-in-out z-30
              ${statsVisible ? 'translate-x-0' : (statsPosition === 'right' ? 'translate-x-full' : '-translate-x-full')}
            `}
          >
            <div className="relative">
              {/* Tab to grab when collapsed */}
              <div 
                className={`absolute ${statsPosition === 'right' ? '-left-10' : '-right-10'} top-4 cursor-pointer bg-card/80 backdrop-blur-sm border rounded-l-lg p-2
                  ${statsPosition === 'left' ? 'rounded-r-lg rounded-l-none' : ''}`}
                onClick={toggleStats}
              >
                {statsVisible ? 
                  (statsPosition === 'right' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />) : 
                  (statsPosition === 'right' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />)
                }
              </div>
              
              <div className="bg-card/90 backdrop-blur-sm border rounded-lg p-4 w-64 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Character Stats</h3>
                  <div className="flex gap-2">
                    <button 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={togglePosition}
                      aria-label="Change position"
                    >
                      {statsPosition === 'right' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                    </button>
                    <button 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={toggleStats}
                      aria-label="Close stats"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                
                {/* XP Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Level {level}</span>
                    <div className="flex items-center gap-1">
                      <Trophy size={14} className="text-amber-500" />
                      <span>{currentLevelXP}/500 XP</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-primary animate-pulse-light" 
                      style={{ width: `${(currentLevelXP / 500) * 100}%` }} 
                    />
                  </div>
                </div>
                
                {/* Skill Bars */}
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {Object.entries(skills).map(([skill, value]) => (
                    <div key={skill} className="flex flex-col">
                      <div className="flex justify-between mb-1">
                        <span className="capitalize">{skill}</span>
                        <span>{value}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
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
            </div>
          </div>

          <div className="relative mt-12">
            {/* Timeline vertical line (visible on md screens and up) */}
            <div className="timeline-line hidden md:block"></div>
            
            {/* Timeline items */}
            <div className="flex flex-col items-center">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TimelineItem key={item.id} item={item} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center p-8 rounded-full bg-muted">
                    <Shield size={32} className="text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground mt-4">
                    No quests found for this skill class.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Timeline;
