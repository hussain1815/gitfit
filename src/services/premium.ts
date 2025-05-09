import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';

export const upgradeToPremium = async (planId: string, paymentMethod: any) => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const expiryDate = new Date();
  if (planId === 'monthly') {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  } else {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }

  await firestore().collection('users').doc(userId).update({
    premium: {
      isPremium: true,
      plan: planId,
      expiryDate: expiryDate.toISOString(),
      paymentMethod: {
        last4: paymentMethod.cardNumber.slice(-4),
        brand: paymentMethod.cardBrand
      }
    }
  });
};

export const checkPremiumStatus = async (userId: string) => {
  const doc = await firestore().collection('users').doc(userId).get();
  return doc.exists ? doc.data()?.premium : null;
};