import React, { Component } from "react";
import { AsyncStorage, View, Text, Alert } from "react-native";
import firebase from "react-native-firebase";
import { YellowBox } from "react-native";
import { createStackNavigator } from "react-navigation";

import FormScreen from "./Screens/FormScreen";
import FindFriendScreen from "./Screens/FindFriendScreen";
import NavigationService from "./NavigationService";
import NewHomeScreen from "./Screens/NewHomeScreen";
import WaitingScreen from "./Screens/WaitingScreen";
const cancelationTitle = "Unfortunately, your friend had to go!";

YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader"
]);

var waitingScreen = false,
  friendFoundScreen = false;

const AppNavigator = createStackNavigator({
  Home: {
    screen: NewHomeScreen,
    initialRouteParams: {
      waitingScreen: waitingScreen,
      friendFoundScreen: friendFoundScreen
    }
  },
  Form: { screen: FormScreen },
  Waiting: { screen: WaitingScreen },
  FindFriend: { screen: FindFriendScreen }
});

export default class App extends Component {
  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
  }

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }

  //3
  // make sure you grab the latest token!
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("FCMToken");
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem("FCMToken", fcmToken);
      }
    }
  }

  showCancelationAlert(title, body) {
    Alert.alert(
      title,
      body,
      [
        {
          text: "OK",
          onPress: () => {
            console.log("Ok Pressed");
            NavigationService.navigate("Home", { waitingScreen: true });
          }
        }
      ],
      { cancelable: false }
    );
  }

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification(async notification => {
        console.log("In App Notification");
        const { title, body, data } = notification;
        if (title != cancelationTitle) {
          await AsyncStorage.setItem("current_friend_id", data.id);
          NavigationService.navigate("FindFriend", { friend: data });
        } else {
          this.showCancelationAlert(title, body);
        }
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(async notificationOpen => {
        const { title, body, data } = notificationOpen.notification;
        console.log("Back APP NOTIF");
        if (title != cancelationTitle) {
          await AsyncStorage.setItem("current_friend_id", data.id);
          NavigationService.navigate("FindFriend", { friend: data });
        } else {
          this.showCancelationAlert(title, body);
        }
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      console.log("Back App Notification");
      const { title, body, data } = notificationOpen.notification;
      if (title != cancelationTitle) {
        await AsyncStorage.setItem("current_friend_id", data.id);
        NavigationService.navigate("FindFriend", { friend: data });
      } else {
        this.showCancelationAlert(title, body);
      }
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  render() {
    return (
      <AppNavigator
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
