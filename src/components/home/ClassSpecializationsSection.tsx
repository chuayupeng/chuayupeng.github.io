
import React from 'react';
import { 
  GraduationCap, Shield, Sword, Hammer, Flask, Search,
  BookOpen, Code, Bug, ServerCrash, Sparkles,
  ChefHat, Building, Star
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SkillTree from '@/components/SkillTree';

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
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="flex justify-center mb-8 bg-transparent">
            <TabsTrigger value="all" className="data-[state=active]:bg-background">
              All Classes
            </TabsTrigger>
            <TabsTrigger value="sage" className="data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/30">
              <GraduationCap className="mr-2 h-4 w-4" />
              Sage
            </TabsTrigger>
            <TabsTrigger value="hacker" className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30">
              <Code className="mr-2 h-4 w-4" />
              Hacker
            </TabsTrigger>
            <TabsTrigger value="investigator" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30">
              <Search className="mr-2 h-4 w-4" />
              Investigator
            </TabsTrigger>
            <TabsTrigger value="potion" className="data-[state=active]:bg-amber-100 dark:data-[state=active]:bg-amber-900/30">
              <Flask className="mr-2 h-4 w-4" />
              Potion Master
            </TabsTrigger>
            <TabsTrigger value="blacksmith" className="data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900/30">
              <Hammer className="mr-2 h-4 w-4" />
              Blacksmith
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <SkillTree view="all" />
          </TabsContent>
          
          <TabsContent value="sage" className="mt-0">
            <SkillTree view="sage" />
          </TabsContent>
          
          <TabsContent value="hacker" className="mt-0">
            <SkillTree view="hacker" />
          </TabsContent>
          
          <TabsContent value="investigator" className="mt-0">
            <SkillTree view="investigator" />
          </TabsContent>
          
          <TabsContent value="potion" className="mt-0">
            <SkillTree view="potion" />
          </TabsContent>
          
          <TabsContent value="blacksmith" className="mt-0">
            <SkillTree view="blacksmith" />
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
          {/* Sage Card */}
          <div className="rpg-card bg-white dark:bg-cyber-navy p-6 border border-green-200 dark:border-green-900/30">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sage</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Masters of knowledge who empower others through wisdom and teaching.
            </p>
            <div className="flex items-center gap-0.5 mb-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-gray-300" />
            </div>
            <div className="text-xs text-muted-foreground">Knowledge Path</div>
          </div>
          
          {/* Hacker Card */}
          <div className="rpg-card bg-white dark:bg-cyber-navy p-6 border border-blue-200 dark:border-blue-900/30">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Hacker</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Digital experts who manipulate systems for offensive or defensive purposes.
            </p>
            <div className="flex items-center gap-0.5 mb-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
            </div>
            <div className="text-xs text-muted-foreground">Security Path</div>
          </div>
          
          {/* Investigator Card */}
          <div className="rpg-card bg-white dark:bg-cyber-navy p-6 border border-purple-200 dark:border-purple-900/30">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <Search className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Investigator</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Digital detectives who track threats and analyze suspicious activities.
            </p>
            <div className="flex items-center gap-0.5 mb-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-gray-300" />
              <Star size={12} className="text-gray-300" />
            </div>
            <div className="text-xs text-muted-foreground">Forensics Path</div>
          </div>
          
          {/* Potion Master Card */}
          <div className="rpg-card bg-white dark:bg-cyber-navy p-6 border border-amber-200 dark:border-amber-900/30">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <Flask className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Potion Master</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Culinary alchemists who craft consumables with unique properties.
            </p>
            <div className="flex items-center gap-0.5 mb-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-gray-300" />
              <Star size={12} className="text-gray-300" />
            </div>
            <div className="text-xs text-muted-foreground">F&B Path</div>
          </div>
          
          {/* Blacksmith Card */}
          <div className="rpg-card bg-white dark:bg-cyber-navy p-6 border border-red-200 dark:border-red-900/30">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <Hammer className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Blacksmith</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Creators who forge organizations and build solutions to world problems.
            </p>
            <div className="flex items-center gap-0.5 mb-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <Star size={12} className="text-gray-300" />
            </div>
            <div className="text-xs text-muted-foreground">Founder Path</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassSpecializationsSection;
