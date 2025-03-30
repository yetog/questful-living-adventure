
import React from "react";
import { Character } from "@/types/rpg";
import StatusBar from "./StatusBar";
import { Shield, Coins } from "lucide-react";

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <div className="rpg-card relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-rpg-dark/50 px-3 py-1 rounded-bl-md border-b border-l border-rpg-accent/30">
        <div className="text-rpg-accent font-rpg flex items-center gap-1">
          <Shield size={14} className="text-rpg-accent" />
          <span>Level {character.level}</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-20 h-20 rounded-full bg-rpg-dark border-2 border-rpg-accent animate-pulse-glow overflow-hidden">
          {character.avatarUrl ? (
            <img 
              src={character.avatarUrl} 
              alt={character.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-rpg-accent font-rpg text-2xl">
              {character.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">{character.name}</h3>
            <div className="flex items-center gap-1 text-rpg-accent">
              <Coins size={16} />
              <span className="font-rpg">{character.coins}</span>
            </div>
          </div>
          
          <div className="text-rpg-light font-rpg">{character.class}</div>
          
          <div className="space-y-2 mt-4">
            <StatusBar 
              current={character.hp} 
              max={character.maxHp} 
              type="hp" 
              label="HP"
            />
            <StatusBar 
              current={character.xp} 
              max={character.maxXp} 
              type="xp" 
              label="XP"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
