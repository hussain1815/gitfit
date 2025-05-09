import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Platform } from 'react-native';

export const startLiveSession = async (sessionData: {
  title: string;
  description?: string;
  scheduledTime?: Date;
}) => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const sessionRef = firestore().collection('liveSessions').doc();
  
  await sessionRef.set({
    ...sessionData,
    hostId: userId,
    status: 'live',
    startTime: firestore.FieldValue.serverTimestamp(),
    participants: [],
    platform: Platform.OS,
  });

  return sessionRef.id;
};

export const endLiveSession = async (sessionId: string) => {
  await firestore().collection('liveSessions').doc(sessionId).update({
    status: 'ended',
    endTime: firestore.FieldValue.serverTimestamp(),
  });
};

export const joinLiveSession = async (sessionId: string) => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  await firestore()
    .collection('liveSessions')
    .doc(sessionId)
    .update({
      participants: firestore.FieldValue.arrayUnion(userId),
    });
};

export const getLiveSessions = () => {
  return firestore()
    .collection('liveSessions')
    .where('status', '==', 'live')
    .orderBy('startTime', 'desc')
    .limit(20);
};

export const subscribeToSessionUpdates = (
  sessionId: string,
  callback: (session: any) => void
) => {
  return firestore()
    .collection('liveSessions')
    .doc(sessionId)
    .onSnapshot((doc) => {
      if (doc.exists) {
        callback(doc.data());
      }
    });
};