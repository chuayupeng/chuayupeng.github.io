
import { useMemo } from 'react';
import { TimelineItemType, CategoryType } from '@/data/timelineData';

// Calculate "rarity" based on timeline item id - match the same logic as in TimelineItem.tsx
export const getItemRarity = (id: number) => {
  if (id <= 20) return { label: 'Legendary', class: 'text-amber-400 border-amber-400/30 bg-amber-400/10', xpBase: 400 };
  if (id <= 40) return { label: 'Epic', class: 'text-purple-400 border-purple-400/30 bg-purple-400/10', xpBase: 150 };
  if (id <= 60) return { label: 'Rare', class: 'text-blue-400 border-blue-400/30 bg-blue-400/10', xpBase: 75 };
  return { label: 'Common', class: 'text-gray-400 border-gray-400/30 bg-gray-400/10', xpBase: 25 };
};

// Calculate XP based on rarity and add some variance - match the same logic as in TimelineItem.tsx
export const calculateXP = (id: number) => {
  const rarity = getItemRarity(id);
  const variance = (id % 10) * 50;
  return rarity.xpBase + variance;
};

// Calculate skill points based on item rarity
export const calculateSkillPoints = (id: number) => {
  const rarity = getItemRarity(id);
  // Apply multipliers based on rarity
  if (rarity.label === 'Legendary') return 30; // Higher multiplier for legendary items
  if (rarity.label === 'Epic') return 25;
  if (rarity.label === 'Rare') return 20;
  return 15; // Base points for common items
};

export const useTimelineCalculations = (timelineData: TimelineItemType[]) => {
  const totalExperience = useMemo(() => 
    timelineData.reduce((total, item) => total + calculateXP(item.id), 0)
  , [timelineData]);
  
  const level = Math.floor(totalExperience / 500) + 1;
  const currentLevelXP = totalExperience % 500;
  const xpToNextLevel = 500 - currentLevelXP;
  
  const skills = useMemo(() => {
    const skillPoints = {
      cybersecurity: 0,
      teaching: 0,
      'f&b': 0,
      entrepreneurship: 0
    };
    
    timelineData.forEach(item => {
      const points = calculateSkillPoints(item.id);
      
      if (Array.isArray(item.category)) {
        // Distribute points among multiple categories
        const pointsPerCategory = points / item.category.length;
        item.category.forEach(cat => {
          skillPoints[cat] += pointsPerCategory;
        });
      } else {
        // Single category gets all points
        skillPoints[item.category] += points;
      }
    });
    
    return skillPoints;
  }, [timelineData]);

  return {
    totalExperience,
    level,
    currentLevelXP,
    xpToNextLevel,
    skills
  };
};
