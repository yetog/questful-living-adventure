
import React from "react";
import { Quest } from "@/types/rpg";
import QuestItem from "./QuestItem";
import { Scroll } from "lucide-react";

interface QuestListProps {
  quests: Quest[];
  onComplete: (id: string) => void;
}

const QuestList: React.FC<QuestListProps> = ({ quests, onComplete }) => {
  // Group quests by frequency
  const dailyQuests = quests.filter((quest) => quest.frequency === "Daily");
  const weeklyQuests = quests.filter((quest) => quest.frequency === "Weekly");
  const oneTimeQuests = quests.filter((quest) => quest.frequency === "OneTime");

  return (
    <div className="rpg-card">
      <h3 className="text-xl font-bold text-white mb-4">Quests</h3>

      {dailyQuests.length > 0 && (
        <div className="mb-6">
          <h4 className="font-rpg text-rpg-accent mb-2">Daily Quests</h4>
          <div className="space-y-3">
            {dailyQuests.map((quest) => (
              <QuestItem key={quest.id} quest={quest} onComplete={onComplete} />
            ))}
          </div>
        </div>
      )}

      {weeklyQuests.length > 0 && (
        <div className="mb-6">
          <h4 className="font-rpg text-rpg-accent mb-2">Weekly Quests</h4>
          <div className="space-y-3">
            {weeklyQuests.map((quest) => (
              <QuestItem key={quest.id} quest={quest} onComplete={onComplete} />
            ))}
          </div>
        </div>
      )}

      {oneTimeQuests.length > 0 && (
        <div>
          <h4 className="font-rpg text-rpg-accent mb-2">One-Time Quests</h4>
          <div className="space-y-3">
            {oneTimeQuests.map((quest) => (
              <QuestItem key={quest.id} quest={quest} onComplete={onComplete} />
            ))}
          </div>
        </div>
      )}

      {quests.length === 0 && (
        <div className="text-center py-12">
          <Scroll className="mx-auto h-12 w-12 text-rpg-light/50 mb-4" />
          <p className="text-rpg-light text-lg mb-2">No quests found</p>
          <p className="text-muted-foreground text-sm">Try adjusting your filters or add a new quest</p>
        </div>
      )}
    </div>
  );
};

export default QuestList;
