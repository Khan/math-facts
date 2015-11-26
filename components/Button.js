'use strict';

import React from 'react-native';
const {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText';

const Button = React.createClass({
  propTypes: {
    color: React.PropTypes.string,
    onPress: React.PropTypes.func.isRequired,
    style: React.PropTypes.array,
    styleText: React.PropTypes.arrayText,
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
      <TouchableHighlight
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
      </TouchableHighlight>
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