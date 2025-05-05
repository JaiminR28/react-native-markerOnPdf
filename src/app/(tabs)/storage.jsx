// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ScrollView } from 'react-native';
import { getUserStorage, addUserId,  loadUserStorages } from '../../storageManger';

export default function App() {
  const [userId, setUserId] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userData, setUserData] = useState('');
  const [retrievedData, setRetrievedData] = useState('');

  useEffect(() => {
    // On app launch, load persisted user IDs and reinitialize storages.
    loadUserStorages();
  }, []);

  // Login by setting the current user and persisting their userId
  const handleLogin = async () => {
    if (userId.trim() === '') return;
    setCurrentUserId(userId);
    await addUserId(userId);
    setUserId(''); // clear the input field after login
  };

  // Logout clears the current user so the login screen is shown
  const handleLogout = () => {
    setCurrentUserId(null);
    setUserData('');
    setRetrievedData('');
  };

  // Save data to the current user's MMKV instance
  const handleSetData = () => {
    if (!currentUserId) return;
    const storage = getUserStorage(currentUserId);
    console.log({storage});
    storage.set('data', userData);
    alert(`Data saved for user ${currentUserId}`);
  };

  // Retrieve stored data from the current user's MMKV instance
  const handleGetData = () => {
    if (!currentUserId) return;
    const storage = getUserStorage(currentUserId);
    const data = storage.getString('data');
    setRetrievedData(data || '');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Multi-User Storage Demo</Text>
      
      {!currentUserId ? (
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter User ID"
            value={userId}
            onChangeText={setUserId}
          />
          <Button title="Login" onPress={handleLogin} />
        </View>
      ) : (
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcome}>Logged in as: {currentUserId}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter data to save"
            value={userData}
            onChangeText={setUserData}
          />
          <Button title="Save Data" onPress={handleSetData} />
          <Button title="Retrieve Data" onPress={handleGetData} />
          <Text style={styles.dataText}>Retrieved Data: {retrievedData}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  loginContainer: {
    alignItems: 'center',
  },
  loggedInContainer: {
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  welcome: {
    fontSize: 18,
    marginBottom: 10,
  },
  dataText: {
    marginTop: 20,
    fontSize: 16,
  },
});
