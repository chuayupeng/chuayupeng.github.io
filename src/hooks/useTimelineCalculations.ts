
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

export const useTimelineCalculations = (timelineData: TimelineItemType[]) => {
  const totalExperience = useMemo(() => 
    timelineData.reduce((total, item) => total + calculateXP(item.id), 0)
  , [timelineData]);
  
  const level = Math.floor(totalExperience / 500) + 1;
  const currentLevelXP = totalExperience % 500;
  const xpToNextLevel = 500 - currentLevelXP;
  
  const skills = useMemo(() => ({
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
  }), [timelineData]);

  return {
    totalExperience,
    level,
    currentLevelXP,
    xpToNextLevel,
    skills
  };
};
