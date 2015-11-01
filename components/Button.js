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
    text: React.PropTypes.string,
    wrapperStyle: React.PropTypes.array,
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
      style,
      text,
      wrapperStyle,
    } = this.props;

    return (
      <TouchableHighlight
        onPress={onPress}
        underlayColor='transparent'
        style={wrapperStyle}
        activeOpacity={0.5}
      >
        <View style={[styles.button, { backgroundColor: color }, this.props.style]}>
          <AppText style={styles.buttonText}>{text}</AppText>
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
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff'
  },

  toggleButtons: {
    flexDirection: 'row',
    justifyContent: 'center'
  }

});

module.exports = Button;