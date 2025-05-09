import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../constants/colors';
import { PREMIUM_PLANS, PAYMENT_CURRENCY } from '../../constants/premium';
import PaymentCardForm from '../../components/PaymentCardForm';
import { processPayment } from '../../services/payment';
import { upgradeToPremium } from '../../services/premium';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { PremiumStackParamList } from '../../navigation/PremiumStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type PaymentScreenRouteProp = RouteProp<PremiumStackParamList, 'Payment'>;

interface PaymentScreenProps {
  route: PaymentScreenRouteProp;
}

interface PaymentResult {
    success: boolean;
    transactionId: string;
    amount: number;
    currency: string;
  }

const PaymentScreen = ({ route }: PaymentScreenProps) => {
  const { plan } = route.params;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<PremiumStackParamList>>();

  const handlePayment = async (paymentMethod: any) => {
    try {
      setLoading(true);
      
      // Process payment
      const paymentResult = await processPayment(
        PREMIUM_PLANS[plan as keyof typeof PREMIUM_PLANS].price,
        PAYMENT_CURRENCY,
        paymentMethod
      ) as PaymentResult;;

      if (paymentResult.success) {
        // Upgrade to premium
        await upgradeToPremium(plan, paymentMethod);
        
        Alert.alert(
          'Payment Successful',
          'Your premium membership has been activated!',
          [{ 
            text: 'OK',
            onPress: () => navigation.navigate('Home')
            
            }]
        );
      } else {
        throw new Error('Payment failed');
      }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'There was an error processing your payment. Please try again.';
        Alert.alert(
        'Payment Error',
        errorMessage,
        [{ text: 'OK', onPress: () => {} }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image 
          source={require('../../../assets/images/back-icon.png')}
          style={styles.backImage}
        />
          </TouchableOpacity>
      <Text style={styles.title}>Payment Details</Text>
      <Text style={styles.planText}>
        {PREMIUM_PLANS[plan as keyof typeof PREMIUM_PLANS].name} Plan - Rs.{' '}
        {PREMIUM_PLANS[plan as keyof typeof PREMIUM_PLANS].price}
      </Text>

      <PaymentCardForm onSubmit={handlePayment} loading={loading} />

      <View style={styles.securityInfo}>
        <Text style={styles.securityText}>
          Your payment information is processed securely. We do not store your card details.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    height: 1000,
    backgroundColor: colors.raisinBlack,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.mistyRose,
    marginBottom: 8,
    textAlign: 'center',
  },
  planText: {
    fontSize: 18,
    color: colors.chinaRose,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '500',
  },
  securityInfo: {
    marginTop: 20,
    padding: 12,
    backgroundColor: colors.mistyRose,
    borderRadius: 8,
  },
  securityText: {
    color: colors.text,
    fontSize: 12,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    backgroundColor: colors.chinaRose,
  },
  
  backImage: {
    width: 24, 
    height: 24,
    resizeMode: 'contain',
  },
});

export default PaymentScreen;