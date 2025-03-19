
import React from 'react';
import { 
  Shield, Utensils, GraduationCap, BarChart, Rocket, 
  BookOpen, Coffee, Lock, ChefHat, Users, Zap, LucideIcon,
  Sword,
  BugPlay,
  Swords,
  Code,
  Bot,
  University,
  School,
  Martini
} from 'lucide-react';
import { TimelineItemType, CategoryType } from '@/data/timelineData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  Code: Code,
  Bot: Bot,
  University: University,
  School: School,
  Martini: Martini
};

const getCategoryColor = (category: CategoryType) => {
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

const getCategoryGradient = (categories: CategoryType[]) => {
  if (categories.length === 1) {
    return getCategoryColor(categories[0]);
  }
  
  // Multi-category gradients
  const categoryColors: Record<CategoryType, string> = {
    'cybersecurity': 'from-blue-500',
    'teaching': 'from-green-500',
    'f&b': 'from-amber-500',
    'entrepreneurship': 'from-purple-500'
  };
  
  // Use the first two categories for the gradient
  const primaryCategory = categories[0];
  const secondaryCategory = categories[1] || categories[0];
  
  const fromColor = categoryColors[primaryCategory];
  const toColor = {
    'cybersecurity': 'to-blue-500',
    'teaching': 'to-green-500',
    'f&b': 'to-amber-500',
    'entrepreneurship': 'to-purple-500'
  }[secondaryCategory];
  
  return `bg-gradient-to-r ${fromColor} ${toColor}`;
};

// Calculate "rarity" based on timeline item id
const getItemRarity = (id: number) => {
  if (id <= 5) return { label: 'Legendary', class: 'text-amber-400 border-amber-400/30 bg-amber-400/10', xpBase: 200 };
  if (id <= 10) return { label: 'Epic', class: 'text-purple-400 border-purple-400/30 bg-purple-400/10', xpBase: 150 };
  if (id <= 20) return { label: 'Rare', class: 'text-blue-400 border-blue-400/30 bg-blue-400/10', xpBase: 100 };
  return { label: 'Common', class: 'text-gray-400 border-gray-400/30 bg-gray-400/10', xpBase: 50 };
};

// Calculate XP based on rarity and add some variance
const calculateXP = (id: number) => {
  const rarity = getItemRarity(id);
  // Add some variance based on the id
  const variance = (id % 5) * 5; // 0, 5, 10, 15, or 20 additional XP
  return rarity.xpBase + variance;
};

const TimelineItem: React.FC<TimelineItemProps> = ({ item }) => {
  const IconComponent = iconMap[item.icon] || Shield;
  const categories = Array.isArray(item.category) ? item.category : [item.category];
  const categoryColor = getCategoryGradient(categories);
  const rarity = getItemRarity(item.id);
  const xpValue = calculateXP(item.id);
  const isMobile = useIsMobile();
  
  return (
    <div className="timeline-item relative animate-fade-in w-full md:w-[45%] mb-12 hover:-translate-y-1 transition-transform">
      <Card className="overflow-hidden border shadow-md hover:shadow-lg transition-shadow bg-card/90 backdrop-blur-sm">
        <CardContent className="p-0">
          {/* Top banner with smooth gradient */}
          <div 
            className={`h-3 w-full ${categoryColor}`}
            style={{ 
              backgroundImage: categories.length > 1 
                ? `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` 
                : 'none' 
            }}
          />
          
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-lg text-white shrink-0 relative",
                categoryColor
              )}
                style={{ 
                  backgroundImage: categories.length > 1 
                    ? `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` 
                    : 'none' 
                }}
              >
                <IconComponent size={20} />
                {/* Decorative elements for the icon */}
                <div className="absolute inset-0 rounded-lg border border-white/20"></div>
                <div className="absolute -inset-0.5 rounded-lg bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col gap-1 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full border",
                      rarity.class
                    )}>
                      {rarity.label}
                    </span>
                  </div>
                  
                  <span className="text-sm text-muted-foreground">{item.coy}</span>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {categories.map((category) => (
                      <span key={category} className={cn(
                        "inline-block px-3 py-1 text-xs font-medium rounded-full text-white",
                        getCategoryColor(category)
                      )}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                    ))}
                  </div>
                  
                  {/* XP indicator */}
                  <div className="flex items-center gap-1 text-xs font-medium text-cyan-500 mt-2">
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
