import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import AuthStack from './navigation/AuthStack';
import MainApp from './navigation/MainApp';
import { AuthProvider } from './contexts/AuthContext';
import { VolunteerProvider } from './contexts/VolunteerContext';

const RootStack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <VolunteerProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Auth" component={AuthStack} />
            <RootStack.Screen name="Main" component={MainApp} />
          </RootStack.Navigator>
        </NavigationContainer>
      </VolunteerProvider>
    </AuthProvider>
  );
}