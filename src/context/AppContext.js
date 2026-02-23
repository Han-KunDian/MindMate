import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEmotionRecords, getChatHistory, getSettings, getMeditationRecords, saveSettings } from '../services/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [emotionRecords, setEmotionRecords] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [meditationRecords, setMeditationRecords] = useState([]);
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    dailyReminder: false,
    reminderTime: '21:00',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [emotions, chats, meditations, userSettings] = await Promise.all([
        getEmotionRecords(),
        getChatHistory(),
        getMeditationRecords(),
        getSettings(),
      ]);
      
      setEmotionRecords(emotions);
      setChatHistory(chats);
      setMeditationRecords(meditations);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      await saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const refreshData = () => {
    loadData();
  };

  const value = {
    emotionRecords,
    setEmotionRecords,
    chatHistory,
    setChatHistory,
    meditationRecords,
    setMeditationRecords,
    settings,
    updateSettings,
    isLoading,
    refreshData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
