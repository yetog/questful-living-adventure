
import React from "react";
import { useCharacter } from "@/context/CharacterContext";
import { useSettings } from "@/context/SettingsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CharacterSettings from "@/components/settings/CharacterSettings";
import GameSettings from "@/components/settings/GameSettings";
import CharacterCustomization from "@/components/settings/CharacterCustomization";

const SettingsPage: React.FC = () => {
  const { character, updateCharacterAvatar } = useCharacter();
  const { 
    darkMode, 
    notifications, 
    hpLossRate, 
    toggleDarkMode, 
    toggleNotifications, 
    setHpLossRate 
  } = useSettings();

  if (!character) return null;

  return (
    <div className="container max-w-4xl mx-auto px-4 pb-16">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <Tabs defaultValue="character" className="w-full">
        <TabsList className="mb-6 bg-rpg-dark/50 border border-rpg-accent/30">
          <TabsTrigger value="character">Character</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="game">Game</TabsTrigger>
        </TabsList>
        <TabsContent value="character" className="rpg-card">
          <CharacterSettings character={character} />
        </TabsContent>
        <TabsContent value="appearance" className="rpg-card">
          <CharacterCustomization 
            character={character} 
            updateAvatar={updateCharacterAvatar} 
          />
        </TabsContent>
        <TabsContent value="game" className="rpg-card">
          <GameSettings 
            darkMode={darkMode}
            notifications={notifications}
            hpLossRate={hpLossRate}
            onDarkModeToggle={toggleDarkMode}
            onNotificationsToggle={toggleNotifications}
            onHpLossRateChange={(e) => setHpLossRate(e.target.value as 'low' | 'medium' | 'high')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
