import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HostSessionScreen from '../screens/live/HostSessionScreen';
import JoinSessionScreen from '../screens/live/JoinSessionScreen';
import SessionScreen from '../screens/live/SessionScreen';

export type LiveStackParamList = {
  HostSession: undefined;
  JoinSession: undefined;
  Session: { sessionId: string };
};

const Stack = createNativeStackNavigator<LiveStackParamList>();

const LiveStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HostSession" component={HostSessionScreen} />
      <Stack.Screen name="JoinSession" component={JoinSessionScreen} />
      <Stack.Screen name="Session" component={SessionScreen} />
    </Stack.Navigator>
  );
};

export default LiveStack;