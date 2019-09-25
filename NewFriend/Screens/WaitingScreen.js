import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Alert,
  Button,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  ScrollView
} from "react-native";
import RestaurantCard from "../Components/RestaurantCard";
import { colors } from "../Components/Colors";
import serverURL from "../serverURL";
import Header from "../Components/Header";
import CancelButton from "../Components/CancelButton";

export default class WaitingScreen extends React.Component {
  onClick(restaurantName) {
    this.props.navigation.navigate("Form", { restaurantName: restaurantName });
  }

  renderWaitingScreen() {
    return (
      <React.Fragment>
        <View style={{ margin: 30, marginTop: 120 }}>
          <Text style={styles.blacktext}>
            Feel free to close the app, you will be notified if a friend is
            available{" "}
          </Text>
        </View>
        <View style={styles.view}>
          <ActivityIndicator size="large" color={colors.red} />
        </View>
        <CancelButton />
      </React.Fragment>
    );
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [
        {
          text: "OK",
          onPress: () => {
            console.log("OK HIT");
          }
        }
      ],
      { cancelable: false }
    );
  }

  async sendReminder() {
    let current_user_id = await AsyncStorage.getItem("current_user_id", "");
    let current_friend_id = await AsyncStorage.getItem("current_friend_id", "");
    fetch(`${serverURL}/sendReminder`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        currentUserId: current_user_id,
        currentFriendId: current_friend_id
      })
    })
      .then(resp => {
        // show alert to user
        showAlert(
          "Reminder Sent",
          "If they do not respond in 5 minutes, we will match you with a new friend"
        );
      })
      .catch(error => {
        console.log("error sending notification");
        console.log(error);
      });
  }

  render() {
    // this.configureNotificationSettings();
    let actionText = "Waiting to Find a Friend!";
    return (
      <View>
        <Header />
        <View style={{ margin: 5, alignItems: "center" }}>
          <Text style={styles.text} resizeMethod={"scale"} resizeMode="contain">
            {actionText}
          </Text>
        </View>
        {this.renderWaitingScreen()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: colors.black,
    fontSize: 32
  },
  blacktext: {
    color: colors.black,
    fontSize: 24
  },
  questiontext: {
    color: colors.black,
    fontSize: 20
  },
  greytext: {
    color: colors.grey,
    fontSize: 18
  },
  foodGraphic: {},
  view: {
    margin: 10
  },
  button: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.red,
    borderRadius: 10
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10
  },
  goldText: {
    color: colors.gold,
    fontSize: 26
  }
});
