import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Image } from 'react-native';
import { colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { createPost } from '../services/community';
import FormButton from './FormButton';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal = ({ visible, onClose, onPostCreated }: CreatePostModalProps) => {
  const [content, setContent] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChooseFromLibrary = () => {
    ImagePicker.openPicker({
      mediaType: 'any',
      compressImageQuality: 0.8,
      cropping: false,
    })
      .then((response: ImageOrVideo) => {
        if ('path' in response) {
          setMediaUri(response.path);
          setMediaType(response.mime?.includes('video') ? 'video' : 'image');
        }
      })
      .catch((err: Error) => {
        if (err.message !== 'User cancelled image selection') {
          setError('Failed to select media');
        }
      });
  };

  const handleTakePhoto = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      compressImageQuality: 0.8,
      cropping: false,
    })
      .then((response: ImageOrVideo) => {
        if ('path' in response) {
          setMediaUri(response.path);
          setMediaType('image');
        }
      })
      .catch((err: Error) => {
        if (err.message !== 'User cancelled image selection') {
          setError('Failed to take photo');
        }
      });
  };

  const handleSubmit = async () => {
    // Allow posts with just text OR media OR both
    if (!content.trim() && !mediaUri) {
      setError('Please add some text or media to post');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createPost(content, mediaUri || undefined);
      onPostCreated();
      handleClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create post';
      setError(message);
      console.error('Post creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setMediaUri(null);
    setMediaType(null);
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Post</Text>
          <View style={{ width: 24 }} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Share your fitness journey..."
          placeholderTextColor={colors.placeholder}
          multiline
          value={content}
          onChangeText={setContent}
        />

        {mediaUri && (
          <View style={styles.mediaPreview}>
            {mediaType === 'image' ? (
              <Image source={{ uri: mediaUri }} style={styles.mediaImage} />
            ) : (
              <View style={styles.mediaVideo}>
                <Icon name="play-circle-outline" size={50} color={colors.primary} />
              </View>
            )}
            <TouchableOpacity 
              style={styles.removeMedia}
              onPress={() => {
                setMediaUri(null);
                setMediaType(null);
              }}
            >
              <Icon name="close" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.mediaButtons}>
          <TouchableOpacity 
            style={styles.mediaButton}
            onPress={handleChooseFromLibrary}
          >
            <Icon name="photo-library" size={24} color={colors.primary} />
            <Text style={styles.mediaButtonText}>Add Media</Text>
          </TouchableOpacity>
          {mediaUri && (
            <TouchableOpacity 
              style={styles.mediaButton}
              onPress={handleTakePhoto}
            >
              <Icon name="photo-camera" size={24} color={colors.primary} />
              <Text style={styles.mediaButtonText}>Take Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <FormButton
          title="Post"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    marginBottom: 20,
  },
  mediaPreview: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.secondary,
  },
  mediaVideo: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeMedia: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  mediaButton: {
    alignItems: 'center',
    padding: 10,
  },
  mediaButtonText: {
    marginTop: 5,
    color: colors.primary,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 10,
  },
});

export default CreatePostModal;