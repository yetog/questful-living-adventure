
import React, { useState } from 'react';
import { Character } from '@/types/rpg';
import AvatarSelection from '@/components/AvatarSelection';
import { toast } from '@/components/ui/use-toast';

interface CharacterCustomizationProps {
  character: Character;
  updateAvatar: (url: string) => void;
}

const CharacterCustomization: React.FC<CharacterCustomizationProps> = ({ 
  character, 
  updateAvatar 
}) => {
  const handleAvatarChange = (url: string) => {
    updateAvatar(url);
    toast({
      title: "Avatar Updated",
      description: "Your character's appearance has been updated",
    });
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Character Appearance</h2>
      <p className="text-rpg-light">Customize how your character looks</p>
      
      <div className="mt-4">
        <AvatarSelection 
          currentAvatarUrl={character.avatarUrl}
          characterName={character.name}
          onSelect={handleAvatarChange}
        />
      </div>
    </div>
  );
};

export default CharacterCustomization;
