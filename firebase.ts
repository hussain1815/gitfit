import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9FY5NDBSrFdCWMhD2b8IhwlZ-jFos0nw",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "getfit-12a27",
  storageBucket: "getfit-12a27.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:450600666319:android:be764657d2c5df9a4463ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Get Firestore instance and configure it
const firestoreInstance = require('@react-native-firebase/firestore').default;
firestoreInstance().settings({ persistence: true });

// Enable offline persistence
firestoreInstance()
  .enablePersistence()
  .catch((err: Error) => {
    console.error('Firestore persistence error:', err);
  });

  
 
 
//export { firestoreInstance as firestore };
export default app;