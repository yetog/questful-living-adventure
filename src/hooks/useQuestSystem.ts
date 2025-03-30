
import { useState, useEffect } from 'react';
import { Quest, Character, SkillCategory } from '@/types/rpg';
import { 
  getFromStorage, 
  saveToStorage, 
  STORAGE_KEYS, 
  getTodayFormatted 
} from '@/utils/storageUtils';
import { initialQuests } from '@/data/initialData';
import { format, isAfter, isBefore, addDays, addWeeks, parseISO } from 'date-fns';
import { applyHpLossRate } from '@/utils/healthUtils';
import { toast } from '@/components/ui/use-toast';

type UpdateSkillProgressFn = (skillCategory: SkillCategory, xpAmount: number) => void;
type UpdateCharacterFn = (updater: (prev: Character) => Character) => void;

export const useQuestSystem = (
  updateSkillProgress: UpdateSkillProgressFn,
  updateCharacter: UpdateCharacterFn,
  character: Character | null
) => {
  const [quests, setQuests] = useState<Quest[]>(() => 
    getFromStorage<Quest[]>(STORAGE_KEYS.QUESTS, initialQuests)
  );
  
  const [lastDailyReset, setLastDailyReset] = useState<string>(() => 
    getFromStorage<string>(STORAGE_KEYS.LAST_DAILY_RESET, getTodayFormatted())
  );
  
  const [lastWeeklyReset, setLastWeeklyReset] = useState<string>(() => 
    getFromStorage<string>(STORAGE_KEYS.LAST_WEEKLY_RESET, getTodayFormatted())
  );

  // Save data to local storage whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.QUESTS, quests);
  }, [quests]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LAST_DAILY_RESET, lastDailyReset);
  }, [lastDailyReset]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LAST_WEEKLY_RESET, lastWeeklyReset);
  }, [lastWeeklyReset]);

  // Check for resets and deadlines
  useEffect(() => {
    const today = getTodayFormatted();
    
    // Check for daily reset
    if (lastDailyReset !== today) {
      resetDailyQuests();
      setLastDailyReset(today);
    }
    
    // Check for weekly reset (if it's been a week since last reset)
    const lastWeeklyDate = parseISO(lastWeeklyReset);
    const oneWeekLater = addWeeks(lastWeeklyDate, 1);
    
    if (isAfter(new Date(), oneWeekLater)) {
      resetWeeklyQuests();
      setLastWeeklyReset(today);
    }
    
    // Check quest deadlines
    checkQuestDeadlines();
  }, []);

  const completeQuest = (questId: string) => {
    if (!character) return;
    
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    // Update quest
    setQuests(quests.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    ));
    
    // Get rewards
    const { xpReward, coinReward, skillCategory } = quest;
    
    // Update character coins
    updateCharacter(prev => ({
      ...prev,
      coins: prev.coins + coinReward
    }));
    
    // Update character XP (this is now handled in the character hook)
    updateCharacter(prev => {
      let newXp = prev.xp + xpReward;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;
      
      // Check for level up
      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel++;
        newMaxXp = Math.floor(100 * Math.pow(1.5, newLevel - 1));
        
        // Show level up toast
        toast({
          title: "Level Up!",
          description: `You've reached level ${newLevel}!`,
        });
        
        // Add level-up animation to character level display
        const levelElement = document.querySelector('.character-level');
        if (levelElement) {
          levelElement.classList.add('level-up-animation');
          setTimeout(() => {
            levelElement.classList.remove('level-up-animation');
          }, 2000);
        }
      }
      
      return {
        ...prev,
        xp: newXp,
        maxXp: newMaxXp,
        level: newLevel
      };
    });
    
    // Update skill XP
    updateSkillProgress(skillCategory, xpReward);
  };

  const addQuest = (quest: Omit<Quest, 'id'>) => {
    const newQuest: Quest = {
      ...quest,
      id: Math.random().toString(36).substring(2, 9) // Simple ID generation
    };
    
    setQuests([...quests, newQuest]);
  };

  const resetDailyQuests = () => {
    setQuests(quests.map(quest => 
      quest.frequency === 'Daily' ? { ...quest, completed: false } : quest
    ));
  };

  const resetWeeklyQuests = () => {
    setQuests(quests.map(quest => 
      quest.frequency === 'Weekly' ? { ...quest, completed: false } : quest
    ));
  };

  const checkQuestDeadlines = () => {
    const today = new Date();
    let hpLost = 0;
    let missedQuests = 0;
    
    setQuests(quests.map(quest => {
      // Skip if no due date or already completed
      if (!quest.dueDate || quest.completed) return quest;
      
      const dueDate = parseISO(quest.dueDate);
      
      // If past due date and not completed, apply penalty
      if (isBefore(dueDate, today) && !quest.completed) {
        // Apply HP penalty if character exists
        if (character) {
          const hpPenalty = applyHpLossRate(quest.difficulty);
          hpLost += hpPenalty;
          missedQuests++;
          
          const newHp = Math.max(0, character.hp - hpPenalty);
          
          updateCharacter(prev => ({
            ...prev,
            hp: newHp
          }));
        }
        
        // For one-time quests, mark as failed
        if (quest.frequency === 'OneTime') {
          return { ...quest, completed: true };
        }
        
        // For recurring quests, just reset and update due date
        const newDueDate = quest.frequency === 'Daily' 
          ? format(addDays(today, 1), 'yyyy-MM-dd')
          : format(addWeeks(today, 1), 'yyyy-MM-dd');
          
        return { ...quest, dueDate: newDueDate };
      }
      
      return quest;
    }));
    
    // Show toast if HP was lost
    if (hpLost > 0) {
      toast({
        title: "Quests Expired!",
        description: `You lost ${hpLost} HP for missing ${missedQuests} quest${missedQuests > 1 ? 's' : ''}.`,
        variant: "destructive"
      });
    }
  };

  return {
    quests,
    completeQuest,
    addQuest,
    resetDailyQuests,
    resetWeeklyQuests,
    checkQuestDeadlines
  };
};
