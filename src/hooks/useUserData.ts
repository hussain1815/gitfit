import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const useUserData = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth().currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(doc => {
        setUserData(doc.data());
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return { userData, loading };
};