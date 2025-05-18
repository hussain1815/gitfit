import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
  Image
} from 'react-native';
import { colors } from '../constants/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import StreakCircle from '../components/StreakCircle';
import useStreak from '../hooks/useStreak';
import PremiumIcon from '../components/PremiumIcon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/AppStack';
import usePremium from '../hooks/usePremium';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserData } from '../hooks/useUserData'; 
import CommunityFooterIcon from '../components/CommunityFooterIcon';


type HomeScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'Home'
>;

const HomeScreen = () => {
  const { streak, days, loading, error } = useStreak(); // Added error to the destructuring
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isPremium, premiumData, refreshStatus } = usePremium();
  const [showProfile, setShowProfile] = useState(false);
  const { userData } = useUserData();
  
  const isTrainer = userData?.userType === 'trainer';

  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) return;

      await firestore().collection('users').doc(userId).update({
        'premium.isPremium': false,
        'premium.plan': firestore.FieldValue.delete(),
        'premium.expiryDate': firestore.FieldValue.delete(),
      });

      await refreshStatus();
      Alert.alert(
        'Subscription Cancelled',
        'Your premium membership has been cancelled',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to cancel subscription. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  useEffect(() => {
    // Automatically update streak after 5 minutes of activity
    const timer = setTimeout(() => {
      // Streak updates automatically via the useStreak hook
    }, 2 * 60 * 1000); // 5 minutes

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your fitness data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading streak data</Text>
        <Text style={styles.errorDetail}>{error}</Text> {/* Removed .message access */}
      </View>
    );
  }


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to GetFit</Text>
        
        <TouchableOpacity 
          style={styles.profileIcon}
         
          onPress={() => setShowProfile(true)}
        >
          <Image 
            source={require('../../assets/images/profile-icon.png')} 
            style={styles.profileImage}
            resizeMode="contain"
  />
        </TouchableOpacity>

        <Modal
          visible={showProfile}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowProfile(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Image 
              source={require('../../assets/images/profile-icon.png')} 
              style={styles.modalProfileImage}
            />
              <Text style={styles.modalEmail}>{auth().currentUser?.email}</Text>
              <Text style={styles.userTypeText}>
                {userData?.userType === 'trainer' ? 'Certified Trainer' : 'Fitness Trainee'}
              </Text>
             
              
              <Text style={styles.modalStatus}>
                Status: {isPremium ? 'Premium Member' : 'Free Member'}
              </Text>
              {isPremium && premiumData?.plan && (
                <Text style={styles.modalPlan}>
                  Plan: {premiumData.plan} (expires {new Date(premiumData.expiryDate).toLocaleDateString()})
                </Text>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowProfile(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Streak Display Section */}
        <View style={styles.streakContainer}>
          <View style={styles.streakHeader}>
            <View style={styles.streakCount}>
              <Text style={styles.streakNumber}>{streak?.currentStreak || 0}</Text>
              <Text style={styles.streakLabel}>day streak</Text>
            </View>
            <View style={styles.streakCount}>
              <Text style={styles.streakNumber}>{streak?.longestStreak || 0}</Text>
              <Text style={styles.streakLabel}>longest streak</Text>
            </View>
          </View>

          {/* Weekly Streak Circles */}
          <View style={styles.weekContainer}>
            {days.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <StreakCircle
                  active={day.active}
                  size={36}
                  isCurrentDay={index === days.length - 1}
                />
                <Text style={styles.dayLabel}>{day.date}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.footer}>
        
          <View style={styles.footerContent}>
            <View style={styles.footerLeft}></View>
              <Text style={styles.footerText}>
                {isPremium 
                  ? `Premium ${isTrainer ? 'Trainer' : 'Member'}`
                  : 'Get Premium Features'
                }
              </Text>

              <PremiumIcon 
                isPremium={isPremium} 
                onSubscribe={() => navigation.navigate('Upgrade')}
              />
          <TouchableOpacity 
              onPress={() => isPremium ? handleUnsubscribe() : navigation.navigate('Upgrade')}
            >
            <Image 
              source={ require('../../assets/images/payment-icon.png')} 
              style={styles.premiumIcon}
            />
          </TouchableOpacity>
          
        </View>
        {isPremium && <CommunityFooterIcon />}
</View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.raisinBlack,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: colors.text,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.mistyRose,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: colors.text,
    textAlign: 'center',
  },
  streakContainer: {
    backgroundColor: colors.moonStone,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  streakCount: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.raisinBlack,
  },
  streakLabel: {
    fontSize: 14,
    color: colors.raisinBlack,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    color: colors.raisinBlack,
    marginTop: 8,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginBottom: 10,
  },
  errorDetail: {
    color: colors.text,
    textAlign: 'center',
  },
  premiumContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  premiumIcon: {
    flex: 1,
    width: 60,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 10,
    
    backgroundColor: colors.chinaRose,
  },
  profileIcon: {
    flex: 1,
    width: 60,
    height: 6,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: colors.chinaRose,
    borderRadius: 30,
    

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  modalRole: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  logoutButton: {
    backgroundColor: colors.error,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  modalStatus: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  modalPlan: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 20,
  },
  footer: {
    width: '100%',
    marginTop: 30,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    color: colors.text,
    fontSize: 14,
  },
  footerLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  },
  userTypeText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 57,
    height: 50,
    borderRadius: 20, 
  },
  modalProfileImage: {
    width: 56,
    height: 60,
    borderRadius: 30,
    marginBottom: 15,
  },
  
});


export default HomeScreen;