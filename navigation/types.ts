import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type MainStackParamList = {
  Main: undefined;
  Help: undefined;
  UserInfo: undefined;
  Splash: undefined;
};
export type MainStackNavProps<T extends keyof MainStackParamList> = {
  navigation: StackNavigationProp<MainStackParamList, T>;
  route: RouteProp<MainStackParamList, T>;
};
