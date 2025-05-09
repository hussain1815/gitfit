import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { colors } from '../../constants/colors';
import FormButton from '../../components/FormButton';
import { startLiveSession } from '../../services/live';
import { sendSessionNotification } from '../../services/notification';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LiveStackParamList } from '../../navigation/LiveStack';

type HostScreenNavigationProp = NativeStackNavigationProp<
  LiveStackParamList,
  'HostSession'
>;

const HostSessionScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<HostScreenNavigationProp>();

  const handleStartSession = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a session title');
      return;
    }

    try {
      setLoading(true);
      const session = await startLiveSession(title, description);
      await sendSessionNotification(session.trainerId);
      navigation.navigate('Session', { sessionId: session.id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start live session';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host Live Session</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Session Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={colors.placeholder}
      />
      
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        placeholderTextColor={colors.placeholder}
        multiline
      />
      
      <FormButton
        title="Start Live Session"
        onPress={handleStartSession}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    color: colors.text,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default HostSessionScreen;