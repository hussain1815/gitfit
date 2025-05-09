import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { MIN_ACTIVITY_TIME } from '../constants/streak';
import { format, subDays, isToday, isYesterday, parseISO } from 'date-fns';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  history: Record<string, boolean>;
}

export const initializeStreak = async (userId: string) => {
  try {
    await firestore().collection('streaks').doc(userId).set({
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: new Date().toISOString(),
      history: {},
    });
    return true;
  } catch (error) {
    console.error('Error initializing streak:', error);
    throw error;
  }
};

export const updateStreak = async () => {
  try {
    const userId = auth().currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const streakRef = firestore().collection('streaks').doc(userId);
    const doc = await streakRef.get();
    
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    if (!doc.exists) {
      await streakRef.set({
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today.toISOString(),
        history: {
          [todayStr]: true,
        },
      });
      return;
    }

    const streakData = doc.data() as StreakData; // Add type assertion here
    const lastActiveDate = parseISO(streakData.lastActiveDate);
    
    // Don't update if already updated today
    if (isToday(lastActiveDate)) return;

    const isContinuingStreak = isYesterday(lastActiveDate);
    const newStreak = isContinuingStreak ? streakData.currentStreak + 1 : 1;

    await streakRef.update({
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streakData.longestStreak),
      lastActiveDate: today.toISOString(),
      [`history.${todayStr}`]: true,
    });
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};
export const getStreakData = async (userId: string): Promise<StreakData | null> => {
  try {
    const doc = await firestore().collection('streaks').doc(userId).get();
    return doc.exists ? (doc.data() as StreakData) : null;
  } catch (error) {
    console.error('Error getting streak data:', error);
    throw error;
  }
};