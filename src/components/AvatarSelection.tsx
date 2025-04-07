
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, Upload } from "lucide-react";

const DEFAULT_AVATARS = [
  "/avatars/warrior.png",
  "/avatars/mage.png",
  "/avatars/rogue.png",
  "/avatars/ranger.png",
  "/avatars/bard.png",
];

interface AvatarSelectionProps {
  currentAvatarUrl?: string;
  characterName: string;
  onSelect: (url: string) => void;
}

const AvatarSelection: React.FC<AvatarSelectionProps> = ({
  currentAvatarUrl,
  characterName,
  onSelect,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(
    currentAvatarUrl
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>("");

  const handleAvatarSelect = (url: string) => {
    setSelectedAvatar(url);
    onSelect(url);
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAvatarUrl) {
      handleAvatarSelect(customAvatarUrl);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Choose Avatar</h3>

      <div className="grid grid-cols-5 gap-3">
        {DEFAULT_AVATARS.map((avatarUrl, index) => (
          <div
            key={index}
            className={`relative cursor-pointer rounded-full p-1 ${
              selectedAvatar === avatarUrl
                ? "bg-rpg-accent/50 ring-2 ring-rpg-accent"
                : "hover:bg-rpg-dark/50"
            }`}
            onClick={() => handleAvatarSelect(avatarUrl)}
          >
            <Avatar className="h-16 w-16 border-2 border-rpg-accent/30">
              <AvatarImage src={avatarUrl} alt={`Avatar option ${index + 1}`} />
              <AvatarFallback className="bg-rpg-dark text-rpg-accent">
                {characterName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {selectedAvatar === avatarUrl && (
              <div className="absolute bottom-0 right-0 rounded-full bg-rpg-accent p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-rpg-accent/30 pt-4">
        <h4 className="text-sm font-medium text-white">Custom Avatar URL</h4>
        <form onSubmit={handleCustomUrlSubmit} className="mt-2 flex gap-2">
          <input
            type="text"
            value={customAvatarUrl}
            onChange={(e) => setCustomAvatarUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-1 rounded bg-rpg-dark/70 p-2 text-white outline-none ring-rpg-accent/50 focus:ring-2"
          />
          <Button
            type="submit"
            className="flex items-center gap-1 bg-rpg-accent/20 text-rpg-accent hover:bg-rpg-accent/30"
            disabled={!customAvatarUrl}
          >
            <Upload size={16} /> Use
          </Button>
        </form>
      </div>

      {selectedAvatar && (
        <div className="mt-4 rounded border border-rpg-accent/30 bg-rpg-dark/50 p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedAvatar} alt="Selected avatar" />
              <AvatarFallback className="bg-rpg-dark text-rpg-accent">
                {characterName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-rpg-light">
              Avatar selected successfully
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarSelection;
