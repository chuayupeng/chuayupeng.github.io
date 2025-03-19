
import React from 'react';
import { Zap, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterButtons from '@/components/FilterButtons';

interface TimelineHeaderProps {
  level: number;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  categories: string[];
  toggleStats: () => void;
  statsVisible: boolean;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  level,
  activeFilter,
  setActiveFilter,
  categories,
  toggleStats,
  statsVisible
}) => {
  return (
    <>
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
    </>
  );
};

export default TimelineHeader;
