import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import { colors } from './Colors'

const dimensions = require('Dimensions').get('window');
const cardWidth = 2.5 * (dimensions.width / 3)



  export default class CancelButton extends React.Component {
    confirmCancelMeal() {
        Alert.alert(
          'Confirm Cancelation',
          'Are you sure you would like to cancel your meal?',
          [
            {text: 'Yes', onPress: () => this.cancelMeal()},
            {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          ],
          { cancelable: false }
        )
      }
      async cancelMeal() {
        let current_user_id = await AsyncStorage.getItem("current_user_id", "")
        let current_friend_id =  await AsyncStorage.getItem('current_friend_id', ""); 
        console.log(current_user_id)
        console.log("Trying to cancel meal")
        fetch(`${serverURL}/cancelmeal`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({currentUserId: current_user_id, currentFriendId: current_friend_id })
        }).then((resp) => {
          console.log("Meal is canceled")
          this.props.navigation.navigate({
            routeName: 'Home',
            params: {},
            key: 'Home' + current_user_id
        })
        }).catch(error => {
          console.log("error cancelling meal")
          console.log(error)
        })
    }
    render() {
      return (
        <View>
        <TouchableOpacity
            style={styles.button}
            onPress={() => {this.confirmCancelMeal()}}
            underlayColor='#fff'>
              <Text style={styles.buttonText}>Cancel your meal</Text>
          </TouchableOpacity>
      </View>
      )
    }
}


const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    shadowOffset: {  width: 5,  height: 5 },
    shadowColor: colors.shadow,
    shadowOpacity: .5,
    alignItems: "center",
    backgroundColor: colors.white,
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  text : {
    color: colors.black,
    fontSize: 30,
  },
  subtext : {
    color: colors.grey,
    fontSize: 20
  },
  button: {
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor: colors.gold,
    borderRadius:10,
  },
  buttonText:{
      color: colors.black,
      fontSize: 18,
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10
  }
});