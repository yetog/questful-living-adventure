
import React, { useState } from "react";
import { CharacterProvider, useCharacter } from "@/context/CharacterContext";
import CreateCharacterForm from "@/components/CreateCharacterForm";
import Dashboard from "@/pages/Dashboard";
import QuestsPage from "@/pages/QuestsPage";
import SkillsPage from "@/pages/SkillsPage";
import SettingsPage from "@/pages/SettingsPage";
import Navbar from "@/components/Navbar";

const MainApp = () => {
  const { character, createCharacter } = useCharacter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddQuest, setShowAddQuest] = useState(false);

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
        {activeTab === "quests" && <QuestsPage />}
        {activeTab === "skills" && <SkillsPage />}
        {activeTab === "settings" && <SettingsPage />}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <CharacterProvider>
      <MainApp />
    </CharacterProvider>
  );
};

export default Index;
