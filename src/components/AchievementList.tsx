
import React from 'react';
import { Achievement } from '@/types/rpg';
import { 
  Award, Heart, Layers, 
  Shield, Scroll, Star,
  Check, Lock
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';

interface AchievementListProps {
  achievements: Achievement[];
  filter?: 'all' | 'unlocked' | 'locked';
}

const AchievementList: React.FC<AchievementListProps> = ({ 
  achievements,
  filter = 'all' 
}) => {
  // Filter achievements based on the filter prop
  const filteredAchievements = achievements.filter(ach => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return ach.unlocked;
    if (filter === 'locked') return !ach.unlocked;
    return true;
  });
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'award': return <Award className="h-5 w-5" />;
      case 'heart': return <Heart className="h-5 w-5" />;
      case 'layers': return <Layers className="h-5 w-5" />;
      case 'shield': return <Shield className="h-5 w-5" />;
      case 'scroll': return <Scroll className="h-5 w-5" />;
      case 'star': return <Star className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-4">
      {filteredAchievements.map(achievement => (
        <div 
          key={achievement.id}
          className={`p-4 border rounded-lg ${
            achievement.unlocked 
              ? 'border-rpg-accent bg-rpg-accent/10' 
              : 'border-rpg-light/30 bg-rpg-dark/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${
              achievement.unlocked 
                ? 'bg-rpg-accent/20 text-rpg-accent' 
                : 'bg-rpg-light/10 text-rpg-light/50'
            }`}>
              {getIcon(achievement.icon)}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className={`font-bold ${
                  achievement.unlocked ? 'text-white' : 'text-rpg-light/70'
                }`}>
                  {achievement.title}
                </h3>
                
                <div className="text-rpg-light">
                  {achievement.unlocked 
                    ? <Check className="h-4 w-4 text-green-500" /> 
                    : <Lock className="h-4 w-4" />}
                </div>
              </div>
              
              <p className="text-sm text-rpg-light mt-1">
                {achievement.description}
              </p>
              
              {achievement.progress && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-rpg-light mb-1">
                    <span>Progress</span>
                    <span>
                      {achievement.progress.current} / {achievement.progress.required}
                    </span>
                  </div>
                  <Progress 
                    value={(achievement.progress.current / achievement.progress.required) * 100} 
                    className="h-1"
                  />
                </div>
              )}
              
              {achievement.unlocked && achievement.dateUnlocked && (
                <div className="text-xs text-rpg-light/70 mt-2">
                  Unlocked {formatDistanceToNow(new Date(achievement.dateUnlocked))} ago
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementList;
