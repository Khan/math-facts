'use strict';

import _ from 'underscore';

import React from 'react-native';
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText.ios';

var NumPadButton = React.createClass({
  render: function() {
    return (
      <TouchableHighlight
          key={'numpad-' + this.props.key}
          style={styles.button}
          onPress={this.props.onPress}
          delayPressIn={0}
          underlayColor='transparent'
          activeOpacity={0.2}>
        <View>
          <AppText style={
            [styles.buttonText, this.props.control && styles.controlButtonText]
          }>
            {this.props.content}
          </AppText>
        </View>
      </TouchableHighlight>
    );
  }
});

var NumPad = React.createClass({

  render: function() {

    var buttons = _.map(_.range(1, 10), (value, index) => {
      return (
        <NumPadButton
          onPress={() => {this.props.addDigit(value)}}
          content={value}
          key={value}/>
      );
    });

    buttons.push(
      <NumPadButton
        onPress={this.props.clear}
        content='CLEAR'
        key='clear'
        control={true} />
    );
    buttons.push(
      <NumPadButton
        onPress={() => {this.props.addDigit(0)}}
        content='0'
        key='0'/>
    );

    // TODO: Implement hints for multiplication
    if (this.props.operation === 'addition') {
      buttons.push(
        <NumPadButton onPress={this.props.hint} content='?' key='hint'/>
      );
    } else {
      buttons.push(
        <NumPadButton onPress={null} content=' ' key='blank'/>
      );
    }

    return (
      <View style={styles.buttons}>
        <View style={styles.buttonRow}>
          {buttons.slice(0, 3)}
        </View>
        <View style={styles.buttonRow}>
          {buttons.slice(3, 6)}
        </View>
        <View style={styles.buttonRow}>
          {buttons.slice(6, 9)}
        </View>
        <View style={styles.buttonRow}>
          {buttons.slice(9, 12)}
        </View>
      </View>
    );
  },
});


var styles = StyleSheet.create({
  buttons: {
    flex: 0,
    alignSelf: 'stretch',
    margin: 2,
    marginTop: 2
  },
  buttonRow: {
    flexDirection: 'row',
    flex: 1,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'column',
    height: 60,
    flex: 1,
    justifyContent: 'center',
    margin: 2
  },
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff'
  },

  controlButtonText: {
    fontSize: 15,
  }
});

module.exports = NumPad;