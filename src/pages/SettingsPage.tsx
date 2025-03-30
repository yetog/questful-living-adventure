
import React from "react";
import { useCharacter } from "@/context/CharacterContext";
import { useSettings } from "@/context/SettingsContext";
import { toast } from "@/components/ui/use-toast";
import CharacterSettings from "@/components/settings/CharacterSettings";
import GameSettings from "@/components/settings/GameSettings";

const SettingsPage: React.FC = () => {
  const { character } = useCharacter();
  const {
    darkMode,
    notifications,
    hpLossRate,
    toggleDarkMode,
    toggleNotifications,
    setHpLossRate,
  } = useSettings();

  if (!character) return null;
  
  const handleHpLossRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHpLossRate(e.target.value as 'low' | 'medium' | 'high');
    
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
        
        <CharacterSettings character={character} />
        
        <div className="mt-8">
          <h4 className="text-lg font-medium text-white mb-2">Game Settings</h4>
          
          <GameSettings 
            darkMode={darkMode} 
            notifications={notifications}
            hpLossRate={hpLossRate}
            onDarkModeToggle={toggleDarkMode}
            onNotificationsToggle={toggleNotifications}
            onHpLossRateChange={handleHpLossRateChange}
          />
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
