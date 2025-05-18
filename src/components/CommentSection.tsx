import React from 'react';
import { useState } from 'react';
import type { FC } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CommentSectionProps {
  comments: any[];
  loading: boolean;
  onLoadComments: () => void;
  onSubmitComment: (comment: string) => Promise<boolean>;
}

const CommentSection = ({ comments, loading, onLoadComments, onSubmitComment }: CommentSectionProps) => {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    
    setSubmitting(true);
    const success = await onSubmitComment(comment);
    if (success) {
      setComment('');
    }
    setSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.loadCommentsButton}
        onPress={onLoadComments}
        disabled={loading}
      >
        <Text style={styles.loadCommentsText}>
          {loading ? 'Loading...' : `View all comments (${comments.length})`}
        </Text>
      </TouchableOpacity>

      {comments.length > 0 && (
        <FlatList
          data={comments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Text style={styles.commentUser}>{item.userName}</Text>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>
          )}
          style={styles.commentsList}
        />
      )}

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor={colors.placeholder}
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity 
          style={styles.commentButton}
          onPress={handleSubmit}
          disabled={!comment.trim() || submitting}
        >
          <Icon 
            name="send" 
            size={20} 
            color={comment.trim() ? colors.primary : colors.placeholder} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadCommentsButton: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  loadCommentsText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  commentsList: {
    maxHeight: 200,
    marginBottom: 8,
  },
  comment: {
    marginBottom: 12,
  },
  commentUser: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  commentText: {
    color: colors.text,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  commentInput: {
    flex: 1,
    paddingVertical: 8,
    color: colors.text,
  },
  commentButton: {
    padding: 8,
  },
});

export default CommentSection;