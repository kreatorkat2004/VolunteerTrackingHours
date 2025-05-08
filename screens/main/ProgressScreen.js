import React, { useContext, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { VolunteerContext } from '../../contexts/VolunteerContext';
import { AuthContext } from '../../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProgressScreen = () => {
  const { volunteerSessions } = useContext(VolunteerContext);
  const { currentUser } = useContext(AuthContext);
  
  // Award tiers by age group
  const awardTiers = {
    kids: {
      bronze: { min: 26, max: 49 },
      silver: { min: 50, max: 74 },
      gold: { min: 75, max: Infinity },
    },
    teens: {
      bronze: { min: 50, max: 74 },
      silver: { min: 75, max: 99 },
      gold: { min: 100, max: Infinity },
    },
    young_adults: {
      bronze: { min: 100, max: 174 },
      silver: { min: 175, max: 249 },
      gold: { min: 250, max: Infinity },
    },
    adults: {
      bronze: { min: 100, max: 249 },
      silver: { min: 250, max: 499 },
      gold: { min: 500, max: Infinity },
    },
  };

  // Calculate total hours and tier progress
  const { 
    totalHours,
    currentTier,
    nextTierHours,
    nextTier,
    progress,
    ageGroup,
    ageGroupLabel
  } = useMemo(() => {
    // Calculate total hours
    const total = volunteerSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );
    
    // Determine age group and label
    const userAgeGroup = currentUser?.ageGroup || 'adults';
    let ageGroupLabel;
    
    switch (userAgeGroup) {
      case 'kids':
        ageGroupLabel = 'Kids (5-10 years)';
        break;
      case 'teens':
        ageGroupLabel = 'Teens (11-15 years)';
        break;
      case 'young_adults':
        ageGroupLabel = 'Young Adults (16-18 years)';
        break;
      default:
        ageGroupLabel = 'Adults (19+ years)';
        break;
    }
    
    // Determine current tier
    let tier = 'none';
    let nextTier = 'bronze';
    let nextHours = awardTiers[userAgeGroup].bronze.min;
    let tierProgress = 0;
    
    if (total >= awardTiers[userAgeGroup].gold.min) {
      tier = 'gold';
      nextTier = 'completed';
      nextHours = awardTiers[userAgeGroup].gold.min;
      tierProgress = 100;
    } else if (total >= awardTiers[userAgeGroup].silver.min) {
      tier = 'silver';
      nextTier = 'gold';
      nextHours = awardTiers[userAgeGroup].gold.min;
      tierProgress = ((total - awardTiers[userAgeGroup].silver.min) / 
                     (awardTiers[userAgeGroup].gold.min - awardTiers[userAgeGroup].silver.min)) * 100;
    } else if (total >= awardTiers[userAgeGroup].bronze.min) {
      tier = 'bronze';
      nextTier = 'silver';
      nextHours = awardTiers[userAgeGroup].silver.min;
      tierProgress = ((total - awardTiers[userAgeGroup].bronze.min) / 
                     (awardTiers[userAgeGroup].silver.min - awardTiers[userAgeGroup].bronze.min)) * 100;
    } else {
      tierProgress = (total / awardTiers[userAgeGroup].bronze.min) * 100;
    }
    
    return {
      totalHours: total,
      currentTier: tier,
      nextTierHours: nextHours,
      nextTier,
      progress: Math.min(tierProgress, 100),
      ageGroup: userAgeGroup,
      ageGroupLabel
    };
  }, [volunteerSessions, currentUser]);

  // Get tier color
  const getTierColor = (tier) => {
    switch (tier) {
      case 'bronze':
        return '#cd7f32';
      case 'silver':
        return '#c0c0c0';
      case 'gold':
        return '#ffd700';
      default:
        return '#5271ff';
    }
  };

  // Get tier icon
  const getTierIcon = (tier) => {
    switch (tier) {
      case 'bronze':
        return 'medal';
      case 'silver':
        return 'medal';
      case 'gold':
        return 'trophy-award';
      default:
        return 'star-circle-outline';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Award Progress Section */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Presidential Volunteer Service Award</Text>
        <Text style={styles.ageGroupText}>{ageGroupLabel}</Text>
      </View>
      
      {/* Hours Summary */}
      <View style={styles.hoursCard}>
        <View style={styles.hoursContent}>
          <View style={styles.totalHoursCircle}>
            <Text style={styles.totalHoursNumber}>{totalHours.toFixed(1)}</Text>
            <Text style={styles.totalHoursLabel}>HOURS</Text>
          </View>
          
          <View style={styles.tierInfo}>
            <Text style={styles.currentTierLabel}>Current Award Level</Text>
            {currentTier !== 'none' ? (
              <View style={styles.tierBadge}>
                <Icon
                  name={getTierIcon(currentTier)}
                  size={24}
                  color={getTierColor(currentTier)}
                />
                <Text style={[styles.tierText, { color: getTierColor(currentTier) }]}>
                  {currentTier.toUpperCase()}
                </Text>
              </View>
            ) : (
              <Text style={styles.noTierText}>Not yet qualified</Text>
            )}
          </View>
        </View>
      </View>

      {/* Progress to Next Tier */}
      {nextTier !== 'completed' && (
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress to {nextTier.toUpperCase()}</Text>
            <Text style={styles.progressNumbers}>
              {totalHours.toFixed(1)} / {nextTierHours} hours
            </Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          
          <Text style={styles.progressText}>
            {nextTier !== 'bronze' ? 
              `${(nextTierHours - totalHours).toFixed(1)} more hours needed` :
              `${nextTierHours - totalHours.toFixed(1)} hours to qualify for your first award`
            }
          </Text>
        </View>
      )}
      
      {/* Award Tiers Table */}
      <View style={styles.tiersCard}>
        <Text style={styles.tiersTitle}>Award Requirements</Text>
        
        <View style={styles.tierTable}>
          <View style={styles.tierTableHeader}>
            <Text style={[styles.tierTableHeaderText, styles.tierCol]}>Award</Text>
            <Text style={[styles.tierTableHeaderText, styles.hoursCol]}>Hours Required</Text>
          </View>
          
          {/* Bronze Row */}
          <View style={[
            styles.tierTableRow, 
            currentTier === 'bronze' && styles.currentTierRow
          ]}>
            <View style={styles.tierCol}>
              <Icon name="medal" size={20} color="#cd7f32" />
              <Text style={styles.tierTableText}>Bronze</Text>
            </View>
            <Text style={styles.hoursCol}>
              {awardTiers[ageGroup].bronze.min}+ hours
            </Text>
          </View>
          
          {/* Silver Row */}
          <View style={[
            styles.tierTableRow, 
            currentTier === 'silver' && styles.currentTierRow
          ]}>
            <View style={styles.tierCol}>
              <Icon name="medal" size={20} color="#c0c0c0" />
              <Text style={styles.tierTableText}>Silver</Text>
            </View>
            <Text style={styles.hoursCol}>
              {awardTiers[ageGroup].silver.min}+ hours
            </Text>
          </View>
          
          {/* Gold Row */}
          <View style={[
            styles.tierTableRow, 
            currentTier === 'gold' && styles.currentTierRow
          ]}>
            <View style={styles.tierCol}>
              <Icon name="trophy-award" size={20} color="#ffd700" />
              <Text style={styles.tierTableText}>Gold</Text>
            </View>
            <Text style={styles.hoursCol}>
              {awardTiers[ageGroup].gold.min}+ hours
            </Text>
          </View>
        </View>
      </View>
      
      {/* Achievement Unlocked */}
      {currentTier !== 'none' && (
        <View style={[styles.achievementCard, { backgroundColor: getTierColor(currentTier) }]}>
          <Icon name={getTierIcon(currentTier)} size={50} color="#fff" />
          <Text style={styles.achievementTitle}>
            {currentTier.toUpperCase()} Award Achieved!
          </Text>
          <Text style={styles.achievementText}>
            Congratulations on reaching the {currentTier} level!
          </Text>
          
          {nextTier !== 'completed' && (
            <TouchableOpacity style={styles.achievementButton}>
              <Text style={styles.achievementButtonText}>
                Keep going for {nextTier}!
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#5271ff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#5271ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  ageGroupText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  hoursCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  hoursContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalHoursCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#5271ff',
  },
  totalHoursNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5271ff',
  },
  totalHoursLabel: {
    fontSize: 14,
    color: '#5271ff',
    fontWeight: '500',
  },
  tierInfo: {
    flex: 1,
    marginLeft: 20,
  },
  currentTierLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  noTierText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressNumbers: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#5271ff',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  tiersCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tiersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tierTable: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tierTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tierTableHeaderText: {
    fontWeight: 'bold',
    color: '#333',
  },
  tierTableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currentTierRow: {
    backgroundColor: '#f0f4ff',
  },
  tierCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursCol: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
  },
  tierTableText: {
    marginLeft: 8,
    fontSize: 14,
  },
  achievementCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
  },
  achievementTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  achievementText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  achievementButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 5,
  },
  achievementButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ProgressScreen;