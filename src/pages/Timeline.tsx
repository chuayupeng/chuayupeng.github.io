
import { useState } from 'react';
import { timelineData, TimelineItemType } from '@/data/timelineData';
import TimelineItem from '@/components/TimelineItem';
import FilterButtons from '@/components/FilterButtons';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Timeline = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filteredData = activeFilter === 'all' 
    ? timelineData 
    : timelineData.filter(item => item.category === activeFilter);

  const categories = Array.from(new Set(timelineData.map(item => item.category)));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Professional Timeline</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A chronological journey through my career across different domains.
              Filter by category to explore specific areas of expertise.
            </p>
          </div>
          
          <FilterButtons 
            activeFilter={activeFilter} 
            setActiveFilter={setActiveFilter}
            categories={categories}
          />
          
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
                  <p className="text-muted-foreground">
                    No timeline items found for this category.
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
