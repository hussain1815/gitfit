import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface LiveSessionButtonProps {
  onPress: () => void;
  isTrainer: boolean;
  isPremium: boolean;
}

const LiveSessionButton: React.FC<LiveSessionButtonProps> = ({
  onPress,
  isTrainer,
  isPremium,
}) => {
  if (!isPremium) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!isTrainer}
    >
      <View style={styles.iconContainer}>
        <Icon
          name={isTrainer ? 'videocam' : 'video-library'}
          size={24}
          color={colors.white}
        />
      </View>
      <Text style={styles.text}>
        {isTrainer ? 'Go Live' : 'Join Session'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  iconContainer: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    color: colors.text,
  },
});

export default LiveSessionButton;