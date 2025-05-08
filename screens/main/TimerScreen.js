import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { VolunteerContext } from '../../contexts/VolunteerContext';

const TimerScreen = () => {
  const { addVolunteerSession, volunteerSessions } = useContext(VolunteerContext);
  
  // Clock in/out state
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);
  
  // Manual time entry
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [manualDate, setManualDate] = useState(new Date());
  const [manualStartTime, setManualStartTime] = useState(new Date());
  const [manualEndTime, setManualEndTime] = useState(new Date());
  const [manualDescription, setManualDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle clock in
  const handleClockIn = () => {
    const now = new Date();
    setStartTime(now);
    setIsActive(true);
    
    setTimer(setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000));
  };

  // Handle clock out
  const handleClockOut = () => {
    clearInterval(timer);
    setIsActive(false);
    
    // Calculate duration in hours (convert seconds to hours)
    const durationHours = elapsedTime / 3600;
    
    // Create session data
    const sessionData = {
      id: Date.now().toString(),
      date: format(startTime, 'yyyy-MM-dd'),
      startTime: format(startTime, 'HH:mm:ss'),
      endTime: format(new Date(), 'HH:mm:ss'),
      duration: durationHours,
      description: 'Volunteer Session',
    };
    
    // Add session
    addVolunteerSession(sessionData);
    
    // Reset timer
    setElapsedTime(0);
    setStartTime(null);
    
    Alert.alert(
      'Success',
      `Volunteer session recorded (${durationHours.toFixed(2)} hours)`
    );
  };

  // Open manual time entry modal
  const openManualEntry = () => {
    setManualDate(new Date());
    setManualStartTime(new Date());
    setManualEndTime(new Date());
    setManualDescription('');
    setManualModalVisible(true);
  };

  // Save manual time entry
  const saveManualEntry = () => {
    // Validate end time is after start time
    if (manualEndTime <= manualStartTime) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }
    
    // Calculate duration in milliseconds then convert to hours
    const durationMs = manualEndTime - manualStartTime;
    const durationHours = durationMs / (1000 * 60 * 60);
    
    // Create session data
    const sessionData = {
      id: Date.now().toString(),
      date: format(manualDate, 'yyyy-MM-dd'),
      startTime: format(manualStartTime, 'HH:mm:ss'),
      endTime: format(manualEndTime, 'HH:mm:ss'),
      duration: durationHours,
      description: manualDescription || 'Manual Entry',
    };
    
    // Add session
    addVolunteerSession(sessionData);
    
    setManualModalVisible(false);
    
    Alert.alert(
      'Success',
      `Volunteer session recorded (${durationHours.toFixed(2)} hours)`
    );
  };

  // Handle date/time picker changes
  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowStartTimePicker(false);
      setShowEndTimePicker(false);
    }
    
    if (selectedDate) {
      if (pickerMode === 'date') {
        // Keep the time portion the same, only update the date
        const newDate = new Date(selectedDate);
        setManualDate(newDate);
      } else if (showStartTimePicker) {
        setManualStartTime(selectedDate);
      } else if (showEndTimePicker) {
        setManualEndTime(selectedDate);
      }
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  // Recent sessions (last 5)
  const recentSessions = [...volunteerSessions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerTitle}>Volunteer Timer</Text>
          <Text style={styles.timerDisplay}>{formatTime(elapsedTime)}</Text>
          
          {/* Clock In/Out Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.clockButton,
                isActive ? styles.inactiveButton : styles.activeButton,
              ]}
              onPress={handleClockIn}
              disabled={isActive}
            >
              <Icon name="login" size={24} color="#fff" />
              <Text style={styles.buttonText}>Clock In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.clockButton,
                !isActive ? styles.inactiveButton : styles.activeButton,
              ]}
              onPress={handleClockOut}
              disabled={!isActive}
            >
              <Icon name="logout" size={24} color="#fff" />
              <Text style={styles.buttonText}>Clock Out</Text>
            </TouchableOpacity>
          </View>
          
          {/* Manual Entry Button */}
          <TouchableOpacity
            style={styles.manualEntryButton}
            onPress={openManualEntry}
          >
            <Icon name="pencil-plus" size={20} color="#5271ff" />
            <Text style={styles.manualEntryText}>Manual Time Entry</Text>
          </TouchableOpacity>
        </View>
        
        {/* Recent Sessions */}
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recent Sessions</Text>
          
          {recentSessions.length > 0 ? (
            recentSessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionDate}>{session.date}</Text>
                  <Text style={styles.sessionHours}>
                    {session.duration.toFixed(2)} hrs
                  </Text>
                </View>
                <View style={styles.sessionDetails}>
                  <Text style={styles.sessionTime}>
                    {session.startTime} - {session.endTime}
                  </Text>
                  <Text style={styles.sessionDescription}>
                    {session.description}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noSessions}>No recent sessions</Text>
          )}
        </View>
      </ScrollView>
      
      {/* Manual Entry Modal */}
      <Modal
        visible={manualModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setManualModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Manual Time Entry</Text>
            
            {/* Date Picker */}
            <Text style={styles.modalLabel}>Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setPickerMode('date');
                setShowDatePicker(true);
              }}
            >
              <Text style={styles.dateButtonText}>
                {format(manualDate, 'MMMM dd, yyyy')}
              </Text>
              <Icon name="calendar" size={20} color="#5271ff" />
            </TouchableOpacity>
            
            {/* Start Time */}
            <Text style={styles.modalLabel}>Start Time</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setPickerMode('time');
                setShowStartTimePicker(true);
              }}
            >
              <Text style={styles.dateButtonText}>
                {format(manualStartTime, 'h:mm a')}
              </Text>
              <Icon name="clock-outline" size={20} color="#5271ff" />
            </TouchableOpacity>
            
            {/* End Time */}
            <Text style={styles.modalLabel}>End Time</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setPickerMode('time');
                setShowEndTimePicker(true);
              }}
            >
              <Text style={styles.dateButtonText}>
                {format(manualEndTime, 'h:mm a')}
              </Text>
              <Icon name="clock-outline" size={20} color="#5271ff" />
            </TouchableOpacity>
            
            {/* Description */}
            <Text style={styles.modalLabel}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="What did you do?"
              value={manualDescription}
              onChangeText={setManualDescription}
            />
            
            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setManualModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveManualEntry}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Date/Time Pickers */}
        {(showDatePicker || showStartTimePicker || showEndTimePicker) && (
          <DateTimePicker
            value={
              showDatePicker
                ? manualDate
                : showStartTimePicker
                ? manualStartTime
                : manualEndTime
            }
            mode={pickerMode}
            is24Hour={false}
            display="default"
            onChange={onDateChange}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  timerContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  timerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: '700',
    color: '#5271ff',
    marginBottom: 25,
    fontVariant: ['tabular-nums'],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  clockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    width: '48%',
  },
  activeButton: {
    backgroundColor: '#5271ff',
  },
  inactiveButton: {
    backgroundColor: '#c3c3c3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  manualEntryText: {
    color: '#5271ff',
    fontWeight: '500',
    marginLeft: 5,
  },
  recentContainer: {
    marginTop: 30,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sessionCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#5271ff',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sessionHours: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5271ff',
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionTime: {
    fontSize: 14,
    color: '#666',
  },
  sessionDescription: {
    fontSize: 14,
    color: '#888',
    maxWidth: '60%',
  },
  noSessions: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  descriptionInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '48%',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#5271ff',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});