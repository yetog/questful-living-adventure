import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Character, CharacterClass, Quest, Skill, SkillCategory } from '@/types/rpg';
import { format, isAfter, isBefore, addDays, addWeeks, parseISO } from 'date-fns';

interface CharacterContextType {
  character: Character | null;
  quests: Quest[];
  skills: Skill[];
  createCharacter: (name: string, characterClass: CharacterClass) => void;
  completeQuest: (questId: string) => void;
  addQuest: (quest: Omit<Quest, 'id'>) => void;
  levelUpSkill: (skillId: string) => void;
  resetDailyQuests: () => void;
  resetWeeklyQuests: () => void;
  checkQuestDeadlines: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

// Initial skills based on categories
const initialSkills: Skill[] = [
  {
    id: '1',
    name: 'Physical Strength',
    category: 'Health',
    level: 1,
    maxLevel: 10,
    description: 'Increase physical strength through exercise and training',
    xpRequired: 100,
    currentXp: 0
  },
  {
    id: '2',
    name: 'Mental Clarity',
    category: 'Health',
    level: 1,
    maxLevel: 10,
    description: 'Increase mental focus through meditation and mindfulness',
    xpRequired: 100,
    currentXp: 0
  },
  {
    id: '3',
    name: 'Financial Management',
    category: 'Finance',
    level: 1,
    maxLevel: 10,
    description: 'Improve budgeting and money management skills',
    xpRequired: 100,
    currentXp: 0
  },
  {
    id: '4',
    name: 'Knowledge Acquisition',
    category: 'Learning',
    level: 1,
    maxLevel: 10,
    description: 'Enhance ability to learn and retain new information',
    xpRequired: 100,
    currentXp: 0
  },
  {
    id: '5',
    name: 'Communication',
    category: 'Social',
    level: 1,
    maxLevel: 10,
    description: 'Enhance ability to communicate effectively with others',
    xpRequired: 100,
    currentXp: 0
  },
  {
    id: '6',
    name: 'Professional Development',
    category: 'Career',
    level: 1,
    maxLevel: 10,
    description: 'Develop skills relevant to career advancement',
    xpRequired: 100,
    currentXp: 0
  },
];

// Initial quests
const initialQuests: Quest[] = [
  {
    id: '1',
    title: 'Morning Exercise',
    description: 'Complete a morning workout routine',
    frequency: 'Daily',
    difficulty: 'Medium',
    completed: false,
    skillCategory: 'Health',
    xpReward: 20,
    coinReward: 5
  },
  {
    id: '2',
    title: 'Study Session',
    description: 'Study for 1 hour without distractions',
    frequency: 'Daily',
    difficulty: 'Medium',
    completed: false,
    skillCategory: 'Learning',
    xpReward: 20,
    coinReward: 5
  },
  {
    id: '3',
    title: 'Budget Review',
    description: 'Review personal finances and update budget',
    frequency: 'Weekly',
    difficulty: 'Medium',
    completed: false,
    skillCategory: 'Finance',
    xpReward: 30,
    coinReward: 10
  },
  {
    id: '4',
    title: 'Networking',
    description: 'Connect with a colleague or industry professional',
    frequency: 'Weekly',
    difficulty: 'Medium',
    completed: false,
    skillCategory: 'Social',
    xpReward: 25,
    coinReward: 8
  },
  {
    id: '5',
    title: 'Career Research',
    description: 'Research opportunities for career advancement',
    frequency: 'Weekly',
    difficulty: 'Medium',
    completed: false,
    skillCategory: 'Career',
    xpReward: 25,
    coinReward: 8
  }
];

// Local storage keys
const STORAGE_KEYS = {
  CHARACTER: 'life-rpg-character',
  QUESTS: 'life-rpg-quests',
  SKILLS: 'life-rpg-skills',
  LAST_DAILY_RESET: 'life-rpg-last-daily-reset',
  LAST_WEEKLY_RESET: 'life-rpg-last-weekly-reset'
};

// Helper function to get data from local storage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from local storage:`, error);
    return defaultValue;
  }
};

