'use strict';

import _ from 'underscore';

import React from 'react-native';
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText';
import Keyboard from './Keyboard.js';

const NumPadButton = React.createClass({
  render: function() {
    return (
      <Keyboard.Key
          style={styles.button}
          highlightStyle={styles.highlightedButton}
          onPress={this.props.onPress}>
        <View>
          <AppText style={
            [styles.buttonText, this.props.control && styles.controlButtonText]
          }>
            {this.props.content}
          </AppText>
        </View>
      </Keyboard.Key>
    );
  }
});

const NumPad = React.createClass({

  render: function() {

    const buttons = _.map(_.range(1, 10), (value, index) => {
      return (
        <NumPadButton
          onPress={() => {this.props.addDigit(value)}}
          content={value}
          key={value}/>
      );
    });

    buttons.push(
      <NumPadButton
        onPress={this.props.hint}
        content='HELP'
        key='help'
        control={true} />
    );

    buttons.push(
      <NumPadButton
        onPress={() => {this.props.addDigit(0)}}
        content='0'
        key='0'/>
    );

    buttons.push(
      <NumPadButton
        onPress={this.props.clear}
        content='CLEAR'
        key='clear'
        control={true} />
    );

    return (
      <Keyboard>
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
      </Keyboard>
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
  highlightedButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
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
