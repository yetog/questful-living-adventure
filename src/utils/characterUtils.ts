
import { CharacterClass } from "@/types/rpg";

/**
 * Returns the corresponding color for each character class
 */
export const getClassColor = (characterClass: CharacterClass): string => {
  switch (characterClass) {
    case 'Warrior':
      return 'red-500';
    case 'Mage':
      return 'blue-500';
    case 'Rogue':
      return 'purple-500';
    case 'Ranger':
      return 'green-500';
    case 'Bard':
      return 'yellow-500';
    default:
      return 'rpg-accent';
  }
};
