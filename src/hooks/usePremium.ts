import { useEffect, useState } from 'react';
import { checkPremiumStatus } from '../services/premium';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { UserData } from '../navigation/types';

const usePremium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [premiumData, setPremiumData] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const checkStatus = async () => {
    const userId = auth().currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const status = await checkPremiumStatus(userId);
      setIsPremium(status?.isPremium || false);
      setPremiumData(status || null);
    } catch (error) {
      console.error('Premium status check error:', error);
    } finally {
      setLoading(false);
    }

    const userDoc = await firestore().collection('users').doc(userId).get();
if (userDoc.exists) {
  setUserData(userDoc.data() as UserData);
}

  };

  useEffect(() => {
    checkStatus();
    
    
  }, []);

  return { isPremium, premiumData, loading, refreshStatus: checkStatus };
};

export default usePremium;
