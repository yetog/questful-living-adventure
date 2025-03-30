
import React, { useState } from "react";
import { useCharacter } from "@/context/CharacterContext";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

const SettingsPage: React.FC = () => {
  const { character } = useCharacter();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('rpg-dark-mode') === 'true';
    } catch {
      return true; // Default to dark mode
    }
  });
  
  const [notifications, setNotifications] = useState<boolean>(() => {
    try {
      return localStorage.getItem('rpg-notifications') === 'true';
    } catch {
      return false; // Default to no notifications
    }
  });
  
  const [hpLossRate, setHpLossRate] = useState<string>(() => {
    try {
      return localStorage.getItem('rpg-hp-loss-rate') || 'medium';
    } catch {
      return 'medium'; // Default to medium
    }
  });

  if (!character) return null;
  
  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    localStorage.setItem('rpg-dark-mode', checked.toString());
    
    // If we had theme implementation, we would update it here
    
    toast({
      title: "Settings Updated",
      description: `Dark mode ${checked ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem('rpg-notifications', checked.toString());
    
    // If we had notifications implementation, we would update it here
    
    toast({
      title: "Settings Updated",
      description: `Notifications ${checked ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleHpLossRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHpLossRate(e.target.value);
    localStorage.setItem('rpg-hp-loss-rate', e.target.value);
    
    toast({
      title: "Settings Updated",
      description: "HP loss rate updated.",
    });
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

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
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
                className="bg-rpg-dark data-[state=checked]:bg-rpg-accent"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-rpg-light">Receive quest reminders</div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={handleNotificationsToggle}
                className="bg-rpg-dark data-[state=checked]:bg-rpg-accent"
              />
            </div>
            
            <div>
              <label className="block text-rpg-accent font-rpg mb-1">
                HP Loss Rate
              </label>
              <select
                className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white focus:border-rpg-accent/70 focus:outline-none"
                value={hpLossRate}
                onChange={handleHpLossRateChange}
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
          <button 
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-gradient-to-r from-rpg-primary to-rpg-tertiary border border-rpg-accent/50 rounded-md text-white hover:from-rpg-tertiary hover:to-rpg-primary transition-all hover:border-rpg-accent"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
