
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  darkMode: boolean;
  notifications: boolean;
  hpLossRate: 'low' | 'medium' | 'high';
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  setHpLossRate: (rate: 'low' | 'medium' | 'high') => void;
}

const defaultSettings: SettingsContextType = {
  darkMode: true,
  notifications: false,
  hpLossRate: 'medium',
  toggleDarkMode: () => {},
  toggleNotifications: () => {},
  setHpLossRate: () => {},
};

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

export const useSettings = () => useContext(SettingsContext);

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('rpg-dark-mode') === 'true';
    } catch {
      return true; // Default to dark mode
    }
  });
  
  const [notifications, setNotifications] = useState<boolean>(() => {
    try {
      return localStorage.getItem('rpg-notifications') === 'true';
    } catch {
      return false; // Default to no notifications
    }
  });
  
  const [hpLossRate, setHpLossRate] = useState<'low' | 'medium' | 'high'>(() => {
    try {
      return (localStorage.getItem('rpg-hp-loss-rate') as 'low' | 'medium' | 'high') || 'medium';
    } catch {
      return 'medium'; // Default to medium
    }
  });
  
  useEffect(() => {
    // Apply theme to body element
    if (darkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    
    // Save settings to localStorage
    localStorage.setItem('rpg-dark-mode', darkMode.toString());
    localStorage.setItem('rpg-notifications', notifications.toString());
    localStorage.setItem('rpg-hp-loss-rate', hpLossRate);
  }, [darkMode, notifications, hpLossRate]);
  
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  const toggleNotifications = () => {
    setNotifications(prev => !prev);
    
    if (!notifications) {
      // Request notification permission when user enables notifications
      if ('Notification' in window) {
        Notification.requestPermission();
      }
    }
  };
  
  const changeHpLossRate = (rate: 'low' | 'medium' | 'high') => {
    setHpLossRate(rate);
  };
  
  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        notifications,
        hpLossRate,
        toggleDarkMode,
        toggleNotifications,
        setHpLossRate: changeHpLossRate,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