// Helper function to save data to local storage
const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to local storage:`, error);
  }
};

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [character, setCharacter] = useState<Character | null>(() => 
    getFromStorage<Character | null>(STORAGE_KEYS.CHARACTER, null)
  );
  
  const [quests, setQuests] = useState<Quest[]>(() => 
    getFromStorage<Quest[]>(STORAGE_KEYS.QUESTS, initialQuests)
  );
  
  const [skills, setSkills] = useState<Skill[]>(() => 
    getFromStorage<Skill[]>(STORAGE_KEYS.SKILLS, initialSkills)
  );
  
  const [lastDailyReset, setLastDailyReset] = useState<string>(() => 
    getFromStorage<string>(STORAGE_KEYS.LAST_DAILY_RESET, format(new Date(), 'yyyy-MM-dd'))
  );
  
  const [lastWeeklyReset, setLastWeeklyReset] = useState<string>(() => 
    getFromStorage<string>(STORAGE_KEYS.LAST_WEEKLY_RESET, format(new Date(), 'yyyy-MM-dd'))
  );

  // Save data to local storage whenever it changes
  useEffect(() => {
    if (character) {
      saveToStorage(STORAGE_KEYS.CHARACTER, character);
    }
  }, [character]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.QUESTS, quests);
  }, [quests]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SKILLS, skills);
  }, [skills]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LAST_DAILY_RESET, lastDailyReset);
  }, [lastDailyReset]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LAST_WEEKLY_RESET, lastWeeklyReset);
  }, [lastWeeklyReset]);

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
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

  const calculateXpForLevel = (level: number) => {
    return 100 * Math.pow(1.5, level - 1);
  };

  const createCharacter = (name: string, characterClass: CharacterClass) => {
    const newCharacter: Character = {
      id: '1',  // In a real app, generate a unique ID
      name,
      class: characterClass,
      level: 1,
      xp: 0,
      maxXp: 100,
      hp: 100,
      maxHp: 100,
      coins: 0
    };
    
    setCharacter(newCharacter);
  };

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
    
    // Update character XP and coins
    let newXp = character.xp + xpReward;
    let newLevel = character.level;
    let newMaxXp = character.maxXp;
    
    // Check for level up
    while (newXp >= newMaxXp) {
      newXp -= newMaxXp;
      newLevel++;
      newMaxXp = calculateXpForLevel(newLevel);
    }
    
    setCharacter({
      ...character,
      xp: newXp,
      maxXp: newMaxXp,
      level: newLevel,
      coins: character.coins + coinReward
    });
    
    // Update skill XP and auto level-up if enough XP
    updateSkillProgress(skillCategory, xpReward);
  };
  
  const updateSkillProgress = (skillCategory: SkillCategory, xpAmount: number) => {
    setSkills(skills.map(skill => {
      if (skill.category === skillCategory) {
        const newSkillXp = skill.currentXp + xpAmount;
        
        // Auto level up the skill if enough XP
        if (newSkillXp >= skill.xpRequired && skill.level < skill.maxLevel) {
          return {
            ...skill,
            level: skill.level + 1,
            currentXp: 0,
            xpRequired: Math.floor(skill.xpRequired * 1.5)
          };
        }
        
        return {
          ...skill,
          currentXp: newSkillXp
        };
      }
      return skill;
    }));
  };

  const addQuest = (quest: Omit<Quest, 'id'>) => {
    const newQuest: Quest = {
      ...quest,
      id: Math.random().toString(36).substring(2, 9) // Simple ID generation
    };
    
    setQuests([...quests, newQuest]);
  };

  const levelUpSkill = (skillId: string) => {
    // This would typically cost resources or require specific quests
    // For now, we'll just increment the skill level if not maxed
    setSkills(skills.map(skill => {
      if (skill.id === skillId && skill.level < skill.maxLevel) {
        return {
          ...skill,
          level: skill.level + 1,
          currentXp: 0,
          xpRequired: Math.floor(skill.xpRequired * 1.5)
        };
      }
      return skill;
    }));
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
    
    setQuests(quests.map(quest => {
      // Skip if no due date or already completed
      if (!quest.dueDate || quest.completed) return quest;
      
      const dueDate = parseISO(quest.dueDate);
      
      // If past due date and not completed, apply penalty
      if (isBefore(dueDate, today) && !quest.completed) {
        // Apply HP penalty if character exists
        if (character) {
          const hpPenalty = quest.difficulty === 'Easy' ? 5 : 
                            quest.difficulty === 'Medium' ? 10 : 
                            quest.difficulty === 'Hard' ? 15 : 20;
          
          const newHp = Math.max(0, character.hp - hpPenalty);
          
          setCharacter({
            ...character,
            hp: newHp
          });
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
  };

  return (
    <CharacterContext.Provider 
      value={{ 
        character, 
        quests, 
        skills,
        createCharacter,
        completeQuest,
        addQuest,
        levelUpSkill,
        resetDailyQuests,
        resetWeeklyQuests,
        checkQuestDeadlines
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
