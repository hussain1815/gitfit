import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import { RouteProp } from '@react-navigation/native';
import { CommunityStackParamList } from '../../navigation/CommunityStack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useCommunity from '../../hooks/useCommunity';
import CommentSection from '../../components/CommentSection';

type PostDetailScreenRouteProp = RouteProp<CommunityStackParamList, 'PostDetail'>;

interface PostDetailScreenProps {
  route: PostDetailScreenRouteProp;
}

const PostDetailScreen = ({ route }: PostDetailScreenProps) => {
  const { postId } = route.params;
  const { posts, likePost, addComment, getPostComments } = useCommunity();
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const post = posts.find(p => p.id === postId);

  const loadComments = async () => {
    setLoadingComments(true);
    const fetchedComments = await getPostComments(postId);
    setComments(fetchedComments);
    setLoadingComments(false);
  };

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.postContainer}>
        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder}>
            <Icon name="person" size={24} color={colors.white} />
          </View>
          <View>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.userType}>
              {post.userType === 'trainer' ? 'Certified Trainer' : 'Fitness Member'}
            </Text>
          </View>
        </View>

        <Text style={styles.postContent}>{post.content}</Text>

        {post.mediaUrl && (
          <View style={styles.mediaContainer}>
            {post.mediaType === 'image' ? (
              <Image 
                source={{ uri: post.mediaUrl }} 
                style={styles.media} 
                resizeMode="contain"
              />
            ) : (
              <View style={styles.videoPlaceholder}>
                <Icon name="play-circle-outline" size={50} color={colors.primary} />
                <Text style={styles.videoText}>Video Content</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => likePost(post.id)}
          >
            <Icon 
              name={post.likes.includes('current-user-id') ? 'favorite' : 'favorite-border'} 
              size={24} 
              color={post.likes.includes('current-user-id') ? colors.error : colors.text} 
            />
            <Text style={styles.actionText}>{post.likes.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="chat-bubble-outline" size={24} color={colors.text} />
            <Text style={styles.actionText}>{post.commentsCount}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CommentSection
        comments={comments}
        loading={loadingComments}
        onLoadComments={loadComments}
        onSubmitComment={async (comment) => {
          const success = await addComment(post.id, comment);
          if (success) {
            await loadComments();
          }
          return success;
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userName: {
    fontWeight: 'bold',
    color: colors.text,
  },
  userType: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  postContent: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  mediaContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.secondary,
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    marginTop: 8,
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 4,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default PostDetailScreen;