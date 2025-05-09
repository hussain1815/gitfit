import React, { useState } from 'react';
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
import { signUp, checkEmailExists, initializeUserStreak } from '../../services/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import auth from '@react-native-firebase/auth'; // Add this import
import firestore from '@react-native-firebase/firestore';
import { RadioButton } from 'react-native-paper';

type SignupScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Signup'
>;

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'trainee' | 'trainer'>('trainee');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });

  const navigation = useNavigation<SignupScreenNavigationProp>();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

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
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({ ...errors, general: '' });

    try {
      // Check if email exists first
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setErrors({
          ...errors,
          email: 'Email already in use',
          general: 'Email already in use. Please login or use a different email.',
        });
        setLoading(false);
        return;
      }

      const additionalData = {
        userType,
        createdAt: new Date().toISOString(),
      };

      const userCredential = await signUp(email, password, name, userType);

    await firestore().collection('users').doc(userCredential.user.uid).set({
      name: name,
      email: email,
      isPremium: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
      role: 'trainee'
    });

    await initializeUserStreak(userCredential.user.uid);

      Alert.alert(
        'Account Created',
        'Your account has been created successfully! Please login.',
        [
          {
            text: 'OK',
            onPress: () =>{
              auth().signOut().then(() => {
              }); 
            },
          },
        ],
      );
    } catch (error: any) {
      let errorMessage = 'An error occurred during sign up. Please try again.';
      
      if (error.code === 'auth/network-request-failed') {
        errorMessage = 'No internet connection. Please check your network.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Please login or use a different email.';
      }

      setErrors({
        ...errors,
        general: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>

        <ErrorMessage message={errors.general} visible={!!errors.general} />

        <FormInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          error={!!errors.name}
        />
        <ErrorMessage message={errors.name} visible={!!errors.name} />

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

        <FormInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={!!errors.confirmPassword}
        />
        <ErrorMessage
          message={errors.confirmPassword}
          visible={!!errors.confirmPassword}
        />

<View style={styles.userTypeContainer}>
  <Text style={styles.sectionTitle}>I want to join as:</Text>
  <View style={styles.radioGroup}>
    <View style={styles.radioOption}>
      <RadioButton
        value="trainee"
        status={userType === 'trainee' ? 'checked' : 'unchecked'}
        onPress={() => setUserType('trainee')}
        color={colors.primary}
      />
      <Text style={styles.radioLabel}>Trainee</Text>
    </View>
    <View style={styles.radioOption}>
      <RadioButton
        value="trainer"
        status={userType === 'trainer' ? 'checked' : 'unchecked'}
        onPress={() => setUserType('trainer')}
        color={colors.primary}
      />
      <Text style={styles.radioLabel}>Trainer</Text>
    </View>
  </View>
</View>

        <FormButton
          title="Sign Up"
          onPress={handleSignUp}
          loading={loading}
          disabled={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Login</Text>
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
    marginBottom: 30,
    textAlign: 'center',
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
  userTypeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 8,
    color: colors.text,
  },
});

export default SignupScreen;