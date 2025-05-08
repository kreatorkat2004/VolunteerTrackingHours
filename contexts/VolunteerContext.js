import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';

export const VolunteerContext = createContext();

export const VolunteerProvider = ({ children }) => {
  const [volunteerSessions, setVolunteerSessions] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const { currentUser } = useContext(AuthContext);

  // Load sessions from storage
  useEffect(() => {
    const loadSessions = async () => {
      try {
        if (currentUser) {
          const sessionsData = await AsyncStorage.getItem(`sessions_${currentUser.id}`);
          if (sessionsData) {
            const sessions = JSON.parse(sessionsData);
            setVolunteerSessions(sessions);
            
            // Calculate total hours
            const total = sessions.reduce((sum, session) => sum + session.duration, 0);
            setTotalHours(total);
          }
        } else {
          // Reset if not logged in
          setVolunteerSessions([]);
          setTotalHours(0);
        }
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    };

    loadSessions();
  }, [currentUser]);

  // Save sessions to storage
  const saveSessions = async (sessions) => {
    try {
      if (currentUser) {
        await AsyncStorage.setItem(`sessions_${currentUser.id}`, JSON.stringify(sessions));
      }
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  };

  // Add a new volunteer session
  const addVolunteerSession = (sessionData) => {
    const updatedSessions = [...volunteerSessions, sessionData];
    setVolunteerSessions(updatedSessions);
    
    // Update total hours
    const newTotal = totalHours + sessionData.duration;
    setTotalHours(newTotal);
    
    // Save to storage
    saveSessions(updatedSessions);
    
    return true;
  };

  // Delete a volunteer session
  const deleteVolunteerSession = (sessionId) => {
    const sessionToDelete = volunteerSessions.find(session => session.id === sessionId);
    if (!sessionToDelete) return false;
    
    const updatedSessions = volunteerSessions.filter(session => session.id !== sessionId);
    setVolunteerSessions(updatedSessions);
    
    // Update total hours
    const newTotal = totalHours - sessionToDelete.duration;
    setTotalHours(newTotal);
    
    // Save to storage
    saveSessions(updatedSessions);
    
    return true;
  };

  // Update a volunteer session
  const updateVolunteerSession = (sessionId, updatedData) => {
    const sessionIndex = volunteerSessions.findIndex(session => session.id === sessionId);
    if (sessionIndex === -1) return false;
    
    const oldDuration = volunteerSessions[sessionIndex].duration;
    const updatedSessions = [...volunteerSessions];
    updatedSessions[sessionIndex] = {
      ...updatedSessions[sessionIndex],
      ...updatedData,
    };
    
    setVolunteerSessions(updatedSessions);
    
    // Update total hours
    const newTotal = totalHours - oldDuration + updatedData.duration;
    setTotalHours(newTotal);
    
    // Save to storage
    saveSessions(updatedSessions);
    
    return true;
  };

  return (
    <VolunteerContext.Provider
      value={{
        volunteerSessions,
        totalHours,
        addVolunteerSession,
        deleteVolunteerSession,
        updateVolunteerSession,
      }}
    >
      {children}
    </VolunteerContext.Provider>
  );
};