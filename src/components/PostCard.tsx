import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Post } from '../services/community';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onPress: () => void;
}

const PostCard = ({ post, onLike, onPress }: PostCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.userInfo}>
        <View style={styles.avatarPlaceholder}>
          <Icon name="person" size={20} color={colors.white} />
        </View>
        <View>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.userType}>
            {post.userType === 'trainer' ? 'Certified Trainer' : 'Fitness Member'}
          </Text>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.mediaUrl && (
        <View style={styles.mediaContainer}>
          {post.mediaType === 'image' ? (
            <Image 
              source={{ uri: post.mediaUrl }} 
              style={styles.media} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <Icon name="play-circle-outline" size={40} color={colors.primary} />
            </View>
          )}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onLike(post.id)}
        >
          <Icon 
            name={post.likes.includes('current-user-id') ? 'favorite' : 'favorite-border'} 
            size={20} 
            color={post.likes.includes('current-user-id') ? colors.error : colors.text} 
          />
          <Text style={styles.actionText}>{post.likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="chat-bubble-outline" size={20} color={colors.text} />
          <Text style={styles.actionText}>{post.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  content: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  mediaContainer: {
    marginBottom: 12,
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
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
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
});

export default PostCard;