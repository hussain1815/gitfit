import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';
import { colors } from '../constants/colors';

interface FormInputProps extends TextInputProps {
  error?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ error, ...props }) => {
  return (
    <View style={[styles.container, error && styles.errorContainer]}>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.placeholder}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  errorContainer: {
    borderColor: colors.error,
  },
  input: {
    fontSize: 16,
    color: colors.text,
  },
});

export default FormInput;