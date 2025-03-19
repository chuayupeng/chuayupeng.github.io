
import React from 'react';
import { 
  Shield, Utensils, GraduationCap, BarChart, Rocket, 
  BookOpen, Coffee, Lock, ChefHat, Users, Zap, LucideIcon,
  Sword,
  BugPlay,
  Swords,
  Code
} from 'lucide-react';
import { TimelineItemType } from '@/data/timelineData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  Users: Users,
  Sword: Sword,
  Swords: Swords,
  BugPlay: BugPlay,
  Code: Code
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

// Calculate "rarity" based on timeline item id
const getItemRarity = (id: number) => {
  if (id <= 10) return { label: 'Legendary', class: 'text-amber-400 border-amber-400/30 bg-amber-400/10' };
  if (id <= 20) return { label: 'Epic', class: 'text-purple-400 border-purple-400/30 bg-purple-400/10' };
  if (id <= 30) return { label: 'Rare', class: 'text-blue-400 border-blue-400/30 bg-blue-400/10' };
  return { label: 'Common', class: 'text-gray-400 border-gray-400/30 bg-gray-400/10' };
};

const TimelineItem: React.FC<TimelineItemProps> = ({ item }) => {
  const IconComponent = iconMap[item.icon] || Shield;
  const categoryColor = getCategoryColor(item.category);
  const rarity = getItemRarity(item.id);
  const xpValue = 150 - (item.id * 5); // Higher XP for earlier achievements
  
  return (
    <div className="timeline-item relative animate-fade-in w-full md:w-[45%] mb-12 hover:-translate-y-1 transition-transform">
      <Card className="overflow-hidden border shadow-md hover:shadow-lg transition-shadow bg-card/90 backdrop-blur-sm">
        <CardContent className="p-0">
          {/* Top banner with pattern */}
          <div 
            className={`h-3 w-full ${categoryColor} opacity-80`}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.2" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="1"/%3E%3Ccircle cx="13" cy="13" r="1"/%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '12px 12px',
            }}
          />
          
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-lg text-white shrink-0 relative",
                categoryColor
              )}>
                <IconComponent size={20} />
                {/* Decorative elements for the icon */}
                <div className="absolute inset-0 rounded-lg border border-white/20"></div>
                <div className="absolute -inset-0.5 rounded-lg bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full border",
                      rarity.class
                    )}>
                      {rarity.label}
                    </span>
                  </div>
                  <div></div>
                  <span className="text-sm text-muted-foreground">{item.coy}</span>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                
                <div className="flex flex-wrap items-center justify-between">
                  <span className={cn(
                    "inline-block px-3 py-1 text-xs font-medium rounded-full text-white",
                    categoryColor
                  )}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                  
                  {/* XP indicator */}
                  <div className="flex items-center gap-1 text-xs font-medium text-cyan-500">
                    <Zap size={12} />
                    <span>+{xpValue} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineItem;
