
import { useState, useEffect } from 'react';
import { Skill, SkillCategory } from '@/types/rpg';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storageUtils';
import { initialSkills } from '@/data/initialData';

export const useSkillSystem = () => {
  const [skills, setSkills] = useState<Skill[]>(() => 
    getFromStorage<Skill[]>(STORAGE_KEYS.SKILLS, initialSkills)
  );
  
  // Save data to local storage whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SKILLS, skills);
  }, [skills]);

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

  return { 
    skills, 
    updateSkillProgress, 
    levelUpSkill 
  };
};
