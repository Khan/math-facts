'use strict';

import React from 'react-native';
const {
  StyleSheet,
  Text,
  View,
} = React;

import { AppText, AppTextBold } from './AppText';
import MyTouchableHighlight from '../core-components/touchable-highlight';

const Button = React.createClass({
  propTypes: {
    color: React.PropTypes.string,
    onPress: React.PropTypes.func.isRequired,
    style: View.propTypes.style,
    styleText: Text.propTypes.style,
    text: React.PropTypes.string,
  },
  render: function() {
    const {
      borderColor,
      color,
      onPress,
      style,
      styleText,
      text,
    } = this.props;

    return (
      <MyTouchableHighlight
        onPress={onPress}
        underlayColor='transparent'
        style={styles.wrapperStyle}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.button,
            style,
          ]}
        >
          <AppText
            style={[
              styles.buttonText,
              styleText,
            ]}
          >
            {text}
          </AppText>
        </View>
      </MyTouchableHighlight>
    );
  }
});

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
  },
  wrapperStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff'
  },
});

module.exports = Button;