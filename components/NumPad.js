'use strict';

import _ from 'underscore';

import React from 'react-native';
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

import { AppText, AppTextBold } from './AppText';
import Keyboard from './Keyboard';

const NumPadButton = React.createClass({
  propTypes: {
    content: React.PropTypes.string.isRequired,
    control: React.PropTypes.bool,
    onPress: React.PropTypes.func.isRequired,
  },
  render: function() {
    return (
      <View style={styles.buttonWrapper}>
        <Keyboard.Key
            style={[
              styles.button,
              this.props.control && styles.controlButton,
            ]}
            highlightStyle={styles.highlightedButton}
            onPress={this.props.onPress}>
          <View>
            <AppText
              style={[
                styles.buttonText,
                this.props.control && styles.controlButtonText,
              ]}
            >
              {this.props.content}
            </AppText>
          </View>
        </Keyboard.Key>
      </View>
    );
  }
});

const NumPad = React.createClass({
  propTypes: {
    addDigit: React.PropTypes.func.isRequired,
    clear: React.PropTypes.func.isRequired,
    hint: React.PropTypes.func.isRequired,
  },

  render: function() {

    const buttons = _.map(_.range(1, 10), (value, index) => {
      return (
        <NumPadButton
          onPress={() => {this.props.addDigit(value)}}
          content={value.toString()}
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
  buttonWrapper: {
    flex: 1,
    // This is a hack to make them all have the same flexBasis because of the
    // different implementation in react-native-web (and flexBasis isn't
    // supported by React Native)
    width: 0,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'column',
    flex: 1,
    height: 60,
    justifyContent: 'center',
    margin: 2,
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
