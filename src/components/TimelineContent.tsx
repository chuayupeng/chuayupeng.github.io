
import React from 'react';
import { Shield } from 'lucide-react';
import TimelineItem from '@/components/TimelineItem';
import { TimelineItemType } from '@/data/timelineData';

interface TimelineContentProps {
  filteredData: TimelineItemType[];
}

const TimelineContent: React.FC<TimelineContentProps> = ({ filteredData }) => {
  return (
    <div className="relative mt-12">
      <div className="timeline-line hidden md:block"></div>
      
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
  );
};

export default TimelineContent;
