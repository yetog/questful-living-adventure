
import React from "react";
import { useCharacter } from "@/context/CharacterContext";
import CharacterCard from "@/components/CharacterCard";
import QuestList from "@/components/QuestList";
import SkillTree from "@/components/SkillTree";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  onAddQuestClick?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAddQuestClick }) => {
  const { character, quests, skills, completeQuest, levelUpSkill } = useCharacter();
  const navigate = useNavigate();

  if (!character) return null;

  // Get today's quests (daily quests and incomplete quests)
  const todaysQuests = quests.filter(
    (quest) => quest.frequency === "Daily" || !quest.completed
  ).slice(0, 5);

  // Get top skills
  const topSkills = [...skills]
    .sort((a, b) => b.level - a.level)
    .slice(0, 3);

  const handleCompleteQuest = (id: string) => {
    completeQuest(id);
    toast({
      title: "Quest completed!",
      description: "You've gained XP and coins for your effort.",
    });
  };

  const handleAddQuest = () => {
    if (onAddQuestClick) {
      onAddQuestClick();
    } else {
      // Navigate to the quests page if no callback is provided
      navigate('/quests');
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <CharacterCard character={character} />

          <div className="rpg-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Top Skills</h3>
              <button
                onClick={() => navigate('/skills')}
                className="text-sm text-rpg-accent hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {topSkills.map((skill) => (
                <div key={skill.id} className="p-3 border border-rpg-accent/30 rounded-md bg-rpg-dark/50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                    <span className="font-rpg text-rpg-accent">Lv. {skill.level}</span>
                  </div>
                  <div className="text-sm text-rpg-light mt-1">{skill.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="rpg-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Active Quests</h3>
              <button
                onClick={handleAddQuest}
                className="px-3 py-1.5 bg-rpg-accent/20 text-rpg-accent rounded-md hover:bg-rpg-accent/30 transition-colors flex items-center gap-1"
              >
                <Plus size={16} /> Add Quest
              </button>
            </div>

            {todaysQuests.length > 0 ? (
              <div className="space-y-3">
                {todaysQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="p-3 border border-rpg-accent/30 rounded-md bg-rpg-dark/50 hover:bg-rpg-dark/70 transition-colors cursor-pointer"
                    onClick={() => !quest.completed && handleCompleteQuest(quest.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 w-5 h-5 flex-shrink-0 rounded-full border ${
                          quest.completed
                            ? "border-green-500 bg-green-500/20"
                            : "border-rpg-accent/50"
                        }`}
                      />
                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            quest.completed && "line-through text-rpg-light"
                          }`}
                        >
                          {quest.title}
                        </div>
                        <div className="text-sm text-rpg-light mt-0.5">
                          {quest.xpReward} XP • {quest.coinReward} Coins
                        </div>
                      </div>
                      <div
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          quest.difficulty === "Easy"
                            ? "bg-green-500/20 text-green-400"
                            : quest.difficulty === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : quest.difficulty === "Hard"
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {quest.difficulty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-rpg-light">No active quests</p>
                <button
                  onClick={handleAddQuest}
                  className="mt-4 px-4 py-2 bg-rpg-accent/20 text-rpg-accent rounded-md hover:bg-rpg-accent/30 transition-colors"
                >
                  Create Your First Quest
                </button>
              </div>
            )}
          </div>

          <div className="rpg-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Skill Progress</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.slice(0, 4).map((skill) => (
                <div key={skill.id} className="p-3 border border-rpg-accent/30 rounded-md bg-rpg-dark/50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                    <span className="font-rpg text-rpg-accent">Lv. {skill.level}</span>
                  </div>
                  <div className="mt-2 h-2 bg-rpg-light/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rpg-accent"
                      style={{
                        width: `${Math.min(
                          100,
                          (skill.currentXp / skill.xpRequired) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1 text-xs">
                    <span className="text-rpg-light">
                      {skill.currentXp}/{skill.xpRequired} XP
                    </span>
                    <button
                      onClick={() => levelUpSkill(skill.id)}
                      className="text-rpg-accent hover:underline"
                      disabled={skill.level >= skill.maxLevel}
                    >
                      Level Up
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
