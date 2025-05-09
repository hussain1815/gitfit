import auth from '@react-native-firebase/auth';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { initializeStreak } from './streak';
import firestore from '@react-native-firebase/firestore';

export const signUp = async (
  email: string,
  password: string,
  displayName: string,
  userType: 'trainee' | 'trainer'
): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    await userCredential.user.updateProfile({ displayName });

    await firestore().collection('users').doc(userCredential.user.uid).set({
      email,
      name: displayName,
      userType,
      createdAt: new Date().toISOString(),
    });

    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const methods = await auth().fetchSignInMethodsForEmail(email);
    return methods.length > 0;
  } catch (error) {
    throw error;
  }
};

export const initializeUserStreak = async (userId: string) => {
  try {
    await initializeStreak(userId);
    return true;
  } catch (error) {
    console.error('Error initializing streak:', error);
    return false;
  }
};