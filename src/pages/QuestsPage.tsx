
import React, { useState } from "react";
import QuestList from "@/components/QuestList";
import AddQuestForm from "@/components/AddQuestForm";
import { useCharacter } from "@/context/CharacterContext";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Quest } from "@/types/rpg";

const QuestsPage: React.FC = () => {
  const { quests, completeQuest, addQuest } = useCharacter();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCompleteQuest = (id: string) => {
    completeQuest(id);
    toast({
      title: "Quest completed!",
      description: "You've gained XP and coins for your effort.",
    });
  };

  const handleAddQuest = (quest: Omit<Quest, "id">) => {
    addQuest(quest);
    setShowAddForm(false);
    toast({
      title: "Quest added!",
      description: "Your new quest has been added to your list.",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 pb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quests</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-3 py-1.5 bg-rpg-accent/20 text-rpg-accent rounded-md hover:bg-rpg-accent/30 transition-colors flex items-center gap-1"
        >
          <Plus size={16} /> Add Quest
        </button>
      </div>

      {showAddForm ? (
        <AddQuestForm
          onAddQuest={handleAddQuest}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <QuestList quests={quests} onComplete={handleCompleteQuest} />
      )}
    </div>
  );
};

export default QuestsPage;
