
import React from "react";
import { Character } from "@/types/rpg";
import { Shield, Heart, Star, Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import { getClassColor } from "@/utils/characterUtils";

interface CharacterModelProps {
  character: Character;
}

const CharacterModel: React.FC<CharacterModelProps> = ({ character }) => {
  const classColor = getClassColor(character.class);

  return (
    <div className="rpg-card overflow-hidden relative h-[400px]">
      {/* Character Name and Level Banner */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center py-3 px-6 bg-rpg-dark/80 backdrop-blur-sm border-b border-rpg-accent/30 z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">{character.name}</h2>
          <span className="text-rpg-light font-rpg">{character.class}</span>
        </div>
        <div className="flex items-center gap-2 bg-rpg-primary/20 px-3 py-1 rounded-full border border-rpg-accent/30">
          <Shield size={16} className="text-rpg-accent" />
          <span className="font-rpg text-rpg-accent">Level {character.level}</span>
        </div>
      </div>

      <div className="flex h-full pt-16">
        {/* Character Avatar/Visual */}
        <div className="w-1/3 flex items-center justify-center p-6">
          <div className={cn(
            "w-56 h-56 rounded-full relative flex items-center justify-center border-4",
            `border-${classColor}`,
            "animate-pulse-slow overflow-hidden bg-gradient-to-b from-rpg-dark to-rpg-secondary"
          )}>
            {character.avatarUrl ? (
              <img 
                src={character.avatarUrl} 
                alt={character.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-7xl font-rpg text-rpg-accent">
                {character.name.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-1 left-0 right-0 h-1/5 bg-gradient-to-t from-rpg-dark to-transparent" />
          </div>
        </div>

        {/* Character Stats */}
        <div className="w-2/3 flex flex-col p-6">
          {/* Character Status */}
          <div className="flex flex-col gap-4 mb-6">
            {/* HP */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-red-500" />
                  <span className="text-rpg-light">Health</span>
                </div>
                <span className="text-white font-medium">{character.hp}/{character.maxHp}</span>
              </div>
              <div className="h-2.5 bg-rpg-dark rounded-full overflow-hidden border border-rpg-accent/20">
                <div 
                  className="h-full bg-gradient-to-r from-red-700 to-red-500" 
                  style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
                />
              </div>
            </div>

            {/* XP */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  <span className="text-rpg-light">Experience</span>
                </div>
                <span className="text-white font-medium">{character.xp}/{character.maxXp}</span>
              </div>
              <div className="h-2.5 bg-rpg-dark rounded-full overflow-hidden border border-rpg-accent/20">
                <div 
                  className="h-full bg-gradient-to-r from-blue-700 to-blue-500" 
                  style={{ width: `${(character.xp / character.maxXp) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Character Stats and Class Description */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-rpg-dark/50 p-4 rounded-md border border-rpg-accent/20">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Swords size={16} className={`text-${classColor}`} />
                <span>Class Abilities</span>
              </h3>
              <p className="text-sm text-rpg-light">
                {character.class === 'Warrior' && "Masters of combat with high endurance and strength. Warriors excel at completing physical challenges."}
                {character.class === 'Mage' && "Specialists in knowledge with high intelligence. Mages excel at completing learning challenges."}
                {character.class === 'Rogue' && "Experts of efficiency with high dexterity. Rogues excel at completing time-management challenges."}
                {character.class === 'Ranger' && "Keen observers with high perception. Rangers excel at completing detail-oriented challenges."}
                {character.class === 'Bard' && "Social masters with high charisma. Bards excel at completing social interaction challenges."}
              </p>
            </div>
            <div className="bg-rpg-dark/50 p-4 rounded-md border border-rpg-accent/20">
              <h3 className="font-medium mb-2">Current Bonuses</h3>
              <ul className="text-sm text-rpg-light">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>+{Math.floor(character.level * 1.5)}% XP gain from {character.class} quests</span>
                </li>
                <li className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>+{character.level}% Coin rewards from all quests</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterModel;
