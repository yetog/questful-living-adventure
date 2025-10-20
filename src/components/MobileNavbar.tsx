import React from "react";
import { Character } from "@/types/rpg";
import { Shield, Scroll, Award, Home, Settings, Trophy, Menu } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface MobileNavbarProps {
  character: Character | null;
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ character, activeTab, onChangeTab }) => {
  const [open, setOpen] = React.useState(false);
  
  if (!character) return null;

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "quests", label: "Quests", icon: Scroll },
    { id: "skills", label: "Skills", icon: Award },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleTabChange = (tab: string) => {
    onChangeTab(tab);
    setOpen(false);
  };

  return (
    <div className="bg-rpg-secondary border-b border-rpg-accent/30 mb-4 md:mb-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 md:h-8 md:w-8 text-rpg-accent" />
            <span className="font-rpg text-lg md:text-xl text-white">LiFE RPG</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
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
                <span>{tab.label}</span>
                <tab.icon size={20} />
              </button>
            ))}
          </div>

          {/* Mobile Navigation Drawer */}
          <div className="md:hidden">
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-rpg-secondary border-rpg-accent/30">
                <DrawerHeader>
                  <DrawerTitle className="text-white font-rpg">Navigation</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-6 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`w-full px-4 py-3 flex items-center gap-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-rpg-accent/20 text-rpg-accent border border-rpg-accent/30"
                          : "text-rpg-light hover:bg-rpg-dark/50"
                      }`}
                      onClick={() => handleTabChange(tab.id)}
                    >
                      <tab.icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Character Info */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-rpg-primary/50 border border-rpg-accent/30 rounded-md">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-rpg-dark border border-rpg-accent/50 flex items-center justify-center text-rpg-accent font-rpg text-xs">
                {character.level}
              </div>
              <span className="text-white font-medium text-sm md:text-base hidden sm:inline">
                {character.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
