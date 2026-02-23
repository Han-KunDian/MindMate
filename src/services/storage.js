import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  EMOTION_RECORDS: '@mindmate_emotion_records',
  CHAT_HISTORY: '@mindmate_chat_history',
  MEDITATION_RECORDS: '@mindmate_meditation_records',
  USER_SETTINGS: '@mindmate_user_settings',
  DAILY_CHECKINS: '@mindmate_daily_checkins',
};

// Emotion Records
export const saveEmotionRecord = async (record) => {
  try {
    const existing = await getEmotionRecords();
    const updated = [record, ...existing];
    await AsyncStorage.setItem(STORAGE_KEYS.EMOTION_RECORDS, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error saving emotion record:', error);
    return false;
  }
};

export const getEmotionRecords = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.EMOTION_RECORDS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting emotion records:', error);
    return [];
  }
};

export const deleteEmotionRecord = async (id) => {
  try {
    const existing = await getEmotionRecords();
    const updated = existing.filter(record => record.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.EMOTION_RECORDS, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error deleting emotion record:', error);
    return false;
  }
};

// Chat History
export const saveChatSession = async (session) => {
  try {
    const existing = await getChatHistory();
    const updated = [session, ...existing];
    await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error saving chat session:', error);
    return false;
  }
};

export const getChatHistory = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};

export const clearChatHistory = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return false;
  }
};

// Meditation Records
export const saveMeditationRecord = async (record) => {
  try {
    const existing = await getMeditationRecords();
    const updated = [record, ...existing];
    await AsyncStorage.setItem(STORAGE_KEYS.MEDITATION_RECORDS, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error saving meditation record:', error);
    return false;
  }
};

export const getMeditationRecords = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MEDITATION_RECORDS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting meditation records:', error);
    return [];
  }
};

// User Settings
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const getSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    return data ? JSON.parse(data) : {
      theme: 'light',
      notifications: true,
      dailyReminder: false,
      reminderTime: '21:00',
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return {};
  }
};

// Daily Check-ins
export const saveCheckin = async (checkin) => {
  try {
    const existing = await getCheckins();
    const today = new Date().toDateString();
    const existingToday = existing.find(c => new Date(c.date).toDateString() === today);
    
    let updated;
    if (existingToday) {
      updated = existing.map(c => 
        new Date(c.date).toDateString() === today ? checkin : c
      );
    } else {
      updated = [checkin, ...existing];
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_CHECKINS, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error saving checkin:', error);
    return false;
  }
};

export const getCheckins = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_CHECKINS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting checkins:', error);
    return [];
  }
};

// Clear all data
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

export default {
  saveEmotionRecord,
  getEmotionRecords,
  deleteEmotionRecord,
  saveChatSession,
  getChatHistory,
  clearChatHistory,
  saveMeditationRecord,
  getMeditationRecords,
  saveSettings,
  getSettings,
  saveCheckin,
  getCheckins,
  clearAllData,
};
