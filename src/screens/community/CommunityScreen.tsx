import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../constants/colors';
import useCommunity from '../../hooks/useCommunity';
import PostCard from '../../components/PostCard';
import CreatePostModal from '../../components/CreatePostModal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommunityStackParamList } from '../../navigation/CommunityStack';

type CommunityScreenNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'Community'
>;

const CommunityScreen = () => {
  const { posts, loading, error, refreshPosts, likePost } = useCommunity();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<CommunityScreenNavigationProp>();

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  return (
    <View style={styles.container}>
      <CreatePostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onPostCreated={refreshPosts}
      />

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Premium Community</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : loading ? (
        <Text style={styles.loadingText}>Loading posts...</Text>
      ) : posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="people-outline" size={60} color={colors.border} />
          <Text style={styles.emptyText}>No posts yet</Text>
          <Text style={styles.emptySubtext}>Be the first to share something!</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PostCard 
              post={item} 
              onLike={likePost} 
              onPress={() => handlePostPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={refreshPosts}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
    opacity: 0.7,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    margin: 20,
  },
  loadingText: {
    textAlign: 'center',
    margin: 20,
    color: colors.text,
  },
});

export default CommunityScreen;