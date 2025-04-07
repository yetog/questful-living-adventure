
import React, { useState } from 'react';
import { useCharacter } from '@/context/CharacterContext';
import { useAchievementSystem } from '@/hooks/useAchievementSystem';
import AchievementList from '@/components/AchievementList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AchievementsPage: React.FC = () => {
  const { character, quests, skills } = useCharacter();
  const { achievements } = useAchievementSystem(character, quests, skills);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100);
  
  if (!character) return null;
  
  return (
    <div className="container max-w-4xl mx-auto px-4 pb-16">
      <h1 className="text-2xl font-bold text-white mb-2">Achievements</h1>
      <p className="text-rpg-light mb-6">Track your progress and unlock special rewards</p>
      
      <div className="rpg-card mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Your Progress</h2>
            <p className="text-rpg-light mt-1">You've unlocked {unlockedCount} of {totalAchievements} achievements</p>
          </div>
          <div className="text-2xl font-rpg text-rpg-accent">
            {completionPercentage}%
          </div>
        </div>
        
        <div className="mt-4 h-2 bg-rpg-light/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-rpg-accent"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 bg-rpg-dark/50 border border-rpg-accent/30">
          <TabsTrigger 
            value="all" 
            onClick={() => setFilter('all')}
          >
            All ({totalAchievements})
          </TabsTrigger>
          <TabsTrigger 
            value="unlocked" 
            onClick={() => setFilter('unlocked')}
          >
            Unlocked ({unlockedCount})
          </TabsTrigger>
          <TabsTrigger 
            value="locked" 
            onClick={() => setFilter('locked')}
          >
            Locked ({totalAchievements - unlockedCount})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <AchievementList achievements={achievements} filter="all" />
        </TabsContent>
        <TabsContent value="unlocked" className="space-y-4">
          <AchievementList achievements={achievements} filter="unlocked" />
        </TabsContent>
        <TabsContent value="locked" className="space-y-4">
          <AchievementList achievements={achievements} filter="locked" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementsPage;
