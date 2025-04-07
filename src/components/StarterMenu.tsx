
import React from "react";
import { Button } from "@/components/ui/button";
import { Character } from "@/types/rpg";

interface StarterMenuProps {
  onStartNewCharacter: () => void;
  onContinueGame: () => void;
  savedCharacter: Character | null;
}

const StarterMenu: React.FC<StarterMenuProps> = ({
  onStartNewCharacter,
  onContinueGame,
  savedCharacter,
}) => {
  return (
    <div className="flex flex-col items-center justify-center max-w-md w-full mx-auto p-6">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rpg-primary to-rpg-accent bg-clip-text text-transparent mb-4">
          LiFE RPG
        </h1>
        <p className="text-xl text-rpg-light">Quest for Meaning</p>
      </div>

      <div className="w-full space-y-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <Button
          onClick={onStartNewCharacter}
          className="w-full py-6 text-lg bg-gradient-to-r from-rpg-primary to-rpg-tertiary border border-rpg-accent/50 hover:from-rpg-tertiary hover:to-rpg-primary transition-all hover:border-rpg-accent"
        >
          Start New Adventure
        </Button>

        {savedCharacter && (
          <Button
            onClick={onContinueGame}
            variant="outline"
            className="w-full py-6 text-lg border border-rpg-light/30 hover:border-rpg-accent/70 hover:bg-rpg-accent/10"
          >
            Continue as {savedCharacter.name}
            <span className="ml-2 text-sm text-rpg-light">
              (Level {savedCharacter.level} {savedCharacter.class})
            </span>
          </Button>
        )}
      </div>

      <div className="mt-10 text-center text-sm text-rpg-light animate-fade-in" style={{ animationDelay: "400ms" }}>
        <p>Transform your everyday tasks into an epic adventure</p>
      </div>
    </div>
  );
};

export default StarterMenu;
