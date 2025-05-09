import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { colors } from '../constants/colors';
import FormButton from './FormButton';
import { validateCardNumber, validateExpiryDate, validateCVC } from '../utils/paymentValidation';

interface PaymentCardFormProps {
  onSubmit: (paymentMethod: any) => void;
  loading?: boolean;
}

const PaymentCardForm: React.FC<PaymentCardFormProps> = ({ onSubmit, loading }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [errors, setErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardHolder: ''
  });

  const handleSubmit = () => {
    const newErrors = {
      cardNumber: validateCardNumber(cardNumber) ? '' : 'Invalid card number',
      expiryDate: validateExpiryDate(expiryDate) ? '' : 'Invalid expiry date',
      cvc: validateCVC(cvc) ? '' : 'Invalid CVC',
      cardHolder: cardHolder.trim() ? '' : 'Card holder name required'
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) return;

    onSubmit({
      cardNumber: cardNumber.replace(/\s+/g, ''),
      expiryDate,
      cvc,
      cardHolder,
      cardBrand: getCardBrand(cardNumber)
    });
  };

  const getCardBrand = (number: string): string => {
    // Simplified card brand detection
    const cleaned = number.replace(/\s+/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    return 'unknown';
  };

  const formatCardNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (input: string) => {
    const cleaned = input.replace(/\D/g, '');
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Card Number</Text>
      <TextInput
        style={[styles.input, errors.cardNumber && styles.errorInput]}
        placeholder="1234 5678 9012 3456"
        value={formatCardNumber(cardNumber)}
        onChangeText={text => setCardNumber(text)}
        keyboardType="numeric"
        maxLength={19}
      />
      {errors.cardNumber ? <Text style={styles.errorText}>{errors.cardNumber}</Text> : null}

      <View style={styles.row}>
        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>Expiry Date</Text>
          <TextInput
            style={[styles.input, styles.halfInput, errors.expiryDate && styles.errorInput]}
            placeholder="MM/YY"
            value={formatExpiryDate(expiryDate)}
            onChangeText={text => setExpiryDate(text)}
            keyboardType="numeric"
            maxLength={5}
          />
          {errors.expiryDate ? <Text style={styles.errorText}>{errors.expiryDate}</Text> : null}
        </View>

        <View style={styles.halfInputContainer}>
          <Text style={styles.label}>CVC</Text>
          <TextInput
            style={[styles.input, styles.halfInput, errors.cvc && styles.errorInput]}
            placeholder="123"
            value={cvc}
            onChangeText={text => setCvc(text)}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
          {errors.cvc ? <Text style={styles.errorText}>{errors.cvc}</Text> : null}
        </View>
      </View>

      <Text style={styles.label}>Card Holder Name</Text>
      <TextInput
        style={[styles.input, errors.cardHolder && styles.errorInput]}
        placeholder="John Doe"
        value={cardHolder}
        onChangeText={text => setCardHolder(text)}
        autoCapitalize="words"
      />
      {errors.cardHolder ? <Text style={styles.errorText}>{errors.cardHolder}</Text> : null}

      <FormButton
        title="Confirm Payment"
        onPress={handleSubmit}
        loading={loading}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: colors.mistyRose,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.chinaRose,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  errorInput: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
  halfInput: {
    width: '100%',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: colors.moonStone,
  },
});

export default PaymentCardForm;