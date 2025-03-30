
import { Character, Quest, Skill } from '@/types/rpg';
import { format } from 'date-fns';

// Local storage keys
export const STORAGE_KEYS = {
  CHARACTER: 'life-rpg-character',
  QUESTS: 'life-rpg-quests',
  SKILLS: 'life-rpg-skills',
  LAST_DAILY_RESET: 'life-rpg-last-daily-reset',
  LAST_WEEKLY_RESET: 'life-rpg-last-weekly-reset'
};

// Helper function to get data from local storage
export const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from local storage:`, error);
    return defaultValue;
  }
};

// Helper function to save data to local storage
export const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to local storage:`, error);
  }
};

// XP calculation helper
export const calculateXpForLevel = (level: number): number => {
  return 100 * Math.pow(1.5, level - 1);
};

// Get today's date in yyyy-MM-dd format
export const getTodayFormatted = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};
