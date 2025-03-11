
import React from 'react';
import { 
  Shield, Utensils, GraduationCap, BarChart, Rocket, 
  BookOpen, Coffee, Lock, ChefHat, Users, LucideIcon
} from 'lucide-react';
import { TimelineItemType } from '@/data/timelineData';
import { Card, CardContent } from '@/components/ui/card';

interface TimelineItemProps {
  item: TimelineItemType;
}

const iconMap: Record<string, LucideIcon> = {
  Shield: Shield,
  Utensils: Utensils,
  GraduationCap: GraduationCap,
  BarChart: BarChart,
  Rocket: Rocket,
  BookOpen: BookOpen,
  Coffee: Coffee,
  Lock: Lock,
  ChefHat: ChefHat,
  Users: Users
};

const getCategoryColor = (category: TimelineItemType['category']) => {
  switch (category) {
    case 'cybersecurity':
      return 'bg-blue-500';
    case 'teaching':
      return 'bg-green-500';
    case 'f&b':
      return 'bg-amber-500';
    case 'entrepreneurship':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const TimelineItem: React.FC<TimelineItemProps> = ({ item }) => {
  const IconComponent = iconMap[item.icon] || Shield;
  const categoryColor = getCategoryColor(item.category);

  return (
    <div className="timeline-item relative animate-fade-in w-full md:w-[45%] mb-12">
      {/* Removed the timeline-dot to prevent blocking the title */}
      
      <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: `var(--${categoryColor.replace('bg-', '')})` }}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${categoryColor} text-white shrink-0`}>
              <IconComponent size={20} />
            </div>
            
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <span className="text-sm text-muted-foreground">{item.date}</span>
              </div>
              
              <p className="text-sm text-muted-foreground">{item.description}</p>
              
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${categoryColor} bg-opacity-20 text-${categoryColor.split('-')[1]}-700`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineItem;
