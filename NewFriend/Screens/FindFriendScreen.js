import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// var backgroundImage = require("../assets/gradient_background.png")
import { colors } from "../Components/Colors";
import firebase from "react-native-firebase";
import Emoji from "react-native-emoji";

export default class FindFriend extends React.Component {
  constructor(props) {
    super();
  }
  listenForNotification() {
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification: Notification) => {
        console.log("notification received", notification);
        notification.android.setChannelId(channelId);
        firebase.notifications().displayNotification(notification);
      });
  }
  render() {
    const friend = this.props.navigation.getParam("friend", null);
    if (friend == null) {
      return (
        <View style={styles.view}>
          <Text style={styles.headerText}>
            Something went wrong! Please restart the app
          </Text>
        </View>
      );
    } else {
      const { name, identification, location } = friend;
      const lowercase_identification = identification.toLowerCase();

      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            backgroundColor: colors.red
          }}
        >
          <View style={{ margin: 20 }}>
            <Emoji name="horse" style={{ fontSize: 70 }} />
          </View>
          <Text style={styles.headerText}>Friend Found!</Text>
          <View style={styles.view}>
            <Text style={styles.text}>
              <Text style={styles.goldText}>{name}</Text> is wearing{" "}
              {lowercase_identification}
            </Text>
            <Text style={styles.text}>
              Meet {name} at the <Text style={styles.goldText}>{location}</Text>
              !
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate({
                routeName: "Home",
                params: { friendFoundScreen: true, friend: friend },
                key: "Home" + friend.name + " " + friend.identification
              });
            }}
            underlayColor="#fff"
          >
            <Text style={styles.buttonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      );
    }
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
    color: colors.white,
    fontSize: 26
  },
  goldText: {
    color: colors.gold,
    fontSize: 26
  },
  headerText: {
    color: colors.gold,
    fontSize: 32
  },
  foodGraphic: {},
  view: {
    margin: 25
  },
  button: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.gold,
    borderRadius: 10
  },
  buttonText: {
    color: colors.black,
    fontSize: 26,
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10
  }
});
