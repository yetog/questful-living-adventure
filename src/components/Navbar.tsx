
import React from "react";
import { Character } from "@/types/rpg";
import { Shield, Scroll, Award, Home, Settings, Trophy } from "lucide-react";

interface NavbarProps {
  character: Character | null;
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ character, activeTab, onChangeTab }) => {
  if (!character) return null;

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { id: "quests", label: "Quests", icon: <Scroll size={20} /> },
    { id: "skills", label: "Skills", icon: <Award size={20} /> },
    { id: "achievements", label: "Achievements", icon: <Trophy size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="bg-rpg-secondary border-b border-rpg-accent/30 mb-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-rpg-accent mr-2" />
            <span className="font-rpg text-xl text-white">LiFE RPG</span>
          </div>

          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-rpg-accent border-b-2 border-rpg-accent"
                    : "text-rpg-light hover:text-white"
                }`}
                onClick={() => onChangeTab(tab.id)}
              >
                <span className="hidden md:inline">{tab.label}</span>
                <span>{tab.icon}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-rpg-primary/50 border border-rpg-accent/30 rounded-md">
              <div className="w-6 h-6 rounded-full bg-rpg-dark border border-rpg-accent/50 flex items-center justify-center text-rpg-accent font-rpg text-xs">
                {character.level}
              </div>
              <span className="text-white font-medium">{character.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
