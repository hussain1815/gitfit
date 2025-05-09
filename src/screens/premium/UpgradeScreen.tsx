import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
 } from 'react-native';
import { colors } from '../../constants/colors';
import { PREMIUM_PLANS } from '../../constants/premium';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PremiumStackParamList } from '../../navigation/PremiumStack';

type UpgradeScreenNavigationProp = NativeStackNavigationProp<
  PremiumStackParamList,
  'Upgrade'
>;

const UpgradeScreen = () => {
  const navigation = useNavigation<UpgradeScreenNavigationProp>();
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');

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

      <Text style={styles.title}>Upgrade to Premium</Text>
      <Text style={styles.subtitle}>Get access to exclusive features</Text>

      <View style={styles.plansContainer}>
        {Object.entries(PREMIUM_PLANS).map(([key, plan]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.planCard,
              selectedPlan === key && styles.selectedPlanCard
            ]}
            onPress={() => setSelectedPlan(key)}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>Rs. {plan.price}</Text>
              {selectedPlan === key && (
                <View style={styles.selectedIndicator}>
                  <Icon name="check" size={20} color="white" />
                </View>
              )}
            </View>
            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon name="check-circle" size={18} color={colors.primary} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate('Payment', { plan: selectedPlan })}
      >
        <Text style={styles.continueButtonText}>Continue to Payment</Text>
        <Icon name="arrow-forward" size={20} color="white" />
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.mistyRose,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.chinaRose,
    marginBottom: 30,
    textAlign: 'center',
  },
  plansContainer: {
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.moonStone,
  },
  selectedPlanCard: {
    borderColor: colors.mistyRose,
    borderWidth: 3,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  selectedIndicator: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuresContainer: {
    marginLeft: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    color: colors.text,
  },
  continueButton: {
    backgroundColor: colors.chinaRose,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
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

export default UpgradeScreen;