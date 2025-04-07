
import { useState, useEffect } from 'react';
import { Character } from '@/types/rpg';
import { calculateHealthRegeneration } from '@/utils/healthUtils';
import { saveToStorage, STORAGE_KEYS } from '@/utils/storageUtils';

export const useHealthSystem = (
  character: Character | null,
  setCharacter: (character: Character) => void
) => {
  // Check and apply HP regeneration every minute
  useEffect(() => {
    if (!character) return;
    
    const checkHealthRegen = () => {
      if (character) {
        const updatedCharacter = calculateHealthRegeneration(character);
        
        // Only update if HP has changed
        if (updatedCharacter.hp !== character.hp) {
          setCharacter(updatedCharacter);
          saveToStorage(STORAGE_KEYS.CHARACTER, updatedCharacter);
        }
      }
    };
    
    // Run once on mount
    checkHealthRegen();
    
    // Set interval to check regularly
    const interval = setInterval(checkHealthRegen, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [character, setCharacter]);
  
  // Function to manually apply HP loss
  const applyHpLoss = (amount: number) => {
    if (!character) return;
    
    const newHp = Math.max(0, character.hp - amount);
    const updatedCharacter = {
      ...character,
      hp: newHp
    };
    
    setCharacter(updatedCharacter);
    saveToStorage(STORAGE_KEYS.CHARACTER, updatedCharacter);
    
    // Update last HP update time
    localStorage.setItem('life-rpg-last-hp-update', new Date().toISOString());
    
    return updatedCharacter;
  };
  
  return {
    applyHpLoss
  };
};
