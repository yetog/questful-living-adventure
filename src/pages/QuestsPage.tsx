
import React, { useState, useEffect, useMemo } from "react";
import QuestList from "@/components/QuestList";
import AddQuestForm from "@/components/AddQuestForm";
import QuestFilters from "@/components/QuestFilters";
import { useCharacter } from "@/context/CharacterContext";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Quest, QuestCategory } from "@/types/rpg";

interface QuestsPageProps {
  showAddForm?: boolean;
}

const QuestsPage: React.FC<QuestsPageProps> = ({ showAddForm: initialShowAddForm = false }) => {
  const { quests, completeQuest, addQuest } = useCharacter();
  const [showAddForm, setShowAddForm] = useState(initialShowAddForm);
  const [activeCategory, setActiveCategory] = useState<QuestCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // If the parent component sets showAddForm to true, update our local state
  useEffect(() => {
    setShowAddForm(initialShowAddForm);
  }, [initialShowAddForm]);

  // Filter quests based on category and search
  const filteredQuests = useMemo(() => {
    return quests.filter((quest) => {
      const matchesCategory = activeCategory === "All" || quest.category === activeCategory;
      const matchesSearch = 
        quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [quests, activeCategory, searchQuery]);

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
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Quests</h2>
          <p className="text-sm text-rpg-light mt-1">
            {filteredQuests.length} {filteredQuests.length === 1 ? 'quest' : 'quests'} {activeCategory !== "All" && `in ${activeCategory}`}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-3 py-2 md:px-4 md:py-2 bg-rpg-accent/20 text-rpg-accent rounded-lg hover:bg-rpg-accent/30 transition-colors flex items-center gap-2 font-medium border border-rpg-accent/30"
        >
          <Plus size={18} /> 
          <span className="hidden sm:inline">Add Quest</span>
        </button>
      </div>

      {showAddForm ? (
        <AddQuestForm
          onAddQuest={handleAddQuest}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <>
          <QuestFilters
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <QuestList quests={filteredQuests} onComplete={handleCompleteQuest} />
        </>
      )}
    </div>
  );
};

export default QuestsPage;
