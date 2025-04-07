
import React, { useState, useEffect } from "react";
import { CharacterProvider, useCharacter } from "@/context/CharacterContext";
import { SettingsProvider } from "@/context/SettingsContext";
import CreateCharacterForm from "@/components/CreateCharacterForm";
import Dashboard from "@/pages/Dashboard";
import QuestsPage from "@/pages/QuestsPage";
import SkillsPage from "@/pages/SkillsPage";
import SettingsPage from "@/pages/SettingsPage";
import AchievementsPage from "@/pages/AchievementsPage";
import Navbar from "@/components/Navbar";

const MainApp = () => {
  const { character, createCharacter, checkQuestDeadlines } = useCharacter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddQuest, setShowAddQuest] = useState(false);

  // Check for missed quests on app load
  useEffect(() => {
    if (character) {
      checkQuestDeadlines();
    }
  }, [character, checkQuestDeadlines]);

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <CreateCharacterForm onCreateCharacter={createCharacter} />
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
      <Navbar 
        character={character} 
        activeTab={activeTab} 
        onChangeTab={handleTabChange} 
      />
      
      <div className="py-4">
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
