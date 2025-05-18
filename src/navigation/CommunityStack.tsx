import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityScreen from '../screens/community/CommunityScreen';
import PostDetailScreen from '../screens/community/PostDetailScreen';

export type CommunityStackParamList = {
  Community: undefined;
  PostDetail: { postId: string };
};

const Stack = createNativeStackNavigator<CommunityStackParamList>();

const CommunityStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Community" component={CommunityScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    </Stack.Navigator>
  );
};

export default CommunityStack;