import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from "react-native";
import { createStackNavigator } from "react-navigation";
import { colors } from "../Components/Colors";
import SubmissionModal from "../Components/Modals/SubmissionModal";
import Modal from "react-native-modal";
import firebase from "react-native-firebase";
import serverURL from "../serverURL";

const dimensions = require("Dimensions").get("window");
const inputWidth = 2.5 * (dimensions.width / 3);

export default class FormScreen extends React.Component {
  constructor(props) {
    super(props);
    this.navigateHome = this.navigateHome.bind(this);
    const restaurantName = this.props.navigation.getParam("restaurantName", "");

    this.state = {
      name: "",
      timestamp: null,
      location: "",
      identification: "",
      FCMToken: "",
      restaurantName: restaurantName,
      showConfirmationModal: false
    };
  }
  renderSubmissionModal() {
    return (
      <Modal
        isVisible={this.state.showConfirmationModal}
        backdropOpacity={1}
        backdropColor={colors.white}
      >
        <SubmissionModal handleClick={this.navigateHome} />
      </Modal>
    );
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
  navigateHome() {
    this.props.navigation.navigate("Home", { waitingScreen: true });
  }
  async checkForFriends(current_user_id) {
    console.log("In Get Request");
    fetch(`${serverURL}/getfriend/${current_user_id}`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(async responseJson => {
        console.log(responseJson._id);
        console.log("Friend found");
        const new_friend_id = responseJson._id;
        await AsyncStorage.setItem("current_friend_id", new_friend_id);
        this.props.navigation.navigate("FindFriend", { friend: responseJson });
      })
      .catch(err => {
        console.log(err);
        console.log("Error getting friend");
        this.setState({ showConfirmationModal: true });
      });
  }
  async sendRequest() {
    if (this.state.name === "" || this.state.identification === "") {
      Alert.alert(
        "Try Again",
        "Your name or identification was empty.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } else {
      let fcmToken = await AsyncStorage.getItem("FCMToken");
      if (fcmToken != null) {
        this.setState({ FCMToken: fcmToken });
      }
      this.setState({ timestamp: Date.now() });
      var friendString = JSON.stringify(this.state);
      fetch(`${serverURL}/newfriend`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: friendString
      })
        .then(async resp => {
          const current_user_id = resp._bodyText;
          await AsyncStorage.setItem("current_user_id", current_user_id);
          this.checkForFriends(current_user_id);
        })
        .catch(error => {
          console.log("Error Saving");
          console.log(error);
        });
    }
  }
  renderForm() {
    const { name, identification } = this.state;
    return (
      <View style={styles.container}>
        {this.renderSubmissionModal()}
        <View style={styles.view}>
          <Text style={styles.text}>What's your name?</Text>
          <TextInput
            style={{
              height: 40,
              width: inputWidth,
              borderBottomColor: colors.red,
              borderBottomWidth: 1,
              color: colors.black
            }}
            onChangeText={text => this.setState({ name: text })}
            value={name}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.view}>
          <Text style={styles.text}>What are you wearing?</Text>
          <Text>(to help your new friend find you!)</Text>
          <TextInput
            style={{
              height: 40,
              width: inputWidth,
              borderBottomColor: colors.red,
              borderBottomWidth: 1,
              color: colors.black
            }}
            onChangeText={text => this.setState({ identification: text })}
            value={identification}
            underlineColorAndroid="transparent"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.sendRequest();
          }}
          underlayColor="#fff"
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    return this.renderForm();
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
    fontSize: 26
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
  }
});
