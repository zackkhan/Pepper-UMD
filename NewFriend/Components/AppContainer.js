import React from 'react';
import {
  createStackNavigator,
} from 'react-navigation';

import { YellowBox } from 'react-native';
import HomeScreen from "./Screens/HomeScreen"
import FormScreen from "./Screens/FormScreen"
import FindFriendScreen from "./Screens/FindFriendScreen"

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

const App = createStackNavigator({
  Home: { screen: HomeScreen },
  Form: { screen: FormScreen },
  FindFriend: { screen: FindFriendScreen }
});

export default App;

