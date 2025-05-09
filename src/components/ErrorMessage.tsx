import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

interface ErrorMessageProps {
  message: string;
  visible?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, visible }) => {
  if (!visible || !message) return null;
  return <Text style={styles.error}>{message}</Text>;
};

const styles = StyleSheet.create({
  error: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 4,
  },
});

export default ErrorMessage;