import React from "react";
import { QuestCategory } from "@/types/rpg";
import { Scroll, Map, Heart, Users, Activity, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestFiltersProps {
  activeCategory: QuestCategory | "All";
  onCategoryChange: (category: QuestCategory | "All") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const QuestFilters: React.FC<QuestFiltersProps> = ({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) => {
  const categories: { id: QuestCategory | "All"; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "All", label: "All Quests", icon: <Scroll size={18} />, color: "text-rpg-accent" },
    { id: "Main Story", label: "Main Story", icon: <Map size={18} />, color: "text-yellow-400" },
    { id: "Side Quest", label: "Side Quest", icon: <Scroll size={18} />, color: "text-blue-400" },
    { id: "Personal Growth", label: "Personal", icon: <Heart size={18} />, color: "text-pink-400" },
    { id: "Social", label: "Social", icon: <Users size={18} />, color: "text-purple-400" },
    { id: "Health", label: "Health", icon: <Activity size={18} />, color: "text-green-400" },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rpg-light" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search quests..."
          className="w-full pl-10 pr-4 py-2 bg-rpg-dark border border-rpg-light/30 rounded-lg text-white focus:border-rpg-accent/70 focus:outline-none"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "px-3 py-2 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium",
              activeCategory === category.id
                ? "bg-rpg-accent/20 border-rpg-accent text-rpg-accent"
                : "bg-rpg-dark/50 border-rpg-light/20 text-rpg-light hover:border-rpg-accent/50 hover:text-white"
            )}
          >
            <span className={category.id === activeCategory ? category.color : ""}>
              {category.icon}
            </span>
            <span className="hidden sm:inline">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestFilters;
