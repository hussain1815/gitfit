import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Alert } from 'react-native';
import { colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PremiumIconProps {
    onSubscribe: () => void;
  isPremium?: boolean;
  onUnsubscribe?: () => void;
}

const PremiumIcon: React.FC<PremiumIconProps> = ({
     onSubscribe,
      isPremium, 
      onUnsubscribe
     }) => {
        const handlePress = () => {
            if (isPremium) {
              Alert.alert(
                'Manage Subscription',
                'Do you want to cancel your premium membership?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Unsubscribe',
                    onPress: onUnsubscribe,
                    style: 'destructive',
                  },
                ]
              );
            } else {
              onSubscribe();
            }
          };
  return (

    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
    
      <View style={[styles.iconContainer, isPremium && styles.premiumActive]}>
        <Icon 
          name= 'workspace-premium'
          size={24} 
          color={isPremium ? colors.success : colors.primary} 
        />
      </View>
      <Text style={styles.text}>
        {isPremium ? 'Premium Member' : 'Upgrade to Premium'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  iconContainer: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 50,
    marginBottom: 8,
  },
  premiumActive: {
    backgroundColor: colors.successLight,
  },
  text: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default PremiumIcon;
