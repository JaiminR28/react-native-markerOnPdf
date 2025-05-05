// storageManager.js
import { MMKV } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory mapping from userId to its MMKV instance.
const userStorageMap = {};

// Key used in AsyncStorage to persist the list of user IDs.
const USER_IDS_KEY = 'persistedUserIds';

// Retrieve or create an MMKV instance for the given userId.
export const getUserStorage = (userId) => {
  if (!userStorageMap[userId]) {
    userStorageMap[userId] = new MMKV({
      id: `user-${userId}-storage`,
      // You may add options like encryptionKey, custom path, etc.
    });
  }
  return userStorageMap[userId];
};

// Save the list of userIds in AsyncStorage.
export const persistUserIds = async (userIds) => {
  try {
    await AsyncStorage.setItem(USER_IDS_KEY, JSON.stringify(userIds));
  } catch (error) {
    console.error('Error saving user IDs:', error);
  }
};

// Load persisted userIds from AsyncStorage and reinitialize their MMKV instances.
export const loadUserStorages = async () => {
  try {
    const idsStr = await AsyncStorage.getItem(USER_IDS_KEY);
    if (idsStr) {
      const userIds = JSON.parse(idsStr);
      userIds.forEach((userId) => getUserStorage(userId));
    }
  } catch (error) {
    console.error('Error loading user IDs:', error);
  }
};

// Add a userId to the persisted list (if not already present).
export const addUserId = async (userId) => {
  try {
    const idsStr = await AsyncStorage.getItem(USER_IDS_KEY);
    const userIds = idsStr ? JSON.parse(idsStr) : [];
    if (!userIds.includes(userId)) {
      userIds.push(userId);
      await persistUserIds(userIds);
    }
  } catch (error) {
    console.error('Error adding user ID:', error);
  }
};

// Optionally, remove a user's storage and update the persisted list.
export const removeUserStorage = async (userId) => {
  try {
    if (userStorageMap[userId]) {
      // Optionally, you could clear the storage:
      // userStorageMap[userId].clearAll();
      delete userStorageMap[userId];
    }
    const idsStr = await AsyncStorage.getItem(USER_IDS_KEY);
    let userIds = idsStr ? JSON.parse(idsStr) : [];
    userIds = userIds.filter((id) => id !== userId);
    await persistUserIds(userIds);
  } catch (error) {
    console.error('Error removing user storage:', error);
  }
};
