import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../contexts/AuthContext';
import { VolunteerContext } from '../../contexts/VolunteerContext';

const ProfileScreen = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const { volunteerSessions, totalHours } = useContext(VolunteerContext);
  
  // Convert age group to display text
  const getAgeGroupText = (ageGroup) => {
    switch (ageGroup) {
      case 'kids':
        return 'Kids (5-10 years)';
      case 'teens':
        return 'Teens (11-15 years)';
      case 'young_adults':
        return 'Young Adults (16-18 years)';
      default:
        return 'Adults (19+ years)';
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout(),
        },
      ]
    );
  };
  
  // Get display stats
  const sessionCount = volunteerSessions.length;
  const avgHoursPerSession = sessionCount > 0
    ? (totalHours / sessionCount).toFixed(1)
    : 0;

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileInitials}>
            {currentUser?.name ? currentUser.name[0].toUpperCase() : 'V'}
          </Text>
        </View>
        <Text style={styles.userName}>{currentUser?.name || 'Volunteer'}</Text>
        <Text style={styles.userAgeGroup}>
          {currentUser?.ageGroup ? getAgeGroupText(currentUser.ageGroup) : 'Volunteer'}
        </Text>
      </View>
      
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="clock-outline" size={28} color="#5271ff" />
          <Text style={styles.statNumber}>{totalHours.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Total Hours</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="calendar-check" size={28} color="#5271ff" />
          <Text style={styles.statNumber}>{sessionCount}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="chart-timeline-variant" size={28} color="#5271ff" />
          <Text style={styles.statNumber}>{avgHoursPerSession}</Text>
          <Text style={styles.statLabel}>Avg Hours</Text>
        </View>
      </View>
      
      {/* Account Details */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Icon name="account" size={20} color="#666" />
              <Text style={styles.infoLabel}>Name</Text>
            </View>
            <Text style={styles.infoValue}>{currentUser?.name || 'Not set'}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Icon name="email" size={20} color="#666" />
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{currentUser?.email || 'Not set'}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Icon name="phone" size={20} color="#666" />
              <Text style={styles.infoLabel}>Phone</Text>
            </View>
            <Text style={styles.infoValue}>{currentUser?.phone || 'Not set'}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Icon name="cake-variant" size={20} color="#666" />
              <Text style={styles.infoLabel}>Age</Text>
            </View>
            <Text style={styles.infoValue}>{currentUser?.age || 'Not set'}</Text>
          </View>
        </View>
      </View>
      
      {/* App Options */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Options</Text>
        
        <TouchableOpacity style={styles.optionButton}>
          <Icon name="account-edit" size={22} color="#5271ff" />
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionButton}>
          <Icon name="file-export" size={22} color="#5271ff" />
          <Text style={styles.optionText}>Export Volunteer History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionButton}>
          <Icon name="bell-outline" size={22} color="#5271ff" />
          <Text style={styles.optionText}>Notification Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionButton}>
          <Icon name="frequently-asked-questions" size={22} color="#5271ff" />
          <Text style={styles.optionText}>Help & FAQ</Text>
        </TouchableOpacity>
      </View>
      
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    backgroundColor: '#5271ff',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  profileInitials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#5271ff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userAgeGroup: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: -30,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  sectionContainer: {
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff5252',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
});

export default ProfileScreen;