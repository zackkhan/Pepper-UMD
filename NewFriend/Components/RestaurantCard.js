import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import FormScreen from "../Screens/FormScreen"
import { colors } from './Colors'

const dimensions = require('Dimensions').get('window');
const cardWidth = 2.5 * (dimensions.width / 3)

  export default class RestaurantCard extends React.Component {
    constructor(props){
      super()
      this.state = {visible: false}
    }
    
    renderFormModal(){
      return (
        <Modal isVisible = {this.state.visible}>
          <FormScreen/>
        </Modal>
      )
    }

    render() {
      const {name} = this.props
      return (
        <View style = {styles.card}>
          <Text style = {styles.text}>{name}</Text>
          <Text style = {styles.subtext}>A new friend is waiting!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {this.props.onClick(name)}}
            underlayColor='#fff'>
              <Text style={styles.buttonText}>Find a Friend</Text>
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