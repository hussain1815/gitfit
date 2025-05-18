
import * as React from 'react';
import { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator, View } from 'react-native';
import { colors } from './src/constants/colors';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  

  
  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    try{
      setUser(user);
      if (initializing) setInitializing(false);
    }
    catch (error) {
      console.error('Auth state change error:', error);
      setInitializing(false);
    }
    
    
  };

  useEffect(() => {
    
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; 
    }, [initializing]);
      
    

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
      {user  ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;