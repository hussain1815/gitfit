import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import ErrorMessage from '../../components/ErrorMessage';
import { colors } from '../../constants/colors';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading credentials:', error);
      }
    };
    loadCredentials();
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
      general: '',
    };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
    setErrors({ ...errors, general: '' });

    try {
        if (rememberMe) {
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
          } else {
            // Clear saved credentials if "Remember Me" is unchecked
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('password');
          }
    
          await auth().signInWithEmailAndPassword(email, password);
      
      
      // On successful login, you would typically navigate to the main app screen
      // For now, we'll show an alert
      Alert.alert(
        'Login Successful',
        'You have successfully logged in!',
        [
          {
            text: 'OK',
            // In a real app, you would navigate to your main screen here
            // onPress: () => navigation.navigate('Home'),
          },
        ],
      );
    } catch (error: any) {
      let errorMessage = 'An error occurred during login. Please try again.';
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is invalid.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Wrong password. Please try again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'No internet connection. Please check your network.';
      }else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Account temporarily locked.';
      }

      setErrors({
        ...errors,
        general: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrors({
        ...errors,
        email: 'Please enter your email to reset password',
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({
        ...errors,
        email: 'Please enter a valid email address',
      });
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Password Reset Email Sent',
        `We've sent a password reset link to ${email}. Please check your email.`,
      );
    } catch (error: any) {
      let errorMessage = 'Failed to send password reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      }

      setErrors({
        ...errors,
        general: errorMessage,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <ErrorMessage message={errors.general} visible={!!errors.general} />

        <FormInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!errors.email}
        />
        <ErrorMessage message={errors.email} visible={!!errors.email} />

        <FormInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={!!errors.password}
        />
        <ErrorMessage message={errors.password} visible={!!errors.password} />

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <FormButton
          title="Login"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
        />

        <View style={styles.rememberMeContainer}>
         <TouchableOpacity
            style={styles.rememberMeCheckbox}
            onPress={() => setRememberMe(!rememberMe)}>
            <View style={[
                styles.checkbox,
                rememberMe && styles.checkboxChecked
            ]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberMeText}>Remember Me</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: colors.text,
    marginRight: 5,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  rememberMeCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
  },
  rememberMeText: {
    color: colors.text,
  },
});

export default LoginScreen;
