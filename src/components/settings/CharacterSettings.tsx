
import React from 'react';
import { Character } from '@/types/rpg';

interface CharacterSettingsProps {
  character: Character;
}

const CharacterSettings: React.FC<CharacterSettingsProps> = ({ character }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-rpg-accent font-rpg mb-1">
          Character Name
        </label>
        <input
          type="text"
          value={character.name}
          disabled
          className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white"
        />
        <p className="text-xs text-rpg-light mt-1">Character name cannot be changed</p>
      </div>
      
      <div>
        <label className="block text-rpg-accent font-rpg mb-1">
          Character Class
        </label>
        <input
          type="text"
          value={character.class}
          disabled
          className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white"
        />
        <p className="text-xs text-rpg-light mt-1">Character class cannot be changed</p>
      </div>
    </div>
  );
};

export default CharacterSettings;
