
import { useState } from 'react';
import { timelineData, CategoryType } from '@/data/timelineData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TimelineHeader from '@/components/TimelineHeader';
import TimelineContent from '@/components/TimelineContent';
import CharacterStatsPanel from '@/components/CharacterStatsPanel';
import { useTimelineCalculations } from '@/hooks/useTimelineCalculations';

const Timeline = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [statsVisible, setStatsVisible] = useState(false);
  const [statsPosition, setStatsPosition] = useState('right'); // 'right' or 'left'
  
  const filteredData = activeFilter === 'all' 
    ? timelineData 
    : timelineData.filter(item => {
        if (Array.isArray(item.category)) {
          return item.category.includes(activeFilter as CategoryType);
        }
        return item.category === activeFilter;
      });

  const allCategories = timelineData.flatMap(item => 
    Array.isArray(item.category) ? item.category : [item.category]
  );
  const categories = Array.from(new Set(allCategories));
  
  const { level, currentLevelXP, skills } = useTimelineCalculations(timelineData);

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
          <TimelineHeader 
            level={level}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            categories={categories}
            toggleStats={toggleStats}
            statsVisible={statsVisible}
          />
          
          <CharacterStatsPanel
            level={level}
            currentLevelXP={currentLevelXP}
            skills={skills}
            statsVisible={statsVisible}
            statsPosition={statsPosition as 'right' | 'left'}
            toggleStats={toggleStats}
            togglePosition={togglePosition}
          />

          <TimelineContent filteredData={filteredData} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Timeline;
