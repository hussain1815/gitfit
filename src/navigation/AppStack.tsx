import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import UpgradeScreen from '../screens/premium/UpgradeScreen';
import PaymentScreen from '../screens/premium/PaymentScreen';
import PremiumStack from './PremiumStack';
import CommunityStack from './CommunityStack';

export type AppStackParamList = {
  Home: undefined;
  Upgrade: undefined;
  Payment: { plan: string }; 
  Premium: undefined;
  Community: undefined;
  
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator 
    initialRouteName="Home"
    screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Upgrade" component={UpgradeScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Premium" component={PremiumStack} />
      <Stack.Screen name="Community" component={CommunityStack} />
    </Stack.Navigator>
  );
};

export default AppStack;