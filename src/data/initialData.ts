
import { Quest, Skill } from '@/types/rpg';

// Initial skills based on categories
export const initialSkills: Skill[] = [
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
export const initialQuests: Quest[] = [
  {
    id: '1',
    title: 'Morning Exercise',
    description: 'Complete a morning workout routine',
    frequency: 'Daily',
    difficulty: 'Medium',
    completed: false,
    skillCategory: 'Health',
    category: 'Health',
    priority: 'Medium',
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
    category: 'Personal Growth',
    priority: 'High',
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
    category: 'Side Quest',
    priority: 'Medium',
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
    category: 'Social',
    priority: 'Low',
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
    category: 'Main Story',
    priority: 'High',
    xpReward: 25,
    coinReward: 8
  }
];
