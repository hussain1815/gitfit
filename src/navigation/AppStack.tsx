import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import UpgradeScreen from '../screens/premium/UpgradeScreen';
import PaymentScreen from '../screens/premium/PaymentScreen';
import PremiumStack from './PremiumStack';
import HostSessionScreen from '../screens/live/HostSessionScreen';
import JoinSessionScreen from '../screens/live/JoinSessionScreen';
import LiveSessionScreen from '../screens/live/LiveSessionScreen';

export type AppStackParamList = {
  Home: undefined;
  Upgrade: undefined;
  Payment: { plan: string }; 
  Premium: undefined;
  HostSession: undefined;
  JoinSession: undefined;
  LiveSession: { sessionId: string; isHost: boolean };
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
      <Stack.Screen name="HostSession" component={HostSessionScreen} />
      <Stack.Screen name="JoinSession" component={JoinSessionScreen} />
      <Stack.Screen name="LiveSession" component={LiveSessionScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;