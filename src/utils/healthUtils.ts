
import { Character } from '@/types/rpg';
import { saveToStorage, STORAGE_KEYS } from '@/utils/storageUtils';

// Amount of HP regenerated per hour
const HP_REGEN_RATE = 5;

export const calculateHealthRegeneration = (character: Character): Character => {
  // Don't regenerate if HP is already full
  if (character.hp >= character.maxHp) {
    return character;
  }
  
  // Get the last HP update timestamp
  const lastHpUpdate = localStorage.getItem('life-rpg-last-hp-update');
  const lastUpdateTime = lastHpUpdate ? new Date(lastHpUpdate).getTime() : Date.now();
  const currentTime = Date.now();
  
  // Calculate how many hours passed
  const hoursPassed = (currentTime - lastUpdateTime) / (1000 * 60 * 60);
  
  // Calculate how much HP to regenerate
  const regenAmount = Math.floor(hoursPassed * HP_REGEN_RATE);
  
  if (regenAmount > 0) {
    // Update the timestamp
    localStorage.setItem('life-rpg-last-hp-update', new Date().toISOString());
    
    // Return updated character with new HP
    const newHp = Math.min(character.maxHp, character.hp + regenAmount);
    return {
      ...character,
      hp: newHp
    };
  }
  
  return character;
};

export const applyHpLossRate = (missedQuest: string): number => {
  const hpLossRate = localStorage.getItem('rpg-hp-loss-rate') || 'medium';
  
  switch (hpLossRate) {
    case 'low':
      return 5;
    case 'high':
      return 20;
    case 'medium':
    default:
      return 10;
  }
};
