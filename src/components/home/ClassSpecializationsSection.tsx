
import { Shield, BookOpen, ChefHat, Terminal, Star } from 'lucide-react';
import ClassPathways from '@/components/ClassPathways';

const ClassSpecializationsSection = () => {
  return (
    <section className="py-20 px-4 bg-white dark:bg-cyber-blue">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Class Specializations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Multi-class character with unique abilities in diverse skill trees.
          </p>
        </div>
        
        <div className="mb-12">
          <ClassPathways />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {/* Cybersecurity Card */}
          <div className="rpg-card bg-white dark:bg-cyber-navy p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Security Mage</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Masters of defense magic, specialized in threat detection and magical barriers.
            </p>
            <div className="flex items-center gap-0.5 mb-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
            </div>
            <div className="text-xs text-muted-foreground">Legendary Class</div>
          </div>
          
          {/* Teaching Card */}
          <div className="rpg-card bg-white dark:bg-cyber-navy p-6">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Knowledge Sage</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Wielders of ancient wisdom who can transfer knowledge and empower others.
            </p>
            <div className="flex items-center gap-0.5 mb-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-gray-300" />
            </div>
            <div className="text-xs text-muted-foreground">Epic Class</div>
          </div>
          
          {/* F&B Card */}
          <div className="rpg-card bg-white dark:bg-cyber-navy p-6">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <ChefHat className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Culinary Alchemist</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Combines rare ingredients to create powerful consumables with magical effects.
            </p>
            <div className="flex items-center gap-0.5 mb-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-gray-300" />
              <Star size={12} className="text-gray-300" />
            </div>
            <div className="text-xs text-muted-foreground">Rare Class</div>
          </div>
          
          {/* Entrepreneurship Card */}
          <div className="rpg-card bg-white dark:bg-cyber-navy p-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <Terminal className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Guild Master</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Leaders who build and manage thriving guilds that solve world problems.
            </p>
            <div className="flex items-center gap-0.5 mb-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-gray-300" />
            </div>
            <div className="text-xs text-muted-foreground">Epic Class</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassSpecializationsSection;
