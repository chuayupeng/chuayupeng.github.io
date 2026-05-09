import React from 'react';
import { User } from 'lucide-react';
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
  statsVisible,
}) => {
  return (
    <div className="pt-8">
      <div className="max-w-3xl mb-10">
        <div className="section-eyebrow">Timeline</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {level} years across <span className="gradient-text">security</span> &amp; building.
        </h1>
        <p className="text-muted-foreground text-lg">
          A chronological log of roles, projects, and side quests — read it like a git history.
          Filter by focus area to narrow it down.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <FilterButtons
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          categories={categories}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={toggleStats}
          className="border-white/10 bg-secondary/50 hover:bg-secondary text-foreground/80"
        >
          <User size={14} className="mr-1.5" />
          {statsVisible ? 'Hide stats' : 'Show stats'}
        </Button>
      </div>
    </div>
  );
};

export default TimelineHeader;
