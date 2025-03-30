
import React from "react";
import SkillTree from "@/components/SkillTree";
import { useCharacter } from "@/context/CharacterContext";
import { toast } from "@/components/ui/use-toast";

const SkillsPage: React.FC = () => {
  const { skills, levelUpSkill } = useCharacter();

  const handleLevelUp = (skillId: string) => {
    levelUpSkill(skillId);
    toast({
      title: "Skill leveled up!",
      description: "You've upgraded your skill to the next level.",
    });
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 pb-16">
      <h2 className="text-2xl font-bold mb-6">Skill Tree</h2>
      <SkillTree skills={skills} onLevelUp={handleLevelUp} />
    </div>
  );
};

export default SkillsPage;
