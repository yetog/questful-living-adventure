
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
export type QuestCategory = 'Main Story' | 'Side Quest' | 'Personal Growth' | 'Social' | 'Health';
export type QuestPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Quest {
  id: string;
  title: string;
  description: string;
  frequency: QuestFrequency;
  difficulty: QuestDifficulty;
  completed: boolean;
  skillCategory: SkillCategory;
  category: QuestCategory;
  priority?: QuestPriority;
  xpReward: number;
  coinReward: number;
  dueDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: 'Quest' | 'Skill' | 'Character' | 'Special';
  dateUnlocked?: string;
  progress?: {
    current: number;
    required: number;
  };
}
