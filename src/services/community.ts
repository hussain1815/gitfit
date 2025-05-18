import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { Platform } from 'react-native';

export type Post = {
  id: string;
  userId: string;
  userType: 'trainer' | 'trainee';
  userName: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: string[];
  commentsCount: number;
  createdAt: Date;
};

export const createPost = async (content: string, mediaUri?: string) => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const userDoc = await firestore().collection('users').doc(userId).get();
  if (!userDoc.exists) throw new Error('User data not found');

  const userData = userDoc.data();
  if (!userData) throw new Error('User data not available');
  let mediaUrl, mediaType;

  if (mediaUri) {
    // Upload media to storage
    const fileExtension = mediaUri.split('.').pop();
    const mediaRef = storage().ref(`posts/${userId}/${Date.now()}.${fileExtension}`);
    
    // Handle Android file path prefix
    const uploadUri = Platform.OS === 'android' ? mediaUri.replace('file://', '') : mediaUri;
    
    await mediaRef.putFile(uploadUri);
    mediaUrl = await mediaRef.getDownloadURL();
    mediaType = mediaUri.includes('.mp4') ? 'video' : 'image';
  }

  const postData = {
    userId,
    userType: userData.userType,
    userName: userData.name || 'Anonymous',
    content,
    ...(mediaUrl && { mediaUrl, mediaType }),
    likes: [],
    commentsCount: 0,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };

  const postRef = await firestore().collection('posts').add(postData);
  return { id: postRef.id, ...postData };
};

export const fetchPosts = async (limit = 10) => {
  const snapshot = await firestore()
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  })) as Post[];
};

export const likePost = async (postId: string) => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const postRef = firestore().collection('posts').doc(postId);
  await postRef.update({
    likes: firestore.FieldValue.arrayUnion(userId),
  });
};

export const addComment = async (postId: string, comment: string) => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');

  const userDoc = await firestore().collection('users').doc(userId).get();
  if (!userDoc.exists) throw new Error('User data not found');

  const userData = userDoc.data();
   if (!userData) throw new Error('User data not available');
  const commentData = {
    userId,
    userName: userData.name,
    userType: userData.userType,
    content: comment,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };

  // Add comment to subcollection
  await firestore()
    .collection('posts')
    .doc(postId)
    .collection('comments')
    .add(commentData);

  // Update comment count
  await firestore()
    .collection('posts')
    .doc(postId)
    .update({
      commentsCount: firestore.FieldValue.increment(1),
    });
};

export const fetchComments = async (postId: string) => {
  const snapshot = await firestore()
    .collection('posts')
    .doc(postId)
    .collection('comments')
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  }));
};