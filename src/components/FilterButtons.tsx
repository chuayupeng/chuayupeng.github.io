import { Button } from '@/components/ui/button';

interface FilterButtonsProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  categories: string[];
}

const labels: Record<string, string> = {
  cybersecurity: 'Security',
  entrepreneurship: 'Entrepreneurship',
  'f&b': 'F&B',
  teaching: 'Teaching',
};

const FilterButtons: React.FC<FilterButtonsProps> = ({
  activeFilter,
  setActiveFilter,
  categories,
}) => {
  const all = ['all', ...categories];

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      {all.map((cat) => {
        const active = activeFilter === cat;
        const label = cat === 'all' ? 'All' : (labels[cat] ?? cat);
        return (
          <Button
            key={cat}
            size="sm"
            variant={active ? 'default' : 'outline'}
            onClick={() => setActiveFilter(cat)}
            className={
              active
                ? 'bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/90'
                : 'border-white/10 bg-secondary/50 hover:bg-secondary text-foreground/80'
            }
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
};

export default FilterButtons;
