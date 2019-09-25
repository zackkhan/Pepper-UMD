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
import { createStackNavigator } from "react-navigation";
import RestaurantCard from "../Components/RestaurantCard";
import firebase from "react-native-firebase";
import Emoji from "react-native-emoji";
import { colors } from "../Components/Colors";
import serverURL from "../serverURL";

const channelId = "meal-push-notifications";
const channelName = "Meal Announcements";
const backgroundImage = require("../assets/homepage_background.png");
const backgroundImageSmaller = require("../assets/gradient_background_smaller.png");
const foodGraphic = require("../assets/food_graphic.png");
const cancelationTitle = "Unfortunately, your friend had to go!";

export default class QuestionScreen extends React.Component {
  constructor(props) {
    super();
    this.onClick = this.onClick.bind(this);
  }

  onClick(restaurantName) {
    this.props.navigation.navigate("Form", { restaurantName: restaurantName });
  }

  async cancelMeal() {
    let current_user_id = await AsyncStorage.getItem("current_user_id", "");
    let current_friend_id = await AsyncStorage.getItem("current_friend_id", "");
    console.log(current_user_id);
    console.log("Trying to cancel meal");
    fetch(`${serverURL}/cancelmeal`, {
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
        console.log("Meal is canceled");
        this.props.navigation.navigate({
          routeName: "Home",
          params: {},
          key: "Home" + current_user_id
        });
      })
      .catch(error => {
        console.log("error cancelling meal");
        console.log(error);
      });
  }

  confirmCancelMeal() {
    Alert.alert(
      "Confirm Cancelation",
      "Are you sure you would like to cancel your meal?",
      [
        { text: "Yes", onPress: () => this.cancelMeal() },
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  renderRestaurantCards() {
    return (
      <ScrollView>
        <View style={styles.view}>
          <RestaurantCard
            name="South Campus Diner"
            onClick={this.onClick}
          ></RestaurantCard>
        </View>
        <View style={styles.view}>
          <RestaurantCard
            name="North Campus Diner"
            onClick={this.onClick}
          ></RestaurantCard>
        </View>
        <View style={styles.view}>
          <RestaurantCard
            name="251 Diner"
            onClick={this.onClick}
          ></RestaurantCard>
        </View>
      </ScrollView>
    );
  }

  renderCancelButton() {
    return (
      <View>
        <Text style={styles.blacktext}>Need to Leave?</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.confirmCancelMeal();
          }}
          underlayColor="#fff"
        >
          <Text style={styles.buttonText}>Cancel your meal</Text>
        </TouchableOpacity>
      </View>
    );
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
        {this.renderCancelButton()}
      </React.Fragment>
    );
  }

  renderFriendCard() {
    const friend = this.props.navigation.getParam("friend", null);
    const { name, identification, location } = friend;
    return (
      <React.Fragment>
        <Emoji name="smiley" style={{ fontSize: 55 }} />
        <Text style={styles.blacktext}> Meet your friend {name}!</Text>
        <Text style={styles.blacktext}>
          <Text style={styles.goldText}>{name}</Text> is wearing{" "}
          {identification}
        </Text>
        <Text style={styles.blacktext}>
          Meet {name} at the <Text style={styles.goldText}>{location}</Text>!
        </Text>
        {this.renderCancelButton()}
      </React.Fragment>
    );
  }

  render() {
    // this.configureNotificationSettings();
    let actionText = "Choose a Diner";
    const waitingScreen = this.props.navigation.getParam(
      "waitingScreen",
      false
    );
    const friendFoundScreen = this.props.navigation.getParam(
      "friendFoundScreen",
      false
    );
    if (waitingScreen) {
      actionText = "Waiting to find a friend";
    } else if (friendFoundScreen) {
      actionText = "Meet your friend!";
    }
    return (
      <ImageBackground
        source={backgroundImageSmaller}
        style={{ width: "100%", height: "100%", alignItems: "center" }}
      >
        <Text style={styles.text} resizeMethod={"scale"} resizeMode="contain">
          Share a meal with a friend!
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Emoji name="smiley" style={{ fontSize: 55 }} />
          <Emoji name="hamburger" style={{ fontSize: 50 }} />
          <Emoji name="yum" style={{ fontSize: 55 }} />
        </View>
        <View style={{ margin: 5 }}>
          <Text style={styles.text} resizeMethod={"scale"} resizeMode="contain">
            {actionText}
          </Text>
        </View>

        {waitingScreen && this.renderWaitingScreen()}
        {!waitingScreen && !friendFoundScreen && this.renderRestaurantCards()}
        {!waitingScreen && friendFoundScreen && this.renderFriendCard()}
      </ImageBackground>
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
    color: "#ffffff",
    fontSize: 32
  },
  blacktext: {
    color: colors.black,
    fontSize: 24
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
