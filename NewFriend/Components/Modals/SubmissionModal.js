import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Button} from 'react-native';
import Modal from "react-native-modal";
import { colors } from '../Colors'
import Emoji from 'react-native-emoji';

export default class SubmissionModal extends React.Component {
    render() {
        // const { visible } = this.props.visible
        return (
            // <Modal isVisible = {visible}>
            <View style = {styles.container}>
                <Emoji name="+1" style={{fontSize: 70}} />
                <Text style = {styles.text}>Sent! You will receive a notification if someone is available to share a meal</Text>
                <Button title = "Back to Home"
                    buttonStyle = {styles.button}
                    onPress = {() => {this.props.handleClick()}}
                />
            </View>
            // </Modal>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        color: colors.red,
        fontSize: 30
    },
    button: {
      color: colors.red,
      backgroundColor: colors.red
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: colors.white
      },
  });