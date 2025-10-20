
import React from "react";
import { Quest } from "@/types/rpg";
import { Check, Calendar, Coins, Zap, Trophy, Map, Scroll, Heart, Users, Activity, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import DeadlineIndicator from "./DeadlineIndicator";
import { Badge } from "@/components/ui/badge";

interface QuestItemProps {
  quest: Quest;
  onComplete: (id: string) => void;
}

const QuestItem: React.FC<QuestItemProps> = ({ quest, onComplete }) => {
  const difficultyColor = () => {
    switch (quest.difficulty) {
      case "Easy":
        return "bg-green-600/20 text-green-400 border-green-500/30";
      case "Medium":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-500/30";
      case "Hard":
        return "bg-orange-600/20 text-orange-400 border-orange-500/30";
      case "Epic":
        return "bg-purple-600/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-blue-600/20 text-blue-400 border-blue-500/30";
    }
  };

  const categoryIcon = () => {
    switch (quest.category) {
      case "Main Story":
        return <Map size={14} className="text-yellow-400" />;
      case "Side Quest":
        return <Scroll size={14} className="text-blue-400" />;
      case "Personal Growth":
        return <Heart size={14} className="text-pink-400" />;
      case "Social":
        return <Users size={14} className="text-purple-400" />;
      case "Health":
        return <Activity size={14} className="text-green-400" />;
      default:
        return <Scroll size={14} />;
    }
  };

  const priorityColor = () => {
    switch (quest.priority) {
      case "Critical":
        return "text-red-400 border-red-500/30";
      case "High":
        return "text-orange-400 border-orange-500/30";
      case "Medium":
        return "text-yellow-400 border-yellow-500/30";
      case "Low":
        return "text-gray-400 border-gray-500/30";
      default:
        return "text-gray-400 border-gray-500/30";
    }
  };

  const frequencyIcon = () => {
    switch (quest.frequency) {
      case "Daily":
        return <Calendar size={14} />;
      case "Weekly":
        return <Calendar size={14} />;
      case "OneTime":
        return <Trophy size={14} />;
      default:
        return <Calendar size={14} />;
    }
  };
  
  const handleComplete = () => {
    if (!quest.completed) {
      onComplete(quest.id);
      
      // Show confetti animation
      const confetti = document.createElement('div');
      confetti.className = 'confetti-container';
      document.body.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 2000);
    }
  };

  return (
    <div 
      className={cn(
        "rpg-border p-3 transition-all duration-300",
        quest.completed ? "opacity-70" : "hover:border-rpg-accent"
      )}
    >
      <div className="flex items-start gap-3">
        <button 
          onClick={handleComplete}
          disabled={quest.completed}
          className={cn(
            "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
            quest.completed 
              ? "border-green-500/50 bg-green-500/20 text-green-400" 
              : "border-rpg-accent/50 hover:border-rpg-accent hover:bg-rpg-accent/10"
          )}
        >
          {quest.completed && <Check size={14} />}
        </button>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4 className={cn(
                "font-medium text-md",
                quest.completed && "line-through"
              )}>
                {quest.title}
              </h4>
              <div className="flex items-center gap-1">
                {categoryIcon()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {quest.priority && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full border flex items-center gap-1",
                  priorityColor()
                )}>
                  <AlertCircle size={10} />
                  {quest.priority}
                </span>
              )}
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full border",
                difficultyColor()
              )}>
                {quest.difficulty}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>

          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <Badge variant="outline" className="flex items-center gap-1 bg-rpg-dark/50">
              {frequencyIcon()}
              <span>{quest.frequency}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 bg-rpg-dark/50">
              <span className="w-2 h-2 rounded-full" style={{ 
                backgroundColor: quest.skillCategory === 'Health' ? '#ef4444' :
                                quest.skillCategory === 'Finance' ? '#22c55e' :
                                quest.skillCategory === 'Learning' ? '#3b82f6' :
                                quest.skillCategory === 'Social' ? '#ec4899' :
                                '#f59e0b'
              }}></span>
              <span>{quest.skillCategory}</span>
            </Badge>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-rpg-accent">
                <Coins size={14} />
                <span>{quest.coinReward}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                <Zap size={14} />
                <span>{quest.xpReward} XP</span>
              </div>
            </div>
          </div>
          
          {quest.dueDate && !quest.completed && (
            <div className="mt-2">
              <DeadlineIndicator dueDate={quest.dueDate} completed={quest.completed} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestItem;
