
import { useState, useEffect } from 'react';
import { Achievement, Character, Quest, Skill } from '@/types/rpg';
import { getFromStorage, saveToStorage } from '@/utils/storageUtils';
import { toast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'life-rpg-achievements';

// Define initial achievements
const initialAchievements: Achievement[] = [
  {
    id: 'ach1',
    title: 'First Steps',
    description: 'Complete your first quest',
    icon: 'award',
    unlocked: false,
    category: 'Quest',
    progress: { current: 0, required: 1 }
  },
  {
    id: 'ach2',
    title: 'Quest Master',
    description: 'Complete 10 quests',
    icon: 'scroll',
    unlocked: false,
    category: 'Quest',
    progress: { current: 0, required: 10 }
  },
  {
    id: 'ach3',
    title: 'Skilled Up',
    description: 'Reach level 5 in any skill',
    icon: 'star',
    unlocked: false,
    category: 'Skill'
  },
  {
    id: 'ach4',
    title: 'Jack of All Trades',
    description: 'Level up at least once in each skill category',
    icon: 'layers',
    unlocked: false,
    category: 'Skill',
    progress: { current: 0, required: 5 }
  },
  {
    id: 'ach5',
    title: 'Survivor',
    description: 'Restore your health back to full after dropping below 20%',
    icon: 'heart',
    unlocked: false,
    category: 'Character'
  },
  {
    id: 'ach6',
    title: 'Level 10',
    description: 'Reach level 10 with your character',
    icon: 'shield',
    unlocked: false,
    category: 'Character',
    progress: { current: 1, required: 10 }
  }
];

export const useAchievementSystem = (character: Character | null, quests: Quest[], skills: Skill[]) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    return getFromStorage<Achievement[]>(STORAGE_KEY, initialAchievements);
  });

  // Save achievements to storage whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEY, achievements);
  }, [achievements]);

  const unlockAchievement = (id: string) => {
    setAchievements(current => {
      const newAchievements = [...current];
      const achievement = newAchievements.find(a => a.id === id);
      
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.dateUnlocked = new Date().toISOString();
        
        // Show toast notification
        toast({
          title: "Achievement Unlocked!",
          description: `${achievement.title}: ${achievement.description}`,
        });
      }
      
      return newAchievements;
    });
  };

  const updateAchievementProgress = (id: string, current: number) => {
    setAchievements(currentAchievements => {
      const newAchievements = [...currentAchievements];
      const achievement = newAchievements.find(a => a.id === id);
      
      if (achievement && achievement.progress && !achievement.unlocked) {
        achievement.progress.current = current;
        
        // Check if the achievement should be unlocked
        if (achievement.progress.current >= achievement.progress.required) {
          achievement.unlocked = true;
          achievement.dateUnlocked = new Date().toISOString();
          
          // Show toast notification
          toast({
            title: "Achievement Unlocked!",
            description: `${achievement.title}: ${achievement.description}`,
          });
        }
      }
      
      return newAchievements;
    });
  };

  // Check quest-related achievements
  useEffect(() => {
    if (!quests.length) return;
    
    // Count completed quests
    const completedQuests = quests.filter(quest => quest.completed).length;
    
    // First quest
    if (completedQuests > 0) {
      updateAchievementProgress('ach1', 1);
    }
    
    // 10 quests
    updateAchievementProgress('ach2', completedQuests);
    
  }, [quests]);

  // Check skill-related achievements
  useEffect(() => {
    if (!skills.length) return;
    
    // Check for any skill at level 5
    const hasLevelFiveSkill = skills.some(skill => skill.level >= 5);
    if (hasLevelFiveSkill) {
      unlockAchievement('ach3');
    }
    
    // Check for skills in each category
    const categories = new Set(skills.filter(skill => skill.level > 1).map(skill => skill.category));
    updateAchievementProgress('ach4', categories.size);
    
  }, [skills]);

  // Check character-related achievements
  useEffect(() => {
    if (!character) return;
    
    // Level 10 achievement
    updateAchievementProgress('ach6', character.level);
    
    // Low health check is handled separately with the health system
    
  }, [character]);

  // Function to check if character recovered from low health
  const checkHealthRecovery = (oldHp: number, newHp: number, maxHp: number) => {
    // If we were below 20% and now we're at 100%
    if (oldHp < maxHp * 0.2 && newHp === maxHp) {
      unlockAchievement('ach5');
    }
  };

  return {
    achievements,
    unlockAchievement,
    updateAchievementProgress,
    checkHealthRecovery
  };
};
