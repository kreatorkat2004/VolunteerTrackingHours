import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to retrieve user data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // This is a mock implementation - in a real app, you'd make an API call
      // For demo purposes, we'll just create a mock user
      const user = {
        id: '1',
        name: 'John Doe',
        email: email,
        age: 16,
        phone: '555-123-4567',
        ageGroup: 'young_adults',
      };
      
      // Save user to storage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setCurrentUser(user);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Sign up function
  const signUp = async (email, password, userProfile) => {
    try {
      // This is a mock implementation - in a real app, you'd make an API call
      const user = {
        id: Date.now().toString(),
        ...userProfile,
      };
      
      // Save user to storage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setCurrentUser(user);
      
      return true;
    } catch (error) {
      console.error('Sign up failed:', error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Remove user data from storage
      await AsyncStorage.removeItem('user');
      
      // Update state
      setCurrentUser(null);
      
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};