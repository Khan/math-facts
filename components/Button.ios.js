'use strict';

import React from 'react-native';
const {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
} = React;

import { AppText, AppTextBold, AppTextThin } from './AppText.ios';

const Button = React.createClass({
  propTypes: {
    color: React.PropTypes.string,
    onPress: React.PropTypes.func.isRequired,
    small: React.PropTypes.bool,
    style: React.PropTypes.style,
    text: React.PropTypes.string,
    wrapperStyle: React.PropTypes.style,
  },
  getDefaultProps: function() {
    return {
      color: '#29abca',
      style: null,
      wrapperStyle: null,
    };
  },
  render: function() {
    const {
      color,
      onPress,
      small,
      style,
      text,
      wrapperStyle,
    } = this.props;

    const buttonTextStyle = [styles.buttonText, small && styles.buttonTextSmall];

    return (
      <TouchableHighlight
        onPress={onPress}
        underlayColor='transparent'
        style={wrapperStyle}
        activeOpacity={0.5}
      >
        <View style={[styles.button, { backgroundColor: color }, this.props.style]}>
          <AppText style={buttonTextStyle}>{text}</AppText>
        </View>
      </TouchableHighlight>
    );
  }
});

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#89dacc',
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 30,
    color: '#fff'
  },
  buttonTextSmall: {
    fontSize: 16,
  },

  toggleButtons: {
    flexDirection: 'row',
    justifyContent: 'center'
  }

});

module.exports = Button;