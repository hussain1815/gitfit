import { useEffect, useState } from 'react';
import { getStreakData, updateStreak } from '../services/streak';
import auth from '@react-native-firebase/auth';
import { format, subDays, differenceInDays, parseISO } from 'date-fns';

const useStreak = () => {
  const [streak, setStreak] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<{ date: string; active: boolean }[]>([]);

  const loadStreak = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = auth().currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const streakData = await getStreakData(userId);
      setStreak(streakData);

      // Prepare last 7 days data
      const daysArray = [];
      const today = new Date();
      const lastActiveDate = streakData?.lastActiveDate ? parseISO(streakData.lastActiveDate) : today;
      const streakLength = streakData?.currentStreak || 0;
      
      for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        // Check if this date is within the current streak period
        const daysSinceActive = differenceInDays(today, date);
        const isInStreakPeriod = daysSinceActive < streakLength;
        
        // Check if this date is marked in history or is part of current streak
        const isActive = streakData?.history?.[dateStr] || 
                        (isInStreakPeriod && daysSinceActive >= 0);
        
        daysArray.push({
          date: format(date, 'EEE'),
          active: isActive,
        });
      }
      
      setDays(daysArray);
    } catch (err: any) {  // Changed to type 'any' to maintain existing behavior
      console.error('Streak loading error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await updateStreak();
        await loadStreak();
      } catch (err: any) {  // Changed to type 'any' to maintain existing behavior
        console.error('Initialization error:', err);
      }
    };
    
    initialize();
    
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) await loadStreak();
    });

    return () => unsubscribe();
  }, []);

  return { streak, days, loading, error };
};

export default useStreak;