
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/data/timelineData';

interface FilterButtonsProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  categories: string[];
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ 
  activeFilter, 
  setActiveFilter,
  categories
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      <Button
        variant={activeFilter === 'all' ? 'default' : 'outline'}
        onClick={() => setActiveFilter('all')}
        className={activeFilter === 'all' ? 'bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/80' : ''}
      >
        All
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeFilter === category ? 'default' : 'outline'}
          onClick={() => setActiveFilter(category)}
          className={activeFilter === category ? 'bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/80' : ''}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>
      ))}
    </div>
  );
};

export default FilterButtons;
