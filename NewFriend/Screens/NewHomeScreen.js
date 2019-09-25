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
import GenericCard from "../Components/GenericCard";
import Header from "../Components/Header";

const backgroundImageSmaller = require("../assets/gradient_background_smaller.png");

export default class NewHomeScreen extends React.Component {
  constructor(props) {
    super();
    this.onClick = this.onClick.bind(this);
    this.state = {
      isLoading: true,
      showRemindButton: false,
      friendFoundScreen: false,
      waitingScreen: false
    };
  }

  componentWillMount() {}

  onClick(restaurantName) {
    this.props.navigation.navigate("Waiting", {});
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

  render() {
    let actionText = "Choose a Diner";
    return (
      <View>
        <Header actionText={actionText} />
        <View style={{ alignItems: "center" }}>
          <Text
            style={styles.blacktext}
            resizeMethod={"scale"}
            resizeMode="contain"
          >
            {actionText}
          </Text>
          {this.renderRestaurantCards()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "#ffffff",
    fontSize: 32
  },
  blacktext: {
    color: colors.black,
    fontSize: 32
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
