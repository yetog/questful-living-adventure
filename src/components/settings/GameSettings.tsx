
import React from 'react';
import { Switch } from "@/components/ui/switch";

interface GameSettingsProps {
  darkMode: boolean;
  notifications: boolean;
  hpLossRate: string;
  onDarkModeToggle: (checked: boolean) => void;
  onNotificationsToggle: (checked: boolean) => void;
  onHpLossRateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({
  darkMode,
  notifications,
  hpLossRate,
  onDarkModeToggle,
  onNotificationsToggle,
  onHpLossRateChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Dark Mode</div>
          <div className="text-sm text-rpg-light">Enable dark mode theme</div>
        </div>
        <Switch
          checked={darkMode}
          onCheckedChange={onDarkModeToggle}
          className="bg-rpg-dark data-[state=checked]:bg-rpg-accent"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Notifications</div>
          <div className="text-sm text-rpg-light">Receive quest reminders</div>
        </div>
        <Switch
          checked={notifications}
          onCheckedChange={onNotificationsToggle}
          className="bg-rpg-dark data-[state=checked]:bg-rpg-accent"
        />
      </div>
      
      <div>
        <label className="block text-rpg-accent font-rpg mb-1">
          HP Loss Rate
        </label>
        <select
          className="w-full p-2 bg-rpg-dark border border-rpg-light/30 rounded-md text-white focus:border-rpg-accent/70 focus:outline-none"
          value={hpLossRate}
          onChange={onHpLossRateChange}
        >
          <option value="low">Low (5 HP per missed daily)</option>
          <option value="medium">Medium (10 HP per missed daily)</option>
          <option value="high">High (20 HP per missed daily)</option>
        </select>
        <p className="text-xs text-rpg-light mt-1">How much HP you lose when missing daily quests</p>
      </div>
    </div>
  );
};

export default GameSettings;
