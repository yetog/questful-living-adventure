
import React, { useState } from "react";
import { Quest, QuestDifficulty, QuestFrequency, SkillCategory, QuestCategory, QuestPriority } from "@/types/rpg";
import { cn } from "@/lib/utils";

interface AddQuestFormProps {
  onAddQuest: (quest: Omit<Quest, "id">) => void;
  onCancel: () => void;
}

const AddQuestForm: React.FC<AddQuestFormProps> = ({ onAddQuest, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<QuestFrequency>("Daily");
  const [difficulty, setDifficulty] = useState<QuestDifficulty>("Medium");
  const [skillCategory, setSkillCategory] = useState<SkillCategory>("Health");
  const [category, setCategory] = useState<QuestCategory>("Side Quest");
  const [priority, setPriority] = useState<QuestPriority>("Medium");
  const [dueDate, setDueDate] = useState("");
  
  const difficultyToReward = {
    Easy: { xp: 10, coins: 3 },
    Medium: { xp: 20, coins: 5 },
    Hard: { xp: 30, coins: 10 },
    Epic: { xp: 50, coins: 20 }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newQuest: Omit<Quest, "id"> = {
      title,
      description,
      frequency,
      difficulty,
      completed: false,
      skillCategory,
      category,
      priority,
      xpReward: difficultyToReward[difficulty].xp,
      coinReward: difficultyToReward[difficulty].coins,
      dueDate: dueDate || undefined
    };
    
    onAddQuest(newQuest);
  };

  return (
    <div className="rpg-card">
      <h3 className="text-xl font-bold text-white mb-4">Add New Quest</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-rpg-accent font-rpg mb-1">
              Quest Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white focus:border-rpg-accent/70 focus:outline-none"
              placeholder="Enter quest title"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-rpg-accent font-rpg mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white focus:border-rpg-accent/70 focus:outline-none h-20"
              placeholder="Enter quest description"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-rpg-accent font-rpg mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as QuestFrequency)}
                className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white focus:border-rpg-accent/70 focus:outline-none"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="OneTime">One Time</option>
              </select>
            </div>
            
            <div>
              <label className="block text-rpg-accent font-rpg mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
                className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white focus:border-rpg-accent/70 focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Epic">Epic</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-rpg-accent font-rpg mb-1">
                Quest Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as QuestCategory)}
                className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white focus:border-rpg-accent/70 focus:outline-none"
              >
                <option value="Main Story">Main Story</option>
                <option value="Side Quest">Side Quest</option>
                <option value="Personal Growth">Personal Growth</option>
                <option value="Social">Social</option>
                <option value="Health">Health</option>
              </select>
            </div>
            
            <div>
              <label className="block text-rpg-accent font-rpg mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as QuestPriority)}
                className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white focus:border-rpg-accent/70 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-rpg-accent font-rpg mb-1">
                Skill Category
              </label>
              <select
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value as SkillCategory)}
                className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white focus:border-rpg-accent/70 focus:outline-none"
              >
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="Learning">Learning</option>
                <option value="Social">Social</option>
                <option value="Career">Career</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-rpg-accent font-rpg mb-1">
                Due Date (Optional)
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white focus:border-rpg-accent/70 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center text-sm mb-2">
              <span className="text-rpg-light">Rewards: </span>
              <span className="ml-2 text-blue-400">{difficultyToReward[difficulty].xp} XP</span>
              <span className="ml-2 text-rpg-accent">{difficultyToReward[difficulty].coins} Coins</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-rpg-light/30 rounded-md text-rpg-light hover:bg-rpg-dark/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-rpg-primary to-rpg-tertiary border border-rpg-accent/50 rounded-md text-white hover:from-rpg-tertiary hover:to-rpg-primary transition-all hover:border-rpg-accent"
            >
              Add Quest
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddQuestForm;
