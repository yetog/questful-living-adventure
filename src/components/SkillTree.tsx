
import React from "react";
import { Skill, SkillCategory } from "@/types/rpg";
import { cn } from "@/lib/utils";
import StatusBar from "./StatusBar";

interface SkillTreeProps {
  skills: Skill[];
  onLevelUp: (skillId: string) => void;
}

const SkillTree: React.FC<SkillTreeProps> = ({ skills, onLevelUp }) => {
  const categories: SkillCategory[] = ['Health', 'Finance', 'Learning', 'Social', 'Career'];

  const getCategoryColor = (category: SkillCategory) => {
    switch (category) {
      case 'Health':
        return 'from-red-700/30 to-red-600/10 border-red-500/30';
      case 'Finance':
        return 'from-green-700/30 to-green-600/10 border-green-500/30';
      case 'Learning':
        return 'from-blue-700/30 to-blue-600/10 border-blue-500/30';
      case 'Social':
        return 'from-pink-700/30 to-pink-600/10 border-pink-500/30';
      case 'Career':
        return 'from-amber-700/30 to-amber-600/10 border-amber-500/30';
      default:
        return 'from-gray-700/30 to-gray-600/10 border-gray-500/30';
    }
  };

  return (
    <div className="rpg-card">
      <h3 className="text-xl font-bold text-white mb-4">Skill Tree</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div 
            key={category}
            className={cn(
              "border rounded-md p-3 bg-gradient-to-b",
              getCategoryColor(category)
            )}
          >
            <h4 className="font-rpg text-white mb-2">{category}</h4>
            
            <div className="space-y-3">
              {skills
                .filter(skill => skill.category === category)
                .map(skill => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs font-rpg text-rpg-accent">
                        Lv. {skill.level}/{skill.maxLevel}
                      </span>
                    </div>
                    
                    <StatusBar
                      current={skill.currentXp}
                      max={skill.xpRequired}
                      type="xp"
                      showText={false}
                      className="mb-1"
                    />
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">{skill.currentXp}/{skill.xpRequired} XP</span>
                      
                      {skill.level < skill.maxLevel && (
                        <button
                          onClick={() => onLevelUp(skill.id)}
                          className="px-2 py-1 text-xs bg-rpg-accent/20 text-rpg-accent rounded hover:bg-rpg-accent/30 transition-colors"
                        >
                          Level Up
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillTree;
