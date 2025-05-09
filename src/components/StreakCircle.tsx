import React from 'react';
import { View, StyleSheet } from 'react-native';
import { STREAK_COLORS } from '../constants/streak';

interface StreakCircleProps {
  active: boolean;
  size?: number;
  isCurrentDay?: boolean;
}

const StreakCircle: React.FC<StreakCircleProps> = ({
  active,
  size = 36,
  isCurrentDay = false,
}) => {
  const getCircleColor = () => {
    if (isCurrentDay) return STREAK_COLORS.currentDay;
    return active ? STREAK_COLORS.active : STREAK_COLORS.inactive;
  };

  return (
    <View
      style={[
        styles.circle,
        {
          backgroundColor: getCircleColor(),
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: isCurrentDay ? 2 : 0,
          borderColor: 'white',
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StreakCircle;