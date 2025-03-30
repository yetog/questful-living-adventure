
export type CharacterClass = 'Warrior' | 'Mage' | 'Rogue' | 'Ranger' | 'Bard';

export interface Character {
  id: string;
  name: string;
  level: number;
  class: CharacterClass;
  xp: number;
  maxXp: number;
  hp: number;
  maxHp: number;
  coins: number;
  avatarUrl?: string;
}

export type SkillCategory = 'Health' | 'Finance' | 'Learning' | 'Social' | 'Career';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  maxLevel: number;
  description: string;
  xpRequired: number;
  currentXp: number;
}

export type QuestFrequency = 'Daily' | 'Weekly' | 'OneTime';
export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Epic';

export interface Quest {
  id: string;
  title: string;
  description: string;
  frequency: QuestFrequency;
  difficulty: QuestDifficulty;
  completed: boolean;
  skillCategory: SkillCategory;
  xpReward: number;
  coinReward: number;
  dueDate?: string;
}
