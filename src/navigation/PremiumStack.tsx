import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UpgradeScreen from '../screens/premium/UpgradeScreen';
import PaymentScreen from '../screens/premium/PaymentScreen';

export type PremiumStackParamList = {
  Upgrade: undefined;
  Payment: { plan: string };
  Home: undefined;
};

const Stack = createNativeStackNavigator<PremiumStackParamList>();

const PremiumStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Upgrade" component={UpgradeScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
};

export default PremiumStack;