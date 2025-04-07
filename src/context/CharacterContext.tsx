
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Character, CharacterClass, Quest, Skill, SkillCategory } from '@/types/rpg';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storageUtils';
import { useQuestSystem } from '@/hooks/useQuestSystem';
import { useSkillSystem } from '@/hooks/useSkillSystem';
import { calculateHealthRegeneration } from '@/utils/healthUtils';
import { useHealthSystem } from '@/hooks/useHealthSystem';

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
  updateCharacterAvatar: (avatarUrl: string) => void;
  applyHpLoss: (amount: number) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [character, setCharacter] = useState<Character | null>(() => {
    const storedCharacter = getFromStorage<Character | null>(STORAGE_KEYS.CHARACTER, null);
    if (storedCharacter) {
      // Apply health regeneration on load
      return calculateHealthRegeneration(storedCharacter);
    }
    return null;
  });
  
  // Save character data to local storage whenever it changes
  useEffect(() => {
    if (character) {
      saveToStorage(STORAGE_KEYS.CHARACTER, character);
    }
  }, [character]);

  // Setup skill system
  const { 
    skills, 
    updateSkillProgress, 
    levelUpSkill 
  } = useSkillSystem();

  // Setup health system
  const { applyHpLoss } = useHealthSystem(character, setCharacter);

  // Setup quest system
  const { 
    quests, 
    completeQuest, 
    addQuest, 
    resetDailyQuests, 
    resetWeeklyQuests, 
    checkQuestDeadlines 
  } = useQuestSystem(
    updateSkillProgress,
    setCharacter,
    character
  );

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
    
    // Set initial HP update time
    localStorage.setItem('life-rpg-last-hp-update', new Date().toISOString());
    
    setCharacter(newCharacter);
  };
  
  // Character customization - update avatar
  const updateCharacterAvatar = (avatarUrl: string) => {
    if (!character) return;
    
    const updatedCharacter = {
      ...character,
      avatarUrl
    };
    
    setCharacter(updatedCharacter);
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
        checkQuestDeadlines,
        updateCharacterAvatar,
        applyHpLoss
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
