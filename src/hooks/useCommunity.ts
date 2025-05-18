import { useState, useEffect } from 'react';
import { fetchPosts, Post, addComment, likePost, fetchComments } from '../services/community';
import { useIsFocused } from '@react-navigation/native';

const useCommunity = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFocused = useIsFocused();

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'loading time out';
        setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: [...post.likes, 'current-user-id'] } // Will be updated on refresh
          : post
      ));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleAddComment = async (postId: string, comment: string) => {
    try {
      await addComment(postId, comment);
      // Optimistic update
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, commentsCount: post.commentsCount + 1 }
          : post
      ));
      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      return false;
    }
  };

  const getPostComments = async (postId: string) => {
    try {
      return await fetchComments(postId);
    } catch (err) {
      console.error('Error fetching comments:', err);
      return [];
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadPosts();
    }
  }, [isFocused]);

  return { 
    posts, 
    loading, 
    error, 
    refreshPosts: loadPosts,
    likePost: handleLike,
    addComment: handleAddComment,
    getPostComments,
  };
};

export default useCommunity;