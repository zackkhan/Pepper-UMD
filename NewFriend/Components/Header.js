import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground} from 'react-native';
import { colors } from './Colors'
import Emoji from 'react-native-emoji';

const dimensions = require('Dimensions').get('window');
const cardWidth = 2.5 * (dimensions.width / 3)
const height = 0.2 * dimensions.height;
const backgroundImage = require("../assets/diagonal.png")
const backgroundImageSmaller = require("../assets/gradient_background_smaller.png")

  export default class GenericCard extends React.Component {
    render() {
      const actionText = this.props.actionText;
      return (
        <ImageBackground source={backgroundImage} style={{height: height, alignItems: 'center'}}>
          <Text style = {styles.text} resizeMethod = {'scale'} resizeMode ='contain' >Share a 🌶 meal with a friend!</Text>
          <View style={{flexDirection: 'row'}}>
            <Emoji name="smiley" style={{fontSize: 55}} />
            <Emoji name="hamburger" style={{fontSize: 50}} />
            <Emoji name="yum" style={{fontSize: 55}} />
          </View>
        </ImageBackground>
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
  text: {
    color: "#ffffff",
    fontSize: 32,
  }, 
  blacktext: {
    color: colors.black,
    fontSize: 32,
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