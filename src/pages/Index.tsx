
import React, { useState, useEffect } from "react";
import { CharacterProvider, useCharacter } from "@/context/CharacterContext";
import { SettingsProvider } from "@/context/SettingsContext";
import CreateCharacterForm from "@/components/CreateCharacterForm";
import StarterMenu from "@/components/StarterMenu";
import Dashboard from "@/pages/Dashboard";
import QuestsPage from "@/pages/QuestsPage";
import SkillsPage from "@/pages/SkillsPage";
import SettingsPage from "@/pages/SettingsPage";
import AchievementsPage from "@/pages/AchievementsPage";
import MobileNavbar from "@/components/MobileNavbar";
import { getFromStorage, STORAGE_KEYS } from "@/utils/storageUtils";
import { Character } from "@/types/rpg";

const MainApp = () => {
  const { character, createCharacter, checkQuestDeadlines, loadSavedCharacter } = useCharacter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [savedCharacter, setSavedCharacter] = useState<Character | null>(null);

  // Check for saved character on initial load
  useEffect(() => {
    const storedCharacter = getFromStorage<Character | null>(STORAGE_KEYS.CHARACTER, null);
    console.log("Stored character found:", storedCharacter);
    setSavedCharacter(storedCharacter);
  }, []);

  // Check for missed quests on app load
  useEffect(() => {
    if (character) {
      checkQuestDeadlines();
    }
  }, [character, checkQuestDeadlines]);

  const handleStartNewCharacter = () => {
    setShowCreateForm(true);
  };

  const handleContinueGame = () => {
    // Load the saved character from localStorage
    if (savedCharacter) {
      loadSavedCharacter(savedCharacter);
    }
  };

  if (!character) {
    // If no active character, show the starter menu or create form
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-rpg-dark">
        {showCreateForm ? (
          <CreateCharacterForm onCreateCharacter={createCharacter} />
        ) : (
          <StarterMenu
            onStartNewCharacter={handleStartNewCharacter}
            onContinueGame={handleContinueGame}
            savedCharacter={savedCharacter}
          />
        )}
      </div>
    );
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowAddQuest(false);
  };

  const handleAddQuestClick = () => {
    setActiveTab("quests");
    setShowAddQuest(true);
  };

  return (
    <div className="min-h-screen bg-rpg-dark">
      <MobileNavbar 
        character={character} 
        activeTab={activeTab} 
        onChangeTab={handleTabChange} 
      />
      
      <div className="py-2 md:py-4 px-2 md:px-0">
        {activeTab === "dashboard" && (
          <Dashboard onAddQuestClick={handleAddQuestClick} />
        )}
        {activeTab === "quests" && <QuestsPage showAddForm={showAddQuest} />}
        {activeTab === "skills" && <SkillsPage />}
        {activeTab === "achievements" && <AchievementsPage />}
        {activeTab === "settings" && <SettingsPage />}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <SettingsProvider>
      <CharacterProvider>
        <MainApp />
      </CharacterProvider>
    </SettingsProvider>
  );
};

export default Index;
