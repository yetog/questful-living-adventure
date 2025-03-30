
import React, { useState } from "react";
import { CharacterClass } from "@/types/rpg";
import { Shield, Sword, Wand, Compass, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateCharacterFormProps {
  onCreateCharacter: (name: string, characterClass: CharacterClass) => void;
}

const characterClasses: { value: CharacterClass; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: "Warrior",
    label: "Warrior",
    icon: <Sword className="h-6 w-6" />,
    description: "Strong and resilient, warriors excel at physical challenges."
  },
  {
    value: "Mage",
    label: "Mage",
    icon: <Wand className="h-6 w-6" />,
    description: "Intelligent and wise, mages are masters of learning and knowledge."
  },
  {
    value: "Rogue",
    label: "Rogue",
    icon: <Shield className="h-6 w-6" />,
    description: "Agile and adaptable, rogues are skilled at overcoming obstacles."
  },
  {
    value: "Ranger",
    label: "Ranger",
    icon: <Compass className="h-6 w-6" />,
    description: "Patient and observant, rangers excel at tracking long-term goals."
  },
  {
    value: "Bard",
    label: "Bard",
    icon: <Music className="h-6 w-6" />,
    description: "Charismatic and creative, bards are excellent communicators and networkers."
  }
];

const CreateCharacterForm: React.FC<CreateCharacterFormProps> = ({ onCreateCharacter }) => {
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Please enter a character name");
      return;
    }
    
    if (!selectedClass) {
      setError("Please select a character class");
      return;
    }
    
    onCreateCharacter(name, selectedClass);
  };

  return (
    <div className="rpg-card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Create Your Character</h2>
        <p className="text-rpg-light mt-2">Begin your journey by creating your character</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="name" className="block text-rpg-accent font-rpg mb-2">
            Character Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white focus:border-rpg-accent/70 focus:outline-none focus:ring-1 focus:ring-rpg-accent/50"
            placeholder="Enter your character's name"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-rpg-accent font-rpg mb-2">
            Character Class
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {characterClasses.map((charClass) => (
              <div
                key={charClass.value}
                className={cn(
                  "border p-3 rounded-md cursor-pointer transition-all",
                  selectedClass === charClass.value
                    ? "border-rpg-accent bg-rpg-accent/10"
                    : "border-rpg-light/30 hover:border-rpg-light/60"
                )}
                onClick={() => setSelectedClass(charClass.value)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-rpg-accent">{charClass.icon}</div>
                  <div className="font-medium">{charClass.label}</div>
                </div>
                <p className="mt-2 text-xs text-rpg-light">{charClass.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {error && (
          <div className="mb-4 text-red-400 text-sm text-center">{error}</div>
        )}
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-rpg-primary to-rpg-tertiary border border-rpg-accent/50 rounded-md text-white font-medium hover:from-rpg-tertiary hover:to-rpg-primary transition-all hover:border-rpg-accent animate-pulse-glow"
          >
            Begin Your Journey
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCharacterForm;
