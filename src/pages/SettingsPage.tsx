
import React from "react";
import { useCharacter } from "@/context/CharacterContext";

const SettingsPage: React.FC = () => {
  const { character } = useCharacter();

  if (!character) return null;

  return (
    <div className="container max-w-4xl mx-auto px-4 pb-16">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="rpg-card">
        <h3 className="text-xl font-bold text-white mb-4">Character Settings</h3>
        
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
        
        <div className="mt-8">
          <h4 className="text-lg font-medium text-white mb-2">Game Settings</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-rpg-light">Enable dark mode theme</div>
              </div>
              <div className="w-12 h-6 bg-rpg-dark rounded-full relative">
                <div className="w-5 h-5 bg-rpg-accent rounded-full absolute right-1 top-0.5"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-rpg-light">Receive quest reminders</div>
              </div>
              <div className="w-12 h-6 bg-rpg-dark rounded-full relative">
                <div className="w-5 h-5 bg-rpg-accent rounded-full absolute left-1 top-0.5"></div>
              </div>
            </div>
            
            <div>
              <label className="block text-rpg-accent font-rpg mb-1">
                HP Loss Rate
              </label>
              <select
                className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white focus:border-rpg-accent/70 focus:outline-none"
                defaultValue="medium"
              >
                <option value="low">Low (5 HP per missed daily)</option>
                <option value="medium">Medium (10 HP per missed daily)</option>
                <option value="high">High (20 HP per missed daily)</option>
              </select>
              <p className="text-xs text-rpg-light mt-1">How much HP you lose when missing daily quests</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button className="px-4 py-2 bg-gradient-to-r from-rpg-primary to-rpg-tertiary border border-rpg-accent/50 rounded-md text-white hover:from-rpg-tertiary hover:to-rpg-primary transition-all hover:border-rpg-accent">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
