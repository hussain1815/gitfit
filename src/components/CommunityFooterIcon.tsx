import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/AppStack';

const CommunityFooterIcon = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => navigation.navigate('Community')}
    >
      <Icon name="people" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginLeft: 20,
  },
});

export default CommunityFooterIcon;